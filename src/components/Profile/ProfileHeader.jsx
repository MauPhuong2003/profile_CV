import { Globe } from 'lucide-react';
import ThemeToggle from '../Common/ThemeToggle';

const ProfileHeader = ({ 
  profileData, 
  t, 
  awardsToDisplay, 
  currentLang, 
  setCurrentLang, 
  isDarkMode, 
  toggleTheme, 
  scrollToSection 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-app-bg/75 backdrop-blur-md border-b border-app-border transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-app-accent to-indigo-600 flex items-center justify-center font-bold text-black text-lg">
            {profileData.name.charAt(0)}
          </div>
          <span className="font-display font-bold text-lg tracking-tight hover:text-app-accent transition-colors">
            {profileData.name}
          </span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-app-muted">
          <button onClick={() => scrollToSection('about')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navAbout}</button>
          <button onClick={() => scrollToSection('skills')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navSkills}</button>
          <button onClick={() => scrollToSection('experience')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navExperience}</button>
          <button onClick={() => scrollToSection('projects')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navProjects}</button>
          <button onClick={() => scrollToSection('education')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navEducation}</button>
          {awardsToDisplay && awardsToDisplay.length > 0 && (
            <button onClick={() => scrollToSection('awards')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navAwards}</button>
          )}
          <button onClick={() => scrollToSection('contact')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navContact}</button>
        </nav>

        <div className="flex items-center gap-3">
          {/* LANGUAGE TOGGLE BUTTON */}
          <button 
            onClick={() => setCurrentLang(prev => prev === 'vi' ? 'en' : 'vi')}
            className="px-2.5 py-2 rounded-lg bg-app-card border border-app-border text-xs font-bold text-app-text hover:text-app-accent hover:border-app-accent/40 transition-all cursor-pointer flex items-center gap-1.5"
            title={currentLang === 'vi' ? "Switch to English" : "Chuyển sang Tiếng Việt"}
          >
            <Globe className="w-3.5 h-3.5 text-app-accent" />
            <span>{currentLang === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          {/* LIGHT/DARK MODE TOGGLE BUTTON */}
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
            className="p-2 rounded-lg"
          />

          <button 
            onClick={() => scrollToSection('contact')} 
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-app-accent/10 cursor-pointer"
          >
            {t.connectNow}
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
