import React from 'react';
import { 
  Sparkles, ShieldCheck, Zap, 
  Info, AlertCircle, FileText,
  ArrowRight
} from 'lucide-react';

export default function AIDiagnosis() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(26, 115, 232, 0.1)', color: '#1a73e8', 
            padding: '8px 16px', borderRadius: '100px', fontSize: '14px', 
            fontWeight: '600', marginBottom: '16px' 
          }}>
            <Sparkles size={16} /> Powered by Dent AI Vision
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>
            AI Dental Cavity Detection
          </h1>
          <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
            Upload your OPG X-ray to identify potential cavities and dental issues using our state-of-the-art neural network.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>
          {/* Main AI Workspace */}
          <div style={{ 
            background: '#fff', borderRadius: '32px', border: '1px solid #e2e8f0', 
            overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            minHeight: '700px'
          }}>
            <iframe 
              src="https://sentoz-dental-opg-cavity-detection.hf.space" 
              frameBorder="0" 
              width="100%" 
              height="800"
              title="Dental AI Model"
              style={{ display: 'block' }}
            ></iframe>
          </div>

          {/* Sidebar / Instructions */}
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={cardStyle}>
              <div style={iconBoxStyle('#1a73e8')}>
                <Info size={20} />
              </div>
              <h3 style={cardTitleStyle}>How it works</h3>
              <ul style={listStyle}>
                <li>Upload a clear OPG X-ray image</li>
                <li>Adjust confidence thresholds if needed</li>
                <li>The AI will highlight potential cavities</li>
                <li>View the auto-generated detection report</li>
              </ul>
            </div>

            <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#fff' }}>
              <div style={iconBoxStyle('#38bdf8')}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ ...cardTitleStyle, color: '#fff' }}>Medical Disclaimer</h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#94a3b8' }}>
                This AI tool is designed for educational and supportive purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. 
                Always seek the advice of your dentist.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={iconBoxStyle('#8b5cf6')}>
                <Zap size={20} />
              </div>
              <h3 style={cardTitleStyle}>Advanced Features</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FeatureItem label="Cavity Localization" />
                <FeatureItem label="Detection Reports" />
                <FeatureItem label="High Resolution Analysis" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>
      <CheckCircle2 size={16} color="#22c55e" />
      {label}
    </div>
  );
}

const cardStyle = {
  background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0'
};

const iconBoxStyle = (color) => ({
  width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, 
  color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
});

const cardTitleStyle = {
  fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '12px'
};

const listStyle = {
  paddingLeft: '20px', margin: 0, fontSize: '14px', color: '#64748b', display: 'grid', gap: '8px'
};

function CheckCircle2({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
