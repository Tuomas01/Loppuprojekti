async function getAddress(address) {
  const response = await fetch(`https://api.digitransit.fi/geocoding/v1/search?text=${address}&size=1`);
  const data = await response.json();
  const coordinates = {
    lat: data.features[0].geometry.coordinates[1],
    lon: data.features[0].geometry.coordinates[0],
  };
  return coordinates;
}

function getLocations() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  return { from, to };
}

// Get route
async function getRoute(start, end) {
  const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
  // GraphQL haku
  const from = await getAddress(start);
  const to = await getAddress(end);

  const query = `{
    plan(
      from: {lat: ${from.lat}, lon: ${from.lon}}
      to: {lat: ${to.lat}, lon: ${to.lon}}
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
    body: JSON.stringify({ query }), // GraphQL haku lisätään queryyn
  };

  const response = await fetch(url, fetchOptions);
  const result = await response.json();

  // Draw route using the result coordinates
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
    const route = (point.legGeometry.points);
    const points = L.Polyline
      .fromEncoded(route)
      .getLatLngs();

    L.polyline(points)
      .setStyle({
        color,
      })
      .addTo(map);
  });
}

// Get lat and long coords
// Get the route using lat and long
function showRoute() {
  const trip = getLocations();
  getRoute(trip.from, trip.to);
}
