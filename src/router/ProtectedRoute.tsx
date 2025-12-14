import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  const onboardingCompleted = localStorage.getItem('onboardingCompleted');
  
  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
