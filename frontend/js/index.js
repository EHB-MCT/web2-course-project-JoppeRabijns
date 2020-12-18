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

let token = localStorage.getItem("token");
let userId = localStorage.getItem("userId");

fetch(`https://web2-course-project-api-jopper.herokuapp.com/api/userData/${userId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  }
}).then(response => response.json()
  .then(userData => userDataFunctions(userData))
);

function userDataFunctions(userData) {
  getFavorites(userData);
  firstLoginNotification(userData);
}

function firstLoginNotification(userData) {
  var visited = sessionStorage.getItem("visited");
  if (!visited) {
    setTimeout(function () {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        position: "top",
        timer: 5000,
        allowOutsideClick: true,
        imageUrl: './images/logoIcon.png',
        imageWidth: 50,
        imageHeight: 50,
        padding: "0px",
        width: "300px",
        title: `Welcome ${userData.name}!`
      });
    }, 1000);
    sessionStorage.setItem("visited", true);
  }
}


async function getFavorites(userData) {
  let favoriteData = [];
  favoriteData.push(userData.favorites);
  let HTML = "";
  if (favoriteData[0].length === 0) {
    HTML += `<h1>You have no favorites</h1>`;
    document.getElementById("favorites").innerHTML = HTML;
  } else {
    await fetch(`https://api.spoonacular.com/recipes/informationBulk?apiKey=e4f30bc969de44a4b595088db3015ab3&ids=${userData.favorites}`)
      .then(response => response.json())
      .then(data => {
        console.log(data),
          addRecipe(data, userData);
      })

  }
}


function addRecipe(data, userData) {
  let favoriteData = [];
  favoriteData.push(userData.favorites);
  let HTML = "";
  if (favoriteData[0].length === 0) {
    HTML += `<h1>You have no favorites</h1>`;
    document.getElementById("favorites").innerHTML = HTML;
  } else {
    for (let key in userData.favorites) {
      HTML += `<div id="card">
    <div id="cardImageDiv">
       <div id="checkbox">
           <input class="checkbox"id='${data[key].id}' checked type="checkbox">
      </div>
        <div id="cardInfoTime">
            <h6 id="cardInfoText"><i class="icon-clock"></i>${data[key].readyInMinutes}</h6>
        </div>
        <img id="cardImage" src="${data[key].image}" alt="">
    </div>
    <h2 id="cardTitle">${data[key].title}</h2>
    <button class="cardButton" id="button-${data[key].id}">Bekijk</button>
  </div>`;
    }
    document.getElementById("cards").innerHTML = HTML;
    for (let key in data) {
      document.getElementById(`button-${data[key].id}`).addEventListener("click", () => {
        localStorage.setItem("idRecipe", data[key].id);
        window.location = "./recipeResult.html";
      });
      document.getElementById(`${data[key].id}`).addEventListener("change", () => {
        let index = userData.favorites.indexOf(`${data[key].id}`)
        data.splice(index, 1);
        userData.favorites.splice(index, 1);
        addRecipe(data, userData);
        sendToDatabase(userData.favorites);
      });
    }
  }
}

async function sendToDatabase(favoritesArray) {
  let id = localStorage.getItem("userId");
  await fetch(`https://web2-course-project-api-jopper.herokuapp.com/api/updateFavorites/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      favorites: favoritesArray
    })
  });
  console.log('recipe removed!');
}