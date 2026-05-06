import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const endpoint = filter === 'upcoming' 
        ? '/appointments/my-appointments?status=confirmed,pending'
        : '/appointments/my-appointments?status=completed,cancelled';
      
      const response = await api.get(endpoint);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.put(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (error) {
      alert('Failed to cancel appointment');
    }
  };

  return (
    <div className="appointments-page">
      <h1>My Appointments</h1>

      <div className="filter-tabs">
        <button 
          className={filter === 'upcoming' ? 'active' : ''}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={filter === 'past' ? 'active' : ''}
          onClick={() => setFilter('past')}
        >
          Past
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <p>No {filter} appointments found.</p>
          {filter === 'upcoming' && (
            <Link to="/patient/book-appointment" className="btn primary">
              Book an Appointment
            </Link>
          )}
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((apt) => (
            <div key={apt._id} className="appointment-card">
              <div className="appointment-header">
                <h3>{apt.doctorId?.name || 'Doctor'}</h3>
                <span className={`status ${apt.status}`}>{apt.status}</span>
              </div>
              
              <div className="appointment-details">
                <p><strong>Clinic:</strong> {apt.clinicId?.name || 'Clinic'}</p>
                <p><strong>Date:</strong> {new Date(apt.dateTime).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(apt.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p><strong>Reason:</strong> {apt.reason || 'Check-up'}</p>
              </div>

              {apt.paymentStatus && (
                <p><strong>Payment:</strong> 
                  <span className={`payment-status ${apt.paymentStatus}`}>
                    {apt.paymentStatus}
                  </span>
                </p>
              )}

              <div className="appointment-actions">
                {apt.status === 'confirmed' || apt.status === 'pending' ? (
                  <>
                    <Link to={`/patient/ai-diagnosis/${apt._id}`} className="btn secondary">
                      View Details
                    </Link>
                    <button 
                      onClick={() => cancelAppointment(apt._id)}
                      className="btn danger"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <Link to={`/patient/ai-diagnosis/${apt._id}`} className="btn secondary">
                    View Report
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
