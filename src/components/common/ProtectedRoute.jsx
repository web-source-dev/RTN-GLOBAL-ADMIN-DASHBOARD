import { Navigate } from 'react-router-dom';
import { useAuth, } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading,isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/auth/login`;
  }

  if (adminOnly && user.role !== 'admin') {
    return window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/auth/login`;
  }

  return children;
}; 