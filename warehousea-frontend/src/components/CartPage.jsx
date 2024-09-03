import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <Container
            className="mt-4"
            style={{
                backgroundImage: 'url(https://images.inc.com/uploaded_files/image/1920x1080/getty_769800477_2000133320009280304_361867.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                padding: '20px',
                color: 'white'
            }}
        >
            <h1 className="mb-4">Your Cart</h1>
            <Table
                striped
                bordered
                hover
                variant="dark"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black background
                    color: 'white'
                }}
            >
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
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No items in cart</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {cart && cart.items.length > 0 && (
                <>
                    <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
                    <Button variant="primary" onClick={() => navigate(`/customer/checkout?cartId=${cartId}`)}>
                        Proceed to Checkout
                    </Button>
                </>
            )}
        </Container>
    );
};

export default CartPage;
