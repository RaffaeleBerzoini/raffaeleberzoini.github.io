# Local verification

Initial editions checked on 13 October 2026. Playable Pixel Lab checked on 14 October 2026.

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
- Initial Pixel Lab (preserved in commit `43e28be`): the bookshelf opens Research; keyboard ArrowRight moves from the Research tab to Journey; the robot changes its message.
- Emulated `prefers-reduced-motion: reduce`: Signal disables ambient motion and explains why its play control is disabled. The emulation was reset after the check.
- No console errors observed during the interactions.
- Signal has one H1 and no unresolved internal anchor targets.

## Playable Pixel Lab — 14 October 2026

- Baseline commit `43e28be` was created with `.gitignore` before changing the initial implementation.
- `npm.cmd run build`: passed after the redesign and final formatting.
- `npm.cmd test`: 19 navigation tests passed. Coverage includes every station pair, the exact spawn and interaction positions, controller stepping at 144/60/25 fps, routing around furniture, corner cutting, wall sliding, invalid inputs, and oversized movement deltas.
- The redesigned Pixel Lab JavaScript chunk is approximately 14.7 KB gzip; main JavaScript remains approximately 85.5 KB gzip.
- Browser checked at 1440 × 1000, 390 × 844, and 320 × 740. The room has no horizontal or vertical document overflow at the checked phone sizes; object content scrolls within its own interface.
- Click-to-walk reaches the computer, bookshelf, noticeboard, and mailbox and opens their corresponding object interfaces. Floor clicks move the character without opening content. Manual arrow input interrupts an automatic route.
- Held keyboard movement and held touch-direction input both move the character. Upward motion into the bookshelf stops at its collision boundary; E then opens the book.
- Project, publication, and journey next buttons select new content. Publication links update to the selected paper's DOI.
- All four object views were visually inspected on desktop/mobile: CRT terminal, open book, corkboard notes, and contact letter. Each preserves the room behind it.
- Escape and the close button return to the room. Native modal dialogs prevent background interaction and restore focus; keyboard Tab returns to the modal controls.
- Explore offers both automatic walking and immediate access. The help panel's ambient pause control sets the room animations to paused.
- The exit arrow returns to Signal and restores the edition selector. Selecting Pixel Lab removes the selector and returns to the full-screen room.
- No browser console errors or warnings were observed during these checks.

Phone testing used a browser viewport and simulated input, not a physical phone. Reduced-motion CSS covers room ambience, character stepping, object arrival, and camera interpolation; Pixel Lab media emulation was not repeated in this pass.

## Boundaries

Public professional facts and research metadata are documented in `profile-sources.md`. This is a local portfolio; there has been no cloud deployment. External destinations and the optional GitHub API depend on internet access. Browser verification is not an exhaustive audit across every browser, assistive technology or device.

Screenshots are saved in the ignored `qa/` directory.
