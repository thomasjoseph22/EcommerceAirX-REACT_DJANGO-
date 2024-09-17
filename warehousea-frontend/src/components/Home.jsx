import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.pageContainer}>
      {/* Parallax Section 1 */}
      <div style={{ ...styles.parallaxSection, ...styles.firstSection }}>
        <h1 style={styles.title}>Welcome To AIR-X</h1>
        <h2 style={styles.subtitle}>developed by Thomas</h2>
      </div>

      {/* Parallax Section 2 */}
      <div style={{ ...styles.parallaxSection, ...styles.secondSection }}>
        <h1 style={styles.title}>Welcome Back, Customer!</h1>
        <div style={styles.buttonContainer}>
          <Link to="/customer/login" style={{color:"whit"}}>Customer Login</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    margin: '0',
    padding: '0',
    fontFamily: 'Poppins, sans-serif',
    overflowX: 'hidden',
  },
  parallaxSection: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '3px',
  },
  firstSection: {
    backgroundImage: `url('https://images.unsplash.com/flagged/photo-1575143837079-efa006aa9a02')`,
  },
  secondSection: {
    backgroundImage: `url('https://images.unsplash.com/photo-1528877720315-1d05b40cd826')`,
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    opacity: '0.8',
  },
  subtitle: {
    fontSize: '1.5rem',
    opacity: '0.7',
  },
  buttonContainer: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    padding: '12px 20px',
    borderRadius: '25px',
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: '#007bff',
    textAlign: 'center',
    fontSize: '18px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  },
};

export default Home;
