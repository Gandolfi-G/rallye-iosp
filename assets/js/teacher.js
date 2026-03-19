import { GAME_STEPS } from "./game-data.js";
import { getStorageKey, loadState, resetState } from "./storage.js";
import { escapeHtml, formatDateTime, formatElapsedTime } from "./utils.js";

const stepListNode = document.getElementById("teacher-step-list");
const beaconCodesNode = document.getElementById("teacher-beacon-codes");
const summaryNode = document.getElementById("teacher-summary");
const jsonNode = document.getElementById("teacher-json");
const refreshBtn = document.getElementById("refresh-state");
const resetBtn = document.getElementById("reset-state");

function formatMultiline(value) {
  return escapeHtml(value || "").replaceAll("\n", "<br>");
}

function getGreekName(step) {
  return String(step.greekLetter || step.id || "-").toUpperCase();
}

function getGreekCode(step) {
  return String(step.greekPdfCode || "-").toUpperCase();
}

function renderBeaconCodes() {
  const rows = GAME_STEPS.map((step) => {
    const greekName = getGreekName(step);
    const greekCode = getGreekCode(step);
    return `<li><strong>${escapeHtml(greekName)}</strong> : <code>${escapeHtml(greekCode)}</code></li>`;
  }).join("");

  beaconCodesNode.innerHTML = `<ol class="step-list">${rows}</ol>`;
}

function renderStepMatrix() {
  const listItems = GAME_STEPS.map((step, index) => {
    const validationText =
      step.validationMode === "screenshot" ? "Code + capture écran" : "Code WhatsApp";
    const variants = Array.isArray(step.acceptedVariants) ? step.acceptedVariants.join(" | ") : "";
    const yesNoCorrection =
      step.precheckType === "ecg-poles"
        ? `
        <strong>Correction phase 1 (ECG OUI/NON):</strong>
        <ul class="meta-list">
          ${(step.poleRows || [])
            .map((row) => {
              const poleId = String(row.id || "");
              const expected = String((step.expectedYesNoByPole || {})[poleId] || "-");
              const label = String(row.label || poleId);
              const expectedLabel = expected === "YES" ? "OUI" : expected === "NO" ? "NON" : expected;
              return `<li>${escapeHtml(label)}: <strong>${escapeHtml(expectedLabel)}</strong></li>`;
            })
            .join("")}
        </ul>
        `
        : "";
    const rankCorrection =
      step.precheckType === "rank-order"
        ? `
        <strong>Correction phase 1 (Classement):</strong>
        <ul class="meta-list">
          ${(step.rankItems || [])
            .map((item) => {
              const itemId = String(item.id || "");
              const rank = String((step.expectedRankByItem || {})[itemId] || "-");
              return `<li>${escapeHtml(itemId)}) ${escapeHtml(item.label || "")}: rang <strong>${escapeHtml(rank)}</strong></li>`;
            })
            .join("")}
        </ul>
        `
        : "";
    const omegaCorrection =
      step.precheckType === "omega-decision"
        ? `
        <strong>Correction phase 1 (Décision finale):</strong>
        <ul class="meta-list">
          <li>Décision finale: <strong>${escapeHtml(String((step.expectedDecision || {}).finalDecision || "-"))}</strong></li>
          <li>Type d'inscription: <strong>${escapeHtml(String((step.expectedDecision || {}).inscriptionType || "-"))}</strong></li>
        </ul>
        `
        : "";
    const gammaCorrection =
      step.precheckType === "gamma-total"
        ? `
        <strong>Correction phase 1 (Calcul):</strong>
        <ul class="meta-list">
          <li>Total attendu: <strong>${escapeHtml(String(step.expectedTotal || "-"))}</strong></li>
        </ul>
        `
        : "";

    return `
      <li>
        <strong>${index + 1}. ${escapeHtml(step.title)}</strong><br>
        <span class="text-muted">${escapeHtml(step.id)} · PDF ${escapeHtml(getGreekName(step))}</span><br>
        <strong>Code PDF (verso):</strong> <code>${escapeHtml(getGreekCode(step))}</code><br>
        <strong>Énigme:</strong><br>
        ${formatMultiline(step.puzzleQuestion)}<br>
        <strong>Réponse attendue (élève):</strong> <code>${escapeHtml(step.answer)}</code><br>
        <strong>Variantes acceptées:</strong> <code>${escapeHtml(variants || "-")}</code><br>
        ${yesNoCorrection}
        ${rankCorrection}
        ${omegaCorrection}
        ${gammaCorrection}
        <strong>Code WhatsApp à donner:</strong> <code>${escapeHtml(step.whatsappCode)}</code><br>
        Validation: ${validationText}
      </li>
    `;
  }).join("");

  stepListNode.innerHTML = `<ol class="step-list">${listItems}</ol>`;
}

function renderState() {
  const state = loadState();
  const finished = Boolean(state.finishedAt);
  const currentStepNumber = Math.min(state.currentStepIndex + 1, GAME_STEPS.length);

  summaryNode.innerHTML = `
    <strong>Clé localStorage:</strong> <code>${escapeHtml(getStorageKey())}</code><br>
    <strong>Équipe:</strong> ${escapeHtml(state.teamName || "-")}<br>
    <strong>Parcours:</strong> ${escapeHtml(state.routeId || "-")}<br>
    <strong>Ordre:</strong> ${escapeHtml((state.routeStepIds || []).join(" -> ") || "-")}<br>
    <strong>Démarré:</strong> ${escapeHtml(formatDateTime(state.startedAt))}<br>
    <strong>Terminé:</strong> ${escapeHtml(formatDateTime(state.finishedAt))}<br>
    <strong>Durée:</strong> ${escapeHtml(formatElapsedTime(state.startedAt, state.finishedAt || Date.now()))}<br>
    <strong>Étape courante:</strong> ${currentStepNumber}/${GAME_STEPS.length}<br>
    <strong>Étapes validées:</strong> ${state.completedStepIds.length}/${GAME_STEPS.length}<br>
    <strong>Mission finalisée:</strong> ${finished ? "Oui" : "Non"}
  `;

  jsonNode.textContent = JSON.stringify(state, null, 2);
}

refreshBtn.addEventListener("click", renderState);

resetBtn.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Confirmer la réinitialisation locale ? Cette action supprime la progression de cet appareil."
  );

  if (!confirmed) {
    return;
  }

  resetState();
  renderState();
});

renderStepMatrix();
renderBeaconCodes();
renderState();
