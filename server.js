const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/pledge', async (req, res) => {
  const { name, email, reason, visibility, pledgeOptions } = req.body;

  if (!name || !email || !reason || !pledgeOptions || pledgeOptions.length === 0) {
    return res.status(400).send('Missing required fields');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const userMailOptions = {
    from: `"Uganda No Drug Campaign" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank You for Taking a Stand Against Drugs 💪',
    text: `Dear Community Member,

Thank you for making a powerful pledge to say NO to drugs and stand up for a safer, healthier community.

Your commitment is more than just words — it’s a step toward real change. By pledging to live drug-free and encourage others to do the same, you are helping to build a stronger, more supportive environment for everyone around you.

Together, we are sending a clear message: Our community chooses health, safety, and a brighter future.

Stay strong, stay committed — and know that you are not alone in this mission.

If you’d like to get more involved or share your story, we’d love to hear from you. Let’s continue spreading the message and making an impact — one pledge at a time.

With gratitude,
The Uganda no drug campaign
https://your-campaign-site.com`
  };

  const adminMailOptions = {
    from: `"Uganda No Drug Campaign" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'New Pledge Received',
    text: `New pledge received:
Name: ${name}
Email: ${email}
Reason: ${reason}
Visibility: ${visibility}
Options: ${pledgeOptions.join(', ')}`
  };

  try {
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);
    res.status(200).send('Pledge submitted successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send('Error submitting pledge');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});