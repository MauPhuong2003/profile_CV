const EducationForm = ({ editData, handleManualNestedChange }) => {
  return (
    <div className="p-6 rounded-xl bg-app-bg/50 border border-app-border space-y-3">
      <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">
        Học vấn
      </h4>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">Trường học</label>
          <input 
            type="text" 
            value={editData.education?.school || ''} 
            onChange={(e) => handleManualNestedChange('education', 'school', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">Chuyên ngành</label>
          <input 
            type="text" 
            value={editData.education?.major || ''} 
            onChange={(e) => handleManualNestedChange('education', 'major', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">Năm tốt nghiệp</label>
          <input 
            type="text" 
            value={editData.education?.year || ''} 
            onChange={(e) => handleManualNestedChange('education', 'year', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-app-muted">Kỹ năng / Thành tựu (ngăn cách bằng dấu phẩy)</label>
          <input 
            type="text" 
            placeholder="Ví dụ: Lập trình Java, Làm việc nhóm, Giải quyết vấn đề"
            value={editData.education?.skills || ''} 
            onChange={(e) => handleManualNestedChange('education', 'skills', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default EducationForm;
