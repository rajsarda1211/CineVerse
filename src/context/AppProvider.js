import { useContext, createContext, useEffect, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [movie, setMovie] = useState([]);
    const [isError, setIsError] = useState({ show: 'false', msg: "" });
    const [searchQuery, setSearchQuery] = useState("");

    const apiKey = process.env.REACT_APP_OMDB_API_KEY;

    const getMovies = async (url) => {
        try {
            let allMovies = [];
            let page = 1;
            let totalResults = 0;
            do {
                const res = await fetch(`${url}&page=${page}`);
                const data = await res.json();
                if (data.Response === 'True') {
                    allMovies = [...allMovies, ...data.Search];
                    totalResults = parseInt(data.totalResults);
                    setIsLoading(false);
                    setMovie(allMovies);
                    page++;
                } else {
                    setIsError({ show: 'true', msg: data.error });
                    break;
                }
            } while (allMovies.length < totalResults);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const url = searchQuery
            ? `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}`
            : `https://www.omdbapi.com/?apikey=${apiKey}&s=titanic`;
        getMovies(url);
    }, [searchQuery, apiKey]);

    return (
        <AppContext.Provider value={{ isLoading, movie, setMovie, isError, setSearchQuery }}>
            {children}
        </AppContext.Provider>
    );
}

export const AppState = () => {
    return useContext(AppContext);
}

export default AppProvider;
