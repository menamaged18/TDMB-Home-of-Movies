import { createSlice } from '@reduxjs/toolkit'
import moviesList from './moviesList.json';

const initialState = {
    movies: [],
    totalPages: 0,
    searchedMovie: null
}

const staticMoives = createSlice({
    name: 'staticMoives',
    initialState,
    reducers: {
        getMoviesPage: (state, action) => {
            state.movies = moviesList.pages.find((p) => p.page === action.payload);
            state.totalPages = moviesList.total_pages;
        },
        searchForMovie: (state, action) => {
            const searchTerm = action.payload.toLowerCase();
            const filteredMovies = moviesList.pages
                .flatMap((p) => p.movies)
                .filter((m) => m.title.toLowerCase().includes(searchTerm));
            state.movies = {
                page: 1,
                movies: filteredMovies
            };
        }
    }
})

export const { getMoviesPage, searchForMovie } = staticMoives.actions; // export actions
export default staticMoives.reducer; // export reducer