const API_KEY = "95219ab4844c9a53a98448897a670227";

let isCelsius = true;
let currentTempCelsius = null;

// DOM Elements
const cityInput = document.getElementById("cityInput");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("errorMsg");
const locationBtn = document.getElementById("locationBtn");
const recentCitiesSelect = document.getElementById("recentCities");

/* ============================
   FETCH WEATHER BY CITY
============================ */

async function getWeatherByCity(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    currentTempCelsius = data.main.temp;
    isCelsius = true;

    displayWeather(data);
    applyWeatherEffects(data);

    saveCity(data.name);
    loadRecentCities();
  } catch (error) {
    showError(error.message);
  }
}

/* ============================
   FETCH WEATHER BY LOCATION
============================ */

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

    saveCity(data.name);
    loadRecentCities();
  } catch (error) {
    showError(error.message);
  }
}

/* ============================
   SEARCH BUTTON
============================ */

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name");
    return;
  }
  getWeatherByCity(city);
});

/* ============================
   DISPLAY WEATHER
============================ */

function displayWeather(data) {
  errorMsg.classList.add("hidden");
  weatherCard.classList.remove("hidden");

  weatherCard.innerHTML = `
    <h2 class="text-xl font-semibold">${data.name}</h2>
    <p>
      🌡️ Temp:
      <span id="temp">${data.main.temp.toFixed(1)}</span>
      <span id="unit">°C</span>
      <button onclick="toggleTemperature()" class="ml-2 text-blue-600 underline">
        Toggle °C/°F
      </button>
    </p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
  `;
}

/* ============================
   ERROR HANDLER
============================ */

function showError(msg) {
  weatherCard.classList.add("hidden");
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
}

/* ============================
   LOCATION BUTTON
============================ */

locationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      getWeatherByCoords(latitude, longitude);
    },
    () => showError("Location access denied")
  );
});

/* ============================
   SAVE & LOAD RECENT CITIES
============================ */

function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}

function loadRecentCities() {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (cities.length === 0) return;

  recentCitiesSelect.innerHTML =
    `<option value="">Recent searches</option>`;

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    recentCitiesSelect.appendChild(option);
  });

  recentCitiesSelect.classList.remove("hidden");
}

recentCitiesSelect.addEventListener("change", () => {
  if (recentCitiesSelect.value) {
    getWeatherByCity(recentCitiesSelect.value);
  }
});

/* ============================
   TEMPERATURE TOGGLE
============================ */

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

/* ============================
   WEATHER EFFECTS
============================ */

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

/* ============================
   INIT
============================ */

loadRecentCities();
