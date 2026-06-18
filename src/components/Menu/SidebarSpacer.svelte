<!--
	Pages without a table of contents (home, development diary) have no real
	contents sidebar. Article pages do, and it pushes their centred article
	column left of viewport centre. This spacer reserves the same minimum
	footprint so those pages stay aligned with article pages.

	It reuses the `contents-sidebar` class so it inherits the root layout's
	responsive rule: hidden below 1200px (where no page shows a sidebar),
	shown at 1200px+. It therefore only exists while the real sidebar exists.
-->
<div class="contents-sidebar min-w-70" aria-hidden="true"></div>
