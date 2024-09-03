import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Adjust the path as needed

function CustomerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/customer/login/', { username, password });
      const { token, user_id, is_customer } = response.data;

      if (token && is_customer) {
        console.log(`Token: ${token}`); // Debug log
        console.log(`Username: ${username}`); // Debug log
        console.log(`User ID: ${user_id}`); // Debug log

        localStorage.setItem('token', token); // Save the token in localStorage
        localStorage.setItem('user_id', user_id); // Save the user ID in localStorage
        login(token, user_id); // Log the user in
        navigate('/customer/dashboard'); // Redirect to the customer dashboard
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      setError(error.response ? error.response.data.error : 'An error occurred. Please try again.');
    }
  };

  return (
    <div style={{
      backgroundImage: 'url(https://cdn.prod.website-files.com/63f6e52346a353ca1752970e/6440bf23efa14f0024ca6748_study-cover-qantas.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '10px',
        color: '#fff',
        width: '300px',
        textAlign: 'center',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      }}>
        <h2 style={{ marginBottom: '20px' }}>Customer Login</h2>
        <img
          src="https://i.pinimg.com/originals/bd/a5/fc/bda5fcf66fb5020d74b79ad891600a09.png"
          alt="Login Icon"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            margin: '20px 0'
          }}
        />
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {error && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</p>}
        <button type="submit" style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
        }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default CustomerLogin;
