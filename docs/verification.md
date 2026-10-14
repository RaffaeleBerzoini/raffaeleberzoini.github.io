# Local verification

Completed on 13 October 2026.

## Build

- `npm.cmd run build`: passed (strict TypeScript check and Vite production build).
- Installation audit: 0 vulnerabilities reported for the installed dependency tree.
- Main JavaScript bundle: approximately 85.5 KB gzip. Pixel Lab loads as a separate chunk.

## Browser checks

Checked in the Codex Chromium browser at desktop 1440 × 1000 and mobile 390 × 844. The default narrow app panel was also inspected.

- All three editions render and can be selected using the floating navigation.
- No horizontal document overflow at the mobile width in the three editions.
- Signal: orbit/wave/helix controls update selection; animation can be paused; dark theme switches; project filter returns the correct project count.
- Publications expand; copying a citation produces the correct author list, title, venue, year and DOI in the browser clipboard. A selectable text fallback is included for unavailable clipboard access.
- Search opens from desktop and mobile and searches project technology/description and publication tags, as well as names. Queries `AI` and `FPGA` return relevant results.
- GitHub activity loads three real public repositories and their update dates.
- Atlas: clicking NERONE changes the detail pane; its mobile list opens the SENECA publication and source. Desktop filters de-emphasize unrelated nodes; mobile filters restrict the list.
- Pixel Lab: the bookshelf opens Research; keyboard ArrowRight moves from the Research tab to Journey; the robot changes its message.
- Emulated `prefers-reduced-motion: reduce`: Signal disables ambient motion and explains why its play control is disabled. The emulation was reset after the check.
- No console errors observed during the interactions.
- Signal has one H1 and no unresolved internal anchor targets.

## Boundaries

Public professional facts and research metadata are documented in `profile-sources.md`. This is a local portfolio; there has been no cloud deployment. External destinations and the optional GitHub API depend on internet access. Browser verification is not an exhaustive audit across every browser, assistive technology or device.

Screenshots are saved in the ignored `qa/` directory.
