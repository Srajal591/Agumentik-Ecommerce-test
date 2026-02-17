import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import SuperAdminUsers from './pages/Users';
import SuperAdminAdminManagement from './pages/AdminManagement';
import SuperAdminCategories from './pages/Categories';
import SuperAdminProducts from './pages/Products';
import SuperAdminOrders from './pages/Orders';
import SuperAdminTickets from './pages/Tickets';
import SuperAdminReturns from './pages/Returns';
import AddProduct from './pages/AddProduct';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminReturns from './pages/admin/Returns';

import Layout from './components/Layout';
import { authService } from './api/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getStoredUser();
      setIsAuthenticated(isAuth);
      setUserRole(user?.role);
      setLoading(false);
    };

    checkAuth();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Determine default route based on role
  const getDefaultRoute = () => {
    if (userRole === 'super_admin') return '/super-admin/dashboard';
    if (userRole === 'admin') return '/admin/dashboard';
    return '/login';
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        
        <Route
          path="/"
          element={
            isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to={getDefaultRoute()} replace />} />
          
          {/* Super Admin Routes */}
          <Route path="super-admin/dashboard" element={userRole === 'super_admin' ? <SuperAdminDashboard /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="super-admin/users" element={userRole === 'super_admin' ? <SuperAdminUsers /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="super-admin/admin-management" element={userRole === 'super_admin' ? <SuperAdminAdminManagement /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="super-admin/categories" element={userRole === 'super_admin' ? <SuperAdminCategories /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="super-admin/products" element={userRole === 'super_admin' ? <SuperAdminProducts /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="super-admin/orders" element={userRole === 'super_admin' ? <SuperAdminOrders /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="super-admin/tickets" element={userRole === 'super_admin' ? <SuperAdminTickets /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="super-admin/returns" element={userRole === 'super_admin' ? <SuperAdminReturns /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="add-product" element={userRole === 'super_admin' || userRole === 'admin' ? <AddProduct /> : <Navigate to={getDefaultRoute()} replace />} />

          {/* Admin Routes (only 4 pages) */}
          <Route path="admin/dashboard" element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="admin/products" element={userRole === 'admin' ? <AdminProducts /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="admin/orders" element={userRole === 'admin' ? <AdminOrders /> : <Navigate to={getDefaultRoute()} replace />} />
          <Route path="admin/returns" element={userRole === 'admin' ? <AdminReturns /> : <Navigate to={getDefaultRoute()} replace />} />
        </Route>

        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
