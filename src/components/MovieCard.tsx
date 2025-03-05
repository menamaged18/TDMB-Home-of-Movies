import movieStyle from './movie.module.css'
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date?: string;
  image?: string;
  original_language?: string,
  vote_count?: number,
  vote_average?: number,
}

interface MCProps {
  movie: Movie,
  StaticOrAPI: string
}

function MovieCard({movie, StaticOrAPI}: MCProps) {
  let imageUrl = "";
  if(StaticOrAPI === 'static'){
    imageUrl = `/static-movies/${movie.image}`;
  }else{
    const baseUrl = "https://image.tmdb.org/t/p/";
    const imageSize = "w300"; // Choose the size {original or w500, w300 or any valid number}
    imageUrl = `${baseUrl}${imageSize}${movie.poster_path}`;    
  }

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className={movieStyle.movieContainer}> 
        <img
            src={imageUrl}
            className={movieStyle.Movieimage}
            alt={movie.title}
        />
        <div className={movieStyle.movieDetails}>
            <h3 className={movieStyle.title}>{movie.title}</h3>
            <p className={movieStyle.para}>
                <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p className={movieStyle.para}>
                <strong>Language:</strong> {movie.original_language}
            </p>
            <p className={movieStyle.para}>
                <strong>Vote Average:</strong> {movie.vote_average} ({movie.vote_count} votes)
            </p>
            <p className={movieStyle.para}>
                <strong>Overview:</strong> {movie.overview}
            </p>
        </div>
      </div> 
    </Link>
  )
}


export default MovieCard


