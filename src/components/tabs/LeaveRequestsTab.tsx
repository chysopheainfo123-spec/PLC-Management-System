import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Check, X, CalendarRange, Clock, User, Filter, 
  Search, ChevronDown, Briefcase, Stethoscope, AlignLeft, 
  Calendar, CalendarDays, AlertCircle, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';

interface LeaveRequestsTabProps {
  uiLang?: string;
}

export default function LeaveRequestsTab({ uiLang }: LeaveRequestsTabProps) {
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

  const localIdt = (kh: string, en?: string) => {
    if (localLang === "en") return en || kh;
    return kh;
  };

  const [requests, setRequests] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    teacherId: '',
    type: 'SICK',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [teacherSearch, setTeacherSearch] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const teacherDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setIsTeacherDropdownOpen(false);
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
      const [requestsRes, teachersRes] = await Promise.all([
        fetch('/api/leave-requests', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => ({ data })),
        fetch('/api/teachers', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => ({ data }))
      ]);
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
      const teachersList = teachersRes.data && Array.isArray(teachersRes.data.teachers) ? teachersRes.data.teachers : (Array.isArray(teachersRes.data) ? teachersRes.data : []);
      setTeachers(teachersList);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const isDateError = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return false;
    return new Date(formData.endDate) < new Date(formData.startDate);
  }, [formData.startDate, formData.endDate]);

  const totalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate || isDateError) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [formData.startDate, formData.endDate, isDateError]);

  const filteredTeachers = useMemo(() => {
    const searchLower = teacherSearch.toLowerCase();
    return teachers.filter(t => {
      // Exclude resigned or inactive teachers
      if (t.status === 'EXITED' || t.status === 'STOP' || t.status === 'RESIGNED') return false;
      const nameKh = (t.nameKh || '').toLowerCase();
      const nameEn = (t.nameEn || '').toLowerCase();
      const teacherId = (t.teacherId || '').toLowerCase();
      return nameKh.includes(searchLower) || nameEn.includes(searchLower) || teacherId.includes(searchLower);
    });
  }, [teachers, teacherSearch]);

  const selectedTeacher = useMemo(() => {
    return teachers.find(t => t.id === formData.teacherId);
  }, [teachers, formData.teacherId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherId || !formData.startDate || !formData.endDate || isDateError) {
      return;
    }
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const submissionData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };
      await fetch('/api/leave-requests', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        }, 
        body: JSON.stringify(submissionData) 
      });
      setIsAddDialogOpen(false);
      setFormData({ teacherId: '', type: 'SICK', startDate: '', endDate: '', reason: '' });
      fetchData();
    } catch (error) {
      console.error("Failed to submit request", error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/leave-requests/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      fetchData();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'text-amber-600';
      case 'APPROVED': return 'text-emerald-600';
      case 'REJECTED': return 'text-rose-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'PENDING': return localIdt('រង់ចាំការអនុម័ត', 'Pending Approval');
      case 'APPROVED': return localIdt('បានអនុម័ត', 'Approved');
      case 'REJECTED': return localIdt('បដិសេធ', 'Rejected');
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'SICK' ? localIdt('ឈប់សម្រាកឈឺ', 'Sick Leave') : localIdt('ធុរៈផ្ទាល់ខ្លួន', 'Personal Leave');
  };

  const leaveTypes = [
    { value: 'SICK', labelKh: 'ឈប់សម្រាកឈឺ (Sick Leave)', labelEn: 'Sick Leave', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { value: 'PERSONAL', labelKh: 'ធុរៈផ្ទាល់ខ្លួន (Personal Leave)', labelEn: 'Personal Leave', icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-100' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 font-sans">{localIdt("ការស្នើសុំច្បាប់ឈប់សម្រាក", "Leave Requests")}</h2>
          <p className="text-xs sm:text-xs text-slate-500 mt-1">{localIdt("គ្រប់គ្រង និងត្រួតពិនិត្យការសុំច្បាប់របស់បុគ្គលិក និងគ្រូបង្រៀន", "Manage and review leave requests of staff and teachers")}</p>
        </div>
        <button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 font-bold text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> {localIdt("ស្នើសុំច្បាប់ថ្មី", "Request New Leave")}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0 relative">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CalendarRange className="w-5 h-5" />
            </div>
             {localIdt("បញ្ជីការស្នើសុំ", "Request List")}
          </h3>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-auto border-t border-slate-100 scrollbar-none">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-left text-sm text-slate-600">
              <tr>
                <th className="px-6 py-4 font-bold">{localIdt("អ្នកស្នើសុំ (បុគ្គលិក/គ្រូ)", "Applicant (Staff/Teacher)")}</th>
                <th className="px-6 py-4 font-bold">{localIdt("ប្រភេទច្បាប់", "Leave Type")}</th>
                <th className="px-6 py-4 font-bold">{localIdt("កាលបរិច្ឆេទ", "Dates")}</th>
                <th className="px-6 py-4 font-bold">{localIdt("មូលហេតុ", "Reason")}</th>
                <th className="px-6 py-4 font-bold text-center">{localIdt("ស្ថានភាព", "Status")}</th>
                <th className="px-6 py-4 font-bold text-right">{localIdt("អនុម័ត/បដិសេធ", "Approve/Reject")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                      {localIdt("កំពុងទាញយកទិន្នន័យ...", "Loading data...")}
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 font-medium">{localIdt("មិនមានសំណើទេ", "No requests found")}</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    key={req.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">
                           {req.teacher ? (req.teacher.nameKh || req.teacher.nameEn) : req.user?.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs">{getTypeLabel(req.type)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate font-medium">{req.reason}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold ${getStatusColor(req.status)}`}>
                        {getStatusLabel(req.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleUpdateStatus(req.id, 'APPROVED')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors" title={localIdt("អនុម័ត", "Approve")}>
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleUpdateStatus(req.id, 'REJECTED')} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-lg transition-colors" title={localIdt("បដិសេធ", "Reject")}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm font-medium">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                setIsTeacherDropdownOpen(false);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 relative z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {localIdt("បំពេញទម្រង់ស្នើសុំច្បាប់ឈប់សម្រាក", "Leave Request Form")}
                    </h2>
                    <p className="text-xs text-slate-400 font-bold tracking-wider mt-0.5 uppercase">
                      {localIdt("បង្កើតសំណើសុំច្បាប់ថ្មី", "Create New Request")}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setIsTeacherDropdownOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* 1. Teacher selection */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {localIdt("បុគ្គលិក/គ្រូបង្រៀន", "Staff/Teacher")} <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="relative" ref={teacherDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xs">
                          {selectedTeacher ? (
                            <span>{(selectedTeacher.nameKh || selectedTeacher.nameEn || '?')[0]}</span>
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <span className={selectedTeacher ? "text-slate-800 font-bold text-sm" : "text-slate-400 text-sm"}>
                          {selectedTeacher ? (selectedTeacher.nameKh || selectedTeacher.nameEn) : localIdt("ជ្រើសរើសអ្នកស្នើសុំ", "Select Applicant")}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isTeacherDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isTeacherDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-60"
                        >
                          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            <input
                              type="text"
                              placeholder={localIdt("ស្វែងរកឈ្មោះ ឬអត្តលេខ...", "Search name or ID...")}
                              value={teacherSearch}
                              onChange={e => setTeacherSearch(e.target.value)}
                              className="w-full p-1.5 bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-slate-700 placeholder-slate-400"
                              autoFocus
                            />
                            {teacherSearch && (
                              <button 
                                type="button" 
                                onClick={() => setTeacherSearch('')}
                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto flex-1 max-h-48 divide-y divide-slate-50">
                            {filteredTeachers.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 font-medium">{localIdt("រកមិនឃើញទិន្នន័យឡើយ", "No records found")}</div>
                            ) : (
                              filteredTeachers.map(t => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, teacherId: t.id });
                                    setIsTeacherDropdownOpen(false);
                                    setTeacherSearch('');
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50/40 transition-colors ${formData.teacherId === t.id ? 'bg-blue-50/60 font-bold' : ''}`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                    {(t.nameKh || t.nameEn || '?')[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-slate-800 truncate">{t.nameKh || t.nameEn}</div>
                                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono text-[9px] font-bold">{t.teacherId}</span>
                                      {t.specialty && <span className="truncate">• {t.specialty}</span>}
                                    </div>
                                  </div>
                                  {formData.teacherId === t.id && (
                                    <Check className="w-4 h-4 text-blue-600 font-black shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 2. Leave Type */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {localIdt("ប្រភេទច្បាប់", "Leave Type")} <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {leaveTypes.map(type => {
                      const IconComponent = type.icon;
                      const isSelected = formData.type === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                            isSelected 
                              ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-500' 
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className={`p-3 rounded-full mb-2 transition-all ${isSelected ? 'scale-110 bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className={`text-xs font-bold ${isSelected ? 'text-blue-950' : 'text-slate-700'}`}>
                            {type.labelKh}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {type.labelEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {localIdt("ចាប់ពីថ្ងៃ", "From Date")} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        required 
                        type="date" 
                        value={formData.startDate} 
                        onChange={e => setFormData({...formData, startDate: e.target.value})} 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 transition-all cursor-pointer text-sm" 
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {localIdt("ដល់ថ្ងៃ", "To Date")} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        required 
                        type="date" 
                        value={formData.endDate} 
                        onChange={e => setFormData({...formData, endDate: e.target.value})} 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 transition-all cursor-pointer text-sm" 
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Date Error / Range Notice */}
                {isDateError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-semibold"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{localIdt("ថ្ងៃបញ្ចប់មិនអាចមុនថ្ងៃចាប់ផ្តើមបានទេ! សូមពិនិត្យកាលបរិច្ឆេទឡើងវិញ។", "End date cannot be before start date! Please check the dates again.")}</span>
                  </motion.div>
                )}

                {totalDays > 0 && !isDateError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2.5 p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-bold"
                  >
                    <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{localIdt(`រយៈពេលសរុប៖ ${totalDays} ថ្ងៃ (គិតបញ្ចូលទាំងថ្ងៃចាប់ផ្តើម និងថ្ងៃបញ្ចប់)`, `Total duration: ${totalDays} days (including start and end dates)`)}</span>
                  </motion.div>
                )}

                {/* 4. Reason */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <AlignLeft className="w-4 h-4 text-slate-400" />
                    {localIdt("មូលហេតុបញ្ជាក់", "Reason")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea 
                      required 
                      value={formData.reason} 
                      onChange={e => setFormData({...formData, reason: e.target.value})} 
                      placeholder={localIdt("សូមបញ្ជាក់មូលហេតុនៃការសុំច្បាប់...", "Please state the reason for leave request...")} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 transition-all resize-none text-sm min-h-[90px]" 
                      rows={3}
                    />
                    <AlignLeft className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-1">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setIsTeacherDropdownOpen(false);
                    }} 
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors active:scale-[0.98]"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isDateError || !formData.teacherId}
                    className={`px-6 py-3 font-bold rounded-2xl text-sm shadow-lg transition-all active:scale-[0.98] ${
                      isDateError || !formData.teacherId 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10 hover:shadow-blue-600/20'
                    }`}
                  >
                    {localIdt("ដាក់ស្នើ", "Submit")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
