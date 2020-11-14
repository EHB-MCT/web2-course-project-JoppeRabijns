'use strict';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9wcGVyYWJpam5zIiwiYSI6ImNqNnl0dWxpNDJmeDEyeG10cWV0cnloczQifQ.YSoKiZUOwUPNMWbSPHBFbA';
var map = new mapboxgl.Map({
  container: 'map',
  center: [3.7005176, 50.5798438],
  zoom: 7,
  style: 'mapbox://styles/mapbox/light-v10'
});


fetchData();


async function fetchData() {
  let response = await fetch('http://localhost:3000/api/restaurants');
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
        .addTo(map);
    }
  }
}

function createRestaurantList(data) {
  for (let key in data) {
    let restaurantData = data[key].properties;
    let restaurants = document.getElementById('restaurants');
    let restaurant = restaurants.appendChild(document.createElement('div'));
    restaurant.id = "restaurant-" + restaurantData.name;
    restaurant.className = 'restaurantStyle';
    let link = restaurant.appendChild(document.createElement('a'));
    link.className = 'title';
    link.id = "link-" + restaurantData.name;
    link.innerHTML = restaurantData.name;
    let details = restaurant.appendChild(document.createElement('div'));
    details.innerHTML = restaurantData.description;
    let address = restaurant.appendChild(document.createElement('div'));
    address.innerHTML = restaurantData.address;
  }
}