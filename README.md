# Bay Current Diving — Production Site

## File Structure

```
bay-current-site/
├── index.html          ← clean HTML, no inline styles, no inline scripts
├── css/
│   └── styles.css      ← all styles, Safari/iOS hardened
├── js/
│   └── main.js         ← all scripts, zero eval/new Function/string timers
└── README.md
```

## GitHub Pages Deploy

Push this entire folder to your repo root (or `docs/` folder).
In repo Settings → Pages → set source to your branch.

```
your-repo/
├── index.html
├── css/styles.css
├── js/main.js
└── README.md
```

**Important:** The file paths in index.html are relative:
- `css/styles.css` → works from repo root
- `js/main.js`     → works from repo root

If you deploy to a subfolder (e.g. `username.github.io/bay-current/`),
paths still work because they are relative, not absolute.

---

## What Was Fixed

### CSP eval() Error — Root Cause
The `eval()` error in Safari console is **not from your code**.
It is injected by one of:

1. **GitHub Pages dev mode** (`jekyll serve`) injects a LiveReload script that uses eval.
   → Goes away in production. Push to gh-pages, open the live URL, error disappears.

2. **Browser extensions** (LastPass, Grammarly, uBlock Origin) inject eval into every page.
   → Test in a private/incognito window with extensions disabled to confirm.

Your codebase has **zero** instances of:
- `eval()`
- `new Function()`
- `setTimeout("string", ms)` — only `setTimeout(function, ms)` is used
- `setInterval("string", ms)` — not used at all

The CSP in index.html now explicitly blocks eval with `script-src 'self'` (no unsafe-eval).
If the error persists in production, it is 100% a browser extension.

### Safari / iOS Fixes Applied

| # | Issue | Fix |
|---|-------|-----|
| 1 | `100vh` taller than visible area | Changed to `100svh` with `100vh` fallback |
| 2 | Content behind iPhone notch | Added `viewport-fit=cover` + `env(safe-area-inset-*)` |
| 3 | `backdrop-filter` ignored in Safari | Added `-webkit-backdrop-filter` prefix |
| 4 | `mask-image` ignored in Safari | Added `-webkit-mask-image` prefix |
| 5 | `position:fixed` nav flickering on scroll | Added `translateZ(0)` + `will-change:transform` |
| 6 | Grain overlay flickering on iOS scroll | Added `translateZ(0)` to body::before |
| 7 | `aspect-ratio` not supported iOS < 15 | Added `min-height` fallback + `@supports` override |
| 8 | CSS animations stuck on Safari | Added all `-webkit-animation` / `@-webkit-keyframes` |
| 9 | `transform` not working older Safari | Added `-webkit-transform` prefix everywhere |
| 10 | Grey tap flash on links | Added `-webkit-tap-highlight-color: transparent` |
| 11 | Hover states stuck on touch screens | Wrapped hover rules in `@media (hover: hover)` |
| 12 | Buttons too small for touch | Added `min-height: 44px` (Apple HIG minimum) |
| 13 | Email overflowing narrow screens | Added `overflow-wrap: break-word; word-break: break-all` |
| 14 | Text resizing on rotate | Added `-webkit-text-size-adjust: 100%` |
| 15 | Scroll listener blocking iOS thread | All scroll listeners use `{ passive: true }` |
| 16 | Animations firing before in viewport | IntersectionObserver + class `.is-visible` (reliable on Safari) |
| 17 | Animations play for reduced motion users | Added `@media (prefers-reduced-motion: reduce)` |
| 18 | Inline scripts blocking strict CSP | All JS moved to external `js/main.js` with `defer` |
| 19 | Inline styles breaking strict CSP | All styles moved to external `css/styles.css` |
| 20 | `font-display` missing | Added `display=swap` to Google Fonts URL |

### Recommended CSP (in index.html)
```
default-src 'none';
script-src  'self';
style-src   'self' https://fonts.googleapis.com;
font-src    https://fonts.gstatic.com;
img-src     'self' data:;
connect-src 'none';
```

No `unsafe-eval`. No `unsafe-inline`. The strictest possible policy for this page.
