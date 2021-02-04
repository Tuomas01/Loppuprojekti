function clearMarkers() {
  // Clear map before adding new markers
  map.eachLayer((layer) => {
    if (layer instanceof L.MarkerClusterGroup) {
      map.removeLayer(layer);
    }
  });
}

async function filteredData() {
  const sahko = document.getElementById('sahkoAuto').checked;
  const ilmainen = document.getElementById('ilmainen').checked;
  const data = await getData();

  switch (true) {
    case (sahko && ilmainen):
      return data.features.filter((place) => place.attributes.HINTAFI === 'ilmainen' && place.attributes.SAHKOAUTO > 0);
    case (sahko):
      return data.features.filter((place) => place.attributes.SAHKOAUTO > 0);
    case (ilmainen):
      return data.features.filter((place) => place.attributes.HINTAFI === 'ilmainen');
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
    const latauspisteet = place.attributes.SAHKAUFI === 'Ei'
      ? 0
      : place.attributes.SAHKAUFI;

    // Popup with description when user clicks icon
    const popup = `
      <h4>${place.attributes.KUNTA || 'Tietoja ei saatavilla'}</h4>
      <p>Katuosoite: ${place.attributes.OSOITEFI || 'Tietoja ei saatavilla'} </p>
      <p>Paikkoja: ${place.attributes.PAIKKOJA || 'Tietoja ei saatavilla'}</p>
      <p>Parkkimaksu: ${place.attributes.HINTAFI || 'Tietoja ei saatavilla'}</p>
      <p>Latauspisteitä sähköautoille: ${latauspisteet}`;

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
