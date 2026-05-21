# Development Guide - Project File Structure

This document provides detailed explanations of each file and module in the Movies Collection App project.

> **AI-Assisted Project** - This project was developed with AI assistance to ensure best practices, clean architecture, and comprehensive documentation. The structure and patterns reflect modern React development standards.

## 📂 Root Level Files

### `package.json`

- **Purpose**: Defines project metadata, dependencies, and npm scripts
- **Key Scripts**:
  - `dev`: Starts Vite development server
  - `build`: Creates optimized production build
  - `lint`: Runs ESLint for code quality
  - `preview`: Preview production build locally
- **Dependencies**: React, Vite, Firebase, TMDB API integration libraries
- **Dev Dependencies**: ESLint, Tailwind CSS, TypeScript types

### `vite.config.js`

- **Purpose**: Vite configuration file for build optimization and plugins
- **Configuration**:
  - React plugin for JSX support
  - Tailwind CSS Vite plugin for CSS processing
  - Path alias `@` pointing to `src` directory for cleaner imports
- **Used By**: Vite during development and build processes

### `eslint.config.js`

- **Purpose**: ESLint configuration for code quality and consistency
- **Includes**: React hooks plugin, React refresh plugin, and JavaScript linting rules
- **Used By**: Linting process via `npm run lint` command

### `index.html`

- **Purpose**: Main HTML file and application entry point
- **Contains**: Root div with id `root` where React app mounts
- **Loads**: `src/main.jsx` as the application entry point

### `README.md`

- **Purpose**: Project overview, features, setup instructions, and documentation

---

## 🔧 Core Application Files

### `src/main.jsx`

- **Purpose**: Application entry point that bootstraps the React app
- **Functions**:
  - Mounts React app to the DOM (`#root`)
  - Wraps app with AuthProvider for authentication context
  - Sets up React Router with configured routes
  - Initializes toast notifications (React Hot Toast)
- **Key Setup**: Creates router, providers, and renders App component

### `src/App.jsx`

- **Purpose**: Main App component that renders router outlet
- **Contains**: Application shell and global layout

### `src/index.css`

- **Purpose**: Global CSS styles and base Tailwind directives
- **Contains**: Tailwind `@tailwind` directives and global styling

---

## 🏗️ Architecture Directories

### **src/app/**

#### `router.jsx`

- **Purpose**: Central route configuration for the entire application
- **Routes Defined**:
  - `/` - Home page (popular movies)
  - `/register` - User registration
  - `/login` - User login
  - `/movies/:id` - Movie details page
  - `/profile` - User profile page
  - `/favorites` - Favorites page
- **Structure**: Nested routes under MainLayout component
- **Children Routes**: All routes display within MainLayout component's outlet
- **Used By**: main.jsx to initialize React Router

---

### **src/components/**

#### `common/`

##### `Input.jsx`

- **Purpose**: Reusable input component for forms
- **Features**: Form integration, validation, styling consistency
- **Used By**: Login, Register, and Search components

##### `ScrollToTop.jsx`

- **Purpose**: Utility component that scrolls page to top on route changes
- **Behavior**: Automatically scrolls to top when user navigates to new pages
- **Used By**: MainLayout to improve user experience

##### `InfiniteScrollTrigger.jsx`

- **Purpose**: Infinite scroll trigger component using Intersection Observer API
- **Behavior**: Detects when user scrolls near the bottom of the page
- **Features**:
  - Uses Intersection Observer for performance-efficient scroll detection
  - Accepts `onIntersect` callback to fetch more data
  - Triggers when element becomes fully visible in viewport
- **Props**:
  - `onIntersect` - Callback function triggered when element intersects viewport
- **Used By**: HomePage and other pages with infinite scroll pagination

#### `layout/`

##### `MainLayout.jsx`

- **Purpose**: Main layout wrapper for all authenticated pages
- **Contains**: Navbar, page content outlet, and global layout structure
- **Features**: Consistent navigation and footer across pages
- **Children**: All route pages render as children of this layout

##### `Navbar.jsx`

- **Purpose**: Navigation bar component displayed on all pages
- **Features**:
  - Navigation links (Home, Favorites, Profile)
  - User authentication status display
  - Login/Logout buttons
  - Search bar integration
  - Responsive mobile menu

#### `movie/`

##### `MovieCard.jsx`

- **Purpose**: Individual movie card component for displaying movie items
- **Displays**:
  - Movie poster image
  - Title, rating, and release date
  - Add/remove from favorites button
  - Link to movie details page
- **Used By**: MovieGrid, HomePage, FavoritesPage

##### `MovieGrid.jsx`

- **Purpose**: Grid layout component for displaying multiple movie cards
- **Features**:
  - Responsive grid layout
  - Handles movie array mapping
  - Loading and empty states
- **Used By**: HomePage, FavoritesPage, search results display

##### `MovieSearch.jsx`

- **Purpose**: Search bar component with debounced search functionality
- **Features**:
  - Text input with debouncing
  - Real-time search results
  - Search result display/navigation
- **Used By**: Navbar and HomePage

##### `GenreFilter.jsx`

- **Purpose**: Genre filter dropdown component for filtering movies
- **Features**:
  - Displays list of available genres from TMDB API
  - Dropdown selection interface
  - Real-time filter updates
  - "All Genres" option to reset filter
- **Props**:
  - `value` - Currently selected genre ID
  - `onChange` - Callback function when genre selection changes
- **Styling**: Tailwind CSS dark theme styling
- **Used By**: HomePage for genre-based movie filtering

---

### **src/features/**

Directory structure organized by feature with each feature containing:

- `pages/` - Page components
- `api/` or `services/` - API calls and business logic
- `context/` - Context providers (if applicable)
- `hooks/` - Custom hooks
- `validation/` - Input validation schemas

#### **auth/**

##### `context/AuthContext.jsx`

- **Purpose**: Global authentication context and provider
- **Provides**:
  - `user` - Current authenticated user
  - `setUser` - Update user state
  - `loading` - Loading state during auth check
  - `refreshUser` - Force refresh user data
- **Features**:
  - Listens to Firebase auth state changes
  - Persists authentication across page reloads
  - Provides `useAuth` hook for accessing auth data
- **Used By**: All components needing user authentication status

##### `pages/RegisterPage.jsx`

- **Purpose**: User registration page component
- **Features**:
  - Registration form with email and password
  - Form validation using Zod schema
  - Firebase user creation
  - Firestore user profile creation
  - Error handling and feedback
  - Redirect to login on success

##### `pages/LoginPage.jsx`

- **Purpose**: User login page component
- **Features**:
  - Login form with email and password
  - Form validation
  - Firebase authentication
  - Auth state synchronization
  - Redirect to home on success
  - Error handling with toast notifications

##### `services/authService.js`

- **Purpose**: Authentication business logic and API calls
- **Functions**:
  - User registration with email/password
  - User login
  - Logout functionality
  - Firestore user profile management
  - User data retrieval

##### `validation/authSchema.js`

- **Purpose**: Zod validation schemas for auth forms
- **Schemas**: Email format, password strength requirements
- **Used By**: LoginPage and RegisterPage for form validation

#### **favorites/**

##### `api/getFavoriteMovies.js`

- **Purpose**: API call to fetch user's favorite movies from Firestore
- **Returns**: Array of favorited movie objects
- **Called By**: useFavoriteMovies hook

##### `hooks/useFavoriteMovies.js`

- **Purpose**: React Query hook for fetching user's favorite movies
- **Features**:
  - Automatic data fetching
  - Caching
  - Error handling
- **Used By**: FavoritesPage

##### `hooks/useFavorites.js`

- **Purpose**: Hook for managing user's favorite movies collection
- **Functions**:
  - Get favorites list
  - Check if movie is favorited
  - Add/remove from favorites
- **Used By**: MovieCard and FavoritesPage

##### `hooks/useToggleFavorite.js`

- **Purpose**: Hook for toggling favorite status of a movie
- **Features**:
  - Add to/remove from favorites
  - Optimistic updates
  - Error handling
- **Used By**: MovieCard, MovieDetailsPage

##### `pages/FavoritesPage.jsx`

- **Purpose**: Page displaying user's favorite movies
- **Features**:
  - Lists all favorited movies
  - Grid layout with MovieCard components
  - Empty state message
  - Loading state handling
- **Requires**: User authentication

##### `services/favoritesService.js`

- **Purpose**: Firestore operations for favorites management
- **Functions**:
  - Save favorite movie
  - Remove favorite movie
  - Fetch user favorites
  - Check if movie is favorited

#### **movies/**

##### `api/tmdbApi.js`

- **Purpose**: TMDB API integration and movie data fetching
- **Main Functions**:
  - `getPopularMovies(page)` - Fetch popular movies with pagination support
  - `getTrendingMovies()` - Fetch trending movies
  - `getMovieDetails(id)` - Fetch detailed movie info including credits, videos, and similar movies
  - `searchMovies(query)` - Search movies by title
  - `getMovieGenres()` - Fetch list of available movie genres
  - `discoverMovies({ genre, page })` - Discover movies filtered by genre with pagination
- **Setup**: Uses Axios configured instance with TMDB base URL and API key
- **Pagination**: `getPopularMovies` and `discoverMovies` support page parameter for pagination
- **Used By**: Custom hooks and pages

##### `hooks/useMovieDetails.js`

- **Purpose**: React Query hook for fetching single movie details
- **Features**: Caching, loading/error states, automatic refetching
- **Used By**: MovieDetailsPage

##### `hooks/usePopularMovies.js`

- **Purpose**: React Query hook for fetching popular movies
- **Features**: Pagination support, caching, error handling
- **Used By**: HomePage (legacy, consider using useInfinitePopularMovies)

##### `hooks/useSearchMovies.js`

- **Purpose**: React Query hook for searching movies
- **Features**: Debounced search, query caching, dynamic updates
- **Used By**: MovieSearch component

##### `hooks/useMovieGenres.js`

- **Purpose**: React Query hook for fetching all available movie genres
- **Features**:
  - Caches genres indefinitely (staleTime: Infinity)
  - Returns array of genre objects with id and name
  - Automatic data fetching on component mount
- **Used By**: GenreFilter component

##### `hooks/useDiscoverMovies.js`

- **Purpose**: React Query hook for discovering movies filtered by genre
- **Features**:
  - Fetches movies based on selected genre
  - Caching with query key combining discover action and genre
  - Supports single-page queries
- **Parameters**:
  - `genre` - Genre ID to filter movies
- **Used By**: HomePage for genre-filtered movie discovery

##### `hooks/useInfinitePopularMovies.js`

- **Purpose**: React Query infinite query hook for popular movies with pagination
- **Features**:
  - Infinite scroll pagination using useInfiniteQuery
  - Automatic page parameter management
  - Detects if more pages are available
  - Handles fetching next page automatically
- **Returns**:
  - `data` - Object with `pages` array containing all fetched results
  - `hasNextPage` - Boolean indicating if more pages exist
  - `fetchNextPage` - Function to fetch next page
  - `isFetchingNextPage` - Loading state for next page fetch
- **Used By**: HomePage for infinite scroll of popular movies

##### `hooks/useInfiniteDiscoverMovies.js`

- **Purpose**: React Query infinite query hook for discovering movies by genre with pagination
- **Features**:
  - Infinite scroll pagination for genre-filtered movies
  - Dynamic query key based on selected genre
  - Supports empty genre for all movies
  - Automatic page parameter management
- **Parameters**:
  - `genre` - Genre ID to filter movies (empty string for all)
- **Returns**:
  - `data` - Object with `pages` array containing all fetched results
  - `hasNextPage` - Boolean indicating if more pages exist
  - `fetchNextPage` - Function to fetch next page
  - `isFetchingNextPage` - Loading state for next page fetch
- **Used By**: HomePage for infinite scroll of genre-filtered movies

##### `pages/HomePage.jsx`

- **Purpose**: Main landing page displaying popular and trending movies
- **Features**:
  - Search functionality with real-time debounced input
  - Genre filter dropdown for filtering by movie category
  - Infinite scroll pagination for movie lists
  - Dynamic content based on user selection:
    - Shows search results when searching (no infinite scroll)
    - Shows genre-filtered movies with infinite scroll when genre selected
    - Shows popular movies with infinite scroll by default
  - Responsive layout with search bar and filter on top
  - Loading and error state handling
  - Integration with multiple data sources via React Query
- **State Management**:
  - `search` - Current search input value
  - `selectedGenre` - Currently selected genre filter
  - `debouncedSearch` - Debounced search value to optimize API calls
- **Data Fetching**:
  - Uses infinite query hooks for popular and genre-filtered movies
  - Uses regular query hook for search results
  - Conditional fetching based on user interaction
- **Used By**: Router for home route

##### `pages/MovieDetailsPage.jsx`

- **Purpose**: Detailed movie information page
- **Displays**:
  - Movie poster, title, description
  - Rating and genres
  - Cast and crew information
  - Related videos
  - Similar movies
  - Add to favorites button
- **Data**: Fetched from TMDB API with credits and similar movies

#### **profile/**

##### `pages/ProfilePage.jsx`

- **Purpose**: User profile management page
- **Features**:
  - Display user information (email, name, initials)
  - Edit profile option
  - View statistics (favorites count, etc.)
  - Logout functionality
- **Requires**: User authentication
- **Data**: Retrieved from AuthContext and Firestore

---

### **src/hooks/**

#### `useDebounce.js`

- **Purpose**: Custom hook for debouncing values (text input, API calls)
- **Parameters**: Value to debounce and delay time in milliseconds
- **Returns**: Debounced value after specified delay
- **Use Case**: Optimize search API calls by delaying search until user stops typing
- **Used By**: MovieSearch, search functionality

---

### **src/lib/**

#### `axios.js`

- **Purpose**: Configured Axios instance for all HTTP requests
- **Configuration**:
  - Base URL: TMDB API endpoint
  - Default headers with API key
  - Request/response interceptors (if any)
- **Used By**: All API modules for making HTTP requests

#### `firebase.js`

- **Purpose**: Firebase initialization and configuration
- **Initializes**:
  - Firebase app with credentials from environment variables
  - Firebase Auth service
  - Firestore database
- **Exports**: `auth` and `db` instances for use throughout app
- **Used By**: AuthContext, authService, favoritesService

#### `queryClient.js`

- **Purpose**: React Query client configuration
- **Configuration**:
  - Default query options (stale time, garbage collection)
  - Cache settings
- **Used By**: main.jsx to set up React Query provider

---

### **src/routes/**

#### `ProtectedRoute.jsx`

- **Purpose**: Route wrapper component for protecting authenticated routes
- **Behavior**:
  - Checks if user is authenticated
  - Allows access if authenticated
  - Redirects to login if not authenticated
  - Shows loading state while checking auth status
- **Used By**: Route configuration for pages requiring authentication

---

### **src/styles/**

- **Purpose**: Directory for additional CSS modules or style files
- **Contains**: Additional styling not in index.css or components
- **Note**: Tailwind CSS handles most styling via utility classes

---

### **src/utils/**

#### `getInitials.js`

- **Purpose**: Utility function to extract user initials from name
- **Input**: User's full name
- **Output**: Two-letter initials (e.g., "John Doe" → "JD")
- **Used By**: Profile page, user avatar display

---

## 🔄 Data Flow

### Authentication Flow

```
User Registration/Login → Firebase Auth → AuthContext → Protected Routes → App Access
```

### Movie Discovery Flow

```
HomePage → usePopularMovies/useSearchMovies → TMDB API → MovieGrid/MovieCard → Navigation
```

### Genre Filtering Flow

```
GenreFilter → useDiscoverMovies/useInfiniteDiscoverMovies → TMDB API → MovieGrid → Results
```

### Infinite Scroll Flow

```
InfiniteScrollTrigger (Intersection Observer) → useInfinitePopularMovies/useInfiniteDiscoverMovies → fetchNextPage → TMDB API → Append Results
```

### Favorites Flow

```
MovieCard → useToggleFavorite → Firestore Update → useFavorites → State Update
```

### Search Flow

```
MovieSearch Input → useDebounce → useSearchMovies → TMDB API → Results Display
```

---

## 🎯 Key Technologies & Patterns

### State Management

- **React Context**: Authentication state (AuthContext)
- **React Query**: Server state (movies, favorites)
- **Local State**: Component-level with useState

### Forms

- **React Hook Form**: Form management and validation
- **Zod**: Schema validation for type safety
- **Custom Input Component**: Consistent form inputs

### API Integration

- **Axios**: HTTP client with configured base URL
- **React Query**: Caching and synchronization
- **Environment Variables**: Secure configuration

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Headless UI**: Accessible component patterns

### Routing

- **React Router v7**: Client-side navigation
- **Nested Routes**: Organized route hierarchy
- **Protected Routes**: Authentication-based access control

---

## 🚀 Development Best Practices

1. **Component Organization**: Keep components small and focused
2. **Custom Hooks**: Extract logic into reusable hooks
3. **API Centralization**: All API calls in dedicated modules
4. **Error Handling**: Use toast notifications for user feedback
5. **Loading States**: Always show loading indicators
6. **Code Splitting**: Leverage React Router for route-based code splitting
7. **Environment Variables**: Never commit sensitive data
8. **ESLint**: Run `npm run lint` before committing

## 🤖 AI-Assisted Development

This project leverages AI assistance for:

- **Code Generation**: AI helps generate boilerplate code and component structures
- **Architecture Design**: AI assists in planning folder structures and component hierarchies
- **Best Practices**: AI ensures adherence to React and JavaScript best practices
- **Documentation**: AI generates comprehensive documentation and inline comments
- **Debugging**: AI assists in identifying and fixing common issues
- **Code Review**: AI performs code analysis and suggests improvements
- **Testing**: AI helps design test cases and testing strategies

### Benefits

- **Faster Development**: Reduced boilerplate and scaffolding time
- **Quality Assurance**: Consistent code quality and best practices
- **Better Documentation**: Comprehensive, maintainable documentation
- **Learning Tool**: Great for understanding React patterns and practices
- **Scalability**: AI assists in scaling the application efficiently

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [React Router Documentation](https://reactrouter.com)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
