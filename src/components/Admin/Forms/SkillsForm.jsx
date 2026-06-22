import { Plus, Trash2, Brain } from 'lucide-react';
import TechInput from '../../Common/TechInput';

const SkillsForm = ({
  editData,
  handleUpdateCategoryName,
  handleAddSkill,
  handleUpdateSkill,
  handleDeleteSkill,
  handleManualChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">
          Kỹ năng chuyên môn
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(editData.skills || {}).map((cat, catIdx) => (
            <div key={catIdx} className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3">
              <div className="flex items-center justify-between gap-2">
                <input 
                  type="text" 
                  value={cat} 
                  onChange={(e) => handleUpdateCategoryName(cat, e.target.value)}
                  className="font-bold text-sm bg-transparent border-b border-transparent hover:border-app-border focus:border-app-accent focus:outline-none text-app-text w-[60%]"
                  placeholder="Tên nhóm kỹ năng"
                />
                <button 
                  type="button"
                  onClick={() => handleAddSkill(cat)}
                  className="p-1 rounded bg-app-accent/10 text-app-accent hover:bg-app-accent/25 transition-all text-xs flex items-center gap-1 font-bold cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm
                </button>
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

