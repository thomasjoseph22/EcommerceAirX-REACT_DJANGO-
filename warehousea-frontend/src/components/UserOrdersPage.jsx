import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';

const UserOrdersPage = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/orders/user/orders/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                console.log('Fetched orders:', response.data);
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        if (token) {
            fetchOrders();
        }
    }, [token]);

    const handleReceived = async (orderId) => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/api/orders/orders/${orderId}/update/`,
                { is_received: true },
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            );
            console.log('Order update response:', response.data);

            // Show an alert for successful delivery
            alert('Delivery successful');

            // Update local state to reflect the change
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, is_received: response.data.is_received }
                        : order
                )
            );
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                backgroundImage: 'url(https://png.pngtree.com/thumb_back/fw800/back_our/20190620/ourmid/pngtree-simple-food-delivery-meal-fashion-poster-background-yellow-back-image_158378.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}
        >
            <Container
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    maxWidth: '1200px',
                    width: '100%'
                }}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>My Orders</h1>
                <div style={{ overflowX: 'auto' }}>
                    <Table
                        striped
                        bordered
                        hover
                        responsive
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Address</th>
                                <th>Delivery Method</th>
                                <th>Items</th>
                                <th>Delivery Location</th>
                                <th>Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>{order.address}</td>
                                    <td>{order.delivery_method}</td>
                                    <td>
                                        {order.items.length ? (
                                            order.items.map(item => (
                                                <div key={item.product_name}>
                                                    {item.product_name} - Quantity: {item.quantity}
                                                </div>
                                            ))
                                        ) : 'No items'}
                                    </td>
                                    <td>{order.delivery_location}</td>
                                    <td>
                                        {order.is_received ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Received</span>
                                        ) : (
                                            <Button
                                                onClick={() => handleReceived(order.id)}
                                                disabled={order.is_received}
                                                style={{
                                                    backgroundColor: order.is_received ? '#dc3545' : '#28a745',
                                                    borderColor: order.is_received ? '#dc3545' : '#28a745',
                                                    color: '#fff'
                                                }}
                                            >
                                                {order.is_received ? 'Received' : 'Receive'}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default UserOrdersPage;
