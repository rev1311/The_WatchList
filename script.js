// This allows the chroma.js to change the background
document.addEventListener("DOMContentLoaded", function(event) {
  document.body.style.backgroundColor = chroma.random().luminance(0.6);
});

// checks local storage to see if we have a movielist. if so, grab it, if not, make blank array
if (!localStorage.getItem("movies")) {
  var movies = [];
} else {
  var movies = JSON.parse(localStorage.getItem("movies"));
}
console.log(movies);
renderMovieList();

// when search button is clicked
$(document).on("click", "#searchButton", function() {
  event.preventDefault();

  // get movie name
  var currentMovie = $("#searchBar").val();

  // make url
  var queryURL =
    "https://www.omdbapi.com/?t=" + currentMovie + "&plot=short&apikey=trilogy";
  console.log(queryURL);

  // make call for info
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // console.log(response);

    // take call info, run into a function to display result of search
    createResult(response);
    showPlaces(response);
  });

  // new api, trying to find sources
  var queryURL =
    "https://api-public.guidebox.com/v2/search?type=movie&field=title&query=" +
    currentMovie +
    "&api_key=fa7b0389753402bfb19845b4de1ce69238f02335&sources=subscription,amazon_prime";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });
});

//funciton to show places to watch (amazon only)
function showPlaces(response) {
  var currentMovie = response.Title;
  var settings = {
    async: true,
    crossDomain: true,
    url:
      "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" +
      currentMovie +
      "&country=us",
    method: "GET",
    headers: {
      "x-rapidapi-host":
        "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
      "x-rapidapi-key": "9c0e05861cmshf463bbbdb056e61p1fb6bdjsn941199c3544b"
    }
  };
  $.ajax(settings).done(function(response) {
    console.log(response);

    if (response.results[0].name == currentMovie) {
      var div = $("<div>");
      var btnPlaces = $("<button>");
      btnPlaces.addClass("placeButton button is-success level");

      btnPlaces.text(
        "Available on: " + response.results[0].locations[0].display_name
      );
      btnPlaces.attr("value", response.results[0].locations[0].url);

      div.append(btnPlaces);
      $("#results").append(div);
    }
  });
}

$(document).on("click", ".placeButton", function() {
  location.href = $(this).val();
});

// FUNCTION creastes search result
function createResult(response) {
  // empty the space
  $("#results").empty();

  // make new elements
  var div = $("<div>");
  var img = $("<img>");
  var text = $("<p>");
  var btnAdd = $("<button>");

  // give elements attr
  text.text(response.Title);
  img.attr("src", response.Poster);
  btnAdd.text("Add");
  btnAdd.addClass("addButton button is-success level");
  btnAdd.attr("value", response.Title);

  // prepend elements to page
  div.prepend(text);
  div.prepend(img);
  div.append(btnAdd);
  $("#results").prepend(div);
}

// when you click add
$(document).on("click", ".addButton", function() {
  event.preventDefault();

  // defining movie name
  var movie = $(this).val();
  // double checks if movie already exists in movies array
  if (movies.indexOf(movie) == -1) {
    movies.push(movie);

    // re-render the list
    renderMovieList();
    // save list to local storage
    saveList();
  }
  // if the movie already exists, alert
  else {
    alert("you already have this movie added");
  }
});

// FUNCTION CREATES movie list
function renderMovieList() {
  $("#td").empty();

  for (var i = 0; i < movies.length; i++) {
    var row = $("<tr>");
    var col = $("<td>");

    col.text(movies[i]);
    row.addClass("movieButton");
    // row.attr("value", movies[i]);
    row.data("value", movies[i]);

    row.prepend(col);
    $("#td").prepend(row);
    console.log(i);
  }
}

// FUNCTION when you click on a movie in your list
$(document).on("click", ".movieButton", function() {
  $("#results").empty();
  currentMovie = $(this).data("value");
  console.log(currentMovie);

  // research
  var queryURL =
    "https://www.omdbapi.com/?t=" + currentMovie + "&plot=short&apikey=trilogy";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // create results display
    createResult(response);
    // create delete button
    createDeleteButton(response);
  });
});

// FUNCTION creates a delete button
function createDeleteButton(response) {
  var movie = response.Title;
  var div = $("<div>");
  var btnMovie = $("<button>");

  btnMovie.text("delete from list");
  btnMovie.addClass("deleteButton  button is-danger level");
  btnMovie.attr("value", movie);
  div.prepend(btnMovie);
  $("#results").append(div);
}

// FUNCTION delete the movie
$(document).on("click", ".deleteButton", function() {
  // movies.remove($(this).val());
  movies.splice(movies.indexOf($(this).val()), 1);
  renderMovieList();
  saveList();
  console.log(movies);
});

// sort alphabetical
function sortAlphabetical(arr) {
  var newMovies = arr.sort();
}

function sortByGenre(arr) {}

// saves to local storage
function saveList() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

// clears list
$(document).on("click", "#clearList", function() {
  localStorage.clear();
  movies = [];
  renderMovieList();
});
