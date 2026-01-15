# Gemini Code Companion Report: promo.html

## Overview

The file `promo.html` is a sophisticated, single-page web application designed as a powerful multi-search interface. It consolidates numerous search engines and online resources into a single, efficient, and user-friendly dashboard. The primary goal of this tool is to streamline the research process for users, particularly in academic and medical fields, by providing quick access to a categorized and curated list of search providers.

## Key Features

- **Categorized Search:** The page groups search engines into logical categories:
    - General Search (Google, YouTube, etc.)
    - Academic/Thesis Search (Google Scholar, PubMed, etc.)
    - Medical/Health Search (CISMeF, Vidal, etc.)
    - AI/Advanced Search (Wolfram Alpha, ChatGPT, etc.)
- **Dynamic Source Selection:** Users can select a search engine via radio buttons. The interface provides real-time feedback on the selected search source.
- **Filetype Filtering:** The interface includes a feature to filter searches by filetype (e.g., PDF, DOCX), which is particularly useful for finding specific documents.
- **Dark Mode:** A toggle for dark mode is available for user comfort.
- **Interactive Wiki:** A built-in "Wiki" feature explains the available search prefixes and operators.
- **Privacy-first:** No external dependencies except for the favicon service.
- **Smooth Animations:** Enhances user experience with fade-in effects and other subtle transitions.
- **Responsive Design:** Adapts to various screen sizes, featuring a single-column layout on mobile devices and a two-column layout on desktops.

## Technical Details

- **Frontend:** The page is built with HTML, CSS, and vanilla JavaScript.
- **Styling:** It uses a modern design with a clean layout, custom fonts, and a space-themed animated background.
- **JavaScript Functionality:**
    - The core logic is handled by JavaScript, which manages search engine selection, URL construction, and dynamic content updates.
    - It includes functions to handle search submissions, update UI elements, and manage pop-up windows for filetype selection and wikis.

## Goals & Evolution

The primary goal of `promo.html` is to be an all-in-one search solution that evolves with the user's needs. The structure of the code and the presence of various experimental files in the `search` directory suggest that this is an active project with ongoing development.

Future updates will likely focus on:
- **Adding more search sources:** The flexible, categorized structure makes it easy to integrate new search engines.
- **Enhancing user experience:** Further improvements to the UI/UX are expected, potentially including more customization options.
- **Expanding filtering capabilities:** More advanced filtering and search operators could be added to refine search results further.

This `GEMINI.md` file will be automatically updated to reflect the latest changes and features as the project progresses.

---

## Latest Project Description (from User)

**Advanced Multi-Engine Search Portal** - A sophisticated web application featuring:

*   35+ search engines across general, academic, medical, and AI categories
*   Prefix-based routing (g:, yt:, scholar:) with autocomplete
*   Engine-specific filters (YouTube sorting, CISMeF medical docs, Google/Bing operators)
*   Advanced features: Filetype selector, dark mode, keyboard shortcuts, contextual wikis
*   Smart UI: Dynamic favicon loading, tooltip system, responsive design with starfield animation
*   Optimised mainly for desktop and laptop screens