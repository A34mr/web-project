import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, Save, User as UserIcon, Mail, Phone, Calendar, Heart } from 'lucide-react';

export default function EditProfileModal({ open, onClose, user = {}, onSave }) {
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    dob: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user.gender || '',
    allergies: Array.isArray(user.allergies) ? user.allergies.join(', ') : (user.allergies || '')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        allergies: Array.isArray(user.allergies) ? user.allergies.join(', ') : (user.allergies || '')
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/api/auth/me', form);
      if (response.data.success) {
        // Merge user and profile back for the parent component
        const updated = {
          ...response.data.user,
          ...response.data.profile
        };
        onSave(updated);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>Edit Profile</h2>
          <button onClick={onClose} style={closeButtonStyle}><X size={20} /></button>
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}><UserIcon size={14} /> First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} style={inputStyle} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}><UserIcon size={14} /> Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} style={inputStyle} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}><Mail size={14} /> Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}><Phone size={14} /> Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}><Calendar size={14} /> Date of Birth</label>
            <input name="dob" type="date" value={form.dob} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ ...fieldStyle, gridColumn: 'span 2' }}>
            <label style={labelStyle}><Heart size={14} /> Allergies (comma separated)</label>
            <input name="allergies" value={form.allergies} onChange={handleChange} style={inputStyle} placeholder="e.g. Penicillin, Peanuts" />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={secondaryButtonStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={primaryButtonStyle}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};

const contentStyle = {
  background: '#fff', padding: '32px', borderRadius: '24px',
  width: '600px', maxWidth: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

const headerStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px',
};

const closeButtonStyle = {
  background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b',
};

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' };
const inputStyle = {
  padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0',
  fontSize: '15px', outline: 'none', background: '#f8fafc',
};

const primaryButtonStyle = {
  flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
  background: '#1a73e8', color: '#fff', fontWeight: '600', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
};

const secondaryButtonStyle = {
  padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0',
  background: '#fff', color: '#64748b', fontWeight: '600', cursor: 'pointer',
};
