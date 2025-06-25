'use client'

import React, { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import { useTypedDispatch, useTypedSelector  } from '@/reduxStore/rStore/store'; 
import { fetchMovieById } from '../../reduxStore/reducers/movieSlice';
import { FetchSMovieById } from '../../reduxStore/reducers/staticMovies';
import SMS from './staticMoviesStyle.module.css';
import { getFavorites } from "@/reduxStore/reducers/favMovies";
import { Movie } from '@/interfaces/interfaces';
import Header from '@/components/headerComponent/Header';

function Page() {
  const typedDispatch = useTypedDispatch();
  const { apiKeyWorks } = useTypedSelector((state) => state.MoviesData);
  const [data, setData] = useState<Movie[]>([]);

  // Helper function to fetch and collect movie data
  const fetchFavorites = async () => {
    const movieIds = getFavorites();

    const results: Movie[] = [];

    if (apiKeyWorks) {
      for (const id of movieIds) {
        // Fetch the movie data and unwrap the result
        const result = await typedDispatch(fetchMovieById(id)).unwrap();
        results.push(result);
      }     
    }else{
      for (const id of movieIds) {
        // Dispatch getMovieById to fetch movie from static data
        const result = await typedDispatch(FetchSMovieById(id)).unwrap();
        // Use the staticMoviesState from the component level
        results.push(result);
      }
    }

    // console.log(results)
    setData(results);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <>
      <Header />
      <div className={SMS.containerStyle}>
        <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center', gap: '10px', padding:'50px' }}>
          {
            data?.length > 0 ?(
            data.map((movie) => (
              <li key={movie.id} style={{ width: '22vw', boxSizing: 'border-box', listStyle: 'none' }}>
                <MovieCard key={movie.id} movie={movie} StaticOrAPI={apiKeyWorks ? "API" : "static"} />
              </li>    
            ))
            ) : (
              <div>there is no favourite movies</div>
            ) 
          }
        </ul>
      </div>
    </>

  );
}

export default Page;





// 'use client'
// import React, { useState } from 'react';
// import MovieCard from '@/components/MovieCard';
// import { useTypedSelector, useTypedDispatch  } from '@/reduxStore/rStore/store'; 
// import { fetchMovieById } from '../../reduxStore/reducers/movieSlice';
// // import MyPagination from '@/components/pagination/MyPagination'; // not needed for now
// import SMS from './staticMoviesStyle.module.css';
// import { getFavorites } from "@/reduxStore/reducers/favMovies";
// import { useEffect } from 'react';
// import {Movie} from '@/interfaces/interfaces';

// // TODO: do not forget when the api key fails to handle that case

// function page() {
//   const typedDispatch = useTypedDispatch();
//   const { selectedMovie } = useTypedSelector((state) => state.MoviesData);

//   const [data, setData] = useState<Movie[]>([]);


//   // Initial data fetch
//   useEffect(() => {
//     // 1. Get existing movies 
//     const moviesList = getFavorites();
    
//     moviesList.forEach((movie) => {
//       typedDispatch(fetchMovieById(movie));
//       if (selectedMovie) {
//         setData(prevData => [...prevData, selectedMovie]);
//       }
//     });
  
//   }, [typedDispatch]);

//   return (
//     // TODO: make a search to search in favourite movies
//     <div className={SMS.containerStyle}>
//       <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center', gap: '10px', padding:'50px' }}>
//       {
//           data?.length > 0 &&
//           data.map((movie) => {
//               return (
//                 <li key={movie.id} style={{ width: '22vw', boxSizing: 'border-box', listStyle: 'none' }}>
//                   <MovieCard key={movie.id} movie={movie} StaticOrAPI="API" />
//                 </li>    
//               );
//           })
//       }
//       </ul>
//       {/* TODO: if the favourite movies exceeded a certain limit break it into pages but this not needed for now */}
//       {/* <MyPagination page={getPage} currentPage={selectedPage} totalPages={totalPages} /> */}
//     </div>
//   )
// }

// export default page