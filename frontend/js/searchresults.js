'use strict';

fetchData();

async function fetchData() {
  let search = localStorage.getItem("search");
  let offset = localStorage.getItem("offset");
  let types = localStorage.getItem("types");
  let response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=e24201e68c7a4406a41930950e2aeef2&intolerances=gluten&number=2&query=${search}&addRecipeInformation=true&offset=${offset}&type=${types}`);
  let data = await response.json();
  addRecipe(data);
}

function addRecipe(data) {
  console.log(data);
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