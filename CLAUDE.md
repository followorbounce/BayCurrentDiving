# Bay Current Diving

Production marketing site for Bay Current Diving, deployed as a static site to GitHub Pages (repo: `followorbounce/BayCurrentDiving`).

## Structure

- `index.html`, `identity.html`, `brand.html`, `404.html` — pages, plain HTML with no inline styles/scripts
- `css/styles.css` — all styles, hardened for Safari/iOS quirks (100svh, safe-area insets, `-webkit-*` prefixes, `@media (hover: hover)`, `prefers-reduced-motion`)
- `js/main.js` — all scripts, deferred, zero `eval`/`new Function`/string timers, passive scroll listeners

## Conventions

- Strict CSP intended: `default-src 'none'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src https://cloudflareinsights.com` — no `unsafe-eval`, no `unsafe-inline`. Keep all JS/CSS external to preserve this. **2026-09-19: the `script-src`/`connect-src` allowances for `cloudflareinsights.com` are a deliberate, explicit exception for the Cloudflare Web Analytics beacon (user asked to lift the earlier no-third-party-script stance specifically for this) — don't tighten those back to `'self'`/`'none'` without checking first.**
- Touch targets ≥44px (Apple HIG), tap-highlight disabled, IntersectionObserver (not scroll-timed) for reveal animations.
- Deploy by pushing this folder to the repo root or `docs/`; all asset paths are relative so subfolder deploys also work.
- Never use Russian in code/UI/docs unless the task explicitly calls for it.

See README.md for the full Safari/iOS fix log (20 itemized issues already resolved — don't reintroduce them).
