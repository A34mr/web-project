import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  Building2, Users, Calendar, Settings,
  MapPin, Phone, Mail, Clock,
  ChevronRight, Plus, Search, Filter,
  TrendingUp, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

export default function ClinicDashboard() {
  const { user } = useAuth();
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isMissingClinic, setIsMissingClinic] = useState(false);
  const [clinicForm, setClinicForm] = useState({
    name: '', email: '', phone: '', licenseNumber: '', description: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' }
  });
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(false);

  const specialtiesList = ['General Dentist', 'Orthodontist', 'Oral Surgeon', 'Pediatric Dentist', 'Periodontist', 'Endodontist', 'Prosthodontist'];

  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        const clinicRes = await api.get('/api/clinics/my-clinic');
        if (clinicRes.data.success) {
          const clinicData = clinicRes.data.clinic;
          setClinic(clinicData);
          setDoctors(clinicData.doctors || []);
          setClinicForm({
            name: clinicData.name || '',
            email: clinicData.email || '',
            phone: clinicData.phone || '',
            licenseNumber: clinicData.licenseNumber || '',
            description: clinicData.description || '',
            address: {
              street: clinicData.address?.street || '',
              city: clinicData.address?.city || '',
              state: clinicData.address?.state || '',
              zipCode: clinicData.address?.zipCode || '',
              country: clinicData.address?.country || ''
            }
          });

          const aptRes = await api.get(`/api/appointments/clinic/${clinicData._id}`);
          if (aptRes.data.success) {
            setAppointments(aptRes.data.appointments || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch clinic data:', err);
        if (err.response?.status === 404) {
          setIsMissingClinic(true);
        } else {
          setError('Failed to connect to the server. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
  }, []);

  const handleUpdateClinic = async () => {
    try {
      const res = await api.put(`/api/clinics/${clinic._id}`, clinicForm);
      if (res.data.success) {
        setClinic(res.data.clinic);
        alert('Clinic settings updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update settings');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/appointments/${id}/${status}`);
      if (res.data.success) {
        const aptRes = await api.get(`/api/appointments/clinic/${clinic._id}`);
        setAppointments(aptRes.data.appointments);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleViewPatientHistory = async (patientId) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/clinics/patient/${patientId}/profile`);
      if (res.data.success) {
        setSelectedPatientProfile(res.data.profile);
        setViewingHistory(true);
      }
    } catch (err) {
      alert('Failed to fetch patient profile');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#f0fdf4', text: '#22c55e' };
      case 'pending': return { bg: '#fef3c7', text: '#f59e0b' };
      case 'completed': return { bg: '#eff6ff', text: '#1a73e8' };
      case 'cancelled': return { bg: '#fef2f2', text: '#ef4444' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#1a73e8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isMissingClinic) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ background: '#fff', padding: '48px', borderRadius: '32px', border: '1px solid #e2e8f0', maxWidth: '600px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '80px', height: '80px', background: '#fef2f2', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 24px' }}>
            <Building2 size={40} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Clinic Profile Not Found</h2>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
            It seems you haven't completed your clinic profile yet. To start managing your clinic, we need a few more details.
          </p>
          <button
            onClick={() => setActiveTab('settings')}
            style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            Complete Clinic Setup
          </button>
        </div>

        {activeTab === 'settings' && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#fff', zIndex: 2000, overflowY: 'auto', padding: '40px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Setup Your Clinic</h1>
                <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
              </div>
              {/* Reuse Settings component or logic here */}
              <div style={settingsCardStyle}>
                <h3 style={settingsSectionTitleStyle}>General Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Clinic Name</label>
                    <input value={clinicForm.name} onChange={e => setClinicForm({ ...clinicForm, name: e.target.value })} style={settingsInputStyle} placeholder="Enter clinic name" />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Email Address</label>
                    <input value={clinicForm.email} onChange={e => setClinicForm({ ...clinicForm, email: e.target.value })} style={settingsInputStyle} placeholder="clinic@example.com" />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Phone Number</label>
                    <input value={clinicForm.phone} onChange={e => setClinicForm({ ...clinicForm, phone: e.target.value })} style={settingsInputStyle} placeholder="+1 234 567 890" />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>License Number</label>
                    <input value={clinicForm.licenseNumber} onChange={e => setClinicForm({ ...clinicForm, licenseNumber: e.target.value })} style={settingsInputStyle} placeholder="LIC-12345" />
                  </div>
                </div>
                <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea value={clinicForm.description} onChange={e => setClinicForm({ ...clinicForm, description: e.target.value })} rows="4" style={{ ...settingsInputStyle, resize: 'none' }} placeholder="Describe your clinic..." />
                </div>

                <h3 style={{ ...settingsSectionTitleStyle, marginTop: '32px' }}>Address</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Street Address</label>
                    <input value={clinicForm.address.street} onChange={e => setClinicForm({ ...clinicForm, address: { ...clinicForm.address, street: e.target.value } })} style={settingsInputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>City</label>
                    <input value={clinicForm.address.city} onChange={e => setClinicForm({ ...clinicForm, address: { ...clinicForm.address, city: e.target.value } })} style={settingsInputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>State/Province</label>
                    <input value={clinicForm.address.state} onChange={e => setClinicForm({ ...clinicForm, address: { ...clinicForm.address, state: e.target.value } })} style={settingsInputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Zip/Postal Code</label>
                    <input value={clinicForm.address.zipCode} onChange={e => setClinicForm({ ...clinicForm, address: { ...clinicForm.address, zipCode: e.target.value } })} style={settingsInputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Country</label>
                    <input value={clinicForm.address.country} onChange={e => setClinicForm({ ...clinicForm, address: { ...clinicForm.address, country: e.target.value } })} style={settingsInputStyle} placeholder="e.g. Lebanon" />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const { name, email, phone, licenseNumber, address } = clinicForm;
                    if (!name || !email || !phone || !licenseNumber || !address.street || !address.city || !address.state || !address.zipCode || !address.country) {
                      alert('Please fill in all required fields including address details.');
                      return;
                    }

                    try {
                      const payload = { ...clinicForm, location: { coordinates: [0, 0] } };
                      const res = await api.post('/api/clinics', payload);
                      if (res.data.success) {
                        alert('Clinic created successfully!');
                        window.location.reload();
                      }
                    } catch (err) {
                      const msg = err.response?.data?.message || 'Failed to create clinic. Make sure the license number is unique.';
                      alert(msg);
                    }
                  }}
                  style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '16px', fontWeight: '700', marginTop: '32px', cursor: 'pointer', width: '100%' }}
                >
                  Register Clinic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Building2 size={24} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#1e293b' }}>Clinic Hub</span>
        </div>

        <SidebarLink icon={<TrendingUp size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <SidebarLink icon={<Users size={20} />} label="Doctors" active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
        <SidebarLink icon={<Calendar size={20} />} label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
        <SidebarLink icon={<Sparkles size={20} />} label="AI Vision" active={activeTab === 'ai'} onClick={() => window.location.href = '/ai-diagnosis'} />
        <SidebarLink icon={<Settings size={20} />} label="Clinic Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
              Welcome back, {user?.firstName}!
            </h1>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Managing {clinic?.name || 'your clinic'}</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: '#fff', padding: '12px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: clinic?.isVerified ? '#22c55e' : '#f59e0b' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                {clinic?.isVerified ? 'Verified Clinic' : 'Verification Pending'}
              </span>
            </div>
          </div>
        </div>

        {activeTab === 'appointments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>Appointments</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    placeholder="Search patient..."
                    style={{ padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', width: '240px' }}
                  />
                </div>
                <button style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                  <Filter size={18} /> Filter
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={tableHeaderStyle}>Patient</th>
                    <th style={tableHeaderStyle}>Doctor</th>
                    <th style={tableHeaderStyle}>Date & Time</th>
                    <th style={tableHeaderStyle}>Reason</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, i) => (
                    <tr key={i} style={{ borderBottom: i === appointments.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <td style={tableCellStyle}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{apt.patient?.firstName} {apt.patient?.lastName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.patient?.email}</div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ color: '#475569', fontSize: '14px' }}>Dr. {apt.doctor?.user?.lastName}</div>
                        <div style={{ fontSize: '12px', color: '#1a73e8' }}>{apt.doctor?.specialty}</div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ color: '#1e293b', fontWeight: '500', fontSize: '14px' }}>
                          {new Date(apt.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {new Date(apt.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ color: '#475569', fontSize: '14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {apt.reason}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{
                          padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize',
                          background: getStatusColor(apt.status).bg,
                          color: getStatusColor(apt.status).text
                        }}>
                          {apt.status}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(apt._id, 'confirm')}
                              style={actionButtonStyle('#22c55e')}
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(apt._id, 'complete')}
                              style={actionButtonStyle('#1a73e8')}
                            >
                              Complete
                            </button>
                          )}
                          {(apt.status === 'pending' || apt.status === 'confirmed') && (
                            <button
                              onClick={() => handleUpdateStatus(apt._id, 'cancel')}
                              style={actionButtonStyle('#ef4444')}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleViewPatientHistory(apt.patient?._id)}
                            style={actionButtonStyle('#8b5cf6')}
                          >
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>Manage Doctors</h2>
              <button
                onClick={() => setIsAddDoctorOpen(true)}
                style={{
                  background: '#1a73e8', color: '#fff', border: 'none', padding: '12px 24px',
                  borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                }}
              >
                <Plus size={20} /> Add New Doctor
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {doctors.map((doc, i) => (
                <div key={i} style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a73e8', fontSize: '24px', fontWeight: '700' }}>
                    {doc.user?.firstName?.[0] || 'D'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Dr. {doc.user?.firstName} {doc.user?.lastName}</h3>
                    <p style={{ color: '#1a73e8', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{doc.specialty}</p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>{doc.licenseNumber}</p>
                  </div>
                  <ChevronRight size={20} color="#cbd5e1" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>Clinic Settings</h2>
              <button
                onClick={handleUpdateClinic}
                style={{
                  background: '#1a73e8', color: '#fff', border: 'none', padding: '12px 32px',
                  borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>

            <div style={{ display: 'grid', gap: '32px' }}>
              <div style={settingsCardStyle}>
                <h3 style={settingsSectionTitleStyle}>General Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Clinic Name</label>
                    <input value={clinicForm.name} onChange={e => setClinicForm({ ...clinicForm, name: e.target.value })} style={settingsInputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Email Address</label>
                    <input value={clinicForm.email} onChange={e => setClinicForm({ ...clinicForm, email: e.target.value })} style={settingsInputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Phone Number</label>
                    <input value={clinicForm.phone} onChange={e => setClinicForm({ ...clinicForm, phone: e.target.value })} style={settingsInputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>License Number</label>
                    <input value={clinicForm.licenseNumber} disabled style={{ ...settingsInputStyle, background: '#f1f5f9' }} />
                  </div>
                </div>
                <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea value={clinicForm.description} onChange={e => setClinicForm({ ...clinicForm, description: e.target.value })} rows="4" style={{ ...settingsInputStyle, resize: 'none' }} />
                </div>
              </div>

              <div style={settingsCardStyle}>
                <h3 style={settingsSectionTitleStyle}>Address & Location</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Street Address</label>
                    <input value={clinicForm.address.street} onChange={e => setClinicForm({ ...clinicForm, address: { ...clinicForm.address, street: e.target.value } })} style={settingsInputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>City</label>
                    <input value={clinicForm.address.city} onChange={e => setClinicForm({ ...clinicForm, address: { ...clinicForm.address, city: e.target.value } })} style={settingsInputStyle} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <StatCard icon={<Users color="#1a73e8" />} label="Total Doctors" value={doctors.length} trend="+2 this month" />
            <StatCard icon={<Calendar color="#8b5cf6" />} label="New Appointments" value={appointments.length} trend="+12% from last week" />
            <StatCard icon={<CheckCircle2 color="#22c55e" />} label="Completed Visits" value="142" trend="+5.4%" />

            <div style={{ gridColumn: 'span 2', background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Clinic Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <InfoItem icon={<MapPin size={18} />} label="Address" value={clinic?.address ? `${clinic.address.street}, ${clinic.address.city}` : 'Not set'} />
                <InfoItem icon={<Phone size={18} />} label="Contact" value={clinic?.phone} />
                <InfoItem icon={<Mail size={18} />} label="Email" value={clinic?.email} />
                <InfoItem icon={<Clock size={18} />} label="Working Hours" value="9:00 AM - 6:00 PM" />
              </div>
            </div>
          </div>
        )}
      </div>

      {isAddDoctorOpen && (
        <AddDoctorModal
          specialties={specialtiesList}
          onClose={() => setIsAddDoctorOpen(false)}
          onSave={async (doctor) => {
            try {
              const res = await api.post(`/api/clinics/${clinic._id}/doctors`, doctor);
              if (res.data.success) {
                const clinicRes = await api.get('/api/clinics/my-clinic');
                setDoctors(clinicRes.data.clinic.doctors || []);
                setIsAddDoctorOpen(false);
              }
            } catch (err) {
              alert(err.response?.data?.message || 'Failed to add doctor');
            }
          }}
        />
      )}

      {viewingHistory && selectedPatientProfile && (
        <PatientHistoryModal
          profile={selectedPatientProfile}
          onClose={() => {
            setViewingHistory(false);
            setSelectedPatientProfile(null);
          }}
        />
      )}
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', background: active ? '#eff6ff' : 'transparent', color: active ? '#1a73e8' : '#64748b', fontWeight: active ? '600' : '500' }}>
      {icon}
      <span>{label}</span>
      {active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#1a73e8' }} />}
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div style={{ padding: '12px', borderRadius: '12px', background: '#f8fafc' }}>{icon}</div>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e', background: '#f0fdf4', padding: '4px 8px', borderRadius: '6px' }}>{trend}</span>
      </div>
      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>{value}</div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ color: '#1a73e8' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>{value || 'Not set'}</div>
      </div>
    </div>
  );
}

function PatientHistoryModal({ profile, onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '32px', width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>Patient History</h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>{profile.user?.firstName} {profile.user?.lastName}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gap: '32px' }}>
          <section>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Medical Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '24px', borderRadius: '20px' }}>
              <ProfileItem label="Gender" value={profile.gender} />
              <ProfileItem label="Date of Birth" value={new Date(profile.dob).toLocaleDateString()} />
              <ProfileItem label="Allergies" value={profile.allergies || 'None'} />
              <ProfileItem label="Chronic Diseases" value={profile.chronic || 'None'} />
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Dental History</h3>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px' }}>
              <p style={{ color: '#334155', fontSize: '15px', lineHeight: '1.6' }}>{profile.dentalIssues || 'No previous dental issues recorded.'}</p>
            </div>
          </section>

          {profile.medicalHistory?.length > 0 && (
            <section>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Treatment Records</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {profile.medicalHistory.map((h, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{h.diagnosis}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{h.treatment}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(h.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Emergency Contact</h3>
            <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#dc2626' }}>
                <Phone size={18} />
                <span style={{ fontWeight: '600' }}>{profile.emergency || 'Not provided'}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{value || 'N/A'}</div>
    </div>
  );
}

function AddDoctorModal({ specialties, onClose, onSave }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', specialty: '', licenseNumber: '' });
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', width: '500px', maxWidth: '90%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Add New Doctor</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input placeholder="First Name" style={modalInputStyle} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <input placeholder="Last Name" style={modalInputStyle} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <input placeholder="Email" type="email" style={modalInputStyle} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" style={modalInputStyle} onChange={e => setForm({ ...form, password: e.target.value })} />
          <select style={modalInputStyle} onChange={e => setForm({ ...form, specialty: e.target.value })}>
            <option value="">Select Specialty</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="License Number" style={modalInputStyle} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} />
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => onSave(form)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#1a73e8', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Add Doctor</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const tableHeaderStyle = { textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tableCellStyle = { padding: '20px 24px', verticalAlign: 'middle' };
const actionButtonStyle = (color) => ({ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${color}`, background: 'transparent', color: color, fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' });
const modalInputStyle = { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', width: '100%', boxSizing: 'border-box' };
const settingsCardStyle = { background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' };
const settingsSectionTitleStyle = { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#64748b' };
const settingsInputStyle = { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '15px', color: '#1e293b', width: '100%', boxSizing: 'border-box' };
