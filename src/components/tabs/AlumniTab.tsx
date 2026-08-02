import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, GraduationCap, Phone, BookOpen, Calendar, MapPin, User, Mail, MessageCircle, ExternalLink, X } from 'lucide-react';

export default function AlumniTab({ students, uiLang }: any) {
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

  const idt = (kh: string, en?: string, zh?: string) => {
    if (localLang === "en") return en || kh;
    if (localLang === "zh") return zh || en || kh;
    return kh;
  };

  const [search, setSearch] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use actual data from students marked as 'COMPLETED'
  const alumniList = students.filter((s: any) => s.status === "COMPLETED");

  const openAlumniDetails = (alumni: any) => {
    setSelectedAlumni(alumni);
    setIsModalOpen(true);
  };

  const getYearFromDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div className="w-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 flex items-center gap-2.5">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <GraduationCap className="w-5 h-5" />
              </div>
              {idt("អតីតសិស្ស (Alumni Management)", "Alumni Management", "校友管理")}
            </h2>
            <p className="text-xs sm:text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {idt("រក្សាទុកនិងតាមដានទិន្នន័យសិស្សដែលបានបញ្ចប់ការសិក្សា", "Track and manage graduated students data", "跟踪和管理已毕业学生数据")}
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={idt("ស្វែងរកឈ្មោះអតីតសិស្ស...", "Search alumni...", "搜索校友...")}
              className="w-full md:w-72 pl-10 pr-4 py-2.5 border border-slate-200/80 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-3xs transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {alumniList.filter((s: any) => s.nameKh.includes(search) || s.nameEn?.toLowerCase().includes(search.toLowerCase()) || s.studentId?.toLowerCase().includes(search.toLowerCase())).map((alumni: any) => (
            <motion.div 
              key={alumni.id} 
              whileHover={{ y: -4, transition: { duration: 0.2 } }} 
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-3xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col relative overflow-hidden group cursor-pointer"
              onClick={() => openAlumniDetails(alumni)}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-lg shadow-sm">
                    {alumni.nameEn?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-[15px] leading-tight group-hover:text-blue-600 transition-colors">{alumni.nameKh}</h3>
                    <p className="text-[12px] font-bold text-slate-400 mt-0.5 tracking-wide">{alumni.nameEn || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2.5 text-[12px]">
                  <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                    <BookOpen className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-slate-600 truncate">{alumni.course || 'General Course'}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                      <Calendar className="w-3 h-3" />
                    </div>
                    <span className="font-bold text-slate-600">
                      {idt("បញ្ចប់ការសិក្សាឆ្នាំ ", "Class of ", "毕业年份 ")}{getYearFromDate(alumni.endDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-medium">{alumni.guardianPhone || "N/A"}</span>
                  </div>
                  {alumni.telegramConnected && (
                    <div className="flex items-center gap-1 text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                      <MessageCircle className="w-3 h-3" /> Telegram
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md tracking-wider border border-slate-200/60 uppercase">
                  {alumni.studentId || alumni.id.substring(0,6)}
                </span>
                <span className="text-blue-600 text-[11px] font-bold group-hover:underline flex items-center gap-1">
                  {idt("មើលព័ត៌មានលម្អិត", "View Details", "查看详情")} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
          
          {alumniList.filter((s: any) => s.nameKh.includes(search) || s.nameEn?.toLowerCase().includes(search.toLowerCase()) || s.studentId?.toLowerCase().includes(search.toLowerCase())).length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
              <Search className="w-12 h-12 text-slate-200 mb-3" />
              <p className="font-bold text-sm">{idt("មិនមានទិន្នន័យអតីតសិស្សទេ", "No alumni found matching your search", "未找到符合条件的校友")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Alumni Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAlumni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 flex flex-col">
                {/* Header Section */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-extrabold text-2xl shrink-0">
                      {selectedAlumni.nameEn?.[0]?.toUpperCase() || "S"}
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50/50 text-blue-600 border border-blue-100/50 uppercase tracking-widest mb-1">
                        {idt("អតីតសិស្ស", "ALUMNI", "校友")}
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">{selectedAlumni.nameKh}</h2>
                      <p className="text-slate-400 font-semibold text-xs mt-0.5">
                        {selectedAlumni.nameEn} <span className="text-slate-200 mx-1">•</span> {selectedAlumni.studentId || selectedAlumni.id.substring(0,6)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-90 cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Academic History Section */}
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      {idt("ប្រវត្តិសិក្សា", "Academic History", "学术历史")}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
                            {idt("វគ្គសិក្សាដែលបានបញ្ចប់", "Course Completed", "已完结课程")}
                          </span>
                          <span className="text-[13px] font-semibold text-slate-800 block mt-1.5 leading-snug">
                            {selectedAlumni.course || 'General Course'}
                            <span className="text-xs text-slate-500 block mt-0.5 font-medium">({selectedAlumni.level})</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
                            {idt("កាលបរិច្ឆេទបញ្ចប់ការសិក្សា", "Graduation Date", "毕业日期")}
                          </span>
                          <span className="text-[13px] font-semibold text-slate-800 block mt-1.5">
                            {selectedAlumni.endDate ? new Date(selectedAlumni.endDate).toLocaleDateString('en-GB') : "10/05/2026"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      {idt("ព័ត៌មានទំនាក់ទំនង", "Contact Information", "联系信息")}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className="flex items-start gap-3">
                        <Phone className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
                            {idt("លេខទូរស័ព្ទ", "Phone Number", "电话号码")}
                          </span>
                          <span className="text-[13px] font-semibold text-slate-800 block mt-1.5">
                            {selectedAlumni.guardianPhone || selectedAlumni.phone || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
                            {idt("ស្ថានភាព Telegram", "Telegram Status", "电报状态")}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`text-[13px] font-semibold ${selectedAlumni.telegramConnected ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                              {selectedAlumni.telegramConnected ? idt("បានភ្ជាប់", "Connected", "已连接") : idt("មិនទាន់ភ្ជាប់", "Not Connected", "未连接")}
                            </span>
                            {selectedAlumni.telegramConnected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {idt("បិទ", "Close", "关闭")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

