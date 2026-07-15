export interface GeoCoords {
  lat: number;
  lon: number;
}

/**
 * Resolves the visitor's approximate location via ipgeolocation.io.
 * Returns null on any failure (missing key, network error, bad response)
 * so callers can fall back to a static default without surfacing an error.
 */
export async function fetchGeoLocation(): Promise<GeoCoords | null> {
  const apiKey = import.meta.env.VITE_GEO_IP_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&fields=latitude,longitude`,
    );
    if (!response.ok) return null;

    const data = await response.json();
    const lat = parseFloat(data.latitude);
    const lon = parseFloat(data.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return { lat, lon };
  } catch {
    return null;
  }
}
