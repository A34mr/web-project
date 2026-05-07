import { useState } from "react";
import { Link } from "react-router-dom";

const steps = ["Account Type", "Your Details"];

const accountTypes = [
  { id: "patient", label: "Patient", icon: "🙋", desc: "Book appointments & manage your health" },
  { id: "doctor", label: "Doctor", icon: "👨‍⚕️", desc: "Manage your practice & patients" },
  { id: "clinic", label: "Clinic", icon: "🏥", desc: "Manage your clinic & doctors" },
];

const specialties = ["Orthodontist", "Surgeon", "Pediatric Dentist", "General Dentist", "Cosmetic Dentist"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.fullName?.trim()) errs.fullName = "Required";
    if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone?.trim()) errs.phone = "Required";
    if (!form.password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,}$/.test(form.password)) errs.password = "Min 8 chars with uppercase, lowercase, number & symbol (!@#$%^&*?)";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match";
    
    if (type === "patient") {
      if (!form.dob) errs.dob = "Required";
      if (!form.gender) errs.gender = "Required";
      if (!form.chronic?.trim()) errs.chronic = "Required";
      if (!form.allergies?.trim()) errs.allergies = "Required";
      if (!form.dentalIssues?.trim()) errs.dentalIssues = "Required";
      if (!form.emergency?.trim()) errs.emergency = "Required";
    }
    
    if (type === "doctor") {
      if (!form.gender) errs.gender = "Required";
      if (!form.specialty) errs.specialty = "Required";
      if (!form.experience) errs.experience = "Required";
      if (!form.license?.trim()) errs.license = "Required";
      if (!form.price) errs.price = "Required";
    }
    
    if (type === "clinic") {
      if (!form.clinicName?.trim()) errs.clinicName = "Required";
      if (!form.address?.trim()) errs.address = "Required";
      if (!form.city?.trim()) errs.city = "Required";
      if (!form.workingHours?.trim()) errs.workingHours = "Required";
    }
    
    return errs;
  };

  const handleSubmit = () => {
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Please fix the errors before continuing.", "error");
    } else {
      setErrors({});
      showToast("Account created successfully! 🎉", "success");
    }
  };

  const inputStyle = (err) => ({
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1.5px solid ${err ? "#e53935" : "#c9d8e8"}`,
    fontSize: 14, outline: "none", background: "#f7faff", boxSizing: "border-box"
  });

  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#3a5068", marginBottom: 5 };

  const field = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} placeholder={placeholder || label} value={form[key] || ""}
        onChange={e => set(key, e.target.value)} style={inputStyle(errors[key])} />
      {errors[key] && <p style={{ color: "#e53935", fontSize: 12, marginTop: 3 }}>{errors[key]}</p>}
    </div>
  );

  const passField = (label, key, show, setShow) => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input type={show ? "text" : "password"} placeholder={label} value={form[key] || ""}
          onChange={e => set(key, e.target.value)}
          style={{ ...inputStyle(errors[key]), paddingRight: 44 }} />
        <button onClick={() => setShow(!show)}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 17, color: "#7a8fa6" }}>
          {show ? "🙈" : "👁"}
        </button>
      </div>
      {errors[key] && <p style={{ color: "#e53935", fontSize: 12, marginTop: 3 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f6ff", fontFamily: "'Segoe UI', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 600, background: "white", borderRadius: 20, boxShadow: "0 8px 40px rgba(29,111,164,0.12)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(90deg, #1d6fa4, #2196f3)", padding: "28px 36px", color: "white" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🦷 Dent Al — Create Account</div>
          <div style={{ opacity: 0.85, fontSize: 14 }}>Step {step} of 2: {steps[step - 1]}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 10, background: i < step ? "white" : "rgba(255,255,255,0.3)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "32px 36px" }}>

          {/* Toast */}
          {toast && (
            <div style={{
              padding: "12px 18px", borderRadius: 10, marginBottom: 20, fontWeight: 600, fontSize: 14,
              background: toast.type === "success" ? "#e8f5e9" : "#fdecea",
              color: toast.type === "success" ? "#2e7d32" : "#c62828",
              border: `1px solid ${toast.type === "success" ? "#a5d6a7" : "#ef9a9a"}`,
              display: "flex", alignItems: "center", gap: 10
            }}>
              {toast.type === "success" ? "✅" : "❌"} {toast.msg}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a2a3a", marginBottom: 6 }}>Who are you?</h3>
              <p style={{ color: "#7a8fa6", fontSize: 14, marginBottom: 24 }}>Select your account type to get started</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {accountTypes.map(t => (
                  <div key={t.id} onClick={() => { setType(t.id); setForm({}); }}
                    style={{
                      padding: "18px 20px", borderRadius: 14, border: `2px solid ${type === t.id ? "#1d6fa4" : "#dde8f5"}`,
                      background: type === t.id ? "#f0f7ff" : "white", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s"
                    }}>
                    <span style={{ fontSize: 32 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1a2a3a", fontSize: 16 }}>{t.label}</div>
                      <div style={{ fontSize: 13, color: "#7a8fa6" }}>{t.desc}</div>
                    </div>
                    {type === t.id && <span style={{ marginLeft: "auto", color: "#1d6fa4", fontSize: 20 }}>✔</span>}
                  </div>
                ))}
              </div>
              <button onClick={() => { if (!type) { showToast("Please select an account type"); return; } setStep(2); }}
                style={{ width: "100%", marginTop: 28, padding: "14px", borderRadius: 12, background: "linear-gradient(90deg,#1d6fa4,#2196f3)", color: "white", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
                Continue →
              </button>
              <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#7a8fa6" }}>
                Already have an account? <Link to="/" style={{ color: "#1d6fa4", fontWeight: 700, textDecoration: "none" }}>Login</Link>
              </p>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#1d6fa4", fontWeight: 600, cursor: "pointer", marginBottom: 16, fontSize: 14 }}>← Back</button>

              {/* Common Fields */}
              {field("Full Name", "fullName")}
              {field("Email", "email", "email")}
              <div style={{ marginBottom: 16 }}>
  <label style={labelStyle}>Phone Number</label>
  <input type="tel" placeholder="Phone Number" value={form.phone || ""}
    onChange={e => { const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 11); set("phone", val); }}
    style={inputStyle(errors.phone)} />
  {errors.phone && <p style={{ color:"#e53935", fontSize:12, marginTop:3 }}>{errors.phone}</p>}
</div>
              {passField("Password", "password", showPass, setShowPass)}
              {passField("Confirm Password", "confirmPassword", showConfirm, setShowConfirm)}

              {/* Patient Fields */}
              {type === "patient" && <>
                {field("Date of Birth", "dob", "date")}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Gender</label>
                  <select value={form.gender || ""} onChange={e => set("gender", e.target.value)} style={inputStyle(errors.gender)}>
                    {errors.gender && <p style={{ color:"#e53935", fontSize:12, marginTop:3 }}>Required</p>}
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                {field("Chronic Diseases", "chronic", "text", "e.g. Diabetes, Hypertension")}
                {field("Allergies", "allergies", "text", "e.g. Penicillin")}
                {field("Previous Dental Issues", "dentalIssues", "text", "e.g. Root canal, Extraction")}
                {field("Emergency Contact", "emergency", "tel", "Emergency phone number")}
              </>}

              {/* Doctor Fields */}
              {type === "doctor" && <>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Gender</label>
                  <select value={form.gender || ""} onChange={e => set("gender", e.target.value)} style={inputStyle(false)}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Specialty</label>
                  <select value={form.specialty || ""} onChange={e => set("specialty", e.target.value)} style={inputStyle(false)}>
                    <option value="">Select specialty</option>
                    {specialties.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {field("Years of Experience", "experience", "number")}
                {field("Medical License Number", "license")}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Upload License (PDF / Image)</label>
                  <input type="file" accept=".pdf,image/*" style={{ ...inputStyle(false), padding: "8px 14px" }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Available Working Days</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                    {days.map(d => (
                      <button key={d} onClick={() => toggleDay(d)} style={{
                        padding: "7px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: 600,
                        background: selectedDays.includes(d) ? "#1d6fa4" : "#f0f6ff",
                        color: selectedDays.includes(d) ? "white" : "#3a5068",
                        border: `1.5px solid ${selectedDays.includes(d) ? "#1d6fa4" : "#c9d8e8"}`
                      }}>{d}</button>
                    ))}
                  </div>
                </div>
              </>}

              {/* Clinic Fields */}
              {type === "clinic" && <>
                {field("Clinic Name", "clinicName")}
                {field("Address", "address")}
                {field("City", "city")}
                {field("Google Maps Location Link", "mapsLink", "url", "https://maps.google.com/...")}
                {field("Working Hours", "workingHours", "text", "e.g. 9AM - 6PM")}
                {field("Max Number of Doctors", "maxDoctors", "number")}
                {field("Invite Doctor via Email", "inviteEmail", "email", "doctor@example.com")}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Upload Clinic Logo</label>
                  <input type="file" accept="image/*" style={{ ...inputStyle(false), padding: "8px 14px" }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Upload Clinic License</label>
                  <input type="file" accept=".pdf,image/*" style={{ ...inputStyle(false), padding: "8px 14px" }} />
                </div>
              </>}

              <button onClick={handleSubmit} style={{
                width: "100%", marginTop: 8, padding: "14px", borderRadius: 12,
                background: "linear-gradient(90deg,#1d6fa4,#2196f3)",
                color: "white", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(29,111,164,0.25)"
              }}>
                Create Account 🎉
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}