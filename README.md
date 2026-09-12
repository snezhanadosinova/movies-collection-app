# Movies Collection App

A React application for discovering movies and TV series, exploring cast profiles, and keeping a personal favorites collection. Movie, series, and person information comes from TMDB; authentication and favorites use Firebase.

This is a learning and portfolio project focused on frontend architecture, asynchronous state, accessible interfaces, and testing. Development is assisted by AI tools, with changes reviewed and checked incrementally.

## Features

### Movies and TV series

- Featured movie slider on the home page.
- Movie and TV catalogs with genre filters and debounced title search.
- Search and genre selection stored in URL parameters.
- Infinite scrolling for browsing catalogs.
- Automatic search pagination up to five result pages, with genre filtering and duplicate removal. Search results are therefore bounded, not a complete search of every API page.
- Detail pages with posters, backdrops, descriptions, ratings, genres, cast, trailers, and up to six recommendations.
- Trailers load the embedded player after the user chooses to play them.
- TV season pages with episode information, including Specials (season zero).
- Loading placeholders, missing-data fallbacks, and retry controls.

### People

- Person profiles with biography, available personal information, external profiles, and filmography.
- Filmography filters and pagination with eight titles per page.
- Photo gallery initially showing six photos; Load More adds six at a time.
- Gallery overlay with image navigation.
- Local movie and TV links from filmography.
- Contextual return links between titles and people, including the return path through TV seasons.

### Accounts and favorites

- Email/password registration and login through Firebase Authentication.
- Profile display-name editing in a modal.
- Movie and TV favorites with optimistic updates and rollback after failed writes.
- Separate identities for movies and series that share a numeric TMDB ID.
- Favorites filters for all titles, movies, or TV series.
- Unavailable favorite titles remain identifiable so they can be removed.
- Cached avatar initials help display session-restoration UI; Firebase remains the source of authentication state.

## Technology

| Area | Tools |
| --- | --- |
| Interface | React 19, Tailwind CSS 4, Headless UI, React Icons, Swiper |
| Routing | React Router 7 |
| Server state | TanStack Query 5, Axios |
| Forms | React Hook Form, Zod |
| Services | TMDB API, Firebase Authentication, Cloud Firestore |
| Development | Vite 8, ESLint, Docker Compose |
| Tests | Vitest, React Testing Library, jsdom, Firebase Rules Unit Testing |

Dependency ranges are recorded in `package.json`; `package-lock.json` records the resolved dependency tree. Use `npm ci` for reproducible installation.

## Getting started with Docker

Run the following commands from the repository root in a terminal. On Windows with WSL, use the WSL terminal in VS Code and keep the project in the Linux filesystem.

### 1. Clone the repository

```bash
git clone https://github.com/snezhanadosinova/movies-collection-app.git
cd movies-collection-app
```

### 2. Configure environment variables

Create `.env.local` in the repository root with your project's values:

```dotenv
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Configure a Firebase project with Email/Password sign-in enabled and a Firestore database. Configure the appropriate authentication domains and apply the repository's Firestore rules to your own project before relying on favorites access control.

All `VITE_*` values are included in the browser application. They are not server-side secrets. Never place service-account credentials or private server tokens in them. Do not commit your local environment files.

The app uses the configured Firebase project during development. The separate rules-test command uses a demo project in the emulator; starting the development server does not automatically connect the app to that emulator.

### 3. Start the development container

Requirements: Docker with the Compose plugin. On Windows, enable Docker Desktop's integration with your WSL distribution.

```bash
docker compose -f compose.dev.yml up --build -d
docker compose -f compose.dev.yml logs -f app
```

Open [localhost:5173](http://localhost:5173). Press `Ctrl+C` to stop following logs; the detached container keeps running.

`Dockerfile.dev` provides Node 22 and Java 21 for the Firestore emulator. The container runs `npm ci` before starting Vite. Source files are bind-mounted, and dependencies and emulator downloads use named volumes.

Stop the development environment:

```bash
docker compose -f compose.dev.yml down
```

After changing environment variables, restart the app:

```bash
docker compose -f compose.dev.yml restart app
```

## Local development without Docker

Use Node.js 22.12 or newer in the Node 22 release line and npm. Java 21 is also required for the Firestore emulator tests.

After configuring `.env.local`:

```bash
npm ci
npm run dev
```

## Checks and tests

With the development container running:

```bash
docker compose -f compose.dev.yml exec app npm run lint
docker compose -f compose.dev.yml exec app npm run test:run
docker compose -f compose.dev.yml exec app npm run test:rules
docker compose -f compose.dev.yml exec app npm run build
```

Run an individual test file:

```bash
docker compose -f compose.dev.yml exec app npm run test:run -- src/test/people/PersonMediaReturn.test.jsx
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run lint` | Check source with ESLint |
| `npm test` | Run Vitest in watch mode |
| `npm run test:run` | Run the regular test suite once |
| `npm run test:rules` | Start Firestore emulator, run rules tests, then stop it |
| `npm run build` | Generate the production bundle in `dist/` |
| `npm run preview` | Preview a built bundle locally |

All tests live under `src/test/`. Regular tests cover components, hooks, utilities, routing interactions, and favorites behavior. Firestore security tests use a separate Node configuration and do not run as part of `test:run`.

The rules test script uses `demo-movies-collection`. Its first run may download the emulator. Permission-denied logs can be expected in tests that intentionally verify rejected access; check the final test results.

Tests are not a substitute for browser checks of responsive layouts, keyboard navigation, focus, and loading behavior.

## Routes

| Route | Page |
| --- | --- |
| / | Featured slider and popular movies and TV series |
| /movies | Movie search and genre catalog |
| `/tv` | TV catalog |
| `/movies/:id` | Movie details |
| `/tv/:id` | TV details |
| `/tv/:id/seasons/:seasonNumber` | Season and episodes |
| `/people/:id` | Person profile |
| `/login` | Login |
| `/register` | Registration |
| `/profile` | User profile |
| `/favorites` | Mixed movie and TV favorites |

Catalog filters use `q` and `genre` query parameters. Legacy home URLs containing `q` or `genre` redirect to `/movies` with their parameters preserved.

## Project structure

```text
src/
  app/                  Route definitions and lazy route components
  components/
    common/             Shared controls and loading/navigation helpers
    layout/             Main layout and navbar
    media/              Shared movie/TV cards and recommendations
    movie/              Movie cards, slider, search, and favorite button
  features/
    auth/               Authentication, forms, and session context
    favorites/          Storage, queries, mutations, and favorites page
    movies/             Movie API, hooks, pages, and detail sections
    people/             Person profiles, filmography, and gallery
    profile/            User profile and editing modal
    tv/                 TV catalog, details, seasons, and episodes
  hooks/                Shared React hooks
  lib/                  Firebase, Axios, and QueryClient configuration
  routes/               Authentication route wrapper
  test/                 Tests and test setup
  utils/                Image, identity, formatting, and navigation helpers
```

## Data and access control

Favorites currently use a map in `users/{uid}`. Legacy movie keys remain numeric strings, while TV keys use a `tv:` prefix, for example `"550"` and `"tv:550"`.

Firestore rules restrict document access to the owner, allow only the `favorites` top-level field containing a map, and deny listing or deleting user documents. The rules do not currently validate every nested favorite entry. Client-side route checks are a UI concern; Firestore rules enforce database access.

Query keys separate user-specific favorites by UID and media details by type and ID. Firestore code is loaded on demand, and several route pages are lazy-loaded to reduce the initial JavaScript bundle.

## Accessibility and current limitations

The interface includes labeled controls, visible focus styles, loading/error announcements, and keyboard-operable links and buttons. Accessibility work targets WCAG 2.2 AA, but the project has not undergone a complete conformance audit.

Remaining work includes:

- Restore catalog scroll position when navigating back.
- Improve slider pause controls and reduced-motion behavior.
- Refine Home discovery content and catalog navigation.
- Reduce unnecessary catalog requests and stabilize large favorites collections.
- Expand browser-level regression coverage and mobile accessibility checks.
- Add an SEO strategy for metadata, social previews, and indexing.

Watchlist and watched-status tracking are future features and are not currently available.

## Production build

```bash
npm run build
```

The output is generated in `dist/`. Build-time environment values must be available when the bundle is created. A production host must serve `index.html` for application routes so direct links and refreshes work with browser routing. `npm run preview` is for local build verification, not a production server.

## Development workflow

1. Make one coherent change at a time.
2. Add or update tests for changed behavior.
3. Run lint, relevant tests, and the production build. Run emulator tests for database access changes.
4. Check affected flows in the browser, including mobile and keyboard use.
5. Review the diff and create a descriptive commit.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Metadata and imagery are supplied by TMDB.

- [TMDB documentation](https://developer.themoviedb.org/docs)
- [Firebase documentation](https://firebase.google.com/docs)
- [React documentation](https://react.dev)
- [React Router documentation](https://reactrouter.com)
- [TanStack Query documentation](https://tanstack.com/query/latest)
- [Vitest documentation](https://vitest.dev)
