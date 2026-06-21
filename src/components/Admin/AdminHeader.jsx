import { Settings, ArrowLeft, LogOut } from 'lucide-react';

const AdminHeader = ({ navigateTo, handleLogout }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-app-card border border-app-border shadow-xl md:shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-app-accent/10 text-app-accent border border-app-accent/20">
          <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-app-text tracking-tight">Admin Control Panel</h1>
          <p className="text-xs text-app-muted">Quản lý nội dung CV của bạn và ứng dụng AI tự động hóa</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button 
          onClick={() => navigateTo('/')}
          className="px-4 py-2 rounded-lg bg-white/5 border border-app-border text-app-text text-sm hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Xem CV của tôi
        </button>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm hover:bg-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
