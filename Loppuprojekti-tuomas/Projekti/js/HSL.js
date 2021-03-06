// Hae lat ja long arvot HSL apista
async function getRoutePoints(start, end) {
  const queryFrom = await fetch(`https://api.digitransit.fi/geocoding/v1/search?text=${start}&size=1`);
  const queryTo = await fetch(`https://api.digitransit.fi/geocoding/v1/search?text=${end}&size=1`);

  const from = await queryFrom.json();
  const to = await queryTo.json();

  if (from.features.length === 0 || to.features.length === 0) return false;

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

  if (!route) {
    alert('No routes found');
    return false;
  }
  const query = `{
    plan(
      from: {lat: ${route.from.lat}, lon: ${route.from.lon}}
      to: {lat: ${route.to.lat}, lon: ${route.to.lon}}
    ) {
      itineraries{
        walkDistance,
        duration,
        legs {
          mode
          startTime
          endTime
          from {
            lat
            lon
            name
            stop {
              code
              name
            }
          },
          to {
            lat
            lon
            name
          },
          trip {
            route {
              shortName
            }
          }
          distance
          legGeometry {
            length
            points
          }
        }
      }
    }
  }`;
  map.flyTo(route.from, 12);

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }), // Add query params to fetch call
  };

  const response = await fetch(url, fetchOptions);
  const result = await response.json();

  if (!result) console.log('jeå');

  // hae id, johon tiedot lisätään
  const lahto = document.createElement('p');
  lahto.id = 'startTime';
  const ajat = document.createElement('div');
  ajat.id = 'ajat';
  const aside = document.getElementById('aside');
  aside.removeChild(aside.lastChild);
  document.getElementById('aside').appendChild(ajat);

  // Näytä tarkemmat tiedot reitistä
  function naytatiedot(element) {
    const divi = document.getElementById(element);
    divi.classList.toggle('show');
    if (divi.classList.length > 1) return false;
  }

  function poistaReittiKartalta(id) {
  // Poista valittu reitti kartalta
    map.eachLayer((layer) => {
      if (layer.options.id === id) layer.remove();
    });
  }

  // Piirrä klikattu reitti kartalle
  function reittiKartalle(reitti, id) {
    // Määrittele värit reitillä
    reitti.forEach((point) => {
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
          color = '#00985f';
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

      L.polyline(points)
        .setStyle({
          color,
          dashArray,
          id,
        })
        .addTo(map);
    });
  }

  // Looppi, joka käy läpi itineraries taulukkoa
  for (let i = 0; i < result.data.plan.itineraries.length; i++) {
    const reitti = result.data.plan.itineraries[i].legs;
    const kestoSekunteina = result.data.plan.itineraries[i].duration;
    const kestoMinuutteina = Math.round(kestoSekunteina / 60);

    // Luodaan nappulat sivulle, joista voi togglettaa matkojen tietoja
    const nappula = document.createElement('button');
    nappula.className = 'lahdot';
    nappula.id = `button${i}`;
    nappula.innerText = `Lähtö ${i + 1} (${kestoMinuutteina} min)`;

    // Napin onclick funktio
    nappula.addEventListener('click', () => {
      const id = `lahto${i}`;
      const element = document.getElementById(id);
      naytatiedot(id);
      if (element.classList.length > 1) reittiKartalle(reitti, `line${i}`);
      else {
        poistaReittiKartalta(`line${i}`);
      }
    });

    // Luodaan div johon liitetään tietoja reitistä
    const div = document.createElement('div');
    div.id = `lahto${i}`;
    div.className = 'hide';

    lahto.appendChild(nappula);
    lahto.appendChild(div);
    document.getElementById('ajat').appendChild(lahto);

    // Looppi, joka käy läpi legs-taulukkoa, joka on itinararies taulukon sisällä (sisäkkäinen for looppi)
    for (let j = 0; j < reitti.length; j++) {
      // luodaan unix muuttuja, joka tallentaa unix arvot, jotta voidaan myöhemmin muuntaa ne oikeeseen muotoon
      const unixstart = reitti[j].startTime;
      const unixend = reitti[j].endTime;
      // luodaan muuttuja mode, johon annetaan arvoksi tapa, jolla matkustetaan
      let { mode } = reitti[j];
      const distance = Math.round(reitti[j].distance);
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
      const lahtemisaika = `${lahtotunnit}.${lahtominuutit.substr(-2)}`;
      const pysahdysaika = `${lopputunnit}.${loppuminuutit.substr(-2)}`;
      const kilometrit = (distance / 1000).toFixed(1);
      let loppu = reitti[j].to.name;
      let alku = reitti[j].from.name;

      const info = document.createElement('div');
      info.className = 'info';

      const img = document.createElement('img');
      img.className = 'transport';

      const linjaNro = document.createElement('p');
      linjaNro.className = 'linja';

      if (reitti[j].trip) {
        linjaNro.innerHTML = `(${reitti[j].trip.route.shortName})`;
      }

      if (alku === 'Origin') {
        alku = document.getElementById('from').value.split(' ')[0];
        alku = alku.charAt(0).toUpperCase() + alku.slice(1);
      }

      if (loppu === 'Destination') {
        loppu = document.getElementById('to').value.split(' ')[0];
        loppu = loppu.charAt(0).toUpperCase() + loppu.slice(1);
      }

      // Muuta mode muuttujaan, millä tavalla matkustetaan ja lisää aika, joka kuluu matkaan
      if (mode === 'WALK') {
        mode = `${alku} \u2192 ${loppu} ${kilometrit} km`;
        img.src = 'img/walking.svg';
        img.alt = 'walk';
      } else if (mode === 'RAIL') {
        mode = `Juna ${linjaNro.textContent} ${loppu} ${kilometrit} km`;
        img.src = 'img/train.svg';
        img.alt = 'railway';
      } else if (mode === 'BUS') {
        mode = `Bussi ${linjaNro.textContent} ${loppu} ${kilometrit} km`;
        img.src = 'img/bus.svg';
        img.alt = 'bus';
      } else if (mode === 'SUBWAY') {
        mode = `Metro ${linjaNro.textContent} ${loppu} ${kilometrit} km`;
        img.src = 'img/subway.svg';
        img.alt = 'subway';
      } else if (mode === 'TRAM') {
        mode = `Raitiovaunu ${linjaNro.textContent} ${loppu} ${kilometrit} km`;
        img.src = 'img/tram.svg';
        img.alt = 'tram';
      } else {
        mode = 'Ei tietoa saatavilla';
      }

      // Luo p tägi ja teksti p tägien sisään
      const tiedot = document.createElement('p');
      const teksti = document.createTextNode(`${mode}`);
      const aika = document.createElement('p');
      aika.innerText = `${lahtemisaika} - ${pysahdysaika}`;
      aika.className = 'aika';
      tiedot.appendChild(teksti);
      info.appendChild(aika);
      info.appendChild(tiedot);
      info.appendChild(img);

      // lisää ptägit div tagin sisään
      document.getElementById(`lahto${i}`).appendChild(info);
    }
  }

  console.log(result);

  // Näytä ensimmäinen reitti aina haun jälkeen kartalla
  naytatiedot('lahto0');
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
        color = '#00985f';
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

    // Lisää tyylit reitille ja piirrä se kartalle
    if (!(points instanceof L.Polyline)) {
      L.polyline(points)
        .setStyle({
          color,
          dashArray,
          id: 'line0',
        })
        .addTo(map);
    }
  });
}

// Hae kenttien arvot
// Piirrä reitti kartalle
function showRoute() {
  map.eachLayer((layer) => {
    if (layer._path != null) {
      if (!layer._latlngs[0].length) layer.remove();
    }
  });
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  getRoute(from, to);
}

// hae nappula ja fieldset jossa suodatusasetukset ovat
const filternappi = document.getElementById('filterbutton');
const filtercontent = document.querySelector('fieldset')
// lisää nappiin onclick eventti, jolla toggletaan show classiä, joka vaihtaa displayksi flex tai none
filternappi.addEventListener('click', () => {
  filtercontent.classList.toggle('show');
});