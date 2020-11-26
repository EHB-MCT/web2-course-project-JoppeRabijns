'use strict';

document.getElementById("form").addEventListener("submit", (event) => {
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
  let types = typeString;
  console.log(types);
  let search = document.getElementById("formSearchbar").value;
  fetchData(search, types);
});


/* 
function checkChecked() {
  let typeString = "";
  for (let i = 1; i < 9; i++) {
    var isChecked = document.getElementById('checkbox-' + [i]).checked;
    if (isChecked) {
      typeString += document.getElementById('checkbox-' + [i]).value;
      typeString += ",";
      console.log(typeString);
    } else {
      console.log("unchecked");
    }
  }
} */


async function fetchData(search, types) {
  let offset = Math.ceil(Math.random() * 5);
  let response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=cee7a81c28e441efa3b14a67c611c790&intolerances=gluten&number=5&query=${search}&addRecipeInformation=true&offset=${offset}&type=${types}`);
  let data = await response.json();
  addRecipe(data);
}



function addRecipe(data) {
  console.log(data);
  let HTML = "";
  for (let key in data.results) {
    HTML += `<div id="card">
  <div id="cardImageDiv">
      <div id="cardInfoStars">
          <h6 id="cardInfoText">4.0</h6>
      </div>
      <div id="cardInfoTime">
          <h6 id="cardInfoText">${data.results[key].readyInMinutes}</h6>
      </div>
      <img id="cardImage" src="${data.results[key].image}" alt="">
  </div>
  <h2 id="cardTitle">${data.results[key].title}</h2>
  <button class="cardButton" id="${data.results[key].id}">Bekijk</button>
</div>`;
  }
  document.getElementById("cards").innerHTML = HTML;
}