import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import EmployeeDashboardPage from './pages/employee/EmployeeDashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import EmployeesPage from './pages/admin/EmployeesPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Route>
<Route path="/admin/employees" element={<EmployeesPage />} />
        <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
          <Route
            path="/employee/dashboard"
            element={<EmployeeDashboardPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;