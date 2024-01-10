import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [products, setProducts] = useState({});
    const [showAddDiscountPopup, setShowAddDiscountPopup] = useState(false);
    const [selectedProductCode, setSelectedProductCode] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');

    const [newCustomer, setNewCustomer] = useState({
        customer_name: '',
    });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('/api/getcustomer');
                setCustomers(response.data.customer);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/getproduct');
                const productMap = {};
                response.data.product.forEach((product) => {
                    productMap[product.product_code] = product.product_name;
                });
                setProducts(productMap);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchCustomers();
        fetchProducts();
    }, []);

    const openPopup = (customerName) => {
        const customer = customers.find((c) => c.customer_name === customerName);
        setSelectedCustomer(customer);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const addCustomer = () => {
        setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
        setNewCustomer({
            customer_name: '',
        });
    };


    const closePopup = () => {
        setSelectedCustomer(null);
    };

    const openAddDiscountPopup = () => {
        setShowAddDiscountPopup(true);
    };

    const closeAddDiscountPopup = () => {
        setShowAddDiscountPopup(false);
    };

    const getAvailableProducts = (allProducts, existingDiscounts) => {
        const existingProductCodes = existingDiscounts.map(discount => discount.product_code);
        return Object.keys(allProducts).filter(code => !existingProductCodes.includes(code));
      };
    
      const availableProducts = selectedCustomer ? getAvailableProducts(products, selectedCustomer.discounts) : [];
    
      const handleAddDiscount = () => {
        try {
          // Create a new discount object with the selected product code and discount percent
          const newDiscount = {
            product_code: selectedProductCode,
            discount_percent: discountPercent
          };
    
          // Update the selectedCustomer's discounts array with the new discount
          const updatedDiscounts = [...selectedCustomer.discounts, newDiscount];
    
          // Update the selectedCustomer with the new discounts
          setSelectedCustomer({
            ...selectedCustomer,
            discounts: updatedDiscounts
          });
    
          // Close the add discount popup
          closeAddDiscountPopup();
    
        } catch (error) {
          console.error('Error adding discount:', error);
        }
      };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Customers Page</h1>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Add Customer</h2>
                <input 
                    type="text" 
                    name="customer_name" 
                    placeholder="Customer Name" 
                    value={newCustomer.customer_name}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                />
                <button 
                    onClick={addCustomer} 
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Add Customer
                </button>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{customer.customer_name}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => openPopup(customer.customer_name)}
                                >
                                    View Discounts
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Main Popup */}
            {selectedCustomer && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
                        <h2 className="text-xl font-bold mb-4">{selectedCustomer.customer_name}&apos;s Discounts</h2>
                        <table className="min-w-full border-collapse border border-gray-300 mb-4">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Product Code</th>
                                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Discount Percent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCustomer.discounts.map((discount, index) => {
                                    const productName = products[discount.product_code] || 'N/A';
                                    return (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2">{discount.product_code}</td>
                                            <td className="border border-gray-300 px-4 py-2">{productName}</td>
                                            <td className="border border-gray-300 px-4 py-2">{discount.discount_percent}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                            onClick={openAddDiscountPopup}
                        >
                            Add Discount
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={closePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}


            {/* Add Discount Popup */}
             {showAddDiscountPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Discount</h2>
            <select
              className="mb-4 p-2 border rounded"
              value={selectedProductCode}
              onChange={(e) => setSelectedProductCode(e.target.value)}
            >
              <option value="">Select Product</option>
              {availableProducts.map((code) => (
                <option key={code} value={code}>
                  {products[code]}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Discount Percent"
              className="mb-4 p-2 border rounded"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
            />
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddDiscount}
            >
              Add Discount
            </button>
            <button 
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeAddDiscountPopup}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
