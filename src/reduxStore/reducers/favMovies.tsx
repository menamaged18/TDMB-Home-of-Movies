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