const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const cors = require('cors'); 

const app = express();
const port = 3000;

// OpenWeatherMap API details
const apiKey = '35f28c859e9e19b9c301a2151dd554dc';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create table to store weather data
db.serialize(() => {
  db.run("CREATE TABLE weather (city TEXT, temperature REAL, description TEXT, humidity INTEGER, wind_speed REAL)");
});

// Middleware
app.use(express.json());
app.use(cors()); 

// Route to fetch weather data
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {

    const response = await axios.get(weatherUrl, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric'
      }
    });

    const { temp } = response.data.main;
    const { description } = response.data.weather[0];
    const { humidity } = response.data.main;
    const { speed } = response.data.wind;


    db.run("INSERT INTO weather (city, temperature, description, humidity, wind_speed) VALUES (?, ?, ?, ?, ?)",
      [city, temp, description, humidity, speed]);

   
    res.json({
      city,
      temperature: temp,
      description,
      humidity,
      windSpeed: speed
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
