# searchAIO — AI Context File
_Last synced: 2026-04-27 @ 3ceb6f4_

## 1. What This Is (Plain English)
- **In one sentence:** One web page that lets you type a short prefix (like `pubmed:` or `yt:`) and instantly send your query to the right search engine — Google, YouTube, PubMed, CISMeF, ChatGPT, Yandex, ~50 more — without leaving the page.
- **Why it exists:** The author is a Moroccan/French medical researcher who got tired of bookmarking 50 specialized databases and clicking through them one by one. Type once, route anywhere, keyboard-driven.
- **Who uses it:** The author and friends, plus anyone who finds the GitHub Pages link. Public-facing but personal-tool scale — no auth, no analytics, no telemetry. Hosted at `https://achma-learning.github.io/searchAIO/`.
- **Vibe:** Scrappy, ambitious solo project. "Vibe-coded" with Gemini CLI + Claude. One enormous `index.html` (5,568 lines), no build step, no dependencies. Author calls themselves a noob and admits there are bugs they can't fix without breaking things (`README.md:37`).

## 2. How To Run It
- **Setup once:** Nothing to install. Clone the repo, that's it.
- **Run dev:** Open `index.html` in any modern browser. That's the whole loop. (For the userscript: install Tampermonkey/Violentmonkey, paste `userscript/searchAIO_userscript.js`.)
- **Build / deploy:** No build. Push to `main` → GitHub Pages serves `index.html` directly. The "good working version" archive is pinned in `README.md:5`.
- **Required env vars:** None. No `.env.example`, no secrets. The repo `.gitignore` only excludes `.gemini/` and GitHub App credentials.

## 3. Tech Stack
- **Language + runtime:** Vanilla HTML5 + CSS3 + ES6+ JavaScript. No transpiler, no bundler, no Node. Browser is the runtime.
- **Framework / key libraries:** None. Zero npm/pip dependencies. Only external assets are Google Fonts (`Roboto`, `JetBrains Mono`, `Source Code Pro`) loaded via CDN (`index.html:13`).
- **What kind of project:** Single-file static web app + companion userscripts. Deployed as GitHub Pages.
- **External services:**
  - Google S2 favicon service (`https://www.google.com/s2/favicons`) for engine icons
  - GitHub raw URLs for fallback favicons in `missing favicons/`
  - Google Fonts CDN
  - Google unofficial translate API + LibreTranslate + MyMemory (3-tier fallback for translation boxes — see `index.html` Yandex/Cybl/Baidu translation logic)
  - 50+ third-party search engine endpoints (the whole point of the app)
- **CI:** `.github/workflows/` runs five Gemini-CLI workflows (dispatch, invoke, review, triage, scheduled-triage). No build/test CI — there is nothing to build.

## 4. Code Map (The Important Files Only)
- `index.html` — **The whole app.** 5,568 lines, HTML/CSS/JS in one file. Open this if you forgot how anything works.
  - `index.html:3553` — `const searchEngines = {…}` — the engine registry. Adding a new engine starts here.
  - `index.html:3626` — `const BANG_MAP = {…}` — DuckDuckGo-style `!bang` → prefix lookup table.
  - `index.html:3690` — `detectBang(value)` — scans input right-to-left for `!token`.
  - `index.html:4245` — `updateSearchSource()` — the main reactive function: runs on every input/radio change, syncs UI, toggles filter panels, swaps favicon.
  - `index.html:~4500–4660` — search submit / URL construction (special cases for `gpat:`, `wiki:`, `bdbk:`, `medscape:`, `these-ma:`, `cybl:`, `msps:`, AMMPS family).
- `userscript/searchAIO_userscript.js` — Tampermonkey sidebar: select text on any page → ⚡ icon → search across the same engine list. v7.11. Synced manually with `index.html`. Published at GreasyFork #568031.
- `userscript/userscript-google.js` — Variant focused on Google AI products (Gemini, NotebookLM, Docs Help-Me-Write). v8.0.
- `userscript/description.md` — User-facing readme for the userscript.
- `missing favicons/` — `.ico/.png` files for engines whose favicons Google S2 can't fetch (CISMeF, Inserm, Sante.gov.ma, etc.). Referenced via `raw.githubusercontent.com/...` URLs inside `index.html`.
- `search_engin.md` / `search_engin_needing_manual_past.md` — Human-readable engine catalog. Out of sync with `index.html` (older subset — codebase wins).
- `GEMINI.md` — Detailed architecture brief written for Gemini CLI. Most accurate prose-form spec; this CONTEXT.md is the condensed version.
- `README.md` — Author's stream-of-consciousness notes: archive link, userscript suggestions, philosophy. Don't trust it as a manual.
- `LICENSE` — MIT, © 2026 maa384.
- `.github/workflows/gemini-*.yml` — Gemini-CLI-driven PR review/triage automation.

**Folders to know about, not edit:**
- `stables/` — Read-only history of every milestone build (`stable.html`, `stable10.html`, …, `stable33.html`). Do not delete.
- `antigravity.html` + `antigravity_fork/` — Separate dynamic-island UI experiment; not the live app.
- `old/` — Legacy split-file experiment (`src (old)/css/`, `src (old)/js/`) and abandoned drafts.
- `contexts+++/` — Archived AI assistant context files (older `GEMINI.md` / `claude.md` snapshots).

## 5. Rules For Editing This Code
- **Single-file mandate.** All app changes go in `index.html`. No new `.js`/`.css` files unless explicitly requested (`GEMINI.md:421`).
- **Vanilla JS only.** ES6+. Never suggest jQuery, React, Vue, Tailwind, or any library.
- **Zero build, zero deps.** No `package.json`, no npm install — keep it that way. The project's portability is the feature.
- **No `innerHTML` with user data.** Use `textContent` or `encodeURIComponent`. The query is untrusted (`GEMINI.md:423`).
- **Naming convention for prefixes:** short, DuckDuckGo-`!bang`-style (`g:`, `yt:`, `ddg:`). Power-user muscle memory matters.
- **Don't refactor working code without confirmed bugs.** The author has explicitly said they can't fix some bugs without breaking functionality (`README.md:37`).
- **Stables are sacred.** Never delete or rewrite anything in `stables/`.
- **Delete files matching `*Zone.Identifier`** when you see them (Windows-download artifacts) — see `GEMINI.md:24`.
- **Userscripts must mirror engine list manually.** Adding an engine to `index.html` means updating `userscript/searchAIO_userscript.js` too — the `ENGINES` array starts at line 19.

## 6. Fragile Bits & Landmines
- **The 5,568-line `index.html` is brittle.** AMMPS sub-prefixes, CISMeF aliases, the `msps:` site-toggle behavior, and the bang-detection priority all interact through `updateSearchSource()` and the special-case `else if` ladder in `performSearch()`. Symptom-debug, don't refactor.
- **Special URL constructors per engine** (`index.html:~4540–4640`) — each `else if` branch encodes a quirk discovered against a live site:
  - `these-ma:` requires trailing `&submit=OK`
  - `gpat:` needs `?q=(query)&oq=query` bracket form
  - `medscape:` needs the query wrapped in `"…"`
  - `wiki:` appends `&title=Special%3ASearch&fulltext=1`
  - `bdbk:` uses path encoding + `?fromModule=lemma_search-box`
  - `cybl:` appends `&page=1`
  - `dd:` appends `&bytSearchType=0` and must use raw `encodeURIComponent` (not `+` encoding)
  - `msps:` flips between `engine.url` (Google `site:`) and `engine.directUrl` (native search) based on the `siteBtn` state
- **`plusEncoding` is per-engine and overridden by special blocks.** The AMMPS family always uses `+` encoding regardless of the field; don't try to "normalize" this.
- **Bang detection runs after prefix detection but overrides it.** Bangs can appear at start, middle, or end of input. Changing the order of operations in `updateSearchSource` breaks both flows.
- **Translation 3-API chain** (Google unofficial → LibreTranslate → MyMemory) — all three free/unauthenticated. Any one can rate-limit you; the fallback chain hides that. Don't simplify to one.
- **Favicon swap animation** depends on the `.swapping` CSS class being toggled at the right moment in `updateSearchSource()`. Removing what looks like a stray class add will kill the animation.
- **Power Words to ignore:** `old/`, `stables/`, `antigravity*`, `contexts+++/`, `missing favicons/` — they look like cleanup targets but each has a reason. See §4.

## 7. Current State
- **Last shipped:** New userscript variant `userscript/userscript-google.js` (v8.0, Google AI focus) and userscript `description.md` for GreasyFork (commits `3ceb6f4`, `021c7bf`, `d2a9277`).
- **Working on now:** Adding this `CONTEXT.md` on branch `claude/add-context-documentation-j5jMN`.
- **Next up:** _Not yet figured out._ The `README.md` mentions wanting to add advanced search operators from `cipher387/Advanced-search-operators-list` and to make the page a custom new-tab extension; `old/imporvement.md` proposes a Dynamic Island redesign — neither has been pulled into a concrete next step.

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new `GEMINI.md` / `CLAUDE.md` / `.github/` files.
> 2. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~350 lines.
