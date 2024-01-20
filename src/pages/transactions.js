import React, { useState, useEffect } from 'react';
import Nav from '@/components/nav/nav';
import axios from 'axios';

const Transactions = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [addedProducts, setAddedProducts] = useState([]);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [selectedCustomerForAdd, setSelectedCustomerForAdd] = useState(null);
  const [selectedProductsForAdd, setSelectedProductsForAdd] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());


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
    axios.get('/api/getproduct')
      .then(response => {
        setProducts(response.data.product);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
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
  const calculateTotalPrice = () => {
    return addedProducts.reduce((total, product) => total + product.product_price * product.quantity, 0);
  };


  const handleQuantityChange = (index, action) => {
    const updatedProducts = [...addedProducts];
    const currentQuantity = updatedProducts[index].quantity;

    if (action === 'increase') {
      updatedProducts[index].quantity = currentQuantity + 1;
    } else if (action === 'decrease' && currentQuantity > 1) {
      updatedProducts[index].quantity = currentQuantity - 1;
    }

    // Recalculate the final amount after discount for the updated product
    const discount = getDiscountForProduct(updatedProducts[index].product_code);
    const finalAmountAfterDiscount = calculateFinalAmount(
      updatedProducts[index].product_price,
      discount,
      updatedProducts[index].quantity
    );

    updatedProducts[index].final_amount_after_discount = finalAmountAfterDiscount;

    setAddedProducts(updatedProducts);
  };



  const closeTransactionModals = () => {
    setSelectedCustomer(null);
    setSelectedTransaction(null);
  };

  const openAddTransactionModal = () => {
    setIsAddTransactionModalOpen(true);
  };

  const addProduct = () => {
    if (selectedProductToAdd) {
      const discount = getDiscountForProduct(selectedProductToAdd.product_code);

      // Ensure that quantity is a valid number
      const quantity = parseInt(quantityToAdd);
      if (isNaN(quantity)) {
        console.error("Invalid quantity:", quantityToAdd);
        return;
      }

      console.log("Adding product with quantity:", quantity);

      const finalAmountAfterDiscount = calculateFinalAmountAfterDiscount(
        selectedProductToAdd.product_price,
        discount,
        quantity
      );

      const productToAdd = {
        ...selectedProductToAdd,
        quantity: quantity, // Ensure quantity is properly set
        final_amount_after_discount: finalAmountAfterDiscount,
      };
  
      // Update state correctly
      setAddedProducts((prevProducts) => [...prevProducts, productToAdd]);
  
      // Clear selected product and reset quantity
      setSelectedProductToAdd(null);
      setQuantityToAdd(1);
    }
  };



  // Function to remove a product from the list of added products
  const removeProduct = (productId) => {
    const updatedProducts = addedProducts.filter((product) => product._id !== productId);
    setAddedProducts(updatedProducts);
  };

  // Function to close the "Add Transaction" modal
  const closeAddTransactionModal = () => {
    setIsAddTransactionModalOpen(false);
    setSelectedCustomerForAdd(null);
    setSelectedProductsForAdd([]);
    setDiscountedProducts([]);
  };
  const handleAddTransaction = () => {
    if (selectedCustomerForAdd && selectedProductsForAdd.length > 0) {
      const newTransaction = {
        customer_id: selectedCustomerForAdd._id,
        customer_name: selectedCustomerForAdd.customer_name,
        transaction_id: `T${Math.floor(Math.random() * 1000)}`,
        products: selectedProductsForAdd.map(product => ({
          ...product,
          discount_applied_percentage: getDiscountForProduct(product.product_code),
          final_amount_after_discount: calculateFinalAmount(product),
        })),
        total_transaction_amount: calculateTotalTransactionAmount(selectedProductsForAdd),
        final_amount_after_discount: calculateFinalAmountAfterDiscount(selectedProductsForAdd),
        date: selectedDate.toISOString().split('T')[0],
      };

      // Update local state with the new transaction
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

      // Close the modal
      closeAddTransactionModal();
    }
  };
  const getDiscountForProduct = (productCode) => {
    const customerDiscounts = selectedCustomerForAdd.discounts || [];
    const productDiscount = customerDiscounts.find(discount => discount.product_code === productCode);
    return productDiscount ? productDiscount.discount_percent : 0;
  };


  // Function to calculate the final amount after applying discount for a product
  const calculateFinalAmount = (product) => {
    const discountPercent = getDiscountForProduct(product.product_code);
    const quantity = parseInt(product.quantity);

    if (isNaN(quantity)) {
      // Handle the case where the quantity is not a valid number
      return 0;
    }

    const discountedAmount = product.product_price * (1 - discountPercent / 100);
    return discountedAmount * quantity;
  };



  // Function to calculate the final total price after applying discounts
  const calculateFinalTotalPrice = () => {
    return addedProducts.reduce((total, product) => {
      return total + product.final_amount_after_discount;
    }, 0);
  };

  // Function to calculate the total transaction amount before applying discount
  const calculateTotalTransactionAmount = (products) => {
    return products.reduce((total, product) => {
      const quantity = parseInt(product.quantity);

      if (!isNaN(quantity)) {
        total += product.product_price * quantity;
      }

      return total;
    }, 0);
  };


  // Function to calculate the final amount after applying discount for the entire transaction
  // Function to calculate the final amount after applying discount for the entire transaction
  // Function to calculate the final amount after applying discount for a product
  const calculateFinalAmountAfterDiscount = (product) => {
    const discountPercent = getDiscountForProduct(product.product_code);
    const quantity = parseInt(product.quantity);

    if (isNaN(quantity)) {
      // Handle the case where the quantity is not a valid number
      return 0;
    }

    const discountedAmount = product.product_price * (1 - discountPercent / 100);
    return discountedAmount * quantity;
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Nav />
      <h1 className="text-2xl font-bold mb-4">Transactions Page</h1>
      {/* Customers Table */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        onClick={openAddTransactionModal}
      >
        Add Transaction
      </button>
      {isAddTransactionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Add Transaction</h2>



            {/* Customer Selection */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Select Date:</label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]} // Format the date for input value
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Select Customer:</label>
              <select
                value={selectedCustomerForAdd ? selectedCustomerForAdd._id : ''}
                onChange={(e) => {
                  const selectedCustomer = customers.find(customer => customer._id === e.target.value);
                  setSelectedCustomerForAdd(selectedCustomer);
                }}
                className="w-full border p-2 rounded"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>{customer.customer_name}</option>
                ))}
              </select>
            </div>

            {/* Product Selection */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Select Product:</label>
              <select
                value={selectedProductToAdd ? selectedProductToAdd._id : ''}
                onChange={(e) => {
                  const selectedProductId = e.target.value;
                  const selectedProduct = products.find((product) => product._id === selectedProductId);
                  setSelectedProductToAdd(selectedProduct);
                }}
                className="w-full border p-2 rounded"
              >
                <option value="" disabled>Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.product_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Input */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            {/* Add Product Button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
              onClick={addProduct}
            >
              Add Product
            </button>


            {/* Display Selected Products with Discounts */}
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Selected Products:</h3>
              <table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Product Code</th>
                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2">Price</th>
                    <th className="border border-gray-300 px-4 py-2">Unit</th>
                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2">Discount</th>
                    <th className="border border-gray-300 px-4 py-2">Final Price</th>
                  </tr>
                </thead>
                <tbody>
                  {addedProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="border border-gray-300 px-4 py-2">{product.product_code}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        ₹{parseFloat(product.product_price).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{product.product_unit}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleQuantityChange(index, 'decrease')}
                        >
                          -
                        </button>
                        <span className="mx-2">{product.quantity}</span>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleQuantityChange(index, 'increase')}
                        >
                          +
                        </button>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {getDiscountForProduct(product.product_code)}%
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ₹{product.final_amount_after_discount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>



            {/* Total Price */}
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Total Price:</h3>
              <p>Before Discount: ₹{calculateTotalPrice().toFixed(2)}</p>
              <p>After Discount: ₹{calculateFinalTotalPrice().toFixed(2)}</p>
            </div>
            {/* Add Transaction Button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddTransaction}
            >
              Add Transaction
            </button>

            {/* Close Modal Button */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded ml-4"
              onClick={closeAddTransactionModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
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
