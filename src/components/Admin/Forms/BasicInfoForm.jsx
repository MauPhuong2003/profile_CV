import { File, Upload, CheckCircle, Trash2 } from 'lucide-react';

const BasicInfoForm = ({
  editData,
  handleManualChange,
  uploadedFileName,
  uploadedAvatarName,
  setUploadedAvatarName,
  handleCvFileUpload,
  handleRemoveCvFile,
  handleAvatarFileUpload,
  handleRemoveAvatarFile
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">
        Thông tin cơ bản & File CV
      </h4>
      
      {/* CV File Attachment block */}
      <div className="p-4 rounded-xl bg-app-accent/5 border border-app-accent/15 space-y-4">
        <h5 className="text-xs font-bold text-app-text flex items-center gap-1.5">
          <File className="w-4 h-4 text-app-accent" />
          Gắn File CV Cá Nhân
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-app-muted">Hoặc gắn đường dẫn liên kết (URL)</label>
            <input 
              type="text" 
              placeholder="https://drive.google.com/..."
              value={editData.cvUrl || ''} 
              onChange={(e) => handleManualChange('cvUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-app-muted">Tải trực tiếp file CV (.pdf, .doc, .docx)</label>
            <div className="flex items-center gap-3">
              <label className="px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-xs font-semibold hover:border-app-accent/40 cursor-pointer flex items-center gap-2 text-app-text transition-all">
                <Upload className="w-3.5 h-3.5 text-app-accent" />
                Tải lên file mới
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleCvFileUpload} 
                  className="hidden" 
                />
              </label>
              
              {editData.cvUrl && editData.cvUrl.startsWith('data:') && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-app-border text-xs text-app-text">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="max-w-[150px] truncate">{uploadedFileName || 'File đã đính kèm (base64)'}</span>
                  <button 
                    onClick={handleRemoveCvFile}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Gỡ file đính kèm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-app-muted leading-relaxed">
          Mẹo: Bạn có thể chọn tải file PDF trực tiếp lên. Hệ thống sẽ chuyển file này thành mã hóa Base64 và lưu trực tiếp trong bộ nhớ ứng dụng. Khi người dùng bấm nút "Download CV", trình duyệt sẽ tự động tải file này về cho họ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-app-muted">Họ và Tên</label>
          <input 
            type="text" 
            value={editData.name} 
            onChange={(e) => handleManualChange('name', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-app-muted">Chức danh công việc</label>
          <input 
            type="text" 
            value={editData.title} 
            onChange={(e) => handleManualChange('title', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-app-muted">Bio ngắn (Hero)</label>
          <input 
            type="text" 
            value={editData.bio} 
            onChange={(e) => handleManualChange('bio', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
          />
        </div>
        <div className="space-y-3 md:col-span-2 border-t border-app-border/40 pt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-app-accent">Hình ảnh đại diện (Avatar)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-app-muted">Đường dẫn liên kết (URL)</label>
              <input 
                type="text" 
                placeholder="https://..."
                value={editData.avatar || ''} 
                onChange={(e) => {
                  handleManualChange('avatar', e.target.value);
                  if (!e.target.value.startsWith('data:')) {
                    setUploadedAvatarName('');
                  }
                }}
                className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-app-muted">Hoặc tải trực tiếp từ thiết bị</label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-xs font-semibold hover:border-app-accent/40 cursor-pointer flex items-center gap-2 text-app-text transition-all">
                  <Upload className="w-3.5 h-3.5 text-app-accent" />
                  Chọn ảnh
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarFileUpload} 
                    className="hidden" 
                  />
                </label>
                
                {editData.avatar && (editData.avatar.startsWith('data:') || uploadedAvatarName) && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-app-border text-xs text-app-text">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span className="max-w-[150px] truncate">{uploadedAvatarName || 'Ảnh từ thiết bị'}</span>
                    <button 
                      type="button"
                      onClick={handleRemoveAvatarFile}
                      className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Gỡ ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview component */}
          {editData.avatar && (
            <div className="mt-2 flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-app-border/40 max-w-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-app-accent/40 bg-app-bg flex-shrink-0">
                <img 
                  src={editData.avatar} 
                  alt="Xem trước avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-app-text">Xem trước ảnh</p>
                <p className="text-app-muted truncate max-w-[250px]">
                  {editData.avatar.startsWith('data:') ? 'Dữ liệu Base64 từ thiết bị' : editData.avatar}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-app-muted">Giới thiệu bản thân (3-4 câu)</label>
          <textarea 
            rows="4"
            value={editData.about} 
            onChange={(e) => handleManualChange('about', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none resize-none text-app-text"
          ></textarea>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-app-muted">Mục tiêu ngắn hạn</label>
          <textarea 
            rows="2"
            value={editData.shortTermGoal || ''} 
            onChange={(e) => handleManualChange('shortTermGoal', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none resize-none text-app-text"
          ></textarea>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-app-muted">Mục tiêu dài hạn</label>
          <textarea 
            rows="2"
            value={editData.longTermGoal || ''} 
            onChange={(e) => handleManualChange('longTermGoal', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none resize-none text-app-text"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
