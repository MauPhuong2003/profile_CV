import { useState } from 'react';
import { Mail, Linkedin, MapPin, CheckCircle, Send } from 'lucide-react';

const ProfileContact = ({ profileData, t }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Vui lòng điền đầy đủ các thông tin!');
      return;
    }

    const accessKey = profileData.web3FormsKey || '';
    if (!accessKey) {
      alert('Chưa cấu hình API Key gửi Email (Web3Forms) trong trang Admin! Vui lòng cấu hình Web3Forms Access Key trong Admin panel để kích hoạt gửi mail trực tiếp từ website.');
      return;
    }

    setIsContactLoading(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          subject: `[Portfolio Contact] Tin nhắn từ ${contactForm.name}`,
          from_name: `${contactForm.name} (Portfolio)`
        })
      });

      const result = await response.json();
      if (result.success) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => {
          setContactSuccess(false);
        }, 5000);
      } else {
        alert(result.message || 'Gửi mail thất bại! Vui lòng kiểm tra lại cấu hình Web3Forms Access Key.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      alert('Có lỗi mạng xảy ra khi gửi email! Vui lòng kiểm tra kết nối mạng của bạn.');
    } finally {
      setIsContactLoading(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-3 border-b border-app-border pb-4">
        <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
          <Mail className="w-5 h-5" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.contact}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4 md:col-span-1">
          <p className="text-sm text-app-muted leading-relaxed">
            {t.recruiterConnect}
          </p>
          
          <div className="space-y-3 pt-2">
            {/* Email */}
            {profileData.contact?.email && (
              <a href={`mailto:${profileData.contact.email}`} className="flex items-center gap-3 text-sm text-app-muted hover:text-app-accent transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-app-card flex items-center justify-center border border-app-border group-hover:border-app-accent/30 transition-all shadow-sm shrink-0">
                  <Mail className="w-4 h-4 text-app-accent" />
                </div>
                <span className="truncate">{profileData.contact.email}</span>
              </a>
            )}

            {/* LinkedIn */}
            {profileData.contact?.linkedin && (
              <a href={profileData.contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-app-muted hover:text-app-accent transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-app-card flex items-center justify-center border border-app-border group-hover:border-app-accent/30 transition-all shadow-sm shrink-0">
                  <Linkedin className="w-4 h-4 text-app-accent" />
                </div>
                <span>LinkedIn Profile</span>
              </a>
            )}

            {/* Address → Google Maps link */}
            {profileData.address && (
              <a
                href={
                  profileData.lat && profileData.lng
                    ? `https://www.google.com/maps?q=${profileData.lat},${profileData.lng}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(profileData.address)}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-app-muted hover:text-app-accent transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-app-card flex items-center justify-center border border-app-border group-hover:border-app-accent/30 transition-all shadow-sm shrink-0">
                  <MapPin className="w-4 h-4 text-app-accent" />
                </div>
                <span>{profileData.address}</span>
              </a>
            )}
          </div>
        </div>

        {/* Direct Message Form (Custom React Handlers - no HTML <form>) */}
        <div className="p-6 rounded-xl bg-app-card border border-app-border md:col-span-2 space-y-4 relative shadow-sm">
          {contactSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-8">
              <CheckCircle className="w-12 h-12 text-app-accent animate-bounce" />
              <h4 className="font-display text-lg font-bold text-app-text">{t.contactSuccessTitle}</h4>
              <p className="text-sm text-app-muted max-w-xs">{t.contactSuccessDesc}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-app-muted">{t.yourName}</label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none transition-colors text-app-text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-app-muted">{t.emailAddress}</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none transition-colors text-app-text"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-muted">{t.messageContent}</label>
                <textarea 
                  rows="4" 
                  placeholder={t.messagePlaceholder}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none transition-colors resize-none text-app-text"
                ></textarea>
              </div>
              <button 
                onClick={handleContactSubmit}
                disabled={isContactLoading}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-app-accent text-black font-extrabold text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-md ${isContactLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isContactLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-black" />
                    {t.sendBtn}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileContact;
