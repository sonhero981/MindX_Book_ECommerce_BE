const mongoose = require('mongoose')

const Cart = new mongoose.Schema({
    sellProduct: [{
        type: mongoose.Types.ObjectId,
        ref: 'Book'
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const CartModel = mongoose.model('Cart', Cart)

module.exports = CartModel