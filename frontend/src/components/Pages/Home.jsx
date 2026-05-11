import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Clinics", path: "/search" },
  { name: "AI Diagnosis", path: "/ai-diagnosis" },
  { name: "Contact", path: "#contact" }
];

const SERVICES = [
  {
    title: "Dental Implants",
    desc: "Permanent solution for missing teeth. Our advanced implant technology provides natural-looking and long-lasting results.",
    points: ["Permanent solution", "Natural appearance", "High success rate"],
    img: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&q=80",
  },
  {
    title: "Dental Crowns & Bridges",
    desc: "Restore damaged teeth with custom-made crowns and bridges designed to match your natural teeth perfectly.",
    points: ["Custom-made", "Durable materials", "Perfect fit"],
    img: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&q=80",
  },
  {
    title: "Cosmetic Dentistry",
    desc: "Transform your smile with our comprehensive cosmetic treatments including veneers, bonding, and smile makeovers.",
    points: ["Smile makeover", "Veneers", "Aesthetic results"],
    img: "https://images.unsplash.com/photo-1588776814546-1ffedbe8eba5?w=400&q=80",
  },
  {
    title: "Teeth Whitening",
    desc: "Professional whitening treatments that brighten your smile safely and effectively in just one visit.",
    points: ["Fast results", "Safe procedure", "Brighter smile"],
    img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&q=80",
  },
  {
    title: "Orthodontics",
    desc: "Straighten your teeth with traditional braces or modern clear aligners for a perfect, confident smile.",
    points: ["Multiple options", "Expert alignment", "Beautiful results"],
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
  },
  {
    title: "General Dentistry",
    desc: "Comprehensive dental care including cleanings, fillings, root canals, and preventive treatments.",
    points: ["Regular checkups", "Preventive care", "Complete treatment"],
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80",
  },
];

const FEATURES = [
  { icon: "🏆", title: "Expert Team", desc: "Highly qualified and experienced dental professionals" },
  { icon: "🛡️", title: "Safe & Sterile", desc: "Advanced sterilization protocols for your safety" },
  { icon: "❤️", title: "Patient Care", desc: "Personalized care tailored to your needs" },
  { icon: "👨‍👩‍👧‍👦", title: "Family Friendly", desc: "Comprehensive care for all ages" },
];

const HOURS = [
  { day: "Monday - Friday", time: "9:00 AM - 7:00 PM" },
  { day: "Saturday", time: "9:00 AM - 5:00 PM" },
  { day: "Sunday", time: "10:00 AM - 3:00 PM" },
  { day: "Emergency", time: "24/7 Available" },
];

export default function DentalClinicHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", margin: 0, padding: 0, background: "#f8fafc" }}>
      {/* ========== NAVBAR ========== */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.95)",
        boxShadow: scrolled ? "0 2px 16px rgba(0,100,200,0.10)" : "none",
        backdropFilter: "blur(8px)",
        transition: "box-shadow 0.3s",
        borderBottom: "1px solid #e8f0fe"
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 64
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
              borderRadius: 10, width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "#fff", boxShadow: "0 2px 8px rgba(26,115,232,0.3)"
            }}>🦷</div>
            <span style={{ fontWeight: 700, fontSize: 18, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
              Dental Clinic
            </span>
          </div>

          {/* Nav Links */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_LINKS.map(link => (
              <a key={link.name} href={link.path} style={{
                color: link.name === "Home" ? "#1a73e8" : "#4a5568",
                textDecoration: "none", fontSize: 15, fontWeight: link.name === "Home" ? 600 : 400,
                transition: "color 0.2s"
              }}
                onMouseEnter={e => e.target.style.color = "#1a73e8"}
                onMouseLeave={e => e.target.style.color = link.name === "Home" ? "#1a73e8" : "#4a5568"}
              >{link.name}</a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {user ? (
              <>
                <Link 
                  to={user.role === 'patient' ? '/patient/dashboard' : user.role === 'doctor' ? '/doctor/dashboard' : user.role === 'clinic_admin' ? '/clinic/dashboard' : '/admin/dashboard'}
                  style={{
                    background: "rgba(26,115,232,0.1)",
                    textDecoration: "none", color: "#1a73e8", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", padding: "9px 16px", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 6,
                    border: "1px solid rgba(26,115,232,0.2)"
                  }}
                >
                  📊 Dashboard
                </Link>
                <button 
                  onClick={logout}
                  style={{
                    background: "none", border: "none", color: "#64748b",
                    fontSize: 14, cursor: "pointer", padding: "8px 12px", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  style={{
                    textDecoration: "none", color: "#4a5568",
                    fontSize: 14, cursor: "pointer", padding: "8px 12px", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  👤 Login
                </Link>
                <Link 
                  to="/signup"
                  style={{
                    background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
                    textDecoration: "none", color: "#fff", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", padding: "9px 20px", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 6,
                    boxShadow: "0 2px 8px rgba(26,115,232,0.35)",
                    transition: "transform 0.15s, box-shadow 0.15s"
                  }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(26,115,232,0.45)"; }}
                  onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 2px 8px rgba(26,115,232,0.35)"; }}
                >
                  📅 Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section style={{
        background: "linear-gradient(135deg, #1565c0 0%, #1a73e8 40%, #42a5f5 100%)",
        minHeight: "100vh", paddingTop: 64,
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden"
      }}>
        {/* Background pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", display: "flex", alignItems: "center", gap: 60, position: "relative" }}>
          {/* Left Content */}
          <div style={{ flex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 500, marginBottom: 16, letterSpacing: "0.5px" }}>
              Your Smile is Our Priority
            </p>
            <h1 style={{
              color: "#fff", fontSize: 42, fontWeight: 800, lineHeight: 1.2,
              marginBottom: 24, textShadow: "0 2px 8px rgba(0,0,0,0.15)"
            }}>
              Experience World-Class<br />
              <span style={{ color: "#b3e5fc" }}>Dental Care</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 500 }}>
              We offer comprehensive dental services with our team of expert dentists to keep your smile bright and healthy.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link 
                to="/search"
                style={{
                  background: "#fff", color: "#1565c0", border: "none",
                  padding: "13px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  textDecoration: "none"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >
                🔍 Find a Clinic
              </Link>
              <button 
                onClick={() => navigate('/contact')}
                style={{
                  background: "rgba(255,255,255,0.15)", color: "#fff",
                  border: "2px solid rgba(255,255,255,0.6)",
                  padding: "13px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  backdropFilter: "blur(4px)",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                📞 Contact Us
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 48, marginTop: 48 }}>
              {[["15+", "Years Experience"], ["10K+", "Happy Patients"], ["25+", "Expert Dentists"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ color: "#fff", fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{num}</div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 420, height: 340, borderRadius: 20, overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              border: "3px solid rgba(255,255,255,0.2)"
            }}>
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&q=80"
                alt="Dental Clinic"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT SECTION ========== */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#1a73e8", fontSize: 14, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
            About Our Clinic
          </p>
          <h2 style={{ color: "#1a1a2e", fontSize: 34, fontWeight: 800, marginBottom: 20 }}>
            Leading Dental Care Provider
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.8, maxWidth: 680, margin: "0 auto 56px" }}>
            We are committed to providing exceptional dental care in a comfortable and friendly environment.
            Our state-of-the-art facility and experienced team ensure you receive the best treatment possible.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: "#f8fafc", borderRadius: 16, padding: "32px 20px",
                border: "1px solid #e8f0fe",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,115,232,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg, #e8f0fe, #c5d8fd)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, margin: "0 auto 16px"
                }}>{f.icon}</div>
                <h3 style={{ color: "#1a1a2e", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#1a73e8", fontSize: 14, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
              Our Services
            </p>
            <h2 style={{ color: "#1a1a2e", fontSize: 34, fontWeight: 800, marginBottom: 16 }}>
              Comprehensive Dental Solutions
            </h2>
            <p style={{ color: "#64748b", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
              From routine check-ups to advanced procedures, we offer a full range of dental services to meet all your oral health needs.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {SERVICES.map(s => (
              <div key={s.title} style={{
                background: "#fff", borderRadius: 18, overflow: "hidden",
                border: "1px solid #e8f0fe",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,115,232,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ height: 180, overflow: "hidden" }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = ""}
                  />
                </div>
                <div style={{ padding: "24px 24px 28px" }}>
                  <h3 style={{ color: "#1a1a2e", fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                    {s.points.map(p => (
                      <li key={p} style={{ color: "#4a5568", fontSize: 13.5, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#1a73e8", fontWeight: 700 }}>•</span> {p}
                      </li>
                    ))}
                  </ul>
                  <a href="#" style={{
                    color: "#1a73e8", fontSize: 14, fontWeight: 600, textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 4
                  }}>Learn More →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTACT / CTA SECTION ========== */}
      <section style={{
        background: "linear-gradient(135deg, #1565c0, #1a73e8, #42a5f5)",
        padding: "80px 24px", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 500, marginBottom: 12 }}>
            Ready to Get Started?
          </p>
          <h2 style={{ color: "#fff", fontSize: 30, fontWeight: 800, marginBottom: 12 }}>
            Book your appointment today and take the first step towards a healthier, brighter smile.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 40 }}>Our friendly team is here to help you.</p>

          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {/* Contact Info */}
            <div style={{ flex: 1, minWidth: 260 }}>
              {[
                { icon: "📞", label: "Call Us", val: "+1 (555) 123-4567" },
                { icon: "✉️", label: "Email Us", val: "info@dentalclinic.com" },
                { icon: "📍", label: "Visit Us", val: "123 Dental Street, Medical District" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 2 }}>{c.label}</div>
                    <div style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>{c.val}</div>
                  </div>
                </div>
              ))}

              <Link 
                to="/login"
                style={{
                  background: "#fff", color: "#1565c0", border: "none",
                  padding: "13px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginTop: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transition: "transform 0.15s",
                  textDecoration: "none"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >
                📅 Book Appointment
              </Link>
            </div>

            {/* Office Hours */}
            <div style={{
              flex: 1, minWidth: 260,
              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
              borderRadius: 18, padding: "28px 32px", border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Office Hours</h3>
              {HOURS.map(h => (
                <div key={h.day} style={{
                  display: "flex", justifyContent: "space-between",
                  paddingBottom: 14, marginBottom: 14,
                  borderBottom: "1px solid rgba(255,255,255,0.15)"
                }}>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{h.day}</span>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{h.time}</span>
                </div>
              ))}
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 8 }}>
                New patients welcome! Walk-ins accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{
        background: "#0d47a1", padding: "20px 24px",
        textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 13
      }}>
        © 2025 Dental Clinic. All rights reserved.
      </footer>
    </div>
  );
}
