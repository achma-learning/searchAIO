# ⚡ SearchAIO — Sidebar Power Search

> **Select → Search → Discover** — One selection, 60+ engines, zero friction.

[![Version](https://img.shields.io/badge/version-7.11-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![GreasyFork](https://img.shields.io/badge/install-Greasy%20Fork-red)](https://greasyfork.org/scripts/568031)

**SearchAIO** is a userscript that turns any text selection into a launchpad for 60+ search engines across **4 specialized categories** — all accessible from a sleek, keyboard-driven sidebar overlay.

🌐 **[Live Web App](https://achma-learning.github.io/searchAIO/)** · 📜 **[Install Userscript](https://greasyfork.org/scripts/568031)**

---

## How It Works

```
Select text  →  ⚡ appears  →  Click or Alt+S  →  Pick engine  →  Results in new tab
```

1. **Select any text** on any webpage
2. A **⚡ trigger icon** appears near your selection
3. Click it (or press `Alt+S`) to open the **search sidebar**
4. **Edit the query** if needed, switch categories, then launch

---

## 🔍 Search Categories

### 🌐 General (12 engines)
Google · YouTube · Brave Search · DuckDuckGo · Yandex · Bing · Baidu · Google Advanced · Wikipedia · Baidu Baike · Grokipedia · WikiWand

### 🎓 Academic (13 engines)
Google Scholar · PubMed · arXiv · Google Patents · These2.0 · CISMeF Thèses · Toubkal · Theses.fr · ResearchGate · NDLTD · Pro Inserm · Baidu Scholar · CyberLeninka

### ⚕️ Medical (20 engines)
CISMeF · MSPS Morocco · AMMPS · HAS · VIDAL · MeSH Browser · LISSA · ANM · HETOP · NEJM · Radiopaedia · UpToDate · Cochrane · Medscape · OpenMD · Diseases DB · WebMD · NIH · Drugs.com · CDC

### 🤖 AI / Advanced (11 engines)
Wolfram Alpha · ChatGPT · Claude AI · Gemini · Google AI Mode · Perplexity · Copilot · Chat Baidu · Baidu AI · Duck.ai · AlphaFold

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Alt+S` | Open/close sidebar (works globally) |
| `/` | Toggle focus between search input and grid |
| `a`–`z` | Launch engine by letter index (grid mode) |
| `1` `2` `3` `4` | Switch category directly |
| `Tab` / `Shift+Tab` | Cycle categories forward/backward |
| `↑` `↓` `←` `→` | Navigate the engine grid |
| `Enter` | Launch the selected engine |
| `Esc` | Close sidebar |
| `Ctrl+?` | Toggle keyboard shortcuts help |

---

## ✨ Features

- **Zero-config** — install and go, works on every website (`*://*/*`)
- **Editable query** — refine your search text before launching
- **Category memory** — remembers your last-used category across sessions
- **Clipboard integration** — auto-copies query for AI tools that need paste input (Claude, Gemini, Copilot, Baidu AI)
- **Keyboard-first design** — letter shortcuts launch engines instantly without clicking
- **Glassmorphism UI** — dark, blurred overlay with smooth animations
- **Lightweight** — pure vanilla JS, no dependencies, no external requests

---

## 🛠 Installation

1. Install a userscript manager: [Tampermonkey](https://www.tampermonkey.net/) · [Violentmonkey](https://violentmonkey.github.io/) · [Greasemonkey](https://www.greasespot.net/)
2. **[Click here to install from Greasy Fork](https://greasyfork.org/scripts/568031)**
3. Select any text on any page — the ⚡ icon appears. Done.

---

## 🔗 Synced With

This userscript mirrors the engine list of the **SearchAIO Web App**:

🌐 **https://achma-learning.github.io/searchAIO/**

Source: [`index.html`](https://raw.githubusercontent.com/achma-learning/searchAIO/refs/heads/main/index.html)

---

## 📋 Requirements

- **Grants used:** `GM_openInTab` · `GM_setValue` · `GM_getValue`
- **Runs on:** All URLs (`*://*/*`)
- **Browser:** Any modern browser with a userscript manager

---

## 📝 Changelog

**v7.11** — Centered sidebar overlay · glassmorphism design · letter shortcuts (a–z) · category memory · inline query editing · help modal (Ctrl+?) · clipboard auto-copy for AI engines

---

<p align="center"><sub>Built for curious minds who search across boundaries.</sub></p>
