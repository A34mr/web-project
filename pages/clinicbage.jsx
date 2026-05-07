import React from 'react';
import { 
  Stethoscope, 
  BrainCircuit, 
  CalendarCheck, 
  Smile, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  ChevronLeft
} from 'lucide-react';

const ClinicPage = () => {
  
  // دالة الحجز - يمكن ربطها بصفحة الحجوزات لاحقاً
  const handleBooking = () => {
    alert('🎉 شكراً لثقتك بنا! سيتم توجيهك لصفحة الحجز قريباً.');
    // هنا يمكن إضافة: navigate('/booking') أو فتح مودال
  };

  // دالة الاتصال السريع
  const handleCall = () => {
    window.location.href = 'tel:+201234567890';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800" dir="rtl">
      
      {/* --- Hero Section --- */}
      <div className="relative bg-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <img 
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" 
          alt="خلفية العيادة" 
          className="absolute inset-0 w-full h-full object-cover -z-10"
          loading="lazy"
        />
        <div className="container mx-auto px-6 relative z-10 text-center md:text-right">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            عيادة سمايل إيه آي
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 drop-shadow">
            المستقبل في طب الأسنان.. دقة تشخيص مدعومة بالذكاء الاصطناعي.
          </p>
          <button 
            onClick={handleBooking}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 mx-auto md:mx-0"
          >
            <CalendarCheck className="w-5 h-5" />
            احجز موعدك الآن
          </button>
        </div>
      </div>

      {/* --- About & AI Feature Section --- */}
      <section className="py-16 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">من نحن؟</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              نحن عيادة أسنان متكاملة نجمع بين خبرة الأطباء المتخصصين وأحدث تقنيات الذكاء الاصطناعي. 
              هدفنا هو تقديم تجربة علاجية خالية من الألم، مع ضمان أعلى درجات الدقة في التشخيص.
            </p>
            
            {/* AI Highlight Box */}
            <div className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <BrainCircuit className="text-blue-600 w-8 h-8" />
                <h3 className="text-xl font-bold text-blue-800">تقنية AI Diagnosis</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                نستخدم خوارزميات الذكاء الاصطناعي لتحليل الأشعة السينية بدقة تصل إلى <span className="font-bold text-blue-600">99%</span>، 
                مما يساعدنا في اكتشاف المشاكل مبكراً قبل تفاقمها وتوفير خطة علاج مخصصة لكل مريض.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-2xl blur-xl opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop" 
              alt="طبيب يستخدم تقنية الذكاء الاصطناعي" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover relative"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* --- Services Section --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">خدماتنا المتميزة</h2>
            <p className="text-gray-500 mt-2">رعاية شاملة لأسنانك ولعائلتك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1: تجميل الأسنان */}
            <div className="p-6 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1 bg-white">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                <Smile className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">تجميل الأسنان</h3>
              <p className="text-gray-600 leading-relaxed">
                فينير، تبييض متقدم، وتصميم الابتسامة الرقمية باستخدام أحدث التقنيات.
              </p>
            </div>

            {/* Service 2: علاج الجذور */}
            <div className="p-6 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1 bg-white">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                <Stethoscope className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">علاج الجذور</h3>
              <p className="text-gray-600 leading-relaxed">
                علاج عصب الأسنان بأحدث الأجهزة الدوارة وتحت المجهر لضمان أفضل نتائج.
              </p>
            </div>

            {/* Service 3: زراعة الأسنان */}
            <div className="p-6 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1 bg-white">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                <ShieldCheck className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">زراعة الأسنان</h3>
              <p className="text-gray-600 leading-relaxed">
                تعويض الأسنان المفقودة بأفضل الخامات العالمية مع ضمان طويل الأمد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Why Choose Us (Stats) --- */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">لماذا تختارنا؟</h2>
            <p className="text-blue-200 mt-2">أرقام تتحدث عن نفسها</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4 hover:bg-white/10 rounded-xl transition">
              <h3 className="text-4xl font-bold mb-2 text-blue-300">+5000</h3>
              <p className="text-blue-200">مريض سعيد</p>
            </div>
            <div className="p-4 hover:bg-white/10 rounded-xl transition">
              <h3 className="text-4xl font-bold mb-2 text-blue-300">+15</h3>
              <p className="text-blue-200">سنة خبرة</p>
            </div>
            <div className="p-4 hover:bg-white/10 rounded-xl transition">
              <h3 className="text-4xl font-bold mb-2 text-blue-300">99%</h3>
              <p className="text-blue-200">دقة التشخيص</p>
            </div>
            <div className="p-4 hover:bg-white/10 rounded-xl transition">
              <h3 className="text-4xl font-bold mb-2 text-blue-300">24/7</h3>
              <p className="text-blue-200">دعم فني</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Contact Info --- */}
      <section className="py-16 container mx-auto px-6 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">تواصل معنا</h2>
          <p className="text-gray-500 mt-2">نحن هنا لمساعدتك في أي وقت</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-800 mb-1">العنوان</h4>
              <p className="text-gray-600 leading-relaxed">
                القاهرة، مصر - شارع التسعين، التجمع الخامس
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-800 mb-1">اتصل بنا</h4>
              <button 
                onClick={handleCall}
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                +20 123 456 7890
              </button>
              <p className="text-sm text-gray-400 mt-1">اضغط للاتصال المباشر</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-800 mb-1">مواعيد العمل</h4>
              <p className="text-gray-600 leading-relaxed">
                السبت - الخميس: 10 ص - 9 م<br />
                الجمعة: إجازة أسبوعية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            جاهز لابتسامة جديدة؟ 🦷✨
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            احجز استشارتك المجانية الآن ودع خبرائنا يساعدوك في تحقيق أفضل نتائج لعلاج الأسنان.
          </p>
          <button 
            onClick={handleBooking}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            احجز الآن مجاناً
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-6 text-center md:text-right">
            <div>
              <h5 className="text-white font-bold mb-3 text-lg">عيادة سمايل إيه آي</h5>
              <p className="text-sm leading-relaxed">
                نجمع بين الخبرة الطبية والتقنية الحديثة لنقدم لك أفضل رعاية لأسنانك.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-3 text-lg">روابط سريعة</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">الرئيسية</a></li>
                <li><a href="#" className="hover:text-white transition">خدماتنا</a></li>
                <li><a href="#" className="hover:text-white transition">احجز موعد</a></li>
                <li><a href="#" className="hover:text-white transition">اتصل بنا</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-3 text-lg">تابعنا</h5>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="#" className="hover:text-white transition" aria-label="فيسبوك">ف</a>
                <a href="#" className="hover:text-white transition" aria-label="إنستجرام">إ</a>
                <a href="#" className="hover:text-white transition" aria-label="تويتر">ت</a>
                <a href="#" className="hover:text-white transition" aria-label="واتساب">و</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-sm">
            <p>© 2024 عيادة سمايل إيه آي. جميع الحقوق محفوظة.</p>
            <p className="mt-2 text-gray-500">🎓 مشروع تخرج - قسم هندسة الحاسبات</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClinicPage;