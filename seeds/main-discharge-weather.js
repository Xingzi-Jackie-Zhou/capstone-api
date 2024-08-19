/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import mainData from "../seed-data/03_main_record.js";
import weatherData from "../seed-data/01_weather.js";
import dischargeData from "../seed-data/02_discharge.js";
import weatherMainData from "../seed-data/04_weather_main_record.js";

export async function seed(knex) {
  await knex("weather").del();
  await knex("discharge").del();
  await knex("main_record").del();
  await knex("weather_main_record").del();
  await knex("weather").insert(weatherData);
  await knex("discharge").insert(dischargeData);
  await knex("main_record").insert(mainData);
  await knex("weather_main_record").insert(weatherMainData);
}
