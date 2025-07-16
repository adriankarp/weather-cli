// CLI app

import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";

import { getCurrent, getForecast } from "./services/weather.js";
import { formatWeather } from "./utils/format.js";
import { logResult } from "./utils/logger.js";

console.log(
  chalk.cyan(figlet.textSync("weather-cli", { horizontalLayout: "full" }))
);

const { mode } = await inquirer.prompt({
  type: "list",
  name: "mode",
  message: "What do you need?",
  choices: [
    { name: "Current weather", value: true },
    { name: "10-day forecast", value: false },
  ],
});

const { location } = await inquirer.prompt({
  type: "input",
  name: "location",
  message: 'Enter location (city, address, or "lat,lon"):',
  validate: (s) => s.trim() !== "" || "Location cannot be empty",
});

const spinner = ora("Fetching weather data…").start();

try {
  if (mode) {
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
} catch (err) {
  spinner.fail(chalk.red(err.message));
  process.exit(1);
}
