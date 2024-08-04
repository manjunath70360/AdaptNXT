import React, { useState, useEffect } from 'react';
import { WiHumidity } from "react-icons/wi";
import { LuWind } from "react-icons/lu";
import axios from 'axios';
import './index.css'; 

const App = () => {
  const [city, setCity] = useState('Hyderabad');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://adaptnxt-vgay.onrender.com/weather`, {
        params: {
          city: city
        }
      });
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(); 
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeather();
    }
  };

  const getWeatherImage = (weather) => {
    if (weather === 'Clouds') return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/cloud_eijeb3.png';
    if (weather === 'haze') return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/cloud_eijeb3.png';
    if (weather === 'Drizzle') return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/drizzle_maygnu.png';
    if (weather === 'Clear') return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/sun_sscjae.png';
    if (weather === 'clear sky') return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/sun_sscjae.png';
    return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/drizzle_maygnu.png';
  };

  const getBackgroundClass = (weather) => {
    if (weather === 'Clouds') return 'cloudy';
    if (weather === 'Drizzle') return 'drizzle';
    if (weather === 'Clear') return 'clear';
    if (weather === 'clear sky') return 'clear';
     return 'drizzle';
  };

  return (
    <div className={`app-container ${weatherData ? getBackgroundClass(weatherData.description) : ''}`}>
      <h1 className="app-title">Weather App</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="search-input"
        />
         </form>
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {weatherData && (
        <div className='weather-data-con'>
          <img
            src={getWeatherImage(weatherData.description)}
            alt={weatherData.description}
            className="weather-image"
          />
          <div className="weather-info">
            <h2 className="weather-temperature">{Math.round(weatherData.temperature)}°C</h2>
            <p className="weather-description">{weatherData.description}</p>
            <p className="weather-location">
              {weatherData.city}, <strong>{weatherData.country}</strong>
            </p>
            <div className='icons-con'>
              <div className='weather-icon-text'>
                <WiHumidity className='icon'/>
                <div className='weather-text-con'>
                  <p className="weather-details">{weatherData.humidity}%</p>
                  <p className='des'>Humidity</p>
                </div>
              </div>
              <div className='weather-icon-text'>
                <LuWind className='icon'/>
                <div className='weather-text-con'>
                  <p className="weather-details">{weatherData.windSpeed} Km/h</p>
                  <p className='des'>Wind Speed</p>
                </div>
              </div>
            </div>  
          </div>
        </div>    
      )}
    </div>
  );
};

export default App;
