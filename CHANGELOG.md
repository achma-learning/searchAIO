# Changelog

Working journal of notable changes. Format adapted from [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**How to read this:**
- Dates are commit dates, not write dates.
- `(a3f291)` is a short SHA — `git show a3f291` to see the diff.
- Entries explain symptom + cause, not just "fixed."
- No `package.json` exists; version markers come from userscript `// @version` headers and the project's own `stableN` milestones.

---

## [Unreleased]

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
