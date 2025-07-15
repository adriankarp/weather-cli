// Fetch layer

const BASE_URL = process.env.VISUAL_CROSSING_URL;
const API_KEY = process.env.VISUAL_CROSSING_API_KEY;
const COMMON_QUERY = "unitGroup=metric&lang=en&contentType=json";

if (!BASE_URL || !API_KEY) {
  throw new Error(
    "Base URL and API key are required. Please check .env.example on how to name them."
  );
}

/**
 * Fetch the current weather for a place.
 * @param {string} location city, address or "lat,lon"
 * @returns {Promise<object>}
 */
export async function getCurrent(location) {
  const loc = encodeURIComponent(location.trim());
  const url =
    `${BASE_URL}/${loc}` + `?include=current&${COMMON_QUERY}&key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);

  const data = await res.json();
  if (!data.currentConditions)
    throw new Error("API response missing currentConditions block");

  return data.currentConditions;
}

/**
 * Fetch 15-days forecast for a place.
 * @param {string} location city, address or "lat,lon"
 * @returns {Promise<object[]>}
 */
export async function getForecast(location) {
  const loc = encodeURIComponent(location.trim());

  const url =
    `${BASE_URL}/${loc}` + `?include=days,fcst&${COMMON_QUERY}&key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);

  const data = await res.json();
  if (!Array.isArray(data.days))
    throw new Error("API response missing days forecast array");

  return data.days;
}
