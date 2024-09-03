import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';
import '../styles.css';
import '../axiosConfig';

const CustomerDashboard = () => {
    const { username, token, logout } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = () => {
            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                navigate('/login');
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
        <div className="customer-dashboard">
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Customer Dashboard</Navbar.Brand>
                    <Nav className="ml-auto">
                        {isLoggedIn && (
                            <>
                                <Nav.Item>
                                    <Nav.Link href="#profile">Welcome, {username}</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Button variant="outline-light" onClick={logout}>Logout</Button>
                                </Nav.Item>
                                <Nav.Item>
                                    <Button variant="outline-light" onClick={() => navigate('/customer/profile')}>
                                        View Profile
                                    </Button>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/users/orders" className="nav-link">My Orders</Link>
                                </Nav.Item>
                            </>
                        )}
                        <Nav.Item>
                            <Link to="/customer/cart" className="nav-link">View Cart</Link>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>
            <Container>
                <h1>Customer Dashboard</h1>
                <p><strong>Logged in as:</strong> {username}</p>
                <p><strong>Token:</strong> {token}</p>
                <div className="card-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {products.map(product => (
                        <div key={product.id} className="card-item">
                            <Card style={{ width: '18rem', backgroundColor: '#000', color: '#fff' }}>
                                <Card.Img
                                    variant="top"
                                    src={product.images && product.images.length > 0 ? product.images[0].image_url : 'https://via.placeholder.com/150'}
                                    alt={`Product Image ${product.id}`}
                                    style={{ height: '250px', width: '100%', objectFit: 'cover' }}
                                />
                                <Card.Body style={{ padding: '15px' }}>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Price:</strong> ${product.price}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Quantity:</strong> {product.quantity}
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => navigate(`/product/${product.id}`)}>
                                        Preview
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default CustomerDashboard;
