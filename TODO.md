in Navbar.svelte:

- flatten the darkmode toggle button: there might be too many nested divs, make it simpler.
- do the same with the logo

- adjust the elements visually according to the height of the screen, not only the width
- at 490px, the translate should be 0, at 790px, it should be the current value
<!-- calc(var(--spacing) * -8) -->
