import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import ClinicDashboard from './pages/ClinicDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SearchClinics from './pages/SearchClinics';
import BookAppointment from './pages/BookAppointment';
import UploadImage from './pages/UploadImage';
import AIDiagnosis from './pages/AIDiagnosis';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ClinicDetail from './pages/ClinicDetail';
import Appointments from './pages/Appointments';
import MedicalHistory from './pages/MedicalHistory';
import Reviews from './pages/Reviews';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>
        } />
        <Route path="/patient/search-clinics" element={
          <ProtectedRoute roles={['patient']}><SearchClinics /></ProtectedRoute>
        } />
        <Route path="/patient/clinic/:id" element={
          <ProtectedRoute roles={['patient']}><ClinicDetail /></ProtectedRoute>
        } />
        <Route path="/patient/book-appointment" element={
          <ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>
        } />
        <Route path="/patient/upload-image" element={
          <ProtectedRoute roles={['patient']}><UploadImage /></ProtectedRoute>
        } />
        <Route path="/patient/ai-diagnosis/:id" element={
          <ProtectedRoute roles={['patient']}><AIDiagnosis /></ProtectedRoute>
        } />
        <Route path="/patient/chat" element={
          <ProtectedRoute roles={['patient', 'doctor', 'clinic_admin']}><Chat /></ProtectedRoute>
        } />
        <Route path="/patient/profile" element={
          <ProtectedRoute roles={['patient']}><Profile /></ProtectedRoute>
        } />
        <Route path="/patient/appointments" element={
          <ProtectedRoute roles={['patient']}><Appointments /></ProtectedRoute>
        } />
        <Route path="/patient/medical-history" element={
          <ProtectedRoute roles={['patient']}><MedicalHistory /></ProtectedRoute>
        } />
        <Route path="/patient/reviews" element={
          <ProtectedRoute roles={['patient']}><Reviews /></ProtectedRoute>
        } />

        {/* Doctor/Clinic Admin Routes */}
        <Route path="/clinic/dashboard" element={
          <ProtectedRoute roles={['doctor', 'clinic_admin']}><ClinicDashboard /></ProtectedRoute>
        } />
        <Route path="/clinic/appointments" element={
          <ProtectedRoute roles={['doctor', 'clinic_admin']}><Appointments /></ProtectedRoute>
        } />
        <Route path="/clinic/patients" element={
          <ProtectedRoute roles={['doctor', 'clinic_admin']}><MedicalHistory /></ProtectedRoute>
        } />
        <Route path="/clinic/chat" element={
          <ProtectedRoute roles={['doctor', 'clinic_admin']}><Chat /></ProtectedRoute>
        } />
        <Route path="/clinic/profile" element={
          <ProtectedRoute roles={['doctor', 'clinic_admin']}><Profile /></ProtectedRoute>
        } />
        <Route path="/clinic/reviews" element={
          <ProtectedRoute roles={['doctor', 'clinic_admin']}><Reviews /></ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
