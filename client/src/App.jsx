import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProductList from './pages/Products/ProductList';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import WriteReview from './pages/WriteReview/WriteReview';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import Profile from './pages/Profile/Profile';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './index.css';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}> {/* Push content down for fixed navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/write-review" element={
              <ProtectedRoute>
                <WriteReview />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute adminOnly={true}>
                <AdminProducts />
              </ProtectedRoute>
            } />
            <Route path="/profile/:userId?" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>

  );
}

export default App;
