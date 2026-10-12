// Sitemap généré à chaque build : pages fixes + articles du blog (URLs propres, sans .html)
import { getCollection } from 'astro:content';

export async function GET() {
  const base = 'https://instantsonore.ch';
  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    { loc: '/', priority: '1.0' },
    { loc: '/ecouter', priority: '0.9' },
    { loc: '/pompes-funebres', priority: '0.8' },
    { loc: '/mariage', priority: '0.8' },
    { loc: '/blog', priority: '0.7' }
  ].map((p) => ({ ...p, lastmod: today }));

  const posts = (await getCollection('blog', ({ data }) => !data.draft)).map((p) => ({
    loc: `/blog/${p.slug}`,
    priority: '0.6',
    lastmod: (p.data.updated || p.data.date).toISOString().slice(0, 10)
  }));

  const urls = [...pages, ...posts]
    .map((u) => `  <url><loc>${base}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
