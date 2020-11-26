'use strict';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9wcGVyYWJpam5zIiwiYSI6ImNqNnl0dWxpNDJmeDEyeG10cWV0cnloczQifQ.YSoKiZUOwUPNMWbSPHBFbA';
var map = new mapboxgl.Map({
  container: 'map',
  center: [4.7005176, 50.8798438],
  zoom: 13,
  style: 'mapbox://styles/mapbox/light-v10'
});

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
        .addTo(map);
    }
  }
}

function createRestaurantList(data) {
  for (let key in data) {
    let restaurantData = data[key].properties;
    let restaurants = document.getElementById('restaurants');
    let restaurant = restaurants.appendChild(document.createElement('div'));
    restaurant.className = 'restaurantStyle';
    restaurant.id = "restaurant-" + restaurantData.id;
    let link = restaurant.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
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