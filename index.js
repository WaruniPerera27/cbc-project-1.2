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

const app = express(); // ✅ CREATE APP FIRST

// ✅ CORS (ONLY ONCE)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cbc-frontend-naturaglow.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// ✅ JWT middleware
app.use((req, res, next) => {
  const value = req.header("Authorization");
  if (value) {
    const token = value.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      req.user = decoded;
      next();
    });
  } else {
    next();
  }
});

// ✅ Database
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB connection failed", err));

// ✅ Routes
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/reviews", reviewRoutes);
app.use("/newsletter", newsletterRoutes);

// ✅ Root test
app.get("/", (req, res) => {
  res.send("API is running");
});

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
