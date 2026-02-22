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
- **Prefix Detection**: Monitors the input for a `:` trigger.
- **Meta-Prefix `se:`**: Allows searching through the list of engines via the autocomplete menu.
- **Logic Branching**: Handles engine quirks (e.g., Google Patents' brackets or Toubkal's `&submit=OK`).
- **Language Proxying**: Supports wrapping search results in a Google Translate layer.

🛠 Feature Specifications
🧬 Specialized Search Categories
- **General (🌐), Academic (🎓), Medical (⚕️), AI (🤖)**.
- Logic automatically detects the category from the prefix to update UI emojis and source indicators.

⌨️ Keyboard-Driven UI (DX)
- **Ctrl + K**: Global Search Focus.
- **Ctrl + Shift + K**: Clear and Focus search bar.
- **Alt + Arrow Up/Down**: Cycle through active engines.
- **Alt + 1-4**: Category jumping.
- **Ctrl + Shift + C**: Copy current query to clipboard.
- **Esc**: Close all popups/modals.

🌓 UI/UX Design System
- **Classic/Compact Layout**: Favicon pinned inside the search input, integrated search button.
- **Glassmorphism**: Use of `backdrop-filter: blur()` for autocomplete and overlays.
- **Focus Overlay**: macOS-style background blurring when the search bar is active.
- **Smart Autocomplete**: Positioned dynamically (above/below) based on screen space.

🚦 AI Behavioral Constraints
- **Single-File Edits**: ALWAYS edit the root `index.html`.
- **Vanilla JS**: Always prioritize Vanilla JavaScript (ES6+). Do not suggest external libraries.
- **Power-User focus**: Prioritize speed, keyboard accessibility, and information density.
- **Safety**: Ensure all user inputs are sanitized to prevent XSS.

## Development Guidelines

- **Direct Editing**: Modify `index.html` directly for all changes.
- **Deployment**: The root `index.html` is used for GitHub Pages.
- **Deletion of Zone.Identifier Files**: Files with the pattern `*Zone.Identifier` should be deleted.
- **Preservation of `stables/**`**: Files in the `stables/` directory are read-only and must never be deleted.
- **Preservation of `stable.html`**: The file `stable.html` must never be deleted.
- **Git Push Policy**: Changes must be pushed to the GitHub repository after major logic or engine updates.
