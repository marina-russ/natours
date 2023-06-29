const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour must have a name"],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, "Tour must have a duration"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tour must have a maximum group size"]
  },
  difficulty: {
    type: String,
    required: [true, "Tour must have a difficulty"]
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, "Tour must have a price"]
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "Tour must have a summary"]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, "Tour must have a cover image"]
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
}, {
  strictQuery: true
  // filter properties not in my schema (such as page, filter, sort) will not be searched
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;