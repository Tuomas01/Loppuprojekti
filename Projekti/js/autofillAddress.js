const textFrom = document.getElementById('from');
const textTo = document.getElementById('to');
let timeout = null; // default set

// API antaa jostain syystä samoja osoitteita
// Poista kopiot
function removeDuplicates(array) {
  const result = array.map((a) => a.properties.label);
  return [...new Set(result)];
}

// Hae 'FROM' kentästä arvo jolla hakea osoitteita
function getOptionsFrom(text) {
  // Tee array osoitteista
  // Näytä ne datalist kentässä
  const array1 = Array.from(document.getElementsByClassName('autoFillFrom'));
  if (array1[0]) {
    const arr = array1.filter((option) => option.value === document.getElementById('from').value);
    if (arr.length > 0) return;
  }

  // Timeout = odota 0.5 sekuntia ennen haun tekemistä
  // Tämä siksi ettei jokaisen kirjoitetun kirjaimen jälkeen tehtäisi samantien hakua
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const response = await fetch(`https://api.digitransit.fi/geocoding/v1/autocomplete?text=${text}`);
    const data = await response.json();
    const suggested = data.features;
    const list = document.getElementById('optionsFrom');
    list.innerHTML = '';

    // Poista kopiot
    const options = removeDuplicates(suggested);

    options.forEach((address) => {
      const option = document.createElement('option');
      option.value = address;
      option.className = 'autoFillFrom';
      list.appendChild(option);
    });
  }, 500);
}

// Hae 'TO' kentästä arvo jolla hakea osoitteita
function getOptionsTo(text) {
  // Tee array osoitteista
  // Näytä ne datalist kentässä
  const array1 = Array.from(document.getElementsByClassName('autoFillTo'));
  if (array1[0]) {
    const arr = array1.filter((option) => option.value === document.getElementById('to').value);
    if (arr.length > 0) return;
  }

  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const response = await fetch(`https://api.digitransit.fi/geocoding/v1/autocomplete?text=${text}`);
    const data = await response.json();
    const suggested = data.features;
    const list = document.getElementById('optionsTo');
    list.innerHTML = '';

    const options = removeDuplicates(suggested);

    options.forEach((address) => {
      const option = document.createElement('option');
      option.value = address;
      option.className = 'autoFillTo';
      list.appendChild(option);
    });
  }, 500);
}

// Poista ylimääräiset välilyönnit ja hae osoitteet
textFrom.addEventListener('input', (e) => {
  if (!e.target.value.trim()) return;
  getOptionsFrom(e.target.value);
});

textTo.addEventListener('input', (e) => {
  if (!e.target.value.trim()) return;
  getOptionsTo(e.target.value);
});
