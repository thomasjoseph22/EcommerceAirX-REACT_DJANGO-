import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            navigate('/admin/dashboard');
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

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#25252b',
            fontFamily: 'Poppins, sans-serif',
        }}>
            <div style={{
                position: 'relative',
                width: '750px',
                height: '450px',
                border: '2px solid #007bff', // Changed to blue
                boxShadow: '0 0 25px #007bff', // Changed to blue
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
                    }}>Admin Login</h2>
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
                                name="username"
                                placeholder='Username'
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                value={formData.username}
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
                            <label className={formData.username ? 'focused' : ''} style={{
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
                                name="password"
                                placeholder='Password'
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                value={formData.password}
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
                            <label className={formData.password ? 'focused' : ''} style={{
                                position: 'absolute',
                                top: '50%',
                                left: '0',
                                transform: 'translateY(-50%)',
                                fontSize: '16px',
                                color: '#fff',
                                transition: '0.5s',
                            }}></label>
                        </div>
                        {errors.username && <p style={{ color: 'red', fontSize: '14px' }}>{errors.username}</p>}
                        {errors.password && <p style={{ color: 'red', fontSize: '14px' }}>{errors.password}</p>}
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
                            border: '2px solid #007bff', // Changed to blue
                            transition: '0.5s',
                        }}>
                            Login
                        </button>
                    </form>
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
                    }}>Manage your warehouse efficiently from here.</p>
                    <p><a href="/customer/login" style={{fontWeight:"bold",color:"#007bff",marginLeft:"100px",textDecoration:"none"}}>Customer</a></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
