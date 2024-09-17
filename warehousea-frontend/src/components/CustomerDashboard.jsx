import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';
import CommonNavbar from '../components/CommonNavbar'; // Import the CommonNavbar component
import Footer from '../components/Footer';
import '../styles.css';
import '../axiosConfig';

const CustomerDashboard = () => {
    const { token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = () => {
            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                navigate('');
            }
        };
        checkAuthentication();
    }, [token, navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!token) {
                console.error('No token found');
                return;
            }
            try {
                const response = await axios.get('http://localhost:8000/api/products/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        fetchProducts();
    }, [token]);

    return (
        <div style={{ backgroundColor: '#1b1b1b', minHeight: '100vh', color: '#fff' }}>
            <CommonNavbar /> {/* Use the CommonNavbar component */}
            <Container style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {products.map(product => (
                        <div key={product.id} style={{ width: '18rem' }}>
                            <Card style={{
                                backgroundColor: '#2a2a2e',
                                color: '#fff',
                                border: '2px solid #ff2770',
                                boxShadow: '0 0 25px #ff2770',
                                borderRadius: '10px',
                            }}>
                                <Card.Img
                                    variant="top"
                                    src={product.images && product.images.length > 0 ? product.images[0].image_url : 'https://via.placeholder.com/150'}
                                    alt={`Product Image ${product.id}`}
                                    style={{ height: '250px', width: '100%', objectFit: 'cover', borderBottom: '2px solid #ff2770' }}
                                />
                                <Card.Body style={{ padding: '15px', textAlign: 'center' }}>
                                    <Card.Title style={{ marginBottom: '10px' }}>{product.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Price:</strong> ${product.price}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Quantity:</strong> {product.quantity}
                                    </Card.Text>
                                    <Button variant="outline-light" onClick={() => navigate(`/product/${product.id}`)} style={{ width: '100%' }}>
                                        Preview
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </Container>
            <Footer /> {/* Include the Footer component */}
        </div>
    );
};

export default CustomerDashboard;
