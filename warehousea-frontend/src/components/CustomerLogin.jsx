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
  const pr = window.location.protocol
    const host = window.location.host
     
  const route = `${pr}//${host}/`
  console.log(route)

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
      console.log(response)

      if (response) {
        localStorage.setItem('token', response.data.token);
        // localStorage.setItem('user_id', user_id);
        // login(token);
        if (response.data.admin===true && response.data.deliveryboy==false){
          window.location.href=`${route}admin/dashboard/`
        }
        else if(response.data.admin==false && response.data.deliveryboy==true){
          window.location.href=`${route}deliveryboy/dashboard/`
        }
          
        else{
            window.location.href=`${route}customer/dashboard/`
          }
       
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Set the alert when wrong credentials are provided
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

  // Function to close the alert popup
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#25252b',
      fontFamily: 'Poppins, sans-serif',
    }}>
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
        alertStyles={{
          backgroundColor: '#ff5f6d', 
          color: '#fff', 
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}
        headerStyles={{
          fontSize: '20px',
          fontWeight: 'bold',
        }}
        textStyles={{
          fontSize: '16px',
          margin: '10px 0'
        }}
        buttonStyles={{
          backgroundColor: '#ff2770', 
          color: '#fff', 
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      />

      <div style={{
        position: 'relative',
        width: '750px',
        height: '450px',
        border: '2px solid #ff2770',
        boxShadow: '0 0 25px #ff2770',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '50%',
          height: '100%',
          padding: '0 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{
            fontSize: '32px',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#fff',
          }}>Login</h2>
          <form onSubmit={handleSubmit} style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              marginBottom: '25px',
            }}>
              <input
                type="text"
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={{
                  width: '100%',
                  height: '50px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid #fff',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  paddingRight: '23px',
                }}
              />
              <label className={username ? 'focused' : ''} style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#fff',
                transition: '0.5s',
              }}></label>
            </div>
            <div style={{
              position: 'relative',
              width: '100%',
              marginBottom: '25px',
            }}>
              <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={{
                  width: '100%',
                  height: '50px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid #fff',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  paddingRight: '23px',
                }}
              />
              <label className={password ? 'focused' : ''} style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#fff',
                transition: '0.5s',
              }}></label>
            </div>
            {error && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</p>}
            <button type="submit" style={{
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
            }}>
              Login
            </button>
          </form>
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            color: '#fff',
          }}>
            Don't have an account?{' '}
            <button
              onClick={handleSignUpClick}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff2770',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '50%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 60px',
        }}>
          <h2 style={{
            fontSize: '32px',
            textAlign: 'center',
            color: '#fff',
            marginBottom: '20px',
          }}>WELCOME BACK!</h2>
          <p style={{
            fontSize: '16px',
            textAlign: 'center',
            color: '#fff',
          }}>We are happy to have you with us again. If you need anything, we are here to help.</p>
          <p><a href="/deliveryboy/register" style={{fontWeight:"bold",color:"#FFD700",marginLeft:"100px",textDecoration:"none"}}>Delivery Boy</a></p>
          <p><a href="/admin/login" style={{fontWeight:"bold",color:"#FD701",marginLeft:"100px",textDecoration:"none"}}>Admin Login</a></p>

        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
