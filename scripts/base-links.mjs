// The kb links to /kb/... from the site root; on GitHub Pages the site lives under BASE_PATH.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const base = process.env.BASE_PATH ?? '';
if (base) {
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
  for (const file of walk('docs').filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    const fixed = html.replaceAll('href="/kb', `href="${base}/kb`);
    if (fixed !== html) writeFileSync(file, fixed);
  }
}
