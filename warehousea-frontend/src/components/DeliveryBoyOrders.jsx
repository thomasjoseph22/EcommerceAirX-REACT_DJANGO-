import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeliveryBoyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedLocation, setUpdatedLocation] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/deliveryboy/login');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/orders/orders/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        console.log('API Response:', response.data); // Log API response to verify structure
        setOrders(response.data);
      } catch (error) {
        console.error('There was an error fetching orders!', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleUpdateOrder = async (orderId, deliveryLocation, delivered = false) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating order:', orderId, 'with location:', deliveryLocation, 'and delivered:', delivered);

      const payload = {};
      if (deliveryLocation !== undefined) {
        payload.delivery_location = deliveryLocation;
      }
      // Only update 'is_delivered' if explicitly set to true
      if (delivered !== undefined) {
        payload.is_delivered = delivered;
      }

      const response = await axios.patch(
        `http://localhost:8000/api/orders/orders/${orderId}/update/`, 
        payload, 
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log('Order update response:', response.data);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId 
            ? { ...order, ...payload } 
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order:', error.response || error);
      setError('Failed to update order. Please try again.');
    }
  };

  const handleLocationChange = (orderId, value) => {
    setUpdatedLocation(prev => ({ ...prev, [orderId]: value }));
  };

  const handleSaveLocation = (orderId) => {
    handleUpdateOrder(orderId, updatedLocation[orderId]);
  };

  const handleMarkAsDelivered = (orderId) => {
    handleUpdateOrder(orderId, undefined, true); // Only set delivered to true
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Orders</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Item</th>
            <th style={styles.tableHeader}>Delivery Place</th>
            <th style={styles.tableHeader}>Delivery Method</th>
            <th style={styles.tableHeader}>Update Delivery Location</th>
            <th style={styles.tableHeader}>Delivery Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td style={styles.tableCell}>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index}>
                      {item.product_name} - Quantity: {item.quantity} - Price: {item.price}
                    </div>
                  ))
                ) : (
                  <div>No items found.</div>
                )}
              </td>
              <td style={styles.tableCell}>{order.address}</td>
              <td style={styles.tableCell}>{order.delivery_method}</td>
              <td style={styles.tableCell}>
                <input
                  type="text"
                  placeholder="Update delivery location"
                  value={updatedLocation[order.id] || order.delivery_location || ''}
                  onChange={(e) => handleLocationChange(order.id, e.target.value)}
                />
                <button
                  onClick={() => handleSaveLocation(order.id)}
                  style={styles.saveButton}
                >
                  Save
                </button>
              </td>
              <td style={styles.tableCell}>
                {order.is_delivered ? (
                  <span style={styles.deliveredText}>Delivered</span>
                ) : (
                  <button
                    onClick={() => handleMarkAsDelivered(order.id)}
                    style={styles.deliverButton}
                  >
                    Mark as Delivered
                  </button>
                )}
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
    maxWidth: '100%',
    margin: '0 auto',
    overflowX: 'auto',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
    padding: '10px',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '10px',
  },
  saveButton: {
    marginLeft: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  deliverButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  deliveredText: {
    color: 'green',
    fontWeight: 'bold',
  },
};

export default DeliveryBoyOrders;
