import { Code, Brain } from 'lucide-react';

const getSortedSkills = (skills, lang) => {
  if (!skills) return [];
  const entries = Object.entries(skills);
  const orderVi = ["Triển khai", "Tích hợp kỹ thuật", "Công cụ & Kiểm thử", "AI tools"];
  const orderEn = ["Deployment", "Technical Integration", "Tools & Testing", "AI Tools"];
  const orderList = lang === 'vi' ? orderVi : orderEn;
  
  return entries.sort((a, b) => {
    const idxA = orderList.indexOf(a[0]);
    const idxB = orderList.indexOf(b[0]);
    const valA = idxA === -1 ? 999 : idxA;
    const valB = idxB === -1 ? 999 : idxB;
    return valA - valB;
  });
};

const softSkillTranslations = {
  // Database values
  "Cài đặt & cấu hình phần mềm": "Software Installation & Configuration",
  "Quản trị cơ sở dữ liệu": "Database Administration",
  "Xử lý sự cố kỹ thuật": "Technical Troubleshooting",
  
  // Common fallbacks
  "Làm việc nhóm": "Teamwork",
  "Giao tiếp": "Communication",
  "Giải quyết vấn đề": "Problem Solving",
  "Quản lý thời gian": "Time Management",
  "Tư duy phản biện": "Critical Thinking",
  "Khả năng thích ứng": "Adaptability",
  "Thích ứng": "Adaptability",
  "Sáng tạo": "Creativity"
};

const translateSoftSkill = (skill, lang) => {
  if (lang === 'vi') return skill;
  return softSkillTranslations[skill] || skill;
};

const ProfileSkills = ({ profileData, currentLang, t, softSkillsToDisplay }) => {
  return (
    <section id="skills" className="scroll-mt-24 space-y-12">
      <div className="space-y-10">
        <div className="flex items-center gap-3 border-b border-app-border pb-6">
          <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
            <Code className="w-5 h-5" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-wide text-app-text">{t.skills}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getSortedSkills(profileData.skills, currentLang).map(([category, items]) => (
            <div 
              key={category} 
              className="p-5 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.005] relative overflow-hidden group shadow-sm flex flex-col justify-between"
            >
              {/* Decorative background glow */}
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>

              <div className="relative z-10 space-y-4 flex flex-col flex-grow">
                <h3 className="font-display text-app-accent font-bold text-lg flex items-center justify-between">
                  {category}
                  <span className="w-2 h-2 rounded-full bg-app-accent/40 group-hover:bg-app-accent transition-all"></span>
                </h3>
                <div className="flex flex-wrap gap-2 flex-grow content-start">
                  {items.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-app-bg text-app-text border border-app-border hover:border-app-accent/30 hover:text-app-accent transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {softSkillsToDisplay && softSkillsToDisplay.length > 0 && (
        <div className="space-y-10 pt-4">
          <div className="flex items-center gap-3 border-b border-app-border pb-6">
            <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
              <Brain className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-wide text-app-text">{t.softSkills}</h2>
          </div>

          <div className="p-6 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all relative overflow-hidden shadow-sm group">
            {/* Decorative background glow */}
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>

            <div className="relative z-10 flex flex-wrap gap-2.5">
              {softSkillsToDisplay.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-app-bg text-app-text border border-app-border hover:border-app-accent/30 hover:text-app-accent transition-all cursor-default"
                >
                  {translateSoftSkill(skill, currentLang)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileSkills;

