import Stripe from "stripe";

import Booking from "../models/bookingModel.js";
import Tour from "../models/tourModel.js";
import * as factory from "./handlerFactory.js";
import catchAsync from "../utils/catchAsync.js";

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1 - Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  const tourData = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: tour.price * 100,
        product_data: {
          name: `${tour.name} Tour`,
          description: tour.summary,
          // TODO - add deployed website URL
          //images: [`https://${DEPLOYED_WEBSITE_URL}/img/tours${tour.imageCover}`],
        },
      },
    },
  ];

  // 2 - Create checkout session
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // TODO - change from URL query to Stripe Webhooks once website is deployed!!
    // TODO - cont, success_url is not currently secure!!
    // eslint-disable-next-line prettier/prettier
    success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: tourData,
    mode: "payment",
  });

  // 3 - Send session response
  res.status(200).json({
    status: "success",
    session,
  });
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
  // TODO - Temporary code since this is unsecure! Only until app is deployed!
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

// =======================
// CRUD REQUESTS
// =======================

export const createBooking = factory.createOne(Booking);
export const getBooking = factory.getOne(Booking);
export const getAllBookings = factory.getAll(Booking);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);

//export default bookingController;
