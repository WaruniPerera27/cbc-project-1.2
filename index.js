import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

// Middleware
app.use(bodyParser.json());

// Authentication middleware - FIXED
app.use((req, res, next) => {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
        return next(); // No token, continue without authentication
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ message: "Invalid authorization format" });
    }

    const token = authHeader.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET=1234, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        req.user = decoded;
        next();
    });
});

// Database connection
const connectionString = process.env.MONGO_URL

mongoose.connect(connectionString)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Failed to connect database", err);
    });

// Routes
app.use("/user", userRouter);
app.use("/products", productRouter);

// Server start
app.listen(5000, () => {
    console.log("Server started on port 5000");
});