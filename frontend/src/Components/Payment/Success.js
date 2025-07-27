import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const navigate = useNavigate();

  const handleShippingRedirect = () => {
    navigate('/BidShipProfile');
  };

  return (
    <div className="PaySuccessSuccessContainer">
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Please provide your shipping details to complete the process.</p>
      <button className="PaySuccessBtnShipping" onClick={handleShippingRedirect}>
        Please Fill The Shipping Details
      </button>
    </div>
  );
};

export default Success;

