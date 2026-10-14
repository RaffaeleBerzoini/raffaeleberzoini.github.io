# Raffaele Berzoini — Pixel Lab

An independent, playable pixel-art portfolio built with React, TypeScript and Vite.

## Start locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:5173/`. This site is exclusively Pixel Lab: it has no edition selector, links to the alternative designs, or dependency on their UI code. Old `?version=` parameters do not change the site. The portfolio is written in English for an international technical audience.

## Pixel Lab controls

- Move with **WASD / arrow keys**, click the floor, or use the touch direction pad.
- Approach or click the **chair/computer**. The robot extends its legs and sits facing the screen. Press **E / Space** once seated to browse projects.
- Move or choose another destination to stand up and continue exploring.
- Click the **Journey noticeboard**, **bookshelf**, or **mailbox** to walk there and open its contents. The robot routes around furniture.
- Approach the **window** and press **E**, or click it, to play **Night Post** inside its wooden frame.
- Press **E / Space** near an object to interact; **Esc** returns to the room.
- Inside projects, publications and Journey, use **Right / Up / W / D** for the next item and **Left / Down / A / S** for the previous item.
- Use **Explore** to choose a destination. Its small arrow buttons open the book, journey, contacts and window immediately; the computer starts with taking a seat.
- The **?** button explains controls and lets you pause room ambience. Reduced-motion preferences are respected.

On narrow screens, the camera follows the character. Each object has its own pixel-art reading interface and keyboard-accessible controls. No side panel is needed.

The lower two Journey notes occasionally fall like leaves beside a curled gray tabby's bed (one fall about every 78 seconds). After a sleepy pause, the cat collects the note, walks to the board, turns its back and stands on its hind legs to reattach it before returning to bed. A second gray tabby lies on the bookshelf, looking toward the viewer with its head tilted and its tail hanging over the books. The terminal responds to explored topics, books move subtly, and a robotic courier exchanges letters.

Both cats have larger, softly rounded faces and smiling sleeping eyes. The helper's four-beat walk follows distance travelled, with articulated legs, planted paws and a small body/tail sway; it stops stepping when stationary.

## Night Post

The window opens onto a pixel-art night city. Fly the postal drone to the green outlined balcony and hover briefly to deliver its letter. That window lights up; return to the **POST** dock to collect the next envelope. Deliver all six letters before the 60-second battery runs out. Antenna bumps cost three seconds of battery.

- **WASD / arrows** move the drone. Hold a point in the sky with a mouse or finger to steer there; mobile also has a direction pad.
- **P** or the pause button pauses/resumes. Switching away from the page automatically pauses the flight.
- **Esc** or the close button returns to the workshop. Lit city windows remain visible in the room for the session.
- The result screen starts a fresh flight. The best delivery count is saved only in this browser, with a storage-free fallback.
- Reduced motion disables decorative twinkling, rotor animation and parallax while retaining the player-controlled flight.

## Build

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

The production build goes to `dist/`. No hosting or cloud deployment is configured.

## Alternative designs

Signal and Atlas are preserved in the separate `sites/classic/` project, with their own entry point, styles, copied content, Vite configuration and build output. The projects share installed dependencies only; neither website imports the other's UI.

```powershell
npm.cmd run dev:classic
npm.cmd run build:classic
npm.cmd run preview:classic
```

The classic development server uses `http://127.0.0.1:5174/`; its production files go to `sites/classic/dist/`. Its selector switches only between Signal and Atlas. Pixel Lab's content and style changes do not update that separate copy.

## Content and sources

Edit `src/data.ts` to update Pixel Lab's profile, projects, publications and experience. The source inventory, uncertainties and publication dates are in `docs/profile-sources.md`. Initial design references and the adaptation of frontend-design guidance are in `docs/design-research.md`.

The app uses verified public professional information; employment start dates, personal email, degree grades and unsupported project metrics are deliberately not invented. The project illustrations and particle field are original visual interpretations, not screenshots of products or actual medical data.

All fonts are served locally. Pixel Lab uses no analytics, tracking, backend, credentials or background API requests. Content is bundled so it remains available offline once loaded. External project/publication links require internet access. The optional **Load GitHub activity** feature belongs only to the separate classic site.

## Main files

- `src/main.tsx` / `src/base.css`: independent Pixel Lab entry and base styles.
- `src/PixelLab.tsx` / `src/pixel-lab.css`: movement, interaction, chair state and camera.
- `src/pixel/`: room artwork, animated character, collision/pathfinding engine, object interfaces, and navigation tests.
- `sites/classic/`: separate Signal/Atlas site and source copy.
- `src/data.ts`: Pixel Lab content source.

Substantive information is available in accessible HTML. Motion follows reduced-motion settings, and the room has an ambient pause control. Layouts support mobile and keyboard navigation.

## Restore point

Commit `43e28be` (`feat: add initial portfolio editions`) preserves all three initial editions before the playable-room redesign. It also includes `.gitignore` for dependencies, build output, local screenshots, logs, and environment secrets.

Commit `aff7bb4` (`feat: make Pixel Lab a playable workshop`) preserves the approved playable room before separating the sites and adding the new animations.
