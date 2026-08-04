import os

content = """import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, BookOpen, Clock, Calendar, DollarSign, CreditCard,
  GraduationCap, LayoutGrid, Search, X, Layers,
  BarChart2, TrendingUp, Sparkles, Activity, PieChart as PieChartIcon,
  Award, Landmark, MessageSquare, Folder, SlidersHorizontal, QrCode, FileText, Coins
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

export default function DashboardTab(props: any) {
  const {
    user,
    activeTab,
    currentTime = new Date(),
    students: rawStudents = [],
    teachers: rawTeachers = [],
    toKhmerNumeral,
    schoolLogo, schoolName, schoolKhmerName,
    uiLang: propUiLang,
    setActiveTab = props.setActiveTab
  } = props;

  const students = rawStudents.filter((s: any) => s && s.status === 'STUDYING');
  const teachers = rawTeachers.filter((t: any) => t && (t.status === 'ACTIVE' || t.status === 'LEAVE'));

  const [localLang, setLocalLang] = React.useState(propUiLang || localStorage.getItem("plc_lang") || "kh");
  const [appSearchQuery, setAppSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (propUiLang) setLocalLang(propUiLang);
  }, [propUiLang]);

  const uiLang = localLang;

  const toKhmerNumber = (num: number | string): string => {
    if (uiLang !== "kh") return String(num);
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(num).replace(/\d/g, (d) => khmerDigits[parseInt(d)]);
  };

  const getKhmerDateString = (date: Date): string => {
    if (uiLang === "en") return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    const day = date.getDate();
    const monthNames = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${toKhmerNumber(day)} ${month} ${toKhmerNumber(year)}`;
  };

  if (activeTab !== "Dashboard") return null;

  // Analytics Math
  const femaleTeachers = teachers.filter((t: any) => t.gender === 'Female').length;
  const femaleStudents = students.filter((s: any) => s.gender === 'Female').length;
  const maleStudents = students.filter((s: any) => s.gender === 'Male').length;

  const totalReceived = students.reduce((sum: number, s: any) => sum + (Number(s.paid) || 0), 0);
  const totalBalanceDue = students.reduce((sum: number, s: any) => sum + (Number(s.due) || 0), 0);

  // Chart Data Preparation
  const topCoursesData = (() => {
    const counts: Record<string, number> = {};
    students.forEach((s: any) => {
      const c = s.course || "Other";
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  })();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  const appModules = [
    { id: "Students", labelKh: "សិស្សសរុប", labelEn: "Students", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "Teachers", labelKh: "គ្រូបង្រៀន", labelEn: "Teachers", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "QR Scan", labelKh: "ស្កេន QR", labelEn: "QR Scan", icon: QrCode, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: "Exams", labelKh: "ប្រឡងអនឡាញ", labelEn: "Online Exams", icon: FileText, color: "text-rose-500", bg: "bg-rose-50" },
    { id: "Courses", labelKh: "វគ្គសិក្សា", labelEn: "Courses", icon: BookOpen, color: "text-cyan-500", bg: "bg-cyan-50" },
    { id: "Timetable", labelKh: "កាលវិភាគ", labelEn: "Timetable", icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "Grading", labelKh: "ពិន្ទុ & ប្រឡង", labelEn: "Grading", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
    { id: "Attendance", labelKh: "វត្តមានសិស្ស", labelEn: "Attendance", icon: Clock, color: "text-teal-500", bg: "bg-teal-50" },
    { id: "Finance", labelKh: "ហិរញ្ញវត្ថុ", labelEn: "Finance", icon: Coins, color: "text-green-600", bg: "bg-green-50" },
    { id: "Library", labelKh: "បណ្ណាល័យ", labelEn: "Library", icon: Landmark, color: "text-sky-500", bg: "bg-sky-50" },
    { id: "Leave", labelKh: "សុំច្បាប់", labelEn: "Leave Requests", icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "Announcements", labelKh: "ផ្សព្វផ្សាយ", labelEn: "Announcements", icon: Sparkles, color: "text-yellow-500", bg: "bg-yellow-50" },
    { id: "Analytics", labelKh: "របាយការណ៍", labelEn: "Analytics", icon: BarChart2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "Assets", labelKh: "ទ្រព្យសម្បត្តិ", labelEn: "Assets", icon: Folder, color: "text-slate-700", bg: "bg-slate-100" },
    { id: "Settings", labelKh: "ការកំណត់", labelEn: "Settings", icon: SlidersHorizontal, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, highlightColor, valuePrefix = "" }: any) => (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${highlightColor}`} />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 ${highlightColor.replace('bg-', 'text-').replace('/10', '')} shadow-sm border border-slate-100`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full border border-slate-100">
          {uiLang === 'kh' ? 'សរុប' : 'Total'}
        </span>
      </div>
      
      <div className="relative z-10">
        <p className="text-[13px] font-semibold text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">
          {valuePrefix}<span className="text-slate-900">{value}</span>
        </h3>
        {subtitle && (
          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8 pb-10 max-w-[1600px] mx-auto font-sans"
    >
      {/* 1. HERO HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.03)] relative overflow-hidden">
        {/* Subtle mesh background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50/50 via-indigo-50/20 to-purple-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] bg-white border border-slate-100 shadow-md p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
             {schoolLogo ? (
                <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {uiLang === 'kh' ? `សួស្ដី, ${user?.name || "អ្នកគ្រប់គ្រង"}` : `Welcome back, ${user?.name || "Admin"}`} 👋
            </h1>
            <p className="text-sm md:text-base font-medium text-slate-500 mt-1">
              {schoolKhmerName || schoolName || (uiLang === "kh" ? "ប្រព័ន្ធគ្រប់គ្រងសាលារៀន" : "School Management System")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 bg-slate-50/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200/50 shadow-sm w-full md:w-auto">
          <div className="flex-1 md:flex-none flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-slate-100 justify-center">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-slate-700 font-mono">
              {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex-1 md:flex-none flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-slate-100 justify-center">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">
              {getKhmerDateString(currentTime)}
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE APP LAUNCHER (Hidden on Desktop) */}
      <div className="block lg:hidden bg-white p-5 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">{uiLang === "kh" ? "កម្មវិធីទាំងអស់" : "All Apps"}</h3>
          <div className="relative w-1/2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={appSearchQuery}
              onChange={(e) => setAppSearchQuery(e.target.value)}
              placeholder={uiLang === "kh" ? "ស្វែងរក..." : "Search..."}
              className="w-full pl-8.5 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-medium text-slate-700 focus:border-primary-400 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {appModules
            .filter((mod) => {
              if (!appSearchQuery) return true;
              const q = appSearchQuery.toLowerCase();
              return mod.labelKh.toLowerCase().includes(q) || mod.labelEn.toLowerCase().includes(q);
            })
            .map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveTab && setActiveTab(mod.id)}
                className="flex flex-col items-center justify-start gap-2 group outline-none"
              >
                <div className={`w-14 h-14 rounded-[1.25rem] ${mod.bg} border border-slate-100 flex items-center justify-center transition-transform active:scale-95 group-hover:-translate-y-1`}>
                  <mod.icon className={`w-6 h-6 ${mod.color} stroke-[2]`} />
                </div>
                <span className="text-[10px] font-bold text-slate-600 text-center leading-tight px-1 group-hover:text-primary-600">
                  {uiLang === "kh" ? mod.labelKh : mod.labelEn}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* 2. CORE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title={uiLang === 'kh' ? 'សិស្សកំពុងសិក្សា' : 'Active Students'} 
          value={toKhmerNumber(students.length)} 
          highlightColor="bg-blue-500"
          subtitle={uiLang === 'kh' ? `ស្រី ${toKhmerNumber(femaleStudents)} នាក់` : `${femaleStudents} Female`}
        />
        <StatCard 
          icon={GraduationCap} 
          title={uiLang === 'kh' ? 'បុគ្គលិកសរុប' : 'Total Staff'} 
          value={toKhmerNumber(teachers.length)} 
          highlightColor="bg-emerald-500"
          subtitle={uiLang === 'kh' ? `ស្រី ${toKhmerNumber(femaleTeachers)} នាក់` : `${femaleTeachers} Female`}
        />
        <StatCard 
          icon={DollarSign} 
          title={uiLang === 'kh' ? 'ចំណូលបានទទួល' : 'Total Received'} 
          valuePrefix="$"
          value={toKhmerNumber(totalReceived.toFixed(2))} 
          highlightColor="bg-amber-500"
          subtitle={uiLang === 'kh' ? 'បានទូទាត់រួច' : 'Successfully paid'}
        />
        <StatCard 
          icon={CreditCard} 
          title={uiLang === 'kh' ? 'ប្រាក់ជំពាក់' : 'Balance Due'} 
          valuePrefix="$"
          value={toKhmerNumber(totalBalanceDue.toFixed(2))} 
          highlightColor="bg-rose-500"
          subtitle={uiLang === 'kh' ? 'រង់ចាំការទូទាត់' : 'Awaiting payment'}
        />
      </div>

      {/* 3. CHARTS & ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Panel */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                {uiLang === 'kh' ? 'សិស្សតាមវគ្គសិក្សាកំពូលៗ' : 'Top Courses Enrollment'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {uiLang === 'kh' ? 'បង្ហាញចំនួនសិស្សដែលចុះឈ្មោះច្រើនជាងគេ' : 'Showing the highest enrolled courses'}
              </p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 hidden sm:block">
              <BarChart2 className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={topCoursesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', padding: '12px' }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {topCoursesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics / Quick Stats */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-pink-500" />
              {uiLang === 'kh' ? 'សមាមាត្រយេនឌ័រ' : 'Gender Demographics'}
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-center relative min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Male', value: maleStudents || 0.1 },
                    { name: 'Female', value: femaleStudents || 0.1 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#ec4899" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{toKhmerNumber(students.length)}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                {uiLang === 'kh' ? 'សិស្សសរុប' : 'TOTAL'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <div>
                <p className="text-[11px] font-bold text-slate-400">{uiLang === 'kh' ? 'សិស្សប្រុស' : 'Male'}</p>
                <p className="text-lg font-black text-slate-800 leading-none mt-1">{toKhmerNumber(maleStudents)}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[11px] font-bold text-slate-400 text-right">{uiLang === 'kh' ? 'សិស្សស្រី' : 'Female'}</p>
                <p className="text-lg font-black text-slate-800 leading-none mt-1 text-right">{toKhmerNumber(femaleStudents)}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
"""

with open("src/components/tabs/DashboardTab.tsx", "w") as f:
    f.write(content)
