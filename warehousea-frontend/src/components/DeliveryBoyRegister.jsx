import React, { useState } from 'react';
import axios from 'axios';

function DeliveryBoyRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [panCard, setPanCard] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panCardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!panCardRegex.test(panCard)) {
      newErrors.panCard = 'Invalid PAN card format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/deliveryboy/register/', {
        username,
        email,
        pan_card: panCard,
      });
      setSuccess('Registration successful. Please check your email for your password.');
      setUsername('');
      setEmail('');
      setPanCard('');
      setErrors({});
    } catch (error) {
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 'Email already registered or other error';
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Inline styles based on the DeliveryBoyLogin component
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
    height: '600px',
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
    padding: '0 40px 60px 150px',
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

  const successStyle = {
    color: 'green',
    marginTop: '10px',
  };

  const pStyle = {
    fontSize: '16px',
    color: '#fff',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Registration Form */}
        <div style={formBoxStyle}>
          <h2 style={h2Style}>Register</h2>
          <form onSubmit={handleSubmit}>
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderBottom = inputFocusStyle.borderBottom)}
                onBlur={(e) => (e.target.style.borderBottom = inputStyle.borderBottom)}
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>
            <div>
              <input
                type="text"
                value={panCard}
                onChange={(e) => setPanCard(e.target.value)}
                required
                placeholder="PAN Card"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderBottom = inputFocusStyle.borderBottom)}
                onBlur={(e) => (e.target.style.borderBottom = inputStyle.borderBottom)}
              />
              {errors.panCard && <p style={errorStyle}>{errors.panCard}</p>}
            </div>
            <button type="submit" style={buttonStyle}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            {errors.general && <p style={errorStyle}>{errors.general}</p>}
            {success && <p style={successStyle}>{success}</p>}
          </form>
        </div>

        {/* Welcome Section */}
        <div style={infoContentStyle}>
          <h2 style={h2Style}>WELCOME!</h2>
          <p style={pStyle}>Join us to begin your journey as a delivery agent and explore new opportunities!</p>
          <p style={{ color: '#FFD700' }}>Already a member? <a href="/customer/login" style={{ color: '#FFD700' }}>Login here</a></p>
        </div>
      </div>
    </div>
  );
}

export default DeliveryBoyRegister;
