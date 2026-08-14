#!/usr/bin/env node
/**
 * validate-engines.mjs — reliability safety net for searchAIO.
 *
 * Parses the single-file app (index.html) and asserts the invariants that,
 * when violated, silently break the search router:
 *
 *   • duplicate prefix / bang keys (JS keeps the last — typo wins silently)
 *   • a !bang that points at a prefix that no longer exists
 *   • an alias whose aliasFor target is missing (or is itself an alias)
 *   • a radio button whose value isn't a real engine (dead UI button)
 *   • an engine with a missing/unknown `cat` (vanishes from the chip picker)
 *   • a category tab or engine `cat` with no .wiki-section to render into
 *   • engines missing both `url` and `isAlias` (nothing to open)
 *
 * Warnings (do NOT fail the build) flag smells worth a human glance:
 *   • http:// engine URLs (mixed-content: blocked on the HTTPS GitHub Pages site)
 *   • promptBased engines missing the 📋 name marker (CONTEXT.md convention)
 *   • engines unreachable from the UI (no radio AND not in any category)
 *
 * Zero dependencies. Runs on the Node that ships with GitHub runners:
 *     node tools/validate-engines.mjs
 * Exits non-zero if any ERROR is found, so CI goes red before a break ships.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.argv[2] || join(ROOT, 'index.html');
const HTML = readFileSync(TARGET, 'utf8');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/**
 * Extract a balanced `{...}` object literal that follows `marker` in `src`.
 * String- and comment-aware, so `https://` inside a value and `// AMMPS`
 * comments inside the object don't fool the brace counter.
 * Returns the literal text including the outer braces.
 */
function extractObjectLiteral(src, marker) {
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`marker not found: ${marker}`);
  let i = src.indexOf('{', start);
  if (i === -1) throw new Error(`no opening brace after: ${marker}`);
  const open = i;
  let depth = 0;
  let str = null;       // current string delimiter, or null
  let line = false;     // inside // line comment
  let block = false;    // inside /* block comment
  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1], p = src[i - 1];
    if (line) { if (c === '\n') line = false; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; i++; } continue; }
    if (str) { if (c === str && p !== '\\') str = null; continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '/' && n === '/') { line = true; i++; continue; }
    if (c === '/' && n === '*') { block = true; i++; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(open, i + 1); }
  }
  throw new Error(`unbalanced braces after: ${marker}`);
}

/** Evaluate a pure data object literal (no external refs) into a JS object. */
function evalLiteral(literal, label) {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`return (${literal});`)();
  } catch (e) {
    err(`could not parse ${label}: ${e.message}`);
    return {};
  }
}

/** Count top-level keys in an object literal to catch duplicates JS would hide. */
function findDuplicateKeys(literal, keyRegex) {
  const seen = new Map();
  const dups = new Set();
  let m;
  while ((m = keyRegex.exec(literal)) !== null) {
    const k = m[1];
    seen.set(k, (seen.get(k) || 0) + 1);
    if (seen.get(k) > 1) dups.add(k);
  }
  return [...dups];
}

// ── Extract the data structures ────────────────────────────────────────────
const enginesLit = extractObjectLiteral(HTML, 'const searchEngines = {');
const bangLit    = extractObjectLiteral(HTML, 'const BANG_MAP = {');
const catLit     = extractObjectLiteral(HTML, 'const ENGINE_CATEGORIES = {');

const searchEngines     = evalLiteral(enginesLit, 'searchEngines');
const BANG_MAP          = evalLiteral(bangLit, 'BANG_MAP');
const ENGINE_CATEGORIES = evalLiteral(catLit, 'ENGINE_CATEGORIES');
const validCats         = new Set(Object.keys(ENGINE_CATEGORIES));

// Radio button values, attribute-order independent.
const radioValues = [];
for (const tag of HTML.match(/<input\b[^>]*>/g) || []) {
  if (!/name="searchEngine"/.test(tag)) continue;
  const v = tag.match(/value="([^"]*)"/);
  if (v) radioValues.push(v[1]);
}

const engineKeys = new Set(Object.keys(searchEngines));

// ── Duplicate keys (silent data loss) ───────────────────────────────────────
for (const k of findDuplicateKeys(enginesLit, /(?:^|[\n{])\s*'([^']+)'\s*:\s*\{/g))
  err(`duplicate engine prefix in searchEngines: '${k}'`);
for (const k of findDuplicateKeys(bangLit, /'(![\w-]+)'\s*:/g))
  err(`duplicate bang token in BANG_MAP: '${k}'`);
for (const v of findDuplicateKeys(`${radioValues.map(v => `'${v}':`).join('')}`, /'([^']+)':/g))
  err(`duplicate radio button for prefix: '${v}'`);

// ── Engine entries are well-formed ──────────────────────────────────────────
for (const [prefix, eng] of Object.entries(searchEngines)) {
  if (!prefix.endsWith(':')) warn(`engine prefix should end with ':' → '${prefix}'`);
  if (!eng.name) err(`engine '${prefix}' has no name`);
  if (!eng.url && !eng.isAlias) err(`engine '${prefix}' has neither url nor isAlias (nothing to open)`);
  if (eng.isAlias) {
    if (!eng.aliasFor) err(`alias '${prefix}' has no aliasFor`);
    else if (!engineKeys.has(eng.aliasFor)) err(`alias '${prefix}' points to missing engine '${eng.aliasFor}'`);
    else if (searchEngines[eng.aliasFor].isAlias) err(`alias '${prefix}' points to another alias '${eng.aliasFor}'`);
  }
  if (eng.url && eng.url.startsWith('http://'))
    warn(`engine '${prefix}' uses http:// (mixed-content: blocked on the HTTPS site) → ${eng.url}`);
  if (eng.promptBased && !/📋/.test(eng.name))
    warn(`promptBased engine '${prefix}' missing 📋 marker in name (CONTEXT.md convention)`);
  for (const flag of ['plusEncoding', 'isAlias', 'promptBased'])
    if (flag in eng && typeof eng[flag] !== 'boolean')
      err(`engine '${prefix}' field '${flag}' should be boolean`);
}

// ── Bang map points only at real engines ────────────────────────────────────
for (const [token, target] of Object.entries(BANG_MAP)) {
  if (!token.startsWith('!')) err(`bang token must start with '!' → '${token}'`);
  if (!engineKeys.has(target)) err(`bang '${token}' → '${target}' which is not a real engine`);
}

// ── Radio buttons map only to real engines ──────────────────────────────────
for (const v of radioValues)
  if (!engineKeys.has(v)) err(`radio button value '${v}' is not a real engine`);

// ── Every engine declares a category the UI knows how to render ─────────────
// `cat` drives both the source-label emoji and which chip section the engine
// lands in, so an engine without one (or with a typo'd one) silently vanishes
// from the picker. The chip grid is generated from this — there is no separate
// list of prefixes that can drift out of sync any more.
const sectionCats = new Set(
  [...HTML.matchAll(/<div class="wiki-section" data-section="([^"]+)"/g)].map(m => m[1])
);
for (const [prefix, eng] of Object.entries(searchEngines)) {
  if (!eng.cat) { err(`engine '${prefix}' has no cat (won't appear in the picker)`); continue; }
  if (!validCats.has(eng.cat))
    err(`engine '${prefix}' has unknown cat '${eng.cat}' (not in ENGINE_CATEGORIES)`);
  else if (!sectionCats.has(eng.cat))
    err(`engine '${prefix}' cat '${eng.cat}' has no .wiki-section to render into`);
  if ('chip' in eng && typeof eng.chip !== 'string')
    err(`engine '${prefix}' field 'chip' should be a string`);
}

// A category tab with no section behind it filters to a permanently empty grid.
for (const [, cat] of HTML.matchAll(/<button class="wiki-cat-tab[^"]*" data-cat="([^"]+)"/g))
  if (cat !== 'all' && !sectionCats.has(cat))
    err(`category tab '${cat}' has no matching .wiki-section`);

// ── Reachability: a real (non-alias) engine the UI can't surface ────────────
// Chips now cover every categorised engine, so this only fires if `cat` is
// missing above — kept as a second net in case the chip renderer changes.
const radioSet = new Set(radioValues);
for (const [prefix, eng] of Object.entries(searchEngines)) {
  if (eng.isAlias) continue;
  if (!radioSet.has(prefix) && !eng.cat)
    warn(`engine '${prefix}' has no radio button and no category (typed-prefix only)`);
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`searchAIO engine registry check`);
console.log(`  engines:   ${engineKeys.size}`);
console.log(`  bangs:     ${Object.keys(BANG_MAP).length}`);
console.log(`  radios:    ${radioValues.length}`);
console.log(`  categories:${validCats.size}`);
console.log('');

if (warnings.length) {
  console.log(`⚠️  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`   - ${w}`);
  console.log('');
}

if (errors.length) {
  console.log(`❌ ${errors.length} error(s):`);
  for (const e of errors) console.log(`   - ${e}`);
  console.log('');
  console.log('FAIL — fix the errors above before shipping.');
  process.exit(1);
}

console.log('✅ PASS — all engine-registry invariants hold.');
