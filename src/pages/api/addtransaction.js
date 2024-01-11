// addtransaction.js

import Transaction from "../../../model/transactionSchema";
import connectDb from "../../../lib/mongodb";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const {
      customer_id,
      customer_name,
      transaction_id,
      products,
      total_transaction_amount,
      final_amount_after_discount
    } = req.body;

    try {
      // Calculate discount for each product based on product-specific discounts
      const productsWithDiscount = products.map((product) => {
        const { product_code, product_price, quantity, discount_applied_percentage } = product;
        const total_amount = product_price * quantity;
        const discountAmount = (total_amount * discount_applied_percentage) / 100;
        const final_amount = total_amount - discountAmount;

        return {
          ...product,
          total_amount,
          discount_applied_percentage,
          final_amount_after_discount: final_amount,
        };
      });

      // Calculate total discount for the entire transaction
      const totalDiscount = products.reduce((total, product) => {
        return total + (product.total_amount - product.final_amount_after_discount);
      }, 0);

      // Create a new transaction with the calculated discounts
      const newTransaction = new Transaction({
        customer_id,
        customer_name,
        transaction_id,
        products: productsWithDiscount,
        total_transaction_amount,
        discount_applied: totalDiscount,
        final_amount_after_discount,
      });

      const savedTransaction = await newTransaction.save();
      res.status(201).json(savedTransaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save transaction.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default connectDb(handler);
