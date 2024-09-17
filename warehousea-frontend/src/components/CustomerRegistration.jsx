import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#25252b',
    }}>
      <div style={{
        position: 'relative',
        width: '750px',
        height: '450px',
        border: '2px solid #ff2770',
        boxShadow: '0 0 25px #ff2770',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute',
          width: '50%',
          height: '100%',
          right: '0',
          padding: '0 60px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            color: '#fff',
            marginBottom: '20px',
          }}>Customer Registration</h2>

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div style={{
              position: 'relative',
              marginBottom: '15px',
            }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
              <box-icon type='solid' name='user' style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                color: '#fff',
              }}></box-icon>
            </div>

            {/* Email Input */}
            <div style={{
              position: 'relative',
              marginBottom: '15px',
            }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
              <box-icon name='envelope' type='solid' style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                color: '#fff',
              }}></box-icon>
              {errors.email && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.email}</p>}
            </div>

            {/* PAN Card Input */}
            <div style={{
              position: 'relative',
              marginBottom: '15px',
            }}>
              <input
                type="text"
                placeholder="PAN Card"
                value={panCard}
                onChange={(e) => setPanCard(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
              <box-icon name='id-card' type='solid' style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                color: '#fff',
              }}></box-icon>
              {errors.panCard && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.panCard}</p>}
            </div>

            {errors.general && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{errors.general}</p>}
            {success && <p style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>{success}</p>}

            {/* Submit Button */}
            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#ff2770',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
            }}>
              {loading ? 'Submitting...' : 'Register'}
            </button>

            {/* Login Link */}
            <div style={{
              marginTop: '15px',
              textAlign: 'center',
              color: '#fff',
            }}>
              Already have an account? <Link to="/customer/login" style={{ color: '#ff2770', textDecoration: 'none' }}>Login here</Link>
            </div>
          </form>
        </div>

        {/* Welcome Section */}
        <div style={{
          position: 'absolute',
          width: '50%',
          height: '100%',
          left: '0',
          padding: '40px',
          backgroundColor: '#25252b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '20px',
            color: '#fff',
          }}>WELCOME!</h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#fff',
          }}>
            We're delighted to have you here. If you need any assistance, feel free to reach out.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;
