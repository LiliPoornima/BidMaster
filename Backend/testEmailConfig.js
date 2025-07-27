require('dotenv').config();
const { testEmailSetup } = require('./utils/bidSendEmail');

console.log('Starting email configuration test...');
console.log('Email configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

testEmailSetup()
  .then(() => {
    console.log('\nTest completed successfully!');
    console.log('If you received the test email, your configuration is working correctly.');
    console.log('If you did not receive the email, please check:');
    console.log('1. Your Gmail account has 2-factor authentication enabled');
    console.log('2. You are using an App Password (not your regular Gmail password)');
    console.log('3. The App Password is correctly set in your .env file');
  })
  .catch(error => {
    console.error('\nTest failed with error:', error.message);
    if (error.code === 'EAUTH') {
      console.log('\nAuthentication Error:');
      console.log('1. Make sure you have enabled 2-factor authentication in your Gmail account');
      console.log('2. Generate a new App Password from your Google Account settings');
      console.log('3. Update your .env file with the new App Password');
    }
  }); 