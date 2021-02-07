// Clear map from markers
function clearMarkers() {
  map.eachLayer((layer) => {
    if (layer instanceof L.MarkerClusterGroup) {
      map.removeLayer(layer);
    }
  });
}

// Filter data with user choices
async function filteredData() {
  const sahko = document.getElementById('sahkoAuto').checked;
  const ilmainen = document.getElementById('ilmainen').checked;
  const hsl = document.getElementById('hslAlue').checked;
  const data = await getData();

  switch (true) {
    case (sahko && ilmainen && hsl):
      return data.features.filter((place) => place.attributes.HINTAFI === 'ilmainen'
      && place.attributes.SAHKOAUTO > 0
      && place.attributes.HSL_ALUE > 0);
    case (sahko && ilmainen):
      return data.features.filter((place) => place.attributes.SAHKOAUTO > 0
      && place.attributes.HINTAFI === 'ilmainen');
    case (sahko && hsl):
      return data.features.filter((place) => place.attributes.SAHKOAUTO > 0
      && place.attributes.HSL_ALUE > 0);
    case (ilmainen && hsl):
      return data.features.filter((place) => place.attributes.HINTAFI === 'ilmainen'
      && place.attributes.HSL_ALUE > 0);
    case (sahko):
      console.log(data.features.filter((place) => place.attributes.SAHKOAUTO > 0));
      return data.features.filter((place) => place.attributes.SAHKOAUTO > 0);
    case (ilmainen):
      return data.features.filter((place) => place.attributes.HINTAFI === 'ilmainen');
    case (hsl):
      return data.features.filter((place) => place.attributes.HSL_ALUE > 0);
    default:
      return data.features;
  }
}

// Add data to map
async function showData() {
  const places = await filteredData();
  console.log(places);

  // Create group for clustering markers
  const markers = new L.MarkerClusterGroup();

  // Array includes geometry and info from all places
  // Iterate through array
  places.forEach((place) => {
    // Popup with descriptions when user clicks icon
    const popup = `
      <h4>${place.attributes.KUNTA || 'Kuntatieto ei saatavilla'}</h4>
      <p>Katuosoite: ${place.attributes.OSOITEFI || 'Katuosoite ei saatavilla'} </p>
      <p>Paikkoja: ${place.attributes.PAIKKOJA || 'Paikkatietoja ei saatavilla'}</p>
      <p>Parkkimaksu: ${place.attributes.HINTAFI || 'Parkkimaksutietoja ei saatavilla'}</p>
      <p>Latauspisteitä sähköautoille: ${place.attributes.SAHKOAUTO || 'Tietoja ei saatavilla'}</p>`;

    // Add markers to layer
    // Bind popup box to markers
    markers.addLayer(L
      .marker(getCoordinates(place.geometry.rings[0]))
      .bindPopup(popup));

    // Clear markers before adding new ones
    clearMarkers();
    map.addLayer(markers);
  });
}

showData();
