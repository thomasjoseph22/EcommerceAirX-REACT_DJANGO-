import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';
import CommonNavbar from './CommonNavbar';
import Footer from './Footer';

const UserOrdersPage = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrders();
        }
    }, [token]);

    useEffect(() => {
        const updateInTransit = async () => {
            // Find orders that are dispatched and not in transit yet
            const ordersToUpdate = orders.filter(order => order.is_dispatched && !order.is_in_transit);

            ordersToUpdate.forEach(async order => {
                // Set a timeout to update the order status after 30 seconds
                setTimeout(async () => {
                    try {
                        const response = await axios.patch(
                            `http://localhost:8000/api/orders/orders/${order.id}/update/`,
                            { is_in_transit: true },
                            {
                                headers: {
                                    'Authorization': `Token ${token}`
                                }
                            }
                        );
                        console.log('Order update response:', response.data);

                        setOrders(prevOrders =>
                            prevOrders.map(o =>
                                o.id === order.id
                                    ? { ...o, is_in_transit: response.data.is_in_transit }
                                    : o
                            )
                        );
                    } catch (error) {
                        console.error('Failed to update order status:', error);
                    }
                }, 30000); // 30 seconds delay
            });
        };

        updateInTransit();
    }, [orders, token]);


    useEffect(() => {
        const updateInTransit = async () => {
            const ordersToUpdate = orders.filter(order => order.is_dispatched && !order.is_in_transit);
    
            ordersToUpdate.forEach(async order => {
                setTimeout(async () => {
                    try {
                        console.log(`Updating order ${order.id} to in transit...`);
                        const response = await axios.patch(
                            `http://localhost:8000/api/orders/orders/${order.id}/update/`,
                            { is_in_transit: true },
                            {
                                headers: {
                                    'Authorization': `Token ${token}`
                                }
                            }
                        );
                        console.log('Order update response:', response.data);
    
                        setOrders(prevOrders =>
                            prevOrders.map(o =>
                                o.id === order.id
                                    ? { ...o, is_in_transit: response.data.is_in_transit }
                                    : o
                            )
                        );
                    } catch (error) {
                        console.error(`Failed to update order ${order.id}:`, error);
                    }
                }, 30000); // 30 seconds delay
            });
        };
    
        updateInTransit();
    }, [orders, token]);
    



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

            alert('Delivery successful');

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

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #ff2770, #25252b)',
                fontFamily: "'Poppins', sans-serif",
                color: '#fff'
            }}
        >
            <CommonNavbar />
            <main
                style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    overflowY: 'auto',
                    padding: '20px',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        background: 'linear-gradient(135deg, #ff2770, #25252b)',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '-50px',
                            width: '750px',
                            height: '450px',
                            background: '#ff2770',
                            borderRadius: '50%',
                            filter: 'blur(150px)',
                            zIndex: '1',
                        }}
                    ></div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-100px',
                            right: '-150px',
                            width: '500px',
                            height: '400px',
                            background: '#ff2770',
                            borderRadius: '50%',
                            filter: 'blur(150px)',
                            zIndex: '1',
                        }}
                    ></div>

                    <Container
                        style={{
                            position: 'relative',
                            backgroundColor: 'rgba(37, 37, 43, 0.9)',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                            maxWidth: '1200px',
                            width: '100%',
                            zIndex: '2',
                            overflowX: 'auto',
                        }}
                    >
                        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>My Orders</h1>
                        {orders.length === 0 ? (
                            <div>No orders found. Start shopping now!</div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <Table
                                    striped
                                    bordered
                                    hover
                                    responsive
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        overflow: 'auto',
                                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Address</th>
                                            <th>Delivery Method</th>
                                            <th>Items</th>
                                            <th>Delivery Location</th>
                                            <th>Arrival Date</th>
                                            <th>Dispatched</th>
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
                                                <td>{order.delivery_location || 'N/A'}</td>
                                                <td>{order.arrival_date ? new Date(order.arrival_date).toLocaleDateString() : 'N/A'}</td>
                                                <td>
                                                    {order.is_dispatched ? (
                                                        order.is_in_transit ? (
                                                            <span style={{ color: 'orange', fontWeight: 'bold' }}>In Transit</span>
                                                        ) : (
                                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Dispatched</span>
                                                        )
                                                    ) : (
                                                        <span style={{ color: 'red', fontWeight: 'bold' }}>Pending</span>
                                                    )}
                                                </td>
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
                        )}
                    </Container>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserOrdersPage;
