import express, { json, Router } from "express";
import fs from "fs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY ?? "";

import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
router.get("/profile", authorize, async (req, res) => {
  try {
    const userNameId = req.decoded.username;
    const user = await knex("users").where({ username: userNameId }).first();
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function authorize(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.slice("Bearer ".length);

  if (token == null) return res.sendStatus(401);
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.decoded = payload;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
}

export default router;
