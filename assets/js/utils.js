export function normalizeAnswer(value) {
  // Normalisation robuste: casse, accents, ponctuation et espaces.
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function isStepAnswerCorrect(step, userValue) {
  const candidate = normalizeAnswer(userValue);
  if (!candidate) {
    return false;
  }

  const allAllowed = [step.answer, ...(step.acceptedVariants || [])]
    .map((item) => normalizeAnswer(item))
    .filter(Boolean);

  return allAllowed.includes(candidate);
}

export function formatElapsedTime(startedAt, endedAt = Date.now()) {
  if (!startedAt) {
    return "00:00";
  }

  const deltaMs = Math.max(0, endedAt - startedAt);
  const totalSeconds = Math.floor(deltaMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDateTime(timestamp) {
  if (!timestamp) {
    return "-";
  }

  try {
    return new Date(timestamp).toLocaleString("fr-CH", {
      dateStyle: "short",
      timeStyle: "short"
    });
  } catch (_error) {
    return "-";
  }
}

export function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
