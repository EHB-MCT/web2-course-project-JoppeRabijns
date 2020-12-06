'use strict';

fetchData();

async function fetchData() {
  let search = localStorage.getItem("search");
  let types = localStorage.getItem("types");
  let response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=4a31bb9bef354a4ba47d51cddc71c430&intolerances=gluten&number=8&query=${search}&addRecipeInformation=true&type=${types}`);
  let data = await response.json();
  addRecipe(data.results);
  sort(data);
  filter(data);
}

function addRecipe(data) {
  let HTML = "";
  if (data == 0) {
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
        console.log("true");
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
        console.log("true");
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
        console.log("true");
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