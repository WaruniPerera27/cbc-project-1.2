import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";

import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import reviewRoutes from "./routers/reviewRoutes.js";
import newsletterRoutes from "./routers/newsletter.js";

dotenv.config();

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cbc-frontend-naturaglow.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Body parser
app.use(express.json());

// ==============================
// ✅ PUBLIC ROUTES (NO JWT)
// ==============================
app.use("/user", userRouter);          // login, register, send-otp, reset-password
app.use("/products", productRouter);   // product listing
app.use("/reviews", reviewRoutes);     // reviews
app.use("/newsletter", newsletterRoutes); // newsletter subscribe

// ==============================
// 🔒 JWT MIDDLEWARE (PROTECTED)
// ==============================
app.use((req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
});

// ==============================
// 🔒 PROTECTED ROUTES
// ==============================
app.use("/orders", orderRouter); // requires login

// ✅ Root test
app.get("/", (req, res) => {
  res.send("API is running");
});

// ✅ Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection failed", err));

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
