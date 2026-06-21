const ProfileFooter = ({ profileData, t, scrollToSection }) => {
  return (
    <footer className="border-t border-app-border py-8 mt-16 bg-app-card">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-app-muted">
        <p className="select-none font-mono">
          © {new Date().getFullYear()} {profileData.name}. All rights reserved.
        </p>
        <div className="flex gap-4">
          <button onClick={() => scrollToSection('hero')} className="hover:text-app-accent transition-colors cursor-pointer">{t.backToTop}</button>
        </div>
      </div>
    </footer>
  );
};

export default ProfileFooter;
