/* eslint-disable */

import { displayMap } from "./leaflet.js";
import { login, logout } from "./login.js";
import { updateMySettings } from "./user.js";

// *** DOM ELEMENTS
// *** =======================
const leafletMap = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutButton = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");

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
    const password = document.getElementById("password-new").value;
    updateMySettings({ name, email }, "userData");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const passwordNew = document.getElementById("password-new").value;
    const passwordNewConfirm = document.getElementById("password-new-confirm").value;

    await updateMySettings({ passwordCurrent, passwordNew, passwordNewConfirm }, "password");
    document.querySelector(".btn--save-password").textContent = "Save Password";
    // Clears the values typed into the form fields after successful API call:
    document.getElementById("password-current").value = "";
    document.getElementById("password-new").value = "";
    document.getElementById("password-new-confirm").value = "";
  });
