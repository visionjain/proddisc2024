import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Productpage = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        product_code: '',
        product_name: '',
        product_price: '',
        product_unit: 'KG' // Default unit set to KG
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/getproduct');
                setProducts(response.data.product);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addProduct = () => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
        setNewProduct({
            product_code: '',
            product_name: '',
            product_price: '',
            product_unit: 'KG' // Reset to default unit after adding
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className='font-bold text-4xl mt-6 mb-6'>ALL Product</h1>

            {/* Add Product Form */}
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Add Product</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        name="product_code"
                        placeholder="Product Code"
                        value={newProduct.product_code}
                        onChange={handleInputChange}
                        className="border p-2"
                    />
                    <input
                        type="text"
                        name="product_name"
                        placeholder="Product Name"
                        value={newProduct.product_name}
                        onChange={handleInputChange}
                        className="border p-2"
                    />
                    <input
                        type="text"
                        name="product_price"
                        placeholder="Product Price"
                        value={newProduct.product_price}
                        onChange={handleInputChange}
                        className="border p-2"
                    />
                    <select
                        name="product_unit"
                        value={newProduct.product_unit}
                        onChange={handleInputChange}
                        className="border p-2"
                    >
                        <option value="KG">KG</option>
                        <option value="LTR">LTR</option>
                    </select>
                    <button
                        onClick={addProduct}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Add Product
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <table className="w-[800px] table-auto border">
                {/* Table headers */}
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-4">Product Code</th>
                        <th className="border p-4">Product Name</th>
                        <th className="border p-4">Product Price</th>
                        <th className="border p-4">Product Unit</th>
                    </tr>
                </thead>
                {/* Table body */}
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td className="border p-4">{product.product_code}</td>
                            <td className="border p-4">{product.product_name}</td>
                            <td className="border p-4">₹{product.product_price}</td>
                            <td className="border p-4">{product.product_unit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Productpage;
