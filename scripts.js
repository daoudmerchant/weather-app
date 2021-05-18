async function getWeather(city, units) {
    const formatData = function(data) {
        return {
            city: data.name,
            country: data.sys.country,
            weather: [data.weather[0].main, data.weather[0].description],
            temp: data.main.temp,
            realfeel: data.main.feels_like,
            min: data.main.temp_min,
            max: data.main.temp_max,
        };
    }

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}` +
        `&units=${units}` +
        `&APPID=2c3f046b9d3c6ebd541050d029ffddb2`
    );
    const data = await response.json();
    return formatData(data);
}

const updateWeather = async function(city, units = "metric") {
    const icon = document.querySelector("img");
    const cityText = document.querySelector("#city");
    const weatherText = document.querySelector("#weathermain");
    const tempText = document.querySelector("#temp");
    const highTempText = document.querySelector("#hightemp");
    const lowTempText = document.querySelector("#lowtemp");

    const weatherObj = await getWeather(city, units);

    icon.src = `images/${weatherObj.weather[0]}.svg`
    icon.alt = weatherObj.weather[0];
    cityText.textContent = `${weatherObj.city}, ${weatherObj.country}`;
    weatherText.textContent = weatherObj.weather[0];
    tempText.textContent = `${weatherObj.temp}° (feels ${weatherObj.realfeel}°)`;
    highTempText.textContent = `Max ${weatherObj.max}°`;
    lowTempText.textContent = `Min ${weatherObj.min}°`;
}

updateWeather("stockholm");

const selectCity = (function() {
    let currentUnits = "metric";

    const units = document.querySelectorAll(".unit");
    units.forEach(unit => unit.addEventListener("click", e => {
        if (e.target.classList.contains("selected")) { return }

    }))

    const search = document.querySelector("#submit");
    search.addEventListener("click", e => {
        e.preventDefault();
        const userCity = e.target.previousElementSibling.value;
        updateWeather(userCity, currentUnits);
        return false;
    })
})();


// fetch('https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=2c3f046b9d3c6ebd541050d029ffddb2')
//     .then(response => response.json())
//     .then(data => console.log(data));