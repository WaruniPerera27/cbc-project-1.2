import express from "express";
import Newsletter from "../models/newsletter.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

const router = express.Router();

// Subscribe route
router.post("/subscribe", async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    // ✅ Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ Check existing (normalized)
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    // ✅ Save first
    await Newsletter.create({ email });

    // ✅ Send email WITHOUT breaking subscription
    try {
      await sendWelcomeEmail(email);
    } catch (mailErr) {
      console.error("Email send failed:", mailErr.message);
      // DO NOT fail subscription
    }

    return res.status(201).json({
      message: "Subscribed successfully ✅"
    });

  } catch (err) {
    console.error("Newsletter error:", err);

    // ✅ Handle Mongo duplicate index error safely
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
