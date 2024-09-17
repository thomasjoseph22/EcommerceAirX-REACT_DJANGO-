import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User is not authenticated');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/orders/orders/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (err) {
                setError(`Failed to fetch orders: ${err.message}`);
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusStyle = (isDelivered, isReceived) => {
        if (isDelivered && isReceived) {
            return { color: 'green' };
        }
        return { color: 'yellow' };
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <AdminNavbar />
            <h1 style={styles.title}>My Orders</h1>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHead}>
                        <tr>
                            <th>Order ID</th>
                            <th>Address</th>
                            <th>Delivery Method</th>
                            <th>Created At</th>
                            <th>Arrival Date</th>
                            <th>Delivery Location</th>
                            <th>Items</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.id} style={styles.tableRow}>
                                    <td style={styles.tableCell}>{order.id}</td>
                                    <td style={styles.tableCell}>{order.address}</td>
                                    <td style={styles.tableCell}>{order.delivery_method}</td>
                                    <td style={styles.tableCell}>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td style={styles.tableCell}>{new Date(order.arrival_date).toLocaleDateString()}</td>
                                    <td style={styles.tableCell}>{order.delivery_location || 'N/A'}</td>
                                    <td style={styles.tableCell}>
                                        <ul style={styles.list}>
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map(item => (
                                                    <li key={item.product_name}>
                                                        {item.product_name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No items found.</li>
                                            )}
                                        </ul>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={getStatusStyle(order.is_delivered, order.is_received)}>
                                            {order.is_delivered && order.is_received ? 'Received' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: "'Open Sans', sans-serif",
        backgroundImage: 'linear-gradient(to right, black, #ff2770)', // Black and red gradient background
        minHeight: '100vh',
    },
    title: {
        marginBottom: '20px',
        color: '#fff',
        fontSize: '36px',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
    },
    tableContainer: {
        overflowX: 'auto',
        marginTop: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#333', // Dark table background
        color: '#fff', // White text for table
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    tableHead: {
        backgroundColor: '#444', // Darker header background
        color: '#fff',
        textAlign: 'left',
    },
    tableRow: {
        borderBottom: '1px solid #666', // Light gray for row borders
        transition: 'background-color 0.3s ease',
    },
    tableCell: {
        padding: '15px',
        fontSize: '16px',
    },
    list: {
        padding: '0',
        margin: '0',
        listStyleType: 'none',
    },
    loading: {
        color: '#fff',
        fontSize: '24px',
        textAlign: 'center',
        marginTop: '50px',
    },
    error: {
        color: 'red',
        fontSize: '20px',
        textAlign: 'center',
        marginTop: '20px',
    },
};

export default OrdersPage;
