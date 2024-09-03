import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const [address, setAddress] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('road');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const cartId = new URLSearchParams(window.location.search).get('cartId');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/orders/create/', {
                cartId,
                address,
                deliveryMethod,
                email
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setSuccess(true);
                setAddress('');
                setDeliveryMethod('road');
                setEmail('');
                setTimeout(() => navigate('/customer/cart'), 2000); // Redirect to cart page after 2 seconds
            }
        } catch (error) {
            console.error('Failed to create order:', error);
            setError('Failed to create order. Please try again later.');
        }
    };

    return (
        <Container
            fluid
            className="d-flex align-items-center justify-content-center"
            style={{
                backgroundImage: 'url(https://streetbell.com/sbcomweb/assets/img/ecommerce/niche-ecommerce.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                padding: '20px',
                color: 'white'
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '30px',
                    borderRadius: '10px',
                    width: '100%',
                    maxWidth: '600px'
                }}
            >
                <h1 className="mb-4">Checkout</h1>
                {success && <div className="alert alert-success">Order placed successfully! Redirecting to cart...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: 'none'
                            }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDeliveryMethod" className="mt-3">
                        <Form.Label>Delivery Method</Form.Label>
                        <Form.Control
                            as="select"
                            value={deliveryMethod}
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                            required
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: 'none'
                            }}
                        >
                            <option value="road">Road</option>
                            <option value="ship">Ship</option>
                            <option value="air">Air</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formEmail" className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: 'none'
                            }}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        className="mt-4"
                        style={{
                            width: '100%',
                            backgroundColor: '#007bff',
                            borderColor: '#007bff'
                        }}
                    >
                        Place Order
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default CheckoutPage;
