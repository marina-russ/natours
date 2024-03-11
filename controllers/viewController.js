import Tour from "../models/tourModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// =======================
// === VIEW REQUESTS
// =======================

export const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "reviewText rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

export const getSignupForm = (req, res) => {
  res.status(200).render("signup", {
    title: "Create an account",
  });
};

export const getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Login to your account",
  });
};

export const getMyAccount = (req, res) => {
  res.status(200).render("account", {
    title: "My Account",
  });
};

export const getMyTours = catchAsync(async (req, res, next) => {
  // 1 - Find all bookings made by user
  const bookings = await Booking.find({ user: req.user.id });

  // 2 - Find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  // 3 - Rendering My Bookings page
  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

export const updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("account", {
    title: "My Account",
    user: updatedUser,
  });
});
