// Tyhjennä markkerit (parkkipaikat) kartalta
function clearMarkers() {
  map.eachLayer((layer) => {
    if (layer instanceof L.MarkerClusterGroup) {
      map.removeLayer(layer);
    }
  });
}
