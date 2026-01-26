I'll search for information about gemini-cli and its `/init` command that generates GEMINI.md files.Perfect! Now I have a comprehensive understanding of gemini-cli and the GEMINI.md system. Let me create an optimal GEMINI.md file for your search interface project.

---

# GEMINI.md Template for Your Multi-Engine Search Interface

Based on the gemini-cli documentation, here's a comprehensive **GEMINI.md** file tailored for your project:

```markdown
# Project: Multi-Engine Search Interface

## Project Overview

This is a unified search orchestration platform that consolidates 50+ specialized search engines into a single, keyboard-driven interface. The tool functions as a "search router" where users type prefix-based commands (e.g., `scholar: quantum computing`) to route queries to appropriate search engines without leaving the interface.

## Purpose & Target Audience

- **Primary Users**: Researchers, medical professionals, PhD students, power users
- **Core Problem Solved**: Eliminates context switching between dozens of search engines
- **Key Innovation**: Command-line-like experience in the browser with prefix routing

## Architecture

### Core Components

1. **Search Engine Registry** (`searchEngines` object)
   - Maps 50+ engines to unique prefixes
   - Structure: `{ 'prefix:': { name, url, domain, favicon, isAlias, aliasFor, filterValue } }`
   - Supports alias system for shortcuts with pre-applied filters

2. **State Management**
   - `updateSearchSource()`: Central synchronization hub that runs on every input change
   - Bidirectional sync: input ↔ radio buttons ↔ filters
   - Context-aware UI: Shows only relevant filters per engine

3. **Filter Systems**
   - YouTube: Base64-encoded parameters (sort, type, duration, date)
   - Google/Bing: Operator buttons with smart insertion
   - CISMeF: Medical document type filters
   - Filetype Grid: Visual selector for 50+ file formats

4. **Advanced Features**
   - Autocomplete with fuzzy prefix matching
   - Yandex translation (MyMemory API, debounced 500ms)
   - Keyboard shortcuts (Ctrl+K, Alt+↑/↓, etc.)
   - Dark mode with starfield animation
   - Tooltip system with smart viewport positioning

## Code Style & Conventions

### JavaScript

- **Use vanilla JavaScript** - No frameworks (React/Vue/Angular)
- **Event delegation** for dynamic elements (operator buttons, filters)
- **Debouncing** for API calls (500ms minimum)
- **Explicit encoding**: Always use `encodeURIComponent()` before URL construction
- **Error handling**: Wrap API calls in try-catch blocks
- **Naming conventions**:
  - Constants in UPPER_SNAKE_CASE
  - Functions in camelCase
  - DOM element references start with lowercase (e.g., `searchInput`)

### CSS

- **Mobile-first responsive design**
- **CSS Grid** for category cards (auto-fit with minmax)
- **Flexbox** for linear layouts (search bar, buttons)
- **GPU acceleration**: Use `transform` over `top`/`left` for animations
- **Color scheme**:
  - Light: `#667eea` (primary purple), `#f8f9fa` (backgrounds)
  - Dark: `#64b5f6` (primary blue), `#1a2332` (backgrounds)
- **Transitions**: 0.2s ease for interactive elements

### HTML

- **Semantic markup**: Use `<form>`, `<button>`, not `<div onclick>`
- **Accessibility**: Include ARIA labels for dynamic content
- **Favicon strategy**: Google's service as fallback, custom GitHub URLs for missing icons

## Special URL Construction Rules

When generating search URLs, follow these engine-specific patterns:

```javascript
// Toubkal - requires specific parameter order
if (prefix === 'these-ma:') {
  finalUrl = baseUrl + encodeURIComponent(query) + '&submit=OK';
}

// Google Patents - needs structured query format
if (prefix === 'gpat:') {
  finalUrl = baseUrl + '?q=(' + encodeURIComponent(query) + ')&oq=' + encodeURIComponent(query);
}

// Medscape - requires quoted queries
if (prefix === 'medscape:') {
  finalUrl = baseUrl + '?q="' + encodeURIComponent(query) + '"';
}

// Vidal/WebMD/NIH/Drugs.com - use + instead of %20
if (['vidal:', 'webmd:', 'nih:', 'drugs:'].includes(prefix)) {
  const encodedQuery = encodeURIComponent(query).replace(/%20/g, '+');
  finalUrl = baseUrl + encodedQuery;
}
```

## Engine Categories

### 🌐 General Search (7 engines)
- Google, YouTube, Brave, DuckDuckGo, Yandex, Bing, Google Advanced

### 🎓 Academic/Thesis (11 engines)
- Google Scholar, PubMed, arXiv, ResearchGate
- Thesis databases: Theses.fr, Toubkal (Morocco), NDLTD, These2.0, CISMeF Thèses

### ⚕️ Medical/Health (19 engines)
- **French**: CISMeF (6 variants), HAS, VIDAL, LISSA, ANM
- **International**: PubMed, UpToDate, Cochrane, Medscape, WebMD, NIH, CDC
- **Specialized**: Radiopaedia, MeSH Browser, HETOP, Diseases Database

### 🤖 AI/Advanced (7 engines)
- ChatGPT, Claude AI, Gemini, Perplexity, Copilot
- Wolfram Alpha, Google AI Mode (udm=50)

## Common Tasks & Solutions

### Adding a New Search Engine

```javascript
// 1. Add to searchEngines object
'newengine:': {
  name: 'Display Name',
  url: 'https://example.com/search?q=',
  domain: 'example.com',
  favicon: 'optional_custom_url' // Only if Google's service doesn't work
}

// 2. Add radio button in appropriate category
<label><input type="radio" name="searchEngine" value="newengine:">New Engine</label>

// 3. Run addFaviconsToSearchEngines() on page load to add favicon
```

### Creating an Alias with Pre-Selected Filter

```javascript
'cismef-bp:': {
  name: 'CISMeF Bonnes Pratiques',
  isAlias: true,
  aliasFor: 'cismef:',
  filterValue: 'env=bp&q='
}

// In updateSearchSource(), this auto-selects the correct radio button:
const filterRadio = document.querySelector(`input[name="cismef_scope"][value="${filterValue}"]`);
if (filterRadio) filterRadio.checked = true;
```

### Handling Special Characters in Queries

Always encode, but some engines need post-processing:

```javascript
// Standard encoding
let encoded = encodeURIComponent(query);

// Some engines use + for spaces
encoded = encoded.replace(/%20/g, '+');

// Some need quotes around entire query
finalUrl = baseUrl + '?q="' + encoded + '"';
```

## Testing Checklist

When making changes, verify:

- [ ] All 50+ engines route correctly
- [ ] Aliases resolve to correct base engine + filter
- [ ] Keyboard shortcuts work (Ctrl+K, Alt+↑/↓, Esc)
- [ ] Autocomplete shows on partial prefix typing
- [ ] Dark mode persists across page reloads
- [ ] YouTube filters only show for YouTube
- [ ] Google operators insert at cursor position
- [ ] Filetype selection handles multiple formats with OR
- [ ] Translation box only appears for Yandex
- [ ] Site search checkbox creates valid `site:` queries
- [ ] Mobile responsive (test at 320px, 768px, 1024px)
- [ ] Tooltips don't overflow viewport edges

## Performance Guidelines

- **Cache DOM references**: Store `getElementById()` results in constants
- **Use event delegation**: One listener per container, not per button
- **Debounce API calls**: 500ms minimum to avoid rate limits
- **Optimize animations**: Use `will-change` hint for GPU acceleration
- **Minimize reflows**: Batch DOM updates, use `documentFragment`

## Security Considerations

- **XSS Prevention**: ALL user input MUST be encoded with `encodeURIComponent()`
- **No eval()**: Never use `eval()` or `Function()` constructor
- **HTTPS only**: All external resources (APIs, CDNs) must use HTTPS
- **No sensitive data**: LocalStorage only for theme preference, never query history
- **API keys**: MyMemory API is public, no keys required

## Known Limitations

1. **No query history**: Privacy by design, but limits discoverability
2. **YouTube filters**: Only ONE filter can be active (YouTube API limitation)
3. **Favicon fallback**: Some engines require custom hosted icons
4. **Mobile tooltips**: Hover tooltips don't work on touch devices
5. **Browser support**: Requires ES6+ (Chrome 61+, Firefox 60+, Safari 12+)

## Future Enhancement Ideas

### High Priority
- Convert to browser extension (Chrome omnibox integration)
- Add query history with privacy controls (last 50 searches)
- Export/import configuration (JSON format)

### Medium Priority
- Bookmarklet version for system-wide access
- Mobile-optimized UI (swipe gestures, bottom sheets)
- Preset query templates (e.g., "Find PDFs from universities")

### Low Priority
- Multi-language support (currently French-focused)
- Analytics dashboard (most-used engines, peak usage times)
- Collaborative features (shared search configurations)

## File Organization

```
project/
├── index.html              # Main interface (single file currently)
├── GEMINI.md              # This file
├── README.md              # User-facing documentation
└── assets/                # (Future) Extracted resources
    ├── favicons/          # Custom hosted favicons
    ├── styles/            # Extracted CSS modules
    └── scripts/           # Extracted JS modules
```

## When Asking Gemini CLI for Help

### Effective Prompts

✅ **Good**: "Add a new search engine for IEEE Xplore with prefix `ieee:` and URL `https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=`"

✅ **Good**: "Fix the tooltip positioning bug where it overflows the viewport on small screens"

✅ **Good**: "Refactor the filetype selection logic to support exclusion (e.g., NOT pdf)"

❌ **Bad**: "Make it better" (too vague)

❌ **Bad**: "Add React" (conflicts with vanilla JS architecture)

### What Gemini CLI Knows About This Project

- This is a **single-file HTML application** (index.html contains HTML, CSS, JS)
- **No build step**: Changes are immediately testable in browser
- **Vanilla JavaScript**: No npm dependencies, no bundlers
- **Mobile-first responsive**: Must work on phones, tablets, desktops
- **Medical focus**: 19/50 engines are health-related

### What to Include in Context

When asking Gemini CLI to modify code:

```bash
# Always reference the full searchEngines object
@searchEngines

# For filter-related changes
@youtubeFilters @googleOperatorFilters @cismefFilters

# For styling changes
@<style> section in index.html

# For keyboard shortcuts
@document.addEventListener('keydown') event handler
```

## Related Documentation

- [DuckDuckGo !bangs](https://duckduckgo.com/bangs): Reference for adding new shortcuts
- [Google Search Operators](https://support.google.com/websearch/answer/2466433): Official operator guide
- [MyMemory Translation API](https://mymemory.translated.net/doc/spec.php): Translation service docs
- [Bing Search Operators](https://help.bing.microsoft.com/apex/index/18/en-US/10002): Bing-specific syntax

## Contact & Contribution

- **Issues**: Report bugs via GitHub Issues (if project is hosted)
- **Feature Requests**: Use GitHub Discussions or /bug command in gemini-cli
- **Style Guide**: Follow existing patterns (see Code Style section above)
- **Testing**: Manual testing required (no automated test suite yet)

---

**Last Updated**: January 2026  
**Gemini CLI Version**: Compatible with @google/gemini-cli@nightly  
**License**: (To be specified)
```

---

## How to Use This GEMINI.md File

### Initial Setup

1. **Save the file** in your project root as `GEMINI.md`
2. **Initialize gemini-cli** in your project directory:
   ```bash
   cd /path/to/your/search-interface
   gemini
   ```
3. **Verify context loaded**:
   ```bash
   /memory show
   ```
   This displays the full instructional context being sent to Gemini

### Project-Specific Commands

Once `GEMINI.md` is loaded, you can ask context-aware questions:

```bash
# Gemini now understands your search engine structure
> Add a new medical engine called "BMJ Best Practice" with prefix bmj: and URL https://bestpractice.bmj.com/search?q=

# Gemini knows to add it to the Medical category and follow the engine addition pattern

> Refactor the operator insertion logic to support keyboard shortcuts for each operator

# Gemini understands the existing keyboard shortcut system and operator button architecture

> Generate unit tests for the filetype selection logic

# Gemini knows this uses checkboxes, OR logic, and removes existing filetype: operators
```

### Hierarchical Context (Advanced)

You can create additional context files for specific components:

```
project/
├── GEMINI.md                     # Main context (general instructions)
├── src/
│   ├── filters/
│   │   └── GEMINI.md            # Filter-specific instructions
│   └── translation/
│       └── GEMINI.md            # Translation API-specific instructions
```

**Example `src/filters/GEMINI.md`:**
```markdown
# Filter Component Instructions

When modifying filter logic:
- YouTube filters are mutually exclusive (only one active)
- Google/Bing operators should insert at cursor position
- CISMeF filters map to URL parameters (env=bp&q=, etc.)
- Always test filter persistence across engine switches
```

### Memory Management Commands

```bash
# Add a quick note to global context
/memory add "Always test dark mode after UI changes"

# Refresh if you edited GEMINI.md
/memory refresh

# View the full context hierarchy
/memory show
```

### Integration with Gemini CLI Features

**Search Grounding** (uses Google Search for real-time info):
```bash
> @search What are the latest Bing search operators added in 2025?
# Gemini searches web, then updates bingOperatorDescriptions accordingly
```

**File Operations**:
```bash
> @index.html Add a new engine for "PsycINFO" to the academic category
# Gemini reads index.html, modifies searchEngines object, updates radio buttons

> glob **/*.md
# Lists all markdown files (useful for managing multiple GEMINI.md files)
```

**Shell Integration**:
```bash
> !git log --oneline -5
# Shows recent commits (useful for understanding recent changes)

> !npx prettier --write index.html
# Formats code (if prettier is configured)
```

---

## Tips for Maximizing Gemini CLI Effectiveness

### 1. **Be Specific About Constraints**
```bash
❌ "Add more search engines"
✅ "Add 3 chemistry databases (PubChem, ChemSpider, Reaxys) to a new category called '🧪 Chemistry'"
```

### 2. **Reference Existing Patterns**
```bash
✅ "Add a new alias like cismef-bp: but for PubMed, filtering by review articles"
# Gemini knows the alias pattern from GEMINI.md
```

### 3. **Request Explanations**
```bash
> Explain why YouTube filters use base64 encoding instead of plain text parameters

# Gemini will reference the architecture section and search for YouTube API docs
```

### 4. **Incremental Changes**
```bash
# Step 1
> Add the IEEE Xplore engine to searchEngines object

# Step 2
> Add the radio button to the Academic category

# Step 3
> Add the favicon reference

# Better than: "Add IEEE Xplore engine completely"
```

### 5. **Leverage Checkpointing**
```bash
# Before major refactoring
/checkpoint "before-operator-refactor"

# Make changes...

# If something breaks
/restore before-operator-refactor
```

---

## Comparison: Manual Documentation vs. GEMINI.md

| Aspect | Traditional README | GEMINI.md for gemini-cli |
|--------|-------------------|--------------------------|
| **Target Audience** | Human developers | AI assistant (Gemini) |
| **Writing Style** | Explanatory, tutorial-like | Prescriptive, rule-based |
| **Code Examples** | Illustrative snippets | Actual patterns to follow |
| **Organization** | User-friendly flow | Hierarchical, scannable |
| **Updates** | Manual, often outdated | Used on every AI interaction |
| **Scope** | Broad overview | Deep technical specifics |

**Your GEMINI.md should answer:**
- "How should I modify this codebase?"
- "What patterns exist that I should follow?"
- "What are the constraints and non-negotiables?"
- "Where can I find related documentation?"

**Your README.md should answer:**
- "What does this project do?"
- "How do I install/run it?"
- "What are common use cases?"
- "How do I contribute?"

---

This GEMINI.md file will make gemini-cli significantly more effective when working on your search interface, as it provides the AI with comprehensive context about your architecture, conventions, and project-specific requirements.