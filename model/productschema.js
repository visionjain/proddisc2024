const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    product_code: {
        type: String,
    },
    product_name: {
        type: String
    },
    product_price: {
        type: String
    },
    role: {
        type: String,
      },
}, {timestamps: true});
mongoose.models={}
export default mongoose.model("Product", ProductSchema);
