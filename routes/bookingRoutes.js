const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

// =======================
// BOOKING ROUTES
// =======================

// Only logged in users can access below routes
router.use(authController.protect);

router.get(
  "/checkout-session/:tourId",
  authController.protect,
  bookingController.getCheckoutSession
);

// Protects all below routes to just Admin and Lead Guides
router.use(authController.restrictTo("admin", "lead-guide"));

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

// =======================
// EXPORTS

module.exports = router;
