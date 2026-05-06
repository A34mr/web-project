const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

class AIService {
  constructor() {
    this.apiUrl = process.env.AI_SERVICE_URL || 'https://sentoz-dental-opg-cavity-detection.hf.space/api/predict';
  }

  async analyzeImage(imagePath) {
    try {
      // Create form data for image upload
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      // Send to Hugging Face Space API
      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000 // 60 second timeout
      });

      return this.parseResponse(response.data);
    } catch (error) {
      console.error('AI Service Error:', error.message);
      
      // Fallback mock response for development/testing
      if (error.code === 'ECONNREFUSED' || error.response?.status === 404) {
        console.log('Using mock AI response for development');
        return this.getMockAnalysis();
      }
      
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  parseResponse(data) {
    // Parse the AI response based on expected format
    // Adjust based on actual API response structure
    const cavities = [];
    let overallConfidence = 0;
    let suggestedSpecialist = 'General Dentist';

    if (data && Array.isArray(data)) {
      data.forEach(item => {
        if (item.confidence && item.location) {
          cavities.push({
            location: item.location || 'Unknown',
            confidence: item.confidence || 0,
            severity: this.determineSeverity(item.confidence)
          });
        }
      });
      
      if (cavities.length > 0) {
        overallConfidence = cavities.reduce((sum, c) => sum + c.confidence, 0) / cavities.length;
        
        if (overallConfidence > 0.7) {
          suggestedSpecialist = 'Endodontist';
        } else if (overallConfidence > 0.5) {
          suggestedSpecialist = 'General Dentist';
        }
      }
    }

    return {
      cavitiesDetected: cavities,
      overallConfidence,
      suggestedSpecialist,
      rawResponse: data,
      analyzedAt: new Date()
    };
  }

  determineSeverity(confidence) {
    if (confidence >= 0.8) return 'severe';
    if (confidence >= 0.5) return 'moderate';
    return 'mild';
  }

  getMockAnalysis() {
    // Mock response for development when API is unavailable
    const mockCavities = [
      {
        location: 'Tooth #14 - Occlusal Surface',
        confidence: 0.85,
        severity: 'moderate'
      },
      {
        location: 'Tooth #19 - Mesial Surface',
        confidence: 0.72,
        severity: 'mild'
      }
    ];

    return {
      cavitiesDetected: mockCavities,
      overallConfidence: 0.785,
      suggestedSpecialist: 'General Dentist',
      rawResponse: { mock: true },
      analyzedAt: new Date()
    };
  }
}

module.exports = new AIService();
