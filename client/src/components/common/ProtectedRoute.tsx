import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'employee')[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser) as {
      role: 'admin' | 'employee';
    };

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return (
        // eslint-disable-next-line react-hooks/error-boundaries
        <Navigate
          to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}
          replace
        />
      );
    }

    // eslint-disable-next-line react-hooks/error-boundaries
    return <Outlet />;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;