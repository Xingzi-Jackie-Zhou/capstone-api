import express, { json, Router } from "express";
import fs from "fs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
//import cors from "cors";

const saltRounds = 10;
config();
const port = process.env.PORT || 8080;
const SECRET_KEY = process.env.SECRET_KEY ?? "";
const router = express.Router();

const readUser = () => {
  const data = fs.readFileSync("./data/user.json");
  const users = JSON.parse(data);
  return users;
};
const writeUser = (users) => {
  const data = JSON.stringify(users);
  fs.writeFileSync("./data/user.json", data);
  return users;
};

const hash = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    // console.log("Hashed password:", hash);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

router.post("/signup", async (req, res) => {
  const { username, name, password } = req.body;
  const hashedPassword = await hash(password);
  const users = readUser();
  // check unique username
  users[username] = {
    name,
    hashedPassword,
  };
  writeUser(users);
  res.json({ success: "true" });
  console.log(users);
});

export default router;
