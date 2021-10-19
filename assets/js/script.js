var apiKey = "6b54154e0bc29e084e51b02e1c3d2223";
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input")
var weatherReportEl = document.querySelector("#weather-report");
var searchHistoryEl = document.querySelector("#search-history-btns");
var searchHistory = [];

var populateSearchHistory = function() {
    // reset searchHistoryEl
    searchHistoryEl.innerHTML = "";
    // update searchHistory array from localStorage
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    // if no search history exists in local storage, reset array and return out of function
    if (!searchHistory) {
        searchHistory = [];
        return false;
    }
    // update dashboard with most recent search
    fetchWeatherData(searchHistory[0].name, searchHistory[0].lat, searchHistory[0].lon);
    // loop through searchHistory array and create buttons for each saved city
    for (var i = 0; i < searchHistory.length; i++) {
        var btn = document.createElement("button");
        btn.textContent = searchHistory[i].name;
        btn.setAttribute("data-index", i);
        btn.setAttribute("data-lat", searchHistory[i].lat);
        btn.setAttribute("data-lon", searchHistory[i].lon);
        searchHistoryEl.appendChild(btn);
    }
}

var saveSearchedCity = function(cityName, lat, lon) {
    // create object and store city data
    var cityObj = {
        name: cityName,
        lat: lat,
        lon: lon
    }
    searchHistory.unshift(cityObj);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // update DOM
    populateSearchHistory();
}

// populate specified weather data into specified element 
var populateWeatherData = function(data, el, options) {
    // populate date
    var dateEl = document.createElement("h3");
    var date = new Date(data.dt * 1000);
    dateEl.textContent = date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
     });
     el.appendChild(dateEl);

    // populate weather icon
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    iconEl.setAttribute("alt", data.weather[0].description);
    el.appendChild(iconEl);

    // populate temperature
    var tempEl = document.createElement("p");
    var temp = data.temp.day;
    // if temp not set, get from outside array instead
    if (!temp) { temp = data.temp; }
    tempEl.textContent = "Temp: " + Math.round(temp) + "°";
    el.appendChild(tempEl);

    // populate humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + Math.round(data.humidity) + "%";
    el.appendChild(humidityEl);

    // populate wind speed
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + data.wind_speed + " MPH";
    el.appendChild(windEl);

    // check if options set to include uvi
    if (options && options.includes("include uvi")) {
        // store uv index in variable
        var uvi = data.uvi;
        // create el for uv index
        var uvEl = document.createElement("p");
        uvEl.textContent = "UV Index: ";
        // create span for current UV Index
        var uvSpan = document.createElement("span");
        uvSpan.classList = "px-2 py-1 rounded text-white";
        uvSpan.textContent = uvi;
        // color code span
        if (uvi <= 2) {
            uvSpan.classList.add("bg-success");
        } else if (uvi <= 5) {
            uvSpan.classList.add("bg-warning");
        } else {
            uvSpan.classList.add("bg-danger");
        }
        uvEl.appendChild(uvSpan);
        // append UV Index to current weather only
        el.appendChild(uvEl);
    }
}

// update weather dashboard with fetched city and weather data
var updateDashboard = function(cityName, weatherData) {
    // clear weather report el
    weatherReportEl.innerHTML = "";

    // create current weather el
    var currentWeatherEl = document.createElement("div");
    currentWeatherEl.setAttribute("id", "current-weather");
    currentWeatherEl.classList = "row";

    // populate city name
    var cityNameEl = document.createElement("h2");
    cityNameEl.textContent = cityName;
    // append city name to current weather el
    currentWeatherEl.appendChild(cityNameEl);

    // populate data into current weather el
    var currentWeatherOptions = [
        "include uvi"
    ];
    populateWeatherData(weatherData.current, currentWeatherEl, currentWeatherOptions);
    // append current weather to DOM
    weatherReportEl.appendChild(currentWeatherEl);

    // create forcast el
    var forcastEl = document.createElement("div");
    forcastEl.setAttribute("id", "forcast");
    forcastEl.classList = "row";

    // populate forcased weather for next 5 days
    for (var i = 1; i <= 5; i++) {
        var singleDayForecastEl = document.createElement("div");
        singleDayForecastEl.classList = "col";
        populateWeatherData(weatherData.daily[i], singleDayForecastEl);
        forcastEl.appendChild(singleDayForecastEl);
    }

    // append forcast to DOM
    weatherReportEl.appendChild(forcastEl);   
}

// fetch weather data from fetched city data
var fetchWeatherData = function(cityName, lat, lon) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(apiURL).then(function(response) {
        response.json().then(function(weatherData) {
            // push city and weather data to dashboard
            updateDashboard(cityName, weatherData);
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
                // set city display name
                if (cityData[0].state) {
                    var cityName = cityData[0].name + ", " + cityData[0].state;
                } else {
                    var cityName = cityData[0].name + ", " + cityData[0].country;
                }
                // push city data to function to fetch weather data
                fetchWeatherData(cityName, cityData[0].lat, cityData[0].lon);
                saveSearchedCity(cityName, cityData[0].lat, cityData[0].lon);
            }
        })
    })
}

var searchFormHandler = function(event) {
    event.preventDefault();
    var searchedString = searchInputEl.value.trim();
    fetchCityData(searchedString);
}

populateSearchHistory();

searchFormEl.addEventListener("submit", searchFormHandler);

searchHistoryEl.addEventListener("click", function(event) {
    if (event.target.matches("button")) {
        var cityName = event.target.textContent;
        var lat = event.target.getAttribute("data-lat");
        var lon = event.target.getAttribute("data-lon");
        fetchWeatherData(cityName, lat, lon);
    }
});