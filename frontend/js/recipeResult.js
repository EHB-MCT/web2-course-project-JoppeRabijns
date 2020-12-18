fetchData();
fetchSimilarData();

async function fetchData() {
  let idRecipe = localStorage.getItem("idRecipe");
  let response = await fetch(`https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=b19c72e55d624db89ca25f0b25b9e63b`);
  let data = await response.json();
  console.log(data);
  renderRecipe(data);

}

async function fetchSimilarData() {
  let idRecipe = localStorage.getItem("idRecipe");
  let similarResponse = await fetch(`https://api.spoonacular.com/recipes/${idRecipe}/similar?apiKey=b19c72e55d624db89ca25f0b25b9e63b&number=4`);
  let data = await similarResponse.json();
  userDataFunctions(data);
}

function userDataFunctions(data) {
  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");
  fetch(`https://web2-course-project-api-jopper.herokuapp.com/api/userData/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }).then(response => response.json()
    .then(userData => addRecipe(data, userData))
  );
}

function addRecipe(data, userData) {
  let HTML = "";
  console.log(data);
  for (let key in data) {
    HTML += `<div id="card">
    <div id="cardImageDiv">
    <div id="checkbox">
           <input class="checkbox"id='${data[key].id}' type="checkbox">
      </div>
        <div id="cardInfoTime">
            <h6 id="cardInfoText"><i class="icon-clock"></i>${data[key].readyInMinutes}</h6>
        </div>
        <img id="cardImage" src='https://spoonacular.com/recipeImages/${data[key].id}-556x370.jpg' alt="">
    </div>
    <h2 id="cardTitle">${data[key].title}</h2>
    <button class="cardButton" id="button-${data[key].id}">Bekijk</button>
  </div>`;
  }
  document.getElementById("similar").innerHTML = HTML;
  for (let key in data) {
    document.getElementById(`button-${data[key].id}`).addEventListener("click", () => {
      localStorage.setItem("idRecipe", data[key].id);
      location.reload();
    });
    if (userData.favorites.indexOf(`${data[key].id}`) != -1) {
      document.getElementById(data[key].id).checked = true;
    }
    document.getElementById(`${data[key].id}`).addEventListener("change", () => {
      if (userData.favorites.indexOf(`${data[key].id}`) === -1) {
        addToDatabase(data[key], userData);
      } else {
        let recipeData = data[key];
        deleteFromDatabase(data, recipeData, userData);
      }
    });
  }
}

function addToDatabase(data, userData) {
  JSON.stringify(data.id);
  userData.favorites.push(JSON.stringify(data.id));
  sendToDatabase(userData.favorites);
}


function deleteFromDatabase(data, recipeData, userData) {
  let index = userData.favorites.indexOf(`${recipeData.id}`);
  data.splice(index, 1);
  userData.favorites.splice(index, 1);
  sendToDatabase(userData.favorites);
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
  console.log("succes");
}



function renderRecipe(data) {
  let ingredients = ``;
  let instructions = ``;
  let HTML = ``;
  if (data.analyzedInstructions[0] !== undefined) {
    for (let key in data.analyzedInstructions[0].steps) {
      instructions += `<li>${data.analyzedInstructions[0].steps[key].step}</li>`
    }
  } else {
    instructions += `<h4>There are no instructions found...<h4>`
  }

  for (let key in data.extendedIngredients) {
    ingredients += `<li>${data.extendedIngredients[key].name}</li>`
  }
  HTML += `
  <button id="recipeBack">
  <h3> < terug </h3>
  </button>
  <h2>${data.title}</h2>
  <div id="recipeImage">
    <img src="${data.image}" alt="">
  </div>
  <div id="checkboxResult">
    <input class="checkbox"id='${data.id}' type="checkbox">
  </div>
  <div id="cardInfoTimeResult">
     <h6 id="cardInfoText"><i class="icon-clock"></i>${data.readyInMinutes}</h6>
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

  document.getElementById("recipeBack").addEventListener("click", () => {
    window.history.back();
  });
}