/* eslint-disable */

// =======================
// === DOM ELEMENTS
const loginForm = document.querySelector(".form--login");
//const logoutButton = document.querySelector(".nav__el--logout");
//const userDataForm = document.querySelector(".form-user-data");

const leafletMap = document.getElementById("map");

// =======================
// === LOGIN & LOGOUT
// =======================

// EVENT LISTENERS
if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

// ! BUG - Need to fix
// if (logoutButton) logoutButton.addEventListener("click", logout);

// HIDE LOGIN ALERT
const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

// DISPLAY LOGIN ALERT
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};

// LOGIN FUNCTION
const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      data: {
        email,
        password,
      }
    });

    if (res.data.status === "success") {
      showAlert("Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

// LOGOUT FUNCTION
const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/logout",
    });
    if (res.data.status = "success") location.reload(true);
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};

// =======================
// === LEAFLET MAP
// =======================

// LEAFLET FUNCTION
const displayMap = (locations) => {
  // Creates map and attaches it to #map. L is the variable for using leaflet
  const map = L.map('map', { zoomControl: false });

  // Add tile layer to map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Create icon
  var greenIcon = L.icon({
    iconUrl: '/img/pin.png',
    iconSize: [32, 40],
    iconAnchor: [16, 45], // icon point which will correspond to marker's location
    popupAnchor: [0, -50], // point where popup opens relative to iconAnchor
  });

  // Add locations to the map
  const points = [];
  locations.forEach(loc => {
    // Create points
    points.push([loc.coordinates[1], loc.coordinates[0]]);

    // Add markers
    L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: greenIcon })
      .addTo(map)
      // Add popup
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
        className: 'mapPopup',
      })
      .on('mouseover', function (e) {
        this.openPopup();
      })
      .on('mouseout', function (e) {
        this.closePopup();
      });
  });

  // Set map bounds to include current location
  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  // Disable scroll on map
  map.scrollWheelZoom.disable();
};

// Only runs when there is a .map selector
if (leafletMap) {
  const locations = JSON.parse(leafletMap.dataset.locations);
  displayMap(locations);
};
