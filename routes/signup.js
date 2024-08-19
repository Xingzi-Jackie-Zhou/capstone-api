import express, { json, Router } from "express";
import fs from "fs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
//import cors from "cors";

const saltRounds = 10;
config();
const router = express.Router();

import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

router.post("/signup", async (req, res) => {
  const { username, name, email, password } = req.body;

  if (!email.includes("@"))
    return res.status(400).json({ error: "Invalid email" });

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [userId] = await knex("users").insert({
      username,
      name,
      email,
      password: hashedPassword,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
