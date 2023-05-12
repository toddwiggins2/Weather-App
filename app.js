const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

search.addEventListener("click", () => {
  getLatLong()
    .then(({ lat, long }) => {
      // console.log(
      //   /^-?[\d,\s.]*$/.test(document.querySelector(".search-box input").value)
      // );

      // checkBoxCase = +document.querySelector(".search-box input").value;

      // checkBoxCase = "39.742043, -104.991531";

      // if (/^-?[\d,\s]*$/.test(checkBoxCase) === false) {
      //   container.style.height = "400px";
      //   weatherBox.style.display = "none";
      //   weatherDetails.style.display = "none";
      //   error404.style.display = "block";
      //   error404.classList.add("fadeIn");
      //   console.log("ERROR IN 404 catch");
      //   return;
      // }

      //   document.querySelector(".search-box input").value = lat + " " + long;

      const city = document.querySelector(".search-box input").value;

      console.log(`${city} lat: ${lat} and long: ${long}`);

      if (city !== "") {
        // tempSplit = city.split(",");

        [lat, long] = city.split(",").map((str) => parseFloat(str));

        // lat = tempSplit[0];
        // long = tempSplit[1];
      } else {
        document.querySelector(".search-box input").value = lat + ", " + long;
      }

      console.log(`${city} lat: ${lat} and long: ${long}`);

      const url1 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`;

      const url2 = `https://api.weather.gov/points/${lat},${long}`;

      //   let url3 = ``;

      Promise.all([fetch(url1), fetch(url2)])
        .then((response) =>
          Promise.all(response.map((responce) => responce.json()))
        )
        // fetch(url2)
        //   .then((response) => response.json())

        .then((json) => {
          const json1 = json[0];
          const json2 = json[1];
          console.log(json1);
          console.log(json2);

          if (json1.error === true || json2.status == "404") {
            container.style.height = "400px";
            weatherBox.style.display = "none";
            weatherDetails.style.display = "none";
            error404.style.display = "block";
            error404.classList.add("fadeIn");
            console.log("ERROR IN 404");
            return;
          }

          url3 = json2.properties.forecast;

          //   let json3;

          fetch(url3)
            .then((response) => response.json())
            .then((data) => {
              const json3 = data;
              console.log(json3);

              if (json1.error === true || json2.status === "404") {
                container.style.height = "400px";
                weatherBox.style.display = "none";
                weatherDetails.style.display = "none";
                error404.style.display = "block";
                error404.classList.add("fadeIn");
                console.log("ERROR IN 404");
                return;
              }
              error404.style.display = "none";
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
              const wind = document.querySelector(
                ".weather-details .wind span"
              );

              image.src = "img/404.jpg";
              console.log("first finished");

              switch (json1.current_weather.weathercode) {
                case 3:
                  document.querySelector(
                    ".weather-box .description"
                  ).innerHTML = "Overcast";
                  break;
              }

              console.log("case finished");

              temperature.innerHTML =
                parseInt(json1.current_weather.temperature) + "<span>F</span>";
              wind.innerHTML =
                parseInt(json1.current_weather.windspeed) + " Mph";

              description.innerHTML = json3.properties.periods[0].shortForecast;
              humidity.innerHTML =
                json3.properties.periods[0].relativeHumidity.value + `%`;

              weatherBox.style.display = "";
              weatherDetails.style.display = "";
              weatherBox.classList.add("fadeIn");
              weatherDetails.classList.add("fadeIn");
              container.style.height = "690px";
            });
        })
        .catch((error) => console.error(error));
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
