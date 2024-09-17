import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import CommonNavbar from '../components/CommonNavbar'; // Import the CommonNavbar component

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartId, setCartId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            if (!token) {
                setError('You need to log in first');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get('http://localhost:8000/api/carts/cart/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setCart(response.data);
                setCartId(response.data.id);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                setError('Failed to fetch cart. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [token]);

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete('http://localhost:8000/api/carts/cart/', {
                data: { productId },
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const response = await axios.get('http://localhost:8000/api/carts/cart/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setCart(response.data);
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
            setError('Failed to remove item from cart. Please try again later.');
        }
    };

    const totalPrice = cart ? cart.items.reduce((acc, item) => {
        const productPrice = parseFloat(item.product.price) || 0;
        return acc + productPrice * item.quantity;
    }, 0) : 0;

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <>
            <CommonNavbar />
            <div style={styles.pageContainer}>
                <h1 style={styles.title}>Your Cart</h1>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart && cart.items.length > 0 ? (
                            cart.items.map((item, index) => {
                                const product = item.product;
                                const productPrice = parseFloat(product.price) || 0;
                                return (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${productPrice.toFixed(2)}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleRemoveFromCart(product.id)}
                                                style={styles.button}
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" style={styles.noItems}>No items in cart</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {cart && cart.items.length > 0 && (
                    <>
                        <h2 style={styles.totalPrice}>Total Price: ${totalPrice.toFixed(2)}</h2>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/customer/checkout?cartId=${cartId}`)}
                            style={styles.checkoutButton}
                        >
                            Proceed to Checkout
                        </Button>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

const styles = {
    pageContainer: {
        backgroundColor: '#25252b',
        color: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
        minHeight: 'calc(100vh - 60px)', // Subtract the height of the footer
        margin: '0 auto',
        maxWidth: '1200px',
        position: 'relative', // Ensure the footer is positioned correctly
        paddingBottom: '60px' // Add padding to prevent overlap with the footer
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '2rem',
        color: '#ff2770'
    },
    table: {
        backgroundColor: '#333',
        color: '#fff',
        width: '100%',
        borderCollapse: 'collapse',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
    },
    button: {
        margin: '0 auto',
        display: 'block'
    },
    noItems: {
        textAlign: 'center',
        color: '#ff2770'
    },
    totalPrice: {
        textAlign: 'center',
        marginTop: '1rem',
        fontSize: '1.5rem'
    },
    checkoutButton: {
        display: 'block',
        margin: '1rem auto'
    },
    loading: {
        textAlign: 'center',
        color: '#fff'
    },
    error: {
        textAlign: 'center',
        color: '#ff2770'
    }
};

export default CartPage;
