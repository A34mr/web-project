import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountType from './SignupSteps/AccountType'
import PatientDetails from './SignupSteps/PatientDetails'
import DoctorDetails from './SignupSteps/DoctorDetails'
import ClinicDetails from './SignupSteps/ClinicDetails'
import api from '../../services/api'

export default function Signup() {
  const navigate = useNavigate()
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
    
    // Transform frontend field names to backend expected format
    let registerData = {}
    
    if (accountType === 'patient') {
      const [firstName, ...lastParts] = (data.fullName || formData.fullName || '').split(' ')
      registerData = {
        email: data.email || formData.email,
        password: data.password || formData.password,
        firstName: firstName || 'User',
        lastName: lastParts.join(' ') || 'Name',
        role: 'patient',
        phone: data.phone || formData.phone,
        dateOfBirth: data.dob || formData.dob,
        gender: data.gender || formData.gender,
        chronicDiseases: data.chronic || formData.chronic,
        allergies: data.allergies || formData.allergies,
        previousDentalIssues: data.previous || formData.previous,
        emergencyContact: data.emergency || formData.emergency
      }
    } else if (accountType === 'doctor') {
      const [firstName, ...lastParts] = (data.fullName || formData.fullName || '').split(' ')
      registerData = {
        email: data.email || formData.email,
        password: data.password || formData.password,
        firstName: firstName || 'Doctor',
        lastName: lastParts.join(' ') || 'Name',
        role: 'doctor',
        phone: data.phone || formData.phone,
        gender: data.gender || formData.gender,
        specialty: data.specialty || formData.specialty,
        yearsOfExperience: data.years || formData.years,
        licenseNumber: data.license || formData.license,
        workingDays: data.workingDays || formData.workingDays || []
      }
    } else if (accountType === 'clinic') {
      registerData = {
        email: data.email || formData.email,
        password: data.password || formData.password,
        firstName: data.name || formData.name || 'Clinic',
        lastName: '',
        role: 'clinic_admin',
        phone: data.phone || formData.phone,
        clinicName: data.name || formData.name,
        address: data.address || formData.address
      }
    }
    
    setSubmitting(true)
    try {
      await api.post('/api/auth/register', registerData)
      alert('Account created — please log in')
      navigate('/login')
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
