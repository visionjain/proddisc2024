const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    },
    discounts: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // Reference to the Product model
        },
        discount_percent: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    }]
},{timestamps: true});
mongoose.models={}
export default mongoose.model('Customer', CustomerSchema);
