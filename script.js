const API_KEY = "95219ab4844c9a53a98448897a670227";

async function getWeatherByCity(city){
    try {
        const res = await fetch(
           `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        )
        if (!res.ok) throw new Error("City not found");
        const data = await res.json();
        displayWeather(data);
    }
    catch (error) {
        showError(error.message);
    }
}
