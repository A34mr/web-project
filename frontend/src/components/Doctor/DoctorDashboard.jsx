import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Users, CheckCircle, MessageSquare, Plus, Star, MapPin, Mail, Phone, ChevronRight } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [loading, setLoading] = useState(true)
  const [showAddSlot, setShowAddSlot] = useState(false)
  const [newSlot, setNewSlot] = useState({
    dateTime: '',
    reason: 'General Checkup',
    duration: 30
  })

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/appointments/my-appointments') // Need to check if doctor has different endpoint
      if (response.data.success) {
        setAppointments(response.data.appointments)
      }
    } catch (error) {
      console.error('Fetch appointments error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    try {
      await api.put(`/api/appointments/${id}/complete`)
      fetchAppointments()
    } catch (error) {
      alert('Failed to complete appointment')
    }
  }

  const handleAddSlot = async (e) => {
    e.preventDefault()
    // This would normally call an endpoint to create an available slot
    // For now, we'll simulate or use the existing booking endpoint if applicable
    alert('Slot added successfully!')
    setShowAddSlot(false)
  }

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading dashboard...</div>

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e56e3, #1545b8)', 
          borderRadius: '24px', padding: '32px', color: '#fff', 
          marginBottom: '32px', boxShadow: '0 10px 30px rgba(30,86,227,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.2)',
              overflow: 'hidden'
            }}>
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Dr. {user?.firstName} {user?.lastName}</h1>
              <p style={{ opacity: 0.9, fontSize: '15px' }}>Dental Implants & Cosmetic Dentistry Consultant</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={14} fill="#fbbf24" color="#fbbf24" /> 4.9 Rating
                </span>
                <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px' }}>
                  15 Years Experience
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowAddSlot(true)}
            style={{ 
              background: '#fff', color: '#1e56e3', border: 'none', 
              padding: '12px 24px', borderRadius: '12px', fontWeight: '700', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
            }}
          >
            <Plus size={20} /> Add Available Slot
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Today', val: '4 Appointments', icon: <Calendar />, color: '#1a73e8' },
            { label: 'Completed', val: '120 Total', icon: <CheckCircle />, color: '#10b981' },
            { label: 'Patients', val: '458 Total', icon: <Users />, color: '#8b5cf6' },
            { label: 'Next Appt', val: 'In 45 mins', icon: <Clock />, color: '#f59e0b' }
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: stat.color, marginBottom: '12px' }}>{stat.icon}</div>
              <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', marginTop: '4px' }}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Appointments Section */}
        <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
            {['upcoming', 'today', 'patients'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  flex: 1, padding: '20px', border: 'none', background: activeTab === tab ? '#f8fafc' : '#fff',
                  color: activeTab === tab ? '#1e56e3' : '#64748b', fontWeight: '700', cursor: 'pointer',
                  borderBottom: activeTab === tab ? '3px solid #1e56e3' : '3px solid transparent'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              {appointments.length > 0 ? appointments.map(app => (
                <div key={app._id} style={{ 
                  background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'border-color 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1e56e3'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#f1f5f9'}
                >
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1e56e3', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                      {app.patient?.firstName?.[0]}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '700', color: '#1a1a2e' }}>{app.patient?.firstName} {app.patient?.lastName}</h4>
                      <p style={{ fontSize: '13px', color: '#1e56e3', fontWeight: '600' }}>{app.reason}</p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        <span>📅 {new Date(app.dateTime).toLocaleDateString()}</span>
                        <span>⏰ {new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => navigate(`/chat/${app.patient?._id}`)}
                      style={{ background: '#f0f6ff', color: '#1e56e3', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
                    >
                      <MessageSquare size={16} /> Chat
                    </button>
                    {app.status !== 'completed' && (
                      <button 
                        onClick={() => handleComplete(app._id)}
                        style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No appointments found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddSlot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Add Available Slot</h2>
            <form onSubmit={handleAddSlot}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Date & Time</label>
                <input 
                  type="datetime-local" 
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                  value={newSlot.dateTime}
                  onChange={e => setNewSlot({...newSlot, dateTime: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Service Type</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option>General Checkup</option>
                  <option>Dental Cleaning</option>
                  <option>Orthodontics</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowAddSlot(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#1e56e3', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}