import express from "express";
import Newsletter from "../models/newsletter.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ Check first
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(200).json({
        message: "You are already subscribed 👍",
      });
    }

    // ✅ Save
    await Newsletter.create({ email });

    // ✅ Try email (do not break flow)
    try {
      await sendWelcomeEmail(email);
    } catch (mailErr) {
      console.error("Email send failed:", mailErr.message);
    }

    return res.status(201).json({
      message: "Subscribed successfully ✅",
    });

  } catch (err) {
    console.error("Newsletter error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
