import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from "../../services/api";
import { Calendar, Clock, MapPin, FileText, Download, AlertCircle, CreditCard, ChevronLeft, User, Phone, Mail, Sparkles } from 'lucide-react';
import EditProfileModal from "./EditProfileModal";

export default function PatientPage() {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(null);
  const [reports, setReports] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, appointmentsRes] = await Promise.all([
        api.get('/api/auth/me'),
        api.get('/api/appointments/my-appointments')
      ]);

      if (userRes.data.success) {
        // Merge user and profile data for easier access
        setPatientData({
          ...userRes.data.user,
          ...userRes.data.profile
        });
      }
      if (appointmentsRes.data.success) setAppointments(appointmentsRes.data.appointments);

      // Fetch reports and images
      const [reportsRes, imagesRes] = await Promise.all([
        api.get('/api/reports/my-reports'),
        api.get('/api/images/my-images')
      ]);

      if (reportsRes.data.success) setReports(reportsRes.data.reports);
      if (imagesRes.data.success) setImages(imagesRes.data.images);
    } catch (error) {
      console.error('Fetch patient data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (appointmentId) => {
    try {
      setPaymentProcessing(appointmentId);
      // Mock payment process
      const response = await api.put(`/api/appointments/${appointmentId}/payment`, {
        paymentMethod: 'card',
        transactionId: `MOCK-${Date.now()}`
      });

      if (response.data.success) {
        // After payment, confirm the appointment
        await api.put(`/api/appointments/${appointmentId}/confirm`);
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(null);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading your profile...</div>;

  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Top Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontWeight: '600' }}>
            <ChevronLeft size={20} /> Back to Home
          </Link>
          <div style={{ fontWeight: '700', fontSize: '20px', color: '#1a1a2e' }}>Patient Dashboard</div>
        </div>

        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
          borderRadius: '24px', padding: '32px', color: '#fff',
          marginBottom: '32px', boxShadow: '0 10px 30px rgba(26,115,232,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800'
              }}>
                {patientData?.firstName?.[0]}
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
                  {patientData?.firstName} {patientData?.lastName}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', opacity: 0.9 }}>
                  <Mail size={16} /> {patientData?.email} | <Phone size={16} /> {patientData?.phone}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                to="/ai-diagnosis"
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', padding: '12px 24px',
                  borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Sparkles size={18} /> AI Vision
              </Link>
              <button
                onClick={() => setIsEditOpen(true)}
                style={{
                  background: '#fff', border: 'none', padding: '12px 24px',
                  borderRadius: '12px', color: '#1a73e8', fontWeight: '600', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', marginTop: '32px', padding: '24px 0 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <Mail size={16} opacity={0.7} /> {patientData?.email}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <Phone size={16} opacity={0.7} /> {patientData?.phone || 'No phone added'}
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {['appointments', 'history', 'documents'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px', borderRadius: '12px', fontWeight: '600', border: 'none',
                background: activeTab === tab ? '#1a73e8' : '#fff',
                color: activeTab === tab ? '#fff' : '#64748b',
                cursor: 'pointer', boxShadow: activeTab === tab ? '0 4px 12px rgba(26,115,232,0.2)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>Upcoming Appointments</h2>
              <Link to="/search" style={{
                background: '#1a73e8', color: '#fff', textDecoration: 'none',
                padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px'
              }}>
                + Book Appointment
              </Link>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {upcoming.length > 0 ? upcoming.map(app => (
                <div key={app._id} style={{
                  background: '#fff', padding: '24px', borderRadius: '20px',
                  border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ background: '#f0f6ff', padding: '16px', borderRadius: '16px' }}>
                      <Calendar color="#1a73e8" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>{app.reason}</h4>
                      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                        With Dr. {app.doctor?.user?.firstName} {app.doctor?.user?.lastName} at {app.clinic?.name}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', color: '#4a5568', fontSize: '13px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {new Date(app.dateTime).toLocaleDateString()} at {new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} /> {app.clinic?.address?.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-block', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700',
                      background: app.status === 'confirmed' ? '#ecfdf5' : '#fff7ed',
                      color: app.status === 'confirmed' ? '#059669' : '#c2410c',
                      marginBottom: '12px'
                    }}>
                      {app.status.toUpperCase()}
                    </div>

                    <div>
                      {app.paymentStatus === 'pending' && (
                        <button
                          onClick={() => handlePayment(app._id)}
                          disabled={paymentProcessing === app._id}
                          style={{
                            background: '#1a73e8', color: '#fff', border: 'none',
                            padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                            fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                          }}
                        >
                          <CreditCard size={14} /> {paymentProcessing === app._id ? 'Processing...' : 'Pay Now'}
                        </button>
                      )}
                      {app.paymentStatus === 'paid' && (
                        <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '20px', color: '#64748b' }}>
                  No upcoming appointments.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medical History Tab */}
        {activeTab === 'history' && (
          <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' }}>Medical & Dental History</h2>
            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ color: '#1a73e8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} /> Medical History
                </h4>
                {patientData?.medicalHistory?.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', color: '#4a5568' }}>
                    {patientData.medicalHistory.map((item, i) => (
                      <li key={i}>{item.condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#4a5568' }}>None reported</p>
                )}
              </div>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
                <h4 style={{ color: '#dc2626', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} /> Allergies
                </h4>
                <p style={{ color: '#4a5568' }}>
                  {Array.isArray(patientData?.allergies) ? patientData.allergies.join(', ') : (patientData?.allergies || 'None reported')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{ display: 'grid', gap: '32px' }}>
            {/* Reports Section */}
            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#1a73e8" /> Medical Reports
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {reports.length > 0 ? reports.map(report => (
                  <div key={report._id} style={{
                    background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ fontWeight: '700', color: '#1a1a2e' }}>{report.diagnosis}</h4>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>
                        {report.clinic?.name} | {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a 
                      href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/reports/${report._id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#f0f6ff', color: '#1a73e8', textDecoration: 'none',
                        padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      <Download size={14} /> PDF
                    </a>
                  </div>
                )) : (
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', color: '#64748b', textAlign: 'center' }}>
                    No reports found.
                  </div>
                )}
              </div>
            </section>

            {/* Images Section */}
            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#1a73e8" /> X-Rays & Imaging
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {images.length > 0 ? images.map(img => (
                  <div key={img._id} style={{
                    background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ height: '140px', background: '#f8fafc' }}>
                      <img 
                        src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${img.imageUrl}`} 
                        alt={img.imageType}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>{img.imageType}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(img.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ gridColumn: '1/-1', background: '#fff', padding: '20px', borderRadius: '16px', color: '#64748b', textAlign: 'center' }}>
                    No images found.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

      </div>

      {isEditOpen && (
        <EditProfileModal
          open={isEditOpen}
          user={patientData}
          onClose={() => setIsEditOpen(false)}
          onSave={(updated) => {
            setPatientData(updated);
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
}
