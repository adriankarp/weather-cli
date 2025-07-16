// CLI app

import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";

import {
  getCurrent,
  getForecast,
  CurrentConditions,
  ForecastDay,
} from "./services/weather.js";
import { formatWeather } from "./utils/format.js";
import { logResult } from "./utils/logger.js";

console.log(
  chalk.cyan(figlet.textSync("weather-cli", { horizontalLayout: "full" }))
);

const { wantsWeather }: { wantsWeather: boolean } = await inquirer.prompt({
  type: "list",
  name: "wantsWeather",
  message: "What do you need?",
  choices: [
    { name: "Current weather", value: true },
    { name: "10-day forecast", value: false },
  ],
});

const { location }: { location: string } = await inquirer.prompt({
  type: "input",
  name: "location",
  message: 'Enter location (city, address, or "lat,lon"):',
  validate: (s: string) => s.trim() !== "" || "Location cannot be empty",
});

const spinner = ora("Fetching weather data…").start();

try {
  if (wantsWeather) {
    const raw = await getCurrent(location);
    const pretty = formatWeather(raw, "weather");
    spinner.succeed("Current weather:");
    console.log(pretty);
    await logResult("weather", location, pretty);
  } else {
    const raw = await getForecast(location);
    const pretty = formatWeather(raw, "forecast");
    spinner.succeed("10-day forecast:");
    console.log(pretty);
    await logResult("forecast", location, pretty);
  }
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  spinner.fail(chalk.red(msg));
  process.exit(1);
}
