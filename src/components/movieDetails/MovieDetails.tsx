"use client";

import { useEffect, useState } from "react";
import { useTypedSelector, useTypedDispatch  } from '@/reduxStore/rStore/store'; 
import { fetchMovieById } from "@/reduxStore/reducers/movieSlice";
import { getMovieById } from "@/reduxStore/reducers/staticMovies";
import { getFavorites, addMovieToFavorites, removeFromFavorites } from "@/reduxStore/reducers/favMovies";
import pageStyle from './pageStyle.module.css'
import Link from "next/link";
import Header from "../headerComponent/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons'; // Alias for regular star
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { Movie } from "@/interfaces/interfaces";

interface MovieDetailsProps {
    moviesId: string;
    StaticOrAPI: string
}

export default function MovieDetails({moviesId, StaticOrAPI}: MovieDetailsProps ) {
    const mvid = parseInt(moviesId);
    const dispatch = useTypedDispatch();
    // const typedDispatch = useTypedDispatch();
    const { apiKeyWorks } = useTypedSelector((state) => state.MoviesData);
    // console.log(`api key status: ${apiKeyWorks}`);
    const [isFavM, setIsFavM] = useState(false);

    useEffect(() => {
        if (apiKeyWorks) {
            dispatch(fetchMovieById(mvid));
        } else{
            dispatch(getMovieById(mvid));
        }
        // to see if the movie is on the fav list or not
        const favMovies = getFavorites();
        setIsFavM(favMovies.includes(mvid)); 
    }, [dispatch, moviesId]);

    const selectedMovieFromAPI = useTypedSelector((state) => state.MoviesData.selectedMovie);
    const selectedMovieFromStatic = useTypedSelector((state) => state.StaticMovies.selectedMovie);
    const statusFromAPI = useTypedSelector((state) => state.MoviesData.status);
    const statusFromStatic = useTypedSelector((state) => state.StaticMovies.status);

    const movie:Movie|null = apiKeyWorks ? selectedMovieFromAPI : selectedMovieFromStatic;
    const status = apiKeyWorks ? statusFromAPI : statusFromStatic;


    if (status === "loading") return <div>Loading...</div>;
    if (!movie) return <div className={pageStyle.Container}>No movie found or can not display the moive right now </div>;

    let imageUrl = "";
    
    if(StaticOrAPI === 'static'){
        imageUrl = `/static-movies/${movie.image}`;
    } else{
        const baseUrl = "https://image.tmdb.org/t/p/";
        const imageSize = "w300"; // Choose the size {original or w500, w300 or any valid number}
        imageUrl = `${baseUrl}${imageSize}${movie.poster_path}`;  
    }

    const handleFavM = () => {
        if (isFavM) {
            setIsFavM(false);
            removeFromFavorites(mvid);
        }else{
            setIsFavM(true);
            addMovieToFavorites(mvid);
        }
    };

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
                        <p>Language: {movie.original_language ? (movie.original_language) : ("EN") }</p>
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