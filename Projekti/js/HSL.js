// Hae lat ja long arvot HSL apista
async function getRoutePoints(start, end) {
  const queryFrom = await fetch(`https://api.digitransit.fi/geocoding/v1/search?text=${start}&size=1`);
  const queryTo = await fetch(`https://api.digitransit.fi/geocoding/v1/search?text=${end}&size=1`);

  const from = await queryFrom.json();
  const to = await queryTo.json();

  const coordinates = {
    from: {
      lat: from.features[0].geometry.coordinates[1],
      lon: from.features[0].geometry.coordinates[0],
    },
    to: {
      lat: to.features[0].geometry.coordinates[1],
      lon: to.features[0].geometry.coordinates[0],
    },

  };
  return coordinates;
}

// Hae reitti käyttäen alku- ja loppuosoitteita
async function getRoute(start, end) {
  const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
  // GraphQL haku
  const route = await getRoutePoints(start, end);
  const query = `{
    plan(
      from: {lat: ${route.from.lat}, lon: ${route.from.lon}}
      to: {lat: ${route.to.lat}, lon: ${route.to.lon}}
    ) {
      itineraries {
        legs {
          startTime
          endTime
          mode
          duration
          distance
          legGeometry {
            points
          }
        }
      }
    }
  }`;

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }), // Add query params to fetch call
  };

  const response = await fetch(url, fetchOptions);
  const result = await response.json();

  // TODO:
  // Oma layeri reitti polygonille

  // Poista vanha reitti ennen uuden reitin lisäämistä kartalle
  map.eachLayer((layer) => {
    if (layer._path != null) {
      layer.remove();
    }
  });

  // Määrittele värit reitillä
  // Esim. kävelypätkä = vihreä
  // Nämä ovat vain placeholdereita
  result.data.plan.itineraries[0].legs.forEach((point) => {
    let color = '';
    switch (point.mode) {
      case 'WALK':
        color = 'green';
        break;
      case 'BUS':
        color = 'red';
        break;
      case 'RAIL':
        color = 'cyan';
        break;
      case 'TRAM':
        color = 'magenta';
        break;
      default:
        color = 'blue';
        break;
    }
    const route = point.legGeometry.points;
    const points = L.Polyline
      .fromEncoded(route)
      .getLatLngs();

    // Lisää tyylit reitille ja piirrä se kartalle
    L.polyline(points)
      .setStyle({
        color,
      })
      .addTo(map);
  });
}

// Hae kenttien arvot
// Piirrä reitti kartalle
function showRoute() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  getRoute(from, to);
}
