import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const ClinicDetail = () => {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinicDetails();
  }, [id]);

  const fetchClinicDetails = async () => {
    try {
      const clinicResponse = await api.get(`/clinics/${id}`);
      setClinic(clinicResponse.data);

      const doctorsResponse = await api.get(`/clinics/${id}/doctors`);
      setDoctors(doctorsResponse.data);

      const reviewsResponse = await api.get(`/clinics/${id}/reviews`);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching clinic details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!clinic) return <div className="error">Clinic not found</div>;

  return (
    <div className="clinic-detail">
      <div className="clinic-header">
        <h1>{clinic.name}</h1>
        <div className="rating">
          ⭐ {clinic.ratingAvg?.toFixed(1) || 'New'} ({clinic.reviewCount || 0} reviews)
        </div>
      </div>

      <div className="clinic-info-grid">
        <div className="info-section">
          <h2>About</h2>
          <p>{clinic.description || 'No description available'}</p>
          
          <h3>📍 Address</h3>
          <p>{clinic.address}</p>
          
          <h3>💰 Price Range</h3>
          <p>{clinic.priceRange || 'Not specified'}</p>
          
          <h3>🏥 Specialties</h3>
          <p>{clinic.specialties?.join(', ') || 'General Dentistry'}</p>
        </div>

        <div className="info-section">
          <h2>Working Hours</h2>
          {clinic.workingHours ? (
            <ul>
              {Object.entries(clinic.workingHours).map(([day, hours]) => (
                <li key={day}>
                  <strong>{day}:</strong> {hours.open} - {hours.close}
                </li>
              ))}
            </ul>
          ) : (
            <p>Not specified</p>
          )}
        </div>
      </div>

      <div className="doctors-section">
        <h2>Our Doctors</h2>
        {doctors.length === 0 ? (
          <p>No doctors listed</p>
        ) : (
          <div className="doctors-list">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <h3>Dr. {doctor.name}</h3>
                <p>🦷 {doctor.specialty}</p>
                <p>📅 Available: {doctor.availability?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reviews-section">
        <h2>Patient Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <strong>{review.patientId?.name || 'Patient'}</strong>
                  <span className="stars">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p>{review.comment}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions">
        <Link to={`/patient/book-appointment?clinic=${id}`} className="btn primary">
          Book Appointment
        </Link>
      </div>
    </div>
  );
};

export default ClinicDetail;
