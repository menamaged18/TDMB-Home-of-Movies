// Get current favorites from sessionStorage
export const getFavorites = (): number[] => {
    try {
      const stored = sessionStorage.getItem('FavMovies');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
};

export const addMovieToFavorites = (movieId: number) => {
    try {
        // 1. Get existing movies 
        const moviesList = getFavorites();

        // 2. Check if movieId is already in the list 
        if (!moviesList.includes(movieId)) {
        // 3. Add the new movieId
        const updatedMovies = [...moviesList, movieId];
        
        // 4. Save back to sessionStorage
        sessionStorage.setItem('FavMovies', JSON.stringify(updatedMovies));
        console.log('Added to favorites:', movieId);
        } else {
        console.log('Movie already in favorites');
        }
    } catch (error) {
        console.error('Error updating favorites:', error);
    }
};

// Remove movie from favorites
export const removeFromFavorites = (id: number) => {
    const favMovies = getFavorites();
    const updated = favMovies.filter(movieId => movieId !== id);
    sessionStorage.setItem('FavMovies', JSON.stringify(updated));
};