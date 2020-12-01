fetchData();

async function fetchData() {
  let idRecipe = localStorage.getItem("idRecipe");
  let response = await fetch(`https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=e24201e68c7a4406a41930950e2aeef2`);
  let data = await response.json();
  console.log(data);
  renderRecipe(data);
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
  <div id="recipeBackground">
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
  </div>
  </div>`
  document.getElementById("recipe").innerHTML = HTML;
}