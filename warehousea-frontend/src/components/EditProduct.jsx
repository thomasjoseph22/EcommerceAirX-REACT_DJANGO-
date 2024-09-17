import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        images: [],
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${productId}/`, {
                    headers: {
                        'Authorization': `Token ${token}` // Include the token in the request headers
                    }
                });
                const { name, description, price, quantity, images } = response.data;
                setFormData({ name, description, price, quantity, images });
                setError('');
            } catch (error) {
                setError('Failed to fetch product details.');
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken'); // Clear invalid token
                    navigate('/login'); // Redirect to login page
                }
            } finally {
                setLoading(false); // Stop loading state
            }
        };
        fetchProduct();
    }, [productId, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            images: [...e.target.files],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const productData = new FormData();
        productData.append('name', formData.name);
        productData.append('description', formData.description);
        productData.append('price', formData.price);
        productData.append('quantity', formData.quantity);
        formData.images.forEach(image => {
            productData.append('images', image);
        });

        try {
            await axios.put(`http://localhost:8000/api/products/${productId}/edit/`, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`
                },
            });
            setSuccess('Product updated successfully!');
            navigate('/admin/products');
        } catch (error) {
            setError('Failed to update product. Please try again.');
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={pageStyles}>
            <div style={formStyles}>
                <h2>Edit Product</h2>
                {error && <p style={errorStyles}>{error}</p>}
                {success && <p style={successStyles}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <label style={labelStyles}>Name</label>
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

                    <label style={labelStyles}>Images</label>
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleFileChange}
                        style={inputStyles}
                    />

                    <button type="submit" style={buttonStyles}>Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
