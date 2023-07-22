const request = require('request');
const dotenv = require('dotenv');
dotenv.config({ path: './src/utils/.env' });
const key = process.env.POSITIONSTACK_KEY;

const reverseGeocode = (lat, long, callback) => {
  const url = `http://api.positionstack.com/v1/reverse?access_key=${key}&query=${lat},${long}&limit=1`;
  request({ url, json: true, }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to Positionstack.');
    } else if (!body.data || body.data.length === 0) {
      callback('Unable to find location. Try another search.');
    } else {
      callback(undefined, body.data[0])
    }
  });
}

module.exports = reverseGeocode;