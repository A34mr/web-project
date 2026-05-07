import React, { useState } from 'react'

export default function PatientDetails({ onBack, onContinue, submitting }){
  const [data, setData] = useState({
    fullName:'', email:'', phone:'', password:'', confirmPassword:'', dob:'', gender:'', chronic:'', allergies:'', previous:'', emergency:''
  })

  const change = (k) => (e) => setData({...data, [k]: e.target.value})

  const submit = (e) => { e.preventDefault(); onContinue(data) }

  return (
    <form className="detail-form" onSubmit={submit}>
      <button type="button" className="link" onClick={onBack}>← Back</button>

      <label>Full Name</label>
      <input value={data.fullName} onChange={change('fullName')} placeholder="Full Name" />

      <label>Email</label>
      <input value={data.email} onChange={change('email')} placeholder="Email" />

      <label>Phone Number</label>
      <input value={data.phone} onChange={change('phone')} placeholder="Phone Number" />

      <label>Password</label>
      <input type="password" value={data.password} onChange={change('password')} placeholder="Password" />

      <label>Confirm Password</label>
      <input type="password" value={data.confirmPassword} onChange={change('confirmPassword')} placeholder="Confirm Password" />

      <label>Date of Birth</label>
      <input type="date" value={data.dob} onChange={change('dob')} />

      <label>Gender</label>
      <select value={data.gender} onChange={change('gender')}>
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label>Chronic Diseases</label>
      <input value={data.chronic} onChange={change('chronic')} placeholder="e.g. Diabetes, Hypertension" />

      <label>Allergies</label>
      <input value={data.allergies} onChange={change('allergies')} placeholder="e.g. Penicillin" />

      <label>Previous Dental Issues</label>
      <input value={data.previous} onChange={change('previous')} placeholder="e.g. Root canal, Extraction" />

      <label>Emergency Contact</label>
      <input value={data.emergency} onChange={change('emergency')} placeholder="Emergency phone number" />

      <div style={{marginTop:18}}>
        <button type="submit" className="primary" disabled={submitting}>Create Account 🎉</button>
      </div>
    </form>
  )
}
