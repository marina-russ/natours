import express from "express";

import * as viewController from "../controllers/viewController.js";
import * as authController from "../controllers/authController.js";
import * as bookingController from "../controllers/bookingController.js";

const router = express.Router();

// =======================
// VIEW ROUTES
// =======================

router.get(
  "/",
  authController.isLoggedIn,
  bookingController.createBookingCheckout,
  viewController.getOverview
);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);

router.get("/signup", authController.isLoggedIn, viewController.getSignupForm);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get("/me", authController.protect, viewController.getMyAccount);
router.get("/my-tours", authController.protect, viewController.getMyTours);

// =======================
// EXPORTS

export default router;
