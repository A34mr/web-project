import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function ClinicSearch() {
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    specialty: '',
    priceRange: ''
  })

  useEffect(() => {
    fetchClinics()
  }, [])

  const fetchClinics = async (customFilters = filters) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (customFilters.search) params.append('search', customFilters.search)
      if (customFilters.city) params.append('city', customFilters.city)
      if (customFilters.specialty) params.append('specialty', customFilters.specialty)
      if (customFilters.priceRange) params.append('priceRange', customFilters.priceRange)

      const response = await api.get(`/api/clinics?${params.toString()}`)
      if (response.data.success) {
        setClinics(response.data.clinics)
      }
    } catch (error) {
      console.error('Fetch clinics error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchClinics()
  }

  return (
    <div className="clinic-search-page" style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a2e', marginBottom: '16px' }}>
          Find Your <span style={{ color: '#1a73e8' }}>Perfect Clinic</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Search through our verified dental clinics and book your appointment in seconds.
        </p>
      </header>

      {/* Filters Section */}
      <section style={{
        background: '#fff', padding: '24px', borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '40px'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Search Name</label>
            <input
              type="text"
              name="search"
              placeholder="Clinic name..."
              value={filters.search}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>City</label>
            <input
              type="text"
              name="city"
              placeholder="e.g. New York"
              value={filters.city}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Specialty</label>
            <select
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            >
              <option value="">All Specialties</option>
              <option value="General Dentist">General Dentist</option>
              <option value="Orthodontist">Orthodontist</option>
              <option value="Oral Surgeon">Oral Surgeon</option>
              <option value="Pediatric Dentist">Pediatric Dentist</option>
            </select>
          </div>
          <button type="submit" style={{
            background: '#1a73e8', color: '#fff', border: 'none', padding: '12px 24px',
            borderRadius: '8px', fontWeight: '600', cursor: 'pointer', height: '48px'
          }}>
            Search Now
          </button>
        </form>
      </section>

      {/* Results Section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading clinics...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {clinics.length > 0 ? clinics.map(clinic => (
            <div key={clinic._id} style={{
              background: '#fff', borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              <div style={{ height: '180px', background: '#e2e8f0', position: 'relative' }}>
                <img
                  src={clinic.images && clinic.images[0] ? clinic.images[0] : 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=400&q=80'}
                  alt={clinic.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px',
                  fontSize: '12px', fontWeight: '700', color: '#1a73e8'
                }}>
                  ★ {clinic.rating?.average || 0}
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>{clinic.name}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📍 {clinic.address.city}, {clinic.address.state}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {clinic.specialties.slice(0, 3).map(s => (
                    <span key={s} style={{
                      fontSize: '11px', background: '#f0f6ff', color: '#1a73e8',
                      padding: '2px 8px', borderRadius: '100px', fontWeight: '500'
                    }}>{s}</span>
                  ))}
                </div>
                <Link to={`/clinic/${clinic._id}`} style={{
                  display: 'block', textAlign: 'center', background: '#f0f6ff', color: '#1a73e8',
                  textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                  onMouseEnter={e => e.target.style.background = '#e0edff'}
                  onMouseLeave={e => e.target.style.background = '#f0f6ff'}
                >
                  View Details
                </Link>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No clinics found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
