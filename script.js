// Access toggle switch HTML element
let themeSwitcher = document.querySelector("#theme-switcher");
let container = document.querySelector(".container");

// Set default mode to dark
let mode = "dark";

// Listen for a click event on toggle switch
themeSwitcher.addEventListener("click", function () {
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

$(document).ready(function () {
  // Function to fetch movie data from OMDb API
  function fetchMovieData() {
    // Making API request
    const apiKey = "c6ff91ff";
    const apiUrl =
      "https://www.omdbapi.com/?s=movie&type=movie&apikey=" + apiKey;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      success: function (data) {
        displayMovies(data.Search);
      },
      error: function (error) {
        console.error("Error fetching data:", error);
      },
    });
  }

  console.log("Current URL:", window.location.href);

  // Retrieving IMDb ID and search query from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const imdbID = urlParams.get("imdbID");
  const searchQuery = urlParams.get("search");
  console.log("Retrieved IMDb ID:", imdbID);

  if (window.location.pathname.endsWith("/movie.html")) {
    if (imdbID) {
      console.log("IMDB ID found:", imdbID);
      fetchMovieDetails(imdbID, displayMovieDetails);
    } else {
      console.error("IMDB ID not found in the query parameter");
    }
  }

  // Function which fetches movie details from OMDb API
  function fetchMovieDetails(imdbID, callback) {
    const apiKey = "c6ff91ff";
    const apiUrl = "https://www.omdbapi.com/?i=" + imdbID + "&apikey=" + apiKey;
    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      success: function (data) {
        callback(data);
      },
      error: function (error) {
        console.error("Error fetching movie details:", error);
      },
    });
  }

  // Function which displays list of movies on featured movies container
  function displayMovies(movies) {
    const featuredMoviesContainer = $(".featured-movies");
    let row = $('<div class="row"></div>');

    $.each(movies, function (index, movie) {
      if (index % 5 === 0 && index !== 0) {
        featuredMoviesContainer.append(row);
        row = $('<div class="row"></div>');
      }

      const movieLink = $("<a>").attr(
        "href",
        `movie.html?imdbID=${movie.imdbID}`
      );

      const movieCard = $(
        '<div class="col ms-lg-1 mt-2 my-4 movie-card"></div>'
      );

      const posterImg = $('<img class="card-img-top">')
        .attr("src", movie.Poster)
        .attr("alt", movie.Title);

      const titleHeading = $('<h5 class="card-text movie-title"></h5>').text(
        movie.Title
      );

      movieCard.data("imdbID", movie.imdbID);

      movieCard.click(function () {
        const imdbID = $(this).data("imdbID");
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

  // Function which displays movie details to movie.html
  function displayMovieDetails(movie) {
    $("#movie-title").text(movie.Title);
    $("#additional-info").text(`Released: ${movie.Released}`);
    $("#movie-description").text(movie.Plot);

    $("#movie-poster").attr("src", movie.Poster);

    const castList = $("#movie-cast");
    castList.empty();
    movie.Actors.split(",").forEach(function (actor) {
      castList.append(`<li class="list-group-item">${actor.trim()}</li>`);
    });

    $("#imdb-rating").text(`IMDb: ${movie.imdbRating}`);
    $("#rotten-tomatoes-rating").text(
      `Rotten Tomatoes: ${movie.Ratings[1].Value}`
    );

    $(".container").addClass("show-movie-details");

    $("#close-movie-details").click(function () {
      $(".container").removeClass("show-movie-details");
    });

    $(".add-to-watchlist").data("movie-title", movie.Title);
    $(".add-to-watchlist").data("imdb-id", movie.imdbID);
  }

  // Event listener for clicking on movie card
  $(".featured-movies").on("click", ".movie-card", function () {
    const imdbID = $(this).data("imdbID");
    // Redirecting to movie.html
    window.location.href = `movie.html?imdbID=${imdbID}`;
  });

  // Event listener for Watchlist button
  $(".add-to-watchlist").click(function () {
    const movieTitle = $(this).data("movie-title");
    const imdbID = $(this).data("imdb-id");

    const watchlistItem = { title: movieTitle, imdbID: imdbID };
    addToWatchlist(watchlistItem);

    window.location.href = "watchlist.html?imdbID=" + imdbID;
  });

  // Function to add movie to the watchlist and local storage
  function addToWatchlist(movie) {
    const watchlist = getWatchlist();
    watchlist.push(movie);
    setWatchlist(watchlist);
  }

  // Function to get watchlist saved from local storage
  function getWatchlist() {
    let watchlist = getFromLocalStorage("watchlist");
    if (!watchlist) {
      watchlist = [];
    }
    return watchlist;
  }

  // Function to set the watchlist save to the local storage
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

  // Function to display saved watchlist to the watchlist page
  function displayWatchlist() {
    const watchlist = getWatchlist();
    const watchlistContainer = $("#watchlist-container");

    watchlistContainer.empty();

    if (watchlist.length === 0) {
      watchlistContainer.append("<p>Your watchlist is empty.</p>");
    } else {
      $.each(watchlist, function (index, movie) {
        fetchMovieDetails(movie.imdbID, function (movieDetails) {
          let movieCard = $("<div></div>").addClass(
            "col ms-lg-1 mt-2 movie-card"
          );
          let posterImg = $('<img class="card-img-top">')
            .attr("src", movieDetails.Poster)
            .attr("alt", movie.title);
          const titleHeading = $(
            '<h5 class="card-text movie-title"></h5>'
          ).text(movie.title);

          movieCard.append(posterImg, titleHeading);
          watchlistContainer.append(movieCard);
        });
      });
    }
  }

  if (window.location.pathname.endsWith("/watchlist.html")) {
    displayWatchlist();
  }

  // js code for filters -- not working yet
  // Added event listeners to filter options to trigger filtering

  $(".li-year .dropdown-item a").click(function () {
    $(this).toggleClass("active");
    console.log("Year filter clicked.");
    checkAndFilter();
  });

  $(".li-genre .dropdown-item a").click(function () {
    $(this).toggleClass("active");
    console.log("genre filter clicked.");
    checkAndFilter();
  });

  function checkAndFilter() {
    const selectedYear = $(".li-year .dropdown-item a.active").text();
    const selectedGenre = $(".li-genre .dropdown-item a.active").data(
      "genre-id"
    );

    if (!selectedGenre) {
      console.log("no selected Genre");
    } else if (!selectedYear) {
      console.log("no selected Year");
    } else {
      filterMovies(selectedYear, selectedGenre);
      $(".li-year .dropdown-item a.active").removeClass("active");
      $(".li-genre .dropdown-item a.active").removeClass("active");
    }
  }

  // Function to filter and display movies based on selected criteria
  function filterMovies(year, genre) {
    // Making API request
    let apiUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc&`;

    if (year && year !== "All") {
      apiUrl += `primary_release_year=${year}&`;
    }
    if (genre && genre !== "All") {
      apiUrl += `with_genres=${genre}&`;
    }

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmFkMzA3M2Y2NWFiZWJmMDIzYzgyZDlhZjJmODVmYSIsInN1YiI6IjY1MTZhNTE5OTNiZDY5MDBlMTJkMGI3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CcdRQfD-O4bZLh37OG0nLNQPg9Hnx_deAt3Oj1U9-LI",
      },
    };

    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((response) => displayFilteredMovies(response))
      .catch((err) => console.error(err));
  }

  // Function to display filtered movies in placeholders
  function displayFilteredMovies(movies) {
    const IMG_URL = "https://image.tmdb.org/t/p/w500";
    console.log("Displaying filtered movies:", movies);
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = "";
    // Loop through the filtered movies and populate placeholders
    for (let i = 0; i < movies.results.length; i++) {
      const movie = movies.results[i];

      const movieElement = document.createElement("div");
      movieElement.classList.add("col-md-3");
      movieElement.innerHTML = `
          <div class="card">
              <img src="${
                movie.poster_path
                  ? IMG_URL + movie.poster_path
                  : "http://via.placeholder.com/1080x1580"
              }" class="card-img-top" alt="${movie.title}" />
              <div class="card-body">
                  <h5 class="card-text">${movie.title}</h5>
              </div>
          </div>
      `;

      // Append the movie element to the movie container
      movieContainer.appendChild(movieElement);
    }
  }

  // Function to display the search results in the modal
  function displaySearchResultsModal(results) {
    const searchResultsModal = $("#searchResultsModal");
    const modalBody = searchResultsModal.find(".modal-body");
    modalBody.empty();

    // Looping through results and creating links for each movie title
    results.forEach(function (movie) {
      const movieLink = $("<a>")
        .attr("href", `movie.html?imdbID=${movie.imdbID}`)
        .addClass("btn btn-link")
        .text(movie.Title)
        .on("click", function () {
          // Handling the search result to be redirected
          window.location.href = $(this).attr("href");
        });

      modalBody.append(movieLink);
    });

    // Showing the modal
    searchResultsModal.modal("show");
  }

  // Function which handles movie search
  function searchMovies(query) {
    const apiKey = "c6ff91ff";
    const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(
      query
    )}&type=movie&apikey=${apiKey}`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      success: function (data) {
        // Checking if movies are found
        if (data.Response === "True") {
          displaySearchResultsModal(data.Search);
        } else {
          // Displaying message indicating that no movies were found
          console.log("No movies found.");
        }
      },
      error: function (error) {
        console.error("Error fetching data:", error);
      },
    });
  }

  function displaySearchResults(results) {
    // Clearing previous search results
    $("#search-form").empty();

    // Looping through results and displaying
    results.forEach(function (movie) {
      const movieLink = $("<a>").attr(
        "href",
        `movie.html?imdbID=${movie.imdbID}`
      );
      const title = $("<h2>").text(movie.Title);
      // Adding other movie details as needed
      movieLink.append(title);
      $("#search-form").append(movieLink);
    });
  }

  // Adding event listener to the search form
  $("#search-form").submit(function (e) {
    e.preventDefault();
    console.log("Search form submitted.");
    const searchQuery = $("#search-input").val();

    if (searchQuery) {
      searchMovies(searchQuery);
    }
  });

  // Initial filtering when the page loads
  filterMovies("All", "All");
  fetchMovieData();

  // TMDB API FETCH REQUEST
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmFkMzA3M2Y2NWFiZWJmMDIzYzgyZDlhZjJmODVmYSIsInN1YiI6IjY1MTZhNTE5OTNiZDY5MDBlMTJkMGI3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CcdRQfD-O4bZLh37OG0nLNQPg9Hnx_deAt3Oj1U9-LI",
    },
  };

  fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc&with_genres=%2C",
    options
  )
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
});
