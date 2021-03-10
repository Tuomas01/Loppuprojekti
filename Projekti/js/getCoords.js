// Palauta polygonin keskus longitude (Y) ja latitude (X) arvoina
function getCoordinates(arr) {
  let minX;
  let maxX;
  let minY;
  let maxY;
  for (let i = 0; i < arr.length; i++) {
    minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
    maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
    minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
    maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
  }
  return [(minY + maxY) / 2, (minX + maxX) / 2];
}
