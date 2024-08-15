import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
const app = express();

const PORT = process.env.PORT || 8080;

import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";
import profileRoute from "./routes/profile.js";

import sitesRoute from "./routes/sites.js";
import riversRoute from "./routes/rivers.js";

app.use(express.json());
app.use(cors());

// basic home route
app.get("/", (_req, res) => {
  res.send("Welcome to the Blazing Tigers Instock API");
});
app.use("/users", signupRoute);
app.use("/users", loginRoute);
app.use("/users", profileRoute);

app.use("/sites", sitesRoute);
app.use("/rivers", riversRoute);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
