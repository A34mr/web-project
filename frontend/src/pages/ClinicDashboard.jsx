import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ClinicDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    avgRating: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        api.get('/appointments/clinic-appointments'),
        api.get('/clinics/dashboard-stats')
      ]);
      
      setRecentAppointments(appointmentsRes.data.slice(0, 5));
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Clinic Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>📅 Total Appointments</h3>
          <p className="stat-number">{stats.totalAppointments}</p>
        </div>
        <div className="stat-card">
          <h3>⏳ Pending</h3>
          <p className="stat-number">{stats.pendingAppointments}</p>
        </div>
        <div className="stat-card">
          <h3>👥 Total Patients</h3>
          <p className="stat-number">{stats.totalPatients}</p>
        </div>
        <div className="stat-card">
          <h3>⭐ Average Rating</h3>
          <p className="stat-number">{stats.avgRating?.toFixed(1) || 'N/A'}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/clinic/appointments" className="action-card">
          <h3>📋 Manage Appointments</h3>
          <p>View and manage all appointments</p>
        </Link>
        <Link to="/clinic/patients" className="action-card">
          <h3>👥 Patient Records</h3>
          <p>View patient history and records</p>
        </Link>
        <Link to="/clinic/chat" className="action-card">
          <h3>💬 Messages</h3>
          <p>Chat with patients</p>
        </Link>
        <Link to="/clinic/reviews" className="action-card">
          <h3>⭐ Reviews</h3>
          <p>View and respond to reviews</p>
        </Link>
        <Link to="/clinic/profile" className="action-card">
          <h3>🏥 Clinic Profile</h3>
          <p>Update clinic information</p>
        </Link>
      </div>

      <div className="dashboard-section">
        <h2>Recent Appointments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentAppointments.length === 0 ? (
          <p>No recent appointments</p>
        ) : (
          <div className="appointments-list">
            {recentAppointments.map((apt) => (
              <div key={apt._id} className="appointment-card">
                <h4>{apt.patientId?.name || 'Patient'}</h4>
                <p>📅 {new Date(apt.dateTime).toLocaleDateString()}</p>
                <p>⏰ {new Date(apt.dateTime).toLocaleTimeString()}</p>
                <span className={`status ${apt.status}`}>{apt.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicDashboard;
