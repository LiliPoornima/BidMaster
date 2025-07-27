const express = require('express');
const router = express.Router();
const bidSendEmail = require('../utils/bidSendEmail');

// route to send an email notification
router.post('/send-notification', async (req, res) => {
  const { to, subject, text, html } = req.body;

  // check if required fields are present
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'missing required fields: to, subject, text' });
  }

  try {
    // send email using utility function
    await bidSendEmail(to, subject, text, html);
    res.status(200).json({ message: 'email sent successfully' });
  } catch (error) {
    // handle sending error
    res.status(500).json({ error: 'failed to send email' });
  }
});

module.exports = router;
