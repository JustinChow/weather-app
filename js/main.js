function fetchWeatherData(location) {
  return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=88956fb3e44bb4b9e7134bfe48cc605e`)
    .then((response) => response.json())
    .then((response) => {
      return response;
    });
}

function convertKToC(temp) {
  return (temp - 273.15).toFixed(2);
}

function getTemp(data) {
  return data.main.temp;
}

function getMinTemp(data) {
  return data.main.temp_min;
}

function getMaxTemp(data) {
  return data.main.temp_max;
}

function getFeelsLikeTemp(data) {
  return data.main.feels_like;
}

function getPressure(data) {
  return data.main.pressure;
}

function getHumidity(data) {
  return data.main.humidity;
}

function getCity(data) {
  return `${data.name}, ${data.sys.country}`
}

function getIconUrl(data) {
  const iconID = data.weather[0].icon;
  return `http://openweathermap.org/img/wn/${iconID}@2x.png`
}

function processWeatherData(data) {
  return {
    temp: `${Math.trunc(convertKToC(getTemp(data)))}${String.fromCharCode(176)}C`,
    feelsLikeTemp: `${convertKToC(getFeelsLikeTemp(data))}${String.fromCharCode(176)}C`,
    minTemp: `${convertKToC(getMinTemp(data))}${String.fromCharCode(176)}C`,
    maxTemp: `${convertKToC(getMaxTemp(data))}${String.fromCharCode(176)}C`,
    pressure: `${getPressure(data)}hPa`,
    humidity: `${getHumidity(data)}%`,
    iconUrl: getIconUrl(data),
    city: getCity(data),
  };
}

function updateDisplay(data) {
  const errorMsg = document.querySelector("#error-msg");
  data = processWeatherData(data);
  const cityName = document.querySelector("#city-name");
  const temp = document.querySelector("#temp");
  const minTemp = document.querySelector("#min-temp");
  const maxTemp = document.querySelector("#max-temp");
  const feelsLikeTemp = document.querySelector("#feels-like-temp");
  const icon = document.querySelector("#icon-img");
  const pressure = document.querySelector("#pressure");
  const humidity = document.querySelector("#humidity");

  errorMsg.textContent = "";

  cityName.textContent = data.city;
  temp.textContent = data.temp;
  minTemp.textContent = `Minimum: ${data.minTemp}`;
  maxTemp.textContent = `Maximum: ${data.maxTemp}`;
  feelsLikeTemp.textContent = `Feels like: ${data.feelsLikeTemp}`;
  pressure.textContent = `Pressure: ${data.pressure}`;
  humidity.textContent = `Humidity: ${data.humidity}`;
  icon.src = data.iconUrl;
}

function updateWeather(city) {
  return fetchWeatherData(city)
  .then((data) => updateDisplay(data))
  .catch(() => {
    const errorMsg = document.querySelector("#error-msg");
    errorMsg.textContent = "Error retrieving weather information. Please double check the city name.";
  });
}

updateWeather("toronto,ca");

const btn = document.querySelector("button");
const cityInput = document.querySelector("input");

btn.addEventListener("click", () => updateWeather(cityInput.value));

window.addEventListener("keydown", () => {
  if (event.keyCode == 13) {
    event.preventDefault();
    updateWeather(cityInput.value);
  }
});