const srcForecast = "https://api.openweathermap.org/data/2.5/forecast?";
const srcWeather = "https://api.openweathermap.org/data/2.5/weather?"
const apiKey = "f6b6c1815274dfb64ce0b52e2e0f5307";
const previousCities = document.getElementById("previous-search");
const weather = document.getElementById("weather-card");

function fetchCords(name) {
    fetch(`${srcForecast}q=${name}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.hasOwnProperty('city')) {
                citySearch(data.city.name);
                getWeather(data.city.coord.lat, data.city.coord.lon);
            }
            else console.log("City not found");
        });
}


function getWeather(lat, lon) {
    fetch(`${srcWeather}lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => showWeather(data))
        .then(() => {
            fetch(`${srcForecast}lat=${lat}&lon=${lon}&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => showFiveDay(data));
        });
}

function showWeather(data) {
    console.log(data);
    //weather conditions, the temperature, the humidity, and the wind speed
    //remove after finishing
    let curDate = new Date();

    weather.innerHTML = `
    <div class="card">
        <div class="card-body">
            <h2 class="city-name">${data.name} ${curDate.getMonth() + 1}/${curDate.getDate()}/${curDate.getFullYear()}</h2>
            <h1>${convertKtoF(data.main.temp)} &#176F <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></h1>
            <h3>Humidity: ${data.main.humidity}%</h3>
            <h3>Wind: ${data.wind.speed} MPH</h3>
        </div>
    </div>
    <hr>
    <div class="row justify-content-md-right">
        <div>
            <h2>5-Day Forecast</h2>
            <div class="row gy-3" id="5day">
            </div>
        </div>
    </div>
    `;
}

function showFiveDay(data) {
    console.log(data);
    let header = document.getElementById("5day");
    for (let i = 0; i < 5; i++) {
        const currentData = data.list[i * 8];

        let currentDate = currentData.dt_txt.split(' ')[0];
        currentDate = currentDate.split('-');
        currentDate = currentDate[1] + "/" + currentDate[2];

        header.innerHTML += `
        <div class="col-4">
            <div class="card p-3">
                <div class="card-title h2">${currentDate}</div>
                <div>
                    <h3>${convertKtoF(currentData.main.temp)}&#176F<img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png"></h3> 
                </div>
                <div>
                    Hummidity: ${currentData.main.humidity}%
                </div>
                <div>
                    Wind: ${currentData.wind.speed} MPH
                </div>
            </div>
        </div>
        `;
    }
}

function addCityToPrevious(name) {
    //Lock list
    let newCity = document.createElement('div');
    newCity.innerText = name;
    newCity.setAttribute("onclick", `fetchCords("${name}")`);
    newCity.setAttribute("class", "previous-search-element");
    previousCities.appendChild(newCity);
}

function convertKtoF(value) {
    return Math.floor((value - 273) * 9 / 5 + 32)
}

function removeCities() {
    previousCities.innerHTML = ""
}

function submitForm(event) {
    event.preventDefault();
    fetchCords(document.search.searchInput.value);
}

function setupPreviousCities() {
    const keys = localStorage.getItem("previousCities").split(',');
    if (keys !== null)
        keys.forEach(x => addCityToPrevious(x));
}

function citySearch(cityName) {
    let prevCities = localStorage.getItem("previousCities");
    if (prevCities === null) {
        localStorage.setItem('previousCities', cityName);
    }
    else {
        prevCities = prevCities.split(',');
        if (prevCities.includes(cityName)) {
            prevCities.splice(prevCities.indexOf(cityName), 1);
        }
        prevCities.unshift(cityName);
        localStorage.setItem("previousCities", prevCities);
    }
    removeCities();
    setupPreviousCities();
}

setupPreviousCities();