const { bidSendEmail } = require('./bidSendEmail');

// Email notification when someone outbids you
const sendOutbidNotification = async (outbidUser, itemName, currentBid) => {
  try {
    if (!outbidUser || !outbidUser.email) {
      throw new Error('Invalid user or missing email');
    }

    const subject = `You've been outbid on ${itemName}`;
    const text = `Someone has placed a higher bid of $${currentBid} on ${itemName}. Don't miss out!`;
    const html = `
      <h2>You've been outbid!</h2>
      <p>Someone has placed a higher bid of $${currentBid} on ${itemName}.</p>
      <p>Don't miss out on this item - place a higher bid now!</p>
    `;

    console.log(`Sending outbid notification to: ${outbidUser.email}`);
    await bidSendEmail(outbidUser.email, subject, text, html);
    console.log(`Outbid notification sent to ${outbidUser.email}`);
  } catch (error) {
    console.error(`Failed to send outbid notification: ${error.message}`, error);
    throw error;
  }
};

// Email notification when you win an auction
const sendAuctionWinNotification = async (winner, itemName, winningBid) => {
  try {
    if (!winner || !winner.email) {
      throw new Error('Invalid winner or missing email');
    }

    const subject = `Congratulations! You won the auction for ${itemName}`;
    const text = `You've won the auction for ${itemName} with a bid of $${winningBid}. Please proceed to payment.`;
    const html = `
      <h2>Congratulations! You won!</h2>
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px;">
        <p>You've won the auction for <strong>${itemName}</strong> with a bid of <strong>$${winningBid}</strong>.</p>
        <p>Please proceed to payment to secure your item.</p>
        <hr>
        <small>Auction Platform Team</small>
      </div>
    `;

    console.log(`Sending auction win notification to: ${winner.email}`);
    await bidSendEmail(winner.email, subject, text, html);
    console.log(`Auction win notification sent to ${winner.email}`);
  } catch (error) {
    console.error(`Failed to send auction win notification: ${error.message}`, error);
    throw error;
  }
};

// Email notification after successful payment
const sendPaymentConfirmation = async (user, itemName, amount) => {
  try {
    if (!user || !user.email) {
      throw new Error('Invalid user or missing email');
    }

    const subject = `Payment Confirmation for ${itemName}`;
    const text = `Thank you for your payment of $${amount} for ${itemName}. Your item will be shipped soon.`;
    const html = `
      <h2>Payment Confirmation</h2>
      <div style="background-color: #e6f3e6; padding: 20px; border-radius: 10px;">
        <p>Thank you for your payment of <strong>$${amount}</strong> for <strong>${itemName}</strong>.</p>
        <p>Your item will be shipped soon. We'll notify you when it's on its way.</p>
        <hr>
        <small>Auction Platform Team</small>
      </div>
    `;

    console.log(`Sending payment confirmation to: ${user.email}`);
    await bidSendEmail(user.email, subject, text, html);
    console.log(`Payment confirmation sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send payment confirmation: ${error.message}`, error);
    throw error;
  }
};

module.exports = {
  sendOutbidNotification,
  sendAuctionWinNotification,
  sendPaymentConfirmation
};