// Hae parkkipaikat APIsta
async function getData() {
  try {
    const url = 'https://services1.arcgis.com/sswNXkUiRoWtrx0t/arcgis/rest/services/liipi_auto_fasiliteetit/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';
    const data = await fetch(url);
    const result = await data.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}
