import express, { json, Router } from "express";
import fs from "fs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";
config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY ?? "";

// export default router;
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await knex("users").where({ username }).first();
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
