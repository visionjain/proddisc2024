import React, { useState, useEffect } from 'react';
import Nav from '@/components/nav/nav';
import axios from 'axios';

const Transactions = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch customers
    axios.get('/api/getcustomer')
      .then(response => {
        setCustomers(response.data.customer);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });

    // Fetch transactions
    axios.get('/api/gettransaction')
      .then(response => {
        setTransactions(response.data.transaction);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      });
  }, []);
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState(null);

  const openTransactionModal = (customerId) => {
    setSelectedCustomer(customerId);
  };

  const openTransactionDetailsModal = (transactionId) => {
    const transactionDetails = transactions.find(t => t.transaction_id === transactionId);
    setSelectedTransactionDetails(transactionDetails);
  };

  const closeTransactionModals = () => {
    setSelectedCustomer(null);
    setSelectedTransaction(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Nav />
      <h1 className="text-2xl font-bold mb-4">Transactions Page</h1>
      {/* Customers Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td className="border border-gray-300 px-4 py-2">{customer.customer_name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => openTransactionModal(customer._id)}
                >
                  View Transactions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Customer Transaction Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl">
            <h2 className="text-xl font-bold mb-4">Transactions for Customer</h2>
            {transactions.some(transaction => transaction.customer_id === selectedCustomer) ? (
              <table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
                    <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                    <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Final Amount After Discount</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    if (transaction.customer_id === selectedCustomer) {
                      return (
                        <tr key={transaction.transaction_id}>
                          <td className="border border-gray-300 px-4 py-2">{transaction.transaction_id}</td>
                          <td className="border border-gray-300 px-4 py-2">{transaction.customer_name}</td>
                          <td className="border border-gray-300 px-4 py-2">₹{transaction.total_transaction_amount}</td>
                          <td className="border border-gray-300 px-4 py-2">₹{transaction.final_amount_after_discount}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded"
                              onClick={() => openTransactionDetailsModal(transaction.transaction_id)}
                            >
                              Show Detail
                            </button>
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            ) : (
              <p>No transactions available.</p>
            )}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeTransactionModals}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransactionDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Transaction Details</h2>


            {/* Transaction ID and Customer Information */}
            <p><strong>Transaction ID:</strong> {selectedTransactionDetails.transaction_id}</p>
            <p><strong>Customer Name:</strong> {selectedTransactionDetails.customer_name}</p>
            <p><strong>Total Transaction Amount:</strong> ₹{selectedTransactionDetails.total_transaction_amount}</p>
            <p><strong>Final Amount After Discount:</strong> ₹{selectedTransactionDetails.final_amount_after_discount}</p>

            {/* Products Table */}
            <table className="min-w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Product Code</th>
                  <th className="border border-gray-300 px-4 py-2">Product Name</th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Unit</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Discount Applied (%)</th> {/* Added this line */}
                </tr>
              </thead>
              <tbody>
                {selectedTransactionDetails.products.map((product, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{product.product_code}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{product.product_price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.product_unit}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{product.total_amount.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.discount_applied_percentage}%</td> {/* Added this line */}
                  </tr>
                ))}
              </tbody>
            </table>


            {/* Close Modal Button */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => setSelectedTransactionDetails(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
