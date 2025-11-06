const Otp = require('../models/Otp');
const crypto = require('crypto');

// For sending email, you can use nodemailer or a mock for now
// Here we just log OTP to console for demo

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save or update OTP in DB for this email
  await Otp.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );

  // TODO: Send OTP via email here (or SMS)
  console.log(`OTP for ${email} is ${otp}`);

  res.json({ message: 'OTP sent successfully' });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid OTP' });

  // OTP verified, delete it from DB
  await Otp.deleteOne({ _id: record._id });

  res.json({ message: 'OTP verified' });
};
