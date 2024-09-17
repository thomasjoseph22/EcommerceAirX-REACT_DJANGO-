import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommonNavbar from './CommonNavbar';
import Footer from './Footer';

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    old_password: '',
    new_password: '',
    pan_card: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/customer/login');
          return;
        }
        const response = await axios.get('http://localhost:8000/api/accounts/customer/profile/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfile(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          old_password: '',
          new_password: '',
          pan_card: response.data.pan_card,
        });
      } catch (error) {
        console.error('There was an error fetching the profile!', error);
        if (error.response?.status === 401) {
          navigate('/customer/login');
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
        navigate('/customer/login');
        return;
      }

      await axios.put('http://localhost:8000/api/accounts/customer/profile/', formData, {
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
    return <p style={styles.loading}>Loading profile...</p>;
  }

  if (!profile) {
    return <p style={styles.loading}>Profile not found.</p>;
  }

  return (
    <div style={styles.container}>
      <CommonNavbar />
      <div style={styles.curvedShape}></div>
      <div style={styles.curvedShape2}></div>
      <h2 style={styles.title}>Customer Profile</h2>
      <div style={styles.imageContainer}>
        <img
          src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
          alt="Profile"
          style={styles.image}
        />
      </div>
      <div style={styles.content}>
        {!isEditing ? (
          <div style={styles.profileInfo}>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>PAN Card:</strong> {profile.pan_card}</p>
            <button style={styles.button} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
            <button style={styles.button} onClick={() => navigate('/customer/dashboard')}>
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
            <button type="submit" style={styles.button}>
              Save Changes
            </button>
            <button type="button" onClick={() => setIsEditing(false)} style={styles.button}>
              Cancel
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    border: '2px solid #ff2770',
    boxShadow: '0 0 25px #ff2770',
    overflow: 'hidden', // Prevent scrolling
    backgroundColor: '#25252b',
    borderRadius: '10px',
    padding: '20px',
    boxSizing: 'border-box', // Ensure padding is included in total height/width
  },
  curvedShape: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '150px',
    height: '150px',
    background: '#ff2770',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  },
  curvedShape2: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '150px',
    height: '150px',
    background: '#ff2770',
    borderRadius: '50%',
    transform: 'translate(50%, 50%)',
  },
  title: {
    fontSize: '32px',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '20px',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ff2770',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    overflow: 'hidden', // Prevent scrolling within content
  },
  profileInfo: {
    color: '#fff',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
  },
  formGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  label: {
    fontSize: '18px',
    color: '#fff',
    marginBottom: '10px',
    display: 'block',
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '2px solid #fff',
    width: '100%',
    backgroundColor: 'transparent',
    color: '#fff',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#ff2770',
    color: '#fff',
    cursor: 'pointer',
    margin: '5px',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
  },
};

export default CustomerProfile;
