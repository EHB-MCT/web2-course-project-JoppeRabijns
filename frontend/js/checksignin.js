token = localStorage.getItem("token");

fetch('https://web2-course-project-api-jopper.herokuapp.com/checkLogin', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  }
}).then(response => response.json()
  .then(data => checkIfLogin(data))
);

function checkIfLogin(data) {
  if (data == true) {
    console.log("signedIn");
  } else {
    window.location = "./index.html";
  }
}

document.getElementById("signOut").addEventListener("click", () => {
  localStorage.clear();
})