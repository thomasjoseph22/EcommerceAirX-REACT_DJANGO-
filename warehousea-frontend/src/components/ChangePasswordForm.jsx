import React, { useState } from 'react';
import axios from 'axios';

const ChangePasswordForm = ({ onCancel }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    axios.put('http://localhost:8000/api/accounts/deliveryboy/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    }, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      alert('Password changed successfully!');
      window.location.reload();
    })
    .catch(error => {
      console.error('There was an error changing the password!', error);
      setError('Error changing password.');
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Change Password</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.button}>Change Password</button>
          <button type="button" onClick={onCancel} style={styles.button}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

// Add styles for the form
const styles = {
  container: {
    padding: '20px',
    backgroundImage: 'url(https://airproductionservice.com/wp-content/uploads/2021/05/Login.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
  }
};

export default ChangePasswordForm;
