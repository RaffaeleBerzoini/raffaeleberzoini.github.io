# Raffaele Berzoini — portfolio

Three complete local portfolio editions built with React, TypeScript and Vite.

## Start locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Local URL printed by Vite (normally `http://127.0.0.1:5173`).

- **Signal** — `/?version=signal`: an interactive particle sculpture, original project illustrations, filterable projects, expandable research, citation copying, dark mode and search (`Ctrl+K` / `⌘K`).
- **Atlas** — `/?version=atlas`: an interactive map connecting projects, research and engineering.
- **Pixel Lab** — `/?version=pixel`: a playable pixel-art workshop. Walk a little robot around the room and explore projects inside a CRT computer, publications in an open book, your journey on a corkboard, and contacts in a letter.

Use the floating bottom selector to move between versions. Pixel Lab fills the screen and has a top-right exit arrow to return to the selector. Browser back/forward and direct version URLs work. The portfolio is written in English for an international technical audience.

## Pixel Lab controls

- Move with **WASD / arrow keys**, click the floor, or use the touch direction pad.
- Click an object to walk to it and open it automatically. The robot routes around furniture.
- Press **E / Space** near an object to interact; **Esc** returns to the room.
- Use **Explore** to choose a destination, or its small arrow buttons to open content immediately.
- The **?** button explains controls and lets you pause room ambience. Reduced-motion preferences are respected.

On narrow screens, the camera follows the character. Each object has its own pixel-art reading interface and keyboard-accessible controls. No side panel is needed.

## Build

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

The production build goes to `dist/`. No hosting or cloud deployment is configured.

## Content and sources

Edit `src/data.ts` to update the profile, projects, publications and experience shared by all three versions. The source inventory, uncertainties and publication dates are in `docs/profile-sources.md`. Design references and the adaptation of frontend-design guidance are in `docs/design-research.md`.

The app uses verified public professional information; employment start dates, personal email, degree grades and unsupported project metrics are deliberately not invented. The project illustrations and particle field are original visual interpretations, not screenshots of products or actual medical data.

All fonts are served locally. No analytics, tracking, backend or credentials are used. Content is bundled so it remains available offline once loaded. The only optional content request is **Load GitHub activity**, which reads the public GitHub REST API, has an eight-second timeout and a direct-link fallback for offline/rate-limit failures. External project/publication links require internet access.

## Main files

- `src/App.tsx` / `src/styles.css`: Signal, version navigation and global search.
- `src/Atlas.tsx` / `src/atlas.css`: Research Atlas.
- `src/PixelLab.tsx` / `src/pixel-lab.css`: Pixel Lab.
- `src/pixel/`: room artwork, animated character, collision/pathfinding engine, object interfaces, and navigation tests.
- `src/components/SignalField.tsx`: original Canvas renderer with reduced-motion support, intersection/visibility pause and DPR cap.
- `src/data.ts`: single content source.

Canvas graphics are decorative; substantive information is always in accessible HTML. Motion follows reduced-motion settings, and Signal has an explicit pause control. Layouts support mobile and keyboard navigation.

## Restore point

Commit `43e28be` (`feat: add initial portfolio editions`) preserves all three initial editions before the playable-room redesign. It also includes `.gitignore` for dependencies, build output, local screenshots, logs, and environment secrets.
