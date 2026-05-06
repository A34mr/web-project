import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClinics: 0,
    pendingClinics: 0,
    totalAppointments: 0
  });
  const [pendingClinics, setPendingClinics] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, clinicsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/clinics/pending'),
        api.get('/admin/users')
      ]);
      
      setStats(statsRes.data);
      setPendingClinics(clinicsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveClinic = async (clinicId) => {
    if (!window.confirm('Approve this clinic?')) return;
    
    try {
      await api.put(`/admin/clinics/${clinicId}/approve`);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to approve clinic');
    }
  };

  const rejectClinic = async (clinicId) => {
    if (!window.confirm('Reject this clinic?')) return;
    
    try {
      await api.put(`/admin/clinics/${clinicId}/reject`);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to reject clinic');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>👥 Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>🏥 Total Clinics</h3>
          <p className="stat-number">{stats.totalClinics}</p>
        </div>
        <div className="stat-card">
          <h3>⏳ Pending Clinics</h3>
          <p className="stat-number">{stats.pendingClinics}</p>
        </div>
        <div className="stat-card">
          <h3>📅 Total Appointments</h3>
          <p className="stat-number">{stats.totalAppointments}</p>
        </div>
      </div>

      <div className="admin-section">
        <h2>Pending Clinic Approvals</h2>
        {pendingClinics.length === 0 ? (
          <p>No pending clinic approvals</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Clinic Name</th>
                <th>Address</th>
                <th>License</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingClinics.map((clinic) => (
                <tr key={clinic._id}>
                  <td>{clinic.name}</td>
                  <td>{clinic.address}</td>
                  <td>{clinic.licenseNumber}</td>
                  <td>
                    <button 
                      onClick={() => approveClinic(clinic._id)}
                      className="btn success"
                    >
                      ✓ Approve
                    </button>
                    <button 
                      onClick={() => rejectClinic(clinic._id)}
                      className="btn danger"
                    >
                      ✗ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-section">
        <h2>User Management</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`status ${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleUserStatus(u._id, u.isActive)}
                      className="btn secondary"
                    >
                      {u.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
