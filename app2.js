const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

search.addEventListener("click", () => {

  // document.querySelector(".test").innerHTML = "test";

  fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=33.68&longitude=-84.75&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph"
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);

      const image = document.querySelector("weather-box img");
      const temperature = document.querySelector("weather-box .temperature");
      const description = document.querySelector("weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");

      console.log(image, temperature, description, humidity, wind);

      document.querySelector(".test").innerHTML = json.current_weather.temperature;
      document.querySelector(".weather-box .temperature").innerHTML = json.current_weather.temperature;


    });
});
