let src = "https://api.openweathermap.org/data/2.5/forecast?";
let apiKey = "f6b6c1815274dfb64ce0b52e2e0f5307";
let previousCities = document.getElementById("previous-search");

function fetchCords(name) {
    fetch(`${src}q=${name}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.hasOwnProperty('city')) {
                addCityToPrevious(name);
                getWeather(data.city.coord.lat, data.city.coord.lon);
            }
            else console.log("City not found");
        });
}

function getWeather(lat, lon) {
    fetch(`${src}lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => showWeather(data));
}

function showWeather(data){
    console.log(data);
}

function addCityToPrevious(name) {
    //Lock list
    let newCity = document.createElement('div');
    newCity.innerText = name;
    previousCities.appendChild(newCity);
}

function submitForm(event){
    event.preventDefault();
    fetchCords(document.search.searchInput.value);
}
