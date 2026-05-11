import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Search, ShieldCheck } from 'lucide-react'
import api from '../../services/api'

export default function AdminDashboard() {
  const [pendingClinics, setPendingClinics] = useState([])
  const [stats, setStats] = useState({ totalClinics: 0, pendingRequests: 0, activeDoctors: 0 })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const clinicsRes = await api.get('/api/clinics')
      if (clinicsRes.data.success) {
        const clinics = clinicsRes.data.clinics
        setPendingClinics(clinics.filter(c => !c.isVerified))
        setStats({
          totalClinics: clinics.length,
          pendingRequests: clinics.filter(c => !c.isVerified).length,
          activeDoctors: 0 // Mock or fetch from doctors API
        })
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const response = await api.put(`/api/clinics/${id}/approve`)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Clinic approved successfully!' })
        fetchDashboardData()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve clinic' })
    }
  }

  return (
    <div className="admin-dashboard" style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={36} color="#1a73e8" /> System Administration
          </h1>
          <p style={{ color: '#64748b' }}>Manage clinic registrations and system requests.</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Clinics', value: stats.totalClinics, color: '#1a73e8' },
          { label: 'Pending Requests', value: stats.pendingRequests, color: '#f59e0b' },
          { label: 'System Health', value: 'Active', color: '#10b981' }
        ].map(stat => (
          <div key={stat.label} style={{ 
            background: '#fff', padding: '24px', borderRadius: '16px', 
            border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
          }}>
            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>{stat.label}</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {message.text && (
        <div style={{ 
          padding: '16px', borderRadius: '12px', marginBottom: '24px',
          background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: message.type === 'success' ? '#059669' : '#dc2626',
          fontWeight: '600'
        }}>
          {message.type === 'success' ? '✓ ' : '✕ '}{message.text}
        </div>
      )}

      {/* Pending Requests Table */}
      <section style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>Pending Clinic Approvals</h2>
          <span style={{ fontSize: '13px', color: '#1a73e8', fontWeight: '600', background: '#f0f6ff', padding: '4px 12px', borderRadius: '100px' }}>
            {pendingClinics.length} New Requests
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>CLINIC NAME</th>
                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>LICENSE NO.</th>
                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>CITY</th>
                <th style={{ textAlign: 'center', padding: '16px 24px', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {pendingClinics.length > 0 ? pendingClinics.map(clinic => (
                <tr key={clinic._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: '600', color: '#1a1a2e' }}>{clinic.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{clinic.email}</div>
                  </td>
                  <td style={{ padding: '20px 24px', color: '#4a5568', fontSize: '14px' }}>{clinic.licenseNumber}</td>
                  <td style={{ padding: '20px 24px', color: '#4a5568', fontSize: '14px' }}>{clinic.address.city}</td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleApprove(clinic._id)}
                        style={{ 
                          background: '#10b981', color: '#fff', border: 'none', 
                          padding: '8px 16px', borderRadius: '6px', fontSize: '13px', 
                          fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button style={{ 
                        background: '#fef2f2', color: '#dc2626', border: 'none', 
                        padding: '8px 16px', borderRadius: '6px', fontSize: '13px', 
                        fontWeight: '600', cursor: 'pointer'
                      }}>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    <Clock size={40} color="#e2e8f0" style={{ marginBottom: '12px' }} />
                    <p>No pending registration requests at the moment.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
