import express from "express";
import * as userSitesController from "../controllers/user-site-controller.js";
import authenticateToken from "./middleware/authenticateToken.js";
const router = express.Router();

router.route("/").get(authenticateToken, userSitesController.sites);
router
  .route("/:siteId")
  .get(authenticateToken, userSitesController.findOneSite);
router
  .route("/:siteId/flowRates")
  .get(authenticateToken, userSitesController.findOneSiteDischarge)
  .post(authenticateToken, userSitesController.findDischargeInRange);
router
  .route("/:siteId/flowRates/selectedDate")
  .get(authenticateToken, userSitesController.findOneSiteDischarge);
router
  .route("/:siteId/allData")
  .get(authenticateToken, userSitesController.findCombinedData)
  .post(authenticateToken, userSitesController.findCombinedDataInRange);
router
  .route("/:siteId/allData/selectedDate")
  .get(authenticateToken, userSitesController.findCombinedData);

export default router;
