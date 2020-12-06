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
  sortOnLocationGeocoder(data);
  sortOnLocationGeolocation(data);
}


var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: true,
  types: 'place,postcode',
  countries: 'BE',
  placeholder: 'Enter a city'
});

map.addControl(geocoder, 'top-right');


let geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
    watchPosition: true
  },
  trackUserLocation: true
});
map.addControl(geolocate);


function sortOnLocationGeolocation(data) {
  geolocate.on('geolocate', function (ev) {
    console.log(ev);
    var searchResult = [ev.coords.latitude, ev.coords.longitude];
    console.log(searchResult);
    var options = {
      units: 'kilometers'
    };
    data.forEach(function (restaurantData) {
      let coordinates = [restaurantData.geometry.coordinates[0], restaurantData.geometry.coordinates[1]];
      Object.defineProperty(restaurantData.properties, 'distance', {
        value: turf.distance(coordinates, searchResult, options),
        writable: true,
        enumerable: true,
        configurable: true
      })
    });

    data.sort(function (a, b) {
      if (a.properties.distance > b.properties.distance) {
        return 1;

      }
      if (a.properties.distance < b.properties.distance) {
        return -1;
      }
      return 0;
    });

    var sortedRestaurants = document.getElementById('restaurants');
    while (sortedRestaurants.firstChild) {
      sortedRestaurants.removeChild(sortedRestaurants.firstChild);
    }

    createRestaurantList(data);
  });
}

function sortOnLocationGeocoder(data) {
  console.log(data);
  geocoder.on('result', function (ev) {
    var searchResult = ev.result.geometry;
    console.log(searchResult);
    var options = {
      units: 'kilometers'
    };
    data.forEach(function (restaurantData) {
      let coordinates = [restaurantData.geometry.coordinates[1], restaurantData.geometry.coordinates[0]];
      Object.defineProperty(restaurantData.properties, 'distance', {
        value: turf.distance(coordinates, searchResult, options),
        writable: true,
        enumerable: true,
        configurable: true
      })
    });

    data.sort(function (a, b) {
      if (a.properties.distance > b.properties.distance) {
        return 1;

      }
      if (a.properties.distance < b.properties.distance) {
        return -1;
      }
      return 0;
    });

    var sortedRestaurants = document.getElementById('restaurants');
    while (sortedRestaurants.firstChild) {
      sortedRestaurants.removeChild(sortedRestaurants.firstChild);
    }

    createRestaurantList(data);
  });
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
    /*   document.getElementById(data[key].geometry.coordinates[1]).addEventListener('click', function () {
        console.log(data[key]._id);
        map.flyTo({
          center: [data[key].geometry.coordinates[1], data[key].geometry.coordinates[0]],
          essential: true,
          zoom: 16
        });
      }); */
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
    restaurant.id = data[key].geometry.coordinates[1];
    let link = restaurant.appendChild(document.createElement('h4'));
    link.className = 'title';
    restaurant.addEventListener("click", () => {
      map.flyTo({
        center: [long, lang],
        zoom: 17
      })
    });
    link.innerHTML = restaurantData.name;
    let details = restaurant.appendChild(document.createElement('h4'));
    details.className = 'description';
    details.innerHTML = restaurantData.description;
    let address = restaurant.appendChild(document.createElement('h6'));
    address.className = 'address';
    address.innerHTML = restaurantData.address;
    let distance = restaurant.appendChild(document.createElement('h6'));

    //distance
    distance.innerHTML = restaurantData.distance;
    distance.className = 'distance';
    if (distance.innerHTML == "undefined") {
      distance.removeChild(distance.firstChild);
      distance.style.display = "none";
    } else {
      distance.innerHTML = parseFloat(restaurantData.distance).toFixed(1) + " km";
    }
  }
}