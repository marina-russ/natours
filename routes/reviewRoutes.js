import express from "express";

import * as reviewController from "../controllers/reviewController.js";
import * as authController from "../controllers/authController.js";

// Allows for nested route in tourRoutes.js
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

// =======================
// REVIEW ROUTES
// =======================

//export const nestedRoute = router
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserId,
    reviewController.createReview
  );

//export const reviewRoutes = router
router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.checkUserId,
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

// =======================
// EXPORTS

export default router;
