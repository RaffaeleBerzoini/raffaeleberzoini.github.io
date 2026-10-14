# Local verification

Initial editions checked on 13 October 2026. Playable Pixel Lab checked on 14 October 2026.

## Initial editions — historical checks

The following build and browser checks describe the original combined site. That state, including the first playable workshop, is preserved in commit `aff7bb4`.

### Build

- `npm.cmd run build`: passed (strict TypeScript check and Vite production build).
- Installation audit: 0 vulnerabilities reported for the installed dependency tree.
- Main JavaScript bundle: approximately 85.5 KB gzip. Pixel Lab loads as a separate chunk.

### Browser checks

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

## Independent living workshop — 14 October 2026

- Committed the previously approved playable workshop as `aff7bb4` before making this pass.
- Pixel Lab now starts directly at `http://127.0.0.1:5173/`. It has no edition switcher or links to the other designs. Signal and Atlas have their own entry point, sources, data copy, and build in `sites/classic/`.
- `npm.cmd run build`: passed after final formatting. Pixel JavaScript is approximately 90.0 KB gzip, with no Signal/Atlas imports.
- `npm.cmd run build:classic`: passed. Classic JavaScript is approximately 84.8 KB gzip. Its development server and both shared font files returned HTTP 200 on port 5174 after restricting Vite's additional filesystem access to the shared `node_modules` directory. Navigation in the in-app browser timed out, so a new end-to-end browser pass on the separated classic site was not completed.
- `npm.cmd test`: 19 navigation tests passed with the wider room, revised plant obstacle, and exact chair approach position. Includes all station pairs and movement stepping at 144/60/25 fps.
- Desktop 1440 × 1000 and mobile 390 × 844 were visually inspected. The mobile document has no horizontal or vertical overflow; its camera follows the character into the Journey nook and the bookshelf/mailbox area.
- Clicking the computer routes to the chair, extends the robot's legs, and seats it facing the screen. Projects remain closed until E (or another click). E opens the project terminal, Next selects NERONE, and closing returns to the seated pose.
- Held keyboard input approaching the chair also triggers seating. Moving from the chair plays the stand-up transition before walking. Held touch movement and a click on another station also leave the chair successfully.
- Walking to Journey, publications, and contacts opens the correct object view. The robot faces each object. The terminal changes its references to match the current destination/topic.
- The widened Journey board, arriving/departing post-its, two striped kittens, moving shelf objects, and robot courier were visually checked. Labels leave the cats and courier visible on mobile.
- Emulated `prefers-reduced-motion: reduce`: post-its, kitten tails, and courier report no animation; seating settles immediately at the destination. Media emulation was reset after checking.
- No console errors or warnings were observed in the final browser pass.
- The window remains decorative; no game was implemented in this pass.

Phone checks use browser emulation rather than physical hardware. New preview: `qa/pixel-workshop-living-room.png`.

## Keyboard paging and tabby helpers — 14 October 2026

- Projects, publications and Journey now accept Right/Up/W/D for next and Left/Down/A/S for previous. Browser checks exercised all eight keys in publications, W/S in projects, and D/A in Journey. Selection wraps correctly and the robot remains stationary inside the dialog. The mobile project Next/Prev buttons were also checked.
- Keyboard handlers ignore modified shortcuts, editable inputs and composition; repeated keydowns do not race through pages. Contacts retain normal scrolling.
- One darker gray tabby lies on the bookshelf, its tail hanging in front of the books. A second gray tabby waits beside Journey and retrieves fallen notes. The bookshelf label was moved above the cat so it does not cover the tail.
- All four notes participate in a shuffled cycle without repeats at the bag boundary. One note falls with a swaying leaf motion, rests on the floor, is picked up at the cat's mouth, travels with the jump, and returns to its exact board position.
- `npm.cmd run build`: passed. `npm.cmd test`: 27 passed, including 8 new tests for shuffle coverage, phase continuity, ground rest, mouth attachment, restoration, and valid transforms.
- Desktop 1440 × 1000: observed the fall, floor rest, jump with paper in the mouth, restoration and return. Mobile 390 × 844: the project interface remains usable with the paging change.
- Reduced-motion emulation and the room ambience pause both restore all notes to the board, return the helper to rest and stop the sleeping tail animation. Preferences were reset after checking. Like the existing ambience controls, resuming starts a fresh scene rather than continuing a half-completed action.
- No new console errors appeared after the completed modules loaded; the earlier Vite missing-module messages occurred while the new cat artwork file was still being created.
- Screenshot: `qa/pixel-postit-cat-jump.png`.

## Sleepy cats and grounded note retrieval — 14 October 2026

- Replaced the narrow profile faces with round, front-facing tabby heads, short muzzles, two eyes and distinct pointed ears. The shelf cat's head tilts toward the viewer. The helper curls in a woven bed between trips.
- Only LEARN and BUILD can fall; the two upper notes stay pinned. The cycle is now 78 seconds, with a six-second leaf-like fall, a five-second ground pause and a three-second sleepy wake-up.
- The helper walks to the paper, carries it to the board, turns its back, then raises its body and paws while both hind feet stay at floor level. The reach is calculated from the original note position. It lowers itself, walks home and curls up again; the jump was removed.
- The fern was made smaller and moved left to leave the approach to LEARN clear; its collision rectangle was updated to match.
- `npm.cmd run build`: passed. `npm.cmd test`: 31 passed, including 12 scene tests covering fixed upper notes, timing, continuous floor movement, mouth attachment, rear-facing transfer, fixed feet, exact reattachment and return to bed.
- Browser checked at 1440 × 1000 and 390 × 844. The new curled poses, carrying, back-facing approach, raised reattachment and return were inspected. Mobile Journey is reachable and the room has no document overflow. Reduced-motion emulation restores the sleeping helper and stops ambient tail movement; the emulation was reset afterward. Final console check returned no errors or warnings.
- Screenshots: `qa/pixel-cats-curled.png` and `qa/pixel-sleepy-cat-pin.png`.

## Softer faces and articulated walking — 15 October 2026

- Both tabbies have broader cheeks, larger heads, softer crown markings, smiling closed eyes and round eyes with highlights when awake. The shelf head keeps its tilt toward the viewer; the helper keeps its curled sleeping pose.
- Replaced the repeating leg translations with a four-beat, distance-driven walk. Knees connect the moving hips to independent paws, and stance strokes follow the actual floor direction, including diagonals. Body and tail motion taper with speed without scaling the planted paws. A frame with no elapsed scene time preserves the last gait.
- At a change of direction, the new pose takes its direction from its upcoming step, avoiding a one-frame projection onto the previous path.
- The carried note remains at the helper's mouth. The existing fall frequency, two eligible lower notes, grounded reattachment and return-to-bed sequence are preserved.
- `npm.cmd run build`: passed. `npm.cmd test`: 37 passed. Six new gait tests cover fixed ground contact, four distinct footfalls, continuous lift-off/landing, bounded paw clearance, backward stepping and finite periodic output.
- Browser checked at 1440 × 1000 and 390 × 844. Inspected sleeping faces, walking, note transport, the rear view and return to bed. The mobile scene has no horizontal or vertical document overflow. Reduced-motion emulation restores the helper to sleep and stops the shelf tail; normal motion resumes afterward.
- Screenshots: `qa/pixel-cuddly-cats.png`, `qa/pixel-cat-new-walk.png`, and `qa/pixel-cuddly-cat-mobile.png`.
- Final browser console check returned no errors or warnings.

## Night Post window game — 15 October 2026

- Saved the approved workshop as `8da23c8` before implementing the game. Pixel Lab remains the independent root application.
- The window is now a fifth reachable station. Clicking it walks the robot into position and opens a wooden window frame with an original 640 × 360 pixel city, postal drone, six delivery windows and a POST pickup dock.
- `npm.cmd test`: 49 passed. New coverage includes flight bounds and diagonal input, hover/reload requirements, antenna collisions and cooldown, pause, battery expiry, winning, clean restart and the window's navigation routes.
- `npm.cmd run build`: passed with strict TypeScript checking. Main JavaScript is approximately 103.4 KB gzip; no new dependencies or remote game assets were added.
- Desktop 1440 × 1000: opened the window through actual walking, delivered with held keyboard input, then completed all six deliveries using held pointer input and depot returns. The route finished with about 11 seconds remaining. All delivered windows stayed lit and the best score reached 6/6.
- P paused the flight and held the battery steady; resume continued the same route. Esc restored the room and its focus. The room retained the delivered lights for the session; E reopened a fresh 0/6 flight with the saved best score.
- At 390 × 844, held direction-pad controls completed the first delivery while the workshop robot stayed still. At 320 × 740, the intro and start button fit inside the glass, controls stayed readable and there was no horizontal page overflow.
- At 844 × 390, the compact frame keeps the complete flight canvas and controls visible. Start and pause were exercised in this layout.
- Emulated reduced motion removes the window arrival animation; the renderer also disables decorative parallax, twinkles, rotor motion and bobbing. Player-controlled motion remains available. Browser viewport and media overrides were reset afterward.
- The final reload and window opening produced no new browser console errors or warnings.
- Screenshots: `qa/night-post-first-delivery.png`, `qa/night-post-three-deliveries.png`, `qa/night-post-route-complete.png`, and `qa/night-post-mobile.png`.

Phone checks use browser emulation and simulated input rather than physical hardware. Automatic pause on page blur/visibility loss and browser-storage fallback were reviewed in code; these branches were not separately exercised in the browser.

## Boundaries

Public professional facts and research metadata are documented in `profile-sources.md`. This is a local portfolio; there has been no cloud deployment. External destinations and the optional GitHub API depend on internet access. Browser verification is not an exhaustive audit across every browser, assistive technology or device.

Screenshots are saved in the ignored `qa/` directory.
