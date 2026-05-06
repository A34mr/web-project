import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const AIDiagnosis = () => {
  const { id } = useParams();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImageData();
  }, [id]);

  const fetchImageData = async () => {
    try {
      const response = await api.get(`/images/${id}`);
      setImageData(response.data);
    } catch (err) {
      setError('Failed to load image data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analysis...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!imageData) return <div className="error">No data found</div>;

  const aiAnalysis = imageData.aiAnalysisResult;

  return (
    <div className="ai-diagnosis">
      <h1>AI Diagnosis Results</h1>

      <div className="diagnosis-content">
        <div className="image-section">
          <h2>Uploaded Image</h2>
          <img src={imageData.imageUrl} alt="Dental X-ray" />
        </div>

        <div className="results-section">
          <h2>AI Analysis</h2>
          
          {aiAnalysis ? (
            <>
              <div className="analysis-summary">
                <h3>Summary</h3>
                {aiAnalysis.cavities && aiAnalysis.cavities.length > 0 ? (
                  <p className="warning">⚠️ {aiAnalysis.cavities.length} potential cavity/cavities detected</p>
                ) : (
                  <p className="success">✅ No cavities detected</p>
                )}
              </div>

              {aiAnalysis.cavities && aiAnalysis.cavities.length > 0 && (
                <div className="cavities-list">
                  <h3>Detected Cavities</h3>
                  {aiAnalysis.cavities.map((cavity, index) => (
                    <div key={index} className="cavity-item">
                      <span>🦷 Cavity #{index + 1}</span>
                      <span>Location: {cavity.location || 'Not specified'}</span>
                      <span>Confidence: {(cavity.confidence * 100).toFixed(1)}%</span>
                      <span>Severity: {cavity.severity || 'Moderate'}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiAnalysis.suggestedSpecialist && (
                <div className="recommendation">
                  <h3>Recommendation</h3>
                  <p>Based on the analysis, we recommend consulting a:</p>
                  <p className="specialist">👨‍⚕️ {aiAnalysis.suggestedSpecialist}</p>
                </div>
              )}

              {aiAnalysis.notes && (
                <div className="ai-notes">
                  <h3>AI Notes</h3>
                  <p>{aiAnalysis.notes}</p>
                </div>
              )}
            </>
          ) : (
            <p>Analysis pending. Please wait for the AI to process your image.</p>
          )}

          <div className="disclaimer">
            <p>⚠️ <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified dentist for proper diagnosis and treatment.</p>
          </div>

          <div className="actions">
            <button 
              className="btn primary"
              onClick={() => window.print()}
            >
              📄 Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosis;
