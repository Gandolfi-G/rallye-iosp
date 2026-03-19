# Mission Plainpalais 2026 - Jeu de piste orientation (statique)

Projet web **100% statique** (HTML/CSS/JavaScript vanilla) pour un jeu de piste pédagogique mobile-first à Plainpalais (Genève), destiné à des élèves de 11CO LS.

## 1) Objectif pédagogique
Le jeu transforme les règles d'orientation en défis courts :
- tri des filières (Collège, ECG, CFP Commerce, SeFoP),
- logique choix A / choix B / préférentiel,
- cas spécial SeFoP en choix A,
- codes de filières,
- contraintes de langues,
- cohérence OS/DF.

## 2) Sources de vérité utilisées
- `docs/brief-pedagogique.md`
- `docs/regles-orientation.json`

Les fichiers originaux sont aussi conservés à la racine du dépôt.

## 3) Arborescence

```text
.
├── index.html
├── teacher.html
├── assets
│   ├── css
│   │   └── styles.css
│   └── js
│       ├── app.js
│       ├── game-data.js
│       ├── storage.js
│       ├── teacher.js
│       ├── ui.js
│       └── utils.js
├── docs
│   ├── README-enseignant.md
│   ├── brief-pedagogique.md
│   └── regles-orientation.json
├── brief-pedagogique.md
└── regles-orientation.json
```

## 4) Tester localement
Utiliser un mini serveur local (recommandé, nécessaire pour les modules JS) :
- lancer un serveur (exemple Python) :
  ```bash
  python3 -m http.server 8080
  ```
- ouvrir `http://localhost:8080`.

## 5) Déploiement GitHub Pages
1. Pousser ce dossier dans un dépôt GitHub.
2. Aller dans `Settings` -> `Pages`.
3. Source : `Deploy from a branch`.
4. Branche : `main` (ou `master`), dossier `/ (root)`.
5. Enregistrer, puis ouvrir l'URL Pages fournie.

Aucun build n'est nécessaire.

## 6) Modifier les énigmes
Tout est centralisé dans `assets/js/game-data.js`.

Chaque étape suit cette structure :
- `id`
- `title`
- `narration`
- `greekLetter`
- `greekPdfCode`
- `greekGlyph`
- `puzzleQuestion`
- `answer`
- `acceptedVariants`
- `hint`
- `pedagogicalNote`
- `whatsappCode`
- `nextStep`

Les réponses s'appuient désormais sur 6 PDFs grecs (recto symbole, verso code).

## 7) Changer les codes WhatsApp
Éditer uniquement `whatsappCode` dans `assets/js/game-data.js`.

Le mode enseignant (`teacher.html`) lit automatiquement ces codes et les affiche.

## 8) Stockage local
La progression est stockée dans `localStorage` avec la clé :
- `rally_plainpalais_orientation_v1`

Contenu local :
- nom d'équipe,
- étape courante,
- étapes validées,
- tentatives,
- utilisation des indices,
- horodatage et codes de validation.

## 9) PDFs à imprimer
Les 6 fichiers PDF recto-verso sont générés dans `docs/pdfs-plainpalais` :
- `plainpalais-alpha.pdf`
- `plainpalais-beta.pdf`
- `plainpalais-gamma.pdf`
- `plainpalais-delta.pdf`
- `plainpalais-epsilon.pdf`
- `plainpalais-omega.pdf`

Régénération:
```bash
python3 scripts/generate_plainpalais_pdf_cards.py
```

## 10) Améliorations possibles
- ajouter un mode "deux niveaux d'indices" (indice léger puis indice fort),
- ajouter un export JSON du récapitulatif final,
- ajouter un mode "chrono pénalisé" selon le nombre d'indices,
- proposer plusieurs parcours de difficulté en dupliquant le tableau d'étapes,
- intégrer une version multilingue FR/EN pour classes bilingues.
