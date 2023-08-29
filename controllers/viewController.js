const Tour = require("../models/tourModel");
// const Review = require("../models/reviewModel");
// const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

// =======================
// === VIEW REQUESTS
// =======================

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "reviewText rating user",
  });

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});
