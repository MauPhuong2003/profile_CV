import { ArrowUpRight } from 'lucide-react';

const ContactForm = ({ editData, handleManualChange, handleManualNestedChange }) => {
  return (
    <div className="p-6 rounded-xl bg-app-bg/50 border border-app-border space-y-3">
      <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">
        Thông tin cá nhân & Liên hệ
      </h4>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">Ngày sinh</label>
          <input 
            type="text" 
            value={editData.birthDate || ''} 
            onChange={(e) => handleManualChange('birthDate', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">Số điện thoại</label>
          <input 
            type="text" 
            value={editData.phone || ''} 
            onChange={(e) => handleManualChange('phone', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">Email</label>
          <input 
            type="email" 
            value={editData.contact?.email || ''} 
            onChange={(e) => handleManualNestedChange('contact', 'email', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">Địa chỉ</label>
          <input 
            type="text" 
            value={editData.address || ''} 
            onChange={(e) => handleManualChange('address', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">LinkedIn URL</label>
          <input 
            type="text" 
            value={editData.contact?.linkedin || ''} 
            onChange={(e) => handleManualNestedChange('contact', 'linkedin', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] uppercase font-bold text-app-muted flex items-center gap-1">
            Tọa độ Google Maps
            <span className="text-app-accent/60 normal-case font-normal">(để link địa chỉ trên bản đồ)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-app-muted">Vĩ độ (Latitude)</label>
              <input 
                type="text" 
                placeholder="10.7769" 
                value={editData.lat || ''} 
                onChange={(e) => handleManualChange('lat', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-app-muted">Kinh độ (Longitude)</label>
              <input 
                type="text" 
                placeholder="106.7009" 
                value={editData.lng || ''} 
                onChange={(e) => handleManualChange('lng', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
              />
            </div>
          </div>
          <p className="text-[10px] text-app-muted/70 leading-relaxed">
            Tra tọa độ tại <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-app-accent hover:underline inline-flex items-center gap-0.5">maps.google.com<ArrowUpRight className="w-2.5 h-2.5" /></a> → chuột phải vào vị trí → sao chép tọa độ
          </p>
        </div>

        {/* Web3Forms Configuration */}
        <div className="border-t border-app-border/40 pt-3 mt-2 space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-app-accent flex items-center gap-1">
            Web3Forms Access Key
            <span className="text-app-muted normal-case font-normal">(để gửi mail trực tiếp từ Website)</span>
          </label>
          <input 
            type="password" 
            placeholder="Nhập Access Key từ Web3Forms (ví dụ: a1b2c3d4-e5f6-...)" 
            value={editData.web3FormsKey || ''} 
            onChange={(e) => handleManualChange('web3FormsKey', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
          />
          <p className="text-[10px] text-app-muted/70 leading-relaxed">
            Đăng ký nhận mã Key miễn phí ngay lập tức tại <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-app-accent hover:underline inline-flex items-center gap-0.5">web3forms.com<ArrowUpRight className="w-2.5 h-2.5" /></a> (Chỉ cần điền email của bạn để nhận Key tức thì, hoàn toàn miễn phí).
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
