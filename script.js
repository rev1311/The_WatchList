var inputSearch = "pulp fiction";

if (!localStorage.getItem("movies")) {
  var movies = [];
} else {
  var movies = JSON.parse(localStorage.getItem("movies"));
}
console.log(movies);
renderMovieList();

$(document).on("click", "#searchButton", function() {
  event.preventDefault();
  var currentMovie = $("#searchBar").val();

  var queryURL =
    "https://www.omdbapi.com/?t=" + currentMovie + "&plot=short&apikey=trilogy";
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    createResult(response);
  });
});

function createResult(response) {
  $("#results").empty();

  var div = $("<div>");
  var img = $("<img>");
  var text = $("<p>");
  var btnAdd = $("<button>");

  text.text(response.Title);
  img.attr("src", response.Poster);
  btnAdd.text("Add");
  btnAdd.addClass("addButton");
  btnAdd.attr("value", response.Title);

  div.prepend(text);
  div.prepend(img);
  div.prepend(btnAdd);
  $("#results").prepend(div);
}

$(document).on("click", ".addButton", function() {
  event.preventDefault();
  var movie = $(this).val();
  if (movies.indexOf(movie) == -1) {
    movies.push(movie);
    console.log(movies);
    renderMovieList();
    saveList();
  } else alert("you already have this movie added");
});

function renderMovieList() {
  $("#list").empty();
  for (var i = 0; i < movies.length; i++) {
    var btnMovie = $("<button>");

    btnMovie.text(movies[i]);
    btnMovie.addClass("movieButton");
    btnMovie.attr("value", movies[i]);

    $("#list").prepend(btnMovie);
  }
}

$(document).on("click", ".movieButton", function() {
  $("#results").empty();
  console.log($(this).val());
  createResult($(this).val());
});

function saveList() {
  localStorage.setItem("movies", JSON.stringify(movies));
}
