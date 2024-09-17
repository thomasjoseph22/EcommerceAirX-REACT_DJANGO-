import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const DeliveryBoyLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/deliveryboy/login/', { username, password });
      const { token } = response.data;
  
      if (token) {
        // Store the token in localStorage
        localStorage.setItem('token', token);
        navigate('/deliveryboy/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  

  // Inline Styles
  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1c1c1c',
  };

  const containerStyle = {
    position: 'relative',
    width: '750px',
    height: '450px',
    border: '2px solid #FFD700', // Yellow border
    boxShadow: '0 0 25px #FFD700', // Yellow shadow
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: '#25252b', // Dark background for the form
  };

  const formBoxStyle = {
    position: 'absolute',
    top: '0',
    width: '50%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 40px',
  };

  const infoContentStyle = {
    position: 'absolute',
    top: '0',
    height: '100%',
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 60px 20px 150px',
    right: '0',
    textAlign: 'right',
    color: '#fff',
  };

  const h2Style = {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#fff',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    borderBottom: '2px solid #fff',
    background: 'transparent',
    color: '#fff',
    fontSize: '16px',
    marginBottom: '20px',
  };

  const inputFocusStyle = {
    borderBottom: '2px solid #FFD700', // Yellow underline on focus
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#FFD700', // Yellow button
    color: '#000',
    fontWeight: '600',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
  };

  const errorStyle = {
    color: 'red',
    marginTop: '10px',
  };

  const pStyle = {
    fontSize: '16px',
    color: '#fff',
  };

  const linkStyle = {
    color: '#FFD700', // Yellow link color
    textDecoration: 'none',
    marginTop: '10px',
    display: 'block',
    textAlign: 'center',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Login Form */}
        <div style={formBoxStyle}>
          <h2 style={h2Style}>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderBottom = inputFocusStyle.borderBottom)}
                onBlur={(e) => (e.target.style.borderBottom = inputStyle.borderBottom)}
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderBottom = inputFocusStyle.borderBottom)}
                onBlur={(e) => (e.target.style.borderBottom = inputStyle.borderBottom)}
              />
            </div>
            <button type="submit" style={buttonStyle}>
              Login
            </button>
            {error && <p style={errorStyle}>{error}</p>}

            {/* Link to Delivery Boy Registration */}
            <Link to="/deliveryboy/register" style={linkStyle}>
              New member? Register
            </Link>
          </form>
        </div>

        {/* Welcome Back Section */}
        <div style={infoContentStyle}>
          <h2 style={h2Style}>WELCOME BACK!</h2>
          <p style={pStyle}>We are happy to have you with us again. If you need anything, we are here to help.</p>
          <p><a href="/admin/login" style={{fontWeight:"bold",color:"#FFD700",marginLeft:"100px",textDecoration:"none"}}>Admin</a></p>
          <p><a href="/customer/login" style={{fontWeight:"bold",color:"#FFD700",marginLeft:"100px",textDecoration:"none"}}>Customer</a></p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyLogin;
