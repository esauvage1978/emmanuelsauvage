/**
 * One-shot : extrait le corps HTML des articles .astro (sans BlogIllustration)
 * pour migration vers src/content/blog/*.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const blogPages = path.join(root, 'src/pages/blog');
const outDir = path.join(root, 'src/content/blog');

fs.mkdirSync(outDir, { recursive: true });

const dirs = fs.readdirSync(blogPages).filter((d) => {
	const p = path.join(blogPages, d);
	return fs.statSync(p).isDirectory() && d !== 'node_modules';
});

for (const dir of dirs) {
	const f = path.join(blogPages, dir, 'index.astro');
	if (!fs.existsSync(f)) continue;
	let s = fs.readFileSync(f, 'utf8');
	const openTag = '<BlogArticleLayout';
	const openIdx = s.indexOf(openTag);
	if (openIdx === -1) continue;
	const openEnd = s.indexOf('>', s.indexOf('>', openIdx) + 1); // wrong - BlogArticleLayout has multiline props
	// Find first line with BlogArticleLayout opening - actually find `>` that closes opening tag after all props
	const re = /<BlogArticleLayout[\s\S]*?>/;
	const m = s.match(re);
	if (!m) continue;
	const openEndIdx = m.index + m[0].length;
	const closeIdx = s.lastIndexOf('</BlogArticleLayout>');
	let body = s.slice(openEndIdx, closeIdx);
	body = body.replace(/\s*<BlogIllustration[\s\S]*?\/>/s, '');
	body = body.replace(/^\s*\n/, '');
	// Optional: strip leading tabs from whole block for cleaner md
	fs.writeFileSync(path.join(outDir, `${dir}.body.html`), body.trimEnd() + '\n', 'utf8');
	console.log('Wrote', dir);
}
