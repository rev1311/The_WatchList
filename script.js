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
  // var queryURL =
  //   "https://api.fandango.com/movies/v2/" +
  //   currentMovie +
  //   "?api_key=4e368grcz98v9gvhbhntzd2t&sig=18cad9c44a200825f2e2db93c256bd722fb8e0c5df42a3fbba03a7d8c2e71148";
  // console.log(queryURL);

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
  currentMovie = $(this).val();
  var queryURL =
    "https://www.omdbapi.com/?t=" + currentMovie + "&plot=short&apikey=trilogy";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    createResult(response);
    createDeleteButton(response);
  });
});

function createDeleteButton(response) {
  var movie = response.Title;
  var div = $("<div>");
  var btnMovie = $("<button>");

  btnMovie.text("delete from list");
  btnMovie.addClass("deleteButton");
  btnMovie.attr("value", movie);
  div.prepend(btnMovie);
  $("#results").append(div);
}

$(document).on("click", ".deleteButton", function() {
  // movies.remove($(this).val());
  movies.splice(movies.indexOf($(this).val()), 1);
  renderMovieList();
  console.log("Hey");
});

function sortAlphabetical(arr) {
  var newMovies = arr.sort();
  console.log(newMovies);
}

function sortByGenre(arr) {}

function saveList() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

$(document).on("click", "#clearList", function() {
  localStorage.clear();
  movies = [];
  renderMovieList();
});
