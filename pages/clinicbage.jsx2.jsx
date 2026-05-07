import React, { useState } from 'react';
import './App.css'; // ربط ملف التنسيقات

// استدعاء الأيقونات
import '@fortawesome/fontawesome-free/css/all.min.css';

function ClinicPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="App">
      {/* --- الشريط العلوي (Navbar) --- */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="logo">
            <i className="fas fa-tooth"></i> Smile AI
          </a>
          
          <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>

          <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li><a href="#home" onClick={handleLinkClick}>الرئيسية</a></li>
            <li><a href="#about" onClick={handleLinkClick}>من نحن</a></li>
            <li><a href="#services" onClick={handleLinkClick}>خدماتنا</a></li>
            <li><a href="#doctors" onClick={handleLinkClick}>الأطباء</a></li>
            <li><a href="#contact" className="btn-nav" onClick={handleLinkClick}>احجز موعدك</a></li>
          </ul>
        </div>
      </nav>

      {/* --- قسم البداية (Hero) --- */}
      <header className="hero" id="home">
        <div className="hero-content">
          <h1>ابتسامتك تبدأ هنا <br /> بتقنية الذكاء الاصطناعي</h1>
          <p>نقدم أحدث تقنيات طب الأسنان لتشخيص دقيق وعلاج آمن. احصل على ابتسامة هوليود مع أفضل الأطباء.</p>
          <div className="hero-btns">
            <a href="#contact" className="btn-primary">احجز موعدك الآن</a>
            <a href="#services" className="btn-secondary">اكتشف خدماتنا</a>
          </div>
        </div>
      </header>

      {/* --- قسم من نحن --- */}
      <section className="section about-section" id="about">
        <div className="container">
          <div className="section-title">
            <h2>لماذا تختار عيادتنا؟</h2>
            <p>نحن نجمع بين الخبرة الإنسانية والدقة الرقمية</p>
          </div>
          <div className="about-grid">
            <div className="about-content">
              <h3>رؤيتنا في العلاج</h3>
              <p>نستخدم أحدث أجهزة المسح الضوئي ثلاثي الأبعاد وتقنيات الذكاء الاصطناعي لتصميم خطة علاجية دقيقة 100%.</p>
              <ul className="features-list">
                <li><i className="fas fa-check-circle"></i> تعقيم كامل بدرجة مستشفيات</li>
                <li><i className="fas fa-check-circle"></i> أطباء استشاريون متخصصون</li>
                <li><i className="fas fa-check-circle"></i> ضمان مدى الحياة على الزراعة</li>
              </ul>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <i className="fas fa-x-ray"></i>
                <span>صورة العيادة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- قسم الخدمات --- */}
      <section className="section services-section" id="services">
        <div className="container">
          <div className="section-title">
            <h2>خدماتنا المميزة</h2>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-teeth"></i></div>
              <h3>ابتسامة هوليود</h3>
              <p>تصميم ابتسامة رقمية باستخدام عدسات فينير خزفية.</p>
              <span className="service-price">يبدأ من 5000 جنيه</span>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-tooth"></i></div>
              <h3>زراعة الأسنان</h3>
              <p>زراعة تيتانيوم عالية الجودة مع ضمان مدى الحياة.</p>
              <span className="service-price">يبدأ من 8000 جنيه</span>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-smile"></i></div>
              <h3>تقويم الأسنان الشفاف</h3>
              <p>تقويم بدون أسلاك لتعديل الأسنان بسرية تامة.</p>
              <span className="service-price">استشارة مجانية</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- قسم الأطباء --- */}
      <section className="section doctors-section" id="doctors">
        <div className="container">
          <div className="section-title">
            <h2>فريق أطبائنا</h2>
          </div>
          <div className="doctors-grid">
            <div className="doctor-card">
              <div className="doctor-img"><i className="fas fa-user-md"></i></div>
              <h3>د. أحمد سمير</h3>
              <span>استشاري جراحة الفم</span>
            </div>
            <div className="doctor-card">
              <div className="doctor-img" style={{background: '#db2777'}}><i className="fas fa-user-md"></i></div>
              <h3>د. سارة محمود</h3>
              <span>أخصائية تقويم الأسنان</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- قسم التواصل --- */}
      <section className="section contact-section" id="contact">
        <div className="container">
            <div className="section-title">
                <h2>تواصل معنا</h2>
            </div>
            <div className="contact-grid">
                <div className="contact-info">
                    <ul>
                        <li><i className="fas fa-map-marker-alt"></i> 15 شارع المهندين، القاهرة.</li>
                        <li><i className="fas fa-phone-alt"></i> 01123456789</li>
                    </ul>
                </div>
                <div className="contact-map">
                    <div className="map-placeholder">
                        <i className="fas fa-map-marked-alt"></i>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- الفوتر --- */}
      <footer className="footer">
        <div className="container footer-content">
            <div className="footer-col">
              <h4>Smile AI Clinic</h4>
              <p>مشروع تخرج 2026 🎓</p>
            </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 جميع الحقوق محفوظة</p>
        </div>
      </footer>

      {/* زر واتساب عائم */}
      <a href="https://wa.me/20123456789" className="whatsapp-btn" target="_blank" rel="noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
}

export default ClinicPage;