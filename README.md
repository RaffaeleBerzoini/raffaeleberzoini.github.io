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
- **Pixel Lab** — `/?version=pixel`: an original pixel-art laboratory with interactive objects and equivalent button navigation.

Use the floating bottom selector to move between versions. Browser back/forward and direct version URLs work. The portfolio is written in English for an international technical audience.

## Build

```powershell
npm.cmd run build
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
- `src/components/SignalField.tsx`: original Canvas renderer with reduced-motion support, intersection/visibility pause and DPR cap.
- `src/data.ts`: single content source.

Canvas graphics are decorative; substantive information is always in accessible HTML. Motion follows reduced-motion settings, and Signal has an explicit pause control. Layouts support mobile and keyboard navigation.
