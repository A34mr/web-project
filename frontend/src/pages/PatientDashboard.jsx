import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/my-appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Patient Dashboard</p>
      </div>

      <div className="dashboard-actions">
        <Link to="/patient/search-clinics" className="action-card">
          <h3>🏥 Find a Clinic</h3>
          <p>Search and filter clinics by location, specialty, and rating</p>
        </Link>
        <Link to="/patient/book-appointment" className="action-card">
          <h3>📅 Book Appointment</h3>
          <p>Schedule an appointment with your preferred dentist</p>
        </Link>
        <Link to="/patient/upload-image" className="action-card">
          <h3>📸 Upload X-Ray</h3>
          <p>Upload dental images for AI analysis</p>
        </Link>
        <Link to="/patient/medical-history" className="action-card">
          <h3>📋 Medical History</h3>
          <p>View your diagnoses and treatment plans</p>
        </Link>
        <Link to="/patient/chat" className="action-card">
          <h3>💬 Chat</h3>
          <p>Message your dentist</p>
        </Link>
        <Link to="/patient/profile" className="action-card">
          <h3>👤 Profile</h3>
          <p>Update your personal information</p>
        </Link>
      </div>

      <div className="dashboard-section">
        <h2>Your Upcoming Appointments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>No upcoming appointments. <Link to="/patient/search-clinics">Book one now!</Link></p>
        ) : (
          <div className="appointments-list">
            {appointments.slice(0, 3).map((apt) => (
              <div key={apt._id} className="appointment-card">
                <h4>{apt.doctorId?.name || 'Doctor'}</h4>
                <p>📅 {new Date(apt.dateTime).toLocaleDateString()}</p>
                <p>⏰ {new Date(apt.dateTime).toLocaleTimeString()}</p>
                <p>🏥 {apt.clinicId?.name || 'Clinic'}</p>
                <span className={`status ${apt.status}`}>{apt.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
