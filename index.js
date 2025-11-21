import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import orderRouter from "./routers/orderRouter.js";
import reviewRoutes from "./routers/reviewRoutes.js";
import newsletterRoutes from "./routers/newsletter.js";

dotenv.config();

const app = express();

// Middleware 
app.use(bodyParser.json()); 
app.use(cors());
app.use(express.json());

app.use(
    (req, res, next) => {
        const value = req.header("Authorization");
        if (value != null) {
            const token = value.replace("Bearer ", "");
            jwt.verify(
                token,
                process.env.JWT_SECRET,
                (err, decoded) => {
                    if (decoded == null) {
                        res.status(403).json({
                            message: "Unauthorized"
                        });
                    } else {
                        req.user = decoded;
                        next();
                    }
                }
            );
        } else {
            next();
        }
    }
);

// Database connection
const connectionString = process.env.MONGO_URL;

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
app.use("/orders", orderRouter);
app.use("/reviews", reviewRoutes);
app.use("/newsletter", newsletterRoutes);

console.log("Data fetched successfully");

// Server start
app.listen(5000, () => {
    console.log("Server started on port 5000");
});