import React, { useState } from 'react'

export default function DoctorDetails({ onBack, onContinue, submitting }){
  const [data, setData] = useState({
    fullName:'', email:'', phone:'', password:'', confirmPassword:'', gender:'', specialty:'', years:'', license:'', workingDays:[]
  })

  const change = (k) => (e) => setData({...data, [k]: e.target.value})

  const toggleDay = (day) => {
    const has = data.workingDays.includes(day)
    setData({...data, workingDays: has ? data.workingDays.filter(d=>d!==day) : [...data.workingDays, day]})
  }

  const submit = (e) => { e.preventDefault(); onContinue(data) }

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

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

      <label>Gender</label>
      <select value={data.gender} onChange={change('gender')}>
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label>Specialty</label>
      <input value={data.specialty} onChange={change('specialty')} placeholder="Select specialty" />

      <label>Years of Experience</label>
      <input value={data.years} onChange={change('years')} placeholder="Years of Experience" />

      <label>Medical License Number</label>
      <input value={data.license} onChange={change('license')} placeholder="Medical License Number" />

      <label>Available Working Days</label>
      <div className="days">
        {days.map(d => (
          <button type="button" key={d} className={data.workingDays.includes(d)?'pill active':'pill'} onClick={()=>toggleDay(d)}>{d}</button>
        ))}
      </div>

      <div style={{marginTop:18}}>
        <button type="submit" className="primary" disabled={submitting}>Create Account 🎉</button>
      </div>
    </form>
  )
}
