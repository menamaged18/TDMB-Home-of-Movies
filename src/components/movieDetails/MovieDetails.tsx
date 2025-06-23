"use client";

import { useEffect, useState } from "react";
import { useTypedSelector, useTypedDispatch  } from '@/reduxStore/rStore/store'; 
import { fetchMovieById } from "@/reduxStore/reducers/movieSlice";
import { getFavorites } from "@/reduxStore/reducers/favMovies";
import pageStyle from './pageStyle.module.css'
import Link from "next/link";
import Header from "../headerComponent/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons'; // Alias for regular star
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';

interface MovieDetailsProps {
    moviesId: string;
}

export default function MovieDetails({moviesId}: MovieDetailsProps ) {
    const mvid = parseInt(moviesId);
    const dispatch = useTypedDispatch();
    const [isFavM, setIsFavM] = useState(false);

    const addMovieToFavorites = (movieId: number) => {
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
    const removeFromFavorites = (id: number) => {
        const favMovies = getFavorites();
        const updated = favMovies.filter(movieId => movieId !== id);
        sessionStorage.setItem('FavMovies', JSON.stringify(updated));
    };

    useEffect(() => {
        dispatch(fetchMovieById(mvid));
        // to see if the movie is on the fav list or not
        const favMovies = getFavorites();
        setIsFavM(favMovies.includes(mvid)); 
    }, [dispatch, moviesId]);

    const movie = useTypedSelector((state) => state.MoviesData.selectedMovie);
    const status = useTypedSelector((state) => state.MoviesData.status);

    if (status === "loading") return <div>Loading...</div>;
    if (!movie) return <div className={pageStyle.Container}>No movie found or can not display the moive right now </div>;

    const baseUrl = "https://image.tmdb.org/t/p/";
    const imageSize = "w500"; // Choosing the size {original or w500, w300 or any valid number}
    const imageUrl = `${baseUrl}${imageSize}${movie.poster_path}`;

    const handleFavM = () => {
        if (isFavM) {
            setIsFavM(false);
            removeFromFavorites(mvid);
        }else{
            setIsFavM(true);
            addMovieToFavorites(mvid);
        }
    };

    // console.log(movie)

    return (
        <>
            <Header />
            <div className={pageStyle.Container}>  

                <div className={pageStyle.details}>
                    <div className={pageStyle.imgContainer}>
                        <img src={imageUrl} alt={movie.title} className={pageStyle.movieImgDetails}/>
                    </div>
                    <div className={pageStyle.detailsContainer}>
                        <h1>Title: {movie.title}</h1>
                        <p>Language: {movie.original_language}</p>
                        <p>Release Date: {movie.release_date}</p>
                        <p>Vote Count: {movie.vote_count}</p>
                        <p>Vote Average: {movie.vote_average}</p>                                
                    </div>
                </div>
                <div className={`${pageStyle.details} ${pageStyle.overview}`}>
                    <h1 className={pageStyle.overviewHeader}>Overview:</h1>
                    <p>{movie.overview} </p>
                    <div className={pageStyle.buttons}>
                        <Link href={'../'}>
                            <button type="button" className="btn btn-primary">Home page</button>
                        </Link>   
                        <a href={movie.homepage}>
                        <button type="button" className="btn btn-primary">Watch Link</button>
                        </a>
                        <button type="button" className="btn btn-primary" onClick={handleFavM} 
                            title={isFavM ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavM ? (
                                <FontAwesomeIcon icon={faSolidStar} />
                            ) : (
                                <FontAwesomeIcon icon={faRegularStar} />
                            )}
                        </button>                    
                    </div>

                </div>   
            </div>        
        </>

    );
}