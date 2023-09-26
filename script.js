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
    
      movieCard.click(function () {
        showMovieDetails(movie.imdbID);
      });

      movieCard.append(posterImg, titleHeading);
      featuredMoviesContainer.append(movieCard);
    });
  }

  // // Event listener for Watchlist

  // // Function to add movie to the watchlist and local storage

  // // Function to create a list item with movie details

  // // Function to get data from local storage
  // function getFromLocalStorage(key) {
  //   let data = localStorage.getItem(key);
  //   return JSON.parse(data);
  // }

  // // Function to set data in local storage
  // function setInLocalStorage(key, value) {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }

  fetchMovieData();
});