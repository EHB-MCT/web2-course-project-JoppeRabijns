'use strict';

document.getElementById("form").addEventListener("submit", (event) => {
  event.preventDefault();
  let search = document.getElementById("formSearchbar").value;
  fetchData(search);
});


async function fetchData(search) {
  let response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=cee7a81c28e441efa3b14a67c611c790&intolerances=gluten&number=5&query=${search}`);
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
      <img id="cardImage" src="${data.results[key].image}" alt="">
  </div>
  <h2 id="cardTitle">${data.results[key].title}</h2>
  <button class="cardButton" id="${data.results[key].id}">Bekijk</button>
</div>`;
  }
  console.log(HTML);
  document.getElementById("cards").innerHTML = HTML;
}