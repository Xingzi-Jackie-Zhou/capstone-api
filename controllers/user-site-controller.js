import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

//get sites list
const sites = async (req, res) => {
  try {
    const userNameId = req.user?.username;
    const defaultData = await knex("main_record").whereNull("user_id");

    let combinedData = defaultData;

    if (userNameId) {
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;

      if (userId) {
        const userData = await knex("main_record").where("user_id", userId);
        combinedData = [...defaultData, ...userData];
      }
    }

    res.status(200).json(combinedData);
  } catch (error) {
    `Error retrieving sites: ${error}`;
  }
};

const findOneSite = async (req, res) => {
  try {
    const userNameId = req.user?.username;
    const siteId = req.params.siteId;

    const defaultSiteFound = await knex("main_record")
      .whereNull("user_id")
      .where("site_id", siteId);

    let combinedSearch = defaultSiteFound;

    if (userNameId) {
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;

      if (userId) {
        const userSiteFound = await knex("main_record")
          .where("site_id", siteId)
          .where("user_id", userId);

        if (userSiteFound.length > 0) {
          combinedSearch = userSiteFound;
        }
      }
    }

    if (combinedSearch.length === 0) {
      return res.status(404).json({
        message: `Site with ID ${siteId} not found`,
      });
    }

    const siteData = combinedSearch[0];
    res.status(200).json(siteData);
  } catch (error) {
    console.error("Error retrieving site:", error);
    res.status(500).json({
      message: `Unable to retrieve site with ID ${siteId}`,
    });
  }
};

const findOneSiteDischarge = async (req, res) => {
  try {
    const userNameId = req.user?.username;
    const siteId = req.params.siteId;

    const defaultSiteFound = await knex("discharge")
      .where("discharge.station_id", siteId)
      .whereNull("discharge.user_id")
      .join("main_record", "discharge.station_id", "main_record.site_id")
      .select("discharge.*", "main_record.site_name", "main_record.city_id");

    let combinedSearch = defaultSiteFound;

    if (userNameId) {
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;

      if (userId) {
        const userSiteFound = await knex("discharge")
          .where("discharge.station_id", siteId)
          .where("discharge.user_id", userId)
          .join("main_record", "discharge.station_id", "main_record.site_id")
          .select(
            "discharge.*",
            "main_record.site_name",
            "main_record.city_id"
          );

        if (userSiteFound.length > 0) {
          combinedSearch = userSiteFound;
        }
      }
    }

    if (combinedSearch.length === 0) {
      return res.status(404).json({
        message: `Site with ID ${siteId} not found`,
      });
    }

    const siteData = combinedSearch;
    res.status(200).json(siteData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve site with ID ${req.params.siteId}`,
    });
  }
};

const findDischargeInRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userNameId = req.user?.username;
    const siteId = req.params.siteId;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message:
          "Please provide both startDate and endDate as query parameters.",
      });
    }
    const defaultSiteFound = await knex("discharge")
      .where("discharge.station_id", siteId)
      .whereNull("discharge.user_id")
      .join("main_record", "discharge.station_id", "main_record.site_id")
      .select("discharge.*", "main_record.site_name", "main_record.city_id")
      .andWhere("discharge.date", ">=", startDate)
      .andWhere("discharge.date", "<=", endDate);

    let combinedSearch = defaultSiteFound;

    if (userNameId) {
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;

      if (userId) {
        const userSiteFound = await knex("discharge")
          .where("discharge.station_id", req.params.siteId)
          .where("discharge.user_id", userId)
          .join("main_record", "discharge.station_id", "main_record.site_id")
          .select("discharge.*", "main_record.site_name", "main_record.city_id")
          .andWhere("discharge.date", ">=", startDate)
          .andWhere("discharge.date", "<=", endDate);

        if (userSiteFound.length > 0) {
          combinedSearch = userSiteFound;
        }
      }
    }

    if (combinedSearch.length === 0) {
      return res.status(404).json({
        message: `Site with ID ${siteId} not found`,
      });
    }

    const siteData = combinedSearch;
    res.status(200).json(siteData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve site with ID ${req.params.siteId}`,
    });
  }
};

//find discharge but combined data
const findCombinedData = async (req, res) => {
  try {
    const userNameId = req.user?.username;
    const siteId = req.params.siteId;

    const defaultSiteFound = await knex("discharge")
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
      .where("discharge.station_id", siteId)
      .whereNull("discharge.user_id")
      .andWhere("discharge.date", "=", knex.ref("weather.date"));

    let combinedSearch = defaultSiteFound;

    if (userNameId) {
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;

      if (userId) {
        const userSiteFound = await knex("discharge")
          .join("main_record", "discharge.station_id", "main_record.site_id")
          .join(
            "weather_main_record",
            "main_record.city_id",
            "weather_main_record.weather_id"
          )
          .join(
            "weather",
            "weather_main_record.weather_id",
            "weather.climate_id"
          )
          .select(
            "discharge.station_id",
            "discharge.date as discharge_date",
            "discharge.discharge",
            "discharge.water_level",
            "main_record.site_name",
            "weather.ave_temperature",
            "weather.total_preciptation"
          )
          .where("discharge.station_id", siteId)
          .where("discharge.user_id", userId)
          .andWhere("discharge.date", "=", knex.ref("weather.date"));

        if (userSiteFound.length > 0) {
          combinedSearch = userSiteFound;
        }
      }
    }

    if (combinedSearch.length === 0) {
      return res.status(404).json({
        message: `Site with ID ${siteId} not found`,
      });
    }

    const siteData = combinedSearch;
    res.status(200).json(siteData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve site with ID ${req.params.siteId}`,
    });
  }
};

//find selected data for a time peroid
const findCombinedDataInRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userNameId = req.user?.username;
    const siteId = req.params.siteId;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message:
          "Please provide both startDate and endDate as query parameters.",
      });
    }
    const defaultSiteFound = await knex("discharge")
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
      .where("discharge.station_id", siteId)
      .whereNull("discharge.user_id")
      .andWhere("discharge.date", ">=", startDate)
      .andWhere("discharge.date", "<=", endDate)
      .andWhere("discharge.date", "=", knex.ref("weather.date"));

    let combinedSearch = defaultSiteFound;

    if (userNameId) {
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;

      if (userId) {
        const userSiteFound = await knex("discharge")
          .join("main_record", "discharge.station_id", "main_record.site_id")
          .join(
            "weather_main_record",
            "main_record.city_id",
            "weather_main_record.weather_id"
          )
          .join(
            "weather",
            "weather_main_record.weather_id",
            "weather.climate_id"
          )
          .select(
            "discharge.station_id",
            "discharge.date as discharge_date",
            "discharge.discharge",
            "discharge.water_level",
            "main_record.site_name",
            "weather.ave_temperature",
            "weather.total_preciptation"
          )
          .where("discharge.station_id", siteId)
          .where("discharge.user_id", userId)
          .andWhere("discharge.date", ">=", startDate)
          .andWhere("discharge.date", "<=", endDate)
          .andWhere("discharge.date", "=", knex.ref("weather.date"));

        if (userSiteFound.length > 0) {
          combinedSearch = userSiteFound;
        }
      }
    }

    if (combinedSearch.length === 0) {
      return res.status(404).json({
        message: `Site with ID ${siteId} not found`,
      });
    }

    const siteData = combinedSearch;
    res.status(200).json(siteData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve site with ID ${req.params.siteId}`,
    });
  }
};

export {
  sites,
  findOneSite,
  findOneSiteDischarge,
  findDischargeInRange,
  findCombinedData,
  findCombinedDataInRange,
};
