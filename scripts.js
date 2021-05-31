const getWeather = async function(city, units) {
    const formatData = function(data) {
        const round = num => {
            const temp = num.toFixed(1);
            // surely this can be done easier?
            return (temp.charAt(temp.length - 1) !== "0") ? temp : temp.slice(0, -2);
        };
        return {
            city: data.name,
            country: data.sys.country,
            // necessary to make array?
            weather: [data.weather[0].main, data.weather[0].description],
            temp: round(data.main.temp),
            realfeel: round(data.main.feels_like),
            min: round(data.main.temp_min),
            max: round(data.main.temp_max),
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

const updatePage = async function(city, units) {
    const icon = document.querySelector("img");
    const cityText = document.querySelector("#city");
    const weatherText = document.querySelector("#weathermain");
    const tempText = document.querySelector("#temp");
    const highTempText = document.querySelector("#hightemp");
    const lowTempText = document.querySelector("#lowtemp");

    try {
        const weatherObj = await getWeather(city, units);

        icon.src = `images/${weatherObj.weather[0]}.svg`
        icon.alt = weatherObj.weather[0];
        cityText.textContent = `${weatherObj.city}, ${weatherObj.country}`;
        weatherText.textContent = weatherObj.weather[0];
        tempText.textContent = `${weatherObj.temp}° (feels ${weatherObj.realfeel}°)`;
        highTempText.textContent = `Max ${weatherObj.max}°`;
        lowTempText.textContent = `Min ${weatherObj.min}°`;
    } catch (e) {
        alert("Please make sure that you have entered a valid city");
        console.error(e);
    }

}

const selectCity = (function() {
	let currentCity = "stockholm";
    let currentUnits = "metric";
    const updateWeather = () => updatePage(currentCity, currentUnits);

    // on load
	updateWeather();

    const units = document.querySelectorAll(".unit");
    units.forEach(unit => unit.addEventListener("click", function toggleUnit() {
        if (this.classList.contains("selected")) { return }
        const otherUnit = (this.nextElementSibling) ?
            this.nextElementSibling :
            this.previousElementSibling;
        otherUnit.classList.remove("selected");
        this.classList.add("selected");
		currentUnits = this.id;
		updateWeather()
    }));

    const search = document.querySelector("#submit");
    search.addEventListener("click", e => {
        e.preventDefault();
        currentCity = e.target.previousElementSibling.value;
        updateWeather();
        // return false;
    })
})();


// fetch('https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=2c3f046b9d3c6ebd541050d029ffddb2')
//     .then(response => response.json())
//     .then(data => console.log(data));
