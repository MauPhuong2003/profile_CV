import { Laptop, ArrowUpRight } from 'lucide-react';

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

const ProfileProjects = ({ profileData, t }) => {
  return (
    <section id="projects" className="scroll-mt-24 space-y-12">
      <div className="flex items-center gap-3 border-b border-app-border pb-6">
        <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
          <Laptop className="w-5 h-5" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-wide text-app-text">{t.projects}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {profileData.projects?.map((proj, idx) => (
          <div 
            key={idx} 
            className="flex flex-col justify-between p-6 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.01] group relative overflow-hidden shadow-sm"
          >
            {/* Decorative background glow */}
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>
            
            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-app-text group-hover:text-app-accent transition-colors">
                  {proj.name}
                </h3>
              </div>
              {renderDescriptionList(proj.description)}
               <div className="flex flex-wrap gap-1.5">
                {proj.tech?.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-app-bg text-xs font-bold text-app-accent border border-app-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 text-sm font-bold relative z-10">
              {proj.demo && proj.demo !== '#' && (
                <a 
                  href={proj.demo} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 text-app-accent hover:underline cursor-pointer"
                >
                  Demo
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileProjects;
