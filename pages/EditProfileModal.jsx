import { useState } from "react";
export default function EditProfileModal({ data, onClose, onSave }) {
  const [form, setForm] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="icon-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div>
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div>
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} />
            </div>

            <div>
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div>
              <label>Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} />
            </div>

            <div>
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label>Blood Type</label>
              <select name="blood" value={form.blood} onChange={handleChange}>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option>
                <option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}