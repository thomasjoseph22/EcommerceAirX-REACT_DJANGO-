import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        images: [],
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token'); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            setError('You can only upload up to 3 images.');
            return;
        }
        setFormData({
            ...formData,
            images: files,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.description || !formData.price || !formData.quantity) {
            setError('Please fill in all required fields.');
            return;
        }

        const productData = new FormData();
        productData.append('name', formData.name);
        productData.append('description', formData.description);
        productData.append('price', formData.price);
        productData.append('quantity', formData.quantity);
        formData.images.forEach(image => {
            productData.append('images', image);
        });

        try {
            await axios.post('http://localhost:8000/api/products/add/', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}` // Add the Authorization header
                },
            });
            setSuccess('Product added successfully!');
            setFormData({
                name: '',
                description: '',
                price: '',
                quantity: '',
                images: [],
            });
        } catch (error) {
            console.error(error.response || error.message); // Log full error for debugging
            setError('Failed to add product. Please try again.');
        }
    };

    const pageStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#25252b',
        fontFamily: 'Poppins, sans-serif',
    };

    const formStyles = {
        position: 'relative',
        width: '500px',
        padding: '30px',
        backgroundColor: '#333',
        borderRadius: '10px',
        border: '2px solid #007bff',
        boxShadow: '0 0 25px #007bff',
        color: '#fff',
    };

    const labelStyles = {
        fontSize: '16px',
        color: '#fff',
        marginBottom: '10px',
        display: 'block',
    };

    const inputStyles = {
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '2px solid #fff',
        color: '#fff',
        fontSize: '16px',
        outline: 'none',
    };

    const buttonStyles = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'background-color 0.3s',
    };

    const errorStyles = {
        color: 'red',
        marginBottom: '15px',
    };

    const successStyles = {
        color: 'green',
        marginBottom: '15px',
    };

    return (
        <div style={pageStyles}>
            <div style={formStyles}>
                <h2>Add Product</h2>
                {error && <p style={errorStyles}>{error}</p>}
                {success && <p style={successStyles}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <label style={labelStyles}>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyles}
                    />

                    <label style={labelStyles}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={inputStyles}
                    />

                    <label style={labelStyles}>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        style={inputStyles}
                    />

                    <label style={labelStyles}>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        style={inputStyles}
                    />

                    <label style={labelStyles}>Images (up to 3)</label>
                    <input
                        type="file"
                        name="images"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        style={inputStyles}
                    />

                    <button type="submit" style={buttonStyles}>Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
