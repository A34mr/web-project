import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function ClinicDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [clinic, setClinic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    doctorId: '',
    dateTime: '',
    reason: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchClinicDetails()
  }, [id])

  const fetchClinicDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/clinics/${id}`)
      if (response.data.success) {
        setClinic(response.data.clinic)
      }
    } catch (error) {
      console.error('Fetch clinic details error:', error)
      setMessage({ type: 'error', text: 'Failed to load clinic details' })
    } finally {
      setLoading(false)
    }
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({ ...prev, [name]: value }))
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.post('/api/appointments', {
        ...bookingData,
        clinicId: id
      })
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Appointment booked! Redirecting to payment...' })
        setTimeout(() => {
          navigate('/patient/dashboard')
        }, 2000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Booking failed' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading clinic details...</div>
  if (!clinic) return <div style={{ padding: '100px', textAlign: 'center' }}>Clinic not found</div>

  return (
    <div className="clinic-details-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ background: '#e0edff', color: '#1a73e8', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' }}>
              VERIFIED CLINIC
            </span>
            <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
              ★ {clinic.rating?.average || 0} ({clinic.rating?.count || 0} reviews)
            </div>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a2e', marginBottom: '16px' }}>{clinic.name}</h1>
          <p style={{ color: '#64748b', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>{clinic.description}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4a5568' }}>
              <MapPin size={20} color="#1a73e8" />
              <span>{clinic.address.street}, {clinic.address.city}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4a5568' }}>
              <Phone size={20} color="#1a73e8" />
              <span>{clinic.phone}</span>
            </div>
          </div>
        </div>
        
        <div style={{ width: '400px', height: '300px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
          <img 
            src={clinic.images && clinic.images[0] ? clinic.images[0] : 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&q=80'} 
            alt={clinic.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Left Column: Doctors & Services */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Award color="#1a73e8" /> Our Specialists
          </h2>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
            {clinic.doctors && clinic.doctors.length > 0 ? clinic.doctors.map(doctor => (
              <div key={doctor._id} style={{ 
                background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', gap: '20px'
              }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0f6ff', overflow: 'hidden' }}>
                  <img src={doctor.user?.avatar || 'https://i.pravatar.cc/150?u=' + doctor._id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', color: '#1a1a2e' }}>Dr. {doctor.user?.firstName} {doctor.user?.lastName}</h4>
                  <p style={{ fontSize: '14px', color: '#1a73e8', fontWeight: '600' }}>{doctor.specialty}</p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{doctor.yearsOfExperience} years experience</p>
                </div>
              </div>
            )) : (
              <p style={{ color: '#64748b' }}>No doctors listed for this clinic yet.</p>
            )}
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' }}>Services</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {clinic.specialties.map(s => (
              <div key={s} style={{ 
                background: '#fff', border: '1px solid #e2e8f0', padding: '12px 20px', 
                borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                color: '#4a5568', fontWeight: '600'
              }}>
                <CheckCircle size={16} color="#10b981" /> {s}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div>
          <div style={{ 
            background: '#fff', padding: '32px', borderRadius: '24px', 
            border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            position: 'sticky', top: '100px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar color="#1a73e8" /> Book Appointment
            </h3>
            
            {message.text && (
              <div style={{ 
                padding: '12px', borderRadius: '8px', marginBottom: '20px',
                background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: message.type === 'success' ? '#059669' : '#dc2626',
                fontSize: '14px'
              }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Select Doctor</label>
                <select 
                  name="doctorId" 
                  required 
                  value={bookingData.doctorId}
                  onChange={handleBookingChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                >
                  <option value="">Choose a doctor...</option>
                  {clinic.doctors?.map(d => (
                    <option key={d._id} value={d._id}>Dr. {d.user?.firstName} {d.user?.lastName}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Date & Time</label>
                <input 
                  type="datetime-local" 
                  name="dateTime"
                  required
                  value={bookingData.dateTime}
                  onChange={handleBookingChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Reason for Visit</label>
                <input 
                  type="text" 
                  name="reason"
                  placeholder="e.g. Toothache, Cleaning"
                  required
                  value={bookingData.reason}
                  onChange={handleBookingChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                style={{ 
                  width: '100%', background: '#1a73e8', color: '#fff', border: 'none', 
                  padding: '14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer',
                  marginTop: '10px', transition: 'background 0.2s', opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Processing...' : 'Confirm Booking'}
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '16px' }}>
                No immediate payment required to book.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
