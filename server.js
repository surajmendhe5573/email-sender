const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/simpleappp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact Form Submission
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Send email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Contact Form Submission',
      text: `Hello ${name},\n\nWe received your message: ${message}\n\nThank you for reaching out!`
    });

    // Send email to company
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'surajmendhe32@gmail.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting contact form', error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
