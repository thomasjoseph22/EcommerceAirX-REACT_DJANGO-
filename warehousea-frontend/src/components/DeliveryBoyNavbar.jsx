import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';

const DeliveryBoyNavbar = () => {
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

    // Inline CSS styles
    const navbarStyle = {
        background: 'linear-gradient(-45deg, #ff5959, #ff4040, #ff0d6e, #ff8033, #d74177)',
        backgroundSize: '400% 400%',
        animation: 'myGradient 12s ease infinite',
        borderRadius: '0 0 40px 40px',
        boxShadow: '3px 3px 20px #ff3352',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        padding: '10px 20px',
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        padding: '15px 20px',
        fontFamily: 'verdana',
        fontWeight: 'lighter',
        fontSize: '18px',
        letterSpacing: '1px',
        opacity: 0.9,
        transition: 'color 0.3s, text-shadow 0.3s',
    };

    const linkHoverStyle = {
        color: '#fff',
        animation: 'myFlash 1.5s linear infinite',
        textShadow: '2px 2px 30px #fff',
    };

    const logoutLinkStyle = {
        ...linkStyle,
        color: '#dc3545',
    };

    const sidebarLinkStyle = {
        ...linkStyle,
        color: 'black',
    };

    return (
        <>
            <Navbar style={navbarStyle} expand="lg">
                <Container>
                    <Navbar.Brand href="/deliveryboy/dashboard">
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
                                    <Link to="/deliveryboy/orders" className="nav-link" style={{ ...linkStyle, ...linkHoverStyle }}>View Orders</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/deliveryboy/profile" className="nav-link" style={{ ...linkStyle, ...linkHoverStyle }}>View Profile</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link
                                        to="#"
                                        className="nav-link"
                                        onClick={handleLogout}
                                        style={{ ...linkStyle, ...linkHoverStyle, ...logoutLinkStyle }}
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
                                <Link to="/deliveryboy/orders" className="nav-link" onClick={toggleSidebar} style={sidebarLinkStyle}>View Orders</Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/deliveryboy/profile" className="nav-link" onClick={toggleSidebar} style={sidebarLinkStyle}>View Profile</Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link 
                                    to="#"
                                    className="nav-link"
                                    onClick={() => { handleLogout(); toggleSidebar(); }}
                                    style={{ ...sidebarLinkStyle, ...logoutLinkStyle }}
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

export default DeliveryBoyNavbar;
