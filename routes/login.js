import express, { json, Router } from "express";
import fs from "fs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY ?? "";

const readUser = () => {
  const data = fs.readFileSync("./data/user.json");
  const users = JSON.parse(data);
  return users;
};

router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  const users = readUser();
  const user = users[username];
  if (user && (await bcrypt.compare(password, user.hashedPassword))) {
    console.log("Authentication succeeded for user: ", username);
    let token = jwt.sign({ username }, SECRET_KEY);
    res.json({ token: token });
  } else {
    res.sendStatus(401);
  }
});
export default router;
