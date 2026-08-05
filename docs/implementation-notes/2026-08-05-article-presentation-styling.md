# Article Presentation Styling Boundary - 2026-08-05

Commit(s):

- `8b29f87` `refactor(styles): centralize article presentation`
- `e202b8a` `refactor(styles): deepen inline code contexts`
- `a96b9c3` `refactor(styles): scope theme motion`
- `d999d3b` `fix(shiki): keep comment colours consistent`

## Context

Article styling had grown out of global `article` and `.prose` selectors in
`src/lib/styles/base.css` plus route-local rules in
`src/routes/(article-shell)/+layout.svelte`. That made ordinary articles,
long-form documentation pages, inline code, code links, and theme transitions
share selectors even when they needed different behavior.

The practical risk was selector leakage: a plain `article` could receive
documentation prose styling, and nested contexts such as blockquotes,
parenthetical asides, and links containing code had to override the same inline
code rule from multiple places.

## What Changed

`src/lib/styles/article.css` now owns the article presentation surface through
the `.article-presentation` class and the long-form variant
`.article-presentation--longform`. Tailwind Typography is configured in
`src/lib/styles/index.css` with `className: article-presentation`, so the
project no longer depends on the generic `.prose` namespace for documentation
article styling.

The article shell layout now opts in explicitly with
`article-presentation article-presentation--longform`, and metadata uses
`not-article-presentation` instead of `not-prose`. That keeps article-specific
rules scoped to the content that asks for them.

Inline code styling was moved behind custom properties such as
`--article-inline-code-background`, `--article-inline-code-color`,
`--article-inline-code-size`, and `--article-inline-code-weight`. Nearest
contexts now set those variables:

- `blockquote` makes inline code inherit quote color and size.
- `aside.parenthetical` changes only the inline-code background context.
- long-form links containing code set code-link color, background, weight, and
  color-transition duration.

The shared renderer remains
`.article-presentation :where(:not(pre) > code)`, so nested contexts adjust the
same implementation instead of layering competing code selectors.

Theme motion moved to `src/lib/styles/theme-motion.css`. Normal article
surfaces have no broad color/background/border transitions; those transitions
activate only while the root has `html.theme-transitioning`. Interaction
transitions, such as code-link hover color, stay with the component or context
that owns the interaction.

`svelte.config.js` also normalizes Dracula comment syntax color from `#6272a4`
to `#7b7f8b`. `src/lib/build/shiki.test.ts` preprocesses a small MDsveX code
block and asserts that generated `--shiki-light` and `--shiki-dark` comment
colors match.

## Why It Matters

The styling boundary is now opt-in. Future pages can use semantic `article`
markup without inheriting documentation presentation unless they add
`.article-presentation`.

Inline code has one renderer and many context tokens. That makes it safer to
add new article contexts because maintainers can set local variables instead of
increasing selector specificity or duplicating code styles.

Theme transitions are no longer global ambient motion. The site still animates
intentional theme changes, but regular article rendering and interaction states
avoid accidental transition coupling.

The Shiki comment-color test protects a visual invariant that is not obvious
from the config alone: comments should not shift color between light and dark
themes after the project palette replacements run.

## Follow-ups

- Keep new article-only presentation rules in `src/lib/styles/article.css`
  rather than `src/lib/styles/base.css`.
- Add a focused style test when introducing a new inline-code context, because
  computed styles are the easiest way to catch regressions in the variable
  contract.
