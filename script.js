const apiKey = '7ca5ed1e692ce29323f547f56316e950'; // Your API key
let map;

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const alertBox = document.getElementById('alert');
    const weatherCard = document.getElementById('weatherCard');
    const mapElement = document.getElementById('map');
    const weatherIcon = document.getElementById('weatherIcon');

    if (!city) {
        alertBox.style.display = 'block';
        alertBox.textContent = 'Please enter a city name!';
        weatherCard.style.display = 'none';
        mapElement.style.display = 'none';
        return;
    }

    alertBox.style.display = 'none';
    weatherCard.style.display = 'none';
    mapElement.style.display = 'none';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const statusCode = response.status;

        if (!response.ok) {
            if (statusCode === 401) {
                throw new Error('Invalid API key. Please check your API key.');
            } else if (statusCode === 404) {
                throw new Error('City not found. Please check the city name.');
            } else {
                throw new Error(`API error: ${statusCode}`);
            }
        }

        const data = await response.json();

        document.getElementById('cityName').textContent = data.name;
        document.getElementById('temperature').textContent = data.main.temp;
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        document.getElementById('windSpeed').textContent = data.wind.speed;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherCard.style.display = 'block';

        const lat = data.coord.lat;
        const lon = data.coord.lon;

        mapElement.style.display = 'block';

        if (!map) {
            map = L.map('map').setView([lat, lon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([lat, lon], 10);
        }

        L.marker([lat, lon]).addTo(map).bindPopup(`<b>${data.name}</b><br>Weather: ${data.weather[0].description}`).openPopup();

    } catch (error) {
        alertBox.style.display = 'block';
        alertBox.textContent = `Error: ${error.message}`;
        console.error(error);
    }
}