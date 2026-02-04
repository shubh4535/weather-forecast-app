const API_KEY = "95219ab4844c9a53a98448897a670227";

let isCelsius = true;
let currentTempCelsius = null;

// Fetched weather data based on city with API error handling

async function getWeatherByCity(city){
    try {
        const res = await fetch(
           `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        )
        if (!res.ok) throw new Error("City not found");
        const data = await res.json();
        currentTempCelsius = data.main.temp;
        isCelsius = true;

        displayWeather(data);
        applyWeatherEffects(data);
        getFiveDayForecast(data.coord.lat, data.coord.lon);



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
    currentTempCelsius = data.main.temp;
    isCelsius = true;

    displayWeather(data);
    applyWeatherEffects(data);
    getFiveDayForecast(data.coord.lat, data.coord.lon);



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
    <p> 🌡️ Temp: 
      <span id="temp">${data.main.temp}</span>
      <span id="unit">°C</span>

      <button onclick="toggleTemperature()" class="ml-2 text-blue-600 underline">
        Toggle °C/°F
      </button>
    </p>
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

// Temperature  Toggle


function toggleTemperature() {
  const tempSpan = document.getElementById("temp");
   const unitSpan = document.getElementById("unit");

  if (isCelsius) {
    tempSpan.textContent = ((currentTempCelsius * 9) / 5 + 32).toFixed(1);
    unitSpan.textContent = "°F";
    isCelsius = false;
  } else {
    tempSpan.textContent = currentTempCelsius.toFixed(1);
    unitSpan.textContent = "°C";
    isCelsius = true;
  }
}

function applyWeatherEffects(data) {
  document.body.className = "";

  if (data.main.temp > 40) {
    showError("⚠️ Extreme heat alert!");
  }

  const condition = data.weather[0].main;

  if (condition === "Rain") {
    document.body.classList.add("bg-gray-700");
  } else if (condition === "Clear") {
    document.body.classList.add("bg-blue-200");
  } else if (condition === "Clouds") {
    document.body.classList.add("bg-gray-300");
  }
}

async function getFiveDayForecast(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  const data = await res.json();
  displayForecast(data.list);
}

const forecastContainer = document.getElementById("forecast");

function displayForecast(list) {
  forecastContainer.innerHTML = "";

  const dailyData = list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.forEach(day => {
    forecastContainer.innerHTML += `
      <div class="p-3 bg-white rounded shadow text-center">
        <p class="font-semibold">${day.dt_txt.split(" ")[0]}</p>
        <p>🌡️ ${day.main.temp} °C</p>
        <p>💧 ${day.main.humidity}%</p>
        <p>💨 ${day.wind.speed} m/s</p>
      </div>
    `;
  });
}

