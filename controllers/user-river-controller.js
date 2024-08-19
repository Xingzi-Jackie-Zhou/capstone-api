import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get rivers list
const allRivers = async (req, res) => {
  try {
    const userNameId = req.user?.username;

    // Fetch records where user_id is null
    const defaultData = await knex("main_record").whereNull("user_id");
    console.log("default data", defaultData);

    let combinedData = defaultData;

    if (userNameId) {
      // Fetch user-specific records
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;
      console.log(userId);

      if (userId) {
        const userData = await knex("main_record").where("user_id", userId);
        console.log(userData);
        combinedData = [...defaultData, ...userData];
      }
    }

    // Send the combined data as the response
    res.status(200).json(combinedData);
    console.log("combined data", combinedData);
  } catch (error) {
    console.error("Error retrieving rivers:", error);
    res.status(500).json({ message: "Error retrieving rivers" });
  }
};

const findOneRiver = async (req, res) => {
  try {
    const userNameId = req.user?.username;

    // Fetch default river data where user_id is null
    const defaultRiverFound = await knex("main_record")
      .where({ river: req.params.riverName })
      .whereNull("user_id");
    console.log("default river found", defaultRiverFound);

    let combinedSearch = defaultRiverFound; // Start with default data

    if (userNameId) {
      const user = await knex("users").where({ username: userNameId }).first();
      const userId = user?.id;
      console.log("userId for find one river", userId);

      if (userId) {
        const userRiverFound = await knex("main_record")
          .where({ river: req.params.riverName })
          .where("user_id", userId);

        console.log("user river found data", userRiverFound);

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
