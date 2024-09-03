import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Welcome to Our Platform</h1>
        <div style={styles.buttonContainer}>
          <Link to="/admin/login" style={styles.button}>Admin Login</Link>
          <Link to="/customer/login" style={styles.button}>Customer Login</Link>
          <Link to="/deliveryboy/login" style={styles.button}>Delivery Boy Login</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundImage: 'url(https://airportal.hu/wp-content/uploads/2017/11/airbus-a350-1000-in-flight.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    color: '#fff',
    marginBottom: '20px',
    fontSize: '24px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: '#007bff',
    marginBottom: '10px',
    textAlign: 'center',
  },
};

export default Home;
