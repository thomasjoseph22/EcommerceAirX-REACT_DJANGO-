import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin'; // Adjust the path as needed
import AdminRegister from './components/AdminRegister'; // Adjust the path as needed
import AdminProducts from './components/AdminProducts';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import CustomerRegistration from './components/CustomerRegistration';
import CustomerLogin from './components/CustomerLogin';
import CustomerDashboard from './components/CustomerDashboard';
import ProductPreviewPage from './components/ProductPreviewPage';
import ProtectedRoute from './ProtectedRoute'; // Ensure the path is correct
import { AuthProvider } from './AuthContext'; 
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import DeliveryBoyLogin from './components/DeliveryBoyLogin';
import DeliveryBoyRegister from './components/DeliveryBoyRegister';
import DeliveryBoyDashboard from './components/DeliveryBoyDashboard';
import DeliveryBoyProfile from './components/DeliveryBoyProfile';
import DeliveryBoyOrders from './components/DeliveryBoyOrders';
import CustomerProfile from './components/CustomerProfile';
import AdminUserManagement from './components/AdminUserManagement';
import OrdersPage from './components/OrdersPage';
import UserOrdersPage from './components/UserOrdersPage';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import DeliveryBoyList from './components/DeliveryBoyList';
import CustomerListPage from './components/CustomerListPage';




function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/add" element={<AddProduct />} />
            <Route path="/admin/customers" element={<CustomerListPage />} />
            <Route path="/admin/deliveryboys" element={<DeliveryBoyList />}  />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />}  />
            <Route path="/admin/orders" element={<OrdersPage />}  />
            <Route path="/admin/products/edit/:productId" element={<EditProduct />} />
            <Route path="/customer/register" element={<CustomerRegistration />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />}  />
            <Route path="/users/orders" element={<UserOrdersPage />}  />
            <Route path="/product/:id" element={<ProductPreviewPage />}  />
            <Route path="/customer/cart" element={<CartPage />}  />
            <Route path="/customer/checkout" element={<CheckoutPage/>}/>
            <Route path="/customer/profile" element={<CustomerProfile/>}/>
            <Route path="/deliveryboy/register" element={<DeliveryBoyRegister />} />
            <Route path="/deliveryboy/login" element={<DeliveryBoyLogin />} />
            <Route path="/deliveryboy/dashboard" element={<DeliveryBoyDashboard />}  />
            <Route path="/deliveryboy/profile" element={<DeliveryBoyProfile />}  />
            <Route path="/deliveryboy/orders" element={<DeliveryBoyOrders />}  />

            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
