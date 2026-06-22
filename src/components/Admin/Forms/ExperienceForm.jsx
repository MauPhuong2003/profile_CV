import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import TechInput from '../../Common/TechInput';

const ExperienceForm = ({
  editData,
  handleAddExperience,
  handleUpdateExperience,
  handleDeleteExperience,
  handleReorderItem
}) => {
  const [activeDragIdx, setActiveDragIdx] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-app-border pb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent">Kinh nghiệm làm việc</h4>
        <button 
          type="button"
          onClick={handleAddExperience}
          className="px-3 py-1.5 rounded-lg bg-app-accent text-black font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4 text-black" /> Thêm kinh nghiệm
        </button>
      </div>

      <div className="space-y-4">
        {editData.experience?.map((exp, idx) => (
          <div 
            key={idx} 
            draggable={activeDragIdx === idx}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", idx.toString());
              e.currentTarget.classList.add("opacity-50");
            }}
            onDragEnd={(e) => {
              e.currentTarget.classList.remove("opacity-50");
              setActiveDragIdx(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
              if (dragIndex !== idx) {
                handleReorderItem('experience', dragIndex, idx);
              }
              setActiveDragIdx(null);
            }}
            className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3 relative transition-all"
          >
            <div className="absolute right-4 top-4 flex items-center gap-1.5">
              <div 
                className="p-1.5 rounded-lg bg-app-card border border-app-border text-app-muted hover:text-app-text hover:border-app-accent/40 cursor-grab active:cursor-grabbing transition-colors"
                onMouseDown={() => setActiveDragIdx(idx)}
                onMouseUp={() => setActiveDragIdx(null)}
                title="Kéo thả để sắp xếp"
              >
                <GripVertical className="w-4 h-4" />
              </div>
              <button 
                type="button"
                onClick={() => handleDeleteExperience(idx)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-app-muted">Công ty</label>
                <input 
                  type="text" 
                  value={exp.company} 
                  onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-app-muted">Vị trí / Chức danh</label>
                <input 
                  type="text" 
                  value={exp.role} 
                  onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-app-muted">Thời gian</label>
                <input 
                  type="text" 
                  value={exp.period} 
                  onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1 sm:col-span-3">
                <label className="text-[10px] uppercase font-bold text-app-muted">Mô tả công việc (Xuống dòng để tạo chấm đầu dòng mới)</label>
                <textarea 
                  rows="4"
                  placeholder="Nhập mô tả công việc. Mỗi dòng sẽ tự động hiển thị dưới dạng dấu chấm đầu dòng."
                  value={exp.description} 
                  onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none resize-y"
                ></textarea>
              </div>
              <div className="space-y-1 sm:col-span-3">
                <label className="text-[10px] uppercase font-bold text-app-muted">Kỹ năng sử dụng</label>
                <TechInput 
                  value={exp.skills || []} 
                  onChange={(val) => handleUpdateExperience(idx, 'skills', val)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceForm;
