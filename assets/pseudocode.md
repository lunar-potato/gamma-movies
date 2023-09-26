# JavaScript Pseudocode
-> When document is ready
    - Function to fetch movie data from OMDb API
    Function fetchMovieData(movieId):
        - Make API request to OMDb using movie Id
        movieData = CallAPI('https://www.omdbapi.com/?i=' + movieId + '&apikey=YOUR_API_KEY')
    
        - Update HTML content with fetched data
        UpdateHTML('#movie-title', movieData.Title)
        UpdateHTML('#movie-description', movieData.Plot)
        UpdateHTML('#additional-info', 'Released: ' + movieData.Released + ', Runtime: ' + movieData.Runtime)

        - Update IMDb and Rotten Tomatoes ratings
        UpdateHTML('#imdb-rating', 'IMDb: ' + movieData.imdbRating + '/10')
        UpdateHTML('#rotten-tomatoes-rating', 'Rotten Tomatoes: ' + movieData.Ratings[1].Value)

        - Updating cast members dynamically 
        castList = movieData.Actors.split
        Clearing existing cast list
        For each actor in castList
            Appending

    Event listener for the Add to Watchlist button
    OnButtonClick Function
        movieId = Your Movie ID

        Fetching movide data
        movieData = 

        Adding movie to the watchlist page and local storage
        AddToWatchlistPage(movieData)

    Function to add movie to the watchlist page and local storage
    Function AddToWatchlistPage(movieData)
        Creating a new list item with movie details

        Appending the list item to the watchlist

        Getting the current watchlist from local storage 

        Adding the movie data to the watchlist array

        Saving the updated watchlist back to local storage

    Function to create a list item with movie details
    
    Function to get data from local storage
        returning parsejson (if necessary)

    Function to set data in local storage
        stringify if needed



