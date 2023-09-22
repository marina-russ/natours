/* eslint-disable */

import { displayMap } from "./leaflet.js";
import { login, logout } from "./login.js";
import { updateMyData } from "./user.js";

// *** DOM ELEMENTS
// *** =======================
const leafletMap = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutButton = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");

// *** LEAFLET MAP
// *** =======================

// Only runs when there is a .map selector
if (leafletMap) {
  const locations = JSON.parse(leafletMap.dataset.locations);
  displayMap(locations);
};

// *** LOGIN & LOGOUT
// *** =======================

// Event Listeners
if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logoutButton) logoutButton.addEventListener("click", logout);

// *** UPDATING USER DATA
// *** =======================

if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    updateMyData(userName, email);
  });
