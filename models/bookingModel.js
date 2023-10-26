import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a tour!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price!"],
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// =======================
// === MIDDLEWARE
// =======================

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
  next();
});

// =======================
// === EXPORTS

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
