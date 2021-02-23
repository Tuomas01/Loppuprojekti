function zoneListeners() {
  const elements = document.getElementsByClassName('zones');
  const zoneA = document.getElementById('zoneA');
  const zoneB = document.getElementById('zoneB');
  const zoneC = document.getElementById('zoneC');
  const zoneD = document.getElementById('zoneD');
  const muut = document.getElementById('muut');

  // Vaihda tyyliä jos käyttäjä valitsee vyöhykkeen
  function checkState(element) {
    if (element.classList.contains('selected')) {
      element.classList.remove('selected');
    } else {
      element.classList.add('selected');
    }
  }
  Array.from(elements, (zone) => zone.addEventListener('click', () => {
    switch (zone.id) {
      case 'zoneA':
        checkState(zoneA);
        break;
      case 'zoneB':
        checkState(zoneB);
        break;
      case 'zoneC':
        checkState(zoneC);
        break;
      case 'zoneD':
        checkState(zoneD);
        break;
      case 'muut':
        checkState(muut);
        break;
      default:
    }
  }));
}
