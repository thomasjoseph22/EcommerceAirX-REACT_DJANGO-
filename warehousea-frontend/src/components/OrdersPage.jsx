import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
                console.log('Orders fetched:', response.data); // Log orders to check data
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>My Orders</h1>
            <table style={styles.table}>
                <thead style={styles.tableHead}>
                    <tr>
                        <th>Order ID</th>
                        <th>Address</th>
                        <th>Delivery Method</th>
                        <th>Created At</th>
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
                            <td colSpan="7">No orders found.</td>
                        </tr>
                    )}
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
        minHeight: '100vh',
    },
    title: {
        marginBottom: '20px',
        color: '#fff',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
    },
    tableHead: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    tableRow: {
        borderBottom: '1px solid #555',
    },
    tableCell: {
        padding: '10px',
        borderBottom: '1px solid #555',
    },
    list: {
        padding: 0,
        margin: 0,
        listStyleType: 'none',
    },
};

export default OrdersPage;
