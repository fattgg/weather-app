const API_KEY = import.meta.env.VITE_WEATHER_KEY;

const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const result = document.getElementById('weather-result');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const errorMsg = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    try {
        errorMsg.classList.add('hidden');
        result.classList.add('hidden');

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!res.ok) throw new Error('City not found');

        const data = await res.json();
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].main;
        temperature.textContent = `🌡️ ${data.main.temp} °C`;
        description.textContent = `☁️ ${data.weather[0].description}`;

        result.classList.remove('hidden');
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    }
});
