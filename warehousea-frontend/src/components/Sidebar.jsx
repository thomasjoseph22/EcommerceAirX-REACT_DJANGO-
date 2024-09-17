import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column vh-100 p-3 bg-dark text-white" style={{ width: '250px' }}>
      <h3 className="text-center">Admin Dashboard</h3>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/users" className="nav-link text-white">Users</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/products" className="nav-link text-white">Products</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/orders" className="nav-link text-white">Orders</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/deliveryboys" className="nav-link text-white">Delivery Boys</Link>
        </li>
        <li className="nav-item">
        <Link to="/admin/customers" className="nav-link text-white">Customer</Link>
      </li>
      </ul>
    </div>
  );
};

export default Sidebar;
