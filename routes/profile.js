import express, { json, Router } from "express";
import fs from "fs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY ?? "";

router.get("/profile", authorize, (req, res) => {
  res.json(req.decoded);
  console.log(`${req.user.username} is logged in`);
});

function authorize(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.decoded = payload;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
}

export default router;
