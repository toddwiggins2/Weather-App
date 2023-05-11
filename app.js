const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

search.addEventListener("click", () => {
  getLatLong()
    .then(({ lat, long }) => {
      document.querySelector(".search-box input").value = lat + " " + long;

      const city = document.querySelector(".search-box input").value;

      if (city === "") return;

      fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=33.68&longitude=-84.75&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph"
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.cod === "404") {
            container.style.height = "400px";
            weatherBox.style.display = "none";
            weatherDetails.style.display = "none";
            error404.style.display = "block";
            error404.classList.add("fadeIn");
            console.log("ERROR IN 404");
            return;
          }

          error404.style.display = "block";
          error404.classList.remove("fadeIn");

          const image = document.querySelector(".weather-box img");
          const temperature = document.querySelector(
            ".weather-box .temperature"
          );
          const description = document.querySelector(
            ".weather-box .description"
          );
          const humidity = document.querySelector(
            ".weather-details .humidity span"
          );
          const wind = document.querySelector(".weather-details .wind span");

          image.src = "";
          console.log(json.current_weather.weathercode);

          console.log("first finished");

          switch (json.current_weather.weathercode) {
            case 3:
              document.querySelector(".weather-box .description").innerHTML =
                "Overcast";
              break;
          }

          console.log("case finished");
          console.log("wind" + wind.innerHTML);

          temperature.innerHTML = parseInt(json.current_weather.temperature);
          wind.innerHTML = parseInt(json.current_weather.windspeed) + " Mph";

          weatherBox.style.display = "";
          weatherDetails.style.display = "";
          weatherBox.classList.add("fadeIn");
          weatherDetails.classList.add("fadeIn");
          container.style.height = "690px";
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

// var x = document.getElementById("demo");
// let lat;
// let long;

// const para = document.querySelector("p");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     console.log("Geolocation is not supported by this browser.");
//   }
//   return {lat, long}
// }

// function showPosition(position) {
//   lat = position.coords.latitude;
//   long = position.coords.longitude;
//   document.querySelector(".search-box input").value = lat + " " + long;
//   return { Latitude: lat, longitude: long };
// }

// fetch(
//   "https://api.open-meteo.com/v1/forecast?latitude=33.68&longitude=-84.75&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph"
// )
//   .then((response) => response.json())
//   .then((json) => {
//     console.log(json);
//     para.innerText = `${parseInt(json.current_weather.temperature)}`;
//   });

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
