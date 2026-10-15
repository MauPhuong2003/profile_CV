import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDarkMode, toggleTheme, className = "" }) => {
  return (
    <button 
      onClick={toggleTheme}
      className={`p-2.5 rounded-lg bg-app-card border border-app-border text-app-muted hover:text-app-accent hover:border-app-accent/40 transition-all cursor-pointer flex items-center justify-center ${className}`}
      title="Đổi giao diện Sáng/Tối"
    >
      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
