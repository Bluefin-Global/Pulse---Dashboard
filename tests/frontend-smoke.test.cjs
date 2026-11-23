// Winston Command — non-destructive frontend smoke checks.
// Run: node --test tests/frontend-smoke.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
test('entrypoint is valid HTML with a title', () => {
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<html\b[^>]*lang=["']en["']/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
});
test('authentication UI is retained', () => {
  assert.match(html, /auth-overlay/);
  assert.match(html, /auth-submit/);
});
test('network visualization is retained', () => {
  assert.match(html, /network-stage/);
  assert.match(html, /networkStage/);
});
test('no duplicate static HTML ids', () => {
  // Ignore JavaScript template literals and scripts: this is a conservative
  // static-markup-only check, not a runtime DOM uniqueness guarantee.
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const ids = [...markup.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length,
    'Duplicate static IDs: ' + ids.filter((v,i) => ids.indexOf(v) !== i).join(', '));
});
test('Firebase hosting entrypoint exists', () => {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../firebase.json'), 'utf8'));
  assert.equal(config.hosting.public, 'public');
  assert.ok(fs.existsSync(path.join(__dirname, '../public/index.html')));
});
