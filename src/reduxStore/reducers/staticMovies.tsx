import { createSlice } from '@reduxjs/toolkit'
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
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    totalPages: number;
    error: string | null;
}
  
const initialState: MovieState = {
    staticData: [],  
    status: 'idle',
    totalPages: 0,
    error: null,
};

const staticMovies = createSlice({
    name: 'staticMovies',
    initialState,
    reducers: {
        getMoviesPage: (state, action) => {
            const pageData = moviesList.pages.find((p) => p.page === action.payload);
            if (pageData) {
                state.staticData = pageData.movies;  // Store movies in 'data'
                state.totalPages = moviesList.total_pages; // Store total pages
            }
        },
        searchForMovie: (state, action) => {
            const searchTerm = action.payload.toLowerCase();
            const filteredMovies = moviesList.pages
                .flatMap((p) => p.movies)
                .filter((m) => m.title.toLowerCase().includes(searchTerm));

            state.staticData = filteredMovies; // Store search results in 'staticData'
            state.totalPages = 1; 
        }
    }
});


export const { getMoviesPage, searchForMovie } = staticMovies.actions; // export actions
export default staticMovies.reducer; // export reducer