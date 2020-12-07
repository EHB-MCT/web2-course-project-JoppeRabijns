fetchData();
fetchSimilarData();

async function fetchData() {
  let idRecipe = localStorage.getItem("idRecipe");
  let response = await fetch(`https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=cee7a81c28e441efa3b14a67c611c790`);
  let data = await response.json();
  console.log(data);
  renderRecipe(data);

}

async function fetchSimilarData() {
  let idRecipe = localStorage.getItem("idRecipe");
  let similarResponse = await fetch(`https://api.spoonacular.com/recipes/${idRecipe}/similar?apiKey=cee7a81c28e441efa3b14a67c611c790&number=4`);
  let similarData = await similarResponse.json();
  renderSimilarRecipes(similarData);
}

function renderSimilarRecipes(similarData) {
  console.log(similarData);
  let HTML = ``;
  for (let key in similarData) {
    HTML += `<div id="card">
  <div id="cardImageDiv">
  <i class="icon-heart"></i>
      <div id="cardInfoTime">
          <h6 id="cardInfoText"><i class="icon-clock"></i>${similarData[key].readyInMinutes}</h6>
      </div>
      <img id="cardImage" src='https://spoonacular.com/recipeImages/${similarData[key].id}-556x370.jpg' alt="">
  </div>
  <h2 id="cardTitle">${similarData[key].title}</h2>
  <button class="cardButton" id="${similarData[key].id}">Bekijk</button>
</div>`;
  }
  document.getElementById("similar").innerHTML = HTML;
  for (let key in similarData) {
    document.getElementById(`${similarData[key].id}`).addEventListener("click", () => {
      localStorage.setItem("idRecipe", similarData[key].id);
      window.location = "./recipeResult.html";
    });
  }
}


function renderRecipe(data) {
  let ingredients = ``;
  let instructions = ``;
  let HTML = ``;
  for (let key in data.analyzedInstructions[0].steps) {
    instructions += `<li>${data.analyzedInstructions[0].steps[key].step}</li>`
  }
  for (let key in data.extendedIngredients) {
    ingredients += `<li>${data.extendedIngredients[key].name}</li>`
  }
  HTML += `
  <div id="recipeBack">
  </div>
  <h2>${data.title}</h2>
  <div id="recipeImage">
    <img src="${data.image}" alt="">
  </div>
  <div id="recipeIngredients">
    <h3>Ingredients</h3>
    <ul> ${ingredients}</ul>
  </div>
  <div id="recipeInstructions">
    <h3>Instructions:</h3>
    <ol>
   ${instructions}
   </ol>
  </div>`
  document.getElementById("recipe").innerHTML = HTML;
}