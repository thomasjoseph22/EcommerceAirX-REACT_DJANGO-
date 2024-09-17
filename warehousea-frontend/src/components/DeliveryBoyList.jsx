import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar'; // Importing the AdminNavbar

const DeliveryBoyList = () => {
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeliveryBoys = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from localStorage
                const response = await axios.get('http://localhost:8000/api/accounts/api/deliveryboys/', {
                    headers: {
                        'Authorization': `Token ${token}`, // Include token in Authorization header
                    }
                });
                setDeliveryBoys(response.data);
            } catch (err) {
                console.error('Error fetching delivery boys:', err); // Log error details
                setError('Failed to fetch delivery boys');
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryBoys();
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) return <p>Loading...</p>; // Show loading state
    if (error) return <p>{error}</p>; // Show error message

    const containerStyle = {
        position: 'relative',
        padding: '20px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #25252b, #1b1b1f)', // Stylish background
        color: '#fff',
    };

    const tableContainerStyle = {
        width: '100%',
        overflowX: 'auto',
        background: '#333',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Adding shadow
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        borderRadius: '8px',
        overflow: 'hidden', // For rounded corners in table
    };

    const thStyle = {
        backgroundColor: '#ff2770',
        color: '#fff',
        padding: '10px',
        textAlign: 'left',
        fontWeight: 'bold',
    };

    const tdStyle = {
        backgroundColor: '#444',
        color: '#fff',
        padding: '12px',
        borderBottom: '1px solid #555',
    };

    const trStyle = {
        ':hover': {
            backgroundColor: '#555', // Highlight on hover
        },
    };

    return (
        <div style={containerStyle}>
            <AdminNavbar /> {/* Adding AdminNavbar */}
            <h1 style={{ textAlign: 'center', padding: '20px' }}>Delivery Boys</h1>
            
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Username</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>PAN Card</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryBoys.map(d => (
                            <tr key={d.id} style={trStyle}>
                                <td style={tdStyle}>{d.username}</td>
                                <td style={tdStyle}>{d.email}</td>
                                <td style={tdStyle}>{d.pan_card}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeliveryBoyList;
