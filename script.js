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

  console.log('Current URL:', window.location.href);

  const urlParams = new URLSearchParams(window.location.search);
  const imdbID = urlParams.get('imdbID');
  console.log('Retrieved IMDb ID:', imdbID);

  if(window.location.pathname.endsWith('/movie.html')) {
    if (imdbID) {
      console.log('IMDB ID found:', imdbID);
      fetchMovieDetails(imdbID, displayMovieDetails);
    } else {
      console.error('IMDB ID not found in the query parameter');
    }
  }

  function fetchMovieDetails(imdbID, callback) {
    const apiKey = 'c6ff91ff';
    const apiUrl = 'https://www.omdbapi.com/?i=' + imdbID + '&apikey=' + apiKey;
      $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          callback(data);
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
      
      const movieLink = $('<a>').attr('href', `movie.html?imdbID=${movie.imdbID}`);

      const movieCard = $('<div class="col ms-lg-1 mt-2 movie-card"></div>');

      const posterImg = $('<img class="card-img-top">')
        .attr('src', movie.Poster)
        .attr('alt', movie.Title);

      const titleHeading = $('<h5 class="card-text movie-title"></h5>').text(movie.Title);
      
      movieCard.data('imdbID', movie.imdbID);

      movieCard.click(function () {
        const imdbID = $(this).data('imdbID');
        fetchMovieDetails(imdbID, displayMovieDetails);
        //displayMovieDetails(movie.imdbID);
      });

      movieCard.append(posterImg, titleHeading);
      movieLink.append(movieCard);
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

    $('.add-to-watchlist').data('movie-title', movie.Title);
    $('.add-to-watchlist').data('imdb-id', movie.imdbID);
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

    window.location.href = "watchlist.html?imdbID=" + imdbID;
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

  // Function to get data from local storage
  function getFromLocalStorage(key) {
    let data = localStorage.getItem(key);
    return JSON.parse(data);
  }

  // Function to set data in local storage
  function setInLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function displayWatchlist() {
    const watchlist = getWatchlist();
    const watchlistContainer = $('#watchlist-container');

    watchlistContainer.empty();
    
    if (watchlist.length === 0) {
      watchlistContainer.append('<p>Your watchlist is empty.</p>');
    } else {
      $.each(watchlist, function (index, movie) {
        fetchMovieDetails(movie.imdbID, function (movieDetails) {
          let movieCard = $('<div></div>').addClass('col ms-lg-1 mt-2 movie-card');
          let posterImg = $('<img class="card-img-top">').attr('src', movieDetails.Poster).attr('alt', movie.title);
          const titleHeading = $('<h5 class="card-text movie-title"></h5>').text(movie.title);

          movieCard.append(posterImg, titleHeading);
          watchlistContainer.append(movieCard);
        });
      });
    }
  }

  if(window.location.pathname.endsWith('/watchlist.html')) {
    displayWatchlist();
  }

  fetchMovieData();
});

//js code for filters -- not working yet
// Add event listeners to filter options to trigger filtering
$('#MovieGenre a').click(function () {
  $(this).toggleClass('active');
  filterMovies();
});

$('#MovieYear a').click(function () {
  $(this).toggleClass('active');
  filterMovies();
});

$('#MovieAge-rating a').click(function () {
  $(this).toggleClass('active');
  filterMovies();
});

// Function to filter and display movies based on selected criteria
function filterMovies() {
  // Get selected genre, year, and age rating
  const selectedGenre = $('#MovieGenre a.active').text();
  const selectedYear = $('#MovieYear a.active').text();
  const selectedAgeRating = $('#MovieAge-rating a.active').text();

  // Making API request
  const apiKey = 'c6ff91ff';
  let apiUrl = `https://www.omdbapi.com/?s=movie&type=movie&apikey=${apiKey}&`;

  // Construct the API URL with selected filters
  if (selectedGenre !== 'All') {
    apiUrl += `genre=${selectedGenre}&`;
  }
  if (selectedYear !== 'All') {
    apiUrl += `y=${selectedYear}&`;
  }
  if (selectedAgeRating !== 'All') {
    apiUrl += `rating=${selectedAgeRating}&`;
  }

  $.ajax({
    url: apiUrl,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      displayFilteredMovies(data.Search);
    },
    error: function (error) {
      console.error('Error fetching filtered data:', error);
    },
  });
}

// Function to display filtered movies in placeholders
function displayFilteredMovies(movies) {
  // Clear existing movie placeholders
  $('.col .card').empty();

  // Loop through the filtered movies and populate placeholders
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const card = $('.col .card').eq(i);

    // Set the movie title
    card.find('.card-text').text(movie.Title);

    // Set the movie poster
    const img = card.find('.card-img-top');
    img.attr('src', movie.Poster);
    img.attr('alt', movie.Title);
  }
}

// Initial filtering when the page loads
filterMovies();

