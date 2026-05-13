# Quote Slicer Docs

## Article Table Of Contents

Article pages render their table of contents at build time so the sidebar works without
client-side JavaScript.

The pipeline has four pieces:

1. `src/lib/build/articleToc.js` scans article `.svx` files and extracts `h2`-`h4`
   markdown headings into a nested ToC tree.
2. The same file exports `rehypeHeadingIds`, which `svelte.config.js` passes to
   mdsvex. This adds matching `id` attributes to rendered `h1`-`h6` headings.
3. `vite.config.ts` registers `articleTocPlugin()`, which exposes the extracted ToCs
   through the virtual module `virtual:article-toc`.
4. `src/routes/(article-shell)/+layout.ts` reads that virtual module and passes the
   current article's ToC to `src/components/Sidebar.svelte`, which renders normal
   `#heading-id` links.

Because the ToC comes from a Vite virtual module, there is no committed generated file.
During local development, changing, adding, or deleting an article `.svx` file causes a
full page reload so the sidebar receives fresh ToC data.

The heading slug logic is shared by the extractor and the rehype plugin. If you change
how heading IDs are generated, change it in `slugHeading()` rather than in the sidebar.

Current scope:

- ToC entries are generated from markdown headings only.
- `h1` is skipped because it is the page title.
- `h5` and `h6` are skipped to keep the sidebar compact.
- Rendered `h1`-`h6` headings still receive ids so any heading can be linked directly.
- Dynamic Svelte heading text is not supported for ToC generation.

## Article Links

Internal article links use wiki-style syntax and are resolved while mdsvex compiles
the article:

- `[[#heading]]` links to a heading in the current article.
- `[[overview]]` links to another article.
- `[[overview#heading]]` links to a heading in another article.
- `[[overview#heading|custom label]]` uses explicit link text.

Heading targets may use either the generated id or the visible heading text. Article
targets may use the article path, final path segment, or title when that alias is
unique.

`src/lib/build/articleLinks.js` builds an article catalog from docs routes and diary
entries, then rewrites wiki links into normal markdown links with the configured
SvelteKit base path. Missing article links are currently rendered as plain text when
they have a label, and reported as mdsvex warnings.
