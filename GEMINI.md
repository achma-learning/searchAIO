# Multi-Engine Search Interface

A unified, keyboard-driven search orchestration platform consolidating 50+ 
specialized search engines (academic, medical, AI, general) with advanced 
filtering, real-time translation, and operator assistance.

**Core Innovation:** Prefix-based routing system (e.g., `scholar: query`) 
eliminates context switching between search engines.

## Architecture
- **Main Search Interface (`index.html`):** A standalone HTML file providing the core search functionality with prefix routing, filtering, translation, and autocomplete. It contains a large JavaScript section that handles the logic.
- **Search Portal (React Application):** A modern frontend application built with React and Vite, likely intended for a more complex or modular search experience, located under `others/s/searchAIO/search-portal`.
- **BookmarkOpener (Chrome Extension):** A browser extension that interacts with the local search page to facilitate opening Chrome bookmarks, located under `BookmarkOpener`.

## Main Technologies:
- **Frontend:** HTML, CSS, JavaScript (for `index.html`), React, TypeScript (for `search-portal`).
- **Browser Extension:** JavaScript (for `BookmarkOpener`).
- **Build Tool:** Vite (for `search-portal`).
- **Linting:** ESLint (for `search-portal`).

## Performance
- Event delegation for operator buttons
- Debounced API calls (500ms)
- CSS GPU acceleration for animations
- Single-class dark mode toggle

## Specialized Coverage

**Medical (19 engines):**
- CISMeF (French medical portal) with 6 filter modes
- PubMed, Cochrane, UpToDate, Medscape, VIDAL
- HAS (French Health Authority), NIH, CDC

**Academic (11 engines):**
- Google Scholar, arXiv, ResearchGate
- 4 thesis databases (France, Morocco, international, specialized)
- Google Patents

## Building and Running:

*   **Main Search Interface (`index.html`):**
    *   This is a static HTML file and can be opened directly in a web browser. No special build steps are required.

*   **Search Portal (React Application located in `others/s/searchAIO/search-portal`):**
    *   **Install dependencies:**
        ```bash
        cd others/s/searchAIO/search-portal
        npm install
        ```
    *   **Run in development mode:**
        ```bash
        npm run dev
        ```
    *   **Build for production:**
        ```bash
        npm run build
        ```

*   **BookmarkOpener (Chrome Extension located in `BookmarkOpener`):**
    *   This is a browser extension. To use it:
        1.  Open Google Chrome.
        2.  Go to `chrome://extensions/`.
        3.  Enable "Developer mode" (usually a toggle in the top right).
        4.  Click "Load unpacked" and select the `BookmarkOpener` directory.

## Development Conventions:
- **Code Style:** ESLint is configured for the `search-portal` React project.
- **Type Checking:** TypeScript is used in the `search-portal` project.
- **Version Control:** Git is used for version control.

## Gemini-CLI Integration Potential

This interface could complement gemini-cli by:
1. **Pre-processing Queries:** Format queries with operators before sending to Gemini
2. **Source Routing:** Use Gemini to determine best search engine for query type
3. **Multi-Engine Synthesis:** Search multiple engines, let Gemini summarize results
4. **Natural Language → Operators:** "Find PDFs about X from universities" → 
   `filetype:pdf X site:.edu`

**Example Workflow:**
```bash
gemini "Find recent machine learning papers from arxiv"
# Gemini outputs: arxiv: machine learning after:2024-01-01
# Interface executes search automatically
```

## Gemini-CLI Enhancements

1. **Search Intent Classification**
   ```bash
   gemini --search "diabetes treatment guidelines"
   # Gemini determines: Medical query → Route to CISMeF + PubMed
   # Executes both searches, synthesizes results
   ```

2. **Operator Suggestion**
   ```bash
   gemini --optimize-query "python tutorials for beginners"
   # Outputs: intitle:tutorial python beginner filetype:pdf
   ```

3. **Cross-Engine Comparison**
   ```bash
   gemini --compare "climate change" --engines scholar,arxiv,pubmed
   # Searches all three, generates comparative summary
   ```

4. **Query Translation Pipeline**
   ```bash
   gemini --translate-search "quantum physics" --to ru --engine yan:
   # Translates → Searches Yandex → Translates results back
   ```

## Development Guidelines

- **Preservation of `stable.html`:** The file `stable.html` must never be deleted. It serves as a stable reference point for the project.
- **Git Push Policy:** After each code update, changes must be pushed to the GitHub repository to ensure that the codebase remains current and synchronized.
