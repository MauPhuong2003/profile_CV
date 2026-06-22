import { Mail, Download } from 'lucide-react';

const ProfileHero = ({ profileData, t, cvBlobUrl, scrollToSection }) => {
  return (
    <section id="hero" className="flex flex-col items-center text-center space-y-6 pt-8 md:pt-16">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-app-accent to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <img 
          src={profileData.avatar} 
          alt={profileData.name} 
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-app-accent/80 shadow-2xl bg-app-card"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80";
          }}
        />
      </div>
      
      <div className="space-y-5 max-w-2xl">
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-wide text-app-text">
          {profileData.name}
        </h1>
        <p className="font-display text-xl md:text-2xl font-bold text-app-accent/95">
          {profileData.title}
        </p>
        <p className="text-xs md:text-sm text-app-muted leading-loose tracking-wide max-w-lg mx-auto text-justify">
          {profileData.bio}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <a 
          href="#contact" 
          onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-app-accent text-black font-extrabold text-sm md:text-base hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-app-accent/15 cursor-pointer"
        >
          <Mail className="w-4 h-4 text-black" />
          {t.contactMe}
        </a>
        <a 
          href={cvBlobUrl || profileData.cvUrl || "#"} 
          download="CV_Profile.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-app-card border border-app-border text-app-text font-semibold text-sm md:text-base hover:bg-white/10 hover:border-app-accent/30 transition-all hover:scale-[1.02]"
        >
          <Download className="w-4 h-4 text-app-accent" />
          {t.downloadCv}
        </a>
      </div>
    </section>
  );
};

export default ProfileHero;
