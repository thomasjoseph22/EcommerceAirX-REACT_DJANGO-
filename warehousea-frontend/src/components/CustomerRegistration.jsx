import React, { useState } from 'react';
import axios from 'axios';

function CustomerRegister() {
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
      await axios.post('http://localhost:8000/api/accounts/customer/register/', {
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

  return (
    <div style={{
      backgroundImage: 'url(https://th.bing.com/th/id/R.2e505f767e171f45b4dabe2d3fde5c65?rik=2MBE6fcXTrILNw&pid=ImgRaw&r=0)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '30px',
        borderRadius: '10px',
        color: '#fff',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
        textAlign: 'left',
      }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'left' }}>Customer Registration</h2>

        {/* Image added here */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img
            src="https://i.pinimg.com/736x/a4/fb/1b/a4fb1be5fcf9b3cb7f7dd01f45f38edc.jpg"
            alt="Customer"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '2px solid #fff',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="panCard" style={{ display: 'block', marginBottom: '5px' }}>PAN Card:</label>
          <input
            id="panCard"
            type="text"
            value={panCard}
            onChange={(e) => setPanCard(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}
          />
          {errors.panCard && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.panCard}</p>}
        </div>

        {errors.general && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{errors.general}</p>}
        {success && <p style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>{success}</p>}

        <button type="submit" disabled={loading} style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
        }}>
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default CustomerRegister;
