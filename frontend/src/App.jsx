import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './components/Pages/Login'
import Signup from './components/Pages/SignUp'
import Home from './components/Pages/Home'
import PatientPage from './components/Pages/PatientPage'
import DoctorDashboard from './components/Doctor/DoctorDashboard'
import ClinicDashboard from './components/Pages/ClinicDashboard'
import AIDiagnosis from './components/Pages/AIDiagnosis'
import ClinicSearch from './components/Pages/ClinicSearch'
import ClinicDetails from './components/Pages/ClinicDetails'
import AdminDashboard from './components/Pages/AdminDashboard'
import ChatPage from './components/Pages/ChatPage'
import './styles/auth.css'
import './styles/global.css'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default function App() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        fontFamily: 'system-ui, sans-serif', background: '#f0f6ff', color: '#1d6fa4'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🦷</div>
          <div style={{ fontWeight: '600' }}>Loading Dent AI...</div>
        </div>
      </div>
    )
  }
  
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
            <Route 
              path="/ai-diagnosis" 
              element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'clinic_admin', 'admin']}>
                  <AIDiagnosis />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Patient */}
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Doctor */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Clinic Admin */}
            <Route 
              path="/clinic/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['clinic_admin']}>
                  <ClinicDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes - Admin */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Chat */}
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat/:userId" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/search" element={<ClinicSearch />} />
            <Route path="/clinic/:id" element={<ClinicDetails />} />
            
            {/* 404 Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
