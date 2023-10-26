import express from "express";

import * as reviewController from "../controllers/reviewController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

// =======================
// REVIEW ROUTES
// =======================

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserId,
    reviewController.createReview
  );

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
