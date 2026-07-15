export interface Airport {
  code: string;
  city: string;
  lat: number;
  lon: number;
}

// Approximate coordinates for a broad sample of Southwest destinations —
// good enough to pick the closest airport by straight-line distance, not
// meant to be an authoritative/current route map. Reconcile against
// southwest.com's actual destination list before relying on this for
// anything beyond a UI default.
export const AIRPORTS: Airport[] = [
  { code: 'ALB', city: 'Albany', lat: 42.75, lon: -73.8 },
  { code: 'ATL', city: 'Atlanta', lat: 33.64, lon: -84.43 },
  { code: 'AUS', city: 'Austin', lat: 30.19, lon: -97.67 },
  { code: 'BDL', city: 'Hartford', lat: 41.94, lon: -72.68 },
  { code: 'BHM', city: 'Birmingham', lat: 33.56, lon: -86.75 },
  { code: 'BNA', city: 'Nashville', lat: 36.13, lon: -86.68 },
  { code: 'BOI', city: 'Boise', lat: 43.56, lon: -116.22 },
  { code: 'BOS', city: 'Boston', lat: 42.36, lon: -71.01 },
  { code: 'BUF', city: 'Buffalo', lat: 42.94, lon: -78.73 },
  { code: 'BUR', city: 'Burbank', lat: 34.2, lon: -118.36 },
  { code: 'BWI', city: 'Baltimore', lat: 39.18, lon: -76.67 },
  { code: 'CAK', city: 'Akron-Canton', lat: 40.92, lon: -81.44 },
  { code: 'CHS', city: 'Charleston', lat: 32.9, lon: -80.04 },
  { code: 'CLE', city: 'Cleveland', lat: 41.41, lon: -81.85 },
  { code: 'CLT', city: 'Charlotte', lat: 35.21, lon: -80.94 },
  { code: 'CMH', city: 'Columbus', lat: 39.998, lon: -82.89 },
  { code: 'CVG', city: 'Cincinnati', lat: 39.05, lon: -84.66 },
  { code: 'DAL', city: 'Dallas', lat: 32.85, lon: -96.85 },
  { code: 'DAY', city: 'Dayton', lat: 39.9, lon: -84.22 },
  { code: 'DCA', city: 'Washington, D.C.', lat: 38.85, lon: -77.04 },
  { code: 'DEN', city: 'Denver', lat: 39.86, lon: -104.67 },
  { code: 'DSM', city: 'Des Moines', lat: 41.53, lon: -93.66 },
  { code: 'DTW', city: 'Detroit', lat: 42.21, lon: -83.35 },
  { code: 'ECP', city: 'Panama City Beach', lat: 30.36, lon: -85.68 },
  { code: 'ELP', city: 'El Paso', lat: 31.81, lon: -106.38 },
  { code: 'EWR', city: 'Newark', lat: 40.69, lon: -74.17 },
  { code: 'FLL', city: 'Fort Lauderdale', lat: 26.07, lon: -80.15 },
  { code: 'FNT', city: 'Flint', lat: 42.97, lon: -83.74 },
  { code: 'GEG', city: 'Spokane', lat: 47.62, lon: -117.53 },
  { code: 'GRR', city: 'Grand Rapids', lat: 42.88, lon: -85.52 },
  { code: 'GSP', city: 'Greenville-Spartanburg', lat: 34.9, lon: -82.22 },
  { code: 'HOU', city: 'Houston', lat: 29.65, lon: -95.28 },
  { code: 'HRL', city: 'Harlingen', lat: 26.23, lon: -97.65 },
  { code: 'IAD', city: 'Washington Dulles', lat: 38.94, lon: -77.46 },
  { code: 'IND', city: 'Indianapolis', lat: 39.72, lon: -86.29 },
  { code: 'JAX', city: 'Jacksonville', lat: 30.49, lon: -81.69 },
  { code: 'LAS', city: 'Las Vegas', lat: 36.08, lon: -115.15 },
  { code: 'LAX', city: 'Los Angeles', lat: 33.94, lon: -118.41 },
  { code: 'LBB', city: 'Lubbock', lat: 33.66, lon: -101.82 },
  { code: 'LGA', city: 'New York (LaGuardia)', lat: 40.78, lon: -73.87 },
  { code: 'LIT', city: 'Little Rock', lat: 34.73, lon: -92.22 },
  { code: 'MAF', city: 'Midland-Odessa', lat: 31.94, lon: -102.2 },
  { code: 'MCI', city: 'Kansas City', lat: 39.3, lon: -94.71 },
  { code: 'MCO', city: 'Orlando', lat: 28.43, lon: -81.31 },
  { code: 'MDW', city: 'Chicago (Midway)', lat: 41.79, lon: -87.75 },
  { code: 'MEM', city: 'Memphis', lat: 35.04, lon: -89.98 },
  { code: 'MHT', city: 'Manchester', lat: 42.93, lon: -71.44 },
  { code: 'MIA', city: 'Miami', lat: 25.79, lon: -80.29 },
  { code: 'MKE', city: 'Milwaukee', lat: 42.95, lon: -87.9 },
  { code: 'MSN', city: 'Madison', lat: 43.14, lon: -89.34 },
  { code: 'MSP', city: 'Minneapolis-St. Paul', lat: 44.88, lon: -93.22 },
  { code: 'MSY', city: 'New Orleans', lat: 29.99, lon: -90.26 },
  { code: 'MYR', city: 'Myrtle Beach', lat: 33.68, lon: -78.93 },
  { code: 'OAK', city: 'Oakland', lat: 37.71, lon: -122.21 },
  { code: 'OKC', city: 'Oklahoma City', lat: 35.39, lon: -97.6 },
  { code: 'OMA', city: 'Omaha', lat: 41.3, lon: -95.89 },
  { code: 'ONT', city: 'Ontario', lat: 34.06, lon: -117.6 },
  { code: 'ORF', city: 'Norfolk', lat: 36.89, lon: -76.2 },
  { code: 'PBI', city: 'West Palm Beach', lat: 26.68, lon: -80.1 },
  { code: 'PDX', city: 'Portland', lat: 45.59, lon: -122.6 },
  { code: 'PHL', city: 'Philadelphia', lat: 39.87, lon: -75.24 },
  { code: 'PHX', city: 'Phoenix', lat: 33.43, lon: -112.01 },
  { code: 'PIT', city: 'Pittsburgh', lat: 40.49, lon: -80.23 },
  { code: 'PNS', city: 'Pensacola', lat: 30.47, lon: -87.19 },
  { code: 'PVD', city: 'Providence', lat: 41.72, lon: -71.43 },
  { code: 'PWM', city: 'Portland', lat: 43.65, lon: -70.31 },
  { code: 'RDU', city: 'Raleigh-Durham', lat: 35.88, lon: -78.79 },
  { code: 'RIC', city: 'Richmond', lat: 37.51, lon: -77.32 },
  { code: 'RNO', city: 'Reno-Tahoe', lat: 39.5, lon: -119.77 },
  { code: 'ROC', city: 'Rochester', lat: 43.12, lon: -77.67 },
  { code: 'RSW', city: 'Fort Myers', lat: 26.54, lon: -81.75 },
  { code: 'SAN', city: 'San Diego', lat: 32.73, lon: -117.19 },
  { code: 'SAT', city: 'San Antonio', lat: 29.53, lon: -98.47 },
  { code: 'SDF', city: 'Louisville', lat: 38.17, lon: -85.74 },
  { code: 'SEA', city: 'Seattle-Tacoma', lat: 47.45, lon: -122.31 },
  { code: 'SFO', city: 'San Francisco', lat: 37.62, lon: -122.38 },
  { code: 'SJC', city: 'San Jose', lat: 37.36, lon: -121.93 },
  { code: 'SJU', city: 'San Juan', lat: 18.44, lon: -66.0 },
  { code: 'SLC', city: 'Salt Lake City', lat: 40.79, lon: -111.98 },
  { code: 'SMF', city: 'Sacramento', lat: 38.7, lon: -121.59 },
  { code: 'SNA', city: 'Santa Ana', lat: 33.68, lon: -117.87 },
  { code: 'STL', city: 'St. Louis', lat: 38.75, lon: -90.37 },
  { code: 'SYR', city: 'Syracuse', lat: 43.11, lon: -76.11 },
  { code: 'TPA', city: 'Tampa', lat: 27.98, lon: -82.53 },
  { code: 'TUL', city: 'Tulsa', lat: 36.2, lon: -95.89 },
  { code: 'TUS', city: 'Tucson', lat: 32.12, lon: -110.94 },
  { code: 'CUN', city: 'Cancun', lat: 21.04, lon: -86.87 },
  { code: 'MBJ', city: 'Montego Bay', lat: 18.5, lon: -77.91 },
  { code: 'PUJ', city: 'Punta Cana', lat: 18.57, lon: -68.36 },
  { code: 'SJD', city: 'Los Cabos', lat: 23.15, lon: -109.72 },
  { code: 'NAS', city: 'Nassau', lat: 25.04, lon: -77.47 },
  { code: 'PVR', city: 'Puerto Vallarta', lat: 20.68, lon: -105.25 },
  { code: 'LIR', city: 'Liberia', lat: 10.59, lon: -85.54 },
  { code: 'SJO', city: 'San Jose', lat: 9.99, lon: -84.21 },
  { code: 'BZE', city: 'Belize City', lat: 17.54, lon: -88.31 },
  { code: 'GCM', city: 'Grand Cayman', lat: 19.29, lon: -81.36 },
];

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestAirport(lat: number, lon: number): Airport {
  return AIRPORTS.reduce((closest, airport) => {
    const distance = haversineDistanceKm(lat, lon, airport.lat, airport.lon);
    const closestDistance = haversineDistanceKm(lat, lon, closest.lat, closest.lon);
    return distance < closestDistance ? airport : closest;
  }, AIRPORTS[0]);
}
