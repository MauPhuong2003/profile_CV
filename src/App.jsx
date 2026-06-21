import { useState, useEffect } from 'react';
import { 
  Sparkles, Mail, Linkedin, Briefcase, GraduationCap, 
  Code, Download, Settings, Plus, Trash2, 
  CheckCircle, FileText, Send, Lock, Eye, EyeOff, Key, Laptop, Info, Contact, Globe,
  ArrowUpRight, Sun, Moon, ArrowLeft, LogOut, Upload, File,
  Calendar, Phone, MapPin, Target, Milestone, Trophy
} from 'lucide-react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const uiTranslations = {
  vi: {
    about: "Giới thiệu bản thân",
    skills: "Kỹ năng chuyên môn",
    experience: "Kinh nghiệm làm việc",
    projects: "Dự án triển khai",
    education: "Học vấn & Bằng cấp",
    contact: "Liên hệ",
    contactMe: "Liên hệ với tôi",
    downloadCv: "Tải CV",
    contactInfo: "Thông tin liên hệ",
    birthDate: "Ngày sinh",
    phone: "Số điện thoại",
    address: "Địa chỉ",
    shortGoal: "Mục tiêu ngắn hạn",
    longGoal: "Mục tiêu dài hạn",
    graduated: "Tốt nghiệp",
    navAbout: "Giới thiệu",
    navSkills: "Kỹ năng",
    navExperience: "Kinh nghiệm",
    navProjects: "Dự án",
    navEducation: "Học vấn",
    navContact: "Liên hệ",
    recruiterConnect: "Bạn là nhà tuyển dụng muốn kết nối? Hãy gửi tin nhắn trực tiếp qua biểu mẫu hoặc qua thông tin liên hệ bên dưới:",
    contactSuccessTitle: "Gửi tin nhắn thành công!",
    contactSuccessDesc: "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi lại sớm nhất có thể.",
    yourName: "Tên của bạn",
    emailAddress: "Địa chỉ Email",
    messageContent: "Nội dung tin nhắn",
    messagePlaceholder: "Lời nhắn của bạn...",
    sendBtn: "Gửi tin nhắn",
    sending: "Đang gửi...",
    backToTop: "Đầu trang",
    connectNow: "Liên hệ ngay",
    awards: "Giải thưởng & Thành tựu",
    navAwards: "Giải thưởng"
  },
  en: {
    about: "About Me",
    skills: "Professional Skills",
    experience: "Work Experience",
    projects: "Featured Projects",
    education: "Education & Credentials",
    contact: "Contact",
    contactMe: "Contact Me",
    downloadCv: "Download CV",
    contactInfo: "Contact Information",
    birthDate: "Date of Birth",
    phone: "Phone Number",
    address: "Address",
    shortGoal: "Short-term Goal",
    longGoal: "Long-term Goal",
    graduated: "Graduated",
    navAbout: "About",
    navSkills: "Skills",
    navExperience: "Experience",
    navProjects: "Projects",
    navEducation: "Education",
    navContact: "Contact",
    recruiterConnect: "Are you a recruiter looking to connect? Send a direct message using the form or reach out via the contact info below:",
    contactSuccessTitle: "Message Sent Successfully!",
    contactSuccessDesc: "Thank you for reaching out. I will respond as soon as possible.",
    yourName: "Your Name",
    emailAddress: "Email Address",
    messageContent: "Message Content",
    messagePlaceholder: "Your message...",
    sendBtn: "Send Message",
    sending: "Sending...",
    backToTop: "Back to Top",
    connectNow: "Connect Now",
    awards: "Awards & Achievements",
    navAwards: "Awards"
  }
};


// Default Profile Data (blank — fill via Admin panel)
const defaultProfile = {
  name: "",
  title: "",
  bio: "",
  avatar: "",
  about: "",
  shortTermGoal: "",
  longTermGoal: "",
  cvUrl: "",
  birthDate: "",
  phone: "",
  address: "",
  skills: {
    "Hệ thống & Hạ tầng": [],
    "Triển khai & Tích hợp": [],
    "Công cụ & Quy trình": []
  },
  experience: [],
  projects: [],
  education: {
    school: "",
    major: "",
    year: "",
    skills: ""
  },
  awards: [],
  contact: {
    email: "",
    linkedin: "",
    github: ""
  },
  lat: "",
  lng: "",
  web3FormsKey: ""
};

// Helper to render description as a bulleted list when containing newlines or bullet prefixes
const renderDescriptionList = (description) => {
  if (!description) return null;
  const lines = description
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(/^[\s\-*•+]+/, '').trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <ul className="list-disc pl-5 space-y-1.5 text-sm text-app-muted leading-relaxed">
      {lines.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  );
};

// Helper to sort skills categories to maintain identical visual order across languages
const getSortedSkills = (skills, lang) => {
  if (!skills) return [];
  const entries = Object.entries(skills);
  const orderVi = ["Triển khai & Tích hợp", "Hệ thống & Hạ tầng", "Công cụ & Quy trình"];
  const orderEn = ["Deployment & Integration", "Systems & Infrastructure", "Tools & Processes"];
  const orderList = lang === 'vi' ? orderVi : orderEn;
  
  return entries.sort((a, b) => {
    const idxA = orderList.indexOf(a[0]);
    const idxB = orderList.indexOf(b[0]);
    const valA = idxA === -1 ? 999 : idxA;
    const valB = idxB === -1 ? 999 : idxB;
    return valA - valB;
  });
};

// Custom component to handle technology tag input as a comma-separated list
const TechInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value?.join(', ') || '');

  // Keep local state in sync if parent value changes externally (e.g., loaded template/database)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(value?.join(', ') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.join(', ')]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    
    // Parse comma-separated string into an array of strings, trimming each value
    const newArray = newVal.split(',').map(s => s.trim()).filter(Boolean);
    onChange(newArray);
  };

  return (
    <input 
      type="text" 
      value={inputValue} 
      onChange={handleChange}
      className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
      placeholder="React, Node.js, Zalo Mini App"
    />
  );
};

function App() {
  // Main CV State — persist to localStorage so profile survives reload / new tabs
  const [currentLang, setCurrentLang] = useState('vi');
  const [adminEditLang, setAdminEditLang] = useState('vi');
  const [isTranslating, setIsTranslating] = useState(false);

  // Main CV State — persist both VI and EN versions in a single state object
  const [allProfiles, setAllProfiles] = useState(() => {
    try {
      const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
      if (savedMultilang) {
        const parsed = JSON.parse(savedMultilang);
        return {
          vi: { ...defaultProfile, ...parsed.vi },
          en: { ...defaultProfile, ...parsed.en }
        };
      }
      const saved = localStorage.getItem('cv_profile_data');
      if (saved) {
        const parsedOld = JSON.parse(saved);
        return {
          vi: { ...defaultProfile, ...parsedOld },
          en: { ...defaultProfile, ...parsedOld }
        };
      }
    } catch (err) {
      console.error("Error reading initial localStorage:", err);
    }
    return {
      vi: defaultProfile,
      en: defaultProfile
    };
  });

  const profileData = allProfiles[currentLang];
  
  // Custom SPA Router State ('cv' | 'admin')
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'cv';
  });

  // Theme State (Default to Light Mode, read from sessionStorage if saved)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return sessionStorage.getItem('theme') === 'dark';
  });

  // Admin Auth State (Read from sessionStorage to persist login on reload)
  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthed, setIsAuthed] = useState(() => {
    return sessionStorage.getItem('admin_authed') === 'true';
  });
  const [adminTab, setAdminTab] = useState('manual'); // 'manual' | 'ai'

  // Manual Edit State (cloned from profileData when editing starts)
  const [editData, setEditData] = useState(profileData);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedAvatarName, setUploadedAvatarName] = useState(() => {
    return profileData.avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '';
  });

  const t = uiTranslations[currentLang];

  // AI Generator State
  const [apiKey, setApiKey] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('Chuyên nghiệp');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponseRaw, setAiResponseRaw] = useState('');
  const [parsedAiData, setParsedAiData] = useState(null);
  const [aiError, setAiError] = useState('');
  const [cvBlobUrl, setCvBlobUrl] = useState('');

  // Convert Base64 data CV to blob URL to fix download on mobile browsers (especially Safari iOS)
  useEffect(() => {
    if (profileData.cvUrl && profileData.cvUrl.startsWith('data:')) {
      try {
        const parts = profileData.cvUrl.split(',');
        const contentType = parts[0].split(':')[1].split(';')[0] || 'application/pdf';
        const base64Data = parts[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const url = URL.createObjectURL(blob);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCvBlobUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Error creating CV blob URL:", err);
        setCvBlobUrl('');
      }
    } else {
      setCvBlobUrl('');
    }
  }, [profileData.cvUrl]);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);

  // Admin Save Success Toast
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Firebase Firestore States
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Sync Router with browser history and handle default Theme on mount
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname === '/admin' ? 'admin' : 'cv');
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Set theme class based on saved state in sessionStorage
    const savedTheme = sessionStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load Profile Data from Firebase Firestore (or fallback to LocalStorage)
  useEffect(() => {
    const loadData = async () => {
      // 1. If Firebase is not configured, fall back immediately to LocalStorage
      if (!db) {
        console.log("Firebase is not initialized. Using localStorage fallback.");
        try {
          const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
          if (savedMultilang) {
            const parsed = JSON.parse(savedMultilang);
            const loadedProfiles = {
              vi: { ...defaultProfile, ...parsed.vi },
              en: { ...defaultProfile, ...parsed.en }
            };
            setAllProfiles(loadedProfiles);
            setEditData(loadedProfiles[adminEditLang]);
          } else {
            const saved = localStorage.getItem('cv_profile_data');
            if (saved) {
              const parsedOld = { ...defaultProfile, ...JSON.parse(saved) };
              const loadedProfiles = {
                vi: parsedOld,
                en: parsedOld
              };
              setAllProfiles(loadedProfiles);
              setEditData(loadedProfiles[adminEditLang]);
            }
          }
        } catch (err) {
          console.error("Lỗi khi đọc từ localStorage:", err);
        }
        setIsDbLoading(false);
        return;
      }

      // 2. Firebase is configured, fetch from Firestore
      try {
        const docRef = doc(db, "profile", "default");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dbData = docSnap.data();
          let loadedProfiles = {
            vi: defaultProfile,
            en: defaultProfile
          };
          
          if (dbData.vi || dbData.en) {
            loadedProfiles.vi = { ...defaultProfile, ...dbData.vi };
            loadedProfiles.en = { ...defaultProfile, ...dbData.en };
          } else if (dbData.name) {
            const parsedOld = { ...defaultProfile, ...dbData };
            loadedProfiles.vi = parsedOld;
            loadedProfiles.en = parsedOld;
          }
          
          setAllProfiles(loadedProfiles);
          setEditData(loadedProfiles[adminEditLang]);
        } else {
          const initial = { vi: defaultProfile, en: defaultProfile };
          await setDoc(docRef, initial);
          setAllProfiles(initial);
          setEditData(initial[adminEditLang]);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ Firestore:", error);
        try {
          const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
          if (savedMultilang) {
            const parsed = JSON.parse(savedMultilang);
            const loadedProfiles = {
              vi: { ...defaultProfile, ...parsed.vi },
              en: { ...defaultProfile, ...parsed.en }
            };
            setAllProfiles(loadedProfiles);
            setEditData(loadedProfiles[adminEditLang]);
          } else {
            const saved = localStorage.getItem('cv_profile_data');
            if (saved) {
              const parsedOld = { ...defaultProfile, ...JSON.parse(saved) };
              const loadedProfiles = {
                vi: parsedOld,
                en: parsedOld
              };
              setAllProfiles(loadedProfiles);
              setEditData(loadedProfiles[adminEditLang]);
            }
          }
        } catch (err) {
          console.error("Error loading localStorage fallback:", err);
        }
      } finally {
        setIsDbLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Custom Navigation function
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path === '/admin' ? 'admin' : 'cv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset inputs when switching routes
    if (path === '/admin') {
      setEditData({ ...allProfiles[adminEditLang] });
      setPasswordInput('');
      setPassError('');
      setUploadedAvatarName(allProfiles[adminEditLang].avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '');
    }
  };

  const handleSwitchEditLang = (newLang) => {
    if (newLang === adminEditLang) return;
    
    setAllProfiles(prev => ({
      ...prev,
      [adminEditLang]: editData
    }));

    setAdminEditLang(newLang);
    setEditData(allProfiles[newLang]);
    setUploadedAvatarName(allProfiles[newLang].avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '');
  };

  const handleAiTranslateToEnglish = async () => {
    if (!apiKey.trim()) {
      alert('Vui lòng nhập Anthropic API Key ở tab "Tạo bằng AI (Anthropic)" để sử dụng tính năng dịch bằng AI!');
      return;
    }
    
    setIsTranslating(true);
    try {
      let viProfile = allProfiles.vi;
      if (adminEditLang === 'vi') {
        viProfile = editData;
        setAllProfiles(prev => ({
          ...prev,
          vi: editData
        }));
      }
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-html-user-system-messages': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{
            role: "user",
            content: `Bạn là chuyên gia dịch thuật CV công nghệ thông tin chuyên nghiệp. Hãy dịch toàn bộ nội dung của CV Tiếng Việt dạng JSON sau đây sang Tiếng Anh. 
Yêu cầu:
1. Dịch đúng thuật ngữ chuyên ngành CNTT, ngữ pháp chuẩn Mỹ tự nhiên và chuyên nghiệp.
2. Giữ nguyên cấu trúc các keys của JSON ở cấp cao nhất, chỉ dịch các values là chuỗi ký tự (hoặc mảng chuỗi). Riêng đối với object 'skills', bạn CẦN dịch cả các keys (là tên các nhóm kỹ năng, ví dụ "Hệ thống & Hạ tầng" -> "Systems & Infrastructure", "Triển khai & Tích hợp" -> "Deployment & Integration", "Công cụ & Quy trình" -> "Tools & Processes") sang Tiếng Anh cho phù hợp.
3. Tuyệt đối giữ nguyên giá trị liên kết (như URL hình ảnh, email, số điện thoại, link github/linkedin) và thời gian (như năm tốt nghiệp, thời kỳ làm việc dạng "2022 - 2024").
4. Trả về định dạng JSON thuần túy, không chứa markdown hay giải thích gì khác.

Dữ liệu JSON:
${JSON.stringify(viProfile, null, 2)}`
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const contentText = data.content[0]?.text;
      
      if (!contentText) {
        throw new Error("Không nhận được nội dung dịch từ API.");
      }

      const parsed = extractJSON(contentText);
      
      parsed.avatar = viProfile.avatar;
      parsed.cvUrl = viProfile.cvUrl;
      
      setEditData(parsed);
      setAdminEditLang('en');
      setAllProfiles(prev => ({
        ...prev,
        en: parsed
      }));
      
      alert('Dịch thành công! Đã chuyển sang chế độ chỉnh sửa Tiếng Anh với bản dịch từ AI. Vui lòng kiểm tra lại và nhấn "Lưu Profile" để lưu lại.');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi dịch: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setIsTranslating(false);
    }
  };

  // Toggle Theme between Light & Dark Mode
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      sessionStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      sessionStorage.setItem('theme', 'light');
    }
  };

  // Handle Auth Verification
  const handleAuthSubmit = () => {
    if (passwordInput === 'MauPhuong@123') {
      setIsAuthed(true);
      sessionStorage.setItem('admin_authed', 'true');
      setPassError('');
    } else {
      setPassError('Sai mật khẩu! Vui lòng kiểm tra lại.');
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    setIsAuthed(false);
    sessionStorage.removeItem('admin_authed');
    setPasswordInput('');
    navigateTo('/admin');
  };

  // Smooth Scroll Helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Manual Edit Handlers
  const handleManualChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualNestedChange = (parentField, childField, value) => {
    setEditData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  // File Upload Helper (converts to Base64)
  const handleCvFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        handleManualChange('cvUrl', event.target.result); // Save Base64 Data URL
      };
      reader.onerror = () => {
        alert('Đã xảy ra lỗi khi đọc file!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded file
  const handleRemoveCvFile = () => {
    setUploadedFileName('');
    handleManualChange('cvUrl', '');
  };

  // Avatar Upload Helper (converts to Base64)
  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh (png, jpg, jpeg, gif, webp, svg, v.v.)!');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Ảnh có dung lượng quá lớn (vui lòng chọn ảnh dưới 2MB để lưu trữ tốt nhất)!');
        return;
      }
      setUploadedAvatarName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        handleManualChange('avatar', event.target.result); // Save Base64 Data URL
      };
      reader.onerror = () => {
        alert('Đã xảy ra lỗi khi đọc file ảnh!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded avatar
  const handleRemoveAvatarFile = () => {
    setUploadedAvatarName('');
    handleManualChange('avatar', '');
  };

  // Add / Delete Skills
  const handleAddSkill = (category) => {
    const currentSkills = editData.skills[category] || [];
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...currentSkills, 'Kỹ năng mới']
      }
    }));
  };

  const handleUpdateSkill = (category, index, val) => {
    const currentSkills = [...editData.skills[category]];
    currentSkills[index] = val;
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: currentSkills
      }
    }));
  };

  const handleDeleteSkill = (category, index) => {
    const currentSkills = editData.skills[category].filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: currentSkills
      }
    }));
  };

  const handleUpdateCategoryName = (oldName, newName) => {
    if (oldName === newName) return;
    setEditData(prev => {
      const newSkills = {};
      Object.keys(prev.skills || {}).forEach(key => {
        if (key === oldName) {
          newSkills[newName] = prev.skills[oldName] || [];
        } else {
          newSkills[key] = prev.skills[key];
        }
      });
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  // Add / Edit / Delete Experiences
  const handleAddExperience = () => {
    setEditData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: 'Công ty mới', role: 'Vị trí công việc', period: '2024', description: 'Mô tả công việc của bạn', skills: [] }
      ]
    }));
  };

  const handleUpdateExperience = (index, field, val) => {
    const list = [...editData.experience];
    list[index] = { ...list[index], [field]: val };
    setEditData(prev => ({
      ...prev,
      experience: list
    }));
  };

  const handleDeleteExperience = (index) => {
    const list = editData.experience.filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      experience: list
    }));
  };

  // Add / Edit / Delete Projects
  const handleAddProject = () => {
    setEditData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: 'Dự án mới', description: 'Mô tả dự án', tech: ['React'], demo: '#' }
      ]
    }));
  };

  const handleUpdateProject = (index, field, val) => {
    const list = [...editData.projects];
    if (field === 'tech') {
      list[index] = { 
        ...list[index], 
        tech: Array.isArray(val) ? val : val.split(',').map(s => s.trim()).filter(Boolean) 
      };
    } else {
      list[index] = { ...list[index], [field]: val };
    }
    setEditData(prev => ({
      ...prev,
      projects: list
    }));
  };

  const handleDeleteProject = (index) => {
    const list = editData.projects.filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      projects: list
    }));
  };

  // Add / Edit / Delete Awards
  const handleAddAward = () => {
    setEditData(prev => ({
      ...prev,
      awards: [
        ...(prev.awards || []),
        { title: 'Giải thưởng mới', year: new Date().getFullYear().toString(), issuer: 'Tổ chức cấp giải' }
      ]
    }));
  };

  const handleUpdateAward = (index, field, val) => {
    const list = [...(editData.awards || [])];
    list[index] = { ...list[index], [field]: val };
    setEditData(prev => ({
      ...prev,
      awards: list
    }));
  };

  const handleDeleteAward = (index) => {
    const list = (editData.awards || []).filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      awards: list
    }));
  };

  // Save updates and return to main page
  const handleSaveManual = async () => {
    setIsSaving(true);
    const updatedProfiles = {
      ...allProfiles,
      [adminEditLang]: editData
    };
    try {
      // 1. Save to Firebase if configured
      if (db) {
        const docRef = doc(db, "profile", "default");
        await setDoc(docRef, updatedProfiles);
        console.log("Dữ liệu đã được lưu lên Firebase Firestore.");
      } else {
        console.warn("Firebase chưa được cấu hình. Chỉ lưu dữ liệu vào LocalStorage.");
      }

      // 2. Also save to LocalStorage for backup/offline fallback
      localStorage.setItem('cv_profile_data_multilang', JSON.stringify(updatedProfiles));
      localStorage.setItem('cv_profile_data', JSON.stringify(updatedProfiles.vi));
      
      setAllProfiles(updatedProfiles);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Lỗi khi lưu profileData:', error);
      if (error.code === 'quota-exceeded' || error.name === 'QuotaExceededError') {
        alert('Lỗi: Trình duyệt hết bộ nhớ lưu trữ! Dung lượng ảnh đại diện quá lớn. Vui lòng tải lên ảnh kích thước nhỏ hơn (dưới 2MB).');
      } else {
        alert('Không thể lưu dữ liệu! Vui lòng kiểm tra lại cấu hình Firebase trong tệp tin .env hoặc kết nối mạng.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // AI JSON Extraction logic
  const extractJSON = (text) => {
    try {
      return JSON.parse(text);
    } catch (err) {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1].trim());
        } catch (err2) {
          console.error("Failed parsing jsonMatch:", err2);
        }
      }
      const startIdx = text.indexOf('{');
      const endIdx = text.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        try {
          return JSON.parse(text.slice(startIdx, endIdx + 1));
        } catch (err3) {
          console.error("Failed parsing bracket slice:", err3);
        }
      }
      throw new Error("Không thể parse dữ liệu JSON từ phản hồi của AI. Vui lòng thử lại.", { cause: err });
    }
  };

  // Call Anthropic API
  const handleGenerateAI = async () => {
    if (!apiKey.trim()) {
      setAiError('Vui lòng nhập Anthropic API Key!');
      return;
    }
    if (!aiPrompt.trim()) {
      setAiError('Vui lòng nhập mô tả bản thân!');
      return;
    }

    setIsAiLoading(true);
    setAiError('');
    setAiResponseRaw('');
    setParsedAiData(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `Bạn là chuyên gia viết CV chuyên nghiệp người Việt Nam. Dựa trên thông tin sau, hãy tạo nội dung CV thật chi tiết và chuyên nghiệp, phù hợp với một lập trình viên.
      
Thông tin: ${aiPrompt}
Phong cách: ${aiStyle}

Trả về JSON với cấu trúc CHÍNH XÁC sau (chỉ trả về JSON, không kèm giải thích hoặc markdown):
{
  "name": "Họ tên",
  "title": "Chức danh (ví dụ: Senior Frontend Engineer)",
  "bio": "Giới thiệu ngắn 1-2 câu",
  "about": "Đoạn about giới thiệu bản thân chi tiết 3-4 câu",
  "shortTermGoal": "Mục tiêu ngắn hạn 1-2 câu (nếu thông tin của người dùng không đề cập, hãy tự viết dựa vào ngành nghề của họ)",
  "longTermGoal": "Mục tiêu dài hạn 1-2 câu (nếu thông tin của người dùng không đề cập, hãy tự viết dựa vào ngành nghề của họ)",
  "birthDate": "Ngày sinh dạng DD/MM/YYYY",
  "phone": "Số điện thoại di động",
  "address": "Địa chỉ cư trú (quận/huyện, tỉnh/thành phố)",
  "skills": {
    "Frontend": ["React", "..."],
    "Backend": ["Node.js", "..."],
    "Tools": ["Git", "..."]
  },
  "experience": [
    {
      "company": "Tên công ty",
      "role": "Vị trí",
      "period": "2022 - 2024",
      "description": "Mô tả ngắn công việc và thành tựu chính",
      "skills": ["React", "Node.js"]
    }
  ],
  "projects": [
    {
      "name": "Tên dự án",
      "description": "Mô tả chi tiết hơn về dự án",
      "tech": ["React", "Node.js"],
      "github": "#",
      "demo": "#"
    }
  ],
  "education": {
    "school": "Tên trường",
    "major": "Ngành học",
    "year": "2020",
    "skills": "Các kỹ năng đạt được (ví dụ: Lập trình Java, Làm việc nhóm, Giải quyết vấn đề)"
  },
  "awards": [
    {
      "title": "Tên giải thưởng hoặc chứng chỉ",
      "year": "2023",
      "issuer": "Tổ chức cấp (ví dụ: Google, Trường học)"
    }
  ],
  "contact": {
    "email": "email@example.com",
    "linkedin": "https://linkedin.com/in/...",
    "github": "https://github.com/..."
  }
}`
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const contentText = data.content[0]?.text;
      
      if (!contentText) {
        throw new Error("Không nhận được nội dung từ API.");
      }

      setAiResponseRaw(contentText);
      const parsed = extractJSON(contentText);
      
      // Preserve existing non-AI field values (like file CV)
      parsed.cvUrl = profileData.cvUrl;
      parsed.avatar = profileData.avatar;
      parsed.awards = parsed.awards || [];
      
      setParsedAiData(parsed);
    } catch (err) {
      console.error(err);
      setAiError(err.message || 'Có lỗi xảy ra khi gọi API Anthropic. Hãy kiểm tra API Key hoặc kết nối mạng.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Apply AI Data to main CV
  const handleApplyAiData = async () => {
    if (parsedAiData) {
      const updatedProfiles = {
        ...allProfiles,
        [adminEditLang]: parsedAiData
      };
      setAllProfiles(updatedProfiles);
      setEditData(parsedAiData);
      try {
        localStorage.setItem('cv_profile_data_multilang', JSON.stringify(updatedProfiles));
        localStorage.setItem('cv_profile_data', JSON.stringify(updatedProfiles.vi));
        if (db) {
          const docRef = doc(db, "profile", "default");
          await setDoc(docRef, updatedProfiles);
          console.log("Dữ liệu AI đã được lưu lên Firebase Firestore.");
        }
      } catch (e) {
        console.error("Lỗi khi đồng bộ dữ liệu AI lên Firebase/LocalStorage:", e);
      }
      navigateTo('/admin');
    }
  };

  // Contact Form Submission Handler (Direct Email via Web3Forms API)
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

  // ==================== INITIAL DATABASE LOADING SCREEN ====================
  if (isDbLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans space-y-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#0F0F14] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-app-accent/20 border-t-app-accent rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-app-accent absolute animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-display font-bold text-lg">Đang tải dữ liệu...</h3>
        </div>
      </div>
    );
  }

  // ==================== ROUTE 1: ADMIN VIEW ====================
  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 font-sans">
        
        {/* Theme switcher floating in admin page too */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-app-card border border-app-border text-app-muted hover:text-app-accent hover:border-app-accent/40 transition-all cursor-pointer"
            title="Đổi giao diện Sáng/Tối"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* ADMIN AUTH SCREEN */}
        {!isAuthed ? (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 rounded-2xl bg-app-card border border-app-border shadow-2xl space-y-6 relative overflow-hidden">
              {/* background glows for auth */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-app-accent/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-app-accent/10 text-app-accent flex items-center justify-center border border-app-accent/20 mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="font-display font-extrabold text-2xl tracking-tight text-app-text">Đăng nhập Admin</h2>
                <p className="text-xs text-app-muted">Mở khóa bảng điều khiển để chỉnh sửa hồ sơ CV cá nhân</p>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-app-muted">Mật khẩu quản trị</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Vui lòng nhập mật khẩu" 
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPassError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAuthSubmit();
                      }}
                      className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
                      autoFocus
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1.5 top-1.5 p-1.5 rounded-md hover:bg-white/10 text-app-muted hover:text-app-text transition-colors cursor-pointer"
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passError && (
                    <p className="text-xs text-red-500 font-semibold">{passError}</p>
                  )}
                  <p className="text-[10px] text-app-muted leading-relaxed pt-1">
                    Gợi ý: Mật khẩu quản lý đã được cập nhật. Nhập đúng mật khẩu để truy cập.
                  </p>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleAuthSubmit}
                    className="w-full py-2.5 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          
          // ADMIN CONTROL PANEL DASHBOARD (Full screen)
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            
            {/* Admin Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-app-card border border-app-border shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-app-accent/10 text-app-accent border border-app-accent/20">
                  <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <h1 className="font-display font-extrabold text-2xl text-app-text tracking-tight">Admin Control Panel</h1>
                  <p className="text-xs text-app-muted">Quản lý nội dung CV của bạn và ứng dụng AI tự động hóa</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => navigateTo('/')}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-app-border text-app-text text-sm hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Xem CV của tôi
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm hover:bg-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Admin Navigation Tabs */}
            <div className="flex border-b border-app-border bg-app-card rounded-xl p-1 shadow-md">
              <button 
                onClick={() => setAdminTab('manual')}
                className={`flex-1 py-3 px-4 rounded-lg font-display font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  adminTab === 'manual' 
                    ? 'bg-app-accent text-black shadow-lg shadow-app-accent/15 font-extrabold' 
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                <FileText className="w-4 h-4" />
                Chỉnh sửa thủ công
              </button>
              <button 
                onClick={() => setAdminTab('ai')}
                className={`flex-1 py-3 px-4 rounded-lg font-display font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  adminTab === 'ai' 
                    ? 'bg-app-accent text-black shadow-lg shadow-app-accent/15 font-extrabold' 
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Tạo bằng AI (Anthropic)
              </button>
            </div>

            {/* Admin Main Editor Body */}
            <div className="p-6 rounded-2xl bg-app-card border border-app-border shadow-xl min-h-[500px]">
              
              {/* TAB 1: MANUAL EDIT */}
              {adminTab === 'manual' && (
                <div className="space-y-8">
                  {/* Language Selector for Editing */}
                  <div className="p-4 rounded-xl bg-app-bg/50 border border-app-border flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-app-text">Ngôn ngữ chỉnh sửa (Editing Language)</p>
                      <p className="text-xs text-app-muted">Chọn ngôn ngữ để nhập thông tin CV tương ứng</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex rounded-lg bg-app-card p-1 border border-app-border">
                        <button
                          type="button"
                          onClick={() => handleSwitchEditLang('vi')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                            adminEditLang === 'vi' ? 'bg-app-accent text-black' : 'text-app-muted hover:text-app-text'
                          }`}
                        >
                          Tiếng Việt (VI)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchEditLang('en')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                            adminEditLang === 'en' ? 'bg-app-accent text-black' : 'text-app-muted hover:text-app-text'
                          }`}
                        >
                          English (EN)
                        </button>
                      </div>

                      {/* AI Translation button */}
                      <button
                        type="button"
                        onClick={handleAiTranslateToEnglish}
                        disabled={isTranslating}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Dịch toàn bộ CV từ Tiếng Việt sang Tiếng Anh sử dụng AI Claude"
                      >
                        {isTranslating ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang dịch...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                            Dịch sang Tiếng Anh bằng AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Basic Info & CV File Attachment */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">Thông tin cơ bản & File CV</h4>
                    
                    {/* CV File Attachment block */}
                    <div className="p-4 rounded-xl bg-app-accent/5 border border-app-accent/15 space-y-4">
                      <h5 className="text-xs font-bold text-app-text flex items-center gap-1.5">
                        <File className="w-4 h-4 text-app-accent" />
                        Gắn File CV Cá Nhân
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-app-muted">Hoặc gắn đường dẫn liên kết (URL)</label>
                          <input 
                            type="text" 
                            placeholder="https://drive.google.com/..."
                            value={editData.cvUrl || ''} 
                            onChange={(e) => handleManualChange('cvUrl', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text text-xs font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-app-muted">Tải trực tiếp file CV (.pdf, .doc, .docx)</label>
                          <div className="flex items-center gap-3">
                            <label className="px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-xs font-semibold hover:border-app-accent/40 cursor-pointer flex items-center gap-2 text-app-text transition-all">
                              <Upload className="w-3.5 h-3.5 text-app-accent" />
                              Tải lên file mới
                              <input 
                                type="file" 
                                accept=".pdf,.doc,.docx" 
                                onChange={handleCvFileUpload} 
                                className="hidden" 
                              />
                            </label>
                            
                            {editData.cvUrl && editData.cvUrl.startsWith('data:') && (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-app-border text-xs text-app-text">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                <span className="max-w-[150px] truncate">{uploadedFileName || 'File đã đính kèm (base64)'}</span>
                                <button 
                                  onClick={handleRemoveCvFile}
                                  className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                  title="Gỡ file đính kèm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-app-muted leading-relaxed">
                        Mẹo: Bạn có thể chọn tải file PDF trực tiếp lên. Hệ thống sẽ chuyển file này thành mã hóa Base64 và lưu trực tiếp trong bộ nhớ ứng dụng. Khi người dùng bấm nút "Download CV", trình duyệt sẽ tự động tải file này về cho họ.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-app-muted">Họ và Tên</label>
                        <input 
                          type="text" 
                          value={editData.name} 
                          onChange={(e) => handleManualChange('name', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-app-muted">Chức danh công việc</label>
                        <input 
                          type="text" 
                          value={editData.title} 
                          onChange={(e) => handleManualChange('title', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-app-muted">Bio ngắn (Hero)</label>
                        <input 
                          type="text" 
                          value={editData.bio} 
                          onChange={(e) => handleManualChange('bio', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text"
                        />
                      </div>
                      <div className="space-y-3 md:col-span-2 border-t border-app-border/40 pt-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-app-accent">Hình ảnh đại diện (Avatar)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-app-muted">Đường dẫn liên kết (URL)</label>
                            <input 
                              type="text" 
                              placeholder="https://..."
                              value={editData.avatar || ''} 
                              onChange={(e) => {
                                handleManualChange('avatar', e.target.value);
                                if (!e.target.value.startsWith('data:')) {
                                  setUploadedAvatarName('');
                                }
                              }}
                              className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none text-app-text text-xs font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-app-muted">Hoặc tải trực tiếp từ thiết bị</label>
                            <div className="flex items-center gap-3">
                              <label className="px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-xs font-semibold hover:border-app-accent/40 cursor-pointer flex items-center gap-2 text-app-text transition-all">
                                <Upload className="w-3.5 h-3.5 text-app-accent" />
                                Chọn ảnh
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleAvatarFileUpload} 
                                  className="hidden" 
                                />
                              </label>
                              
                              {editData.avatar && (editData.avatar.startsWith('data:') || uploadedAvatarName) && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-app-border text-xs text-app-text">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                  <span className="max-w-[150px] truncate">{uploadedAvatarName || 'Ảnh từ thiết bị'}</span>
                                  <button 
                                    type="button"
                                    onClick={handleRemoveAvatarFile}
                                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                    title="Gỡ ảnh"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Preview component */}
                        {editData.avatar && (
                          <div className="mt-2 flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-app-border/40 max-w-sm">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-app-accent/40 bg-app-bg flex-shrink-0">
                              <img 
                                src={editData.avatar} 
                                alt="Xem trước avatar" 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                            <div className="text-xs space-y-0.5">
                              <p className="font-semibold text-app-text">Xem trước ảnh</p>
                              <p className="text-app-muted truncate max-w-[250px]">
                                {editData.avatar.startsWith('data:') ? 'Dữ liệu Base64 từ thiết bị' : editData.avatar}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-app-muted">Giới thiệu bản thân (3-4 câu)</label>
                        <textarea 
                          rows="4"
                          value={editData.about} 
                          onChange={(e) => handleManualChange('about', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none resize-none text-app-text"
                        ></textarea>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-app-muted">Mục tiêu ngắn hạn</label>
                        <textarea 
                          rows="2"
                          value={editData.shortTermGoal || ''} 
                          onChange={(e) => handleManualChange('shortTermGoal', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none resize-none text-app-text"
                        ></textarea>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-app-muted">Mục tiêu dài hạn</label>
                        <textarea 
                          rows="2"
                          value={editData.longTermGoal || ''} 
                          onChange={(e) => handleManualChange('longTermGoal', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-app-bg border border-app-border text-sm focus:border-app-accent focus:outline-none resize-none text-app-text"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Skills Editor */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">Kỹ năng</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                  {/* Experience Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-app-border pb-2">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent">Kinh nghiệm làm việc</h4>
                      <button 
                        onClick={handleAddExperience}
                        className="px-3 py-1.5 rounded-lg bg-app-accent text-black font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-black" /> Thêm kinh nghiệm
                      </button>
                    </div>

                    <div className="space-y-4">
                      {editData.experience?.map((exp, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3 relative">
                          <button 
                            onClick={() => handleDeleteExperience(idx)}
                            className="absolute right-4 top-4 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
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
                              <label className="text-[10px] uppercase font-bold text-app-muted">Kỹ năng sử dụng (ngăn cách bằng dấu phẩy)</label>
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

                  {/* Projects Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-app-border pb-2">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent">Dự án triển khai</h4>
                      <button 
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
                              <label className="text-[10px] uppercase font-bold text-app-muted">Công nghệ (cách nhau bằng dấu phẩy)</label>
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

                  {/* Education & Personal/Contact Info Editors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education */}
                    <div className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">Học vấn</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-app-muted">Trường học</label>
                          <input 
                            type="text" 
                            value={editData.education?.school} 
                            onChange={(e) => handleManualNestedChange('education', 'school', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-app-muted">Chuyên ngành</label>
                          <input 
                            type="text" 
                            value={editData.education?.major} 
                            onChange={(e) => handleManualNestedChange('education', 'major', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-app-muted">Năm tốt nghiệp</label>
                          <input 
                            type="text" 
                            value={editData.education?.year} 
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

                    {/* Contact & Personal info */}
                    <div className="p-4 rounded-xl bg-app-bg/50 border border-app-border space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent border-b border-app-border pb-2">Thông tin cá nhân & Liên hệ</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-app-muted">Ngày sinh</label>
                          <input 
                            type="text" 
                            value={editData.birthDate || ''} 
                            onChange={(e) => handleManualChange('birthDate', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-app-muted">Số điện thoại</label>
                          <input 
                            type="text" 
                            value={editData.phone || ''} 
                            onChange={(e) => handleManualChange('phone', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-app-muted">Email</label>
                          <input 
                            type="email" 
                            value={editData.contact?.email} 
                            onChange={(e) => handleManualNestedChange('contact', 'email', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-app-muted">Địa chỉ</label>
                          <input 
                            type="text" 
                            value={editData.address || ''} 
                            onChange={(e) => handleManualChange('address', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-app-muted">LinkedIn URL</label>
                          <input 
                            type="text" 
                            value={editData.contact?.linkedin} 
                            onChange={(e) => handleManualNestedChange('contact', 'linkedin', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] uppercase font-bold text-app-muted flex items-center gap-1">
                            Tọa độ Google Maps
                            <span className="text-app-accent/60 normal-case font-normal">(để link địa chỉ trên bản đồ)</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] text-app-muted">Vĩ độ (Latitude)</label>
                              <input 
                                type="text" 
                                placeholder="10.7769" 
                                value={editData.lat || ''} 
                                onChange={(e) => handleManualChange('lat', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-app-muted">Kinh độ (Longitude)</label>
                              <input 
                                type="text" 
                                placeholder="106.7009" 
                                value={editData.lng || ''} 
                                onChange={(e) => handleManualChange('lng', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                          <p className="text-[10px] text-app-muted/70 leading-relaxed">
                            Tra tọa độ tại <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-app-accent hover:underline inline-flex items-center gap-0.5">maps.google.com<ArrowUpRight className="w-2.5 h-2.5" /></a> → chuột phải vào vị trí → sao chép tọa độ
                          </p>
                        </div>

                        {/* Web3Forms Configuration */}
                        <div className="border-t border-app-border/40 pt-3 mt-2 space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-app-accent flex items-center gap-1">
                            Web3Forms Access Key
                            <span className="text-app-muted normal-case font-normal">(để gửi mail trực tiếp từ Website)</span>
                          </label>
                          <input 
                            type="password" 
                            placeholder="Nhập Access Key từ Web3Forms (ví dụ: a1b2c3d4-e5f6-...)" 
                            value={editData.web3FormsKey || ''} 
                            onChange={(e) => handleManualChange('web3FormsKey', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-app-bg border border-app-border text-xs text-app-text focus:border-app-accent focus:outline-none font-mono"
                          />
                          <p className="text-[10px] text-app-muted/70 leading-relaxed">
                            Đăng ký nhận mã Key miễn phí ngay lập tức tại <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-app-accent hover:underline inline-flex items-center gap-0.5">web3forms.com<ArrowUpRight className="w-2.5 h-2.5" /></a> (Chỉ cần điền email của bạn để nhận Key tức thì, hoàn toàn miễn phí).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Awards & Achievements Editor */}
                  <div className="space-y-4 pt-4 border-t border-app-border">
                    <div className="flex items-center justify-between border-b border-app-border pb-2">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-app-accent">Giải thưởng & Thành tựu</h4>
                      <button 
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

                  {/* Manual Edit Action bottom */}
                  <div className="flex justify-end items-center gap-3 border-t border-app-border pt-4">
                    {saveSuccess && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        Đã lưu thành công!
                      </span>
                    )}
                    <button
                      onClick={handleSaveManual}
                      disabled={isSaving}
                      className={`px-6 py-2.5 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-lg shadow-app-accent/15 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-black" />
                          Lưu Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: AI GENERATOR */}
              {adminTab === 'ai' && (
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
                          onClick={handleGenerateAI}
                          disabled={isAiLoading}
                          className="w-full py-2.5 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== ROUTE 2: PUBLIC CV VIEW ====================
  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 font-sans antialiased relative selection:bg-app-accent/30 selection:text-app-accent">
      
      {/* 1. HEADER (Fixed Navigation with Glassmorphism) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-app-bg/75 backdrop-blur-md border-b border-app-border transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-app-accent to-indigo-600 flex items-center justify-center font-bold text-black text-lg">
              {profileData.name.charAt(0)}
            </div>
            <span className="font-display font-bold text-lg tracking-tight hover:text-app-accent transition-colors">
              {profileData.name}
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-app-muted">
            <button onClick={() => scrollToSection('about')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navAbout}</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navSkills}</button>
            <button onClick={() => scrollToSection('experience')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navExperience}</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navProjects}</button>
            <button onClick={() => scrollToSection('education')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navEducation}</button>
            {profileData.awards && profileData.awards.length > 0 && (
              <button onClick={() => scrollToSection('awards')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navAwards}</button>
            )}
            <button onClick={() => scrollToSection('contact')} className="hover:text-app-accent transition-colors cursor-pointer">{t.navContact}</button>
          </nav>

          <div className="flex items-center gap-3">
            {/* LANGUAGE TOGGLE BUTTON */}
            <button 
              onClick={() => setCurrentLang(prev => prev === 'vi' ? 'en' : 'vi')}
              className="px-2.5 py-2 rounded-lg bg-app-card border border-app-border text-xs font-bold text-app-text hover:text-app-accent hover:border-app-accent/40 transition-all cursor-pointer flex items-center gap-1.5"
              title={currentLang === 'vi' ? "Switch to English" : "Chuyển sang Tiếng Việt"}
            >
              <Globe className="w-3.5 h-3.5 text-app-accent" />
              <span>{currentLang === 'vi' ? 'EN' : 'VI'}</span>
            </button>

            {/* LIGHT/DARK MODE TOGGLE BUTTON */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-app-card border border-app-border text-app-muted hover:text-app-accent hover:border-app-accent/40 transition-all cursor-pointer"
              title={isDarkMode ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => scrollToSection('contact')} 
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-app-accent text-black font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-app-accent/10 cursor-pointer"
            >
              {t.connectNow}
            </button>
          </div>
        </div>
      </header>

      {/* Hero background mesh light gradient */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-app-accent/5 via-app-bg/0 to-app-bg/0 pointer-events-none z-0"></div>

      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16 relative z-10 space-y-24 md:space-y-32">
        
        {/* SECTION 1: HERO */}
        <section id="hero" className="flex flex-col items-center text-center space-y-6 pt-8 md:pt-16">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-app-accent to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <img 
              src={profileData.avatar} 
              alt={profileData.name} 
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-app-accent/80 shadow-2xl bg-app-card"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80";
              }}
            />
          </div>
          
          <div className="space-y-3 max-w-2xl">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-app-text">
              {profileData.name}
            </h1>
            <p className="font-display text-xl md:text-2xl font-bold text-app-accent/95">
              {profileData.title}
            </p>
            <p className="text-sm md:text-base text-app-muted leading-relaxed max-w-lg mx-auto">
              {profileData.bio}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-app-accent text-black font-extrabold text-sm md:text-base hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-app-accent/15 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-black" />
              {t.contactMe}
            </a>
            <a 
              href={cvBlobUrl || profileData.cvUrl || "#"} 
              download="CV_Profile.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-app-card border border-app-border text-app-text font-semibold text-sm md:text-base hover:bg-white/10 hover:border-app-accent/30 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 text-app-accent" />
              {t.downloadCv}
            </a>
          </div>
        </section>

        {/* SECTION 2: ABOUT & CONTACT INFO SIDE-BY-SIDE */}
        <section id="about" className="scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Left Column: Giới thiệu bản thân & Mục tiêu */}
            <div className="md:col-span-3 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-app-border pb-4">
                  <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
                    <Info className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.about}</h2>
                </div>
                <p className="text-app-muted text-base md:text-lg leading-relaxed whitespace-pre-line">
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
                      <p className="text-xs text-app-muted leading-relaxed">
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
                      <p className="text-xs text-app-muted leading-relaxed">
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
                  
                  <div className="space-y-4 text-sm">
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

        {/* SECTION 3: SKILLS */}
        <section id="skills" className="scroll-mt-24 space-y-8">
          <div className="flex items-center gap-3 border-b border-app-border pb-4">
            <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.skills}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getSortedSkills(profileData.skills, currentLang).map(([category, items]) => (
              <div 
                key={category} 
                className="p-5 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.005] relative overflow-hidden group shadow-sm"
              >
                {/* Decorative background glow */}
                <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  <h3 className="font-display text-app-accent font-bold text-lg flex items-center justify-between">
                    {category}
                    <span className="w-2 h-2 rounded-full bg-app-accent/40 group-hover:bg-app-accent transition-all"></span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-app-bg text-app-text border border-app-border hover:border-app-accent/30 hover:text-app-accent transition-all cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: EXPERIENCE */}
        <section id="experience" className="scroll-mt-24 space-y-8">
          <div className="flex items-center gap-3 border-b border-app-border pb-4">
            <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.experience}</h2>
          </div>

          {/* Wrapper: absolute lane line + flex items */}
          <div className="relative">
            {/* Continuous vertical lane — center aligned with dots (dot w=18px, so center=9px = left-[9px]) */}
            <div className="absolute left-[9px] top-6 bottom-6 w-0.5 bg-app-border/50"></div>

            <div className="space-y-5">
              {profileData.experience?.map((exp, idx) => (
                <div key={idx} className="flex items-start gap-5 group">

                  {/* Timeline dot — sits exactly on the lane */}
                  <div className="relative w-[18px] h-[18px] shrink-0 rounded-full bg-app-card border-2 border-app-accent transition-all duration-300 z-10 flex items-center justify-center mt-5">
                    <div className="w-2 h-2 rounded-full bg-app-accent transition-all duration-300"></div>
                    <span className="absolute inset-0 rounded-full bg-app-accent/25 animate-ping pointer-events-none"></span>
                  </div>

                  {/* Experience Card */}
                  <div className="flex-1 p-5 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.005] relative overflow-hidden shadow-sm">
                    {/* Decorative background glow */}
                    <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>

                    <div className="space-y-3 relative z-10">
                      {/* Header: company + period badge */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-base font-bold text-app-accent">
                            {exp.company}
                          </h3>
                          <p className="text-sm font-semibold text-app-text group-hover:text-app-accent transition-colors mt-0.5">{exp.role}</p>
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent border border-app-accent/20 shrink-0">
                          {exp.period}
                        </span>
                      </div>

                      {/* Bulleted description */}
                      {renderDescriptionList(exp.description)}

                      {/* Experience Skills tags */}
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.skills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-app-bg text-xs font-bold text-app-accent border border-app-border">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: PROJECTS */}
        <section id="projects" className="scroll-mt-24 space-y-8">
          <div className="flex items-center gap-3 border-b border-app-border pb-4">
            <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
              <Laptop className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.projects}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.projects?.map((proj, idx) => (
              <div 
                key={idx} 
                className="flex flex-col justify-between p-6 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.01] group relative overflow-hidden shadow-sm"
              >
                {/* Decorative background glow */}
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all"></div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-app-text group-hover:text-app-accent transition-colors">
                      {proj.name}
                    </h3>
                  </div>
                  {renderDescriptionList(proj.description)}
                   <div className="flex flex-wrap gap-1.5">
                    {proj.tech?.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-app-bg text-xs font-bold text-app-accent border border-app-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 text-sm font-bold relative z-10">
                  {proj.demo && proj.demo !== '#' && (
                    <a 
                      href={proj.demo} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1.5 text-app-accent hover:underline cursor-pointer"
                    >
                      Demo
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: EDUCATION */}
        <section id="education" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3 border-b border-app-border pb-4">
            <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.education}</h2>
          </div>

          <div className="p-6 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.005] relative overflow-hidden space-y-3 shadow-sm group">
            {/* Decorative background glow */}
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>

            <div className="space-y-3 relative z-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h3 className="font-display text-lg font-bold text-app-text group-hover:text-app-accent transition-colors">
                  {profileData.education?.school}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent border border-app-accent/20 shrink-0">
                  {t.graduated}: {profileData.education?.year}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-app-muted">{profileData.education?.major}</p>
                {profileData.education?.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profileData.education.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2.5 py-1 rounded-lg bg-app-bg text-xs font-bold text-app-accent border border-app-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: AWARDS */}
        {profileData.awards && profileData.awards.length > 0 && (
          <section id="awards" className="scroll-mt-24 space-y-6">
            <div className="flex items-center gap-3 border-b border-app-border pb-4">
              <div className="p-2 rounded-lg bg-app-accent/10 text-app-accent">
                <Trophy className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-app-text">{t.awards}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData.awards.map((award, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col justify-between p-6 rounded-xl bg-app-card border border-app-border hover:border-app-accent/30 transition-all hover:scale-[1.01] group relative overflow-hidden shadow-sm relative"
                >
                  {/* Decorative background glow */}
                  <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all pointer-events-none"></div>
                  
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-lg font-bold text-app-text group-hover:text-app-accent transition-colors leading-snug">
                        {award.title}
                      </h3>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent border border-app-accent/20 shrink-0 font-mono">
                        {award.year}
                      </span>
                    </div>
                    {award.issuer && (
                      <p className="text-sm text-app-muted leading-relaxed">
                        {award.issuer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 8: CONTACT */}
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
      </main>

      {/* SECTION 8: FOOTER */}
      <footer className="border-t border-app-border py-8 mt-16 bg-app-card">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-app-muted">
          <p className="select-none font-mono">
            © {new Date().getFullYear()} {profileData.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <button onClick={() => scrollToSection('hero')} className="hover:text-app-accent transition-colors cursor-pointer">{t.backToTop}</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
