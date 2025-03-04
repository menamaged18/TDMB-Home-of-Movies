import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
  data: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  page_count: 0,
  error: null,
};

const apiKey = 'f0d249747fa59a853b036b225cb71ba1';

// Create an async thunk to fetch data from the API
export const fetchMData = createAsyncThunk('data/fetchData', async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
  return {
    results: response.data.results,
    pages: response.data.total_pages
    };
});

export const fetchMoviesPage = createAsyncThunk('data/fetchMoviesPage', async (pageNum) => {
    // const pageNum = 2;
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${pageNum}`);
    return {
        results: response.data.results,
        pages: response.data.total_pages
    };
});

export const fetchMovieById = createAsyncThunk('data/fetchMovieById', async (movieId) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    return response.data;
});

export const movieSearch = createAsyncThunk('data/movieSearch', async (word) => {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${word}`);
    return {
        results: response.data.results,
        pages: response.data.total_pages
    };
});
    

// Create a slice
const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
      resetMovies: (state) => {
        state.data = []; // Clears the movie list when needed
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchMData.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchMData.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload.results;
          state.page_count = action.payload.pages
        })
        .addCase(fetchMData.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(movieSearch.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(movieSearch.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.page_count = action.payload.pages
            // Make sure we're completely replacing the data
            state.data = [...action.payload.results]; // Create a new array reference
        })        
        .addCase(movieSearch.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchMoviesPage.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchMoviesPage.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.page_count = action.payload.pages
            state.data = [...action.payload.results]; 
        })        
        .addCase(fetchMoviesPage.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })            
        .addCase(fetchMovieById.fulfilled, (state, action) => {
            state.selectedMovie = action.payload;
        });
    },
});
  
export const { resetMovies, getMovieById} = dataSlice.actions;
export default dataSlice.reducer;