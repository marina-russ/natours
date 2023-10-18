/* eslint-disable */
import axios from 'axios';
import { showAlert } from "./alert";

export const bookTour = async tourId => {
  // Stripe Public API Key
  const stripe = Stripe("pk_test_51NwoFXLMJZk69QfqT2J2JKmPdA0qnYQuuq1FHkFViUHFPqf2NZE3uiAGDZnJEwMGB5sBioAXskvlOMn9IG2h8u4700kM6SbvSZ");

  try {
    // 1 - Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2 - Create checkout form, charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

  } catch (err) {
    console.log("Stripe error");
    showAlert("error", err);
  }
};
