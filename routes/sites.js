import express from "express";
import * as sitesController from "../controllers/sites-controller.js";
const router = express.Router();

router.route("/").get(sitesController.sites);
router.route("/:siteId").get(sitesController.findOneSite);
router.route("/:siteId/flowRates").get(sitesController.findOneSiteDischarge);
router.route("/:siteId/allData").get(sitesController.findCombinedData);
router
  .route("/:siteId/allData/selectedDate")
  .post(sitesController.findCombinedDataInRange);

export default router;
