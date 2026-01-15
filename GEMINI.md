# Gemini Code Companion Report: index.html

## Overview

The file `index.html` is a sophisticated, single-page web application designed as a powerful multi-search interface. It consolidates numerous search engines and online resources into a single, efficient, and user-friendly dashboard. The primary goal of this tool is to streamline the research process for users, particularly in academic and medical fields, by providing quick access to a categorized and curated list of search providers.

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
- **Keyboard Shortcuts:** A dedicated pop-up displays available keyboard shortcuts for power users (e.g., `Ctrl+K` to focus search, `Alt+↑/↓` to cycle engines). This list is automatically updated from the source code.

## Technical Details

- **Frontend:** The page is built with HTML, CSS, and vanilla JavaScript.
- **Styling:** It uses a modern design with a clean layout, custom fonts, and a space-themed animated background.
- **JavaScript Functionality:**
    - The core logic is handled by JavaScript, which manages search engine selection, URL construction, and dynamic content updates.
    - It includes functions to handle search submissions, update UI elements, and manage pop-up windows for filetype selection and wikis.

## Goals & Evolution

The primary goal of `index.html` is to be an all-in-one search solution that evolves with the user's needs. The structure of the code and the presence of various experimental files in the `search` directory suggest that this is an active project with ongoing development.

Future updates will likely focus on:
- **Adding more search sources:** The flexible, categorized structure makes it easy to integrate new search engines.
- **Enhancing user experience:** Further improvements to the UI/UX are expected, potentially including more customization options.
- **Expanding filtering capabilities:** More advanced filtering and search operators could be added to refine search results further.
- **Fix shortcuts button:** Resolve the issue preventing the keyboard shortcuts pop-up from displaying correctly when its button is clicked.
- **Add Yandex search operator above search bar:** Implement a dedicated display or input field for Yandex-specific search operators, positioned prominently near the main search bar to enhance Yandex search customization.
- **Add Baidu search engine with similar functionality to Yandex:** Integrate Baidu as a new search engine option, ensuring it supports features like translation and operator filtering, comparable to the existing Yandex functionality.
- **Fix shortcuts button:** Resolve the issue preventing the keyboard shortcuts pop-up from displaying correctly when its button is clicked.
- **Fix shortcuts button:** Resolve the issue preventing the keyboard shortcuts pop-up from displaying correctly when its button is clicked.

This `GEMINI.md` file will be automatically updated to reflect the latest changes and features as the project progresses.