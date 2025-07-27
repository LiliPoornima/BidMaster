import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './Checkout.css';

const stripePromise = loadStripe('pk_test_51R6sI701w6vsd6l6490eVrZnYD9IWUkSebeCMsEWiY3QEGxuK2eXv4h6OFj0mXOEVS1T3J6yco4g806W03gG9o4z001HlK8fGs');

function Checkout() {
  const { id: itemId } = useParams();
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    async function fetchHighestBid() {
      try {
        const response = await fetch(`http://localhost:5000/api/bid-now/highest/${itemId}`);
        const data = await response.json();
        if (data && data.bidAmount) {
          setAmount(data.bidAmount);
        } else {
          setAmount(0); // fallback if no bid
        }
      } catch (error) {
        setAmount(0);
      }
    }
    fetchHighestBid();
  }, [itemId]);

  const handleCheckout = async () => {
    try {
      // Robust port detection
      const port = window.location.port || (window.location.hostname === 'localhost' ? '5005' : '3000');
      console.log('Frontend port being sent:', port);
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frontendPort: port,
          items: [{ 
            name: 'Auction Item', 
            price: Math.round(amount * 100), 
            quantity: 1 
          }],
          metadata: {
            userId: localStorage.getItem('userId'),
            itemId: itemId,
            itemName: 'Auction Item'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detailed error:', errorData);
        throw new Error(errorData.details || 'Checkout failed');
      }

      const session = await response.json();
      console.log('Checkout session:', session);
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('FULL Checkout error:', error);
      alert(`Checkout Error: ${error.message}`);
    }
  };

  return (
    <div className="PayCheckoutWrapper">
      <div className="PayCheckoutCheckoutContainer">
        <h1>Make Your Auction Payment</h1>
        <p>Please review your order before proceeding to checkout.</p>
        <div className="PayCheckoutOrderSummary">
          <h2>Order Summary</h2>
          <div className="PayCheckoutOrderItem">
            <span>Auction Item</span>
            <span>${amount !== null ? amount.toFixed(2) : 'Loading...'}</span>
          </div>
          <div className="PayCheckoutOrderTotal">
            <span>Total</span>
            <span>${amount !== null ? amount.toFixed(2) : 'Loading...'}</span>
          </div>
        </div>
        <button className="PayCheckoutCheckoutButton" onClick={handleCheckout} disabled={amount === null}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Checkout;