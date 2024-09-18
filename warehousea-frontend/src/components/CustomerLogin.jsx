import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Adjust the path as needed
import Alert from 'react-popup-alert'; // Importing the Alert component

function CustomerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const pr = window.location.protocol;
  const host = window.location.host;
  const route = `${pr}//${host}/`;

  // State for controlling the popup alert
  const [alert, setAlert] = useState({
    type: 'error',
    text: '',
    show: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', { username, password });
      const { token, deliveryboy, admin } = response.data;

      if (response) {
        localStorage.setItem('token', response.data.token);

        if (response.data.admin === true && response.data.deliveryboy === false) {
          window.location.href = `${route}admin/dashboard/`;
        } else if (response.data.admin === false && response.data.deliveryboy === true) {
          window.location.href = `${route}deliveryboy/dashboard/`;
        } else {
          window.location.href = `${route}customer/dashboard/`;
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setAlert({
          type: 'error',
          text: 'Wrong credentials. Please try again.',
          show: true
        });
      } else {
        setAlert({
          type: 'error',
          text: 'An error occurred. Please try again.',
          show: true
        });
      }
    }
  };

  const onCloseAlert = () => {
    setAlert({
      type: '',
      text: '',
      show: false
    });
  };

  const handleFocus = (e) => {
    const label = e.target.nextElementSibling;
    label.classList.add('focused');
  };

  const handleBlur = (e) => {
    if (e.target.value === '') {
      const label = e.target.nextElementSibling;
      label.classList.remove('focused');
    }
  };

  const handleSignUpClick = () => {
    navigate('/customer/register');
  };

  return (
    <div style={containerStyles}>
      {/* Alert Popup */}
      <Alert
        header={'Error'}
        btnText={'Close'}
        text={alert.text}
        type={alert.type}
        show={alert.show}
        onClosePress={onCloseAlert}
        pressCloseOnOutsideClick={true}
        showBorderBottom={true}
        alertStyles={alertStyles}
        headerStyles={{ fontSize: '20px', fontWeight: 'bold' }}
        textStyles={{ fontSize: '16px', margin: '10px 0' }}
        buttonStyles={buttonStyles}
      />

      <div style={boxStyles}>
        <div style={loginSectionStyles}>
          <h2 style={headingStyles}>Login</h2>
          <form onSubmit={handleSubmit} style={formStyles}>
            <div style={inputContainerStyles}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={inputStyles}
              />
            </div>
            <div style={inputContainerStyles}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={inputStyles}
              />
            </div>
            {error && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</p>}
            <button type="submit" style={submitButtonStyles}>Login</button>
          </form>
          <div style={signUpStyles}>
            Don't have an account?{' '}
            <button onClick={handleSignUpClick} style={signUpButtonStyles}>Sign Up</button>
          </div>
        </div>

        <div style={welcomeSectionStyles}>
          <h2 style={headingStyles}>WELCOME BACK!</h2>
          <p style={welcomeTextStyles}>We are happy to have you with us again. If you need anything, we are here to help.</p>
          <p><a href="/deliveryboy/register" style={linkStyles}>Delivery Boy</a></p>
          <p><a href="/admin/login" style={linkStyles}>Admin Login</a></p>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#25252b',
  fontFamily: 'Poppins, sans-serif',
  padding: '20px',
  boxSizing: 'border-box',
};

const boxStyles = {
  position: 'relative',
  width: '750px',
  height: '450px',
  border: '2px solid #ff2770',
  boxShadow: '0 0 25px #ff2770',
  overflow: 'hidden',
  display: 'flex',
  flexWrap: 'wrap', // Make the box flexible for smaller screens
  justifyContent: 'center',
  alignItems: 'center',
};

const loginSectionStyles = {
  width: '100%',
  maxWidth: '50%', // Adjust width for smaller screens
  height: '100%',
  padding: '20px 40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const welcomeSectionStyles = {
  width: '100%',
  maxWidth: '50%', // Adjust width for smaller screens
  height: '100%',
  padding: '20px 60px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  background: '#ff2770', // Different background for the right section
};

const headingStyles = {
  fontSize: '32px',
  textAlign: 'center',
  marginBottom: '20px',
  color: '#fff',
};

const inputContainerStyles = {
  position: 'relative',
  width: '100%',
  marginBottom: '25px',
};

const inputStyles = {
  width: '100%',
  height: '50px',
  background: 'transparent',
  border: 'none',
  borderBottom: '2px solid #fff',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  paddingRight: '23px',
};

const formStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const submitButtonStyles = {
  width: '100%',
  height: '45px',
  background: 'transparent',
  borderRadius: '40px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  color: '#fff',
  border: '2px solid #ff2770',
  transition: '0.5s',
};

const signUpStyles = {
  marginTop: '20px',
  textAlign: 'center',
  color: '#fff',
};

const signUpButtonStyles = {
  background: 'none',
  border: 'none',
  color: '#ff2770',
  cursor: 'pointer',
  textDecoration: 'underline',
};

const welcomeTextStyles = {
  fontSize: '16px',
  textAlign: 'center',
  color: '#fff',
};

const linkStyles = {
  fontWeight: 'bold',
  color: 'white',
  textDecoration: 'none',
  textAlign: 'center',
  margintop: '120px',
};

const alertStyles = {
  backgroundColor: '#ff5f6d',
  color: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
  textAlign: 'center',
};

const buttonStyles = {
  backgroundColor: '#ff2770',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default CustomerLogin;
