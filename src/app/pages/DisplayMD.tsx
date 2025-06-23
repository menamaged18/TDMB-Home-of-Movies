import { useEffect, useState, useCallback, useRef, ChangeEvent  } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector, useTypedDispatch  } from '@/reduxStore/rStore/store'; 
import { fetchMData, movieSearch, fetchMoviesPage, changeApiStatus } from '../../reduxStore/reducers/movieSlice';
import { getMoviesPage, searchForMovie } from '@/reduxStore/reducers/staticMovies';
import MovieCard from '@/components/MovieCard';
import MyPagination from '@/components/pagination/MyPagination';
import SMS from './staticMoviesStyle.module.css';
import DyM from './DyMovies.module.css';


export default function Home() {
  const dispatch = useDispatch();
  const typedDispatch = useTypedDispatch();
  const { data, status, page_count, error} = useTypedSelector((state) => state.MoviesData);
  const { staticData, totalPages } = useTypedSelector((state) => state.StaticMovies);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const loadingErrorRef = useRef(false); // if there was an error this will be true and then load the static movies
  const [selectedPage, setSelectedPage] = useState(0); // React Paginate starts from 0

  // Initial data fetch
  useEffect(() => {
    if (!isSearching) {
      typedDispatch(fetchMData());
    }
  }, [typedDispatch, isSearching]);

  const getPage = (page: number) =>{
    setSelectedPage(page - 1);
    if (loadingErrorRef.current) {
      dispatch(getMoviesPage(page))
    }else{
      typedDispatch(fetchMoviesPage(page))
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (value:string) => {
      // checking if the displayed movies is the static movies or the movies that comes from the api
      if (loadingErrorRef.current) { // search for the movies that are in the static list
        if (value.trim() === "") {
            dispatch(getMoviesPage(1));
        } else {
            dispatch(searchForMovie(value));
        }          
      }else { // movies from the api
        if (value.trim() === "") {
          setIsSearching(false);
        } else {
          setIsSearching(true);
          typedDispatch(movieSearch(value));
        }        
      }
    },
    [typedDispatch, dispatch]
  );

  // Handle search with debounce
  // Debouncing prevents rapid, excessive API calls when the user types quickly. to reduce the number of api's calls
  useEffect(() => { 
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchValue, debouncedSearch]);

  // Handle input change
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
  };


  // handle if there was an error or the api key has finished
  useEffect(() => {
    if (status === 'failed') {
      loadingErrorRef.current = true;
      // change the api status in redux because i will need that in other components
      dispatch(changeApiStatus());
    }
  }, [status, dispatch]); //must Runs only when `status` changes

  // when the status becames true the loadingErrorRef must return to false meaning there is no error in the state
  useEffect(() => {
    if (status === 'succeeded') {
      loadingErrorRef.current = false;
    }
  }, [status]); //must Runs only when `status` changes

  // if there was an error dispatch the static movies note that static movies will be in the movies array.
  useEffect(() => {
    dispatch(getMoviesPage(selectedPage+1));
  }, [loadingErrorRef.current]); //must Runs only when `loadingErrorRef.current` changes

  return (
    <>
      <div className={DyM.searchContainer}>
        <input
          type="search"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search for movies..."
          className={DyM.searchInput}
        />
      </div>
      
      {status === 'loading' && <div>Loading...</div>}
      
      {/* in case of the api key expired */}
      {status === 'failed' && 
        <div>
          <div style={{display:'flex',justifyContent:'center'}}>
            Error: {error}
          </div>
          <div className={SMS.containerStyle}>
            <h1>Displaying Static Movies list in case of errors or api key finished</h1>
            <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center', gap: '10px', padding:'50px' }}>
            {
                staticData?.length > 0 &&
                staticData.map((movie) => {
                    return (
                      <li key={movie.id} style={{ width: '22vw', boxSizing: 'border-box', listStyle: 'none' }}>
                        <MovieCard key={movie.id} movie={movie} StaticOrAPI="static" />
                      </li>    
                    );
                })
            }
            </ul>
            <MyPagination page={getPage} currentPage={selectedPage} totalPages={totalPages} />
          </div>
        </div>
      }
      
      {status === 'succeeded' && (
        <> 
            <ul className={DyM.DyMoviesContainer}>
            {data && data.length > 0 ? (
                data.map(_movie => (
                <li key={_movie.id} className={DyM.element}>
                    <MovieCard movie={_movie} StaticOrAPI='API'/>
                </li>
                ))
            ) : (
                <div>No movies found</div>
            )}
            </ul>
            <MyPagination page={getPage} currentPage={selectedPage} totalPages={page_count}></MyPagination>
        </>
      )}
    </>
  );
}

