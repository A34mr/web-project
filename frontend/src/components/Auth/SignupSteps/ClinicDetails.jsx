import React, { useState } from 'react'

export default function ClinicDetails({ onBack, onContinue, submitting }){
  const [data, setData] = useState({ name:'', email:'', phone:'', address:'', license: '', password:'', confirmPassword:'' })
  const change = (k) => (e) => setData({...data, [k]: e.target.value})
  const submit = (e) => { e.preventDefault(); onContinue(data) }

  return (
    <form className="detail-form" onSubmit={submit}>
      <button type="button" className="link" onClick={onBack}>← Back</button>

      <label>Clinic Name</label>
      <input value={data.name} onChange={change('name')} placeholder="Clinic name" />

      <label>Email</label>
      <input value={data.email} onChange={change('email')} placeholder="Email" />

      <label>Phone Number</label>
      <input value={data.phone} onChange={change('phone')} placeholder="Phone Number" />

      <label>Address</label>
      <input value={data.address} onChange={change('address')} placeholder="Address" />
      
      <label>License Number</label>
      <input value={data.license} onChange={change('license')} placeholder="e.g. LIC-12345" />

      <label>Password</label>
      <input type="password" value={data.password} onChange={change('password')} placeholder="Password" />

      <label>Confirm Password</label>
      <input type="password" value={data.confirmPassword} onChange={change('confirmPassword')} placeholder="Confirm Password" />

      <div style={{marginTop:18}}>
        <button type="submit" className="primary" disabled={submitting}>Create Account 🎉</button>
      </div>
    </form>
  )
}
