const mongoose = require('mongoose');

const Payment = new mongoose.Schema({
    PaymentNumber: {
        type: String,
        unique: true,
        required: true
    },
    paymentType: {
        type: String
    },
    amount: {
        type: String
    },
    orderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    paymentDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['done', 'pending', 'in-progress'], // Allowed options for status
        default: 'pending' // Default value
    }
});

module.exports = mongoose.model('Payment', Payment);
