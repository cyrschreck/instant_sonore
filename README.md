# L'Instant Sonore — Site + CMS léger

Site web statique de `instantsonore.ch` avec **séparation contenu / présentation** pour permettre une édition facile via un futur dashboard.

## 📐 Architecture

```
site/
├── content.json          ← TOUT le contenu éditable (textes, images, chansons, tarifs, FAQ…)
├── templates/            ← templates Handlebars
│   ├── index.html
│   ├── mariage.html
│   └── pompes-funebres.html
├── build.js              ← script qui fusionne content.json + templates → public/
├── package.json
├── netlify.toml          ← config Netlify (build + redirects)
├── .gitignore
├── public/               ← SORTIE générée (les vraies pages servies)
│   ├── index.html        (généré)
│   ├── mariage.html      (généré)
│   ├── pompes-funebres.html (généré)
│   ├── robots.txt
│   ├── sitemap.xml
│   └── admin/            ← (Phase 2) dashboard
└── netlify/
    └── functions/        ← (Phase 2) fonctions serverless pour la sauvegarde
```

## 🛠 Stack

- **Templating** : [Handlebars](https://handlebarsjs.com/) (templates → HTML)
- **Build** : Node.js script vanilla
- **Hébergement** : Netlify
- **Auth (Phase 2)** : Netlify Identity
- **Storage (Phase 2)** : GitHub via API + Netlify Functions
- **Images** : Cloudinary (compte `dhf3b3pyq`)
- **Formulaires** : Web3Forms
- **Coût total mensuel** : 0 €

## 🚀 Utilisation (développeur)

### Installation

```bash
cd "site/"
npm install
```

### Build

```bash
npm run build
# Lit content.json + templates/, génère public/*.html
```

### Aperçu local (avec serveur HTTP)

```bash
npm run dev
# Build + serve sur http://localhost:3000
```

## 📝 Modifier le contenu manuellement (avant Phase 2)

Tant que le dashboard d'admin n'est pas en place, on édite `content.json` directement :

1. Ouvre `content.json` dans un éditeur
2. Trouve la section à modifier (`index.hero.title`, `index.tarifs.formules[0].price`, etc.)
3. Modifie la valeur (attention : c'est du JSON, respecte les guillemets et virgules)
4. Lance `npm run build`
5. Commit + push GitHub → Netlify déploie automatiquement

### Structure du content.json

```jsonc
{
  "site": { ... },          // infos communes (nom, domaine, tél, email…)
  "library": {
    "songs": { ... },       // bibliothèque de chansons (réutilisables sur les 3 pages)
    "images": { ... }       // bibliothèque d'images Cloudinary (alias → URL)
  },
  "index": {                // contenu de la page d'accueil
    "seo": { ... },
    "hero": { ... },
    "concept": { ... },
    "origine": { ... },
    "piliers": { items: [...] },
    "ecouter": { songs: ["key1", "key2"] },  // référence songs/library
    "processus": { steps: [...] },
    "carole": { ... },
    "tarifs": { formules: [...] },
    "prosGateway": { cards: [...] },
    "faq": { items: [...] },
    "temoignage": { ... },
    "contact": { ... }
  },
  "mariage": { ... },       // contenu de la page Mariage (B2B)
  "pompes": { ... }         // contenu de la page Pompes funèbres (B2B)
}
```

### Exemples d'édition rapide

**Changer le tarif "Instant Unique" :**
```json
"index": { "tarifs": { "formules": [
  { "name": "...", "price": "CHF 350", ... }
]}}
```

**Ajouter une chanson à la page d'accueil :**
1. D'abord ajouter la chanson dans `library.songs` :
   ```json
   "library": { "songs": {
     "ma-nouvelle-chanson": {
       "title": "Ma nouvelle chanson",
       "context": "Mariage · Une déclaration",
       "src": "https://res.cloudinary.com/.../audio.mp3"
     }
   }}
   ```
2. Puis ajouter la clé dans `index.ecouter.songs` :
   ```json
   "ecouter": { "songs": ["quand-les-mots", "ma-nouvelle-chanson", ...] }
   ```

**Modifier une réponse FAQ :**
```json
"faq": { "items": [
  { "question": "...", "answerHtml": "<p>Nouvelle réponse...</p>" }
]}
```

## 🎨 Système de placeholders Handlebars

| Syntaxe | Effet |
|---|---|
| `{{var}}` | Valeur scalaire échappée (sécurité XSS) |
| `{{{var}}}` | Valeur HTML brute (pour les `<em>`, `<strong>`, etc.) |
| `{{#each items}}...{{/each}}` | Boucle sur un tableau |
| `{{#if cond}}...{{/if}}` | Conditionnel |
| `{{img "key"}}` | Résout une image depuis `library.images` |
| `{{#withSong "key"}}{{title}}{{/withSong}}` | Résout une chanson depuis `library.songs` |

## 🌐 Déploiement Netlify

### 1ère fois

1. Créer un repo GitHub avec le contenu de ce dossier
2. Aller sur [netlify.com](https://www.netlify.com) → "Add new site" → "Import from Git"
3. Choisir le repo
4. Build settings (auto-détectés via `netlify.toml`) :
   - Build command : `npm run build`
   - Publish directory : `public`
5. Deploy
6. Configurer le domaine `instantsonore.ch` dans "Domain settings"

### Mises à jour

```bash
git add content.json
git commit -m "Update tarifs"
git push
# Netlify build + deploy auto en ~30 sec
```

## ⚠️ Avant la première mise en ligne

1. **Coller la clé Web3Forms** dans `content.json` (3 endroits où `VOTRE_CLE_WEB3FORMS_ICI` est encore présent — chercher dans templates ou utiliser un futur champ dédié)
   - Récupérer la clé sur [web3forms.com](https://web3forms.com)
2. **Vérifier les images TODO** dans `content.json` :
   - `index.concept.image` — Carole veut changer
   - `index.carole.photo` — actuellement null (placeholder)
   - `mariage.collab.image` — Carole veut changer ("trop anniversaire")
3. **Tester** : `npm run build` puis ouvrir `public/index.html` dans un navigateur

## 📋 Backup

Le dossier `../backup-original/` contient une copie figée des 3 HTML d'origine (avant templating). À conserver en sécurité.

## 🗺️ Roadmap

### ✅ Phase 1 — Fondation (TERMINÉE)
- Architecture content/template séparée
- Build script Handlebars
- Config Netlify
- Tous les contenus extraits dans `content.json`
- 3 templates HTML
- Build testé et fonctionnel

### 🚧 Phase 2 — Admin minimal (à venir)
- Page `/admin/` avec auth Netlify Identity
- Formulaires d'édition (textes uniquement)
- Netlify Function `save-content.js` → commit GitHub
- Carole peut éditer les textes principaux

### 📅 Phase 3 — Médias + chansons
- Intégration Cloudinary Upload Widget
- Gestion des chansons (CRUD + réordonnancement)
- Aperçu en direct des images

### 📅 Phase 4 — Tarifs + drag & drop
- Éditeur de formules tarifaires
- Éditeur FAQ avec réordonnancement
- Drag & drop pour réordonner sections, piliers, idées
- Toggles de visibilité

## 📞 Contact projet

Pour toute question technique : Cyr (créateur du CMS)
Pour modifier le contenu : Carole Correvon · carole@instantsonore.ch · 076 404 32 82
