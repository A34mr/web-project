import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import './styles/auth.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <Link to="/">Dent AI</Link>
          <nav>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<div style={{padding:40}}>Welcome to Dent AI — open <Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link>.</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
