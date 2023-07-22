const $weatherForm = document.querySelector('form');
const $search = document.querySelector('#search');
const $geolocate = document.querySelector('#geolocate');

const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

messageOne.textContent = '';
messageTwo.textContent = '';


$weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  messageOne.textContent = 'Loading...';
  messageTwo.textContent = '';

  const location = $search.value;
  fetch(`/weather?location=${encodeURIComponent(location)}`).then((res) => {
    res.json().then((data) => {
      if (data.error) {
        messageOne.textContent = data.error;
      } else {
        messageOne.textContent = data.locality;
        messageTwo.textContent = data.forecast;
      }
    });
  });
});

$geolocate.addEventListener('click', async () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }
  messageOne.textContent = 'Loading...';
  messageTwo.textContent = '';

  await navigator.geolocation.getCurrentPosition(async (pos) => {
    const currentLocation = {
      lat: pos.coords.latitude,
      long: pos.coords.longitude,
    }

    fetch(`/current?lat=${currentLocation.lat}&long=${currentLocation.long}`).then((res) => {
      res.json().then((data) => {
        if (data.error) {
          messageOne.textContent = data.error;
        } else {
          messageOne.textContent = data.region;
          messageTwo.textContent = data.forecast;
        }
      });
    });
  }, (error) => console.log(error));

});