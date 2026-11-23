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

test('Winston Command identity is consistent across app surfaces', () => {
  assert.match(html, /<title>Winston Command — AI Trading Command Center<\/title>/);
  assert.match(html, /class="auth-title">WINSTON COMMAND<\/div>/);
  assert.match(html, /class="t1">WINSTON COMMAND<\/div>/);
  assert.doesNotMatch(html, /<title>PULSE\b/i);
});
test('cinematic network enhancements remain attached to interactive stage', () => {
  assert.match(html, /network-stage::after/);
  assert.match(html, /network-panel::before/);
  assert.match(html, /id="networkStage"/);
  assert.match(html, /id="nodeLines"/);
  assert.match(html, /id="worldCanvas"/);
});

test('market-data requests are bounded and session-safe', () => {
  assert.match(html, /function miStop\(\)/);
  assert.match(html, /miGeneration\+\+/);
  assert.match(html, /controller\.abort\(\),12000/);
  assert.match(html, /signal:controller\.signal/);
  assert.match(html, /currentUser = null;\s*miStop\(\)/);
});

test('missing quote fields never masquerade as a zero price', () => {
  const vm = require('node:vm');
  const from = html.indexOf('function miFinite(n){');
  const to = html.indexOf('function miFeedUnavailable(', from);
  assert.ok(from >= 0 && to > from, 'market formatting helpers exist');
  const context = vm.createContext({});
  vm.runInContext(html.slice(from, to), context);
  for (const missing of [null, undefined, '', false]) {
    assert.equal(vm.runInContext('miPrice('+JSON.stringify(missing)+')', context), '—');
  }
  assert.equal(vm.runInContext('miPrice(0)', context), '$0.00');
  assert.equal(vm.runInContext('miNum(null)', context), '—');
  assert.equal(vm.runInContext('miNum(0)', context), '0');
  assert.equal(vm.runInContext('miQuoteTime(null)', context), '—');
  assert.equal(vm.runInContext('miQuoteTime(0)', context), '—');
});

test('market feed refuses missing and stale last-traded prices', () => {
  assert.match(html, /last===null \|\| last<=0/);
  assert.match(html, /age>15\*60\*1000/);
  assert.match(html, /QUOTE STALE/);
  assert.match(html, /Schwab returned no valid last-traded price/);
});
