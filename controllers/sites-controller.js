import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

//get sites list
const sites = async (_req, res) => {
  try {
    const data = await knex("main_record");
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    `Error retrieving sites: ${error}`;
  }
};

const findOneSite = async (req, res) => {
  try {
    const siteFound = await knex("main_record").where(
      "main_record.site_id",
      req.params.siteId
    );

    if (siteFound.length === 0) {
      return res.status(404).json({
        message: `site with Id ${req.params.siteId} not found`,
      });
    }

    const siteData = siteFound[0];
    res.status(200).json(siteData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve site with name ${req.params.siteId}`,
    });
  }
};

const findOneSiteDischarge = async (req, res) => {
  try {
    const siteFound = await knex("discharge")
      .where("discharge.station_id", req.params.siteId)
      .join("main_record", "discharge.station_id", "main_record.site_id")
      .select("discharge.*", "main_record.site_name", "main_record.city_id");
    if (siteFound.length === 0) {
      return res.status(404).json({
        message: `Site with ID ${req.params.siteId} not found`,
      });
    }

    const siteData = siteFound;
    res.status(200).json(siteData);
    console.log(siteData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve site with ID ${req.params.siteId}`,
    });
  }
};

//find discharge but combined data
const findCombinedData = async (req, res) => {
  try {
    const result = await knex("discharge")
      .join("main_record", "discharge.station_id", "main_record.site_id")
      .join(
        "weather_main_record",
        "main_record.city_id",
        "weather_main_record.weather_id"
      )
      .join("weather", "weather_main_record.weather_id", "weather.climate_id")
      .select(
        "discharge.station_id",
        "discharge.date as discharge_date",
        "discharge.discharge",
        "discharge.water_level",
        "main_record.site_name",
        "weather.ave_temperature",
        "weather.total_preciptation"
      )
      .where("discharge.station_id", req.params.siteId)
      .andWhere("discharge.date", "=", knex.ref("weather.date")); // Ensure dates match
    //   .groupBy(
    //     "discharge.station_id",
    //     "discharge.date",
    //     "main_record.site_name",
    //     "weather.ave_temperature",
    //     "weather.total_preciptation"
    //   );

    // Check if any records were found
    if (result.length === 0) {
      return res.status(404).json({
        message: `No records found for station with ID ${req.params.siteId}`,
      });
    }

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: `Unable to retrieve data for station with ID ${req.params.siteId}`,
    });
  }
};

//find selected data for a time peroid
const findCombinedDataInRange = async (req, res) => {
  try {
    // const { startDate, endDate } = req.query;
    const { startDate, endDate } = req.body;

    // Validate date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        message:
          "Please provide both startDate and endDate as query parameters.",
      });
    }

    const result = await knex("discharge")
      .join("main_record", "discharge.station_id", "main_record.site_id")
      .join(
        "weather_main_record",
        "main_record.city_id",
        "weather_main_record.weather_id"
      )
      .join("weather", "weather_main_record.weather_id", "weather.climate_id")
      .select(
        "discharge.station_id",
        "discharge.date as discharge_date",
        "discharge.discharge",
        "discharge.water_level",
        "main_record.site_name",
        "weather.ave_temperature",
        "weather.total_preciptation"
      )
      .where("discharge.station_id", req.params.siteId)
      .andWhere("discharge.date", ">=", startDate) // Filter by start date
      .andWhere("discharge.date", "<=", endDate) // Filter by end date
      .andWhere("discharge.date", "=", knex.ref("weather.date")); // Ensure dates match
    //   .groupBy(
    //     "discharge.station_id",
    //     "discharge.date",
    //     "main_record.site_name",
    //     "weather.ave_temperature",
    //     "weather.total_precipitation"
    //   )
    // Check if any records were found
    if (result.length === 0) {
      return res.status(404).json({
        message: `No records found for station with ID ${req.params.siteId} in the specified date range.`,
      });
    }

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: `Unable to retrieve data for station with ID ${req.params.siteId} in the specified date range.`,
    });
  }
};

export {
  sites,
  findOneSite,
  findOneSiteDischarge,
  findCombinedData,
  findCombinedDataInRange,
};
