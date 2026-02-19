📌 Project Identity
Role: Lead Software Architect & Web Developer.

Project Name: searchAIO (Multi-Engine Search Interface).

Core Philosophy: A minimalist, keyboard-driven "Search Router" that consolidates 50+ specialized engines into a single-file UI.

🏗 Technical Architecture
1. Data Model (The searchEngines Schema)
The application logic is driven by a central JavaScript object. All modifications must adhere to this structure:

JavaScript
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
2. Functional State Machine
The app operates on a Prefix → Resolve → Construct → Route pipeline:

Prefix Detection: updateSearchSource() monitors the input for a : trigger.

Logic Branching: Handles engine-specific quirks (e.g., Google Patents' bracketed queries or Toubkal's &submit=OK).

URL Encoding: Sanitizes input using encodeURIComponent() and applies the specific space character defined in the model.

Language Proxying: Supports wrapping search results in a Google Translate layer (https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${finalUrl}).

🛠 Feature Specifications
🧬 Specialized Search Categories
Medical (19 Engines): Deep integration with CISMeF (using environment filters), PubMed, VIDAL, and HAS.

Academic (11 Engines): Focus on Google Scholar, ResearchGate, and multi-national Thesis databases.

AI/Advanced: Integration for LLM-based search (Baidu AI, Duck.ai, etc.).

⌨️ Keyboard-Driven UI (DX)
The interface must remain accessible without a mouse:

Ctrl + K: Global Search Focus.

Alt + Arrow Up/Down: Cycle through active engines.

Alt + 1-4: Category jumping.

Esc: Close all popups/modals.

🌓 UI/UX Design System
Glassmorphism: Use of semi-transparent backgrounds (rgba) and backdrop-filter: blur().

Favicon Strategy: Priority: Custom Hosting > Google S2 Service > Domain Root.

Mobile-First: Responsive CSS Grid and Flexbox layouts.

🚦 AI Behavioral Constraints
Code Integrity: Always prioritize Vanilla JavaScript (ES6+). Do not suggest external libraries (jQuery, Bootstrap, etc.).

Safety: Ensure all user inputs are sanitized to prevent XSS.

Encapsulation: Keep the project as a Single-File Build (index.html) unless explicitly asked to modularize.

Precision: When adding engines, check the specific search syntax (some require quotes, others require specific parameters at the end of the string).

## Development Guidelines

- **Deletion of Zone.Identifier Files:** Files with the pattern `*.Zone.Identifier` are system-generated and should be deleted from the project as they are not needed.
- **Preservation of `stables/**`:** Files in the `stables/` directory are read-only and must never be deleted. They serve as stable reference points for the project.
- **Preservation of `stable.html`:** The file `stable.html` must never be deleted. It serves as a stable reference point for the project.
- **Git Push Policy:** After each code update, changes must be pushed to the GitHub repository to ensure that the codebase remains current and synchronized.
