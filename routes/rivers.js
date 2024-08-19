import express from "express";
import * as riversController from "../controllers/rivers-controller.js";
const router = express.Router();

router.route("/").get(riversController.allRivers);
router.route("/:riverName").get(riversController.findOneRiver);

export default router;
