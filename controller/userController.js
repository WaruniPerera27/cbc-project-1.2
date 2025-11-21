import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

dotenv.config();

// Nodemailer transporter (using Gmail with TLS fix)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 👈 accept self-signed / untrusted certs
  },
});



export async function createUser(req, res) {
  try {
    const { firstName, lastName, email, password, phone, image } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    // Check for existing user
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Build user data aligned with your schema
    const userData = {
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      password: passwordHash,
      // optional fields
      ...(phone ? { phone: String(phone).trim() } : {}),
      ...(image ? { image } : {}),
      // role, isBlocked, isEmailVerified have schema defaults
    };

    const user = new User(userData);
    await user.save();

    return res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Create user error:", error);
    // Handle duplicate key error from unique index as a fallback
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Failed to create user" });
  }
}




export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (user == null) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isBlocked: user.isBlocked,
            isEmailVerified: user.isEmailVerified,
            image: user.image,
          },
          process.env.JWT_SECRET
        );

        res.json({
          token: token,
          message: "Login successful",
          role: user.role,
        });
      } else {
        res.status(403).json({
          message: "Incorrect password",
        });
      }
    }
  });
}

export function getUser(req, res) {
  if (req.user == null) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    console.log(req.user);
    res.json(req.user);
  }
}

export function isAdmin(req) {
  if (req.user == null) {
    return false;
  }
  return req.user.role === "admin";
}

export async function googleLogin(req, res) {
  const googleToken = req.body.token;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      }
    );

    const user = await User.findOne({
      email: response.data.email,
    });

    if (user != null) {
      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isBlocked: user.isBlocked,
          isEmailVerified: user.isEmailVerified,
          image: user.image,
        },
        process.env.JWT_SECRET
      );

      res.json({
        token: token,
        message: "Login successful",
        role: user.role,
      });
    } else {
      const newUser = new User({
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        image: response.data.picture,
        role: "user",
        isBlocked: false,
        isEmailVerified: true,
        password: bcrypt.hashSync("123", 10),
      });

      await newUser.save();

      const token = jwt.sign(
        {
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          isBlocked: newUser.isBlocked,
          isEmailVerified: newUser.isEmailVerified,
          image: newUser.image,
        },
        process.env.JWT_SECRET
      );

      res.json({
        token: token,
        message: "User created successfully",
        role: newUser.role,
      });
    }
  } catch (error) {
    console.error("Error fetching Google user info:", error);
    res.status(500).json({
      message: "Failed to authenticate with Google",
    });
  }
}

//  Send OTP with Gmail
export async function sendOTP(req, res) {
  const email = req.body.email;
  const otpCode = Math.floor(100000 + Math.random() * 900000);

  try {
    await OTP.deleteMany({ email: email });

    const newOTP = new OTP({ email: email, otp: otpCode });
    await newOTP.save();

    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}`,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send OTP" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({ message: "Failed to process OTP" });
  }
}

export async function resetPassword(req,res){
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const otp = req.body.otp;

    try{
        const otpRecord = await OTP.findOne({ email: email, otp: otp });
        if(!otpRecord){
            return res.status(404).json({ message: "Invalid OTP" });
        }

        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await User.updateOne({ email: email }, { password: hashedPassword });
        await OTP.deleteMany({ email: email });

        res.json({ message: "Password reset successfully" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Failed to reset password" });
    }
}

// Get all users (Admin)
export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

// Delete user by ID (Admin)
export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
}

// Update user (Admin)
export async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const updates = { ...req.body };

    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
}





export async function getUserGrowth(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const growth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(growth);
  } catch (error) {
    console.error("Get user growth error:", error);
    res.status(500).json({ message: "Failed to fetch user growth" });
  }
}

