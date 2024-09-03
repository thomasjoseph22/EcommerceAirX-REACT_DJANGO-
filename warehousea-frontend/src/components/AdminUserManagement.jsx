import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAdminUser = localStorage.getItem('isAdmin') === 'true';

        if (!token || !isAdminUser) {
            navigate('/login');  // Redirect to login if not authenticated or not admin
            return;
        }

        axios.get('http://localhost:8000/api/accounts/admin/users/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            setUsers(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the user data!", error);
            navigate('/login');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [navigate]);

    const toggleUserStatus = (id, isActive) => {
        const token = localStorage.getItem('token');

        axios.put(`http://localhost:8000/api/accounts/admin/users/${id}/`, { is_active: !isActive }, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id ? { ...user, is_active: response.data.is_active } : user
                )
            );
        })
        .catch(error => {
            console.error("There was an error updating the user status!", error);
        });
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Admin User-Delivery_Boy Management</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Username</th>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>PAN Card</th>
                        <th style={styles.tableHeader}>Active</th>
                        <th style={styles.tableHeader}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={styles.tableRow}>
                            <td style={styles.tableCell}>{user.username}</td>
                            <td style={styles.tableCell}>{user.email}</td>
                            <td style={styles.tableCell}>{user.pan_card}</td>
                            <td style={styles.tableCell}>{user.is_active ? 'Yes' : 'No'}</td>
                            <td style={styles.tableCell}>
                                <button
                                    onClick={() => toggleUserStatus(user.id, user.is_active)}
                                    style={user.is_active ? styles.buttonBlock : styles.buttonUnblock}
                                >
                                    {user.is_active ? 'Block' : 'Unblock'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundImage: 'url(https://toliss.com/cdn/shop/files/a321_NEO_10_791fa011-450d-4272-9ce2-83c200cf4cd5.jpg?v=1705858108&width=1500)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', // Ensure the container fills the viewport height
    },
    title: {
        marginBottom: '20px',
        fontSize: '24px',
        textAlign: 'center',
        color: '#fff',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black with transparency
        color: '#fff',
    },
    tableHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker black with transparency
        padding: '10px',
        textAlign: 'left',
        fontSize: '16px',
    },
    tableRow: {
        borderBottom: '1px solid #555',
    },
    tableCell: {
        padding: '10px',
        fontSize: '14px',
    },
    buttonBlock: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    buttonUnblock: {
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#007BFF',
        marginTop: '20px',
    },
};

export default AdminUserManagement;
