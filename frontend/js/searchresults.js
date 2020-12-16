'use strict';

fetchData();

async function fetchData() {
  showLoader();
  try {
    let search = localStorage.getItem("search");
    let types = localStorage.getItem("types");
    await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=e24201e68c7a4406a41930950e2aeef2&intolerances=gluten&number=16&query=${search}&addRecipeInformation=true&type=${types}`)
      .then(response => response.json())
      .then(data => {
        userDataFunctions(data), sort(data), filter(data)
      })
    hideLoader();
  } catch (err) {
    hideLoader();
    const error = Swal.mixin({
      position: 'center',
      showConfirmButton: true,
    });
    error.fire({
      icon: 'error',
      title: 'Daily api call limit reached!'
    });
  }
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
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
    .then(userData => addRecipe(data.results, userData))
  );
}


function addRecipe(data, userData) {
  let HTML = "";
  if (data.length === 0) {
    HTML += `<h1>No recipes were found...</h1>`;
    document.getElementById("searchResults").innerHTML = HTML;
  } else {
    for (let key in data) {
      HTML += `<div id="card">
    <div id="cardImageDiv">
    <input class="checkbox"id='${data[key].id}' type="checkbox"></i>
        <div id="cardInfoTime">
            <h6 id="cardInfoText"><i class="icon-clock"></i>${data[key].readyInMinutes}</h6>
        </div>
        <img id="cardImage" src="${data[key].image}" alt="">
    </div>
    <h2 id="cardTitle">${data[key].title}</h2>
    <button class="cardButton" id="button-${data[key].id}">Bekijk</button>
  </div>`;
    }
  }
  document.getElementById("searchResults").innerHTML = HTML;
  for (let key in data) {
    document.getElementById(`button-${data[key].id}`).addEventListener("click", () => {
      localStorage.setItem("idRecipe", data[key].id);
      window.location = "./recipeResult.html";
    });
    document.getElementById(`${data[key].id}`).addEventListener("change", () => {
      console.log(data[key].id);
      JSON.stringify(data[key].id);
      userData.favorites.push(JSON.stringify(data[key].id));
      console.log(userData.favorites);
      sendToDatabase(userData.favorites);
    });
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
  console.log("succes");
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
    localStorage.setItem("search", "");
    localStorage.setItem("types", "");
    localStorage.setItem("search", search);
    localStorage.setItem("types", typeString);
  }
}