import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AdminRegister = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await axios.post('http://localhost:8000/api/accounts/admin/register/', formData);
            setSuccessMessage('Admin Registration Successful');
        } catch (error) {
            setErrorMessage('There was an error registering the admin.');
            console.error('Registration error:', error);
        }
    };

    const pageStyle = {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url("https://png.pngtree.com/background/20210709/original/pngtree-2-5d-high-building-gold-online-picture-image_928681.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: 0,
    };

    const containerStyle = {
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        boxSizing: 'border-box',
    };

    const headingStyle = {
        marginBottom: '20px',
        color: '#333',
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
    };

    const buttonStyle = {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
    };

    const successMessageStyle = {
        color: 'green',
        margin: '10px 0',
    };

    const errorMessageStyle = {
        color: 'red',
        margin: '10px 0',
    };

    const loginLinkStyle = {
        marginTop: '15px',
        display: 'block',
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '14px',
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <h2 style={headingStyle}>Admin Register</h2>
                {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
                {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
                <form onSubmit={handleSubmit} style={formStyle}>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Username"
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        style={inputStyle}
                    />
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>Register</button>
                </form>
                <Link to="/admin/login" style={loginLinkStyle}>
                    Already have an account? Log in here.
                </Link>
            </div>
        </div>
    );
};

export default AdminRegister;
