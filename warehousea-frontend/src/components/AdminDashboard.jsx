import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className="d-flex" style={styles.dashboardContainer}>
      <Sidebar />
      <div className="content p-4 w-100" style={styles.content}>
        <button onClick={handleLogout} className="btn btn-danger mb-3">
          Logout
        </button>
        <h1>Admin Dashboard</h1>
        {children}
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(to right, black, #ff2770)', // Black to #ff2770 gradient
    color: '#fff', // Ensure text stands out on the background
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adds a transparent black background for content
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

export default AdminDashboard;
