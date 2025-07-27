require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a more robust transporter with additional configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add these additional options for better reliability
  debug: true,
  logger: true,
  secure: true, // Use TLS
});

const bidSendEmail = async (to, subject, text, html) => {
  // Validate email inputs
  if (!to || !subject) {
    throw new Error('Missing required email parameters');
  }

  const mailOptions = {
    from: {
      name: 'Auction Platform',
      address: process.env.EMAIL_USER
    },
    to,
    subject,
    text,
    html,
  };

  try {
    console.log('Attempting to send email to:', to);
    console.log('Email details:', { subject });

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Email Sending Error:', error);
    
    // Provide more detailed error logging
    if (error.code === 'EAUTH') {
      console.error('Authentication Error: Check your email credentials');
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection Refused: Check your internet connection');
    }

    throw error;
  }
};

// Test function to verify email configuration
const testEmailSetup = async () => {
  try {
    console.log('Starting email configuration test...');
    
    // Use your own email for testing
    const testResult = await bidSendEmail(
      process.env.EMAIL_USER, // Send to yourself
      'Auction Platform - Email Configuration Test',
      'This is a test email to verify your email configuration.',
      `
      <html>
        <body>
          <h1>Email Configuration Test</h1>
          <p>If you can read this, your email configuration is working correctly!</p>
          <p>Sent from: Auction Platform</p>
        </body>
      </html>
      `
    );

    console.log('Test email sent successfully!');
    return testResult;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    throw error;
  }
};

// Export both the email sending function and the test function
module.exports = {
  bidSendEmail,
  testEmailSetup
};