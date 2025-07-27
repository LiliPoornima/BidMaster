import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

// load environment variables from .env file
dotenv.config();

const app = express();

// allow cross-origin requests
app.use(cors());

// parse json bodies
app.use(express.json());

// initialize stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// simple get route to check if server is running
app.get('/', (req, res) => {
    res.send('payment system is running!');
});

// route to create stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        console.log('received request body:', req.body); // log incoming data

        // create a stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // allow card payments
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'auction item', // name of the item
                        },
                        unit_amount: 1000, // $10.00 in cents
                    },
                    quantity: 1, // quantity of item
                }
            ],
            mode: 'payment', // one-time payment
            success_url: 'http://localhost:5000/success', // redirect after payment success
            cancel_url: 'http://localhost:5000/cancel',   // redirect if payment cancelled
        });

        // send session id to frontend
        res.json({ id: session.id });
    } catch (error) {
        // log and return error details
        console.error('full checkout session error:', error);
        res.status(500).json({ 
            error: 'failed to create checkout session',
            details: error.message,
            stack: error.stack 
        });
    }
});

// start server on given port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
