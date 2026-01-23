import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import reviewRoutes from "./routers/reviewRoutes.js";
import newsletterRoutes from "./routers/newsletter.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// CORS
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

// Body parser
app.use(express.json());

// Public routes
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/reviews", reviewRoutes);
app.use("/newsletter", newsletterRoutes);

// 🔐 Protected routes
app.use("/orders", authMiddleware, orderRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection failed", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
