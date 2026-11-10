import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const names = ['index.html', 'variant-a.html', 'variant-b.html'];
const pages = Object.fromEntries(await Promise.all(names.map(async name => [name, await readFile(resolve(root, 'public', name), 'utf8')])));
for (const [name, html] of Object.entries(pages)) {
  assert.match(html, /<!doctype html>/i, `${name}: missing doctype`);
  assert.match(html, /name="viewport"/i, `${name}: missing viewport`);
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  scripts.forEach(([_, attributes, code], i) => {
    if (/type="application\/json"/.test(attributes)) JSON.parse(code);
    else if (!/\bsrc=/.test(attributes) && code.trim()) new Script(code, { filename: `${name}:script-${i + 1}` });
  });
}
const chooser = pages['index.html'];
for (const name of names.slice(1)) assert(chooser.includes(`href="${name}"`), `Missing chooser destination: ${name}`);
const preview = JSON.parse(chooser.match(/<script type="application\/json" id="preview-sources">([\s\S]*?)<\/script>/)[1]);
assert.equal(preview.a, pages['variant-a.html'], 'Variant A preview differs from published source');
assert.equal(preview.b, pages['variant-b.html'], 'Variant B preview differs from published source');
console.log('PASS: three pages, JavaScript syntax, chooser links and exact preview/source parity.');
