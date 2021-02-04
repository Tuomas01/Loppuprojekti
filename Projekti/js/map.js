// Starting point for map([latitude, longitude], zoom level)
const map = L.map('map').setView([60.3733244, 24.8410248], 9);

// Add graph to map (HSL-tiles)
const normalTiles = L.tileLayer('https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png', {
  maxZoom: 19,
  tileSize: 512,
  zoomOffset: -1,
  id: 'hsl-map',
}).addTo(map);

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

// Swedish city and street names
const swedish = L.tileLayer('https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}@2x.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
    + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 19,
  tileSize: 512,
  zoomOffset: -1,
  id: 'hsl-map-sv',
});

// HD map tiles
const hdTiles = L.tileLayer('https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}@2x.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
    + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 19,
  tileSize: 512,
  zoomOffset: -1,
  id: 'hsl-map',
});

// Add scale indicator to map (km)
L.control.scale({
  imperial: false,
}).addTo(map);

L.control.layers({
  Normal: normalTiles,
  Swedish: swedish,
  HD: hdTiles,
}, null, {
  collapsed: true,
}).addTo(map);
