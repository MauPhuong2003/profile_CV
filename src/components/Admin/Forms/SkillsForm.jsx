import { useState } from 'react';
import { Plus, Trash2, Brain, GripVertical } from 'lucide-react';
import TechInput from '../../Common/TechInput';

const SkillsForm = ({
  editData,
  handleUpdateCategoryName,
  handleAddSkill,
  handleUpdateSkill,
  handleDeleteSkill,
  handleManualChange,
  handleAddSkillCategory,
  handleDeleteSkillCategory,
  handleReorderSkills
}) => {
  const [activeDragIdx, setActiveDragIdx] = useState(null);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-app-border pb-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent">
            Kỹ năng chuyên môn
          </h4>
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              placeholder="Tên nhóm kỹ năng mới..."
              id="new-category-input"
              className="px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none w-44"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddSkillCategory(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button 
              type="button"
              onClick={() => {
                const input = document.getElementById('new-category-input');
                if (input && input.value) {
                  handleAddSkillCategory(input.value);
                  input.value = '';
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-app-accent text-black font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer font-sans"
            >
              <Plus className="w-3.5 h-3.5 text-black" /> Thêm nhóm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(editData.skills || {}).map((cat, catIdx) => (
            <div 
              key={catIdx} 
              draggable={activeDragIdx === catIdx}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", catIdx.toString());
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
                if (dragIndex !== catIdx) {
                  handleReorderSkills(dragIndex, catIdx);
                }
                setActiveDragIdx(null);
              }}
              className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3 relative transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <input 
                  type="text" 
                  value={cat} 
                  onChange={(e) => handleUpdateCategoryName(cat, e.target.value)}
                  className="font-bold text-sm bg-transparent border-b border-transparent hover:border-app-border focus:border-app-accent focus:outline-none text-app-text w-[45%]"
                  placeholder="Tên nhóm kỹ năng"
                />
                <div className="flex items-center gap-1.5">
                  <div 
                    className="p-1.5 rounded bg-app-card border border-app-border text-app-muted hover:text-app-text hover:border-app-accent/40 cursor-grab active:cursor-grabbing transition-colors"
                    onMouseDown={() => setActiveDragIdx(catIdx)}
                    onMouseUp={() => setActiveDragIdx(null)}
                    title="Kéo thả để sắp xếp nhóm"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleAddSkill(cat)}
                    className="p-1 px-2 rounded bg-app-accent/10 text-app-accent hover:bg-app-accent/25 transition-all text-xs flex items-center gap-1 font-bold cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa nhóm kỹ năng "${cat}" không?`)) {
                        handleDeleteSkillCategory(cat);
                      }
                    }}
                    className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-colors cursor-pointer shrink-0"
                    title="Xóa nhóm kỹ năng này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {editData.skills[cat]?.map((skill, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={skill} 
                      onChange={(e) => handleUpdateSkill(cat, idx, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => handleDeleteSkill(cat, idx)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-app-border/40">
        <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Kỹ năng mềm
        </h4>
        <div className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3">
          <TechInput 
            value={editData.softSkills || []} 
            onChange={(newVal) => handleManualChange('softSkills', newVal)}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;

