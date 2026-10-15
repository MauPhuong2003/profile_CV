import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, BookOpen, Flag, Target, Briefcase, Rocket } from 'lucide-react';

// ============================================================================
// STORAGE API
// ============================================================================
if (!window.storage) {
  window.storage = {
    _data: typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('__profile_storage__') || '{}') : {},
    get: function(key) {
      return this._data[key];
    },
    set: function(key, value) {
      this._data[key] = value;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('__profile_storage__', JSON.stringify(this._data));
      }
    },
    remove: function(key) {
      delete this._data[key];
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('__profile_storage__', JSON.stringify(this._data));
      }
    },
    clear: function() {
      this._data = {};
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('__profile_storage__', JSON.stringify(this._data));
      }
    }
  };
}

// ============================================================================
// EMPTY DATA STRUCTURE
// ============================================================================
const EMPTY_DATA = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    birthDate: '',
    professions: [],
    social: { linkedin: '' }
  },
  bio: '',
  shortTermGoal: '',
  longTermGoal: '',
  education: [],
  skills: [],
  experience: [],
  projects: [],
  contact: { email: '', phone: '', address: '', linkedin: '' }
};

function loadData() {
  const stored = window.storage.get('profileData');
  return stored ? JSON.parse(stored) : EMPTY_DATA;
}

function saveData(data) {
  window.storage.set('profileData', JSON.stringify(data));
}

function isAdminSession() {
  return typeof localStorage !== 'undefined' && localStorage.getItem('__admin_session__') === 'true';
}

function setAdminSession(value) {
  if (typeof localStorage !== 'undefined') {
    if (value) {
      localStorage.setItem('__admin_session__', 'true');
    } else {
      localStorage.removeItem('__admin_session__');
    }
  }
}

// ============================================================================
// SCROLL ANIMATION HOOK
// ============================================================================
function useScrollAnimation() {
  const elementsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentElements = elementsRef.current;
    currentElements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      currentElements.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };
}

// ============================================================================
// PROFILE PAGE - MODERN CARD-BASED DESIGN WITH FLOATING HOVER EFFECTS
// ============================================================================
function ProfilePage({ data }) {
  const addRef = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section ref={addRef} className="pt-12 pb-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Avatar and Header */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-center mb-8 md:mb-12">
            {/* Avatar Card */}
            {data.personalInfo.avatar && (
              <div className="flex justify-center flex-shrink-0">
                <div>
                  <img
                    src={data.personalInfo.avatar}
                    alt={data.personalInfo.fullName}
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-slate-200 shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Name and Title Header */}
            <div className="flex items-center flex-1 text-center md:text-left">
              <div className="w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">
                  {data.personalInfo.fullName || 'Tên của bạn'}
                </h1>
                {data.personalInfo.professions && data.personalInfo.professions.length > 0 && (
                  <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                    {data.personalInfo.professions.map((profession, idx) => (
                      <div
                        key={idx}
                        className="inline-block px-3 md:px-4 py-1 md:py-2 bg-indigo-100 rounded-full shadow-md border border-indigo-200"
                      >
                        <span className="text-indigo-700 text-xs md:text-sm font-medium">
                          {profession}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 1: Bio (left) and Personal Information (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Left Column: Bio + Goals */}
            <div>
              {/* Bio Section */}
              {data.bio && (
                <div className="mb-4 md:mb-6 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                    <h3 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-widest mb-3 md:mb-4">
                      Giới Thiệu
                    </h3>
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 text-lg md:text-xl flex-shrink-0 mt-0.5">•</span>
                      <p className="text-sm md:text-base leading-relaxed text-slate-600">
                        {data.bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Goals Cards - Smaller, below Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {/* Long Term Goal - Left */}
                {data.longTermGoal && (
                  <div className="group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500 h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Target size={20} className="text-indigo-600 flex-shrink-0" />
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                          Mục tiêu dài hạn
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {data.longTermGoal}
                      </p>
                    </div>
                  </div>
                )}

                {/* Short Term Goal - Right */}
                {data.shortTermGoal && (
                  <div className="group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500 h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Flag size={20} className="text-indigo-600 flex-shrink-0" />
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                          Mục tiêu ngắn hạn
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {data.shortTermGoal}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information Card - Right */}
            <div className="group cursor-pointer transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-2">
              <div className="bg-white rounded-lg md:rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 group-hover:border-slate-300 transition-all duration-500 h-full">
                <h2 className="text-base md:text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 md:mb-6 pb-3 md:pb-4 border-b border-slate-200">
                  Thông Tin Cá Nhân
                </h2>

                {/* Contact Information Section */}
                <div className="space-y-4 md:space-y-6">
                  {data.personalInfo.birthDate && (
                    <div>
                      <p className="text-xs font-normal text-slate-400 uppercase tracking-widest mb-1 md:mb-2">
                        Ngày Sinh
                      </p>
                      <p className="text-sm md:text-base font-normal text-slate-700">
                        {data.personalInfo.birthDate}
                      </p>
                    </div>
                  )}
                  {data.personalInfo.email && (
                    <div>
                      <p className="text-xs font-normal text-slate-400 uppercase tracking-widest mb-2">
                        Email
                      </p>
                      <a
                        href={`mailto:${data.personalInfo.email}`}
                        className="text-sm font-normal text-slate-700 hover:text-indigo-600 transition-colors break-all"
                      >
                        {data.personalInfo.email}
                      </a>
                    </div>
                  )}
                  {data.personalInfo.phone && (
                    <div>
                      <p className="text-xs font-normal text-slate-400 uppercase tracking-widest mb-2">
                        Điện Thoại
                      </p>
                      <a
                        href={`tel:${data.personalInfo.phone.replace(/\s/g, '')}`}
                        className="text-sm font-normal text-slate-700 hover:text-indigo-600 transition-colors"
                      >
                        {data.personalInfo.phone}
                      </a>
                    </div>
                  )}
                  {data.personalInfo.address && (
                    <div>
                      <p className="text-xs font-normal text-slate-400 uppercase tracking-widest mb-2">
                        Địa Chỉ
                      </p>
                      <p className="text-sm font-normal text-slate-700">
                        {data.personalInfo.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <section ref={addRef} className="py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-8 md:mb-10 lg:mb-12 tracking-tight uppercase">
              Kỹ Năng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="mb-0 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 text-lg md:text-xl flex-shrink-0 mt-0.5">•</span>
                      <p className="text-sm md:text-base leading-relaxed text-slate-600">{skill.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <section ref={addRef} className="py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-8 md:mb-10 lg:mb-12 tracking-tight uppercase">
              Học Vấn
            </h2>

            <div className="space-y-4 md:space-y-6">
              {data.education.map((edu, idx) => (
                <div key={idx} className="mb-4 md:mb-6 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                    <div className="flex items-start gap-3">
                      <BookOpen className="text-indigo-600 size-5 md:size-6 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold text-slate-900">{edu.school} - {edu.degree}</p>
                        <p className="text-xs md:text-sm text-slate-500 mt-1">{edu.startDate} - {edu.endDate}</p>
                        {edu.description && (
                          <div className="mt-2 text-slate-600 space-y-1">
                            {edu.description.split('\n').filter(line => line.trim()).map((line, lidx) => (
                              <p key={lidx} className="text-xs md:text-sm">{line.trim()}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <section ref={addRef} className="py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-8 md:mb-10 lg:mb-12 tracking-tight uppercase">
              Kinh Nghiệm Làm Việc
            </h2>

            <div className="space-y-4 md:space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="mb-4 md:mb-6 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                    <div className="flex items-start gap-3">
                      <Briefcase className="text-indigo-600 size-5 md:size-6 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold text-slate-900">{exp.company} - {exp.role}</p>
                        <p className="text-xs md:text-sm text-slate-500 mt-1">{exp.startDate} - {exp.endDate}</p>
                        {exp.description && (
                          <div className="mt-2 text-slate-600 space-y-1">
                            {exp.description.split('\n').filter(line => line.trim()).map((line, lidx) => (
                              <p key={lidx} className="text-xs md:text-sm">{line.trim()}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <section ref={addRef} className="py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-8 md:mb-10 lg:mb-12 tracking-tight uppercase">
              Dự Án Triển Khai
            </h2>

            <div className="space-y-4 md:space-y-6">
              {data.projects.map((project, idx) => (
                <div key={idx} className="mb-4 md:mb-6 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                    <div className="flex items-start gap-3">
                      <Rocket className="text-indigo-600 size-5 md:size-6 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold text-slate-900">{project.title}</p>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-normal text-xs md:text-sm hover:underline">
                            Xem dự án
                          </a>
                        )}
                        <p className="text-xs md:text-sm text-slate-500 mt-1">{project.startDate} - {project.endDate}</p>
                        {project.description && (
                          <div className="mt-2 text-slate-600 space-y-1">
                            {project.description.split('\n').filter(line => line.trim()).map((line, lidx) => (
                              <p key={lidx} className="text-xs md:text-sm">{line.trim()}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section ref={addRef} className="py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-8 md:mb-10 lg:mb-12 tracking-tight uppercase">
            Liên Hệ
          </h2>

          <div className="space-y-4 md:space-y-6">
            {data.contact?.email && (
              <div className="mb-4 md:mb-6 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                  <div className="flex items-start gap-3">
                    <Mail className="text-indigo-600 size-5 md:size-6 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-normal text-slate-400 uppercase tracking-widest mb-2">Email</p>
                      <a href={`mailto:${data.contact.email}`} className="text-sm md:text-base leading-relaxed text-slate-600 hover:text-indigo-600 transition-colors break-all">
                        {data.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {data.contact?.phone && (
              <div className="mb-4 md:mb-6 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                  <div className="flex items-start gap-3">
                    <Phone className="text-indigo-600 size-5 md:size-6 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-normal text-slate-400 uppercase tracking-widest mb-2">Điện Thoại</p>
                      <a href={`tel:${data.contact.phone.replace(/\s/g, '')}`} className="text-sm md:text-base leading-relaxed text-slate-600 hover:text-indigo-600 transition-colors">
                        {data.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {data.contact?.address && (
              <div className="mb-4 md:mb-6 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-indigo-600 size-5 md:size-6 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-normal text-slate-400 uppercase tracking-widest mb-2">Địa Chỉ</p>
                      <p className="text-sm md:text-base leading-relaxed text-slate-600">
                        {data.contact.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {data.contact?.linkedin && (
              <div className="mb-4 md:mb-6 group cursor-pointer transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-5 shadow-md border border-slate-200 group-hover:border-slate-300 transition-all duration-500">
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-600 text-lg md:text-xl flex-shrink-0 mt-0.5">•</span>
                    <div className="flex-1">
                      <p className="text-xs font-normal text-slate-400 uppercase tracking-widest mb-2">LinkedIn</p>
                      <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm md:text-base leading-relaxed text-slate-600 hover:text-indigo-600 transition-colors break-all">
                        {data.contact.linkedin.split('/').filter(x => x).pop() || 'LinkedIn Profile'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-6 lg:px-8 border-t border-slate-200 bg-white/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs md:text-sm text-slate-600">
            © 2026 {data.personalInfo.fullName || 'Chuyên Viên Triển Khai'}. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// LOGIN PAGE - MODERN MINIMAL DESIGN
// ============================================================================
function AdminLoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === 'MauPhuongAdmin' && password === 'MauPhuong@123') {
        setAdminSession(true);
        onLoginSuccess();
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-3 sm:px-4 relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-xl overflow-hidden border border-slate-200/50">
          {/* Header with accent bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-slate-900" />

          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Logo & Title */}
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 mb-3 md:mb-4 border border-blue-200">
                <svg
                  className="w-6 md:w-7 h-6 md:h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Khu Vực Quản Lý</h1>
              <p className="text-slate-500 text-xs md:text-sm">Đăng nhập với thông tin quản trị viên</p>
            </div>

            {/* Form */}
            <form className="space-y-3 md:space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              {/* Username Input */}
              <div className="relative">
                <label className="block text-xs font-medium text-slate-700 mb-2">Tên Đăng Nhập</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 placeholder-slate-400 text-xs md:text-sm"
                    disabled={loading}
                    autoComplete="username"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-xs font-medium text-slate-700 mb-2">Mật Khẩu</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 placeholder-slate-400 text-xs md:text-sm"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2 md:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 md:gap-3 animate-shake">
                  <svg className="w-4 md:w-5 h-4 md:h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs md:text-sm text-red-700 font-medium">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleLogin}
                disabled={loading}
                className="w-full mt-4 md:mt-6 px-4 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-xs md:text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-3 md:w-4 h-3 md:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m0-20a10 10 0 110 20 10 10 0 010-20z" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Đăng Nhập
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                © 2026 Chuyên Viên Triển Khai. Tất cả quyền được bảo lưu.
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-4 md:mt-6 text-center">
          <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
            <svg className="w-3 md:w-4 h-3 md:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 8l3.293 3.293a1 1 0 01-1.414 1.414l-4-4z" clipRule="evenodd" />
            </svg>
            Kết nối an toàn và được mã hóa
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// ADMIN SETUP PAGE
// ============================================================================
function AdminSetupPage({ data, onSave, onLogout }) {
  const [formData, setFormData] = useState(data);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    saveData(formData);
    onSave(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addItem = (section) => {
    setFormData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      switch (section) {
        case 'professions':
          if (!updated.personalInfo.professions) updated.personalInfo.professions = [];
          updated.personalInfo.professions.push('');
          break;
        case 'education':
          if (!updated.education) updated.education = [];
          updated.education.push({ school: '', degree: '', field: '', startDate: '', endDate: '', description: '' });
          break;
        case 'skills':
          if (!updated.skills) updated.skills = [];
          updated.skills.push({ name: '', level: 50 });
          break;
        case 'experience':
          if (!updated.experience) updated.experience = [];
          updated.experience.push({ company: '', role: '', startDate: '', endDate: '', description: '', skills: [] });
          break;
        case 'projects':
          if (!updated.projects) updated.projects = [];
          updated.projects.push({ title: '', description: '', technologies: [], startDate: '', endDate: '', url: '', image: '' });
          break;
        default:
          break;
      }
      return updated;
    });
  };

  const removeItem = (section, index) => {
    setFormData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (section === 'professions') {
        if (updated.personalInfo.professions) {
          updated.personalInfo.professions.splice(index, 1);
        }
      } else if (updated[section]) {
        updated[section].splice(index, 1);
      }
      return updated;
    });
  };

  const updateArrayItem = (section, index, field, value) => {
    setFormData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated[section] && updated[section][index]) {
        if (field.includes('.')) {
          const subKeys = field.split('.');
          let obj = updated[section][index];
          for (let i = 0; i < subKeys.length - 1; i++) {
            if (!obj[subKeys[i]]) obj[subKeys[i]] = {};
            obj = obj[subKeys[i]];
          }
          obj[subKeys[subKeys.length - 1]] = value;
        } else {
          updated[section][index][field] = value;
        }
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-12">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2">⚙️ Thiết Lập Hồ Sơ</h1>
            <p className="text-xs md:text-sm text-slate-600">Điền thông tin của bạn để tạo hồ sơ chuyên nghiệp</p>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
                  window.storage.clear();
                  setFormData(EMPTY_DATA);
                  setSavedMessage(true);
                  setTimeout(() => setSavedMessage(false), 3000);
                }
              }}
              className="px-3 md:px-6 py-1.5 md:py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold text-xs md:text-sm"
            >
              🗑️ Xóa Tất Cả
            </button>
            <button onClick={onLogout} className="px-3 md:px-6 py-1.5 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-xs md:text-sm">
              🚪 Đăng Xuất
            </button>
          </div>
        </div>

        {savedMessage && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg text-xs md:text-sm">
            ✅ Đã cập nhật
          </div>
        )}

        {/* Thông Tin Cá Nhân */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 uppercase">Thông Tin Cá Nhân</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Họ và Tên</label>
              <input type="text" value={formData.personalInfo?.fullName || ''} onChange={(e) => handleInputChange('personalInfo.fullName', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Ngành Nghề</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  id="professionInput"
                  placeholder="Nhập ngành nghề (e.g., Chuyên viên Triển khai)"
                  className="flex-1 px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('professionInput');
                    if (input.value.trim()) {
                      const updated = JSON.parse(JSON.stringify(formData));
                      if (!updated.personalInfo.professions) updated.personalInfo.professions = [];
                      updated.personalInfo.professions.push(input.value.trim());
                      setFormData(updated);
                      input.value = '';
                    }
                  }}
                  className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-xs md:text-sm"
                >
                  + Thêm
                </button>
              </div>
              {formData.personalInfo?.professions && formData.personalInfo.professions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.personalInfo.professions.map((profession, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200 flex items-center gap-2"
                    >
                      {profession}
                      <button
                        onClick={() => {
                          const updated = JSON.parse(JSON.stringify(formData));
                          updated.personalInfo.professions.splice(idx, 1);
                          setFormData(updated);
                        }}
                        className="text-indigo-600 hover:text-red-600 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Ngày Sinh</label>
              <input type="date" value={formData.personalInfo?.birthDate || ''} onChange={(e) => handleInputChange('personalInfo.birthDate', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Email</label>
              <input type="email" value={formData.personalInfo?.email || ''} onChange={(e) => handleInputChange('personalInfo.email', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Điện Thoại</label>
              <input type="tel" value={formData.personalInfo?.phone || ''} onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Địa Chỉ</label>
              <input type="text" value={formData.personalInfo?.address || ''} onChange={(e) => handleInputChange('personalInfo.address', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Link Ảnh Đại Diện</label>
              <input type="url" value={formData.personalInfo?.avatar || ''} onChange={(e) => handleInputChange('personalInfo.avatar', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
          </div>
        </div>

        {/* Giới Thiệu */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 uppercase">Giới Thiệu</h2>
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Bio</label>
            <textarea value={formData.bio || ''} onChange={(e) => handleInputChange('bio', e.target.value)} rows="4" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-justify text-xs md:text-sm" placeholder="Hãy nói về bản thân bạn..." />
          </div>
        </div>

        {/* Mục tiêu */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 uppercase">Mục tiêu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Mục tiêu Ngắn Hạn</label>
              <textarea value={formData.shortTermGoal || ''} onChange={(e) => handleInputChange('shortTermGoal', e.target.value)} rows="4" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-justify text-xs md:text-sm" placeholder="Mục tiêu ngắn hạn (6-12 tháng)..." />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Mục tiêu Dài Hạn</label>
              <textarea value={formData.longTermGoal || ''} onChange={(e) => handleInputChange('longTermGoal', e.target.value)} rows="4" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-justify text-xs md:text-sm" placeholder="Mục tiêu dài hạn (2-5 năm)..." />
            </div>
          </div>
        </div>

        {/* Kỹ Năng */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 uppercase">Kỹ Năng</h2>
            <button onClick={() => addItem('skills')} className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-sm">+ Thêm</button>
          </div>
          
          {/* Phần nhập liệu */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {formData.skills && formData.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-2 md:gap-4 items-center flex-col md:flex-row">
                <div className="flex-1 w-full">
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Tên Kỹ Năng</label>
                  <input type="text" value={skill.name} onChange={(e) => updateArrayItem('skills', idx, 'name', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                </div>
                <button onClick={() => removeItem('skills', idx)} className="px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm w-full md:w-auto">Xóa</button>
              </div>
            ))}
          </div>

          {/* Preview Card */}
          {formData.skills && formData.skills.filter(s => s.name).length > 0 && (
            <div className="border-t-2 pt-4 md:pt-8">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 md:mb-4">Xem Trước</h3>
              <div className="space-y-2 md:space-y-3">
                {formData.skills.filter(s => s.name).map((skill, idx) => (
                  <div key={idx} className="flex items-center p-3 md:p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                    <span className="text-indigo-600 mr-3 text-lg">•</span>
                    <p className="text-sm md:text-base text-slate-900 font-normal">{skill.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Học Vấn */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 uppercase">Học Vấn</h2>
            <button onClick={() => addItem('education')} className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-sm">+ Thêm</button>
          </div>
          
          {/* Phần nhập liệu */}
          <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            {formData.education && formData.education.map((edu, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg md:rounded-xl p-3 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Trường</label>
                    <input type="text" value={edu.school} onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Bằng Cấp</label>
                    <input type="text" value={edu.degree} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Chuyên Ngành</label>
                    <input type="text" value={edu.field} onChange={(e) => updateArrayItem('education', idx, 'field', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Bắt Đầu</label>
                    <input type="text" value={edu.startDate} onChange={(e) => updateArrayItem('education', idx, 'startDate', e.target.value)} placeholder="2020" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Kết Thúc</label>
                    <input type="text" value={edu.endDate} onChange={(e) => updateArrayItem('education', idx, 'endDate', e.target.value)} placeholder="2024" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">Mô Tả</label>
                    <textarea value={edu.description} onChange={(e) => updateArrayItem('education', idx, 'description', e.target.value)} rows="2" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                </div>
                <button onClick={() => removeItem('education', idx)} className="w-full px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm">Xóa</button>
              </div>
            ))}
          </div>

          {/* Preview Card */}
          {formData.education && formData.education.filter(e => e.degree || e.school).length > 0 && (
            <div className="border-t-2 pt-4 md:pt-8">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 md:mb-4">Xem Trước</h3>
              <div className="space-y-4 md:space-y-8">
                {formData.education.filter(e => e.degree || e.school).map((edu, idx) => (
                  <div key={idx} className="flex gap-3 md:gap-6">
                    <div className="flex-shrink-0 w-10 md:w-12 h-10 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-base md:text-lg">🎓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-xl font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-indigo-600 font-medium text-sm md:text-base">{edu.school}</p>
                      <p className="text-slate-600 text-xs md:text-sm">{edu.field}</p>
                      <p className="text-slate-500 text-xs md:text-sm mt-1">{edu.startDate} - {edu.endDate}</p>
                      {edu.description && (
                        <div className="mt-3 text-slate-600 space-y-2 text-xs md:text-sm">
                          {edu.description.split('\n').filter(line => line.trim()).map((line, lidx) => (
                            <div key={lidx} className="flex items-start gap-3">
                              <span className="text-indigo-600 mt-1 flex-shrink-0">•</span>
                              <p className="text-justify">{line.trim()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kinh Nghiệm */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 uppercase">Kinh Nghiệm Làm Việc</h2>
            <button onClick={() => addItem('experience')} className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-sm">+ Thêm</button>
          </div>
          
          {/* Phần nhập liệu */}
          <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            {formData.experience && formData.experience.map((exp, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg md:rounded-xl p-3 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Công Ty</label>
                    <input type="text" value={exp.company} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Vị Trí</label>
                    <input type="text" value={exp.role} onChange={(e) => updateArrayItem('experience', idx, 'role', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Bắt Đầu</label>
                    <input type="text" value={exp.startDate} onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)} placeholder="01/2022" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Kết Thúc</label>
                    <input type="text" value={exp.endDate} onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)} placeholder="Hiện tại" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Mô Tả</label>
                    <textarea value={exp.description} onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value)} rows="3" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Kỹ Năng Sử Dụng</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id={`skillInput-${idx}`}
                        placeholder="Nhập kỹ năng (e.g., Zalo OA)"
                        className="flex-1 px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`skillInput-${idx}`);
                          if (input.value.trim()) {
                            const updated = JSON.parse(JSON.stringify(formData));
                            if (!updated.experience[idx].skills) updated.experience[idx].skills = [];
                            updated.experience[idx].skills.push(input.value.trim());
                            setFormData(updated);
                            input.value = '';
                          }
                        }}
                        className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-xs md:text-sm"
                      >
                        + Thêm
                      </button>
                    </div>
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, sidx) => (
                          <span
                            key={sidx}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs md:text-sm font-medium border border-indigo-200 flex items-center gap-2"
                          >
                            {skill}
                            <button
                              onClick={() => {
                                const updated = JSON.parse(JSON.stringify(formData));
                                updated.experience[idx].skills.splice(sidx, 1);
                                setFormData(updated);
                              }}
                              className="text-indigo-600 hover:text-red-600 font-bold"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => removeItem('experience', idx)} className="w-full px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm">Xóa</button>
              </div>
            ))}
          </div>

          {/* Preview Card */}
          {formData.experience && formData.experience.filter(e => e.role || e.company).length > 0 && (
            <div className="border-t-2 pt-4 md:pt-8">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 md:mb-4">Xem Trước</h3>
              <div className="space-y-4 md:space-y-8">
                {formData.experience.filter(e => e.role || e.company).map((exp, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg md:rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
                      <div className="min-w-0">
                        <h3 className="text-base md:text-xl font-bold text-slate-900">{exp.role}</h3>
                        <p className="text-indigo-600 font-medium text-sm md:text-base">{exp.company}</p>
                      </div>
                      <span className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-100 text-slate-700 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    {exp.description && (
                      <div className="text-slate-600 space-y-2 mb-4 text-xs md:text-sm">
                        {exp.description.split('\n').filter(line => line.trim()).map((line, lidx) => (
                          <div key={lidx} className="flex items-start gap-3">
                            <span className="text-indigo-600 mt-1 flex-shrink-0">•</span>
                            <p className="text-justify">{line.trim()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, sidx) => (
                          <span key={sidx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs md:text-sm">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dự Án */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 uppercase">Dự Án Triển Khai</h2>
            <button onClick={() => addItem('projects')} className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-sm">+ Thêm</button>
          </div>
          
          {/* Phần nhập liệu */}
          <div className="space-y-6 mb-8">
            {formData.projects && formData.projects.map((proj, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg md:rounded-xl p-3 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Tên Dự Án</label>
                    <input type="text" value={proj.title} onChange={(e) => updateArrayItem('projects', idx, 'title', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Mô Tả</label>
                    <textarea value={proj.description} onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value)} rows="3" className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Công Nghệ</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id={`techInput-${idx}`}
                        placeholder="Nhập công nghệ (e.g., Zalo OA)"
                        className="flex-1 px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`techInput-${idx}`);
                          if (input.value.trim()) {
                            const updated = JSON.parse(JSON.stringify(formData));
                            if (!updated.projects[idx].technologies) updated.projects[idx].technologies = [];
                            updated.projects[idx].technologies.push(input.value.trim());
                            setFormData(updated);
                            input.value = '';
                          }
                        }}
                        className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-xs md:text-sm"
                      >
                        + Thêm
                      </button>
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.technologies.map((tech, tidx) => (
                          <span
                            key={tidx}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs md:text-sm font-medium border border-indigo-200 flex items-center gap-2"
                          >
                            {tech}
                            <button
                              onClick={() => {
                                const updated = JSON.parse(JSON.stringify(formData));
                                updated.projects[idx].technologies.splice(tidx, 1);
                                setFormData(updated);
                              }}
                              className="text-indigo-600 hover:text-red-600 font-bold"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => removeItem('projects', idx)} className="w-full px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm">Xóa</button>
              </div>
            ))}
          </div>

          {/* Preview Card */}
          {formData.projects && formData.projects.filter(p => p.title || p.description).length > 0 && (
            <div className="border-t-2 pt-4 md:pt-8">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 md:mb-4">Xem Trước</h3>
              <div className="space-y-4 md:space-y-8">
                {formData.projects.filter(p => p.title || p.description).map((project, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg md:rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                    <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 md:mb-4">{project.title}</h3>
                    {project.description && (
                      <div className="text-slate-600 space-y-2 mb-4 text-xs md:text-sm">
                        {project.description.split('\n').filter(line => line.trim()).map((line, lidx) => (
                          <div key={lidx} className="flex items-start gap-3">
                            <span className="text-indigo-600 mt-1 flex-shrink-0">•</span>
                            <p className="text-justify">{line.trim()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, tidx) => (
                          <span key={tidx} className="px-3 md:px-4 py-1 md:py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs md:text-sm font-medium border border-indigo-200">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 uppercase">Thông Tin Liên Hệ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Email</label>
              <input type="email" value={formData.contact?.email || ''} onChange={(e) => handleInputChange('contact.email', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Điện Thoại</label>
              <input type="tel" value={formData.contact?.phone || ''} onChange={(e) => handleInputChange('contact.phone', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">Địa Chỉ</label>
              <input type="text" value={formData.contact?.address || ''} onChange={(e) => handleInputChange('contact.address', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
              <input type="url" value={formData.contact?.linkedin || ''} onChange={(e) => handleInputChange('contact.linkedin', e.target.value)} className="w-full px-3 md:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <button onClick={handleSave} className="flex-1 px-6 md:px-8 py-3 md:py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm md:text-lg">
            💾 Lưu Thay Đổi
          </button>
          <a href="/" className="flex-1 px-6 md:px-8 py-3 md:py-4 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-semibold text-sm md:text-lg text-center">
            👁️ Xem Profile
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN CONTAINER - HANDLES LOGIN STATE
// ============================================================================
function AdminContainer({ data, onSave }) {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminSession());
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsLoggedIn(false);
    navigate('/');
  };

  if (!isLoggedIn) {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminSetupPage data={data} onSave={onSave} onLogout={handleLogout} />;
}

// ============================================================================
// MAIN APP WITH ROUTING
// ============================================================================
export default function App() {
  const [data, setData] = useState(loadData());

  const handleSaveFromAdmin = (newData) => {
    setData(newData);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfilePage data={data} />} />
        <Route path="/admin" element={<AdminContainer data={data} onSave={handleSaveFromAdmin} />} />
      </Routes>
    </BrowserRouter>
  );
}
