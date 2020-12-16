'use strict';
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9wcGVyYWJpam5zIiwiYSI6ImNqNnl0dWxpNDJmeDEyeG10cWV0cnloczQifQ.YSoKiZUOwUPNMWbSPHBFbA';
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  types: 'address,poi,poi.landmark',
  countries: 'BE',
  placeholder: 'Address'
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
      "type": "Feauture",
      "name": `${name}`,
      "address": e.result.place_name,
      "description": `${description}`,
      "coordinate1": e.result.center[0],
      "coordinate2": e.result.center[1]
    };
    if (name == "" || description == "") {
      formError.innerHTML = "Please fill in all the fields";
      event.preventDefault();
    } else {
      event.preventDefault();
      postData(restaurantData);

      const alert = Swal.mixin({
        position: 'center',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      });
      alert.fire({
        icon: 'success',
        title: 'Added restaurant successfully'
      });

      setTimeout(function () {
        window.location = "./restaurants.html";
      }, 2500);
    }
  });
});

async function postData(restaurantData) {
  await fetch('https://web2-course-project-api-jopper.herokuapp.com/api/restaurants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restaurantData)
  });
}