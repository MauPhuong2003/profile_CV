import { Key, Sparkles, Code, Eye, CheckCircle } from 'lucide-react';

const AiConsoleForm = ({
  apiKey,
  setApiKey,
  aiPrompt,
  setAiPrompt,
  aiStyle,
  setAiStyle,
  handleGenerateAI,
  isAiLoading,
  aiError,
  aiResponseRaw,
  parsedAiData,
  handleApplyAiData
}) => {
  return (
    <div className="space-y-6">
      {/* Setup & API Key */}
      <div className="p-4 rounded-xl bg-app-accent/5 border border-app-accent/20 space-y-4">
        <h4 className="text-sm font-bold text-app-text flex items-center gap-2">
          <Key className="w-4 h-4 text-app-accent" />
          Cấu hình API Anthropic Claude
        </h4>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-app-muted">Anthropic API Key</label>
          <input 
            type="password" 
            placeholder="sk-ant-..." 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none font-mono text-app-accent"
          />
          <p className="text-[10px] text-app-muted leading-relaxed">
            Lưu ý: API Key của bạn chỉ được lưu trữ tạm thời trong bộ nhớ của trang web và không bao giờ được gửi đi nơi khác ngoài API chính thức của Anthropic.
          </p>
        </div>
      </div>

      {/* Input Prompt */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">Thông tin đầu vào cho AI</h4>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-app-muted">Mô tả chi tiết về bản thân bạn</label>
          <textarea 
            rows="5"
            placeholder="Ví dụ: Tôi là Nguyễn Văn A, sinh ngày 12/10/1998, số điện thoại 0987654321, trú tại Cầu Giấy, Hà Nội. Là lập trình viên frontend 3 năm kinh nghiệm. Thế mạnh là React, Tailwind và tối ưu hóa hiệu năng UI. Đã từng làm tại VNG..." 
            value={aiPrompt} 
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none resize-none placeholder:text-app-text/25 text-app-text"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-app-muted">Phong cách viết</label>
            <select 
              value={aiStyle} 
              onChange={(e) => setAiStyle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
            >
              <option value="Chuyên nghiệp">Chuyên nghiệp (Lịch sự, nghiêm túc)</option>
              <option value="Sáng tạo">Sáng tạo (Đột phá, ấn tượng)</option>
              <option value="Ngắn gọn">Ngắn gọn (Súc tích, trực diện)</option>
              <option value="Chi tiết">Chi tiết (Đầy đủ, tỉ mỉ)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              type="button"
              onClick={handleGenerateAI}
              disabled={isAiLoading}
              className="w-full py-2.5 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 animate-pulse-subtle"
            >
              {isAiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  AI đang xử lý...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  ✨ Nhờ AI viết CV
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Errors display */}
      {aiError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold leading-relaxed">
          {aiError}
        </div>
      )}

      {/* AI Results Preview */}
      {isAiLoading && (
        <div className="p-8 rounded-xl bg-app-bg/30 border border-app-border flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-app-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-app-muted font-mono animate-pulse">Claude is thinking and writing your CV...</p>
        </div>
      )}

      {!isAiLoading && (aiResponseRaw || parsedAiData) && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">Dữ liệu tạo bởi AI</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* JSON Source preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-app-muted flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                JSON Raw Response
              </label>
              <pre className="w-full h-80 px-3 py-2 rounded-lg bg-black/60 border border-app-border text-[10px] font-mono text-emerald-400/90 overflow-auto whitespace-pre-wrap">
                {aiResponseRaw}
              </pre>
            </div>

            {/* Structured Live Preview */}
            <div className="space-y-1.5 flex flex-col h-full">
              <label className="text-xs font-semibold text-app-muted flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Xem trước thông tin được tạo
              </label>
              
              {parsedAiData ? (
                <div className="flex-1 p-4 rounded-lg bg-app-bg/50 border border-app-border text-xs text-app-muted overflow-y-auto space-y-3">
                  <p><strong className="text-app-text">Họ tên:</strong> {parsedAiData.name}</p>
                  <p><strong className="text-app-text">Chức danh:</strong> {parsedAiData.title}</p>
                  <p><strong className="text-app-text">Bio:</strong> {parsedAiData.bio}</p>
                  <p><strong className="text-app-text">Giới thiệu:</strong> {parsedAiData.about}</p>
                  <p><strong className="text-app-text">Ngày sinh:</strong> {parsedAiData.birthDate}</p>
                  <p><strong className="text-app-text">Số điện thoại:</strong> {parsedAiData.phone}</p>
                  <p><strong className="text-app-text">Địa chỉ:</strong> {parsedAiData.address}</p>
                  <div>
                    <strong className="text-app-text">Kỹ năng:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      <li>Frontend: {parsedAiData.skills?.Frontend?.join(', ')}</li>
                      <li>Backend: {parsedAiData.skills?.Backend?.join(', ')}</li>
                      <li>Tools: {parsedAiData.skills?.Tools?.join(', ')}</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-app-text">Kinh nghiệm:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      {parsedAiData.experience?.map((exp, i) => (
                        <li key={i}>{exp.role} tại {exp.company} ({exp.period})</li>
                      ))}
                    </ul>
                  </div>
                  {parsedAiData.awards && parsedAiData.awards.length > 0 && (
                    <div>
                      <strong className="text-app-text">Giải thưởng:</strong>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        {parsedAiData.awards.map((award, i) => (
                          <li key={i}>{award.title} ({award.year}) {award.issuer ? `- ${award.issuer}` : ''}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 p-4 rounded-lg bg-app-bg/50 border border-app-border text-xs text-red-500 flex items-center justify-center">
                  JSON không hợp lệ hoặc không thể phân tích cú pháp.
                </div>
              )}
            </div>
          </div>

          {parsedAiData && (
            <div className="pt-2 flex justify-end">
              <button 
                type="button"
                onClick={handleApplyAiData}
                className="px-6 py-2.5 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-lg shadow-app-accent/15"
              >
                <CheckCircle className="w-4 h-4 text-black" />
                Áp dụng vào CV
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiConsoleForm;
