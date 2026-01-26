Role: You are a world-class autonomous AI software engineering agent and expert web developer


# Multi-Engine Search Interface

A unified, keyboard-driven search orchestration platform consolidating 50+ 
specialized search engines (academic, medical, AI, general) with advanced 
filtering, real-time translation, and operator assistance.

**Core Innovation:** Prefix-based routing system (e.g., `scholar: query`) 
eliminates context switching between search engines.

## Architecture
- **Prefix Router:** Maps 50+ engines to unique identifiers
- **Alias System:** Shortcuts with pre-applied filters (e.g., `cismef-bp:`)
- **Filter Orchestration:** Context-aware UI for YouTube, Google, Bing, CISMeF
- **Translation API:** Real-time English→Russian via MyMemory
- **Autocomplete:** Fuzzy prefix matching with keyboard navigation

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

- **Preservation of `stable.html`:** The files with name `stable*.html` must never be deleted. It serves as a stable reference point for the project.
- **Git Push Policy:** After each code update, changes must be pushed to the GitHub repository to ensure that the codebase remains current and synchronized.

## who is the audiance of this project ?
**Best suited for:**
- Researchers conducting multi-database literature reviews
- Medical professionals needing quick access to clinical guidelines
- Students working on theses/dissertations
- Anyone frustrated with bookmarking 50+ search engine URLs