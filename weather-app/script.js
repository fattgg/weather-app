const API_KEY = import.meta.env.VITE_WEATHER_KEY;
console.log("API Key:", API_KEY);

const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const result = document.getElementById('weather-result');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const errorMsg = document.getElementById('error-message');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const uv = document.getElementById('uv');
const windDir = document.getElementById('wind-dir');
const forecastContainer = document.getElementById('forecast');
const astronomyContainer = document.getElementById('astronomy');
const timezoneContainer = document.getElementById('timezone');
const airQualityContainer = document.getElementById('air-quality');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    try {
        errorMsg.classList.add('hidden');
        result.classList.add('hidden');

        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes&alerts=no`);
        if (!res.ok) throw new Error('City not found');

        const data = await res.json();
        const current = data.current;
        const location = data.location;

        cityName.textContent = `${location.name}, ${location.country}`;
        weatherIcon.src = `https:${current.condition.icon}`;
        weatherIcon.alt = current.condition.text;
        temperature.textContent = `🌡️ ${current.temp_c} °C`;
        description.textContent = `☁️ ${current.condition.text}`;
        humidity.textContent = `💧 Humidity: ${current.humidity}%`;
        wind.textContent = `💨 Wind: ${current.wind_kph} km/h`;
        uv.textContent = `🔆 UV Index: ${current.uv}`;
        windDir.textContent = `🧭 Wind Direction: ${current.wind_dir}`;

        forecastContainer.innerHTML = '<h3>📅 3-Day Forecast</h3>';
        data.forecast.forecastday.forEach(day => {
            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <strong>${day.date}</strong><br>
                    <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
                    ${day.day.maxtemp_c}° / ${day.day.mintemp_c}°<br>
                    ${day.day.condition.text}
                </div>
            `;
        });

        astronomyContainer.innerHTML = `
            <h3>🌙 Astronomy</h3>
            🌅 Sunrise: ${data.forecast.forecastday[0].astro.sunrise}<br>
            🌇 Sunset: ${data.forecast.forecastday[0].astro.sunset}<br>
            🌘 Moon Phase: ${data.forecast.forecastday[0].astro.moon_phase}<br>
            💡 Moon Illumination: ${data.forecast.forecastday[0].astro.moon_illumination}%
        `;

        timezoneContainer.innerHTML = `
            <h3>🕒 Local Time</h3>
            ${location.localtime}
        `;

        airQualityContainer.innerHTML = `
            <h3>🫁 Air Quality</h3>
            PM2.5: ${current.air_quality.pm2_5.toFixed(1)}<br>
            PM10: ${current.air_quality.pm10.toFixed(1)}<br>
            O3: ${current.air_quality.o3.toFixed(1)}<br>
            CO: ${current.air_quality.co.toFixed(1)}<br>
        `;

        result.classList.remove('hidden');
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    }
});

const darkToggle = document.getElementById('dark-toggle');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}

darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.removeItem('theme');
    }
});

