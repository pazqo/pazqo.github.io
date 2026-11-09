export interface Coordinates { lat: number; lon: number }
export const EARTH_RADIUS = 6371.0088;
const rad = (x: number) => x * Math.PI / 180;
const deg = (x: number) => x * 180 / Math.PI;
export function distance(a: Coordinates, b: Coordinates) {
  const dLat = rad(b.lat-a.lat), dLon = rad(b.lon-a.lon);
  const h = Math.sin(dLat/2)**2 + Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(Math.min(1, Math.max(0,h))));
}
export function destination(center: Coordinates, km: number, bearing: number): [number, number] {
  const d = km/EARTH_RADIUS, b = rad(bearing), lat = rad(center.lat), lon = rad(center.lon);
  const p = Math.asin(Math.sin(lat)*Math.cos(d)+Math.cos(lat)*Math.sin(d)*Math.cos(b));
  return [deg(p), deg(lon+Math.atan2(Math.sin(b)*Math.sin(d)*Math.cos(lat), Math.cos(d)-Math.sin(lat)*Math.sin(p)))];
}
// Unwrap longitudes so the ring stays continuous at the international date line.
export function ring(center: Coordinates, km: number) {
  const points: [number, number][]=[];
  for(let b=0;b<=360;b++) {
    const point=destination(center,km,b);
    if(points.length) { while(point[1]-points[points.length - 1][1]>180) point[1]-=360; while(point[1]-points[points.length - 1][1]<-180) point[1]+=360; }
    points.push(point);
  }
  return points;
}
