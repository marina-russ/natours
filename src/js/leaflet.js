/* eslint-disable */

export const displayMap = (locations) => {
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
