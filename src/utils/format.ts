// API response format

import chalk from "chalk";
import type { CurrentConditions, ForecastDay } from "../services/weather.js";

/**
 * Turn raw JSON into a short, colorful string.
 * @param {object|object[]} data API payload (currentConditions or days[])
 * @param {"weather"|"forecast"} mode determines formatting rules
 * @returns {string}
 */
export function formatWeather(
  data: CurrentConditions | ForecastDay[],
  mode: "weather" | "forecast" = "weather"
): string {
  if (mode === "weather") {
    const { temp, feelslike, humidity, windspeed, conditions, icon } =
      data as CurrentConditions;

    const tempStr = colorTemp(temp);
    const feelsStr = colorTemp(feelslike);

    return (
      `${iconEmoji(icon)}  ${chalk.bold(conditions)}  ` +
      `${tempStr} (feels like ${feelsStr})  ` +
      `Humidity ${humidity}%  Wind ${windspeed} km/h`
    );
  }

  const days = (Array.isArray(data) ? data.slice(0, 10) : []) as ForecastDay[];

  return days
    .map((d) => {
      const date = chalk.gray(
        new Date(d.datetime ?? d.datetimeEpoch! * 1000).toLocaleDateString(
          "en-GB",
          {
            weekday: "short",
            day: "2-digit",
            month: "short",
          }
        )
      );
      const hi = chalk.red(`${d.tempmax}°`);
      const lo = chalk.blue(`${d.tempmin}°`);
      return `${date}  ${iconEmoji(d.icon)}  ${hi}/${lo}  ${d.conditions}`;
    })
    .join("\n");
}

/** Helper for temperature coloring */
function colorTemp(t: number): string {
  if (t >= 30) return chalk.red(`${t}°`);
  if (t >= 20) return chalk.yellow(`${t}°`);
  if (t >= 10) return chalk.green(`${t}°`);
  return chalk.cyan(`${t}°`);
}

/** A mapping between icon strings and emojis */
const ICON_MAP = {
  rain: "🌧️",
  snow: "❄️",
  "clear-day": "☀️",
  "clear-night": "🌙",
  "partly-cloudy-day": "⛅",
  "partly-cloudy-night": "🌤️",
  cloudy: "☁️",
  thunderstorm: "🌩️",
} as const;

type IconKey = keyof typeof ICON_MAP;

function iconEmoji(icon: string): string {
  return ICON_MAP[icon as IconKey] ?? "🌡️";
}
