import { GraduationCap } from 'lucide-react';

const ProfileEducation = ({ profileData, t }) => {
  return (
    <section id="education" className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3 border-b border-app-border pb-4">
        <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
          <GraduationCap className="w-5 h-5" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.education}</h2>
      </div>

      <div className="p-6 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.005] relative overflow-hidden space-y-3 shadow-sm group">
        {/* Decorative background glow */}
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="font-display text-lg font-bold text-app-text group-hover:text-app-accent transition-colors">
              {profileData.education?.school}
            </h3>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent border border-app-accent/20 shrink-0">
              {t.graduated}: {profileData.education?.year}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-app-muted">{profileData.education?.major}</p>
            {profileData.education?.skills && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profileData.education.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2.5 py-1 rounded-lg bg-app-bg text-xs font-bold text-app-accent border border-app-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileEducation;
