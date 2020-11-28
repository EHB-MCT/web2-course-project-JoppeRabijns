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
  let search = document.getElementById("formSearchbar").value;
  let offset = Math.ceil(Math.random() * 10);
  if (typeof (Storage) !== "undefined") {
    window.localStorage.clear();
    localStorage.setItem("search", search);
    localStorage.setItem("offset", offset);
    localStorage.setItem("types", typeString);
  }
  window.location = "./searchresults.html";
});