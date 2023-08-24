const mongoose = require("mongoose");
const Tour = require("./tourModel");

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

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const reviewStats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (reviewStats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: reviewStats[0].nRating,
      ratingsAverage: reviewStats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Statistics - Part 1/2 for factoring in updated or deleted reviews
// .constructor allows us to point to the current model
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

// Statistics - Part 2/2 for factoring in updated or deleted reviews
// docs.constructor allows us to directly call our static calcAverageRatings on the model
reviewSchema.post(/^findOneAnd/, async (docs) => {
  await docs.constructor.calcAverageRatings(docs.tour);
});

// =======================
// === EXPORTS

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
