# L'Instant Sonore — Site web + CMS

Site statique de **[instantsonore.ch](https://instantsonore.ch)** construit avec **[Astro](https://astro.build)** et administrable via **[Decap CMS](https://decapcms.org)** par Carole Correvon (sans avoir à toucher au code).

---

## 🧱 Stack technique

| Brique | Choix | Pourquoi |
|---|---|---|
| **Framework** | Astro v5 | Site statique = SEO parfait, rendu instantané, hébergement gratuit |
| **CMS** | Decap CMS v3 | Open source, gratuit, interface FR, modifications versionnées dans Git |
| **Auth admin** | Netlify Identity | Gratuit, intégré, invitation par email |
| **Hébergement** | Netlify | Auto-deploy sur push GitHub, CDN mondial |
| **Médias existants** | Cloudinary (compte `dhf3b3pyq`) | Images et audios déjà uploadés, conservés tels quels |
| **Nouveaux médias** | `public/uploads/` (servi par Netlify) | Uploads via Decap → commit Git → déploiement |
| **Formulaires de contact** | [Web3Forms](https://web3forms.com) | Gratuit jusqu'à 250 msg/mois |

**Coût mensuel : 0 €** (tout dans les free tiers).

---

## 📁 Structure du projet

```
site/
├── astro.config.mjs           # Config Astro
├── package.json
├── tsconfig.json
├── netlify.toml               # Config build + redirects Netlify
├── README.md                  # Ce fichier
├── MIGRATION.md               # Actions manuelles Netlify à faire (Cyr)
│
├── public/                    # Fichiers statiques (servis tels quels)
│   ├── admin/
│   │   ├── index.html         # Page d'admin Decap CMS
│   │   └── config.yml         # Configuration des collections
│   ├── uploads/               # Images uploadées via Decap (vide au début)
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── content/               # 🔥 CONTENU ÉDITABLE
│   │   ├── config.ts          # Schémas Zod (validation stricte)
│   │   ├── settings/
│   │   │   └── site.json      # Réglages globaux (téléphone, email…)
│   │   ├── pages/
│   │   │   ├── home.json      # Contenu page d'accueil
│   │   │   ├── mariage.json   # Contenu page Mariage
│   │   │   └── pompes.json    # Contenu page Pompes funèbres
│   │   └── songs/             # Bibliothèque de chansons
│   │       ├── quand-les-mots.md
│   │       ├── ce-qui-reste.md
│   │       └── ... (7 fichiers)
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro   # Head + scripts globaux + Netlify Identity
│   │
│   ├── pages/                 # Pages générées (URLs du site)
│   │   ├── index.astro        # → /
│   │   ├── mariage.astro      # → /mariage.html
│   │   └── pompes-funebres.astro  # → /pompes-funebres.html
│   │
│   └── styles/
│       └── global.css         # CSS global (~3000 lignes, design L'Instant Sonore)
│
└── dist/                       # Sortie du build (généré, non-versionné)
```

---

## 🚀 Développement local

### Prérequis
- **Node.js ≥ 18.17.1** — `brew install node` sur Mac, sinon [nodejs.org](https://nodejs.org)

### Installation (une seule fois)
```bash
cd site
npm install
```

### Lancer le serveur de dev (hot reload)
```bash
npm run dev
# → http://localhost:4321/
```

Modifie un fichier `.astro`, `.json` ou `.md` → la page se met à jour automatiquement.

### Construire le site (production)
```bash
npm run build
# → génère dist/
```

### Prévisualiser le build de production
```bash
npm run preview
```

---

## ✏️ Comment Carole modifie le contenu

Carole va sur **[instantsonore.ch/admin/](https://instantsonore.ch/admin/)**, se connecte avec son email/mot de passe, et navigue dans 5 sections :

### 🛠 Réglages du site
- Nom, domaine, téléphone, email, lieu, année du copyright
- Modification → mise à jour automatique partout

### 🎵 Bibliothèque de chansons
- Ajouter / supprimer / modifier des chansons
- Chaque chanson est **réutilisable** sur les 3 pages (accueil, mariage, pompes funèbres)
- Champs : titre, contexte, URL MP3 (Cloudinary), ordre

### 🏠 Page d'accueil
13 sections éditables, chacune dépliable :
1. SEO (titre onglet, description, mots-clés, partage social)
2. Hero (titre principal, tagline, image, 2 boutons)
3. Concept (citation, paragraphe, image)
4. Origine (histoire complète de Carole)
5. Piliers (3 moments : Célébration, Transition, Hommage)
6. Écouter (sélection de chansons depuis la bibliothèque)
7. Processus (5 étapes)
8. Carole (paragraphes "Qui je suis")
9. Tarifs (3 formules : nom, prix, inclusions)
10. Pros gateway (cartes mariage + pompes)
11. FAQ (8 questions/réponses)
12. Témoignage
13. Contact (lead, libellé bouton, messages)

### 💍 Page Mariage (B2B wedding planners)
12 sections : SEO, hero, manifesto, pourquoi, apports (5), idées (5), écouter, processus (3 étapes), redirect tarifs, collaboration, carole, contact

### 🕊 Page Pompes funèbres (B2B)
11 sections : SEO, hero, manifesto, pourquoi, apports (5), écouter, processus (4 étapes), redirect tarifs, collaboration, carole, contact

### 🖼 Images
- **Images existantes** : URLs Cloudinary collées dans le champ. Carole peut les remplacer en collant une autre URL.
- **Nouvelles images** : bouton "Upload" dans Decap → l'image est sauvegardée dans `public/uploads/` et commit auto.

### 🎨 Mise en forme dans les textes
Pour mettre des mots en valeur :
- `<em>mot</em>` → mot en italique doré (typo Fraunces)
- `<strong>mot</strong>` → mot en gras foncé
- `<br/>` → saut de ligne dans un titre
- `<a href="https://...">texte</a>` → lien cliquable

Decap accepte ces balises HTML dans tous les champs texte.

---

## 🔄 Workflow de modification

```
┌─────────────────┐      ┌─────────────────────┐      ┌──────────────────┐
│  Carole édite   │      │  Decap commit auto  │      │ Netlify rebuild  │
│  sur /admin/    │ ───▶ │  sur GitHub         │ ───▶ │ + déploiement    │
│                 │      │  (branche main)     │      │ (~30 secondes)   │
└─────────────────┘      └─────────────────────┘      └──────────────────┘
```

**Carole n'a jamais à toucher au code ou à GitHub.** Elle édite via l'interface web, clique "Publier", et le site est mis à jour automatiquement.

---

## 🚢 Déploiement

Voir **[MIGRATION.md](./MIGRATION.md)** pour la liste des actions à faire dans Netlify après le premier push (activation Identity, Git Gateway, invitation de Carole).

---

## 🛡 Backup & rollback

- **Backup automatique** : toutes les modifications sont versionnées dans Git (sur GitHub). On peut revenir à n'importe quelle version.
- **Backup local figé** : le dossier `../backup-original/` contient la copie HTML des pages avant migration Astro (référence visuelle).

---

## 🔧 Pour le développeur (Cyr) — modifier le code

### Ajouter une nouvelle section à une page

1. Ajouter le schéma dans `src/content/config.ts` (Zod)
2. Ajouter le contenu correspondant dans `src/content/pages/home.json` (ou mariage/pompes)
3. Ajouter le markup dans la page `.astro` correspondante (`src/pages/`)
4. Ajouter les widgets Decap dans `public/admin/config.yml`
5. `npm run build` pour valider
6. Commit + push

### Modifier le design (CSS)

`src/styles/global.css` — Le CSS est consolidé en un seul fichier. Cherche la section concernée par son commentaire (`/* === Hero === */`).

### Ajouter une nouvelle page

1. Créer `src/pages/nouvelle-page.astro`
2. Créer le schéma dans `src/content/config.ts`
3. Créer `src/content/pages/nouvelle-page.json`
4. Ajouter la collection dans `public/admin/config.yml`
5. Mettre à jour la nav dans toutes les pages (et `BaseLayout` si besoin)
6. Ajouter l'URL au `sitemap.xml`

---

## ⚙️ Configuration formulaires (Web3Forms)

Les 3 formulaires de contact (accueil, mariage, pompes) envoient les messages à `carole@instantsonore.ch` via Web3Forms.

**À faire une fois** :
1. Aller sur [web3forms.com](https://web3forms.com) → créer un compte avec `carole@instantsonore.ch`
2. Récupérer la clé d'accès
3. Dans le code, chercher `VOTRE_CLE_WEB3FORMS_ICI` (présent dans les 3 fichiers `.astro` de `src/pages/`)
4. Remplacer par la vraie clé
5. Commit + push → Netlify redéploie

---

## 📞 Contact projet

- **Site administrable par** : Carole Correvon · carole@instantsonore.ch · 076 404 32 82
- **Maintenance technique / dev** : Cyr

---

*L'Instant Sonore — Carole Correvon · Echallens, Vaud · Suisse romande*
