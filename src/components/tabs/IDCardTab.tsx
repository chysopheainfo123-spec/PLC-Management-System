import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import { Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Upload, Loader2, Camera, QrCode, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle } from 'lucide-react';

export default function IDCardTab(props: any) {
  const { activeTab, backCardRef, downloadIdCard, frontCardRef, handleImageUpload, handlePrefillStudent, handlePrefillTeacher, handleSaveIdCardBackgrounds, idCardAddress, idCardBackgroundBack, idCardBackgroundFront, idCardDob, idCardExpireDate, idCardField1, idCardField2, idCardField3, idCardField4, idCardGender, idCardIdNumber, idCardIssueDate, idCardNameEn, idCardNameKh, idCardPhone, idCardPhoto, idCardPrintSide, idCardRole, idCardSchoolName, isOpenStudentIdCardDropdown, isOpenTeacherIdCardDropdown, isSavingBackgrounds, printIdCard, saveAsPdf, schoolLogo, selectedIdCardStudent, selectedIdCardTeacher, setIdCardAddress, setIdCardBackgroundBack, setIdCardBackgroundFront, setIdCardDob, setIdCardExpireDate, setIdCardField1, setIdCardField2, setIdCardField3, setIdCardField4, setIdCardGender, setIdCardIdNumber, setIdCardIssueDate, setIdCardNameEn, setIdCardNameKh, setIdCardPhone, setIdCardPhoto, setIdCardPrintSide, setIdCardRole, setIsOpenStudentIdCardDropdown, setIsOpenTeacherIdCardDropdown, setSelectedIdCardStudent, setSelectedIdCardTeacher, setStudentIdCardSearchQuery, setTeacherIdCardSearchQuery, studentIdCardSearchQuery, students, teacherIdCardSearchQuery, teachers, uiLang: propUiLang } = props;

  const [localLang, setLocalLang] = React.useState(propUiLang || localStorage.getItem("plc_lang") || "kh");

  React.useEffect(() => {
    if (propUiLang) {
      setLocalLang(propUiLang);
    }
  }, [propUiLang]);

  React.useEffect(() => {
    const handleLangChange = (e: any) => {
      setLocalLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  const uiLang = localLang;

  return (
    <>
{activeTab === "ID Card" && (() => {
              const idt = (kh: string, en?: string, zh?: string) => {
                if (localLang === "en") return en || kh;
                if (localLang === "zh") return zh || en || kh;
                return kh;
              };
              return (
                <motion.div
                  key="id-card-tab"
                  initial={{ opacity: 0.92 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                >
                  {/* Top Header Card */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 md:p-6 no-print mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Load Profile Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 text-primary-600 border-b border-slate-100 pb-2 mb-3">
                          <div className="p-2 bg-primary-50 rounded-xl shrink-0">
                            <List className="w-4 h-4 text-primary-600" />
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-sm truncate">
                            {idt("ទាញយកទិន្នន័យពីប្រព័ន្ធប្រមូលផ្ដុំ", "Load Registered Profile", "导入系统已注册档案 (Load Registered Profile)")}
                          </h4>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="w-full md:w-[450px]">
                            <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">
                              {idCardRole === 'student' 
                                ? idt("ជ្រើសរើសសិស្សសរុប", "Select Registered Student", "选择已注册学生") 
                                : idt("ជ្រើសរើសគ្រូបង្រៀន", "Select Registered Teacher", "选择已注册教师")}
                            </label>
                            {idCardRole === 'student' ? (
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setIsOpenStudentIdCardDropdown(!isOpenStudentIdCardDropdown)}
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white shadow-3xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer flex items-center justify-between text-left hover:bg-slate-50/50"
                                >
                                  <span className="truncate">
                                    {selectedIdCardStudent 
                                      ? `${selectedIdCardStudent.nameKh} (${selectedIdCardStudent.nameEn})` 
                                      : idt("-- បញ្ចូលព័ត៌មានដោយផ្ទាល់ --", "-- Enter Information Manually (Manual Custom Mode) --", "-- 手动输入模式 (Manual Custom Mode) --")}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenStudentIdCardDropdown ? "rotate-180" : ""}`} />
                                </button>

                                {isOpenStudentIdCardDropdown && (
                                  <>
                                    <div className="fixed inset-0 z-[110]" onClick={() => {
                                      setIsOpenStudentIdCardDropdown(false);
                                      setStudentIdCardSearchQuery("");
                                    }} />
                                    <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden p-2 text-xs flex flex-col max-h-[300px]">
                                      {/* Search Input */}
                                      <div className="relative mb-2 shrink-0">
                                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                          type="text"
                                          value={studentIdCardSearchQuery}
                                          onChange={(e) => setStudentIdCardSearchQuery(e.target.value)}
                                          placeholder={idt("ស្វែងរកឈ្មោះសិស្ស...", "Search student...", "搜索学生姓名...")}
                                          className="w-full pl-9 pr-8 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50/50"
                                          onClick={(e) => e.stopPropagation()}
                                          autoFocus
                                        />
                                        {studentIdCardSearchQuery && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setStudentIdCardSearchQuery("");
                                            }}
                                            className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>

                                      {/* Scrollable list */}
                                      <div className="overflow-y-auto flex-1 space-y-0.5 max-h-[220px] pr-1 scrollbar-none">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedIdCardStudent(null);
                                            setIdCardNameKh("ឈ្មោះសិស្ស");
                                            setIdCardNameEn("STUDENT NAME");
                                            setIdCardIdNumber("SMS-ST-0000");
                                            setIdCardGender("Male");
                                            setIdCardField1("Microsoft Office");
                                            setIdCardField2("Level 1");
                                            setIdCardField3("ម៉ោងចន្ទ-សុក្រ");
                                            setIdCardField4("05:30 - 06:30 PM");
                                            setIdCardPhone("+855 12 345 678");
                                            setIdCardDob("01/01/2005");
                                            setIsOpenStudentIdCardDropdown(false);
                                            setStudentIdCardSearchQuery("");
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                                            !selectedIdCardStudent 
                                              ? "bg-primary-600 text-white font-black" 
                                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                          }`}
                                        >
                                          {idt("-- បញ្ចូលព័ត៌មានដោយផ្ទាល់ --", "-- Enter Information Manually (Manual Custom Mode) --", "-- 手动输入模式 (Manual Custom Mode) --")}
                                        </button>

                                        {(() => {
                                          const query = studentIdCardSearchQuery.toLowerCase().trim();
                                          const filtered = students.filter(s => 
                                            s.status === 'STUDYING' && (
                                              s.nameKh.toLowerCase().includes(query) || 
                                              s.nameEn.toLowerCase().includes(query) ||
                                              (s.studentId && s.studentId.toLowerCase().includes(query))
                                            )
                                          );

                                          if (filtered.length === 0) {
                                            return (
                                              <div className="text-center py-4 text-slate-400 font-bold">
                                                {idt("មិនរកឃើញទិន្នន័យសិស្សទេ", "No student data found", "未找到学生数据")}
                                              </div>
                                            );
                                          }

                                          return filtered.map(s => {
                                            const isSelected = selectedIdCardStudent?.id === s.id;
                                            return (
                                              <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => {
                                                  handlePrefillStudent(s);
                                                  setIsOpenStudentIdCardDropdown(false);
                                                  setStudentIdCardSearchQuery("");
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center justify-between ${
                                                  isSelected 
                                                    ? "bg-primary-600 text-white font-black" 
                                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                              >
                                                <span className="truncate">{s.nameKh} ({s.nameEn})</span>
                                                {s.studentId && (
                                                  <span className={`text-[10px] font-mono font-black ${isSelected ? "text-primary-200" : "text-slate-400"}`}>
                                                    {s.studentId}
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          });
                                        })()}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setIsOpenTeacherIdCardDropdown(!isOpenTeacherIdCardDropdown)}
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white shadow-3xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer flex items-center justify-between text-left hover:bg-slate-50/50"
                                >
                                  <span className="truncate">
                                    {selectedIdCardTeacher 
                                      ? `${selectedIdCardTeacher.nameKh} (${selectedIdCardTeacher.nameEn})` 
                                      : idt("-- បញ្ចូលព័ត៌មានដោយផ្ទាល់ --", "-- Enter Information Manually (Manual Custom Mode) --", "-- 手动输入模式 (Manual Custom Mode) --")}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenTeacherIdCardDropdown ? "rotate-180" : ""}`} />
                                </button>

                                {isOpenTeacherIdCardDropdown && (
                                  <>
                                    <div className="fixed inset-0 z-[110]" onClick={() => {
                                      setIsOpenTeacherIdCardDropdown(false);
                                      setTeacherIdCardSearchQuery("");
                                    }} />
                                    <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden p-2 text-xs flex flex-col max-h-[300px]">
                                      {/* Search Input */}
                                      <div className="relative mb-2 shrink-0">
                                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                          type="text"
                                          value={teacherIdCardSearchQuery}
                                          onChange={(e) => setTeacherIdCardSearchQuery(e.target.value)}
                                          placeholder={idt("ស្វែងរកឈ្មោះគ្រូ...", "Search teacher...", "搜索教师姓名...")}
                                          className="w-full pl-9 pr-8 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50/50"
                                          onClick={(e) => e.stopPropagation()}
                                          autoFocus
                                        />
                                        {teacherIdCardSearchQuery && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setTeacherIdCardSearchQuery("");
                                            }}
                                            className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>

                                      {/* Scrollable list */}
                                      <div className="overflow-y-auto flex-1 space-y-0.5 max-h-[220px] pr-1 scrollbar-none">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedIdCardTeacher(null);
                                            setIdCardNameKh("ឈ្មោះគ្រូ");
                                            setIdCardNameEn("TEACHER NAME");
                                            setIdCardIdNumber("SMS-TCH-0000");
                                            setIdCardGender("Male");
                                            setIdCardField1("Graphic Design");
                                            setIdCardField2("+855 88 123 4567");
                                            setIdCardField3("គ្រូបង្រៀន");
                                            setIdCardField4("ACTIVE");
                                            setIdCardPhone("+855 88 123 4567");
                                            setIdCardDob("12/04/1994");
                                            setIsOpenTeacherIdCardDropdown(false);
                                            setTeacherIdCardSearchQuery("");
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                                            !selectedIdCardTeacher 
                                              ? "bg-rose-600 text-white font-black" 
                                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                          }`}
                                        >
                                          {idt("-- បញ្ចូលព័ត៌មានដោយផ្ទាល់ --", "-- Enter Information Manually (Manual Custom Mode) --", "-- 手动输入模式 (Manual Custom Mode) --")}
                                        </button>

                                        {(() => {
                                          const query = teacherIdCardSearchQuery.toLowerCase().trim();
                                          const filtered = teachers.filter(t => 
                                            (t.status === 'ACTIVE' || t.status === 'LEAVE') && (
                                              t.nameKh.toLowerCase().includes(query) || 
                                              t.nameEn.toLowerCase().includes(query) ||
                                              (t.teacherId && t.teacherId.toLowerCase().includes(query))
                                            )
                                          );

                                          if (filtered.length === 0) {
                                            return (
                                              <div className="text-center py-4 text-slate-400 font-bold">
                                                {idt("មិនរកឃើញទិន្នន័យគ្រូបង្រៀនទេ", "No teacher data found", "未找到教师数据")}
                                              </div>
                                            );
                                          }

                                          return filtered.map(t => {
                                            const isSelected = selectedIdCardTeacher?.id === t.id;
                                            return (
                                              <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => {
                                                  handlePrefillTeacher(t);
                                                  setIsOpenTeacherIdCardDropdown(false);
                                                  setTeacherIdCardSearchQuery("");
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center justify-between ${
                                                  isSelected 
                                                    ? "bg-rose-600 text-white font-black" 
                                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                              >
                                                <span className="truncate">{t.nameKh} ({t.nameEn})</span>
                                                {t.teacherId && (
                                                  <span className={`text-[10px] font-mono font-black ${isSelected ? "text-rose-200" : "text-slate-400"}`}>
                                                    {t.teacherId}
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          });
                                        })()}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                            <p className="text-[10px] text-amber-500 font-bold leading-relaxed mt-2">
                              {idt(
                                "* ប្រព័ន្ធនឹងធ្វើការបញ្ចូលទិន្នន័យដោយស្វ័យប្រវត្តិតាមសមាជិកដែលបានជ្រើសរើស!",
                                "* Auto-populates details based on the selected member!",
                                "* 系统将自动根据所选成员填充学籍信息！"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Segment control */}
                      <div className="flex bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl gap-1.5 border border-slate-200/50 shadow-inner shrink-0 self-start lg:self-center">
                        <button
                          onClick={() => {
                            setIdCardRole('student');
                            if (students.length > 0) {
                              handlePrefillStudent(students[0]);
                            }
                          }}
                          className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.97] border ${
                            idCardRole === 'student'
                              ? "bg-white text-primary-700 shadow-sm border-slate-200/40"
                              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40"
                          }`}
                        >
                          <GraduationCap className={`w-4 h-4 ${idCardRole === 'student' ? 'text-primary-600' : 'text-slate-400'}`} />
                          <span>{idt("ភាគសិស្ស", "Student Card", "学生卡 (Student Card)")}</span>
                        </button>
                        <button
                          onClick={() => {
                            setIdCardRole('teacher');
                            if (teachers.length > 0) {
                              handlePrefillTeacher(teachers[0]);
                            }
                          }}
                          className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.97] border ${
                            idCardRole === 'teacher'
                              ? "bg-white text-rose-700 shadow-sm border-slate-200/40"
                              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40"
                          }`}
                        >
                          <Users className={`w-4 h-4 ${idCardRole === 'teacher' ? 'text-rose-600' : 'text-slate-400'}`} />
                          <span>{idt("ភាគគ្រូ", "Teacher Card", "教师卡 (Teacher Card)")}</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Main Grid Layout (No-Print) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
                    
                    {/* Left Column: Customizer Cards */}
                    <div className="lg:col-span-5 space-y-6">

                    {/* Card Content Customizer Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                      <div className="flex items-center gap-2.5 text-primary-600 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-primary-50 rounded-xl">
                          <Pencil className="w-4 h-4 text-primary-600" />
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-sm">{idt("កែសម្រួលរូបរាងកាត", "Card Content Customizer", "胸牌内容个性化编辑 (Card Content Customizer)")}</h4>
                      </div>

                      <div className="space-y-4">
                        {/* Names section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ឈ្មោះខ្មែរ", "Khmer Name", "高棉姓名 (Khmer Name)")}</label>
                              <input
                                type="text"
                                value={idCardNameKh}
                                onChange={(e) => setIdCardNameKh(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ឈ្មោះឡាតាំង", "English Name", "英文姓名 (English Name)")}</label>
                              <input
                                type="text"
                                value={idCardNameEn}
                                onChange={(e) => setIdCardNameEn(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                          </div>

                          {/* ID and Gender */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("កូដសម្គាល់ ID", "Identification Code (ID)", "唯一识别码 ID")}</label>
                              <input
                                type="text"
                                value={idCardIdNumber}
                                onChange={(e) => setIdCardIdNumber(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ភេទ", "Sex", "性别 (Sex)")}</label>
                              <select
                                value={idCardGender}
                                onChange={(e) => setIdCardGender(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30 cursor-pointer"
                              >
                                <option value="Male">{idt("ប្រុស", "Male (M)", "男 (M)")}</option>
                                <option value="Female">{idt("ស្រី", "Female (F)", "女 (F)")}</option>
                              </select>
                            </div>
                          </div>

                          {/* Registry details */}
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              <Cpu className="w-3.5 h-3.5 text-slate-400" />
                              <span>{idCardRole === 'student' ? idt("ព័ត៌មានសិក្សាដែលភ្ជាប់", "REGISTRY DETAILS", "注册信息详情 (REGISTRY DETAILS)") : idt("ព័ត៌មានបង្រៀនដែលភ្ជាប់", "TEACHER DETAILS", "教学信息详情 (TEACHER DETAILS)")}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idCardRole === 'student' ? idt("វគ្គសិក្សា", "Course", "课程 (Course)") : idt("ជំនាញបង្រៀន", "Specialty", "教学专业 (Specialty)")}
                                </label>
                                <input
                                  type="text"
                                  value={idCardField1}
                                  onChange={(e) => setIdCardField1(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idCardRole === 'student' ? idt("កម្រិត", "Level", "级别 (Level)") : idt("លេខទូរស័ព្ទ", "Phone Number", "电话号码 (Phone)")}
                                </label>
                                <input
                                  type="text"
                                  value={idCardField2}
                                  onChange={(e) => setIdCardField2(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idCardRole === 'student' ? idt("វេនសិក្សា", "Shift", "学制班次 (Shift)") : idt("តួនាទី", "Role", "角色职务 (Role)")}
                                </label>
                                <input
                                  type="text"
                                  value={idCardField3}
                                  onChange={(e) => setIdCardField3(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idCardRole === 'student' ? idt("ម៉ោងសិក្សា", "Hours", "上课时间 (Hours)") : idt("ស្ថានភាព", "Status", "在职状态 (Status)")}
                                </label>
                                <input
                                  type="text"
                                  value={idCardField4}
                                  onChange={(e) => setIdCardField4(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Extra info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ថ្ងៃខែឆ្នាំកំណើត", "Date of Birth (D.O.B)", "出生日期 (D.O.B)")}</label>
                              <input
                                  type="text"
                                  value={idCardDob}
                                  onChange={(e) => setIdCardDob(e.target.value)}
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("លេខទូរស័ព្ទ", "Phone Number", "电话号码 (Phone Number)")}</label>
                              <input
                                type="text"
                                value={idCardPhone}
                                onChange={(e) => setIdCardPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("អាសយដ្ឋាន", "Address", "家庭住址 (Address)")}</label>
                              <input
                                type="text"
                                value={idCardAddress}
                                onChange={(e) => setIdCardAddress(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ថ្ងៃចេញកាត", "Issue Date", "发证日期 (Issue)")}</label>
                              <input
                                type="text"
                                value={idCardIssueDate}
                                onChange={(e) => setIdCardIssueDate(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ផុតកំណត់", "Expiry Date", "有效期限 (Expire)")}</label>
                              <input
                                type="text"
                                value={idCardExpireDate}
                                onChange={(e) => setIdCardExpireDate(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none bg-slate-50/30"
                              />
                            </div>
                          </div>

                          {/* Profile photo upload */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("រូបថតសិស្ស/គ្រូ", "Profile Portrait", "个人免冠头像 (Profile Portrait)")}</label>
                            <div className="flex gap-2">
                              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100/70 transition-all cursor-pointer">
                                <Camera className="w-4 h-4 text-slate-400" />
                                <span>{idCardPhoto ? idt("ប្ដូររូបថត", "Change Photo", "更换头像 (Change Photo)") : idt("ផ្ទុករូបថត", "Upload Profile Photo", "上传头像 (Upload Profile Photo)")}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, setIdCardPhoto)}
                                />
                              </label>
                              {idCardPhoto && (
                                <button
                                  onClick={() => setIdCardPhoto("")}
                                  className="px-4 border border-rose-200 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                                  title="លុបឡូហ្គោ"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* ID Card Background Front & Back Upload */}
                          <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/50 pb-2">
                              <Layers className="w-3.5 h-3.5 text-primary-500" />
                              <span>{idt("ផ្ទៃខាងក្រោយនាមកាត", "ID Card Backgrounds", "证件背景卡图 (ID Card Backgrounds)")}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {/* Front Background */}
                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">{idt("សន្លឹកខាងមុខ", "Front Side", "正面图案 (Front Side)")}</label>
                                <div className="flex gap-1.5">
                                  <label className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-100/60 transition-all cursor-pointer select-none">
                                    <Upload className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{idCardBackgroundFront ? idt("ប្ដូររូប", "Change", "更换 (Change)") : idt("ផ្ទុកឡើង", "Upload", "上传 (Upload)")}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleImageUpload(e, setIdCardBackgroundFront)}
                                    />
                                  </label>
                                  {idCardBackgroundFront && (
                                    <button
                                      type="button"
                                      onClick={() => setIdCardBackgroundFront("")}
                                      className="p-2 border border-rose-200 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all shrink-0 cursor-pointer animate-fade-in"
                                      title="លុបរូបភាព"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Back Background */}
                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">{idt("សន្លឹកខាងក្រោយ", "Back Side", "背面图案 (Back Side)")}</label>
                                <div className="flex gap-1.5">
                                  <label className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-100/60 transition-all cursor-pointer select-none">
                                    <Upload className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{idCardBackgroundBack ? idt("ប្ដូររូប", "Change", "更换 (Change)") : idt("ផ្ទុកឡើង", "Upload", "上传 (Upload)")}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleImageUpload(e, setIdCardBackgroundBack)}
                                    />
                                  </label>
                                  {idCardBackgroundBack && (
                                    <button
                                      type="button"
                                      onClick={() => setIdCardBackgroundBack("")}
                                      className="p-2 border border-rose-200 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all shrink-0 cursor-pointer animate-fade-in"
                                      title="លុបរូបភាព"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Save Button */}
                            <button
                              type="button"
                              onClick={handleSaveIdCardBackgrounds}
                              disabled={isSavingBackgrounds}
                              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs select-none active:scale-[0.98]"
                            >
                              {isSavingBackgrounds ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              <span>{idt("រក្សាទុកផ្ទៃខាងក្រោយ", "Save Backgrounds", "保存背景设置 (Save Backgrounds)")}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Live Print Preview Canvas */}
                    <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col items-center justify-start space-y-6">
                      
                      {/* Header Canvas with title, subtitle and Role Pill */}
                      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">{idt("ផ្ទាំងបង្ហាញកាតពិតប្រាកដ", "Live Print Preview Canvas", "实体卡即时打印预览 (Live Print Preview Canvas)")}</h4>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                            {idt("កាន់តែងាយស្រួលបោះពុម្ពទំហំស្ដង់ដារផ្នែកខាងមុខ និងខាងក្រោយ", "Easily print in standard front and back sizes (ID Card scale standard)", "完美贴合标准尺寸正背面比例打印 (ID Card scale standard)")}
                          </span>
                        </div>

                        {/* ID Card Role Pill */}
                        <span className="bg-primary-50 border border-primary-100 text-primary-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {idCardRole === 'student' 
                            ? idt("កាតសម្គាល់ខ្លួនសិស្ស", "Student ID Card", "学生胸牌 (Student ID Card)") 
                            : idt("កាតសម្គាល់ខ្លួនគ្រូ", "Teacher ID Card", "教师胸牌 (Teacher ID Card)")}
                        </span>
                      </div>

                      {/* Flex cards side-by-side inside a dashed-border slate layout */}
                      <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full p-6 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                        
                        {/* Front Card rendering (Waves Removed) */}
                        <div ref={frontCardRef} className={`w-[245px] h-[370px] rounded-[24px] border-0 shadow-md overflow-hidden flex flex-col justify-between relative bg-white select-none shrink-0 transition-all duration-350 hover:shadow-lg ${
                          idCardPrintSide === 'back' ? 'opacity-35 scale-[0.96] saturate-[0.4] blur-[0.4px]' : 'opacity-100 scale-100 shadow-xl'
                        }`}>
                          {idCardBackgroundFront && (
                            <img src={idCardBackgroundFront} className="absolute inset-0 w-full h-full object-cover z-0" alt="Background Front" referrerPolicy="no-referrer" />
                          )}

                          {/* Header Logo */}
                          <div className="absolute top-4 left-5 flex items-center gap-2 z-10 text-slate-800">
                            {schoolLogo ? (
                              <img src={schoolLogo} className="w-5.5 h-5.5 object-contain rounded" alt="Logo" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                                <svg className="absolute inset-0 w-full h-full text-[#0ea5e9]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
                                  <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
                                </svg>
                                <span className="text-[5.5px] font-black text-[#0ea5e9] tracking-tighter uppercase font-sans z-10">LOGO</span>
                              </div>
                            )}
                            <span className="text-[10px] font-black tracking-widest uppercase font-sans text-[#0ea5e9]">{idCardSchoolName || "NAME COMPANY"}</span>
                          </div>

                          {/* Portrait Container */}
                          <div className="relative z-10 mt-14 flex justify-center">
                            <div className="w-[112px] h-[112px] rounded-full border-[2.5px] border-[#0ea5e9] bg-white p-[3px] shadow-sm">
                              <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                                {idCardPhoto ? (
                                  <img src={idCardPhoto} alt="Portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300">
                                    <svg className="w-14 h-14 text-slate-450" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Identification Metadata */}
                          <div className="text-left mt-9 z-10 px-6 flex flex-col items-start w-full">
                            {/* Khmer Name on top of English Name */}
                            <p className="text-sm font-black text-slate-900 leading-tight">{idCardNameKh || idt("ឈ្មោះខ្មែរ", "YOUR NAME", "高棉姓名")}</p>
                            
                            <h4 className="text-xs font-black text-slate-400 font-sans tracking-wide uppercase mt-1 leading-tight">
                              {(() => {
                                const name = idCardNameEn || "YOUR NAME";
                                const parts = name.trim().split(/\s+/);
                                if (parts.length === 1) {
                                  return <span className="text-[#0ea5e9]">{parts[0]}</span>;
                                }
                                const firstPart = parts.slice(0, -1).join(" ");
                                const lastPart = parts[parts.length - 1];
                                return (
                                  <>
                                    {firstPart} <span className="text-[#0ea5e9]">{lastPart}</span>
                                  </>
                                );
                              })()}
                            </h4>
                            
                            <p className="text-[8.5px] text-slate-400 font-extrabold uppercase mt-1.5 tracking-wider">
                              {idCardRole === 'student' 
                                ? (idCardField1 || idt('សិស្ស / មុខដំណែង', 'Student | Job Position', '学生 | 职务')) 
                                : (idCardField1 || idt('គ្រូបង្រៀន / ជំនាញ', 'Instructor | Specialty', '教师 | 专业'))}
                            </p>
                          </div>

                          {/* Registry Details Sheet */}
                          <div className="px-6 mt-5.5 space-y-1.5 text-[10px] font-sans text-left z-10">
                            <div className="grid grid-cols-[45px_10px_1fr] items-center">
                              <span className="text-slate-800 font-extrabold uppercase tracking-wider">ID</span>
                              <span className="text-[#0ea5e9] font-black">:</span>
                              <span className="text-slate-700 font-black font-mono tracking-wide">{idCardIdNumber || "00.112.22.333"}</span>
                            </div>
                            <div className="grid grid-cols-[45px_10px_1fr] items-center">
                              <span className="text-slate-800 font-extrabold uppercase tracking-wider">D.O.B</span>
                              <span className="text-[#0ea5e9] font-black">:</span>
                              <span className="text-slate-700 font-black font-mono tracking-wide">{idCardDob || "02/06/2023"}</span>
                            </div>
                            <div className="grid grid-cols-[45px_10px_1fr] items-center">
                              <span className="text-slate-800 font-extrabold uppercase tracking-wider">Phone</span>
                              <span className="text-[#0ea5e9] font-black">:</span>
                              <span className="text-slate-700 font-black font-mono tracking-wide">{idCardPhone || "(+08.123.456.789)"}</span>
                            </div>
                          </div>

                          {/* Barcode Footer */}
                          <div className="mt-auto pb-4.5 pt-2 flex flex-col items-center justify-center z-10 w-full">
                            <div className="flex items-end gap-[1.75px] h-5.5 justify-center opacity-90">
                              {[1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3].map((width, idx) => (
                                <span 
                                  key={idx} 
                                  className="bg-slate-800 rounded-3xs h-full"
                                  style={{ width: `${width * 1.2}px` }}
                                ></span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Back Card rendering (Waves Removed) */}
                        <div ref={backCardRef} className={`w-[245px] h-[370px] rounded-[24px] border-0 shadow-md overflow-hidden flex flex-col justify-between relative bg-white select-none shrink-0 transition-all duration-350 hover:shadow-lg ${
                          idCardPrintSide === 'front' ? 'opacity-35 scale-[0.96] saturate-[0.4] blur-[0.4px]' : 'opacity-100 scale-100 shadow-xl'
                        }`}>
                          {idCardBackgroundBack && (
                            <img src={idCardBackgroundBack} className="absolute inset-0 w-full h-full object-cover z-0" alt="Background Back" referrerPolicy="no-referrer" />
                          )}

                          {/* Header back */}
                          <div className="p-4 flex flex-col items-center justify-center z-10 bg-transparent">
                            <div className="flex items-center gap-2">
                              {schoolLogo ? (
                                <img src={schoolLogo} className="w-6 h-6 object-contain rounded" alt="Logo" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="relative w-6.5 h-6.5 flex items-center justify-center shrink-0">
                                  <svg className="absolute inset-0 w-full h-full text-[#0ea5e9]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
                                    <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
                                  </svg>
                                  <span className="text-[6px] font-black text-[#0ea5e9] tracking-tighter uppercase font-sans z-10 font-mono">LOGO</span>
                                </div>
                              )}
                              <span className="text-[11px] font-black text-[#0ea5e9] tracking-widest font-sans uppercase">{idCardSchoolName || "NAME COMPANY"}</span>
                            </div>
                          </div>

                          {/* Terms of Use container */}
                          <div className="px-4.5 py-2.5 flex-1 flex flex-col justify-start z-10">
                            <div className="p-2.5 space-y-1.5">
                              <div className="text-center">
                                <span className="text-[9.5px] font-black text-slate-800 uppercase tracking-wide">{idt("លក្ខខណ្ឌប្រើប្រាស់", "TERMS OF USE", "使用条款 (TERMS OF USE)")}</span>
                                <div className="h-[1px] bg-slate-100 my-1.5 w-full"></div>
                              </div>
                              
                              <div className="space-y-2 text-[8px] font-bold text-slate-600 leading-normal text-left">
                                <div className="flex gap-2 items-center">
                                  <span className="w-4 h-4 rounded-full bg-[#e0f2fe]/80 text-[#0ea5e9] flex items-center justify-center text-[8px] shrink-0 font-black">១</span>
                                  <span className="font-sans">{idt("កាតនេះសម្រាប់ប្រើប្រាស់ក្នុងគ្រឹះស្ថានសិក្សាប៉ុណ្ណោះ", "This card is for institution use only.", "本证件仅限校内/机构内部使用。")}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="w-4 h-4 rounded-full bg-[#e0f2fe]/80 text-[#0ea5e9] flex items-center justify-center text-[8px] shrink-0 font-black">២</span>
                                  <span className="font-sans">{idt("សិស្ស/និស្សិតត្រូវតែពាក់កាតនេះរាល់ពេលចូលរៀន", "Students must wear this card at all times.", "学生/成员在校期间必须佩戴本证。")}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="w-4 h-4 rounded-full bg-[#e0f2fe]/80 text-[#0ea5e9] flex items-center justify-center text-[8px] shrink-0 font-black">៣</span>
                                  <span className="font-sans">{idt("ករណីបាត់ ឬខូចត្រូវរាយការណ៍មកសាលាជាបន្ទាន់", "Report lost or damaged cards immediately.", "如有遗失或损坏，须立即向学校/机构报告。")}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="w-4 h-4 rounded-full bg-[#e0f2fe]/80 text-[#0ea5e9] flex items-center justify-center text-[8px] shrink-0 font-black">៤</span>
                                  <span className="font-sans">{idt("ប្រសិនបើបានរើសជួបកាតនេះ សូមប្រគល់ជូនសាលាវិញ", "If found, please return to the office.", "拾获此卡者，请交还给学校/机构办公室。")}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-center mt-1 z-10">
                              <div className="text-[8px] font-black text-[#0ea5e9] bg-transparent px-3.5 py-0.5 flex items-center gap-1.5">
                                <span className="text-slate-500 font-extrabold uppercase font-sans">{idt("អាសយដ្ឋាន:", "ADDRESS:", "地址 (ADDRESS):")}</span>
                                <span className="font-sans font-bold text-slate-700">{idCardAddress || idt("ភ្នំពេញ", "Phnom Penh", "金边")}</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-center gap-2 mt-1 z-10 px-2">
                              <div className="text-[8px] font-black text-[#0ea5e9] bg-transparent px-3 py-0.5 shrink-0 flex items-center gap-1">
                                <span className="text-slate-500 font-extrabold uppercase font-sans">{idt("កម្រិត:", "LVL:", "级别 (LVL):")}</span>
                                <span className="text-slate-700">{idCardField2 || "4"}</span>
                              </div>
                              <div className="text-[8px] font-black text-[#0ea5e9] bg-transparent px-3 py-0.5 flex-1 truncate flex items-center justify-center gap-1">
                                <span className="text-slate-500 font-extrabold uppercase font-sans">{idt("ម៉ោងសិក្សា:", "HRS:", "时间 (HRS):")}</span>
                                <span className="font-mono text-slate-700">{idCardField4 || "05:30 - 06:30 PM"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Back bottom wave with QR code (Waves Removed) */}
                          <div className="relative h-[125px] shrink-0 mt-auto z-0 bg-transparent">
                            <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-6 z-10 text-slate-800">
                              <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-200/50 shrink-0">
                                {idCardIdNumber ? (
                                  <QRCodeCanvas 
                                    value={`${window.location.origin.includes("ais-dev-") ? window.location.origin.replace("ais-dev-", "ais-pre-") : window.location.origin}/?portal_student=${idCardIdNumber}`} 
                                    size={64} 
                                    fgColor="#1b304f" 
                                    bgColor="transparent" 
                                    includeMargin={false} 
                                  />
                                ) : (
                                  <QrCode className="w-12 h-12 text-[#1b304f]" />
                                )}
                              </div>
                              
                              <div className="text-right text-[8.5px] font-bold space-y-1 text-slate-700 font-sans">
                                <div>
                                  <span className="font-bold text-slate-400">{idt("ថ្ងៃចេញកាត:", "Issue date:", "发证日期 (Issue Date):")} </span>
                                  <span className="font-mono font-extrabold text-slate-700">{idCardIssueDate || "03/11/23"}</span>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-400">{idt("ថ្ងៃផុតកំណត់:", "Expire Date:", "截止日期 (Expiry Date):")} </span>
                                  <span className="font-mono font-extrabold text-slate-700">{idCardExpireDate || "12/01/26"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Select Side Segmented Control */}
                      <div className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-3xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Layers className="w-4 h-4 text-primary-500 shrink-0" />
                          <span className="text-xs font-black">{idt("ជម្រើសទំព័រសម្រាប់ ទាញយក / បោះពុម្ព / PDF :", "Options for download / print / PDF:", "下载 / 打印 / 导出 PDF 的页面选择：")}</span>
                        </div>
                        <div className="flex p-1 bg-slate-200/60 rounded-xl w-full md:w-auto shrink-0 border border-slate-200/30">
                          <button
                            type="button"
                            onClick={() => setIdCardPrintSide('front')}
                            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                              idCardPrintSide === 'front'
                                ? "bg-white text-primary-600 shadow-3xs font-extrabold"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {idt("សន្លឹកខាងមុខ", "Front Only", "仅正面 (Front Only)")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIdCardPrintSide('back')}
                            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                              idCardPrintSide === 'back'
                                ? "bg-white text-primary-600 shadow-3xs font-extrabold"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {idt("សន្លឹកខាងក្រោយ", "Back Only", "仅背面 (Back Only)")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIdCardPrintSide('both')}
                            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                              idCardPrintSide === 'both'
                                ? "bg-white text-primary-600 shadow-3xs font-extrabold"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {idt("សន្លឹកទាំងពីរ", "Both Sides", "双面 (Both Sides)")}
                          </button>
                        </div>
                      </div>

                      {/* Action buttons (Exactly as in the image) */}
                      <div className="grid grid-cols-3 gap-3.5 w-full">
                        <button
                          onClick={downloadIdCard}
                          className="px-4 py-3 bg-[#00A86B] hover:bg-[#008F5A] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs select-none active:scale-[0.98]"
                        >
                          <Download className="w-4 h-4" />
                          <span>{idt("ទាញយកកាតផ្ទាល់ខ្លួន", "Download Card", "下载胸牌 (Download Card)")}</span>
                        </button>
                        
                        <button
                          onClick={printIdCard}
                          className="px-4 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs select-none active:scale-[0.98]"
                        >
                          <Printer className="w-4 h-4" />
                          <span>{idt("បោះពុម្ពកាត", "Print Card", "打印胸牌 (Print Card)")}</span>
                        </button>

                        <button
                          onClick={saveAsPdf}
                          className="px-4 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs select-none active:scale-[0.98]"
                        >
                          <Download className="w-4 h-4" />
                          <span>{idt("រក្សាទុកជា PDF", "Save as PDF", "保存为 PDF (Save as PDF)")}</span>
                        </button>
                      </div>

                      {/* Technology Notice banner (SMART NFC/BARCODE INTEGRATION) */}
                      <div className="w-full bg-[#0B1528] text-slate-300 p-4 rounded-2xl border border-slate-800 text-[10px] space-y-2 text-left">
                        <div className="flex items-center gap-2 text-sky-400 font-black uppercase tracking-wider">
                          <Cpu className="w-4 h-4" />
                          <span>{idt("តំណភ្ជាប់ប្រព័ន្ធស្កេន", "SMART NFC/BARCODE INTEGRATION", "智能二维码/条形码集成 (SMART NFC/BARCODE INTEGRATION)")}</span>
                        </div>
                        <p className="text-slate-400 font-semibold leading-relaxed">
                          * {idt("កាតនីមួយៗត្រូវបានបង្កើតឡើងដោយស្វ័យប្រវត្តជាមួយ", "Each card is automatically generated with", "每张卡片均自动生成专属的")} <span className="text-white font-extrabold">{idt("QR Code សម្គាល់កូដសិស្ស", "ID-bound Secure Barcode (QR Code)", "绑定身份证的加密二维码 (ID-bound Secure Barcode)")}</span> {idt("សម្រាប់ស្កេន។", "for scanning.", "用于扫码识别。")}
                        </p>
                        <p className="text-slate-400 font-semibold leading-relaxed">
                          * {idt("លេខកូដ", "The code", "卡号")} <span className="text-white font-extrabold font-mono">{idCardIdNumber || "00.112.22.333"}</span> {idt("ងាយស្រួលស្កេននៅលើម៉ាស៊ីនស្កេនកាត", "is easy to scan on the card scanner under the", "可在扫码功能")} <span className="text-sky-400 font-extrabold">"{idt("ម៉ាស៊ីនស្កេន", "QR Scanner", "“扫码器 (QR Scanner)”")}"</span> {idt("ដើម្បីកត់ត្រាវត្តមានចូលរៀនកាន់តែលឿន!", "tab to record attendance faster!", "面板中进行扫描，实现快速签到记勤！")}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })()}    </>
  );
}
