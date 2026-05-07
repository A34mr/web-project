import React from 'react'

const Option = ({label, desc, value, onClick, active}) => (
  <div className={`acct-option ${active? 'active':''}`} onClick={()=>onClick(value)}>
    <div className="icon">👤</div>
    <div>
      <div className="label">{label}</div>
      <div className="muted small">{desc}</div>
    </div>
  </div>
)

export default function AccountType({ value='patient', onChange, onContinue }){
  return (
    <div>
      <h3>Who are you?</h3>
      <p className="muted">Select your account type to get started</p>

      <div className="acct-list">
        <Option label="Patient" desc="Book appointments & manage your health" value="patient" onClick={onChange} active={value==='patient'} />
        <Option label="Doctor" desc="Manage your practice & patients" value="doctor" onClick={onChange} active={value==='doctor'} />
        <Option label="Clinic" desc="Manage your clinic & doctors" value="clinic" onClick={onChange} active={value==='clinic'} />
      </div>

      <div style={{marginTop:20}}>
        <button className="primary" onClick={()=>onContinue(value)}>Continue →</button>
      </div>
    </div>
  )
}
