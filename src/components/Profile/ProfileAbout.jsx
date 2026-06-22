import { Info, Target, Milestone, Contact, Calendar, Phone, Mail, MapPin } from 'lucide-react';

const ProfileAbout = ({ profileData, t }) => {
  return (
    <section id="about" className="scroll-mt-24">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        
        {/* Left Column: Giới thiệu bản thân & Mục tiêu */}
        <div className="md:col-span-3 space-y-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-app-border pb-6">
              <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-wide text-app-text">{t.about}</h2>
            </div>
            <p className="text-app-muted text-sm md:text-base leading-loose tracking-wide whitespace-pre-line text-justify">
              {profileData.about}
            </p>
          </div>

          {/* Short & Long Term Goals */}
          <div className="border-t border-app-border pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profileData.shortTermGoal && (
                <div className="p-5 rounded-xl bg-app-card border border-app-border shadow-sm space-y-3 hover:border-app-accent/35 transition-all">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-app-accent flex items-center gap-2">
                    <Target className="w-4.5 h-4.5" />
                    {t.shortGoal}
                  </h4>
                  <p className="text-xs md:text-sm text-app-muted leading-relaxed tracking-wide">
                    {profileData.shortTermGoal}
                  </p>
                </div>
              )}
              {profileData.longTermGoal && (
                <div className="p-5 rounded-xl bg-app-card border border-app-border shadow-sm space-y-3 hover:border-app-accent/35 transition-all">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-app-accent flex items-center gap-2">
                    <Milestone className="w-4.5 h-4.5" />
                    {t.longGoal}
                  </h4>
                  <p className="text-xs md:text-sm text-app-muted leading-relaxed tracking-wide">
                    {profileData.longTermGoal}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Thông tin liên hệ Card */}
        <div className="md:col-span-2">
          <div className="p-6 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.005] relative overflow-hidden shadow-sm group">
            {/* Decorative background glow */}
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <h3 className="font-display text-base font-bold text-app-text border-b border-app-border pb-2.5 flex items-center gap-2 group-hover:text-app-accent transition-colors">
                <Contact className="w-4 h-4 text-app-accent" />
                {t.contactInfo}
              </h3>
              
              <div className="space-y-6 text-sm">
                {profileData.birthDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4.5 h-4.5 text-app-accent shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-app-muted tracking-wider">{t.birthDate}</p>
                      <p className="font-semibold text-app-text">{profileData.birthDate}</p>
                    </div>
                  </div>
                )}

                {profileData.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4.5 h-4.5 text-app-accent shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-app-muted tracking-wider">{t.phone}</p>
                      <p className="font-semibold text-app-text">{profileData.phone}</p>
                    </div>
                  </div>
                )}

                {profileData.contact?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4.5 h-4.5 text-app-accent shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold text-app-muted tracking-wider">Email</p>
                      <p className="font-semibold text-app-text break-all" title={profileData.contact.email}>
                        {profileData.contact.email}
                      </p>
                    </div>
                  </div>
                )}

                {profileData.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4.5 h-4.5 text-app-accent shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-app-muted tracking-wider">{t.address}</p>
                      <p className="font-semibold text-app-text">{profileData.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProfileAbout;
