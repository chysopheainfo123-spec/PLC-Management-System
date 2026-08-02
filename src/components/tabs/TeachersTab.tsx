import { withSafeCss } from '../Dashboard';
import React from 'react';
import { exportToExcel } from '../../exportUtils';
import { motion } from 'motion/react';
import { Folder, Upload, FileText, Briefcase, Users, Printer, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Camera, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, CheckCircle } from 'lucide-react';

export default function TeachersTab(props: any) {
  const [confirmDeleteDocId, setConfirmDeleteDocId] = React.useState<string | null>(null);
  const [isViewTeacherModalOpen, setIsViewTeacherModalOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<any>(null);
  const [specialtyToDeleteIndex, setSpecialtyToDeleteIndex] = React.useState<number | null>(null);

  const [localLang, setLocalLang] = React.useState(props.uiLang || localStorage.getItem("plc_lang") || "kh");

  React.useEffect(() => {
    if (props.uiLang) {
      setLocalLang(props.uiLang);
    }
  }, [props.uiLang]);

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

  const {
    uiLang: unusedUiLang, idt: unusedIdt,
    teachers,
    coursesList,
specialtyOptions, teachPhone, appTheme, handleAddSpecialtyOption, handleDeleteTeacher, setIsOpenSpecialtyDropdown, setTeachDob, teachSalary, levelOptions, teachJoinDate, setTeachNameEn, setEditingSpecialtyIndex, setTeachSpecialty, formatLangDate, teachGender, teachNameEn, isOpenSpecialtyDropdown, editingSpecialtyValue, setTeacherViewMode, token, setEditingTeacherId, setTeachTeacherId, shiftOptions, setEditingSpecialtyValue, courseOptions, teachStatus, setTeachNameKh, newCustomSpecialty, editingSpecialtyIndex, teachDob, teachTeacherId, teachLeaveDate, teachNameKh, setTeachSalary, hoursOptions, teachPob, teachNotes, teachSpecialty, directorName, setTeachPhone, translatePOB, setTeachExperienceDays, calculatedExpDays, isTeacherModalOpen, editingTeacherId, setNewCustomSpecialty, setShowAddSpecialty, baseFee, setTeachStatus, formatPaymentStatus, formatExperienceDays, setTeacherSearch, setTeachPaymentStatus, setTeachPob, setTeachJoinDate, setTeachers, setTeachGender, showToast, setTeachLeaveDate, showAddSpecialty, teachPaymentStatus, setTeachNotes, setSpecialtyOptions, handleDeleteSpecialtyOption, teacherSearch, handleEditSpecialtyOption, translateCourseOrSpecialtyName, schoolName, setIsTeacherModalOpen, teacherViewMode, formatLangNum,
  } = props;

  const toKhmerNumeral = (num: number | string) => {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(num).split("").map(char => {
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : khmerDigits[digit];
    }).join("");
  };

  const getFallbackPaymentStatus = (joinDateStr: string | null | undefined): string => {
    if (!joinDateStr) {
      return "មិនទាន់បើក (២០២៦-០៧)";
    }
    const parts = joinDateStr.split("-");
    if (parts.length >= 2) {
      const year = parts[0];
      const month = parts[1];
      return `មិនទាន់បើក (${toKhmerNumeral(year)}-${toKhmerNumeral(month)})`;
    }
    return "មិនទាន់បើក (២០២៦-០៧)";
  };

  const dynamicPaymentStatusOptions = React.useMemo(() => {
    let startYear = 2026;
    let startMonth = 7;

    if (teachJoinDate) {
      const parts = teachJoinDate.split("-");
      if (parts.length >= 2) {
        startYear = parseInt(parts[0], 10);
        startMonth = parseInt(parts[1], 10);
      }
    }

    const options = [];
    for (let i = 0; i < 5; i++) {
      let y = startYear;
      let m = startMonth + i;
      while (m > 12) {
        m -= 12;
        y += 1;
      }
      const yStr = String(y);
      const mStr = String(m).padStart(2, '0');
      const value = `មិនទាន់បើក (${toKhmerNumeral(yStr)}-${toKhmerNumeral(mStr)})`;
      const labelEn = `Unpaid (${yStr}-${mStr})`;
      const labelZh = `未发放 (${yStr}-${mStr})`;
      options.push({ value, labelEn, labelZh, kh: value });
    }
    return options;
  }, [teachJoinDate]);

  React.useEffect(() => {
    if (isTeacherModalOpen && teachJoinDate) {
      if (!teachPaymentStatus || teachPaymentStatus.startsWith("មិនទាន់បើក")) {
        const parts = teachJoinDate.split("-");
        if (parts.length >= 2) {
          const year = parts[0];
          const month = parts[1];
          const computed = `មិនទាន់បើក (${toKhmerNumeral(year)}-${toKhmerNumeral(month)})`;
          if (teachPaymentStatus !== computed) {
            setTeachPaymentStatus(computed);
          }
        }
      }
    }
  }, [teachJoinDate, isTeacherModalOpen]);

  const [isOpenPaymentDropdown, setIsOpenPaymentDropdown] = React.useState(false);
  const [isOpenStatusDropdown, setIsOpenStatusDropdown] = React.useState(false);

              
              const filteredTeachers = teachers.filter(t => {
                const searchLower = (teacherSearch || "").toLowerCase();
                return (t.nameKh || "").toLowerCase().includes(searchLower) ||
                       (t.nameEn || "").toLowerCase().includes(searchLower) ||
                       (t.specialty || "").toLowerCase().includes(searchLower) ||
                       (t.phone || "").includes(searchLower) ||
                       (t.teacherId || "").toLowerCase().includes(searchLower);
              });
              
              const handleExportTeachers = () => {
                const data = filteredTeachers.map(t => {
                  let expDaysText = "";
                  try {
                    if (t.joinDate) {
                      const join = new Date(t.joinDate);
                      if (!isNaN(join.getTime())) {
                        const now = new Date();
                        now.setHours(0, 0, 0, 0);
                        join.setHours(0, 0, 0, 0);
                        const diffTime = Math.abs(now.getTime() - join.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        expDaysText = uiLang === "kh" ? `បទពិសោធន៍ ${formatLangNum(diffDays)} ថ្ងៃ` : `${diffDays} Days Exp`;
                      }
                    }
                  } catch (e) {
                    expDaysText = "";
                  }

                  return {
                    "ID": t.teacherId,
                    "Name (KH)": t.nameKh,
                    "Name (EN)": t.nameEn,
                    "Gender": t.gender,
                    "DOB / POB": `${t.dob || ""} ${t.pob || ""}`,
                    "Phone": t.phone,
                    "Specialty": t.specialty,
                    "Join Date": t.joinDate,
                    [uiLang === "kh" ? "ថ្ងៃបង្រៀន" : "Experience Days"]: expDaysText,
                    "Salary": t.salary,
                    "Payment": t.paymentStatus,
                    "Status": t.status
                  };
                });
                exportToExcel(data, 'Teachers_Report', uiLang === 'kh' ? 'របាយការណ៍គ្រូបង្រៀន' : 'Teachers Report');
              };

              const handleExportTeachersPDF = async () => {
                showToast("កំពុងរៀបចំឯកសារ PDF...", "info");
                const jsPDF = (await import('jspdf')).default;
                const { safeToJpeg: toJpeg } = await import('../../lib/safe-html-to-image');
                const element = document.createElement('div');
                element.innerHTML = `
                  <div style="font-family: 'Kantumruy Pro', sans-serif; padding: 0px; color: #0f172a; background: #ffffff;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 12px;">
                      <div>
                        <h1 style="font-size: 28px; font-weight: 800; color: #312e81; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2;">${uiLang === 'kh' ? 'របាយការណ៍គ្រូបង្រៀន' : 'Teachers Report'}</h1>
                        <p style="font-size: 13px; color: #64748b; margin: 8px 0 0 0; font-weight: 500;">${uiLang === 'kh' ? 'ទិន្នន័យបញ្ជីឈ្មោះគ្រូបង្រៀនសរុបប្រចាំសាលា' : 'Comprehensive Faculty & Instructor Directory Data'}</p>
                      </div>
                      <div style="text-align: right;">
                        <p style="font-size: 12px; color: #334155; margin: 0; font-weight: 700; display: flex; justify-content: flex-end; gap: 8px;"><span>Date:</span> <span>${new Date().toLocaleDateString('en-GB')}</span></p>
                        <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0; font-weight: 500; display: flex; justify-content: flex-end; gap: 8px;"><span>Total Records:</span> <span>${filteredTeachers.length}</span></p>
                      </div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: left;">
                      <thead>
                        <tr style="background-color: #f8fafc; color: #0f172a; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #2563eb;">
                          <th style="padding: 4px 6px; font-weight: 700; width: 7%;">ID</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 12%;">Name (KH)</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 12%;">Name (EN)</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 7%;">Gender</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 14%;">DOB / POB</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 10%;">Phone</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 12%;">Specialty</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 8%;">Join Date</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 6%; text-align: right;">Salary</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 6%; text-align: center;">Payment</th>
                          <th style="padding: 4px 6px; font-weight: 700; width: 6%; text-align: center;">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${filteredTeachers.map((t, index) => `
                          <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
                            <td style="padding: 4px 6px; font-family: monospace; font-size: 10px; color: #475569;">${t.teacherId}</td>
                            <td style="padding: 4px 6px; font-family: 'Kantumruy Pro', sans-serif; font-weight: 600; color: #0f172a;">${t.nameKh}</td>
                            <td style="padding: 4px 6px; font-weight: 500; color: #0f172a;">${t.nameEn}</td>
                            <td style="padding: 4px 6px; color: #475569;">${t.gender}</td>
                            <td style="padding: 4px 6px;">
                              <div style="color: #1e293b; font-weight: 500;">${t.dob}</div>
                              <div style="font-size: 9px; color: #64748b; margin-top: 2px; font-family: 'Kantumruy Pro', sans-serif; line-height: 1.3;">${t.pob}</div>
                            </td>
                            <td style="padding: 4px 6px; font-family: monospace; font-size: 10px; color: #475569;">${t.phone}</td>
                            <td style="padding: 4px 6px; font-weight: 600; color: #1e293b;">${t.specialty}</td>
                            <td style="padding: 4px 6px; color: #475569;">
                              <div>${t.joinDate}</div>
                              <div style="margin-top: 2px;">
                                ${(() => {
                                  try {
                                    if (!t.joinDate) return "";
                                    const join = new Date(t.joinDate);
                                    if (isNaN(join.getTime())) return "";
                                    const now = new Date();
                                    const diffTime = Math.abs(now.getTime() - join.getTime());
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    return `<span style="color: #b45309; font-size: 8px; font-weight: 800;">${uiLang === 'kh' ? `បទពិសោធន៍ ${formatLangNum(diffDays)} ថ្ងៃ` : `${diffDays} Days Exp`}</span>`;
                                  } catch (e) {
                                    return "";
                                  }
                                })()}
                              </div>
                            </td>
                            <td style="padding: 4px 6px; font-weight: 600; color: #0f172a; text-align: right;">$${t.salary}</td>
                            <td style="padding: 4px 6px; text-align: center;">
                              <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 9px; font-weight: 700; letter-spacing: 0.3px; background-color: ${t.paymentStatus === 'PAID' ? '#d1fae5' : '#fee2e2'}; color: ${t.paymentStatus === 'PAID' ? '#059669' : '#dc2626'};">${t.paymentStatus}</span>
                            </td>
                            <td style="padding: 4px 6px; text-align: center;">
                              <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 9px; font-weight: 700; letter-spacing: 0.3px; background-color: ${t.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2'}; color: ${t.status === 'ACTIVE' ? '#059669' : '#dc2626'};">${t.status}</span>
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
                pdf.save('Teachers_Report.pdf');
                showToast("ទាញយក PDF ជោគជ័យ!", "success");
              };

              return (
                <motion.div
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
                          <Briefcase className="w-4.5 h-4.5" />
                        </span>
                        <span>
                          {uiLang === "kh" ? "ការគ្រប់គ្រងព័ត៌មានគ្រូបង្រៀន" : uiLang === "en" ? "Faculty & Instructor Directory" : "教师及教职工信息管理"}
                        </span>
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={handleExportTeachersPDF}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-3xs hover:border-rose-300 shrink-0"
                      >
                        <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="whitespace-nowrap">{uiLang === "kh" ? "ទាញយក PDF" : "Export PDF"}</span>
                      </button>
                      <button
                        onClick={handleExportTeachers}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-3xs hover:border-primary-200 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="whitespace-nowrap">{uiLang === "kh" ? "ទាញយក Excel" : uiLang === "en" ? "EXPORT EXCEL" : "导出 Excel"}</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingTeacherId(null);
                          setTeachNameKh("");
                          setTeachNameEn("");
                          setTeachSpecialty("Microsoft Office Word & Excel (Microsoft Office Specialist)");
                          setTeachPhone("");
                          setTeachGender("Male");
                          setTeachStatus("ACTIVE");
                          setTeachDob("");
                          setTeachPob("");
                          setTeachJoinDate("");
                          setTeachLeaveDate("");
                          setTeachExperienceDays("");
                          setTeachSalary(450);
                          setTeachPaymentStatus(getFallbackPaymentStatus(""));
                          setTeachTeacherId("");
                          setTeachNotes("");
                          setIsTeacherModalOpen(true);
                        }}
                        className="flex-[1_0_100%] sm:flex-none px-4 sm:px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary-600/15 border-none outline-none shrink-0"
                      >
                        <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{uiLang === "kh" ? "បញ្ចូលគ្រូបង្រៀនថ្មី" : uiLang === "en" ? "Add New Teacher" : "添加新教师"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. STATS/KPI CARDS SECTION (BEAUTIFIED) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Teachers Card */}
                    <div className="bg-white rounded-3xl py-4.5 pl-6 pr-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-300 hover:-translate-y-1 transition-all duration-400 ease-out group relative overflow-hidden text-left">
                      {/* Left premium glow strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500"></div>
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary-50/50 rounded-full blur-xl group-hover:bg-primary-100/60 transition-all duration-500"></div>
                      {/* Vector icon watermark */}
                      <Users className="w-20 h-20 absolute -bottom-3 -right-3 text-primary-500/5 group-hover:text-primary-500/10 transition-all duration-500 group-hover:scale-120 group-hover:-rotate-12 pointer-events-none" />
                      
                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-455 tracking-wider uppercase font-sans">
                          {uiLang === "kh" ? "សរុបគ្រូ/គណៈគ្រប់គ្រង" : uiLang === "en" ? "TOTAL TEACHERS" : "教职工总数"}
                        </p>
                        <h3 className="text-3xl font-black text-slate-850 font-sans tracking-tight">
                          {formatLangNum(teachers.length)} <span className="text-xs font-bold text-slate-400 font-sans">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "People" : "人"}</span>
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 mt-2">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {uiLang === "kh" ? "ប្រុស: " : "M: "}{formatLangNum(teachers.filter(t => t.gender === "Male").length)}
                          </span>
                          <span className="text-slate-200">|</span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            {uiLang === "kh" ? "ស្រី: " : "F: "}{formatLangNum(teachers.filter(t => t.gender === "Female").length)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-primary-50/90 backdrop-blur-xs border border-primary-100/80 text-primary-750 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90 z-10 shadow-3xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                        {uiLang === "kh" ? "គ្រូសរុប" : "FACULTY"}
                      </div>
                    </div>

                    {/* Paid Salary Card */}
                    <div className="bg-white rounded-3xl py-4.5 pl-6 pr-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-300 hover:-translate-y-1 transition-all duration-400 ease-out group relative overflow-hidden text-left">
                      {/* Left premium glow strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-50/50 rounded-full blur-xl group-hover:bg-emerald-100/60 transition-all duration-500"></div>
                      {/* Vector icon watermark */}
                      <CheckCircle className="w-20 h-20 absolute -bottom-3 -right-3 text-emerald-500/5 group-hover:text-emerald-500/10 transition-all duration-500 group-hover:scale-120 group-hover:-rotate-12 pointer-events-none" />

                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-455 tracking-wider uppercase font-sans">
                          {uiLang === "kh" ? "ទូទាត់ប្រាក់ខែរួច" : uiLang === "en" ? "SALARY PAID" : "薪资已发放"}
                        </p>
                        <h3 className="text-3xl font-black text-emerald-600 font-sans tracking-tight">
                          {formatLangNum(0)} <span className="text-xs font-bold text-slate-400 font-sans">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "People" : "人"}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {uiLang === "kh" ? "ទូទាត់រួចរាល់ (0%)" : uiLang === "en" ? "Paid out (0%)" : "已支付完成 (0%)"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-emerald-50/90 backdrop-blur-xs border border-emerald-100/80 text-emerald-750 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90 z-10 shadow-3xs flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        {uiLang === "kh" ? "រួចរាល់" : "PAID"}
                      </div>
                    </div>

                    {/* Pending Salary Card */}
                    <div className="bg-white rounded-3xl py-4.5 pl-6 pr-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-300 hover:-translate-y-1 transition-all duration-400 ease-out group relative overflow-hidden text-left">
                      {/* Left premium glow strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-50/50 rounded-full blur-xl group-hover:bg-amber-100/60 transition-all duration-505"></div>
                      {/* Vector icon watermark */}
                      <Clock className="w-20 h-20 absolute -bottom-3 -right-3 text-amber-500/5 group-hover:text-amber-500/10 transition-all duration-500 group-hover:scale-120 group-hover:-rotate-12 pointer-events-none" />

                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-455 tracking-wider uppercase font-sans">
                          {uiLang === "kh" ? "មិនទាន់បើក" : uiLang === "en" ? "PENDING SALARY" : "薪资待发放"}
                        </p>
                        <h3 className="text-3xl font-black text-amber-600 font-sans tracking-tight">
                          {formatLangNum(teachers.length)} <span className="text-xs font-bold text-slate-400 font-sans">{uiLang === "kh" ? "នាក់" : uiLang === "en" ? "People" : "人"}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {uiLang === "kh" ? "កំពុងរង់ចាំទូទាត់" : uiLang === "en" ? "Awaiting Payment" : "等待发放中"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-amber-50/90 backdrop-blur-xs border border-amber-100/80 text-amber-750 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90 z-10 shadow-3xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {uiLang === "kh" ? "រង់ចាំ" : "PENDING"}
                      </div>
                    </div>
                  </div>

                    {/* Main Table/Grid Panel */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                      {/* Filter / Header inside card */}
                      <div className="py-3 px-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-1.5 h-6.5 bg-primary-600 rounded-full shrink-0"></span>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-[13px]">
                              {uiLang === "kh" ? "សមាជិកគណៈគ្រប់គ្រង និងគ្រូបង្រៀនទាំងអស់" : uiLang === "en" ? "All Faculty & Instructor Members" : "全体教职员工和教师"}
                            </h4>
                            <p className="text-[10.5px] text-slate-400 mt-0.5 font-semibold">
                              {uiLang === "kh" ? "បញ្ជីបច្ចុប្បន្នភាព និងដំណើរការបើកប្រាក់ខែជូនសាស្ត្រាចារ្យ" : uiLang === "en" ? "Updated directory and payroll status for instructors" : "教职工花名册及工资发放状态"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <div className="relative">
                            <input
                              type="text"
                              value={teacherSearch}
                              onChange={(e) => setTeacherSearch(e.target.value)}
                              placeholder={uiLang === "kh" ? "ស្វែងរកគ្រូ... (ID, ឈ្មោះ, មុខវិជ្ជា, ...)" : uiLang === "en" ? "Search instructors... (ID, Name, Subject, ...)" : "搜索教职工... (ID、姓名、课程等...)"}
                              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500 w-[200px] md:w-[240px] placeholder:text-slate-300"
                            />
                            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                          </div>

                          {/* Toggle View mode */}
                          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
                            <button
                              onClick={() => setTeacherViewMode('table')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                                teacherViewMode === 'table'
                                  ? 'bg-white text-primary-600 shadow-3xs'
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <List className="w-3 h-3" />
                              <span>{uiLang === "kh" ? "តារាង" : uiLang === "en" ? "Table" : "列表"}</span>
                            </button>
                            <button
                              onClick={() => setTeacherViewMode('grid')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                                teacherViewMode === 'grid'
                                  ? 'bg-white text-primary-600 shadow-3xs'
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <LayoutGrid className="w-3 h-3" />
                              <span>{uiLang === "kh" ? "ប្រអប់" : uiLang === "en" ? "Grid" : "网格"}</span>
                            </button>
                          </div>


                        </div>
                      </div>

                      {/* View Renderer */}
                      {teacherViewMode === 'table' ? (
                        <div className="overflow-x-auto border-t border-slate-100 scrollbar-none">
                          <table className="w-full min-w-[900px] text-left border-collapse text-xs relative">
                            <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                              <tr className="bg-slate-50/95 text-slate-450 font-bold uppercase tracking-wider">
                                <th className="px-6 py-3 text-[12px] font-black uppercase tracking-wider w-[24%]">
                                  {uiLang === "kh" ? "ព័ត៌មានបុគ្គលិក / គ្រូបង្រៀន (FACULTY ID)" : uiLang === "en" ? "FACULTY / TEACHER INFO (FACULTY ID)" : "教职工/教师信息 (FACULTY ID)"}
                                </th>
                                <th className="px-6 py-3 text-[12px] font-black uppercase tracking-wider w-[34%]">
                                  {uiLang === "kh" ? "ជំនាញឯកទេស / មុខវិជ្ជា" : uiLang === "en" ? "SPECIALIZATION / SUBJECT" : "专业技能 / 教授课程"}
                                </th>
                                <th className="px-6 py-3 text-[12px] font-black uppercase tracking-wider w-[16%]">
                                  {uiLang === "kh" ? "លេខទូរស័ព្ទ" : uiLang === "en" ? "PHONE" : "联系电话"}
                                </th>
                                <th className="px-6 py-3 text-[12px] font-black uppercase tracking-wider w-[14%]">
                                  {uiLang === "kh" ? "ប្រាក់ខែ & ស្ថានភាព" : uiLang === "en" ? "SALARY & STATUS" : "薪资 & 状态"}
                                </th>
                                <th className="px-6 py-3 text-[12px] font-black uppercase tracking-wider w-[12%] text-right pr-8">
                                  {uiLang === "kh" ? "សកម្មភាព" : uiLang === "en" ? "ACTIONS" : "操作"}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTeachers.map((teacher, index) => {
                                  const isFemale = teacher.gender === "Female";
                                  const avatarBg = isFemale
                                    ? "bg-blue-50 text-pink-500 border-pink-100"
                                    : "bg-blue-50 text-blue-500 border-blue-100";
                                  
                                  return (
                                    <tr key={teacher.id} className={`hover:bg-slate-50/40 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/75"}`}>
                                      {/* Col 1: Faculty Info */}
                                      <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3.5">
                                          {/* Avatar Container */}
                                          <div className="relative shrink-0">
                                            <div className={`w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-base shadow-xs overflow-hidden relative`}>
                                              <span className="relative z-10">{isFemale ? "👧" : "👦"}</span>
                                            </div>
                                            {/* Pulsing Active Status Dot */}
                                            <span className={`absolute bottom-[-0.5px] right-[-0.5px] w-3 h-3 border-2 border-white rounded-full shadow-xs ${
                                              teacher.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' :
                                              teacher.status === 'LEAVE' ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}></span>
                                          </div>

                                          {/* Name & metadata */}
                                          <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <p className="text-[15px] font-black text-slate-800 truncate">
                                                {uiLang === "kh" ? teacher.nameKh : (teacher.nameEn || teacher.nameKh)}
                                              </p>
                                              <span className="bg-amber-50 text-amber-750 px-1.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                {uiLang === "kh" ? teacher.nameEn : teacher.nameKh}
                                              </span>
                                              <span className="bg-amber-50/20 text-amber-850 px-1.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider">
                                                {teacher.teacherId || "SMS-T-201"}
                                              </span>
                                            </div>

                                            {/* Details under Name */}
                                            <div className="flex items-center gap-x-2.5 gap-y-0.5 text-[11.5px] font-semibold text-slate-400 whitespace-nowrap">
                                              <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-300" />
                                                <span>{formatLangDate(teacher.dob) || (uiLang === "kh" ? "១២/០៤/១៩៩៤" : "12/04/1994")}</span>
                                              </span>
                                              <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-slate-300" />
                                                <span>{translatePOB(teacher.pob || "ភ្នំពេញ", uiLang)}</span>
                                              </span>
                                              <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-slate-300" />
                                                <span>
                                                  {uiLang === "kh" ? "ចូល៖ " : uiLang === "en" ? "Join: " : "入职: "}
                                                  {formatLangDate(teacher.joinDate) || (uiLang === "kh" ? "០១/០១/២០២២" : "01/01/2022")}
                                                </span>
                                              </span>
                                              {teacher.leaveDate && (
                                                <span className="flex items-center gap-1 text-rose-500 font-bold">
                                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                                                  <span>
                                                    {uiLang === "kh" ? "ឈប់៖ " : uiLang === "en" ? "Resigned: " : "离职: "}
                                                    {formatLangDate(teacher.leaveDate)}
                                                  </span>
                                                </span>
                                              )}
                                              {teacher.experienceDays && (
                                                <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1 rounded font-bold">
                                                  <Award className="w-2.5 h-2.5 text-amber-500" />
                                                  <span>{formatExperienceDays(teacher.experienceDays)}</span>
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      {/* Col 2: Specialty */}
                                      <td className="px-6 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 bg-primary-50/70 text-primary-700 px-2 py-0.5 rounded-full text-[11px] font-black">
                                          <BookOpen className="w-3 h-3 text-primary-500 shrink-0" />
                                          {translateCourseOrSpecialtyName(teacher.specialty, uiLang)}
                                        </span>
                                      </td>

                                      {/* Col 3: Phone */}
                                      <td className="px-6 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-full text-[13px] font-bold font-mono">
                                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                          {teacher.phone}
                                        </span>
                                      </td>

                                      {/* Col 4: Salary & Status */}
                                      <td className="px-6 py-3.5">
                                        <div className="space-y-0.5">
                                          <p className="text-[15px] font-black text-slate-800 font-sans">
                                            ${(teacher.salary || 450).toFixed(2)}
                                          </p>
                                          <span className="inline-flex items-center gap-1 text-amber-600 text-[10px] font-black whitespace-nowrap">
                                            {formatPaymentStatus(teacher.paymentStatus || getFallbackPaymentStatus(teacher.joinDate))}
                                          </span>
                                        </div>
                                      </td>

                                      {/* Col 5: Actions */}
                                      <td className="px-6 py-3.5 text-right pr-8">
                                        <div className="flex gap-2 justify-end">
                                          <button
                                            onClick={() => {
                                              setSelectedTeacher(teacher);
                                              setIsViewTeacherModalOpen(true);
                                            }}
                                            className="p-1.5 bg-transparent hover:bg-slate-100 border border-transparent text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                                            title={uiLang === "kh" ? "មើលព័ត៌មាន" : uiLang === "en" ? "View" : "查看"}
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => {
                                              setEditingTeacherId(teacher.id);
                                              setTeachNameKh(teacher.nameKh);
                                              setTeachNameEn(teacher.nameEn);
                                              setTeachSpecialty(teacher.specialty);
                                              setTeachPhone(teacher.phone);
                                              setTeachGender(teacher.gender as 'Female' | 'Male');
                                              setTeachStatus(teacher.status);
                                              setTeachDob(teacher.dob || "");
                                              setTeachPob(teacher.pob || "");
                                              setTeachJoinDate(teacher.joinDate || "");
                                              setTeachLeaveDate(teacher.leaveDate || "");
                                              setTeachExperienceDays(teacher.experienceDays || "");
                                              setTeachSalary(teacher.salary || 450);
                                              setTeachPaymentStatus(teacher.paymentStatus || getFallbackPaymentStatus(teacher.joinDate));
                                              setTeachTeacherId(teacher.teacherId || "");
                                              setTeachNotes((teacher as any).notes || "");
                                              setIsTeacherModalOpen(true);
                                            }}
                                            className="p-1.5 bg-transparent hover:bg-slate-100 border border-transparent text-slate-500 hover:text-primary-600 rounded-lg transition-colors cursor-pointer"
                                            title={uiLang === "kh" ? "កែប្រែ" : uiLang === "en" ? "Edit" : "编辑"}
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteTeacher(teacher.id)}
                                            className="p-1.5 bg-transparent hover:bg-rose-50 border border-transparent text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                            title={uiLang === "kh" ? "លុប" : uiLang === "en" ? "Delete" : "删除"}
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
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
                        /* Teachers Grid Mode */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6 bg-slate-50/50">
                          {filteredTeachers.map((teacher) => {
                              const isFemale = teacher.gender === "Female";
                              const avatarBg = isFemale
                                ? "bg-blue-50 text-pink-500 border-pink-100"
                                : "bg-blue-50 text-blue-500 border-blue-100";
                              
                              return (
                                <motion.div
                                  key={teacher.id}
                                  whileHover={{ y: -4 }}
                                  className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs p-5 relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-start gap-4">
                                      <div className="relative shrink-0">
                                        <div className={`w-12 h-12 rounded-xl bg-amber-100 border-2 border-white flex items-center justify-center text-2xl shadow-sm overflow-hidden`}>
                                          <span>{isFemale ? "👧" : "👦"}</span>
                                        </div>
                                        <span className={`absolute bottom-[-1px] right-[-1px] w-3 h-3 border-2 border-white rounded-full ${
                                          teacher.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' :
                                          teacher.status === 'LEAVE' ? 'bg-amber-500' : 'bg-rose-500'
                                        }`}></span>
                                      </div>

                                      <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <h4 className="text-sm font-black text-slate-800 truncate">
                                            {uiLang === "kh" ? teacher.nameKh : (teacher.nameEn || teacher.nameKh)}
                                          </h4>
                                          <span className="text-[10px] font-bold text-slate-400 font-sans">
                                            ({uiLang === "kh" ? teacher.nameEn : teacher.nameKh})
                                          </span>
                                        </div>
                                        <p className="text-[10.5px] font-black text-primary-600 uppercase tracking-wider">
                                          {translateCourseOrSpecialtyName(teacher.specialty, uiLang)}
                                        </p>
                                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1 font-mono">
                                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                                          {teacher.phone}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Extra details in grid */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-400">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                        <span className="truncate">{formatLangDate(teacher.dob) || "N/A"}</span>
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                        <span className="truncate">{translatePOB(teacher.pob || "", uiLang) || "N/A"}</span>
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                        <span className="truncate">
                                          {uiLang === "kh" ? "ចូល៖ " : uiLang === "en" ? "Join: " : "入职: "}
                                          {formatLangDate(teacher.joinDate) || "N/A"}
                                        </span>
                                      </span>
                                      {teacher.leaveDate && (
                                        <span className="flex items-center gap-1 text-rose-500 truncate col-span-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                                          <span>
                                            {uiLang === "kh" ? "ឈប់៖ " : uiLang === "en" ? "Resigned: " : "离职: "}
                                            {formatLangDate(teacher.leaveDate)}
                                          </span>
                                        </span>
                                      )}
                                      {teacher.experienceDays && (
                                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1 rounded font-bold col-span-2">
                                          <Award className="w-3 h-3 text-amber-500 shrink-0" />
                                          <span>{formatExperienceDays(teacher.experienceDays)}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Footer Salary & Actions */}
                                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                                    <div className="text-[11px] flex items-center gap-1">
                                      <span className="font-extrabold text-slate-500">
                                        {uiLang === "kh" ? "ប្រាក់ខែ៖ " : uiLang === "en" ? "Salary: " : "基本薪资: "}
                                      </span>
                                      <span className="font-black text-slate-800 font-sans">${(teacher.salary || 450).toFixed(2)}</span>
                                      <span className="ml-1 text-amber-600 text-[10px] font-black whitespace-nowrap">
                                        {formatPaymentStatus(teacher.paymentStatus || getFallbackPaymentStatus(teacher.joinDate))}
                                      </span>
                                    </div>

                                    <div className="flex gap-1.5">
                                      <button
                                        onClick={() => {
                                          setSelectedTeacher(teacher);
                                          setIsViewTeacherModalOpen(true);
                                        }}
                                        className="p-1.5 bg-transparent hover:bg-slate-100 border border-transparent text-slate-600 rounded-lg transition-colors cursor-pointer"
                                        title={uiLang === "kh" ? "មើលព័ត៌មាន" : uiLang === "en" ? "View" : "查看"}
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingTeacherId(teacher.id);
                                          setTeachNameKh(teacher.nameKh);
                                          setTeachNameEn(teacher.nameEn);
                                          setTeachSpecialty(teacher.specialty);
                                          setTeachPhone(teacher.phone);
                                          setTeachGender(teacher.gender as 'Female' | 'Male');
                                          setTeachStatus(teacher.status);
                                          setTeachDob(teacher.dob || "");
                                          setTeachPob(teacher.pob || "");
                                          setTeachJoinDate(teacher.joinDate || "");
                                          setTeachLeaveDate(teacher.leaveDate || "");
                                          setTeachExperienceDays(teacher.experienceDays || "");
                                          setTeachSalary(teacher.salary || 450);
                                          setTeachPaymentStatus(teacher.paymentStatus || getFallbackPaymentStatus(teacher.joinDate));
                                          setTeachTeacherId(teacher.teacherId || "");
                                          setTeachNotes((teacher as any).notes || "");
                                          setIsTeacherModalOpen(true);
                                        }}
                                        className="p-1.5 bg-transparent hover:bg-slate-100 border border-transparent text-slate-600 rounded-lg transition-colors cursor-pointer"
                                        title={uiLang === "kh" ? "កែប្រែ" : uiLang === "en" ? "Edit" : "编辑"}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTeacher(teacher.id)}
                                        className="p-1.5 bg-transparent hover:bg-rose-50 border border-transparent text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                        title={uiLang === "kh" ? "លុប" : uiLang === "en" ? "Delete" : "删除"}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                        </div>
                      )}
                    </div>

                    {/* Teacher Entry Modal Overlay */}
                    {isTeacherModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-hidden">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-xl mx-auto overflow-hidden flex flex-col max-h-[92vh]"
                        >
                          {/* Modal Header */}
                          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100 shadow-3xs">
                                <UserPlus className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-extrabold text-slate-900 text-[15px] leading-tight">
                                  {editingTeacherId ? idt("កែប្រែព័ត៌មានគ្រូ", "Edit Faculty Details", "修改教师资料") : idt("បញ្ចូលគ្រូបង្រៀនថ្មី", "Add New Teacher", "添加新教师")}
                                </h3>
                                <p className="text-[11px] font-bold text-primary-500 mt-0.5">
                                  {editingTeacherId ? idt("កែប្រែព័ត៌មានលម្អិតរបស់គ្រូ", "Edit Faculty Details", "修改教师详细信息") : idt("បំពេញព័ត៌មានលម្អិតរបស់គ្រូ", "New Faculty Details", "填写教师详细信息")}
                                </p>
                              </div>
                            </div>
                            <button onClick={() => setIsTeacherModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold transition-all cursor-pointer">✕</button>
                          </div>

                          {/* Modal Form */}
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            
                            // 1. Strict Input Validations
                            if (!teachNameKh || !teachNameKh.trim()) {
                              showToast(uiLang === "kh" ? "សូមបញ្ចូលឈ្មោះគ្រូជាភាសាខ្មែរ!" : "Please enter teacher's Khmer name!", "error");
                              return;
                            }
                            if (!teachNameEn || !teachNameEn.trim()) {
                              showToast(uiLang === "kh" ? "សូមបញ្ចូលឈ្មោះគ្រូជាភាសាអង់គ្លេស!" : "Please enter teacher's English name!", "error");
                              return;
                            }
                            if (!teachPhone || !teachPhone.trim()) {
                              showToast(uiLang === "kh" ? "សូមបញ្ចូលលេខទូរស័ព្ទគ្រូ!" : "Please enter teacher's phone number!", "error");
                              return;
                            }

                            const cleanTeachNameEn = teachNameEn.trim();
                            // English name regex
                            const nameRegex = /^[A-Za-z\s.\-]+$/;
                            if (!nameRegex.test(cleanTeachNameEn)) {
                              showToast(uiLang === "kh" ? "ឈ្មោះភាសាអង់គ្លេសអាចមានតែអក្សរ ឃ្លា និងសញ្ញា (-) (.) ប៉ុណ្ណោះ!" : "English name can only contain letters, spaces, hyphens, and dots!", "error");
                              return;
                            }

                            // Phone format verification
                            const cleanPhone = teachPhone.trim();
                            const phoneRegex = /^[+0-9\s\-()]{8,15}$/;
                            if (!phoneRegex.test(cleanPhone)) {
                              showToast(uiLang === "kh" ? "លេខទូរស័ព្ទមិនត្រឹមត្រូវ! (៨ ដល់ ១៥ ខ្ទង់)" : "Invalid phone number! (8 to 15 digits/symbols)", "error");
                              return;
                            }

                            // Salary check
                            const salaryVal = Number(teachSalary) || 0;
                            if (salaryVal < 0) {
                              showToast(uiLang === "kh" ? "ប្រាក់ខែមិនអាចអវិជ្ជមានឡើយ!" : "Salary cannot be negative!", "error");
                              return;
                            }

                            // Date logical checks
                            if (teachDob) {
                              const dobDate = new Date(teachDob);
                              if (dobDate > new Date()) {
                                showToast(uiLang === "kh" ? "ថ្ងៃខែឆ្នាំកំណើតមិនអាចនៅក្នុងអនាគតឡើយ!" : "Date of birth cannot be in the future!", "error");
                                return;
                              }
                            }
                            if (teachJoinDate && teachLeaveDate && new Date(teachJoinDate) > new Date(teachLeaveDate)) {
                              showToast(uiLang === "kh" ? "ថ្ងៃចូលបម្រើការងារមិនអាចនៅក្រោយថ្ងៃចាកចេញឡើយ!" : "Join date cannot be after leave date!", "error");
                              return;
                            }

                            // Helper to strip script tags and HTML injection dynamically in frontend
                            const stripHtml = (str: string) => {
                              if (!str) return "";
                              return str.replace(/<[^>]*>?/gm, '').trim();
                            };

                            // Calculate next safe unique Teacher ID
                            let finalTeacherId = teachTeacherId;
                            if (!finalTeacherId) {
                              let maxNum = 200; // Base start of T-201
                              teachers.forEach(t => {
                                if (t.teacherId) {
                                  const match = t.teacherId.match(/SMS-T-(\d+)/);
                                  if (match) {
                                    const num = parseInt(match[1], 10);
                                    if (num > maxNum) maxNum = num;
                                  } else {
                                    const genericMatch = t.teacherId.match(/(\d+)$/);
                                    if (genericMatch) {
                                      const num = parseInt(genericMatch[1], 10);
                                      if (num > maxNum) maxNum = num;
                                    }
                                  }
                                }
                              });
                              finalTeacherId = `SMS-T-${maxNum + 1}`;
                            }

                            const teacherPayload = {
                              teacherId: stripHtml(finalTeacherId),
                              nameKh: stripHtml(teachNameKh),
                              nameEn: cleanTeachNameEn,
                              specialty: stripHtml(teachSpecialty),
                              phone: stripHtml(cleanPhone),
                              gender: stripHtml(teachGender),
                              status: stripHtml(teachStatus),
                              dob: stripHtml(teachDob),
                              pob: stripHtml(teachPob),
                              joinDate: stripHtml(teachJoinDate),
                              leaveDate: stripHtml(teachLeaveDate),
                              experienceDays: calculatedExpDays,
                              salary: salaryVal,
                              paymentStatus: stripHtml(teachPaymentStatus) || getFallbackPaymentStatus(teachJoinDate),
                              notes: stripHtml(teachNotes)
                            };

                            if (editingTeacherId) {
                              fetch(`/api/teachers/${editingTeacherId}`, {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify(teacherPayload)
                              })
                                .then(res => {
                                  if (!res.ok) throw new Error("Failed to update teacher");
                                  return res.json();
                                })
                                .then(data => {
                                  if (data.teacher) {
                                    setTeachers(prev => prev.map(t => t.id === editingTeacherId ? data.teacher : t));
                                    showToast("បានកែប្រែព័ត៌មានគ្រូដោយជោគជ័យ! (Teacher details updated successfully!)", "success");
                                    setIsTeacherModalOpen(false);
                                  }
                                })
                                .catch(err => {
                                  console.error(err);
                                  showToast("មានបញ្ហាក្នុងការកែប្រែព័ត៌មានគ្រូ! (Failed to update teacher details!)", "error");
                                });
                            } else {
                              fetch("/api/teachers", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify(teacherPayload)
                              })
                                .then(res => {
                                  if (!res.ok) throw new Error("Failed to create teacher");
                                  return res.json();
                                })
                                .then(data => {
                                  if (data.teacher) {
                                    setTeachers(prev => [...prev, data.teacher]);
                                    showToast("បានបន្ថែមគ្រូបង្រៀនថ្មីដោយជោគជ័យ! (New teacher added successfully!)", "success");
                                    setIsTeacherModalOpen(false);
                                  }
                                })
                                .catch(err => {
                                  console.error(err);
                                  showToast("មានបញ្ហាក្នុងការបន្ថែមគ្រូបង្រៀនថ្មី! (Failed to add new teacher!)", "error");
                                });
                            }
                            
                            // Sync specialty if new
                            if (teachSpecialty) {
                              const trimmed = teachSpecialty.trim();
                              if (trimmed && !specialtyOptions.includes(trimmed)) {
                                const updatedSpecialties = [...specialtyOptions, trimmed];
                                setSpecialtyOptions(updatedSpecialties);
                                
                                // Save updated specialtyOptions to settings API
                                fetch("/api/system/settings", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                  },
                                  body: JSON.stringify({
                                    schoolName,
                                    directorName,
                                    baseFee,
                                    appTheme,
                                    courseOptions,
                                    levelOptions,
                                    shiftOptions,
                                    hoursOptions,
                                    specialtyOptions: updatedSpecialties
                                  })
                                }).catch(err => console.error("Failed to sync new specialty option:", err));
                              }
                            }

                            setIsTeacherModalOpen(false);
                          }} className="flex flex-col min-h-0 flex-1 overflow-hidden">
                            <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0 pr-1">
                              
                              {/* Section 1: Personal Profile & Contact */}
                              <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                                  <span className="w-1.5 h-3 bg-primary-500 rounded-full" />
                                  <h4 className="text-[11px] font-black text-primary-950 uppercase tracking-wider font-sans">
                                    {idt("ព័ត៌មានផ្ទាល់ខ្លួន & ទំនាក់ទំនង", "Profile & Contact", "个人资料与联系方式")}
                                  </h4>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ឈ្មោះជាភាសាខ្មែរ", "Khmer Name", "高棉语姓名")} <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="text"
                                        value={teachNameKh}
                                        onChange={(e) => setTeachNameKh(e.target.value)}
                                        placeholder={idt("ឧទាហរណ៍៖ សុខ ជា", "E.g. SOK CHEA", "例如: 苏切亚")}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300 shadow-3xs"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ឈ្មោះឡាតាំង", "English/Latin Name", "英语/拉丁姓名")} <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="text"
                                        value={teachNameEn}
                                        onChange={(e) => setTeachNameEn(e.target.value)}
                                        placeholder={idt("ឧទាហរណ៍៖ SOK CHEA", "E.g. SOK CHEA", "例如: SOK CHEA")}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 uppercase focus:outline-none font-sans transition-all placeholder:text-slate-300 shadow-3xs"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("លេខកូដគ្រូ", "Teacher ID", "教师工号")}
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Award className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="text"
                                        value={teachTeacherId}
                                        onChange={(e) => setTeachTeacherId(e.target.value)}
                                        placeholder={idt("ស្វ័យប្រវត្តិ", "Auto-generated", "自动生成")}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 focus:outline-none text-xs font-bold shadow-3xs cursor-not-allowed"
                                        readOnly
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ភេទ", "Gender", "性别")}
                                    </label>
                                    <div className="flex bg-slate-200/40 p-1 rounded-xl border border-slate-200/60 shadow-3xs h-[38px] items-center">
                                      <button
                                        type="button"
                                        onClick={() => setTeachGender("Male")}
                                        className={`flex-1 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer h-full flex items-center justify-center ${
                                          teachGender === "Male"
                                            ? "bg-white text-primary-600 shadow-xs border border-slate-200/30 font-black"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                      >
                                        {idt("ប្រុស", "Male (M)", "男 (M)")}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setTeachGender("Female")}
                                        className={`flex-1 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer h-full flex items-center justify-center ${
                                          teachGender === "Female"
                                            ? "bg-white text-rose-600 shadow-xs border border-slate-200/30 font-black"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                      >
                                        {idt("ស្រី", "Female (F)", "女 (F)")}
                                      </button>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <label className="block text-[11px] font-extrabold text-slate-600 font-sans">
                                        {idt("ជំនាញបង្រៀន", "Specialty", "教学专业")} <span className="text-rose-500">*</span>
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() => setIsOpenSpecialtyDropdown(!isOpenSpecialtyDropdown)}
                                        className="text-[10px] font-bold text-primary-600 hover:text-primary-800 flex items-center gap-0.5 cursor-pointer font-sans shrink-0 leading-none"
                                      >
                                        <Plus className="w-2.5 h-2.5" /> {idt("កែសម្រួល / បន្ថែម", "Edit / Add", "编辑 / 添加")}
                                      </button>
                                    </div>
                                    {showAddSpecialty ? (
                                      <div className="flex items-center gap-1.5 h-[38px] animate-fadeIn">
                                        <input
                                          type="text"
                                          value={newCustomSpecialty}
                                          onChange={(e) => setNewCustomSpecialty(e.target.value)}
                                          placeholder={idt("បញ្ចូលជំនាញថ្មី...", "Enter new specialty...", "输入新专业...")}
                                          className="flex-1 px-3 py-1.5 h-full rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none"
                                          autoFocus
                                        />
                                        <button
                                          type="button"
                                          onClick={handleAddSpecialtyOption}
                                          className="px-2.5 h-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors"
                                        >
                                          {idt("រក្សាទុក", "Save", "保存")}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setNewCustomSpecialty("");
                                            setShowAddSpecialty(false);
                                          }}
                                          className="px-2.5 h-full bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors"
                                        >
                                          {idt("បោះបង់", "Cancel", "取消")}
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="relative h-[38px]">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
                                          <BookOpen className="w-3.5 h-3.5" />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => setIsOpenSpecialtyDropdown(!isOpenSpecialtyDropdown)}
                                          className="w-full h-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all bg-white shadow-3xs flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/30"
                                        >
                                          <span className="truncate">{teachSpecialty || idt("ជ្រើសរើសជំនាញ...", "Select specialty...", "选择专业...")}</span>
                                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpenSpecialtyDropdown ? "rotate-180" : ""}`} />
                                        </button>

                                        {/* Floating Dropdown List */}
                                        {isOpenSpecialtyDropdown && (
                                          <>
                                            <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenSpecialtyDropdown(false)} />
                                            <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden p-1.5 text-xs flex flex-col max-h-[250px]">
                                              <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 scrollbar-none">
                                                {specialtyOptions.map((opt, idx) => {
                                                  const isEditing = editingSpecialtyIndex === idx;
                                                  const isSelected = teachSpecialty === opt;

                                                  return (
                                                    <div 
                                                      key={idx} 
                                                      className={`flex items-center justify-between p-1.5 rounded-lg transition-all group ${
                                                        isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                                      }`}
                                                    >
                                                      {specialtyToDeleteIndex === idx ? (
                                                        <div className="flex items-center justify-between gap-1 w-full bg-rose-50/80 px-2 py-1 rounded-lg border border-rose-200/50" onClick={(e) => e.stopPropagation()}>
                                                          <span className="text-[10px] font-bold text-rose-600 animate-pulse">
                                                            {idt("លុបជំនាញនេះ?", "Delete?", "确定删除?")}
                                                          </span>
                                                          <div className="flex items-center gap-1.5 shrink-0">
                                                            <button
                                                              type="button"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteSpecialtyOption(idx);
                                                                setSpecialtyToDeleteIndex(null);
                                                              }}
                                                              className="p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-md cursor-pointer shrink-0 transition-colors shadow-sm"
                                                              title={idt("យល់ព្រម", "Confirm", "确定")}
                                                            >
                                                              <Check className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                              type="button"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSpecialtyToDeleteIndex(null);
                                                              }}
                                                              className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer shrink-0 transition-colors"
                                                              title={idt("បោះបង់", "Cancel", "取消")}
                                                            >
                                                              <X className="w-3 h-3" />
                                                            </button>
                                                          </div>
                                                        </div>
                                                      ) : isEditing ? (
                                                        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                                                          <input
                                                            type="text"
                                                            value={editingSpecialtyValue}
                                                            onChange={(e) => setEditingSpecialtyValue(e.target.value)}
                                                            onKeyDown={(e) => {
                                                              if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                handleEditSpecialtyOption(idx, editingSpecialtyValue);
                                                                setEditingSpecialtyIndex(null);
                                                              } else if (e.key === "Escape") {
                                                                setEditingSpecialtyIndex(null);
                                                              }
                                                            }}
                                                            className="flex-1 px-2 py-0.5 text-xs border border-primary-200 rounded-md focus:outline-none focus:border-primary-500 font-bold bg-white text-slate-700"
                                                            autoFocus
                                                          />
                                                          <button
                                                            type="button"
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleEditSpecialtyOption(idx, editingSpecialtyValue);
                                                              setEditingSpecialtyIndex(null);
                                                            }}
                                                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer shrink-0"
                                                          >
                                                            <Check className="w-3.5 h-3.5" />
                                                          </button>
                                                          <button
                                                            type="button"
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              setEditingSpecialtyIndex(null);
                                                            }}
                                                            className="p-1 text-slate-400 hover:bg-slate-100 rounded-md cursor-pointer shrink-0"
                                                          >
                                                            <X className="w-3.5 h-3.5" />
                                                          </button>
                                                        </div>
                                                      ) : (
                                                        <>
                                                          <button
                                                            type="button"
                                                            onClick={() => {
                                                              setTeachSpecialty(opt);
                                                              setIsOpenSpecialtyDropdown(false);
                                                            }}
                                                            className="flex-1 text-left font-bold cursor-pointer pr-4 truncate"
                                                          >
                                                            {opt}
                                                          </button>
                                                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:opacity-100 transition-opacity shrink-0">
                                                            <button
                                                              type="button"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingSpecialtyIndex(idx);
                                                                setEditingSpecialtyValue(opt);
                                                              }}
                                                              className="p-1 text-primary-500 hover:bg-primary-100/50 rounded-md cursor-pointer"
                                                              title="កែប្រែ (Edit)"
                                                            >
                                                              <Pencil className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                              type="button"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSpecialtyToDeleteIndex(idx);
                                                              }}
                                                              className="p-1 text-rose-500 hover:bg-rose-100/50 rounded-md cursor-pointer"
                                                              title="លុប (Delete)"
                                                            >
                                                              <Trash2 className="w-3 h-3" />
                                                            </button>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                              
                                              {/* Add New Option inside the dropdown */}
                                              <div className="border-t border-slate-100 pt-1.5 mt-1.5 flex items-center gap-1">
                                                <input
                                                  type="text"
                                                  value={newCustomSpecialty}
                                                  onChange={(e) => setNewCustomSpecialty(e.target.value)}
                                                  placeholder={idt("+ បន្ថែមជំនាញថ្មី...", "+ Add new specialty...", "+ 添加新专业...")}
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                      e.preventDefault();
                                                      handleAddSpecialtyOption();
                                                    }
                                                  }}
                                                  className="flex-1 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 text-[11px] font-bold text-slate-700 bg-slate-50/50"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={handleAddSpecialtyOption}
                                                  className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm shrink-0"
                                                >
                                                  {idt("បន្ថែម", "Add", "添加")}
                                                </button>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("លេខទូរស័ព្ទ", "Phone Number", "联系电话")} <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Smartphone className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="text"
                                        value={teachPhone}
                                        onChange={(e) => setTeachPhone(e.target.value)}
                                        placeholder={idt("ឧទាហរណ៍៖ 012 345 678", "E.g. 012 345 678", "例如: 012 345 678")}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300 shadow-3xs"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Section 2: Biography & Dates */}
                              <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                                  <span className="w-1.5 h-3 bg-emerald-500 rounded-full" />
                                  <h4 className="text-[11px] font-black text-emerald-950 uppercase tracking-wider font-sans">
                                    {idt("ប្រវត្តិរូប & កាលបរិច្ឆេទ", "Profile & Dates", "个人简历与日期")}
                                  </h4>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ថ្ងៃខែឆ្នាំកំណើត", "Date of Birth", "出生日期")}
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="date"
                                        value={teachDob}
                                        onChange={(e) => setTeachDob(e.target.value)}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all font-sans shadow-3xs"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ទីកន្លែងកំណើត", "Place of Birth", "出生地点")}
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <MapPin className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="text"
                                        value={teachPob}
                                        onChange={(e) => setTeachPob(e.target.value)}
                                        placeholder={idt("ឧទាហរណ៍៖ ខេត្តកណ្តាល", "E.g. Kandal Province", "例如: 干丹省")}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300 shadow-3xs"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ថ្ងៃចូលធ្វើការ", "Join Date", "入职日期")}
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="date"
                                        value={teachJoinDate}
                                        onChange={(e) => setTeachJoinDate(e.target.value)}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all font-sans shadow-3xs"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ថ្ងៃឈប់ធ្វើការ", "Leave Date", "离职日期")}
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="date"
                                        value={teachLeaveDate}
                                        onChange={(e) => setTeachLeaveDate(e.target.value)}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all font-sans shadow-3xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Section 3: Salary & Employment Status */}
                              <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                                  <span className="w-1.5 h-3 bg-amber-500 rounded-full" />
                                  <h4 className="text-[11px] font-black text-amber-950 uppercase tracking-wider font-sans">
                                    {idt("ប្រាក់បៀវត្សរ៍ & ការងារ", "Compensation & Job", "薪资与职务")}
                                  </h4>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ប្រាក់ខែ", "Salary (USD)", "月薪 (USD)")}
                                    </label>
                                    <div className="relative h-[38px]">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-sans font-extrabold">
                                        <DollarSign className="w-3.5 h-3.5" />
                                      </div>
                                      <input
                                        type="number"
                                        value={teachSalary}
                                        onChange={(e) => setTeachSalary(Number(e.target.value))}
                                        className="w-full h-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all font-sans shadow-3xs"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ស្ថានភាពបើកប្រាក់ខែ", "Salary Status", "工资状态")}
                                    </label>
                                    <div className="relative h-[38px] w-full">
                                      <button
                                        type="button"
                                        onClick={() => setIsOpenPaymentDropdown(!isOpenPaymentDropdown)}
                                        className="w-full h-full pl-9 pr-9 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all bg-white font-sans shadow-3xs cursor-pointer flex items-center text-left relative"
                                      >
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                          <CreditCard className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="truncate">
                                          {teachPaymentStatus === "បើករួចរាល់" 
                                            ? idt("បើករួចរាល់", "Paid / Fully Paid", "已发放")
                                            : formatPaymentStatus(teachPaymentStatus)
                                          }
                                        </span>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpenPaymentDropdown ? "rotate-180" : ""}`} />
                                        </div>
                                      </button>

                                      {isOpenPaymentDropdown && (
                                        <>
                                          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenPaymentDropdown(false)} />
                                          <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden p-1.5 text-xs flex flex-col max-h-[160px] select-none">
                                            <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 scrollbar-thin">
                                              {dynamicPaymentStatusOptions.map((opt) => {
                                                const isSelected = teachPaymentStatus === opt.value;
                                                return (
                                                  <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => {
                                                      setTeachPaymentStatus(opt.value);
                                                      setIsOpenPaymentDropdown(false);
                                                    }}
                                                    className={`w-full text-left p-2 rounded-lg font-bold transition-all truncate block cursor-pointer ${
                                                      isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                                    }`}
                                                  >
                                                    {idt(opt.kh, opt.labelEn, opt.labelZh)}
                                                  </button>
                                                );
                                              })}
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setTeachPaymentStatus("បើករួចរាល់");
                                                  setIsOpenPaymentDropdown(false);
                                                }}
                                                className={`w-full text-left p-2 rounded-lg font-bold transition-all truncate block cursor-pointer ${
                                                  teachPaymentStatus === "បើករួចរាល់" ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                              >
                                                {idt("បើករួចរាល់", "Paid / Fully Paid", "已发放")}
                                              </button>
                                              {teachPaymentStatus && 
                                               !dynamicPaymentStatusOptions.some(opt => opt.value === teachPaymentStatus) && 
                                               teachPaymentStatus !== "បើករួចរាល់" && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setIsOpenPaymentDropdown(false);
                                                  }}
                                                  className="w-full text-left p-2 rounded-lg font-bold bg-primary-50 text-primary-700 transition-all truncate block cursor-pointer"
                                                >
                                                  {formatPaymentStatus(teachPaymentStatus)}
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ស្ថានភាពការងារ", "Work Status", "工作状态")}
                                    </label>
                                    <div className="relative h-[38px] w-full">
                                      <button
                                        type="button"
                                        onClick={() => setIsOpenStatusDropdown(!isOpenStatusDropdown)}
                                        className="w-full h-full pl-9 pr-9 py-1.5 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none transition-all bg-white font-sans shadow-3xs cursor-pointer flex items-center text-left relative"
                                      >
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                          <Briefcase className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="truncate">
                                          {teachStatus === "ACTIVE" && idt("សកម្ម", "Active", "活跃/在职")}
                                          {teachStatus === "LEAVE" && idt("ច្បាប់", "Leave", "请假")}
                                          {teachStatus === "EXITED" && idt("ឈប់", "Exited", "离职")}
                                        </span>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpenStatusDropdown ? "rotate-180" : ""}`} />
                                        </div>
                                      </button>

                                      {isOpenStatusDropdown && (
                                        <>
                                          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenStatusDropdown(false)} />
                                          <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden p-1.5 text-xs flex flex-col max-h-[160px] select-none">
                                            <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 scrollbar-thin">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setTeachStatus("ACTIVE");
                                                  setIsOpenStatusDropdown(false);
                                                }}
                                                className={`w-full text-left p-2 rounded-lg font-bold transition-all truncate block cursor-pointer ${
                                                  teachStatus === "ACTIVE" ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                              >
                                                {idt("សកម្ម", "Active", "活跃/在职")}
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setTeachStatus("LEAVE");
                                                  setIsOpenStatusDropdown(false);
                                                }}
                                                className={`w-full text-left p-2 rounded-lg font-bold transition-all truncate block cursor-pointer ${
                                                  teachStatus === "LEAVE" ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                              >
                                                {idt("ច្បាប់", "Leave", "请假")}
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setTeachStatus("EXITED");
                                                  setIsOpenStatusDropdown(false);
                                                }}
                                                className={`w-full text-left p-2 rounded-lg font-bold transition-all truncate block cursor-pointer ${
                                                  teachStatus === "EXITED" ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                              >
                                                {idt("ឈប់", "Exited", "离职")}
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                  {/* Experience Duration */}
                                  <div className="flex items-center justify-between p-3 bg-primary-50/40 border border-primary-100/50 rounded-xl">
                                    <span className="text-[11px] font-extrabold text-primary-950 flex items-center gap-1.5 font-sans">
                                      <Clock className="w-3.5 h-3.5 text-primary-500" /> {idt("រយៈពេលធ្វើការងារសរុប", "Total Work Experience", "总工作时间")}
                                    </span>
                                    <span className="px-3 py-1 bg-white border border-primary-100 text-primary-700 font-extrabold text-[11px] rounded-lg shadow-3xs font-sans">
                                      {calculatedExpDays}
                                    </span>
                                  </div>

                                  {/* Notes */}
                                  <div>
                                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1 font-sans">
                                      {idt("ព័ត៌មានបន្ថែម/សម្គាល់", "Notes", "备注信息")}
                                    </label>
                                    <textarea 
                                      value={teachNotes} 
                                      onChange={(e) => setTeachNotes(e.target.value)} 
                                      placeholder={idt("ព័ត៌មានផ្សេងៗ ឬចំណាំពិសេសអំពីគ្រូបង្រៀន...", "Additional info or special notes about the teacher...", "关于教师的其他信息或特别说明...")}
                                      className="w-full px-3.5 py-2 border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none transition-all h-16 bg-white resize-none shadow-3xs" 
                                    />
                                  </div>
                                </div>
                              </div>

                            </div>


                            {/* Document Management Section */}
                            {editingTeacherId && (
                              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-6 mb-4">
                                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
                                  <div className="flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-primary-600" />
                                    <h4 className="font-bold text-sm text-slate-800">{idt("ឯកសារ (Documents)", "Documents", "文件")}</h4>
                                  </div>
                                  <div>
                                    <input 
                                      type="file" 
                                      id="teacher-doc-upload" 
                                      className="hidden" 
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                          const token = localStorage.getItem("plc_auth_token");
                                          const formData = new FormData();
                                          formData.append("file", file);
                                          const uploadRes = await fetch("/api/upload", {
                                            method: "POST",
                                            body: formData,
                                            headers: { "Authorization": `Bearer ${token}` }
                                          });
                                          let uploadData;
                                          const contentType = uploadRes.headers.get("content-type");
                                          if (contentType && contentType.indexOf("application/json") !== -1) {
                                            uploadData = await uploadRes.json();
                                          } else {
                                            throw new Error("Server returned non-JSON response");
                                          }
                                          if (uploadData.url) {
                                            const docRes = await fetch("/api/documents", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                                              body: JSON.stringify({
                                                title: file.name,
                                                fileUrl: uploadData.url,
                                                type: "OTHER",
                                                teacherId: editingTeacherId
                                              })
                                            });
                                            if (docRes.ok) {
                                              const newDoc = await docRes.json();
                                              setTeachers(prev => prev.map(t => t.id === editingTeacherId ? { ...t, documents: [...(t.documents || []), newDoc] } : t));
                                              showToast(uiLang === "kh" ? "បានបន្ថែមឯកសារជោគជ័យ! (Document added successfully)" : "Document added successfully!", "success");
                                            }
                                          }
                                        } catch (err) {
                                          console.error(err);
                                          showToast(uiLang === "kh" ? "មានបញ្ហាក្នុងការបន្ថែមឯកសារ! (Error adding document)" : "Error adding document!", "error");
                                        }
                                      }}
                                    />
                                    <label htmlFor="teacher-doc-upload" className="px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                                      <Upload className="w-3.5 h-3.5" /> {idt("ឯកសារថ្មី", "Upload", "上传文件")}
                                    </label>
                                  </div>
                                </div>
                                
                                <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto">
                                  {(() => {
                                    const t = teachers.find(t => t.id === editingTeacherId);
                                    if (t && t.documents && t.documents.length > 0) {
                                      return t.documents.map((doc: any) => (
                                        <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg transition-colors group">
                                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 flex-1 min-w-0">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-700 truncate font-medium">{doc.title}</span>
                                          </a>
                                          <button 
                                            type="button"
                                            onClick={async (e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              if (confirmDeleteDocId === doc.id) {
                                                try {
                                                  const token = localStorage.getItem("plc_auth_token");
                                                  const res = await fetch(`/api/documents/${doc.id}`, {
                                                    method: "DELETE",
                                                    headers: { "Authorization": `Bearer ${token}` }
                                                  });
                                                  if (res.ok) {
                                                    setTeachers(prev => prev.map(teacher => teacher.id === editingTeacherId ? { ...teacher, documents: (teacher.documents || []).filter((d: any) => d.id !== doc.id) } : teacher));
                                                    showToast(uiLang === "kh" ? "បានលុបឯកសារជោគជ័យ! (Document deleted)" : "Document deleted!", "success");
                                                  }
                                                } catch (err) {
                                                  showToast(uiLang === "kh" ? "បរាជ័យក្នុងការលុបឯកសារ! (Failed to delete)" : "Failed to delete document!", "error");
                                                } finally {
                                                  setConfirmDeleteDocId(null);
                                                }
                                              } else {
                                                setConfirmDeleteDocId(doc.id);
                                                // Auto reset after 3500ms if not clicked again
                                                setTimeout(() => {
                                                  setConfirmDeleteDocId(prev => prev === doc.id ? null : prev);
                                                }, 3500);
                                              }
                                            }}
                                            className={`p-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                                              confirmDeleteDocId === doc.id 
                                                ? "bg-rose-500 text-white shadow-xs px-2.5 py-1 animate-pulse" 
                                                : "text-rose-500 hover:bg-rose-50 hover:text-rose-700 md:opacity-0 md:group-hover:opacity-100"
                                            }`}
                                          >
                                            {confirmDeleteDocId === doc.id ? (
                                              <>
                                                <Trash2 className="w-3.5 h-3.5 animate-spin-slow" />
                                                <span>{uiLang === "kh" ? "ចុចលុប" : "Delete"}</span>
                                              </>
                                            ) : (
                                              <Trash2 className="w-4 h-4" />
                                            )}
                                          </button>
                                        </div>
                                      ));
                                    }
                                    return (
                                      <div className="p-4 text-center text-slate-400 text-xs font-medium">
                                        {idt("មិនទាន់មានឯកសារ", "No documents uploaded", "暂无文件")}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* Submit Actions */}
                            <div className="p-4 border-t border-slate-100 flex justify-end gap-3.5 shrink-0 bg-slate-50/50">
                              <button 
                                type="button" 
                                onClick={() => setIsTeacherModalOpen(false)} 
                                className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-black transition-all cursor-pointer"
                              >
                                {idt("បោះបង់", "Cancel", "取消")}
                              </button>
                              <button 
                                type="submit" 
                                className="px-6 py-2.5 bg-slate-950 hover:bg-primary-950 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                              >
                                <span>{idt("រក្សាទុកព័ត៌មាន", "Save Details", "保存信息")}</span>
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      </div>
                    )} 

                    {/* ========================================================== */}
                    {/* VIEW TEACHER DETAIL MODAL                                  */}
                    {/* ========================================================== */}
                    {isViewTeacherModalOpen && selectedTeacher && (
                      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fadeIn">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 15 }}
                          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                          {/* Modal Header */}
                          <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                <Eye className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-extrabold text-slate-800 text-sm">
                                  {idt("ប្រវត្តិរូបសង្ខេបគ្រូបង្រៀន/បុគ្គលិក", "Teacher Detailed Profile", "教师/员工详细资料")}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                                  {idt("កំណត់ត្រាលម្អិត និងឯកសារភ្ជាប់", "Detailed record and attached documents", "详细记录与附加文件")}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsViewTeacherModalOpen(false);
                                setSelectedTeacher(null);
                              }}
                              className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Profile Content */}
                          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                            
                            {/* Profile Top Banner */}
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/65">
                              <div className={`w-14 h-14 rounded-full font-black text-lg flex items-center justify-center border shadow-3xs bg-primary-100 text-primary-700 border-primary-200`}>
                                {selectedTeacher.gender === "Female" ? "👩‍🏫" : "👨‍🏫"}
                              </div>
                              <div className="space-y-1 min-w-0">
                                <h4 className="text-base font-black text-slate-800">{selectedTeacher.nameKh}</h4>
                                <p className="text-xs text-slate-500 font-bold font-sans">({selectedTeacher.nameEn})</p>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[9px] font-mono font-bold">
                                    ID: {selectedTeacher.teacherId}
                                  </span>
                                  <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full ${
                                    selectedTeacher.status === "ACTIVE"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : selectedTeacher.status === "LEAVE"
                                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                                        : "bg-rose-50 text-rose-700 border border-rose-200"
                                  }`}>
                                    {selectedTeacher.status === "ACTIVE" ? idt("សកម្ម", "Active", "在职") : selectedTeacher.status === "LEAVE" ? idt("ច្បាប់", "Leave", "请假") : idt("ឈប់", "Exited", "离职")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Data Lists */}
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("ភេទ", "Gender", "性别")}</span>
                                  <p className="text-slate-800 font-extrabold">{selectedTeacher.gender === "Female" ? idt("ស្រី", "Female", "女") : idt("ប្រុស", "Male", "男")}</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("ជំនាញបង្រៀន", "Specialty", "教学专业")}</span>
                                  <p className="text-primary-600 font-extrabold">{selectedTeacher.specialty}</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("លេខទូរស័ព្ទ", "Phone Number", "联系电话")}</span>
                                  <p className="text-slate-700 font-extrabold font-mono">{selectedTeacher.phone || "N/A"}</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("ថ្ងៃខែឆ្នាំកំណើត", "Date of Birth", "出生日期")}</span>
                                  <p className="text-slate-700 font-extrabold font-mono">{selectedTeacher.dob || "N/A"}</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 col-span-2">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("ទីកន្លែងកំណើត", "Place of Birth", "出生地点")}</span>
                                  <p className="text-slate-700 font-extrabold">{selectedTeacher.pob || "N/A"}</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("ថ្ងៃចូលធ្វើការ", "Join Date", "入职日期")}</span>
                                  <p className="text-slate-700 font-extrabold font-sans">{selectedTeacher.joinDate || "N/A"}</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("ថ្ងៃឈប់ធ្វើការ", "Leave Date", "离职日期")}</span>
                                  <p className="text-slate-700 font-extrabold font-sans">{selectedTeacher.leaveDate || "N/A"}</p>
                                </div>
                              </div>

                              {/* Salary breakdown */}
                              <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100 space-y-3">
                                <span className="text-primary-700 text-[10px] uppercase font-black tracking-wider block">{idt("ព័ត៌មានប្រាក់បៀវត្ស", "Salary Information", "薪资信息")}</span>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                  <div className="bg-white p-2 rounded-lg border border-primary-100">
                                    <span className="text-[9px] text-slate-400 font-bold block uppercase">{idt("ប្រាក់ខែ", "Monthly Salary", "基本薪资")}</span>
                                    <span className="text-sm font-black text-slate-700 font-sans">${(selectedTeacher.salary || 450).toFixed(2)}</span>
                                  </div>
                                  <div className="bg-white p-2 rounded-lg border border-primary-100 flex flex-col justify-center">
                                    <span className="text-[9px] text-slate-400 font-bold block uppercase">{idt("ស្ថានភាពបើកប្រាក់ខែ", "Salary Status", "付款状态")}</span>
                                    <span className="text-xs font-black text-emerald-600">
                                      {formatPaymentStatus(selectedTeacher.paymentStatus || getFallbackPaymentStatus(selectedTeacher.joinDate))}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              {selectedTeacher.notes && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/65 space-y-1">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold block">{idt("ព័ត៌មានបន្ថែម/សម្គាល់", "Notes", "备注")}</span>
                                  <p className="text-xs text-slate-700 font-bold whitespace-pre-line">{selectedTeacher.notes}</p>
                                </div>
                              )}

                              {/* Document Management Section inside View Modal */}
                              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-6 mb-4">
                                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
                                  <div className="flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-primary-600" />
                                    <h4 className="font-bold text-sm text-slate-800">{idt("ឯកសារ (Documents)", "Documents", "文件")}</h4>
                                  </div>
                                  <div>
                                    <input 
                                      type="file" 
                                      id="teacher-view-doc-upload" 
                                      className="hidden" 
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                          const token = localStorage.getItem("plc_auth_token");
                                          const formData = new FormData();
                                          formData.append("file", file);
                                          const uploadRes = await fetch("/api/upload", {
                                            method: "POST",
                                            body: formData,
                                            headers: { "Authorization": `Bearer ${token}` }
                                          });
                                          let uploadData;
                                          const contentType = uploadRes.headers.get("content-type");
                                          if (contentType && contentType.indexOf("application/json") !== -1) {
                                            uploadData = await uploadRes.json();
                                          } else {
                                            throw new Error("Server returned non-JSON response");
                                          }
                                          if (uploadData.url) {
                                            const docRes = await fetch("/api/documents", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                                              body: JSON.stringify({
                                                title: file.name,
                                                fileUrl: uploadData.url,
                                                type: "OTHER",
                                                teacherId: selectedTeacher.id
                                              })
                                            });
                                            if (docRes.ok) {
                                              const newDoc = await docRes.json();
                                              setTeachers((prev: any[]) => prev.map(t => t.id === selectedTeacher.id ? { ...t, documents: [...(t.documents || []), newDoc] } : t));
                                              setSelectedTeacher((prev: any) => prev ? { ...prev, documents: [...(prev.documents || []), newDoc] } : null);
                                              showToast(uiLang === "kh" ? "បានបន្ថែមឯកសារជោគជ័យ! (Document added successfully)" : "Document added successfully!", "success");
                                            }
                                          }
                                        } catch (err) {
                                          console.error(err);
                                          showToast(uiLang === "kh" ? "មានបញ្ហាក្នុងការបន្ថែមឯកសារ! (Error adding document)" : "Error adding document!", "error");
                                        }
                                      }}
                                    />
                                    <label htmlFor="teacher-view-doc-upload" className="px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                                      <Upload className="w-3.5 h-3.5" /> {idt("ឯកសារថ្មី", "Upload", "上传文件")}
                                    </label>
                                  </div>
                                </div>
                                
                                <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto">
                                  {selectedTeacher.documents && selectedTeacher.documents.length > 0 ? (
                                    selectedTeacher.documents.map((doc: any) => (
                                      <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg transition-colors group">
                                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 flex-1 min-w-0">
                                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                          <span className="text-xs font-bold text-slate-700 truncate hover:text-primary-600 hover:underline">
                                            {doc.title}
                                          </span>
                                        </a>
                                        <button
                                          onClick={async (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (confirmDeleteDocId === doc.id) {
                                              try {
                                                const token = localStorage.getItem("plc_auth_token");
                                                const res = await fetch(`/api/documents/${doc.id}`, {
                                                  method: "DELETE",
                                                  headers: { "Authorization": `Bearer ${token}` }
                                                });
                                                if (res.ok) {
                                                  setTeachers((prev: any[]) => prev.map(t => t.id === selectedTeacher.id ? { ...t, documents: (t.documents || []).filter((d: any) => d.id !== doc.id) } : t));
                                                  setSelectedTeacher((prev: any) => prev ? { ...prev, documents: (prev.documents || []).filter((d: any) => d.id !== doc.id) } : null);
                                                  showToast(uiLang === "kh" ? "បានលុបឯកសារជោគជ័យ! (Document deleted successfully)" : "Document deleted successfully!", "success");
                                                }
                                              } catch (err) {
                                                showToast(uiLang === "kh" ? "បរាជ័យក្នុងការលុបឯកសារ! (Failed to delete)" : "Failed to delete document!", "error");
                                              } finally {
                                                setConfirmDeleteDocId(null);
                                              }
                                            } else {
                                              setConfirmDeleteDocId(doc.id);
                                              setTimeout(() => {
                                                setConfirmDeleteDocId(prev => prev === doc.id ? null : prev);
                                              }, 3500);
                                            }
                                          }}
                                          className={`p-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                                            confirmDeleteDocId === doc.id 
                                              ? "bg-rose-500 text-white shadow-xs px-2.5 py-1 animate-pulse" 
                                              : "text-rose-500 hover:bg-rose-50 hover:text-rose-700 md:opacity-0 md:group-hover:opacity-100"
                                          }`}
                                        >
                                          {confirmDeleteDocId === doc.id ? (
                                            <>
                                              <Trash2 className="w-3.5 h-3.5 animate-spin-slow" />
                                              <span>{uiLang === "kh" ? "ចុចលុប" : "Delete"}</span>
                                            </>
                                          ) : (
                                            <Trash2 className="w-4 h-4" />
                                          )}
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-4 text-center text-slate-400 text-xs font-medium">
                                      {idt("មិនទាន់មានឯកសារ", "No documents uploaded", "暂无文件")}
                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Close action */}
                          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button 
                              onClick={() => {
                                setIsViewTeacherModalOpen(false);
                                setSelectedTeacher(null);
                              }} 
                              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                            >
                              {idt("បិទ", "Close", "关闭")}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )} 
                  </motion.div>
                );
}
