import express from "express";
import * as profileSiteController from "../controllers/profile-site-controller.js";
import authenticateToken from "./middleware/authenticateToken.js";
const router = express.Router();

router.route("/sites").get(authenticateToken, profileSiteController.allSites);

// router
//   .route("/sites/:siteId")
//   .delete(authenticateToken, profileSiteController.deleteSite)
//   .put(authenticateToken, profileSiteController.updateSite);

export default router;
