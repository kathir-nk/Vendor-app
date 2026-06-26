const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors({
  origin: '*', // Allow all (development only)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

global.otps = new Map();

// ✅ Direct hardcode (no .env)
const EMAIL_USER = 'jd8039596l@gmail.com';
const EMAIL_PASS = 'qkrc gwxl npuz chda';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
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
      from: `"REWARDIFY" <${EMAIL_USER}>`,
      to: email,
      subject: 'Your REWARDIFY Login OTP',
      html: `
        <div style="font-family: Arial; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00d4ff; text-align: center;">🔐 REWARDIFY OTP</h2>
          <p>Your OTP for login is:</p>
          <div style="background: #1a1a2e; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <h1 style="color: #00d4ff; letter-spacing: 10px; margin: 0; font-size: 36px;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 12px;">Valid for 5 minutes. Mobile: ${mobileNumber}</p>
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

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running: http://localhost:${PORT}`);
});