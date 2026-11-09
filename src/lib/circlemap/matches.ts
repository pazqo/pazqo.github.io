export interface City { id: number; name: string; ascii: string; lat: number; lon: number; country: string; population: number }
export interface Circle { id: number; origin: City; km: number; color: string }
import {distance} from './geo';
// Return each matching city once, retaining distances for every matching circle.
export function findMatches(cities: City[], circles: Circle[], tolerance: number, population=100000, mode: 'any' | 'all'='any') {
 if(!circles.length)return [];
 return cities.filter(c=>c.population>=population).flatMap(city=>{
  const hits=circles.map(circle=>({circle,distance:distance(circle.origin,city)}))
    .filter(hit=>city.id!==hit.circle.origin.id && Math.abs(hit.distance-hit.circle.km)<=tolerance);
  if(!hits.length || (mode==='all' && hits.length!==circles.length))return [];
  hits.sort((a,b)=>Math.abs(a.distance-a.circle.km)-Math.abs(b.distance-b.circle.km));
  return [{...city,hits,distance:hits[0].distance,error:Math.abs(hits[0].distance-hits[0].circle.km)}];
 }).sort((a,b)=>b.population-a.population || a.error-b.error);
}
