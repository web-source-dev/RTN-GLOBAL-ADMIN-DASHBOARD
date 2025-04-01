import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/blog" />;
  }

  return children;
}; 