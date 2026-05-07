import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './components/Pages/Login'
import Signup from './components/Pages/SignUp'
import Home from './components/Pages/Home'
import PatientPage from './components/Pages/PatientPage'
import DoctorDashboard from './components/Doctor/DoctorDashboard'
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
  const { user } = useAuth()
  
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
            
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
                  <div>Clinic Dashboard - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
