import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('auth-token');
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page and remember the location we were redirected from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;