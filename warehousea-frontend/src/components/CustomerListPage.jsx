import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar'; // Import the AdminNavbar

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch customer details with authentication
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token'); // Fetch token from localStorage
        if (!token) {
          setError('No token found, please log in again.');
          setLoading(false);
          return;
        }

        // API request with Authorization header
        const response = await axios.get('http://localhost:8000/api/accounts/admin/customers/', {
          headers: {
            Authorization: `Token ${token}`, // Pass token in the header
          },
        });
        setCustomers(response.data); // Set customer data on success
      } catch (err) {
        // Handle unauthorized or other errors
        if (err.response && err.response.status === 401) {
          setError('Unauthorized: Please log in again.');
          // Optional: Redirect to login page
          // window.location.href = '/login';
        } else {
          setError('Error fetching customer data');
        }
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array to run effect only once on component mount

  if (loading) {
    return <p style={styles.loading}>Loading...</p>; // Show loading message
  }

  if (error) {
    return <p style={styles.error}>{error}</p>; // Show error message
  }

  return (
    <div style={styles.container}>
      <AdminNavbar /> {/* Include the AdminNavbar */}
      <h2 style={styles.title}>Customer List</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeadCell}>ID</th>
              <th style={styles.tableHeadCell}>Username</th>
              <th style={styles.tableHeadCell}>Email</th>
              <th style={styles.tableHeadCell}>PAN Card</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{customer.id}</td>
                  <td style={styles.tableCell}>{customer.username}</td>
                  <td style={styles.tableCell}>{customer.email}</td>
                  <td style={styles.tableCell}>{customer.pan_card}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.tableCell}>No customers found.</td>
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
  tableHeadCell: {
    border: '1px solid #666', // Light gray for header cell borders
    padding: '15px',
  },
  tableRow: {
    borderBottom: '1px solid #666', // Light gray for row borders
  },
  tableCell: {
    border: '1px solid #666',
    padding: '15px',
    fontSize: '16px',
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

export default CustomerListPage;
