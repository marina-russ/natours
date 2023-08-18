const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewText: {
      type: String,
      trim: true,
      required: [true, "Review cannot be empty"],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be 1.0 or higher"],
      max: [5, "Rating must be 5.0 or lower"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { objects: true },
    strictQuery: true,
    // filter properties not in my schema (such as page, filter, sort) will not be searched
  }
);

// =======================
// === MIDDLEWARE
// =======================

// Query Middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// =======================
// === EXPORTS

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
