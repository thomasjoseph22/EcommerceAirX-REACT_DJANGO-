import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import CommonNavbar from './CommonNavbar';
import Footer from './Footer';

const ProductPreviewPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setProduct(response.data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setError('Failed to fetch product. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You need to log in first');
            return;
        }
    
        try {
            await axios.post(
                'http://localhost:8000/api/carts/cart/add/', 
                { productId: id, quantity: 1 }, 
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setSuccessMessage('Product added to cart successfully!');
            setShowModal(true);
        } catch (error) {
            console.error('Failed to add product to cart:', error.response ? error.response.data : error.message);
            setError('Failed to add product to cart. Please try again later.');
        }
    };

    const handleCloseModal = () => setShowModal(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div style={{ backgroundColor: '#25252b', minHeight: '100vh',minWidth:'100vw', color: '#fff', padding: '20px', position: 'relative' }}>
            {/* Navbar */}
            <CommonNavbar />
            
            <Container className="mt-4">
                <h1 className="mb-4">{product.name}</h1>
                <Row>
                    <Col md={12}>
                        <div 
                            id="carouselExampleIndicators" 
                            className="carousel slide" 
                            data-bs-ride="carousel"
                        >
                            <div className="carousel-indicators">
                                {product.images && product.images.length > 0 && product.images.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        data-bs-target="#carouselExampleIndicators"
                                        data-bs-slide-to={index}
                                        className={index === 0 ? 'active' : ''}
                                        aria-current={index === 0 ? 'true' : undefined}
                                        aria-label={`Slide ${index + 1}`}
                                        style={{ backgroundColor: '#ff2770' }}
                                    ></button>
                                ))}
                            </div>
                            <div className="carousel-inner" style={{width:"100%", margin: "0 auto"}}>
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((img, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <img
                                                src={img.image_url}
                                                className="d-block w-100"
                                                alt={`Product Image ${index}`}
                                                style={{ height: '500px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="carousel-item active">
                                        <img
                                            src="https://via.placeholder.com/400"
                                            className="d-block w-100"
                                            alt="Placeholder"
                                        />
                                    </div>
                                )}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" style={{width: '5%'}}>
                                <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: '#ff2770' }}></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" style={{width: '5%'}}>
                                <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: '#ff2770' }}></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </Col>

                    {/* Move the Product details below the carousel */}
                    <Col md={12} className="d-flex flex-column justify-content-center mt-4">
                        <Card className="p-4" style={{ backgroundColor: '#000', color: '#fff' }}>
                            <Card.Body>
                                <Card.Text>
                                    <strong>Description:</strong> {product.description}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Price:</strong> ${product.price}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Quantity:</strong> {product.quantity}
                                </Card.Text>
                                <Button variant="primary" size="lg" onClick={handleAddToCart}>Add to Cart</Button>
                                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Success Modal */}
            <Modal 
                show={showModal} 
                onHide={handleCloseModal}
                dialogClassName="custom-modal"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Modal.Header closeButton style={{ borderBottom: 'none' }}>
                    <Modal.Title style={{ color: '#ff2770' }}>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'linear-gradient(to bottom, #333, #111)', color: '#fff' }}>
                    {successMessage}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        
        </div>
    );
};

export default ProductPreviewPage;
