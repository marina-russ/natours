import express from "express";

import * as tourController from "../controllers/tourController.js";
import * as authController from "../controllers/authController.js";
import reviewRoutes from "./reviewRoutes.js";

const router = express.Router();

// =======================
// TOUR ROUTES
// =======================

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead guide"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

// =======================
// OTHER ROUTES
// =======================

// Nested Routes
// TODO lacks a middleware?
// mergeParam
router.use("/:tourId/reviews", reviewRoutes);

// Geospatial Routes
router
  .route("/tours-within/:distance/center/:latlong/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlong/unit/:unit").get(tourController.getDistances);

// Alias Routes
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead guide", "guide"),
    tourController.getMonthlyPlan
  );

// =======================
// EXPORTS

export default router;
