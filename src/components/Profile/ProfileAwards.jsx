import { Trophy } from 'lucide-react';

const ProfileAwards = ({ awardsToDisplay, t }) => {
  if (!awardsToDisplay || awardsToDisplay.length === 0) return null;

  return (
    <section id="awards" className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3 border-b border-app-border pb-4">
        <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
          <Trophy className="w-5 h-5" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.awards}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {awardsToDisplay.map((award, idx) => (
          <div 
            key={idx} 
            className="flex flex-col justify-between p-6 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.01] group relative overflow-hidden shadow-sm"
          >
            {/* Decorative background glow */}
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>
            
            <div className="space-y-2 relative z-10">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-bold text-app-text group-hover:text-app-accent transition-colors leading-snug">
                  {award.title}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent border border-app-accent/20 shrink-0">
                  {award.year}
                </span>
              </div>
              {award.issuer && (
                <p className="text-sm text-app-muted leading-relaxed">
                  {award.issuer}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileAwards;
