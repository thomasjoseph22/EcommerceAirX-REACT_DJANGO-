import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated and is an admin
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        if (!token || !isAdmin) {
            // Redirect to login page if not authenticated or not an admin
            navigate('/admin/login');
        } else {
            // Fetch products if authenticated and is an admin
            const fetchProducts = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/products/', {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    });
                    setProducts(response.data);
                } catch (error) {
                    console.error('Failed to fetch products:', error);
                }
            };
            fetchProducts();
        }
    }, [navigate]);

    const handleAddProduct = () => {
        navigate('/admin/products/add');
    };

    const handleEditProduct = (productId) => {
        navigate(`/admin/products/edit/${productId}`);
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:8000/api/products/${productId}/delete/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/admin/login');
    };

    return (
        <div
            style={{
                padding: '20px',
                backgroundImage: 'url(https://pbs.twimg.com/media/GT1MNEQWUAAxudv.jpg:large)',
                backgroundSize: 'cover',
                minHeight: '100vh',
                color: '#fff',
            }}
        >
            <nav style={{ backgroundColor: '#333', padding: '10px 20px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', margin: 0, padding: 0 }}>
                    <li style={{ marginRight: '20px' }}>
                        <a href="/admin/products" style={{ color: '#fff', textDecoration: 'none' }}>Products</a>
                    </li>
                    <li style={{ marginRight: '20px' }}>
                        <a href="/admin/users" style={{ color: '#fff', textDecoration: 'none' }}>Users</a>
                    </li>
                    <li style={{ marginRight: '20px' }}>
                        <a href="/admin/orders" style={{ color: '#fff', textDecoration: 'none' }}>Orders</a>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                            }}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
            <h1>Admin Products</h1>
            <button
                onClick={handleAddProduct}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                Add Product
            </button>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Price</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Quantity</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Images</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{product.name}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>${product.price}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{product.quantity}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                    {product.images && product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.image_url}
                                            alt={`Product Image ${index + 1}`}
                                            style={{ width: '50px', height: '50px', marginRight: '5px' }}
                                        />
                                    ))}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                    <button
                                        onClick={() => handleEditProduct(product.id)}
                                        style={{
                                            padding: '5px 10px',
                                            marginRight: '5px',
                                            backgroundColor: '#ffc107',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: '#dc3545',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
