import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
//get sites list
const allRivers = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(userId);

    // Fetch records where user_id is null
    let data = await knex("main_record").whereNull("user_id");

    // Initialize dataAll with the default data
    let dataAll = data;

    if (userId) {
      // Fetch records where user_id matches the provided userId
      const userData = await knex("main_record").where("user_id", userId);

      // Combine both arrays
      dataAll = [...data, ...userData];
    }

    // Send combined data as response
    res.status(200).json(dataAll);

    console.log(dataAll);
  } catch (error) {
    console.error("Error retrieving sites:", error); // Proper error logging
    res.status(500).json({ message: "Error retrieving sites" }); // Send appropriate error response
  }
};

const findOneRiver = async (req, res) => {
  try {
    const userId = req.user?.id;
    let riverFound = await knex("main_record")
      .where({
        river: req.params.riverName,
      })
      .whereNull("user_id");
    if (userId) {
      riverFound = await knex("main_record")
        .where({
          river: req.params.riverName,
        })
        .where("user_id", userId)
        .whereNull("user_id");
    }

    if (riverFound.length === 0) {
      return res.status(404).json({
        message: `river with name ${req.params.riverName} not found`,
      });
    }

    const riverData = riverFound;
    res.status(200).json(riverData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve river with name ${req.params.riverName}`,
    });
  }
};

export { allRivers, findOneRiver };
