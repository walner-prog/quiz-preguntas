// API key y ciudad predeterminada
const apiKey = '3c743983734341f81c2486dcce043049';
const defaultCity = 'Managua';

// URLs para obtener datos del clima
const apiUrl = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=es&units=metric`;
const extendedApiUrl = (city) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=es&units=metric`;

// Iconos de clima
const weatherIcons = {
    'Clear': 'fa-sun text-warning',
    'Clouds': 'fa-cloud text-white',
    'Rain': 'fa-cloud-showers-heavy text-white',
    'Drizzle': 'fa-cloud-rain text-white',
    'Thunderstorm': 'fa-bolt text-white',
    'Snow': 'fa-snowflake text-white',
    'Mist': 'fa-smog text-white',
    'Smoke': 'fa-smog text-white',
    'Haze': 'fa-smog text-white',
    'Dust': 'fa-smog text-white',
    'Fog': 'fa-smog text-white',
    'Sand': 'fa-smog text-white',
    'Ash': 'fa-smog text-white',
    'Squall': 'fa-smog text-white',
    'Tornado': 'fa-tornado text-white'
};

let currentCity = defaultCity;
let timezoneOffset = 0;

// Función para actualizar el clima actual
function updateWeather(city) {
    fetch(apiUrl(city))
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el clima');
            }
            return response.json();
        })
        .then(data => {
            const weatherCard = document.getElementById('weather-card');
            const iconClass = weatherIcons[data.weather[0].main] || 'fa-question';
            currentCity = city;
            timezoneOffset = data.timezone;
            const now = moment.utc().add(timezoneOffset, 'seconds');
            const date = now.format('DD/MM/YYYY');
            const time = now.format('h:mm:ss A');
            const windSpeedKmh = (data.wind.speed * 3.6).toFixed(2); // Convertir de m/s a km/h
            const rainProbability = data.clouds.all ? data.clouds.all : 0; // Usar la nubosidad como probabilidad de precipitaciones

            weatherCard.innerHTML = `
                <div class="row">
                    <div class="col-6 city text-warning">${data.name}</div>
                    <div class="col-6 temp text-white">${data.main.temp}°C</div>
                </div>
                <div class="date-time">
                    <span class="date text-white">${date}</span>
                    <span class="time text-white">${time}</span>
                </div>
                <div class="details text-color">
                    <i class="fas ${iconClass} weather-icon"></i>
                    <p>Descripción: ${data.weather[0].description}</p>
                    <p><i class="fas fa-tint icon-small"></i> Humedad: ${data.main.humidity}%</p>
                    <p><i class="fas fa-wind icon-small"></i> Viento: ${windSpeedKmh} km/h</p>
                    <p><i class="fas fa-umbrella icon-small"></i> Prob. de precipitaciones: ${rainProbability}%</p>
                </div>
            `;
            updateExtendedForecast(city); // Actualizar pronóstico extendido
            updateHourlyForecast(city); // Actualizar pronóstico por hora
            updateWeatherAlerts(city); // Actualizar alertas meteorológicas
            updateAirQuality(data.coord.lat, data.coord.lon); // Actualizar calidad del aire con lat/lon
        })
        .catch(error => {
            console.error('Error al obtener el clima:', error);
        });
}

// Función para actualizar el pronóstico extendido
function updateExtendedForecast(city) {
    fetch(extendedApiUrl(city))
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el pronóstico extendido');
            }
            return response.json();
        })
        .then(data => {
            const extendedForecastContainer = document.getElementById('extended-forecast');
            extendedForecastContainer.innerHTML = ''; // Limpiar datos de pronóstico anteriores

            // Crear una fila para contener las tarjetas de pronóstico
            const forecastRow = document.createElement('div');
            forecastRow.classList.add('row');

            // Obtener la fecha actual y asegurar que comience desde el siguiente día
            const now = moment.utc().add(timezoneOffset, 'seconds').endOf('day');
            let currentDay = now.clone().add(1, 'day').startOf('day');

            // Recopilar datos de pronóstico para los próximos 7 días
            const dailyForecasts = [];

            for (const forecast of data.list) {
                const forecastTime = moment.unix(forecast.dt).utc().add(timezoneOffset, 'seconds');
                if (forecastTime.isSameOrAfter(currentDay, 'day')) {
                    dailyForecasts.push(forecast); // Agregar pronóstico si es para el nuevo día
                    currentDay.add(1, 'day').startOf('day'); // Pasar al siguiente día
                    if (dailyForecasts.length >= 7) break; // Detener recolección después de 7 días
                }
            }

            // Mostrar pronóstico para los próximos 7 días a partir de mañana
            dailyForecasts.forEach(forecast => {
                const forecastDate = moment.unix(forecast.dt).utc().add(timezoneOffset, 'seconds').format('dddd DD/MM');
                const forecastTemp = forecast.main.temp;
                const forecastIcon = weatherIcons[forecast.weather[0].main] || 'fa-question';

                // Crear tarjeta de pronóstico
                const forecastCol = document.createElement('div');
                forecastCol.classList.add('col-lg-2', 'col-md-3', 'col-sm-6', 'mb-2', 'mr-4'); // Columnas responsivas
                const forecastCard = document.createElement('div');
                forecastCard.classList.add('card', 'forecast-card', 'p-3', 'bg-dark', 'text-white');
                forecastCard.innerHTML = `
                    <div class="text-warning">${forecastDate}</div>
                    <div class="weather-icon my-2"><i class="fas ${forecastIcon}"></i></div>
                    <div class="temp text-white">${forecastTemp}°C</div>
                `;
                forecastCol.appendChild(forecastCard);
                forecastRow.appendChild(forecastCol);
            });

            // Agregar la fila al contenedor de pronóstico extendido
            extendedForecastContainer.appendChild(forecastRow);
        })
        .catch(error => {
            console.error('Error al obtener el pronóstico extendido:', error);
        });
}

// Actualizar el clima al cambiar la ciudad seleccionada
document.getElementById('city-select').addEventListener('change', (event) => {
    updateWeather(event.target.value);
});

// Función para actualizar la hora actual
function updateTime() {
    const weatherCard = document.getElementById('weather-card');
    if (weatherCard.innerHTML) {
        const now = moment.utc().add(timezoneOffset, 'seconds');
        const date = now.format('DD/MM/YYYY');
        const time = now.format('h:mm:ss A');
        const dateElement = weatherCard.querySelector('.date');
        const timeElement = weatherCard.querySelector('.time');
        dateElement.textContent = date;
        timeElement.textContent = time;
    }
}

// Inicializar la aplicación con la ciudad predeterminada
updateWeather(defaultCity);
setInterval(updateTime, 1000); // Actualizar la hora cada segundo

// URL para obtener pronóstico por hora
const hourlyApiUrl = (city) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=es&units=metric`;

// Función para actualizar el pronóstico por hora
function updateHourlyForecast(city) {
    fetch(hourlyApiUrl(city))
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el pronóstico por hora');
            }
            return response.json();
        })
        .then(data => {
            const hourlyForecastContainer = document.getElementById('hourly-forecast');
            hourlyForecastContainer.innerHTML = '';

            data.list.slice(0, 24).forEach(forecast => { // Mostrar solo las próximas 24 horas
                const forecastTime = moment.unix(forecast.dt).utc().add(timezoneOffset, 'seconds').format('HH:mm');
                const forecastTemp = forecast.main.temp;
                const forecastIcon = weatherIcons[forecast.weather[0].main] || 'fa-question';

                const forecastCard = document.createElement('div');
                forecastCard.classList.add('col', 'forecast-card');
                forecastCard.innerHTML = `
                    <div class="text-color">${forecastTime}</div>
                    <div class="weather-icon"><i class="fas ${forecastIcon}"></i></div>
                    <div class="temp text-white">${forecastTemp}°C</div>
                `;
                hourlyForecastContainer.appendChild(forecastCard);
            });
        })
        .catch(error => {
            console.error('Error al obtener el pronóstico por hora:', error);
        });
}

// URL para obtener alertas meteorológicas
const alertsApiUrl = (lat, lon) => `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${apiKey}&lang=es`;

// Función para actualizar las alertas meteorológicas
function updateWeatherAlerts(city) {
    fetch(apiUrl(city))
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener las coordenadas para las alertas');
            }
            return response.json();
        })
        .then(data => {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            fetch(alertsApiUrl(lat, lon))
                .then(response => response.json())
                .then(alertData => {
                    const alertsContainer = document.getElementById('weather-alerts');
                    alertsContainer.innerHTML = '';

                    if (alertData.alerts && alertData.alerts.length > 0) {
                        alertData.alerts.forEach(alert => {
                            const alertCard = document.createElement('div');
                            alertCard.classList.add('alert', 'alert-warning');
                            alertCard.innerHTML = `
                                <strong>${alert.event}</strong>: ${alert.description}
                                <br><small>${new Date(alert.start * 1000).toLocaleString()} - ${new Date(alert.end * 1000).toLocaleString()}</small>
                            `;
                            alertsContainer.appendChild(alertCard);
                        });
                    } else {
                        alertsContainer.innerHTML = '<div class="alert alert-warning text-secondary">No hay alertas meteorológicas.</div>';
                    }
                })
                .catch(error => {
                    console.error('Error al obtener las alertas meteorológicas:', error);
                });
        })
        .catch(error => {
            console.error('Error al obtener las coordenadas:', error);
        });
}

// URL para obtener la calidad del aire
const airQualityApiUrl = (lat, lon) => `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

// Función para obtener el icono del componente de calidad del aire
function getComponentIcon(component) {
    switch (component) {
        case 'co': return 'fa-smog';
        case 'no': return 'fa-car-crash';
        case 'no2': return 'fa-car';
        case 'o3': return 'fa-cloud';
        case 'so2': return 'fa-industry';
        case 'pm2_5': return 'fa-dust';
        case 'pm10': return 'fa-wind';
        case 'nh3': return 'fa-flask';
        default: return 'fa-question';
    }
}

// Función para actualizar la calidad del aire
function updateAirQuality(lat, lon) {
    fetch(airQualityApiUrl(lat, lon))
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la calidad del aire');
            }
            return response.json();
        })
        .then(data => {
            const airQualityContainer = document.getElementById('air-quality');
            airQualityContainer.innerHTML = '';

            const airQualityIndex = data.list[0].main.aqi;
            const airQualityDescription = getAirQualityDescription(airQualityIndex);

            const components = data.list[0].components; // Obtener los componentes de la calidad del aire

            const airQualityCard = document.createElement('div');
            airQualityCard.classList.add('air-quality-card', 'p-3', 'bg-dark', 'text-white');
            airQualityCard.innerHTML = `
                <div class="text-warning">Índice de calidad del aire:<br>   <span class="aire-indice badge-secondary border border-2 border-bottom">${airQualityIndex}</span> </div>
                <div class="text-warning">Calidad: <br> <span class="aire-indice badge-secondary border border-2 border-bottom">${airQualityDescription}</span> </div>
                <div class="text-warning">Componentes:</div>
            `;
        
            // Agregar cada componente a la tarjeta
            const componentsRow = document.createElement('div');
            componentsRow.classList.add('row');

            for (const component in components) {
                const componentCol = document.createElement('div');
                componentCol.classList.add('col-6', 'col-md-4', 'col-lg-3', 'mb-3');

                const badge = document.createElement('span');
                badge.classList.add('badge', 'bg-secondary', 'd-flex', 'align-items-center');
                badge.innerHTML = `
                    <i class="fas ${getComponentIcon(component)} me-2"></i> 
                    ${component.toUpperCase()}: ${components[component]}
                `;

                componentCol.appendChild(badge);
                componentsRow.appendChild(componentCol);
            }

            airQualityCard.appendChild(componentsRow);
            airQualityContainer.appendChild(airQualityCard);
        })
        .catch(error => {
            console.error('Error al obtener la calidad del aire:', error);
        });
}

// Función para obtener la descripción de la calidad del aire
function getAirQualityDescription(index) {
    switch(index) {
        case 1: return 'Buena';
        case 2: return 'Moderada';
        case 3: return 'No saludable para grupos sensibles';
        case 4: return 'No saludable';
        case 5: return 'Muy no saludable';
        case 6: return 'Peligrosa';
        default: return 'Desconocida';
    }
}

// Llamar a las funciones de actualización al iniciar
updateAirQuality(defaultCity);
