import React, { useState } from 'react';
import axios from 'axios';

const EditProfileForm = ({ profile, onCancel }) => {
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [panCard, setPanCard] = useState(profile.pan_card);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put('http://localhost:8000/api/accounts/deliveryboy/profile/', {
      username,
      email,
      pan_card: panCard,
    }, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      alert('Profile updated successfully!');
      window.location.reload();
    })
    .catch(error => {
      console.error('There was an error updating the profile!', error);
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>PAN Card:</label>
          <input
            type="text"
            value={panCard}
            onChange={(e) => setPanCard(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Save</button>
        <button type="button" onClick={onCancel} style={styles.button}>Cancel</button>
      </form>
    </div>
  );
};

// Add styles for the form
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
  },
  button: {
    display: 'block',
    margin: '10px auto',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default EditProfileForm;
