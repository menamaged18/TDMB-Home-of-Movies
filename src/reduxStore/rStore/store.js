import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../reducers/movieSlice';
import staticMovies from '../reducers/staticMovies';


export const store = configureStore({
  reducer: {
    MoviesData: moviesReducer,
    StaticMovies: staticMovies,
  },
});
