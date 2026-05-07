import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Calendar, CheckCircle,
  Users, Clock, Star, Edit, Menu
} from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const stats = [
    { title: 'Today', count: '4 Appts', sub: 'For today', icon: <Calendar size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Completed', count: '1 Appt', sub: 'Done today', icon: <CheckCircle size={18} className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Patients', count: '127 Total', sub: 'In record', icon: <Users size={18} className="text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Upcoming', count: '3 Appts', sub: 'Next 3 days', icon: <Clock size={18} className="text-yellow-500" />, bg: 'bg-yellow-50' },
  ];

  const upcomingAppointments = [
    { name: 'Abdullah Youssef', type: 'Routine Checkup', phone: '+20 10 234 5678', date: 'Feb 6, 2026', time: '09:00 AM', initial: 'A', color: 'bg-purple-600' },
    { name: 'Noura Khaled', type: 'Orthodontics', phone: '+20 11 345 6789', date: 'Feb 6, 2026', time: '11:00 AM', initial: 'N', color: 'bg-fuchsia-600' },
    { name: 'Majed Abdulrahman', type: 'Dental Implant', phone: '+20 12 456 7890', date: 'Feb 7, 2026', time: '10:00 AM', initial: 'M', color: 'bg-indigo-600' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans text-slate-600">
      {/* Main Container - Responsive Padding */}
      <div className="p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">

        {/* Header Section - Responsive Layout */}
        <div className="bg-[#1E56E3] rounded-2xl p-5 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            <div className="shrink-0">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"
                alt="Doctor"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white/20 object-cover shadow-xl"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Dr. Ahmed Mahmoud</h1>
              <p className="text-xs sm:text-sm opacity-90 font-light mt-1 max-w-md">Dental Implants & Cosmetic Dentistry Consultant</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] sm:text-xs">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" /> 4.9 (247 reviews)
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] sm:text-xs">
                  <Clock size={12} /> 15 Years Exp.
                </span>
              </div>
            </div>

            <button className="w-full md:w-auto bg-white text-[#1E56E3] hover:bg-blue-50 px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md text-sm">
              <Edit size={16} /> Edit Profile
            </button>
          </div>

          {/* Contact Info - Responsive Grid (1 col on mobile, 3 on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 bg-white/10 rounded-xl p-4 text-white backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <Mail size={16} className="text-blue-200" /> dr.ahmed@dentalclinic.com
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <Phone size={16} className="text-blue-200" /> +20 10 123 4567
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <MapPin size={16} className="text-blue-200" /> Main Clinic - Cairo
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive Column Counts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-blue-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-base sm:text-xl font-black text-slate-800 mt-1">{stat.count}</h3>
                  <p className="hidden sm:block text-[10px] text-slate-400 mt-1">{stat.sub}</p>
                </div>
                <div className={`${stat.bg} p-2.5 sm:p-3.5 rounded-xl self-start sm:self-center`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Appointments Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tabs - Scrollable on Mobile */}
          <div className="flex overflow-x-auto border-b border-slate-100 no-scrollbar">
            {[
              { id: 'today', label: "Today", icon: <Calendar size={16} /> },
              { id: 'upcoming', label: "Upcoming", icon: <Clock size={16} /> },
              { id: 'patients', label: "Patients", icon: <Users size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-4 px-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20'
                  : 'text-slate-400 hover:bg-slate-50'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-6">
            {activeTab === 'upcoming' && (
              <div className="space-y-3 sm:space-y-4">
                {upcomingAppointments.map((app, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 ${app.color} text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold shadow-md`}>
                        {app.initial}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-slate-800 truncate">{app.name}</h4>
                        <p className="text-xs text-blue-500 font-medium">{app.type}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-xs text-slate-400">
                          <Phone size={12} /> {app.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-2.5 sm:p-0 bg-slate-50 sm:bg-transparent rounded-xl">
                      <p className="text-xs sm:text-sm font-bold text-slate-700">{app.date}</p>
                      <p className="text-xs sm:text-sm text-blue-600 font-black sm:mt-1">{app.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'today' && (
              <div className="py-16 text-center text-slate-400">
                <Calendar size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No appointments for today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;