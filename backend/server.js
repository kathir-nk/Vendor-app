require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// OTP Store
global.otps = new Map();

// SMTP Transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate OTP
app.post("/v1/store-user/auth/generate-otp", async (req, res) => {
  try {
    const { mobileNumber, email } = req.body;

    if (!mobileNumber || !email) {
      return res.status(400).json({
        message: "Mobile number and email required",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const sessionId = Date.now().toString();

    global.otps.set(sessionId, {
      otp,
      mobileNumber,
      email,
    });

    await transporter.sendMail({
      from: `"Rewardify" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your Rewardify Login OTP",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>🔐 Rewardify OTP</h2>
          <p>Your OTP is:</p>

          <h1 style="letter-spacing:8px;color:#2563eb">
            ${otp}
          </h1>

          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log(`✅ OTP Sent : ${email} -> ${otp}`);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      sessionId,
      mobileNumber,
    });
  } catch (err) {
    console.error("SMTP ERROR :", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err.message,
    });
  }
});

// Verify OTP
app.post("/v1/store-user/auth/login", (req, res) => {
  const { mobileNumber, otp, sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({
      message: "Session ID required",
    });
  }

  const session = global.otps.get(sessionId);

  if (!session) {
    return res.status(400).json({
      message: "Session expired",
    });
  }

  if (session.mobileNumber !== mobileNumber) {
    return res.status(400).json({
      message: "Mobile number mismatch",
    });
  }

  if (session.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  global.otps.delete(sessionId);

  return res.json({
    success: true,
    token: "fake-token-" + Date.now(),
    refreshToken: "refresh-token-" + Date.now(),
    user: {
      id: Date.now(),
      mobileNumber,
      email: session.email,
    },
  });
});

// Profile
app.get("/v1/store-user/store/user/", (req, res) => {
  res.json({
    data: {
      name: "Kathirvel",
      mobileNumber: "9360724040",
      email: "user@example.com",
    },
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server Running : http://localhost:${PORT}`);
});