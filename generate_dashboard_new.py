import os

content = """import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

export default function DashboardTab(props: any) {
  const {
    user,
    activeTab,
    currentTime = new Date(),
    students: rawStudents = [],
    teachers: rawTeachers = [],
    uiLang: propUiLang,
  } = props;

  const students = rawStudents.filter((s: any) => s && s.status === 'STUDYING');
  const teachers = rawTeachers.filter((t: any) => t && (t.status === 'ACTIVE' || t.status === 'LEAVE'));

  const [localLang, setLocalLang] = React.useState(propUiLang || localStorage.getItem("plc_lang") || "kh");

  React.useEffect(() => {
    if (propUiLang) setLocalLang(propUiLang);
  }, [propUiLang]);

  const uiLang = localLang;

  const toKhmerNumber = (num: number | string): string => {
    if (uiLang !== "kh") return String(num);
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(num).replace(/\d/g, (d) => khmerDigits[parseInt(d)]);
  };

  if (activeTab !== "Dashboard") return null;

  // Analytics Math
  const femaleTeachers = teachers.filter((t: any) => t.gender === 'Female').length;
  const femaleStudents = students.filter((s: any) => s.gender === 'Female').length;
  const maleStudents = students.filter((s: any) => s.gender === 'Male').length;

  const totalReceived = students.reduce((sum: number, s: any) => sum + (Number(s.paid) || 0), 0);
  const totalBalanceDue = students.reduce((sum: number, s: any) => sum + (Number(s.due) || 0), 0);

  // Top Courses
  const courseCounts: Record<string, number> = {};
  const courseRevenue: Record<string, number> = {};
  students.forEach((s: any) => {
    const c = s.course || "Other";
    courseCounts[c] = (courseCounts[c] || 0) + 1;
    courseRevenue[c] = (courseRevenue[c] || 0) + (Number(s.paid) || 0);
  });
  
  const topCoursesData = Object.entries(courseCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const topRevenueCourses = Object.entries(courseRevenue)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Mock Trend Data for Line Chart (Since we don't have historical data in props)
  const trendData = [
    { name: 'Jan', students: 120, revenue: 4000 },
    { name: 'Feb', students: 150, revenue: 5500 },
    { name: 'Mar', students: 180, revenue: 6200 },
    { name: 'Apr', students: 140, revenue: 4800 },
    { name: 'May', students: 200, revenue: 7100 },
    { name: 'Jun', students: 250, revenue: 8500 },
    { name: 'Jul', students: 220, revenue: 7800 },
    { name: 'Aug', students: 280, revenue: 9200 },
    { name: 'Sep', students: students.length > 280 ? students.length : 310, revenue: totalReceived > 9200 ? totalReceived : 10500 },
  ];

  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe', '#f5f3ff'];
  const DONUT_COLORS = ['#fb7185', '#38bdf8', '#a3e635', '#fbbf24', '#c084fc', '#94a3b8'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto font-sans bg-[#f4f7fb] p-4 sm:p-6 rounded-[2rem] space-y-4"
    >
      {/* 1. TOP CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Students (Dark Blue) */}
        <div className="bg-[#032c87] rounded-[1.5rem] p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-white/90 text-xs font-medium">{uiLang === 'kh' ? 'សិស្សសរុប' : 'Total Students'}</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-white text-3xl font-bold leading-none">{toKhmerNumber(students.length)}</h3>
          </div>
        </div>

        {/* Card 2: Active Teachers (Light Blue) */}
        <div className="bg-[#e0f2fe] rounded-[1.5rem] p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-600 text-xs font-medium">{uiLang === 'kh' ? 'គ្រូបង្រៀន' : 'Active Teachers'}</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-slate-900 text-3xl font-bold leading-none">{toKhmerNumber(teachers.length)}</h3>
            <span className="text-slate-500 text-[10px] font-medium">{uiLang === 'kh' ? `ស្រី ${toKhmerNumber(femaleTeachers)}` : `${femaleTeachers} F`}</span>
          </div>
        </div>

        {/* Card 3: Total Received (Light Green) */}
        <div className="bg-[#dcfce7] rounded-[1.5rem] p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-600 text-xs font-medium">{uiLang === 'kh' ? 'ចំណូលបានទទួល' : 'Completed (Revenue)'}</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-slate-900 text-3xl font-bold leading-none"><span className="text-xl mr-0.5">$</span>{toKhmerNumber(totalReceived.toFixed(2))}</h3>
          </div>
        </div>

        {/* Card 4: Total Due (Light Pink) */}
        <div className="bg-[#ffe4e6] rounded-[1.5rem] p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-600 text-xs font-medium">{uiLang === 'kh' ? 'ប្រាក់ជំពាក់' : 'Returned (Due)'}</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-slate-900 text-3xl font-bold leading-none"><span className="text-xl mr-0.5">$</span>{toKhmerNumber(totalBalanceDue.toFixed(2))}</h3>
          </div>
        </div>

        {/* Card 5: Courses (Light Purple) */}
        <div className="bg-[#e0e7ff] rounded-[1.5rem] p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-slate-600 text-xs font-medium">{uiLang === 'kh' ? 'វគ្គសិក្សាសរុប' : 'Active Courses'}</span>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-slate-900 text-3xl font-bold leading-none">{toKhmerNumber(topCoursesData.length)}</h3>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Chart: Top Courses (Bar) */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">{uiLang === 'kh' ? 'សិស្សតាមវគ្គសិក្សា' : 'Enrollment by Course'}</h3>
            <div className="flex items-center bg-slate-100/80 rounded-full p-1">
              <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-full">{uiLang === 'kh' ? 'សប្តាហ៍' : 'Week'}</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-full">{uiLang === 'kh' ? 'ខែ' : 'Month'}</button>
              <button className="px-4 py-1.5 text-xs font-bold bg-[#032c87] text-white rounded-full shadow-sm">{uiLang === 'kh' ? 'ឆ្នាំ' : 'Year'}</button>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={topCoursesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#032c87', borderRadius: '12px', border: 'none', color: 'white', fontSize: '12px', padding: '12px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Bar dataKey="value" fill="#93c5fd" radius={[6, 6, 0, 0]}>
                  {topCoursesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#38bdf8' : index === 1 ? '#a3e635' : index === 2 ? '#fb7185' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-start gap-4">
            <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-[#032c87]" />
               <span className="text-[11px] font-medium text-slate-500">{uiLang === 'kh' ? 'ទាំងអស់' : 'All'}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
               <span className="text-[11px] font-medium text-slate-500">{uiLang === 'kh' ? 'កំពូលទី១' : 'Top 1'}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635]" />
               <span className="text-[11px] font-medium text-slate-500">{uiLang === 'kh' ? 'កំពូលទី២' : 'Top 2'}</span>
            </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-[#fb7185]" />
               <span className="text-[11px] font-medium text-slate-500">{uiLang === 'kh' ? 'កំពូលទី៣' : 'Top 3'}</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Sales / Revenue Trend (Line) */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">{uiLang === 'kh' ? 'កំណើនចំណូល' : 'Revenue Trend'}</h3>
            <div className="flex items-center bg-slate-100/80 rounded-full p-1">
              <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-full">{uiLang === 'kh' ? 'សប្តាហ៍' : 'Week'}</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-full">{uiLang === 'kh' ? 'ខែ' : 'Month'}</button>
              <button className="px-4 py-1.5 text-xs font-bold bg-[#032c87] text-white rounded-full shadow-sm">{uiLang === 'kh' ? 'ឆ្នាំ' : 'Year'}</button>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#032c87', borderRadius: '12px', border: 'none', color: 'white', fontSize: '12px', padding: '12px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#032c87" 
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#032c87', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#032c87', stroke: 'white', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-start gap-3">
             <div className="flex items-center justify-center bg-[#032c87] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
               {uiLang === 'kh' ? 'ទាំងអស់' : 'All'}
             </div>
             <div className="flex items-center justify-center bg-slate-100 text-slate-600 text-[10px] font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200">
               {uiLang === 'kh' ? 'វគ្គសិក្សា' : 'Courses'}
             </div>
             <div className="flex items-center justify-center bg-slate-100 text-slate-600 text-[10px] font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200">
               {uiLang === 'kh' ? 'សម្ភារៈ' : 'Materials'}
             </div>
             <div className="flex items-center justify-center bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-1.5 rounded-full cursor-pointer hover:bg-slate-200">
               <ChevronDown className="w-3.5 h-3.5" />
             </div>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Popular Categories (Donut) */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-[280px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-800">{uiLang === 'kh' ? 'សមាមាត្រយេនឌ័រ' : 'Gender Demographics'}</h3>
            <span className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-800 flex items-center gap-1">
              {uiLang === 'kh' ? 'មើលទាំងអស់' : 'See All'} <span className="text-[10px]">↗</span>
            </span>
          </div>
          <div className="flex-1 flex items-center justify-between gap-2">
            <div className="w-1/2 h-full relative">
               <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Male', value: maleStudents || 0.1 },
                      { name: 'Female', value: femaleStudents || 0.1 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    <Cell fill="#93c5fd" />
                    <Cell fill="#fb7185" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-800 text-center leading-tight">
                  {uiLang === 'kh' ? 'សិស្ស\nសរុប' : 'All\nStudents'}
                </span>
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-3 justify-center">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#93c5fd]" />
                   <span className="text-xs text-slate-600 font-medium">{uiLang === 'kh' ? 'សិស្សប្រុស' : 'Male'}</span>
                 </div>
                 <span className="text-xs font-bold text-slate-800">
                   {students.length ? Math.round((maleStudents / students.length) * 100) : 0}%
                 </span>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#fb7185]" />
                   <span className="text-xs text-slate-600 font-medium">{uiLang === 'kh' ? 'សិស្សស្រី' : 'Female'}</span>
                 </div>
                 <span className="text-xs font-bold text-slate-800">
                   {students.length ? Math.round((femaleStudents / students.length) * 100) : 0}%
                 </span>
               </div>
            </div>
          </div>
        </div>

        {/* Av. Check (Horizontal Bars) - We use Top Revenue Courses */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-[280px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">{uiLang === 'kh' ? 'ចំណូលតាមវគ្គសិក្សា' : 'Revenue by Course'}</h3>
             <span className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-800 flex items-center gap-1">
              {uiLang === 'kh' ? 'មើលទាំងអស់' : 'See All'} <span className="text-[10px]">↗</span>
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-3.5 justify-center">
            {topRevenueCourses.slice(0, 5).map((course, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-1/3 shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-[#032c87]' : idx === 1 ? 'bg-[#1e40af]' : idx === 2 ? 'bg-[#1d4ed8]' : 'bg-[#60a5fa]'}`} />
                  <span className="text-xs text-slate-600 font-medium truncate" title={course.name}>{course.name}</span>
                </div>
                <div className="flex-1 bg-slate-100 h-3.5 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full ${idx === 0 ? 'bg-[#032c87]' : idx === 1 ? 'bg-[#1e40af]' : idx === 2 ? 'bg-[#1d4ed8]' : idx === 3 ? 'bg-[#3b82f6]' : 'bg-[#93c5fd]'}`}
                     style={{ width: `${Math.max(10, (course.value / (topRevenueCourses[0]?.value || 1)) * 100)}%` }}
                   />
                </div>
                <span className="text-xs font-bold text-slate-800 w-12 text-right shrink-0">
                  ${course.value.toFixed(0)}
                </span>
              </div>
            ))}
            {topRevenueCourses.length === 0 && (
              <div className="text-center text-sm text-slate-400 my-auto">No data</div>
            )}
          </div>
        </div>

        {/* Av. Delivery Time (Horizontal Bars) - We use Course Enrollments again or status */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-[280px] flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              {uiLang === 'kh' ? 'សិស្សតាមវគ្គ' : 'Students / Course'}
              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[8px] text-slate-400 cursor-help">i</div>
            </h3>
             <span className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-800 flex items-center gap-1">
              {uiLang === 'kh' ? 'មើលទាំងអស់' : 'See All'} <span className="text-[10px]">↗</span>
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-3.5 justify-center">
            {topCoursesData.slice(0, 4).map((course, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <div className="w-1/3 shrink-0">
                  <span className="text-xs text-slate-600 font-medium truncate block" title={course.name}>{course.name}</span>
                </div>
                <div className="flex-1 flex items-center">
                   <div 
                     className={`h-3.5 rounded-full ${idx === 0 ? 'bg-[#fb7185]' : idx === 1 ? 'bg-[#fca5a5]' : idx === 2 ? 'bg-[#7dd3fc]' : 'bg-[#93c5fd]'}`}
                     style={{ width: `${Math.max(15, (course.value / (topCoursesData[0]?.value || 1)) * 100)}%` }}
                   />
                </div>
                <span className="text-xs font-bold text-slate-800 w-12 text-right shrink-0">
                  {toKhmerNumber(course.value)} {uiLang === 'kh' ? 'នាក់' : ''}
                </span>
              </div>
            ))}
             {topCoursesData.length === 0 && (
              <div className="text-center text-sm text-slate-400 my-auto">No data</div>
            )}
            
            {/* Status Pills */}
            <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#a3e635] text-[#3f6212] text-[10px] font-bold">
                {uiLang === 'kh' ? 'ល្អឥតខ្ចោះ' : 'Perfectly'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#7dd3fc] text-[#0369a1] text-[10px] font-bold">
                {uiLang === 'kh' ? 'ល្អ' : 'Fine'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#fecdd3] text-[#be123c] text-[10px] font-bold">
                {uiLang === 'kh' ? 'ត្រូវការកែលម្អ' : 'For too long'}
              </span>
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
