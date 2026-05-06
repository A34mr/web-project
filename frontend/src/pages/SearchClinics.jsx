import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const SearchClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    specialty: '',
    minRating: '',
    maxPrice: '',
    useLocation: false
  });
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchClinics();
  }, [filters]);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (location) {
        params.append('lat', location.lat);
        params.append('lng', location.lng);
      }

      const response = await api.get(`/clinics?${params.toString()}`);
      setClinics(response.data);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setFilters({ ...filters, useLocation: true });
        },
        (error) => {
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="search-clinics">
      <h1>Find a Clinic</h1>
      
      <div className="filters">
        <button onClick={handleLocation} className="location-btn">
          📍 Use My Location
        </button>
        
        <input
          type="text"
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleFilterChange}
        />
        
        <select
          name="specialty"
          value={filters.specialty}
          onChange={handleFilterChange}
        >
          <option value="">All Specialties</option>
          <option value="General Dentistry">General Dentistry</option>
          <option value="Orthodontics">Orthodontics</option>
          <option value="Oral Surgery">Oral Surgery</option>
          <option value="Pediatric Dentistry">Pediatric Dentistry</option>
          <option value="Endodontics">Endodontics</option>
          <option value="Periodontics">Periodontics</option>
        </select>
        
        <input
          type="number"
          name="minRating"
          placeholder="Min Rating (1-5)"
          min="1"
          max="5"
          value={filters.minRating}
          onChange={handleFilterChange}
        />
        
        <select
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        >
          <option value="">Any Price</option>
          <option value="$">$ - Budget Friendly</option>
          <option value="$$">$$ - Moderate</option>
          <option value="$$$">$$$ - Premium</option>
        </select>
      </div>

      {loading ? (
        <p>Loading clinics...</p>
      ) : clinics.length === 0 ? (
        <p>No clinics found matching your criteria.</p>
      ) : (
        <div className="clinics-grid">
          {clinics.map((clinic) => (
            <div key={clinic._id} className="clinic-card">
              <h3>{clinic.name}</h3>
              <p>📍 {clinic.address}</p>
              <p>⭐ {clinic.ratingAvg || 'New'} ({clinic.reviewCount || 0} reviews)</p>
              <p>💰 {clinic.priceRange || 'Not specified'}</p>
              <p>🏥 {clinic.specialties?.join(', ') || 'General Dentistry'}</p>
              {clinic.distance && (
                <p>📏 {(clinic.distance / 1000).toFixed(2)} km away</p>
              )}
              <Link to={`/patient/clinic/${clinic._id}`} className="btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchClinics;
