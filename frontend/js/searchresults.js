'use strict';

fetchData();

async function fetchData() {
  showLoader();
  let search = localStorage.getItem("search");
  let types = localStorage.getItem("types");
  await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=b19c72e55d624db89ca25f0b25b9e63b&intolerances=gluten&number=16&query=${search}&addRecipeInformation=true&type=${types}`)
    .then(response => response.json())
    .then(data => {
      addRecipe(data.results), sort(data), filter(data)
    });
  hideLoader();
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}


function addRecipe(data) {
  let HTML = "";
  if (data.length === 0) {
    HTML += `<h1>No recipes were found...</h1>`;
    document.getElementById("searchResults").innerHTML = HTML;
  } else {
    for (let key in data) {
      HTML += `<div id="card">
    <div id="cardImageDiv">
    <i class="icon-heart"></i>
        <div id="cardInfoTime">
            <h6 id="cardInfoText"><i class="icon-clock"></i>${data[key].readyInMinutes}</h6>
        </div>
        <img id="cardImage" src="${data[key].image}" alt="">
    </div>
    <h2 id="cardTitle">${data[key].title}</h2>
    <button class="cardButton" id="${data[key].id}">Bekijk</button>
  </div>`;
    }
  }
  document.getElementById("searchResults").innerHTML = HTML;
  for (let key in data) {
    document.getElementById(`${data[key].id}`).addEventListener("click", () => {
      localStorage.setItem("idRecipe", data[key].id);
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
    addRecipe(data.results);
  });
  document.getElementById("healthScore").addEventListener("change", () => {
    data.results.sort(function (a, b) {
      if (a.healthScore < b.healthScore) {
        return -1;
      }
      if (a.healthScore > b.healthScore) {
        return 1;
      }
      return 0;
    });
    addRecipe(data.results);
  });
}

function filter(data) {
  document.getElementById("vegetarian").addEventListener("change", () => {
    let testData = [];
    testData.push(data.results);
    let filterData = testData[0].filter((a) => {
      if (a.vegetarian) {
        return a;
      }
    });
    addRecipe(filterData);
  });

  document.getElementById("vegan").addEventListener("change", () => {
    let testData = [];
    testData.push(data.results);
    let filterData = testData[0].filter((a) => {
      if (a.vegan) {
        return a;
      }
    });
    addRecipe(filterData);
  });

  document.getElementById("fodmap").addEventListener("change", () => {
    let testData = [];
    testData.push(data.results);
    let filterData = testData[0].filter((a) => {
      if (a.lowFodmap) {
        return a;
      }
    });
    addRecipe(filterData);
  });

  document.getElementById("all").addEventListener("change", () => {
    let testData = [];
    testData.push(data.results);
    let filterData = testData[0].filter((a) => {
      if (a) {
        return a;
      }
    });
    addRecipe(filterData);
  });
}


document.getElementById("formResultPage").addEventListener("submit", (event) => {
  event.preventDefault();
  let typeString = "";
  for (let i = 1; i < 9; i++) {
    let type = document.getElementById('checkbox-' + [i]);
    if (type.checked) {
      typeString += type.value;
      typeString += ",";
    }
  }
  let search = document.getElementById("formSearchbarResultPage").value;
  addToLocalstorage(search, typeString);
  location.reload();
});

function addToLocalstorage(search, typeString) {
  if (typeof (Storage) !== "undefined") {
    window.localStorage.clear();
    localStorage.setItem("search", search);
    localStorage.setItem("types", typeString);
  }
}