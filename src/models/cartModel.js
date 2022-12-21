const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usermodel',
        required: true,
        unique: true
    },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductModel' },
        quantity: { type: Number, required: true, minLen: 1 }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.model('Cart_details', cartSchema)