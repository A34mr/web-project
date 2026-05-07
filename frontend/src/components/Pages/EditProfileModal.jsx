// src/components/Pages/EditProfileModal.jsx
import React, { useState } from 'react';

/**
 * Modal component for editing a user's profile.
 * Props:
 *   open (bool)      – whether the modal is visible
 *   onClose (func)   – called when the modal should be dismissed
 *   user (object)    – current user data (e.g., { name, email })
 *   onSave (func)    – called with updated data when the form is submitted
 */
export default function EditProfileModal({ open, onClose, user = {}, onSave }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={contentStyle}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={fieldStyle}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button type="button" onClick={onClose} style={buttonStyle}>Cancel</button>
            <button type="submit" style={buttonStyle}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Inline styles – replace with your design system or CSS classes as needed.
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const contentStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  minWidth: '300px',
  maxWidth: '90%',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1rem',
};

const buttonStyle = {
  marginLeft: '0.5rem',
  padding: '0.5rem 1rem',
  border: 'none',
  background: '#1976d2',
  color: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
};
