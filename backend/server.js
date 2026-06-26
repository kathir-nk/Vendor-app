require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

global.otps = new Map();

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test transporter
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Transporter error:', error);
  } else {
    console.log('✅ Email transporter ready');
  }
});

// Generate OTP → Send Email
app.post('/v1/store-user/auth/generate-otp', async (req, res) => {
  const { mobileNumber, email } = req.body;
  
  if (!mobileNumber || !email) {
    return res.status(400).json({
      message: 'Mobile number and email required',
      error: 'Bad Request'
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const sessionId = Date.now().toString();

  global.otps.set(sessionId, { otp, mobileNumber, email });

  try {
    await transporter.sendMail({
      from: `"REWARDIFY" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your REWARDIFY Login OTP',
      html: `
        <div style="font-family: Arial; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00d4ff; text-align: center;">🔐 REWARDIFY OTP</h2>
          <p>Hello,</p>
          <p>Your OTP for login is:</p>
          <div style="background: #1a1a2e; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <h1 style="color: #00d4ff; letter-spacing: 10px; margin: 0; font-size: 36px;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 12px;">Valid for 5 minutes. Do not share this code.</p>
          <p style="color: #666; font-size: 12px;">Mobile: ${mobileNumber}</p>
        </div>
      `
    });

    console.log(`✅ Email OTP sent to ${email}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent to your email',
      sessionId,
      mobileNumber
    });

  } catch (error) {
    console.error('❌ Email failed:', error.message);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// Verify OTP
app.post('/v1/store-user/auth/login', (req, res) => {
  const { mobileNumber, otp, sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID required' });
  }
  
  const session = global.otps.get(sessionId);
  
  if (!session) {
    return res.status(400).json({ message: 'Session expired or invalid' });
  }

  if (session.mobileNumber !== mobileNumber) {
    return res.status(400).json({ message: 'Mobile number mismatch' });
  }

  if (session.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  global.otps.delete(sessionId);

  res.json({
    success: true,
    token: 'fake-jwt-token-' + Date.now(),
    refreshToken: 'fake-refresh-token-' + Date.now(),
    user: { 
      id: 'user-' + Date.now(),
      mobileNumber, 
      name: 'User ' + mobileNumber,
      email: session.email
    }
  });
});

// Get Profile
app.get('/v1/store-user/store/user/', (req, res) => {
  res.json({ 
    data: { 
      name: 'Kathirvel', 
      mobileNumber: '9360724040',
      email: 'user@example.com'
    } 
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running: http://localhost:${PORT}`);
});