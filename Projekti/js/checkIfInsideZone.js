// Tarkistaa onko marker polygonin sisällä
// Eli tarkistaa onko parkkipaikka tietyn vyöhykkeen (A,B,C,D) sisällä
function isPointInPolygon(longitude, latitude, polygon) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new TypeError('Invalid latitude or longitude. Numbers are expected');
  } else if (!polygon || !Array.isArray(polygon)) {
    throw new TypeError('Invalid polygon. Array with locations expected');
  } else if (polygon.length === 0) {
    throw new TypeError('Invalid polygon. Non-empty Array expected');
  }

  const x = latitude;
  const y = longitude;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]; const yi = polygon[i][1];
    const xj = polygon[j][0]; const yj = polygon[j][1];

    const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}
