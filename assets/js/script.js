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
        .then(data => showWeather(data));
}

function showWeather(data){
    //weather conditions, the temperature, the humidity, and the wind speed
    console.log(data);
    //remove after finishing
    let curDate = new Date();

    weather.innerHTML = `
    <div class="card">
        <div class="card-body">
            <h2 class="city-name">${data.name} ${curDate.getMonth() + 1}/${curDate.getDate()}/${curDate.getFullYear()}</h2>
            <h1>${Math.floor((data.main.temp - 273) * 9 / 5 + 32)} &#176F <i class="fa-solid fa-cloud"></i></h1>
            <h3>Humidity: ${data.main.humidity}%</h3>
            <h3>Wind: ${data.wind.speed} MPH</h3>
        </div>
    </div>
    <div class="row justify-content-md-right">
        <div>
            <h2>5-Day Forecast</h2>
            <div class="card">
                <div class='card-body'>
                    <div class="card-title"></div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function addCityToPrevious(name) {
    //Lock list
    let newCity = document.createElement('div');
    newCity.innerText = name;
    newCity.setAttribute("onclick", `fetchCords("${name}")`);
    newCity.setAttribute("class", "previous-search-element");
    previousCities.appendChild(newCity);
}

function removeCities(){
    previousCities.innerHTML = ""
}

function submitForm(event){
    event.preventDefault();
    fetchCords(document.search.searchInput.value);
}

function setupPreviousCities(){
    const keys = localStorage.getItem("previousCities").split(',');
    if(keys !== null)
        keys.forEach(x=> addCityToPrevious(x));
}

function citySearch(cityName){
    let prevCities = localStorage.getItem("previousCities");
    if( prevCities === null){
        localStorage.setItem('previousCities', cityName);
    }
    else{
        prevCities = prevCities.split(',');
        if(prevCities.includes(cityName)){
            prevCities.splice(prevCities.indexOf(cityName), 1);
        }
        prevCities.unshift(cityName);
        localStorage.setItem("previousCities", prevCities);
    }
    removeCities();
    setupPreviousCities();
}

setupPreviousCities();