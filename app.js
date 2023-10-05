const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
//const helmet = require("helmet");
const contentSecurityPolicy = require("helmet-csp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// =======================
// === HTTP HEADERS
// =======================
const defaultSrcUrls = ["https://js.stripe.com"];
const scriptSrcUrls = [
  "https://unpkg.com",
  "https://tile.openstreetmap.org",
  "https://cdnjs.cloudflare.com",
  "https://js.stripe.com",
];
const styleSrcUrls = [
  "https://unpkg.com",
  "https://tile.openstreetmap.org",
  "fonts.googleapis.com",
];
const connectSrcUrls = [
  "https://*.stripe.com",
  "https://unpkg.com",
  "https://tile.openstreetmap.org",
  "https://*.cloudflare.com",
  "http://localhost:3000/api/v1/users/login",
  "http://localhost/api/v1/bookings/checkout-session/",
];
const fontSrcUrls = ["fonts.googleapis.com", "fonts.gstatic.com"];
const frameSrcUrls = ["https://js.stripe.com"];
const imgSrcUrls = [
  "https://*.tile.openstreetmap.org",
  "https://*.cloudflare.com/",
  "https://*.stripe.com",
];

app.use(
  contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'", "data:", "blob:", "ws:", ...defaultSrcUrls],
      "base-uri": ["'self'"],
      "script-src": [
        "'self'",
        "'unsafe-inline'",
        "data",
        "blob:",
        ...scriptSrcUrls,
      ],
      "style-src": ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      "connect-src": ["'self'", "blob:", "wss:", ...connectSrcUrls],
      "font-src": ["'self'", "data:", ...fontSrcUrls],
      "frame-src": ["'self'", ...frameSrcUrls],
      "img-src": ["'self'", "data:", "blob:", ...imgSrcUrls],
      "object-src": ["'none'"],
      "worker-src": ["'self'", "data:", "blob:"],
      "child-src": ["'self'", "blob:"],
    },
    reportOnly: false,
  })
);

// =======================
// === GLOBAL MIDDLEWARE
// =======================

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit API requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour.",
});
app.use("/api", limiter);

// Body & cookie parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS attacks
app.use(xss());

// Prevents parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "price",
      "maxGroupSize",
      "difficulty",
    ],
  })
);

// Development middleware to timestamp testing
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// =======================
// === ROUTES
// =======================

// === TEMPLATE ROUTES

app.use("/", viewRouter);

// === API ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// =======================
// === START SERVER

module.exports = app;
