import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        // Redirect to login if no token or not admin
        if (!token || !isAdmin) {
            navigate('/admin/login');
            return;
        }

        // Fetch products if token is valid and user is admin
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
        <div style={styles.container}>
            <AdminNavbar style={styles.navbar} />
            <div style={styles.mainContent}>
                <h1 style={styles.heading}>Admin Products</h1>
                <button
                    onClick={handleAddProduct}
                    style={styles.addButton}
                >
                    Add Product
                </button>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {['Name', 'Price', 'Quantity', 'Images', 'Actions'].map(header => (
                                    <th key={header} style={styles.tableHeader}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td style={styles.tableCell}>{product.name}</td>
                                    <td style={styles.tableCell}>${product.price}</td>
                                    <td style={styles.tableCell}>{product.quantity}</td>
                                    <td style={styles.tableCell}>
                                        {product.images && product.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image.image_url}
                                                alt={`Product Image ${index + 1}`}
                                                style={styles.productImage}
                                            />
                                        ))}
                                    </td>
                                    <td style={styles.tableCell}>
                                        <button
                                            onClick={() => handleEditProduct(product.id)}
                                            style={styles.editButton}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            style={styles.deleteButton}
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
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        background: 'linear-gradient(45deg, #25252b, #ff2770)',
        minHeight: '100vh',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
    },
    navbar: {
        position: 'fixed',
        top: '0',
        width: '100%',
        zIndex: '1000'
    },
    mainContent: {
        marginTop: '60px' // Adjust margin to account for fixed Navbar
    },
    heading: {
        fontSize: '32px',
        textAlign: 'center',
        marginBottom: '20px'
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#ff2770',
        color: '#fff',
        border: 'none',
        borderRadius: '40px',
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '16px',
        fontWeight: '600'
    },
    tableContainer: {
        overflowX: 'auto' // Add scrollable container
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#25252b',
        color: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        borderRadius: '8px',
        minWidth: '800px' // Set minimum width to prevent table shrinking
    },
    tableHeader: {
        border: '1px solid #fff',
        padding: '15px',
        backgroundColor: '#ff2770',
        textAlign: 'left'
    },
    tableCell: {
        border: '1px solid #fff',
        padding: '15px'
    },
    productImage: {
        width: '50px',
        height: '50px',
        marginRight: '5px'
    },
    editButton: {
        padding: '5px 10px',
        marginRight: '5px',
        backgroundColor: '#ffc107',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer'
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer'
    }
};

export default AdminProducts;
