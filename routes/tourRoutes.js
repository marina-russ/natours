const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

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

// Geospatial Routes
router
  .route("/tours-within/:distance/center/:latlong/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlong/unit/:unit").get(tourController.getDistances);

// Nested Routes
router.use("/:tourId/reviews", reviewRouter);

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

module.exports = router;
