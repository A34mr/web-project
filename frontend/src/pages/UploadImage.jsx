import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      
      // Navigate to AI diagnosis page
      if (response.data.image?._id) {
        setTimeout(() => {
          navigate(`/patient/ai-diagnosis/${response.data.image._id}`);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-image">
      <h1>Upload Dental Image</h1>
      <p>Upload your dental X-ray or intraoral photo for AI analysis</p>

      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {!preview ? (
          <div 
            className="upload-placeholder" 
            onClick={() => fileInputRef.current?.click()}
          >
            <span>📸</span>
            <p>Click to select an image</p>
            <p>Supported formats: JPG, PNG, DICOM</p>
          </div>
        ) : (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button 
              className="remove-btn"
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="upload-success">
          <h3>✅ Upload Successful!</h3>
          <p>AI Analysis in progress...</p>
          <p>Redirecting to results...</p>
        </div>
      )}

      <div className="actions">
        <button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading}
          className="btn primary"
        >
          {uploading ? 'Uploading & Analyzing...' : 'Upload & Analyze'}
        </button>
      </div>

      <div className="info-box">
        <h4>ℹ️ What happens next?</h4>
        <ul>
          <li>Your image will be analyzed by our AI model</li>
          <li>The system will detect potential cavities and issues</li>
          <li>Results will be shown with confidence scores</li>
          <li>You can share results with your dentist</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadImage;
