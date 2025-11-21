import Order from "../models/order.js";
import Product from "../models/products.js";
import { isAdmin } from "./userController.js";

// ==================== Create Order ====================
export async function createOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login to create an order" });
    }

    // Auto-generate OrderID
    const latestOrder = await Order.find().sort({ date: -1 }).limit(1);
    let orderId = "CBC00001";
    if (latestOrder.length > 0) {
      const lastOrderIdInString = latestOrder[0].orderID;
      const lastOrderIdWithoutPrefix = lastOrderIdInString.replace("CBC", "");
      const lastOrderIdInInteger = parseInt(lastOrderIdWithoutPrefix);
      const newOrderIdWithoutPrefix = (lastOrderIdInInteger + 1)
        .toString()
        .padStart(5, "0");
      orderId = "CBC" + newOrderIdWithoutPrefix;
    }

    const items = [];
    let total = 0;

    if (Array.isArray(req.body.items)) {
      for (let item of req.body.items) {
        const product = await Product.findOne({ productId: item.productId });
        if (!product) {
          return res
            .status(400)
            .json({ message: "Invalid product ID: " + item.productId });
        }

        if (product.stock < item.qty) {
          return res.status(400).json({
            message: `Not enough stock for product: ${product.name}`,
          });
        }

        // Push item into order
        items.push({
          productId: product.productId,
          name: product.name,
          image: product.image[0],
          price: product.price,
          qty: item.qty,
        });

        total += product.price * item.qty;

        // ✅ Update stock only (avoids validation issues with subPage)
        await Product.updateOne(
          { productId: product.productId },
          { $inc: { stock: -item.qty } }
        );
      }
    } else {
      return res.status(400).json({ message: "Invalid items format" });
    }

    const order = new Order({
      orderID: orderId,
      email: req.user.email,
      name: req.user.firstName + " " + req.user.lastName,
      address: req.body.address,
      phone: req.body.phone,
      items,
      total,
      status: "Pending", // ✅ Default status
      date: new Date(),  // ✅ Ensure order has date
    });

    const result = await order.save();

    res.json({
      message: "Order created successfully",
      order: result,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,   // ✅ shows actual error reason
      stack: error.stack      // ✅ helps debug
    });
  }
}

// ==================== Get Orders ====================
export async function getOrders(req, res) {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 10;

  if (!req.user) {
    return res.status(401).json({ message: "Please login to view orders" });
  }

  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter.email = req.user.email; // Show only logged-in user's orders
    }

    const orderCount = await Order.countDocuments(filter);
    const totalPages = Math.ceil(orderCount / limit);

    const orders = await Order.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });

    res.json({
      orders,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

// ==================== Update Order (Admin Only) ====================
export function updateOrder(req, res) {
  if (isAdmin(req)) {
    const orderId = req.params.orderId;
    const { status, notes } = req.body;

    Order.findOneAndUpdate(
      { orderID: orderId },
      { status, notes },
      { new: true }
    )
      .then((updatedOrder) => {
        if (updatedOrder) {
          res.json({
            message: "Order updated successfully",
            order: updatedOrder,
          });
        } else {
          res.status(404).json({ message: "Order not found" });
        }
      })
      .catch((error) => {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Failed to update order" });
      });
  } else {
    res.status(403).json({
      message: "You are not authorized to update orders",
    });
  }
}

// ==================== Get Monthly Order Growth ====================
export async function getOrderGrowth(req, res) {
  try {
    const growth = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const result = growth.map((item) => ({
      period: months[item._id - 1],
      orders: item.total,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching order growth:", err);
    res.status(500).json({ message: "Failed to fetch order growth" });
  }
}

// ==================== Cancel Order ====================
export async function cancelOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login to cancel an order" });
    }

    const orderId = req.params.orderId;
    const order = await Order.findOne({ orderID: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow user to cancel their own order (unless admin)
    if (req.user.role !== "admin" && order.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Check if within 24 hours
    const now = new Date();
    const orderDate = new Date(order.date);
    const diffHours = (now - orderDate) / (1000 * 60 * 60);

    if (diffHours > 24) {
      return res.status(400).json({ message: "Order can only be canceled within 24 hours" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // ✅ Restore stock safely
    for (let item of order.items) {
      await Product.updateOne(
        { productId: item.productId },
        { $inc: { stock: item.qty } }
      );
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
}
