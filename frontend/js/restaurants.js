'use strict';
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9wcGVyYWJpam5zIiwiYSI6ImNqNnl0dWxpNDJmeDEyeG10cWV0cnloczQifQ.YSoKiZUOwUPNMWbSPHBFbA';

var map = new mapboxgl.Map({
  container: 'map',
  center: [4.7005176, 50.8798438],
  zoom: 13,
  style: 'mapbox://styles/mapbox/light-v10'
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

fetchData();

async function fetchData() {
  showLoader();
  await fetch('https://web2-course-project-api-jopper.herokuapp.com/api/restaurants')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      createMarkers(data), createRestaurantList(data), sortOnLocationGeocoder(data), sortOnLocationGeolocation(data)
    });
  hideLoader();
}

let geocoder = new MapboxGeocoder({
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
    let searchResult = [ev.coords.latitude, ev.coords.longitude];
    let options = {
      units: 'kilometers'
    };
    data.forEach(function (restaurantData) {
      let coordinates = [restaurantData.coordinate2, restaurantData.coordinate1];
      Object.defineProperty(restaurantData, 'distance', {
        value: turf.distance(coordinates, searchResult, options),
        writable: true,
        enumerable: true,
        configurable: true
      })
    });

    data.sort(function (a, b) {
      if (a.distance > b.distance) {
        return 1;

      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });

    let sortedRestaurants = document.getElementById('restaurants');
    while (sortedRestaurants.firstChild) {
      sortedRestaurants.removeChild(sortedRestaurants.firstChild);
    }
    createRestaurantList(data);
  });
}

function sortOnLocationGeocoder(data) {
  geocoder.on('result', function (ev) {
    let searchResult = ev.result.geometry;
    let options = {
      units: 'kilometers'
    };
    data.forEach(function (restaurantData) {
      let coordinates = [restaurantData.coordinate1, restaurantData.coordinate2];
      Object.defineProperty(restaurantData, 'distance', {
        value: turf.distance(coordinates, searchResult, options),
        writable: true,
        enumerable: true,
        configurable: true
      })
    });

    data.sort(function (a, b) {
      if (a.distance > b.distance) {
        return 1;

      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });

    let sortedRestaurants = document.getElementById('restaurants');
    while (sortedRestaurants.firstChild) {
      sortedRestaurants.removeChild(sortedRestaurants.firstChild);
    }
    createRestaurantList(data);
  });
}

function createMarkers(data) {
  var numberOfRestaurants = Object.keys(data).length;
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let logo = document.createElement('div');
      logo.className = 'marker';
      logo.id = data[key]._id;
      logo.coordinates = [data[key].coordinate1, data[key].coordinate2];
      let marker = new mapboxgl.Marker(logo, {
          anchor: 'bottom'
        })
        .setLngLat([data[key].coordinate1, data[key].coordinate2])
        .setPopup(new mapboxgl.Popup({
          anchor: 'top'
        }).setHTML(`<div id="popup"><h4>${data[key].name}<h6>${data[key].address}</h6></div>`)) // add popup
        .addTo(map);
      document.getElementById(logo.id).addEventListener("click", () => {
        map.flyTo({
          center: logo.coordinates,
          essential: true,
          zoom: 16
        });
        for (let i = 0; i < numberOfRestaurants; i++) {
          let div = document.getElementById("restaurants").childNodes[i];
          div.style.backgroundColor = "#ffffff";
        }
        document.getElementById(logo.id).style.backgroundColor = "#f2f8e1";
        document.getElementById(logo.id).scrollIntoView({
          behavior: "smooth"
        });
      });
    }
  }
}

function createRestaurantList(data) {
  var numberOfRestaurants = Object.keys(data).length;
  for (let key in data) {
    let long = data[key].coordinate1;
    let lang = data[key].coordinate2;
    let restaurants = document.getElementById('restaurants');
    let restaurant = restaurants.appendChild(document.createElement('div'));
    restaurant.className = 'restaurantStyle';
    restaurant.id = data[key]._id;
    let link = restaurant.appendChild(document.createElement('h4'));
    link.className = 'title';
    restaurant.addEventListener("click", () => {
      map.flyTo({
        center: [long, lang],
        zoom: 16
      })
      for (let i = 0; i < numberOfRestaurants; i++) {
        let div = document.getElementById("restaurants").childNodes[i];
        div.style.backgroundColor = "#ffffff";
      }
      restaurant.style.backgroundColor = "#f2f8e1";
    });
    link.innerHTML = data[key].name;
    let details = restaurant.appendChild(document.createElement('h4'));
    details.className = 'description';
    details.innerHTML = data[key].description;
    let address = restaurant.appendChild(document.createElement('h6'));
    address.className = 'address';
    address.innerHTML = data[key].address;

    //distance
    let distance = restaurant.appendChild(document.createElement('h6'));
    distance.innerHTML = data[key].distance;
    distance.className = 'distance';
    if (distance.innerHTML == "undefined") {
      distance.removeChild(distance.firstChild);
      distance.style.display = "none";
    } else {
      distance.innerHTML = parseFloat(data[key].distance).toFixed(1) + " km";
    }
  }
}