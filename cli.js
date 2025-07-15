// CLI app

import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";

import { getCurrent, getForecast } from "./services/weather.js";
import { formatWeather } from "./utils/format.js";
import { logResult } from "./utils/logger.js";

const program = new Command();

program
  .name("weather-cli")
  .description(
    "CLI tool to fetch current weather or forecast for any given location"
  )
  .version("1.0.0");

program
  .option("-w, --weather", "Fetch current weather")
  .option("-f, --forecast", "Fetch weather forecast")
  .argument("<location>", "Location to fetch data for")
  .showHelpAfterError();

program.action(async (location, options, command) => {
  const { weather, forecast } = options;

  if ((weather && forecast) || (!weather && !forecast)) {
    console.error("Specify either --weather (-w) or --forecast (-f).");
    command.help({ error: true });
  }

  const spinner = ora("Fetching weather data…").start();

  try {
    if (weather) {
      const raw = await getCurrent(location);
      const pretty = formatWeather(raw, "weather");
      spinner.succeed("Current weather:");
      console.log(pretty);
      await logResult("weather", pretty);
    } else {
      const raw = await getForecast(location);
      const pretty = formatWeather(raw, "forecast");
      spinner.succeed("15-day forecast:");
      console.log(pretty);
      await logResult("forecast", pretty);
    }
  } catch (err) {
    spinner.fail(chalk.red(err.message));
    process.exit(1);
  }
});

program.parseAsync();
