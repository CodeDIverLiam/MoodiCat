import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // While checking auth state, show a loading indicator
  if (isLoading && !user) {
    return <Loading />;
  }

  // Not authenticated: redirect to login preserving the origin location
  if (!isLoading && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated: render protected children
  return children;
}
