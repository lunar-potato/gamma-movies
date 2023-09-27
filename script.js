// Access toggle switch HTML element
let  themeSwitcher = document.querySelector("#theme-switcher");
let container = document.querySelector(".container");

// Set default mode to dark
let mode = "dark";

// Listen for a click event on toggle switch
themeSwitcher.addEventListener("click", function() {
  // If mode is dark, apply light background
  if (mode === "dark") {
    mode = "light";
    container.setAttribute("class", "light");
  }
  // If mode is light, apply dark background 
  else {
    mode = "dark";
    container.setAttribute("class", "dark");
  }
});

$(document).ready(function() {
  // Function to fetch movie data from OMDb API
  function fetchMovieData() {
    // Making API request
    const apiKey = 'c6ff91ff';
    const apiUrl = 'https://www.omdbapi.com/?s=movie&type=movie&apikey=' + apiKey;

    $.ajax({
      url: apiUrl,
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        displayMovies(data.Search);
      },
      error: function(error) {
        console.error('Error fetching data:', error);
      }
    }); 
  }

  const urlParams = new URLSearchParams(window.location.search);
  const imdbID = urlParams.get('imdbID');

  if (imdbID) {
    fetchMovieDetails(imdbID);
  } else {
    console.error('IMDB ID not found in the query parameter');
  }

  function fetchMovieDetails(imdbID) {
    const apiKey = 'c6ff91ff';
    const apiUrl = 'https://www.omdbapi.com/?i=' + imdbID + '&apikey=' + apiKey;
      $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          displayMovieDetails(data);
        },
        error: function(error) {
          console.error('Error fetching movie details:', error);
        }
      });
  }

  function displayMovies(movies) {
    const featuredMoviesContainer = $('.featured-movies');
    let row = $('<div class="row"></div>');

    $.each(movies, function (index, movie) {
      if (index % 5 === 0 && index !== 0) {
        featuredMoviesContainer.append(row);
        row = $('<div class="row"></div>');
      }
      
      const movieCard = $('<div class="col ms-lg-1 mt-2 movie-card"></div>');

      const posterImg = $('<img class="card-img-top">')
        .attr('src', movie.Poster)
        .attr('alt', movie.Title);

      const titleHeading = $('<h5 class="card-text movie-title"></h5>').text(movie.Title);
      
      movieCard.data('imdbID', movie.imdbID);

      movieCard.click(function () {
        const imdbID = $(this).data('imdbID');
        fetchMovieDetails(imdbID);
    
        displayMovieDetails(movie.imdbID);
      });

      movieCard.append(posterImg, titleHeading);
      featuredMoviesContainer.append(movieCard);
    });

    if (row.children().length > 0) {
      featuredMoviesContainer.append(row);
    }
  }

  function displayMovieDetails(movie) {
    $('#movie-title').text(movie.Title);
    $('#additional-info').text(`Released: ${movie.Released}`);
    $('#movie-description').text(movie.Plot);

    $('#movie-poster').attr('src', movie.Poster);

    const castList = $('#movie-cast');
    castList.empty();
    movie.Actors.split(',').forEach(function (actor) {
      castList.append(`<li class="list-group-item">${actor.trim()}</li>`);
    });

    $('#imdb-rating').text(`IMDb: ${movie.imdbRating}`);
    $('#rotten-tomatoes-rating').text(`Rotten Tomatoes: ${movie.Ratings[1].Value}`);

    $('.container').addClass('show-movie-details');

    $('#close-movie-details').click(function () {
      $('.container').removeClass('show-movie-details');
    });
  }

  $('.featured-movies').on('click', '.movie-card', function() {
    const imdbID = $(this).data('imdbID');
    // Redirecting to movie.html
    window.location.href = `movie.html?imdbID=${imdbID}`;
  });

  // Event listener for Watchlist
  $(".add-to-watchlist").click(function() {
    const movieTitle = $(this).data("movie-title");
    const imdbID = $(this).data("imdb-id");

    const watchlistItem = { title: movieTitle, imdbID: imdbID};
    addToWatchlist(watchlistItem);

    window.location.href = "watchlist.html";
  })

  // Function to add movie to the watchlist and local storage
  function addToWatchlist(movie) {
    const watchlist = getWatchlist();
    watchlist.push(movie);
    setWatchlist(watchlist);
  }

  function getWatchlist() {
    let watchlist = getFromLocalStorage("watchlist");
    if (!watchlist) {
      watchlist = [];
    }
    return watchlist;
  }

  function setWatchlist(watchlist) {
    setInLocalStorage("watchlist", watchlist);
  }
  // Function to create a list item with movie details

  // Function to get data from local storage
  function getFromLocalStorage(key) {
    let data = localStorage.getItem(key);
    return JSON.parse(data);
  }

  // Function to set data in local storage
  function setInLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  fetchMovieData();
});