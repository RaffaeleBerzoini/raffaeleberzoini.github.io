# Design research

Research date: 13 October 2026. The portfolio is a local implementation; no hosting or deployment is part of this work.

## References studied

- [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md): choose a visual direction from the real subject, define color/type/layout before building, concentrate expressive motion, then critique screenshots. The skill is Apache 2.0 licensed. Its principles have been adapted to this project's React implementation; no global skill installation is required.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines): preserve native keyboard interaction, visible focus, reduced motion, readable type, adequate targets, and alternatives to gestures. Design effects must not obstruct access to actual work.
- [Stefan Vitasovic portfolio case study](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/): bold typography, asymmetric layouts and a recurring motion motif create coherence. Inspiration only: no portfolio media, text, or proprietary source copied.
- [React Bits Text Pressure](https://reactbits.dev/text-animations/text-pressure): reference for restrained pointer-responsive typography.
- [React Bits Dither](https://reactbits.dev/backgrounds/dither): reference for digital texture and interaction with a technical character.
- [Codrops license](https://tympanus.net/codrops/licensing/): downloadable demos are generally MIT unless stated otherwise. This does not automatically license third-party sites or images featured in case studies.

## Distinct directions considered

1. **Signal Studio:** dark, monumental typography and an interactive scientific field. One memorable visual, with clean project and research content around it.
2. **Research Atlas:** a light, cobalt-accented research atlas. A node map can expose relationships between projects, education and publications, always accompanied by readable lists.
3. **Field Notes:** asymmetric editorial layout, variable type, dithered previews and a compact filterable archive.
4. **Pixel Lab:** added following the user's explicit request for a pixel-art third version. An original little laboratory translates actual portfolio sections into objects: terminal for projects, books for publications, noticeboard for background, and mailbox for professional links. A conventional tab navigation and text panel expose the same material without requiring the scene to be played.

## Principles carried into implementation

- Professional work and verified sources are the content. No invented achievements, contribution totals, research metrics, skill percentages or availability claims.
- Use an original scene with subject-specific associations instead of unrelated animated decorations.
- Make every object action available as an ordinary labeled button. Use actual anchors for external destinations.
- Preserve visible keyboard focus, responsive reading order and reduced-motion preferences.
- Keep text as HTML. Decorative SVG is hidden from assistive technology.
- Avoid heavy 3D requirements for the pixel alternative: original SVG blocks with crisp edges supply the artwork, while CSS controls modest ambient animation.

## Reuse and licensing

Pixel Lab artwork and components are original to this project. They do not copy a game tileset or a third-party portfolio.

React Bits was investigated but no React Bits source is needed for Pixel Lab. Its current [license](https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md) is MIT plus Commons Clause: use within websites/applications is permitted with notices retained, while selling or redistributing the components themselves is restricted. Do not describe the current library as plain MIT or vendor it into a redistributable component pack without checking the license.

Anthropic's skill text is not vendored here. This document summarizes general design principles and links to the original source.
