import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryBoyDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Delivery Boy Dashboard</h2>
      <button style={styles.button} onClick={() => navigate('/deliveryboy/orders')}>
        View Orders
      </button>
      <button style={styles.button} onClick={() => navigate('/deliveryboy/profile')}>
        View Profile
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: 'auto',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '20px',
  },
  button: {
    display: 'block',
    margin: '10px auto',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default DeliveryBoyDashboard;
