// create movie object
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date?: string;
  original_language?: string,
  vote_count?: number,
  vote_average?: number,
  homepage?: string,
  image?: string;
}