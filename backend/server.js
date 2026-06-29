require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// OTP Store
global.otps = new Map();

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

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Rewardify",
          email: process.env.EMAIL_FROM,
        },
        to: [
          {
            email: email,
          },
        ],
        subject: "Your Rewardify Login OTP",
        htmlContent: `
          <div style="font-family:Arial;padding:20px">
            <h2>🔐 Rewardify OTP</h2>
            <p>Your OTP is:</p>
            <h1 style="letter-spacing:8px;color:#2563eb">${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(`✅ OTP Sent : ${email} -> ${otp}`);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      sessionId,
      mobileNumber,
    });

  } catch (err) {
    console.error("BREVO ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err.response?.data || err.message,
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