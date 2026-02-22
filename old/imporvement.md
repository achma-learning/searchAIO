# Improvement Plan for searchAIO

Based on the analysis of `index.html` and experiments in `experiment-alpha/`, here are the recommended steps to enhance the interface and functionality.

## 1. UI/UX Modernization (Dynamic Island)
- **Implement a Pill-Shaped Search Bar**: Replace the current rectangular input with a "Dynamic Island" or "YouTube-style" pill container.
- **Internal Favicon Indicator**: Move the active engine favicon *inside* the search pill (left side) instead of sitting above it.
- **Smooth Transitions**: Add a scale/fade animation when the favicon swaps (engine change) and expand the pill width slightly when focused.

## 2. Component Refinement
- **Site Pill**: Style the `site:` checkbox as a rounded "pill" button that changes color when active, placed next to the search bar.
- **Integrated Submit**: Place the magnifying glass 🔍 inside the right edge of the dynamic island.
- **Contextual Actions**: Group the "Filetypes", "🌐 Language", and "!bangs" buttons into a clean, minimal row below the main input.

## 3. Functionality Enhancements
- **Autocomplete Highlighting**: Bold the matching part of the prefix in the autocomplete dropdown.
- **Recent Searches**: (Optional) Add a local-storage based "Recent" section in the autocomplete categorized matches.
- **Search History Clearing**: Add a small "clear" (X) button inside the search bar that appears when text is entered.

## 4. Code Robustness (Based on Alpha Fixes)
- **Variable Scoping**: Ensure all DOM elements and state variables are declared at the top level of `src/js/app.js`.
- **Null Safety**: Implement optional chaining (`?.`) or explicit null checks before accessing engine properties like `domain` or `favicon`.
- **Favicon Fallback**: Add an `onerror` handler to favicon images to provide a generic search icon if the domain favicon fails to load.

---
*Note: Priority should be given to the Dynamic Island transition as it provides the most significant visual impact.*
