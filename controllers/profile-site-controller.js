import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const allSites = async (req, res) => {
  try {
    const userNameId = req.user?.username;

    // Check if userNameId is available
    if (!userNameId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    // Fetch user based on username
    const user = await knex("users").where({ username: userNameId }).first();

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user.id;
    console.log(`User ID: ${userId}`);

    // Fetch user data from main_record table
    const userData = await knex("main_record").where("user_id", userId);
    console.log("User Data: ", userData);

    // Send the combined data as the response
    res.status(200).json(userData);
  } catch (error) {
    console.error(`Error retrieving sites: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { allSites };
