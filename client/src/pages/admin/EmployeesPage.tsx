
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
  type Employee,
} from '../../services/employee.service';

type EmployeeRole = 'admin' | 'employee';

function EmployeesPage() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<EmployeeRole>('employee');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<EmployeeRole>('employee');

  const [saving, setSaving] = useState(false);

  const loadEmployees = async () => {
    try {
      setError('');
      const data = await getEmployees();
      setEmployees(data);
    } catch {
      setError('Failed to load employees. Please check your login and backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEmployees();
  }, []);

  const resetAddForm = () => {
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('employee');
    setShowAddForm(false);
  };

  const handleAddEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await createEmployee({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword,
        role: newRole,
      });

      await loadEmployees();
      resetAddForm();
      setEditingEmployee(null);
      setSuccess('Employee created successfully.');
    } catch {
      setError('Unable to create employee. Please check the details and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Delete employee "${name}"?`);

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await deleteEmployee(id);
      setEmployees((current) =>
        current.filter((employee) => employee._id !== id),
      );

      if (editingEmployee?._id === id) {
        setEditingEmployee(null);
      }

      setSuccess('Employee deleted successfully.');
    } catch {
      setError('Unable to delete employee. Please try again.');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditName(employee.name);
    setEditEmail(employee.email);
    setEditRole(employee.role);
    setShowAddForm(false);
    setError('');
    setSuccess('');
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingEmployee) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateEmployee(editingEmployee._id, {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
      });

      await loadEmployees();
      setEditingEmployee(null);
      setSuccess('Employee updated successfully.');
    } catch {
      setError('Unable to update employee. Please check the details and try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const query = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="employee-page">
      <header className="employee-page-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/admin/dashboard')}
          >
            ← Dashboard
          </button>

          <h1>Employee Management</h1>
          <p>View and manage employee records.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            setShowAddForm((current) => !current);
            setEditingEmployee(null);
            setError('');
            setSuccess('');
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </header>

      <section className="employee-table-card">
        <div className="employee-table-toolbar">
          <div>
            <h2>All Employees</h2>
            <p>{employees.length} employee record(s)</p>
          </div>

          <input
            className="employee-search"
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && (
          <p className="employee-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="employee-success" role="status">
            {success}
          </p>
        )}

        {showAddForm && (
          <form className="employee-edit-form" onSubmit={handleAddEmployee}>
            <h3>Add New Employee</h3>

            <label htmlFor="new-name">Name</label>
            <input
              id="new-name"
              type="text"
              placeholder="Enter employee name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              required
            />

            <label htmlFor="new-email">Email</label>
            <input
              id="new-email"
              type="email"
              placeholder="Enter employee email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              required
            />

            <label htmlFor="new-password">Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter initial password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
            />

            <label htmlFor="new-role">Role</label>
            <select
              id="new-role"
              value={newRole}
              onChange={(event) =>
                setNewRole(event.target.value as EmployeeRole)
              }
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            <div className="employee-actions">
              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving ? 'Creating...' : 'Create Employee'}
              </button>

              <button
                className="cancel-button"
                type="button"
                disabled={saving}
                onClick={resetAddForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {editingEmployee && (
          <form className="employee-edit-form" onSubmit={handleUpdate}>
            <h3>Edit Employee</h3>

            <label htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              type="text"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              required
            />

            <label htmlFor="edit-email">Email</label>
            <input
              id="edit-email"
              type="email"
              value={editEmail}
              onChange={(event) => setEditEmail(event.target.value)}
              required
            />

      
<label htmlFor="edit-role">Role</label>
<input
  id="edit-role"
  type="text"
  value={editRole}
  readOnly
/>

            <div className="employee-actions">
              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                className="cancel-button"
                type="button"
                disabled={saving}
                onClick={() => setEditingEmployee(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="employee-message">Loading employees...</p>
        ) : filteredEmployees.length === 0 ? (
          <div className="employee-message">
            <h3>No employees found</h3>
            <p>Try a different search or add an employee.</p>
          </div>
        ) : (
          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>
                      <span className="role-badge">{employee.role}</span>
                    </td>
                    <td>
                      <div className="employee-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            void handleDelete(employee._id, employee.name)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default EmployeesPage;
