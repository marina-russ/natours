import Review from "../models/reviewModel.js";
import * as factory from "./handlerFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// =======================
// MIDDLEWARE
// =======================

export const setTourUserId = (req, res, next) => {
  // Allow for nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;
  next();
};

export const checkUserId = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (req.user.id !== review.user.id)
    return next(new AppError("You are not allowed to do that", 401));
  next();
});

// =======================
// CRUD REQUESTS
// =======================

export const createReview = factory.createOne(Review);
export const getReview = factory.getOne(Review);
export const getAllReviews = factory.getAll(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
