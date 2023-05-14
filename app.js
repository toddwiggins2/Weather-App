const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");
const input = document.querySelector(".search-box input");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    search.click();
  }
});

search.addEventListener("click", () => {
  //Get lat and long from browser if supported and no cordinates are given.
  getLatLong()
    .then(({ lat, long }) => {
      //Get inputs from search box if there are any and pass lat and long into variables.
      const city = document.querySelector(".search-box input").value;

      //Validate if city are cordinates.
      validateLatLong = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(city);

      // If city is blank use browser cordinates. Next if value is not cordinates then exit. Last parse input to lat and long variables.
      if (city === "") {
        document.querySelector(".search-box input").value = lat + ", " + long;
      } else if (validateLatLong == false) {
        container.style.height = "400px";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
        return;
      } else if (city !== "") {
        [lat, long] = city.split(",").map((str) => parseFloat(str));
      }

      //Setup API variables. APIs with no keys
      const url1 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`;

      const url2 = `https://api.weather.gov/points/${lat},${long}`;

      //Get from API for first two API calls.
      Promise.all([fetch(url1), fetch(url2)])
        .then((response) =>
          Promise.all(response.map((responce) => responce.json()))
        )

        //Place API JSON into variables for later.
        .then((json) => {
          const json1 = json[0];
          const json2 = json[1];

          if (json1.error === true || json2.status == "404") {
            container.style.height = "400px";
            weatherBox.style.display = "none";
            weatherDetails.style.display = "none";
            error404.style.display = "block";
            error404.classList.add("fadeIn");
            console.log("ERROR IN 404");
            return;
          }

          //Define new API URL that was gotten from second API call previously.
          url3 = json2.properties.forecast;

          //Get API JSON information
          fetch(url3)
            .then((response) => response.json())
            .then((data) => {
              const json3 = data;

              error404.style.display = "none";
              error404.classList.remove("fadeIn");

              //Define variables for later to shorten code and easier to read.
              const image = document.querySelector(".weather-box img");
              const temperature = document.querySelector(
                ".weather-box .temperature"
              );
              const description = document.querySelector(
                ".weather-box .description"
              );

              const location = document.querySelector(".weather-box .location");

              const humidity = document.querySelector(
                ".weather-details .humidity span"
              );
              const wind = document.querySelector(
                ".weather-details .wind span"
              );

              //Switch case to go through all the returned weather codes to set the image to the correct weather condition.
              switch (json1.current_weather.weathercode) {
                case 0:
                case 1:
                  document.querySelector(
                    ".weather-box .description"
                  ).innerHTML = "Clear Sky";
                  image.src = "img/clearsky.jpg";
                  break;

                case 2:
                case 3:
                  document.querySelector(
                    ".weather-box .description"
                  ).innerHTML = "Overcast";
                  image.src = "img/overcast.jpg";

                  break;

                case 45:
                case 48:
                  document.querySelector(
                    ".weather-box .description"
                  ).innerHTML = "Fog";
                  image.src = "img/fog.jpg";

                  break;

                case 51:
                case 53:
                case 55:
                case 56:
                case 57:
                case 61:
                case 63:
                case 65:
                case 66:
                case 67:
                case 80:
                case 81:
                case 82:
                case 95:
                case 96:
                  document.querySelector(
                    ".weather-box .description"
                  ).innerHTML = "Rain";
                  image.src = "img/rain.jpg";

                  break;

                case 71:
                case 73:
                case 75:
                case 77:
                case 85:
                case 86:
                  document.querySelector(
                    ".weather-box .description"
                  ).innerHTML = "Snow";
                  image.src = "img/snow.jpg";

                  break;
                default:
                  image.src = "";
              }

              //Pull data from JSON push to the frontend for display
              temperature.innerHTML =
                parseInt(json1.current_weather.temperature) + "<span>F</span>";

              wind.innerHTML =
                parseInt(json1.current_weather.windspeed) + " Mph";

              location.innerHTML =
                json2.properties.relativeLocation.properties.city +
                ", " +
                json2.properties.relativeLocation.properties.state;

              description.innerHTML = json3.properties.periods[0].shortForecast;

              humidity.innerHTML =
                json3.properties.periods[0].relativeHumidity.value + `%`;

              //Final style updates.
              weatherBox.style.display = "";
              weatherDetails.style.display = "";
              weatherBox.classList.add("fadeIn");
              weatherDetails.classList.add("fadeIn");
              container.style.height = "720px";
            });
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => {
      console.error(error);
    });
});

// Functionm to get the lat and long from browser if possible.
function getLatLong() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          resolve({ lat, long });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}
