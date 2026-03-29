/**
 * Supprime les tabulations en début de ligne dans les articles Markdown.
 * Sans cela, CommonMark traite le corps comme un bloc de code indenté → HTML affiché en texte brut.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '..', 'src', 'content', 'blog');

function dedentLeadingTabs(text) {
	return text
		.split('\n')
		.map((line) => {
			let l = line;
			while (l.startsWith('\t')) {
				l = l.slice(1);
			}
			return l;
		})
		.join('\n');
}

for (const name of fs.readdirSync(dir)) {
	if (!name.endsWith('.md')) continue;
	const fp = path.join(dir, name);
	let s = fs.readFileSync(fp, 'utf8');
	const parts = s.split(/^---\s*$/m);
	if (parts.length < 3) {
		console.warn('Skip (no frontmatter):', name);
		continue;
	}
	const before = parts[0];
	const fm = parts[1];
	const body = parts.slice(2).join('---');
	const newBody = dedentLeadingTabs(body);
	const out = `${before}---${fm}---${newBody}`;
	fs.writeFileSync(fp, out, 'utf8');
	console.log('OK', name);
}
