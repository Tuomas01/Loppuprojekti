async function main() {
  // Sivuston latauduttua
  // lataa APIn palauttamat tiedot
  // 'parkingData' arvoksi
  const parkingData = await getData();

  // ParkkiAPIn data näkyy konsolissa
  // Features pitää sisällään kaikki parkkipaikat
  // Klikkaamalla auki 'features' näkyy kaikki liityntäpysäköintipaikat
  console.log(parkingData);

  // Features on array joka pitää sisällään olioita
  // Olion arvoina ovat parkkipaikan tiedot
  //
  // esim.
  // parkingData.features[0].attributes.NAVIGOINTI (huom. isot ja pienet kirjaimet)
  // Antaa arvoksi features arrayn ENSIMMÄISENÄ olevan parkkipaikan osoitteen
  // Konsolissa pitäisi näkyä => Poikkitie 91
  console.log(parkingData.features[0].attributes.NAVIGOINTI);

  // Lisää parkkipaikat kartalle
  async function showData(arr) {
    const editedData = addZoneProp(arr);
    // Tallenna filtteröity data muuttujaan
    // filteredData() palauttaa arrayn
    const filtered = await filteredData(await editedData);
    // Create group for clustering markers
    const markers = new L.MarkerClusterGroup();

    // Käy läpi filtteröity array
    // Lisää jokaisen parkkipaikan tiedot popuppiin ja lopuksi parkkipaikat kartalle
    filtered.forEach((place) => {
      // Popup kun käyttäjä klikkaa parkkipaikka ikonia
      const popup = `
        <h4>${place.attributes.KUNTA || 'Kuntatieto ei saatavilla'}</h4>
        <p>Katuosoite: ${place.attributes.OSOITEFI || 'Katuosoite ei saatavilla'} </p>
        <p>Paikkoja: ${place.attributes.PAIKKOJA || 'Paikkatietoja ei saatavilla'}</p>
        <p>Parkkimaksu: ${place.attributes.HINTAFI || 'Parkkimaksutietoja ei saatavilla'}</p>
        <p>Latauspisteitä sähköautoille: ${place.attributes.SAHKOAUTO || 0}</p>
        <p>Vyöhyke: ${place.attributes.ZONE || 'Ei HSL-alueella'}</p>`;

      // Sijaintitiedot ovat polygoneja (maalattu alue kartalla)
      // getCoordinates() palauttaa polygonin keskuskohdan sijainnin latitude ja longitude arvoina
      // Latitude ja longitude arvojen avulla, parkkipaikka lisätään markkerina kartalle
      //
      // Parkkipaikan iconiksi on määritelty 'parking.svg'
      // Tiedot ikonista löytyvät tiedostosta icons.js
      markers.addLayer(L
        .marker(getCoordinates(place.geometry.rings[0]), { icon: parking })
        .bindPopup(popup)).on('click', clickZoom);

      // 1. Tyhjennä kartta aiemmsita markkereista
      // 2. Lisää markkerit
      // Näin tehdään ettei vanhat markkerit jää kartalle kun filtteröinti tapahtuu
      clearMarkers();
      map.addLayer(markers);
    });
  }

  // Hae kaikki elementit (checkboxit) joiden luokka on 'filtered'
  // Jos checkboxin arvo vaihtuu näytä filtteröity data kartalla
  function addListeners() {
    const elements = document.getElementsByClassName('filtered');
    Array.from(elements, (c) => c.addEventListener('click', () => showData(parkingData)));
  }

  function clickZoom(e) {
    map.on('popupopen', (e) => {
      const px = map.project(e.target._popup._latlng);
      px.y -= e.target._popup._container.clientHeight / 2;
      map.panTo(map.unproject(px), { animate: true });
    });
  }
  // Lisää eventhandlerit DOMiin
  addListeners();
  zoneListeners();
  // Lisää kaikki parkkipaikat kartalle (ensimmäinen lataus)
  showData(parkingData);
}

main();
