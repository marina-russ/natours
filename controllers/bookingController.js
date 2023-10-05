const Stripe = require("stripe");

const Tour = require("../models/tourModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
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
          //images: [`https://${DEPLOYED_WEBSITE_URL}/img/tours${tour.imageCover}`],
        },
      },
    },
  ];

  // 2 - Create checkout session
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
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
