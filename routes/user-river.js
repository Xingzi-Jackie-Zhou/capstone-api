import express from "express";
import * as userRiversController from "../controllers/user-river-controller.js";
import authenticateToken from "./middleware/authenticateToken.js";
const router = express.Router();

router.route("/").get(authenticateToken, userRiversController.allRivers);
router
  .route("/:riverName")
  .get(authenticateToken, userRiversController.findOneRiver);

export default router;
