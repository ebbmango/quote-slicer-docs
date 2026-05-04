# Quote Slicer Docs

## Article Table Of Contents

Article pages render their table of contents at build time so the sidebar works without
client-side JavaScript.

The pipeline has four pieces:

1. `src/lib/build/articleToc.js` scans article `.svx` files and extracts `h2`-`h4`
   markdown headings into a nested ToC tree.
2. The same file exports `rehypeHeadingIds`, which `svelte.config.js` passes to
   mdsvex. This adds matching `id` attributes to rendered `h2`-`h4` headings.
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
- Dynamic Svelte heading text is not supported for ToC generation.
