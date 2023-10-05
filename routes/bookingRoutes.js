const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

// =======================
// BOOKING ROUTES
// =======================

router.get(
  "/checkout-session/:tourId",
  authController.protect,
  bookingController.getCheckoutSession
);

// =======================
// EXPORTS

module.exports = router;
