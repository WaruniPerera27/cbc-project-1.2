import express from "express";
import {createOrder,getOrders,updateOrder,getOrderGrowth,cancelOrder} from "../controller/orderController.js";
import Order from "../models/order.js"; 

const orderRouter = express.Router();


orderRouter.post("/", createOrder);


orderRouter.get("/all", async (req, res) => {
  try {
    const orders = await Order.find(); 
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

orderRouter.get("/:page/:limit", getOrders);
orderRouter.put("/:orderId", updateOrder);
orderRouter.get("/growth/monthly", getOrderGrowth);
orderRouter.put("/:orderId/cancel", cancelOrder);

export default orderRouter;
