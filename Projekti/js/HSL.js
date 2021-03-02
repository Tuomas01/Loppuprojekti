function naytatiedot(element) {
  const divi = document.getElementById(element);
  divi.classList.toggle('show');
}

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

  // hae id, johon tiedot lisätään
  const lahto = document.getElementById('startTime');
  lahto.innerHTML = '';
  console.log(result);
  // Looppi, joka käy läpi itinararies taulukkoa
  for (let i = 0; i < result.data.plan.itineraries.length; i++) {
    // Luodaan nappulat sivulle, joista voi togglettaa matkojen tietoja
    const nappula = `</br> 
                    <button id="button${i}" onclick="naytatiedot('lahto${i}')">Lähtö ${i + 1}</button><article id="lahto${i}" class="hide">`;
    lahto.innerHTML += nappula;

    // Looppi, joka käy läpi legs-taulukkoa, joka on itinararies taulukon sisällä (sisäkkäinen for looppi)
    for (let j = 0; j < result.data.plan.itineraries[i].legs.length; j++) {
      // luodaan unix muuttuja, joka tallentaa unix arvot, jotta voidaan myöhemmin muuntaa ne oikeeseen muotoon
      const unixstart = result.data.plan.itineraries[i].legs[j].startTime;
      const unixend = result.data.plan.itineraries[i].legs[j].endTime;
      // luodaan muuttuja mode, johon annetaan arvoksi tapa, jolla matkustetaan
      let { mode } = result.data.plan.itineraries[i].legs[j];
      const distance = Math.round(result.data.plan.itineraries[i].legs[j].distance);
      // Luo Date objekti ja anna sen arvoksi unix, jotta unix arvo muutetaan date muotoon, eli tallenna unix arvot muuttujiin
      const lahtoaika = new Date(unixstart);
      const loppuaika = new Date(unixend);
      // Hae tunnit unix ajoista
      const lahtotunnit = lahtoaika.getHours();
      const lopputunnit = loppuaika.getHours();
      /* hae minuutit, lisää 0, jotta minuutit alle 10 näkyvät oikein esim.
         11.07.02 eikä 11.7.2 ja muunna minuutit numerosta merkkijonoksi nollan avulla */
      const lahtominuutit = `0${lahtoaika.getMinutes()}`;
      const loppuminuutit = `0${loppuaika.getMinutes()}`;
      // lisätään päivämäärä ja lähtemisaika muuttujaan
      // miinustetaan minuuteista ensimmäiset 2 numeroa, jotta minuutit näkyvät oikeassa muodossa
      const aikaamatkaan = (lopputunnit + loppuminuutit.substr(-2)) - (lahtotunnit + lahtominuutit.substr(-2));
      const lahtemisaika = `${lahtotunnit}.${lahtominuutit.substr(-2)}`;
      const pysahdysaika = `${lopputunnit}.${loppuminuutit.substr(-2)}`;

      // Muuta mode muuttujaan, millä tavalla matkustetaan ja lisää aika, joka kuluu matkaan
      if (mode === 'WALK') {
        mode = ` Kävele ${distance} m (${aikaamatkaan} min)`;
      } else if (mode === 'RAIL') {
        mode = ` Matkusta junalla ${distance} m (${aikaamatkaan} min)`;
      } else if (mode === 'BUS') {
        mode = ` Matkusta bussilla ${distance} m (${aikaamatkaan} min)`;
      } else if (mode === 'SUBWAY') {
        mode = ` Matkusta metrolla ${distance} m (${aikaamatkaan} min)`;
      }

      // Luo p tägi ja teksti p tägien sisään
      const tiedot = document.createElement('p');
      const teksti = document.createTextNode(`Klo: ${lahtemisaika} - ${pysahdysaika} ${mode}`);
      tiedot.appendChild(teksti);
      // lisää ptägit article tagin sisään
      document.getElementById(`lahto${i}`).appendChild(tiedot);
      // lisätään muuttuja uusi, joka sisältää lähtemis- ja pysähdysajat, kuljetusvälineen ja ajan sivulle
      /* document.getElementById('button' + i).addEventListener('click', function() {
        naytatiedot("lahto" + i);
      }); */
    }
  }

  console.log(result);

  // TODO:
  // Oma layeri reitti polygonille

  // Poista vanha reitti ennen uuden reitin lisäämistä kartalle
  // Tämä on vasta ns. "purkkaratkaisu", mutta toimii
  map.eachLayer((layer) => {
    if (layer._path != null) {
      if (!layer._latlngs[0].length) layer.remove();
    }
  });

  // Määrittele värit reitillä
  // Esim. kävelypätkä = vihreä
  // Nämä ovat vain placeholdereita
  result.data.plan.itineraries[0].legs.forEach((point) => {
    let color = '';
    let dashArray = '';
    switch (point.mode) {
      case 'WALK':
        color = 'black';
        dashArray = '5,10';
        break;
      case 'BUS':
        color = '#007ac9';
        break;
      case 'RAIL':
        color = '#8c4799';
        break;
      case 'TRAM':
        color = 'magenta';
        break;
      case 'SUBWAY':
        color = '#ff6319';
        break;
      default:
        color = 'blue';
        break;
    }
    const route = point.legGeometry.points;
    const points = L.Polyline
      .fromEncoded(route)
      .getLatLngs();

    if (points instanceof L.Polyline) console.log('hepp');
    // Lisää tyylit reitille ja piirrä se kartalle
    L.polyline(points)
      .setStyle({
        color,
        dashArray,
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
