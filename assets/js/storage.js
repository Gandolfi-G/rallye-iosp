import { GAME_CONFIG } from "./game-data.js";

const STORAGE_KEY = GAME_CONFIG.localStorageKey;

export function createDefaultState() {
  // État minimal persistant pour rejouer sans backend.
  return {
    teamName: "",
    routeId: "",
    routeStepIds: [],
    startedAt: null,
    finishedAt: null,
    missionAccepted: false,
    currentStepIndex: 0,
    completedStepIds: [],
    attemptsByStep: {},
    precheckByStep: {},
    hintsUsedByStep: {},
    validations: []
  };
}

function sanitizeState(rawState) {
  // Sécurise la forme des données relues depuis localStorage.
  const safe = createDefaultState();
  if (!rawState || typeof rawState !== "object") {
    return safe;
  }

  return {
    ...safe,
    ...rawState,
    routeId: typeof rawState.routeId === "string" ? rawState.routeId : "",
    routeStepIds: Array.isArray(rawState.routeStepIds) ? rawState.routeStepIds : [],
    completedStepIds: Array.isArray(rawState.completedStepIds) ? rawState.completedStepIds : [],
    attemptsByStep:
      rawState.attemptsByStep && typeof rawState.attemptsByStep === "object"
        ? rawState.attemptsByStep
        : {},
    precheckByStep:
      rawState.precheckByStep && typeof rawState.precheckByStep === "object"
        ? rawState.precheckByStep
        : {},
    hintsUsedByStep:
      rawState.hintsUsedByStep && typeof rawState.hintsUsedByStep === "object"
        ? rawState.hintsUsedByStep
        : {},
    validations: Array.isArray(rawState.validations) ? rawState.validations : []
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultState();
    }
    const parsed = JSON.parse(raw);
    return sanitizeState(parsed);
  } catch (error) {
    console.warn("State load failed, resetting state.", error);
    return createDefaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStorageKey() {
  return STORAGE_KEY;
}
