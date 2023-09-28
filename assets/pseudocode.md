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

## Filters

    Define variables
        let apiFetchedMovies = []; // Store the fetched movie data

    Define filter functions
        function filterByGenre(movies, genre) 
            Filter movies by genre and return the filtered list

    function filterByYear(movies, year) 
        Filter movies by year and return the filtered list


    function filterByAgeRating(movies, ageRating) 
        Filter movies by age rating and return the filtered list

    function renderMovies(movies) 
        Clear existing movie cards on the webpage
        Clear movieContainer element
  
    go through movies and create new movie cards
        For each movie in movies:
            Create a new movie card element
            Set the movie card's properties like title, image, etc.
            Append the movie card to the movieContainer element


    Event listener for genre filter dropdown
        On 'change' event of genre filter dropdown:
            Get the selected genre
            Call filterByGenre(apiFetchedMovies, selectedGenre)
            Call renderMovies(filteredMovies)

    Event listener for year filter dropdown
        On 'change' event of year filter dropdown:
            Get the selected year
            Call filterByYear(apiFetchedMovies, selectedYear)
            Call renderMovies(filteredMovies)

    Event listener for age rating filter dropdown
        On 'change' event of age rating filter dropdown:
            Get the selected age rating
            Call filterByAgeRating(apiFetchedMovies, selectedAgeRating)
            Call renderMovies(filteredMovies)

    Fetch data from the OMDB API
        Fetch data from OMDB API using your API key
        Store the fetched movie data in the apiFetchedMovies variable

    Initial display of all movies
    Call renderMovies(apiFetchedMovies)
