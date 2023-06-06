const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// === GLOBAL MIDDLEWARE ===
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Middleware says hello. 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// === ROUTES ===
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// === START SERVER ===
module.exports = app;