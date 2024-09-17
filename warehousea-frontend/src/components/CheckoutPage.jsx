import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CommonNavbar from '../components/CommonNavbar'; // Import the CommonNavbar component
import Footer from '../components/Footer'; // Import the Footer component

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
            console.log(response); // Log the response
            if (response.status === 200) {
                setSuccess(true);
                setError(''); // Clear any existing error
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
        <>
            <CommonNavbar />
            <Container
                fluid
                className="d-flex align-items-center justify-content-center"
                style={{
                    backgroundColor: '#25252b',
                    border: '2px solid #ff2770',
                    boxShadow: '0 0 25px #ff2770',
                    position: 'relative',
                    width: '100%',
                    height: '450px',
                    minHeight: '100vh',
                    overflow: 'hidden',
                    color: '#fff',
                    padding: '20px'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: '50%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        padding: '0 60px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }}
                >
                    <h1 className="mb-4" style={{ textAlign: 'center', fontSize: '32px' }}>Checkout</h1>
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
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    border: 'none',
                                    borderBottom: '2px solid #fff',
                                    paddingRight: '23px',
                                    marginBottom: '25px'
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
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    border: 'none',
                                    borderBottom: '2px solid #fff',
                                    marginBottom: '25px'
                                }}
                            >
                                <option style={{color:"green"}} value="road">Road</option>
                                <option style={{color:"blue"}} value="ship">Ship</option>
                                <option style={{color:"black"}} value="air">Air</option>
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
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    border: 'none',
                                    borderBottom: '2px solid #fff',
                                    marginBottom: '25px'
                                }}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-4"
                            style={{
                                width: '100%',
                                height: '45px',
                                backgroundColor: '#ff2770',
                                borderColor: '#ff2770',
                                borderRadius: '40px',
                                fontSize: '16px',
                                fontWeight: '600'
                            }}
                        >
                            Place Order
                        </Button>
                    </Form>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default CheckoutPage;
