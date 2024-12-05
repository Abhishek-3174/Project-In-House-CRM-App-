const Order = require('../../model/schema/order');
const { getNextOrderNumber } = require('../redisController.js');
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const dbPool = mysql.createPool({
    host: 'database-pro.c528yk2kagd9.us-east-1.rds.amazonaws.com',
    user: "admin",
    password: "Esk374014",
    database: "classicmodels"
});
const index = async (req, res) => {
    try {
        // Fetch all orders
        const result = await Order.find({});
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Internal Server Error");
    }
};

const add = async (req, res) => {
    try {
        console.log("Payload received:", req.body);

        const { studentId, studentProgramId, orderedDate, orderValue,studentName } = req.body;

        // Validate required fields
        if (!studentId || !orderedDate || !orderValue) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create the order data object
        const orderData = {
            studentId,
            studentProgramId: studentProgramId || null, // Ensure null if undefined
            orderedDate,
            orderValue: Number(orderValue), // Ensure orderValue is a number
            studentName,
        };

        // Generate a unique order ID
        orderData.orderId = await getNextOrderNumber();
        if (!orderData.orderId) {
            throw new Error("Failed to generate a unique order ID");
        }
        const sqlValues = [
            orderData.studentProgramId || null, // Ensure null if undefined
            orderData.orderId,
            orderData.studentId,
            orderData.studentName || null, // Ensure null if undefined
            orderData.orderedDate,
            Number(orderData.orderValue), // Ensure orderValue is a number
        ];
        const [mysqlResult] = await dbPool.execute(
            `INSERT INTO orders (
                studentProgramId, orderId, studentId, studentName, orderedDate, orderValue
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            sqlValues
        );        
        console.log("Order data to be saved:", orderData);

        // Save to database
        const result = new Order(orderData);
        await result.save();

        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to create order:", err);

        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ error: "Duplicate order ID detected", details: err.keyValue });
        }

        // Generic error response
        res.status(500).json({ error: "Failed to create order", details: err.message });
    }
};


const edit = async (req, res) => {
    try {
        const { studentId,studentProgramId, orderedDate, orderValue } = req.body;
        const orderData = { studentId,studentProgramId, orderedDate, orderValue};

        let result = await Order.updateOne(
            { _id: req.params.id },
            { $set: orderData }
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to update order:', err);
        res.status(400).json({ error: 'Failed to update order:', err });
    }
};

const view = async (req, res) => {
    try {
        let response = await Order.findOne({ orderId: req.params.orderId });
        if (!response) return res.status(404).json({ message: "No Data Found." });

        let result = await Order.aggregate([
            { $match: { _id: response._id } },
        ]);

        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ Error: err });
    }
};

const deleteData = async (req, res) => {
    try {
        const result = await Order.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "Order deleted successfully", result });
    } catch (err) {
        res.status(404).json({ message: "Error deleting order", err });
    }
};

module.exports = { index, add, edit, view, deleteData };