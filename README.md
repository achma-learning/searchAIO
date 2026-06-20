# searchAIO

> Type a short prefix like `pubmed:` — or a `!bang` — hit Enter, and your query lands in the right search engine (Google, PubMed, CISMeF, arXiv, ChatGPT, 55+ more) without you ever leaving the page.

**▶ Live: <https://achma-learning.github.io/searchAIO/>** — nothing to install, it's one HTML file.

[![validate engine registry](https://github.com/achma-learning/searchAIO/actions/workflows/validate-engines.yml/badge.svg)](https://github.com/achma-learning/searchAIO/actions/workflows/validate-engines.yml)

_TODO: add a screenshot or GIF of the search bar routing a query_

## What it is

searchAIO is a single web page that sends your search to whichever engine you want, picked by a short prefix (`scholar:`, `cismef:`, `yt:`) or a DuckDuckGo-style `!bang` (`!pm`, `!sc`). It's built for medical researchers, thesis students, and doctors who'd otherwise keep 50 bookmarks and click through them one at a time — so it leans heavy on medical and French/Moroccan sources (PubMed, Cochrane, CISMeF, HAS, VIDAL, theses.fr, Toubkal, AMMPS) right next to the usual web and AI engines. The interface is mostly in French (the author's context), but the engines themselves are global.

The one choice that makes it different: **it's one `index.html` — no build, no dependencies, no framework, no tracking.** Save it, open it offline, fork it, drop it on a `file://` path — it just works. Keyboard-driven, and privacy-respecting by default (no Google contact on load, no telemetry).

## Install & run

**Just use it** — open the live page: <https://achma-learning.github.io/searchAIO/>. You can also install it as an offline app (PWA) from the in-page ⚙️ Settings panel.

**Run it locally** — no toolchain, no `npm install`:

```bash
git clone https://github.com/achma-learning/searchAIO.git
cd searchAIO
# open index.html in any modern browser — that's the whole "build"
```

**Browser userscript** (select text on any page → search it from a ⚡ sidebar):

- Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
- Main script published on GreasyFork: <https://greasyfork.org/scripts/568031>
- Variants live in [`userscript/`](./userscript/) — `searchAIO-med.js` (thesis/clinical: Search Packs, PubMed filters, DOI/PMID/NCT resolve) and `userscript-google.js` (Google-AI focus). Paste either into your manager.

## Usage

Focus the bar with `Ctrl+K`, then prefix or bang your query:

```
pubmed: myocardial infarction     → opens PubMed results
!sc crispr off-target             → Google Scholar (a bang works anywhere in the line)
cismef-bp: diabète type 2         → CISMeF with the "bonnes pratiques" scope pre-selected
claude: explain this ECG          → copies your text, opens Claude for you to paste
```

No prefix? Just start typing and an autocomplete list matches engines by name. Handy keys: `Ctrl+K` focus · `Alt+↑/↓` cycle engines · `Alt+T` output language · `Esc` close panels. The full set is behind the ⌨️ shortcuts button.

Tinkering with the engine list? Open `index.html?selftest` (or run `node tools/validate-engines.mjs`) to confirm you didn't break a prefix or `!bang` before you ship.

## What's new

Latest — **installable as an offline app (PWA)**, a dedicated **medical/thesis userscript** (Search Packs that fire one query at PubMed + Cochrane + UpToDate + NEJM, PubMed power-filters, DOI/PMID/NCT resolve), and privacy-by-default (no Google on page load). [Full changelog →](./CHANGELOG.md)

## Why I built this

I'm a medical researcher (Morocco / France), not a pro coder — this is vibe-coded with Gemini CLI and Claude. I got tired of keeping a wall of bookmarks for PubMed, CISMeF, theses.fr, Toubkal and the rest, and clicking each one for every single search. So: type once, route anywhere, keyboard-first. It's meant to be a useful tool, not a perfect one. Fork it and make it better.

## License

MIT © 2026 maa384 — see [`LICENSE`](./LICENSE).

## See also

- [`CONTEXT.md`](./CONTEXT.md) — the deep architecture file, for AI assistants (and the curious)
- [`CHANGELOG.md`](./CHANGELOG.md) — what shipped, when
