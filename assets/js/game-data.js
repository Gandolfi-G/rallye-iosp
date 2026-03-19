export const GAME_CONFIG = {
  id: "mission-plainpalais-2026",
  title: "Mission Plainpalais 2026",
  subtitle: "Jeu de piste orientation - 11CO LS",
  targetDurationMinutes: 30,
  narrative:
    "Le dossier de préparation des parcours 2026 a été fragmenté. Votre équipe doit récupérer 6 fragments et vérifier qu'ils forment une saisie cohérente avant la clôture.",
  missionRules: [
    "Déplacez-vous uniquement dans des zones publiques et sûres de Plainpalais.",
    "Chaque énigme exige un code de balise terrain affiché sur place.",
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
    title: "Fragment Alpha - Les Quatre Portes",
    location: "Grande esplanade de Plainpalais (zone ouverte avec bancs, arbres, marquages)",
    narration:
      "Le premier fragment est verrouillé : il faut classer correctement les 4 voies d'orientation.",
    terrainInstruction:
      "Étape en 2 phases : 1) validez d'abord le tri des filières dans l'application ; 2) trouvez ensuite la balise ALPHA sur place et relevez son code.",
    precheckType: "sort-filieres",
    precheckPrompt:
      "Placez les 4 filières au bon endroit pour les règles A, B, C, D, puis validez le tri.",
    precheckSuccessMessage:
      "Tri validé. Vous pouvez maintenant chercher la balise ALPHA et saisir son code.",
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
    onSiteClue:
      "Balise ALPHA: carte plastifiée format A6 fixée sous l'assise du banc principal (face intérieure).",
    puzzleQuestion:
      "Phase 1: utilisez la zone de tri ci-dessous pour placer correctement les filières A, B, C, D.\nPhase 2: une fois le tri validé, trouvez la balise ALPHA et saisissez uniquement son code.",
    answer: "K2",
    acceptedVariants: ["k-2", "k 2"],
    hint: "Pour le tri: A=SeFoP, B=Collège, C=CFP Commerce, D=ECG. Ensuite, il faut uniquement le code balise ALPHA.",
    pedagogicalNote:
      "On choisit d'abord une filière (Collège, ECG, CFP Commerce, SeFoP), pas un établissement précis.",
    whatsappCode: "PP26-ALPHA-SCCE",
    validationMode: "code",
    reward: "Fragment Alpha récupéré : la carte des filières est réassemblée.",
    nextStep: "pp-02",
    fallbackNote:
      "Si la zone choisie est trop dense, déplacez-vous vers une autre zone ouverte de Plainpalais avec les mêmes repères urbains."
  },
  {
    id: "pp-02",
    title: "Fragment Beta - Dossier ECG",
    location: "Bordure arborée ou allée latérale de la place",
    narration:
      "Le second fragment vous confie le dossier d'une élève de 11e : à vous de vérifier les accès aux 7 pôles ECG.",
    terrainInstruction:
      "Étape en 2 phases : 1) cochez OUI/NON pour les 7 pôles ECG à partir des notes ; 2) trouvez la balise BETA et relevez son code.",
    precheckType: "ecg-poles",
    precheckPrompt:
      "Analysez les notes de l'élève et indiquez OUI ou NON pour chaque pôle ECG (accès en 2e année). Les critères ne sont pas affichés: utilisez le PDF de règles fourni par l'enseignant.",
    precheckSuccessMessage:
      "Analyse validée. Vous pouvez maintenant chercher la balise BETA et saisir son code.",
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
    onSiteClue:
      "Balise BETA: carte plastifiée fixée à hauteur des yeux sur un potelet en bordure arborée (côté intérieur de la place).",
    puzzleQuestion:
      "Phase 1: complétez le tableau OUI/NON des 7 pôles ECG à partir des notes.\nImportant: les critères d'admission ne sont pas affichés ici. Vous devez les retrouver dans le PDF de référence distribué par l'enseignant.\nPhase 2: quand le tableau est validé, trouvez la balise BETA et saisissez uniquement son code.",
    answer: "M4",
    acceptedVariants: ["m-4", "m 4"],
    hint: "Cherchez les critères exacts dans le PDF. Ne mettez pas tout à OUI. Ensuite, il faut uniquement le code balise BETA.",
    pedagogicalNote:
      "Les acces ECG dependent de seuils differents selon le pole ; il faut verifier les notes critere par critere.",
    whatsappCode: "PP26-BETA-ECG7",
    validationMode: "code",
    reward: "Fragment Beta recupere : le dossier ECG est valide.",
    nextStep: "pp-03",
    fallbackNote:
      "Si la bordure arborée n'est pas praticable, utilisez un autre alignement visuel stable (bord de place ou rangée de bancs)."
  },
  {
    id: "pp-03",
    title: "Fragment Gamma - Coffre des Codes",
    location: "Zone de marquages au sol (lignes de sport, quadrillage ou bandes urbaines)",
    narration:
      "Un coffre chiffré demande de manipuler des codes de filière réels.",
    terrainInstruction:
      "Étape en 2 phases : 1) calculez d'abord le total demandé ; 2) trouvez ensuite la balise GAMMA et relevez son code.",
    precheckType: "gamma-total",
    precheckPrompt:
      "Calculez la somme demandée puis validez votre total avant de chercher la balise.",
    precheckSuccessMessage:
      "Total validé. Vous pouvez maintenant chercher la balise GAMMA et saisir son code.",
    precheckErrorMessage:
      "Total incorrect. Reprenez le calcul des deux derniers chiffres puis corrigez.",
    expectedTotal: "145",
    onSiteClue:
      "Balise GAMMA: carte plastifiée collée sous une rambarde basse ou au dos d'un panneau proche des marquages.",
    puzzleQuestion:
      "Phase 1: utilisez les codes de filière et calculez :\n- Maturité gymnasiale : 0287\n- ECG Pédagogie : 2906\n- SeFoP : 2152\nPrenez les deux derniers chiffres de chaque code et additionnez-les, puis validez le total.\nPhase 2: trouvez la balise GAMMA et saisissez uniquement son code.",
    answer: "Q7",
    acceptedVariants: ["q-7", "q 7"],
    hint: "87 + 06 + 52. Ensuite, il faut uniquement le code balise GAMMA.",
    pedagogicalNote:
      "Les codes de filière servent à identifier des parcours précis ; ils peuvent être transformés en cadenas logiques.",
    whatsappCode: "PP26-GAMMA-145",
    validationMode: "screenshot",
    reward: "Fragment Gamma récupéré : le coffre numérique est ouvert.",
    nextStep: "pp-04",
    fallbackNote:
      "Si aucun marquage n'est disponible, faites le calcul depuis un banc ; le repère visuel sert surtout à rythmer l'étape."
  },
  {
    id: "pp-04",
    title: "Fragment Delta - L'Intrus Langues",
    location: "Proximité d'un panneau urbain fixe ou d'un mobilier signalétique",
    narration:
      "Un dossier contient une proposition linguistique impossible. À vous de l'isoler.",
    terrainInstruction:
      "Placez-vous près d'un panneau stable (signal urbain, totem, indication fixe). Repérez la balise DELTA et notez son code de 2 caractères.",
    onSiteClue:
      "Balise DELTA: carte plastifiée derrière un panneau urbain fixe, attachée avec collier réutilisable.",
    puzzleQuestion:
      "Une seule proposition est impossible selon les règles :\nA) CFC Commerce : anglais + allemand\nB) ECG projet primaire : anglais + allemand\nC) SeFoP : anglais + italien\nD) ECG autre projet : allemand + italien\nRéponse attendue = lettre + code balise DELTA (sans espace).",
    answer: "CT1",
    acceptedVariants: ["c-t1", "option c t1", "c t 1"],
    hint: "SeFoP ne demande aucun choix de langue. Sans code DELTA, la réponse n'est pas acceptée.",
    pedagogicalNote:
      "Les contraintes de langues dépendent fortement de la filière ; SeFoP est le cas le plus simple (aucun choix).",
    whatsappCode: "PP26-DELTA-C",
    validationMode: "code",
    reward: "Fragment Delta récupéré : les incompatibilités de langues sont neutralisées.",
    nextStep: "pp-05",
    fallbackNote:
      "Si aucun panneau n'est accessible, utilisez un autre élément fixe identifiable (borne, plan urbain, potelet signalétique)."
  },
  {
    id: "pp-05",
    title: "Fragment Epsilon - Tri OS/DF",
    location: "Point central visible (statue, centre de place, repère monumental)",
    narration:
      "Le cinquième fragment impose un tri de cohérence sur les choix OS/DF du Collège.",
    terrainInstruction:
      "Étape en 2 phases : 1) classez correctement les trois propositions ; 2) trouvez la balise EPSILON et relevez son code.",
    precheckType: "rank-order",
    precheckPrompt:
      "Attribuez un rang (1, 2, 3) à chaque proposition pour aller du plus cohérent au moins cohérent.",
    precheckSuccessMessage:
      "Classement validé. Vous pouvez maintenant chercher la balise EPSILON et saisir son code.",
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
    onSiteClue:
      "Balise EPSILON: carte plastifiée sous la tablette d'un banc orienté vers le centre de la place.",
    puzzleQuestion:
      "Phase 1: classez les 3 propositions du plus cohérent au moins cohérent dans la zone de classement.\nPhase 2: une fois le classement validé, trouvez la balise EPSILON et saisissez uniquement son code.",
    answer: "L8",
    acceptedVariants: ["l-8", "l 8"],
    hint: "A respecte une regle explicite. B viole une incompatibilite directe. C est partiellement coherent mais incomplet. Ensuite, il faut uniquement le code balise EPSILON.",
    pedagogicalNote:
      "Au Collège, OS et DF ne peuvent pas dupliquer la même discipline ; certaines OS imposent des conditions supplémentaires.",
    whatsappCode: "PP26-EPSILON-ACB",
    validationMode: "screenshot",
    reward: "Fragment Epsilon récupéré : la matrice OS/DF est stabilisée.",
    nextStep: "pp-06",
    fallbackNote:
      "Si le repère central est inaccessible, choisissez un point ouvert bien identifiable par toute l'équipe."
  },
  {
    id: "pp-06",
    title: "Fragment Omega - Décision Finale",
    location: "Zone calme en bord de place pour la synthèse",
    narration:
      "Dernier contrôle avant transmission du dossier final 2026.",
    terrainInstruction:
      "Étape en 2 phases : 1) validez d'abord la décision finale ; 2) trouvez ensuite la balise OMEGA et relevez son code.",
    precheckType: "omega-decision",
    precheckPrompt:
      "Choisissez la décision finale (A ou B) et le type d'inscription (F ou E), puis validez.",
    precheckSuccessMessage:
      "Décision validée. Vous pouvez maintenant chercher la balise OMEGA et saisir son code.",
    precheckErrorMessage:
      "Décision incorrecte. Reprenez les règles du cas final et corrigez vos choix.",
    expectedDecision: {
      finalDecision: "A",
      inscriptionType: "F"
    },
    onSiteClue:
      "Balise OMEGA: carte plastifiée à l'arrière d'une borne fixe en zone calme (hors flux principal).",
    puzzleQuestion:
      "Cas final :\n- Choix A : maturité bilingue anglais\n- Choix B : maturité gymnasiale\n- Admissible au bilingue en T2 et en fin d'année\nPhase 1: validez d'abord la decision finale et le type d'inscription.\nPhase 2: trouvez la balise OMEGA et saisissez uniquement son code.",
    answer: "R3",
    acceptedVariants: ["r-3", "r 3"],
    hint: "Le bilingue admissible en T2 et fin d'année devient définitif et préférentiel. Ensuite, il faut uniquement le code balise OMEGA.",
    pedagogicalNote:
      "La saisie valide un parcours de filière ; le mécanisme préférentiel verrouille la décision quand les conditions sont remplies.",
    whatsappCode: "PP26-OMEGA-AF",
    validationMode: "code",
    reward: "Dossier reconstitué : prêt à être montré à l'enseignant.",
    nextStep: null,
    fallbackNote:
      "S'il y a trop de bruit, déplacez-vous simplement de quelques mètres vers une zone plus calme pour conclure."
  }
];
