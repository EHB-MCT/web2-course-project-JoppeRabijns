document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  let email = document.getElementById("loginFormEmail").value;
  let password = document.getElementById("loginFormPassword").value;
  let signinData = `{
    "username": "${email}",
    "password": "${password}"
  }`;
  signin(signinData);
});

async function signin(signinData) {
  await fetch('https://web2-course-project-api-jopper.herokuapp.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: signinData
    })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      console.log(data);
      redirect(data);
    });
}

function redirect(data) {
  if (data.token) {
    setTimeout(function () {
      window.location = "./recipes.html";
    }, 100);
  } else {
    const alert = Swal.mixin({
      position: 'center',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
    alert.fire({
      icon: 'error',
      title: `${data.message}`
    });
  }
}