const express = require("express");
const viewController = require("../controllers/viewController");

const router = express.Router();

// =======================
// VIEW ROUTES
// =======================

router.get("/", viewController.getOverview);
router.get("/tour/:slug", viewController.getTour);
router.get("/signup", viewController.getSignupForm);
router.get("/login", viewController.getLoginForm);

// =======================
// EXPORTS

module.exports = router;
