import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// create movie object
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date?: string;
  original_language?: string,
  vote_count?: number,
  vote_average?: number,
  homepage?: string,
}

const initialState: {
  data: Movie[];
  selectedMovie: Movie | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  page_count: number;
  error: string | null;
} = {
  data: [], // This is now explicitly an array of any
  selectedMovie: null,
  status: 'idle',
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

export const fetchMoviesPage = createAsyncThunk<
  { results: Movie[]; pages: number }, 
  number // Argument type (pageNum should be a number)
>('data/fetchMoviesPage', async (pageNum: number) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${pageNum}`);
    return {
        results: response.data.results,
        pages: response.data.total_pages
    };
});

export const fetchMovieById = createAsyncThunk<
Movie, 
  number 
>('data/fetchMovieById', async (movieId: number) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    return response.data;
});

export const movieSearch = createAsyncThunk<
  { results: Movie[]; pages: number }, 
  string // Argument type (word should be a string)
>('data/movieSearch', async (word: string) => {
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
          state.error = action.error.message ?? null;
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
          state.error = action.error.message ?? null;
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
            state.error = action.error.message ?? null;
        })            
        .addCase(fetchMovieById.fulfilled, (state, action) => {
            state.selectedMovie = action.payload;
        });
    },
});
  
export const { resetMovies} = dataSlice.actions;
export default dataSlice.reducer;