import { GAME_STEPS, STEP_ROUTES } from "./game-data.js";
import { loadState, resetState, saveState } from "./storage.js";
import { isStepAnswerCorrect } from "./utils.js";
import {
  buildSummaryText,
  renderFinalScreen,
  renderMissionScreen,
  renderStatusPanel,
  renderStepScreen,
  renderWelcomeScreen
} from "./ui.js";

const mainNode = document.getElementById("main-content");
const statusNode = document.getElementById("status-panel");
const toastStackNode = document.getElementById("toast-stack");

const runtime = {
  feedback: "",
  feedbackType: "error"
};

const stepById = new Map(GAME_STEPS.map((step) => [step.id, step]));
const defaultRouteIds = GAME_STEPS.map((step) => step.id);

let state = loadState();
let timerInterval = null;
const TOAST_DURATION_MS = 2600;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function showToast(message, type = "success") {
  if (!toastStackNode || !message) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastStackNode.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("visible");
  });

  window.setTimeout(() => {
    toast.classList.remove("visible");
    window.setTimeout(() => {
      toast.remove();
    }, 180);
  }, TOAST_DURATION_MS);
}

function normalizeRouteIds(routeIds) {
  if (!Array.isArray(routeIds)) {
    return [...defaultRouteIds];
  }

  const ids = routeIds.filter((item) => typeof item === "string");
  if (ids.length !== defaultRouteIds.length) {
    return [...defaultRouteIds];
  }

  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== defaultRouteIds.length) {
    return [...defaultRouteIds];
  }

  for (const id of ids) {
    if (!stepById.has(id)) {
      return [...defaultRouteIds];
    }
  }

  return ids;
}

function getOrderedSteps() {
  const routeIds = normalizeRouteIds(state.routeStepIds);
  return routeIds.map((id) => stepById.get(id)).filter(Boolean);
}

function hashTeamName(teamName) {
  let hash = 0;
  for (const char of teamName) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function assignRouteForTeam(teamName) {
  const hash = hashTeamName(teamName);
  const route = STEP_ROUTES[hash % STEP_ROUTES.length] || STEP_ROUTES[0];
  state.routeId = route.id;
  state.routeStepIds = [...route.stepIds];
}

function ensureRouteAssigned() {
  if (!state.teamName) {
    return false;
  }

  const normalized = normalizeRouteIds(state.routeStepIds);
  const hasSameRoute =
    Array.isArray(state.routeStepIds) &&
    normalized.length === state.routeStepIds.length &&
    normalized.every((id, index) => id === state.routeStepIds[index]);

  if (hasSameRoute && state.routeId) {
    return false;
  }

  assignRouteForTeam(state.teamName);
  return true;
}

function persistAndRender() {
  const previousScrollY = window.scrollY;
  saveState(state);
  renderApp();
  window.scrollTo({ top: previousScrollY, left: 0, behavior: "auto" });
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = window.setInterval(() => {
    renderStatusPanel(state, statusNode);
  }, 1000);
}

function getCurrentStep() {
  const orderedSteps = getOrderedSteps();
  return orderedSteps[state.currentStepIndex] || null;
}

function markStepSolved(step) {
  // Évite les doublons si la page est rechargée après validation.
  if (!state.completedStepIds.includes(step.id)) {
    state.completedStepIds.push(step.id);
    state.validations.push({
      stepId: step.id,
      code: step.whatsappCode,
      solvedAt: Date.now()
    });
  }
}

function isStepPrecheckPassed(step) {
  if (!step || !step.precheckType) {
    return true;
  }
  return Boolean(state.precheckByStep?.[step.id]);
}

function goToNextStep() {
  const orderedSteps = getOrderedSteps();
  const atLastStep = state.currentStepIndex >= orderedSteps.length - 1;
  if (atLastStep) {
    if (!state.finishedAt) {
      state.finishedAt = Date.now();
    }
    persistAndRender();
    return;
  }

  state.currentStepIndex += 1;
  runtime.feedback = "";
  runtime.feedbackType = "error";
  persistAndRender();
}

function handleTeamSubmit(formEvent) {
  formEvent.preventDefault();
  const formData = new FormData(formEvent.target);
  const teamName = String(formData.get("teamName") || "").trim();

  if (!teamName) {
    return;
  }

  state.teamName = teamName;
  state.startedAt = Date.now();
  state.finishedAt = null;
  state.missionAccepted = false;
  state.currentStepIndex = 0;
  state.completedStepIds = [];
  state.attemptsByStep = {};
  state.precheckByStep = {};
  state.hintsUsedByStep = {};
  state.validations = [];
  assignRouteForTeam(teamName);
  runtime.feedback = "";

  persistAndRender();
}

async function handlePrecheckSubmit(formEvent) {
  formEvent.preventDefault();
  const currentStep = getCurrentStep();
  if (!currentStep || !currentStep.precheckType) {
    return;
  }

  const formData = new FormData(formEvent.target);
  let allCorrect = false;

  if (currentStep.precheckType === "sort-filieres") {
    const expectedBySlot = currentStep.sortExpectedBySlot || {};
    const sortItems = Array.isArray(currentStep.sortItems) ? currentStep.sortItems : [];
    allCorrect = sortItems.every((item) => {
      const slot = String(item.slot || "");
      const expected = String(expectedBySlot[slot] || "");
      const given = String(formData.get(`precheck-${slot}`) || "");
      return expected && given === expected;
    });
  }

  if (currentStep.precheckType === "ecg-poles") {
    const expectedByPole = currentStep.expectedYesNoByPole || {};
    const poleRows = Array.isArray(currentStep.poleRows) ? currentStep.poleRows : [];
    allCorrect = poleRows.every((row) => {
      const poleId = String(row.id || "");
      const expected = String(expectedByPole[poleId] || "");
      const given = String(formData.get(`precheck-${poleId}`) || "");
      return expected && given === expected;
    });
  }

  if (currentStep.precheckType === "rank-order") {
    const expectedRankByItem = currentStep.expectedRankByItem || {};
    const rankItems = Array.isArray(currentStep.rankItems) ? currentStep.rankItems : [];
    allCorrect = rankItems.every((item) => {
      const itemId = String(item.id || "");
      const expected = String(expectedRankByItem[itemId] || "");
      const given = String(formData.get(`precheck-rank-${itemId}`) || "");
      return expected && given === expected;
    });
  }

  if (currentStep.precheckType === "omega-decision") {
    const expected = currentStep.expectedDecision || {};
    const finalDecision = String(formData.get("precheck-final-decision") || "");
    const inscriptionType = String(formData.get("precheck-inscription-type") || "");
    allCorrect =
      finalDecision === String(expected.finalDecision || "") &&
      inscriptionType === String(expected.inscriptionType || "");
  }

  if (currentStep.precheckType === "gamma-total") {
    const expectedTotal = String(currentStep.expectedTotal || "");
    const givenTotal = String(formData.get("precheck-gamma-total") || "").trim();
    allCorrect = expectedTotal !== "" && givenTotal === expectedTotal;
  }

  if (
    !allCorrect &&
    currentStep.precheckType !== "sort-filieres" &&
    currentStep.precheckType !== "ecg-poles" &&
    currentStep.precheckType !== "rank-order" &&
    currentStep.precheckType !== "omega-decision" &&
    currentStep.precheckType !== "gamma-total"
  ) {
    return;
  }

  const successMessage =
    currentStep.precheckSuccessMessage || "Validation intermediaire reussie. Vous pouvez passer a la phase suivante.";
  const errorMessage =
    currentStep.precheckErrorMessage || "Verification incorrecte. Revoyez les elements et retentez.";

  if (allCorrect) {
    await wait(140);
    state.precheckByStep[currentStep.id] = true;
    runtime.feedback = successMessage;
    runtime.feedbackType = "success";
    showToast(successMessage, "success");
  } else {
    await wait(140);
    runtime.feedback = errorMessage;
    runtime.feedbackType = "error";
    showToast(errorMessage, "error");
  }

  persistAndRender();
}

async function handleAnswerSubmit(formEvent) {
  formEvent.preventDefault();
  const currentStep = getCurrentStep();
  if (!currentStep) {
    return;
  }

  if (!isStepPrecheckPassed(currentStep)) {
    runtime.feedback = "Validez d'abord la phase 1 avant de saisir le code du PDF.";
    runtime.feedbackType = "error";
    showToast("Validez d'abord la phase 1.", "error");
    const previousScrollY = window.scrollY;
    renderApp();
    window.scrollTo({ top: previousScrollY, left: 0, behavior: "auto" });
    return;
  }

  const formData = new FormData(formEvent.target);
  const answer = String(formData.get("answer") || "");

  state.attemptsByStep[currentStep.id] = (state.attemptsByStep[currentStep.id] || 0) + 1;

  await wait(160);
  if (isStepAnswerCorrect(currentStep, answer)) {
    markStepSolved(currentStep);
    runtime.feedback = "Réponse correcte. Fragment déverrouillé.";
    runtime.feedbackType = "success";
    showToast("Réponse correcte.", "success");
  } else {
    runtime.feedback = "Réponse incorrecte. Vérifiez la règle pédagogique et retentez.";
    runtime.feedbackType = "error";
    showToast("Réponse incorrecte, retentez.", "error");
  }

  persistAndRender();
}

async function copyFinalSummary() {
  // Copie rapide pour envoi WhatsApp ; sinon capture écran si refus navigateur.
  const summary = buildSummaryText(state);
  try {
    await navigator.clipboard.writeText(summary);
    runtime.feedback = "Récapitulatif copié dans le presse-papiers.";
    runtime.feedbackType = "success";
    showToast("Récapitulatif copié.", "success");
  } catch (_error) {
    runtime.feedback = "Copie auto indisponible. Faites une capture d'écran du récapitulatif.";
    runtime.feedbackType = "error";
    showToast("Copie automatique indisponible.", "error");
  }

  renderApp();
}

function renderApp() {
  // Routage d'interface très simple: accueil -> briefing -> étapes -> final.
  const routeUpdated = ensureRouteAssigned();
  if (routeUpdated) {
    saveState(state);
  }

  renderStatusPanel(state, statusNode);

  if (!state.teamName) {
    renderWelcomeScreen(mainNode);
    return;
  }

  if (!state.missionAccepted) {
    renderMissionScreen(mainNode, state);
    return;
  }

  if (state.finishedAt) {
    renderFinalScreen(mainNode, state);
    return;
  }

  const step = getCurrentStep();
  if (!step) {
    state.finishedAt = Date.now();
    persistAndRender();
    return;
  }

  const orderedSteps = getOrderedSteps();
  const hasNextStep = state.currentStepIndex < orderedSteps.length - 1;
  renderStepScreen(mainNode, state, step, runtime, hasNextStep);
}

document.addEventListener("submit", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement)) {
    return;
  }

  if (target.id === "team-form") {
    handleTeamSubmit(event);
  }

  if (target.id === "precheck-form") {
    handlePrecheckSubmit(event);
  }

  if (target.id === "answer-form") {
    handleAnswerSubmit(event);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.id === "accept-mission") {
    state.missionAccepted = true;
    persistAndRender();
    return;
  }

  if (target.id === "show-hint") {
    const step = getCurrentStep();
    if (step) {
      state.hintsUsedByStep[step.id] = true;
      persistAndRender();
    }
    return;
  }

  if (target.id === "next-step") {
    goToNextStep();
    return;
  }

  if (target.id === "copy-summary") {
    copyFinalSummary();
    return;
  }

  if (target.id === "restart-game") {
    resetState();
    state = loadState();
    runtime.feedback = "";
    runtime.feedbackType = "error";
    renderApp();
  }
});

startTimer();
renderApp();
