📌 Project Identity
Role: Lead Software Architect & Web Developer.

Project Name: searchAIO (Multi-Engine Search Interface).

Core Philosophy: A minimalist, keyboard-driven "Search Router" that consolidates 50+ specialized engines into a single-file UI.

🏗 Technical Architecture
1. Modular Source Structure (Development)
The project is modularized to support AI-assisted "video coding" and better maintainability while fulfilling the single-file build requirement for production:
- **`src/index.html`**: The structural skeleton (HTML template).
- **`src/css/styles.css`**: All Glassmorphism, layout, and component styling.
- **`src/js/engines.js`**: The central `searchEngines` data dictionary. This is the most frequently updated file.
- **`src/js/app.js`**: Core logic, state machine, and keyboard event handlers.
- **`build.py`**: Python script to bundle `src/` files into the root `index.html`.

2. Single-File Build (Production/Hosting)
- **`index.html`**: The final auto-generated artifact served by **GitHub Pages**. This file must never be edited manually.

3. Data Model (The searchEngines Schema)
All modifications in `src/js/engines.js` must adhere to this structure:

```javascript
const searchEngines = {
  'prefix:': {
    name: 'Engine Name*',        // UI Display (* for prompt-based engines)
    url: 'https://base.url/q=',  // Target search URL
    domain: 'example.com',       // Used for favicon fetching
    space: '+',                  // Character for space replacement (+ or %20)
    favicon: 'custom_url',       // Optional: Override favicon
    isAlias: false,              // If true, routes to another engine
    aliasFor: 'target:',         // Destination prefix for aliases
    filterValue: 'param',        // Pre-applied filter value
    promptBased: false,          // If true, copies query and opens base URL for manual paste
    notes: ''                    // Internal notes about engine behavior
  }
}
```

4. Functional State Machine
The app operates on a Prefix → Resolve → Construct → Route pipeline:
- **Prefix Detection**: `updateSearchSource()` monitors the input for a `:` trigger.
- **Logic Branching**: Handles engine-specific quirks (e.g., Google Patents' bracketed queries or Toubkal's `&submit=OK`).
- **URL Encoding**: Sanitizes input using `encodeURIComponent()` and applies the specific space character defined in the model.
- **Language Proxying**: Supports wrapping search results in a Google Translate layer (`https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${finalUrl}`).

🛠 Feature Specifications
🧬 Specialized Search Categories
Medical (19 Engines): Deep integration with CISMeF (using environment filters), PubMed, VIDAL, and HAS.
Academic (11 Engines): Focus on Google Scholar, ResearchGate, and multi-national Thesis databases.
AI/Advanced: Integration for LLM-based search (Baidu AI, Duck.ai, etc.).

⌨️ Keyboard-Driven UI (DX)
The interface must remain accessible without a mouse:
- **Ctrl + K**: Global Search Focus.
- **Alt + Arrow Up/Down**: Cycle through active engines.
- **Alt + 1-4**: Category jumping.
- **Esc**: Close all popups/modals.

🌓 UI/UX Design System
- **Glassmorphism**: Use of semi-transparent backgrounds (rgba) and `backdrop-filter: blur()`.
- **Favicon Strategy**: Priority: Custom Hosting > Google S2 Service > Domain Root.
- **Mobile-First**: Responsive CSS Grid and Flexbox layouts.

🚦 AI Behavioral Constraints
- **Modular Edits**: ALWAYS edit files in `src/` and run the build script. NEVER edit the root `index.html`.
- **Vanilla JS**: Always prioritize Vanilla JavaScript (ES6+). Do not suggest external libraries.
- **Safety**: Ensure all user inputs are sanitized to prevent XSS.
- **Build First**: After modifying logic or styles, the build script MUST be executed to reflect changes in the live preview.

## Development Guidelines

- **Build Command**: Run `python3 build.py` after any source change.
- **Deployment**: The root `index.html` is used for GitHub Pages. Ensure it is updated before pushing.
- **Deletion of Zone.Identifier Files**: Files with the pattern `*Zone.Identifier` (e.g., "index.htmlZone.Identifier") are system-generated and should be deleted.
- **Preservation of `stables/**`**: Files in the `stables/` directory are read-only and must never be deleted.
- **Preservation of `stable.html`**: The file `stable.html` must never be deleted.
- **Git Push Policy**: After each code update and successful build, changes must be pushed to the GitHub repository.
