import { GAME_CONFIG, GAME_STEPS, STEP_ROUTES } from "./game-data.js";
import { escapeHtml, formatDateTime, formatElapsedTime } from "./utils.js";

function getRouteLabel(routeId) {
  const route = STEP_ROUTES.find((item) => item.id === routeId);
  return route ? route.label : "Parcours A";
}

function formatProfileLabel(key) {
  const labels = {
    francais: "Français",
    mathematiques: "Mathématiques",
    moyenneGenerale: "Moyenne générale",
    allemand: "Allemand",
    anglais: "Anglais",
    artsVisuels: "Arts visuels",
    musique: "Musique",
    physique: "Physique",
    geographie: "Géographie",
    histoire: "Histoire",
    pratiqueTheatraleAnnees: "Pratique théâtrale (années)"
  };

  return labels[key] || key;
}

export function renderStatusPanel(state, mountNode) {
  if (!state.teamName) {
    mountNode.classList.add("hidden");
    mountNode.innerHTML = "";
    return;
  }

  const total = GAME_STEPS.length;
  const current = Math.min(state.currentStepIndex + 1, total);
  const done = state.completedStepIds.length;
  const progressPercent = Math.round((done / total) * 100);
  const timer = formatElapsedTime(state.startedAt, state.finishedAt || Date.now());

  mountNode.classList.remove("hidden");
  mountNode.innerHTML = `
    <div class="status-grid">
      <div class="status-pill"><strong>Équipe</strong><br>${escapeHtml(state.teamName)}</div>
      <div class="status-pill"><strong>Chrono</strong><br>${timer}</div>
      <div class="status-pill"><strong>Étape</strong><br>${current}/${total}</div>
      <div class="status-pill"><strong>Validées</strong><br>${done}</div>
    </div>
    <div class="progress-wrap">
      <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPercent}">
        <div class="progress-value" style="width: ${progressPercent}%"></div>
      </div>
      <p class="text-muted">Progression ${progressPercent}%</p>
    </div>
  `;
}

export function renderWelcomeScreen(mountNode) {
  mountNode.innerHTML = `
    <section class="card reveal">
      <span class="badge">Accueil mission</span>
      <h2>Brief rapide</h2>
      <p>${escapeHtml(GAME_CONFIG.narrative)}</p>
      <ul class="meta-list">
        ${GAME_CONFIG.missionRules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <p class="text-muted">Durée cible: ${GAME_CONFIG.targetDurationMinutes} minutes · par équipes</p>
      <form id="team-form">
        <label for="team-name" class="input-label">Nom d'équipe</label>
        <input id="team-name" name="teamName" class="input-text" maxlength="32" autocomplete="off" placeholder="Ex: Les Stratèges" required />
        <div class="button-row">
          <button type="submit" class="btn-primary">Lancer la mission</button>
        </div>
      </form>
    </section>
  `;
}

export function renderMissionScreen(mountNode, state) {
  const routeLabel = getRouteLabel(state.routeId);
  mountNode.innerHTML = `
    <section class="card reveal">
      <span class="badge">Mission active</span>
      <h2>Équipe ${escapeHtml(state.teamName)}</h2>
      <p>Objectif: récupérer 6 fragments et envoyer chaque validation au format demandé.</p>
      <p><strong>Parcours attribué:</strong> ${escapeHtml(routeLabel)} (ordre différent selon l'équipe)</p>
      <ol class="meta-list">
        <li>Lisez la consigne terrain et trouvez la balise physique demandée.</li>
        <li>Saisissez la réponse pour déverrouiller l'étape suivante.</li>
        <li>Envoyez le code WhatsApp affiché (ou une capture si demandé).</li>
      </ol>
      <div class="button-row">
        <button id="accept-mission" type="button" class="btn-primary">Commencer l'étape 1</button>
      </div>
    </section>
  `;
}

export function renderStepScreen(mountNode, state, step, runtime, hasNextStep) {
  const isSolved = state.completedStepIds.includes(step.id);
  const attempts = state.attemptsByStep[step.id] || 0;
  const hintUsed = Boolean(state.hintsUsedByStep[step.id]);
  const precheckRequired = Boolean(step.precheckType);
  const precheckPassed = !precheckRequired || Boolean(state.precheckByStep?.[step.id]);
  const validationLabel =
    step.validationMode === "screenshot"
      ? "Validation enseignant: envoyer le code + une capture d'écran."
      : "Validation enseignant: envoyer le code WhatsApp affiché.";

  const solvedCard = isSolved
    ? `
      <div class="solved-box reveal">
        <h3>Étape validée</h3>
        <p><strong>Code WhatsApp:</strong> <code>${escapeHtml(step.whatsappCode)}</code></p>
        <p><strong>Note pédagogique:</strong> ${escapeHtml(step.pedagogicalNote)}</p>
        <p><strong>Récompense:</strong> ${escapeHtml(step.reward || "Fragment enregistré.")}</p>
        <p class="text-muted">${escapeHtml(validationLabel)}</p>
        <div class="button-row">
          <button id="next-step" class="btn-primary" type="button">${hasNextStep ? "Étape suivante" : "Voir le récapitulatif final"}</button>
        </div>
      </div>
    `
    : "";

  const hintCard = hintUsed
    ? `<div class="hint-box reveal"><strong>Indice:</strong> ${escapeHtml(step.hint)}</div>`
    : "";

  const feedbackCard = runtime.feedback
    ? `<p class="feedback ${runtime.feedbackType}">${escapeHtml(runtime.feedback)}</p>`
    : "";

  const precheckCard =
    !isSolved && step.precheckType === "sort-filieres"
      ? `
      <div class="hint-box reveal">
        <h3>Phase 1 - Zone de tri</h3>
        <p>${escapeHtml(step.precheckPrompt || "Placez les filières dans le bon ordre.")}</p>
        ${
          precheckPassed
            ? `<p class="text-muted"><strong>Tri validé.</strong> Passez à la phase 2: cherchez la balise et saisissez son code.</p>`
            : `
          <form id="precheck-form">
            <div class="sort-grid">
              ${(step.sortItems || [])
                .map((item) => {
                  const slot = String(item.slot || "");
                  const rowId = `precheck-${slot.toLowerCase()}`;
                  return `
                    <div class="sort-row">
                      <label for="${escapeHtml(rowId)}" class="input-label">${escapeHtml(slot)}) ${escapeHtml(
                        item.rule || ""
                      )}</label>
                      <select id="${escapeHtml(rowId)}" name="precheck-${escapeHtml(
                        slot
                      )}" class="input-text" required>
                        <option value="">Choisir une filière</option>
                        ${(step.sortOptions || [])
                          .map(
                            (option) =>
                              `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`
                          )
                          .join("")}
                      </select>
                    </div>
                  `;
                })
                .join("")}
            </div>
            <div class="button-row">
              <button type="submit" class="btn-primary">Valider le tri</button>
            </div>
          </form>
          `
        }
      </div>
    `
        : !isSolved && step.precheckType === "ecg-poles"
        ? `
      <div class="hint-box reveal">
        <h3>Phase 1 - Tableau ECG</h3>
        <p>${escapeHtml(step.precheckPrompt || "Indiquez OUI ou NON pour chaque pôle ECG.")}</p>
        <div class="precheck-profile">
          <p><strong>Notes de l'élève (11e):</strong></p>
          <ul class="meta-list">
            ${Object.entries(step.studentProfile || {})
              .map(([key, value]) => `<li>${escapeHtml(formatProfileLabel(key))}: <strong>${escapeHtml(value)}</strong></li>`)
              .join("")}
          </ul>
        </div>
        ${
          precheckPassed
            ? `<p class="text-muted"><strong>Tableau validé.</strong> Passez à la phase 2: cherchez la balise et saisissez son code.</p>`
            : `
          <form id="precheck-form">
            <div class="sort-grid">
              ${(step.poleRows || [])
                .map((row) => {
                  const poleId = String(row.id || "");
                  const rowId = `precheck-${poleId}`;
                  return `
                    <div class="sort-row">
                      <label for="${escapeHtml(rowId)}" class="input-label">${escapeHtml(row.label || "")}</label>
                      <select id="${escapeHtml(rowId)}" name="precheck-${escapeHtml(poleId)}" class="input-text" required>
                        <option value="">Choisir</option>
                        <option value="YES">OUI</option>
                        <option value="NO">NON</option>
                      </select>
                    </div>
                  `;
                })
                .join("")}
            </div>
            <div class="button-row">
              <button type="submit" class="btn-primary">Valider le tableau</button>
            </div>
          </form>
          `
        }
      </div>
    `
        : !isSolved && step.precheckType === "rank-order"
          ? `
      <div class="hint-box reveal">
        <h3>Phase 1 - Classement</h3>
        <p>${escapeHtml(step.precheckPrompt || "Classez les propositions.")}</p>
        ${
          precheckPassed
            ? `<p class="text-muted"><strong>Classement validé.</strong> Passez à la phase 2: cherchez la balise et saisissez son code.</p>`
            : `
          <form id="precheck-form">
            <div class="sort-grid">
              ${(step.rankItems || [])
                .map((item) => {
                  const itemId = String(item.id || "");
                  const rowId = `precheck-rank-${itemId}`;
                  return `
                    <div class="sort-row">
                      <label for="${escapeHtml(rowId)}" class="input-label">${escapeHtml(itemId)}) ${escapeHtml(
                        item.label || ""
                      )}</label>
                      <select id="${escapeHtml(rowId)}" name="precheck-rank-${escapeHtml(
                        itemId
                      )}" class="input-text" required>
                        <option value="">Choisir un rang</option>
                        <option value="1">1 (plus cohérent)</option>
                        <option value="2">2</option>
                        <option value="3">3 (moins cohérent)</option>
                      </select>
                    </div>
                  `;
                })
                .join("")}
            </div>
            <div class="button-row">
              <button type="submit" class="btn-primary">Valider le classement</button>
            </div>
          </form>
          `
        }
      </div>
    `
        : !isSolved && step.precheckType === "gamma-total"
          ? `
      <div class="hint-box reveal">
        <h3>Phase 1 - Calcul</h3>
        <p>${escapeHtml(step.precheckPrompt || "Calculez puis validez le total.")}</p>
        ${
          precheckPassed
            ? `<p class="text-muted"><strong>Total validé.</strong> Passez à la phase 2: cherchez la balise et saisissez son code.</p>`
            : `
          <form id="precheck-form">
            <div class="sort-grid">
              <div class="sort-row">
                <label for="precheck-gamma-total" class="input-label">Total calculé</label>
                <input id="precheck-gamma-total" name="precheck-gamma-total" class="input-text" inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="Ex: 123" required />
              </div>
            </div>
            <div class="button-row">
              <button type="submit" class="btn-primary">Valider le total</button>
            </div>
          </form>
          `
        }
      </div>
    `
        : !isSolved && step.precheckType === "omega-decision"
          ? `
      <div class="hint-box reveal">
        <h3>Phase 1 - Décision finale</h3>
        <p>${escapeHtml(step.precheckPrompt || "Validez la décision finale.")}</p>
        ${
          precheckPassed
            ? `<p class="text-muted"><strong>Décision validée.</strong> Passez à la phase 2: cherchez la balise et saisissez son code.</p>`
            : `
          <form id="precheck-form">
            <div class="sort-grid">
              <div class="sort-row">
                <label for="precheck-final-decision" class="input-label">Décision finale</label>
                <select id="precheck-final-decision" name="precheck-final-decision" class="input-text" required>
                  <option value="">Choisir</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              <div class="sort-row">
                <label for="precheck-inscription-type" class="input-label">Type d'inscription</label>
                <select id="precheck-inscription-type" name="precheck-inscription-type" class="input-text" required>
                  <option value="">Choisir</option>
                  <option value="F">F (Filière)</option>
                  <option value="E">E (Etablissement)</option>
                </select>
              </div>
            </div>
            <div class="button-row">
              <button type="submit" class="btn-primary">Valider la decision</button>
            </div>
          </form>
          `
        }
      </div>
    `
        : "";

  const answerLabel =
    step.id === "pp-01"
      ? "Code balise ALPHA"
      : step.id === "pp-02"
        ? "Code balise BETA"
        : step.id === "pp-03"
          ? "Code balise GAMMA"
        : step.id === "pp-05"
          ? "Code balise EPSILON"
          : step.id === "pp-06"
            ? "Code balise OMEGA"
            : "Votre réponse";
  const answerPlaceholder = step.id === "pp-01" || step.id === "pp-02" || step.id === "pp-03" || step.id === "pp-05" || step.id === "pp-06" ? "Ex: Z9" : "";
  const answerSection = isSolved
    ? ""
    : precheckPassed
      ? `
        <form id="answer-form">
          <label for="step-answer" class="input-label">${escapeHtml(answerLabel)}</label>
          <input id="step-answer" name="answer" class="input-text" autocomplete="off" maxlength="60" placeholder="${escapeHtml(
            answerPlaceholder
          )}" required />
          <div class="button-row">
            <button type="submit" class="btn-primary">Vérifier</button>
            <button id="show-hint" type="button" class="btn-secondary">Afficher un indice</button>
          </div>
        </form>
      `
      : `
        <p class="text-muted"><strong>Phase 2 verrouillée:</strong> validez d'abord la phase 1.</p>
        <div class="button-row">
          <button id="show-hint" type="button" class="btn-secondary">Afficher un indice</button>
        </div>
      `;

  mountNode.innerHTML = `
    <section class="card reveal">
      <span class="badge">${escapeHtml(step.id.toUpperCase())}</span>
      <h2>${escapeHtml(step.title)}</h2>
      <p><strong>Lieu/repère:</strong> ${escapeHtml(step.location)}</p>
      <p><strong>Micro-narration:</strong> ${escapeHtml(step.narration)}</p>
      <p><strong>Consigne terrain:</strong> ${escapeHtml(step.terrainInstruction)}</p>
      <p><strong>Indice sur place:</strong> ${escapeHtml(step.onSiteClue || "Cherchez la balise de l'étape.")}</p>
      <p><strong>Fallback terrain:</strong> ${escapeHtml(step.fallbackNote)}</p>
      <hr />
      <p><strong>Énigme:</strong></p>
      <p>${escapeHtml(step.puzzleQuestion).replaceAll("\n", "<br>")}</p>
      ${precheckCard}
      ${answerSection}
      ${isSolved ? "" : feedbackCard}

      ${hintCard}
      <p class="text-muted">Tentatives sur cette étape: ${attempts}</p>
      ${solvedCard}
    </section>
  `;
}

export function renderFinalScreen(mountNode, state) {
  const finishedAt = state.finishedAt || Date.now();
  const timer = formatElapsedTime(state.startedAt, finishedAt);
  const validationsHtml = state.validations
    .map(
      (entry) =>
        `<li><strong>${escapeHtml(entry.stepId)}</strong> - ${escapeHtml(entry.code)} (${escapeHtml(
          formatDateTime(entry.solvedAt)
        )})</li>`
    )
    .join("");

  mountNode.innerHTML = `
    <section class="card reveal">
      <span class="badge">Mission complétée</span>
      <h2>Dossier 2026 reconstitué</h2>
      <p>Équipe <strong>${escapeHtml(state.teamName)}</strong> · temps total <strong>${timer}</strong>.</p>
      <div class="final-box">
        <h3>Récapitulatif validations</h3>
        <ol class="code-list">${validationsHtml}</ol>
      </div>
      <div class="button-row">
        <button id="copy-summary" type="button" class="btn-primary">Copier le récapitulatif</button>
        <button id="restart-game" type="button" class="btn-danger">Réinitialiser et rejouer</button>
      </div>
      <p class="text-muted">Montrez cet écran à l'enseignant ou envoyez la capture via WhatsApp.</p>
    </section>
  `;
}

export function buildSummaryText(state) {
  const timer = formatElapsedTime(state.startedAt, state.finishedAt || Date.now());
  const lines = state.validations.map((item) => `${item.stepId}: ${item.code}`);
  return [`Mission Plainpalais 2026`, `Équipe: ${state.teamName}`, `Temps: ${timer}`, ...lines].join("\n");
}
