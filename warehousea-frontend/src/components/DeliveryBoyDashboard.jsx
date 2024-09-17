import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeliveryBoyNavbar from './DeliveryBoyNavbar';

const DeliveryBoyDashboard = () => {
  const navigate = useNavigate();

  // Inline styles
  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh', // Adjusted to full viewport height
    border: '2px solid #ff2770',
    boxShadow: '0 0 25px #ff2770',
    overflow: 'auto', // Allows scrolling if content overflows
    background: '#25252b',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    paddingTop: '60px', // Add padding to avoid content overlap with the fixed navbar
  };

  const curvedShapeStyle = {
    position: 'absolute',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #25252b, #ff2770)',
    transform: 'rotate(10deg) skewY(40deg)',
    transformOrigin: 'bottom right',
    transition: '1.5s ease',
    transitionDelay: '1.6s',
  };

  const curvedShape2Style = {
    ...curvedShapeStyle,
    left: '250px',
    top: '100%',
    height: '700px',
    width: '850px',
    background: '#25252b',
    borderTop: '3px solid #ff2770',
    transform: 'rotate(0deg) skewY(0deg)',
    transformOrigin: 'bottom left',
    transitionDelay: '0.5s',
  };

  const formBoxStyle = {
    position: 'relative',
    width: '100%',
    height: 'auto', // Adjusted to auto to accommodate dynamic content height
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '20px',
    background: '#1c1c1c', // Dark background for the form box
    borderRadius: '15px',
    margin: '0 auto', // Center the form box horizontally
  };

  const headingStyle = {
    fontSize: '28px',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const carouselContainerStyle = {
    width: '100%',
    height: '1000px',
    marginBottom: '20px',
    marginLeft: '00px'
  };

  const carouselImageStyle = {
    height: '700px',
    width: "1500px",
    objectFit: 'cover',
  };

  const welcomeMessageStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    margin: '20px auto',
    padding: '20px',
    background: '#1c1c1c',
    borderRadius: '10px',
  };

  return (
    <div style={containerStyle}>
      <DeliveryBoyNavbar />
      <div style={{ ...curvedShapeStyle, right: '0', top: '-5px', height: '400px', width: '500px' }}></div>
      <div style={curvedShape2Style}></div>
      <div style={formBoxStyle}>
        <h2 style={headingStyle}>Delivery Boy Dashboard</h2>
        <div style={carouselContainerStyle}>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://static.vecteezy.com/system/resources/thumbnails/007/118/562/original/delivery-service-4k-animation-delivery-man-riding-a-scooter-on-urban-area-flat-animation-online-shopping-and-delivery-concept-looped-4k-man-on-cityscape-and-sun-background-free-video.jpg"
                alt="Delivery Service"
                style={carouselImageStyle}
              />
              <Carousel.Caption>
                <h3>Delivery Service</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://static.vecteezy.com/system/resources/previews/002/789/306/original/delivery-man-handover-product-illustration-concept-vector.jpg"
                alt="Delivery Man"
                style={carouselImageStyle}
              />
              <Carousel.Caption>
                <h3>Delivery Man</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://static.vecteezy.com/system/resources/previews/005/096/136/original/male-courier-holding-out-cardboard-delivery-package-and-credit-card-payment-illustration-free-download-free-vector.jpg"
                alt="Courier Holding Package"
                style={carouselImageStyle}
              />
              <Carousel.Caption>
                <h3>Courier Holding Package</h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>

        <div style={welcomeMessageStyle}>
          <p>Welcome Onboard, Amazing Delivery Hero!</p>
          <p>We're thrilled to have you as part of our team. Your dedication and hard work make a difference every day. Keep up the great work!</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
