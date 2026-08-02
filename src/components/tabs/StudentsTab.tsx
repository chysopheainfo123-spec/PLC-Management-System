import React from 'react';
import { exportToExcel } from '../../exportUtils';
import { motion } from 'motion/react';
import { Users, UserPlus, Printer, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Download, Edit3, Phone, Pencil } from 'lucide-react';
import { Student as StudentType } from '../../types';

export default function StudentsTab(props: any) {
  const {
    uiLang: propUiLang, toKhmerNumeral, parseLocalDate, translateShiftText, translateCourseOrSpecialtyName,
    students, 
    
    
    
    
    handleDeleteStudent,
    
    
    setSelectedStudent, setIsViewStudentModalOpen, openEditStudentModal,
    studentFilter, studentSearch, 
    studentViewMode, setStudentSearch, attendanceCheckInLog, getStudentStudyHours, setStudentGenderFilter, translateLevelText, openAddStudentModal, setStudentFilter, setStudentViewMode, studentGenderFilter, showToast
  } = props;

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

  const idt = (kh: string, en?: string, zh?: string) => {
    if (localLang === "en") return en || kh;
    if (localLang === "zh") return zh || en || kh;
    return kh;
  };

              const getRemainingDaysText = (student: StudentType) => {
                if (student.status === "COMPLETED") {
                  return <span className="text-blue-600 text-[11px] font-bold whitespace-nowrap">{uiLang === "kh" ? "រៀនចប់ហើយ" : uiLang === "en" ? "Completed" : "课程已结束"}</span>;
                }
                if (student.status === "STOP") {
                  return <span className="text-rose-600 text-[11px] font-bold whitespace-nowrap">{uiLang === "kh" ? "ផ្អាកការសិក្សា" : uiLang === "en" ? "Suspended" : "暂停学习"}</span>;
                }
                
                try {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const end = parseLocalDate(student.endDate);
                  end.setHours(0, 0, 0, 0);
                  const diffTime = end.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  if (diffDays > 0) {
                    return <span className="text-amber-700 text-[11px] font-extrabold whitespace-nowrap">{uiLang === "kh" ? `${toKhmerNumeral(diffDays)} ថ្ងៃទៀត` : uiLang === "en" ? `${diffDays} Days Left` : `${diffDays} 天后`}</span>;
                  } else if (diffDays === 0) {
                    return <span className="text-rose-600 text-[11px] font-extrabold animate-pulse whitespace-nowrap">{uiLang === "kh" ? "ថ្ងៃចុងក្រោយ" : uiLang === "en" ? "Last Day" : "最后一天"}</span>;
                  } else {
                    return <span className="text-slate-500 text-[11px] font-bold whitespace-nowrap">{uiLang === "kh" ? "ហួសកាលកំណត់" : uiLang === "en" ? "Overdue" : "已逾期"}</span>;
                  }
                } catch (e) {
                  return null;
                }
              };

              const getDurationInMonths = (start: string, end: string) => {
                try {
                  const s = parseLocalDate(start);
                  const e = parseLocalDate(end);
                  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
                  return months > 0 ? months : 3;
                } catch (err) {
                  return 3;
                }
              };

              const getShortCourseName = (course: string) => {
                if (!course) return "";
                if (course.includes("Word")) return "Microsoft Office Word";
                if (course.includes("Excel")) return "Microsoft Office Excel";
                if (course.includes("Photoshop")) return "Adobe Photoshop";
                return course;
              };

              const getShiftDisplayText = (shift: string, lang: string) => {
                if (!shift) return "---";
                return translateShiftText(shift, lang);
              };

              const getStudentHoursFormatted = (student: any) => {
                const rawHours = getStudentStudyHours(student);
                let formatted = rawHours;
                if (rawHours.includes("PM") && rawHours.split("-").length === 2) {
                  const parts = rawHours.split("-");
                  const start = parts[0].replace("PM", "").trim();
                  const end = parts[1].trim();
                  formatted = `${start} - ${end}`;
                } else if (rawHours.includes("AM") && rawHours.split("-").length === 2) {
                  const parts = rawHours.split("-");
                  const start = parts[0].replace("AM", "").trim();
                  const end = parts[1].trim();
                  formatted = `${start} - ${end}`;
                }
                return formatted;
              };

              // Search helper function
              const checkSearch = (s, search) => {
                const term = (search || "").toLowerCase();
                return (s.nameKh || "").toLowerCase().includes(term) ||
                       (s.nameEn || "").toLowerCase().includes(term) ||
                       (s.studentId || "").toLowerCase().includes(term) ||
                       (s.guardianPhone || "").includes(search);
              };

              // Gender and Search Filtered (for Top Row Cards metrics)
              const genderAndSearchFiltered = students.filter(s => {
                const matchesGender = studentGenderFilter === "All" || s.gender === studentGenderFilter;
                const matchesSearch = checkSearch(s, studentSearch);
                return matchesGender && matchesSearch;
              });

              // Full Filtered (for main list display)
              const filteredStudents = students.filter(s => {
                const matchesFilter = studentFilter === "All" || s.status === studentFilter;
                const matchesGender = studentGenderFilter === "All" || s.gender === studentGenderFilter;
                const matchesSearch = checkSearch(s, studentSearch);
                return matchesFilter && matchesGender && matchesSearch;
              });

              const malesCount = students.filter(s => s.gender === 'Male' && (studentFilter === "All" || s.status === studentFilter) && checkSearch(s, studentSearch)).length;
              const femalesCount = students.filter(s => s.gender === 'Female' && (studentFilter === "All" || s.status === studentFilter) && checkSearch(s, studentSearch)).length;

              
              const handleExportStudents = () => {
                const data = filteredStudents.map(s => {
                  let remainingDaysText = "";
                  if (s.status === "COMPLETED") {
                    remainingDaysText = uiLang === "kh" ? "រៀនចប់ហើយ" : "Completed";
                  } else if (s.status === "STOP") {
                    remainingDaysText = uiLang === "kh" ? "ផ្អាកការសិក្សា" : "Suspended";
                  } else {
                    try {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const end = parseLocalDate(s.endDate);
                      end.setHours(0, 0, 0, 0);
                      const diffTime = end.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      
                      if (diffDays > 0) {
                        remainingDaysText = uiLang === "kh" ? `${toKhmerNumeral(diffDays)} ថ្ងៃទៀត` : `${diffDays} Days Left`;
                      } else if (diffDays === 0) {
                        remainingDaysText = uiLang === "kh" ? "ថ្ងៃចុងក្រោយ" : "Last Day";
                      } else {
                        remainingDaysText = uiLang === "kh" ? "ហួសកាលកំណត់" : "Overdue";
                      }
                    } catch (e) {
                      remainingDaysText = "";
                    }
                  }

                  return {
                    "ID": s.studentId,
                    "Name (KH)": s.nameKh,
                    "Name (EN)": s.nameEn,
                    "Gender": s.gender,
                    "Course": s.course,
                    "Level": s.level,
                    "Shift": s.shift,
                    "Start Date": s.startDate,
                    "End Date": s.endDate,
                    [uiLang === "kh" ? "ថ្ងៃសិក្សានៅសល់" : "Remaining Days"]: remainingDaysText,
                    "Guardian Name": s.guardianName,
                    "Guardian Phone": s.guardianPhone,
                    "Total Fee": s.fee,
                    "Paid": s.paid,
                    "Due": s.due,
                    "Status": s.status
                  };
                });
                exportToExcel(data, 'Students_Report', uiLang === 'kh' ? 'របាយការណ៍សិស្សានុសិស្ស' : 'Students Report');
              };

              const handleExportStudentsPDF = async () => {
                showToast("កំពុងរៀបចំឯកសារ PDF...", "info");
                const jsPDF = (await import('jspdf')).default;
                const { safeToJpeg: toJpeg } = await import('../../lib/safe-html-to-image');
                const element = document.createElement('div');
                element.innerHTML = `
                  <div style="font-family: 'Kantumruy Pro', sans-serif; padding: 0px; color: #0f172a; background: #ffffff;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 12px;">
                      <div>
                        <h1 style="font-size: 28px; font-weight: 800; color: #1e40af; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2;">${uiLang === 'kh' ? 'របាយការណ៍សិស្សានុសិស្ស' : 'Students Report'}</h1>
                        <p style="font-size: 13px; color: #64748b; margin: 8px 0 0 0; font-weight: 500;">${uiLang === 'kh' ? 'ទិន្នន័យបញ្ជីឈ្មោះសិស្សសរុបប្រចាំសាលា' : 'Comprehensive Student Directory Data'}</p>
                      </div>
                      <div style="text-align: right;">
                        <p style="font-size: 12px; color: #334155; margin: 0; font-weight: 700; display: flex; justify-content: flex-end; gap: 8px;"><span>Date:</span> <span>${new Date().toLocaleDateString('en-GB')}</span></p>
                        <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0; font-weight: 500; display: flex; justify-content: flex-end; gap: 8px;"><span>Total Records:</span> <span>${filteredStudents.length}</span></p>
                      </div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: left;">
                      <thead>
                        <tr style="background-color: #f8fafc; color: #0f172a; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #2563eb;">
                          <th style="padding: 4px 6px; font-weight: 700; width: 8%;">ID</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 12%;">Name (KH)</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 12%;">Name (EN)</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 7%;">Gender</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 16%;">Course / Level</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 10%;">Shift</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 9%;">Start Date</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 9%;">End Date</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 7%; text-align: right;">Total Fee</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 7%; text-align: right;">Paid</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 7%; text-align: right;">Due</th>
                          <th style="padding: 4px 6px; font-weight: 700; text-align: center;">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${filteredStudents.map((s, index) => `
                          <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
                            <td style="padding: 4px 6px; font-family: monospace; font-size: 10px; color: #475569;">${s.studentId}</td>
                            <td style="padding: 4px 6px; font-family: 'Kantumruy Pro', sans-serif; font-weight: 600; color: #0f172a;">${s.nameKh}</td>
                            <td style="padding: 4px 6px; font-weight: 500; color: #0f172a;">${s.nameEn}</td>
                            <td style="padding: 4px 6px; color: #475569;">${s.gender}</td>
                            <td style="padding: 4px 6px;">
                              <div style="font-weight: 600; color: #1e293b; line-height: 1.4;">${s.course}</div>
                              <div style="font-size: 9px; color: #64748b; margin-top: 2px;">${s.level}</div>
                            </td>
                            <td style="padding: 4px 6px;">
                              <div style="font-family: 'Kantumruy Pro', sans-serif; color: #1e293b; font-weight: 600;">${getShiftDisplayText(s.shift, uiLang)}</div>
                              <div style="font-family: monospace; font-size: 9px; color: #64748b; margin-top: 2px;">${getStudentHoursFormatted(s)}</div>
                            </td>
                            <td style="padding: 4px 6px; color: #475569;">${s.startDate}</td>
                            <td style="padding: 4px 6px; color: #475569;">
                              <div>${s.endDate}</div>
                              <div style="margin-top: 2px;">
                                ${(() => {
                                  if (s.status === "COMPLETED") {
                                    return `<span style="color: #2563eb; font-size: 8px; font-weight: 700;">${uiLang === "kh" ? "រៀនចប់ហើយ" : "Completed"}</span>`;
                                  }
                                  if (s.status === "STOP") {
                                    return `<span style="color: #e11d48; font-size: 8px; font-weight: 700;">${uiLang === "kh" ? "ផ្អាកការសិក្សា" : "Suspended"}</span>`;
                                  }
                                  try {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const end = parseLocalDate(s.endDate);
                                    end.setHours(0, 0, 0, 0);
                                    const diffTime = end.getTime() - today.getTime();
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    if (diffDays > 0) {
                                      return `<span style="color: #b45309; font-size: 8px; font-weight: 800;">${uiLang === "kh" ? `${toKhmerNumeral(diffDays)} ថ្ងៃទៀត` : `${diffDays} Days Left`}</span>`;
                                    } else if (diffDays === 0) {
                                      return `<span style="color: #e11d48; font-size: 8px; font-weight: 800;">${uiLang === "kh" ? "ថ្ងៃចុងក្រោយ" : "Last Day"}</span>`;
                                    } else {
                                      return `<span style="color: #64748b; font-size: 8px; font-weight: 700;">${uiLang === "kh" ? "ហួសកាលកំណត់" : "Overdue"}</span>`;
                                    }
                                  } catch (e) {
                                    return "";
                                  }
                                })()}
                              </div>
                            </td>
                            <td style="padding: 4px 6px; font-weight: 600; color: #0f172a; text-align: right;">$${s.fee}</td>
                            <td style="padding: 4px 6px; font-weight: 600; color: #10b981; text-align: right;">$${s.paid}</td>
                            <td style="padding: 4px 6px; font-weight: 600; color: ${s.due > 0 ? '#ef4444' : '#64748b'}; text-align: right;">$${s.due}</td>
                            <td style="padding: 4px 6px; text-align: center;">
                              <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 9px; font-weight: 700; letter-spacing: 0.3px; background-color: ${s.status === 'ACTIVE' || s.status === 'STUDYING' ? '#d1fae5' : s.status === 'COMPLETED' ? '#dbeafe' : '#fee2e2'}; color: ${s.status === 'ACTIVE' || s.status === 'STUDYING' ? '#059669' : s.status === 'COMPLETED' ? '#2563eb' : '#dc2626'};">${s.status}</span>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                    <div style="margin-top: 30px; text-align: right; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                      Generated on ${new Date().toLocaleString('en-GB')}
                    </div>
                  </div>
                `;

                document.body.appendChild(element);
                const imgData = await toJpeg(element, { quality: 0.98, backgroundColor: "#ffffff", pixelRatio: 2 });
                                document.body.removeChild(element);
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'in',
                    format: 'a4'
                });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                                const img = new Image();
                                img.src = imgData;
                                await new Promise(resolve => { img.onload = resolve; });
                                const pdfHeight = (img.height * pdfWidth) / img.width;
                                pdf.addImage(imgData, 'JPEG', 0.5, 0.5, pdfWidth - 1, pdfHeight - 1);
                pdf.save('Students_Report.pdf');
                showToast("ទាញយក PDF ជោគជ័យ!", "success");
              };

return (
                <motion.div
                  key="students-tab"
                  initial={{ opacity: 0.92 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="flex flex-col space-y-6"
                >
                  {/* 1. COMPACT PAGE HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 select-none">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                          <Users className="w-4.5 h-4.5" />
                        </span>
                        <span>
                          {uiLang === "kh" ? "ការគ្រប់គ្រងសិស្សសិក្សា" : uiLang === "en" ? "Student Directory" : "学生管理目录"}
                        </span>
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={handleExportStudentsPDF}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-3xs hover:border-rose-300 shrink-0"
                      >
                        <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="whitespace-nowrap">{uiLang === "kh" ? "ទាញយក PDF" : "Export PDF"}</span>
                      </button>
                      <button
                        onClick={handleExportStudents}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-3xs hover:border-primary-200 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="whitespace-nowrap">{uiLang === "kh" ? "ទាញយក Excel" : uiLang === "en" ? "EXPORT EXCEL" : "导出 Excel"}</span>
                      </button>
                      <button
                        onClick={openAddStudentModal}
                        className="flex-[1_0_100%] sm:flex-none px-4 sm:px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary-600/15 border-none outline-none shrink-0"
                      >
                        <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{uiLang === "kh" ? "ចុះឈ្មោះសិស្សថ្មី" : uiLang === "en" ? "REGISTER STUDENT" : "注册新学生"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. SUMMARY CARDS (BEAUTIFIED) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Students Card */}
                    <div className="bg-white rounded-3xl py-4.5 pl-6 pr-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-300 hover:-translate-y-1 transition-all duration-400 ease-out group relative overflow-hidden text-left">
                      {/* Left premium glow strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500"></div>
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary-50/50 rounded-full blur-xl group-hover:bg-primary-100/60 transition-all duration-500"></div>
                      {/* Vector icon watermark */}
                      <Users className="w-20 h-20 absolute -bottom-3 -right-3 text-primary-500/5 group-hover:text-primary-500/10 transition-all duration-500 group-hover:scale-120 group-hover:-rotate-12 pointer-events-none" />
                      
                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-450 tracking-wider uppercase font-sans">
                          {uiLang === "kh" ? "សិស្សសរុប" : uiLang === "en" ? "TOTAL STUDENTS" : "学生总数"}
                        </p>
                        <h3 className="text-3xl font-black text-slate-850 font-sans tracking-tight">
                          {genderAndSearchFiltered.length} <span className="text-xs font-bold text-slate-400 font-sans">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "Students" : "人"}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {uiLang === "kh" ? "សិស្សចុះឈ្មោះក្នុងប្រព័ន្ធ" : uiLang === "en" ? "Students registered in system" : "系统注册学生"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-primary-50/90 backdrop-blur-xs border border-primary-100/80 text-primary-750 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90 z-10 shadow-3xs flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-primary-500"></span>
                        {uiLang === "kh" ? "បញ្ជីឈ្មោះ" : uiLang === "en" ? "ROSTER" : "名册"}
                      </div>
                    </div>

                    {/* Studying Card */}
                    <div className="bg-white rounded-3xl py-4.5 pl-6 pr-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-300 hover:-translate-y-1 transition-all duration-400 ease-out group relative overflow-hidden text-left">
                      {/* Left premium glow strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-50/50 rounded-full blur-xl group-hover:bg-emerald-100/60 transition-all duration-500"></div>
                      {/* Vector icon watermark */}
                      <BookOpen className="w-20 h-20 absolute -bottom-3 -right-3 text-emerald-500/5 group-hover:text-emerald-500/10 transition-all duration-500 group-hover:scale-120 group-hover:-rotate-12 pointer-events-none" />

                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-450 tracking-wider uppercase font-sans">
                          {uiLang === "kh" ? "កំពុងសិក្សា" : uiLang === "en" ? "ACTIVE STUDENTS" : "在读学生"}
                        </p>
                        <h3 className="text-3xl font-black text-emerald-600 font-sans tracking-tight">
                          {genderAndSearchFiltered.filter(s => s.status === 'STUDYING').length} <span className="text-xs font-bold text-slate-400 font-sans">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "Students" : "人"}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {uiLang === "kh" ? "កំពុងសិក្សាទ្រឹស្តី & អនុវត្ត" : uiLang === "en" ? "Studying Theory & Practice" : "正在学习理论与实践"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-emerald-50/90 backdrop-blur-xs border border-emerald-100/80 text-emerald-750 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90 z-10 shadow-3xs flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        {uiLang === "kh" ? "សកម្ម" : uiLang === "en" ? "ACTIVE" : "活跃"}
                      </div>
                    </div>

                    {/* Completed Card */}
                    <div className="bg-white rounded-3xl py-4.5 pl-6 pr-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1 transition-all duration-400 ease-out group relative overflow-hidden text-left">
                      {/* Left premium glow strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-50/50 rounded-full blur-xl group-hover:bg-blue-100/60 transition-all duration-500"></div>
                      {/* Vector icon watermark */}
                      <Award className="w-20 h-20 absolute -bottom-3 -right-3 text-blue-500/5 group-hover:text-blue-500/10 transition-all duration-500 group-hover:scale-120 group-hover:-rotate-12 pointer-events-none" />

                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-450 tracking-wider uppercase font-sans">
                          {uiLang === "kh" ? "រៀបចំបញ្ចប់" : uiLang === "en" ? "COMPLETED" : "已结业"}
                        </p>
                        <h3 className="text-3xl font-black text-blue-600 font-sans tracking-tight">
                          {genderAndSearchFiltered.filter(s => s.status === 'COMPLETED').length} <span className="text-xs font-bold text-slate-400 font-sans">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "Students" : "人"}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {uiLang === "kh" ? "ទទួលបានវិញ្ញាបនបត្របញ្ជាក់" : uiLang === "en" ? "Certified & Graduated" : "已获得学术证书"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-blue-50/90 backdrop-blur-xs border border-blue-100/80 text-blue-750 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90 z-10 shadow-3xs flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        {uiLang === "kh" ? "រួចរាល់" : uiLang === "en" ? "DONE" : "完成"}
                      </div>
                    </div>

                    {/* Stopped Card */}
                    <div className="bg-white rounded-3xl py-4.5 pl-6 pr-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-2xl hover:shadow-rose-500/10 hover:border-rose-300 hover:-translate-y-1 transition-all duration-400 ease-out group relative overflow-hidden text-left">
                      {/* Left premium glow strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-50/50 rounded-full blur-xl group-hover:bg-rose-100/60 transition-all duration-505"></div>
                      {/* Vector icon watermark */}
                      <Clock className="w-20 h-20 absolute -bottom-3 -right-3 text-rose-500/5 group-hover:text-rose-500/10 transition-all duration-500 group-hover:scale-120 group-hover:-rotate-12 pointer-events-none" />

                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-450 tracking-wider uppercase font-sans">
                          {uiLang === "kh" ? "ផ្អាកសិក្សា" : uiLang === "en" ? "ON HOLD" : "已暂停"}
                        </p>
                        <h3 className="text-3xl font-black text-rose-600 font-sans tracking-tight">
                          {genderAndSearchFiltered.filter(s => s.status === 'STOP').length} <span className="text-xs font-bold text-slate-400 font-sans">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "Students" : "人"}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {uiLang === "kh" ? "សិស្សផ្អាក ឬឈប់សិក្សា" : uiLang === "en" ? "Students on hold or stopped" : "暂停或已退学学生"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-rose-50/90 backdrop-blur-xs border border-rose-100/80 text-rose-750 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90 z-10 shadow-3xs flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                        {uiLang === "kh" ? "ផ្អាក" : uiLang === "en" ? "HOLD" : "挂起"}
                      </div>
                    </div>
                  </div>

                  {/* 3. DATA TABLE SECTION */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    {/* Controls Header */}
                    <div className="py-1.5 px-3.5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-slate-50/40">
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-800 text-sm">
                            {uiLang === "kh" ? "បញ្ជីឈ្មោះសិស្សានុសិស្ស" : uiLang === "en" ? "Student Roster" : "学生名册"}
                          </span>
                          <span className="bg-primary-100 text-primary-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {uiLang === "kh" 
                              ? `${toKhmerNumeral(filteredStudents.length)} នាក់` 
                              : uiLang === "en" 
                                ? `${filteredStudents.length} Students` 
                                : `${filteredStudents.length} 人`}
                          </span>
                        </div>

                        {/* Status Pills */}
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => setStudentFilter("All")}
                            className={`py-0.5 text-xs font-extrabold transition-all cursor-pointer ${
                              studentFilter === "All"
                                ? "text-slate-900 font-black"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            {uiLang === "kh" ? "ទាំងអស់ (All)" : uiLang === "en" ? "All" : "全部"}
                          </button>
                          <button
                            onClick={() => setStudentFilter("STUDYING")}
                            className={`py-0.5 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                              studentFilter === "STUDYING"
                                ? "text-emerald-600 font-black"
                                : "text-slate-400 hover:text-emerald-600"
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full ${studentFilter === "STUDYING" ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                            {uiLang === "kh" ? "STUDYING កំពុងសិក្សា" : uiLang === "en" ? "Studying" : "在读"}
                          </button>
                          <button
                            onClick={() => setStudentFilter("COMPLETED")}
                            className={`py-0.5 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                              studentFilter === "COMPLETED"
                                ? "text-blue-600 font-black"
                                : "text-slate-400 hover:text-blue-600"
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full ${studentFilter === "COMPLETED" ? "bg-blue-500" : "bg-slate-300"}`}></span>
                            {uiLang === "kh" ? "COMPLETED វគ្គចប់" : uiLang === "en" ? "Completed" : "已结业"}
                          </button>
                          <button
                            onClick={() => setStudentFilter("STOP")}
                            className={`py-0.5 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                              studentFilter === "STOP"
                                ? "text-rose-600 font-black"
                                : "text-slate-400 hover:text-rose-600"
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full ${studentFilter === "STOP" ? "bg-rose-500" : "bg-slate-300"}`}></span>
                            {uiLang === "kh" ? "STOP ឈប់សិក្សា" : uiLang === "en" ? "Suspended" : "已暂停"}
                          </button>
                        </div>
                      </div>

                      {/* Right side search and toggle */}
                      <div className="flex items-center gap-2 w-full xl:w-auto justify-between sm:justify-start">
                        <div className="relative flex-1 xl:w-64">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            placeholder={uiLang === "kh" ? "ស្វែងរកឈ្មោះ, ទូរស័ព្ទ, លេខសម្គាល់..." : uiLang === "en" ? "Search name, phone, ID..." : "搜索姓名、手机、学号..."}
                            className="w-full pl-8 pr-3.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-xs font-bold text-slate-800 font-sans placeholder-slate-400"
                          />
                          {studentSearch && (
                            <button 
                              onClick={() => setStudentSearch("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              {uiLang === "kh" ? "លុប" : uiLang === "en" ? "Clear" : "清除"}
                            </button>
                          )}
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                          <button
                            onClick={() => setStudentViewMode("list")}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              studentViewMode === "list"
                                ? "bg-white text-slate-800 shadow-3xs"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                            title={uiLang === "kh" ? "ទម្រង់បញ្ជី" : uiLang === "en" ? "List View" : "列表视图"}
                          >
                            <List className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setStudentViewMode("grid")}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              studentViewMode === "grid"
                                ? "bg-white text-slate-800 shadow-3xs"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                            title={uiLang === "kh" ? "ទម្រង់ប្រអប់" : uiLang === "en" ? "Grid View" : "网格视图"}
                          >
                            <LayoutGrid className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Gender Filters (Sub-Header) */}
                    <div className="px-3.5 py-1 bg-slate-50/20 border-b border-slate-100 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setStudentGenderFilter("All")}
                        className={`py-0.5 text-xs font-extrabold transition-all cursor-pointer ${
                          studentGenderFilter === "All"
                            ? "text-slate-900 font-black"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {uiLang === "kh" ? "ភេទទាំងអស់" : uiLang === "en" ? "All Genders" : "全部性别"}
                      </button>
                      <button
                        onClick={() => setStudentGenderFilter("Male")}
                        className={`py-0.5 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                          studentGenderFilter === "Male"
                            ? "text-amber-600 font-black"
                            : "text-slate-400 hover:text-amber-600"
                        }`}
                      >
                        👦 {uiLang === "kh" ? `ប្រុស (${toKhmerNumeral(malesCount)})` : uiLang === "en" ? `Male (${malesCount})` : `男 (${malesCount})`}
                      </button>
                      <button
                        onClick={() => setStudentGenderFilter("Female")}
                        className={`py-0.5 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                          studentGenderFilter === "Female"
                            ? "text-pink-600 font-black"
                            : "text-slate-400 hover:text-pink-600"
                        }`}
                      >
                        👧 {uiLang === "kh" ? `ស្រី (${toKhmerNumeral(femalesCount)})` : uiLang === "en" ? `Female (${femalesCount})` : `女 (${femalesCount})`}
                      </button>
                    </div>

                    {/* Student Search Details Widget */}
                    {studentSearch && filteredStudents.length > 0 && (
                      <div className="mx-4.5 my-3 p-4 bg-blue-50/15 border border-blue-100 rounded-2xl space-y-3.5 no-print">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                            <span>
                              {uiLang === "kh" 
                                ? `ទិន្នន័យស្វែងរកលម្អិត (${toKhmerNumeral(filteredStudents.length)} នាក់)` 
                                : uiLang === "en" 
                                  ? `Detailed Search Results (${filteredStudents.length} students)` 
                                  : `搜索结果详情 (${filteredStudents.length} 人)`}
                            </span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => setStudentSearch("")}
                            className="text-[10px] font-black text-slate-450 hover:text-slate-600 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors border border-slate-200/50"
                          >
                            {uiLang === "kh" ? "សម្អាតស្វែងរក (Clear)" : uiLang === "en" ? "Clear Search" : "清除搜索"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredStudents.slice(0, 3).map((student) => {
                            // Calculate attendance rate
                            let presentCount = 0;
                            let lateCount = 0;
                            let permissionCount = 0;
                            let absentCount = 0;

                            Object.keys(attendanceCheckInLog).forEach((date) => {
                              const status = attendanceCheckInLog[date]?.[student.id];
                              if (status === 'PRESENT') presentCount++;
                              else if (status === 'LATE') lateCount++;
                              else if (status === 'PERMISSION') permissionCount++;
                              else if (status === 'ABSENT') absentCount++;
                            });

                            const totalDays = presentCount + lateCount + permissionCount + absentCount;
                            const attendanceRate = totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 105) : 100;
                            const attendanceRateClamped = Math.min(100, attendanceRate);

                            const isFemale = student.gender === "Female";
                            const avatarBg = isFemale ? "bg-pink-100 text-pink-600 border-pink-200" : "bg-blue-100 text-blue-600 border-blue-200";

                            return (
                              <div key={student.id} className="bg-white rounded-xl border border-blue-100/65 p-4 flex flex-col justify-between hover:shadow-2xs transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                                
                                <div className="space-y-3 relative z-10">
                                  {/* Profile Info */}
                                  <div className="flex items-center gap-3">
                                    <div className={`w-11 h-11 rounded-full ${avatarBg} border flex items-center justify-center text-xl font-black shrink-0 relative`}>
                                      <span>{isFemale ? "👧" : "👦"}</span>
                                    </div>
                                    <div className="min-w-0">
                                      <h5 className="font-black text-slate-850 text-sm tracking-tight truncate">{student.nameKh}</h5>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate flex items-center gap-1.5 font-sans mt-0.5">
                                        <span>{student.nameEn}</span>
                                        <span className="text-slate-300">|</span>
                                        <span className="font-mono text-[8.5px] text-slate-500 bg-slate-50 border border-slate-200/50 px-1 rounded">
                                          {student.studentId}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Academic details */}
                                  <div className="border-t border-b border-slate-200/60 py-2 grid grid-cols-2 gap-2 text-[10.5px] font-bold text-slate-500">
                                    <div>
                                      <span className="block text-[8.5px] text-slate-400 uppercase tracking-wider">
                                        {uiLang === "kh" ? "វគ្គសិក្សា • CLASS" : uiLang === "en" ? "CLASS" : "课程"}
                                      </span>
                                      <span className="text-slate-850 font-extrabold truncate block mt-0.5">
                                        {translateCourseOrSpecialtyName(student.course, uiLang)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="block text-[8.5px] text-slate-400 uppercase tracking-wider">
                                        {uiLang === "kh" ? "កម្រិត • LEVEL" : uiLang === "en" ? "LEVEL" : "级别"}
                                      </span>
                                      <span className="text-slate-850 font-extrabold truncate block mt-0.5">{student.level}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[8.5px] text-slate-400 uppercase tracking-wider">
                                        {uiLang === "kh" ? "ថ្ងៃចូលរៀន • START DATE" : uiLang === "en" ? "START DATE" : "开学日期"}
                                      </span>
                                      <span className="text-slate-800 font-extrabold block mt-0.5 font-sans">{student.startDate}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[8.5px] text-slate-400 uppercase tracking-wider">
                                        {uiLang === "kh" ? "ទូរស័ព្ទអាណាព្យាបាល" : uiLang === "en" ? "GUARDIAN PHONE" : "监护人电话"}
                                      </span>
                                      <span className="text-slate-800 font-extrabold block mt-0.5 font-sans truncate">
                                        {student.guardianPhone || (uiLang === "kh" ? "គ្មាន" : uiLang === "en" ? "None" : "无")}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Attendance Statistics */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="font-bold text-slate-400 uppercase tracking-wider">
                                        {uiLang === "kh" ? "វត្តមានសិក្សា • ATTENDANCE RATE" : uiLang === "en" ? "ATTENDANCE RATE" : "出勤率"}
                                      </span>
                                      <span className={`font-black px-1.5 py-0.5 rounded text-[8.5px] ${
                                        attendanceRateClamped >= 80 ? "bg-emerald-50 text-emerald-700" : attendanceRateClamped >= 50 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                                      }`}>
                                        {uiLang === "kh" ? `${toKhmerNumeral(attendanceRateClamped)}%` : `${attendanceRateClamped}%`}
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          attendanceRateClamped >= 80 ? "bg-emerald-500" : attendanceRateClamped >= 50 ? "bg-amber-400" : "bg-rose-500"
                                        }`} 
                                        style={{ width: `${attendanceRateClamped}%` }} 
                                      />
                                    </div>
                                    <div className="flex justify-between text-[8.5px] font-black text-slate-450 mt-1">
                                      <span className="text-emerald-600">P: {uiLang === "kh" ? toKhmerNumeral(presentCount) : presentCount}</span>
                                      <span className="text-amber-500">L: {uiLang === "kh" ? toKhmerNumeral(lateCount) : lateCount}</span>
                                      <span className="text-blue-500">E: {uiLang === "kh" ? toKhmerNumeral(permissionCount) : permissionCount}</span>
                                      <span className="text-rose-600">A: {uiLang === "kh" ? toKhmerNumeral(absentCount) : absentCount}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Table / Row Display */}
                    {filteredStudents.length === 0 ? (
                      <div className="p-16 text-center text-slate-400 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                          <Users className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-600">
                          {uiLang === "kh" ? "រកមិនឃើញសិស្សដែលស្វែងរកទេ!" : uiLang === "en" ? "No students found matching search!" : "未找到匹配的学生！"}
                        </h4>
                      </div>
                    ) : studentViewMode === "list" ? (
                      <div className="overflow-x-auto border-t border-slate-100 scrollbar-none">
                        <table className="w-full min-w-[1000px] text-left border-collapse relative">
                          <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                            <tr className="bg-slate-50/95 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                              <th className="px-6 py-3">{uiLang === "kh" ? "ព័ត៌មានសិស្ស (ID)" : uiLang === "en" ? "Student Info (ID)" : "学生信息 (ID)"}</th>
                              <th className="px-6 py-3">{uiLang === "kh" ? "វគ្គសិក្សា & កម្រិត" : uiLang === "en" ? "Course & Level" : "课程 & 级别"}</th>
                              <th className="px-6 py-3">{uiLang === "kh" ? "វេន & ម៉ោងសិក្សា" : uiLang === "en" ? "Shift & Hours" : "班次 & 时间"}</th>
                              <th className="px-6 py-3">{uiLang === "kh" ? "កាលបរិច្ឆេទ & រយៈពេល" : uiLang === "en" ? "Date & Duration" : "日期 & 时长"}</th>
                              <th className="px-6 py-3">{uiLang === "kh" ? "ថ្លៃសិក្សា & ស្ថានភាពបង់" : uiLang === "en" ? "Tuition & Payment" : "学费 & 支付状态"}</th>
                              <th className="px-6 py-3">{uiLang === "kh" ? "ស្ថានភាព" : uiLang === "en" ? "Status" : "状态"}</th>
                              <th className="px-6 py-3 text-right pr-8">{uiLang === "kh" ? "សកម្មភាព" : uiLang === "en" ? "Actions" : "操作"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                            {filteredStudents.map((student, index) => {
                              const isFemale = student.gender === "Female";
                              const avatarBg = isFemale ? "bg-pink-100 text-pink-600 border-pink-200" : "bg-blue-100 text-blue-600 border-blue-200";
                              
                              const feeVal = Number(student.fee || 0);
                              const paidVal = Number(student.paid || 0);
                              const dueVal = Number(student.due || 0);
                              
                              return (
                                <tr key={student.id} className={`hover:bg-slate-50/40 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                                  {/* Col 1: Student Info (ID) */}
                                  <td className="px-6 py-2.5">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-7 h-7 rounded-full ${avatarBg} border flex items-center justify-center text-sm font-black shrink-0`}>
                                        <span>{isFemale ? "👧" : "👦"}</span>
                                      </div>
                                      <div className="text-left leading-tight">
                                        <h4 className="font-extrabold text-slate-800 text-[14px] leading-tight">{student.nameKh}</h4>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                          <span>{student.nameEn}</span>
                                          <span className="text-slate-300">|</span>
                                          <span className="font-mono text-[9px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded leading-none">
                                            {student.studentId}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  
                                  {/* Col 2: Course & Level */}
                                  <td className="px-6 py-2.5">
                                    <div className="text-left leading-tight">
                                      <span className="text-[13px] text-slate-800 font-black block">
                                        {getShortCourseName(student.course)}
                                      </span>
                                      <span className="text-[11px] text-primary-600 font-extrabold block mt-1">
                                        {translateLevelText(student.level, uiLang)}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Col 3: Shift & Hours */}
                                  <td className="px-6 py-2.5">
                                    <div className="text-left leading-tight">
                                      <span className="text-[13px] text-slate-800 font-black block">
                                        {getShiftDisplayText(student.shift, uiLang)}
                                      </span>
                                      <span className="font-mono text-[11px] text-slate-400 font-bold block mt-1">
                                        {getStudentHoursFormatted(student)}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Col 4: Date & Duration */}
                                  <td className="px-6 py-2.5">
                                    <div className="text-left leading-tight">
                                      <span className="font-sans text-[13px] text-slate-800 font-black block">
                                        {student.startDate} <span className="text-slate-400 mx-1 font-sans">➔</span> {student.endDate}
                                      </span>
                                      <div className="mt-1">
                                        {getRemainingDaysText(student)}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Col 5: Tuition & Payment Status */}
                                  <td className="px-6 py-2.5">
                                    <div className="text-left leading-tight">
                                      <div className="text-[13px] font-black text-slate-800 font-sans">
                                        <span>${paidVal.toFixed(2)}</span>
                                        <span className="text-slate-300 font-semibold mx-1">/</span>
                                        <span className="text-slate-400 font-semibold">${feeVal.toFixed(2)}</span>
                                      </div>
                                      <div className="text-[11px] mt-1 font-bold">
                                        {dueVal <= 0 ? (
                                          <span className="text-emerald-600 font-extrabold whitespace-nowrap">
                                            {uiLang === "kh" ? "បង់គ្រប់" : uiLang === "en" ? "Paid In Full" : "已付清"}
                                          </span>
                                        ) : (
                                          <span className="text-amber-600 font-extrabold whitespace-nowrap">
                                            {uiLang === "kh" ? `ជំពាក់: $${dueVal.toFixed(2)}` : uiLang === "en" ? `Due: $${dueVal.toFixed(2)}` : `欠费: $${dueVal.toFixed(2)}`}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Col 6: Status Badge */}
                                  <td className="px-6 py-2.5">
                                    <div className="text-left">
                                      {student.status === 'STUDYING' ? (
                                        <span className="text-emerald-600 text-[12px] font-black tracking-wide whitespace-nowrap">
                                          {uiLang === "kh" ? "កំពុងសិក្សា" : uiLang === "en" ? "Studying" : "在读"}
                                        </span>
                                      ) : student.status === 'COMPLETED' ? (
                                        <span className="text-blue-600 text-[12px] font-black tracking-wide whitespace-nowrap">
                                          {uiLang === "kh" ? "បានបញ្ចប់" : uiLang === "en" ? "Completed" : "已结业"}
                                        </span>
                                      ) : (
                                        <span className="text-rose-600 text-[12px] font-black tracking-wide whitespace-nowrap">
                                          {uiLang === "kh" ? "ផ្អាកសិក្សា" : uiLang === "en" ? "Suspended" : "已暂停"}
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Col 7: Actions */}
                                  <td className="px-6 py-2.5 text-right pr-8">
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() => {
                                          setSelectedStudent(student);
                                          setIsViewStudentModalOpen(true);
                                        }}
                                        className="p-1.5 bg-transparent hover:bg-slate-100 border border-transparent text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                                        title={uiLang === "kh" ? "មើលព័ត៌មាន" : "View"}
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => openEditStudentModal(student)}
                                        className="p-1.5 bg-transparent hover:bg-slate-100 border border-transparent text-slate-500 hover:text-primary-600 rounded-lg transition-colors cursor-pointer"
                                        title={uiLang === "kh" ? "កែប្រែ" : "Edit"}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="p-1.5 bg-transparent hover:bg-rose-50 border border-transparent text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                        title={uiLang === "kh" ? "លុប" : "Delete"}
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6 bg-slate-50/50">
                        {filteredStudents.map((student) => {
                          const isFemale = student.gender === "Female";
                          const avatarBg = isFemale ? "bg-pink-100 text-pink-600 border-pink-200" : "bg-blue-100 text-blue-600 border-blue-200";
                          return (
                            <motion.div
                              key={student.id}
                              whileHover={{ y: -4 }}
                              className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs p-5 relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start gap-4">
                                  <div className="relative shrink-0">
                                    <div className={`w-12 h-12 rounded-xl ${avatarBg} border-2 border-white flex items-center justify-center text-2xl shadow-sm overflow-hidden`}>
                                      <span>{isFemale ? "👧" : "👦"}</span>
                                    </div>
                                    <span className={`absolute bottom-[-1px] right-[-1px] w-3 h-3 border-2 border-white rounded-full ${
                                      student.status === 'STUDYING' ? 'bg-emerald-500 animate-pulse' :
                                      student.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-rose-500'
                                    }`}></span>
                                  </div>

                                  <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h4 className="text-sm font-black text-slate-800 truncate">
                                        {student.nameKh}
                                      </h4>
                                      <span className="text-[10px] font-bold text-slate-400 font-sans">
                                        ({student.nameEn})
                                      </span>
                                      <span className="font-mono text-[8px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-1 rounded">
                                        {student.studentId}
                                      </span>
                                    </div>
                                    <p className="text-[10.5px] font-black text-primary-600 uppercase tracking-wider truncate">
                                      {translateCourseOrSpecialtyName(student.course, uiLang)}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1 font-mono">
                                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      {student.guardianPhone || "N/A"}
                                    </p>
                                  </div>
                                </div>

                                {/* Tuition details */}
                                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-400">
                                  <div>
                                    <span className="block text-[9px] text-slate-400 uppercase">{uiLang === "kh" ? "កម្រិត" : "Level"}</span>
                                    <span className="text-slate-700 font-bold">{student.level}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-400 uppercase">{uiLang === "kh" ? "ម៉ោងសិក្សា" : "Shift"}</span>
                                    <span className="text-slate-700 font-bold">{translateShiftText(student.shift, uiLang)}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-400 uppercase">{uiLang === "kh" ? "បង់រួច" : "Paid"}</span>
                                    <span className="text-emerald-600 font-black">${student.paid}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-400 uppercase">{uiLang === "kh" ? "ខ្វះខាត" : "Due"}</span>
                                    <span className={`font-black ${student.due > 0 ? "text-rose-600" : "text-slate-400"}`}>${student.due}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Card Footer Actions */}
                              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                                <span className={`inline-flex items-center text-[10px] font-black ${
                                  student.status === 'STUDYING'
                                    ? 'text-emerald-600'
                                    : student.status === 'COMPLETED'
                                      ? 'text-blue-600'
                                      : 'text-rose-600'
                                }`}>
                                  {student.status === "STUDYING" 
                                    ? (uiLang === "kh" ? "កំពុងសិក្សា" : "Studying") 
                                    : student.status === "COMPLETED" 
                                      ? (uiLang === "kh" ? "បញ្ចប់វគ្គ" : "Completed") 
                                      : (uiLang === "kh" ? "ផ្អាកសិក្សា" : "Stopped")}
                                </span>

                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setIsViewStudentModalOpen(true);
                                    }}
                                    className="p-1.5 bg-transparent hover:bg-slate-100 border border-transparent text-slate-600 rounded-lg transition-colors cursor-pointer"
                                    title={uiLang === "kh" ? "មើល" : "View"}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => openEditStudentModal(student)}
                                    className="p-1.5 bg-transparent hover:bg-slate-100 border border-transparent text-slate-600 rounded-lg transition-colors cursor-pointer"
                                    title={uiLang === "kh" ? "កែប្រែ" : "Edit"}
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(student.id)}
                                    className="p-1.5 bg-transparent hover:bg-rose-55 border border-transparent text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title={uiLang === "kh" ? "លុប" : "Delete"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
}
