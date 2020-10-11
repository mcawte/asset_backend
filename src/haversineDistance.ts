// This function returns the approximate distance traveled between two points on the globe
export default function haversineDistance(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): number {
  function toRadians(x: number): number {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // Radius of earth in km

  var latChange = toRadians(endLat - startLat);
  var lngChange = toRadians(endLng - startLng);

  var a =
    Math.sin(latChange / 2) ** 2 +
    Math.cos(toRadians(startLat)) *
      Math.cos(toRadians(endLat)) *
      Math.sin(lngChange / 2) ** 2;

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (isNaN(c)) {
    c = 0;
  }

  return R * c;
}
