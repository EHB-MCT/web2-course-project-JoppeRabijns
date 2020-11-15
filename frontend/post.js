'use strict';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9wcGVyYWJpam5zIiwiYSI6ImNqNnl0dWxpNDJmeDEyeG10cWV0cnloczQifQ.YSoKiZUOwUPNMWbSPHBFbA';
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  types: 'address,poi,poi.landmark',
  countries: 'BE',
  placeholder: 'Adres toevoegen'
});

geocoder.addTo('#geocoder');

geocoder.on('result', function (e) {
  let form = document.getElementById("form");
  let formTitle = document.getElementById("formTitle");
  let formError = document.getElementById("formError");
  form.addEventListener('submit', (event) => {
    let name = document.getElementById("formName").value;
    let description = document.getElementById("formDescription").value;
    let restaurantData = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          e.result.center[1], e.result.center[0]
        ]
      },
      "properties": {
        "name": `${name}`,
        "description": `${description}`,
        "address": `${e.result.place_name}`,
      }
    };
    if (name == "" || description == "") {
      formError.innerHTML = "Gelieve alle velden in te vullen!";
      event.preventDefault();
    } else {
      formTitle.innerHTML = "Restaurant toegevoegd!";
      postData(restaurantData);
      event.preventDefault();
    }
  });
});

async function postData(restaurantData) {
  let response = await fetch('http://localhost:3000/api/restaurants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restaurantData)
  });
  let data = await response.json();
}