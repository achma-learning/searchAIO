# Changelog

Working journal of notable changes. Format adapted from [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**How to read this:**
- Dates are commit dates, not write dates.
- `(a3f291)` is a short SHA — `git show a3f291` to see the diff.
- Entries explain symptom + cause, not just "fixed."
- No `package.json` exists; version markers come from userscript `// @version` headers and the project's own `stableN` milestones.

---

## [Unreleased]

### Added (Europe PMC filters)
- **Filter panel for `euc:` Europe PMC**, built like the YouTube one: *Sort* (relevance / times cited / newest / oldest), *Free access & type* checkboxes (full text in Europe PMC, via Unpaywall, research articles, reviews, preprints, with reviewed and journal-published sub-filters, books), and *Date* (last 1 / 3 / 5 years computed from today, or a custom year range that defaults to 1768 → this year when the boxes are left empty). Each filter adds an `AND (…)` clause using Europe PMC's own strings, byte-for-byte; boxes in one group are OR'd and groups are AND'd. A live preview line shows the exact query that will be sent. Ticking a preprint sub-filter ticks "Preprints", and typing a year selects the custom range. Verified: all 17 example URLs from the request reproduce exactly, plus a combined case.
- **Europe PMC favicon.** DuckDuckGo's icon service returns 404 for europepmc.org, so the chip showed a blank fallback. The official logo is now self-hosted as `missing favicons/europepmc.org-favicon.png` (64×64), like the other self-hosted icons.

### Fixed (Google / Bing wiki popups)
- **"📖 Google Wiki" and "📖 Bing Wiki" did nothing when clicked.** Two stacked bugs. (1) Each popup carried an inline `style="display: none;"`, and inline styles beat the stylesheet's `#googleWikiPopup.show { display: block }`, so adding `.show` never revealed it (only the dim overlay appeared). (2) Behind that, both popups sat *inside* `.search-container` (`position: relative; z-index: 20`), a stacking context that capped their `z-index: 2000` at 20, below the page-level overlay (1999), so even a visible popup couldn't be clicked. Removed the inline style and moved both popups to `<body>` level next to `#filetypesPopup`, which already worked this way. Verified in headless Chromium at desktop and phone width: opens, is the topmost element, the "keep open" checkbox works, and it closes via ✕, Escape and overlay click.

### Added (engines — issues #49, #47, #35)
- **🎓 Academic:** `euc:` **Europe PMC** (`!epmc`, `!europepmc`) and `cosus:` **Consensus** (`!consensus`). Consensus needs the query twice (`/search/<q>/new/?q=<q>`), so it gets one line in the URL builder next to `gpat:`/`cybl:`.
- **⚕️ Medical:** `caskanat:` **CASK Anatomy Terms** (Google `site:anatomicalterms.info`), `embfr:` **EBM France**, `fr-sante:` **Santé.fr**, `reco:` **RecoMédicales** (Google `site:recomedicales.fr`), each with bangs (`!caskanat`, `!ebmfr`, `!santefr`, `!reco`). Prefixes are exactly as requested in the issues.
- Engine count 65 → 71. Verified in headless Chromium through the real submit handler (prefix and `!bang` forms); validator and `?selftest` pass.

### Changed (engine registry — one source of truth)
- **The engine-picker chip grid is now generated from `searchEngines`.** The wiki panel used to carry 54 hand-written `<div class="wiki-chip" data-prefix=… data-cat=… data-name=…>` elements — a second copy of the registry that had already drifted: **11 engines existed in the registry and in `categoryMap` but had no chip at all** (`wiki:`, `bdbk:`, `grokw:`, `ww:`, `cybl:`, and all six AMMPS prefixes), so the only way to reach them was to know the prefix by heart. A new `renderEngineChips()` builds all 65 chips from the registry at init, into the same four `.wiki-section` containers with the same markup and classes — the CSS, the category tabs and the filter are untouched. Adding an engine to `searchEngines` now surfaces it in the picker with no second edit.
- **`cat` on the engine replaces the `categoryMap` lookup table.** Every engine declares `cat: 'general'|'academic'|'medical'|'ai'` (new `ENGINE_CATEGORIES` constant holds the four buckets and their emoji). This deletes the duplicated 4-array `categoryMap` that lived *inside* `updateSearchSource()` — and with it a linear scan over ~65 prefixes that ran on **every keystroke**; the category is now a property read. Optional `chip:` gives a shorter grid label where the full `name` is too long (e.g. `msps:` → "Min. Santé MA"), so the registry keeps the real name for the source label while the chip stays compact.
- **The chip filter now matches the full engine name too.** Previously a chip's `data-name` was its own hand-typed string, so searching the panel for "New England" found nothing (the chip only knew "NEJM"). Chips now carry both the registry `name` and the short label and match on either, plus the prefix.

### Fixed
- **Clicking a CISMeF alias chip did nothing.** `cismef-bp:`, `cismef-edu:`, `cismef-edn:` and `cismef-pat:` have chips but no `input[name="searchEngine"]` radio (they're aliases resolved at routing time), and the click handler only ever looked for a radio — so it highlighted the chip, closed the panel, and left the engine on whatever was selected before. Chip clicks now go through `selectEngineByPrefix()`, which falls back to selecting the alias's base engine *and* checking its `cismef_scope` filter radio — the same state the typed `cismef-bp:` prefix produces. Engines with no radio and no alias (the AMMPS family) fall back to dropping the prefix into the search bar.
- **Chips are keyboard-reachable.** Each chip is now `role="button"` with `tabindex="0"`, an `aria-label` carrying the full engine name + prefix, and Enter/Space activation — previously the picker was mouse-only, in an app whose whole premise is keyboard-first.

### Changed (validator)
- **`tools/validate-engines.mjs` follows the registry.** Replaced the `categoryMap` checks with `cat` checks: every engine must declare a `cat`, it must exist in `ENGINE_CATEGORIES`, and it must have a `.wiki-section` to render into; a category tab with no matching section is also an error now. Added a type check on `chip`. In-page `?selftest` gained the live-DOM equivalent — every engine rendered exactly one chip, and no chip points at a missing engine — and now reports the chip count alongside engines/bangs/radios.
- Verified no routing changed: all 65 prefixes and 26 representative `!bangs` were driven through the real submit handler in a headless browser before and after, and produced byte-identical URLs.

### Changed (UI)
- **JetBrains Mono is now the single app-wide UI font.** Introduced a `--ui-font` CSS variable on `:root` and pointed `body`, the search input, the engine-group titles / radio labels (was Papyrus), and the filter titles (was Roboto) at it — so the whole interface is one cohesive monospace and a future font swap is a one-line change. Dropped the now-unused Roboto family from the Bunny Fonts request (one fewer font to download). The `.site-btn-g-off` "G" glyph stays Arial on purpose (it imitates the Google logo letter).

### Added (reliability safety net)
- **`tools/validate-engines.mjs` — engine-registry validator.** Dependency-free Node script (no `npm install`) that parses `index.html` and asserts the invariants that silently break the router: duplicate prefix/`!bang` keys, a `!bang` pointing at a deleted prefix, an alias whose `aliasFor` is missing/another alias, a radio button or `categoryMap` entry that isn't a real engine, and engines with neither `url` nor `isAlias`. Warns (without failing) on `http://` engine URLs (mixed-content, blocked on the HTTPS Pages site — currently `ndltd:`, `anm:`, `dd:`), `promptBased` engines missing the `📋` marker, and UI-unreachable engines. Exits non-zero on any error.
- **`.github/workflows/validate-engines.yml` — CI gate.** Runs the validator on every push/PR touching `index.html` or the validator, so a broken registry goes red before it ships to GitHub Pages. Joins the existing Gemini-CLI workflows; still no _build_ step.
- **In-page `?selftest`.** Visiting `index.html?selftest` runs the same checks against the live engine objects + rendered radio buttons and draws a pass/fail report over the page — a no-tools way to verify before pushing. Gated; never runs in normal use. Report is built with DOM APIs + `textContent` (honors the no-`innerHTML`-with-data rule).

### Added (app + medical userscript)
- **Installable app (PWA).** New `manifest.webmanifest` + `sw.js` (offline-first service worker caching the single-file app shell) + maskable PNG icons (`icon-192/512.png`, `icon-180.png` apple-touch). A new "Installer l'application" row in the Settings panel triggers the native install prompt (`beforeinstallprompt`) with a platform-specific manual fallback (iOS Safari / Firefox), and hides itself when already running standalone. The SW registers on https only, so `file://` use is unaffected. Advances the README goal of a custom start-page / installable tool.
- **`userscript/searchAIO-med.js` (v1.0) — medical & thesis variant.** Same selection→sidebar UX as the v7.x script, plus four audience-specific features: **Search Packs** (one query fired across a curated bundle — EBM = PubMed+Cochrane+UpToDate+NEJM, Médicament, Terminologie, Thèse FR/MA, Maroc, Imagerie — via `GM_openInTab`); **PubMed power filters** (Review/Systematic/Meta/RCT/Free-full-text/Humans/≤5 yrs/Title-Abstract, emitted as correct PubMed term syntax and applied only to PubMed URLs); **smart identifier detection** (selected DOI→doi.org, PMID→PubMed, NCT→ClinicalTrials.gov); and **FR/AR→EN translation** of the selection (`GM_xmlhttpRequest` → Google's free endpoint). Keyboard-driven, category memory, clipboard auto-copy for AI engines. Engine list mirrored manually from `index.html`.

### Changed (privacy by default)
- **No more Google contact on page load.** Replaced Google Fonts with **Bunny Fonts** (`fonts.bunny.net`, GDPR-compliant, no logging — same JetBrains Mono / Roboto / Source Code Pro via the identical `css2` API, zero design change) and replaced the **Google S2 favicon service** with **DuckDuckGo's icon service** (`icons.duckduckgo.com/ip3/<domain>.ico`) through a new `faviconFor()` helper. Missing icons now hide gracefully via an `error` handler instead of showing a broken-image glyph.
- **`<meta name="referrer" content="no-referrer">`** added — destination engines, the favicon host, and the font host no longer receive this page's URL. (All `window.open` calls already used `noopener,noreferrer`.)
- **`spellcheck="false"` (+ `autocorrect`/`autocapitalize="off"`) on `#searchInput`** and the three translation inputs — stops browsers' cloud spellcheckers (e.g. Chrome enhanced spellcheck) from sending typed queries to a third party.
- Settings panel now shows a **"🔒 Confidentialité par défaut"** summary of these guarantees.

### Added
- **Settings panel (⚙️).** New gear button in the bottom-buttons row opens a modal (reusing the lang-popup pattern) for per-browser preferences. Persisted via `lsGet`/`lsSet` under `aioSettings` (JSON, merged over `DEFAULT_SETTINGS`, resilient to corrupt data). First toggle: enable/disable search history.
- **Search history (recent searches) — opt-in, OFF by default.** When enabled in Settings, focusing the empty search bar surfaces the last 12 queries inside the existing autocomplete dropdown, each tagged with its resolved engine favicon + name. Click (or arrow-key + Enter) replays the exact raw input through the form handler, so all bang/prefix/site/translate routing is preserved for free. Persisted via `lsGet`/`lsSet` under `searchHistory` (JSON, deduped case-insensitively, capped at 12). Includes an "Effacer" clear button. `addHistory()`/`showHistory()` both no-op unless `historyEnabled` is set. Directly advances the "make this a daily-driver start page" goal in `README.md`.

### Architectural
- Added `CONTEXT.md` at repo root — condensed AI-onboarding file replacing scattered context across `GEMINI.md`/`contexts+++/`. `(890c15a)`

---

## 2026-04-11 — userscript v8.0 (Google AI variant)

### Added
- New userscript `userscript/userscript-google.js` — Google-AI-focused variant (Gemini, NotebookLM, Docs Help-Me-Write, AI Overviews, Scholar+AI, Patents). Sibling to v7.x, not a replacement. `(3ceb6f4)`

---

## 2026-04-05 — userscript v7.0 → v7.11

### Added
- Userscript `description.md` — GreasyFork-ready readme covering install, shortcuts, categories. `(021c7bf)`
- Centered-sidebar UX, keyboard-first navigation (`Alt+S` open, `/` toggle focus, a–z letter shortcuts, Tab cycle categories). `(944fb1b)`
- Keyboard help modal (`Ctrl+?`), grid-first focus on open. `(138831b)`

### Fixed
- Mouse click on engine cards did nothing — handler was attached only to keyboard navigation; added click → launch path. `(138831b, aa8d075)`
- Letter shortcuts ignored uppercase keys when CapsLock or Shift was on — comparison was case-sensitive. `(aa8d075)`

### Architectural
- Userscript canonicalised to `userscript/searchAIO_userscript.js` after a chain of typo/rename commits (`searchAIO_userscritp.js`, `SearchAIO-userscript.js`). Net result: one file under `userscript/`. `(633317a, 6ed183b, fd5371c, 50bcd24)`
- v7.0 full rewrite: 226-line v6 → 446-line v7 with full engine list synced from `index.html`. `(944fb1b)`

---

## 2026-03-29

### Architectural
- Moved `index_fork.html` → `antigravity_fork/index_fork.html`; the dynamic-island UI experiment now lives in its own folder, separate from the live app. `(2c4a01f)`

---

## 2026-03-16 — AlphaFold + !bang button relocation

### Added
- AlphaFold engine (`alphaf:`) under AI/Avancé category, pointing at `alphafold.ebi.ac.uk/search/text/`. `(5d7ba14)`

### Changed
- Page favicon switched to inline `🔎` SVG emoji (was a remote `.ico`). `(5d7ba14)`
- `!bangs` button moved from page footer to inline with search bar (right of globe icon), renamed "🦆 !bang search". DuckDuckGo `!bang` list button renamed "🦆 !bang list", stacks vertically when `ddg:` is active. `(5d7ba14, b10c055)`

---

## 2026-03-15

### Added
- `/` key focuses the search input from anywhere on page (faster sibling to `Ctrl+K`). `(da3b34b)`
- `Shift+?` toggles the keyboard shortcuts popup globally; binding count in popup updated 19 → 21. `(da3b34b)`

---

## 2026-02-24 — stable33 milestone

### Added
- Wikipedia (`wiki:`), Baidu Baike (`bdbk:`), Grokipedia (`grokw:`), WikiWand (`ww:`) engines under General category. `(349cc95)`
- CyberLeninka (`cybl:`) engine + dedicated CyberLeninka translation box (Russian, mirrors Yandex translation infra). `(f374cc8)`
- "🔄 Translate search bar" buttons (`yandexTranslateSearchBtn`, `baiduTranslateSearchBtn`) with `Alt+V` shortcut to translate `#searchInput` content in place. `(1bab9ba, 76661b0)`

### Changed
- Prefix detection rewritten as longest-match (so `cismef-bp:` beats `cismef:`); CISMeF aliases now auto-select the matching scope radio on detection. `(349cc95)`
- `GEMINI.md` rewritten as full architectural reference (74 → 426 lines): engine schema, state machine, URL construction rules, behavioural constraints. `(76661b0)`

### Fixed
- AMMPS sub-radios and main `ammps:` radio went out of sync; site-search auto-activation didn't follow the resolved sub-engine — refactored to read active sub-radio when base prefix is `ammps:` and gate `siteBtn` on resolved sub-prefix. `(ccd549b)`

### Architectural
- New `contexts+++/GEMINI (25-02-2026).md` snapshot created; old GEMINI text rolled into `contexts+++/`. `(76661b0)`

---

## 2026-02-23 — !bang routing, Chinese translation, mid-month rebuild

### Added
- `!bang` inline routing — `BANG_MAP` (~80 tokens) + `detectBang()` scanning input right-to-left; `#bang-indicator` chip surfaces the resolved engine. Bangs override typed prefixes. `(b8b9e46)`
- Baidu / Chinese translation box (`baiduTranslationBox`) with 3-API fallback chain (Google unofficial → LibreTranslate → MyMemory, 500 ms debounce); language pair dropdown (`en2zh`, `zh2en`, `auto2zh`, `fr2zh`, `ar2zh`); manual `fanyi.baidu.com` backup. `(acfee4b)`
- Baidu AI engine (`ernie:`) with `promptBased: true` (clipboard-copy + manual paste). `(acfee4b)`

### Architectural
- Mid-month index.html restructure (~3,222 lines changed) — new translation infrastructure scaffolded, `index_fork.html` (antigravity dynamic-island prototype) added. `(9c747a9, 846f51d, fd0d1b2)`

---

## 2026-02-22 — Yandex translation, classic redesign, AMMPS introduction

### Added
- AMMPS (`ammps:`) engine + 5 sub-engines (`ammps-lm:`, `ammps-rmmg:`, `ammps-lvl:`, `ammps-p:`, `ammps-gs:`); HETOP (`hetop:`). `(b8b9e46)`
- Classic-design variants explored in stables (`stable22_classic`, `stable23_classic`, `stable24_classic`). Live UI didn't switch wholesale, but `stable27` adopted classic structure. `(f93bd25, db47cba, 38b7d89, b8a4ced)`

### Changed
- Large index.html restructure (~1,101 lines) introducing AMMPS scope filter panel and Yandex translation box scaffolding. `(d2cad6a)`
- index.html UI pass (~341 lines) refining Yandex translation buttons and source-language selector. `(05d3b70)`

### Architectural
- Moved abandoned split-file experiment `src (old)/` → `old/src (old)/`; relocated translation-research notes under `old/to add translation/`. `(b8a4ced)`
- Removed legacy `index - Copy.html` (3,112 lines) — superseded by stables/. `(db47cba)`

---

## 2026-02-20 — major rebuild

### Changed
- index.html rewritten end-to-end (~6,167 lines changed) — restructured engine registry, search-source indicator, focus overlay; `stable13.html` snapshotted as the post-rebuild baseline. `(869b1ae)`

### Architectural
- Brief detour into a split-file layout (`src/index.html` + `src/css/styles.css` + `src/js/app.js`) plus `steps.md`; abandoned within days and kept under `old/`. `(e3eebbe)`
- Multi-version snapshot dump into `stables/` (stable14, 16, 17, 17.2 — favicon-in-input experiments). Pure backups, kept for forensic diffing. `(40172d2)`

---

## 2026-02-19 — prompt-based engines

### Added
- `promptBased: true` engine flag — when set, query is copied to clipboard and the engine's base URL is opened (for ChatGPT, Claude, Gemini, Copilot, Baidu Ernie); name suffixed with `📋` (originally `*`) so users see the paste-required hint. `(40bab43, d8869e6)`
- `search_engin.md` (full engine catalog) and `search_engin_needing_manual_past.md` (paste-required list). `(6e3b68c)`

### Changed
- index.html rebuilt from a stable snapshot to integrate prompt-based handling (~153 lines net, 88 deletions). `(40bab43)`

### Architectural
- `GEMINI.md` codified two house rules: `stables/**` is read-only/never delete; `*Zone.Identifier` files (Windows download artefacts) must be deleted on sight. `(4d19e44, 2acce3e, 8ed465b)`

### Removed
- Abandoned `BookmarkOpener/` Chrome-extension experiment (`bg.js` + `manifest.json`). `(40a063b)`

---

## 2026-02-17 — initial repo upload

### Added
- First push: 3,558-line `index.html` (already-mature multi-engine search router), `GEMINI.md`, `README.md`, `LICENSE` (MIT), `missing favicons/` (CISMeF, Inserm, Sante.gov.ma, etc.), `contexts+++/` archive of pre-existing AI conversations. `(5c3d7bd)`
- `.github/workflows/gemini-*.yml` — five Gemini-CLI workflows (dispatch, invoke, review, triage, scheduled-triage). No build CI; the project has no build step. `(5c3d7bd)`
- Early `index.html` iteration (~127-line patch) refining engine layout. `(2ac16e3)`

### Architectural
- Project ships as a single `index.html` with no dependencies, no build, no package manifest. GitHub Pages serves it directly. This is intentional (`GEMINI.md`: "single-file mandate"). `(5c3d7bd)`

---

<details>
<summary>Archive — entries older than 12 months</summary>

_(Empty. Repo history starts 2026-02-17; everything is within 12 months of 2026-04-27.)_

</details>

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CHANGELOG.md":
> 1. Find the most recent SHA cited in the existing file.
> 2. Run `git log` and `git diff --stat` for everything since that SHA.
> 3. Apply the WIP Decoder — derive intent from diffs when commit messages are vague.
> 4. Group consecutive same-intent commits into single entries; split when intent changes.
> 5. Skip noise (lockfiles, formatter passes, typos, no-op commits, pure stables/ backup-only commits).
> 6. Detect version bumps (userscript `// @version` headers, project `stableN` milestones) — if found, close `[Unreleased]` into a dated section.
> 7. Append new entries above existing ones. **Never rewrite past entries** except to fix factual errors (note the correction inline).
> 8. Roll entries older than 12 months from today's date into the `<details>` archive.
> 9. Keep the file under 600 lines and every entry under 2 lines.
