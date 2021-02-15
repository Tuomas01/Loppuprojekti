// TODO:
// Omat layergroup vyöhykkeille

// Vyöhyke data APIsta
async function getRegions() {
  const url = 'https://opendata.arcgis.com/datasets/89b6b5142a9b4bb9a5c5f4404ff28963_0.geojson';
  const data = await fetch(url);
  const result = await data.json();
  return result;
}

async function drawRegions() {
  const result = await getRegions();
  const data = await result;

  // Omat värit vyöhykkeille (ei lopullinen ratkaisu)
  function polystyle(feature) {
    let color;
    switch (feature.properties.Zone) {
      case 'A':
        color = 'blue';
        break;
      case 'B':
        color = 'green';
        break;
      case 'C':
        color = 'yellow';
        break;
      case 'D':
        color = 'red';
        break;
      default:
    }
    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.1,
    };
  }
  L.geoJson(data, { style: polystyle }).addTo(map);
}

drawRegions();
