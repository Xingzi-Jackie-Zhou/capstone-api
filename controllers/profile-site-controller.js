import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const allSites = async (req, res) => {
  try {
    const userNameId = req.user?.username;
    if (!userNameId) {
      return res.status(400).json({ error: "User not authenticated" });
    }
    const user = await knex("users").where({ username: userNameId }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user.id;
    const userData = await knex("main_record").where("user_id", userId);

    res.status(200).json(userData);
  } catch (error) {
    console.error(`Error retrieving sites: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSiteDetails = async (req, res) => {
  try {
    const { siteId } = req.params;
    const userNameId = req.user?.username;
    if (!userNameId) {
      return res.status(400).json({ error: "User not authenticated" });
    }
    const user = await knex("users").where({ username: userNameId }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user.id;
    const site = await knex("main_record")
      .where({ site_id: siteId, user_id: userId })
      .first();
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }
    const weatherID = site.city_id;
    const city = await knex("weather_main_record")
      .where({ weather_id: weatherID, user_id: userId })
      .first();
    if (!city) {
      return res.status(404).json({ error: "Weather site not found" });
    }

    const dischargeData = await knex("discharge").where({
      station_id: siteId,
      user_id: userId,
    });
    const weatherData = await knex("weather").where({
      climate_id: site.city_id,
      user_id: userId,
    });

    res.status(200).json({
      site,
      discharge: dischargeData,
      weather: weatherData,
    });
  } catch (error) {
    console.error(`Error retrieving site details: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSite = async (req, res) => {
  try {
    const { siteId } = req.params;
    const userNameId = req.user?.username;
    if (!userNameId) {
      return res.status(400).json({ error: "User not authenticated" });
    }
    const user = await knex("users").where({ username: userNameId }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user.id;
    const mainRecord = await knex("main_record")
      .where({ site_id: siteId, user_id: userId })
      .first();
    if (!mainRecord) {
      return res.status(404).json({ error: "Site not found" });
    }

    const weatherID = mainRecord.city_id;

    const resultWeather = await knex("weather")
      .where({ climate_id: weatherID, user_id: userId })
      .del();
    const resultWeatherMain = await knex("weather_main_record")
      .where({ weather_id: weatherID, user_id: userId })
      .del();
    const resultMain = await knex("main_record")
      .where({ site_id: siteId, user_id: userId })
      .del();
    const resultDischarge = await knex("discharge")
      .where({ station_id: siteId, user_id: userId })
      .del();
    if (resultMain && resultWeatherMain && resultDischarge && resultWeather) {
      res.status(200).json({ message: "Site deleted successfully" });
    } else {
      res.status(404).json({ error: "Site not found or not authorized" });
    }
  } catch (error) {
    console.error(`Error deleting site: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSite = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { siteName, riverName, city, climateId } = req.body;
    const userId = req.user.id;

    const resultMain = await knex("main_record")
      .where({ site_id: siteId, user_id: userId })
      .update({
        site_name: siteName,
        site_id: siteId,
        river: riverName,
        city_id: climateId,
      });
    const weatherId = climateId;
    const resultWeather = await knex("weather_main_record")
      .where({ weather_id: weatherId, user_id: userId })
      .update({
        weather_site: city,
        weather_id: climateId,
      });

    if (result) {
      res.status(200).json({ message: "Site updated successfully" });
    } else {
      res.status(404).json({ error: "Site not found or not authorized" });
    }
  } catch (error) {
    console.error(`Error updating site: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { allSites, deleteSite, getSiteDetails, updateSite };
