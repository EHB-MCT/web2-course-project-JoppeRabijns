'use strict';

fetchData();

async function fetchData() {
  let search = localStorage.getItem("search");
  let types = localStorage.getItem("types");
  let response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=cee7a81c28e441efa3b14a67c611c790&intolerances=gluten&number=8&query=${search}&addRecipeInformation=true&type=${types}`);
  let data = await response.json();
  console.log(data);
  addRecipe(data);
  sort(data);
  filter(data);
}

function addRecipe(data) {
  let HTML = "";
  if (data.results == 0) {
    HTML += `<h1>No recipe were found...</h1>`;
    document.getElementById("searchResults").innerHTML = HTML;
  } else {
    for (let key in data.results) {
      HTML += `<div id="card">
    <div id="cardImageDiv">
    <i class="icon-heart"></i>
        <div id="cardInfoStars">
            <h6 id="cardInfoText"><i class="icon-star"></i>4.0</h6>
        </div>
        <div id="cardInfoTime">
            <h6 id="cardInfoText"><i class="icon-clock"></i>${data.results[key].readyInMinutes}</h6>
        </div>
        <img id="cardImage" src="${data.results[key].image}" alt="">
    </div>
    <h2 id="cardTitle">${data.results[key].title}</h2>
    <button class="cardButton" id="${data.results[key].id}">Bekijk</button>
  </div>`;
    }
  }
  document.getElementById("searchResults").innerHTML = HTML;
  for (let key in data.results) {
    document.getElementById(`${data.results[key].id}`).addEventListener("click", () => {
      localStorage.setItem("idRecipe", data.results[key].id);
      window.location = "./recipeResult.html";
    });
  }

}


function sort(data) {
  document.getElementById("time").addEventListener("change", () => {
    data.results.sort(function (a, b) {
      if (a.readyInMinutes < b.readyInMinutes) {
        return -1;
      }
      if (a.readyInMinutes > b.readyInMinutes) {
        return 1;
      }
      return 0;
    });
    addRecipe(data);
  });
  document.getElementById("healthScore").addEventListener("change", () => {
    data.results.sort(function (a, b) {
      var healthScoreA = a.healthScore; // ignore upper and lowercase
      var healthScoreB = b.healthScore; // ignore upper and lowercase
      if (healthScoreA < healthScoreB) {
        return -1;
      }
      if (healthScoreA > healthScoreB) {
        return 1;
      }
      return 0;
    });
    addRecipe(data);
  });
}

function filter(data) {
  document.getElementById("vegetarian").addEventListener("change", () => {
    let filterData = data.results.filter((a) => {
      if (a.vegetarian) {
        return a;
      }
    });
    data.results = filterData;
    addRecipe(data);
  });

  document.getElementById("vegan").addEventListener("change", () => {
    let filterData = data.results.filter((a) => {
      if (a.vegan) {
        return a;
      }
    });
    data.results = filterData;
    addRecipe(data);
  });

  document.getElementById("fodmap").addEventListener("change", () => {
    let filterData = data.results.filter((a) => {
      if (a.lowFodmap) {
        return a;
      }
    });
    data.results = filterData;
    addRecipe(data);
  });
}


document.getElementById("formResultPage").addEventListener("submit", (event) => {

  event.preventDefault();
  let typeString = "";
  for (let i = 1; i < 9; i++) {
    let type = document.getElementById('checkbox-' + [i]);
    var isChecked = type.checked;
    if (isChecked) {
      typeString += type.value;
      typeString += ",";
    }
  }
  let search = document.getElementById("formSearchbarResultPage").value;
  addToLocalstorage(search, typeString);
  window.location = "./searchresults.html";
});

function addToLocalstorage(search, typeString) {
  if (typeof (Storage) !== "undefined") {
    window.localStorage.clear();
    localStorage.setItem("search", search);
    localStorage.setItem("types", typeString);
  }
}