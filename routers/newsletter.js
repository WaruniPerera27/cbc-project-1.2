import express from "express";
import Newsletter from "../models/newsletter.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

const router = express.Router();

// Subscribe route
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // check if already exists
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Already subscribed" });
    }

  
    const newSub = new Newsletter({ email });
    await newSub.save();

    // send welcome email
    await sendWelcomeEmail(email);

    res.status(201).json({ message: "Subscribed successfully ✅" });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
