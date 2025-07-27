require('dotenv').config();
const mongoose = require('mongoose');
const { bidSendEmail } = require('./utils/bidSendEmail');
const User = require('./Model/UserModel');

// Connect to your MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testEmailSetup() {
  try {
    console.log('Starting comprehensive email configuration test...');
    
    // First, try sending to a hardcoded email
    console.log('Test 1: Sending to hardcoded email');
    await bidSendEmail(
      process.env.EMAIL_USER, // Send to yourself
      'Auction Platform - Comprehensive Email Test',
      'This is a test email to verify your email configuration.',
      `
      <html>
        <body>
          <h1>Email Configuration Test</h1>
          <p>If you can read this, your email configuration is working correctly!</p>
          <p>Sent from: Auction Platform</p>
          <p>Test Timestamp: ${new Date().toISOString()}</p>
        </body>
      </html>
      `
    );
    console.log('Hardcoded email test successful');

    // Then, try sending to a user from the database
    console.log('Test 2: Sending to a user from database');
    const user = await User.findOne();
    
    if (user && user.email) {
      console.log(`Found user: ${user.email}`);
      await bidSendEmail(
        user.email,
        'Auction Platform - Database User Email Test',
        'This is a test email sent to a user from the database.',
        `
        <html>
          <body>
            <h1>Database User Email Test</h1>
            <p>Hello ${user.name || 'User'},</p>
            <p>This is a test email sent to verify email functionality using a database user.</p>
            <p>Test Timestamp: ${new Date().toISOString()}</p>
          </body>
        </html>
        `
      );
      console.log('Database user email test successful');
    } else {
      console.warn('No user with email found in the database. Skipping database user test.');
    }

    console.log('Comprehensive email configuration test completed successfully!');
  } catch (error) {
    console.error('Email configuration test failed:', error);
    throw error;
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
  }
}

// Run the test
testEmailSetup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));