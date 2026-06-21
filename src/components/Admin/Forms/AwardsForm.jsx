import { Plus, Trash2 } from 'lucide-react';

const AwardsForm = ({
  editData,
  handleAddAward,
  handleUpdateAward,
  handleDeleteAward
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-app-border pb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent">Giải thưởng & Thành tựu</h4>
        <button 
          type="button"
          onClick={handleAddAward}
          className="px-3 py-1.5 rounded-lg bg-app-accent text-black font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" /> Thêm giải thưởng
        </button>
      </div>

      <div className="space-y-4">
        {editData.awards?.map((award, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3 relative">
            <button 
              type="button"
              onClick={() => handleDeleteAward(idx)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-app-muted">Tên giải thưởng / chứng nhận</label>
                <input 
                  type="text" 
                  value={award.title} 
                  onChange={(e) => handleUpdateAward(idx, 'title', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-app-muted">Năm đạt giải</label>
                <input 
                  type="text" 
                  value={award.year} 
                  onChange={(e) => handleUpdateAward(idx, 'year', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1 sm:col-span-3">
                <label className="text-[10px] uppercase font-bold text-app-muted">Tổ chức cấp / Chi tiết (Tùy chọn)</label>
                <input 
                  type="text" 
                  value={award.issuer || ''} 
                  onChange={(e) => handleUpdateAward(idx, 'issuer', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
        {(!editData.awards || editData.awards.length === 0) && (
          <p className="text-xs text-app-muted italic">Chưa cấu hình giải thưởng nào.</p>
        )}
      </div>
    </div>
  );
};

export default AwardsForm;
