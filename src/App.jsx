import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Common components
import ThemeToggle from './components/Common/ThemeToggle';

// Profile components
import ProfileHeader from './components/Profile/ProfileHeader';
import ProfileHero from './components/Profile/ProfileHero';
import ProfileAbout from './components/Profile/ProfileAbout';
import ProfileSkills from './components/Profile/ProfileSkills';
import ProfileExperience from './components/Profile/ProfileExperience';
import ProfileProjects from './components/Profile/ProfileProjects';
import ProfileEducation from './components/Profile/ProfileEducation';
import ProfileAwards from './components/Profile/ProfileAwards';
import ProfileContact from './components/Profile/ProfileContact';
import ProfileFooter from './components/Profile/ProfileFooter';

// Admin components
import AdminAuth from './components/Admin/AdminAuth';
import AdminHeader from './components/Admin/AdminHeader';
import AdminSidebar from './components/Admin/AdminSidebar';

// Admin forms
import BasicInfoForm from './components/Admin/Forms/BasicInfoForm';
import SkillsForm from './components/Admin/Forms/SkillsForm';
import ExperienceForm from './components/Admin/Forms/ExperienceForm';
import ProjectsForm from './components/Admin/Forms/ProjectsForm';
import EducationForm from './components/Admin/Forms/EducationForm';
import AwardsForm from './components/Admin/Forms/AwardsForm';
import ContactForm from './components/Admin/Forms/ContactForm';

const uiTranslations = {
  about: "Giới thiệu bản thân",
  skills: "Kỹ năng chuyên môn",
  experience: "Kinh nghiệm làm việc",
  projects: "Dự án nổi bật",
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
  navAwards: "Giải thưởng",
  awarded: "Đạt giải",
  softSkills: "Kỹ năng mềm"
};

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
    "Triển khai": [],
    "Tích hợp kỹ thuật": [],
    "Công cụ & Kiểm thử": [],
    "AI tools": []
  },
  softSkills: [],
  experience: [],
  projects: [],
  education: [],
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

const normalizeProfile = (profile) => {
  const normalized = { ...defaultProfile, ...profile };
  
  if (!normalized.skills || typeof normalized.skills !== 'object' || Array.isArray(normalized.skills)) {
    normalized.skills = { ...defaultProfile.skills };
  }
  
  if (normalized.education && !Array.isArray(normalized.education)) {
    if (typeof normalized.education === 'object' && Object.keys(normalized.education).length > 0) {
      const { school, major, year, skills } = normalized.education;
      if (school || major || year || skills) {
        normalized.education = [{
          school: school || "",
          major: major || "",
          year: year || "",
          skills: skills || ""
        }];
      } else {
        normalized.education = [];
      }
    } else {
      normalized.education = [];
    }
  }
  if (!normalized.education) {
    normalized.education = [];
  }
  
  return normalized;
};

function App() {

  const [allProfiles, setAllProfiles] = useState(() => {
    try {
      const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
      if (savedMultilang) {
        const parsed = JSON.parse(savedMultilang);
        return {
          vi: normalizeProfile(parsed.vi)
        };
      }
      const saved = localStorage.getItem('cv_profile_data');
      if (saved) {
        const parsedOld = JSON.parse(saved);
        return {
          vi: normalizeProfile(parsedOld)
        };
      }
    } catch (err) {
      console.error("Error reading initial localStorage:", err);
    }
    return {
      vi: defaultProfile
    };
  });

  const profileData = allProfiles.vi || defaultProfile;
  const profileDataToDisplay = profileData;

  const awardsToDisplay = profileDataToDisplay.awards || [];
  const softSkillsToDisplay = profileDataToDisplay.softSkills || [];

  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'cv';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return sessionStorage.getItem('theme') === 'dark';
  });

  const [passError, setPassError] = useState('');
  const [isAuthed, setIsAuthed] = useState(() => {
    return sessionStorage.getItem('admin_authed') === 'true';
  });
  const [adminTab, setAdminTab] = useState('basic');

  const [editData, setEditData] = useState(profileData);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedAvatarName, setUploadedAvatarName] = useState(() => {
    return profileData.avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '';
  });

  const t = uiTranslations;

  const [apiKey, setApiKey] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('Chuyên nghiệp');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponseRaw, setAiResponseRaw] = useState('');
  const [parsedAiData, setParsedAiData] = useState(null);
  const [aiError, setAiError] = useState('');
  const [cvBlobUrl, setCvBlobUrl] = useState('');

  // Admin Save Success Toast
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Firebase Firestore States
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Convert Base64 data CV to blob URL
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

  // Sync Router with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname === '/admin' ? 'admin' : 'cv');
    };
    
    window.addEventListener('popstate', handlePopState);
    
    const savedTheme = sessionStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load Profile Data from Firebase Firestore
  useEffect(() => {
    const loadData = async () => {
      if (!db) {
        console.log("Firebase is not initialized. Using localStorage fallback.");
        try {
          const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
          if (savedMultilang) {
            const parsed = JSON.parse(savedMultilang);
            const loadedProfiles = {
              vi: normalizeProfile(parsed.vi)
            };
            setAllProfiles(loadedProfiles);
            setEditData(loadedProfiles.vi);
          } else {
            const saved = localStorage.getItem('cv_profile_data');
            if (saved) {
              const loadedProfiles = {
                vi: normalizeProfile(JSON.parse(saved))
              };
              setAllProfiles(loadedProfiles);
              setEditData(loadedProfiles.vi);
            }
          }
        } catch (err) {
          console.error("Lỗi khi đọc từ localStorage:", err);
        }
        setIsDbLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "profile", "default");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dbData = docSnap.data();
          let loadedProfiles = {
            vi: defaultProfile
          };
          
          if (dbData.vi) {
            loadedProfiles.vi = normalizeProfile(dbData.vi);
          } else if (dbData.name) {
            loadedProfiles.vi = normalizeProfile(dbData);
          }
          
          setAllProfiles(loadedProfiles);
          setEditData(loadedProfiles.vi);
        } else {
          const initial = { vi: defaultProfile };
          await setDoc(docRef, initial);
          setAllProfiles(initial);
          setEditData(initial.vi);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ Firestore:", error);
        try {
          const savedMultilang = localStorage.getItem('cv_profile_data_multilang');
          if (savedMultilang) {
            const parsed = JSON.parse(savedMultilang);
            const loadedProfiles = {
              vi: normalizeProfile(parsed.vi)
            };
            setAllProfiles(loadedProfiles);
            setEditData(loadedProfiles.vi);
          } else {
            const saved = localStorage.getItem('cv_profile_data');
            if (saved) {
              const loadedProfiles = {
                vi: normalizeProfile(JSON.parse(saved))
              };
              setAllProfiles(loadedProfiles);
              setEditData(loadedProfiles.vi);
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
  }, []);

  // Sync editData when allProfiles changes (e.g. loaded data)
  useEffect(() => {
    if (allProfiles.vi) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditData(allProfiles.vi);
      setUploadedAvatarName(allProfiles.vi.avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '');
    }
  }, [allProfiles]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path === '/admin' ? 'admin' : 'cv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (path === '/admin') {
      setEditData({ ...allProfiles.vi });
      setPassError('');
      setUploadedAvatarName(allProfiles.vi.avatar?.startsWith('data:') ? 'Ảnh từ thiết bị' : '');
    }
  };


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

  const handleAuthSubmit = (password) => {
    if (password === 'MauPhuong@123') {
      setIsAuthed(true);
      sessionStorage.setItem('admin_authed', 'true');
      setPassError('');
    } else {
      setPassError('Sai mật khẩu! Vui lòng kiểm tra lại.');
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    sessionStorage.removeItem('admin_authed');
    navigateTo('/admin');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  const handleCvFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert(`Không thể tải lên! Tệp tin CV của bạn quá lớn (${Math.round(file.size / (1024 * 1024) * 100) / 100}MB). Trình duyệt và Firebase giới hạn dung lượng lưu trữ tối đa. Vui lòng nén tệp tin PDF xuống dưới 1MB (khuyên dùng dưới 700KB) bằng các công cụ nén PDF trực tuyến như Smallpdf, ILovePDF trước khi tải lên.`);
        e.target.value = null; // Reset file input
        return;
      }
      if (file.size > 700 * 1024) {
        alert(`Cảnh báo: Tệp tin CV của bạn khá nặng (${Math.round(file.size / 1024)}KB). Bạn nên nén tệp PDF xuống dưới 700KB để đảm bảo đồng bộ lên Firebase thành công.`);
      }
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        handleManualChange('cvUrl', event.target.result);
      };
      reader.onerror = () => {
        alert('Đã xảy ra lỗi khi đọc file!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCvFile = () => {
    setUploadedFileName('');
    handleManualChange('cvUrl', '');
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
      }
      setUploadedAvatarName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Downscale to max 500px
          const MAX_SIZE = 500;
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 70% quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          console.log("Compressed avatar size:", Math.round(compressedDataUrl.length / 1024), "KB");
          
          handleManualChange('avatar', compressedDataUrl);
        };
      };
      reader.onerror = () => {
        alert('Đã xảy ra lỗi khi đọc file ảnh!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatarFile = () => {
    setUploadedAvatarName('');
    handleManualChange('avatar', '');
  };

  const handleAddSkill = (category) => {
    const currentSkills = editData.skills[category] || [];
    const newSkillName = 'Kỹ năng mới';
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...currentSkills, newSkillName]
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
    const currentSkills = (editData.skills[category] || []).filter((_, i) => i !== index);
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

  const handleAddSkillCategory = (catName) => {
    if (!catName || !catName.trim()) return;
    const trimmed = catName.trim();
    if (editData.skills && editData.skills[trimmed]) return;
    setEditData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [trimmed]: []
      }
    }));
  };

  const handleDeleteSkillCategory = (catName) => {
    setEditData(prev => {
      const newSkills = { ...prev.skills };
      delete newSkills[catName];
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  const handleAddExperience = () => {
    const newItemVi = { company: 'Công ty mới', role: 'Vị trí công việc', period: '2024', description: 'Mô tả công việc của bạn', skills: [] };
    setEditData(prev => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        newItemVi
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
    setEditData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddProject = () => {
    const newItemVi = { name: 'Dự án mới', description: 'Mô tả dự án', tech: ['React'], demo: '#', period: '' };
    setEditData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        newItemVi
      ]
    }));
  };

  const handleUpdateProject = (index, field, val) => {
    const list = [...editData.projects];
    let computedVal = val;
    if (field === 'tech') {
      computedVal = Array.isArray(val) ? val : val.split(',').map(s => s.trim()).filter(Boolean);
    }
    list[index] = { ...list[index], [field]: computedVal };
    setEditData(prev => ({
      ...prev,
      projects: list
    }));
  };

  const handleDeleteProject = (index) => {
    setEditData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { school: 'Trường học mới', major: 'Chuyên ngành', year: '2024', skills: '' }
      ]
    }));
  };

  const handleUpdateEducation = (index, field, val) => {
    setEditData(prev => {
      const list = [...(prev.education || [])];
      if (list[index]) {
        list[index] = { ...list[index], [field]: val };
      }
      return {
        ...prev,
        education: list
      };
    });
  };

  const handleDeleteEducation = (index) => {
    setEditData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddAward = () => {
    const newItemVi = { title: 'Giải thưởng mới', year: new Date().getFullYear().toString(), issuer: 'Tổ chức cấp giải' };
    setEditData(prev => ({
      ...prev,
      awards: [
        ...(prev.awards || []),
        newItemVi
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
    setEditData(prev => ({
      ...prev,
      awards: (prev.awards || []).filter((_, i) => i !== index)
    }));
  };

  const handleReorderItem = (field, dragIndex, hoverIndex) => {
    setEditData(prev => {
      const list = [...(prev[field] || [])];
      const draggedItem = list[dragIndex];
      list.splice(dragIndex, 1);
      list.splice(hoverIndex, 0, draggedItem);
      return {
        ...prev,
        [field]: list
      };
    });
  };

  const handleReorderSkills = (dragIndex, hoverIndex) => {
    setEditData(prev => {
      const keys = Object.keys(prev.skills || {});
      const draggedKey = keys[dragIndex];
      keys.splice(dragIndex, 1);
      keys.splice(hoverIndex, 0, draggedKey);
      
      const newSkills = {};
      keys.forEach(key => {
        newSkills[key] = prev.skills[key];
      });
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  const handleClearBrowserCache = () => {
    if (window.confirm("Bạn có chắc muốn giải phóng bộ nhớ đệm LocalStorage không? Thao tác này sẽ xóa cache trên trình duyệt và tải lại dữ liệu mới nhất từ máy chủ Firebase.")) {
      localStorage.removeItem('cv_profile_data_multilang');
      localStorage.removeItem('cv_profile_data');
      window.location.reload();
    }
  };

  const handleSaveManual = async () => {
    setIsSaving(true);
    const updatedProfiles = {
      vi: editData,
      en: editData
    };
    
    let localSaved = false;
    let serverSaved = false;
    let serverError = null;

    // 1. Save to LocalStorage first to guarantee no data loss!
    try {
      localStorage.setItem('cv_profile_data_multilang', JSON.stringify(updatedProfiles));
      localStorage.setItem('cv_profile_data', JSON.stringify(updatedProfiles.vi));
      localSaved = true;
    } catch (err) {
      console.error("Lỗi khi lưu vào LocalStorage:", err);
      // Auto-recovery: if LocalStorage is full, clear the old cache and retry writing
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        try {
          console.warn("LocalStorage full. Attempting to clear cache and retry...");
          localStorage.removeItem('cv_profile_data_multilang');
          localStorage.removeItem('cv_profile_data');
          localStorage.setItem('cv_profile_data_multilang', JSON.stringify(updatedProfiles));
          localStorage.setItem('cv_profile_data', JSON.stringify(updatedProfiles.vi));
          localSaved = true;
          console.log("LocalStorage recovered and saved successfully.");
        } catch (retryErr) {
          console.error("Failed to recover LocalStorage even after clearing cache:", retryErr);
        }
      }
    }

    // 2. Save to Firebase Firestore
    if (db) {
      try {
        const docRef = doc(db, "profile", "default");
        await setDoc(docRef, updatedProfiles);
        console.log("Dữ liệu đã được lưu lên Firebase Firestore.");
        serverSaved = true;
      } catch (error) {
        console.error('Lỗi khi lưu lên Firebase Firestore:', error);
        serverError = error;
      }
    }

    setIsSaving(false);

    if (localSaved) {
      setAllProfiles(updatedProfiles);
      
      if (db && !serverSaved) {
        // Firebase failure diagnostics
        if (serverError && (serverError.code === 'permission-denied' || serverError.message?.includes('permission'))) {
          alert('Đã lưu dữ liệu thành công cục bộ trên trình duyệt (LocalStorage)!\nTuy nhiên, không thể đồng bộ lên máy chủ Firebase do lỗi phân quyền (Security Rules). Vui lòng cấu hình lại Firestore rules để cho phép ghi.');
        } else if (serverError && (serverError.message?.includes('too large') || serverError.message?.includes('size limit') || JSON.stringify(updatedProfiles).length > 800000)) {
          alert('Đã lưu dữ liệu thành công cục bộ trên trình duyệt (LocalStorage)!\nTuy nhiên, không thể đồng bộ lên Firebase do dung lượng tệp tin (ảnh đại diện/CV) quá lớn (Hạn chế 1MB của Firestore). Vui lòng thử tải lên ảnh/file kích thước nhỏ hơn.');
        } else {
          alert('Đã lưu dữ liệu thành công cục bộ trên trình duyệt (LocalStorage)!\nTuy nhiên, không thể đồng bộ lên máy chủ Firebase (Vui lòng kiểm tra cấu hình Firebase hoặc kết nối mạng).');
        }
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      // LocalStorage fallback failed (typically quota exceeded even after clearing)
      alert('Không thể lưu dữ liệu! Trình duyệt hết bộ nhớ lưu trữ. Vui lòng thử dùng ảnh đại diện hoặc tệp tin CV có kích thước nhỏ hơn.');
    }
  };

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
  "title": "Chức danh",
  "bio": "Giới thiệu ngắn 1-2 câu",
  "about": "Giới thiệu chi tiết 3-4 câu",
  "shortTermGoal": "Mục tiêu ngắn hạn 1-2 câu",
  "longTermGoal": "Mục tiêu dài hạn 1-2 câu",
  "birthDate": "DD/MM/YYYY",
  "phone": "Số điện thoại",
  "address": "Địa chỉ",
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
      "description": "Mô tả ngắn công việc và thành tựu",
      "skills": ["React"]
    }
  ],
  "projects": [
    {
      "name": "Tên dự án",
      "description": "Mô tả dự án",
      "tech": ["React"],
      "github": "#",
      "demo": "#"
    }
  ],
  "education": {
    "school": "Tên trường",
    "major": "Ngành học",
    "year": "2020",
    "skills": "Các kỹ năng đạt được"
  },
  "awards": [
    {
      "title": "Tên giải thưởng",
      "year": "2023",
      "issuer": "Tổ chức cấp"
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

  const handleApplyAiData = async () => {
    if (parsedAiData) {
      const normalizedAiData = normalizeProfile(parsedAiData);
      const updatedProfiles = {
        vi: normalizedAiData,
        en: normalizedAiData
      };
      
      let localSaved = false;
      try {
        localStorage.setItem('cv_profile_data_multilang', JSON.stringify(updatedProfiles));
        localStorage.setItem('cv_profile_data', JSON.stringify(updatedProfiles.vi));
        localSaved = true;
      } catch (err) {
        console.error("Lỗi khi lưu LocalStorage dữ liệu AI:", err);
      }

      if (db) {
        try {
          const docRef = doc(db, "profile", "default");
          await setDoc(docRef, updatedProfiles);
          console.log("Dữ liệu AI đã được lưu lên Firebase Firestore.");
        } catch (e) {
          console.error("Lỗi khi đồng bộ dữ liệu AI lên Firebase:", e);
          alert("Áp dụng dữ liệu AI thành công cục bộ! Tuy nhiên đồng bộ lên Firebase thất bại.");
        }
      }

      if (localSaved) {
        setAllProfiles(updatedProfiles);
        setEditData(normalizedAiData);
      }
      navigateTo('/admin');
    }
  };

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

  if (currentRoute === 'admin') {
    const getStorageSizeInfo = () => {
      try {
        const dataStr = JSON.stringify(editData || {});
        const sizeKb = Math.round(dataStr.length / 1024);
        const percent = Math.min(Math.round((dataStr.length / (5 * 1024 * 1024)) * 100), 100);
        return { sizeKb, percent };
      } catch (e) {
        return { sizeKb: 0, percent: 0 };
      }
    };
    const storageInfo = getStorageSizeInfo();

    return (
      <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 font-sans md:h-screen md:overflow-hidden">
        
        {/* Theme switcher floating in admin page */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
            className="p-2"
          />
        </div>

        {/* ADMIN AUTH SCREEN */}
        {!isAuthed ? (
          <AdminAuth 
            onVerify={handleAuthSubmit} 
            passError={passError} 
            clearError={() => setPassError('')}
          />
        ) : (
          
          // ADMIN CONTROL PANEL DASHBOARD (Full screen)
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 md:py-6 md:h-full md:max-h-screen md:flex md:flex-col md:gap-6 md:space-y-0 md:overflow-hidden">
            
            <AdminHeader navigateTo={navigateTo} handleLogout={handleLogout} handleClearBrowserCache={handleClearBrowserCache} />

            {/* Admin Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:flex-1 md:min-h-0">
              
              {/* Vertical Sidebar Menu */}
              <AdminSidebar adminTab={adminTab} setAdminTab={setAdminTab} />

              {/* Admin Main Editor Body (Right panel) */}
              <div className="md:col-span-3 p-6 rounded-2xl bg-app-card border border-app-border shadow-xl min-h-[500px] md:h-full md:overflow-y-auto custom-scrollbar">
                
                {adminTab === 'basic' && (
                  <BasicInfoForm 
                    editData={editData}
                    handleManualChange={handleManualChange}
                    uploadedFileName={uploadedFileName}
                    uploadedAvatarName={uploadedAvatarName}
                    setUploadedAvatarName={setUploadedAvatarName}
                    handleCvFileUpload={handleCvFileUpload}
                    handleRemoveCvFile={handleRemoveCvFile}
                    handleAvatarFileUpload={handleAvatarFileUpload}
                    handleRemoveAvatarFile={handleRemoveAvatarFile}
                  />
                )}

                {adminTab === 'skills' && (
                  <SkillsForm 
                    editData={editData}
                    handleUpdateCategoryName={handleUpdateCategoryName}
                    handleAddSkill={handleAddSkill}
                    handleUpdateSkill={handleUpdateSkill}
                    handleDeleteSkill={handleDeleteSkill}
                    handleManualChange={handleManualChange}
                    handleAddSkillCategory={handleAddSkillCategory}
                    handleDeleteSkillCategory={handleDeleteSkillCategory}
                    handleReorderSkills={handleReorderSkills}
                  />
                )}

                {adminTab === 'experience' && (
                  <ExperienceForm 
                    editData={editData}
                    handleAddExperience={handleAddExperience}
                    handleUpdateExperience={handleUpdateExperience}
                    handleDeleteExperience={handleDeleteExperience}
                    handleReorderItem={handleReorderItem}
                  />
                )}

                {adminTab === 'projects' && (
                  <ProjectsForm 
                    editData={editData}
                    handleAddProject={handleAddProject}
                    handleUpdateProject={handleUpdateProject}
                    handleDeleteProject={handleDeleteProject}
                    handleReorderItem={handleReorderItem}
                  />
                )}

                {adminTab === 'education' && (
                  <EducationForm 
                    editData={editData}
                    handleAddEducation={handleAddEducation}
                    handleUpdateEducation={handleUpdateEducation}
                    handleDeleteEducation={handleDeleteEducation}
                    handleReorderItem={handleReorderItem}
                  />
                )}

                {adminTab === 'contact' && (
                  <ContactForm 
                    editData={editData}
                    handleManualChange={handleManualChange}
                    handleManualNestedChange={handleManualNestedChange}
                  />
                )}

                {adminTab === 'awards' && (
                  <AwardsForm 
                    editData={editData}
                    handleAddAward={handleAddAward}
                    handleUpdateAward={handleUpdateAward}
                    handleDeleteAward={handleDeleteAward}
                    handleReorderItem={handleReorderItem}
                  />
                )}

                {/* Manual Edit Action bottom */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-app-border pt-4 mt-6">
                  {/* Storage usage indicator */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${storageInfo.percent > 80 ? 'bg-red-500 animate-pulse' : storageInfo.percent > 50 ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                      <span className="text-xs text-app-muted font-sans font-medium">
                        Dung lượng dữ liệu: {storageInfo.sizeKb}KB / 5000KB ({storageInfo.percent}%)
                      </span>
                    </div>
                    {storageInfo.percent > 50 && (
                      <span className="text-[10px] text-amber-500 font-sans leading-tight max-w-[280px]">
                        {storageInfo.percent > 80 
                          ? '⚠️ Bộ nhớ sắp đầy! Vui lòng gỡ file CV nặng hoặc thay thế bằng ảnh/file nhỏ hơn.' 
                          : 'Khuyên dùng: Nén file CV xuống dưới 700KB để lưu trữ mượt mà.'
                        }
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {saveSuccess && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        Đã lưu thành công!
                      </span>
                    )}
                    <button
                      type="button"
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
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 font-sans antialiased relative selection:bg-app-accent/30 selection:text-app-accent">
      
      {/* 1. HEADER (Fixed Navigation with Glassmorphism) */}
      <ProfileHeader 
        profileData={profileDataToDisplay} 
        t={t} 
        awardsToDisplay={awardsToDisplay} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        scrollToSection={scrollToSection} 
      />

      {/* Hero background mesh light gradient */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-app-accent/5 via-app-bg/0 to-app-bg/0 pointer-events-none z-0"></div>

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-24 relative z-10 space-y-32 md:space-y-44">
        
        {/* SECTION 1: HERO */}
        <ProfileHero 
          profileData={profileDataToDisplay} 
          t={t} 
          cvBlobUrl={cvBlobUrl} 
          scrollToSection={scrollToSection} 
        />

        {/* SECTION 2: ABOUT & CONTACT INFO SIDE-BY-SIDE */}
        <ProfileAbout 
          profileData={profileDataToDisplay} 
          t={t} 
        />

        {/* SECTION 3: SKILLS */}
        <ProfileSkills 
          profileData={profileDataToDisplay} 
          t={t} 
          softSkillsToDisplay={softSkillsToDisplay}
        />

        {/* SECTION 4: EXPERIENCE */}
        <ProfileExperience 
          profileData={profileDataToDisplay} 
          t={t} 
        />

        {/* SECTION 5: PROJECTS */}
        <ProfileProjects 
          profileData={profileDataToDisplay} 
          t={t} 
        />

        {/* SECTION 6: EDUCATION */}
        <ProfileEducation 
          profileData={profileDataToDisplay} 
          t={t} 
        />

        {/* SECTION 7: AWARDS */}
        <ProfileAwards 
          awardsToDisplay={awardsToDisplay} 
          t={t} 
        />

        {/* SECTION 8: CONTACT */}
        <ProfileContact 
          profileData={profileDataToDisplay} 
          t={t} 
        />
        
      </main>

      {/* SECTION 9: FOOTER */}
      <ProfileFooter 
        profileData={profileDataToDisplay} 
        t={t} 
        scrollToSection={scrollToSection} 
      />

    </div>
  );
}

export default App;
