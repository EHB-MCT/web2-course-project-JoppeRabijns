'use strict';
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9wcGVyYWJpam5zIiwiYSI6ImNqNnl0dWxpNDJmeDEyeG10cWV0cnloczQifQ.YSoKiZUOwUPNMWbSPHBFbA';

var map = new mapboxgl.Map({
  container: 'map',
  center: [4.7005176, 50.8798438],
  zoom: 13,
  style: 'mapbox://styles/mapbox/light-v10'
});

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: true,
  types: 'place,postcode',
  countries: 'BE',
  placeholder: 'Enter a city',
  zoom: 13
});

map.addControl(geocoder, 'top-right');
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}));

fetchData();

async function fetchData() {
  let response = await fetch('https://web2-course-project-api-jopper.herokuapp.com/api/restaurants');
  let data = await response.json();
  createMarkers(data);
  createRestaurantList(data);
}


function createMarkers(data) {
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let logo = document.createElement('div');
      logo.className = 'marker';
      let marker = new mapboxgl.Marker(logo, {
          anchor: 'bottom'
        })
        .setLngLat([data[key].geometry.coordinates[1], data[key].geometry.coordinates[0]])
        .setPopup(new mapboxgl.Popup({
          anchor: 'top'
        }).setHTML(`<div id="popup"><h4>${data[key].properties.name}<h6>${data[key].properties.address}</h6></div>`)) // add popup
        .addTo(map);
    }
  }
}

function createRestaurantList(data) {
  for (let key in data) {
    let long = data[key].geometry.coordinates[1];
    let lang = data[key].geometry.coordinates[0];
    let restaurantData = data[key].properties;
    var restaurants = document.getElementById('restaurants');
    let restaurant = restaurants.appendChild(document.createElement('div'));
    restaurant.className = 'restaurantStyle';
    restaurant.id = "restaurant-" + restaurantData.id;
    let link = restaurant.appendChild(document.createElement('h4'));
    link.className = 'title';
    restaurant.addEventListener("click", () => {
      map.flyTo({
        center: [long, lang],
        zoom: 17
      })
    })
    link.innerHTML = restaurantData.name;
    link.id = "link-" + restaurantData.id;
    let details = restaurant.appendChild(document.createElement('h4'));
    details.className = 'description';
    details.innerHTML = restaurantData.description;
    let address = restaurant.appendChild(document.createElement('h6'));
    address.className = 'address';
    address.innerHTML = restaurantData.address;
  }

}