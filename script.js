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

// render list on refresh
renderMovieList();

// when search button is clicked ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).on("click", "#searchButton", function() {
  event.preventDefault();
  turnMapsOff();
  $("#alertbox").empty();

  // get movie name
  var currentMovie = $("#searchBar").val();

  // new api, movie info
  var queryURL =
    "https://api-public.guidebox.com/v2/search?type=movie&field=title&query=" +
    currentMovie +
    "&api_key=423737429793de8dc8210f09410b7509920f90d7";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    if (response.results.length == 0) {
      var div = $("<div>");
      var bt = $("<button>");
      div.addClass("notification is-warning");
      bt.addClass("delete");
      div.append("<strong>Warning!</strong> please enter a valid movie title.");
      div.append(bt);
      $("#alertbox").append(div);
      bt.on("click", function() {
        div.empty();
        div.removeClass("notification is-warning");
      });
    }
    var currentMovieID = response.results[0].id;

    var queryURL =
      "https://api-public.guidebox.com/v2/movies/" +
      currentMovieID +
      "?api_key=423737429793de8dc8210f09410b7509920f90d7";
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
  var btnTheaters = $("<p>");
  btnTheaters.text("In Theaters Near You!");
  btnTheaters.css("margin-top", "+=20px");
  btnTheaters.css("font-size", "22px");

  div.append(btnTheaters);
  $("#results").append(div);
}

// turns maps on~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function turnMapsOn() {
  $("#maps").removeClass("displayOff");
  $("#maps").addClass("displayOn");
}

// turns maps off~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
function turnMapsOff() {
  $("#maps").removeClass("displayOn");
  $("#maps").addClass("displayOff");
}

// finds places to watch~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function showPlaces(response) {
  var currentMovie = response.original_title;
  var currentMovieID = response.id;

  var queryURL =
    "https://api-public.guidebox.com/v2/movies/" +
    currentMovieID +
    "?api_key=423737429793de8dc8210f09410b7509920f90d7";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    for (var i = 0; i < response.subscription_web_sources.length; i++) {
      var div = $("<div>");
      var btnPlaces = $("<button>");
      btnPlaces.addClass("placeButton button is-prime level");

      btnPlaces.css("margin-top", "+=10px");

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
      btnPlaces.addClass("placeButton button is-prime level");

      btnPlaces.css("margin-top", "+=10px");

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

// takes you to new site~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
  var textTitle = $("<p>");
  var textDescription = $("<p>");
  var btnAdd = $("<button>");

  // give elements attr
  textDescription.text(response.overview);
  textDescription.css("margin-bottom", "+=10px");

  textTitle.addClass("hero is-grey-lighter title is-medium");
  textTitle.css("margin-bottom", "+=10px");
  textTitle.css("margin-top", "+=10px");

  textTitle.text(response.original_title);
  img.attr("src", response.poster_400x570);
  btnAdd.text("Add to My Watch List");
  btnAdd.css("margin-top", "+=10px");

  btnAdd.addClass("addButton button is-success level");
  btnAdd.attr("value", response.original_title);

  // prepend elements to page
  div.prepend(textDescription);
  div.prepend(textTitle);
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
      "<strong>Warning!</strong>,You already have this movie My list."
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
  $("#alertbox").empty();

  $("#results").empty();
  currentMovie = $(this).data("value");

  var queryURL =
    "https://api-public.guidebox.com/v2/search?type=movie&field=title&query=" +
    currentMovie +
    "&api_key=423737429793de8dc8210f09410b7509920f90d7";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var currentMovieID = response.results[0].id;

    var queryURL =
      "https://api-public.guidebox.com/v2/movies/" +
      currentMovieID +
      "?api_key=423737429793de8dc8210f09410b7509920f90d7";
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

  btnMovie.css("margin-top", "+=10px");

  btnMovie.text("Delete from My Watch List");
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
