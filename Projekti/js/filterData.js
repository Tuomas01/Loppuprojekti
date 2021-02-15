// Filtteröi parkkipaikkoja checkboxien valintojen mukaisesti
async function filteredData(array) {
  const data = array;
  // Katso eri checkboxien arvo
  // (true tai false)
  const sahko = document.getElementById('sahkoAuto').checked;
  const ilmainen = document.getElementById('ilmainen').checked;
  const hsl = document.getElementById('hslAlue').checked;

  // TODO:
  // Filtteröi tehokkaammin

  // Tämä toimii, mutta todella työlästä lisätä uusia filtteröintiehtoja

  switch (true) {
    case (sahko && ilmainen && hsl):
      return data.features.filter((place) => place.attributes.HINTAFI === 'ilmainen'
      && place.attributes.SAHKOAUTO > 0
      && place.attributes.HSL_ALUE > 0);
    case (sahko && ilmainen):
      return data.features.filter((place) => place.attributes.SAHKOAUTO > 0
      && place.attributes.HINTAFI === 'ilmainen');
    case (sahko && hsl):
      return data.features.filter((place) => place.attributes.SAHKOAUTO > 0
      && place.attributes.HSL_ALUE > 0);
    case (ilmainen && hsl):
      return data.features.filter((place) => place.attributes.HINTAFI === 'ilmainen'
      && place.attributes.HSL_ALUE > 0);
    case (sahko):
      return data.features.filter((place) => place.attributes.SAHKOAUTO > 0);
    case (ilmainen):
      return data.features.filter((place) => place.attributes.HINTAFI === 'ilmainen');
    case (hsl):
      return data.features.filter((place) => place.attributes.HSL_ALUE > 0);
    default:
      return data.features;
  }
}
