var apiKey = "6b54154e0bc29e084e51b02e1c3d2223";
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input")
var weatherReportEl = document.querySelector("#weather-report");


var displayWeatherData = function(data, el) {
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
    var temp = data.temp.day;
    // if temp not set, get from outside array instead
    if (!temp) { temp = data.temp; }
    tempEl.textContent = "Temp: " + Math.round(temp) + "°";
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
    weatherReportEl.innerHTML = "";

    // create current weather el
    var currentWeatherEl = document.createElement("div");
    currentWeatherEl.setAttribute("id", "current-weather");
    currentWeatherEl.classList = "row";

    // display city name
    var cityNameEl = document.createElement("h2");
    // check if state is set
    if (cityData.state) {
        cityNameEl.textContent = cityData.name + ", " + cityData.state;
    } else {
        cityNameEl.textContent = cityData.name + ", " + cityData.country;
    }
    currentWeatherEl.appendChild(cityNameEl);

    // display current weather data
    displayWeatherData(weatherData.current, currentWeatherEl);

    // create el for current UV Index
    var uvEl = document.createElement("p");
    uvEl.innerHTML = "UV Index: ";
    // create span for current UV Index
    var uvi = weatherData.current.uvi;
    var uvSpan = document.createElement("span");
    uvSpan.classList = "px-2 py-1 rounded text-white";
    uvSpan.textContent = uvi;
    // color code UV Index
    if (uvi <= 2) {
        uvSpan.classList.add("bg-success");
    } else if (uvi <= 5) {
        uvSpan.classList.add("bg-warning");
    } else {
        uvSpan.classList.add("bg-danger");
    }
    uvEl.appendChild(uvSpan);
    // append UV Index to current weather only
    currentWeatherEl.appendChild(uvEl);
    

    // append current weather to DOM
    weatherReportEl.appendChild(currentWeatherEl);

    // create forcast el
    var forcastEl = document.createElement("div");
    forcastEl.setAttribute("id", "forcast");
    forcastEl.classList = "row";

    // display forcased weather for next 5 days
    for (var i = 1; i < 5; i++) {
        var singleDayForecastEl = document.createElement("div");
        singleDayForecastEl.classList = "col";
        displayWeatherData(weatherData.daily[i], singleDayForecastEl);
        forcastEl.appendChild(singleDayForecastEl);
    }

    // append forcast to DOM
    weatherReportEl.appendChild(forcastEl);
    
}

// fetch weather data from fetched city data
var fetchWeatherData = function(cityData) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + cityData.lat + "&lon=" + cityData.lon + "&appid=" + apiKey;
    fetch(apiURL).then(function(response) {
        response.json().then(function(weatherData) {
            // push city and weather data to dashboard
            updateDashboard(cityData, weatherData);
        })
    });
}

// fetch city data from user input search
var fetchCityData = function(searchedString) {
    var apiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchedString + "&appid=" + apiKey;
    fetch(apiURL).then(function(response) {
        response.json().then(function(cityData) {
            // check if city found
            if (cityData.length > 0) {
                // use city data to get weather data
                fetchWeatherData(cityData[0]);
            }
        })
    })
}

var searchFormHandler = function(event) {
    event.preventDefault();
    var searchedString = searchInputEl.value.trim();
    fetchCityData(searchedString);
}

searchFormEl.addEventListener("submit", searchFormHandler);


// var lat = "33.4484";
// var lon = "-112.074";

// var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
// console.log(apiURL);