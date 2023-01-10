import React, {useEffect, useState, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const URL = 'https://swapi.dev/api/films';
function App() {
  const[movies, setMovies] = useState([]);
  const[isLoading,setIsLoading] = useState(false);
  const[ifError,setIfError] = useState();


   //  OLD WAY
    {/*
  const fetchHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(URL)
        .then((res) => {
            return res.json();
        })
        .then(receivedData => {
            // console.log(receivedData.results)
            const updatedData = receivedData.results.map((movie) => {
                return {
                    id: movie.episode_id,
                    title:movie.title,
                    openingText:movie.opening_crawl,
                    releasingDate:movie.release_date
                }
            })
            setMovies(updatedData);
            setIsLoading(false);
        })
  }; */}

   // MODERN WAY
   const modernFetchHandler = useCallback(async() => {
       setIfError(null);
       setIsLoading(true)
       try {
           const response = await fetch(URL);
           const receivedData = await response.json();

           if(!response.ok){
               throw new Error("ERROR IN FETCH!")
           }


           const updatedData = receivedData.results.map((movie) => {
               return {
                   id: movie.episode_id,
                   title: movie.title,
                   openingText: movie.opening_crawl,
                   releasingDate: movie.release_date
               }
           })
           setMovies(updatedData);
       }catch (e){
            setIfError(e.message)
       }finally {
           setIsLoading(false)
       }
   },[])
    useEffect(()=>{
        modernFetchHandler();
    },[modernFetchHandler])

  return (
    <React.Fragment>
      <section>
        <button onClick={modernFetchHandler}>Fetch Movies</button>
      </section>
      <section>
          {!isLoading && movies.length>0 && <MoviesList movies={movies} />}
          {!isLoading && movies.length===0 && <p>NO MOVIE FOUND IN DB !</p>}
          {!isLoading && ifError && <p>{ifError}</p>}
          {isLoading && <p>LOADING</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
