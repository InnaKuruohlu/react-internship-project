# Internship React Project — Movie Finder

A React + TypeScript + Vite movie search app with favourites (Firebase Realtime Database) and authentication (Firebase Auth), built with an MVVM structure.

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in your OMDb and Firebase keys.

---

## Prompts used to build this app

The prompts below are the ones used step by step while building the project.

### 1. Project setup

**Initialize React app**

> Initialize a new React application using Vite, React, and TypeScript.
>
> Use functional components only.
>
> Do not install any UI library.
>
> Do not add any movie functionality yet.

**Remove Vite boilerplate**

> Remove all default Vite content, images, styles, and demonstration code.
>
> Leave a minimal working React application with an empty App component.
>
> Do not create any additional components or functionality.

---

### 2. Header

**Create Header**

> Create a reusable Header component.
>
> The Header should contain:
>
> - a Home navigation link
> - a Favourites navigation link
> - a search input
> - a Search button
>
> Use React Router links for navigation.
>
> Only create and display the Header.
>
> Do not create the Home or Favourites screens yet.
>
> Do not connect the search input to any functionality.

**Style Header**

> please can you add styling to the header

---

### 3. MVVM scaffolds

**Home MVVM structure**

> Create the empty MVVM file structure for the Home screen.
>
> Create:
>
> src/pages/Home/HomeModel.ts
> src/pages/Home/useHomeViewModel.ts
> src/pages/Home/HomeView.tsx
>
> Requirements:
>
> - HomeModel.ts will later contain Home-specific data and business logic.
> - useHomeViewModel.ts will later contain React state and actions.
> - HomeView.tsx will later render the Home interface.
>
> Create only minimal placeholder exports so the application can compile.
>
> Do not add API requests, React state, or movie UI.

**Favourites MVVM structure**

> Create the empty MVVM file structure for the Favourites screen.
>
> Create:
>
> src/pages/Favourites/FavouritesModel.ts
> src/pages/Favourites/useFavouritesViewModel.ts
> src/pages/Favourites/FavouritesView.tsx
>
> Create only minimal placeholder exports so the application can compile.
>
> Do not add Firebase, state, movie cards, or other functionality.

---

### 4. OMDb service

**Empty OMDb service**

> Create a services folder and an empty OMDb movie service file:
>
> src/services/omdbMovieService.ts
>
> Add a short comment explaining that this file will contain communication with the OMDb API.
>
> Do not implement the API request yet.

**Implement searchMovies**

> Implement the OMDb movie search request inside:
>
> src/services/omdbMovieService.ts
>
> Create an exported async function:
>
> searchMovies(query: string): Promise\<Movie[]>
>
> Requirements:
>
> - use the OMDb API
> - read the API key from VITE_OMDB_API_KEY
> - encode the search query
> - use the Movie and OmdbSearchResponse types
> - return the Search array as Movie[]
> - throw a readable error when the HTTP request fails
> - throw a readable error when OMDb returns Response: "False"
>
> For the API_URL use https://www.omdbapi.com/
>
> Do not use React hooks.
> Do not use useEffect.
> Do not manage loading, error, or component state.

**Temporary test / console logs**

> okay add console logs just to double check if it works

> okay import {SearchMovies} to the @src/App.tsx file with creating temporary test call

> please make the temporary test call like from the screenshot

> [OMDb] Test failed: Error: OMDb request failed with status 401.

---

### 5. Home screen (Model → ViewModel → View)

**HomeModel**

> Implement the Home model inside:
>
> src/pages/Home/HomeModel.ts
>
> Import searchMovies from omdbMovieService.
>
> Create and export:
>
> getMovies(query: string): Promise\<Movie[]>
>
> Responsibilities:
>
> - trim the query
> - validate that the query contains at least two characters
> - call searchMovies with the cleaned query
> - return the movie list
>
> Do not use React hooks.
> Do not use useState or useEffect.
> Do not call fetch directly.

**useHomeViewModel**

> Implement a custom hook inside:
>
> src/pages/Home/useHomeViewModel.ts
>
> Create and export:
>
> useHomeViewModel()
>
> Manage these properties using useState:
>
> - query
> - movies
> - loading
> - error
>
> Create a function:
>
> handleSearch()
>
> The function should:
>
> - set loading to true
> - clear the previous error
> - call getMovies from HomeModel using the current query
> - save the returned movie list in movies state
> - store a readable error if the request fails
> - set loading to false when finished
>
> Return:
>
> - query
> - setQuery
> - movies
> - loading
> - error
> - handleSearch
>
> Do not render JSX.
> Do not call fetch directly.
> Do not import omdbMovieService directly.

**HomeView**

> Implement the Home view inside:
>
> src/pages/Home/HomeView.tsx
>
> Requirements:
>
> - import and use useHomeViewModel
> - display the current search input
> - connect the input value to query
> - update query using setQuery
> - call handleSearch when the Search button is clicked
> - also allow searching by submitting the form
> - display a loading message while loading is true
> - display the error message when error exists
> - render the movie list using .map()
> - display the movie title, year, type, and poster
>
> Do not call fetch directly.
> Do not import HomeModel or omdbMovieService.
> Do not implement favourites yet.
> Do not create a reusable MovieCard component yet.

**Remove duplicate search from HomeView**

> we dont need here search input because we have it already in the header

**initialMovies**

> Create an initialMovies() function inside HomeModel.
>
> Requirements:
>
> - automatically fetch at least 20 movies when the Home screen opens
> - every application launch should display a different selection of movies
> - generate the movie list by randomly selecting search keywords from a predefined seed list (for example: Batman, Avengers, Harry Potter, Star Wars, Spider-Man, Marvel, Disney, Matrix, Lord of the Rings, Fast, Mission Impossible, Pixar, Horror, Comedy, Action)
> - use Promise.all to execute requests in parallel
> - merge all results into a single array
> - remove duplicate movies using imdbID
> - shuffle the final array
> - return exactly 20 unique movies
> - keep all fetching logic inside HomeModel
> - use the existing omdbMovieService
> - do not use React hooks
> - do not call fetch directly

**MovieCard**

> Create a reusable MovieCard component.
>
> Create:
>
> src/components/MovieCard/MovieCard.tsx
>
> Requirements:
>
> - receive one Movie object through props
> - display:
>   - poster
>   - title
>   - year
>   - type
> - add a Favourite button, but do not connect it yet
> - use the shared Movie type
> - keep the component presentational
> - do not call APIs
> - do not use Firebase
> - do not manage the movie list
>
> Update HomeView to render MovieCard using .map().

**Fix card heights**

> fix css style for cards, they should visually be the same heights , but you can see that right now the height depends on the card's content. I provide the second screenshot for you to understand what I referring to

**Home reload bug**

> When I search a movie by character and press home, nothing is loaded, it should reload random movies, debug

---

### 6. Firebase & favourites

**Firebase setup**

> Create and configure Firebase for the application.
>
> Create:
>
> src/services/firebaseService.ts
>
> Requirements:
>
> - initialize Firebase using environment variables
> - export the database instance
> - do not save or load any favourites yet
> - do not modify HomeView
> - do not add authentication

**Favourites service functions**

> Inside src/services/firebaseService.ts, add functions for managing favourite movies.
>
> Create:
>
> - addFavourite(movie: Movie): Promise\<void>
> - removeFavourite(imdbID: string): Promise\<void>
> - getFavourites(): Promise\<Movie[]>
>
> Requirements:
>
> - use imdbID as the unique movie identifier
> - keep all Firebase communication inside this service
> - return typed data
> - throw readable errors when operations fail
> - do not use React hooks
> - do not update the UI yet

**FavouritesModel**

> Implement the Favourites model inside:
>
> src/pages/Favourites/FavouritesModel.ts
>
> Import the Firebase service functions.
>
> Create and export:
>
> - loadFavourites(): Promise\<Movie[]>
> - saveFavourite(movie: Movie): Promise\<void>
> - deleteFavourite(imdbID: string): Promise\<void>
>
> Requirements:
>
> - act as a wrapper around firebaseService
> - do not call Firebase directly outside the service
> - do not use React hooks
> - do not manage loading or error state

**useFavouritesViewModel**

> Implement a custom hook inside:
>
> src/pages/Favourites/useFavouritesViewModel.ts
>
> Create and export:
>
> useFavouritesViewModel()
>
> Manage with useState:
>
> - favourites
> - loading
> - error
>
> Create functions:
>
> - loadMovies()
> - removeMovie(imdbID)
>
> Requirements:
>
> - use FavouritesModel only
> - load favourites when the screen opens
> - use useEffect for the initial load
> - update local state after a movie is removed
> - return all state and actions required by FavouritesView
> - do not render JSX
> - do not import firebaseService directly

**FavouritesView**

> Implement the Favourites view inside:
>
> src/pages/Favourites/FavouritesView.tsx
>
> Requirements:
>
> - use useFavouritesViewModel
> - display a loading message while loading
> - display an error message when error exists
> - render favourites using MovieCard and .map()
> - show a friendly empty message when there are no favourites
> - allow removing a movie from favourites
> - do not call Firebase directly
> - do not import FavouritesModel directly

**Connect Favourite button / Realtime Database**

> when i click a favourite button from the signle card of the movie, nothing happens and it should add that movie as favourite to the real time datase

**User-scoped favourites**

> Update the existing favourites service so favourites are stored under the signed-in user's profile.
>
> Use this Real time DB structure:
>
> users/{userId}/favourites/{imdbID}
>
> Update the existing functions so they receive userId:
>
> - addFavourite(userId: string, movie: Movie)
> - removeFavourite(userId: string, imdbID: string)
> - getFavourites(userId: string)
>
> Requirements:
>
> - use userId as the parent user document ID
> - use imdbID as the favourite document ID
> - preserve the existing function behaviour
> - do not use React hooks
> - do not access auth.currentUser inside the service
> - throw a readable error when userId is missing

---

### 7. Authentication

**Firebase Auth + Firestore config**

> Install Firebase and update the existing Firebase configuration.
>
> Requirements:
>
> - initialize Firebase Authentication using getAuth
> - initialize Cloud Firestore using getFirestore
> - export auth and db
> - read Firebase configuration from Vite environment variables
> - use the modern modular Firebase SDK
> - do not add registration or login UI yet
> - do not add anything new regarding favourites logic yet
>
> Create or update:
>
> src/services/firebaseService.ts
>
> Also create an .env.example file containing placeholder Firebase environment variables.

**authService**

> Create:
>
> src/services/authService.ts
>
> Implement and export these functions:
>
> - registerUser(email: string, password: string)
> - loginUser(email: string, password: string)
> - logoutUser()
> - subscribeToAuthChanges(callback)
>
> Requirements:
>
> - use Firebase Authentication
> - use createUserWithEmailAndPassword for registration
> - use signInWithEmailAndPassword for login
> - use signOut for logout
> - use onAuthStateChanged inside subscribeToAuthChanges
> - return typed Firebase User data where appropriate
> - convert Firebase errors into readable messages
> - do not use React hooks
> - do not use useState or useEffect
> - do not render JSX

**Auth MVVM structure**

> Create the MVVM file structure for authentication.
>
> Create:
>
> src/pages/Auth/AuthModel.ts
> src/pages/Auth/useAuthViewModel.ts
> src/pages/Auth/AuthView.tsx
>
> Requirements:
>
> - add minimal typed placeholder exports
> - ensure the application still compiles
> - do not implement registration or login yet
> - do not add routing yet

**AuthModel**

> Implement src/pages/Auth/AuthModel.ts.
>
> Import the authentication functions from authService.
>
> Create and export:
>
> - register(email: string, password: string)
> - login(email: string, password: string)
> - logout()
>
> Responsibilities:
>
> - trim and normalize the email address
> - validate that the email and password are not empty
> - validate that the password contains at least six characters
> - call the corresponding authService function
> - return the authenticated Firebase User
>
> Do not use React hooks.
> Do not call Firebase Authentication directly outside authService.
> Do not manage UI state.

**useAuthViewModel**

> Implement the useAuthViewModel custom hook inside:
>
> src/pages/Auth/useAuthViewModel.ts
>
> Manage these values using useState:
>
> - email
> - password
> - mode, which can be "login" or "register"
> - loading
> - error
>
> Create these functions:
>
> - handleSubmit()
> - toggleMode()
>
> Requirements:
>
> - handleSubmit should call AuthModel.login when mode is "login"
> - handleSubmit should call AuthModel.register when mode is "register"
> - clear previous errors before submitting
> - manage the loading state
> - store readable errors
> - clear the password after successful authentication
> - return all state and functions needed by AuthView
> - do not render JSX
> - do not call Firebase directly
> - do not import authService directly

**AuthView**

> Implement src/pages/Auth/AuthView.tsx.
>
> Requirements:
>
> - use useAuthViewModel
> - display either "Login" or "Create Account" based on the current mode
> - add a controlled email input
> - add a controlled password input
> - add a submit button
> - disable the submit button while loading
> - display readable validation or Firebase errors
> - add a button for switching between login and registration
> - submit the form using onSubmit
> - prevent the default browser form submission
>
> Do not call Firebase directly.
> Do not import AuthModel or authService.

**AuthContext**

> Create a global authentication context.
>
> Create:
>
> src/context/AuthContext.tsx
>
> Requirements:
>
> - use onAuthStateChanged through authService
> - store the current Firebase user
> - store an authLoading state while Firebase restores the session
> - expose:
>   - user
>   - authLoading
>   - logout
> - wrap the application with AuthProvider
> - unsubscribe from the authentication listener when the provider unmounts
> - show a loading state while authentication is being initialized
> - do not add favourites logic

**Types organization**

> move types under /types

> what about index.ts

---

### 8. Routing & auth UX

**Routing**

> Update the application routing.
>
> Requirements:
>
> - add an /auth route that displays AuthView
> - allow HomeView to remain publicly accessible
> - protect the /favourites route
> - when an unauthenticated user opens /favourites, redirect them to /auth
> - when an authenticated user opens /auth, redirect them to /
> - preserve the Header on every page
> - use the user and authLoading values from AuthContext

**Unauth Favourite click → Favourites**

> If I am unauth and click favourite button from the home page, redirect me to the favourites page

**Move handleFavouriteClick to ViewModel**

> the function handleFavouriteClick that handle the above action "If I am unauth and click favourite button from the home page, redirect me to the favourites page" should be created like from the exmaple of screenshot and after that move this to viewModel

**Logout button**

> add logout button as well and connect it with logout function

**Move Login/Logout in Header**

> transfer the Login/Logout button after the Favourites buttton

**This README**

> create me in read me all prompts that we used for this app

---

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run oxlint               |
