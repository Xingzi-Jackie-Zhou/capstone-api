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

export { allSites };
