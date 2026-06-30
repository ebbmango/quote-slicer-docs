## Functionalities

- figure out easy page/article title hyphenation
- make clickable headers
- add adjustable right padding for articles w/o toc (as centralization aid)
- make the top-nav resize a function of area, not just height or width
- adjust dev-diary page's layout to match the rest of the articles

### Cleanup

- simplify, refactor, clean up.

## Content

Write/finish the following articles:

- How the website works
- How the reactive theme system works
- How the content architecture was designed
- Quote Slicer's `icons.json` and the GitHub Pages deploy secrets — what they are, why they're proprietary/secret, how to set them up

### Deferred during the 2026-06-29 docs sync — revisit

Two Quote Slicer topics covered in the app's own internal docs were deliberately left
out of the doc site during the full rewrite. Decide later whether they warrant their
own articles here:

- **The app's dark mode** — prepaint no-flash, cross-tab `BroadcastChannel` sync,
  per-scheme palette. Distinct from the reactive-theme diary entry, which documents
  *this site's* theme, not the app's.
- **Build & deploy** — static prerender, base path, GitHub Pages, the `icons.json`
  secret injection. (Overlaps the `icons.json` bullet above.)
