import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminAuth = ({ onVerify, passError, clearError }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onVerify(passwordInput);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-app-card border border-app-border shadow-2xl space-y-6 relative overflow-hidden">
        {/* background glows for auth */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-app-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col items-center text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-app-accent/10 text-app-accent flex items-center justify-center border border-app-accent/20 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-app-text">Đăng nhập Admin</h2>
          <p className="text-xs text-app-muted">Mở khóa bảng điều khiển để chỉnh sửa hồ sơ CV cá nhân</p>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-app-muted">Mật khẩu quản trị</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Vui lòng nhập mật khẩu" 
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  clearError();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1.5 top-1.5 p-1.5 rounded-md hover:bg-white/10 text-app-muted hover:text-app-text transition-colors cursor-pointer"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passError && (
              <p className="text-xs text-red-500 font-semibold">{passError}</p>
            )}
            <p className="text-[10px] text-app-muted leading-relaxed pt-1">
              Gợi ý: Mật khẩu quản lý đã được cập nhật. Nhập đúng mật khẩu để truy cập.
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
