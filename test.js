
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
 
 // when search button is clicked --works
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
     console.log(response);
 
     // take call info, run into a function to display result of search--works
     createResult(response);
   });
 });
 
 // FUNCTION creastes search result
 function createResult(response) {
   // empty the space
   $("#results").empty();
 
   // make new elements
   var div = $("<div>");//works
   var img = $("<img>");//works
   var text = $("<p>");//works
   var btnAdd = $("<button>");//no yet 
 
   // give elements attr
   text.text(response.Title);
   img.attr("src", response.Poster);
   //btnAdd.text("Add");
   //btnAdd.addClass("addButton");

   btnAdd.attr("value", response.Title);
 
   // prepend elements to page
   div.prepend(text);
   div.prepend(img);
   div.prepend(btnAdd);
   $("#results").prepend(div);
 }
 
 // when you click add
 $(document).on("click", "#addButton", function() {
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
   $("#list").empty();
 
   for (var i = 0; i < movies.length; i++) {
     var btnMovie = $("<button>");
 
     btnMovie.text(movies[i]);
     btnMovie.addClass("movieButton");
     btnMovie.attr("value", movies[i]);
 
     $("#list").prepend(btnMovie);
   }
 }
 
 // FUNCTION when you click on a movie in your list
 $(document).on("click", ".movieButton", function() {
   $("#results").empty();
   currentMovie = $(this).val();
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
   btnMovie.addClass("deleteButton");
   btnMovie.attr("value", movie);
   div.prepend(btnMovie);
   $("#results").append(div);
 }
 
 // FUNCTION delete the movie
 $(document).on("click", ".deleteButton", function() {
   // movies.remove($(this).val());
   movies.splice(movies.indexOf($(this).val()), 1);
   renderMovieList();
   console.log("Hey");
 });
 
 // sort alphabetical
 function sortAlphabetical(arr) {
   var newMovies = arr.sort();
   console.log(newMovies);
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