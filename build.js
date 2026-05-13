#!/usr/bin/env node
/**
 * L'Instant Sonore — Build script
 *
 * Lit content.json + templates/*.html et génère public/*.html
 * Utilisation : `npm run build`
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const ROOT = __dirname;
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CONTENT_PATH = path.join(ROOT, 'content.json');

// ── Helpers Handlebars ─────────────────────────────────────
// {{{raw}}} = rendu HTML brut (déjà géré nativement avec 3 accolades)

// Helper pour résoudre une référence d'image par sa clé
Handlebars.registerHelper('img', function (key) {
  const content = this.__root || {};
  const lib = content.library?.images || {};
  return lib[key] || key; // fallback : retourne la clé si non trouvée
});

// Helper pour résoudre une chanson par sa clé
Handlebars.registerHelper('song', function (key, field) {
  const content = this.__root || {};
  const lib = content.library?.songs || {};
  const s = lib[key];
  if (!s) return '';
  return s[field] || '';
});

// Helper d'égalité (pour conditions)
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// Helper "sub" pour résoudre une chanson complète et exposer ses champs
// Usage : {{#withSong "key"}}{{title}} — {{src}}{{/withSong}}
Handlebars.registerHelper('withSong', function (key, options) {
  const content = options.data.root;
  const lib = content.library?.songs || {};
  const song = lib[key];
  if (!song) return '';
  return options.fn(song);
});

// ── Logique de build ───────────────────────────────────────
function build() {
  console.log('🔨 Build L\'Instant Sonore — démarrage...\n');

  // 1. Charger le contenu
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
  content.__root = content; // pour permettre l'accès depuis les helpers

  // 2. Pages à générer
  const pages = [
    { template: 'index.html', output: 'index.html', dataKey: 'index' },
    { template: 'mariage.html', output: 'mariage.html', dataKey: 'mariage' },
    { template: 'pompes-funebres.html', output: 'pompes-funebres.html', dataKey: 'pompes' }
  ];

  let allOk = true;

  pages.forEach(({ template, output, dataKey }) => {
    const tplPath = path.join(TEMPLATES_DIR, template);
    const outPath = path.join(PUBLIC_DIR, output);

    if (!fs.existsSync(tplPath)) {
      console.error(`  ✗ Template manquant : ${template}`);
      allOk = false;
      return;
    }

    try {
      const tplSource = fs.readFileSync(tplPath, 'utf8');
      const tpl = Handlebars.compile(tplSource, { noEscape: false });

      // Contexte : la sous-clé spécifique + accès à site et library via root
      const ctx = {
        ...content[dataKey],
        site: content.site,
        library: content.library,
        __root: content
      };

      const html = tpl(ctx);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf8');

      const sizeKb = (html.length / 1024).toFixed(1);
      console.log(`  ✓ ${output.padEnd(28)} ${sizeKb} KB`);
    } catch (err) {
      console.error(`  ✗ Erreur sur ${template}:`, err.message);
      allOk = false;
    }
  });

  // 3. Copier les fichiers statiques (robots.txt, sitemap.xml restent dans public/)
  // Note : ils ne sont pas templatés, mais peuvent être régénérés ici si besoin

  console.log(allOk ? '\n✅ Build terminé avec succès.' : '\n❌ Build terminé avec erreurs.');
  process.exit(allOk ? 0 : 1);
}

build();
