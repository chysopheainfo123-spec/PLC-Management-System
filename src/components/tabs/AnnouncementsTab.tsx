import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Megaphone, History, Send, X, Users, MessageSquare, 
  ChevronDown, Search, Check, Sparkles, HelpCircle, Info, User,
  Trash2, Filter, ArrowRight, CheckCircle2, ShieldCheck, Clock, RefreshCw, Smartphone, Calendar, Languages
} from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';

const QUICK_TEMPLATES = [
  {
    id: 'holiday',
    nameKh: 'ដំណឹងឈប់សម្រាកបុណ្យ',
    nameEn: 'Holiday Announcement',
    icon: '🎉',
    titleKh: '📢 សេចក្តីជូនដំណឹងស្តីពីការឈប់សម្រាកក្នុងឱកាសបុណ្យជាតិ',
    titleEn: '📢 National Holiday Announcement',
    contentKh: 'សាលាកុំព្យូទ័រ PLC សូមជម្រាបជូនដំណឹងដល់ប្អូនៗសិស្សានុសិស្សទាំងអស់ថា សាលានឹងត្រូវផ្អាកការសិក្សាចាប់ពីថ្ងៃទី [កាលបរិច្ឆេទ] រហូតដល់ថ្ងៃទី [កាលបរិច្ឆេទ]។ ការសិក្សានឹងចាប់ផ្តើមឡើងវិញនៅថ្ងៃទី [កាលបរិច្ឆេទចូលវិញ]។\n\nសូមជូនពរប្អូនៗទទួលបានសុខសុវត្ថិភាពក្នុងការធ្វើដំណើរ និងមានសុខភាពល្អក្នុងឱកាសសម្រាកនេះ! សូមអរគុណ។',
    contentEn: 'PLC Computer School would like to inform all students that the school will be closed from [Start Date] until [End Date]. Classes will resume on [Resume Date].\n\nWishing you a safe journey and great health! Thank you.'
  },
  {
    id: 'exam_reminder',
    nameKh: 'រំលឹកការប្រឡង',
    nameEn: 'Exam Reminder',
    icon: '📝',
    titleKh: '📝 ដំណឹងរំលឹកពីការប្រឡងបញ្ចប់វគ្គសិក្សា',
    titleEn: '📝 End of Course Exam Reminder',
    contentKh: 'សូមជម្រាបជូនដំណឹងដល់សិស្សានុសិស្សទាំងអស់ក្នុងវគ្គសិក្សា [ឈ្មោះវគ្គសិក្សា] ថា យើងនឹងមានការប្រឡងបញ្ចប់វគ្គនៅថ្ងៃទី [កាលបរិច្ឆេទប្រឡង] វេលាម៉ោង [ម៉ោង]។\n\nសូមប្អូនៗរៀបចំខ្លួន និងរំលឹកមេរៀនឡើងវិញឱ្យបានល្អមុនពេលប្រឡង។ ជូនពរទទួលបានជោគជ័យក្នុងការប្រឡងទាំងអស់គ្នា!',
    contentEn: 'Dear students of [Course Name], please be informed that our final exam will take place on [Exam Date] at [Time].\n\nPlease prepare yourself and review your lessons. Good luck to everyone!'
  },
  {
    id: 'fee_reminder',
    nameKh: 'រំលឹកការបង់ថ្លៃសិក្សា',
    nameEn: 'Tuition Fee Reminder',
    icon: '💵',
    titleKh: '💵 សេចក្តីរំលឹកអំពីការបង់ថ្លៃសិក្សា',
    titleEn: '💵 Polite Tuition Fee Reminder',
    contentKh: 'សូមជម្រាបជូនអាណាព្យាបាល និងសិស្សានុសិស្សទាំងអស់ថា ថ្លៃសិក្សាសម្រាប់វគ្គ [ឈ្មោះវគ្គសិក្សា] ឈានចូលដល់កាលបរិច្ឆេទត្រូវទូទាត់ហើយ។ សូមមេត្តាទូទាត់មុនថ្ងៃទី [ថ្ងៃឱសានវាទ]។\n\nលោកអ្នកអាចបង់ផ្ទាល់នៅការិយាល័យសាលា ឬតាមរយៈគណនី ABA របស់សាលា៖ [លេខគណនី] (ឈ្មោះគណនី៖ PLC COMPUTER SCHOOL)។ សូមអរគុណចំពោះការសហការ!',
    contentEn: 'Dear parents and students, the tuition fee for [Course Name] is now due. Please settle the payment by [Deadline].\n\nYou can pay at the school office or via ABA: [Account Number] (PLC COMPUTER SCHOOL). Thank you for your support!'
  },
  {
    id: 'class_change',
    nameKh: 'ការផ្លាស់ប្តូរម៉ោងសិក្សា',
    nameEn: 'Class Reschedule',
    icon: '⏰',
    titleKh: '⏰ សេចក្តីជូនដំណឹងស្តីពីការផ្លាស់ប្តូរម៉ោងសិក្សា',
    titleEn: '⏰ Notice of Class Schedule Change',
    contentKh: 'សូមជម្រាបជូនសិស្សានុសិស្សក្នុងថ្នាក់ [ឈ្មោះវគ្គសិក្សា] មេត្តាជ្រាបថា ម៉ោងសិក្សាធម្មតានៅថ្ងៃ [ថ្ងៃផ្លាស់ប្តូរ] នឹងត្រូវប្តូរពីម៉ោង [ម៉ោងចាស់] ទៅម៉ោង [ម៉ោងថ្មី] វិញជាបណ្តោះអាសន្ន។\n\nសូមប្អូនៗមេត្តាអញ្ជើញមកចូលរួមឱ្យបានទាន់ពេលវេលា។ សាលាសុំអធ្យាស្រ័យចំពោះការផ្លាស់ប្តូរនេះ។ សូមអរគុណ!',
    contentEn: 'Please note that our class schedule for [Course Name] on [Date] will be temporarily changed from [Old Time] to [New Time].\n\nPlease arrive on time. We apologize for any inconvenience caused. Thank you!'
  },
  {
    id: 'event',
    nameKh: 'កម្មវិធីសិក្ខាសាលា/ព្រឹត្តិការណ៍',
    nameEn: 'Workshop/Event',
    icon: '🌟',
    titleKh: '🌟 ដំណឹងអញ្ជើញចូលរួមសិក្ខាសាលាពិសេស',
    titleEn: '🌟 Invitation to Special Workshop',
    contentKh: 'សាលាកុំព្យូទ័រ PLC មានកិត្តិយសសូមអញ្ជើញប្អូនៗសិស្សានុសិស្ស និងសាធារណជនទាំងអស់ចូលរួមក្នុងសិក្ខាសាលាស្តីពី "[ប្រធានបទ]" ដែលនឹងប្រព្រឹត្តទៅនៅថ្ងៃទី [កាលបរិច្ឆេទ] ចាប់ពីម៉ោង [ម៉ោង] តទៅ។\n\nសិក្ខាសាលានេះនឹងចែករំលែកនូវចំណេះដឹង និងបទពិសោធន៍សំខាន់ៗដែលមិនគួររំលង! សូមចុះឈ្មោះចូលរួមដោយសេរី។',
    contentEn: 'PLC Computer School is pleased to invite all students and the public to our special workshop on "[Topic]" which will be held on [Date] starting from [Time].\n\nThis workshop will share highly valuable insights and knowledge! Register now for free.'
  }
];

export default function AnnouncementsTab({ uiLang, students = [] }: { uiLang?: string, students?: any[] } = {}) {
  const [localLang, setLocalLang] = useState(uiLang || localStorage.getItem("plc_lang") || "kh");

  useEffect(() => {
    if (uiLang) {
      setLocalLang(uiLang);
    }
  }, [uiLang]);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setLocalLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  const currentLang = localLang;
  const localIdt = (kh: string, en?: string) => {
    if (currentLang === "en") return en || kh;
    return kh;
  };

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  
  // AI and Scheduling states
  const [aiError, setAiError] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  // Detail log viewer modal state
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [deleteIdToConfirm, setDeleteIdToConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', content: '', target: 'ALL', sentBy: 'ADMIN'
  });

  // State for Course Target dropdown selection
  const [targetSearch, setTargetSearch] = useState('');
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const targetDropdownRef = useRef<HTMLDivElement>(null);

  // Search & Filter state for list
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTarget, setFilterTarget] = useState('ALL_TYPES'); // ALL_TYPES, BROADCAST, COURSE, STUDENT
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (targetDropdownRef.current && !targetDropdownRef.current.contains(event.target as Node)) {
        setIsTargetDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const coursesRes = await fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => ({ data }));
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      
      const annRes = await fetch('/api/announcements', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => ({ data }));
      setAnnouncements(Array.isArray(annRes.data) ? annRes.data : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleTranslate = (action: 'enhance' | 'translate_kh_to_en' | 'translate_en_to_kh') => {
    if (!formData.title && !formData.content) {
      setAiError(localIdt("សូមបំពេញចំណងជើង និងខ្លឹមសារខ្លះៗជាមុនសិន!", "Please enter some title and content first!"));
      return;
    }
    setAiError(null);
    
    const textToTranslate = `${formData.title ? `${formData.title}\n\n` : ''}${formData.content}`;
    
    let sl = 'auto';
    let tl = 'en';
    
    if (action === 'translate_kh_to_en') {
      sl = 'km';
      tl = 'en';
    } else if (action === 'translate_en_to_kh') {
      sl = 'en';
      tl = 'km';
    } else {
      sl = 'auto';
      tl = currentLang === 'kh' ? 'en' : 'km';
    }
    
    const url = `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encodeURIComponent(textToTranslate)}&op=translate`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const sentTime = isScheduled && scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString();
      const response = await fetch('/api/announcements', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          target: formData.target,
          sentBy: "d63b27b5-27a9-4b68-b8db-4f8115664161", // fallback system admin UUID
          sentAt: sentTime
        }) 
      });
      
      if (!response.ok) {
        throw new Error("Failed to post announcement record");
      }
      
      // Attempt to send telegram only if it is not scheduled in the future
      const isFutureScheduled = isScheduled && scheduledAt && new Date(scheduledAt) > new Date();
      if (!isFutureScheduled) {
        try {
          await fetch('/api/telegram/send', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
            body: JSON.stringify({ 
              telegramId: formData.target, 
              message: `✨ *${formData.title}*\n\n${formData.content}\n\n🎓 _PLC Computer School_` 
            }) 
          });
        } catch (err) {
          console.error("Telegram delivery error:", err);
        }
      }
      
      setIsAddDialogOpen(false);
      fetchData();
      setFormData({ title: '', content: '', target: 'ALL', sentBy: 'ADMIN' });
      setTargetSearch('');
      setIsScheduled(false);
      setScheduledAt('');
    } catch (error) {
      console.error("Failed to send announcement:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent, bypassConfirm = false) => {
    if (e) e.stopPropagation();
    if (!bypassConfirm) {
      setDeleteIdToConfirm(id);
      return;
    }
    setIsDeletingId(id);
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        if (selectedAnnouncement?.id === id) {
          setSelectedAnnouncement(null);
        }
        setDeleteIdToConfirm(null);
      } else {
        throw new Error("Failed to delete record");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
    } finally {
      setIsDeletingId(null);
    }
  };

  const applyTemplate = (tpl: any) => {
    setFormData({
      ...formData,
      title: currentLang === 'kh' ? tpl.titleKh : tpl.titleEn,
      content: currentLang === 'kh' ? tpl.contentKh : tpl.contentEn
    });
  };

  // Filter courses and students for target selector
  const filteredTargets = useMemo(() => {
    const searchLower = targetSearch.toLowerCase();
    
    // Course targets
    const courseList = courses.map(c => ({ 
      id: c.id, 
      label: `${localIdt("សិស្សក្នុងវគ្គ៖", "Students in:")} ${c.title}`, 
      title: c.title,
      type: 'course'
    }));
    
    // Student targets - Only active studying students
    const activeStudents = students.filter(s => s.status === 'STUDYING');
    const studentList = activeStudents.map(s => ({
      id: `STUDENT_${s.id}`,
      label: `${localIdt("សិស្ស៖", "Student:")} ${currentLang === 'kh' ? (s.nameKh || s.nameEn) : (s.nameEn || s.nameKh)} (${s.studentId})`,
      title: `${s.nameKh} ${s.nameEn} ${s.studentId}`,
      type: 'student'
    }));
    
    const combinedList = [...courseList, ...studentList];

    return [
      { id: 'ALL', label: localIdt('សិស្សទាំងអស់', 'All Students'), title: 'All Students', type: 'all' },
      ...combinedList.filter(item => item.title.toLowerCase().includes(searchLower))
    ];
  }, [courses, students, targetSearch, currentLang]);

  // Grouped targets for premium segmented dropdown
  const groupedTargets = useMemo(() => {
    const searchLower = targetSearch.toLowerCase().trim();
    const activeStudents = students.filter(s => s.status === 'STUDYING');

    // 1. Broad targets (Global Broadcast)
    const matchesAll = !searchLower || 'all students'.includes(searchLower) || 'សិស្សទាំងអស់'.includes(searchLower) || 'all'.includes(searchLower) || 'ទាំងអស់'.includes(searchLower);
    const globalGroup = matchesAll ? [
      { id: 'ALL', label: localIdt('សិស្សទាំងអស់', 'All Students'), title: 'All Students', type: 'all' }
    ] : [];

    // 2. Course targets
    const courseGroup = courses
      .map(c => {
        const count = activeStudents.filter(s => s.course === c.title || s.level === c.title).length;
        return {
          id: c.id,
          label: c.title,
          title: c.title,
          type: 'course',
          studentCount: count
        };
      })
      .filter(c => !searchLower || c.title.toLowerCase().includes(searchLower));

    // 3. Student targets
    const studentGroup = activeStudents
      .map(s => {
        const name = currentLang === 'kh' ? (s.nameKh || s.nameEn) : (s.nameEn || s.nameKh);
        return {
          id: `STUDENT_${s.id}`,
          label: name,
          studentId: s.studentId,
          title: `${name} ${s.studentId}`,
          type: 'student',
          telegramConnected: !!s.telegramConnected
        };
      })
      .filter(s => !searchLower || s.title.toLowerCase().includes(searchLower));

    const totalCount = globalGroup.length + courseGroup.length + studentGroup.length;

    return {
      global: globalGroup,
      courses: courseGroup,
      students: studentGroup,
      totalCount
    };
  }, [courses, students, targetSearch, currentLang]);

  const selectedTargetLabel = useMemo(() => {
    if (formData.target === 'ALL') return localIdt('សិស្សទាំងអស់', 'All Students');
    
    if (formData.target.startsWith('STUDENT_')) {
      const sId = formData.target.replace('STUDENT_', '');
      const foundStudent = students.find(s => String(s.id) === sId);
      if (foundStudent) {
        return `${localIdt("សិស្ស៖", "Student:")} ${currentLang === 'kh' ? (foundStudent.nameKh || foundStudent.nameEn) : (foundStudent.nameEn || foundStudent.nameKh)} (${foundStudent.studentId})`;
      }
    }

    const found = courses.find(c => c.id === formData.target);
    return found ? `${localIdt("សិស្សក្នុងវគ្គ៖", "Students in:")} ${found.title}` : formData.target;
  }, [courses, students, formData.target, currentLang]);

  // Main list filters
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(ann => {
      // Search matches
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        ann.title.toLowerCase().includes(query) || 
        ann.content.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Target type matches
      let matchesTarget = true;
      if (filterTarget === 'BROADCAST') matchesTarget = ann.target === 'ALL';
      else if (filterTarget === 'COURSE') matchesTarget = !ann.target.startsWith('STUDENT_') && ann.target !== 'ALL';
      else if (filterTarget === 'STUDENT') matchesTarget = ann.target.startsWith('STUDENT_');

      if (!matchesTarget) return false;

      // Date matches (filterDate is format YYYY-MM-DD)
      if (filterDate) {
        const annDateObj = new Date(ann.sentAt);
        const filterDateObj = new Date(filterDate);
        const isSameDay = 
          annDateObj.getFullYear() === filterDateObj.getFullYear() &&
          annDateObj.getMonth() === filterDateObj.getMonth() &&
          annDateObj.getDate() === filterDateObj.getDate();
        if (!isSameDay) return false;
      }

      return true;
    });
  }, [announcements, searchQuery, filterTarget, filterDate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans"
    >
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 px-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl">
              <Megaphone className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 font-sans">
                {localIdt("ការផ្សព្វផ្សាយសារ", "Announcements & Broadcasts")}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {localIdt("ផ្ញើសារជូនដំណឹងទៅកាន់សិស្សានុសិស្សទាំងអស់ ឬវគ្គសិក្សាជាក់លាក់តាមរយៈប្រព័ន្ធ Telegram", "Deliver high-priority alerts to students or class groups directly via Telegram channels")}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="flex items-center justify-center w-full sm:w-auto px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl transition-all shadow-md shadow-sky-500/20 font-bold text-sm active:scale-[0.98] group shrink-0"
        >
          <Plus className="w-5 h-5 mr-1.5 transition-transform group-hover:rotate-90 duration-300" /> 
          {localIdt("បង្កើតការជូនដំណឹងថ្មី", "Create New Announcement")}
        </button>
      </div>

      {/* Main Container: Controls & Grid list */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Table Controls (Search & Filter) */}
        <div className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 w-full overflow-hidden">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mr-auto min-w-[200px]">
            <History className="w-5 h-5 text-sky-600" />
            {localIdt("ប្រវត្តិការផ្ញើសារជូនដំណឹង", "Messaging Delivery Audit Logs")}
          </h3>

          <div className="flex flex-row items-center gap-2 w-full lg:w-auto overflow-x-auto scrollbar-none pb-1">
            {/* Search input */}
            <div className="relative w-[180px] sm:w-52 h-9 flex items-center shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder={localIdt("ស្វែងរកសារ...", "Search records...")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-full pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 px-3 h-9 rounded-xl w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={filterTarget} 
                onChange={e => setFilterTarget(e.target.value)}
                className="bg-transparent border-none py-0 pl-1 pr-6 text-xs font-bold text-slate-700 focus:ring-0 focus:outline-none cursor-pointer h-full w-full"
              >
                <option value="ALL_TYPES">{localIdt("គោលដៅទាំងអស់", "All Recipients")}</option>
                <option value="BROADCAST">{localIdt("សិស្សទាំងអស់ (Broadcast)", "All Students")}</option>
                <option value="COURSE">{localIdt("តាមវគ្គសិក្សា", "Targeted Courses")}</option>
                <option value="STUDENT">{localIdt("សិស្សម្នាក់ៗ", "Individual Students")}</option>
              </select>
            </div>

            {/* Date Search/Filter */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 px-3 h-9 rounded-xl w-auto">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input 
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="bg-transparent border-none py-0 h-full text-xs font-bold text-slate-700 focus:ring-0 focus:outline-none cursor-pointer w-full"
                title={localIdt("ស្វែងរកតាមថ្ងៃខែឆ្នាំ", "Filter by Date")}
              />
              {filterDate && (
                <button 
                  onClick={() => setFilterDate('')} 
                  className="text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                  title={localIdt("សម្អាតថ្ងៃខែឆ្នាំ", "Clear Date")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data list view */}
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-extrabold">
                <th className="px-6 py-4 font-black">{localIdt("ចំណងជើង / ខ្លឹមសារ", "Broadcast Details")}</th>
                <th className="px-6 py-4 font-black">{localIdt("គោលដៅទទួល (Target)", "Recipient Target")}</th>
                <th className="px-6 py-4 font-black">{localIdt("កាលបរិច្ឆេទផ្ញើ", "Date Sent")}</th>
                <th className="px-6 py-4 text-right font-black">{localIdt("សកម្មភាព", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-9 h-9 border-3 border-sky-100 border-t-sky-500 rounded-full animate-spin mb-3"></div>
                      <span className="text-xs font-bold text-slate-500">{localIdt("កំពុងទាញយកទិន្នន័យ...", "Fetching system logs...")}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-sky-50 text-sky-400 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="w-7 h-7" />
                      </div>
                      <h4 className="text-slate-800 font-extrabold text-base mb-1">
                        {searchQuery || filterTarget !== 'ALL_TYPES' || filterDate 
                          ? localIdt("រកមិនឃើញលទ្ធផលស្វែងរក", "No matching logs found")
                          : localIdt("មិនទាន់មានប្រវត្តិការផ្ញើសារឡើយ", "No messaging history yet")}
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        {searchQuery || filterTarget !== 'ALL_TYPES' || filterDate
                          ? localIdt("សូមសាកល្បងស្វែងរកជាមួយពាក្យគន្លឹះផ្សេងទៀត ឬផ្លាស់ប្តូរតម្រង។", "Try adjusting your search terms or filtering constraints.")
                          : localIdt("ចាប់ផ្តើមបង្កើតសារជូនដំណឹងដំបូងរបស់អ្នក ហើយផ្ញើវាទៅកាន់ Telegram Channel សាលា។", "Launch your first announcement to students, group members or individual targets.")}
                      </p>
                      <button 
                        onClick={() => setIsAddDialogOpen(true)} 
                        className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> {localIdt("បង្កើតការជូនដំណឹងថ្មី", "Create New Announcement")}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((ann) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    key={ann.id} 
                    onClick={() => setSelectedAnnouncement(ann)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    {/* Title & Body content */}
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-slate-800 truncate group-hover:text-sky-600 transition-colors">{ann.title}</span>
                            {new Date(ann.sentAt) > new Date() && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-wider">
                                <Clock className="w-2.5 h-2.5 animate-spin-slow" />
                                {localIdt("គ្រោងទុក", "Scheduled")}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-medium line-clamp-1 mt-1">{ann.content}</span>
                        </div>
                      </div>
                    </td>

                    {/* Target info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs">
                        {ann.target === 'ALL' ? (
                          <>
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            {localIdt('សិស្សទាំងអស់', 'All Students')}
                          </>
                        ) : ann.target.startsWith('STUDENT_') ? (
                          <>
                            <User className="w-3.5 h-3.5 text-blue-500" />
                            {(() => {
                              const sId = ann.target.replace('STUDENT_', '');
                              const foundStudent = students.find(s => String(s.id) === sId);
                              return foundStudent 
                                ? `${currentLang === 'kh' ? foundStudent.nameKh : foundStudent.nameEn} (${foundStudent.studentId})`
                                : localIdt("សិស្សម្នាក់ៗ", "Individual Student");
                            })()}
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                            {courses.find(c => c.id === ann.target)?.title || ann.target}
                          </>
                        )}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(ann.sentAt).toLocaleString('km-KH', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </td>

                    {/* Delete action button */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={isDeletingId === ann.id}
                          onClick={(e) => handleDelete(ann.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title={localIdt("លុប", "Delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Creator Modal */}
      <AnimatePresence>
        {isAddDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsTargetDropdownOpen(false);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-slate-50 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200/50 relative z-10 font-sans"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl shrink-0">
                    <Megaphone className="w-6 h-6 text-sky-600 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
                      {localIdt("ផ្ញើសារជូនដំណឹងថ្មី (Telegram Broadcast)", "Send New Announcement (Telegram Broadcast)")}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {localIdt("ផ្ញើសារទៅកាន់ Telegram Channel របស់សាលា និងទាក់ទងផ្ទាល់ទៅកាន់សិស្ស", "Distribute notifications across Telegram channels, student groups or personal chats")}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setIsTargetDropdownOpen(false);
                  }} 
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2-Column Core Layout */}
              <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                
                {/* Left Column: Form & Templates */}
                <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6 bg-white overflow-y-auto">
                  
                  {/* Recipient Target */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      {localIdt("គោលដៅទទួលសារ", "Recipient Target")} <span className="text-rose-500">*</span>
                    </label>
                    
                    <div className="relative" ref={targetDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsTargetDropdownOpen(!isTargetDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100/40 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-extrabold text-slate-800 transition-all text-left text-sm shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-extrabold shrink-0 border border-sky-100">
                            {formData.target === 'ALL' ? (
                              <Megaphone className="w-4 h-4 text-sky-600" />
                            ) : formData.target.startsWith('STUDENT_') ? (
                              <User className="w-4 h-4 text-amber-500" />
                            ) : (
                              <Users className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold leading-none mb-0.5">
                              {formData.target === 'ALL' ? localIdt("គោលដៅផ្សាយទូទៅ", "Global Broadcast") : formData.target.startsWith('STUDENT_') ? localIdt("ផ្ញើជូនសិស្សផ្ទាល់ខ្លួន", "Direct Student DM") : localIdt("ផ្ញើជូនក្រុមវគ្គសិក្សា", "Class Group Broadcast")}
                            </span>
                            <span className="text-slate-850 font-black truncate max-w-[280px] sm:max-w-md">
                              {selectedTargetLabel}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isTargetDropdownOpen ? 'rotate-180 text-sky-600' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isTargetDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.12 }}
                            className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[360px]"
                          >
                            <div className="p-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/80 sticky top-0 z-20">
                              <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                              <input
                                type="text"
                                placeholder={localIdt("ស្វែងរកគោលដៅ/វគ្គសិក្សា...", "Search targets/courses...")}
                                value={targetSearch}
                                onChange={e => setTargetSearch(e.target.value)}
                                className="w-full p-1 bg-transparent border-none outline-none focus:ring-0 text-xs font-bold text-slate-700 placeholder-slate-400"
                                autoFocus
                              />
                              {targetSearch && (
                                <button 
                                  type="button" 
                                  onClick={() => setTargetSearch('')}
                                  className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <div className="overflow-y-auto flex-1 max-h-[300px] divide-y divide-slate-100 bg-white">
                              {groupedTargets.totalCount === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-450 font-extrabold flex flex-col items-center justify-center gap-2">
                                  <div className="p-3 bg-slate-50 text-slate-400 rounded-full">
                                    <Search className="w-5 h-5" />
                                  </div>
                                  <span>{localIdt("រកមិនឃើញគោលដៅ ឬវគ្គសិក្សានោះទេ", "No targets or courses match your search")}</span>
                                </div>
                              ) : (
                                <>
                                  {/* Section 1: Global Broadcast */}
                                  {groupedTargets.global.length > 0 && (
                                    <div className="p-1">
                                      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-sky-600 flex items-center gap-1.5 select-none bg-sky-50/40 rounded-lg mb-1">
                                        <Megaphone className="w-3.5 h-3.5 text-sky-500" />
                                        <span>{localIdt("ផ្សព្វផ្សាយទូទៅ (Global Broadcast)", "Global Broadcast")}</span>
                                      </div>
                                      {groupedTargets.global.map(t => (
                                        <button
                                          key={t.id}
                                          type="button"
                                          onClick={() => {
                                            setFormData({ ...formData, target: t.id });
                                            setIsTargetDropdownOpen(false);
                                            setTargetSearch('');
                                          }}
                                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                                            formData.target === t.id 
                                              ? 'bg-sky-50 text-sky-800 font-extrabold shadow-inner' 
                                              : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
                                              <Users className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-xs truncate">{t.label}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full font-black">All</span>
                                            {formData.target === t.id && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {/* Section 2: Course / Class Groups */}
                                  {groupedTargets.courses.length > 0 && (
                                    <div className="p-1 border-t border-slate-100/60">
                                      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5 select-none bg-blue-50/40 rounded-lg mb-1">
                                        <Users className="w-3.5 h-3.5 text-blue-500" />
                                        <span>{localIdt("ផ្ញើតាមក្រុមវគ្គសិក្សា (Broadcast by Courses)", "Group & Class Broadcast")}</span>
                                      </div>
                                      <div className="grid grid-cols-1 gap-0.5">
                                        {groupedTargets.courses.map(t => (
                                          <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => {
                                              setFormData({ ...formData, target: t.id });
                                              setIsTargetDropdownOpen(false);
                                              setTargetSearch('');
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                                              formData.target === t.id 
                                                ? 'bg-blue-50/80 text-blue-800 font-extrabold shadow-inner' 
                                                : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
                                                <MessageSquare className="w-3 h-3" />
                                              </div>
                                              <span className="text-xs truncate">{t.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[9px] bg-blue-100/80 text-blue-700 border border-blue-100/50 px-2 py-0.5 rounded-full font-black">
                                                {t.studentCount} {localIdt("នាក់", "Students")}
                                              </span>
                                              {formData.target === t.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Section 3: Individual Student direct message */}
                                  {groupedTargets.students.length > 0 && (
                                    <div className="p-1 border-t border-slate-100/60">
                                      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5 select-none bg-amber-50/40 rounded-lg mb-1">
                                        <User className="w-3.5 h-3.5 text-amber-500" />
                                        <span>{localIdt("ផ្ញើទៅសិស្សផ្ទាល់ខ្លួន (Individual Student DM)", "Individual Direct Message")}</span>
                                      </div>
                                      <div className="grid grid-cols-1 gap-0.5">
                                        {groupedTargets.students.map(t => (
                                          <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => {
                                              setFormData({ ...formData, target: t.id });
                                              setIsTargetDropdownOpen(false);
                                              setTargetSearch('');
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                                              formData.target === t.id 
                                                ? 'bg-amber-50/80 text-amber-800 font-extrabold shadow-inner' 
                                                : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-[10px] shrink-0 shadow-sm border border-amber-100/30">
                                                {t.label.charAt(0)}
                                              </div>
                                              <div className="flex flex-col min-w-0">
                                                <span className="text-xs truncate">{t.label}</span>
                                                <span className="text-[9px] font-medium text-slate-400 font-mono">ID: {t.studentId}</span>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                              {t.telegramConnected ? (
                                                <span className="inline-flex items-center gap-1 text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-full font-black">
                                                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                                                  Linked
                                                </span>
                                              ) : (
                                                <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full font-bold">
                                                  No Link
                                                </span>
                                              )}
                                              {formData.target === t.id && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Quick Templates selection */}
                  <div className="space-y-2">
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {localIdt("ប្រើប្រាស់គំរូសាររហ័ស", "Quick Templates Library")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TEMPLATES.map(tpl => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => applyTemplate(tpl)}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-50/70 hover:bg-sky-50/80 border border-slate-200/60 hover:border-sky-200 hover:text-sky-700 rounded-xl text-xs font-bold text-slate-700 transition-all hover:shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <span className="text-sm bg-white w-6 h-6 rounded-lg shadow-2xs flex items-center justify-center shrink-0">{tpl.icon}</span>
                          <span className="truncate">{currentLang === 'kh' ? tpl.nameKh : tpl.nameEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-slate-400" />
                      {localIdt("ចំណងជើងសារ", "Message Title")} <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      required 
                      type="text"
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      placeholder={localIdt("ឧ. ជូនដំណឹងឈប់សម្រាកបុណ្យចូលឆ្នាំ", "e.g., Khmer New Year Holiday Announcement")} 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 focus:bg-white font-bold text-slate-700 transition-all text-xs" 
                    />
                  </div>

                  {/* Message Content */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      {localIdt("ខ្លឹមសារសារ", "Message Content")} <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      required 
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})} 
                      placeholder={localIdt("សរសេរខ្លឹមសារដែលត្រូវផ្ញើទៅកាន់ Telegram របស់សិស្ស...", "Type your notice content here...")} 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 focus:bg-white font-bold text-slate-700 transition-all text-xs resize-none" 
                      rows={5}
                    />
                  </div>

                  {/* Google Translate Assistant */}
                  <div className="bg-blue-50/45 border border-blue-100 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                        <Languages className="w-4 h-4 text-blue-600" />
                        {localIdt("Google Translate ជំនួយការបកប្រែ", "Google Translate Assistant")}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-blue-900/70 leading-normal font-medium">
                      {localIdt(
                        "សរសេរចំណងជើង ឬខ្លឹមសារព្រាង រួចប្រើប្រាស់កម្មវិធី Google Translate ដើម្បីកែសម្រួលភាសា ឬបកប្រែជាពីរភាសារហ័ស។",
                        "Draft a title/content first, then use Google Translate to adjust language or translate between Khmer and English."
                      )}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        disabled={!formData.title && !formData.content}
                        onClick={() => handleGoogleTranslate('enhance')}
                        className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !formData.title && !formData.content
                            ? 'bg-slate-100 text-slate-400 border-slate-200/50 cursor-not-allowed'
                            : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300 hover:scale-[1.01]'
                        }`}
                      >
                        ✨ {localIdt("កែលម្អភាសា (Auto-Polish)", "Polish Language")}
                      </button>
                      <button
                        type="button"
                        disabled={!formData.title && !formData.content}
                        onClick={() => handleGoogleTranslate('translate_kh_to_en')}
                        className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !formData.title && !formData.content
                            ? 'bg-slate-100 text-slate-400 border-slate-200/50 cursor-not-allowed'
                            : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300 hover:scale-[1.01]'
                        }`}
                      >
                        🇬🇧 {localIdt("បកប្រែជាអង់គ្លេស", "Translate to EN")}
                      </button>
                      <button
                        type="button"
                        disabled={!formData.title && !formData.content}
                        onClick={() => handleGoogleTranslate('translate_en_to_kh')}
                        className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !formData.title && !formData.content
                            ? 'bg-slate-100 text-slate-400 border-slate-200/50 cursor-not-allowed'
                            : 'bg-white hover:bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-300 hover:scale-[1.01]'
                        }`}
                      >
                        🇰🇭 {localIdt("បកប្រែជាខ្មែរ", "Translate to KH")}
                      </button>
                    </div>

                    {aiError && (
                      <div className="text-[10.5px] text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-lg p-2 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{aiError}</span>
                      </div>
                    )}
                  </div>

                  {/* Schedule Broadcast Section */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer select-none">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-600" />
                        <div>
                          <span className="block text-xs font-black text-slate-700">
                            {localIdt("កំណត់ម៉ោងផ្សាយ (Schedule Broadcast)", "Schedule Broadcast")}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-medium">
                            {localIdt("រៀបចំទុកមុន និងផ្ញើដោយស្វ័យប្រវត្តទៅកាន់សិស្ស", "Draft ahead and broadcast at a later time.")}
                          </span>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isScheduled} 
                        onChange={e => setIsScheduled(e.target.checked)} 
                        className="w-4.5 h-4.5 text-sky-600 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
                      />
                    </label>

                    <AnimatePresence>
                      {isScheduled && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2">
                            <input 
                              type="datetime-local" 
                              required={isScheduled}
                              value={scheduledAt}
                              onChange={e => setScheduledAt(e.target.value)}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-bold text-slate-700 text-xs" 
                            />
                            <p className="text-[9.5px] text-slate-400 mt-1.5 font-bold flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              {localIdt("ការផ្សព្វផ្សាយនឹងត្រូវរក្សាទុកជា 'គ្រោងទុក' ហើយផ្ញើចេញនៅកាលបរិច្ឆេទនេះ។", "The announcement will be saved as 'Scheduled' and sent out on this date.")}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Information Warning */}
                  <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex gap-3 items-start">
                    <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-sky-800 leading-relaxed font-bold">
                      {formData.target.startsWith('STUDENT_') 
                        ? localIdt("សារនេះនឹងត្រូវបានផ្ញើជាសារផ្ទាល់ទៅកាន់សិស្ស និងអាណាព្យាបាលតាមរយៈ Telegram។", "This message will be sent as a direct private message to the student and their guardian via Telegram.")
                        : localIdt("សារនេះនឹងត្រូវបានផ្សព្វផ្សាយទៅកាន់ប្រព័ន្ធ Telegram Broadcast Channel របស់សាលា និងទាក់ទងដោយស្វ័យប្រវត្តទៅកាន់សិស្ស និង អាណាព្យាបាល។", "This message will be sent to the school's Telegram Broadcast Channel and automatically shared with students and guardians.")}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white z-10">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setIsTargetDropdownOpen(false);
                        setIsScheduled(false);
                        setScheduledAt('');
                      }} 
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-colors active:scale-[0.98]"
                      disabled={isSending}
                    >
                      {localIdt("បោះបង់", "Cancel")}
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSending || !formData.title || !formData.content}
                      className={`flex items-center justify-center px-6 py-2.5 font-extrabold rounded-xl text-xs shadow-md transition-all active:scale-[0.98] ${
                        isSending || !formData.title || !formData.content
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                          : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/10'
                      }`}
                    >
                      {isSending ? (
                        <span className="flex items-center"><div className="w-3 h-3 mr-1.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> {localIdt("កំពុងរក្សាទុក...", "Saving...")}</span>
                      ) : isScheduled ? (
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {localIdt("គ្រោងការផ្សាយទុក", "Schedule Broadcast")}</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> {localIdt("ផ្ញើសារឥឡូវនេះ", "Send Message Now")}</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Right Column: Premium Telegram Preview (Samsung Galaxy S27 Ultra Frame) */}
                <div className="hidden lg:flex w-[380px] border-l border-slate-200 bg-slate-100 p-6 flex-col items-center justify-center select-none shrink-0">
                  {/* Outer phone container showing premium Titanium finish and narrow symmetrical bezels */}
                  <div className="w-full max-w-[285px] bg-[#0c0f17] text-white rounded-[38px] p-[5px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.3)] border-2 border-slate-700/50 ring-4 ring-slate-900/90 relative aspect-[9/19.2] flex flex-col overflow-hidden">
                    
                    {/* Metallic glare effect on the bezel */}
                    <div className="absolute inset-0 rounded-[33px] border border-white/5 pointer-events-none z-40"></div>

                    {/* Samsung Infinity-O Camera Punch-hole Cutout */}
                    <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black rounded-full z-40 shadow-inner ring-1 ring-white/10"></div>

                    {/* Samsung Status Bar */}
                    <div className="bg-[#1e88e5] text-white/95 pt-1.5 pb-0.5 px-4 flex justify-between items-center text-[8px] font-black tracking-tight shrink-0 select-none z-30">
                      <span>09:41</span>
                      <div className="flex items-center gap-1">
                        <span>5G</span>
                        <div className="flex gap-[1px] items-end h-1.5">
                          <span className="w-[1px] h-0.5 bg-white rounded-full"></span>
                          <span className="w-[1px] h-1 bg-white rounded-full"></span>
                          <span className="w-[1px] h-1.5 bg-white rounded-full"></span>
                        </div>
                        <div className="flex items-center gap-[1px]">
                          <span className="text-[7.5px] font-black">98%</span>
                          <div className="w-3.5 h-1.5 border border-white/80 rounded-[3px] p-[0.5px] flex items-center">
                            <div className="w-full h-full bg-emerald-400 rounded-[1px]"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Telegram App Header Mock */}
                    <div className="bg-[#1e88e5] text-white pt-2 pb-2.5 px-3 flex items-center gap-2 text-[10px] shrink-0 font-bold shadow-xs">
                      <div className="w-6.5 h-6.5 rounded-full bg-sky-500 flex items-center justify-center text-[9px] font-black shrink-0 border border-white/20 shadow-xs">PLC</div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-black truncate flex items-center gap-0.5 text-[10px]">
                          PLC Computer School
                          <CheckCircle2 className="w-2.5 h-2.5 text-white fill-white inline shrink-0" />
                        </span>
                        <span className="text-[7px] text-sky-100 font-semibold flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                          broadcast bot
                        </span>
                      </div>
                    </div>

                    {/* Chat Background with premium Telegram paper theme style */}
                    <div className="flex-1 p-3 bg-[#eef2f5] overflow-y-auto flex flex-col justify-end space-y-2 relative">
                      {/* Grid wallpaper lines style */}
                      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#2c3e50_1.5px,transparent_1.5px)] [background-size:14px_14px]"></div>

                      {/* Dynamic Telegram Bubble */}
                      <div className="max-w-[88%] bg-white rounded-2xl rounded-tl-sm p-3 shadow-[0_2px_4px_rgba(15,23,42,0.06)] text-slate-800 relative z-10 text-[9.5px] leading-relaxed self-start border border-slate-100">
                        {/* Title (Bold) */}
                        <div className="font-extrabold text-slate-900 mb-1.5 leading-snug text-[10px]">
                          {formData.title || localIdt("📢 ដំណឹងអំពីការឈប់សម្រាក...", "📢 Holiday Announcement...")}
                        </div>
                        {/* Body */}
                        <div className="whitespace-pre-wrap text-slate-700 leading-normal font-medium">
                          {formData.content || localIdt("សរសេរខ្លឹមសាររបស់អ្នកនៅក្នុងទម្រង់បែបបទ ដើម្បីមើលការផ្សាយផ្ទាល់នៅទីនេះ...", "Your announcement content will render in real-time within this simulation bubble...")}
                        </div>
                        {/* Signature */}
                        <div className="mt-2.5 pt-1.5 border-t border-slate-100 text-[7.5px] text-slate-400 font-bold flex justify-between items-center">
                          <span>🎓 PLC Computer School</span>
                          <span className="flex items-center gap-0.5">
                            11:42 AM
                            <span className="text-sky-500 font-black text-[9px] ml-0.5 leading-none">✓✓</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Telegram Bottom Channel Bar */}
                    <div className="bg-white border-t border-slate-100 px-3 py-2 flex items-center justify-between text-[8px] text-sky-600 font-black shrink-0">
                      <span className="uppercase tracking-wider hover:bg-slate-50 px-2 py-1 rounded transition-colors cursor-pointer">{localIdt("បិទសំឡេង", "Mute")}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      <span className="uppercase tracking-wider hover:bg-slate-50 px-2 py-1 rounded transition-colors cursor-pointer">{localIdt("ពិភាក្សា", "Discuss")}</span>
                    </div>

                    {/* S27 Gesture Navigation pill */}
                    <div className="py-1.5 bg-white shrink-0 flex items-center justify-center border-t border-slate-50">
                      <div className="w-16 h-1 bg-slate-300 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full uppercase tracking-wider border border-slate-300/30">
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      {localIdt("ទិដ្ឋភាព Samsung Galaxy S27 Ultra", "Samsung Galaxy S27 Ultra View")}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Viewer Slide-over or Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-[4px]"
              onClick={() => setSelectedAnnouncement(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="bg-white rounded-[32px] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4)] max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 relative z-10 font-sans"
            >


              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/85 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl shadow-inner border border-sky-100/50">
                    <MessageSquare className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 leading-snug">
                      {localIdt("ព័ត៌មានលម្អិតនៃសារជូនដំណឹង", "Announcement Log Details")}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase mt-0.5">
                      ID: <span className="font-mono text-[10px] lowercase text-slate-500">{selectedAnnouncement.id}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all active:scale-95 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Two Column Layout: Left (Info/Table), Right (S27 Samsung Device Render) */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                
                {/* Left Column (Info / Metadata / Delivery Log) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col">
                  
                  {/* Meta details cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Recipient Target Card */}
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{localIdt("គោលដៅទទួលសារ", "Recipient Target")}</span>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                        {selectedAnnouncement.target === 'ALL' ? (
                          <>
                            <Users className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>{localIdt('សិស្សទាំងអស់', 'All Students')}</span>
                          </>
                        ) : selectedAnnouncement.target.startsWith('STUDENT_') ? (
                          <>
                            <User className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="truncate">
                              {(() => {
                                const sId = selectedAnnouncement.target.replace('STUDENT_', '');
                                const foundStudent = students.find(s => String(s.id) === sId);
                                return foundStudent 
                                  ? `${currentLang === 'kh' ? foundStudent.nameKh : foundStudent.nameEn} (${foundStudent.studentId})`
                                  : localIdt("សិស្សម្នាក់ៗ", "Individual Student");
                              })()}
                            </span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4 text-sky-500 shrink-0" />
                            <span>{courses.find(c => c.id === selectedAnnouncement.target)?.title || selectedAnnouncement.target}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Sent Date Card */}
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{localIdt("កាលបរិច្ឆេទផ្ញើចេញ", "Delivery Date")}</span>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                        <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{new Date(selectedAnnouncement.sentAt).toLocaleString('km-KH', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Target Recipients & Delivery Audit Log */}
                  <div className="space-y-2 flex-1 flex flex-col min-h-[250px]">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      {localIdt("ស្ថានភាពការបញ្ជូនសារទៅកាន់សិស្ស (Delivery Audit Log)", "Recipient Delivery Audit Log")}
                    </span>
                    
                    <div className="border border-slate-100 rounded-2xl overflow-hidden flex-1 overflow-x-auto overflow-y-auto bg-white/50 max-h-[300px]">
                      <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider sticky top-0 z-10">
                            <th className="px-4 py-3">{localIdt("ឈ្មោះសិស្ស", "Student Name")}</th>
                            <th className="px-4 py-3">{localIdt("វគ្គសិក្សា", "Course")}</th>
                            <th className="px-4 py-3">{localIdt("គណនី Telegram", "Telegram Link")}</th>
                            <th className="px-4 py-3 text-right">{localIdt("ស្ថានភាព", "Status")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {(() => {
                            const target = selectedAnnouncement.target;
                            const matchingStudents = students.filter(s => {
                              if (s.status !== 'STUDYING') return false;
                              if (target === 'ALL') return true;
                              if (target.startsWith('STUDENT_')) {
                                return String(s.id) === target.replace('STUDENT_', '');
                              }
                              const courseTitle = courses.find(c => c.id === target)?.title;
                              return s.course === courseTitle || s.level === courseTitle;
                            });

                            if (matchingStudents.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={4} className="text-center py-8 text-slate-400 font-bold">
                                    {localIdt("មិនមានសិស្សក្នុងក្រុមគោលដៅនេះទេ", "No students found in target group.")}
                                  </td>
                                </tr>
                              );
                            }

                            return matchingStudents.map(s => {
                              const isConnected = !!s.telegramConnected;
                              const isScheduledFuture = new Date(selectedAnnouncement.sentAt) > new Date();
                              
                              return (
                                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3 font-bold text-slate-800">
                                    {currentLang === 'kh' ? (s.nameKh || `${s.firstNameKh} ${s.lastNameKh}`) : (s.nameEn || `${s.firstNameEn} ${s.lastNameEn}`)}
                                  </td>
                                  <td className="px-4 py-3 text-slate-500 text-[11px] font-semibold">{s.course || s.level || 'Computer'}</td>
                                  <td className="px-4 py-3">
                                    {isConnected ? (
                                      <span className="text-sky-600 font-bold inline-flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded-full text-[10px]">
                                        <span className="w-1 h-1 rounded-full bg-sky-500 animate-pulse"></span>
                                        @Connected
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 text-[11px]">Not Linked</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {isScheduledFuture ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-100">
                                        {localIdt("គ្រោងទុក", "Pending")}
                                      </span>
                                    ) : isConnected ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-100">
                                        <Check className="w-3 h-3" />
                                        {localIdt("បានផ្ញើ", "Delivered")}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full font-bold border border-slate-200">
                                        {localIdt("គ្មានគណនី", "No Link")}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => setDeleteIdToConfirm(selectedAnnouncement.id)}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50/80 rounded-xl text-xs font-black transition-all cursor-pointer hover:shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                      {localIdt("លុបសារនេះ", "Delete Announcement")}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSelectedAnnouncement(null)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      {localIdt("បិទ", "Close")}
                    </button>
                  </div>

                </div>

                {/* Right Column (Gorgeous Samsung Galaxy S27 Ultra Telegram mock) */}
                <div className="hidden lg:flex w-[320px] bg-slate-100/70 border-l border-slate-200/60 p-6 flex-col items-center justify-center shrink-0 select-none">
                  <div className="w-full max-w-[245px] bg-[#0c0f17] text-white rounded-[34px] p-[4px] shadow-[0_20px_50px_-10px_rgba(15,23,42,0.25)] border border-slate-700/40 ring-4 ring-slate-900/90 relative aspect-[9/19.2] flex flex-col overflow-hidden">
                    
                    {/* Metallic glare effect on the bezel */}
                    <div className="absolute inset-0 rounded-[30px] border border-white/5 pointer-events-none z-40"></div>

                    {/* Samsung Infinity-O Camera Punch-hole Cutout */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full z-40 shadow-inner ring-1 ring-white/10"></div>

                    {/* Samsung Status Bar */}
                    <div className="bg-[#1e88e5] text-white/95 pt-1.5 pb-0.5 px-3 flex justify-between items-center text-[7px] font-black tracking-tight shrink-0 select-none z-30">
                      <span>09:41</span>
                      <div className="flex items-center gap-0.5">
                        <span>5G</span>
                        <div className="flex gap-[0.5px] items-end h-1">
                          <span className="w-[1px] h-0.5 bg-white rounded-full"></span>
                          <span className="w-[1px] h-1 bg-white rounded-full"></span>
                          <span className="w-[1px] h-1.5 bg-white rounded-full"></span>
                        </div>
                        <div className="flex items-center gap-[0.5px]">
                          <span className="text-[6.5px] font-black">98%</span>
                          <div className="w-2.5 h-1 border border-white/80 rounded-[2px] p-[0.5px] flex items-center">
                            <div className="w-full h-full bg-emerald-400 rounded-[0.5px]"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Telegram App Header Mock */}
                    <div className="bg-[#1e88e5] text-white pt-1 pb-1.5 px-2 flex items-center gap-1.5 text-[8.5px] shrink-0 font-bold shadow-xs">
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-[7px] font-black shrink-0 border border-white/10 shadow-xs">PLC</div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-black truncate flex items-center gap-0.5 text-[8px]">
                          PLC Computer School
                          <CheckCircle2 className="w-2 h-2 text-white fill-white inline shrink-0" />
                        </span>
                        <span className="text-[5.5px] text-sky-100 font-semibold flex items-center gap-0.5">
                          <span className="w-0.5 h-0.5 rounded-full bg-emerald-400"></span>
                          broadcast bot
                        </span>
                      </div>
                    </div>

                    {/* Chat Background with premium Telegram paper theme style */}
                    <div className="flex-1 p-2 bg-[#eef2f5] overflow-y-auto flex flex-col justify-end space-y-1.5 relative">
                      {/* Grid wallpaper lines style */}
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#2c3e50_1px,transparent_1px)] [background-size:10px_10px]"></div>

                      {/* Dynamic Telegram Bubble */}
                      <div className="max-w-[90%] bg-white rounded-xl rounded-tl-sm p-2 shadow-[0_1.5px_3px_rgba(15,23,42,0.05)] text-slate-800 relative z-10 text-[8px] leading-relaxed self-start border border-slate-100">
                        {/* Title (Bold) */}
                        <div className="font-black text-slate-900 mb-1 leading-snug text-[8.5px]">
                          {selectedAnnouncement.title}
                        </div>
                        {/* Body */}
                        <div className="whitespace-pre-wrap text-slate-700 leading-normal font-medium max-h-[120px] overflow-y-auto text-[7.5px]">
                          {selectedAnnouncement.content}
                        </div>
                        {/* Signature */}
                        <div className="mt-2 pt-1 border-t border-slate-100 text-[6px] text-slate-400 font-bold flex justify-between items-center">
                          <span>🎓 PLC Computer School</span>
                          <span className="flex items-center gap-0.5">
                            {new Date(selectedAnnouncement.sentAt).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}
                            <span className="text-sky-500 font-black text-[7.5px] ml-0.5 leading-none">✓✓</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Telegram Bottom Channel Bar */}
                    <div className="bg-white border-t border-slate-100 px-2 py-1 flex items-center justify-between text-[6.5px] text-sky-600 font-black shrink-0">
                      <span className="uppercase tracking-wider hover:bg-slate-50 px-1 py-0.5 rounded transition-colors cursor-pointer">{localIdt("បិទសំឡេង", "Mute")}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <span className="uppercase tracking-wider hover:bg-slate-50 px-1 py-0.5 rounded transition-colors cursor-pointer">{localIdt("ពិភាក្សា", "Discuss")}</span>
                    </div>

                    {/* S27 Gesture Navigation pill */}
                    <div className="py-1 bg-white shrink-0 flex items-center justify-center border-t border-slate-50">
                      <div className="w-12 h-0.5 bg-slate-300 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-300/20">
                      <Smartphone className="w-2.5 h-2.5 text-slate-500" />
                      {localIdt("ទិដ្ឋភាពទូរស័ព្ទ S27 Ultra", "Samsung Galaxy S27 Ultra")}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteIdToConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px]"
              onClick={() => setDeleteIdToConfirm(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-3xl p-7 max-w-sm w-full text-center space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 relative z-50 font-sans"
            >
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-slate-800">
                  {localIdt("តើអ្នកពិតជាចង់លុបមែនទេ?", "Confirm Deletion?")}
                </h4>
                <p className="text-xs text-slate-400 font-extrabold leading-normal">
                  {localIdt("សកម្មភាពនេះនឹងលុបសារជូនដំណឹងនេះជាអចិន្ត្រៃយ៍ ចេញពីប្រព័ន្ធ និង Telegram Bot។", "This action will permanently delete this announcement from the system and Telegram Bot history.")}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteIdToConfirm(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all cursor-pointer active:scale-98"
                >
                  {localIdt("បោះបង់", "Cancel")}
                </button>
                <button
                  type="button"
                  disabled={isDeletingId === deleteIdToConfirm}
                  onClick={() => handleDelete(deleteIdToConfirm, undefined, true)}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-rose-200 active:scale-98"
                >
                  {isDeletingId === deleteIdToConfirm ? localIdt("កំពុងលុប...", "Deleting...") : localIdt("លុបចោល", "Delete Now")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
