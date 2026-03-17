

## Plan: Restore Favicon & Font, Keep Performance Light

### What happened
1. **Favicon** was changed from `/favicon.png` (Arthur mascot) to `/placeholder.svg` in both `index.html` and `manifest.json`.
2. **Font** — the `@font-face` in `index.css` only declares `src: local('Inter')`, meaning mobile devices without Inter installed get a system fallback font instead. The original setup loaded Inter from Google Fonts via a CSS `@import` or `<link>`, which was removed during performance optimization.

### Changes

**1. index.html — Restore favicon + add lightweight Inter font**
- Line 31: Change `<link rel="icon" type="image/svg+xml" href="/placeholder.svg" />` back to `<link rel="icon" type="image/png" href="/favicon.png" />`
- Add a `<link rel="preconnect" href="https://fonts.googleapis.com">` and a single `<link>` to load Inter with `display=swap` from Google Fonts — but only the weights actually used (400, 500, 600, 700) to keep the payload minimal (~12KB total).

**2. public/manifest.json — Restore favicon**
- Change icon `src` from `/placeholder.svg` back to `/favicon.png` with type `image/png`.

**3. src/index.css — Remove the broken @font-face block**
- Remove lines 1-7 (the `@font-face` declaration with `src: local('Inter')` only) since Inter will now be loaded properly from Google Fonts. The `font-display: swap` is handled in the Google Fonts URL parameter.

**4. tailwind.config.ts — Set Inter as default sans font**
- Add `fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }` in `theme.extend` so Tailwind's default `font-sans` class uses Inter with a fast system fallback.

### Performance notes
- Google Fonts with `display=swap` is render-non-blocking — no FOUT, no layout shift.
- Only loading 4 weights keeps the font payload under 15KB (woff2).
- `preconnect` eliminates DNS+TLS overhead for the font domain.
- Favicon.png is already optimized per brand memory.

