import React, { useState } from 'react';

// === تنسيقات الـ CSS directement داخل الملف ===
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    background-color: #f8fafc;
    color: #1e293b;
  }

  /* الشريط العلوي */
  .navbar {
    background-color: #ffffff;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1100px;
    padding: 0 20px;
  }

  .logo {
    color: #0ea5e9;
    font-size: 1.6rem;
    font-weight: 700;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-menu {
    display: flex;
    list-style: none;
    gap: 15px;
    align-items: center;
  }

  .nav-menu li a {
    text-decoration: none;
    color: #475569;
    font-weight: 600;
    transition: 0.3s;
    padding: 8px 10px;
  }

  .nav-menu li a:hover {
    color: #0ea5e9;
  }

  .btn-nav {
    background-color: #0ea5e9 !important;
    color: white !important;
    border-radius: 8px;
    padding: 8px 20px !important;
  }

  .menu-icon {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #334155;
  }

  /* قسم البداية Hero */
  .hero {
    background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
    color: white;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;
  }

  .hero-content h1 {
    font-size: 2.8rem;
    margin-bottom: 15px;
    line-height: 1.3;
  }

  .hero-content p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 30px;
    opacity: 0.9;
  }

  .hero-btns {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    background-color: #ffffff;
    color: #0284c7;
    padding: 12px 28px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    transition: 0.3s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
  }

  .btn-secondary {
    background-color: transparent;
    border: 2px solid white;
    color: white;
    padding: 10px 28px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    transition: 0.3s;
  }

  /* الأقسام */
  .section {
    padding: 60px 0;
  }

  .container {
    max-width: 1100px;
    margin: auto;
    padding: 0 20px;
  }

  .section-title {
    text-align: center;
    margin-bottom: 40px;
  }

  .section-title h2 {
    font-size: 2rem;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .section-title p {
    color: #64748b;
  }

  /* من نحن */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
  }

  .features-list {
    list-style: none;
    margin-top: 20px;
  }

  .features-list li {
    margin-bottom: 10px;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .features-list i {
    color: #10b981;
  }

  .image-placeholder {
    background-color: #e2e8f0;
    height: 300px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 3rem;
  }

  /* الخدمات */
  .services-section {
    background-color: #f1f5f9;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .service-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    transition: 0.3s;
  }

  .service-card:hover {
    transform: translateY(-5px);
  }

  .service-icon {
    width: 60px;
    height: 60px;
    background: #e0f2fe;
    color: #0ea5e9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-size: 1.5rem;
  }

  .service-price {
    display: block;
    margin-top: 10px;
    color: #0ea5e9;
    font-weight: 700;
  }

  /* الأطباء */
  .doctors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    justify-items: center;
  }

  .doctor-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    width: 100%;
    max-width: 250px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }

  .doctor-img {
    width: 80px;
    height: 80px;
    background: #0ea5e9;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-size: 2rem;
  }

  /* التواصل */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }

  .contact-info ul {
    list-style: none;
  }

  .contact-info li {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    font-size: 1.1rem;
  }

  .contact-info i {
    color: #0ea5e9;
    width: 20px;
  }

  .map-placeholder {
    background: #f1f5f9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 2rem;
  }

  /* الفوتر */
  .footer {
    background: #0f172a;
    color: white;
    padding: 20px 0;
    text-align: center;
    margin-top: auto;
  }

  /* زر واتساب */
  .whatsapp-btn {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #25d366;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 99;
    text-decoration: none;
  }

  /* التجاوب للموبايل */
  @media screen and (max-width: 768px) {
    .nav-menu {
      display: none;
      flex-direction: column;
      width: 100%;
      position: absolute;
      top: 70px;
      background: white;
      box-shadow: 0 5px 10px rgba(0,0,0,0.1);
      padding: 20px 0;
    }

    .nav-menu.active {
      display: flex;
    }

    .menu-icon {
      display: block;
    }
    
    .about-grid, .contact-grid {
      grid-template-columns: 1fr;
    }

    .hero-content h1 {
      font-size: 2rem;
    }
  }
`;

function ClinicPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* حقن التنسيقات مباشرة */}
      <style>{styles}</style>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

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
    </>
  );
}

export default ClinicPage;