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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${productId}/`);
                console.log(response.data); // Log the response to see the data
                const { name, description, price, quantity, images } = response.data;
                setFormData({ name, description, price, quantity, images });
            } catch (error) {
                console.error('Failed to fetch product:', error);
            }
        };
        fetchProduct();
    }, [productId]);
    

    useEffect(() => {
        console.log(formData); // Check formData after setting it
    }, [formData]);

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
        minHeight: '100vh',
        backgroundImage: `url('https://media.licdn.com/dms/image/D5612AQGGgw-PAVlKSw/article-cover_image-shrink_720_1280/0/1698335366517?e=2147483647&v=beta&t=8bK3HY1ITN3CdLXrcdGBaElD_E6P6kR21RzrZ3BTxzI')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const formStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    };

    const labelStyles = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
    };

    const inputStyles = {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    };

    const buttonStyles = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
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
                <h1>Edit Product</h1>
                {error && <p style={errorStyles}>{error}</p>}
                {success && <p style={successStyles}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={labelStyles}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyles}
                        />
                    </div>
                    <div>
                        <label style={labelStyles}>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            style={inputStyles}
                        />
                    </div>
                    <div>
                        <label style={labelStyles}>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            style={inputStyles}
                        />
                    </div>
                    <div>
                        <label style={labelStyles}>Quantity:</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            style={inputStyles}
                        />
                    </div>
                    <div>
                        <label style={labelStyles}>Images:</label>
                        <input
                            type="file"
                            name="images"
                            multiple
                            onChange={handleFileChange}
                            style={inputStyles}
                        />
                    </div>
                    <button type="submit" style={buttonStyles}>Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
