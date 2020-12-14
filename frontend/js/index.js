'use strict';

document.getElementById("form").addEventListener("submit", (event) => {
  event.preventDefault();
  let typeString = "";
  for (let i = 1; i < 9; i++) {
    let type = document.getElementById('checkbox-' + [i]);
    if (type.checked) {
      typeString += type.value;
      typeString += ",";
    }
  }
  let search = document.getElementById("formSearchbar").value;
  addToLocalstorage(search, typeString);
  window.location = "./searchresults.html";
});

function addToLocalstorage(search, typeString) {
  if (typeof (Storage) !== "undefined") {
    localStorage.setItem("search", "");
    localStorage.setItem("types", "");
    localStorage.setItem("search", search);
    localStorage.setItem("types", typeString);
  }
}

async function getFavorites() {
  let userId = localStorage.getItem("userId");
  await fetch('http://localhost:3000/api/favourites', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userId)
    })
    .then(response => response.json())
    .then(data => console.log(data))
}