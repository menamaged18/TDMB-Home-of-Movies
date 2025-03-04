"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieById } from "@/reduxStore/reducers/movieSlice";
import pageStyle from './pageStyle.module.css'
import Link from "next/link";
import Header from "../headerComponent/Header";

interface MovieDetailsProps {
    moviesId: string;
}

export default function MovieDetails({moviesId}: MovieDetailsProps ) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMovieById(moviesId)); 
    }, [dispatch, moviesId]);

    const movie = useSelector((state) => state.MoviesData.selectedMovie);
    const status = useSelector((state) => state.MoviesData.status);

    if (status === "loading") return <div>Loading...</div>;
    if (!movie) return <div className={pageStyle.Container}>No movie found or can not display the moive right now </div>;

    const baseUrl = "https://image.tmdb.org/t/p/";
    const imageSize = "w500"; // Choose the size {original or w500, w300 or any valid number}
    const imageUrl = `${baseUrl}${imageSize}${movie.poster_path}`;

    console.log(movie)

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
                    </div>

                </div>   
            </div>        
        </>

    );
}