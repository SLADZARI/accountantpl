import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const html = readFileSync("dist/index.html", "utf8");
const js = html.match(/<script\b[^>]*\bsrc="(\/assets\/[^"]+\.js)"/);
const css = html.match(/<link\b[^>]*\bhref="(\/assets\/[^"]+\.css)"/);
assert.ok(js, "Missing bundled module JavaScript in output HTML");
assert.ok(css, "Missing bundled CSS in output HTML");
for (const file of [js[1], css[1]]) {
  assert.ok(existsSync(join("dist", file.slice(1))), "Missing output asset: "+file);
}
console.log("Built HTML references bundled JS and CSS: PASS");
