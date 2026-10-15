import { Briefcase } from 'lucide-react';

const renderDescriptionList = (description) => {
  if (!description) return null;
  const lines = description
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(/^[\s\-*•+]+/, '').trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <ul className="list-disc pl-5 space-y-3 text-xs md:text-sm text-app-muted leading-loose tracking-wide">
      {lines.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  );
};

const ProfileExperience = ({ profileData, t }) => {
  return (
    <section id="experience" className="scroll-mt-24 space-y-12">
      <div className="flex items-center gap-3 border-b border-app-border pb-6">
        <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
          <Briefcase className="w-5 h-5" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-wide text-app-text">{t.experience}</h2>
      </div>

      {/* Wrapper: absolute lane line + flex items */}
      <div className="relative">
        {/* Continuous vertical lane — center aligned with dots */}
        <div className="absolute left-[9px] top-6 bottom-6 w-0.5 bg-app-border/50"></div>

        <div className="space-y-8">
          {profileData.experience?.map((exp, idx) => (
            <div key={idx} className="flex items-start gap-5 group">

              {/* Timeline dot — sits exactly on the lane */}
              <div className="relative w-[18px] h-[18px] shrink-0 rounded-full bg-app-card border-2 border-app-accent transition-all duration-300 z-10 flex items-center justify-center mt-5">
                <div className="w-2 h-2 rounded-full bg-app-accent transition-all duration-300"></div>
                <span className="absolute inset-0 rounded-full bg-app-accent/25 animate-ping pointer-events-none"></span>
              </div>

              {/* Experience Card */}
              <div className="flex-1 p-5 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.005] relative overflow-hidden shadow-sm">
                {/* Decorative background glow */}
                <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>

                <div className="space-y-5 relative z-10">
                  {/* Header: company + period badge */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-base font-bold text-app-accent">
                        {exp.company}
                      </h3>
                      <p className="text-sm font-semibold text-app-text group-hover:text-app-accent transition-colors mt-0.5">{exp.role}</p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent border border-app-accent/20 shrink-0">
                      {exp.period}
                    </span>
                  </div>

                  {/* Bulleted description */}
                  {renderDescriptionList(exp.description)}

                  {/* Experience Skills tags */}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-app-bg text-xs font-bold text-app-accent border border-app-border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileExperience;
