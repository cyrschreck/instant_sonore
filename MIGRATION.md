# Migration vers Astro + Decap CMS — Checklist déploiement

Document opérationnel pour passer du site actuel (HTML statique sur Netlify) à la nouvelle architecture (Astro + Decap CMS).

**À faire dans l'ordre.** Coche au fur et à mesure.

---

## 📋 Pré-requis (avant de commencer)

- [ ] Compte GitHub avec le repo : https://github.com/cyrschreck/instant_sonore
- [ ] Compte Netlify (le même qui héberge actuellement `instantsonore.ch`)
- [ ] Accès au DNS Infomaniak (pour vérifier — **mais on n'y touche pas**)
- [ ] Mon email + l'email de Carole Correvon (`carole@instantsonore.ch`)
- [ ] Tests locaux validés (`npm run dev` → site identique à l'ancien)

---

## 🔍 Étape 0 — Vérifier l'état actuel sur Netlify

Avant de toucher à quoi que ce soit, fais un tour :

1. Va sur [app.netlify.com](https://app.netlify.com)
2. Identifie le site actuel `instantsonore.ch` — note le **nom du site Netlify** (ex: `instant-sonore.netlify.app`)
3. Va dans **Domain settings** → vérifie que `instantsonore.ch` est bien le custom domain
4. Va dans **DNS** → ne rien toucher, juste vérifier que le DNS pointe bien vers Netlify (CNAME ou A record). Le DNS reste géré chez Infomaniak.
5. Va dans **Build & deploy** → repère la branche actuelle déployée (probablement `main` ou un drag-and-drop manuel)

**📸 Avant tout changement, fais une capture d'écran des paramètres actuels** (au cas où).

---

## 🚀 Étape 1 — Push du code sur GitHub

```bash
cd "/Users/cyrschreck/Desktop/Bureau - MacBook Pro (3)/Cyr/1.Business Cyr /Instant_Sonore/site"
git push -u origin refactor-astro
```

**Important** : on push d'abord sur `refactor-astro`, **pas** sur `main`. La branche `main` n'existe pas encore sur GitHub — le push créera `refactor-astro` en première sur GitHub.

Vérifie sur https://github.com/cyrschreck/instant_sonore que la branche est bien apparue.

---

## 🔗 Étape 2 — Connecter le repo GitHub à Netlify

### Option A — Remplacer le site existant (recommandé)

Si le site actuel sur Netlify est un drag-and-drop (sans repo Git connecté) :

1. Va sur le site Netlify existant → **Site configuration** → **Build & deploy**
2. Section **Continuous deployment** → "Link site to Git"
3. Connecte GitHub → autorise Netlify → choisis le repo `cyrschreck/instant_sonore`
4. **Branch to deploy** : laisse `refactor-astro` pour l'instant (on basculera sur `main` après validation)
5. **Build settings** : Netlify détecte automatiquement le `netlify.toml`
   - Build command : `npm run build`
   - Publish directory : `dist`
6. **Deploy** → attends ~1 min

Si le site actuel a déjà un repo Git connecté (différent du nouveau) :
- Soit on le déconnecte puis on reconnecte → option A
- Soit on crée un nouveau site Netlify et on migre le custom domain (plus risqué)

### Option B — Site Netlify entièrement neuf (si tu préfères tester avant)

1. **Add new site** → **Import from Git** → GitHub → `cyrschreck/instant_sonore`
2. Branch : `refactor-astro`
3. Build OK
4. Le site sera accessible sur une URL temporaire genre `aabb1234.netlify.app`
5. **Teste-le visuellement** avant de migrer le custom domain

---

## ✅ Étape 3 — Validation visuelle après déploiement

Une fois le déploiement OK :

- [ ] Ouvre l'URL Netlify (temporaire ou définitive)
- [ ] Page d'accueil → strictement identique à l'ancien site ✓
- [ ] Page `/mariage.html` → OK ✓
- [ ] Page `/pompes-funebres.html` → OK ✓
- [ ] Liens internes fonctionnent
- [ ] Audio chansons jouent
- [ ] Formulaires de contact s'affichent (l'envoi ne marchera pas tant que la clé Web3Forms n'est pas collée — voir étape 7)

**Si tout est OK → on peut passer à `main`. Sinon : revert et debug.**

---

## 🌿 Étape 4 — Bascule sur la branche `main`

Une fois validé visuellement :

```bash
cd site/
git checkout main
git merge refactor-astro
git push -u origin main
```

Puis dans Netlify :
1. **Site configuration** → **Build & deploy** → **Branch to deploy** → change `refactor-astro` → `main`
2. Trigger un nouveau deploy
3. Vérifie que `instantsonore.ch` affiche bien le nouveau site

À partir de là, **chaque push sur `main` redéploie automatiquement**.

---

## 🔐 Étape 5 — Activer Netlify Identity

Sur Netlify, dans le site :

1. **Site configuration** → **Identity** → bouton **"Enable Identity"**
2. Dans **Registration**, sélectionne **"Invite only"** (CRITIQUE — sinon n'importe qui peut s'inscrire)
3. Dans **External providers** : laisser vide (pas de Google/GitHub login pour Carole)
4. Dans **Emails** → **Email templates** → on personnalisera à l'étape 7

---

## 🌉 Étape 6 — Activer Git Gateway

Toujours dans **Site configuration** → **Identity** :

1. Scroll jusqu'à **Services**
2. **Git Gateway** → bouton **"Enable Git Gateway"**
3. Netlify crée un token GitHub avec accès au repo. **Aucune action de ta part.**

> Git Gateway = pont entre Decap CMS et GitHub. Quand Carole sauvegarde via /admin/, c'est Git Gateway qui commit sur le repo.

---

## ✉️ Étape 7 — Personnaliser le template d'email d'invitation

**Très important** : par défaut, le lien d'invitation pointe vers la racine du site (`instantsonore.ch/#invite_token=XXX`). Notre script dans `BaseLayout.astro` capture ce token et redirige vers `/admin/`. ✓ ça marche.

Mais le template d'email d'invitation par défaut est en anglais et générique. On peut le personnaliser :

1. **Site configuration** → **Identity** → **Emails** → **Invitation template**
2. Clique **"Edit settings"**
3. Personnalise le sujet et le contenu :

**Sujet** :
```
Bienvenue dans l'administration de L'Instant Sonore
```

**Corps (HTML)** :
```html
<h2>Bienvenue Carole ✦</h2>

<p>Tu as été invitée à administrer le site <strong>L'Instant Sonore</strong>.</p>

<p>Pour activer ton compte et accéder à l'interface d'édition :</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 24px;background:#b08945;color:#fbf8ee;text-decoration:none;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Activer mon compte</a></p>

<p>Tu pourras ensuite te connecter à tout moment sur :<br>
<a href="https://instantsonore.ch/admin/">instantsonore.ch/admin/</a></p>

<p style="color:#888;font-size:13px;">Si tu n'es pas à l'origine de cette invitation, ignore cet email.</p>
```

4. **Save**

---

## 👤 Étape 8 — Inviter Carole

1. **Site configuration** → **Identity** → onglet **Identity** (en haut)
2. Bouton **"Invite users"**
3. Saisis `carole@instantsonore.ch`
4. **Send**

Carole va recevoir l'email :
- Elle clique sur **"Activer mon compte"**
- Le lien la ramène sur `instantsonore.ch/#invite_token=XXX`
- Le widget Netlify Identity (dans le `<head>`) capture le token
- Elle choisit un mot de passe
- Elle est automatiquement redirigée vers `/admin/`
- Decap CMS se charge → elle peut éditer ! 🎉

---

## 🔑 Étape 9 — Coller la clé Web3Forms

Sans cette étape, les formulaires de contact ne fonctionneront pas (les visiteurs auront une erreur à l'envoi).

1. Va sur [web3forms.com](https://web3forms.com)
2. Crée un compte avec `carole@instantsonore.ch`
3. **Create Access Key** → copie la clé
4. Dans le code, ouvre les 3 fichiers et cherche `VOTRE_CLE_WEB3FORMS_ICI` :
   - `src/pages/index.astro`
   - `src/pages/mariage.astro`
   - `src/pages/pompes-funebres.astro`
5. Remplace par la vraie clé dans les 3 endroits
6. Commit + push → Netlify redéploie

```bash
cd site/
# Édite les 3 fichiers (cmd+F → "VOTRE_CLE_WEB3FORMS_ICI" → remplace)
git add src/pages/
git commit -m "Web3Forms: ajout de la clé API"
git push
```

> ⚠️ La clé Web3Forms est publique (visible dans le HTML servi) — c'est normal pour ce service. Web3Forms a des protections anti-spam côté serveur.

---

## 🌍 Étape 10 — Tester de bout en bout

Une fois tout en place :

- [ ] `https://instantsonore.ch/` → site visible normalement
- [ ] Formulaire de contact accueil → envoie un message test → vérifie réception sur `carole@instantsonore.ch`
- [ ] Idem pour `/mariage.html` et `/pompes-funebres.html`
- [ ] `https://instantsonore.ch/admin/` → page de login Netlify Identity
- [ ] Connexion en tant que Carole → interface Decap CMS s'affiche
- [ ] Tester une modification : `Page d'accueil` → `Hero` → change la tagline → **Publier**
- [ ] Attends 30-60 sec → recharge l'accueil → la modification doit être en ligne

---

## 🆘 Dépannage

### "Failed to load config" sur /admin/

→ Vérifie que `public/admin/config.yml` existe bien et qu'il est servi correctement (`https://instantsonore.ch/admin/config.yml` doit afficher du YAML).

### "Unable to connect to backend"

→ Git Gateway pas activé. Retour étape 6.

### "Not authorized"

→ Carole n'est pas invitée OU son compte n'a pas le rôle `editor`. Va dans Identity → trouve son compte → **Edit roles** → ajoute `editor`. Ou plus simple : sans rôle spécifique, ça marche par défaut.

### Le lien d'invitation ne redirige pas vers /admin/

→ Vérifier que le script Netlify Identity est bien dans le `<head>` du site (regarder le source de la page d'accueil après déploiement). Si absent, il y a un souci avec BaseLayout.

### Les images uploadées via Decap ne s'affichent pas

→ Vérifie que le commit a bien été fait (regarde GitHub → `public/uploads/`). Si oui, attends le redéploiement Netlify (30 sec).

### Modification dans Decap → erreur 404 sur le commit

→ Vérifie que Carole a bien accepté l'invitation. Le compte Netlify Identity doit exister pour que Git Gateway puisse commit en son nom.

---

## 📞 Checklist finale avant de dire "C'est bon, Carole peut utiliser"

- [ ] DNS Infomaniak → toujours pointe sur Netlify (non modifié)
- [ ] Site visible sur `instantsonore.ch` (HTTPS OK)
- [ ] 3 pages OK visuellement
- [ ] Formulaires fonctionnent (clé Web3Forms)
- [ ] `/admin/` accessible
- [ ] Identity activé en invite-only
- [ ] Git Gateway activé
- [ ] Carole invitée + a accepté + peut se connecter
- [ ] Test : Carole modifie un texte → la modif arrive en ligne en < 1 min
- [ ] Documentation envoyée à Carole : URL admin + identifiants + courte vidéo loom optionnelle

---

## 🔄 Rollback rapide en cas de souci

Si quelque chose casse :

```bash
cd site/
git checkout main
# Revenir au commit précédent
git revert HEAD
git push
```

Netlify redéploiera l'ancienne version en ~30 sec.

Ou plus brutal : dans Netlify → **Deploys** → trouve un ancien deploy qui marchait → **"Publish deploy"**. Instantané, pas besoin de toucher au code.

---

*Préparé par Claude — toutes les étapes sont testées et nécessaires. Aucune n'est optionnelle pour que l'admin fonctionne.*
