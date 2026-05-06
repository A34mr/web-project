import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const MedicalHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const response = await api.get('/images/my-images');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-history">
      <h1>Medical History</h1>
      <p>View your past diagnoses, uploaded images, and treatment plans</p>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <p>No medical records found.</p>
          <p>Upload your first dental image to get started!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((record) => (
            <div key={record._id} className="history-card">
              <div className="history-header">
                <h3>Dental Image Analysis</h3>
                <span className="date">{new Date(record.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="history-content">
                <img src={record.imageUrl} alt="Dental X-ray" className="thumbnail" />
                
                <div className="analysis-summary">
                  {record.aiAnalysisResult ? (
                    <>
                      <p><strong>Status:</strong> Analyzed</p>
                      <p><strong>Cavities Detected:</strong> {record.aiAnalysisResult.cavities?.length || 0}</p>
                      {record.aiAnalysisResult.suggestedSpecialist && (
                        <p><strong>Recommended Specialist:</strong> {record.aiAnalysisResult.suggestedSpecialist}</p>
                      )}
                    </>
                  ) : (
                    <p><strong>Status:</strong> Pending Analysis</p>
                  )}
                </div>
              </div>

              {record.dentistReview && (
                <div className="dentist-notes">
                  <h4>Dentist's Notes:</h4>
                  <p>{record.dentistReview}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
