# tools/ — reliability safety net

Dev-only tooling. **Not part of the app** — `index.html` stays a single,
dependency-free file. Nothing here ships to GitHub Pages.

## `validate-engines.mjs`

Parses `index.html` and asserts the engine-registry invariants that silently
break the search router when violated. Pure Node (no `npm install`).

```bash
node tools/validate-engines.mjs            # checks ../index.html
node tools/validate-engines.mjs some.html  # checks a specific file
```

Exits non-zero if any **error** is found, so CI fails before a break ships.

**Errors (fail the build)**
- duplicate engine prefix or duplicate `!bang` token (JS keeps the last — a typo wins silently)
- a `!bang` that points at a prefix that no longer exists
- an alias whose `aliasFor` target is missing or is itself an alias
- a radio button whose value isn't a real engine (dead UI button)
- a `categoryMap` prefix that isn't a real engine
- an engine with neither `url` nor `isAlias` (nothing to open)

**Warnings (reported, don't fail)**
- `http://` engine URLs (mixed-content: blocked on the HTTPS Pages site)
- `promptBased` engines missing the `📋` name marker
- engines unreachable from the UI (no radio and not in any category)

Runs automatically via `.github/workflows/validate-engines.yml` on any push/PR
that touches `index.html` or the validator.

## In-browser equivalent

Open **`index.html?selftest`** to run the same spirit of checks against the
live engine objects and the rendered radio buttons, with a pass/fail report
drawn on top of the page. No tools required — handy before pushing.
