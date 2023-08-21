const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// =======================
// "ANON" ROUTES
// =======================

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// =======================
// LOGGED IN ROUTES
// =======================

router.use(authController.protect);
// protects all routes below this middleware

router.patch("/updateMyPassword", authController.updatePassword);

// =======================
// "ME" ROUTES
// =======================

router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// =======================
// CRUD USER ROUTES
// =======================

router.use(authController.restrictTo("admin"));
// restricts all routes below this middleware

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// =======================
// EXPORTS

module.exports = router;
