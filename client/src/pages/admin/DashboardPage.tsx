import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="brand">EMS</h2>
        <p className="sidebar-label">MAIN MENU</p>
        <nav>
          <a href="/admin/dashboard" className="nav-link active">
            Dashboard
          </a>
          <a href="#employees" className="nav-link">
            Employees
          </a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here is your employee overview.</p>
          </div>

          <div className="user-section">
            <div className="avatar">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <span>{user?.name ?? 'Admin'}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon employees-icon">👥</div>
            <p>Total Employees</p>
            <h2>—</h2>
            <span>Employee records</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon active-icon">✓</div>
            <p>Active Employees</p>
            <h2>—</h2>
            <span>Currently active</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon admin-icon">🛡️</div>
            <p>Administrator</p>
            <h2>1</h2>
            <span>Management access</span>
          </article>
        </section>

        <section className="employees-section" id="employees">
          <div className="section-heading">
            <div>
              <h2>Employee Management</h2>
              <p>Manage employee records from one place.</p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate('/admin/employees')}
            >
              Manage Employees
            </button>
          </div>

          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>Employee records</h3>
            <p>
              Connect the employee API to display and manage employee records
              here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;