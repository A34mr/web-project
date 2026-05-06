import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', clinicId: '' });
  const [clinics, setClinics] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchClinics();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/my-reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClinics = async () => {
    try {
      const response = await api.get('/clinics');
      setClinics(response.data);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', newReview);
      setShowForm(false);
      setNewReview({ rating: 5, comment: '', clinicId: '' });
      fetchReviews();
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  return (
    <div className="reviews-page">
      <h1>My Reviews</h1>

      <button 
        className="btn primary" 
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Write a Review'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Select Clinic</label>
            <select
              value={newReview.clinicId}
              onChange={(e) => setNewReview({...newReview, clinicId: e.target.value})}
              required
            >
              <option value="">Choose a clinic</option>
              {clinics.map((clinic) => (
                <option key={clinic._id} value={clinic._id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
              required
            >
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>{star} Star{star !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              placeholder="Share your experience..."
              rows="4"
              required
            />
          </div>

          <button type="submit" className="btn primary">Submit Review</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <p>You haven't written any reviews yet.</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <h3>{review.clinicId?.name || 'Clinic'}</h3>
                <div className="stars">
                  {'⭐'.repeat(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <p className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
