# searchAIO — AI Context File
_Last synced: 2026-05-25 — merged former GEMINI.md into this file._

> This is the single source of truth for AI assistants working on searchAIO.
> §1–§4 are plain-English onboarding; §5–§12 are architecture/spec; §13–§16 are rules and state.

---

## 1. What This Is (Plain English)
- **In one sentence:** One web page that lets you type a short prefix (like `pubmed:` or `yt:`) and instantly send your query to the right search engine — Google, YouTube, PubMed, CISMeF, ChatGPT, Yandex, ~50 more — without leaving the page.
- **Why it exists:** The author is a Moroccan/French medical researcher who got tired of bookmarking 50 specialized databases and clicking through them one by one. Type once, route anywhere, keyboard-driven.
- **Who uses it:** The author and friends, plus anyone who finds the GitHub Pages link. Public-facing but personal-tool scale — no auth, no analytics, no telemetry. Hosted at `https://achma-learning.github.io/searchAIO/`.
- **Target audience:** Researchers, medical professionals (French & Moroccan focus), PhD students, power users who need fast access to multiple specialized databases without context-switching.
- **Vibe:** Scrappy, ambitious solo project. "Vibe-coded" with Gemini CLI + Claude. One enormous `index.html` (~5,570 lines), no build step, no dependencies. Author calls themselves a noob and admits there are bugs they can't fix without breaking things (`README.md:37`).

## 2. How To Run It
- **Setup once:** Nothing to install. Clone the repo, that's it.
- **Run dev:** Open `index.html` in any modern browser. That's the whole loop. (For the userscript: install Tampermonkey/Violentmonkey, paste `userscript/searchAIO_userscript.js`.)
- **Build / deploy:** No build. Push to `main` → GitHub Pages serves `index.html` directly. The "good working version" archive is pinned in `README.md:5`.
- **Required env vars:** None. No `.env.example`, no secrets. The repo `.gitignore` only excludes `.gemini/` and GitHub App credentials.

## 3. Tech Stack
- **Language + runtime:** Vanilla HTML5 + CSS3 + ES6+ JavaScript. No transpiler, no bundler, no Node. Browser is the runtime.
- **Framework / key libraries:** None. Zero npm/pip dependencies. Only external assets are Google Fonts (`Roboto`, `JetBrains Mono`, `Source Code Pro`) loaded via CDN (`index.html:13`).
- **What kind of project:** Single-file static web app + companion userscripts. Deployed as GitHub Pages.
- **External services (privacy-minimised — no Google contact on page load):**
  - DuckDuckGo icon service (`https://icons.duckduckgo.com/ip3/<domain>.ico`) for engine icons, via the `faviconFor()` helper (replaced Google S2 for privacy). Missing icons hide gracefully via an `error` handler.
  - GitHub raw URLs for fallback favicons in `missing favicons/`
  - Bunny Fonts CDN (`https://fonts.bunny.net`, GDPR-compliant, no logging — replaced Google Fonts; same families, drop-in `css2` API)
  - Google unofficial translate API + LibreTranslate + MyMemory (3-tier fallback for translation boxes — user-initiated only — see `index.html` Yandex/Cybl/Baidu translation logic)
  - 50+ third-party search engine endpoints (the whole point of the app)
  - **Privacy defaults:** `<meta name="referrer" content="no-referrer">` (no `Referer` leaked to engines/icons/fonts); all `window.open` use `noopener,noreferrer`; `#searchInput` + translation inputs set `spellcheck="false"` (blocks cloud-spellcheck text exfiltration); search history off by default.
- **CI:** `.github/workflows/` runs five Gemini-CLI workflows (dispatch, invoke, review, triage, scheduled-triage). No build/test CI — there is nothing to build.

## 4. Code Map (The Important Files Only)
- `index.html` — **The whole app.** ~5,570 lines, HTML/CSS/JS in one file. Open this if you forgot how anything works.
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
- `CHANGELOG.md` — Forensic project journal of every notable commit and decision.
- `README.md` — Author's stream-of-consciousness notes: archive link, userscript suggestions, philosophy. Don't trust it as a manual.
- `LICENSE` — MIT, © 2026 maa384.
- `.github/workflows/gemini-*.yml` — Gemini-CLI-driven PR review/triage automation.

**Historical context (no longer in repo):** `stables/` milestone snapshots, `old/` split-file/abandoned-draft experiments, `antigravity.html` + `antigravity_fork/` dynamic-island UI experiment, and `contexts+++/` archived AI context files were purged in the 2026-05-25 cleanup. The standalone `GEMINI.md` architecture brief was also merged into this file in the same cleanup. See git history to recover any of it.

---

## 5. Architecture

### 5.1 Single-File Structure
The entire project lives in **`index.html`** — all HTML, CSS, and JavaScript inline. This is the canonical source of truth. No build tools, no bundlers, no external runtime dependencies beyond Google Fonts.

Deployment: GitHub Pages, served directly from `index.html`.

### 5.2 The `searchEngines` Schema
```javascript
const searchEngines = {
  'prefix:': {
    name: 'Display Name',         // UI label. Append 📋 for promptBased engines.
    url: 'https://base.url/q=',   // Base search URL (query appended here)
    domain: 'example.com',        // Used by Google S2 favicon service
    favicon: 'custom_url',        // Optional: overrides favicon strategy (GitHub raw URLs preferred)
    plusEncoding: true,           // If true, replaces %20 with + in encoded query
    isAlias: false,               // If true, routes to aliasFor with filterValue pre-applied
    aliasFor: 'target:',          // Target prefix for alias resolution
    filterValue: 'env=bp&q=',     // Pre-applied filter for alias (CISMeF / AMMPS)
    promptBased: false,           // If true: copies query to clipboard, opens base URL
    directUrl: 'https://...',     // Optional: secondary URL used in specific routing logic (e.g., msps:)
  }
}
```

**Naming convention:** Follow DuckDuckGo `!bang` style for brevity (`g:`, `yt:`, `ddg:`, `yan:`). Power users expect short, memorable prefixes.

### 5.3 The !Bang System
A dedicated `BANG_MAP` object maps 80+ `!shortcut` tokens (e.g., `!g`, `!pm`, `!csf`) to internal prefixes. `detectBang(value)` scans the input right-to-left for any `!token` and returns `{ prefix, token, cleanQuery }`.

Bangs can appear **anywhere** in the input (start, middle, end). The UI shows a `#bang-indicator` chip when a bang is detected. **Bangs override typed prefixes.**

### 5.4 Functional State Machine
```
[User Input / Radio Click]
        ↓
  updateSearchSource()       ← runs on every input change
        ↓
  1. Prefix Detection        longest-match wins over all searchEngines keys
        ↓
  2. Bang Detection          detectBang() — overrides prefix if found
        ↓
  3. Alias Resolution        isAlias → follow aliasFor, pre-check filter radio
        ↓
  4. UI Synchronization
     - Sync radio buttons    effectivePrefix → check matching radio
     - Toggle filter panels  yt: → youtubeFilters, g: → googleOperatorFilters, etc.
     - Toggle translation    yan:/cybl: → Russian box | bd:/bdedu:/cbd: → Chinese box
     - Favicon swap          animated swap via .swapping CSS class
     - Source indicator      "🌐 Google" / "⚕️ CISMeF Bonnes Pratiques" etc.
        ↓
[User submits form]
        ↓
  performSearch()
        ↓
  1. Bang re-detection       if bang → resolve prefix + cleanQuery
  2. site: override          siteBtn.active → Google site:domain search
  3. msps: special routing   directUrl vs. Google site:
  4. Alias resolution        sync CISMeF filter radio
  5. Engine-specific routing (see §9 URL Construction Rules)
  6. promptBased             copy query → clipboard, open base URL, show notification
  7. Google Translate wrap   if selectedOutputLang ≠ 'original' → wrap in translate.google.com
        ↓
  window.open(finalUrl, '_blank')
```

---

## 6. Engine Registry — Current List

### 6.1 🌐 General / Wiki (13)
| Prefix | Engine | Notes |
|--------|--------|-------|
| `g:` | Google | Default fallback |
| `yt:` | YouTube | Has dedicated filter panel |
| `brave:` | Brave Search | |
| `ddg:` | DuckDuckGo | Shows !bang button |
| `yan:` | Yandex | Shows Russian translation box |
| `bing:` | Bing | Has dedicated operator panel |
| `bd:` | Baidu | Shows Chinese translation box |
| `gplus:` | Google Avancé | Advanced search page |
| `wiki:` | Wikipedia | `plusEncoding`, special URL pattern |
| `bdbk:` | Baidu Baike | Chinese Wikipedia, special URL pattern |
| `grokw:` | Grokipedia | |
| `ww:` | WikiWand | `plusEncoding` |
| `gai:` | Google AI Mode | `udm=50` parameter |

### 6.2 🎓 Academic / Research (13)
| Prefix | Engine | Notes |
|--------|--------|-------|
| `scholar:` | Google Scholar | |
| `pubmed:` | PubMed | |
| `arxiv:` | arXiv | |
| `gpat:` | Google Patents | Special URL: `?q=(query)&oq=query` |
| `these2.0:` | These2.0 | Moroccan FM theses |
| `cismef-th:` | CISMeF Thèses | CISMeF alias, `env=thm` |
| `these-ma:` | Toubkal | Special URL: `&submit=OK` suffix |
| `these-fr:` | Theses.fr | Pre-filtered URL |
| `rgate:` | ResearchGate | |
| `ndltd:` | NDLTD | |
| `bdedu:` | Baidu Xueshu | `plusEncoding`, Chinese translation box |
| `proinserm:` | Pro Inserm | Custom favicon |
| `cybl:` | CyberLeninka | Russian translation box, `&page=1` suffix |

### 6.3 ⚕️ Medical — French & Moroccan (~17)
| Prefix | Engine | Notes |
|--------|--------|-------|
| `cismef:` | CISMeF | Has scope filter panel (6 sub-modes) |
| `cismef-bp:` | CISMeF Bonnes Pratiques | Alias → `env=bp&q=` |
| `cismef-edu:` | CISMeF Éducation | Alias → `env=unf3s&q=` |
| `cismef-edn:` | CISMeF ECN | Alias → `env=ecn&q=a&p=` |
| `cismef-pat:` | CISMeF Patients | Alias → `env=pat&q=` |
| `has:` | HAS | French Health Authority |
| `vidal:` | VIDAL | French drug reference |
| `lissa:` | LISSA | |
| `anm:` | Académie Nationale de Médecine | |
| `hetop:` | HETOP | `plusEncoding` |
| `msps:` | Ministère Santé Maroc | `directUrl` for site-off mode; Google `site:` when siteBtn active |
| `ammps:` | AMMPS – Médicaments | Has scope filter panel (5 sub-modes). Auto-activates siteBtn for `rmmg`/`gs`. |
| `ammps-lm:` | AMMPS – Liste Médicaments | `plusEncoding` |
| `ammps-rmmg:` | AMMPS – RMMG | Google `site:ammps` URL — auto-activates siteBtn |
| `ammps-lvl:` | AMMPS – Vaccins Libérés | `plusEncoding` |
| `ammps-p:` | AMMPS – Pharmacies | `plusEncoding` |
| `ammps-gs:` | AMMPS – site:AMMPS | Google `site:ammps` — auto-activates siteBtn |

### 6.4 ⚕️ Medical — International (12)
| Prefix | Engine | Notes |
|--------|--------|-------|
| `nejm:` | NEJM | |
| `rp:` | Radiopaedia | |
| `utd:` | UpToDate | |
| `coch:` | Cochrane Library | |
| `medscape:` | Medscape | Special URL: quoted query |
| `openmd:` | OpenMD | |
| `mesh:` | MeSH Browser | |
| `dd:` | Diseases Database | `bytSearchType=0` suffix |
| `webmd:` | WebMD | |
| `nih:` | NIH | Custom favicon |
| `drugs:` | Drugs.com | |
| `cdc:` | CDC | |

### 6.5 🤖 AI / Advanced (~9)
| Prefix | Engine | Notes |
|--------|--------|-------|
| `wolf:` | Wolfram Alpha | |
| `chatgpt:` | ChatGPT | `plusEncoding` |
| `claude:` | Claude AI 📋 | `promptBased` |
| `gemini:` | Gemini 📋 | `promptBased` |
| `perplexity:` | Perplexity | |
| `copilot:` | Copilot 📋 | `promptBased` |
| `cbd:` | Chat Baidu | `plusEncoding`, Chinese translation box |
| `ernie:` | Baidu AI 📋 | `promptBased` |
| `duckai:` | Duck.ai | `plusEncoding` |

---

## 7. Feature Specifications

### 7.1 Search Bar & UI
- **Favicon inside input:** `#search-prefix-favicon` swaps with animation on engine change.
- **Source indicator:** `#searchSource` shows `emoji + engine name` in green when engine is resolved.
- **siteBtn:** Toggle Google `site:` search for current engine. Auto-activates for `ammps-rmmg:`, `ammps-gs:`, `msps:`.
- **bangsBtn:** Opens `duckduckgo.com/bangs` search in a popup window.
- **duckBangBtn:** Opens `mosermichael.github.io/duckduckbang` (only visible when `ddg:` is active).
- **`#bang-indicator`:** Appears when a `!bang` token is detected, shows resolved engine name.
- **Settings panel (`#settingsPopup`):** Gear button (`#settingsBtn`) in the bottom-buttons row opens a modal (same flex-overlay + `.show` pattern as `#langPopup`). Preferences persist under `aioSettings` via `getSettings()`/`setSetting()` (JSON merged over `DEFAULT_SETTINGS`, corrupt-data-safe). Closes via close-btn, overlay click, or Esc. Currently one toggle: search history.
- **Search history (opt-in, OFF by default):** Gated behind `getSettings().historyEnabled` — both `addHistory()` and `showHistory()` no-op when disabled. When enabled, focusing the empty search bar shows the last 12 raw inputs (`showHistory()` inside the AUTOCOMPLETE section). Each row shows the resolved engine favicon + name (`resolveHistoryEntry()` mirrors the submit handler's bang-then-longest-prefix order). Clicking refills `#searchInput` and calls `searchForm.requestSubmit()`, so routing is replayed verbatim — no routing logic is duplicated. Stored under `searchHistory` via `lsGet`/`lsSet` (JSON array, deduped case-insensitively, capped at `HISTORY_MAX = 12`); `addHistory()` runs at the top of the submit handler. Clear button = "Effacer".
- **Legend Bar** (fixed footer): Shows 📋 paste reminder when a `promptBased` engine is active.

### 7.2 Filter Panels (context-aware, hidden by default, toggled by `updateSearchSource()`)
- **YouTube** (`youtubeFilters`): Sort (Relevance / Upload Date / View Count / Rating); Type (All / Video / Channel / Playlist / Movie); Duration (Any / Short <4m / Medium / Long); Date (Any / Hour / Today / Week / Month / Year). Only ONE filter group applies per search (first non-empty wins).
- **Google Operators** (`googleOperatorFilters`): basic (`" "`, `OR`, `-`, `*`, `( )`, `in`), advanced (`site:`, `intitle:`, `allintitle:`, `inurl:`, `allinurl:`, `intext:`, `allintext:`, `filetype:`, `related:`), specialized (`define:`, `source:`, `stocks:`, `weather:`, `before:`, `after:`, `AROUND()`). Buttons insert at cursor; smart placement for `" "` / `( )`; 300ms viewport-aware tooltips with Google favicon footer.
- **Bing Operators** (`bingOperatorFilters`): `" "`, `OR`, `NOT`, `site:`, `filetype:`, `inurl:`, `inbody:`, `intitle:`, `define:`, `imagesize:`, `feed:`, `language:`.
- **CISMeF Scope** (`cismefFilters`): Générale / Bonnes Pratiques / Éducation / Patients / Thèses / ECN. Aliases pre-select the matching radio.
- **AMMPS Scope** (`ammpsFilters`): Médicaments / Liste / RMMG / Vaccins Libérés / Pharmacies / site:AMMPS. Sub-radio value IS the effective prefix; bidirectional sync with main `ammps:` radio.
- **Filetype Grid** (`filetypesPopup`): Documents / Spreadsheets-Presentations / Code-Web / Images / Video-Media / Niche. Multi-extension support (`doc,docx` → `(filetype:doc OR filetype:docx)`). Injected into `#searchInput`.

### 7.3 Translation System
3-engine fallback chain per request: **Google Unofficial** (`translate.googleapis.com/translate_a/single?client=gtx`, best quality) → **LibreTranslate** (`libretranslate.com/translate`) → **MyMemory API** (`api.mymemory.translated.net`). Boxes debounce at **500ms**.
- **Yandex box** (`yandexTranslationBox`, only for `yan:`): Source-lang selector (EN/FR/DE/ES/AR/ZH/IT/PT) → Russian. Buttons: 🔗 Open Yandex Translate · ✅ Insert · 📋 Copy. Hotkeys: `Alt+V` translate search bar, `Alt+I` insert, `Alt+Q` copy, `Alt+U` open external.
- **CyberLeninka box** (`cyblTranslationBox`, only for `cybl:`): Same as Yandex; `yandexTranslate.com` fallback URL.
- **Baidu / Chinese box** (`baiduTranslationBox`, for `bd:`, `bdedu:`, `cbd:`, `bdbk:`): Language-pair dropdown `en2zh`/`auto2zh`/`zh2en`/`fr2zh`/`ar2zh`; `bdbk:` defaults to `en2zh`. Backup button opens `fanyi.baidu.com` with `#from/to/text` hash. Inline status colors (orange/green/red).
- **Language Proxy** (`langPopup`): `Alt+T` opens. Options: Original · 🇫🇷 FR · 🇬🇧 EN · 🇸🇦 AR · 🇪🇸 ES · 🇷🇺 RU · 🇨🇳 ZH. When active, wraps finalUrl in `https://translate.google.com/translate?sl=auto&tl=XX&u=...`. `Alt+Shift+O` resets to original.

### 7.4 Wiki / Engine Browser (`wikiContent`)
Triggered by `wikiToggleBtn`, keeps open via `keepWikiOpenCheckbox`. Live filter input (`wikiSearchInput`) — by prefix or engine name. Category tabs: All / 🌐 General / 🎓 Academic / ⚕️ Medical / 🤖 AI. Chip grid (`wiki-chip`) — click selects engine (checks radio + updates source). Empty state with "No results for '…'" feedback.

### 7.5 Auxiliary Popups
- **Google Wiki / Bing Wiki popups** (`googleWikiPopup`, `bingWikiPopup`): operator cheatsheets, only visible for `g:` / `bing:`. Keep-open checkbox toggles Esc behavior.
- **Keyboard Shortcuts popup** — dark terminal aesthetic, intentionally stays dark in both themes: `#0d1117` GitHub-dark BG, macOS traffic-light dots, 2-column grid with `#`-prefixed section titles, `kbd` chips with border-bottom depth effect, custom thin scrollbar.

---

## 8. Keyboard Shortcut Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus search input |
| `Ctrl+Shift+K` | Clear + focus input |
| `Ctrl+Shift+C` | Copy input content |
| `Alt+↑ / ↓` | Cycle through all engines |
| `Alt+1 / 2 / 3 / 4` | Jump to first engine in group |
| `Alt+G` | Instant Google `site:` search for current engine |
| `Alt+Shift+G` | Toggle `site:` mode |
| `Alt+T` | Open output-language popup |
| `Alt+Shift+O` | Reset output language to original |
| `Alt+F / E / A / S / R / C` | Set output language FR/EN/AR/ES/RU/ZH |
| `Alt+V` | Translate search bar content |
| `Alt+I` | Insert translation into search bar |
| `Alt+Q` | Copy translation to clipboard |
| `Alt+U` | Open external translation service |
| `Esc` | Close active popup/panel (respects keep-open) |

---

## 9. Special URL Construction Rules (`performSearch`)

```javascript
// Toubkal — submit param must be appended last
if (prefix === 'these-ma:')
  finalUrl = engine.url + encodedQuery + '&submit=OK';

// Google Patents — bracketed format required
else if (prefix === 'gpat:')
  finalUrl = engine.url + '?q=(' + encodedQuery + ')&oq=' + encodedQuery;

// Medscape — quoted query required
else if (prefix === 'medscape:')
  finalUrl = engine.url + '?q="' + encodedQuery + '"';

// Wikipedia — full-text search parameter
else if (prefix === 'wiki:')
  finalUrl = engine.url + encodedQuery + '&title=Special%3ASearch&fulltext=1';

// Baidu Baike — item module parameter
else if (prefix === 'bdbk:')
  finalUrl = engine.url + encodeURIComponent(query) + '?fromModule=lemma_search-box';

// CyberLeninka — pagination parameter
else if (prefix === 'cybl:')
  finalUrl = engine.url + encodedQuery + '&page=1';

// Diseases Database — bytSearchType=0 appended; raw encodeURIComponent (no plusEncoding)
// MSPS: siteBtn ON → engine.url (Google site:); OFF → engine.directUrl (native)
// AMMPS family: always plusEncoding regardless of the field
```

---

## 10. UI/UX Design System

### Colors
| Token | Light | Dark |
|-------|-------|------|
| Primary | `#9c5af2` | `#9c5af2` |
| Body BG | `linear-gradient(135deg, #000022, #051937, #001f3f)` | same |
| Card BG | `#ffffff` | `#1a2332` |
| Category card | `linear-gradient(145deg, #f8f9fa, #e9ecef)` | dark variant |
| Category border | `#667eea` | `#64b5f6` |
| Selected radio | `linear-gradient(135deg, #667eea, #764ba2)` | same |
| Input focus ring | `rgba(156,90,242,0.4)` | `rgba(156,90,242,0.3)` |
| Focus overlay | `rgba(0,0,0,0.4)` + blur | `rgba(0,0,0,0.6)` + blur |

### Typography
- Body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial`
- Search input: `'Roboto', sans-serif, 500`
- Category titles / radio labels: `'Papyrus', cursive, fantasy`
- Shortcuts popup / code: `'JetBrains Mono'`, `'Source Code Pro'`

### Animation
- Transitions: `0.2s ease` for interactions, `0.3s cubic-bezier(0.4,0,0.2,1)` for overlays.
- GPU acceleration: `transform: translateY()`, never `top`/`left`.
- Favicon swap: `.swapping` class triggers CSS keyframe.

### Layout
- Container: `max-width: 1200px`, `border-radius: 16px`, responsive padding.
- Engine groups: `CSS Grid auto-fit minmax(240px, 1fr)`.
- Radio labels: `transform: translateX(4px)` on hover/selected.
- Mobile-first: touch targets ≥ 44px, no horizontal scroll at 320px.

---

## 11. Adding a New Engine — Checklist

1. **Registry entry** — add to `searchEngines` with all applicable fields.
2. **`plusEncoding`** — verify space encoding (`+` vs `%20`) against the live engine.
3. **`promptBased`** — set `true` + append 📋 to name if the engine needs manual paste.
4. **`favicon`** — test Google S2; if missing, host the `.ico/.png` in `missing favicons/` on GitHub and use raw URL.
5. **Radio button** — `<label><input type="radio" name="searchEngine" value="prefix:">Name</label>` in correct `#groupN`.
6. **`BANG_MAP`** — add at least 2 bang tokens (short + full name).
7. **Category map** — add prefix to correct array in `updateSearchSource()`'s `categoryMap`.
8. **`performSearch()` quirks** — add `else if` branch if URL needs special construction.
9. **Filter panel** — if it has sub-modes, add a dedicated filter `<div>` and handle in `updateSearchSource()` + `performSearch()`.
10. **Wiki chips** — add `<div class="wiki-chip" data-prefix="…" data-name="…">` in wiki panel.
11. **Userscript mirror** — update the `ENGINES` array in `userscript/searchAIO_userscript.js` (starts ~line 19). Manual sync, no automation.

---

## 12. Testing Checklist (pre-commit)

- [ ] All ~55 prefixes route to correct URLs with `encodeURIComponent` applied
- [ ] CISMeF aliases auto-select correct scope radio
- [ ] AMMPS sub-radios bidirectionally sync with main `ammps:` radio
- [ ] `site:` override works for all engines; auto-activates for `msps:`, `ammps-rmmg:`, `ammps-gs:`
- [ ] `promptBased` engines: clipboard copy + notification + base URL open
- [ ] Translation boxes appear/disappear correctly; 3-API chain works
- [ ] Language proxy wraps finalUrl correctly
- [ ] `!bang` detection at start, middle, end of input
- [ ] Keyboard: Ctrl+K, Alt+↑↓, Alt+1–4, Alt+T, Alt+G, Esc (all modes)
- [ ] Filetype grid: OR-logic query, counter updates
- [ ] Wiki panel: chip click selects engine, search filter, empty state
- [ ] Dark mode persists via `localStorage`
- [ ] Mobile 320px: no overflow, touch targets ≥ 44px
- [ ] Favicons load for all engines

---

## 13. Rules For Editing This Code

- **Single-file mandate.** All app changes go in `index.html`. No new `.js`/`.css` files unless explicitly requested.
- **Vanilla JS only.** ES6+. Never suggest jQuery, React, Vue, Tailwind, or any library.
- **Zero build, zero deps.** No `package.json`, no npm install. Portability is the feature.
- **No `innerHTML` with user data.** Use `textContent` or `encodeURIComponent`. The query is untrusted.
- **`localStorage` access goes through `lsGet`/`lsSet`** (defined in `index.html`). Direct access throws in Safari private mode and sandboxed iframes.
- **Naming convention for prefixes:** short, DuckDuckGo-`!bang` style (`g:`, `yt:`, `ddg:`). Power-user muscle memory matters.
- **Don't refactor working code without confirmed bugs.** The author has explicitly said they can't fix some bugs without breaking functionality (`README.md:37`). Symptom-debug, don't refactor.
- **Delete `*Zone.Identifier` files on sight** (Windows-download artifacts).
- **Userscripts must mirror the engine list manually.** Adding an engine to `index.html` means updating `userscript/searchAIO_userscript.js` too.
- **Push to GitHub after every significant change.**
- **Power-user focus.** Prioritize speed, keyboard accessibility, information density.

---

## 14. Fragile Bits & Landmines

- **The ~5,570-line `index.html` is brittle.** AMMPS sub-prefixes, CISMeF aliases, the `msps:` site-toggle behavior, and the bang-detection priority all interact through `updateSearchSource()` and the special-case `else if` ladder in `performSearch()`. Symptom-debug, don't refactor.
- **Special URL constructors per engine** (`index.html:~4540–4640`) — each `else if` branch encodes a quirk discovered against a live site. See §9 for the catalog. Re-test the live engine before "simplifying" any of them.
- **`plusEncoding` is per-engine and overridden by special blocks.** The AMMPS family always uses `+` encoding regardless of the field; don't try to "normalize" this.
- **Bang detection runs after prefix detection but overrides it.** Bangs can appear at start, middle, or end. Changing the order in `updateSearchSource` breaks both flows.
- **Translation 3-API chain** (Google unofficial → LibreTranslate → MyMemory) — all three free/unauthenticated. Any one can rate-limit; the fallback chain hides that. Don't simplify to one.
- **Favicon swap animation** depends on the `.swapping` CSS class being toggled at the right moment in `updateSearchSource()`. Removing what looks like a stray class add will kill the animation.
- **`missing favicons/` is live**, not cruft — `index.html` references those `.ico/.png` files via `raw.githubusercontent.com` URLs for engines Google S2 can't fetch (CISMeF, Inserm, Sante.gov.ma, etc.). Don't delete.

---

## 15. Current State

- **Last shipped:**
  - `lsGet`/`lsSet` wrappers around all `localStorage` access (Safari-private-mode hardening) and removal of a dead `wikiContent.focus()` call.
  - 2026-05-25 repo cleanup: purged `stables/`, `old/`, `antigravity*`, `contexts+++/`, stray `.url` shortcut (~9.5 MB / 113 files removed), and merged former `GEMINI.md` into this file.
  - Earlier: new userscript variant `userscript/userscript-google.js` (v8.0, Google AI focus) + userscript `description.md` for GreasyFork.
  - Settings panel (⚙️ gear, bottom-buttons row) persisting to `aioSettings`. See §7.1.
  - Search history / recent-searches dropdown — **opt-in via Settings, OFF by default** (focus empty bar → last 12 queries, one-click replay). See §7.1.
- **Working on now:** Branch `claude/magical-allen-LTyfA` — settings panel + opt-in search history.
- **Next up:** _Not yet figured out._ `README.md` mentions wanting to add advanced search operators from `cipher387/Advanced-search-operators-list` and to make the page a custom new-tab extension.

---

## 16. Update Protocol (Verbatim)

> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 2. Read the recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 3. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 4. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 5. Keep §1–§4 in plain English. Keep the whole file under ~500 lines.
> 6. **There is no separate `GEMINI.md` anymore.** All architecture/engine-registry content lives here under §5–§12.
