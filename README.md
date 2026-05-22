# Movies Collection App

A modern web application for discovering, searching, and managing your favorite movies. Built with React, Vite, and powered by The Movie Database (TMDB) API and Firebase.

> **Built with AI** - This project was developed with assistance from AI-powered tools to accelerate development and ensure best practices.

## 🎬 Features

- **Movie Discovery**: Browse popular and trending movies, or discover by genre
- **Genre Filtering**: Filter movies by genre with an intuitive dropdown selector
- **Search Functionality**: Search for movies by title with real-time debounced search
- **Infinite Scroll Pagination**: Automatic pagination as you scroll through movie lists
- **Movie Details**: View comprehensive movie information including cast, crew, videos, and similar movies
- **User Authentication**: Register and login with Firebase Authentication
- **Favorites Management**: Add/remove movies to your personal favorites collection
- **User Profile**: Manage your profile and view personalized data
- **Responsive Design**: Beautiful, responsive UI built with Tailwind CSS
- **Protected Routes**: Secure routes that require authentication
- **Smooth Navigation**: Fast client-side routing with React Router

## 🛠️ Tech Stack

### Frontend

- **React 19.2.6** - UI library
- **Vite 8.0.12** - Fast build tool and dev server
- **React Router 7.15.1** - Client-side routing
- **Tailwind CSS 4.3.0** - Utility-first CSS framework
- **React Hook Form 7.76.0** - Efficient form handling
- **Zod 4.4.3** - Schema validation
- **React Icons 5.6.0** - Icon library
- **React Hot Toast 2.6.0** - Toast notifications
- **Swiper JS** - Sliders

### Backend Services

- **Firebase Authentication** - User authentication
- **Firestore** - Real-time database
- **TMDB API** - Movie data source

### State Management & Data Fetching

- **TanStack React Query 5.100.10** - Server state management
- **Axios 1.16.1** - HTTP client
- **HeadlessUI** - Unstyled accessible UI components

### Development Tools

- **ESLint 10.3.0** - Code linting
- **Tailwind CSS Vite Plugin** - Optimized CSS processing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project with authentication and Firestore enabled
- TMDB API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movies-collection-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── app/
│   └── router.jsx              # Route configuration
├── components/
│   ├── common/                 # Reusable UI components
│   ├── layout/                 # Layout components
│   └── movie/                  # Movie-specific components
├── features/
│   ├── auth/                   # Authentication feature
│   ├── favorites/              # Favorites management
│   ├── movies/                 # Movies browsing feature
│   └── profile/                # User profile feature
├── hooks/                      # Custom React hooks
├── lib/                        # External library configurations
├── routes/                     # Route utilities
├── styles/                     # Global styles
├── utils/                      # Utility functions
├── main.jsx                    # Application entry point
└── index.css                   # Global CSS
```

For detailed information about each file and module, see [development.md](development.md).

## 🔐 Authentication Flow

1. User registers/logs in via Firebase Authentication
2. AuthContext provides user state throughout the app
3. Protected routes check authentication status
4. User data synced with Firestore database

## 🎯 Key Features Explained

### Movie Search

- Debounced search to optimize API calls
- Real-time search results display
- Search results navigation

### Favorites

- Add/remove movies from favorites
- Favorites stored in Firestore
- Quick access from profile

### Movie Details

- Comprehensive movie information
- Cast and crew information
- Related videos and similar movies
- Professional presentation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions, please open an issue in the repository.

## 🤖 AI-Assisted Development

This project was developed with the assistance of AI tools including:

- Code generation and optimization
- Architecture planning and best practices
- Documentation generation
- Testing assistance
- Code review and quality assurance

The use of AI has helped ensure clean, maintainable code and comprehensive documentation while accelerating the development process.

## 🔗 Resources

- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
