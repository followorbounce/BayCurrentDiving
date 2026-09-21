# Progress — Bay Current Diving

## Status
Clean, pushed, up to date with `origin/main` (github.com/followorbounce/BayCurrentDiving). Site is production-ready: 4 pages (index, identity, brand, 404), external CSS/JS only, strict CSP with no unsafe-eval/unsafe-inline. All 20 known Safari/iOS issues from the README's fix log have been applied (viewport units, safe-area insets, backdrop-filter/mask-image prefixes, animation/transform prefixes, touch target sizing, etc.).

## Recent work
- 2026-09-16 — Added CLAUDE.md and progress.md for ongoing tracking.
- Prior commits (undated, from git log): 404 link fix, SVG map fixes (x2), iPhone fix, Safari fixes (structure + general), contact form fixes, identity page added, index deleted/recreated.

## Next steps
- No open TODOs found in the repo. If the CSP eval() console warning recurs in production, the README documents it's from GitHub Pages dev-mode LiveReload or a browser extension, not the codebase — verify in a private window before investigating further.
