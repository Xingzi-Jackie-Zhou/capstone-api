import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

//get sites list
const allRivers = async (_req, res) => {
  try {
    const data = await knex("main_record");
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    `Error retrieving sites: ${error}`;
  }
};

const findOneRiver = async (req, res) => {
  try {
    const riverFound = await knex("main_record").where({
      river: req.params.riverName,
    });

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
