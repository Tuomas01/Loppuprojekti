// Lisää Zone-muuttuja parkkipaikkoihin
// Jos parkkipaikka sihaitsee vyöhykkeellä A => Zone: 'A'
// Jos ei ole HSL alueella => Zone: 'Muut'
async function addZoneProp(data) {
  const regions = await getRegions();
  const places = await data.features;

  const edited = places.map((place) => {
    const coords = getCoordinates(place.geometry.rings[0]);
    const lat = coords[0];
    const long = coords[1];

    if (isPointInPolygon(lat, long, regions.features[0].geometry.coordinates[0])) {
      place.attributes.ZONE = 'A';
    } else if (isPointInPolygon(lat, long, regions.features[1].geometry.coordinates[0])) {
      place.attributes.ZONE = 'B';
    } else if (isPointInPolygon(lat, long, regions.features[2].geometry.coordinates[0])) {
      place.attributes.ZONE = 'C';
    } else if (place.attributes.HSL_ALUE === '0') {
      place.attributes.ZONE = 'Muut';
    } else {
      place.attributes.ZONE = 'D';
    }
    return place;
  });
  return edited;
}
