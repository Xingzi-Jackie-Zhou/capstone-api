import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get rivers list
const allRivers = async (req, res) => {
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
    console.error("Error retrieving rivers:", error);
    res.status(500).json({ message: "Error retrieving rivers" });
  }
};

const findOneRiver = async (req, res) => {
  try {
    const userNameId = req.user?.username;
    const defaultRiverFound = await knex("main_record")
      .where({ river: req.params.riverName })
      .whereNull("user_id");

    let combinedSearch = defaultRiverFound;

    if (userNameId) {
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;

      if (userId) {
        const userRiverFound = await knex("main_record")
          .where({ river: req.params.riverName })
          .where("user_id", userId);

        if (userRiverFound.length > 0) {
          combinedSearch = userRiverFound;
        } else if (defaultRiverFound.length === 0) {
          return res.status(404).json({
            message: `River with name ${req.params.riverName} not found`,
          });
        }
      }
    } else if (defaultRiverFound.length === 0) {
      return res.status(404).json({
        message: `River with name ${req.params.riverName} not found`,
      });
    }

    res.status(200).json(combinedSearch);
  } catch (error) {
    console.error("Error retrieving river:", error);
    res.status(500).json({
      message: `Unable to retrieve river with name ${req.params.riverName}`,
    });
  }
};

export { allRivers, findOneRiver };
