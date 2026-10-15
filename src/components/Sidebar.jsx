import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ChevronRight,
  Home,
  User,
  Briefcase,
  BookOpen,
  Star,
  MessageSquare,
  Settings,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/',
      badge: null
    },
    {
      id: 'profile',
      label: 'Hồ Sơ',
      icon: User,
      path: '/profile',
      submenu: [
        { label: 'Thông Tin Cá Nhân', path: '/profile/personal' },
        { label: 'Ảnh Đại Diện', path: '/profile/avatar' },
        { label: 'Giới Thiệu', path: '/profile/bio' }
      ]
    },
    {
      id: 'experience',
      label: 'Kinh Nghiệm',
      icon: Briefcase,
      path: '/experience',
      submenu: [
        { label: 'Công Việc', path: '/experience/jobs' },
        { label: 'Dự Án', path: '/experience/projects' }
      ]
    },
    {
      id: 'education',
      label: 'Giáo Dục',
      icon: BookOpen,
      path: '/education',
      badge: '2'
    },
    {
      id: 'skills',
      label: 'Kỹ Năng',
      icon: Star,
      path: '/skills',
      badge: null
    },
    {
      id: 'testimonials',
      label: 'Giới Thiệu',
      icon: MessageSquare,
      path: '/testimonials',
      badge: null
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubmenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } lg:w-64 overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <div className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <p className="text-xs text-blue-100">Chuyên Viên</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 px-3 space-y-2 pb-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenu === item.id;

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <Link
                  to={item.path}
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSubmenu(item.id);
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {/* Background Gradient Animation */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon
                      size={20}
                      className={`transition-transform duration-300 ${
                        isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <span
                      className={`font-medium transition-all duration-300 ${
                        isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:opacity-100 lg:w-auto'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Badge or Chevron */}
                  <div className="relative z-10 flex items-center gap-2">
                    {item.badge && (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {hasSubmenu && (
                      <ChevronRight
                        size={18}
                        className={`transition-transform duration-300 ${
                          isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'
                        }`}
                      />
                    )}
                  </div>
                </Link>

                {/* Submenu Items */}
                {hasSubmenu && isExpanded && (
                  <div className="mt-2 ml-2 space-y-1.5 border-l-2 border-slate-700 pl-3">
                    {item.submenu.map((subitem, index) => (
                      <Link
                        key={index}
                        to={subitem.path}
                        className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 relative group overflow-hidden ${
                          isActiveRoute(subitem.path)
                            ? 'bg-blue-500 text-white font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                          {subitem.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Settings at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700 bg-slate-900/50 backdrop-blur">
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors duration-200" />
              <span className={`transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:opacity-100 lg:w-auto'}`}>
                Cài Đặt
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area Spacer */}
      <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'lg:ml-20'}`} />
    </>
  );
};

export default Sidebar;
