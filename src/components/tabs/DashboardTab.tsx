import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Camera, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle, SlidersHorizontal, Send, QrCode , Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart as RechartsLineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function DashboardTab(props: any) {
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = React.useState(false);
  const {
    user,
    activeCourseFilter,
    activeCourseMetrics = {},
    activeTab,
    chartData = [],
    chartTab,
    collectedKey,
    currentTime = new Date(),
    dueKey,
    femaleKey,
    getCourseSubtitle,
    getCourseTitle,
    maleKey,
    setActiveCourseFilter,
    setChartTab,
    students: rawStudents = [],
    t,
    teachers: rawTeachers = [],
    toKhmerNumeral,
    translateCourseOrSpecialtyName, developerLogo, developerName, developerKhmerName, developerPhone, developerTelegram,
    schoolLogo, schoolName, schoolKhmerName,
    uiLang: propUiLang,
    setActiveTab = props.setActiveTab
  } = props;

  const students = rawStudents.filter((s: any) => s && s.status === 'STUDYING');
  const teachers = rawTeachers.filter((t: any) => t && (t.status === 'ACTIVE' || t.status === 'LEAVE'));

  const [mobileViewMode, setMobileViewMode] = React.useState<'GRID' | 'STATS'>('GRID');
  const [appSearchQuery, setAppSearchQuery] = React.useState('');
  const [appCategoryFilter, setAppCategoryFilter] = React.useState<string>('all');

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
{activeTab === "Dashboard" && (() => {
              const toKhmerNumber = (num: number | string): string => {
                if (uiLang !== "kh") return String(num);
                const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
                return String(num).replace(/\d/g, (d) => khmerDigits[parseInt(d)]);
              };

              const getKhmerDateString = (date: Date): string => {
                if (uiLang === "en") {
                  return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
                } else if (uiLang === "zh") {
                  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
                }
                const day = date.getDate();
                const monthNames = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
                const month = monthNames[date.getMonth()];
                const year = date.getFullYear();
                return `${toKhmerNumber(day)} ${month} ${toKhmerNumber(year)}`;
              };

              const {
                filteredStudentsForStats = [],
                completedCount = 0,
                stopCount = 0,
                studyingCount = 0,
                totalReceived = 0,
                totalBalanceDue = 0,
                totalVolume = 0,
                uniqueCourses = [],
                uniqueCoursesCount = 0,
                courseFemaleCount: femaleStudentsCount = 0,
                courseMaleCount: maleStudentsCount = 0
              } = activeCourseMetrics || {};

              const maleTeachers = (teachers || []).filter((t: any) => t && t.gender === 'Male').length;
              const femaleTeachers = (teachers || []).filter((t: any) => t && t.gender === 'Female').length;
              const maleStudents = (students || []).filter((s: any) => s && s.gender === 'Male').length;
              const femaleStudents = (students || []).filter((s: any) => s && s.gender === 'Female').length;

              const displayCourseBadges = ["Word", "Excel", "Photoshop"];

              const appModules = [
                { id: "Students", labelKh: "សិស្សសរុប", labelEn: "Students", icon: Users, color: "bg-blue-500", shadow: "shadow-blue-500/25", count: toKhmerNumber(students.length), category: "people" },
                { id: "Teachers", labelKh: "គ្រូបង្រៀន", labelEn: "Teachers", icon: GraduationCap, color: "bg-emerald-500", shadow: "shadow-teal-500/25", count: toKhmerNumber(teachers.length), category: "people" },
                { id: "QR Scan", labelKh: "ស្កេន QR", labelEn: "QR Scan", icon: QrCode, color: "bg-blue-500", shadow: "shadow-blue-500/25", count: "ស្កេន", category: "tools" },
                { id: "Exams", labelKh: "ប្រឡងអនឡាញ", labelEn: "Online Exams", icon: FileText, color: "bg-amber-500", shadow: "shadow-amber-500/25", count: "វិញ្ញាសា", category: "academic" },
                { id: "Courses", labelKh: "វគ្គសិក្សា", labelEn: "Courses", icon: BookOpen, color: "bg-sky-500", shadow: "shadow-sky-500/25", count: "ថ្នាក់", category: "academic" },
                { id: "Timetable", labelKh: "កាលវិភាគ", labelEn: "Timetable", icon: Calendar, color: "bg-cyan-500", shadow: "shadow-cyan-500/25", count: "ម៉ោង", category: "academic" },
                { id: "Grading", labelKh: "ពិន្ទុ & ប្រឡង", labelEn: "Grading", icon: Award, color: "bg-rose-500", shadow: "shadow-rose-500/25", count: "ពិន្ទុ", category: "academic" },
                { id: "Attendance", labelKh: "វត្តមានសិស្ស", labelEn: "Attendance", icon: Clock, color: "bg-teal-500", shadow: "shadow-emerald-500/25", count: "របាយការណ៍", category: "academic" },
                { id: "Finance", labelKh: "ហិរញ្ញវត្ថុ", labelEn: "Finance", icon: Coins, color: "bg-emerald-600", shadow: "shadow-emerald-600/25", count: "$ / ៛", category: "admin" },
                { id: "Library", labelKh: "បណ្ណាល័យ", labelEn: "Library", icon: Landmark, color: "bg-blue-500", shadow: "shadow-blue-500/25", count: "សៀវភៅ", category: "academic" },
                { id: "Leave", labelKh: "សុំច្បាប់", labelEn: "Leave Requests", icon: MessageSquare, color: "bg-orange-500", shadow: "shadow-orange-500/25", count: "ច្បាប់", category: "people" },
                { id: "Announcements", labelKh: "ផ្សព្វផ្សាយ", labelEn: "Announcements", icon: Sparkles, color: "bg-yellow-500", shadow: "shadow-yellow-500/25", count: "ព័ត៌មាន", category: "tools" },
                { id: "Analytics", labelKh: "របាយការណ៍", labelEn: "Analytics", icon: BarChart2, color: "bg-blue-600", shadow: "shadow-blue-600/25", count: "ស្ថិតិ", category: "admin" },
                { id: "Assets", labelKh: "ទ្រព្យសម្បត្តិ", labelEn: "Assets", icon: Folder, color: "bg-slate-700", shadow: "shadow-slate-700/25", count: "សម្ភារ", category: "admin" },
                { id: "Certificates", labelKh: "វិញ្ញាបនបត្រ", labelEn: "Certificates", icon: GraduationCap, color: "bg-amber-600", shadow: "shadow-amber-600/25", count: "ប័ណ្ណ", category: "academic" },
                { id: "ID Card", labelKh: "កាតសិស្ស", labelEn: "Student ID", icon: CreditCard, color: "bg-blue-600", shadow: "shadow-blue-600/25", count: "កាត", category: "people" },
                { id: "Credentials", labelKh: "គណនីបុគ្គលិក", labelEn: "Credentials", icon: Users, color: "from-slate-800 via-slate-900 to-black", shadow: "shadow-slate-800/25", count: "គណនី", category: "admin" },
                { id: "Settings", labelKh: "ការកំណត់", labelEn: "Settings", icon: SlidersHorizontal, color: "bg-slate-600", shadow: "shadow-slate-600/25", count: "ប្រព័ន្ធ", category: "tools" },
              ];

              return (
                <motion.div
                  key="dashboard-tab"
                  initial={{ opacity: 0.92 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* MOBILE DEDICATED APP LAUNCHER GRID (Guardian Login Form Style) */}
                  <div className="block lg:hidden space-y-3.5 mb-2">
                    {/* Header Banner Card - Guardian Form Style */}
                    <div className="relative overflow-hidden bg-[#111827] text-white rounded-[32px] p-4 sm:p-5 shadow-2xl border border-amber-400/30 transition-all duration-300">
                      
                      {/* Floating Watermark Educational Icons Pattern */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap gap-8 justify-around items-center p-4 text-amber-200">
                        <GraduationCap className="w-12 h-12 stroke-[1.2]" />
                        <Globe className="w-10 h-10 stroke-[1.2]" />
                        <Sparkles className="w-10 h-10 stroke-[1.2]" />
                        <Award className="w-12 h-12 stroke-[1.2]" />
                      </div>

                      {/* Glowing ambient light blobs */}
                      <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

                      {/* TOP CONTROL BAR: Status Pill & View Mode Switcher */}
                      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span>{uiLang === "kh" ? "ប្រព័ន្ធគ្រប់គ្រងសាលា" : "SCHOOL PORTAL"}</span>
                        </div>

                        {/* View Mode Toggle Switcher */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-amber-200/90 font-mono font-bold whitespace-nowrap bg-black/30 px-2 py-0.5 rounded-full border border-white/10 hidden sm:inline-block">
                            {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </span>
                          <div className="flex items-center p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-xs">
                            <button
                              type="button"
                              onClick={() => setMobileViewMode("GRID")}
                              className={`px-3 py-1 rounded-xl text-[10px] font-black transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                                mobileViewMode === "GRID"
                                  ? "bg-amber-400 text-slate-950 shadow-md scale-102"
                                  : "text-amber-100 hover:text-white"
                              }`}
                            >
                              <LayoutGrid className="w-3.5 h-3.5" />
                              <span>{uiLang === "kh" ? "កម្មវិធី" : "Apps"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setMobileViewMode("STATS")}
                              className={`px-3 py-1 rounded-xl text-[10px] font-black transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                                mobileViewMode === "STATS"
                                  ? "bg-amber-400 text-slate-950 shadow-md scale-102"
                                  : "text-amber-100 hover:text-white"
                              }`}
                            >
                              <BarChart2 className="w-3.5 h-3.5" />
                              <span>{uiLang === "kh" ? "ស្ថិតិ" : "Stats"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CENTER GUARDIAN-STYLE HERO HEADER WITH GOLDEN RING LOGO */}
                      <div className="relative z-10 flex items-center gap-3.5 my-2.5 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                        {/* Golden Ring Logo Seal (Guardian Form Style) */}
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border-[3.5px] border-[#f0ab22] ring-4 ring-amber-400/20 shadow-xl shadow-black/40 flex items-center justify-center p-1 shrink-0 relative">
                          {schoolLogo ? (
                            <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain rounded-full" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-[#8f1218] flex flex-col items-center justify-center text-white text-center p-1 border border-amber-300">
                              <GraduationCap className="w-7 h-7 text-amber-300 mb-0.5" />
                              <span className="text-[7px] font-black uppercase tracking-tighter text-amber-200">
                                {(schoolName || "PLC").split(" ")[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title & Info */}
                        <div className="min-w-0 flex-1 space-y-0.5 text-left">
                          <h3 className="text-base sm:text-lg font-black text-white tracking-tight truncate flex items-center gap-1">
                            <span>{uiLang === "kh" ? `សួស្ដី, ${user?.name || "PLC Admin"}` : `Welcome, ${user?.name || "Admin"}`}</span>
                            <span className="text-amber-400 text-sm animate-bounce">👋</span>
                          </h3>
                          <p className="text-[12px] text-amber-300 font-extrabold truncate">
                            {schoolKhmerName || schoolName || (uiLang === "kh" ? "សាលាកុំព្យូទ័រ ភីអិលស៊ី" : "PLC Computer School")}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-amber-400/90 font-bold">
                            <span>⭐</span><span>⭐</span><span>⭐</span>
                            <span className="text-[10px] text-slate-200 font-medium ml-1 truncate">
                              {uiLang === "kh" ? "ប្រព័ន្ធគ្រប់គ្រងសាលារៀនឌីជីថលស្ដង់ដា" : "Standard Digital School Management"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Search Bar matching Guardian Form styling */}
                      {mobileViewMode === "GRID" && (
                        <div className="mt-3 relative z-10">
                          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-300/80" />
                          <input
                            type="text"
                            value={appSearchQuery}
                            onChange={(e) => setAppSearchQuery(e.target.value)}
                            placeholder={uiLang === "kh" ? "ស្វែងរកកម្មវិធី..." : "Search app module..."}
                            className="w-full pl-9 pr-8 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white focus:text-slate-900 text-white placeholder-amber-200/60 border border-amber-400/30 focus:border-amber-400 rounded-xl outline-none text-xs font-bold transition-all shadow-inner"
                          />
                          {appSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setAppSearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white p-1 rounded-full bg-white/10"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* App Icon Buttons Grid - Guardian Form Glossy Icon Style */}
                    {mobileViewMode === "GRID" && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-0.5">
                        {appModules
                          .filter((mod) => {
                            const matchesCat = appCategoryFilter === "all" || mod.category === appCategoryFilter;
                            if (!matchesCat) return false;
                            if (!appSearchQuery) return true;
                            const q = appSearchQuery.toLowerCase();
                            return mod.labelKh.toLowerCase().includes(q) || mod.labelEn.toLowerCase().includes(q);
                          })
                          .map((mod) => {
                            const IconComp = mod.icon;
                            return (
                              <button
                                key={mod.id}
                                type="button"
                                onClick={() => {
                                  if (setActiveTab) {
                                    setActiveTab(mod.id);
                                  }
                                }}
                                className="group relative flex flex-col items-center justify-start p-3 sm:p-3.5 bg-white border border-slate-200/90 rounded-[22px] shadow-xs hover:shadow-lg hover:border-amber-400/60 transition-all duration-200 active:scale-95 cursor-pointer select-none text-center hover:-translate-y-0.5"
                              >
                                {/* App Icon Box with Glossy Gradient & Ring */}
                                <div className={`w-13 h-13 sm:w-15 sm:h-15 rounded-[18px] sm:rounded-[22px] bg-blue-600 flex items-center justify-center text-white ${mod.shadow} shadow-md group-hover:scale-105 group-active:scale-95 transition-all duration-200 mb-2 relative shrink-0 ring-2 ring-white/90`}>
                                  <IconComp className="w-6.5 h-6.5 sm:w-7.5 h-7.5 stroke-[2.2]" />
                                </div>

                                {/* Label */}
                                <span className="text-[11.5px] sm:text-xs font-black text-slate-800 leading-snug px-0.5 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                  {uiLang === "kh" ? mod.labelKh : mod.labelEn}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* DESKTOP / DETAILED STATS */}
                  {/* 3. TOP BANNER BLOCK - Compact Edition */}
                  <div className={`flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-1 select-none font-sans ${mobileViewMode === "GRID" ? "hidden lg:flex" : "flex"}`}>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                          <Layers className="w-4.5 h-4.5 text-primary-500" />
                        </span>
                        <span>
                          {uiLang === "kh" ? "ផ្ទាំងគ្រប់គ្រង និងស្ថិតិសាលា" : uiLang === "en" ? "School Dashboard & Statistics" : "学校仪表盘与统计"}
                        </span>
                      </h2>
                    </div>

                    {/* Right side widgets: local time and sys date */}
                    <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3 shrink-0 self-stretch md:self-auto font-sans">
                      {/* LOCAL PHNOM PENH TIME */}
                      <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-xl py-1.5 px-3 shadow-3xs">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-800 font-mono tracking-wider leading-none">
                            {currentTime.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true
                            })}
                          </p>
                        </div>
                      </div>

                      {/* SYS DATE */}
                      <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-xl py-1.5 px-3 shadow-3xs">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-700 leading-none">
                            {getKhmerDateString(currentTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col xl:flex-row gap-6 ${mobileViewMode === "GRID" ? "hidden lg:flex" : "flex"}`}>
                    <div className="flex-1 space-y-6 min-w-0">
                  {/* 3.1 KPI CARDS - Premium Bento Layout with colored side glows */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Teachers & Staff */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-300 p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-[5px] bg-emerald-500"></div>

                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            {uiLang === "kh" ? "គ្រូបង្រៀន & បុគ្គលិក" : uiLang === "en" ? "TEACHERS & STAFF" : "教职员工总人数"}
                          </p>
                          <div className="w-10 h-10 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-3xs group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                            <GraduationCap className="w-5 h-5 stroke-[2]" />
                          </div>
                        </div>

                        <div className="flex items-end justify-between mb-2">
                          <h3 className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5 font-sans leading-none">
                            {toKhmerNumber(teachers.length)} <span className="text-sm font-bold text-slate-500">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "Staff" : "人"}</span>
                          </h3>
                          <span className="shrink-0 inline-flex items-center gap-1.5 border border-emerald-100/70 bg-emerald-50/80 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap shadow-3xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {uiLang === "kh" ? "សកម្ម" : uiLang === "en" ? "ACTIVE" : "活跃"}
                          </span>
                        </div>
                      </div>

                      {/* Visual Ratio Bar & Numbers */}
                      <div className="mt-4 pt-4 border-t border-slate-100 relative z-10 flex flex-col gap-2.5 shrink-0">
                        <div className="flex items-center justify-between text-[11px] font-black text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                            <span className="text-slate-400">{uiLang === "kh" ? "ស្រី" : "Female"}:</span>
                            <span className="text-slate-700">{toKhmerNumber(femaleTeachers)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">{uiLang === "kh" ? "ប្រុស" : "Male"}:</span>
                            <span className="text-slate-700">{toKhmerNumber(maleTeachers)}</span>
                            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                          </div>
                        </div>
                        
                        {/* Gender Ratio Micro Bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                          {teachers.length > 0 ? (
                            <>
                              <div style={{ width: `${(femaleTeachers / teachers.length) * 100}%` }} className="h-full bg-pink-500 transition-all duration-500"></div>
                              <div style={{ width: `${(maleTeachers / teachers.length) * 100}%` }} className="h-full bg-primary-500 transition-all duration-500"></div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-slate-200"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Student Roster */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-300 p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-[5px] bg-primary-500"></div>

                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            {uiLang === "kh" ? "សិស្សសរុប (បច្ចុប្បន្ន)" : uiLang === "en" ? "STUDENT ROSTER" : "学校在读学生总数"}
                          </p>
                          <div className="w-10 h-10 rounded-xl bg-primary-50/50 border border-primary-100 flex items-center justify-center text-primary-600 shrink-0 shadow-3xs group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                            <Users className="w-5 h-5 stroke-[2]" />
                          </div>
                        </div>

                        <div className="flex items-end justify-between mb-2">
                          <h3 className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5 font-sans leading-none">
                            {toKhmerNumber(students.length)} <span className="text-sm font-bold text-slate-500">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "Active" : "人"}</span>
                          </h3>
                          <span className="shrink-0 inline-flex items-center gap-1.5 border border-primary-100/70 bg-primary-50/80 text-primary-600 text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap shadow-3xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                            {uiLang === "kh" ? "ផ្ទាល់" : uiLang === "en" ? "LIVE" : "现场"}
                          </span>
                        </div>
                      </div>

                      {/* Visual Ratio Bar & Numbers */}
                      <div className="mt-4 pt-4 border-t border-slate-100 relative z-10 flex flex-col gap-2.5 shrink-0">
                        <div className="flex items-center justify-between text-[11px] font-black text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                            <span className="text-slate-400">{uiLang === "kh" ? "ស្រី" : "Female"}:</span>
                            <span className="text-slate-700">{toKhmerNumber(femaleStudents)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">{uiLang === "kh" ? "ប្រុស" : "Male"}:</span>
                            <span className="text-slate-700">{toKhmerNumber(maleStudents)}</span>
                            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                          </div>
                        </div>
                        
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                          {students.length > 0 ? (
                            <>
                              <div style={{ width: `${(femaleStudents / students.length) * 100}%` }} className="h-full bg-pink-500 transition-all duration-500"></div>
                              <div style={{ width: `${(maleStudents / students.length) * 100}%` }} className="h-full bg-primary-500 transition-all duration-500"></div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-slate-200"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Labs & Rooms */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-cyan-500/5 hover:border-cyan-300 p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-[5px] bg-cyan-500"></div>

                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            {uiLang === "kh" ? "ថ្នាក់បង្រៀនទាំងអស់" : uiLang === "en" ? "LABS & ROOMS" : "全部授课班级"}
                          </p>
                          <div className="w-10 h-10 rounded-xl bg-cyan-50/50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0 shadow-3xs group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                            <BookOpen className="w-5 h-5 stroke-[2]" />
                          </div>
                        </div>

                        <div className="flex items-end justify-between mb-2">
                          <h3 className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5 font-sans leading-none">
                            {toKhmerNumber(uniqueCoursesCount)} <span className="text-sm font-bold text-slate-500">{uiLang === "kh" ? "ថ្នាក់" : uiLang === "en" ? "Classes" : "班"}</span>
                          </h3>
                          <span className="shrink-0 inline-flex items-center gap-1.5 border border-cyan-100/70 bg-cyan-50/80 text-cyan-600 text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap shadow-3xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                            {uiLang === "kh" ? "អនឡាញ" : uiLang === "en" ? "ONLINE" : "在线"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 relative z-10 flex flex-col items-start gap-3 shrink-0">
                        <div className="flex flex-wrap gap-1.5 items-center w-full">
                          {displayCourseBadges.map((name, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 border border-slate-200/80 text-slate-600 font-black px-2.5 py-1 rounded-md shadow-3xs">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Tuition Due */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-300 p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-[5px] bg-rose-500"></div>

                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            {uiLang === "kh" ? "ជំពាក់ថ្លៃសិក្សា" : uiLang === "en" ? "TUITION DUE" : "未缴学费账单"}
                          </p>
                          <div className="w-10 h-10 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-3xs group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                            <CreditCard className="w-5 h-5 stroke-[2]" />
                          </div>
                        </div>

                        <div className="flex items-end justify-between mb-2">
                          <h3 className="text-3xl font-black text-rose-600 flex items-baseline gap-0.5 font-sans leading-none">
                            <span className="text-2xl font-bold text-rose-400">$</span>{toKhmerNumber(students.reduce((sum, s) => sum + s.due, 0).toFixed(2))}
                          </h3>
                          <span className="shrink-0 inline-flex items-center gap-1.5 border border-rose-100/70 bg-rose-50/80 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap shadow-3xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            {uiLang === "kh" ? "តេស្ត" : uiLang === "en" ? "TEST" : "测试"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 relative z-10 flex flex-col justify-end shrink-0">
                        <button className="w-full text-center py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100/50 text-rose-600 rounded-xl text-[10px] font-black transition-colors shadow-3xs cursor-pointer active:scale-95 transition-transform duration-200">
                          {uiLang === "kh" ? "សរុបជំពាក់ថ្លៃសិក្សា" : uiLang === "en" ? "TOTAL TUITION BALANCE DUE" : "欠缴学费总金额"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4. MIDDLE SECTION - Analytics Hub with Filter and Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column (Course Filter Panel) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      {(() => {
                        const filteredStudentsForStats = activeCourseFilter
                          ? students.filter(s => s.course === activeCourseFilter)
                          : students;
                        const completedCount = filteredStudentsForStats.filter(s => s.status === "COMPLETED").length;
                        const stopCount = filteredStudentsForStats.filter(s => s.status === "STOP").length;
                        const studyingCount = filteredStudentsForStats.filter(s => s.status === "STUDYING").length;

                        return (
                          <>
                            <div className="h-full flex-1 bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.06)] hover:border-primary-200 p-8 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                              {/* Interactive glow inside card on hover */}
                              <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-500"></div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100">
                                  <h4 className="font-black text-slate-800 text-xs tracking-wider uppercase font-sans flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100/60 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform duration-300">
                                      <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-black text-slate-800">{t("courseFilter")}</span>
                                      {uiLang === "kh" && (
                                        <span className="text-[9px] font-extrabold tracking-widest text-slate-400 mt-0.5">COURSE FILTER</span>
                                      )}
                                    </div>
                                  </h4>
                                  <span className="px-3.5 py-1.5 bg-primary-50 text-primary-700 text-[10px] font-black rounded-full border border-primary-100/50 shadow-3xs">
                                    {students.length > 0 
                                      ? (uiLang === "kh" ? `${toKhmerNumeral(students.length)} នាក់` : uiLang === "zh" ? `${students.length} 人` : `${students.length} Students`) 
                                      : (uiLang === "kh" ? "ទទេ" : uiLang === "zh" ? "无" : "Empty")}
                                  </span>
                                </div>
                                
                                <div className="space-y-3 max-h-[390px] overflow-y-auto pr-1">
                                  {(() => {
                                    const uniqueCourseNames = Array.from(new Set(students.map(s => s.course).filter(Boolean))) as string[];
                                    const sortedCourses = uniqueCourseNames.sort((a, b) => {
                                        const countA = students.filter(s => s.course === a).length;
                                        const countB = students.filter(s => s.course === b).length;
                                        return countB - countA;
                                    });
                                    
                                    const finalCourseList = sortedCourses.includes(activeCourseFilter)
                                      ? sortedCourses
                                      : (activeCourseFilter && activeCourseFilter !== "ALL" ? [activeCourseFilter, ...sortedCourses] : sortedCourses);

                                    return ["ALL", ...finalCourseList].map((courseName, i) => {
                                      const isActive = activeCourseFilter === courseName || (courseName === "ALL" && !activeCourseFilter);
                                      const mainLabel = courseName === "ALL"
                                        ? (uiLang === "kh" ? "ទាំងអស់" : uiLang === "en" ? "ALL" : "全部")
                                        : getCourseTitle(courseName, uiLang);
                                      const subLabel = courseName === "ALL"
                                        ? (uiLang === "kh" ? "គ្រប់មុខវិជ្ជាទាំងអស់" : uiLang === "en" ? "All Courses" : "全部课程")
                                        : getCourseSubtitle(courseName, uiLang);
                                      const courseStudentCount = courseName === "ALL" 
                                        ? students.length 
                                        : students.filter(s => s.course === courseName).length;

                                      // Determine beautiful soft glowing course icons & left border colors
                                      let CourseIcon = Layers;
                                      let iconColorClass = "text-primary-500 bg-primary-50/70 border-primary-100/50";
                                      let bgBorderClass = "hover:border-primary-300";
                                      if (courseName === "Microsoft Office Word") {
                                        CourseIcon = BookOpen;
                                        iconColorClass = "text-sky-500 bg-sky-50/70 border-sky-100/50";
                                        bgBorderClass = "hover:border-sky-300 hover:shadow-sky-50/45";
                                      } else if (courseName === "Microsoft Office Excel") {
                                        CourseIcon = LayoutGrid;
                                        iconColorClass = "text-emerald-500 bg-emerald-50/70 border-emerald-100/50";
                                        bgBorderClass = "hover:border-emerald-300 hover:shadow-emerald-50/45";
                                      } else if (courseName === "Adobe Photoshop" || courseName.includes("Photoshop")) {
                                        CourseIcon = Sparkles;
                                        iconColorClass = "text-blue-500 bg-blue-50/70 border-blue-100/50";
                                        bgBorderClass = "hover:border-blue-300 hover:shadow-blue-50/45";
                                      }

                                      return (
                                        <button
                                          key={i}
                                          onClick={() => setActiveCourseFilter(courseName === "ALL" ? "" : courseName)}
                                          className={`w-full group/btn relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none active:scale-[0.98] focus:outline-none focus:ring-0 ${
                                            isActive 
                                              ? "bg-[#3B82F6] text-white border-transparent shadow-[0_12px_28px_-6px_rgba(59,130,246,0.38)] scale-[1.015]" 
                                              : `bg-slate-50/50 text-slate-700 border-slate-200/60 ${bgBorderClass} hover:bg-white hover:text-primary-950 shadow-3xs hover:-translate-y-0.5 hover:shadow-sm`
                                          }`}
                                        >
                                          <div className="flex items-center gap-3.5">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                              isActive 
                                                ? "bg-white/15 border border-white/10 text-white shadow-inner" 
                                                : `border ${iconColorClass} group-hover/btn:scale-110 group-hover/btn:rotate-6`
                                            }`}>
                                              <CourseIcon className="w-5 h-5 stroke-[2]" />
                                            </div>
                                            <div className="space-y-0.5 text-left">
                                              <p className={`text-[12.5px] font-black tracking-tight transition-colors leading-tight ${isActive ? "text-white" : "text-slate-800 font-sans"}`}>
                                                {mainLabel}
                                              </p>
                                              <p className={`text-[10px] font-extrabold transition-colors leading-none ${isActive ? "text-blue-100" : "text-slate-400 group-hover/btn:text-slate-500"}`}>
                                                {subLabel}
                                              </p>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-2">
                                            {/* Student Count Badge */}
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all duration-300 shadow-3xs ${
                                              isActive 
                                                ? "bg-white/20 text-white border border-white/10" 
                                                : "bg-slate-100/80 text-slate-500 border border-slate-200/60 group-hover/btn:bg-primary-50 group-hover/btn:text-primary-600 group-hover/btn:border-primary-100"
                                            }`}>
                                              {uiLang === "kh" ? `${toKhmerNumeral(courseStudentCount)} នាក់` : uiLang === "zh" ? `${courseStudentCount} 人` : `${courseStudentCount} Students`}
                                            </span>
                                            
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                                              isActive 
                                                ? "bg-white/20 text-white" 
                                                : "bg-slate-100/80 border border-slate-200/80 text-slate-300 group-hover/btn:border-primary-300 group-hover/btn:text-primary-500 group-hover/btn:bg-primary-50"
                                            }`}>
                                              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? "translate-x-0.5" : "group-hover/btn:translate-x-0.5"}`} />
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>
                            </div>
                            
                            {/* ស្ថិតិហិរញ្ញវត្ថុ និងចំណូល (FINANCE TELEMETRY) */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] hover:border-emerald-300 p-8 transition-all duration-300 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-full h-[6px] bg-emerald-500"></div>
                              <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>

                              <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                                  <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-emerald-500 shadow-3xs group-hover:scale-105 transition-transform">
                                      <Activity className="w-6 h-6 stroke-[2]" />
                                    </div>
                                    <div className="flex flex-col">
                                      <h4 className="font-black text-slate-800 text-[13px] tracking-wide uppercase font-sans">
                                        {t("financeTelemetry")}
                                      </h4>
                                    </div>
                                  </div>
                                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100/50 shadow-3xs uppercase tracking-wider">
                                    {t("liveState")}
                                  </span>
                                </div>

                                {/* Body */}
                                <div className="flex flex-col gap-8 items-center">
                                  {/* Left: Donut Chart */}
                                  <div className="w-full flex justify-center relative">
                                    {(() => {
                                      const filteredStudentsForFinances = activeCourseFilter
                                        ? students.filter(s => s.course === activeCourseFilter)
                                        : students;
                                      
                                      const totalReceived = filteredStudentsForFinances.reduce((sum, s) => sum + (Number(s.paid) || 0), 0);
                                      const totalBalanceDue = filteredStudentsForFinances.reduce((sum, s) => sum + (Number(s.due) || 0), 0);
                                      const totalVolume = totalReceived + totalBalanceDue;

                                      const donutData = [
                                        { name: "RECEIVED", value: totalReceived > 0 ? totalReceived : 0.0001, color: "#10b981" },
                                        { name: "BALANCE DUE", value: totalBalanceDue > 0 ? totalBalanceDue : 0.0001, color: "#3b82f6" }
                                      ];

                                      return (
                                        <div className="w-40 h-40 relative flex items-center justify-center">
                                          <div className="absolute w-32 h-32 rounded-full border border-slate-100/80 bg-slate-50/50 shadow-inner flex flex-col items-center justify-center z-0"></div>
                                          <div className="w-full h-full z-10 relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <PieChart>
                                                <Pie
                                                  data={donutData}
                                                  cx="50%"
                                                  cy="50%"
                                                  innerRadius={50}
                                                  outerRadius={70}
                                                  paddingAngle={3}
                                                  dataKey="value"
                                                >
                                                  {donutData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                  ))}
                                                </Pie>
                                              </PieChart>
                                            </ResponsiveContainer>
                                          </div>
                                          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none z-20">
                                            <span className="text-[18px] font-black text-slate-900 font-mono tracking-tight">${totalVolume.toFixed(2)}</span>
                                            <span className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-wider font-sans">{uiLang === "kh" ? "សរុប" : uiLang === "en" ? "VOLUME" : "总量"}</span>
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>

                                  {/* Right: Legend info */}
                                  <div className="w-full space-y-3.5">
                                    {(() => {
                                      const filteredStudentsForFinances = activeCourseFilter
                                        ? students.filter(s => s.course === activeCourseFilter)
                                        : students;
                                      
                                      const totalReceived = filteredStudentsForFinances.reduce((sum, s) => sum + (Number(s.paid) || 0), 0);
                                      const totalBalanceDue = filteredStudentsForFinances.reduce((sum, s) => sum + (Number(s.due) || 0), 0);
                                      const totalVolume = totalReceived + totalBalanceDue;

                                      return (
                                        <>
                                          {/* RECEIVED ROW */}
                                          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/50 shadow-3xs hover:bg-emerald-50/70 transition-all duration-200">
                                            <div className="flex items-center gap-3">
                                              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-3xs shrink-0">
                                                <CheckCircle className="w-4.5 h-4.5 stroke-[2.5]" />
                                              </div>
                                              <div className="flex flex-col text-left leading-none">
                                                <span className="text-[12px] font-black text-emerald-800 tracking-wide">{t("received")}</span>
                                                {uiLang === "kh" && (
                                                  <span className="text-[9px] font-extrabold text-slate-400 mt-1 uppercase">RECEIVED</span>
                                                )}
                                              </div>
                                            </div>
                                            <span className="text-[16px] font-black text-emerald-600 font-mono">${totalReceived.toFixed(2)}</span>
                                          </div>

                                          {/* BALANCE DUE ROW */}
                                          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100/50 shadow-3xs hover:bg-blue-50/70 transition-all duration-200">
                                            <div className="flex items-center gap-3">
                                              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-3xs shrink-0">
                                                <Clock className="w-4.5 h-4.5 stroke-[2.5]" />
                                              </div>
                                              <div className="flex flex-col text-left leading-none">
                                                <span className="text-[12px] font-black text-blue-800 tracking-wide">{t("balanceDue")}</span>
                                                {uiLang === "kh" && (
                                                  <span className="text-[9px] font-extrabold text-slate-400 mt-1 uppercase">BALANCE DUE</span>
                                                )}
                                              </div>
                                            </div>
                                            <span className="text-[16px] font-black text-blue-600 font-mono">${totalBalanceDue.toFixed(2)}</span>
                                          </div>

                                          {/* TOTAL REVENUE ROW */}
                                          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-3xs hover:bg-slate-200/50 transition-all duration-200">
                                            <div className="flex items-center gap-3">
                                              <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-3xs shrink-0">
                                                <DollarSign className="w-4.5 h-4.5 stroke-[2.5]" />
                                              </div>
                                              <div className="flex flex-col text-left leading-none">
                                                <span className="text-[12px] font-black text-slate-800 tracking-wide">{t("grandRevenue")}</span>
                                                {uiLang === "kh" && (
                                                  <span className="text-[9px] font-extrabold text-slate-450 mt-1 uppercase">GRAND REVENUE</span>
                                                )}
                                              </div>
                                            </div>
                                            <span className="text-[16px] font-black text-slate-800 font-mono">${totalVolume.toFixed(2)}</span>
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* ស្ថិតិ និងព័ត៌មានគ្រូ (TEACHERS TELEMETRY) */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.08)] hover:border-blue-300 p-8 transition-all duration-300 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-full h-[6px] bg-blue-500"></div>
                              <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-500"></div>

                              <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                                  <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-blue-500 shadow-3xs group-hover:scale-105 transition-transform">
                                      <GraduationCap className="w-6 h-6 stroke-[2]" />
                                    </div>
                                    <div className="flex flex-col">
                                      <h4 className="font-black text-slate-800 text-[12px] tracking-wide uppercase font-sans">
                                        {uiLang === "kh" ? "ស្ថិតិ និងព័ត៌មានគ្រូ (TEACHERS TELEMETRY)" :
                                         uiLang === "en" ? "Teachers Telemetry" : "教师与特殊技能统计"}
                                      </h4>
                                    </div>
                                  </div>
                                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[9px] font-black rounded-full border border-blue-100/50 shadow-3xs uppercase tracking-wider">
                                    {uiLang === "kh" ? "ស្ថិតិបុគ្គលិក" :
                                     uiLang === "en" ? "STAFF METRICS" : "教职工指标"}
                                  </span>
                                </div>

                                {/* Body */}
                                <div className="flex flex-col gap-8 items-center">
                                  {/* Left: Donut Chart & Gender breakdown */}
                                  <div className="w-full flex flex-col items-center gap-5">
                                    {(() => {
                                      const totalTeachers = teachers.length;
                                      const maleTeachersCount = teachers.filter(t => t.gender === 'Male').length;
                                      const femaleTeachersCount = teachers.filter(t => t.gender === 'Female').length;

                                      const teacherDonutData = [
                                        { name: "Male", value: maleTeachersCount > 0 ? maleTeachersCount : 0.0001, color: "#0ea5e9" },
                                        { name: "Female", value: femaleTeachersCount > 0 ? femaleTeachersCount : 0.0001, color: "#ec4899" }
                                      ];

                                      return (
                                        <>
                                          <div className="w-36 h-36 relative flex items-center justify-center">
                                            <div className="absolute w-28 h-28 rounded-full border border-slate-100 bg-slate-50/50 shadow-inner flex flex-col items-center justify-center z-0"></div>
                                            <div className="w-full h-full z-10 relative">
                                              <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                  <Pie
                                                    data={teacherDonutData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={48}
                                                    outerRadius={65}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                  >
                                                    {teacherDonutData.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                  </Pie>
                                                </PieChart>
                                              </ResponsiveContainer>
                                            </div>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none z-20">
                                              <span className="text-2xl font-black text-slate-900 font-sans">{toKhmerNumber(totalTeachers)}</span>
                                              <span className="text-[11px] font-black text-slate-400 mt-1">
                                                {uiLang === "kh" ? "គ្រូសរុប" :
                                                 uiLang === "en" ? "Total Teachers" : "教师总数"}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2 mt-1 w-full justify-center">
                                            <div className="flex items-center gap-1.5 bg-sky-50/80 border border-sky-100 px-2.5 py-1 rounded-xl shadow-3xs whitespace-nowrap">
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse shrink-0"></span>
                                              <span className="text-sky-800 text-[10px] font-black">
                                                {uiLang === "kh" ? `ប្រុស: ${toKhmerNumber(maleTeachersCount)} នាក់` :
                                                 uiLang === "en" ? `Male: ${maleTeachersCount}` : `男: ${maleTeachersCount} 人`}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-pink-50/80 border border-pink-100 px-2.5 py-1 rounded-xl shadow-3xs whitespace-nowrap">
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] animate-pulse shrink-0"></span>
                                              <span className="text-pink-800 text-[10px] font-black">
                                                {uiLang === "kh" ? `ស្រី: ${toKhmerNumber(femaleTeachersCount)} នាក់` :
                                                 uiLang === "en" ? `Female: ${femaleTeachersCount}` : `女: ${femaleTeachersCount} 人`}
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>

                                  {/* Right: Specialties progress bars */}
                                  <div className="w-full space-y-4">
                                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-wider text-left">
                                      {uiLang === "kh" ? "ចំណែកគ្រូតាមជំនាញ (SPECIALTIES)" :
                                       uiLang === "en" ? "Specialties" : "教学专业占比"}
                                    </h5>
                                    
                                    <div className="space-y-4">
                                      {(() => {
                                        const totalTeachers = teachers.length;
                                        const specialtiesMap: { [key: string]: number } = {};                                        teachers.forEach(t => {
                                          const cleanSpec = t.specialty.split("(")[0].trim();
                                          specialtiesMap[cleanSpec] = (specialtiesMap[cleanSpec] || 0) + 1;
                                        });

                                        const specialtiesList = Object.entries(specialtiesMap).map(([name, count]) => ({
                                          name,
                                          count
                                        }));

                                        return specialtiesList.map((spec, idx) => {
                                          const percentage = totalTeachers > 0 ? (spec.count / totalTeachers) * 100 : 0;
                                          let barColorClass = "bg-primary-500";
                                          let bgPillClass = "bg-primary-50 text-primary-700 border-primary-150/40";
                                          
                                          if (spec.name.includes("Word")) {
                                            barColorClass = "bg-sky-500";
                                            bgPillClass = "bg-sky-50 text-blue-700 border-sky-150/40";
                                          } else if (spec.name.includes("Excel")) {
                                            barColorClass = "bg-emerald-500";
                                            bgPillClass = "bg-emerald-50 text-emerald-700 border-emerald-150/40";
                                          } else if (spec.name.includes("Photoshop")) {
                                            barColorClass = "bg-blue-500";
                                            bgPillClass = "bg-blue-50 text-blue-700 border-blue-100/40";
                                          }

                                          return (
                                            <div key={idx} className="space-y-1.5 group/spec transition-all duration-200">
                                              <div className="flex items-start justify-between gap-3 text-[11px] font-black text-slate-800 leading-tight">
                                                <span className="group-hover/spec:text-primary-600 transition-colors flex-1 mt-0.5">
                                                  {translateCourseOrSpecialtyName(spec.name, uiLang)}
                                                </span>
                                                <span className={`px-2 py-1 border rounded-md text-[9px] font-black font-sans shrink-0 whitespace-nowrap leading-none ${bgPillClass}`}>
                                                  {uiLang === "kh" ? `${toKhmerNumber(spec.count)} នាក់` :
                                                   uiLang === "en" ? `${spec.count} teachers` : `${spec.count} 人`} ({Math.round(percentage)}%)
                                                </span>
                                              </div>
                                              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/30">
                                                <div 
                                                  style={{ width: `${percentage}%` }}
                                                  className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
                                                ></div>
                                              </div>
                                            </div>
                                          );
                                        });
                                      })()}
                    
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Middle Column (Main Chart) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                      <div className="h-full flex-1 bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_50px_rgba(15,23,42,0.025)] hover:shadow-[0_30px_80px_rgba(99,102,241,0.08)] hover:border-primary-200/60 p-6 sm:p-8 flex flex-col justify-start gap-3 transition-all duration-500 relative overflow-hidden font-sans group">
                        
                        {/* Elegant background backdrops for rich visual depth */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50/50 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-slate-50/30 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative z-10">
                          {/* Header section */}
                          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-4 border-b border-slate-100 pb-5">
                            <div className="flex items-center gap-4">
                              {/* Icon container */}
                              <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(99,102,241,0.3)] relative group-hover:scale-105 transition-transform duration-300">
                                <span className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></span>
                                <BarChart2 className="w-6 h-6 stroke-[2]" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                                  </span>
                                  <h4 className="font-extrabold text-slate-900 text-[15px] tracking-tight font-sans">
                                    {t("schoolAnalytics")}
                                  </h4>
                                </div>
                                <p className="text-[11.5px] text-slate-450 font-medium leading-relaxed">
                                  {uiLang === "kh" ? "បង្ហាញទិន្នន័យទូទៅរបស់សាលា និងការប្រៀបធៀបតាមមុខវិជ្ជា" :
                                   uiLang === "en" ? "Display overall school statistics and course comparisons" :
                                   "显示学校总体统计数据及各学科对比"}
                                </p>
                              </div>
                            </div>
                            
                            {/* Segmented control view switcher - gorgeous Apple-style */}
                            <div className="bg-slate-100/90 backdrop-blur-md p-1 rounded-2xl inline-flex gap-1 border border-slate-200/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] self-start xl:self-auto">
                              <button
                                onClick={() => setChartTab('courses')}
                                className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 cursor-pointer flex items-center gap-2 select-none active:scale-[0.97] border focus:outline-none focus:ring-0 ${
                                  chartTab === 'courses'
                                    ? "bg-white text-primary-600 shadow-sm border-slate-200/30"
                                    : "border-transparent text-slate-550 hover:text-primary-950 hover:bg-white/40"
                                }`}
                              >
                                <Users className={`w-3.5 h-3.5 transition-all duration-300 ${chartTab === 'courses' ? 'text-primary-600 scale-110' : 'text-slate-450'}`} />
                                {t("genderSplit")}
                              </button>
                              <button
                                onClick={() => setChartTab('revenue')}
                                className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 cursor-pointer flex items-center gap-2 select-none active:scale-[0.97] border focus:outline-none focus:ring-0 ${
                                  chartTab === 'revenue'
                                    ? "bg-emerald-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.35)] border-transparent -translate-y-0.5"
                                    : "border-transparent text-slate-550 hover:text-emerald-600 hover:bg-emerald-50/40"
                                }`}
                              >
                                <TrendingUp className={`w-3.5 h-3.5 transition-all duration-300 ${chartTab === 'revenue' ? 'text-white scale-120 drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)] animate-pulse' : 'text-slate-450'}`} />
                                <span>{t("finances")}</span>
                                {chartTab === 'revenue' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-ping ml-0.5"></span>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Legends with customized rounded color marks */}
                          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-extrabold text-slate-500 mb-3 justify-end">
                            {chartTab === 'courses' ? (
                              <>
                                <div className="flex items-center gap-2 bg-pink-50/50 border border-pink-100/40 px-3.5 py-1.5 rounded-full shadow-3xs">
                                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block animate-pulse"></span>
                                  <span className="font-sans text-pink-700 text-[10px] font-extrabold uppercase tracking-wide">
                                    {uiLang === "kh" ? "ស្រី (Female)" : uiLang === "en" ? "Female" : "女 (Female)"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50/50 border border-blue-100/40 px-3.5 py-1.5 rounded-full shadow-3xs">
                                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                                  <span className="font-sans text-blue-700 text-[10px] font-extrabold uppercase tracking-wide">
                                    {uiLang === "kh" ? "ប្រុស (Male)" : uiLang === "en" ? "Male" : "男 (Male)"}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100/40 px-3.5 py-1.5 rounded-full shadow-3xs">
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                  <span className="font-sans text-emerald-700 text-[10px] font-extrabold uppercase tracking-wide">
                                    {uiLang === "kh" ? "ទទួលបានរួច (Collected)" : uiLang === "en" ? "Collected" : "已收金额 (Collected)"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 bg-rose-50/50 border border-rose-100/40 px-3.5 py-1.5 rounded-full shadow-3xs">
                                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse"></span>
                                  <span className="font-sans text-rose-700 text-[10px] font-extrabold uppercase tracking-wide">
                                    {uiLang === "kh" ? "ជំពាក់ (Due)" : uiLang === "en" ? "Due" : "未付金额 (Due)"}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                      {/* BarChart/LineChart wrapped in a beautiful structured nested panel */}
                      <div className="flex-1 min-h-[320px] bg-slate-50/30 border border-slate-100 rounded-[2rem] p-5 sm:p-6 relative z-10 flex flex-col justify-center">
                        <div className="h-80 sm:h-96 w-full min-w-0 font-sans">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            {chartTab === 'courses' ? (
                              <BarChart
                                data={chartData}
                                margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                                barGap={6}
                              >
                                <defs>
                                  <linearGradient id="femaleGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#d946ef" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                  </linearGradient>
                                  <linearGradient id="maleGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#0ea5e9" />
                                  </linearGradient>
                                  <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#34d399" />
                                  </linearGradient>
                                  <linearGradient id="dueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f43f5e" />
                                    <stop offset="100%" stopColor="#fb923c" />
                                  </linearGradient>

                                  {/* Premium SVG shadow filters for floating depth */}
                                  <filter id="femaleShadow" x="-10%" y="-10%" width="120%" height="120%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#d946ef" floodOpacity="0.12" />
                                  </filter>
                                  <filter id="maleShadow" x="-10%" y="-10%" width="120%" height="120%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.12" />
                                  </filter>
                                  <filter id="collectedShadow" x="-10%" y="-10%" width="120%" height="120%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#10b981" floodOpacity="0.12" />
                                  </filter>
                                  <filter id="dueShadow" x="-10%" y="-10%" width="120%" height="120%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.12" />
                                  </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.8} />
                                <XAxis 
                                  dataKey="name" 
                                  tick={{ fill: "#64748b", fontSize: 10.5, fontWeight: "800" }}
                                  axisLine={false}
                                  tickLine={false}
                                  dy={10}
                                  interval={0}
                                  tickFormatter={(val: string) => {
                                    if (!val) return "";
                                    let clean = val.replace(/^វគ្គសិក្សា\s*/i, "").trim();
                                    if (clean.length > 16) {
                                      return clean.substring(0, 14) + "…";
                                    }
                                    return clean;
                                  }}
                                />
                                <YAxis 
                                  tick={{ fill: "#64748b", fontSize: 10.5, fontWeight: "700" }}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <Tooltip 
                                  cursor={{ fill: "rgba(99, 102, 241, 0.03)", radius: [16, 16, 0, 0] }}
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-slate-900/95 backdrop-blur-xl text-slate-100 p-4.5 rounded-2xl shadow-2xl border border-white/10 text-xs font-semibold leading-relaxed min-w-[240px] font-sans">
                                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-ping"></div>
                                            <p className="font-black text-[13px] text-white leading-none">{data.fullName || label}</p>
                                          </div>
                                          <div className="space-y-2">
                                            {payload.map((p: any, idx: number) => {
                                              const isCollected = p.name === collectedKey;
                                              const isDue = p.name === dueKey;
                                              const valueStr = typeof p.value === "number" && (isCollected || isDue)
                                                ? `$${p.value.toFixed(2)}` 
                                                : uiLang === "kh" ? `${toKhmerNumeral(p.value)} នាក់` : uiLang === "zh" ? `${p.value} 人` : `${p.value} students`;
                                              return (
                                                <div key={idx} className="flex items-center gap-4 justify-between">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: p.color }}></span>
                                                    <span className="text-slate-300 text-[11px] font-bold">{p.name}:</span>
                                                  </div>
                                                  <span className="font-extrabold font-mono text-white text-[12.5px] bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                                    {valueStr}
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Bar 
                                  dataKey={femaleKey} 
                                  fill="url(#femaleGrad)" 
                                  radius={[10, 10, 0, 0]} 
                                  maxBarSize={34}
                                  filter="url(#femaleShadow)"
                                />
                                <Bar 
                                  dataKey={maleKey} 
                                  fill="url(#maleGrad)" 
                                  radius={[10, 10, 0, 0]} 
                                  maxBarSize={34}
                                  filter="url(#maleShadow)"
                                />
                              </BarChart>
                            ) : (
                              <RechartsLineChart
                                data={chartData}
                                margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.8} />
                                <XAxis 
                                  dataKey="name" 
                                  tick={{ fill: "#64748b", fontSize: 10.5, fontWeight: "800" }}
                                  axisLine={false}
                                  tickLine={false}
                                  dy={10}
                                  interval={0}
                                  tickFormatter={(val: string) => {
                                    if (!val) return "";
                                    let clean = val.replace(/^វគ្គសិក្សា\s*/i, "").trim();
                                    if (clean.length > 16) {
                                      return clean.substring(0, 14) + "…";
                                    }
                                    return clean;
                                  }}
                                />
                                <YAxis 
                                  tick={{ fill: "#64748b", fontSize: 10.5, fontWeight: "700" }}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <Tooltip 
                                  cursor={{ stroke: "rgba(16, 185, 129, 0.15)", strokeWidth: 1 }}
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-slate-900/95 backdrop-blur-xl text-slate-100 p-4.5 rounded-2xl shadow-2xl border border-white/10 text-xs font-semibold leading-relaxed min-w-[240px] font-sans">
                                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                                            <p className="font-black text-[13px] text-white leading-none">{data.fullName || label}</p>
                                          </div>
                                          <div className="space-y-2">
                                            {payload.map((p: any, idx: number) => {
                                              const isCollected = p.name === collectedKey;
                                              const isDue = p.name === dueKey;
                                              const valueStr = typeof p.value === "number" && (isCollected || isDue)
                                                ? `$${p.value.toFixed(2)}` 
                                                : uiLang === "kh" ? `${toKhmerNumeral(p.value)} នាក់` : uiLang === "zh" ? `${p.value} 人` : `${p.value} students`;
                                              return (
                                                <div key={idx} className="flex items-center gap-4 justify-between">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: p.color }}></span>
                                                    <span className="text-slate-300 text-[11px] font-bold">{p.name}:</span>
                                                  </div>
                                                  <span className="font-extrabold font-mono text-white text-[12.5px] bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                                    {valueStr}
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Line 
                                  type="monotone"
                                  dataKey={collectedKey} 
                                  stroke="#10b981" 
                                  strokeWidth={4}
                                  activeDot={{ r: 6, strokeWidth: 0 }}
                                  dot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
                                />
                                <Line 
                                  type="monotone"
                                  dataKey={dueKey} 
                                  stroke="#f43f5e" 
                                  strokeWidth={4}
                                  activeDot={{ r: 6, strokeWidth: 0 }}
                                  dot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
                                />
                              </RechartsLineChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-450 font-bold relative z-10">
                        <span className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-100/60 px-3.5 py-1.5 rounded-full text-emerald-800 text-[10px] font-black shadow-3xs">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          {uiLang === "kh" ? "ទិន្នន័យជាក់ស្តែងពី Database" :
                           uiLang === "en" ? "Live Database Sync" : "数据库实时同步"}
                        </span>
                        <span className="font-sans px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-[9.5px]">PLC PORTAL v10.0.0</span>
                      </div>
                    </div>

                    {/* OVERALL GENDER STATUS COMPARISON / យេនឌ័រ */}
                    {(() => {
                      const filteredStudentsForStats = activeCourseFilter
                        ? students.filter(s => s.course === activeCourseFilter)
                        : students;
                      const totalCount = filteredStudentsForStats.length;
                      const femaleStudents = filteredStudentsForStats.filter(s => s.gender === "Female");
                      const maleStudents = filteredStudentsForStats.filter(s => s.gender === "Male");
                      const femaleCount = femaleStudents.length;
                      const maleCount = maleStudents.length;

                      const femalePercentage = totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0;
                      const malePercentage = totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0;

                      const femaleStudying = femaleStudents.filter(s => s.status === "STUDYING").length;
                      const femaleStopped = femaleStudents.filter(s => s.status === "STOP").length;
                      const femaleCompleted = femaleStudents.filter(s => s.status === "COMPLETED").length;

                      const maleStudying = maleStudents.filter(s => s.status === "STUDYING").length;
                      const maleStopped = maleStudents.filter(s => s.status === "STOP").length;
                      const maleCompleted = maleStudents.filter(s => s.status === "COMPLETED").length;

                      return (
                        <div className="lg:col-span-12 bg-white rounded-[2.5rem] border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] hover:border-primary-300 p-8 transition-all duration-300 relative overflow-hidden group">
                          {/* Interactive background glow */}
                          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-500"></div>

                          <div className="relative z-10 flex flex-col gap-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                              <div className="flex items-start gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100/60 flex items-center justify-center text-primary-500 shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
                                  <Users className="w-6 h-6 stroke-[2]" />
                                </div>
                                <div className="flex flex-col text-left">
                                  <h4 className="font-black text-slate-800 text-[13px] tracking-wide uppercase font-sans">
                                    👥 {t("overallGenderStats")}
                                  </h4>
                                  <span className="text-[10px] font-extrabold text-slate-400 mt-1 leading-tight">
                                    {t("genderStatusBreakdown")}
                                  </span>
                                </div>
                              </div>
                              <span className="px-4 py-1.5 bg-primary-50 text-primary-700 text-[10px] font-black tracking-widest uppercase rounded-full border border-primary-100/50 shadow-3xs shrink-0 font-sans">
                                {t("rosterRatios")}
                              </span>
                            </div>

                            {/* Ratio Split Bar Card */}
                            <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-5 shadow-3xs">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">                                {/* Female Summary Pill */}
                                <div className="flex items-center gap-2.5 bg-rose-50/60 border border-rose-100/60 px-3.5 py-1.5 rounded-xl shadow-3xs">
                                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                                  <span className="text-[12.5px] font-black text-rose-800">
                                    {t("female")}: {uiLang === "kh" ? toKhmerNumber(femaleCount) : femaleCount} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : "students"}
                                  </span>
                                </div>
                                
                                {/* Ratios badges */}
                                <div className="flex items-center gap-1.5 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/50 text-[10px] font-black shadow-inner self-center font-sans">
                                  <span className="px-3 py-1 bg-white border border-rose-200/50 text-rose-600 rounded-lg shadow-3xs">
                                    {uiLang === "kh" ? "ស្រី" : uiLang === "zh" ? "女" : "Female"} {uiLang === "kh" ? toKhmerNumber(femalePercentage) : femalePercentage}%
                                  </span>
                                  <span className="px-3 py-1 bg-white border border-sky-200/50 text-sky-600 rounded-lg shadow-3xs">
                                    {uiLang === "kh" ? "ប្រុស" : uiLang === "zh" ? "男" : "Male"} {uiLang === "kh" ? toKhmerNumber(malePercentage) : malePercentage}%
                                  </span>
                                </div>

                                {/* Male Summary Pill */}
                                <div className="flex items-center gap-2.5 bg-sky-50/60 border border-sky-100/60 px-3.5 py-1.5 rounded-xl shadow-3xs">
                                  <span className="text-[12.5px] font-black text-sky-800">
                                    {t("male")}: {uiLang === "kh" ? toKhmerNumber(maleCount) : maleCount} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : "students"}
                                  </span>
                                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                                </div>
                              </div>

                              {/* Progress Split Bar */}
                              <div className="w-full h-4 bg-slate-100/80 rounded-full overflow-hidden flex shadow-inner border border-slate-200/40 p-[2px]">
                                {totalCount > 0 ? (
                                  <>
                                    <div 
                                      style={{ width: `${femalePercentage}%` }} 
                                      className="h-full bg-pink-500 rounded-full transition-all duration-500 shadow-3xs"
                                    ></div>
                                    <div 
                                      style={{ width: `${malePercentage}%` }} 
                                      className="h-full bg-sky-500 rounded-full transition-all duration-500 shadow-3xs"
                                    ></div>
                                  </>
                                ) : (
                                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[9px] text-slate-400 font-bold">
                                    គ្មានទិន្នន័យ
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Two Side-By-Side Micro Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                              {/* Female Breakdown Card */}
                              <div className="bg-rose-50/20 border border-rose-100/60 shadow-[0_8px_30px_rgba(244,63,94,0.02)] hover:shadow-[0_12px_40px_rgba(244,63,94,0.05)] hover:border-rose-200/80 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 font-sans">
                                <div className="flex items-center justify-between border-b border-rose-100/50 pb-4 mb-5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-100/50 text-rose-500 flex items-center justify-center border border-rose-200/30 shadow-3xs">
                                      <span className="text-base">👧</span>
                                    </div>
                                    <div className="flex flex-col text-left">
                                      <span className="text-[13px] font-black text-rose-700 leading-none">{t("female")}</span>
                                      {uiLang === "kh" && (
                                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5">FEMALE RATIO</span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="px-3 py-1.5 bg-rose-500 text-white border border-rose-600/20 text-[11px] font-black rounded-xl shadow-3xs leading-none">
                                    {t("total")}: {uiLang === "kh" ? toKhmerNumber(femaleCount) : femaleCount} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : "students"}
                                  </span>
                                </div>

                                <div className="space-y-3.5">
                                  {/* STUDYING */}
                                  <div className="p-4 rounded-2xl bg-white border border-slate-100/70 border-l-[4px] border-l-emerald-500 shadow-3xs hover:shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
                                    <div className="flex items-center justify-between text-[12px] font-black text-slate-800 mb-2.5">
                                      <span className="flex items-center gap-2.5 text-emerald-700 text-[10.5px] font-black tracking-wide">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                                          <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        {t("studying")}
                                      </span>
                                      <span className="bg-emerald-50 px-2.5 py-1 rounded-md text-[11px] font-black text-emerald-700 font-sans border border-emerald-100/50">
                                        {uiLang === "kh" ? toKhmerNumber(femaleStudying) : femaleStudying} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : ""} ({femaleCount > 0 ? Math.round((femaleStudying/femaleCount)*100) : 0}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                                      <div 
                                        style={{ width: `${femaleCount > 0 ? (femaleStudying/femaleCount)*100 : 0}%` }}
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                      ></div>
                                    </div>
                                  </div>

                                  {/* STOPPED */}
                                  <div className="p-4 rounded-2xl bg-white border border-slate-100/70 border-l-[4px] border-l-amber-500 shadow-3xs hover:shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
                                    <div className="flex items-center justify-between text-[12px] font-black text-slate-800 mb-2.5">
                                      <span className="flex items-center gap-2.5 text-amber-700 text-[10.5px] font-black tracking-wide">
                                        <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                                          <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        {t("stopped")}
                                      </span>
                                      <span className="bg-amber-50 px-2.5 py-1 rounded-md text-[11px] font-black text-amber-700 font-sans border border-amber-100/50">
                                        {uiLang === "kh" ? toKhmerNumber(femaleStopped) : femaleStopped} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : ""} ({femaleCount > 0 ? Math.round((femaleStopped/femaleCount)*100) : 0}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                                      <div 
                                        style={{ width: `${femaleCount > 0 ? (femaleStopped/femaleCount)*100 : 0}%` }}
                                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                      ></div>
                                    </div>
                                  </div>

                                  {/* COMPLETED */}
                                  <div className="p-4 rounded-2xl bg-white border border-slate-100/70 border-l-[4px] border-l-blue-500 shadow-3xs hover:shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
                                    <div className="flex items-center justify-between text-[12px] font-black text-slate-800 mb-2.5">
                                      <span className="flex items-center gap-2.5 text-blue-700 text-[10.5px] font-black tracking-wide">
                                        <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                                          <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        {t("completed")}
                                      </span>
                                      <span className="bg-blue-50 px-2.5 py-1 rounded-md text-[11px] font-black text-blue-700 font-sans border border-blue-100/50">
                                        {uiLang === "kh" ? toKhmerNumber(femaleCompleted) : femaleCompleted} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : ""} ({femaleCount > 0 ? Math.round((femaleCompleted/femaleCount)*100) : 0}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                                      <div 
                                        style={{ width: `${femaleCount > 0 ? (femaleCompleted/femaleCount)*100 : 0}%` }}
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Male Breakdown Card */}
                              <div className="bg-sky-50/20 border border-sky-100/60 shadow-[0_8px_30px_rgba(14,165,233,0.02)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.05)] hover:border-sky-200/80 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 font-sans">
                                <div className="flex items-center justify-between border-b border-sky-100/50 pb-4 mb-5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-sky-100/50 text-sky-500 flex items-center justify-center border border-sky-200/30 shadow-3xs">
                                      <span className="text-base">👦</span>
                                    </div>
                                    <div className="flex flex-col text-left">
                                      <span className="text-[13px] font-black text-sky-700 leading-none">{t("male")}</span>
                                      {uiLang === "kh" && (
                                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5">MALE RATIO</span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="px-3 py-1.5 bg-sky-500 text-white border border-sky-600/20 text-[11px] font-black rounded-xl shadow-3xs leading-none">
                                    {t("total")}: {uiLang === "kh" ? toKhmerNumber(maleCount) : maleCount} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : "students"}
                                  </span>
                                </div>

                                <div className="space-y-3.5">
                                  {/* STUDYING */}
                                  <div className="p-4 rounded-2xl bg-white border border-slate-100/70 border-l-[4px] border-l-emerald-500 shadow-3xs hover:shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
                                    <div className="flex items-center justify-between text-[12px] font-black text-slate-800 mb-2.5">
                                      <span className="flex items-center gap-2.5 text-emerald-700 text-[10.5px] font-black tracking-wide">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                                          <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        {t("studying")}
                                      </span>
                                      <span className="bg-emerald-50 px-2.5 py-1 rounded-md text-[11px] font-black text-emerald-700 font-sans border border-emerald-100/50">
                                        {uiLang === "kh" ? toKhmerNumber(maleStudying) : maleStudying} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : ""} ({maleCount > 0 ? Math.round((maleStudying/maleCount)*100) : 0}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                                      <div 
                                        style={{ width: `${maleCount > 0 ? (maleStudying/maleCount)*100 : 0}%` }}
                                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                      ></div>
                                    </div>
                                  </div>

                                  {/* STOPPED */}
                                  <div className="p-4 rounded-2xl bg-white border border-slate-100/70 border-l-[4px] border-l-amber-500 shadow-3xs hover:shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
                                    <div className="flex items-center justify-between text-[12px] font-black text-slate-800 mb-2.5">
                                      <span className="flex items-center gap-2.5 text-amber-700 text-[10.5px] font-black tracking-wide">
                                        <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                                          <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        {t("stopped")}
                                      </span>
                                      <span className="bg-amber-50 px-2.5 py-1 rounded-md text-[11px] font-black text-amber-700 font-sans border border-amber-100/50">
                                        {uiLang === "kh" ? toKhmerNumber(maleStopped) : maleStopped} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : ""} ({maleCount > 0 ? Math.round((maleStopped/maleCount)*100) : 0}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                                      <div 
                                        style={{ width: `${maleCount > 0 ? (maleStopped/maleCount)*100 : 0}%` }}
                                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                      ></div>
                                    </div>
                                  </div>

                                  {/* COMPLETED */}
                                  <div className="p-4 rounded-2xl bg-white border border-slate-100/70 border-l-[4px] border-l-blue-500 shadow-3xs hover:shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
                                    <div className="flex items-center justify-between text-[12px] font-black text-slate-800 mb-2.5">
                                      <span className="flex items-center gap-2.5 text-blue-700 text-[10.5px] font-black tracking-wide">
                                        <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                                          <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        {t("completed")}
                                      </span>
                                      <span className="bg-blue-50 px-2.5 py-1 rounded-md text-[11px] font-black text-blue-700 font-sans border border-blue-100/50">
                                        {uiLang === "kh" ? toKhmerNumber(maleCompleted) : maleCompleted} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : ""} ({maleCount > 0 ? Math.round((maleCompleted/maleCount)*100) : 0}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                                      <div 
                                        style={{ width: `${maleCount > 0 ? (maleCompleted/maleCount)*100 : 0}%` }}
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  </div>
                  </div>
                  
                  {/* Right Sidebar (New Students) */}
                  <div className="w-full xl:w-[320px] 2xl:w-[360px] flex-shrink-0 flex flex-col gap-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 p-7 flex flex-col relative overflow-hidden group transition-all duration-300">
                      
                      {/* Decorative Background */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-all duration-500"></div>
                      <div className="absolute top-0 left-0 w-full h-[6px] bg-blue-500"></div>

                      <div className="flex items-center gap-3.5 mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-3xs group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                          <UserPlus className="w-6 h-6 stroke-[2]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 tracking-wider uppercase font-sans">
                            {uiLang === "kh" ? "ព័ត៌មានថ្មីៗ" : "LATEST UPDATES"}
                          </p>
                          <h4 className="font-black text-slate-800 text-[16px] tracking-tight mt-0.5">
                            {uiLang === "kh" ? "សិស្សចុះឈ្មោះថ្មី" : "New Registrations"}
                          </h4>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 pb-2 space-y-2.5 relative z-10 overflow-y-auto pr-1 scrollbar-thin max-h-[420px] xl:max-h-[calc(100vh-380px)]">
                        {[...students].sort((a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()).map((student: any) => (
                          <div key={student.id} className="group/item flex flex-col p-3 rounded-2xl bg-slate-50/60 hover:bg-blue-50/60 hover:shadow-sm border border-slate-100/80 hover:border-blue-200/80 transition-all duration-200">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-3xs flex items-center justify-center shrink-0 overflow-hidden group-hover/item:border-blue-300 transition-colors">
                                  {student.photoUrl ? (
                                    <img src={student.photoUrl} alt={student.nameEn || ''} className="w-full h-full object-cover" />
                                  ) : (
                                    <User className="w-4 h-4 text-slate-400 stroke-[2] group-hover/item:text-blue-500 transition-colors" />
                                  )}
                                </div>
                                <span className="text-xs font-black text-slate-800 truncate group-hover/item:text-blue-700 transition-colors tracking-tight">
                                  {student.nameEn || student.nameKh}
                                </span>
                              </div>
                              {student.createdAt && (
                                <span className="text-[9.5px] font-mono font-bold text-slate-500 bg-white border border-slate-200/70 px-2 py-0.5 rounded-md shrink-0 shadow-3xs group-hover/item:border-blue-200 group-hover/item:text-blue-600 transition-colors">
                                  {new Date(student.createdAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-2 pl-11">
                              <span className="text-[10px] font-bold text-slate-500 truncate bg-white/90 border border-slate-200/70 px-2.5 py-0.5 rounded-lg group-hover/item:bg-blue-100/60 group-hover/item:text-blue-700 group-hover/item:border-blue-200 transition-colors max-w-[170px] sm:max-w-[190px]">
                                {translateCourseOrSpecialtyName(student.course)}
                              </span>
                              {student.createdAt && (
                                <span className="text-[9px] font-semibold text-slate-400 shrink-0">
                                  {new Date(student.createdAt).toLocaleDateString('en-GB')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {students.length === 0 && (
                          <div className="text-center py-10 flex flex-col items-center gap-3 h-full justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                              <UserPlus className="w-7 h-7 text-slate-300 stroke-[1.5]" />
                            </div>
                            <span className="text-slate-400 text-[13px] font-bold uppercase tracking-wider">
                              {uiLang === "kh" ? "មិនមានសិស្សចុះឈ្មោះថ្មីទេ" : "No new registrations"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* System Info & Online Status Widget */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:border-blue-300 p-7 shrink-0 relative overflow-hidden group transition-all duration-300">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-all duration-500"></div>
                      <div className="absolute top-0 left-0 w-full h-[6px] bg-blue-500"></div>
                      
                      <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-center gap-3.5">
                           <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-3xs group-hover:scale-105 transition-transform duration-300">
                             <Activity className="w-6 h-6 stroke-[2]" />
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-slate-400 tracking-wider uppercase font-sans">
                               {uiLang === "kh" ? "ស្ថានភាពប្រព័ន្ធ" : "SYSTEM STATUS"}
                             </p>
                             <h4 className="font-black text-slate-800 text-[16px] tracking-tight mt-0.5">
                               {uiLang === "kh" ? "ព័ត៌មានទូទៅ" : "General Info"}
                             </h4>
                           </div>
                        </div>

                        <div className="flex flex-col gap-3">
                                                      <div role="button" onClick={(e) => { e.stopPropagation(); setIsDeveloperModalOpen(true); }} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 cursor-pointer hover:bg-slate-100/50 transition-colors">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 overflow-hidden">
    {developerLogo ? (
      <img src={developerLogo} alt="Developer" className="w-full h-full object-cover" />
    ) : (
      <Terminal className="w-4 h-4 stroke-[2]" />
    )}
  </div>
                                 <span className="text-[13px] font-bold text-slate-700">
                                 {uiLang === "kh" ? "អ្នកអភិវឌ្ឍន៍" : "Developer"}
                               </span>
                             </div>
                             <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                               {uiLang === "kh" && developerKhmerName ? developerKhmerName : (developerName || "PLC Computer")}
                             </span>
                           </div>

<div className="flex flex-col gap-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600">
                                   <Users className="w-4 h-4 stroke-[2]" />
                                 </div>
                                 <span className="text-[13px] font-bold text-slate-700">
                                   {uiLang === "kh" ? "អ្នកកំពុងប្រើប្រាស់" : "Online Users"}
                                 </span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                 <span className="text-[14px] font-black text-slate-800 font-mono">1</span>
                               </div>
                             </div>
                             
                             <div className="mt-1 pt-2 border-t border-slate-200/50 flex flex-col gap-2">
                               <div className="flex items-center gap-2 px-1">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <User className="w-3 h-3 stroke-[2]" />
                                  </div>
                                  <span className="text-[12px] font-bold text-slate-700 truncate">
                                    {user?.name || (uiLang === "kh" ? "អ្នកគ្រប់គ្រងប្រព័ន្ធ" : "System Admin")}
                                  </span>
                                  <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                    {uiLang === "kh" ? "សកម្ម" : "Active"}
                                  </span>
                               </div>
                             </div>
                           </div>

                           <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600">
                                 <Server className="w-4 h-4 stroke-[2]" />
                               </div>
                               <span className="text-[13px] font-bold text-slate-700">
                                 {uiLang === "kh" ? "ទិន្នន័យសិស្សសរុប" : "Total Student Records"}
                               </span>
                             </div>
                             <span className="text-[14px] font-black text-slate-800 font-mono">
                               {students.length}
                             </span>
                           </div>



                           <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-orange-100/50 flex items-center justify-center text-orange-600">
                                 <GraduationCap className="w-4 h-4 stroke-[2]" />
                               </div>
                               <span className="text-[13px] font-bold text-slate-700">
                                 {uiLang === "kh" ? "ទិន្នន័យគ្រូបង្រៀនសរុប" : "Total Teacher Records"}
                               </span>
                             </div>
                             <span className="text-[14px] font-black text-slate-800 font-mono">
                               {teachers?.length || 0}
                             </span>
                           </div>

                           <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-cyan-100/50 flex items-center justify-center text-cyan-600">
                                 <Clock className="w-4 h-4 stroke-[2]" />
                               </div>
                               <span className="text-[13px] font-bold text-slate-700">
                                 {uiLang === "kh" ? "ពេលវេលាប្រព័ន្ធ" : "System Time"}
                               </span>
                             </div>
                             <span className="text-[12px] font-black text-slate-800 font-mono bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-3xs">
                               {currentTime?.toLocaleTimeString(uiLang === "kh" ? 'km-KH' : 'en-US', { hour: '2-digit', minute: '2-digit' }) || ''}
                             </span>
                           </div>

                           <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600">
                                 <Activity className="w-4 h-4 stroke-[2]" />
                               </div>
                               <span className="text-[13px] font-bold text-slate-700">
                                 {uiLang === "kh" ? "កំណែប្រព័ន្ធ (Version)" : "System Version"}
                               </span>
                             </div>
                             <span className="text-[12px] font-black text-slate-500 font-mono">
                               v1.2.0
                             </span>
                           </div>

                           <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600">
                                 <Server className="w-4 h-4 stroke-[2]" />
                               </div>
                               <span className="text-[13px] font-bold text-slate-700">
                                 {uiLang === "kh" ? "ស្ថានភាពម៉ាស៊ីនមេ" : "Server Status"}
                               </span>
                             </div>
                             <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-3xs">
                               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                               <span className="text-[11px] font-black text-emerald-600 uppercase">
                                 {uiLang === "kh" ? "ដំណើរការធម្មតា" : "Online"}
                               </span>
                             </div>
                           </div>

                           <div className="flex flex-col gap-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600">
                                   <Database className="w-4 h-4 stroke-[2]" />
                                 </div>
                                 <span className="text-[13px] font-bold text-slate-700">
                                   {uiLang === "kh" ? "ទំហំផ្ទុកទិន្នន័យ" : "Database Storage"}
                                 </span>
                               </div>
                               <span className="text-[12px] font-black text-slate-800 font-mono">
                                 45%
                               </span>
                             </div>
                             <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                             </div>
                             <div className="flex justify-between items-center px-1">
                               <span className="text-[10px] font-bold text-slate-400">4.5 GB / 10 GB</span>
                               <span className="text-[10px] font-bold text-slate-400">5.5 GB Free</span>
                             </div>
                           </div>
                           
                           {/* Mini Activity Chart */}
                           <div className="mt-2 flex flex-col gap-2">
                             <div className="flex items-center justify-between px-1">
                               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                 {uiLang === "kh" ? "សកម្មភាពប្រចាំសប្តាហ៍" : "Weekly Activity"}
                               </span>
                               <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">
                                 +12.5%
                               </span>
                             </div>
                             <div className="h-[80px] w-full">
                               <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={[
                                   { name: 'Mon', value: 20 },
                                   { name: 'Tue', value: 45 },
                                   { name: 'Wed', value: 28 },
                                   { name: 'Thu', value: 80 },
                                   { name: 'Fri', value: 65 },
                                   { name: 'Sat', value: 90 },
                                   { name: 'Sun', value: 110 },
                                 ]} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                   <defs>
                                     <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                     </linearGradient>
                                   </defs>
                                   <Tooltip 
                                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                     itemStyle={{ color: '#64748b' }}
                                     cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                   />
                                   <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                                 </AreaChart>
                               </ResponsiveContainer>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </motion.div>
            );
          })()}
      {/* Developer Modal */}
      {isDeveloperModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl overflow-hidden ring-1 ring-slate-900/5 relative"
          >
            <button 
              onClick={() => setIsDeveloperModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-8 pt-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[1.5rem] border border-slate-200 flex items-center justify-center text-slate-400 mb-5 overflow-hidden shadow-sm">
                {developerLogo ? (
                  <img src={developerLogo} alt="Developer" className="w-full h-full object-cover" />
                ) : (
                  <Terminal className="w-8 h-8" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {uiLang === "kh" && developerKhmerName ? developerKhmerName : (developerName || "PLC Computer")}
              </h3>
              
              <p className="text-[13px] font-semibold text-slate-500 mb-8 px-3 py-1 bg-slate-100 rounded-lg">
                {uiLang === "kh" ? "អ្នកអភិវឌ្ឍន៍ប្រព័ន្ធ" : "System Developer"}
              </p>
              
              <div className="w-full space-y-3">
                {developerPhone && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-[14px] bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
                        {uiLang === "kh" ? "លេខទូរស័ព្ទ" : "Phone"}
                      </span>
                      <span className="text-base font-bold text-slate-800">{developerPhone}</span>
                    </div>
                  </div>
                )}
                
                {developerTelegram && (
                  <a 
                    href={developerTelegram.startsWith("http") ? developerTelegram : `https://${developerTelegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl border border-blue-100 bg-blue-50/80 hover:bg-blue-100 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
                    </div>
                    <div className="flex flex-col text-left flex-1">
                      <span className="text-[11px] font-black uppercase text-blue-500/80 tracking-wider mb-0.5">
                        {uiLang === "kh" ? "តេឡេក្រាម" : "Telegram"}
                      </span>
                      <span className="text-base font-bold text-blue-700">Contact Developer</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
