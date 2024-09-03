import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        return errors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/accounts/admin/login/', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin/products');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError('Incorrect username or password.');
                } else {
                    setError('An unexpected error occurred.');
                }
            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundImage: 'url("https://thumbs.dreamstime.com/b/admin-reliure-de-bureau-sur-le-bureau-en-bois-sur-la-table-crayon-color%C3%A9-79046621.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '20px',
            }}
        >
            <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '20px' }}>Admin Login</h2>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '300px', // Decrease the form width
                    padding: '40px', // Increase padding to add more height
                    minHeight: '400px', // Set a minimum height
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '8px',
                }}
            >
                <img
                    src="https://static.vecteezy.com/system/resources/previews/015/665/684/original/man-with-the-inscription-admin-icon-outline-style-vector.jpg"
                    alt="Admin Icon"
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        marginBottom: '20px',
                    }}
                />
                <div style={{ marginBottom: '15px', width: '100%' }}>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Username"
                        value={formData.username}
                        style={{
                            width: '90%', 
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            margin: '0 auto', 
                            display: 'block',
                        }}
                    />
                    {errors.username && (
                        <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                            {errors.username}
                        </p>
                    )}
                </div>
                <div style={{ marginBottom: '15px', width: '100%' }}>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        value={formData.password}
                        style={{
                            width: '90%', 
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            margin: '0 auto', 
                            display: 'block',
                        }}
                    />
                    {errors.password && (
                        <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                            {errors.password}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        borderRadius: '4px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        cursor: 'pointer',
                        border: 'none',
                        width: '90%', 
                    }}
                >
                    Login
                </button>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ color: '#fff' }}>
                        No account? <Link to="/admin/register" style={{ color: '#007bff' }}>Register here</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
