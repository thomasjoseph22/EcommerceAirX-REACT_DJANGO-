import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';

const AdminNavbar = () => {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false); // For toggling the sidebar
    const pr = window.location.protocol
    const host = window.location.host
     
  const route = `${pr}//${host}/`
  console.log(route)

    const handleLogout = () => {
        logout();
        window.location.href=`${route}customer/login/`
    };

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    // Updated styles for the Admin Navbar
    const navbarStyle = {
        background: 'linear-gradient(45deg, #007bff, #28a745)', // Blue to Green gradient
        backgroundSize: '400% 400%',
        animation: 'myGradient 15s ease infinite',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0, 0, 0, 0.3)',
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        padding: '10px 15px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: '500',
        fontSize: '18px',
        letterSpacing: '0.5px',
        transition: 'color 0.3s, background-color 0.3s',
    };

    const logoutLinkStyle = {
        color: '#dc3545',
        fontWeight: 'bold',
        fontSize: '18px',
        cursor: 'pointer',
    };

    return (
        <>
            <Navbar style={navbarStyle} expand="lg">
                <Container>
                    <Navbar.Brand href="/admin/dashboard">
                        <img 
                            src="https://seeklogo.com/images/A/airx-logo-4084F724C2-seeklogo.com.png" 
                            alt="AIR-X" 
                            style={{ height: '40px' }} 
                        />
                    </Navbar.Brand>

                    {/* Toggle Button for Sidebar */}
                    <Button
                        variant="outline-light"
                        className="d-lg-none"
                        onClick={toggleSidebar}
                        style={{ marginLeft: 'auto' }}
                    >
                        ☰ Menu
                    </Button>

                    <Nav className="ml-auto d-none d-lg-flex">
                        {token && (
                            <>
                                <Nav.Item>
                                    <Link to="/admin/products" className="nav-link" style={linkStyle}>
                                        Products
                                    </Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/admin/deliveryboys" className="nav-link" style={linkStyle}>
                                        Delivery
                                    </Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/admin/orders" className="nav-link" style={linkStyle}>
                                        Orders
                                    </Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/admin/users" className="nav-link" style={linkStyle}>
                                        Users
                                    </Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/admin/customers" className="nav-link" style={linkStyle}>
                                        Customers
                                    </Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link 
                                        to="/admin/login" 
                                        onClick={handleLogout} 
                                        className="nav-link" 
                                        style={logoutLinkStyle}
                                    >
                                        Logout
                                    </Link>
                                </Nav.Item>
                            </>
                        )}
                    </Nav>
                </Container>
            </Navbar>

            {/* Sidebar (Offcanvas) */}
            <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {token && (
                        <Nav className="flex-column">
                            <Nav.Item>
                                <Link to="/admin/products" className="nav-link" onClick={toggleSidebar}>
                                    Products
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/admin/deliveryboys" className="nav-link" onClick={toggleSidebar}>
                                    Delivery
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/admin/orders" className="nav-link" onClick={toggleSidebar}>
                                    Orders
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/admin/users" className="nav-link" onClick={toggleSidebar}>
                                    Users
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/admin/customers" className="nav-link" onClick={toggleSidebar}>
                                    Customers
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link 
                                    to="/admin/login" 
                                    onClick={() => { handleLogout(); toggleSidebar(); }}
                                    className="nav-link"
                                >
                                    Logout
                                </Link>
                            </Nav.Item>
                        </Nav>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default AdminNavbar;
