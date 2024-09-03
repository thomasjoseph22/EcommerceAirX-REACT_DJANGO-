import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeliveryBoyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    pan_card: '',
    old_password: '',
    new_password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/deliveryboy/login');
          return;
        }
        const response = await axios.get('http://localhost:8000/api/accounts/deliveryboy/profile/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfile(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          pan_card: response.data.pan_card,
          old_password: '',
          new_password: '',
        });
      } catch (error) {
        console.error('There was an error fetching the profile!', error);
        if (error.response?.status === 401) {
          navigate('/deliveryboy/login');
        } else {
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/deliveryboy/login');
        return;
      }

      await axios.put('http://localhost:8000/api/accounts/deliveryboy/profile/', formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setProfile({
        ...profile,
        ...formData,
      });
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('There was an error updating the profile!', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Delivery Boy Profile</h2>
      {!isEditing ? (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>PAN Card:</strong> {profile.pan_card}</p>
          
          <button style={styles.button} onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          <button style={styles.button} onClick={() => navigate('/deliveryboy/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>PAN Card:</label>
            <input
              type="text"
              name="pan_card"
              value={formData.pan_card}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Old Password:</label>
            <input
              type="password"
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password:</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Save Changes</button>
          <button type="button" style={styles.button} onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    marginBottom: '20px',
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
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    marginRight: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
};

export default DeliveryBoyProfile;
