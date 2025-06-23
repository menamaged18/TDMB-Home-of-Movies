import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moviesList from './moviesList.json';

// create movie object
interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    release_date?: string;
}
 
interface MovieState {
    staticData: Movie[];
    selectedMovie: Movie | null; // Added to hold a single selected movie
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    totalPages: number;
    error: string | null;
}
 
const initialState: MovieState = {
    staticData: [], 
    selectedMovie: null, 
    status: 'idle',
    totalPages: 0,
    error: null,
};

const staticMovies = createSlice({
    name: 'staticMovies',
    initialState,
    reducers: {
        getMoviesPage: (state, action: PayloadAction<number>) => { 
            const pageData = moviesList.pages.find((p) => p.page === action.payload);
            if (pageData) {
                state.staticData = pageData.movies;
                state.totalPages = moviesList.total_pages;
            }
        },
        searchForMovie: (state, action: PayloadAction<string>) => { 
            const searchTerm = action.payload.toLowerCase();
            const filteredMovies = moviesList.pages
                .flatMap((p) => p.movies)
                .filter((m) => m.title.toLowerCase().includes(searchTerm));

            state.staticData = filteredMovies;
            state.totalPages = 1; 
        },
        // New reducer to get a movie by ID
        getMovieById: (state, action: PayloadAction<number>) => {
            const movieId = action.payload;
            const foundMovie = moviesList.pages
                .flatMap((p) => p.movies) // Flatten all movies from all pages
                .find((movie) => movie.id === movieId); // Find the movie by ID

            state.selectedMovie = foundMovie || null; // Store the found movie, or null if not found
        }
    }
});

export const { getMoviesPage, searchForMovie, getMovieById } = staticMovies.actions; // export new action
export default staticMovies.reducer; // export reducer