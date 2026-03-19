export const GAME_CONFIG = {
  id: "mission-plainpalais-2026",
  title: "Mission Plainpalais 2026",
  subtitle: "Jeu de piste orientation - 11CO LS",
  targetDurationMinutes: 30,
  narrative:
    "Le dossier de préparation des parcours 2026 a été fragmenté. Votre équipe doit récupérer 6 fragments et vérifier qu'ils forment une saisie cohérente avant la clôture.",
  missionRules: [
    "Retrouvez 6 PDFs balisés par lettre grecque (ALPHA à OMEGA).",
    "Chaque PDF est recto-verso: recto = signe grec géant, verso = code à saisir.",
    "Une seule réponse validée débloque l'étape suivante.",
    "Envoyez le code WhatsApp affiché ou la capture demandée à l'enseignant.",
    "Aucune donnée n'est envoyée sur internet : tout reste local sur l'appareil."
  ],
  localStorageKey: "rally_plainpalais_orientation_v1"
};

export const STEP_ROUTES = [
  {
    id: "route-a",
    label: "Parcours A",
    stepIds: ["pp-01", "pp-02", "pp-03", "pp-04", "pp-05", "pp-06"]
  },
  {
    id: "route-b",
    label: "Parcours B",
    stepIds: ["pp-03", "pp-05", "pp-01", "pp-06", "pp-02", "pp-04"]
  },
  {
    id: "route-c",
    label: "Parcours C",
    stepIds: ["pp-05", "pp-02", "pp-06", "pp-03", "pp-04", "pp-01"]
  },
  {
    id: "route-d",
    label: "Parcours D",
    stepIds: ["pp-02", "pp-04", "pp-01", "pp-05", "pp-03", "pp-06"]
  },
  {
    id: "route-e",
    label: "Parcours E",
    stepIds: ["pp-06", "pp-01", "pp-04", "pp-02", "pp-05", "pp-03"]
  },
  {
    id: "route-f",
    label: "Parcours F",
    stepIds: ["pp-04", "pp-06", "pp-02", "pp-03", "pp-01", "pp-05"]
  }
];

export const GAME_STEPS = [
  {
    id: "pp-01",
    greekLetter: "ALPHA",
    greekPdfCode: "K2",
    greekGlyph: "a",
    title: "Fragment Alpha - Les Quatre Portes",
    location: "Place de Plainpalais",
    narration:
      "Le premier fragment est verrouillé : il faut classer correctement les 4 voies d'orientation.",
    precheckType: "sort-filieres",
    precheckPrompt:
      "Placez les 4 filières au bon endroit pour les règles A, B, C, D, puis validez le tri.",
    precheckSuccessMessage:
      "Tri validé. Passez à la phase 2: trouvez le PDF ALPHA et saisissez son code verso.",
    precheckErrorMessage: "Tri incorrect. Vérifiez vos placements A/B/C/D et retentez.",
    sortItems: [
      { slot: "A", rule: "Aucun choix de langue à faire" },
      { slot: "B", rule: "Choix OS + DF avec incompatibilités" },
      { slot: "C", rule: "Anglais obligatoire + langue nationale à choisir" },
      { slot: "D", rule: "Voie culture générale avec options préprofessionnelles" }
    ],
    sortOptions: [
      { value: "SEFOP", label: "SeFoP" },
      { value: "COLLEGE", label: "Collège" },
      { value: "CFP_COMMERCE", label: "CFP Commerce" },
      { value: "ECG", label: "ECG" }
    ],
    sortExpectedBySlot: {
      A: "SEFOP",
      B: "COLLEGE",
      C: "CFP_COMMERCE",
      D: "ECG"
    },
    puzzleQuestion:
      "Phase 1: utilisez la zone de tri ci-dessous pour placer correctement les filières A, B, C, D.\nPhase 2: une fois le tri validé, trouvez le PDF ALPHA (recto signe grec) et saisissez le code du verso.",
    answer: "K2",
    acceptedVariants: ["k-2", "k 2"],
    hint: "Pour le tri: A=SeFoP, B=Collège, C=CFP Commerce, D=ECG. Puis saisissez le code verso du PDF ALPHA.",
    pedagogicalNote:
      "On choisit d'abord une filière (Collège, ECG, CFP Commerce, SeFoP), pas un établissement précis.",
    whatsappCode: "PP26-ALPHA-SCCE",
    validationMode: "code",
    reward: "Fragment Alpha récupéré : la carte des filières est réassemblée.",
    nextStep: "pp-02"
  },
  {
    id: "pp-02",
    greekLetter: "BETA",
    greekPdfCode: "M4",
    greekGlyph: "b",
    title: "Fragment Beta - Dossier ECG",
    location: "Place de Plainpalais",
    narration:
      "Le second fragment vous confie le dossier d'une élève de 11e : à vous de vérifier les accès aux 7 pôles ECG.",
    precheckType: "ecg-poles",
    precheckPrompt:
      "Analysez les notes de l'élève et indiquez OUI ou NON pour chaque pôle ECG (accès en 2e année). Les critères ne sont pas affichés: utilisez le PDF de règles fourni par l'enseignant.",
    precheckSuccessMessage:
      "Analyse validée. Passez à la phase 2: trouvez le PDF BETA et saisissez son code verso.",
    precheckErrorMessage:
      "Tableau incorrect. Revérifiez les seuils de chaque pôle ECG puis corrigez.",
    studentProfile: {
      francais: 5.0,
      mathematiques: 4.8,
      moyenneGenerale: 5.2,
      allemand: 3.6,
      anglais: 4.4,
      artsVisuels: 4.3,
      musique: 3.7,
      physique: 4.6,
      geographie: 4.2,
      histoire: 3.8,
      pratiqueTheatraleAnnees: 1.5
    },
    poleRows: [
      {
        id: "arts_design",
        label: "Arts et design",
        rule: "Moyenne en arts visuels >= 4.0"
      },
      {
        id: "musique",
        label: "Musique",
        rule: "Moyenne en musique (10e) >= 4.0"
      },
      {
        id: "theatre",
        label: "Theatre",
        rule: "Pratique theatrale d'au moins 1 an"
      },
      {
        id: "communication_information",
        label: "Communication-information",
        rule: "Allemand > 4.0 ET anglais > 4.0"
      },
      {
        id: "sante",
        label: "Sante",
        rule: "Moyenne en physique >= 4.0"
      },
      {
        id: "pedagogie",
        label: "Pedagogie",
        rule: "Francais + mathematiques + anglais + allemand >= 20.0"
      },
      {
        id: "travail_social",
        label: "Travail social",
        rule: "Geographie > 4.0 ET histoire > 4.0"
      }
    ],
    expectedYesNoByPole: {
      arts_design: "YES",
      musique: "NO",
      theatre: "YES",
      communication_information: "NO",
      sante: "YES",
      pedagogie: "NO",
      travail_social: "NO"
    },
    puzzleQuestion:
      "Phase 1: complétez le tableau OUI/NON des 7 pôles ECG à partir des notes.\nImportant: les critères d'admission ne sont pas affichés ici. Vous devez les retrouver dans le PDF de référence distribué par l'enseignant.\nPhase 2: quand le tableau est validé, trouvez le PDF BETA et saisissez le code du verso.",
    answer: "M4",
    acceptedVariants: ["m-4", "m 4"],
    hint: "Cherchez les critères exacts dans le PDF de règles, puis saisissez le code verso du PDF BETA.",
    pedagogicalNote:
      "Les acces ECG dependent de seuils differents selon le pole ; il faut verifier les notes critere par critere.",
    whatsappCode: "PP26-BETA-ECG7",
    validationMode: "code",
    reward: "Fragment Beta recupere : le dossier ECG est valide.",
    nextStep: "pp-03"
  },
  {
    id: "pp-03",
    greekLetter: "GAMMA",
    greekPdfCode: "Q7",
    greekGlyph: "g",
    title: "Fragment Gamma - Coffre des Codes",
    location: "Place de Plainpalais",
    narration:
      "Un coffre chiffré demande de manipuler des codes de filière réels.",
    precheckType: "gamma-total",
    precheckPrompt:
      "Calculez la somme demandée puis validez votre total.",
    precheckSuccessMessage:
      "Total validé. Passez à la phase 2: trouvez le PDF GAMMA et saisissez son code verso.",
    precheckErrorMessage:
      "Total incorrect. Reprenez le calcul des deux derniers chiffres puis corrigez.",
    expectedTotal: "145",
    puzzleQuestion:
      "Phase 1: utilisez les codes de filière et calculez :\n- Maturité gymnasiale : 0287\n- ECG Pédagogie : 2906\n- SeFoP : 2152\nPrenez les deux derniers chiffres de chaque code et additionnez-les, puis validez le total.\nPhase 2: trouvez le PDF GAMMA et saisissez le code du verso.",
    answer: "Q7",
    acceptedVariants: ["q-7", "q 7"],
    hint: "87 + 06 + 52. Puis saisissez le code verso du PDF GAMMA.",
    pedagogicalNote:
      "Les codes de filière servent à identifier des parcours précis ; ils peuvent être transformés en cadenas logiques.",
    whatsappCode: "PP26-GAMMA-145",
    validationMode: "screenshot",
    reward: "Fragment Gamma récupéré : le coffre numérique est ouvert.",
    nextStep: "pp-04"
  },
  {
    id: "pp-04",
    greekLetter: "DELTA",
    greekPdfCode: "T1",
    greekGlyph: "d",
    title: "Fragment Delta - L'Intrus Langues",
    location: "Place de Plainpalais",
    narration:
      "Un dossier contient une proposition linguistique impossible. À vous de l'isoler.",
    puzzleQuestion:
      "Une seule proposition est impossible selon les règles :\nA) CFC Commerce : anglais + allemand\nB) ECG projet primaire : anglais + allemand\nC) SeFoP : anglais + italien\nD) ECG autre projet : allemand + italien\nRéponse attendue = lettre + code du PDF DELTA (sans espace).",
    answer: "CT1",
    acceptedVariants: ["c-t1", "option c t1", "c t 1"],
    hint: "SeFoP ne demande aucun choix de langue. Prenez le code au verso du PDF DELTA et combinez-le avec la lettre correcte.",
    pedagogicalNote:
      "Les contraintes de langues dépendent fortement de la filière ; SeFoP est le cas le plus simple (aucun choix).",
    whatsappCode: "PP26-DELTA-C",
    validationMode: "code",
    reward: "Fragment Delta récupéré : les incompatibilités de langues sont neutralisées.",
    nextStep: "pp-05"
  },
  {
    id: "pp-05",
    greekLetter: "EPSILON",
    greekPdfCode: "L8",
    greekGlyph: "e",
    title: "Fragment Epsilon - Tri OS/DF",
    location: "Place de Plainpalais",
    narration:
      "Le cinquième fragment impose un tri de cohérence sur les choix OS/DF du Collège.",
    precheckType: "rank-order",
    precheckPrompt:
      "Attribuez un rang (1, 2, 3) à chaque proposition pour aller du plus cohérent au moins cohérent.",
    precheckSuccessMessage:
      "Classement validé. Passez à la phase 2: trouvez le PDF EPSILON et saisissez son code verso.",
    precheckErrorMessage:
      "Classement incorrect. Reprenez les règles de cohérence OS/DF puis corrigez les rangs.",
    rankItems: [
      { id: "A", label: "OS Physique et appl. maths + maths avancé" },
      { id: "B", label: "OS Anglais + DF Anglais" },
      { id: "C", label: "OS Musique + instrument deja pratique, mais pas d'inscription a un ensemble" }
    ],
    expectedRankByItem: {
      A: "1",
      C: "2",
      B: "3"
    },
    puzzleQuestion:
      "Phase 1: classez les 3 propositions du plus cohérent au moins cohérent dans la zone de classement.\nPhase 2: une fois le classement validé, trouvez le PDF EPSILON et saisissez le code du verso.",
    answer: "L8",
    acceptedVariants: ["l-8", "l 8"],
    hint: "A respecte une règle explicite. B viole une incompatibilité directe. C est partiellement cohérent mais incomplet. Puis saisissez le code verso du PDF EPSILON.",
    pedagogicalNote:
      "Au Collège, OS et DF ne peuvent pas dupliquer la même discipline ; certaines OS imposent des conditions supplémentaires.",
    whatsappCode: "PP26-EPSILON-ACB",
    validationMode: "screenshot",
    reward: "Fragment Epsilon récupéré : la matrice OS/DF est stabilisée.",
    nextStep: "pp-06"
  },
  {
    id: "pp-06",
    greekLetter: "OMEGA",
    greekPdfCode: "R3",
    greekGlyph: "w",
    title: "Fragment Omega - Décision d'orientation",
    location: "Place de Plainpalais",
    narration:
      "Un contrôle de décision d'orientation à résoudre à n'importe quel moment du parcours.",
    precheckType: "omega-decision",
    precheckPrompt:
      "Phase 1: appliquez la règle de décision d'orientation, puis choisissez (1) la décision A/B et (2) le type d'inscription F/E.",
    precheckSuccessMessage:
      "Décision validée. Phase 2 débloquée: récupérez le PDF OMEGA et saisissez le code inscrit au verso.",
    precheckErrorMessage:
      "Décision incorrecte. Vérifiez la logique préférentielle et la règle d'inscription (filière vs établissement), puis corrigez.",
    expectedDecision: {
      finalDecision: "A",
      inscriptionType: "F"
    },
    puzzleQuestion:
      "Cas OMEGA :\n- Choix A : maturité bilingue anglais\n- Choix B : maturité gymnasiale\n- L'élève est admissible au bilingue en T2 ET en fin d'année\n\nCe qu'il faut faire (phase 1) :\n1) Déterminez quelle décision devient définitive (A ou B).\n2) Choisissez le type d'inscription :\n   - F = inscription par filière\n   - E = inscription par établissement\n3) Validez ces deux choix dans le formulaire.\n\nPhase 2 : trouvez le PDF OMEGA (recto = signe grec), puis saisissez le code du verso.",
    answer: "R3",
    acceptedVariants: ["r-3", "r 3"],
    hint: "Si le bilingue est admissible en T2 et en fin d'année, il reste le choix final. L'inscription se fait par filière (F). Ensuite, saisissez le code du PDF OMEGA.",
    pedagogicalNote:
      "La saisie valide un parcours de filière ; le mécanisme préférentiel verrouille la décision quand les conditions sont remplies.",
    whatsappCode: "PP26-OMEGA-AF",
    validationMode: "code",
    reward: "Dossier reconstitué : prêt à être montré à l'enseignant.",
    nextStep: null
  }
];
