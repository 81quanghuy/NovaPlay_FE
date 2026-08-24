# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (localhost:5173)
npm run build     # type-check (tsc) then build to dist/
npm run preview   # serve the production build locally
```

No test framework is configured. TypeScript strictness is enforced via `tsc` during `build`.

## Architecture

**Stack:** React 18 + TypeScript + Vite. No router library, no state management library, no CSS framework.

### Routing

Custom hash-based routing entirely in `src/App.tsx`. The `Route` type is a discriminated union:
```ts
type Route = { name: 'home' } | { name: 'detail'; movie: Movie } | { name: 'login' };
```
Navigation happens by calling `setRoute(next)` — there is no URL push. Deep-linking is supported via `location.hash` query params (`?screen=detail`, `?screen=login`).

### Data layer

`src/data.ts` exports a static `NP_MOVIES: Movie[]` array (no API calls). Named slices (`NP_HERO`, `NP_NEW`, `NP_UPCOMING`, `NP_TRENDING`) are pre-computed from that array and used directly in `HomeScreen`.

### Styling

All component styles are inline (`style={{ ... }}`). Global design tokens are defined as CSS custom properties in `src/index.css` with the `--np-` prefix:
- `--np-bg` / `--np-surface` / `--np-surface-2` — background layers
- `--np-primary` (`#ff2c55`) — red accent; `--np-gold` (`#ffc83a`) — rating/highlight
- `--np-fg` / `--np-fg-1` / `--np-fg-2` / `--np-fg-3` — text hierarchy
- `--np-ease-out`, `--np-dur-base`, etc. — shared motion values
- `--np-container: 1760px` — max content width; `--np-nav-h: 64px` — navbar height

Fonts (loaded from Google Fonts): **Manrope** for display/headings, **Be Vietnam Pro** for body, **JetBrains Mono** for monospace.

### Screen & component structure

```
src/
  App.tsx                  # route state, screen switching, scroll-to-top on route change
  data.ts                  # Movie type, NP_MOVIES array, named slices
  index.css                # design tokens (CSS vars) + global resets
  screens/
    HomeScreen.tsx         # assembles Navbar + HeroSlider + MovieRows + Footer
    MovieDetailScreen.tsx  # backdrop hero, tabbed content (episodes/cast/gallery/comments), aside
    LoginScreen.tsx        # login form screen
  components/
    Navbar.tsx             # fixed nav, transparent→frosted on scroll, dropdown menus; exports NovaPlayLogo
    MovieSlider.tsx        # hero carousel (HeroSlider)
    MovieRows.tsx          # exports MovieRow (prev/next pagination) and TopTen (horizontal scroll)
    MovieCard.tsx          # PosterCard — hover lift, rating badge, quality badge, genre pills
    Footer.tsx
```

### Design reference files

`project/` contains HTML/CSS prototypes from the Claude Design handoff phase. These are the source of truth for visual design. `project/colors_and_type.css` and `project/preview/*.html` document the full design system. Do not import from `project/` in production code.
