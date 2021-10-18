var apiKey = "6b54154e0bc29e084e51b02e1c3d2223";
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input")
var weatherReportEl = document.querySelector("#weather-report");


var displayWeather = function(data, el) {
    // display date
    var dateEl = document.createElement("h3");
    var date = new Date(data.dt * 1000);
    dateEl.textContent = date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
     });
     el.appendChild(dateEl);

    // display weather icon
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    iconEl.setAttribute("alt", data.weather[0].description);
    el.appendChild(iconEl);

    // display temp
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + Math.round(data.temp) + "°";
    el.appendChild(tempEl);

    // display humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + Math.round(data.humidity) + "%";
    el.appendChild(humidityEl);

    // display wind speed
    var windEl = document.createElement("p");
    windEl.textContent = "Wind : " + data.wind_speed + " MPH";
    el.appendChild(windEl);
}

// update weather dashboard with fetched city and weather data
var updateDashboard = function(cityData, weatherData) {
    console.log(cityData, weatherData);
    // clear weather report
    weatherReportEl.textContent = "";

    // display city name
    var cityNameEl = document.createElement("h2");
    // check if state is set
    if (cityData.state) {
        cityNameEl.textContent = cityData.name + ", " + cityData.state;
    } else {
        cityNameEl.textContent = cityData.name + ", " + cityData.country;
    }
    weatherReportEl.appendChild(cityNameEl);

    // display today's weather
    var todaysWeatherEl = document.createElement("div");
    todaysWeatherEl.setAttribute("id", "todays-weather");
    displayWeather(weatherData.current, todaysWeatherEl);

    // display UV index on today's weather only
    var uvEl = document.createElement("p");
    uvEl.textContent = "UV Index: " + weatherData.current.uvi;
    todaysWeatherEl.appendChild(uvEl);

    // append today's weather to DOM
    weatherReportEl.appendChild(todaysWeatherEl);
}

// fetch weather data from fetched city data
var getWeatherData = function(cityData) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + cityData.lat + "&lon=" + cityData.lon + "&appid=" + apiKey;
    fetch(apiURL).then(function(response) {
        response.json().then(function(weatherData) {
            // push city and weather data to display data
            updateDashboard(cityData, weatherData);
        })
    });
}

// fetch city data from user input search
var getCityData = function(searchedString) {
    var apiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchedString + "&appid=" + apiKey;
    fetch(apiURL).then(function(response) {
        response.json().then(function(cityData) {
            // check if city found
            if (cityData.length > 0) {
                // use city data to get weather data
                getWeatherData(cityData[0]);
            }
        })
    })
}

var searchFormHandler = function(event) {
    event.preventDefault();
    var searchedString = searchInputEl.value.trim();
    getCityData(searchedString);
}

searchFormEl.addEventListener("submit", searchFormHandler);


// var lat = "33.4484";
// var lon = "-112.074";

// var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
// console.log(apiURL);