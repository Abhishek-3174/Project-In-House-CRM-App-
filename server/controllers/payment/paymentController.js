const Payment = require('../../model/schema/payment');
const { getNextPaymentNumber } = require('../redisController.js');
const mongoose = require('mongoose');

// Add a new payment
const add = async (req, res) => {
    try {
        console.log("Payload received:", req.body);

        const { orderId, amount, paymentType, status } = req.body;

        // Validate required fields
        if (!orderId || !amount || !paymentType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create the payment data object
        const paymentData = {
            orderId,
            amount: Number(amount), // Ensure amount is a number
            paymentType,
            status: status || 'pending', // Default to 'Pending' if not provided
        };

        // Generate a unique payment ID
        paymentData.PaymentNumber = await getNextPaymentNumber();
        if (!paymentData.PaymentNumber) {
            throw new Error("Failed to generate a unique payment ID");
        }

        console.log("Payment data to be saved:", paymentData);

        // Save to database
        const result = new Payment(paymentData);
        await result.save();

        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to create payment:", err);

        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ error: "Duplicate payment ID detected", details: err.keyValue });
        }

        // Generic error response
        res.status(500).json({ error: "Failed to create payment", details: err.message });
    }
};

// Get all payments
const index = async (req, res) => {
    try {
        // Fetch all payments
        const result = await Payment.find({})

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { add, index };
