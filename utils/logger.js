// File manipulation

import { appendFile } from "fs/promises";

const WEATHER_FILE = "weather-log.txt";
const FORECAST_FILE = "forecast-log.txt";

/**
 * Logs the timestamped API response to the appropriate log file.
 * @param {"weather"|"forecast"} mode decides which file to write
 * @param {string} message
 */
export async function logResult(mode, location, message) {
  const stamp = new Date().toISOString();
  const fileName = mode === "weather" ? WEATHER_FILE : FORECAST_FILE;
  await appendFile(fileName, `[${stamp}] ${location}: ${message}\n`);
}
