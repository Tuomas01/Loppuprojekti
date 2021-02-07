const textFrom = document.getElementById('from');
const textTo = document.getElementById('to');
let timeout = null; // default set

function removeDuplicates(array) {
  const result = array.map((a) => a.properties.label);
  return [...new Set(result)];
}

// Get auto complete street names
// Field: from
function getOptionsFrom(text) {
  // Make array from options
  // Hide autofill field if input has same address
  const array1 = Array.from(document.getElementsByClassName('autoFillFrom'));
  if (array1[0]) {
    const arr = array1.filter((option) => option.value === document.getElementById('from').value);
    if (arr.length > 0) return;
  }

  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const response = await fetch(`https://api.digitransit.fi/geocoding/v1/autocomplete?text=${text}`);
    // &layers=address
    const data = await response.json();
    const suggested = data.features;
    const list = document.getElementById('optionsFrom');
    list.innerHTML = '';

    // Remove duplicate addresses
    const options = removeDuplicates(suggested);

    options.forEach((address) => {
      const option = document.createElement('option');
      option.value = address;
      option.className = 'autoFillFrom';
      list.appendChild(option);
    });
  }, 500);
}

// Get auto complete street names
// Field: to
function getOptionsTo(text) {
  // Make array from options
  // Hide autofill field if input has same address
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

    // Remove duplicate addresses
    const options = removeDuplicates(suggested);

    options.forEach((address) => {
      const option = document.createElement('option');
      option.value = address;
      option.className = 'autoFillTo';
      list.appendChild(option);
    });
  }, 500);
}

textFrom.addEventListener('input', (e) => {
  if (!e.target.value.trim()) return;
  getOptionsFrom(e.target.value);
});

textTo.addEventListener('input', (e) => {
  if (!e.target.value.trim()) return;
  getOptionsTo(e.target.value);
});
