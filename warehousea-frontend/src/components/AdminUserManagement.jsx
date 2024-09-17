import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin');

        if (!token || isAdmin !== 'true') {
            setAuthError(true);
            setLoading(false);
            return;
        }

        axios.get('http://localhost:8000/api/accounts/admin/users/', {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(response => {
            setUsers(response.data);
            setAuthError(false);
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                setAuthError(true);
                localStorage.removeItem('token');
                localStorage.removeItem('isAdmin');
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }, [navigate]);

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (authError) {
        return (
            <div style={styles.errorContainer}>
                <h2 style={styles.title}>Access Denied</h2>
                <p style={styles.text}>You need to log in as an admin to access this page.</p>
                <button 
                    onClick={() => navigate('/login')} 
                    style={styles.button}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    const toggleUserStatus = (id, currentStatus) => {
        const token = localStorage.getItem('token');
        const newStatus = !currentStatus;

        axios.put(`http://localhost:8000/api/accounts/admin/users/${id}/`, { is_active: newStatus }, {
            headers: {
                Authorization: `Token ${token}`
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
            console.error("Error updating user status", error);
        });
    };

    return (
        <div style={styles.pageContainer}>
            <AdminNavbar/>
            <div style={styles.contentContainer}>
                <h2 style={styles.title}>Admin User Management</h2>
                <div style={styles.tableContainer}> {/* Add scrollable container */}
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
                            {users.length > 0 ? users.map(user => (
                                <tr key={user.id} style={styles.tableRow}>
                                    <td style={styles.tableCell}>{user.username || 'N/A'}</td>
                                    <td style={styles.tableCell}>{user.email || 'N/A'}</td>
                                    <td style={styles.tableCell}>{user.pan_card || 'N/A'}</td>
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
                            )) : (
                                <tr>
                                    <td colSpan="5" style={styles.tableCell}>No users available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#000',
        padding: '0 15px',
        boxSizing: 'border-box',
    },
    contentContainer: {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto', // Allow content to adapt
    },
    title: {
        fontSize: '30px',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#fff',
    },
    tableContainer: {
        width: '100%',
        overflowX: 'auto', // Add horizontal scroll
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    tableHeader: {
        padding: '15px',
        backgroundColor: '#333',
        textAlign: 'left',
        fontWeight: '500',
        fontSize: '16px',
        color: '#fff',
        borderBottom: '2px solid #444',
    },
    tableRow: {
        borderBottom: '1px solid #555',
    },
    tableCell: {
        padding: '15px',
        fontSize: '14px',
        color: '#fff',
    },
    buttonBlock: {
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    buttonUnblock: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#fff',
        marginTop: '20px',
    },
    errorContainer: {
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#222',
        color: '#fff',
        borderRadius: '10px',
        marginTop: '20px',
    },
    text: {
        fontSize: '16px',
    },
    button: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default AdminUserManagement;
