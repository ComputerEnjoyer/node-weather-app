const dotenv = require('dotenv');
const request = require('request');

dotenv.config({ path: './src/utils/.env' });
const key = process.env.WEATHERSTACK_KEY;

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${key}&query=${latitude},${longitude}`;

  request({ url, json: true, }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to Weatherstack.');
    } else if (body.error) {
      callback('Unable to get weather data. Try another search.');
    } else {
      callback(undefined,
        `${body.current.temperature}°C and ${body.current.weather_descriptions[0].toLowerCase()}. Feels like ${body.current.feelslike}°C`);
    }
  })
}

module.exports = forecast;