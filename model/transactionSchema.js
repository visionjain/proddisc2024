// transactionSchema.js

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  product_code: { type: String, required: true },
  product_name: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  discount_applied_percentage: { type: Number, default: 0 },  // Discount applied as a percentage for this product
  final_amount_after_discount: { type: Number, required: true }  // Final amount after applying discount
});

const transactionSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true
  },
  customer_name: {
    type: String,
    required: true
  },
  transaction_id: {
    type: String,
    required: true
  },
  products: [productSchema],  // Array of products with individual discounts
  total_transaction_amount: {
    type: Number,
    required: true
  },
  final_amount_after_discount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

mongoose.models = {};
export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
