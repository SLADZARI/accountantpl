import './check.mjs';
import { cp, mkdir, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const out = new URL('dist/', root);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const name of ['index.html', 'variant-a.html', 'variant-b.html']) {
  await cp(new URL(`public/${name}`, root), new URL(name, out));
}
console.log('Built dist/: chooser + Accounting Workspace + Financial Clarity.');
