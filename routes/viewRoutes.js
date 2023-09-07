const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const router = express.Router();

// =======================
// VIEW ROUTES
// =======================

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);

router.get("/signup", authController.isLoggedIn, viewController.getSignupForm);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get("/me", authController.protect, viewController.getMyAccount);

// =======================
// EXPORTS

module.exports = router;
