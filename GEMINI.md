# searchAIO — Multi-Engine Search Interface
## Master Context & Architecture Reference

---

## 📌 Project Identity

- **Role**: Lead Software Architect & Web Developer
- **Project Name**: searchAIO (Multi-Engine Search Interface)
- **Core Philosophy**: A minimalist, keyboard-driven "Search Router" that consolidates 50+ specialized engines into a single, portable, single-file UI. No frameworks. No build steps. Open and go.
- **Target Audience**: Researchers, medical professionals (French & Moroccan focus), PhD students, and power users who need fast access to multiple specialized databases without context-switching.

---

## 🏗 Technical Architecture

### 1. Single-File Structure
The entire project lives in **`index.html`** — all HTML, CSS, and JavaScript. This is the canonical source of truth. No build tools, no bundlers, no external dependencies beyond Google Fonts.

**Deployment**: GitHub Pages, served directly from `index.html`.

**Preservation Rules**:
- all files under `stables/` are **read-only backups** — never delete them.
- Files that have `Zone.Identifier` in their names , should be deleted.
- Push to GitHub after every significant change.

---

### 2. Data Model — The `searchEngines` Schema

```javascript
const searchEngines = {
  'prefix:': {
    name: 'Display Name',         // UI label. Append 📋 for promptBased engines.
    url: 'https://base.url/q=',  // Base search URL (query appended here)
    domain: 'example.com',       // Used by Google S2 favicon service
    favicon: 'custom_url',       // Optional: overrides favicon strategy (GitHub raw URLs preferred)
    plusEncoding: true,           // If true, replaces %20 with + in encoded query
    isAlias: false,               // If true, routes to aliasFor with filterValue pre-applied
    aliasFor: 'target:',          // Target prefix for alias resolution
    filterValue: 'env=bp&q=',     // Pre-applied filter for alias (CISMeF / AMMPS)
    promptBased: false,           // If true: copies query to clipboard, opens base URL
    directUrl: 'https://...',     // Optional: secondary URL used in specific routing logic (e.g., msps:)
  }
}
```

**Critical naming convention**: Follow DuckDuckGo !bangs style for brevity (`g:`, `yt:`, `ddg:`, `yan:`). Power users expect short, memorable prefixes.

---

### 3. Engine Registry — Current Complete List

#### 🌐 General / Wiki (13 engines)
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

#### 🎓 Academic / Research (13 engines)
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
| `bdedu:` | Baidu Xueshu | `plusEncoding`, shows Chinese translation box |
| `proinserm:` | Pro Inserm | Custom favicon |
| `cybl:` | CyberLeninka | Shows Russian translation box, `&page=1` suffix |

#### ⚕️ Medical — French & Moroccan (25 engines)
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

#### ⚕️ Medical — International (11 engines)
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

#### 🤖 AI / Advanced (10 engines)
| Prefix | Engine | Notes |
|--------|--------|-------|
| `wolf:` | Wolfram Alpha | |
| `chatgpt:` | ChatGPT | `plusEncoding` |
| `claude:` | Claude AI 📋 | `promptBased` |
| `gemini:` | Gemini 📋 | `promptBased` |
| `perplexity:` | Perplexity | |
| `copilot:` | Copilot 📋 | `promptBased` |
| `cbd:` | Chat Baidu | `plusEncoding`, shows Chinese translation box |
| `ernie:` | Baidu AI 📋 | `promptBased` |
| `duckai:` | Duck.ai | `plusEncoding` |

---

### 4. The !Bang System

A dedicated `BANG_MAP` object maps 80+ `!shortcut` tokens (e.g., `!g`, `!pm`, `!csf`) to internal prefixes. The `detectBang(value)` function scans the input right-to-left for any `!token` and extracts `{ prefix, token, cleanQuery }`.

**Key behavior**: Bangs can appear **anywhere** in the input (prefix, middle, end). The UI shows a `#bang-indicator` chip when a bang is detected. Bangs take priority over typed prefixes.

---

### 5. Functional State Machine

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
     - Toggle translation    yan: / cybl: → Russian box | bd:/bdedu:/cbd: → Chinese box
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
  5. Engine-specific routing (see URL Construction Rules)
  6. promptBased             copy query → clipboard, open base URL, show notification
  7. Google Translate wrap   if selectedOutputLang ≠ 'original' → wrap in translate.google.com
        ↓
  window.open(finalUrl, '_blank')
```

---

## 🛠 Feature Specifications

### Search Bar & UI Components

- **Favicon inside input**: `#search-prefix-favicon` swaps with animation on engine change
- **Source indicator**: `#searchSource` shows `emoji + engine name` in green when engine is resolved
- **siteBtn**: Toggle Google `site:` search for current engine. Auto-activates for `ammps-rmmg:`, `ammps-gs:`, `msps:`.
- **bangsBtn**: Opens `duckduckgo.com/bangs` search in a popup window
- **duckBangBtn**: Opens `mosermichael.github.io/duckduckbang` (only visible when `ddg:` is active)
- **`#bang-indicator`**: Appears when a `!bang` token is detected, shows resolved engine name
- **Legend Bar** (fixed footer): Shows 📋 paste reminder when a `promptBased` engine is active

### Filter Panels (Context-Aware)

Each panel is hidden by default and toggled by `updateSearchSource()`:

**YouTube Filters** (`youtubeFilters`):
- Sort: Relevance | Upload Date | View Count | Rating
- Type: All | Video | Channel | Playlist | Movie
- Duration: Any | Short (<4m) | Medium (4–20m) | Long (>20m)
- Date: Any | Last Hour | Today | This Week | Month | Year
- Only ONE filter group applies per search (the first non-empty group wins)

**Google Operator Buttons** (`googleOperatorFilters`):
- Basic: `" "`, `OR`, `-`, `*`, `( )`, `in`
- Advanced: `site:`, `intitle:`, `allintitle:`, `inurl:`, `allinurl:`, `intext:`, `allintext:`, `filetype:`, `related:`
- Specialized: `define:`, `source:`, `stocks:`, `weather:`, `before:`, `after:`, `AROUND()`
- Each button inserts operator at cursor position (smart cursor placement for `" "` and `( )`)
- Smart viewport-aware tooltips (300ms delay) with Google favicon footer

**Bing Operator Buttons** (`bingOperatorFilters`):
- `" "`, `OR`, `NOT`, `site:`, `filetype:`, `inurl:`, `inbody:`, `intitle:`, `define:`, `imagesize:`, `feed:`, `language:`

**CISMeF Scope Filter** (`cismefFilters`):
- Générale | Bonnes Pratiques | Éducation | Patients | Thèses | ECN
- Aliases pre-select the correct radio on engine detection

**AMMPS Scope Filter** (`ammpsFilters`):
- Médicaments | Liste Médicaments | RMMG | Vaccins Libérés | Pharmacies | site:AMMPS
- Sub-radio value IS the effective prefix for lookup
- Bidirectional sync: selecting a sub-radio also selects the `ammps:` main radio

**Filetype Grid** (`filetypesPopup`):
- Categories: Documents, Spreadsheets/Presentations, Code/Web, Images, Video/Media, Niche/Specialized
- Multi-extension support (e.g., `doc,docx` becomes `(filetype:doc OR filetype:docx)`)
- Query injected directly into `#searchInput` as `filetype:` operator

### Translation System

**Architecture**: 3-engine fallback chain per translation request:
1. **Google Unofficial** (`translate.googleapis.com/translate_a/single?client=gtx`) — best quality
2. **LibreTranslate** (`libretranslate.com/translate`) — open-source fallback
3. **MyMemory API** (`api.mymemory.translated.net`) — last resort

All translation boxes debounce at **500ms**.

**Yandex Translation Box** (`yandexTranslationBox`) — visible only for `yan:`:
- Source language selector (EN/FR/DE/ES/AR/ZH/IT/PT)
- Auto-translates to Russian
- Buttons: 🔗 Open in Yandex Translate | ✅ Insert into search bar | 📋 Copy
- `Alt+V` = Translate Search Bar (translates `#searchInput` content)
- `Alt+I` = Insert | `Alt+Q` = Copy | `Alt+U` = Open

**CyberLeninka Translation Box** (`cyblTranslationBox`) — visible only for `cybl:`:
- Identical behavior to Yandex box, same API chain
- `yandexTranslate.com` fallback URL

**Baidu / Chinese Translation Box** (`baiduTranslationBox`) — visible for `bd:`, `bdedu:`, `cbd:`, `bdbk:`:
- Language pair dropdown: `en2zh`, `auto2zh`, `zh2en`, `fr2zh`, `ar2zh`
- `bdbk:` defaults to `en2zh`
- Backup button opens `fanyi.baidu.com` with `#from/to/text` hash format
- Status uses inline color styling (orange loading, green success, red error)

**Language Proxy** (`langPopup`):
- `Alt+T` opens language selector popup
- Options: Original | 🇫🇷 FR | 🇬🇧 EN | 🇸🇦 AR | 🇪🇸 ES | 🇷🇺 RU | 🇨🇳 ZH
- When active (≠ 'original'), wraps finalUrl in `https://translate.google.com/translate?sl=auto&tl=XX&u=...`
- `Alt+O` (Shift) resets to original

### Wiki / Engine Browser Panel (`wikiContent`)

- Triggered by `wikiToggleBtn`, keeps open via `keepWikiOpenCheckbox`
- Search filter input (`wikiSearchInput`) — live filter by prefix or engine name
- Category tabs: All | 🌐 General | 🎓 Academic | ⚕️ Medical | 🤖 AI
- Chip grid (`wiki-chip`) — click to select engine (checks radio + updates source), optional keep-open
- Empty state with "No results for '…'" feedback

### Google Wiki Popup (`googleWikiPopup`) & Bing Wiki Popup (`bingWikiPopup`)

- Auxiliary reference panels showing operator cheatsheets
- Triggered by dedicated buttons (only visible for `g:` / `bing:`)
- Keep-open checkbox toggles `Esc` behavior

### Keyboard Shortcuts Popup

Dark terminal aesthetic — intentionally stays dark in both light/dark mode:
- `#0d1117` GitHub-dark background
- macOS traffic-light dots (red/yellow/green) in header
- 2-column grid of sections, `#`-prefixed section titles
- `kbd` chips with border-bottom depth effect
- Custom thin scrollbar

---

## ⌨️ Full Keyboard Shortcut Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus search input |
| `Ctrl+Shift+K` | Clear + focus input |
| `Ctrl+Shift+C` | Copy input content |
| `Alt+↑ / ↓` | Cycle through all engines |
| `Alt+1 / 2 / 3 / 4` | Jump to first engine in group |
| `Alt+G` | Instant Google `site:` search for current engine |
| `Alt+Shift+G` | Toggle `site:` mode |
| `Alt+T` | Open output language popup |
| `Alt+Shift+O` | Reset output language to original |
| `Alt+F/E/A/S/R/C` | Set output language FR/EN/AR/ES/RU/ZH |
| `Alt+V` | Translate search bar content |
| `Alt+I` | Insert translation into search bar |
| `Alt+Q` | Copy translation to clipboard |
| `Alt+U` | Open external translation service |
| `Esc` | Close active popup/panel (respects keep-open checkboxes) |

---

## 🔧 Special URL Construction Rules (performSearch)

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

// Diseases Database — type parameter (NOTE: use raw encodeURIComponent, not plusEncoding)
// The url itself ends with strUserInput= and bytSearchType=0 is appended after

// MSPS (Moroccan Ministry of Health):
// - siteBtn ON  → uses engine.url (Google site:sante.gov.ma)
// - siteBtn OFF → uses engine.directUrl (native site search)

// AMMPS engines: always use plusEncoding regardless of plusEncoding field
// (handled in dedicated AMMPS block reading sub-radio)
```

---

## 🎨 UI/UX Design System

### Color Scheme

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| Primary | `#9c5af2` (purple) | `#9c5af2` (same) |
| Body BG | Deep blue gradient `#000022 → #051937 → #001f3f` | same |
| Card BG | `#ffffff` | `#1a2332` |
| Category card BG | `linear-gradient(145deg, #f8f9fa, #e9ecef)` | Dark variant |
| Category border | `#667eea` | `#64b5f6` |
| Selected radio | `linear-gradient(135deg, #667eea, #764ba2)` | same |
| Input focus ring | `rgba(156, 90, 242, 0.4)` | `rgba(156, 90, 242, 0.3)` |
| Focus overlay | `rgba(0,0,0,0.4)` + blur | `rgba(0,0,0,0.6)` + blur |

### Typography
- Body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial`
- Search input: `'Roboto', sans-serif, weight 500`
- Category titles / radio labels: `'Papyrus', cursive, fantasy`
- Shortcuts popup / code: `'JetBrains Mono'`, `'Source Code Pro'`

### Animation Conventions
- Transitions: `0.2s ease` for interactive elements, `0.3s cubic-bezier(0.4,0,0.2,1)` for overlays
- GPU acceleration: use `transform: translateY()`, never `top`/`left` for animations
- Favicon swap: `.swapping` class triggers CSS keyframe

### Layout
- Container: `max-width: 1200px`, `border-radius: 16px`, responsive padding
- Engine groups: `CSS Grid auto-fit minmax(240px, 1fr)`
- Radio labels: `transform: translateX(4px)` on hover/selected
- Mobile-first: touch targets ≥ 44px, no horizontal scroll at 320px

---

## 📐 Adding a New Engine — Checklist

1. **Registry entry** — add to `searchEngines` with all applicable fields
2. **`plusEncoding`** — verify space encoding (`+` vs `%20`) with the live engine
3. **`promptBased`** — set `true` + append 📋 to name if the engine requires manual paste
4. **`favicon`** — test Google S2 service; if missing, host the `.ico/.png` in `missing favicons/` on GitHub and use raw URL
5. **Radio button** — add `<label><input type="radio" name="searchEngine" value="prefix:">Name</label>` in correct `#groupN`
6. **BANG_MAP** — add at least 2 bang tokens (short + full name)
7. **Category map** — add prefix to correct array in `updateSearchSource()`'s `categoryMap`
8. **`performSearch()` quirks** — add `else if` branch if URL needs special construction
9. **Filter panel** — if it has sub-modes, add a dedicated filter `<div>` and handle in `updateSearchSource()` + `performSearch()`
10. **Wiki chips** — add `<div class="wiki-chip" data-prefix="..." data-name="...">` in wiki panel

---

## 🧪 Testing Checklist (Pre-Commit)

- [ ] All 50+ prefixes route to correct URLs with `encodeURIComponent` applied
- [ ] CISMeF aliases auto-select correct scope radio
- [ ] AMMPS sub-radios bidirectionally sync with main `ammps:` radio
- [ ] `site:` override works for all engines; auto-activates for `msps:`, `ammps-rmmg:`, `ammps-gs:`
- [ ] `promptBased` engines copy to clipboard + show notification + open base URL
- [ ] Translation boxes: appear/disappear correctly; 3-API chain works
- [ ] Language proxy wraps finalUrl correctly
- [ ] `!bang` detection: works at start, middle, and end of input
- [ ] Keyboard shortcuts: Ctrl+K, Alt+↑↓, Alt+1–4, Alt+T, Alt+G, Esc (all modes)
- [ ] Filetype grid: OR-logic query construction, counter updates
- [ ] Wiki panel: chip click selects engine, search filter works, empty state shows
- [ ] Dark mode persists via `localStorage`
- [ ] Mobile: 320px layout, no overflow, touch targets ≥ 44px
- [ ] Favicons load for all new engines

---

## 🚦 AI Behavioral Constraints

- **Single-file mandate**: ALL changes go into `index.html`. No external `.js` or `.css` files unless explicitly requested.
- **Vanilla JS only**: ES6+. Never suggest jQuery, React, Vue, or any library.
- **No innerHTML with user data**: Use `textContent` or `encodeURIComponent` to prevent XSS.
- **Power-user focus**: Prioritize speed, keyboard accessibility, information density.
- **Preserve existing logic**: When adding engines or features, don't refactor working code unless bugs are confirmed.
- **Git push policy**: Push to GitHub after every significant logic or engine update.