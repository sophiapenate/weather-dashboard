var apiKey = "6b54154e0bc29e084e51b02e1c3d2223";
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input")
var weatherReportEl = document.querySelector("#weather-report");

var getCityCoordinates = function(searchedString) {
    var apiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchedString + "&appid=" + apiKey;
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            var lat = data[0].lat;
            var lon = data[0].lon
            displayWeather(lat, lon);
        })
    })
}

var displayWeather = function(lat, lon) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })
}

var searchFormHandler = function(event) {
    event.preventDefault();
    var searchedString = searchInputEl.value.trim();
    getCityCoordinates(searchedString);
}

searchFormEl.addEventListener("submit", searchFormHandler);


// var lat = "33.4484";
// var lon = "-112.074";

// var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
// console.log(apiURL);