import { Info, Code, Briefcase, Target, GraduationCap, Trophy, Contact } from 'lucide-react';

const AdminSidebar = ({ adminTab, setAdminTab }) => {
  const menuItems = [
    { id: 'basic', label: 'Thông tin chung', icon: Info },
    { id: 'skills', label: 'Kỹ năng', icon: Code },
    { id: 'experience', label: 'Kinh nghiệm', icon: Briefcase },
    { id: 'projects', label: 'Dự án', icon: Target },
    { id: 'education', label: 'Học vấn', icon: GraduationCap },
    { id: 'awards', label: 'Giải thưởng', icon: Trophy },
    { id: 'contact', label: 'Liên hệ & Cài đặt', icon: Contact }
  ];

  return (
    <div className="md:col-span-1 flex flex-col gap-2 md:h-full md:overflow-y-auto">
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-app-muted/60 select-none">
        Menu Quản lý
      </div>
      
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = adminTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setAdminTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all border cursor-pointer ${
              isActive
                ? item.highlight 
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50 text-indigo-400 font-extrabold shadow-lg shadow-indigo-500/5'
                  : 'bg-app-accent text-black border-app-accent font-extrabold shadow-lg shadow-app-accent/15'
                : item.highlight
                  ? 'bg-indigo-950/20 border-indigo-500/10 text-indigo-300 hover:bg-indigo-500/15'
                  : 'bg-app-card/60 border-app-border/40 text-app-muted hover:text-app-text hover:bg-app-card'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'scale-110' : ''}`} />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AdminSidebar;
