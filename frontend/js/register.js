document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  let name = document.getElementById("loginFormName").value;
  let email = document.getElementById("loginFormEmail").value;
  let phone = document.getElementById("loginFormPhone").value;
  let password = document.getElementById("loginFormPassword").value;

  let registerData = `{
    "name": "${name}",
    "email": "${email}",
    "phone": "${phone}",
    "password": "${password}"
}`;
  signin(registerData);
});

async function signin(registerData) {
  await fetch('https://web2-course-project-api-jopper.herokuapp.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: registerData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      redirect(data);
    });
}

function redirect(data) {
  const alert = Swal.mixin({
    position: 'center',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });
  alert.fire({
    icon: 'success',
    title: `${data.message}`
  });

  setTimeout(function () {
    window.location = "./index.html";
  }, 1500);
}