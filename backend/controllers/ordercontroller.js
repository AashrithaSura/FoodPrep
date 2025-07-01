const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { recordPromoUsage } = require('./promocontroller');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PlaceOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "https://foodprepuser-vofr.onrender.com";
  try {
    console.log('Received order request from user:', req.userId);
    console.log('Request body:', req.body);

    if (!req.body.subtotal || typeof req.body.subtotal !== 'number') {
      return res.status(400).json({ success: false, message: "Invalid subtotal amount" });
    }

    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in cart" });
    }

    const requiredFields = ['first_name', 'last_name', 'email', 'street', 'city', 'state', 'zip_code', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !req.body.address[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, message: `Missing address fields: ${missingFields.join(', ')}` });
    }

    const subtotal = req.body.subtotal;
    const discount = req.body.discount || 0;
    let deliveryFee = req.body.deliveryFee || 40;
    
    const promo = req.body.promo ? req.body.promo.toUpperCase() : null;
    if (promo === 'FREESHIP') {
      deliveryFee = 0;
    }

    const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

    const newOrder = new Order({
      userId: req.userId,
      items: req.body.items,
      amount: totalAmount,
      address: req.body.address,
      promo: req.body.promo || null,
      subtotal,
      discount,
      deliveryFee,
      payment: false,
      status: 'Pending'
    });

    const line_items = [{
      price_data: {
        currency: "inr",
        product_data: {
          name: "Total Order Amount"
        },
        unit_amount: Math.round(totalAmount * 100),
      },
      quantity: 1,
    }];

    console.log('Creating Stripe session with line item:', line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    await newOrder.save();
    console.log('Order created successfully:', newOrder._id);

    res.status(200).json({
      success: true,
      session_url: session.url,
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("Order placement error:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    res.status(500).json({
      success: false,
      message: "Failed to process order",
      error: error.message
    });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      order.payment = true;
      order.status = "Processing";

      if (order.promo) {
        await recordPromoUsage(order.promo);
      }

      await User.findByIdAndUpdate(order.userId, { cartData: {} });

      await order.save();

      return res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({ success: false, message: "Payment cancelled" });
    }
  } catch (error) {
    console.error("Order verification error:", {
      message: error.message,
      stack: error.stack,
      orderId,
      success
    });

    res.status(500).json({
      success: false,
      message: "Error verifying payment status",
      error: error.message
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.userId,
      payment: true
    }).sort({ createdAt: -1 }).lean();

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", {
      message: error.message,
      stack: error.stack,
      userId: req.userId
    });

    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message
    });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({payment:true})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error listing orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Status update error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ success: false, message: "Delivered orders cannot be canceled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Order cancellation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message
    });
  }
};

const rateItem = async (req, res) => {
  const { orderId, itemId, rating } = req.body;

  if (!orderId || !itemId || !rating) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const order = await Order.findOne({
      _id: orderId,
      userId: req.userId,
      payment: true
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    let item = order.items.find(i => i._id == itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in order" });
    }

    item.rating = rating;
    await order.save();

    res.status(200).json({ success: true, message: "Rating submitted" });
  } catch (error) {
    console.error("Error rating item:", error.message);
    res.status(500).json({ success: false, message: "Failed to rate item", error: error.message });
  }
};

module.exports = {PlaceOrder,verifyOrder,userOrders, listOrders,updateStatus,cancelOrder,rateItem };
