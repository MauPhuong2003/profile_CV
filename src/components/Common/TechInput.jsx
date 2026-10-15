import { useState } from 'react';

const TechInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !value.includes(val)) {
        onChange([...value, val]);
      }
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[38px] p-1.5 rounded-lg bg-app-bg border border-app-border focus-within:border-app-accent transition-colors">
        {value.map((tag, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-app-accent/10 border border-app-accent/20 text-xs font-bold text-app-accent"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(index)} 
              className="hover:text-red-500 cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[80px] bg-transparent border-0 focus:ring-0 focus:outline-none text-xs text-app-text px-1"
          placeholder="Thêm kỹ năng..."
        />
      </div>
      <p className="text-[9px] text-app-muted">Nhập kỹ năng rồi bấm Enter hoặc phẩy (,) để thêm</p>
    </div>
  );
};

export default TechInput;
