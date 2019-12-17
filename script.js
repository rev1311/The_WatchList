// This allows the chroma.js to change the background~~~~~~~~~~~~~~~~~~~~~~~~~~
document.addEventListener("DOMContentLoaded", function(event) {
  document.body.style.backgroundColor = chroma.random().luminance(0.6);
});

// checks local storage to see if we have a movielist. if so, grab it, if not, make blank array ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
if (!localStorage.getItem("movies")) {
  var movies = [];
} else {
  var movies = JSON.parse(localStorage.getItem("movies"));
}
renderMovieList();

// when search button is clicked ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).on("click", "#searchButton", function() {
  event.preventDefault();
  turnMapsOff();

  // get movie name
  var currentMovie = $("#searchBar").val();

  // new api, movie info
  var queryURL =
    "https://api-public.guidebox.com/v2/search?type=movie&field=title&query=" +
    currentMovie +
    "&api_key=fa7b0389753402bfb19845b4de1ce69238f02335";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var currentMovieID = response.results[0].id;

    var queryURL =
      "http://api-public.guidebox.com/v2/movies/" +
      currentMovieID +
      "?api_key=fa7b0389753402bfb19845b4de1ce69238f02335";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      createResult(response);
      showPlaces(response);
      if (response.in_theaters) {
        inTheaters();
        turnMapsOn();
      }
    });
  });
});

// finds theaters~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function inTheaters() {
  var div = $("<div>");
  var btnTheaters = $("<button>");
  btnTheaters.text("In Theaters Near You");
  div.append(btnTheaters);
  $("#results").append(div);
}

function turnMapsOn() {
  console.log("heyyyy");
  $("#maps").removeClass("displayOff");
  $("#maps").addClass("displayOn");
}

function turnMapsOff() {
  $("#maps").removeClass("displayOn");
  $("#maps").addClass("displayOff");
}

// finds places to watch~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function showPlaces(response) {
  var currentMovie = response.original_title;
  var currentMovieID = response.id;

  var queryURL =
    "http://api-public.guidebox.com/v2/movies/" +
    currentMovieID +
    "?api_key=fa7b0389753402bfb19845b4de1ce69238f02335";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    for (var i = 0; i < response.subscription_web_sources.length; i++) {
      var div = $("<div>");
      var btnPlaces = $("<button>");
      btnPlaces.addClass("placeButton button is-success level");

      btnPlaces.text(
        "Available on: " + response.subscription_web_sources[i].display_name
      );
      btnPlaces.attr("value", response.subscription_web_sources[i].link);

      div.append(btnPlaces);
      $("#results").append(div);
    }
    for (var i = 0; i < response.purchase_web_sources.length; i++) {
      var div = $("<div>");
      var btnPlaces = $("<button>");
      btnPlaces.addClass("placeButton button is-success level");

      btnPlaces.text(
        "Available for purchase at: " +
          response.purchase_web_sources[i].display_name
      );
      btnPlaces.attr("value", response.purchase_web_sources[i].link);

      div.append(btnPlaces);
      $("#results").append(div);
    }
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).on("click", ".placeButton", function() {
  location.href = $(this).val();
});

// FUNCTION creastes search result~~~~~~~~~~~~~~~~~~~~~~~~~`~~~~~~~~~
function createResult(response) {
  // empty the space
  $("#results").empty();

  // make new elements
  var div = $("<div>");
  var img = $("<img>");
  var text = $("<p>");
  var btnAdd = $("<button>");

  // give elements attr
  text.addClass("hero is-grey-lighter title is-medium");
  text.text(response.original_title);
  img.attr("src", response.poster_400x570);
  btnAdd.text("Add");
  btnAdd.addClass("addButton button is-success level");
  btnAdd.attr("value", response.original_title);

  // prepend elements to page
  div.prepend(text);
  div.prepend(img);
  div.append(btnAdd);
  $("#results").prepend(div);
}

// when you click add ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`~~~~~~~~~~~~~~~~~~~~~~~
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
    var div = $("<div>");
    var bt = $("<button>");
    div.addClass("notification is-warning");
    bt.addClass("delete");
    div.append(
      "<strong>Warning!</strong>,You already have this movie in your list."
    );
    div.append(bt);
    $("#alertbox").append(div);
    bt.on("click", function() {
      div.empty();
      div.removeClass("notification is-warning");
    });
  }
});

// FUNCTION CREATES movie list ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function renderMovieList() {
  $("#td").empty();

  for (var i = 0; i < movies.length; i++) {
    var row = $("<tr>");
    var col = $("<td>");

    col.text(movies[i]);
    row.addClass("movieButton");
    // row.attr("value", movies[i]);
    row.data("value", movies[i]);
    col.addClass("has-text-centered has-text-weight-bold");
    row.prepend(col);
    $("#td").prepend(row);
  }
}

// FUNCTION when you click on a movie in your list~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).on("click", ".movieButton", function() {
  turnMapsOff();
  $("#results").empty();
  currentMovie = $(this).data("value");

  var queryURL =
    "https://api-public.guidebox.com/v2/search?type=movie&field=title&query=" +
    currentMovie +
    "&api_key=fa7b0389753402bfb19845b4de1ce69238f02335";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var currentMovieID = response.results[0].id;

    var queryURL =
      "http://api-public.guidebox.com/v2/movies/" +
      currentMovieID +
      "?api_key=fa7b0389753402bfb19845b4de1ce69238f02335";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      createResult(response);
      showPlaces(response);
      createDeleteButton(response);
      if (response.in_theaters) {
        inTheaters();
        turnMapsOn();
      }
    });
  });
});

// FUNCTION creates a delete button~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createDeleteButton(response) {
  var movie = response.original_title;
  var div = $("<div>");
  var btnMovie = $("<button>");

  btnMovie.text("delete from list");
  btnMovie.addClass("deleteButton  button is-danger level");
  btnMovie.attr("value", movie);
  div.prepend(btnMovie);
  $("#results").append(div);
}

// FUNCTION delete the movie~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).on("click", ".deleteButton", function() {
  // movies.remove($(this).val());
  movies.splice(movies.indexOf($(this).val()), 1);
  renderMovieList();
  saveList();
});

// sort alphabetical~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
function sortAlphabetical(arr) {
  var newMovies = arr.sort();
}

function sortByGenre(arr) {}

// saves to local storage~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function saveList() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

// clears list~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).on("click", "#clearList", function() {
  localStorage.clear();
  movies = [];
  renderMovieList();
});
