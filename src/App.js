import React, {useEffect, useState, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from "./components/AddMovie";
import movie from "./components/Movie";

// const URL = 'https://swapi.dev/api/films';
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
           const response = await fetch('https://react-http-realtime-db-json-default-rtdb.firebaseio.com/movies.json');
           const receivedData = await response.json();

           const firebaseFetchedMovies = [];
           if(!response.ok){
               throw new Error("ERROR IN FETCH!")
           }else{
               // console.log(receivedData)
               for (const key in receivedData) {
                   firebaseFetchedMovies.push({
                       id:key,
                       title:receivedData[key].title,
                       openingText:receivedData[key].openingText,
                       releasingDate:receivedData[key].releasingDate,
                   })
               }
                setMovies(firebaseFetchedMovies)
           }


           // const updatedData = receivedData.results.map((movie) => {
           //     return {
           //         id: movie.episode_id,
           //         title: movie.title,
           //         openingText: movie.opening_crawl,
           //         releasingDate: movie.release_date
           //     }
           // })
           // setMovies(updatedData);
       }catch (e){
            setIfError(e.message)
       }finally {
           setIsLoading(false)
       }
   },[])

    const addMovieHandler = async(movie) => {
        console.log(movie)
        try{
            const response = await fetch('https://react-http-realtime-db-json-default-rtdb.firebaseio.com/movies.json',{
                method: 'POST',
                body: JSON.stringify(movie),
                headers:{
                    'Content-Type': 'application/json'
                }
            })

            if(!response.ok){
                throw new Error('Dikkat hai bhai kuch!');
            }else{
                console.log("200");
            }
        }catch (e){
            console.log(e.message)
        }



    }
    useEffect(()=>{
        modernFetchHandler();
    },[modernFetchHandler])

  return (
    <React.Fragment>
        <section>
            <AddMovie onAddMovie={addMovieHandler}/>
        </section>
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
