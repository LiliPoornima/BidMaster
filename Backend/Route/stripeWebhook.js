const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../Model/UserModel');
const { sendPaymentConfirmation } = require('../utils/emailNotifications');

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.log('Webhook signature error:', err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log('Stripe webhook received:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        // Get user from metadata (you need to add this when creating the checkout session)
        const user = await User.findById(session.metadata.userId);
        console.log('User found for payment confirmation:', user);
        if (!user) {
          throw new Error('User not found');
        }
        console.log('Attempting to send payment confirmation email to:', user.email);
        // Send payment confirmation email
        await sendPaymentConfirmation(
          user,
          session.metadata.itemName,
          session.amount_total / 100 // Convert from cents to dollars
        );
        console.log('Payment confirmation email sent!');

        // Update your database to mark the item as paid
        // Add your database update logic here

      } catch (error) {
        console.error('Error processing payment confirmation:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({received: true});
});

module.exports = router; 