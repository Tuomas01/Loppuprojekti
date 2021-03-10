// Zoomsnap = kuinka paljon kartta zoomaa kerrallaan
// Kartan aloituspiste
// Zoom level aluksi
const map = L.map('map', {
  zoomSnap: 1,
}).setView([60.2733244, 24.8410248], 9.5);

// GPS button
function findMe() {
  map.locate({ setView: true, maxZoom: 19 });

  // Add popup and set map to user location
  function onLocationFound(e) {
    const radius = e.accuracy;
    L.marker(e.latlng).addTo(map)
      .bindPopup(`You are within ${Math.round(radius)} meters from this point`).openPopup();
  }
  map.on('locationfound', onLocationFound);

  function onLocationError(e) {
    alert(e.message);
  }
  map.on('locationerror', onLocationError);
}

// Reittioppaan karttagrafiikka
const Normal = L.tileLayer('https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png', {
  maxZoom: 19,
  tileSize: 512,
  zoomOffset: -1,
  id: 'hsl-map',
}).addTo(map);

// Reittioppaan karttagrafiikka (HD)
const HD = L.tileLayer('https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}@2x.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
    + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 19,
  tileSize: 512,
  zoomOffset: -1,
  id: 'hsl-map',
});

// Näytä km mitta
L.control.scale({
  imperial: false,
}).addTo(map);

// Näytä valikko kartan oikeassa ylänurkassa
L.control.layers({
  Normal,
  HD,
}, null, {
  collapsed: true,
}).addTo(map);
