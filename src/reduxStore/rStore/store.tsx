import { configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import MoviesDataReducer from '../reducers/movieSlice'; 
import StaticMoviesReducer from '../reducers/staticMovies'; 

export const store = configureStore({
  reducer: {
    MoviesData: MoviesDataReducer,
    StaticMovies: StaticMoviesReducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Create typed hooks
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedDispatch: () => AppDispatch = useDispatch;


