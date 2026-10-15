<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Common components
import ThemeToggle from './components/Common/ThemeToggle';

// Profile components
import ProfileHeader from './components/Profile/ProfileHeader';
import ProfileHero from './components/Profile/ProfileHero';
import ProfileAbout from './components/Profile/ProfileAbout';
import ProfileSkills from './components/Profile/ProfileSkills';
import ProfileExperience from './components/Profile/ProfileExperience';
import ProfileProjects from './components/Profile/ProfileProjects';
import ProfileEducation from './components/Profile/ProfileEducation';
import ProfileAwards from './components/Profile/ProfileAwards';
import ProfileContact from './components/Profile/ProfileContact';
import ProfileFooter from './components/Profile/ProfileFooter';

// Admin components
import AdminAuth from './components/Admin/AdminAuth';
import AdminHeader from './components/Admin/AdminHeader';
import AdminSidebar from './components/Admin/AdminSidebar';

// Admin forms
import BasicInfoForm from './components/Admin/Forms/BasicInfoForm';
import SkillsForm from './components/Admin/Forms/SkillsForm';
import ExperienceForm from './components/Admin/Forms/ExperienceForm';
import ProjectsForm from './components/Admin/Forms/ProjectsForm';
import EducationForm from './components/Admin/Forms/EducationForm';
import AwardsForm from './components/Admin/Forms/AwardsForm';
import ContactForm from './components/Admin/Forms/ContactForm';

const uiTranslations = {
  about: "Giới thiệu bản thân",
  skills: "Kỹ năng chuyên môn",
  experience: "Kinh nghiệm làm việc",
  projects: "Dự án nổi bật",
  education: "Học vấn & Bằng cấp",
  contact: "Liên hệ",
  contactMe: "Liên hệ với tôi",
  downloadCv: "Tải CV",
  contactInfo: "Thông tin liên hệ",
  birthDate: "Ngày sinh",
  phone: "Số điện thoại",
  address: "Địa chỉ",
  shortGoal: "Mục tiêu ngắn hạn",
  longGoal: "Mục tiêu dài hạn",
  graduated: "Tốt nghiệp",
  navAbout: "Giới thiệu",
  navSkills: "Kỹ năng",
  navExperience: "Kinh nghiệm",
  navProjects: "Dự án",
  navEducation: "Học vấn",
  navContact: "Liên hệ",
  recruiterConnect: "Bạn là nhà tuyển dụng muốn kết nối? Hãy gửi tin nhắn trực tiếp qua biểu mẫu hoặc qua thông tin liên hệ bên dưới:",
  contactSuccessTitle: "Gửi tin nhắn thành công!",
  contactSuccessDesc: "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi lại sớm nhất có thể.",
  yourName: "Tên của bạn",
  emailAddress: "Địa chỉ Email",
  messageContent: "Nội dung tin nhắn",
  messagePlaceholder: "Lời nhắn của bạn...",
  sendBtn: "Gửi tin nhắn",
  sending: "Đang gửi...",
  backToTop: "Đầu trang",
  connectNow: "Liên hệ ngay",
  awards: "Giải thưởng & Thành tựu",
  navAwards: "Giải thưởng",
  awarded: "Đạt giải",
  softSkills: "Kỹ năng mềm"
};

const defaultProfile = {
  name: "",
  title: "",
  bio: "",
  avatar: "",
  about: "",
  shortTermGoal: "",
  longTermGoal: "",
  cvUrl: "",
  birthDate: "",
  phone: "",
  address: "",
  skills: {
    "Triển khai": [],
    "Tích hợp kỹ thuật": [],
    "Công cụ & Kiểm thử": [],
    "AI tools": []
  },
  softSkills: [],
  experience: [],
  projects: [],
  education: [],
  awards: [],
  contact: {
    email: "",
    linkedin: "",
    github: ""
  },
  lat: "",
  lng: "",
  web3FormsKey: ""
};

const normalizeProfile = (profile) => {
  const normalized = { ...defaultProfile, ...profile };
  
  if (!normalized.skills || typeof normalized.skills !== 'object' || Array.isArray(normalized.skills)) {
    normalized.skills = { ...defaultProfile.skills };
  }
  
  if (normalized.education && !Array.isArray(normalized.education)) {
    if (typeof normalized.education === 'object' && Object.keys(normalized.education).length > 0) {
      const { school, major, year, skills } = normalized.education;
      if (school || major || year || skills) {
        normalized.education = [{
          school: school || "",
          major: major || "",
          year: year || "",
          skills: skills || ""
        }];
      } else {
        normalized.education = [];
      }
    } else {
      normalized.education = [];
    }
  }
  if (!normalized.education) {
    normalized.education = [];
  }
  
  return normalized;
};

function App() {

  const [allProfiles, setAllProfiles] = useState(() => {
    try {
      const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
      if (savedMultilang) {
        const parsed = JSON.parse(savedMultilang);
        return {
          vi: normalizeProfile(parsed.vi)
        };
      }
      const saved = localStorage.getItem('cv_profile_data');
      if (saved) {
        const parsedOld = JSON.parse(saved);
        return {
          vi: normalizeProfile(parsedOld)
        };
      }
    } catch (err) {
      console.error("Error reading initial localStorage:", err);
    }
    return {
      vi: defaultProfile
    };
  });

  const profileData = allProfiles.vi || defaultProfile;
  const profileDataToDisplay = profileData;

  const awardsToDisplay = profileDataToDisplay.awards || [];
  const softSkillsToDisplay = profileDataToDisplay.softSkills || [];

  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'cv';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return sessionStorage.getItem('theme') === 'dark';
  });

  const [passError, setPassError] = useState('');
  const [isAuthed, setIsAuthed] = useState(() => {
    return sessionStorage.getItem('admin_authed') === 'true';
  });
  const [adminTab, setAdminTab] = useState('basic');

  const [editData, setEditData] = useState(profileData);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedAvatarName, setUploadedAvatarName] = useState(() => {
    return profileData.avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '';
  });

  const t = uiTranslations;

  const [apiKey, setApiKey] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('Chuyên nghiệp');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponseRaw, setAiResponseRaw] = useState('');
  const [parsedAiData, setParsedAiData] = useState(null);
  const [aiError, setAiError] = useState('');
  const [cvBlobUrl, setCvBlobUrl] = useState('');

  // Admin Save Success Toast
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Firebase Firestore States
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Convert Base64 data CV to blob URL
  useEffect(() => {
    if (profileData.cvUrl && profileData.cvUrl.startsWith('data:')) {
      try {
        const parts = profileData.cvUrl.split(',');
        const contentType = parts[0].split(':')[1].split(';')[0] || 'application/pdf';
        const base64Data = parts[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const url = URL.createObjectURL(blob);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCvBlobUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Error creating CV blob URL:", err);
        setCvBlobUrl('');
      }
    } else {
      setCvBlobUrl('');
    }
  }, [profileData.cvUrl]);

  // Sync Router with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname === '/admin' ? 'admin' : 'cv');
    };
    
    window.addEventListener('popstate', handlePopState);
    
    const savedTheme = sessionStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load Profile Data from Firebase Firestore
  useEffect(() => {
    const loadData = async () => {
      if (!db) {
        console.log("Firebase is not initialized. Using localStorage fallback.");
        try {
          const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
          if (savedMultilang) {
            const parsed = JSON.parse(savedMultilang);
            const loadedProfiles = {
              vi: normalizeProfile(parsed.vi)
            };
            setAllProfiles(loadedProfiles);
            setEditData(loadedProfiles.vi);
          } else {
            const saved = localStorage.getItem('cv_profile_data');
            if (saved) {
              const loadedProfiles = {
                vi: normalizeProfile(JSON.parse(saved))
              };
              setAllProfiles(loadedProfiles);
              setEditData(loadedProfiles.vi);
            }
          }
        } catch (err) {
          console.error("Lỗi khi đọc từ localStorage:", err);
        }
        setIsDbLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "profile", "default");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dbData = docSnap.data();
          let loadedProfiles = {
            vi: defaultProfile
          };
          
          if (dbData.vi) {
            loadedProfiles.vi = normalizeProfile(dbData.vi);
          } else if (dbData.name) {
            loadedProfiles.vi = normalizeProfile(dbData);
          }
          
          setAllProfiles(loadedProfiles);
          setEditData(loadedProfiles.vi);
        } else {
          const initial = { vi: defaultProfile };
          await setDoc(docRef, initial);
          setAllProfiles(initial);
          setEditData(initial.vi);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ Firestore:", error);
        try {
          const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
          if (savedMultilang) {
            const parsed = JSON.parse(savedMultilang);
            const loadedProfiles = {
              vi: normalizeProfile(parsed.vi)
            };
            setAllProfiles(loadedProfiles);
            setEditData(loadedProfiles.vi);
          } else {
            const saved = localStorage.getItem('cv_profile_data');
            if (saved) {
              const loadedProfiles = {
                vi: normalizeProfile(JSON.parse(saved))
              };
              setAllProfiles(loadedProfiles);
              setEditData(loadedProfiles.vi);
            }
          }
        } catch (err) {
          console.error("Error loading localStorage fallback:", err);
        }
      } finally {
        setIsDbLoading(false);
      }
    };

    loadData();
  }, []);

  // Sync editData when allProfiles changes (e.g. loaded data)
  useEffect(() => {
    if (allProfiles.vi) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditData(allProfiles.vi);
      setUploadedAvatarName(allProfiles.vi.avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '');
    }
  }, [allProfiles]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path === '/admin' ? 'admin' : 'cv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (path === '/admin') {
      setEditData({ ...allProfiles.vi });
      setPassError('');
      setUploadedAvatarName(allProfiles.vi.avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '');
    }
  };


  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      sessionStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      sessionStorage.setItem('theme', 'light');
    }
  };

  const handleAuthSubmit = (password) => {
    if (password === 'MauPhuong@123') {
      setIsAuthed(true);
      sessionStorage.setItem('admin_authed', 'true');
      setPassError('');
    } else {
      setPassError('Sai mật khẩu! Vui lòng kiểm tra lại.');
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    sessionStorage.removeItem('admin_authed');
    navigateTo('/admin');
  };

  const scrollToSection = (id) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleManualChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualNestedChange = (parentField, childField, value) => {
    setEditData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const handleCvFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert(`Không thể tải lên! Tệp tin CV của bạn quá lớn (${Math.round(file.size / (1024 * 1024) * 100) / 100}MB). Trình duyệt và Firebase giới hạn dung lượng lưu trữ tối đa. Vui lòng nén tệp tin PDF xuống dưới 1MB (khuyên dùng dưới 700KB) bằng các công cụ nén PDF trực tuyến như Smallpdf, ILovePDF trước khi tải lên.`);
        e.target.value = null; // Reset file input
        return;
      }
      if (file.size > 700 * 1024) {
        alert(`Cảnh báo: Tệp tin CV của bạn khá nặng (${Math.round(file.size / 1024)}KB). Bạn nên nén tệp PDF xuống dưới 700KB để đảm bảo đồng bộ lên Firebase thành công.`);
      }
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        handleManualChange('cvUrl', event.target.result);
      };
      reader.onerror = () => {
        alert('Đã xảy ra lỗi khi đọc file!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCvFile = () => {
    setUploadedFileName('');
    handleManualChange('cvUrl', '');
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
      }
      setUploadedAvatarName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Downscale to max 800px for better sharpness on Retina
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Use high quality image smoothing to prevent blurriness during downscale
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Apply a sharpening filter
          const sharpen = (context, w, h, mix) => {
            const imageData = context.getImageData(0, 0, w, h);
            const data = imageData.data;
            const output = new ImageData(w, h);
            const dst = output.data;
            const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                const dstOff = (y * w + x) * 4;
                let r = 0, g = 0, b = 0;
                for (let cy = 0; cy < 3; cy++) {
                  for (let cx = 0; cx < 3; cx++) {
                    const scy = Math.min(Math.max(y + cy - 1, 0), h - 1);
                    const scx = Math.min(Math.max(x + cx - 1, 0), w - 1);
                    const srcOff = (scy * w + scx) * 4;
                    const wt = weights[cy * 3 + cx];
                    r += data[srcOff] * wt;
                    g += data[srcOff + 1] * wt;
                    b += data[srcOff + 2] * wt;
                  }
                }
                dst[dstOff] = data[dstOff] + (r - data[dstOff]) * mix;
                dst[dstOff + 1] = data[dstOff + 1] + (g - data[dstOff + 1]) * mix;
                dst[dstOff + 2] = data[dstOff + 2] + (b - data[dstOff + 2]) * mix;
                dst[dstOff + 3] = data[dstOff + 3]; // alpha
              }
            }
            context.putImageData(output, 0, 0);
          };
          
          // Mix = 0.35 (light sharpen)
          sharpen(ctx, width, height, 0.35);
          
          // Compress to JPEG with 85% quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          console.log("Compressed and sharpened avatar size:", Math.round(compressedDataUrl.length / 1024), "KB");
          
          handleManualChange('avatar', compressedDataUrl);
        };
      };
      reader.onerror = () => {
        alert('Đã xảy ra lỗi khi đọc file ảnh!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatarFile = () => {
    setUploadedAvatarName('');
    handleManualChange('avatar', '');
  };

  const handleAddSkill = (category) => {
    const currentSkills = editData.skills[category] || [];
    const newSkillName = 'Kỹ năng mới';
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...currentSkills, newSkillName]
      }
    }));
  };

  const handleUpdateSkill = (category, index, val) => {
    const currentSkills = [...editData.skills[category]];
    currentSkills[index] = val;
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: currentSkills
      }
    }));
  };

  const handleDeleteSkill = (category, index) => {
    const currentSkills = (editData.skills[category] || []).filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: currentSkills
      }
    }));
  };

  const handleUpdateCategoryName = (oldName, newName) => {
    if (oldName === newName) return;
    setEditData(prev => {
      const newSkills = {};
      Object.keys(prev.skills || {}).forEach(key => {
        if (key === oldName) {
          newSkills[newName] = prev.skills[oldName] || [];
        } else {
          newSkills[key] = prev.skills[key];
        }
      });
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  const handleAddSkillCategory = (catName) => {
    if (!catName || !catName.trim()) return;
    const trimmed = catName.trim();
    if (editData.skills && editData.skills[trimmed]) return;
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [trimmed]: []
      }
    }));
  };

  const handleDeleteSkillCategory = (catName) => {
    setEditData(prev => {
      const newSkills = { ...prev.skills };
      delete newSkills[catName];
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  const handleAddExperience = () => {
    const newItemVi = { company: 'Công ty mới', role: 'Vị trí công việc', period: '2024', description: 'Mô tả công việc của bạn', skills: [] };
    setEditData(prev => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        newItemVi
      ]
    }));
  };

  const handleUpdateExperience = (index, field, val) => {
    const list = [...editData.experience];
    list[index] = { ...list[index], [field]: val };
    setEditData(prev => ({
      ...prev,
      experience: list
    }));
  };

  const handleDeleteExperience = (index) => {
    setEditData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddProject = () => {
    const newItemVi = { name: 'Dự án mới', description: 'Mô tả dự án', tech: ['React'], demo: '#', period: '' };
    setEditData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        newItemVi
      ]
    }));
  };

  const handleUpdateProject = (index, field, val) => {
    const list = [...editData.projects];
    let computedVal = val;
    if (field === 'tech') {
      computedVal = Array.isArray(val) ? val : val.split(',').map(s => s.trim()).filter(Boolean);
    }
    list[index] = { ...list[index], [field]: computedVal };
    setEditData(prev => ({
      ...prev,
      projects: list
    }));
  };

  const handleDeleteProject = (index) => {
    setEditData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { school: 'Trường học mới', major: 'Chuyên ngành', year: '2024', skills: '' }
      ]
    }));
  };

  const handleUpdateEducation = (index, field, val) => {
    setEditData(prev => {
      const list = [...(prev.education || [])];
      if (list[index]) {
        list[index] = { ...list[index], [field]: val };
      }
      return {
        ...prev,
        education: list
      };
    });
  };

  const handleDeleteEducation = (index) => {
    setEditData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddAward = () => {
    const newItemVi = { title: 'Giải thưởng mới', year: new Date().getFullYear().toString(), issuer: 'Tổ chức cấp giải' };
    setEditData(prev => ({
      ...prev,
      awards: [
        ...(prev.awards || []),
        newItemVi
      ]
    }));
  };

  const handleUpdateAward = (index, field, val) => {
    const list = [...(editData.awards || [])];
    list[index] = { ...list[index], [field]: val };
    setEditData(prev => ({
      ...prev,
      awards: list
    }));
  };

  const handleDeleteAward = (index) => {
    setEditData(prev => ({
      ...prev,
      awards: (prev.awards || []).filter((_, i) => i !== index)
    }));
  };

  const handleReorderItem = (field, dragIndex, hoverIndex) => {
    setEditData(prev => {
      const list = [...(prev[field] || [])];
      const draggedItem = list[dragIndex];
      list.splice(dragIndex, 1);
      list.splice(hoverIndex, 0, draggedItem);
      return {
        ...prev,
        [field]: list
      };
    });
  };

  const handleReorderSkills = (dragIndex, hoverIndex) => {
    setEditData(prev => {
      const keys = Object.keys(prev.skills || {});
      const draggedKey = keys[dragIndex];
      keys.splice(dragIndex, 1);
      keys.splice(hoverIndex, 0, draggedKey);
      
      const newSkills = {};
      keys.forEach(key => {
        newSkills[key] = prev.skills[key];
      });
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  const handleClearBrowserCache = () => {
    if (window.confirm("Bạn có chắc muốn giải phóng bộ nhớ đệm LocalStorage không? Thao tác này sẽ xóa cache trên trình duyệt và tải lại dữ liệu mới nhất từ máy chủ Firebase.")) {
      localStorage.removeItem('cv_profile_data_multilang');
      localStorage.removeItem('cv_profile_data');
      window.location.reload();
    }
  };

  const handleSaveManual = async () => {
    setIsSaving(true);
    const updatedProfiles = {
      vi: editData,
      en: editData
    };
    
    let localSaved = false;
    let serverSaved = false;
    let serverError = null;

    // 1. Save to LocalStorage first to guarantee no data loss!
    try {
      localStorage.setItem('cv_profile_data_multilang', JSON.stringify(updatedProfiles));
      localStorage.setItem('cv_profile_data', JSON.stringify(updatedProfiles.vi));
      localSaved = true;
    } catch (err) {
      console.error("Lỗi khi lưu vào LocalStorage:", err);
      // Auto-recovery: if LocalStorage is full, clear the old cache and retry writing
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        try {
          console.warn("LocalStorage full. Attempting to clear cache and retry...");
          localStorage.removeItem('cv_profile_data_multilang');
          localStorage.removeItem('cv_profile_data');
          localStorage.setItem('cv_profile_data_multilang', JSON.stringify(updatedProfiles));
          localStorage.setItem('cv_profile_data', JSON.stringify(updatedProfiles.vi));
          localSaved = true;
          console.log("LocalStorage recovered and saved successfully.");
        } catch (retryErr) {
          console.error("Failed to recover LocalStorage even after clearing cache:", retryErr);
        }
      }
    }

    // 2. Save to Firebase Firestore
    if (db) {
      try {
        const docRef = doc(db, "profile", "default");
        await setDoc(docRef, updatedProfiles);
        console.log("Dữ liệu đã được lưu lên Firebase Firestore.");
        serverSaved = true;
      } catch (error) {
        console.error('Lỗi khi lưu lên Firebase Firestore:', error);
        serverError = error;
      }
    }

    setIsSaving(false);

    if (localSaved) {
      setAllProfiles(updatedProfiles);
      
      if (db && !serverSaved) {
        // Firebase failure diagnostics
        if (serverError && (serverError.code === 'permission-denied' || serverError.message?.includes('permission'))) {
          alert('Đã lưu dữ liệu thành công cục bộ trên trình duyệt (LocalStorage)!\nTuy nhiên, không thể đồng bộ lên máy chủ Firebase do lỗi phân quyền (Security Rules). Vui lòng cấu hình lại Firestore rules để cho phép ghi.');
        } else if (serverError && (serverError.message?.includes('too large') || serverError.message?.includes('size limit') || JSON.stringify(updatedProfiles).length > 800000)) {
          alert('Đã lưu dữ liệu thành công cục bộ trên trình duyệt (LocalStorage)!\nTuy nhiên, không thể đồng bộ lên Firebase do dung lượng tệp tin (ảnh đại diện/CV) quá lớn (Hạn chế 1MB của Firestore). Vui lòng thử tải lên ảnh/file kích thước nhỏ hơn.');
        } else {
          alert('Đã lưu dữ liệu thành công cục bộ trên trình duyệt (LocalStorage)!\nTuy nhiên, không thể đồng bộ lên máy chủ Firebase (Vui lòng kiểm tra cấu hình Firebase hoặc kết nối mạng).');
        }
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      // LocalStorage fallback failed (typically quota exceeded even after clearing)
      alert('Không thể lưu dữ liệu! Trình duyệt hết bộ nhớ lưu trữ. Vui lòng thử dùng ảnh đại diện hoặc tệp tin CV có kích thước nhỏ hơn.');
    }
  };

  const extractJSON = (text) => {
    try {
      return JSON.parse(text);
    } catch (err) {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1].trim());
        } catch (err2) {
          console.error("Failed parsing jsonMatch:", err2);
        }
      }
      const startIdx = text.indexOf('{');
      const endIdx = text.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        try {
          return JSON.parse(text.slice(startIdx, endIdx + 1));
        } catch (err3) {
          console.error("Failed parsing bracket slice:", err3);
        }
      }
      throw new Error("Không thể parse dữ liệu JSON từ phản hồi của AI. Vui lòng thử lại.", { cause: err });
    }
  };

  const handleGenerateAI = async () => {
    if (!apiKey.trim()) {
      setAiError('Vui lòng nhập Anthropic API Key!');
      return;
    }
    if (!aiPrompt.trim()) {
      setAiError('Vui lòng nhập mô tả bản thân!');
      return;
    }

    setIsAiLoading(true);
    setAiError('');
    setAiResponseRaw('');
    setParsedAiData(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `Bạn là chuyên gia viết CV chuyên nghiệp người Việt Nam. Dựa trên thông tin sau, hãy tạo nội dung CV thật chi tiết và chuyên nghiệp, phù hợp với một lập trình viên.
      
Thông tin: ${aiPrompt}
Phong cách: ${aiStyle}

Trả về JSON với cấu trúc CHÍNH XÁC sau (chỉ trả về JSON, không kèm giải thích hoặc markdown):
{
  "name": "Họ tên",
  "title": "Chức danh",
  "bio": "Giới thiệu ngắn 1-2 câu",
  "about": "Giới thiệu chi tiết 3-4 câu",
  "shortTermGoal": "Mục tiêu ngắn hạn 1-2 câu",
  "longTermGoal": "Mục tiêu dài hạn 1-2 câu",
  "birthDate": "DD/MM/YYYY",
  "phone": "Số điện thoại",
  "address": "Địa chỉ",
  "skills": {
    "Frontend": ["React", "..."],
    "Backend": ["Node.js", "..."],
    "Tools": ["Git", "..."]
  },
  "experience": [
    {
      "company": "Tên công ty",
      "role": "Vị trí",
      "period": "2022 - 2024",
      "description": "Mô tả ngắn công việc và thành tựu",
      "skills": ["React"]
    }
  ],
  "projects": [
    {
      "name": "Tên dự án",
      "description": "Mô tả dự án",
      "tech": ["React"],
      "github": "#",
      "demo": "#"
    }
  ],
  "education": {
    "school": "Tên trường",
    "major": "Ngành học",
    "year": "2020",
    "skills": "Các kỹ năng đạt được"
  },
  "awards": [
    {
      "title": "Tên giải thưởng",
      "year": "2023",
      "issuer": "Tổ chức cấp"
    }
  ],
  "contact": {
    "email": "email@example.com",
    "linkedin": "https://linkedin.com/in/...",
    "github": "https://github.com/..."
  }
}`
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const contentText = data.content[0]?.text;
      
      if (!contentText) {
        throw new Error("Không nhận được nội dung từ API.");
      }

      setAiResponseRaw(contentText);
      const parsed = extractJSON(contentText);
      
      parsed.cvUrl = profileData.cvUrl;
      parsed.avatar = profileData.avatar;
      parsed.awards = parsed.awards || [];
      
      setParsedAiData(parsed);
    } catch (err) {
      console.error(err);
      setAiError(err.message || 'Có lỗi xảy ra khi gọi API Anthropic. Hãy kiểm tra API Key hoặc kết nối mạng.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiData = async () => {
    if (parsedAiData) {
      const normalizedAiData = normalizeProfile(parsedAiData);
      const updatedProfiles = {
        vi: normalizedAiData,
        en: normalizedAiData
      };
      
      let localSaved = false;
      try {
        localStorage.setItem('cv_profile_data_multilang', JSON.stringify(updatedProfiles));
        localStorage.setItem('cv_profile_data', JSON.stringify(updatedProfiles.vi));
        localSaved = true;
      } catch (err) {
        console.error("Lỗi khi lưu LocalStorage dữ liệu AI:", err);
      }

      if (db) {
        try {
          const docRef = doc(db, "profile", "default");
          await setDoc(docRef, updatedProfiles);
          console.log("Dữ liệu AI đã được lưu lên Firebase Firestore.");
        } catch (e) {
          console.error("Lỗi khi đồng bộ dữ liệu AI lên Firebase:", e);
          alert("Áp dụng dữ liệu AI thành công cục bộ! Tuy nhiên đồng bộ lên Firebase thất bại.");
        }
      }

      if (localSaved) {
        setAllProfiles(updatedProfiles);
        setEditData(normalizedAiData);
      }
      navigateTo('/admin');
    }
  };

  if (isDbLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans space-y-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#0F0F14] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-app-accent/20 border-t-app-accent rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-app-accent absolute animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-display font-bold text-lg">Đang tải dữ liệu...</h3>
        </div>
      </div>
    );
  }

  if (currentRoute === 'admin') {
    const getStorageSizeInfo = () => {
      try {
        const dataStr = JSON.stringify(editData || {});
        const sizeKb = Math.round(dataStr.length / 1024);
        const percent = Math.min(Math.round((dataStr.length / (5 * 1024 * 1024)) * 100), 100);
        return { sizeKb, percent };
      } catch (e) {
        return { sizeKb: 0, percent: 0 };
      }
    };
    const storageInfo = getStorageSizeInfo();

    return (
      <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 font-sans md:h-screen md:overflow-hidden">
        
        {/* Theme switcher floating in admin page */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
            className="p-2"
          />
        </div>

        {/* ADMIN AUTH SCREEN */}
        {!isAuthed ? (
          <AdminAuth 
            onVerify={handleAuthSubmit} 
            passError={passError} 
            clearError={() => setPassError('')}
          />
        ) : (
          
          // ADMIN CONTROL PANEL DASHBOARD (Full screen)
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 md:py-6 md:h-full md:max-h-screen md:flex md:flex-col md:gap-6 md:space-y-0 md:overflow-hidden">
            
            <AdminHeader navigateTo={navigateTo} handleLogout={handleLogout} handleClearBrowserCache={handleClearBrowserCache} />

            {/* Admin Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:flex-1 md:min-h-0">
              
              {/* Vertical Sidebar Menu */}
              <AdminSidebar adminTab={adminTab} setAdminTab={setAdminTab} />

              {/* Admin Main Editor Body (Right panel) */}
              <div className="md:col-span-3 p-6 rounded-2xl bg-app-card border border-app-border shadow-xl min-h-[500px] md:h-full md:overflow-y-auto custom-scrollbar">
                
                {adminTab === 'basic' && (
                  <BasicInfoForm 
                    editData={editData}
                    handleManualChange={handleManualChange}
                    uploadedFileName={uploadedFileName}
                    uploadedAvatarName={uploadedAvatarName}
                    setUploadedAvatarName={setUploadedAvatarName}
                    handleCvFileUpload={handleCvFileUpload}
                    handleRemoveCvFile={handleRemoveCvFile}
                    handleAvatarFileUpload={handleAvatarFileUpload}
                    handleRemoveAvatarFile={handleRemoveAvatarFile}
                  />
                )}

                {adminTab === 'skills' && (
                  <SkillsForm 
                    editData={editData}
                    handleUpdateCategoryName={handleUpdateCategoryName}
                    handleAddSkill={handleAddSkill}
                    handleUpdateSkill={handleUpdateSkill}
                    handleDeleteSkill={handleDeleteSkill}
                    handleManualChange={handleManualChange}
                    handleAddSkillCategory={handleAddSkillCategory}
                    handleDeleteSkillCategory={handleDeleteSkillCategory}
                    handleReorderSkills={handleReorderSkills}
                  />
                )}

                {adminTab === 'experience' && (
                  <ExperienceForm 
                    editData={editData}
                    handleAddExperience={handleAddExperience}
                    handleUpdateExperience={handleUpdateExperience}
                    handleDeleteExperience={handleDeleteExperience}
                    handleReorderItem={handleReorderItem}
                  />
                )}

                {adminTab === 'projects' && (
                  <ProjectsForm 
                    editData={editData}
                    handleAddProject={handleAddProject}
                    handleUpdateProject={handleUpdateProject}
                    handleDeleteProject={handleDeleteProject}
                    handleReorderItem={handleReorderItem}
                  />
                )}

                {adminTab === 'education' && (
                  <EducationForm 
                    editData={editData}
                    handleAddEducation={handleAddEducation}
                    handleUpdateEducation={handleUpdateEducation}
                    handleDeleteEducation={handleDeleteEducation}
                    handleReorderItem={handleReorderItem}
                  />
                )}

                {adminTab === 'contact' && (
                  <ContactForm 
                    editData={editData}
                    handleManualChange={handleManualChange}
                    handleManualNestedChange={handleManualNestedChange}
                  />
                )}

                {adminTab === 'awards' && (
                  <AwardsForm 
                    editData={editData}
                    handleAddAward={handleAddAward}
                    handleUpdateAward={handleUpdateAward}
                    handleDeleteAward={handleDeleteAward}
                    handleReorderItem={handleReorderItem}
                  />
                )}

                {/* Manual Edit Action bottom */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-app-border pt-4 mt-6">
                  {/* Storage usage indicator */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${storageInfo.percent > 80 ? 'bg-red-500 animate-pulse' : storageInfo.percent > 50 ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                      <span className="text-xs text-app-muted font-sans font-medium">
                        Dung lượng dữ liệu: {storageInfo.sizeKb}KB / 5000KB ({storageInfo.percent}%)
                      </span>
                    </div>
                    {storageInfo.percent > 50 && (
                      <span className="text-[10px] text-amber-500 font-sans leading-tight max-w-[280px]">
                        {storageInfo.percent > 80 
                          ? '⚠️ Bộ nhớ sắp đầy! Vui lòng gỡ file CV nặng hoặc thay thế bằng ảnh/file nhỏ hơn.' 
                          : 'Khuyên dùng: Nén file CV xuống dưới 700KB để lưu trữ mượt mà.'
                        }
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {saveSuccess && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        Đã lưu thành công!
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveManual}
                      disabled={isSaving}
                      className={`px-6 py-2.5 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-lg shadow-app-accent/15 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-black" />
                          Lưu Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 font-sans antialiased relative selection:bg-app-accent/30 selection:text-app-accent">
      
      {/* 1. HEADER (Fixed Navigation with Glassmorphism) */}
      <ProfileHeader 
        profileData={profileDataToDisplay} 
        t={t} 
        awardsToDisplay={awardsToDisplay} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        scrollToSection={scrollToSection} 
      />

      {/* Hero background mesh light gradient */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-app-accent/5 via-app-bg/0 to-app-bg/0 pointer-events-none z-0"></div>

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-24 relative z-10 space-y-32 md:space-y-44">
        
        {/* SECTION 1: HERO */}
        <ProfileHero 
          profileData={profileDataToDisplay} 
          t={t} 
          cvBlobUrl={cvBlobUrl} 
          scrollToSection={scrollToSection} 
        />

        {/* SECTION 2: ABOUT & CONTACT INFO SIDE-BY-SIDE */}
        <ProfileAbout 
          profileData={profileDataToDisplay} 
          t={t} 
        />

        {/* SECTION 3: SKILLS */}
        <ProfileSkills 
          profileData={profileDataToDisplay} 
          t={t} 
          softSkillsToDisplay={softSkillsToDisplay}
        />

        {/* SECTION 4: EXPERIENCE */}
        <ProfileExperience 
          profileData={profileDataToDisplay} 
          t={t} 
        />

        {/* SECTION 5: PROJECTS */}
        <ProfileProjects 
          profileData={profileDataToDisplay} 
          t={t} 
        />

        {/* SECTION 6: EDUCATION */}
        <ProfileEducation 
          profileData={profileDataToDisplay} 
          t={t} 
        />

        {/* SECTION 7: AWARDS */}
        <ProfileAwards 
          awardsToDisplay={awardsToDisplay} 
          t={t} 
        />

        {/* SECTION 8: CONTACT */}
        <ProfileContact 
          profileData={profileDataToDisplay} 
          t={t} 
        />
        
      </main>

      {/* SECTION 9: FOOTER */}
      <ProfileFooter 
        profileData={profileDataToDisplay} 
        t={t} 
        scrollToSection={scrollToSection} 
      />

    </div>
  );
}

export default App;
>>>>>>> 268455f6f9910ceee3c184c5471a4c88baf0e4ae
