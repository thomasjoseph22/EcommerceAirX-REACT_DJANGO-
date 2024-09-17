import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeliveryBoyNavbar from './DeliveryBoyNavbar'; // Assuming this file is in the same directory

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

  const handleUpdateOrder = async (orderId, deliveryLocation, delivered = false, dispatched = false) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating order:', orderId, 'with location:', deliveryLocation, 'delivered:', delivered, 'dispatched:', dispatched);
  
      // Find the order to check if it's already dispatched
      const currentOrder = orders.find(order => order.id === orderId);
      const isAlreadyDispatched = currentOrder ? currentOrder.is_dispatched : false;
  
      const payload = {};
      if (deliveryLocation !== undefined) {
        payload.delivery_location = deliveryLocation;
      }
      if (delivered !== undefined) {
        payload.is_delivered = delivered;
      }
      // Retain the is_dispatched status if it's already true
      if (isAlreadyDispatched || dispatched !== undefined) {
        payload.is_dispatched = isAlreadyDispatched || dispatched;
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

  const handleMarkAsDispatched = (orderId) => {
    handleUpdateOrder(orderId, undefined, undefined, true); // Only set dispatched to true
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
      <DeliveryBoyNavbar />
      <h2 style={styles.title}>Your Orders</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Item</th>
            <th style={styles.tableHeader}>Delivery Place</th>
            <th style={styles.tableHeader}>Delivery Method</th>
            <th style={styles.tableHeader}>Arrival Date</th>
            <th style={styles.tableHeader}>Update Delivery Location</th>
            <th style={styles.tableHeader}>Delivery Status</th>
            <th style={styles.tableHeader}>Dispatch Status</th>
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
              <td style={styles.tableCell}>
                <span style={styles[order.delivery_method.toLowerCase()] || styles.defaultDeliveryMethod}>
                  {order.delivery_method}
                </span>
              </td>
              <td style={styles.tableCell}>{order.arrival_date ? new Date(order.arrival_date).toLocaleDateString() : 'N/A'}</td>
              <td style={styles.tableCell}>
                <input
                  type="text"
                  placeholder="Update delivery location"
                  value={updatedLocation[order.id] || order.delivery_location || ''}
                  onChange={(e) => handleLocationChange(order.id, e.target.value)}
                  style={styles.input}
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
              <td style={styles.tableCell}>
                {order.is_dispatched ? (
                  <span style={styles.dispatchedText}>Dispatched</span>
                ) : (
                  <button
                    onClick={() => handleMarkAsDispatched(order.id)}
                    style={styles.dispatchButton}
                  >
                    Mark as Dispatched
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
    backgroundColor: '#25252b', // Background color from CodePen
    color: '#fff',
    boxShadow: '0 0 25px #ff2770', // Box shadow from CodePen
    border: '2px solid #ff2770', // Border color from CodePen
    borderRadius: '8px', // Adding border radius for a modern look
  },
  title: {
    marginBottom: '20px',
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#ff2770', // Header background color from CodePen
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '10px',
  },
  input: {
    width: 'calc(100% - 80px)', // Adjusting width for input field
    height: '40px',
    background: 'transparent',
    border: '2px solid #fff', // Border color for input from CodePen
    color: '#fff',
    fontSize: '16px',
    padding: '0 10px',
    borderRadius: '4px', // Border radius for a smoother look
  },
  saveButton: {
    marginLeft: '10px',
    backgroundColor: '#ff2770', // Save button background color from CodePen
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '20px', // Rounded corners for the button
  },
  deliverButton: {
    backgroundColor: '#ff2770', // Deliver button background color from CodePen
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '20px', // Rounded corners for the button
  },
  dispatchButton: {
    backgroundColor: '#2196F3', // Dispatch button background color from CodePen
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '20px', // Rounded corners for the button
  },
  deliveredText: {
    color: '#4CAF50', // Delivered text color from CodePen
    fontWeight: 'bold',
  },
  dispatchedText: {
    color: '#FF9800', // Dispatched text color from CodePen
    fontWeight: 'bold',
  },
  air: {
    fontWeight: 'bold',
    color: '#2196F3', // Blue for air
  },
  ship: {
    fontWeight: 'bold',
    color: '#FF5722', // Orange for ship
  },
  road: {
    fontWeight: 'bold',
    color: '#4CAF50', // Green for road
  },
  defaultDeliveryMethod: {
    fontWeight: 'bold',
    color: '#ddd', // Default color if no match
  },
};

export default DeliveryBoyOrders;
