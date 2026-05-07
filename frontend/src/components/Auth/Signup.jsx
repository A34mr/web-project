import React, { useState } from 'react'
import AccountType from './SignupSteps/AccountType'
import PatientDetails from './SignupSteps/PatientDetails'
import DoctorDetails from './SignupSteps/DoctorDetails'
import ClinicDetails from './SignupSteps/ClinicDetails'
import api from '../../services/api'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState('patient')
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const next = (data = {}) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(s => Math.min(3, s + 1))
  }

  const back = () => setStep(s => Math.max(1, s - 1))

  const submit = async (data = {}) => {
    const payload = { ...formData, ...data, accountType }
    setSubmitting(true)
    try {
      await api.post('/auth/register', payload)
      // basic success flow — redirect handled elsewhere
      alert('Account created — please log in')
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page auth-signup">
      <div className="auth-card wide">
        <h2>Dent AI — Create Account</h2>
        <p className="muted">Step {step} of 2: {step === 1 ? 'Account Type' : 'Your Details'}</p>

        {step === 1 && (
          <AccountType value={accountType} onChange={(type) => { setAccountType(type); setFormData({}); }} onContinue={(data) => { setAccountType(data); next() }} />
        )}

        {step === 2 && accountType === 'patient' && (
          <PatientDetails onBack={back} onContinue={submit} submitting={submitting} />
        )}

        {step === 2 && accountType === 'doctor' && (
          <DoctorDetails onBack={back} onContinue={submit} submitting={submitting} />
        )}

        {step === 2 && accountType === 'clinic' && (
          <ClinicDetails onBack={back} onContinue={submit} submitting={submitting} />
        )}

      </div>
    </div>
  )
}
