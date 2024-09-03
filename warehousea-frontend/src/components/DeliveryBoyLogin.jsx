import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Adjust the path as needed

const DeliveryBoyLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/deliveryboy/login/', { username, password });
      console.log('Response data:', response.data); // Print the response data
    
      const { token, deliveryboy } = response.data;
    
      if (token && deliveryboy) {
        console.log(`Token: ${token}`); // Debug log
        console.log(`Username: ${username}`); // Debug log
    
        localStorage.setItem('token', token); // Save the token in localStorage
        login(token); // Call the login function from AuthContext
    
        navigate('/deliveryboy/dashboard'); // Navigate to the delivery boy dashboard
      } else {
        console.error('Login error: Token or is_delivery_boy missing'); // Error if token or is_delivery_boy are not present
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
    }
    
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Delivery Boy Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'url("https://i.pinimg.com/736x/1e/83/f4/1e83f4ed6caea6a580e1c623f90a2b2f.jpg") no-repeat center center fixed',
    backgroundSize: 'cover',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    fontSize: '14px',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default DeliveryBoyLogin;
