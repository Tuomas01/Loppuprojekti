// Filtteröi parkkipaikkoja checkboxien valintojen mukaisesti
async function filteredData(data) {
  function selectZones() {
    // Tarkista mitä vyöhykkeitä käyttäjä haluaa nähdä
    const checkIfSelected = (el) => el.classList.contains('selected');

    const zoneA = checkIfSelected(document.getElementById('zoneA'))
      ? 'A'
      : null;
    const zoneB = checkIfSelected(document.getElementById('zoneB'))
      ? 'B'
      : null;
    const zoneC = checkIfSelected(document.getElementById('zoneC'))
      ? 'C'
      : null;
    const zoneD = checkIfSelected(document.getElementById('zoneD'))
      ? 'D'
      : null;
    const muut = checkIfSelected(document.getElementById('muut'))
      ? 'Muut'
      : null;
    return [zoneA, zoneB, zoneC, zoneD, muut].filter((e) => e);
  }

  // Katso eri checkboxien arvo
  // (true / false)
  const ilmainen = document.getElementById('ilmainen').checked;
  const sahkoAuto = document.getElementById('sahkoAuto').checked;
  const zones = selectZones();

  // Suodata parkkipaikat käyttäjän valintojen mukaisesti
  let filtered = data
    .filter((e) => e.attributes.SAHKOAUTO >= sahkoAuto
    && zones.includes(e.attributes.ZONE));

  // Jos ilmainen valittu
  // Poista maksulliset parkkipaikat
  if (ilmainen) {
    filtered = filtered
      .filter((e) => e.attributes.HINTAFI === 'ilmainen');
  }

  if (filtered.length === 0) clearMarkers();
  return filtered;
}
