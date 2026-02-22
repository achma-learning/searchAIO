📌 Project Identity
Role: Lead Software Architect & Web Developer.

Project Name: searchAIO (Multi-Engine Search Interface).

Core Philosophy: A minimalist, keyboard-driven "Search Router" that consolidates 50+ specialized engines into a single-file UI.

🏗 Technical Architecture
1. Single-File Structure
The project is maintained as a single, monolithic file for maximum portability and simplicity:
- **`index.html`**: Contains all HTML structure, CSS styling (in `<style>`), and JavaScript logic (in `<script>`). This is the primary source of truth.

2. Data Model (The searchEngines Schema)
The `searchEngines` dictionary within `index.html` must adhere to this structure:

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

3. Functional State Machine
The app operates on a Prefix → Resolve → Construct → Route pipeline:
- **Prefix Detection**: `updateSearchSource()` monitors the input for a `:` trigger.
- **Logic Branching**: Handles engine-specific quirks (e.g., Google Patents' bracketed queries).
- **URL Encoding**: Sanitizes input using `encodeURIComponent()`.
- **Language Proxying**: Supports wrapping search results in a Google Translate layer.

🛠 Feature Specifications
🧬 Specialized Search Categories
Medical (19 Engines): Deep integration with CISMeF, PubMed, VIDAL, and HAS.
Academic (11 Engines): Focus on Google Scholar, ResearchGate, and Thesis databases.
AI/Advanced: Integration for LLM-based search.

⌨️ Keyboard-Driven UI (DX)
- **Ctrl + K**: Global Search Focus.
- **Alt + Arrow Up/Down**: Cycle through active engines.
- **Alt + 1-4**: Category jumping.
- **Esc**: Close all popups/modals.

🌓 UI/UX Design System
- **Glassmorphism**: Use of semi-transparent backgrounds and `backdrop-filter: blur()`.
- **Favicon Strategy**: Google S2 Service > Domain Root.
- **Mobile-First**: Responsive CSS Grid layouts.

🚦 AI Behavioral Constraints
- **Single-File Edits**: ALWAYS edit the root `index.html`. Do not look for or use a `src/` directory.
- **Vanilla JS**: Always prioritize Vanilla JavaScript (ES6+).
- **Safety**: Ensure all user inputs are sanitized to prevent XSS.

## Development Guidelines

- **Direct Editing**: Modify `index.html` directly for all changes.
- **Deployment**: The root `index.html` is used for GitHub Pages.
- **Deletion of Zone.Identifier Files**: Files with the pattern `*Zone.Identifier` should be deleted.
- **Preservation of `stables/**`**: Files in the `stables/` directory are read-only and must never be deleted.
- **Preservation of `stable.html`**: The file `stable.html` must never be deleted.
- **Git Push Policy**: Changes must be pushed to the GitHub repository after every major update.
