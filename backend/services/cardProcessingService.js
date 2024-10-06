const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const processPayment = async (amount, paymentMethodId, customerEmail) => {
  try {
    // Create or retrieve the Customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
      });
    }

    // Attach the PaymentMethod to the Customer if not already attached
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Create a PaymentIntent with the Customer and PaymentMethod
    const amountInCents = Math.round(amount * 100); // Convert amount to cents and round to the nearest integer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      customer: customer.id,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });

    return { status: "success", paymentIntent, customerId: customer.id };
  } catch (error) {
    console.error("Error processing payment:", error);
    return { status: "failure", error: error.message };
  }
};

module.exports = { processPayment };
