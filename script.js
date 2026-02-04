const API_KEY = "95219ab4844c9a53a98448897a670227";

// Fetched weather data based on city with API error handling

async function getWeatherByCity(city){
    try {
        const res = await fetch(
           `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        )
        if (!res.ok) throw new Error("City not found");
        const data = await res.json();
        displayWeather(data);

        // SAVE CITY HERE
        saveCity(data.name);

    }
    catch (error) {
        showError(error.message);
    }
}
async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error("Unable to fetch location weather");

    const data = await res.json();
    displayWeather(data);

    // SAVE CITY HERE
    saveCity(data.name);

  } catch (error) {
    showError(error.message);
  }
}

const cityInput = document.getElementById("cityInput");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("errorMsg");
const locationBtn = document.getElementById("locationBtn");


// Button Event

document.getElementById("searchBtn").addEventListener("click", ()=> {
    const city = cityInput.value.trim();
    if(!city) {
        showError("Please enter a city name");
        return;
    }
    getWeatherByCity(city);
});

// Display Weather Data

function displayWeather(data){
    errorMsg.classList.add("hidden");
    weatherCard.classList.remove("hidden");

    weatherCard.innerHTML = `
    <h2 class="text-xl font-semibold">${data.name}</h2>
    <p> 🌡️ Temp: <span id="temp">${data.main.temp}</span> °C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
    `;
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
}


// Current Location Button Event

locationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      getWeatherByCoords(latitude, longitude);
    },
    () => showError("Location access denied")
  );
});

// Save City

function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}


