📌 Project Identity
Role: Lead Software Architect & Web Developer.
Project Name: searchAIO (Multi-Engine Search Interface).
Core Philosophy: A minimalist, high-speed, keyboard-driven "Search Router" for power users. Consolidates 50+ specialized engines into a single-file portable UI.

🏗 Technical Architecture
1. Single-File Structure
The project is maintained as a single, monolithic file for maximum portability and simplicity:
- **`index.html`**: Contains all HTML structure, CSS styling (Glassmorphism/Classic), and JavaScript logic. This is the primary source of truth.

2. Data Model (The searchEngines Schema)
All modifications must adhere to this structure.
**CRITICAL:** If `promptBased` is `true`, the `name` **MUST** end with an asterisk (`*`) to notify the user that the query is copied for manual paste.

```javascript
const searchEngines = {
  'prefix:': {
    name: 'Engine Name*',        // Append * for prompt-based engines
    url: 'https://base.url/q=',  // Target search URL
    domain: 'example.com',       // Used for favicon fetching
    plusEncoding: false,         // If true, replaces spaces with +
    isAlias: false,              // If true, routes to another engine
    aliasFor: 'target:',         // Destination prefix for aliases
    filterValue: 'param',        // Pre-applied filter value
    promptBased: false,          // If true, copies query and opens base URL
    notes: ''                    // Internal notes about engine behavior
  }
}
```

3. Functional State Machine
The app operates on a Prefix → Resolve → Construct → Route pipeline:
- **Prefix Detection**: `updateSearchSource()` monitors the input for a `:` trigger.
- **Alias Resolution**: If `isAlias` is `true`, resolves to the `aliasFor` target (e.g., `cismef-bp:` → `cismef:`).
- **Filter Application**: Appends context-aware parameters for YouTube, CISMeF, or Google operators.
- **URL Construction**: Handles engine-specific quirks (e.g., Google Patents' bracketed queries or Toubkal's `&submit=OK`).
- **Security Check**: `encodeURIComponent()` is applied to all user input before routing.
- **Route to Engine**: Opens the `finalUrl` in a new tab via `window.open()`.

4. Engine-Specific URL Patterns (performSearch Logic)
**CRITICAL:** Special cases must be handled in the `performSearch()` function:
- **Google Patents (`gpat:`)**: Requires bracketed query structure: `?q=(${query})&oq=${query}`.
- **Toubkal (`these-ma:`)**: Requires the submit parameter at the end: `${baseUrl}${query}&submit=OK`.
- **Medscape (`medscape:`)**: Requires quoted queries: `?q="${query}"`.
- **Vidal, WebMD, NIH, Drugs.com**: Use `+` for spaces instead of `%20`.
- **Diseases Database (`dd:`)**: Requires `bytSearchType=0` parameter at the end.
- **Standard Handling**: Uses space encoding specified in the `searchEngines` object (defaulting to `+`).

🛠 Feature Specifications
🧬 Specialized Search Categories
- **General (🌐), Academic (🎓), Medical (⚕️), AI (🤖)**.
- Logic automatically detects the category from the prefix to update UI emojis and source indicators.

### 🚀 Advanced Features
- **Language Proxy (Translation Wrapper)**: Checkbox in the UI wraps search results in Google Translate for non-English engines (e.g., searching Yandex in Russian and viewing in English).
- **Site Search Override (`site:`)**: Button to toggle Google search within a specific engine's domain (e.g., using Google to search PubMed's site).
- **DuckDuckGo !bangs Integration**: Detects `!` syntax (e.g., `!w` for Wikipedia) and routes to DuckDuckGo's bang library.
- **Filetype Grid System**: A visual selector for 50+ file formats (Documents, Spreadsheets, Code, Images, Video) using `OR` logic (e.g., `(filetype:pdf OR filetype:docx)`).
- **Yandex/MyMemory Translation API**: Real-time English → Russian translation when the `yan:` prefix is active, with a debounced (500ms) API call.

### 🛡️ Advanced Technical Features
- **Smart Tooltip System**: Position-aware tooltips for operator buttons that dynamically adjust (above/below/left/right) to avoid viewport edges.
- **Debounced API Calls**: Prevents API spam by waiting for a 500ms pause in user typing before triggering translation or autocomplete requests.
- **Event Delegation**: Uses a single event listener on containers (e.g., operator groups) to handle clicks on dynamic buttons, improving performance.
- **Favicon Strategy**: Priority: Custom Hosting (missing icons) > Google S2 Service (`www.google.com/s2/favicons?sz=32&domain=${engine.domain}`) > Domain Root.
- **CSS Hardware Acceleration**: Uses `transform: translateY()` and `will-change` hints for smooth UI transitions and starfield animations.

🌓 UI/UX Design System
- **Classic/Compact Layout**: Favicon pinned inside the search input, integrated search button.
- **Glassmorphism**: Use of `backdrop-filter: blur()` for autocomplete and overlays.
- **Focus Overlay**: macOS-style background blurring when the search bar is active.
- **Smart Autocomplete**: Positioned dynamically (above/below) based on screen space.
- **Shortcuts popup — full Arch Linux cheatsheet redesign**:
  - **Dark terminal aesthetic**: (#0d1117 GitHub-dark palette) — intentionally stays dark even in light mode, like a real terminal cheatsheet would.
  - **macOS-style traffic light dots**: (red/yellow/green) in the header bar with the title `⌨ keybindings — Search Interface`.
  - **2-column grid**: of sections, each styled like a terminal config block with `#` prefix on section titles.
  - **kbd key chips**: each key rendered as a physical keyboard key with border-bottom depth effect.
  - **Logical Sections**: Shortcuts grouped into 4 sections: *Search Bar*, *Engine Navigation*, *Google Site: Mode*, and *Interface*.
  - **Color-coded descriptions**: green = action, blue = highlight, orange = warning.
  - **Footer**: shows total binding count + `ESC` to close hint.
  - **Custom scrollbar**: Scrollable body with custom thin scrollbar.

🚦 AI Behavioral Constraints
- **Single-File Edits**: ALWAYS edit the root `index.html`.
- **Vanilla JS**: Always prioritize Vanilla JavaScript (ES6+). Do not suggest external libraries.
- **Power-User focus**: Prioritize speed, keyboard accessibility, and information density.
- **Safety**: Ensure all user inputs are sanitized to prevent XSS.

## Development Guidelines

### 📝 Development Workflow: Adding an Engine
1. **Registry Entry**: Add a new prefix entry to the `searchEngines` object in `index.html`.
2. **Space Encoding**: Verify if the engine uses `+` or `%20` for spaces; set the `space` field accordingly.
3. **Radio Button**: Add a new `<label>` and `<input type="radio">` in the correct `.category-section`.
4. **Quirks Handling**: Check if the engine requires a custom URL pattern in `performSearch()`.
5. **Verification**: Run `addFaviconsToSearchEngines()` on page load to check for favicon loading.

### 🧪 Testing Checklist
Before committing any logic or engine updates, verify the following:
- [ ] **Routing**: All 50+ prefixes route to correct URLs with encoded queries.
- [ ] **Aliases**: `cismef-bp:` and other aliases resolve correctly with pre-applied filters.
- [ ] **Shortcuts**: `Ctrl+K`, `Alt+Arrows`, `Alt+1-4`, and `Esc` work in all modes.
- [ ] **UI Sync**: Input prefix updates radio buttons, and radio selection updates input.
- [ ] **Filters**: Context-aware filters (YouTube, CISMeF, Google) only show for relevant engines.
- [ ] **Autocomplete**: Shows on prefix typing and navigateable with `ArrowUp/Down`.
- [ ] **XSS Prevention**: `encodeURIComponent()` is applied to all queries.
- [ ] **Mobile**: Layout at 320px (no horizontal scrolling, touch targets ≥44px).
- [ ] **Dark Mode**: Persists across page reloads using `localStorage`.

- **Direct Editing**: Modify `index.html` directly for all changes.
- **Deployment**: The root `index.html` is used for GitHub Pages.
- **Deletion of Zone.Identifier Files**: Files with the pattern `*Zone.Identifier` should be deleted.
- **Preservation of `stables/**`**: Files in the `stables/` directory are read-only and must never be deleted.
- **Preservation of `stable.html`**: The file `stable.html` must never be deleted.
- **Git Push Policy**: Changes must be pushed to the GitHub repository after major logic or engine updates.
