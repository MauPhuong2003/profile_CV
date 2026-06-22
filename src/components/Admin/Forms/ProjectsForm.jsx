import { Plus, Trash2 } from 'lucide-react';
import TechInput from '../../Common/TechInput';

const ProjectsForm = ({
  editData,
  handleAddProject,
  handleUpdateProject,
  handleDeleteProject
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-app-border pb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent">Dự án nổi bật</h4>
        <button 
          type="button"
          onClick={handleAddProject}
          className="px-3 py-1.5 rounded-lg bg-app-accent text-black font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" /> Thêm dự án
        </button>
      </div>

      <div className="space-y-4">
        {editData.projects?.map((proj, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3 relative">
            <button 
              type="button"
              onClick={() => handleDeleteProject(idx)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-app-muted">Tên dự án</label>
                <input 
                  type="text" 
                  value={proj.name} 
                  onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-app-muted">Công nghệ</label>
                <TechInput 
                  value={proj.tech} 
                  onChange={(newTech) => handleUpdateProject(idx, 'tech', newTech)}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-app-muted">Mô tả dự án (Xuống dòng để tạo chấm đầu dòng mới)</label>
                <textarea 
                  rows="4"
                  placeholder="Nhập mô tả dự án. Mỗi dòng sẽ tự động hiển thị dưới dạng dấu chấm đầu dòng."
                  value={proj.description} 
                  onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none resize-y"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-app-muted">Demo Link</label>
                <input 
                  type="text" 
                  value={proj.demo} 
                  onChange={(e) => handleUpdateProject(idx, 'demo', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsForm;
