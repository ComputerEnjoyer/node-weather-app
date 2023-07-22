const path = require('path');
const express = require('express');
const hbs = require('hbs');

const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');
const reverseGeocode = require('./utils/reverseGeocode');

// Instantiate the server
const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory to serve
app.use(express.static(publicDir));

// .get() tells the server what to do when urls are called. '' denotes index.
app.get('', (req, res) => {
  // you render() dynamic pages, using the page name as the first argument, and whatever dynamic data you want to supply as the second.
  res.render('index', {
    title: 'Weather App',
    name: 'Nicolaas Netherland',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About this here app',
    name: "Geowfrix Fartington",
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help me!',
    helpMessage: 'HOW DO I POST ON THE COMPUTER',
    name: 'Dookie Dingle',
  });
});

// You can serve JSON responses by simply sending back an object or an array of objects.
app.get('/weather', (req, res) => {
  if (!req.query.location) {
    return res.send({
      error: 'You must provide a location.',
    });
  }

  geocode(req.query.location, (error, { latitude, longitude, locality } = {}) => {
    if (error) {
      return res.send({
        error: error,
      });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error: error,
        });
      }
      res.send({
        locality,
        forecast: forecastData,
      });
    });
  });
});

app.get('/current', (req, res) => {
  const { lat, long } = req.query;
  reverseGeocode(lat, long, (error, { region } = {}) => {
    if (error) {
      return res.send({
        error: error,
      });
    }

    forecast(lat, long, (error, forecastData) => {
      if (error) {
        return res.send({
          error: error,
        });
      }
      res.send({
        region,
        forecast: forecastData
      });
    });
  });
});

// Handle 404s. You can serve specific 404s based on directory.
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404 not found',
    message: `We couldn't find that article.`,
    name: 'Sam Gallows',
  });
});

// Or you can handle 404s as wildcard URLs. '*' means " all other addresses not otherwise specified."
app.get('*', (req, res) => {
  res.render('404', {
    title: '404 not found',
    message: `Invalid URL.`,
    name: 'Poopypants McGee',
  });
});

// Start the server on port 3000
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});