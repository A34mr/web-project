
import React, { useMemo, useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";
const Icon = {
  back: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  edit: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  email: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 6l8 7 8-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  phone: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path d="M22 16.92V20a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h3.09A2 2 0 019 3.72l1.13 2.61a2 2 0 01-.45 2.18L8.09 10.1a16 16 0 006 6l1.59-1.59a2 2 0 012.18-.45L20.28 15A2 2 0 0122 16.92z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  calendar: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 2v4M8 2v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  clock: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7v5l3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  location: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path d="M12 21s-7-6.58-7-11a7 7 0 1114 0c0 4.42-7 11-7 11z" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  doc: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  download: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 10l5 5 5-5M12 15V3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  alert: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const sample = {
  patient: { name: "Adham Mahrous Ali", id: "P-2024-0127", age: 25, gender: "Male", blood: "A+", email: "adhammahrous69@gmail.com", phone: "+20 1067 133 442", dob: "nov 17, 2002" },
  allergies: ["Penicillin", "Aspirin"],
  chronic: ["Hypertension"],
  medications: ["Blood Pressure Medication – Losartan 50mg"],
  upcoming: [
    { id: "a1", title: "Routine Checkup", doctor: "Dr. Ahmed Mahmoud", date: "February 8, 2026", time: "10:00 AM", location: "Main Clinic", status: "Confirmed" },
    { id: "a2", title: "Teeth Whitening", doctor: "Dr. Sara Khaled", date: "February 15, 2026", time: "02:30 PM", location: "Al Malqa Branch", status: "Pending" },
  ],
  past: [
    { id: "p1", title: "General Checkup", doctor: "Dr. Ahmed Mahmoud", date: "February 5, 2026", time: "09:00 AM", status: "Completed", notes: "Everything looks good after examination" },
    { id: "p2", title: "Teeth Cleaning", doctor: "Dr. Fatima Saeed", date: "January 20, 2026", time: "11:00 AM", status: "Completed", notes: "Teeth cleaning and tartar removal completed" },
  ],
  dentalHistory: ["Lower right molar filling – 2024","Regular cleaning every 6 months","Upper left molar crown – 2023"],
  surgeries: ["Tonsillectomy – 2015"],
  documents: [
    { id: "d1", name: "Panoramic X-Ray.pdf", type: "X-Ray", date: "February 5, 2026", size: "2.4 MB" },
    { id: "d2", name: "Comprehensive Exam Report.pdf", type: "Report", date: "January 20, 2026", size: "1.1 MB" },
    { id: "d3", name: "Treatment Plan.pdf", type: "Treatment Plan", date: "January 5, 2026", size: "890 KB" },
  ],
};

const Pill = ({ color = "gray", children }) => (<span className={`pill pill-${color}`}>{children}</span>);
const StatusPill = ({ status }) => { const map = { Confirmed: "green", Pending: "yellow", Completed: "blue", Cancelled: "red" }; return <Pill color={map[status] || "gray"}>{status}</Pill>; };
const Card = ({ className = "", children }) => (<div className={`card ${className}`}>{children}</div>);
const SectionTitle = ({ children }) => (<h3 className="section-title">{children}</h3>);

function PatientHeader({ p, onEdit }) {
  return (
    <Card className="header-card">
      <div className="header-gradient">
        <div className="header-content">
  <div className="header-left">
    <div className="avatar">👤</div>

    <div className="header-info">
      <h1 className="patient-name">{p.name}</h1>
      <div className="header-meta">
        Patient ID: {p.id} • {p.age} years old • {p.gender} • Blood Type: {p.blood}
      </div>
    </div>
  </div>

  <button
  
        className="btn btn-header"
        onClick={onEdit}
      >
        Edit Profile

</button>
</div>

      </div>

      <div className="header-contacts">
        <div className="contact-item">{Icon.email({})}<span>{p.email}</span></div>
        <div className="contact-item">{Icon.phone({})}<span>{p.phone}</span></div>
        <div className="contact-item">{Icon.calendar({})}<span>Date of Birth — {p.dob}</span></div>
      </div>
    </Card>
  );
}

function InfoGrid({ allergies, chronic, meds }) {
  return (
    <div className="info-grid">
      <Card>
        <div className="info-title"><span className="ico red">🧪</span> Allergies</div>
        <div className="chips">{allergies.map((a,i)=>(<span className="chip chip-red" key={i}>{a}</span>))}</div>
      </Card>
      <Card>
        <div className="info-title"><span className="ico orange">🏥</span> Chronic Diseases</div>
        <div className="chips">{chronic.map((c,i)=>(<span className="chip chip-orange" key={i}>{c}</span>))}</div>
      </Card>
      <Card>
        <div className="info-title"><span className="ico green">💊</span> Current Medications</div>
        <div className="chips">{meds.map((m,i)=>(<span className="chip chip-green" key={i}>{m}</span>))}</div>
      </Card>
    </div>
  );
}

function AppointmentRow({ item }) {
  return (
    <Card className="row-card">
      <div className="row-main">
        <div>
          <div className="row-title">{item.title}</div>
          <div className="muted">{item.doctor}</div>
          <div className="row-meta">
            <span>{Icon.calendar({})} {item.date}</span>
            <span>{Icon.clock({})} {item.time}</span>
            {item.location && <span>{Icon.location({})} {item.location}</span>}
          </div>
        </div>
      </div>
      <div className="row-actions">
        <StatusPill status={item.status} />
        <div className="row-links">
          <button className="link">View Details</button>
          {item.status !== "Completed" && (<button className="link danger">Cancel Appointment</button>)}
        </div>
      </div>
    </Card>
  );
}

function AppointmentsTab({ data }) {
  return (
    <div className="tab-panel">
      <button className="btn btn-primary btn-wide">+ Book New Appointment</button>
      <SectionTitle>Upcoming Appointments</SectionTitle>
      <div className="stack">{data.upcoming.map(a=> <AppointmentRow key={a.id} item={a} />)}</div>
      <SectionTitle>Past Appointments</SectionTitle>
      <div className="stack">
        {data.past.map(a => (
          <Card key={a.id} className="row-card past">
            <div className="row-main">
              <div className="row-title">{a.title}</div>
              <div className="muted">{a.doctor}</div>
              <div className="row-meta">
                <span>{Icon.calendar({})} {a.date}</span>
                <span>{Icon.clock({})} {a.time}</span>
              </div>
              <div className="notes"><strong>Notes: </strong>{a.notes}</div>
            </div>
            <div className="row-actions"><StatusPill status={a.status} /></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HistoryList({ title, color, items }) {
  return (<>
    <div className="subsection-title"><span className={`bullet ${color}`} /> <span>{title}</span></div>
    <div className="history-list">{items.map((line,i)=>(<div key={i} className={`history-item ${color}`}>• {line}</div>))}</div>
  </>);
}

function HistoryTab({ data }) {
  return (
    <div className="tab-panel">
      <HistoryList title="Dental History" color="blue" items={data.dentalHistory} />
      <HistoryList title="Previous Surgeries" color="purple" items={data.surgeries} />
      <div className="notice">
        <div className="notice-icon">{Icon.alert({})}</div>
        <div>
          <div className="notice-title">Important Notice</div>
          <div className="notice-text">Please inform your dentist of any changes in your health condition or medications before any dental procedure.</div>
        </div>
      </div>
    </div>
  );
}

function DocRow({ doc }) {
  return (
    <Card className="doc-row">
      <div className="doc-left">
        <div className="doc-badge">{Icon.doc({})}</div>
        <div>
          <div className="doc-name">{doc.name}</div>
          <div className="muted">{doc.type} • {doc.date} • {doc.size}</div>
        </div>
      </div>
      <button className="icon-btn" title="Download">{Icon.download({})}</button>
    </Card>
  );
}

function DocumentsTab({ patient }) {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!patient || !patient._id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/documents?patientId=${patient._id}`);
        if (!res.ok) throw new Error('Failed to load docs');
        const data = await res.json();
        setDocs(data.map(d=>({ id: d._id, name: d.name, type: d.type, date: new Date(d.uploadedAt).toLocaleDateString(), size: (d.size/1024/1024).toFixed(2) + ' MB', path: d.path })));
      } catch (err) {
        console.warn('Docs load error:', err.message);
      }
    }
    load();
  }, [patient]);

  const handleChoose = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !patient || !patient._id) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('patientId', patient._id);
      fd.append('name', file.name);
      const res = await fetch('http://localhost:5000/api/documents', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const saved = await res.json();
      setDocs(prev => [{ id: saved._id, name: saved.name, type: saved.type, date: new Date(saved.uploadedAt).toLocaleDateString(), size: (saved.size/1024/1024).toFixed(2) + ' MB', path: saved.path }, ...prev]);
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="tab-panel">
      <div className="uploader"><div className="uploader-dash">
        <input type="file" onChange={handleChoose} />
        <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
      </div></div>
      <div className="stack">{docs.map(d=> <DocRow key={d.id} doc={d} />)}</div>
    </div>
  );
}

export default function PatientPage(){
  const [patient, setPatient] = useState(null);
  const [active,setActive] = useState('appointments');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const p = useMemo(()=>sample,[]);

  useEffect(() => {
    // fetch patients from backend and pick the first one
    async function load() {
      try {
        const res = await fetch('http://localhost:5000/api/patients');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // map server fields to UI fields if needed
          const srv = data[0];
          setPatient({
            _id: srv._id,
            name: srv.name || sample.patient.name,
            id: srv.patientId || sample.patient.id,
            age: srv.age || sample.patient.age,
            gender: srv.gender || sample.patient.gender,
            blood: srv.blood || sample.patient.blood,
            email: srv.email || sample.patient.email,
            phone: srv.phone || sample.patient.phone,
            dob: srv.dob || sample.patient.dob,
          });
        } else {
          // no patient in DB -> use sample
          setPatient(sample.patient);
        }
      } catch (err) {
        console.warn('Could not load patient from backend, using sample:', err.message);
        setPatient(sample.patient);
      }
    }
    load();
  }, []);
  return (
    <div className="page">
      <div className="topbar">
        <button className="link back">{Icon.back({})} <span>Back to Home</span></button>
        <div className="topbar-title">Patient Profile</div>
      </div>
      <div className="container">
        <PatientHeader p={patient||sample.patient} onEdit={() => setIsEditOpen(true)} />
        <InfoGrid allergies={p.allergies} chronic={p.chronic} meds={p.medications} />
        <div className="tabs">
          {['appointments','history','documents'].map(k=>{
            const t = {appointments:{label:'Appointments',icon:Icon.calendar({})},history:{label:'Medical History',icon:Icon.doc({})},documents:{label:'Documents',icon:Icon.doc({})}}[k];
            return (
              <button key={k} onClick={()=>setActive(k)} className={`tab ${active===k?'active':''}`}>
                {t.icon} <span>{t.label}</span>
              </button>
            );
          })}
        </div>
        <div className="tab-content">
          {active==='appointments' && <AppointmentsTab data={p} />}
          {active==='history' && <HistoryTab data={p} />}
          {active==='documents' && <DocumentsTab data={p} />}
        </div>
        {isEditOpen && (
  <EditProfileModal
    data={patient||sample.patient}
    onClose={() => setIsEditOpen(false)}
    onSave={async (updatedPatient) => {
      // send update to backend: if we have _id do PUT, otherwise POST
      try {
        if (updatedPatient._id) {
          const res = await fetch(`http://localhost:5000/api/patients/${updatedPatient._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPatient),
          });
          if (!res.ok) throw new Error('Update failed');
          const saved = await res.json();
          setPatient({ ...patient, ...saved });
        } else {
          const res = await fetch('http://localhost:5000/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPatient),
          });
          if (!res.ok) throw new Error('Create failed');
          const saved = await res.json();
          setPatient({ ...updatedPatient, _id: saved._id });
        }
        setIsEditOpen(false);
      } catch (err) {
        console.error('Save error:', err.message);
        // still update UI optimistically
        setPatient(updatedPatient);
        setIsEditOpen(false);
      }
    }}
  />
)}
      </div>
    </div>
  );
  
}
