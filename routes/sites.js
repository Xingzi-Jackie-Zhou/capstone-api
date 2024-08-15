import express from "express";
import * as sitesController from "../controllers/sites-controller.js";
const router = express.Router();

router.route("/").get(sitesController.sites);
router.route("/:siteId").get(sitesController.findOneSite);
router
  .route("/:siteId/flowRates")
  .get(sitesController.findOneSiteDischarge)
  .post(sitesController.findDischargeInRange);
router
  .route("/:siteId/flowRates/selectedDate")
  .get(sitesController.findDischargeInRange);

router
  .route("/:siteId/allData")
  .get(sitesController.findCombinedData)
  .post(sitesController.findCombinedDataInRange);
router
  .route("/:siteId/allData/selectedDate")
  .get(sitesController.findCombinedDataInRange);

export default router;
