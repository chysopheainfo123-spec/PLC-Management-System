import { withSafeCss } from '../Dashboard';
import React from 'react';
import { exportToExcel } from '../../exportUtils';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Camera, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle, Bell, BellOff, Database, Loader2, Send, Settings } from 'lucide-react';

export default function AttendanceTab(props: any) {
  const { absenceModalData, activeTab, attendanceCheckInLog, attendanceCheckOutLog, attendanceCourseFilter, attendanceDate, attendanceNotes, attendanceSearch, attendanceSubTab, attendanceType, expandedAttendanceRow, getStudentHoursInfo, getStudentStartAndEndTimes, getStudentStudyHours, googleSheetsName, googleSheetsSyncLogs, googleSheetsSyncStep, googleSheetsURL, isAttendancePrintPreviewOpen, isGoogleSheetsSyncingOpen, isMuted, isRefreshingAttendance, isSavingAttendance, isSavingPDF, printSelectedColumns, printShowLogo, printShowSignatures, printTitle, reportPeriod, schoolKhmerName, schoolLogo, schoolName, selectedHistoryItem, setAbsenceModalData, setAttendanceCheckInLog, setAttendanceCheckOutLog, setAttendanceCourseFilter, setAttendanceDate, setAttendanceNotes, setAttendanceSearch, setAttendanceSubTab, setAttendanceType, setExpandedAttendanceRow, setGoogleSheetsName, setGoogleSheetsSyncLogs, setGoogleSheetsSyncStep, setGoogleSheetsURL, setIsAttendancePrintPreviewOpen, setIsGoogleSheetsSyncingOpen, setIsMuted, setIsRefreshingAttendance, setIsSavingAttendance, setIsSavingPDF, setPrintSelectedColumns, setPrintShowLogo, setPrintShowSignatures, setPrintTitle, setReportPeriod, setSelectedHistoryItem, setShowBotConfig, setShowDailyDetails, setShowTelegramMockup, setTelegramLogs, showBotConfig, showDailyDetails, showTelegramMockup, showToast, students, teachers, telegramLogs, toKhmerNumeral, token, translateCourseOrSpecialtyName, translateLevelText, translateShiftText, uiLang } = props;

  const [localLang, setLocalLang] = React.useState(uiLang || localStorage.getItem("plc_lang") || "kh");

  React.useEffect(() => {
    if (uiLang) {
      setLocalLang(uiLang);
    }
  }, [uiLang]);

  React.useEffect(() => {
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
  return (
    <>
            {activeTab === "Attendance" && (() => {
              const checkInLogToday = attendanceCheckInLog[attendanceDate] || {};
              const checkOutLogToday = attendanceCheckOutLog[attendanceDate] || {};

              const autoSaveItemAttendance = async (
                id: string,
                itemType: 'student' | 'teacher',
                newCheckIn: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION' | null,
                newCheckOut: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION' | null,
                newCheckInNote?: string,
                newCheckOutNote?: string
              ) => {
                try {
                  const checkInNote = newCheckInNote !== undefined
                    ? newCheckInNote
                    : (attendanceNotes[attendanceDate]?.[id]?.['check-in'] || "");
                  const checkOutNote = newCheckOutNote !== undefined
                    ? newCheckOutNote
                    : (attendanceNotes[attendanceDate]?.[id]?.['check-out'] || "");

                  const body = {
                    date: attendanceDate,
                    type: itemType,
                    items: [
                      {
                        id,
                        checkIn: newCheckIn,
                        checkOut: newCheckOut,
                        checkInNote,
                        checkOutNote
                      }
                    ]
                  };

                  await fetch("/api/attendance", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                  });
                } catch (err) {
                  console.error("Auto-save error:", err);
                }
              };

              const logItemAttendance = (
                type: 'check-in' | 'check-out',
                id: string,
                status: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION',
                name: string,
                courseOrSpecialty: string,
                itemType: 'student' | 'teacher',
                nameEn?: string,
                note?: string
              ) => {
                // Update logs
                if (type === 'check-in') {
                  setAttendanceCheckInLog(prev => ({
                    ...prev,
                    [attendanceDate]: {
                      ...(prev[attendanceDate] || {}),
                      [id]: status
                    }
                  }));
                } else {
                  setAttendanceCheckOutLog(prev => ({
                    ...prev,
                    [attendanceDate]: {
                      ...(prev[attendanceDate] || {}),
                      [id]: status
                    }
                  }));
                }

                const resolvedCheckIn = type === 'check-in' ? status : (attendanceCheckInLog[attendanceDate]?.[id] || null);
                const resolvedCheckOut = type === 'check-out' ? status : (attendanceCheckOutLog[attendanceDate]?.[id] || null);
                const resolvedCheckInNote = type === 'check-in' ? note : undefined;
                const resolvedCheckOutNote = type === 'check-out' ? note : undefined;

                autoSaveItemAttendance(
                  id,
                  itemType,
                  resolvedCheckIn,
                  resolvedCheckOut,
                  resolvedCheckInNote,
                  resolvedCheckOutNote
                );

                // Standard timestamp
                const now = new Date();
                const timeStr = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

                // Status translations
                const statusKhMap = {
                  PRESENT: type === 'check-in' ? 'វត្តមាន (PRESENT)' : 'ម៉ោងចេញ (CHECK-OUT)',
                  ABSENT: 'អវត្តមាន (ABSENT)',
                  LATE: type === 'check-in' ? 'យឺត (LATE)' : 'ចេញមុនម៉ោង (EARLY-OUT)',
                  PERMISSION: 'ច្បាប់ (PERMISSION)'
                };

                // Append to Telegram alerts if not muted
                if (!isMuted) {
                  const newAlert = {
                    type,
                    name,
                    nameEn,
                    studentId: id,
                    status,
                    statusKh: statusKhMap[status],
                    course: courseOrSpecialty,
                    time: timeStr,
                    itemType,
                    note: note || attendanceNotes[attendanceDate]?.[id]?.[type],
                    date: attendanceDate
                  };
                  setTelegramLogs(prev => [newAlert, ...prev]);
                }
              };

              // Helper to resolve dynamic logged time
              const getLoggedTime = (id: string, type: 'check-in' | 'check-out', defaultFallback: string, targetDate?: string) => {
                const log = telegramLogs.find(l => l.studentId === id && l.type === type && (!targetDate || !l.date || l.date === targetDate));
                return log ? log.time : defaultFallback;
              };

              // Helper to resolve display ID for Telegram logs
              const getDisplayId = (log: any) => {
                if (log.itemType === 'teacher') {
                  const t = teachers.find(x => x.id === log.studentId);
                  return t ? t.teacherId : log.studentId;
                } else {
                  const s = students.find(x => x.id === log.studentId);
                  return s ? s.studentId : log.studentId;
                }
              };

              // Helper to check if a teacher has stopped working (either status is EXITED or they reached/passed their leave date)
              const isTeacherStopped = (t: any) => {
                if (t.status === "EXITED") return true;
                if (t.leaveDate) {
                  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
                  const normalized = t.leaveDate.replace(/[០-៩]/g, (w: string) => String(khmerDigits.indexOf(w))).trim();
                  
                  // Try splitting by hyphen or slash
                  const separator = normalized.includes('-') ? '-' : normalized.includes('/') ? '/' : null;
                  if (!separator) {
                    const parsed = new Date(normalized);
                    const attendanceDateObj = new Date(attendanceDate);
                    if (!isNaN(parsed.getTime()) && !isNaN(attendanceDateObj.getTime())) {
                      return attendanceDateObj >= parsed;
                    }
                    return false;
                  }
                  
                  const parts = normalized.split(separator);
                  if (parts.length === 3) {
                    const part0 = parseInt(parts[0], 10);
                    const part1 = parseInt(parts[1], 10);
                    const part2 = parseInt(parts[2], 10);
                    
                    let leaveDateObj: Date | null = null;
                    if (parts[0].length === 4) {
                      // YYYY-MM-DD or YYYY/MM/DD
                      leaveDateObj = new Date(part0, part1 - 1, part2);
                    } else if (parts[2].length === 4) {
                      // DD-MM-YYYY or DD/MM/YYYY
                      leaveDateObj = new Date(part2, part1 - 1, part0);
                    }
                    
                    const attendanceDateObj = new Date(attendanceDate);
                    if (leaveDateObj && !isNaN(leaveDateObj.getTime()) && !isNaN(attendanceDateObj.getTime())) {
                      return attendanceDateObj >= leaveDateObj;
                    }
                  }
                }
                return false;
              };

              const shiftPeriod = (direction: 'prev' | 'next') => {
                if (!attendanceDate) return;
                const [y, m, d] = attendanceDate.split('-').map(Number);
                const currentDate = new Date(y, m - 1, d);
                
                if (reportPeriod === 'day') {
                  currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
                } else if (reportPeriod === 'month') {
                  currentDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
                } else if (reportPeriod === 'year') {
                  currentDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
                }
                
                const newY = currentDate.getFullYear();
                const newM = String(currentDate.getMonth() + 1).padStart(2, '0');
                const newD = String(currentDate.getDate()).padStart(2, '0');
                setAttendanceDate(`${newY}-${newM}-${newD}`);
              };

              const handleSaveAttendance = async () => {
                if (isSavingAttendance) return;
                setIsSavingAttendance(true);
                try {
                  const activeList = isStudentMode 
                    ? students.filter(s => s.status === 'STUDYING') 
                    : teachers.filter(t => t.status !== 'EXITED' && t.status !== 'STOP' && t.status !== 'RESIGNED' && !isTeacherStopped(t));

                  const items = activeList.map(item => ({
                    id: item.id,
                    checkIn: attendanceCheckInLog[attendanceDate]?.[item.id] || null,
                    checkOut: attendanceCheckOutLog[attendanceDate]?.[item.id] || null,
                    checkInNote: attendanceNotes[attendanceDate]?.[item.id]?.['check-in'] || "",
                    checkOutNote: attendanceNotes[attendanceDate]?.[item.id]?.['check-out'] || ""
                  }));

                  const res = await fetch("/api/attendance", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      date: attendanceDate,
                      items,
                      type: attendanceType
                    })
                  });

                  if (res.ok) {
                    showToast("រក្សាទុកវត្តមានបានជោគជ័យ! (Attendance saved to database successfully!)", "success");
                  } else {
                    showToast("មានបញ្ហាក្នុងការរក្សាទុកវត្តមាន! (Failed to save attendance!)", "error");
                  }
                } catch (err) {
                  console.error(err);
                  showToast("មានបញ្ហាភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ! (Connection error!)", "error");
                } finally {
                  setIsSavingAttendance(false);
                }
              };

              // Lists based on selected type (student vs teacher)
              const isStudentMode = attendanceType === 'student';
              
              const filteredStudents = students.filter(s => {
                const matchesSearch = s.nameKh.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
                                      s.nameEn.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
                                      s.studentId.toLowerCase().includes(attendanceSearch.toLowerCase());
                const matchesCourse = attendanceCourseFilter === "all" || s.course === attendanceCourseFilter;
                return s.status === "STUDYING" && matchesSearch && matchesCourse;
              });

              const filteredTeachers = teachers.filter(t => {
                const matchesSearch = t.nameKh.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
                                      t.nameEn.toLowerCase().includes(attendanceSearch.toLowerCase());
                const matchesSpecialty = attendanceCourseFilter === "all" || t.specialty === attendanceCourseFilter;
                return t.status !== "EXITED" && t.status !== "STOP" && t.status !== "RESIGNED" && !isTeacherStopped(t) && matchesSearch && matchesSpecialty;
              });

              const activeList = isStudentMode ? filteredStudents : filteredTeachers;

              // Stats calculation
              const checkInStats = {
                PRESENT: activeList.filter(item => checkInLogToday[item.id] === 'PRESENT').length,
                ABSENT: activeList.filter(item => checkInLogToday[item.id] === 'ABSENT').length,
                LATE: activeList.filter(item => checkInLogToday[item.id] === 'LATE').length,
                PERMISSION: activeList.filter(item => checkInLogToday[item.id] === 'PERMISSION').length,
              };

              const checkOutStats = {
                PRESENT: activeList.filter(item => checkOutLogToday[item.id] === 'PRESENT').length,
                ABSENT: activeList.filter(item => checkOutLogToday[item.id] === 'ABSENT').length,
                LATE: activeList.filter(item => checkOutLogToday[item.id] === 'LATE').length,
                PERMISSION: activeList.filter(item => checkOutLogToday[item.id] === 'PERMISSION').length,
              };

              // Total active counts
              const totalActiveCount = activeList.length;

              // Compute dynamic stats based on selected reportPeriod
              const aggregatedPeriodStats = (() => {
                const [year, month] = attendanceDate.split('-');
                const prefix = reportPeriod === 'month' ? `${year}-${month}` : year;

                let presentCount = 0;
                let lateCount = 0;
                let permissionCount = 0;
                let absentCount = 0;

                if (reportPeriod === 'day') {
                  activeList.forEach(item => {
                    const cin = attendanceCheckInLog[attendanceDate]?.[item.id];
                    const cout = attendanceCheckOutLog[attendanceDate]?.[item.id];
                    
                    const resolved = (() => {
                      if (!cin && !cout) return null;
                      if (!cin) return cout;
                      if (!cout) return cin;
                      if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                      if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                      if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                      return 'ABSENT';
                    })();

                    if (resolved === 'PRESENT') presentCount++;
                    else if (resolved === 'LATE') lateCount++;
                    else if (resolved === 'PERMISSION') permissionCount++;
                    else if (resolved === 'ABSENT') absentCount++;
                  });
                } else {
                  const allDates = new Set<string>();
                  Object.keys(attendanceCheckInLog).forEach(date => {
                    if (date.startsWith(prefix)) allDates.add(date);
                  });
                  Object.keys(attendanceCheckOutLog).forEach(date => {
                    if (date.startsWith(prefix)) allDates.add(date);
                  });

                  allDates.forEach(date => {
                    activeList.forEach(item => {
                      const cin = attendanceCheckInLog[date]?.[item.id];
                      const cout = attendanceCheckOutLog[date]?.[item.id];

                      if (cin || cout) {
                        const resolved = (() => {
                          if (!cin) return cout;
                          if (!cout) return cin;
                          if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                          if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                          if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                          return 'ABSENT';
                        })();

                        if (resolved === 'PRESENT') presentCount++;
                        else if (resolved === 'LATE') lateCount++;
                        else if (resolved === 'PERMISSION') permissionCount++;
                        else if (resolved === 'ABSENT') absentCount++;
                      }
                    });
                  });
                }

                const totalLogs = presentCount + lateCount + permissionCount + absentCount;
                const positiveLogs = presentCount + lateCount + permissionCount;
                const avgRate = totalLogs > 0 
                  ? Math.round((positiveLogs / totalLogs) * 100) 
                  : 100;

                const lateTitleKh = uiLang === "kh"
                  ? (reportPeriod === 'day' ? "មកយឺតថ្ងៃនេះ" : reportPeriod === 'month' ? "មកយឺតក្នុងខែនេះ" : "មកយឺតក្នុងឆ្នាំនេះ")
                  : uiLang === "zh"
                    ? (reportPeriod === 'day' ? "今日迟到" : reportPeriod === 'month' ? "本月迟到" : "本年迟到")
                    : (reportPeriod === 'day' ? "Late Today" : reportPeriod === 'month' ? "Late This Month" : "Late This Year");
                const lateTitleEn = reportPeriod === 'day' ? "(Late Today)" : reportPeriod === 'month' ? "(Late This Month)" : "(Late This Year)";

                const excuseTitleKh = uiLang === "kh"
                  ? (reportPeriod === 'day' ? "សុំច្បាប់ថ្ងៃនេះ" : reportPeriod === 'month' ? "សុំច្បាប់ក្នុងខែនេះ" : "សុំច្បាប់ក្នុងឆ្នាំនេះ")
                  : uiLang === "zh"
                    ? (reportPeriod === 'day' ? "今日请假" : reportPeriod === 'month' ? "本月请假" : "本年请假")
                    : (reportPeriod === 'day' ? "Excused Today" : reportPeriod === 'month' ? "Excused This Month" : "Excused This Year");
                const excuseTitleEn = reportPeriod === 'day' ? "(Excused Today)" : reportPeriod === 'month' ? "(Excused This Month)" : "(Excused This Year)";

                const absentTitleKh = uiLang === "kh"
                  ? (reportPeriod === 'day' ? "អវត្តមានថ្ងៃនេះ" : reportPeriod === 'month' ? "អវត្តមានក្នុងខែនេះ" : "អវត្តមានក្នុងឆ្នាំនេះ")
                  : uiLang === "zh"
                    ? (reportPeriod === 'day' ? "今日缺勤" : reportPeriod === 'month' ? "本月缺勤" : "本年缺勤")
                    : (reportPeriod === 'day' ? "Absent Today" : reportPeriod === 'month' ? "Absent This Month" : "Absent This Year");
                const absentTitleEn = reportPeriod === 'day' ? "(Absent Today)" : reportPeriod === 'month' ? "(Absent This Month)" : "(Absent This Year)";

                const unitWord = uiLang === "kh"
                  ? (reportPeriod === 'day' ? "នាក់" : "ដង")
                  : uiLang === "zh"
                    ? (reportPeriod === 'day' ? "人" : "人次")
                    : (reportPeriod === 'day' ? "Pax" : "Times");

                return {
                  PRESENT: presentCount,
                  LATE: lateCount,
                  PERMISSION: permissionCount,
                  ABSENT: absentCount,
                  avgRate,
                  lateTitleKh,
                  lateTitleEn,
                  excuseTitleKh,
                  excuseTitleEn,
                  absentTitleKh,
                  absentTitleEn,
                  unitWord
                };
              })();

              // Extract courses for filter dropdown
              const allCourses = Array.from(new Set(students.filter(s => s.status === 'STUDYING').map(s => s.course).filter(Boolean)));

              const getPeriodStats = (itemId: string) => {
                const [year, month] = attendanceDate.split('-');
                
                if (reportPeriod === 'day') {
                  const cin = attendanceCheckInLog[attendanceDate]?.[itemId];
                  const cout = attendanceCheckOutLog[attendanceDate]?.[itemId];
                  
                  const resolved = (() => {
                    if (!cin && !cout) return null;
                    if (!cin) return cout;
                    if (!cout) return cin;
                    if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                    if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                    if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                    return 'ABSENT';
                  })();

                  return {
                    p: resolved === 'PRESENT' ? 1 : 0,
                    l: resolved === 'LATE' ? 1 : 0,
                    e: resolved === 'PERMISSION' ? 1 : 0,
                    a: resolved === 'ABSENT' ? 1 : 0,
                    hasCin: !!cin,
                    hasCout: !!cout,
                    cinStatus: cin,
                    coutStatus: cout,
                    totalLogs: cin || cout ? 1 : 0,
                    resolvedStatus: resolved
                  };
                } else {
                  const prefix = reportPeriod === 'month' ? `${year}-${month}` : year;
                  let pCount = 0;
                  let lCount = 0;
                  let eCount = 0;
                  let aCount = 0;
                  let totalLogs = 0;
                  
                  const allDates = new Set<string>();
                  Object.keys(attendanceCheckInLog).forEach(date => {
                    if (date.startsWith(prefix)) allDates.add(date);
                  });
                  Object.keys(attendanceCheckOutLog).forEach(date => {
                    if (date.startsWith(prefix)) allDates.add(date);
                  });

                  allDates.forEach(date => {
                    const cin = attendanceCheckInLog[date]?.[itemId];
                    const cout = attendanceCheckOutLog[date]?.[itemId];

                    if (cin || cout) {
                      totalLogs++;
                      const resolved = (() => {
                        if (!cin) return cout;
                        if (!cout) return cin;
                        if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                        if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                        if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                        return 'ABSENT';
                      })();

                      if (resolved === 'PRESENT') pCount++;
                      else if (resolved === 'LATE') lCount++;
                      else if (resolved === 'PERMISSION') eCount++;
                      else if (resolved === 'ABSENT') aCount++;
                    }
                  });
                  
                  return {
                    p: pCount,
                    l: lCount,
                    e: eCount,
                    a: aCount,
                    totalLogs,
                    hasCin: totalLogs > 0,
                    hasCout: totalLogs > 0,
                    cinStatus: null,
                    coutStatus: null
                  };
                }
              };

              const getRatePercent = (itemId: string, stats: any) => {
                if (reportPeriod === 'day') {
                  const resolved = stats.resolvedStatus;
                  if (!resolved) return "100%";
                  if (resolved === 'PRESENT' || resolved === 'LATE' || resolved === 'PERMISSION') return "100%";
                  return "0%";
                } else {
                  const totalExpected = stats.totalLogs || 1;
                  const positive = stats.p + stats.l + stats.e;
                  return totalExpected > 0 ? `${Math.round((positive / totalExpected) * 100)}%` : "100%";
                }
              };

              const renderPrintableAttendanceSheet = (isPreviewMode: boolean) => {
                const list = isStudentMode ? filteredStudents : filteredTeachers;
                const dateParts = attendanceDate.split('-');
                const yearKh = toKhmerNumeral(dateParts[0] || "");
                const monthKh = toKhmerNumeral(dateParts[1] || "");
                const dayKh = toKhmerNumeral(dateParts[2] || "");
                const khmerDateStr = `ថ្ងៃទី ${dayKh} ខែ ${monthKh} ឆ្នាំ ${yearKh}`;
                const englishDateStr = dateParts.reverse().join('/');

                const totalCount = list.length;
                const presentCount = list.filter(item => {
                  const cin = attendanceCheckInLog[attendanceDate]?.[item.id];
                  const cout = attendanceCheckOutLog[attendanceDate]?.[item.id];
                  return cin === 'PRESENT' || cout === 'PRESENT';
                }).length;
                const lateCount = list.filter(item => {
                  const cin = attendanceCheckInLog[attendanceDate]?.[item.id];
                  const cout = attendanceCheckOutLog[attendanceDate]?.[item.id];
                  return cin === 'LATE' || cout === 'LATE';
                }).length;
                const permissionCount = list.filter(item => {
                  const cin = attendanceCheckInLog[attendanceDate]?.[item.id];
                  const cout = attendanceCheckOutLog[attendanceDate]?.[item.id];
                  return cin === 'PERMISSION' || cout === 'PERMISSION';
                }).length;
                const absentCount = list.filter(item => {
                  const cin = attendanceCheckInLog[attendanceDate]?.[item.id];
                  const cout = attendanceCheckOutLog[attendanceDate]?.[item.id];
                  return cin === 'ABSENT' || cout === 'ABSENT';
                }).length;

                const defaultTitle = isStudentMode 
                  ? "របាយការណ៍វត្តមានសិស្សប្រចាំថ្ងៃ" 
                  : "របាយការណ៍វត្តមានគ្រូប្រចាំថ្ងៃ";
                const currentTitle = printTitle || defaultTitle;

                const renderStatusBadge = (status: string) => {
                  if (!status || status === '-') return <span className="text-slate-400 font-sans">-</span>;
                  
                  switch (status.toUpperCase()) {
                    case 'PRESENT':
                      return (
                        <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-md text-[8.5px] font-black bg-emerald-50 text-emerald-700 border border-emerald-250/50 whitespace-nowrap print:bg-emerald-50/20 print:text-emerald-700">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>
                          {uiLang === "kh" ? "វត្តមាន" : uiLang === "en" ? "PRESENT" : "出席"}
                        </span>
                      );
                    case 'LATE':
                      return (
                        <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-md text-[8.5px] font-black bg-amber-50 text-amber-700 border border-amber-250/50 whitespace-nowrap print:bg-amber-50/20 print:text-amber-700">
                          <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0"></span>
                          {uiLang === "kh" ? "យឺត" : uiLang === "en" ? "LATE" : "迟到"}
                        </span>
                      );
                    case 'PERMISSION':
                      return (
                        <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-md text-[8.5px] font-black bg-primary-50 text-primary-750 border border-primary-250/50 whitespace-nowrap print:bg-primary-50/20 print:text-primary-700">
                          <span className="w-1 h-1 rounded-full bg-primary-500 shrink-0"></span>
                          {uiLang === "kh" ? "ច្បាប់" : uiLang === "en" ? "EXCUSED" : "请假"}
                        </span>
                      );
                    case 'ABSENT':
                      return (
                        <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-md text-[8.5px] font-black bg-rose-50 text-rose-700 border border-rose-250/50 whitespace-nowrap print:bg-rose-50/20 print:text-rose-700">
                          <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0"></span>
                          {uiLang === "kh" ? "អវត្តមាន" : uiLang === "en" ? "ABSENT" : "缺勤"}
                        </span>
                      );
                    default:
                      return <span className="text-slate-700 font-black whitespace-nowrap">{status}</span>;
                  }
                };

                return (
                  <div 
                    id={isPreviewMode ? undefined : "printable-attendance-sheet"}
                    className={`${
                      isPreviewMode 
                        ? "bg-white text-slate-800 p-8 md:p-10 w-full max-w-[297mm] min-h-[210mm] shadow-lg border border-slate-200/80 rounded-2xl"
                        : "hidden print:block bg-white text-black p-6 w-full"
                    } font-sans relative flex flex-col justify-between`}
                    style={{
                      boxSizing: 'border-box'
                    }}
                  >
                    <div className="space-y-6">
                      {/* Header section */}
                      <div className="flex flex-col items-center justify-center text-center pb-3.5 border-b border-slate-200">
                        <div className="w-full flex items-start justify-between">
                          {printShowLogo && (
                            <div className="flex items-center gap-2.5 text-left">
                              {schoolLogo ? (
                                <div className="w-10 h-10 rounded-xl border border-slate-200 shadow-2xs shrink-0 overflow-hidden flex items-center justify-center bg-white">
                                  <img src={schoolLogo} alt="School Logo" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-black text-lg border border-primary-500 shadow-sm shrink-0">
                                  P
                                </div>
                              )}
                              <div className="space-y-0.5">
                                <h1 className="text-[10.5px] font-black text-primary-950 uppercase tracking-wide print:text-black leading-none">
                                  {schoolKhmerName || schoolName}
                                </h1>
                                {schoolKhmerName && schoolName && (
                                  <p className="text-[7.5px] text-primary-600 font-extrabold uppercase tracking-widest print:text-slate-600 leading-none">
                                    {schoolName}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="text-center flex-1 max-w-xs mx-auto space-y-0.5">
                            <p className="text-[10px] font-black tracking-widest text-slate-900 uppercase">ព្រះរាជាណាចក្រកម្ពុជា</p>
                            <p className="text-[8px] font-extrabold text-slate-500">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                            {/* Khmer decorative divider */}
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <span className="h-[1px] w-6 bg-slate-350"></span>
                              <span className="text-[5px] text-amber-500">❖</span>
                              <span className="h-[1px] w-6 bg-slate-350"></span>
                            </div>
                          </div>
                          {printShowLogo && <div className="w-24 shrink-0" />}
                        </div>
                      </div>

                      {/* Document Title */}
                      <div className="text-center space-y-2 py-1">
                        <h2 className="text-[14px] font-black text-primary-950 uppercase tracking-wide print:text-black leading-snug">
                          {currentTitle}
                        </h2>
                        <div className="flex items-center justify-center gap-3 text-[9px] font-black text-slate-550 print:text-slate-700 bg-slate-50 print:bg-slate-50 border border-slate-200 py-1 px-4 rounded-full max-w-fit mx-auto">
                          <span>{khmerDateStr}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-mono">{englishDateStr}</span>
                        </div>
                      </div>

                      {/* Mini Stats Capsules Grid */}
                      <div className="grid grid-cols-4 gap-3 bg-slate-50/70 border border-slate-200/80 p-3 rounded-2xl print:bg-slate-50 print:border-slate-350">
                        <div className="text-center bg-white print:bg-white p-2.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
                          <span className="block text-[7.5px] font-black text-slate-400 uppercase tracking-wider mb-1">វត្តមាន (P / PRESENT)</span>
                          <span className="text-[12px] font-black text-emerald-600 leading-none">{toKhmerNumeral(presentCount)} / {toKhmerNumeral(totalCount)} នាក់</span>
                          <span className="text-[7.5px] text-emerald-500/80 font-bold mt-1">({Math.round((presentCount / (totalCount || 1)) * 100)}%)</span>
                        </div>
                        <div className="text-center bg-white print:bg-white p-2.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
                          <span className="block text-[7.5px] font-black text-slate-400 uppercase tracking-wider mb-1">យឺត (L / LATE)</span>
                          <span className="text-[12px] font-black text-amber-600 leading-none">{toKhmerNumeral(lateCount)} នាក់</span>
                          <span className="text-[7.5px] text-amber-500/80 font-bold mt-1">({Math.round((lateCount / (totalCount || 1)) * 100)}%)</span>
                        </div>
                        <div className="text-center bg-white print:bg-white p-2.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
                          <span className="block text-[7.5px] font-black text-slate-400 uppercase tracking-wider mb-1">ច្បាប់ (E / PERMISSION)</span>
                          <span className="text-[12px] font-black text-primary-600 leading-none">{toKhmerNumeral(permissionCount)} នាក់</span>
                          <span className="text-[7.5px] text-primary-500/80 font-bold mt-1">({Math.round((permissionCount / (totalCount || 1)) * 100)}%)</span>
                        </div>
                        <div className="text-center bg-white print:bg-white p-2.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
                          <span className="block text-[7.5px] font-black text-slate-400 uppercase tracking-wider mb-1">អវត្តមាន (A / ABSENT)</span>
                          <span className="text-[12px] font-black text-rose-600 leading-none">{toKhmerNumeral(absentCount)} នាក់</span>
                          <span className="text-[7.5px] text-rose-500/80 font-bold mt-1">({Math.round((absentCount / (totalCount || 1)) * 100)}%)</span>
                        </div>
                      </div>

                      {/* Main Table */}
                      <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full table-fixed text-left border-collapse border border-slate-300 text-[10px] print:text-xs">
                          <thead>
                            <tr className="bg-slate-100/90 border-b border-slate-300 text-slate-750">
                              {printSelectedColumns.no && (
                                <th className="border border-slate-300 p-1 text-center font-black text-slate-800 whitespace-nowrap leading-tight w-[4%]">
                                  <div>ល.រ</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">(No.)</div>
                                </th>
                              )}
                              {printSelectedColumns.studentId && (
                                <th className="border border-slate-300 p-1 text-center font-black text-slate-800 whitespace-nowrap leading-tight w-[11%]">
                                  <div>លេខសម្គាល់</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">(ID)</div>
                                </th>
                              )}
                              {printSelectedColumns.name && (
                                <th className="border border-slate-300 p-1 text-left font-black text-slate-800 whitespace-nowrap leading-tight w-[19%]">
                                  <div>{isStudentMode ? "ឈ្មោះសិស្ស" : "ឈ្មោះគ្រូ"}</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">{isStudentMode ? "(Student Name)" : "(Teacher Name)"}</div>
                                </th>
                              )}
                              {printSelectedColumns.date && (
                                <th className="border border-slate-300 p-1 text-center font-black text-slate-800 whitespace-nowrap leading-tight w-[9%]">
                                  <div>កាលបរិច្ឆេទ</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">(Date)</div>
                                </th>
                              )}
                              {printSelectedColumns.course && (
                                <th className="border border-slate-300 p-1 text-left font-black text-slate-800 whitespace-nowrap leading-tight w-[22%]">
                                  <div>{isStudentMode ? "វគ្គសិក្សា" : "ឯកទេស"}</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">{isStudentMode ? "(Course)" : "(Specialty)"}</div>
                                </th>
                              )}
                              {printSelectedColumns.checkIn && (
                                <th className="border border-slate-300 p-1 text-center font-black text-slate-800 whitespace-nowrap leading-tight w-[10%]">
                                  <div>វត្តមានចូល</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">(Check-In)</div>
                                </th>
                              )}
                              {printSelectedColumns.checkOut && (
                                <th className="border border-slate-300 p-1 text-center font-black text-slate-800 whitespace-nowrap leading-tight w-[10%]">
                                  <div>វត្តមានចេញ</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">(Check-Out)</div>
                                </th>
                              )}
                              {printSelectedColumns.reason && (
                                <th className="border border-slate-300 p-1 text-center font-black text-slate-800 leading-tight w-[10%]">
                                  <div>មូលហេតុ</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">(Remarks)</div>
                                </th>
                              )}
                              {printSelectedColumns.rate && (
                                <th className="border border-slate-300 p-1 text-right font-black text-slate-800 whitespace-nowrap leading-tight w-[5%]">
                                  <div>អត្រា</div>
                                  <div className="text-[7.5px] text-slate-500 font-mono font-bold mt-0.5">(Rate)</div>
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const isShowingDailyDetails = reportPeriod !== 'day' && (showDailyDetails || attendanceSearch !== "" || attendanceCourseFilter !== "all");

                              const printRows = (() => {
                                const [year, month] = attendanceDate.split('-');
                                const prefix = reportPeriod === 'month' ? `${year}-${month}` : year;

                                if (reportPeriod === 'day') {
                                  return list.map(item => {
                                    const stats = getPeriodStats(item.id);
                                    const rateStr = getRatePercent(item.id, stats);
                                    const cinTime = getLoggedTime(item.id, 'check-in', '08:00 AM', attendanceDate);
                                    const coutTime = getLoggedTime(item.id, 'check-out', '02:08 PM', attendanceDate);
                                    const cin = attendanceCheckInLog[attendanceDate]?.[item.id] || "-";
                                    const cout = attendanceCheckOutLog[attendanceDate]?.[item.id] || "-";
                                    const checkInNote = attendanceNotes[attendanceDate]?.[item.id]?.['check-in'] || "";
                                    const checkOutNote = attendanceNotes[attendanceDate]?.[item.id]?.['check-out'] || "";
                                    const reasonStr = checkInNote || checkOutNote || "-";

                                    return {
                                      item,
                                      date: attendanceDate,
                                      cin,
                                      cout,
                                      cinTime,
                                      coutTime,
                                      reasonStr,
                                      stats,
                                      rateStr
                                    };
                                  });
                                } else if (isShowingDailyDetails) {
                                  const allDates = new Set<string>();
                                  Object.keys(attendanceCheckInLog).forEach(date => {
                                    if (date.startsWith(prefix)) allDates.add(date);
                                  });
                                  Object.keys(attendanceCheckOutLog).forEach(date => {
                                    if (date.startsWith(prefix)) allDates.add(date);
                                  });

                                  const sortedDates = Array.from(allDates).sort().reverse();
                                  const rows: any[] = [];

                                  list.forEach(item => {
                                    sortedDates.forEach(date => {
                                      const cin = attendanceCheckInLog[date]?.[item.id];
                                      const cout = attendanceCheckOutLog[date]?.[item.id];

                                      if (cin || cout) {
                                        const resolved = (() => {
                                          if (!cin) return cout;
                                          if (!cout) return cin;
                                          if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                                          if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                                          if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                                          return 'ABSENT';
                                        })();

                                        const stats = {
                                          p: resolved === 'PRESENT' ? 1 : 0,
                                          l: resolved === 'LATE' ? 1 : 0,
                                          e: resolved === 'PERMISSION' ? 1 : 0,
                                          a: resolved === 'ABSENT' ? 1 : 0,
                                          resolvedStatus: resolved
                                        };

                                        const rateStr = resolved === 'ABSENT' ? "0%" : "100%";
                                        const cinTime = getLoggedTime(item.id, 'check-in', '08:00 AM', date);
                                        const coutTime = getLoggedTime(item.id, 'check-out', '02:08 PM', date);
                                        const checkInNote = attendanceNotes[date]?.[item.id]?.['check-in'] || "";
                                        const checkOutNote = attendanceNotes[date]?.[item.id]?.['check-out'] || "";
                                        const reasonStr = checkInNote || checkOutNote || "-";

                                        rows.push({
                                          item,
                                          date,
                                          cin: cin || "-",
                                          cout: cout || "-",
                                          cinTime,
                                          coutTime,
                                          reasonStr,
                                          stats,
                                          rateStr
                                        });
                                      }
                                    });
                                  });

                                  return rows;
                                } else {
                                  return list.map(item => {
                                    const stats = getPeriodStats(item.id);
                                    const rateStr = getRatePercent(item.id, stats);
                                    
                                    const cin = attendanceCheckInLog[attendanceDate]?.[item.id] || "-";
                                    const cout = attendanceCheckOutLog[attendanceDate]?.[item.id] || "-";
                                    const cinTime = getLoggedTime(item.id, 'check-in', '08:00 AM', attendanceDate);
                                    const coutTime = getLoggedTime(item.id, 'check-out', '02:08 PM', attendanceDate);
                                    const checkInNote = attendanceNotes[attendanceDate]?.[item.id]?.['check-in'] || "";
                                    const checkOutNote = attendanceNotes[attendanceDate]?.[item.id]?.['check-out'] || "";
                                    const reasonStr = checkInNote || checkOutNote || "-";

                                    return {
                                      item,
                                      date: attendanceDate,
                                      cin,
                                      cout,
                                      cinTime,
                                      coutTime,
                                      reasonStr,
                                      stats,
                                      rateStr
                                    };
                                  });
                                }
                              })();

                              return printRows.map((row: any, idx) => {
                                const { item, date, cin, cout, cinTime, coutTime, reasonStr, stats, rateStr } = row;
                                
                                const rateVal = parseFloat(rateStr);
                                const rateColorClass = rateVal === 100 
                                  ? "text-emerald-600 print:text-emerald-700 font-bold" 
                                  : rateVal >= 80 
                                  ? "text-amber-600 print:text-amber-700 font-bold" 
                                  : "text-rose-600 print:text-rose-700 font-bold";

                                return (
                                  <tr key={`${item.id}-${date}-${idx}`} className="border-b border-slate-300 hover:bg-slate-50/50 transition-colors print:hover:bg-transparent">
                                    {printSelectedColumns.no && (
                                      <td className="border border-slate-300 p-1 text-center font-bold text-slate-500 font-sans whitespace-nowrap">
                                        {toKhmerNumeral(String(idx + 1))}
                                      </td>
                                    )}
                                    {printSelectedColumns.studentId && (
                                      <td className="border border-slate-300 p-1 text-center font-mono text-[9px] font-bold text-slate-600 whitespace-nowrap">
                                        {item.studentId || item.teacherId}
                                      </td>
                                    )}
                                    {printSelectedColumns.name && (
                                      <td className="border border-slate-300 p-1 text-left whitespace-nowrap leading-tight">
                                        <div className="font-extrabold text-slate-900">
                                          {item.nameKh}
                                        </div>
                                        <div className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                                          {item.nameEn}
                                        </div>
                                      </td>
                                    )}
                                    {printSelectedColumns.date && (
                                      <td className="border border-slate-300 p-1 text-center whitespace-nowrap font-mono text-[9px] font-bold text-slate-700">
                                        {(() => {
                                          const [y, m, d] = date.split('-');
                                          if (reportPeriod === 'day' || isShowingDailyDetails) {
                                            return `${d}/${m}/${y}`;
                                          } else if (reportPeriod === 'month') {
                                            return `${m}/${y}`;
                                          } else {
                                            return y;
                                          }
                                        })()}
                                      </td>
                                    )}
                                    {printSelectedColumns.course && (
                                      <td className="border border-slate-300 p-1 text-left font-bold text-slate-700 text-[9px] whitespace-nowrap">
                                        {item.course || item.specialty}
                                      </td>
                                    )}
                                    {printSelectedColumns.checkIn && (
                                      <td className="border border-slate-300 p-1 text-center whitespace-nowrap">
                                        {renderStatusBadge(cin)}
                                      </td>
                                    )}
                                    {printSelectedColumns.checkOut && (
                                      <td className="border border-slate-300 p-1 text-center whitespace-nowrap">
                                        {renderStatusBadge(cout)}
                                      </td>
                                    )}
                                    {printSelectedColumns.reason && (
                                      <td className="border border-slate-300 p-1 text-center text-[8.5px] font-medium text-slate-500 truncate">
                                        {reasonStr !== "-" ? reasonStr : <span className="text-slate-300 font-sans">-</span>}
                                      </td>
                                    )}
                                    {printSelectedColumns.rate && (
                                      <td className={`border border-slate-300 p-1 text-right font-mono font-black text-[9.5px] whitespace-nowrap ${rateColorClass}`}>
                                        {rateStr}
                                      </td>
                                    )}
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Footer Signature Section */}
                    {printShowSignatures && (
                      <div className="grid grid-cols-2 gap-6 pt-6 text-[10px] text-slate-500 font-bold border-t border-slate-200 mt-8">
                        <div className="text-left space-y-12">
                          <div className="space-y-1">
                            <p className="text-slate-400 text-[8px] uppercase tracking-wider">អ្នកពិនិត្យ និងរៀបចំ (Prepared By)</p>
                            <p className="text-slate-800 font-black text-[9.5px]">គណៈគ្រប់គ្រងមជ្ឈមណ្ឌល</p>
                          </div>
                          <div className="h-10"></div> {/* Spacer for manual sign */}
                          <p className="text-[9px] text-slate-400 font-medium">ហត្ថលេខា & ត្រា</p>
                        </div>
                        <div className="text-right space-y-12">
                          <div className="space-y-1">
                            <p className="text-slate-400 text-[8px] font-sans font-medium italic">ធ្វើនៅភ្នំពេញ, {khmerDateStr}</p>
                            <p className="text-slate-400 text-[8px] uppercase tracking-wider">ប្រធានស្ថាប័ន (Approved By)</p>
                            <p className="text-slate-850 font-black text-[9.5px]">ជី សុភា (CHY SOPHEA)</p>
                          </div>
                          <div className="h-10"></div> {/* Spacer for manual sign */}
                          <p className="text-[9px] text-slate-400 font-medium">ហត្ថលេខា & ត្រា</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              };


              const handleExportAttendanceExcel = () => {
                const data = activeList.map((item) => {
                  const checkIn = checkInLogToday[item.id] || "-";
                  const checkOut = checkOutLogToday[item.id] || "-";
                  const note = attendanceNotes[attendanceDate]?.[item.id] || "";
                  const itemName = uiLang === 'kh' ? (item.nameKh || item.nameEn) : (item.nameEn || item.nameKh);
                  const course = isStudentMode ? item.course : item.specialty;
                  
                  return {
                    "ID": item.studentId || item.id,
                    "Name": itemName,
                    "Course/Specialty": course,
                    "Check In": checkIn,
                    "Check Out": checkOut,
                    "Note": note,
                    "Date": attendanceDate
                  };
                });
                exportToExcel(data, `attendance_export_${attendanceDate}`, `របាយការណ៍វត្តមានប្រចាំថ្ងៃ - ${attendanceDate}`);
              };

              return (
                <motion.div
                  key="attendance-tab"
                  initial={{ opacity: 0.92 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="space-y-4"
                >
                  {/* Attendance Sub Tabs Toggle & Telegram Bot config */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-full sm:max-w-fit border border-slate-200/60 shadow-3xs overflow-x-auto no-scrollbar shrink-0">
                      <button
                        onClick={() => setAttendanceSubTab('logging')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                          attendanceSubTab === 'logging'
                            ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]"
                            : "text-slate-500 hover:text-slate-850 hover:bg-slate-200/50"
                        }`}
                      >
                        <CheckCircle className={`w-4 h-4 transition-colors duration-200 ${attendanceSubTab === 'logging' ? 'text-primary-400' : 'text-slate-400'}`} />
                        <span>
                          {uiLang === "kh" ? "កត់ត្រាវត្តមាន ចេញ-ចូល (Daily Logging)" : uiLang === "zh" ? "每日考勤记录 (Daily Logging)" : "Daily Logging (Daily Logging)"}
                        </span>
                      </button>
                      <button
                        onClick={() => setAttendanceSubTab('reports')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                          attendanceSubTab === 'reports'
                            ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]"
                            : "text-slate-500 hover:text-slate-850 hover:bg-slate-200/50"
                        }`}
                      >
                        <File className={`w-4 h-4 transition-colors duration-200 ${attendanceSubTab === 'reports' ? 'text-primary-400' : 'text-slate-400'}`} />
                        <span>
                          {uiLang === "kh" ? "របាយការណ៍រួម (Reports Dashboard)" : uiLang === "zh" ? "数据统计报表 (Reports Dashboard)" : "Reports Dashboard (Reports Dashboard)"}
                        </span>
                      </button>
                    </div>

                    {/* Telegram Bot Config Button */}
                    <button 
                      onClick={() => setShowBotConfig(true)}
                      className="group flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-primary-600 transition-all duration-200 cursor-pointer text-xs font-bold shadow-3xs"
                    >
                      <Settings className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45 text-slate-500 group-hover:text-primary-500" />
                      <span>
                        {uiLang === "kh" ? "រៀបចំ Telegram Bot" : uiLang === "zh" ? "配置电报机器人" : "Setup Telegram Bot"}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    </button>
                  </div>

                  {attendanceSubTab === 'logging' ? (
                    <div className="space-y-4">
                      {/* Interactive Filter and Setup Bar */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-xs py-1 px-4 flex flex-col md:flex-row gap-2 items-center justify-between">
                        {/* Selector Buttons */}
                        <div className="flex gap-1.5 p-0.5 bg-slate-100 rounded-lg w-full md:w-auto shrink-0 border border-slate-200/40">
                          <button
                            onClick={() => {
                              setAttendanceType('student');
                              setAttendanceSearch('');
                              setAttendanceCourseFilter('all');
                            }}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                              attendanceType === 'student'
                                ? "bg-white text-primary-600 shadow-3xs border border-slate-200/50"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            {uiLang === "kh" ? "វត្តមានសិស្ស" : uiLang === "zh" ? "学生考勤" : "Student Attendance"}
                          </button>
                          <button
                            onClick={() => {
                              setAttendanceType('teacher');
                              setAttendanceSearch('');
                              setAttendanceCourseFilter('all');
                            }}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                              attendanceType === 'teacher'
                                ? "bg-white text-primary-600 shadow-3xs border border-slate-200/50"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            <User className="w-3.5 h-3.5" />
                            {uiLang === "kh" ? "វត្តមានគ្រូបង្រៀន" : uiLang === "zh" ? "教师考勤" : "Teacher Attendance"}
                          </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-wrap md:flex-nowrap gap-2.5 items-center w-full md:w-auto">
                          {/* Search Input */}
                          <div className="relative flex-1 md:w-56">
                            <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              value={attendanceSearch}
                              onChange={(e) => setAttendanceSearch(e.target.value)}
                              placeholder={uiLang === "kh" ? "ស្វែងរកឈ្មោះ ឬលេខសម្គាល់..." : uiLang === "zh" ? "搜索姓名或编号..." : "Search name or ID..."}
                              className="w-full pl-8 pr-3 py-1 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            />
                          </div>

                          {/* Course Filter Dropdown - only for Students */}
                          {isStudentMode && (
                            <div className="relative shrink-0">
                              <BookOpen className="absolute left-3 top-2 w-3.5 h-3.5 text-emerald-500 pointer-events-none" />
                              <select
                                value={attendanceCourseFilter}
                                onChange={(e) => setAttendanceCourseFilter(e.target.value)}
                                className="pl-8 pr-7 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                              >
                                <option value="all">{uiLang === "kh" ? "ថ្នាក់/វិស័យទាំងអស់" : uiLang === "zh" ? "全部班级/学科" : "All Classes"} ({allCourses.length})</option>
                                {allCourses.map((c, idx) => (
                                  <option key={idx} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Date Display and Refresh Reset with Premium Navigation Controls */}
                          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80 shadow-3xs shrink-0 select-none">
                            {/* Previous Day Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const parts = attendanceDate.split("-").map(Number);
                                const date = new Date(parts[0], parts[1] - 1, parts[2]);
                                date.setDate(date.getDate() - 1);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                setAttendanceDate(`${year}-${month}-${day}`);
                              }}
                              className="w-6 h-6 rounded-md bg-white hover:bg-slate-100 text-slate-500 hover:text-primary-600 border border-slate-200/60 shadow-3xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Interactive Date Selector */}
                            <div className="flex items-center gap-1.5 px-2 py-1 border border-slate-200/60 rounded-md bg-white hover:bg-slate-50 hover:border-primary-400 transition-all shadow-3xs cursor-pointer relative">
                              <Calendar className="w-3.5 h-3.5 text-primary-500 pointer-events-none" />
                              <span className="font-sans text-primary-900 font-black tracking-wide text-[11px] pointer-events-none">
                                {(() => {
                                  const parts = attendanceDate.split("-").map(Number);
                                  const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
                                  // Simple format if toKhmerNumeral is tricky, but let's just use the native input overlay trick again here to make it beautiful
                                  if (uiLang === "kh") {
                                    return `${String(parts[2]).padStart(2, '0')}/${String(parts[1]).padStart(2, '0')}/${parts[0]}`;
                                  }
                                  return `${String(parts[2]).padStart(2, '0')}/${String(parts[1]).padStart(2, '0')}/${parts[0]}`;
                                })()}
                              </span>
                              <input
                                type="date"
                                value={attendanceDate}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 pointer-events-auto"
                                style={{ minHeight: "unset", appearance: "auto", WebkitAppearance: "auto" }}
                              />
                            </div>

                            {/* Next Day Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const parts = attendanceDate.split("-").map(Number);
                                const date = new Date(parts[0], parts[1] - 1, parts[2]);
                                date.setDate(date.getDate() + 1);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                setAttendanceDate(`${year}-${month}-${day}`);
                              }}
                              className="w-6 h-6 rounded-md bg-white hover:bg-slate-100 text-slate-500 hover:text-primary-600 border border-slate-200/60 shadow-3xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Today Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setAttendanceDate(new Date().toISOString().slice(0, 10));
                              }}
                              className="px-2 py-1 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 hover:text-primary-900 text-[9.5px] font-black uppercase tracking-wide transition-all cursor-pointer border border-primary-100 shadow-3xs flex items-center justify-center h-7"
                            >
                              {uiLang === "kh" ? "ថ្ងៃនេះ (Today)" : uiLang === "zh" ? "今天 (Today)" : "Today"}
                            </button>

                            {/* Refresh Attendance and Reset Filters */}
                            <button
                              type="button"
                              onClick={() => {
                                if (isRefreshingAttendance) return;
                                setIsRefreshingAttendance(true);
                                setAttendanceSearch("");
                                setAttendanceCourseFilter("all");
                                setAttendanceDate(new Date().toISOString().slice(0, 10));
                                showToast(
                                  uiLang === "kh" 
                                    ? "បានធ្វើឱ្យស្រស់ឡើងវិញរួចរាល់!" 
                                    : uiLang === "zh" 
                                      ? "已成功刷新考勤列表！" 
                                      : "Attendance list refreshed successfully!", 
                                  "success"
                                );
                                setTimeout(() => {
                                  setIsRefreshingAttendance(false);
                                }, 600);
                              }}
                              title={uiLang === "kh" ? "ធ្វើឱ្យស្រស់ឡើងវិញ (Refresh)" : uiLang === "zh" ? "刷新考勤 (Refresh)" : "Refresh Attendance"}
                              className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-500 hover:text-primary-600 transition-colors cursor-pointer border border-slate-200/60 shadow-3xs flex items-center justify-center"
                            >
                              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingAttendance ? "animate-spin" : ""}`} />
                            </button>

                            {/* Toggle Telegram Mockup */}
                            <button
                              type="button"
                              onClick={() => setShowTelegramMockup(prev => !prev)}
                              title={showTelegramMockup ? (uiLang === "kh" ? "លាក់ផ្ទាំងតេឡេក្រាម (Hide Telegram)" : "Hide Telegram") : (uiLang === "kh" ? "បង្ហាញផ្ទាំងតេឡេក្រាម (Show Telegram)" : "Show Telegram")}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer border shadow-3xs flex items-center justify-center ${
                                showTelegramMockup 
                                  ? "bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100 hover:text-sky-700" 
                                  : "bg-white border-slate-200/60 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                              }`}
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Main Roll Call Content Grid */}
                      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
                        {/* Left Side: Roll Call List */}
                        <div className="w-full xl:flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col relative">
                          {/* Header section with Title and Stats Capsules side-by-side */}
                          <div className="px-6 py-1.5 border-b border-slate-200 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
                            <div className="space-y-0.5">
                              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                                {isStudentMode 
                                  ? (uiLang === "kh" ? "បញ្ជីឈ្មោះសិស្សសម្រាប់ការកត់វត្តមាន" : uiLang === "zh" ? "签到考勤学生名单" : "Student Roll Call List")
                                  : (uiLang === "kh" ? "បញ្ជីឈ្មោះគ្រូសម្រាប់ការកត់វត្តមាន" : uiLang === "zh" ? "签到考勤教师名单" : "Teacher Roll Call List")
                                }
                              </h3>
                              <p className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wider">
                                {uiLang === "kh" ? "ចុចលើប៊ូតុងនីមួយៗ ដើម្បីកត់វត្តមានភ្លាមៗ" : uiLang === "zh" ? "点击相应按钮进行即时考勤登记" : "Click corresponding buttons to log instantly"}
                              </p>
                            </div>

                            {/* Stats summaries aligned on the right in a single horizontal row */}
                            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 shrink-0">
                              {/* Check-In stats summary */}
                              <div className="bg-white border border-slate-200/80 border-l-[3.5px] border-l-emerald-500 rounded-xl p-2 px-3 flex items-center justify-between gap-2 shadow-2xs">
                                <div className="leading-none shrink-0">
                                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                    📥 {uiLang === "kh" ? "សរុបចូល • CHECK-IN" : uiLang === "zh" ? "签到统计 • CHECK-IN" : "CHECK-IN SUMMARY"}
                                  </span>
                                  <span className="text-[10.5px] font-black text-emerald-600 mt-1 block">
                                    {uiLang === "kh" ? "អត្រា៖ " : uiLang === "zh" ? "比例：" : "Rate: "}
                                    {totalActiveCount > 0 
                                      ? `${uiLang === "kh" ? toKhmerNumeral(((checkInStats.PRESENT / totalActiveCount) * 100).toFixed(0)) : ((checkInStats.PRESENT / totalActiveCount) * 100).toFixed(0)}%` 
                                      : (uiLang === "kh" ? "១០០%" : "100%")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-black">
                                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">P: {uiLang === "kh" ? toKhmerNumeral(checkInStats.PRESENT) : checkInStats.PRESENT}</span>
                                  <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-100">A: {uiLang === "kh" ? toKhmerNumeral(checkInStats.ABSENT) : checkInStats.ABSENT}</span>
                                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100">L: {uiLang === "kh" ? toKhmerNumeral(checkInStats.LATE) : checkInStats.LATE}</span>
                                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">E: {uiLang === "kh" ? toKhmerNumeral(checkInStats.PERMISSION) : checkInStats.PERMISSION}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Search Results Details Widget */}
                          {attendanceSearch && (
                            <div className="px-6 py-4.5 border-b border-primary-100 bg-primary-50/15 space-y-3 no-print">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-primary-700 uppercase tracking-widest flex items-center gap-2">
                                  <Search className="w-3.5 h-3.5 text-primary-500 animate-pulse" />
                                  <span>{uiLang === "kh" ? "ទិន្នន័យស្វែងរកលម្អិត" : uiLang === "zh" ? "详细搜索结果" : "Detailed Search Results"} ({toKhmerNumeral(isStudentMode ? filteredStudents.length : filteredTeachers.length)} {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : "people"})</span>
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setAttendanceSearch("")}
                                  className="text-[10px] font-black text-slate-450 hover:text-slate-600 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors border border-slate-200/50"
                                >
                                  {uiLang === "kh" ? "សម្អាតស្វែងរក (Clear)" : uiLang === "zh" ? "清空搜索" : "Clear Search"}
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {(isStudentMode ? filteredStudents : filteredTeachers).slice(0, 3).map((item) => {
                                  // Calculate attendance statistics across all history
                                  let presentCount = 0;
                                  let lateCount = 0;
                                  let permissionCount = 0;
                                  let absentCount = 0;

                                  Object.keys(attendanceCheckInLog).forEach((date) => {
                                    const status = attendanceCheckInLog[date]?.[item.id];
                                    if (status === 'PRESENT') presentCount++;
                                    else if (status === 'LATE') lateCount++;
                                    else if (status === 'PERMISSION') permissionCount++;
                                    else if (status === 'ABSENT') absentCount++;
                                  });

                                  const totalDays = presentCount + lateCount + permissionCount + absentCount;
                                  const attendanceRate = totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : 100;

                                  const isFemale = item.gender === "Female";
                                  const avatarBg = isFemale ? "bg-pink-100 text-pink-600 border-pink-200" : "bg-blue-100 text-blue-600 border-blue-200";
                                  
                                  const itemCode = isStudentMode ? (item as any).studentId : (item as any).teacherId;
                                  const itemCourse = isStudentMode ? (item as any).course : (item as any).specialty;

                                  return (
                                    <div key={item.id} className="bg-white rounded-xl border border-primary-100/60 shadow-3xs p-4 flex flex-col justify-between hover:shadow-2xs transition-all relative overflow-hidden group">
                                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50/20 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                                      
                                      <div className="space-y-3.5 relative z-10">
                                        {/* Avatar & Name Info */}
                                        <div className="flex items-center gap-3">
                                          <div className={`w-11 h-11 rounded-full ${avatarBg} border flex items-center justify-center text-xl font-black shrink-0 relative`}>
                                            <span>{isFemale ? "👧" : "👦"}</span>
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border border-white text-[7.5px] font-black flex items-center justify-center text-white ${isFemale ? "bg-pink-500" : "bg-blue-600"}`}>
                                              {isFemale ? "F" : "M"}
                                            </span>
                                          </div>
                                          <div className="min-w-0">
                                            <h5 className="font-black text-slate-850 text-sm tracking-tight truncate">
                                              {item.nameKh}
                                            </h5>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate flex items-center gap-1.5 font-sans mt-0.5">
                                              <span>{item.nameEn}</span>
                                              <span className="text-slate-300">|</span>
                                              <span className="font-mono text-[8.5px] text-slate-500 bg-slate-50 border border-slate-200/50 px-1 rounded">
                                                {itemCode}
                                              </span>
                                            </p>
                                          </div>
                                        </div>

                                        {/* Detail specifications */}
                                        <div className="grid grid-cols-2 gap-2 text-[10.5px] border-t border-b border-slate-100 py-2 font-bold text-slate-500">
                                          <div>
                                            <span className="block text-[8.5px] text-slate-400 uppercase font-bold tracking-wider">{uiLang === "kh" ? "វគ្គសិក្សា • CLASS" : uiLang === "zh" ? "就读班级 • CLASS" : "CLASS/COURSE • CLASS"}</span>
                                            <span className="text-slate-800 font-extrabold truncate block mt-0.5">{itemCourse || (uiLang === "kh" ? "មិនកំណត់" : uiLang === "zh" ? "未指定" : "Unassigned")}</span>
                                          </div>
                                          <div>
                                            <span className="block text-[8.5px] text-slate-400 uppercase font-bold tracking-wider">{uiLang === "kh" ? "លេខទូរស័ព្ទ • CONTACT" : uiLang === "zh" ? "联系电话 • CONTACT" : "CONTACT PHONE • CONTACT"}</span>
                                            <span className="text-slate-800 font-extrabold block mt-0.5 truncate font-sans">
                                              {isStudentMode ? (item as any).guardianPhone || (uiLang === "kh" ? "គ្មានទិន្នន័យ" : uiLang === "zh" ? "无数据" : "No Data") : (item as any).phone || (uiLang === "kh" ? "គ្មានទិន្នន័យ" : uiLang === "zh" ? "无数据" : "No Data")}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Overall Attendance History Stats */}
                                        <div className="space-y-1.5">
                                          <div className="flex justify-between items-center text-[10.5px]">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider">{uiLang === "kh" ? "អត្រាវត្តមានសរុប • ATTENDANCE" : uiLang === "zh" ? "总出勤率 • ATTENDANCE" : "TOTAL ATTENDANCE • ATTENDANCE"}</span>
                                            <span className={`font-black px-1.5 py-0.5 rounded-md text-[9px] ${
                                              attendanceRate >= 80 ? "bg-emerald-50 text-emerald-700" : attendanceRate >= 50 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                                            }`}>
                                              {uiLang === "kh" ? toKhmerNumeral(attendanceRate) : attendanceRate}%
                                            </span>
                                          </div>
                                          
                                          {/* Custom progress bar */}
                                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                              className={`h-full rounded-full transition-all duration-500 ${
                                                attendanceRate >= 80 ? "bg-emerald-500" : attendanceRate >= 50 ? "bg-amber-400" : "bg-rose-500"
                                              }`} 
                                              style={{ width: `${attendanceRate}%` }} 
                                            />
                                          </div>

                                          <div className="flex justify-between text-[8.5px] font-black text-slate-400 mt-1">
                                            <span className="text-emerald-600">P: {uiLang === "kh" ? toKhmerNumeral(presentCount) : presentCount}</span>
                                            <span className="text-amber-500">L: {uiLang === "kh" ? toKhmerNumeral(lateCount) : lateCount}</span>
                                            <span className="text-blue-500">E: {uiLang === "kh" ? toKhmerNumeral(permissionCount) : permissionCount}</span>
                                            <span className="text-rose-600">A: {uiLang === "kh" ? toKhmerNumeral(absentCount) : absentCount}</span>
                                          </div>
                                        </div>

                                        {/* Today's status details */}
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center justify-between text-[10.5px]">
                                          <span className="font-extrabold text-slate-500">{uiLang === "kh" ? "ស្ថានភាពថ្ងៃនេះ៖" : uiLang === "zh" ? "今日状态：" : "Today's Status:"}</span>
                                          <div className="flex items-center gap-1.5 font-black text-[9px]">
                                            <span className={`px-1.5 py-0.5 rounded border ${
                                              checkInLogToday[item.id] === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                              checkInLogToday[item.id] === 'LATE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                              checkInLogToday[item.id] === 'PERMISSION' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                              checkInLogToday[item.id] === 'ABSENT' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                              'bg-slate-100 text-slate-400 border-slate-200'
                                            }`}>
                                              {uiLang === "kh" ? "ចូល៖ " : uiLang === "zh" ? "签到：" : "In: "}{checkInLogToday[item.id] ? (checkInLogToday[item.id] === 'PRESENT' ? 'P' : checkInLogToday[item.id] === 'LATE' ? 'L' : checkInLogToday[item.id] === 'PERMISSION' ? 'E' : 'A') : '-'}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded border ${
                                              checkOutLogToday[item.id] === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                              checkOutLogToday[item.id] === 'LATE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                              checkOutLogToday[item.id] === 'PERMISSION' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                              checkOutLogToday[item.id] === 'ABSENT' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                              'bg-slate-100 text-slate-400 border-slate-200'
                                            }`}>
                                              {uiLang === "kh" ? "ចេញ៖ " : uiLang === "zh" ? "签退：" : "Out: "}{checkOutLogToday[item.id] ? (checkOutLogToday[item.id] === 'PRESENT' ? 'P' : checkOutLogToday[item.id] === 'LATE' ? 'L' : checkOutLogToday[item.id] === 'PERMISSION' ? 'E' : 'A') : '-'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Detailed roll-call table */}
                          <div id="attendance-scroll-container" className="overflow-x-auto flex-1 scroll-smooth relative" style={{ WebkitOverflowScrolling: 'touch' }}>
                            <table className="w-full min-w-[1120px] text-left border-collapse block lg:table lg:table-fixed">
                              <colgroup className="hidden lg:table-column-group">
                                <col className="w-[20%] min-w-[190px]" />
                                <col className="w-[22%] min-w-[210px]" />
                                <col className="w-[29%] min-w-[350px]" />
                                <col className="w-[29%] min-w-[350px]" />
                              </colgroup>
                              <thead className="sticky top-0 bg-slate-50 z-10 hidden lg:table-header-group">
                                <tr className="border-b border-slate-200 bg-slate-50/95 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                  <th className="px-2 sm:px-3 py-2.5 font-black text-slate-500 text-left w-[20%] min-w-[190px]">{uiLang === "kh" ? "ព័ត៌មានបុគ្គល / ID" : uiLang === "zh" ? "个人信息 / ID" : "Personal Info / ID"}</th>
                                  <th className="px-2 sm:px-3 py-2.5 font-black text-slate-500 text-left w-[22%] min-w-[210px]">{uiLang === "kh" ? "ព័ត៌មានលម្អិតសិក្សា" : uiLang === "zh" ? "班级与学术详情" : "Class & Academic Details"}</th>
                                  <th className="px-2 sm:px-3 py-2.5 font-black text-slate-500 text-center w-[29%] min-w-[350px]">
                                    <span>{uiLang === "kh" ? "វត្តមានម៉ោងចូល (CHECK-IN ចូល)" : uiLang === "zh" ? "签到状态 (CHECK-IN)" : "CHECK-IN ATTENDANCE"}</span>
                                  </th>
                                  <th className="px-2 sm:px-3 py-2.5 font-black text-slate-500 text-center w-[29%] min-w-[350px]">{uiLang === "kh" ? "វត្តមានម៉ោងចេញ (CHECK-OUT ចេញ)" : uiLang === "zh" ? "签退状态 (CHECK-OUT)" : "CHECK-OUT ATTENDANCE"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y-0 lg:divide-y lg:divide-slate-100 text-xs block lg:table-row-group p-3 lg:p-0 space-y-4 lg:space-y-0">
                                {isStudentMode ? (
                                  filteredStudents.map((student) => {
                                    const cIn = checkInLogToday[student.id];
                                    const cOut = checkOutLogToday[student.id];
                                    const isExpanded = expandedAttendanceRow === student.id;
                                    return (
                                      <React.Fragment key={student.id}>
                                        <tr className={`hover:bg-slate-50/40 transition-colors block lg:table-row bg-white lg:bg-transparent rounded-2xl lg:rounded-none border border-slate-200 lg:border-none shadow-sm lg:shadow-none overflow-hidden ${isExpanded ? "bg-primary-50/15" : ""}`}>
                                          <td className="px-3 sm:px-4 py-2 select-none cursor-pointer"
                                            onClick={() => setExpandedAttendanceRow(isExpanded ? null : student.id)}
                                          >
                                            <div className="flex items-center gap-2">
                                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180 text-primary-600" : ""}`} />
                                              <div className={`w-7.5 h-7.5 rounded-md flex items-center justify-center font-black text-[10.5px] shrink-0 ${
                                                student.gender === "Female" ? "bg-pink-100/60 text-pink-600" : "bg-blue-100/60 text-blue-600"
                                              }`}>
                                                {(student.nameEn || student.nameKh || '').split(' ').filter(Boolean).map(n => n.charAt(0)).join('').substring(0, 2)}
                                              </div>
                                              <div>
                                                <h4 className="font-black text-slate-800 text-[13px] leading-tight truncate max-w-[170px] sm:max-w-[210px]">
                                                  {student.nameKh}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-bold uppercase mt-0.5 leading-tight whitespace-nowrap overflow-hidden">
                                                  <span className="truncate max-w-[100px] sm:max-w-[130px]">{student.nameEn}</span>
                                                  <span className="text-slate-300 shrink-0">|</span>
                                                  <span className="inline-block font-mono text-[8.5px] font-black text-slate-500 bg-slate-50 border border-slate-200/60 px-1 py-0.5 rounded leading-none shrink-0">
                                                    {student.studentId}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-3 sm:px-4 py-2 select-none cursor-pointer"
                                            onClick={() => setExpandedAttendanceRow(isExpanded ? null : student.id)}
                                          >
                                            <div className="space-y-1">
                                              <div className="flex items-center gap-1 text-slate-700 text-[11.5px] font-black">
                                                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="truncate max-w-[180px] xl:max-w-[240px]">
                                                  {student.course ? (
                                                    translateCourseOrSpecialtyName(student.course, uiLang)
                                                  ) : (
                                                    uiLang === "kh" ? "មិនទាន់កំណត់" : uiLang === "zh" ? "未指定" : "Unassigned"
                                                  )}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
                                                {student.level && (
                                                  <div className="text-[9.5px] text-primary-700 font-bold bg-primary-50/70 border border-primary-200/60 px-1 py-0.5 rounded max-w-fit leading-none">
                                                    {translateLevelText(student.level, uiLang)}
                                                  </div>
                                                )}
                                                <div className="text-[9.5px] text-slate-500 font-bold bg-slate-50 border border-slate-200/60 px-1 py-0.5 rounded max-w-fit leading-none">
                                                  {uiLang === "kh" ? "រៀន៖ " : uiLang === "zh" ? "班次：" : "Shift: "}{translateShiftText(student.id === "101" ? "1" : student.shift || "1", uiLang)}
                                                </div>
                                                {(() => {
                                                  const hoursInfo = getStudentHoursInfo(student);
                                                  if (hoursInfo.hasCustom) {
                                                    return (
                                                      <div className="text-[9px] text-amber-700 font-black bg-amber-50/50 border border-amber-100/60 px-1.5 py-0.5 rounded max-w-fit leading-none flex items-center gap-0.5 animate-pulse">
                                                        <span>⏳ {uiLang === "kh" ? "ម៉ោងកែប្រែ៖" : uiLang === "zh" ? "自定义时间：" : "Custom Hours:"} {uiLang === "kh" ? toKhmerNumeral(hoursInfo.customHours || "") : hoursInfo.customHours} | {uiLang === "kh" ? "ម៉ោងបញ្ចូល៖" : uiLang === "zh" ? "录入时间：" : "Actual Hours:"} {uiLang === "kh" ? toKhmerNumeral(hoursInfo.actualHours || "") : hoursInfo.actualHours || "---"}</span>
                                                      </div>
                                                    );
                                                  }
                                                  if (student.hours) {
                                                    return (
                                                      <div className="text-[9px] text-primary-600 font-black bg-primary-50/50 border border-primary-100/60 px-1 py-0.5 rounded max-w-fit leading-none flex items-center gap-0.5">
                                                        <span>⏰ {uiLang === "kh" ? "ម៉ោង៖ " : uiLang === "zh" ? "上课时间：" : "Hours: "}{uiLang === "kh" ? toKhmerNumeral(getStudentStudyHours(student)) : getStudentStudyHours(student)}</span>
                                                      </div>
                                                    );
                                                  }
                                                  return null;
                                                })()}
                                                <span className="inline-flex items-center px-1.5 py-0.5 text-[9.5px] font-black rounded bg-emerald-50 border border-emerald-100 text-emerald-600 leading-none">
                                                  {uiLang === "kh" ? "កំពុងសិក្សា" : uiLang === "zh" ? "在读" : "Studying"}
                                                </span>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-2 sm:px-3 py-2 text-center">
                                            <div className="flex flex-col items-center justify-center gap-1.5 w-full">
    
                                              <div className="grid grid-cols-4 gap-1 w-full mx-auto">
                                                {[
                                                  { id: 'PRESENT', label: uiLang === "kh" ? '✓ វត្តមាន (P)' : uiLang === "zh" ? '✓ 出勤 (P)' : '✓ Present (P)', activeClass: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600/60 shadow-3xs shadow-emerald-500/10', inactiveClass: 'border-emerald-200/80 bg-emerald-50/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300' },
                                                  { id: 'ABSENT', label: uiLang === "kh" ? '✕ អវត្តមាន (A)' : uiLang === "zh" ? '✕ 缺勤 (A)' : '✕ Absent (A)', activeClass: 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600/60 shadow-3xs shadow-rose-500/10', inactiveClass: 'border-rose-200/80 bg-rose-50/20 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300' },
                                                  { id: 'LATE', label: uiLang === "kh" ? '⏱ យឺត (L)' : uiLang === "zh" ? '⏱ 迟到 (L)' : '⏱ Late (L)', activeClass: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500/60 shadow-3xs shadow-amber-500/10', inactiveClass: 'border-amber-200/80 bg-amber-50/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300' },
                                                  { id: 'PERMISSION', label: uiLang === "kh" ? '📝 ច្បាប់ (E)' : uiLang === "zh" ? '📝 请假 (E)' : '📝 Excused (E)', activeClass: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600/60 shadow-3xs shadow-blue-500/10', inactiveClass: 'border-blue-200/80 bg-blue-50/20 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300' }
                                                ].map(btn => (
                                                  <button
                                                    key={btn.id}
                                                    onClick={() => {
                                                      if (btn.id === 'ABSENT' || btn.id === 'PERMISSION' || btn.id === 'LATE') {
                                                        setAbsenceModalData({
                                                          type: 'check-in',
                                                          id: student.id,
                                                          nameKh: student.nameKh,
                                                          nameEn: student.nameEn,
                                                          courseOrSpecialty: student.course || "General",
                                                          itemType: 'student',
                                                          status: btn.id,
                                                          currentNote: attendanceNotes[attendanceDate]?.[student.id]?.['check-in'] || 
                                                            (btn.id === 'ABSENT' 
                                                              ? (uiLang === "kh" ? "គ្មានច្បាប់" : uiLang === "zh" ? "未请假/无故缺勤" : "Unexcused") 
                                                              : btn.id === 'PERMISSION' 
                                                                ? (uiLang === "kh" ? "មានច្បាប់" : uiLang === "zh" ? "已请假" : "Excused") 
                                                                : (uiLang === "kh" ? "យឺត" : uiLang === "zh" ? "迟到" : "Late"))
                                                        });
                                                      } else if (cIn === btn.id) {
                                                        setAttendanceCheckInLog(prev => {
                                                          const dLog = { ...(prev[attendanceDate] || {}) };
                                                          delete dLog[student.id];
                                                          return { ...prev, [attendanceDate]: dLog };
                                                        });
                                                        autoSaveItemAttendance(
                                                          student.id,
                                                          'student',
                                                          null,
                                                          attendanceCheckOutLog[attendanceDate]?.[student.id] || null
                                                        );
                                                      } else {
                                                        logItemAttendance('check-in', student.id, btn.id as any, student.nameKh, student.course, 'student', student.nameEn);
                                                      }
                                                    }}
                                                    title={btn.label}
                                                    className={`w-full h-8 text-center px-1 text-[8.5px] sm:text-[9px] xl:text-[9.5px] font-black rounded-lg border transition-all duration-200 cursor-pointer active:scale-[0.97] shadow-3xs flex items-center justify-center gap-0.5 whitespace-nowrap ${
                                                      cIn === btn.id ? btn.activeClass : btn.inactiveClass
                                                    }`}
                                                  >
                                                    {btn.label}
                                                  </button>
                                                ))}
                                              </div>
                                              {cIn && (
                                                <div className="flex items-center gap-1 text-[8.5px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 mt-0.5">
                                                  <Clock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                                  <span>{uiLang === "kh" ? "ម៉ោងចូល៖ " : uiLang === "zh" ? "签到时间：" : "Check-In Time: "}{uiLang === "kh" ? toKhmerNumeral(getLoggedTime(student.id, 'check-in', getStudentStartAndEndTimes(student).start)) : getLoggedTime(student.id, 'check-in', getStudentStartAndEndTimes(student).start)}</span>
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-2 sm:px-3 py-2 text-center">
                                            <div className="flex flex-col items-center justify-center gap-1.5 w-full">
      
      <div className="grid grid-cols-4 gap-1 w-full mx-auto">
                                                {[
                                                  { id: 'PRESENT', label: uiLang === "kh" ? '✓ ម៉ោងចេញ (P)' : uiLang === "zh" ? '✓ 签退 (P)' : '✓ Check-Out (P)', activeClass: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600/60 shadow-3xs shadow-emerald-500/10', inactiveClass: 'border-emerald-200/80 bg-emerald-50/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300' },
                                                  { id: 'ABSENT', label: uiLang === "kh" ? '✕ អវត្តមាន (A)' : uiLang === "zh" ? '✕ 未签退 (A)' : '✕ Absent (A)', activeClass: 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600/60 shadow-3xs shadow-rose-500/10', inactiveClass: 'border-rose-200/80 bg-rose-50/20 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300' },
                                                  { id: 'LATE', label: uiLang === "kh" ? '⏱ ចេញមុន (L)' : uiLang === "zh" ? '⏱ 早退 (L)' : '⏱ Early Out (L)', activeClass: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500/60 shadow-3xs shadow-amber-500/10', inactiveClass: 'border-amber-200/80 bg-amber-50/20 text-amber-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300' },
                                                  { id: 'PERMISSION', label: uiLang === "kh" ? '📝 ច្បាប់ (E)' : uiLang === "zh" ? '📝 请假 (E)' : '📝 Excused (E)', activeClass: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600/60 shadow-3xs shadow-blue-500/10', inactiveClass: 'border-blue-200/80 bg-blue-50/20 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300' }
                                                ].map(btn => (
                                                  <button
                                                    key={btn.id}
                                                    onClick={() => {
                                                      if (btn.id === 'ABSENT' || btn.id === 'PERMISSION' || btn.id === 'LATE') {
                                                        setAbsenceModalData({
                                                          type: 'check-out',
                                                          id: student.id,
                                                          nameKh: student.nameKh,
                                                          nameEn: student.nameEn,
                                                          courseOrSpecialty: student.course || "General",
                                                          itemType: 'student',
                                                          status: btn.id,
                                                          currentNote: attendanceNotes[attendanceDate]?.[student.id]?.['check-out'] || 
                                                            (btn.id === 'ABSENT' 
                                                              ? (uiLang === "kh" ? "គ្មានច្បាប់" : uiLang === "zh" ? "未请假/无故缺勤" : "Unexcused") 
                                                              : btn.id === 'PERMISSION' 
                                                                ? (uiLang === "kh" ? "មានច្បាប់" : uiLang === "zh" ? "已请假" : "Excused") 
                                                                : (uiLang === "kh" ? "ចេញមុន" : uiLang === "zh" ? "早退" : "Early Out"))
                                                        });
                                                      } else if (cOut === btn.id) {
                                                        setAttendanceCheckOutLog(prev => {
                                                          const dLog = { ...(prev[attendanceDate] || {}) };
                                                          delete dLog[student.id];
                                                          return { ...prev, [attendanceDate]: dLog };
                                                        });
                                                        autoSaveItemAttendance(
                                                          student.id,
                                                          'student',
                                                          attendanceCheckInLog[attendanceDate]?.[student.id] || null,
                                                          null
                                                        );
                                                      } else {
                                                        logItemAttendance('check-out', student.id, btn.id as any, student.nameKh, student.course, 'student', student.nameEn);
                                                      }
                                                    }}
                                                    title={btn.label}
                                                    className={`w-full h-8 text-center px-1 text-[8.5px] sm:text-[9px] xl:text-[9.5px] font-black rounded-lg border transition-all duration-200 cursor-pointer active:scale-[0.97] shadow-3xs flex items-center justify-center gap-0.5 whitespace-nowrap ${
                                                      cOut === btn.id ? btn.activeClass : btn.inactiveClass
                                                    }`}
                                                  >
                                                    {btn.label}
                                                  </button>
                                                ))}
                                              </div>
                                              {cOut && (
                                                <div className="flex items-center gap-1 text-[8.5px] font-black text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5 mt-0.5">
                                                  <Clock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                                                  <span>{uiLang === "kh" ? "ម៉ោងចេញ៖ " : uiLang === "zh" ? "签退时间：" : "Check-Out Time: "}{uiLang === "kh" ? toKhmerNumeral(getLoggedTime(student.id, 'check-out', getStudentStartAndEndTimes(student).end)) : getLoggedTime(student.id, 'check-out', getStudentStartAndEndTimes(student).end)}</span>
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                        {isExpanded && (
                                          <tr className="bg-slate-50/60">
                                            <td colSpan={4} className="px-8 py-4 border-t border-b border-slate-200/60">
                                              <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[11px] leading-relaxed font-sans text-slate-600 py-1"
                                              >
                                                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                                                  <p className="font-black text-slate-400 text-[9px] uppercase tracking-wider mb-2 flex items-center gap-1 border-b border-slate-100 pb-1">
                                                    <span>📚</span> {uiLang === "kh" ? "ព័ត៌មានលម្អិតសិក្សា (Academic)" : uiLang === "zh" ? "就学详情 (Academic)" : "Academic Details (Academic)"}
                                                  </p>
                                                  <p>• {uiLang === "kh" ? "វគ្គសិក្សា៖" : uiLang === "zh" ? "就读课程：" : "Course:"} <span className="font-extrabold text-slate-800">{student.course} ({student.level || "Level 1"})</span></p>
                                                  <p>• {uiLang === "kh" ? "វេនសិក្សា៖" : uiLang === "zh" ? "班次/时间段：" : "Shift:"} <span className="font-bold text-slate-700">{student.shift || (uiLang === "kh" ? "វេនទី ១" : uiLang === "zh" ? "第1班次" : "Shift 1")}</span></p>
                                                  <p>• {uiLang === "kh" ? "ថ្ងៃចាប់ផ្តើម៖" : uiLang === "zh" ? "开始日期：" : "Start Date:"} <span className="font-bold text-slate-700">{toKhmerNumeral(student.startDate || "០១-០៦-២០២៦")}</span></p>
                                                  <p>• {uiLang === "kh" ? "ថ្ងៃបញ្ចប់៖" : uiLang === "zh" ? "结束日期：" : "End Date:"} <span className="font-bold text-slate-700">{toKhmerNumeral(student.endDate || "០១-០៩-២០២៦")}</span></p>
                                                </div>
                                                
                                                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                                                  <p className="font-black text-slate-400 text-[9px] uppercase tracking-wider mb-2 flex items-center gap-1 border-b border-slate-100 pb-1">
                                                    <span>📞</span> {uiLang === "kh" ? "អាណាព្យាបាល (Guardian)" : uiLang === "zh" ? "监护人信息 (Guardian)" : "Guardian Info (Guardian)"}
                                                  </p>
                                                  <p>• {uiLang === "kh" ? "អាណាព្យាបាល៖" : uiLang === "zh" ? "监护人姓名：" : "Guardian:"} <span className="font-extrabold text-slate-800">{student.guardianName || (uiLang === "kh" ? "លី ប៊ុនធឿន" : uiLang === "zh" ? "李本天" : "Ly Buntheun")}</span></p>
                                                  <p>• {uiLang === "kh" ? "លេខទូរស័ព្ទ៖" : uiLang === "zh" ? "联系电话：" : "Phone Number:"} <span className="font-bold text-slate-700">{toKhmerNumeral(student.guardianPhone || "087 850 014 / 097 501 3648")}</span></p>
                                                  <p>• {uiLang === "kh" ? "ភ្ជាប់តេឡេក្រាម៖" : uiLang === "zh" ? "绑定电报：" : "Telegram Connected:"} <span className={`font-bold ${student.telegramConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {student.telegramConnected 
                                                      ? (uiLang === "kh" ? '✓ ភ្ជាប់រួចរាល់' : uiLang === "zh" ? '✓ 已绑定' : '✓ Connected') 
                                                      : (uiLang === "kh" ? '✕ មិនទាន់ភ្ជាប់' : uiLang === "zh" ? '✕ 未绑定' : '✕ Disconnected')
                                                    }
                                                  </span></p>
                                                </div>

                                                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                                                  <p className="font-black text-slate-400 text-[9px] uppercase tracking-wider mb-2 flex items-center gap-1 border-b border-slate-100 pb-1">
                                                    <span>💵</span> {uiLang === "kh" ? "ស្ថានភាពហិរញ្ញវត្ថុ (Finance)" : uiLang === "zh" ? "学费财务状况 (Finance)" : "Financial Status (Finance)"}
                                                  </p>
                                                  <p>• {uiLang === "kh" ? "តម្លៃសិក្សាសរុប៖" : uiLang === "zh" ? "学费总计：" : "Total Tuition Fee:"} <span className="font-extrabold text-slate-800">${toKhmerNumeral(student.fee || 120)}</span></p>
                                                  <p>• {uiLang === "kh" ? "បានបង់រួច៖" : uiLang === "zh" ? "已付金额：" : "Amount Paid:"} <span className="font-extrabold text-emerald-600">${toKhmerNumeral(student.paid || 0)}</span></p>
                                                  <p>• {uiLang === "kh" ? "នៅខ្វះ៖" : uiLang === "zh" ? "尚欠学费：" : "Balance Due:"} <span className={`font-extrabold ${student.due > 0 ? 'text-rose-600' : 'text-slate-700'}`}>${toKhmerNumeral(student.due || 0)}</span></p>
                                                </div>
                                              </motion.div>
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    );
                                  })
                                ) : (
                                  filteredTeachers.map((teacher) => {
                                    const cIn = checkInLogToday[teacher.id];
                                    const cOut = checkOutLogToday[teacher.id];
                                    const isExpanded = expandedAttendanceRow === teacher.id;
                                    return (
                                      <React.Fragment key={teacher.id}>
                                        <tr className={`hover:bg-slate-50/40 transition-colors block lg:table-row bg-white lg:bg-transparent rounded-2xl lg:rounded-none border border-slate-200 lg:border-none shadow-sm lg:shadow-none overflow-hidden ${isExpanded ? "bg-primary-50/15" : ""}`}>
                                          <td className="px-3 sm:px-4 py-2 select-none cursor-pointer"
                                            onClick={() => setExpandedAttendanceRow(isExpanded ? null : teacher.id)}
                                          >
                                            <div className="flex items-center gap-2">
                                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180 text-primary-600" : ""}`} />
                                              <div className="w-7.5 h-7.5 rounded-md flex items-center justify-center font-black text-[10.5px] shrink-0 bg-primary-100/60 text-primary-600">
                                                {(teacher.nameEn || teacher.nameKh || '').split(' ').filter(Boolean).map(n => n.charAt(0)).join('').substring(0, 2)}
                                              </div>
                                              <div>
                                                <h4 className="font-black text-slate-800 text-[13px] leading-tight truncate max-w-[170px] sm:max-w-[210px]">{teacher.nameKh}</h4>
                                                <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-bold uppercase mt-0.5 leading-tight whitespace-nowrap overflow-hidden">
                                                  <span className="truncate max-w-[100px] sm:max-w-[130px]">{teacher.nameEn}</span>
                                                  <span className="text-slate-300 shrink-0">|</span>
                                                  <span className="inline-block font-mono text-[8.5px] font-black text-slate-500 bg-slate-50 border border-slate-200/60 px-1 py-0.5 rounded leading-none shrink-0">
                                                    {teacher.teacherId || teacher.id}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-3 sm:px-4 py-2 select-none cursor-pointer"
                                            onClick={() => setExpandedAttendanceRow(isExpanded ? null : teacher.id)}
                                          >
                                            <div className="space-y-1">
                                              <div className="flex items-center gap-1 text-slate-700 text-[11.5px] font-black">
                                                <BookOpen className="w-3.5 h-3.5 text-primary-400" />
                                                <span className="truncate max-w-[180px] xl:max-w-[240px]">{teacher.specialty || (uiLang === "kh" ? "ជំនាញទូទៅ" : uiLang === "zh" ? "通用学科" : "General Specialist")}</span>
                                              </div>
                                              <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
                                                <span className="inline-block font-mono text-[8.5px] font-black text-amber-700 bg-amber-50/70 border border-amber-200/60 px-1 py-0.5 rounded leading-none shrink-0">
                                                  {uiLang === "kh" ? ((teacher.role === 'Staff' || teacher.role === 'STAFF') ? "បុគ្គលិក" : "គ្រូបង្រៀន") : uiLang === "zh" ? ((teacher.role === 'Staff' || teacher.role === 'STAFF') ? "员工" : "教师") : ((teacher.role === 'Staff' || teacher.role === 'STAFF') ? "Staff" : "Teacher")}
                                                </span>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{uiLang === "kh" ? `ភេទ៖ ${teacher.gender === 'Female' ? 'ស្រី' : 'ប្រុស'} • ទូរស័ព្ទ៖ ${teacher.phone || "-"}` : uiLang === "zh" ? `性别：${teacher.gender === 'Female' ? '女' : '男'} • 电话：${teacher.phone || "-"}` : `Gender: ${teacher.gender === 'Female' ? 'Female' : 'Male'} • Phone: ${teacher.phone || "-"}`}</p>
                                                <span className={`inline-flex px-1 py-0.5 text-[8.5px] font-black rounded border uppercase tracking-widest leading-none ${
                                                  teacher.status === 'ACTIVE' 
                                                    ? 'bg-teal-50 border-teal-100 text-teal-600' 
                                                    : teacher.status === 'LEAVE'
                                                      ? 'bg-amber-50 border-amber-100 text-amber-600'
                                                      : 'bg-rose-50 border-rose-100 text-rose-600'
                                                }`}>
                                                  {teacher.status === 'ACTIVE' 
                                                    ? (uiLang === "kh" ? "សកម្ម" : uiLang === "zh" ? "在职" : "ACTIVE") 
                                                    : teacher.status === 'LEAVE' 
                                                      ? (uiLang === "kh" ? "ច្បាប់" : uiLang === "zh" ? "休假" : "LEAVE") 
                                                      : (uiLang === "kh" ? "ឈប់" : uiLang === "zh" ? "离职" : "EXITED")}
                                                </span>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-2 sm:px-3 py-2 text-center">
                                            <div className="flex flex-col items-center justify-center gap-1.5 w-full">
    
                                              <div className="grid grid-cols-4 gap-1 w-full mx-auto">
                                                {[
                                                  { id: 'PRESENT', label: uiLang === "kh" ? '✓ វត្តមាន (P)' : uiLang === "zh" ? '✓ 出勤 (P)' : '✓ Present (P)', activeClass: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600/60 shadow-3xs shadow-emerald-500/10', inactiveClass: 'border-emerald-200/80 bg-emerald-50/20 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300' },
                                                  { id: 'ABSENT', label: uiLang === "kh" ? '✕ អវត្តមាន (A)' : uiLang === "zh" ? '✕ 缺勤 (A)' : '✕ Absent (A)', activeClass: 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600/60 shadow-3xs shadow-rose-500/10', inactiveClass: 'border-rose-200/80 bg-rose-50/20 text-rose-700 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300' },
                                                  { id: 'LATE', label: uiLang === "kh" ? '⏱ យឺត (L)' : uiLang === "zh" ? '⏱ 迟到 (L)' : '⏱ Late (L)', activeClass: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500/60 shadow-3xs shadow-amber-500/10', inactiveClass: 'border-amber-200/80 bg-amber-50/20 text-amber-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300' }, // wait, in line 10686, original is: inactiveClass: 'border-amber-200/80 bg-amber-50/20 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300' -> Wait, let me look at line 10686 in previous view_file: 'border-amber-200/80 bg-amber-50/20 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300'
                                                  { id: 'PERMISSION', label: uiLang === "kh" ? '📝 ច្បាប់ (E)' : uiLang === "zh" ? '📝 请假 (E)' : '📝 Excused (E)', activeClass: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600/60 shadow-3xs shadow-blue-500/10', inactiveClass: 'border-blue-200/80 bg-blue-50/20 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300' }
                                                ].map(btn => (
                                                  <button
                                                    key={btn.id}
                                                    onClick={() => {
                                                      if (btn.id === 'ABSENT' || btn.id === 'PERMISSION' || btn.id === 'LATE') {
                                                        setAbsenceModalData({
                                                          type: 'check-in',
                                                          id: teacher.id,
                                                          nameKh: teacher.nameKh,
                                                          nameEn: teacher.nameEn,
                                                          courseOrSpecialty: teacher.specialty || 'General Specialist',
                                                          itemType: 'teacher',
                                                          status: btn.id,
                                                          currentNote: attendanceNotes[attendanceDate]?.[teacher.id]?.['check-in'] || 
                                                            (btn.id === 'ABSENT' 
                                                              ? (uiLang === "kh" ? "គ្មានច្បាប់" : uiLang === "zh" ? "未请假" : "Unexcused") 
                                                              : btn.id === 'PERMISSION' 
                                                                ? (uiLang === "kh" ? "មានច្បាប់" : uiLang === "zh" ? "已请假" : "Excused") 
                                                                : (uiLang === "kh" ? "យឺត" : uiLang === "zh" ? "迟到" : "Late"))
                                                        });
                                                      } else if (cIn === btn.id) {
                                                        setAttendanceCheckInLog(prev => {
                                                          const dLog = { ...(prev[attendanceDate] || {}) };
                                                          delete dLog[teacher.id];
                                                          return { ...prev, [attendanceDate]: dLog };
                                                        });
                                                        autoSaveItemAttendance(
                                                          teacher.id,
                                                          'teacher',
                                                          null,
                                                          attendanceCheckOutLog[attendanceDate]?.[teacher.id] || null
                                                        );
                                                      } else {
                                                        logItemAttendance('check-in', teacher.id, btn.id as any, teacher.nameKh, teacher.specialty || 'General Specialist', 'teacher', teacher.nameEn);
                                                      }
                                                    }}
                                                    title={btn.label}
                                                    className={`w-full h-8 text-center px-1 text-[8.5px] sm:text-[9px] xl:text-[9.5px] font-black rounded-lg border transition-all duration-200 cursor-pointer active:scale-[0.97] shadow-3xs flex items-center justify-center gap-0.5 whitespace-nowrap ${
                                                      cIn === btn.id ? btn.activeClass : btn.inactiveClass
                                                    }`}
                                                  >
                                                    {btn.label}
                                                  </button>
                                                ))}
                                              </div>
                                              {cIn && (
                                                <div className="flex items-center gap-1 text-[8.5px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 mt-0.5">
                                                  <Clock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                                  <span>{uiLang === "kh" ? "ម៉ោងចូល៖ " : uiLang === "zh" ? "签到时间：" : "Check-In Time: "}{uiLang === "kh" ? toKhmerNumeral(getLoggedTime(teacher.id, 'check-in', '12:36 PM')) : getLoggedTime(teacher.id, 'check-in', '12:36 PM')}</span>
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-2 sm:px-3 py-2 text-center">
                                            <div className="flex flex-col items-center justify-center gap-1.5 w-full">
      
      <div className="grid grid-cols-4 gap-1 w-full mx-auto">
                                                {[
                                                  { id: 'PRESENT', label: uiLang === "kh" ? '✓ ម៉ោងចេញ (P)' : uiLang === "zh" ? '✓ 签退 (P)' : '✓ Check-Out (P)', activeClass: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600/60 shadow-3xs shadow-emerald-500/10', inactiveClass: 'border-emerald-200/80 bg-emerald-50/20 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300' },
                                                  { id: 'ABSENT', label: uiLang === "kh" ? '✕ អវត្តមាន (A)' : uiLang === "zh" ? '✕ 未签退 (A)' : '✕ Absent (A)', activeClass: 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600/60 shadow-3xs shadow-rose-500/10', inactiveClass: 'border-rose-200/80 bg-rose-50/20 text-rose-700 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300' },
                                                  { id: 'LATE', label: uiLang === "kh" ? '⏱ ចេញមុន (L)' : uiLang === "zh" ? '⏱ 早退 (L)' : '⏱ Early Out (L)', activeClass: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500/60 shadow-3xs shadow-amber-500/10', inactiveClass: 'border-amber-200/80 bg-amber-50/20 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300' },
                                                  { id: 'PERMISSION', label: uiLang === "kh" ? '📝 ច្បាប់ (E)' : uiLang === "zh" ? '📝 请假 (E)' : '📝 Excused (E)', activeClass: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600/60 shadow-3xs shadow-blue-500/10', inactiveClass: 'border-blue-200/80 bg-blue-50/20 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300' }
                                                ].map(btn => (
                                                  <button
                                                    key={btn.id}
                                                    onClick={() => {
                                                      if (btn.id === 'ABSENT' || btn.id === 'PERMISSION' || btn.id === 'LATE') {
                                                        setAbsenceModalData({
                                                          type: 'check-out',
                                                          id: teacher.id,
                                                          nameKh: teacher.nameKh,
                                                          nameEn: teacher.nameEn,
                                                          courseOrSpecialty: teacher.specialty || 'General Specialist',
                                                          itemType: 'teacher',
                                                          status: btn.id,
                                                          currentNote: attendanceNotes[attendanceDate]?.[teacher.id]?.['check-out'] || 
                                                            (btn.id === 'ABSENT' 
                                                              ? (uiLang === "kh" ? "គ្មានច្បាប់" : uiLang === "zh" ? "未请假" : "Unexcused") 
                                                              : btn.id === 'PERMISSION' 
                                                                ? (uiLang === "kh" ? "មានច្បាប់" : uiLang === "zh" ? "已请假" : "Excused") 
                                                                : (uiLang === "kh" ? "ចេញមុន" : uiLang === "zh" ? "早退" : "Early Out"))
                                                        });
                                                      } else if (cOut === btn.id) {
                                                        setAttendanceCheckOutLog(prev => {
                                                          const dLog = { ...(prev[attendanceDate] || {}) };
                                                          delete dLog[teacher.id];
                                                          return { ...prev, [attendanceDate]: dLog };
                                                        });
                                                        autoSaveItemAttendance(
                                                          teacher.id,
                                                          'teacher',
                                                          attendanceCheckInLog[attendanceDate]?.[teacher.id] || null,
                                                          null
                                                        );
                                                      } else {
                                                        logItemAttendance('check-out', teacher.id, btn.id as any, teacher.nameKh, teacher.specialty || 'General Specialist', 'teacher', teacher.nameEn);
                                                      }
                                                    }}
                                                    title={btn.label}
                                                    className={`w-full h-8 text-center px-1 text-[8.5px] sm:text-[9px] xl:text-[9.5px] font-black rounded-lg border transition-all duration-200 cursor-pointer active:scale-[0.97] shadow-3xs flex items-center justify-center gap-0.5 whitespace-nowrap ${
                                                      cOut === btn.id ? btn.activeClass : btn.inactiveClass
                                                    }`}
                                                  >
                                                    {btn.label}
                                                  </button>
                                                ))}
                                              </div>
                                              {cOut && (
                                                <div className="flex items-center gap-1 text-[8.5px] font-black text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5 mt-0.5">
                                                  <Clock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                                                  <span>{uiLang === "kh" ? "ម៉ោងចេញ៖ " : uiLang === "zh" ? "签退时间：" : "Check-Out Time: "}{uiLang === "kh" ? toKhmerNumeral(getLoggedTime(teacher.id, 'check-out', '12:37 PM')) : getLoggedTime(teacher.id, 'check-out', '12:37 PM')}</span>
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                        {isExpanded && (
                                          <tr className="bg-slate-50/60">
                                            <td colSpan={4} className="px-8 py-4 border-t border-b border-slate-200/60">
                                              <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[11px] leading-relaxed font-sans text-slate-600 py-1"
                                              >
                                                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                                                  <p className="font-black text-slate-400 text-[9px] uppercase tracking-wider mb-2 flex items-center gap-1 border-b border-slate-100 pb-1">
                                                    <span>👤</span> {uiLang === "kh" ? "ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info)" : uiLang === "zh" ? "个人基本信息 (Personal Info)" : "Personal Info (Personal Info)"}
                                                  </p>
                                                  <p>• {uiLang === "kh" ? "ភេទ៖" : uiLang === "zh" ? "性别：" : "Gender:"} <span className="font-bold text-slate-700">{teacher.gender === 'Female' ? (uiLang === "kh" ? "ស្រី (Female)" : uiLang === "zh" ? "女 (Female)" : "Female") : (uiLang === "kh" ? "ប្រុស (Male)" : uiLang === "zh" ? "男 (Male)" : "Male")}</span></p>
                                                  <p>• {uiLang === "kh" ? "ថ្ងៃខែឆ្នាំកំណើត៖" : uiLang === "zh" ? "出生日期：" : "Date of Birth:"} <span className="font-bold text-slate-700">{toKhmerNumeral(teacher.dob || "១២-០៨-១៩៩៥")}</span></p>
                                                  <p>• {uiLang === "kh" ? "ស្រុកកំណើត៖" : uiLang === "zh" ? "出生地点：" : "Place of Birth:"} <span className="font-bold text-slate-700">{teacher.pob || (uiLang === "kh" ? "ភ្នំពេញ" : uiLang === "zh" ? "金边" : "Phnom Penh")}</span></p>
                                                </div>
                                                
                                                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                                                  <p className="font-black text-slate-400 text-[9px] uppercase tracking-wider mb-2 flex items-center gap-1 border-b border-slate-100 pb-1">
                                                    <span>💼</span> {uiLang === "kh" ? "ព័ត៌មានបម្រើការងារ (Employment)" : uiLang === "zh" ? "入职与服务信息 (Employment)" : "Employment Info (Employment)"}
                                                  </p>
                                                  <p>• {uiLang === "kh" ? "ថ្ងៃចូលការងារ៖" : uiLang === "zh" ? "入职日期：" : "Join Date:"} <span className="font-bold text-slate-700">{toKhmerNumeral(teacher.joinDate || "០១-០១-២០២៥")}</span></p>
                                                  <p>• {uiLang === "kh" ? "ស្ថានភាព៖" : uiLang === "zh" ? "服务状态：" : "Employment Status:"} <span className={`font-extrabold ${
                                                    teacher.status === 'ACTIVE' ? 'text-emerald-600' :
                                                    teacher.status === 'LEAVE' ? 'text-blue-600' : 'text-rose-600'
                                                  }`}>
                                                    {teacher.status === 'ACTIVE' 
                                                      ? (uiLang === "kh" ? '✓ កំពុងបង្រៀន (Active)' : uiLang === "zh" ? '✓ 正在任教 (Active)' : '✓ Active Teaching (Active)') :
                                                     teacher.status === 'LEAVE' 
                                                      ? (uiLang === "kh" ? 'ច្បាប់ (On Leave)' : uiLang === "zh" ? '休假 (On Leave)' : 'On Leave') 
                                                      : (uiLang === "kh" ? 'ឈប់ធ្វើការ (Exited)' : uiLang === "zh" ? '离职 (Exited)' : 'Exited')}
                                                  </span></p>
                                                  <p>• {uiLang === "kh" ? "ទូរស័ព្ទ៖" : uiLang === "zh" ? "联系电话：" : "Phone Number:"} <span className="font-bold text-slate-700">{toKhmerNumeral(teacher.phone || "098 765 432")}</span></p>
                                                </div>

                                                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                                                  <p className="font-black text-slate-400 text-[9px] uppercase tracking-wider mb-2 flex items-center gap-1 border-b border-slate-100 pb-1">
                                                    <span>💵</span> {uiLang === "kh" ? "ប្រាក់ខែ និងហិរញ្ញវត្ថុ (Salary)" : uiLang === "zh" ? "薪资与财务状况 (Salary)" : "Salary & Financial (Salary)"}
                                                  </p>
                                                  <p>• {uiLang === "kh" ? "ប្រាក់ខែគោល៖" : uiLang === "zh" ? "基本薪资：" : "Basic Salary:"} <span className="font-extrabold text-slate-800">${toKhmerNumeral(teacher.salary || 450)}</span></p>
                                                  <p>• {uiLang === "kh" ? "ស្ថានភាពបើកប្រាក់ខែ៖" : uiLang === "zh" ? "发放状态：" : "Payout Status:"} <span className="font-extrabold text-emerald-600">{teacher.paymentStatus === "បើករួចរាល់" ? (uiLang === "kh" ? "បើករួចរាល់" : uiLang === "zh" ? "已发放" : "Paid") : (uiLang === "kh" ? "មិនទាន់បើក" : uiLang === "zh" ? "未发放" : "Unpaid")}</span></p>
                                                </div>
                                              </motion.div>
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    );
                                  })
                                )}

                                {((isStudentMode && filteredStudents.length === 0) || (!isStudentMode && filteredTeachers.length === 0)) && (
                                  <tr>
                                    <td colSpan={4} className="p-16 text-center text-slate-400 font-bold font-sans">
                                      <div className="flex flex-col items-center gap-2">
                                        <AlertTriangle className="w-8 h-8 text-slate-350" />
                                        <span>{uiLang === "kh" ? "មិនមានទិន្នន័យស្របគ្នានឹងលក្ខខណ្ឌស្វែងរកទេ" : uiLang === "zh" ? "没有找到符合搜索条件的记录" : "No records match your search criteria"}</span>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>


                        </div>

                        {/* Right Side: Telegram Notification Mockup Phone */}
                        {showTelegramMockup && (
                          <div className="w-full xl:w-[310px] shrink-0 space-y-4">
                          <div className="relative mx-auto w-full max-w-[305px] h-[610px] bg-[#0c0f17] text-slate-800 rounded-[38px] p-[5px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] border-2 border-slate-700/50 ring-4 ring-slate-900/95 flex flex-col overflow-hidden font-sans">
                            {/* Metallic glare effect on the bezel */}
                            <div className="absolute inset-0 rounded-[33px] border border-white/5 pointer-events-none z-40"></div>

                            {/* Samsung Infinity-O Camera Punch-hole Cutout */}
                            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black rounded-full z-40 shadow-inner ring-1 ring-white/10"></div>

                            {/* Samsung Galaxy S27 Ultra Status Bar */}
                            <div className="h-7 px-5 bg-[#1e88e5] text-white flex items-center justify-between font-black tracking-tight select-none shrink-0 z-30 pt-1.5 text-[8.5px]">
                              <span>11:22 AM</span>
                              <div className="flex items-center gap-1.5">
                                <span>5G</span>
                                <div className="flex gap-[0.5px] items-end h-1.5">
                                  <span className="w-[1px] h-0.5 bg-white rounded-full"></span>
                                  <span className="w-[1px] h-1 bg-white rounded-full"></span>
                                  <span className="w-[1px] h-1.5 bg-white rounded-full"></span>
                                </div>
                                <div className="flex items-center gap-[0.5px]">
                                  <span className="text-[7.5px] font-black">98%</span>
                                  <div className="w-3 h-1.5 border border-white/80 rounded-[2px] p-[0.5px] flex items-center">
                                    <div className="w-full h-full bg-emerald-400 rounded-[0.5px]"></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Telegram App Header */}
                            <div className="bg-[#1e88e5] text-white px-3 py-1.5 flex items-center justify-between shadow-sm shrink-0 z-20">
                              <div className="flex items-center gap-2">
                                <span 
                                  onClick={() => setShowTelegramMockup(false)}
                                  className="text-white/80 text-xs font-bold cursor-pointer hover:text-white"
                                  title={uiLang === "kh" ? "លាក់ផ្ទាំង (Hide)" : "Hide"}
                                >
                                  ←
                                </span>
                                <div className="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center font-black text-[10px] text-white shadow-xs border border-white/10">
                                  PA
                                </div>
                                <div className="leading-none">
                                  <h4 className="text-[11px] font-extrabold flex items-center gap-1">
                                    PLC Academy Bot
                                    <span className="text-[9px] text-sky-200">✓</span>
                                  </h4>
                                  <span className="text-[8.5px] text-sky-100 font-bold">bot</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-white/80">
                                <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                                <span className="text-xs font-bold hover:text-white cursor-pointer">⋮</span>
                                <button
                                  type="button"
                                  onClick={() => setShowTelegramMockup(false)}
                                  className="p-1 hover:bg-white/10 rounded text-white/85 hover:text-white cursor-pointer transition-colors flex items-center justify-center"
                                  title={uiLang === "kh" ? "លាក់ផ្ទាំង (Hide)" : "Hide"}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Telegram Chat Area */}
                            <div id="telegram-chat-scroll-container" className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#eef2f5] flex flex-col dropdown-scrollbar relative scroll-smooth">
                              {/* Grid Wallpaper Pattern */}
                              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#2c3e50_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none"></div>
                              
                              {/* Telegram Date bubble */}
                              <div className="self-center bg-slate-200/70 backdrop-blur-xs text-[8.5px] font-black text-slate-500 px-3 py-1 rounded-full border border-slate-300/40 select-none z-10">
                                {attendanceDate}
                              </div>

                              {telegramLogs.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3 z-10">
                                  <div className="w-12 h-12 rounded-full bg-slate-200/85 border border-slate-300/40 flex items-center justify-center text-slate-400 shadow-2xs">
                                    <Bell className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h5 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">ស្ងាត់ល្អណាស់ (Silent No Logs)</h5>
                                    <p className="text-[9.5px] text-slate-500 mt-1 leading-relaxed font-sans">
                                      ប្រព័ន្ធកុំព្យូទ័រទិន្នន័យ Tele-Sync កំពុងរង់ចាំការស្កេនភា្លមៗរបស់សិស្ស-គ្រូ និងសេចក្តីជូនដំណឹងជាបន្តបន្ទាប់។
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3 flex flex-col z-10">
                                  {telegramLogs.map((log, idx) => {
                                    const isCheckIn = log.type === 'check-in';
                                    return (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        className="self-start w-full max-w-[95%] bg-white border border-slate-100 p-3.5 rounded-2xl rounded-tl-sm shadow-[0_1.5px_3px_rgba(15,23,42,0.05)] text-slate-800 select-all relative text-[11px] leading-relaxed"
                                      >
                                        {/* Telegram Notification Card Layout */}
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-1.5 text-xs font-black text-sky-600">
                                            <span>📢</span>
                                            <span>
                                              {uiLang === "kh" 
                                                ? (log.itemType === 'teacher' ? "របាយការណ៍វត្តមានគ្រូបង្រៀន" : "របាយការណ៍វត្តមានសិស្ស")
                                                : uiLang === "zh"
                                                  ? (log.itemType === 'teacher' ? "教师考勤报告" : "学生考勤报告")
                                                  : (log.itemType === 'teacher' ? "Teacher Attendance Report" : "Student Attendance Report")
                                              }
                                            </span>
                                          </div>

                                          <div className="space-y-1 text-slate-650 text-[9.5px] leading-relaxed font-semibold">
                                            {uiLang === "kh" ? (
                                              log.itemType === 'teacher' ? (
                                                <p>សូមគោរពជម្រាបសួរ លោកគ្រូ/អ្នកគ្រូ៖</p>
                                              ) : (
                                                <p>សូមគោរពជម្រាបសួរ លោក/លោកស្រី អាណាព្យាបាលសិស្សឈ្មោះ៖</p>
                                              )
                                            ) : uiLang === "zh" ? (
                                              log.itemType === 'teacher' ? (
                                                <p>尊敬的老师，您好：</p>
                                              ) : (
                                                <p>尊敬的家长，您好！您的孩子：</p>
                                              )
                                            ) : (
                                              log.itemType === 'teacher' ? (
                                                <p>Dear Teacher:</p>
                                              ) : (
                                                <p>Dear Parent/Guardian of Student:</p>
                                              )
                                            )}
                                            <p className="text-slate-900 text-xs font-black tracking-wide pl-2 border-l-2 border-sky-500 py-0.5 my-1 bg-slate-50 rounded-r-lg">
                                              {log.name}
                                            </p>
                                            <p>
                                              {uiLang === "kh" ? (
                                                <>សាលា <span className="text-sky-600 font-extrabold">PLC ACADEMY</span> សូមរាយការណ៍វត្តមាន៖</>
                                              ) : uiLang === "zh" ? (
                                                <>学校 <span className="text-sky-600 font-extrabold">PLC ACADEMY</span> 谨向您发送考勤通知：</>
                                              ) : (
                                                <><span className="text-sky-600 font-extrabold">PLC ACADEMY</span> is pleased to report the attendance:</>
                                              )}
                                            </p>
                                          </div>

                                          {/* Info block */}
                                          <div className="bg-slate-50/75 rounded-xl p-2 space-y-1 text-[8.5px] border border-slate-100 text-slate-500 font-semibold">
                                            <p>• {uiLang === "kh" ? "កាលបរិច្ឆេទ៖" : uiLang === "zh" ? "日期：" : "Date:"} <span className="text-slate-700 font-bold">{toKhmerNumeral(attendanceDate)}</span></p>
                                            <p>• {log.itemType === 'teacher' 
                                              ? (uiLang === "kh" ? "ឯកទេស/មុខវិជ្ជា៖" : uiLang === "zh" ? "教学专业/科目：" : "Specialty/Subject:") 
                                              : (uiLang === "kh" ? "វគ្គសិក្សា៖" : uiLang === "zh" ? "就读课程：" : "Course:")
                                            } <span className="text-slate-700 font-bold">{log.course}</span></p>
                                            <p>• {log.itemType === 'teacher' 
                                              ? (uiLang === "kh" ? "លេខកូដគ្រូ៖" : uiLang === "zh" ? "教师编号：" : "Teacher ID:") 
                                              : (uiLang === "kh" ? "លេខកូដសិស្ស៖" : uiLang === "zh" ? "学生学号：" : "Student ID:")
                                            } <span className={`text-slate-700 font-bold ${uiLang === 'kh' ? 'font-sans text-[9px]' : 'font-mono'}`}>{toKhmerNumeral(getDisplayId(log))}</span></p>
                                          </div>

                                          {/* Status Block */}
                                          {(() => {
                                            let bgClass = "bg-emerald-50 border-emerald-100 text-emerald-600";
                                            let badgeBg = "bg-emerald-500 text-white";
                                            
                                            let statusText = "";
                                            let clockLabel = "";

                                            if (isCheckIn) {
                                              statusText = uiLang === "kh" ? "✓ មកដល់សាលា" : uiLang === "zh" ? "✓ 已到校" : "✓ Arrived";
                                              clockLabel = uiLang === "kh" ? "📥 ម៉ោងចូល៖" : uiLang === "zh" ? "📥 签到时间：" : "📥 Check-In Time:";
                                            } else {
                                              statusText = log.itemType === 'teacher'
                                                ? (uiLang === "kh" ? "✓ ចេញពីសាលា" : uiLang === "zh" ? "✓ 已离开学校" : "✓ Left School")
                                                : (uiLang === "kh" ? "✓ ចេញពីរៀន" : uiLang === "zh" ? "✓ 已放学离校" : "✓ Dismissed");
                                              clockLabel = uiLang === "kh" ? "📤 ម៉ោងចេញ៖" : uiLang === "zh" ? "📤 签退时间：" : "📤 Check-Out Time:";
                                            }
                                            
                                            if (log.status === 'ABSENT' || log.statusKh === 'អវត្តមាន') {
                                              bgClass = "bg-rose-50 border-rose-100 text-rose-600";
                                              badgeBg = "bg-rose-600 text-white";
                                              statusText = log.note 
                                                ? (uiLang === "kh" ? `✕ អវត្តមាន (${log.note})` : uiLang === "zh" ? `✕ 缺勤 (${log.note})` : `✕ Absent (${log.note})`)
                                                : (uiLang === "kh" ? "✕ អវត្តមាន" : uiLang === "zh" ? "✕ 缺勤" : "✕ Absent");
                                              clockLabel = uiLang === "kh" ? "❌ ស្ថានភាព៖" : uiLang === "zh" ? "❌ 状态：" : "❌ Status:";
                                            } else if (log.status === 'LATE' || log.statusKh === 'មកយឺត') {
                                              bgClass = "bg-amber-50 border-amber-100 text-amber-650";
                                              badgeBg = "bg-amber-500 text-white";
                                              statusText = log.type === 'check-in' 
                                                ? (uiLang === "kh" ? "⏰ មកយឺត" : uiLang === "zh" ? "⏰ 迟到" : "⏰ Late") 
                                                : (uiLang === "kh" ? "⏰ ចេញមុន" : uiLang === "zh" ? "⏰ 早退" : "⏰ Early Leave");
                                              clockLabel = uiLang === "kh" ? "⏱ ម៉ោងកំណត់៖" : uiLang === "zh" ? "⏱ 规定时间：" : "⏱ Scheduled:";
                                            } else if (log.status === 'PERMISSION') {
                                              bgClass = "bg-[#ebf5ff] border-blue-100 text-blue-600";
                                              badgeBg = "bg-blue-600 text-white";
                                              statusText = log.note 
                                                ? (uiLang === "kh" ? `📝 ច្បាប់ (${log.note})` : uiLang === "zh" ? `📝 请假 (${log.note})` : `📝 Excused (${log.note})`)
                                                : (uiLang === "kh" ? "📝 ច្បាប់ (E)" : uiLang === "zh" ? "📝 请假 (E)" : "📝 Excused (E)");
                                              clockLabel = uiLang === "kh" ? "📝 ស្ថានភាព៖" : uiLang === "zh" ? "📝 状态：" : "📝 Status:";
                                            }

                                            return (
                                              <div className={`rounded-xl p-2.5 border flex items-center justify-between gap-2 shadow-2xs ${bgClass}`}>
                                                <div className="font-extrabold text-[9px] flex items-center gap-1">
                                                  <span>{clockLabel}</span>
                                                  <span className={`${uiLang === 'kh' ? 'font-sans text-[10px]' : 'font-mono text-[9.5px]'}`}>{toKhmerNumeral(log.time.substring(0, 5) + " " + log.time.substring(8))}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wide shrink-0 ${badgeBg}`}>
                                                  {statusText}
                                                </span>
                                              </div>
                                            );
                                          })()}
                                        </div>

                                        {/* Timestamp of Telegram Message */}
                                        <div className="flex items-center justify-end gap-1 mt-2 text-[8px] text-slate-400 select-none">
                                          <span>{log.time.substring(0, 5)} {log.time.substring(8)}</span>
                                          <span className="text-sky-500 font-extrabold">✓✓</span>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Telegram Footer Area */}
                            <div className="p-2 bg-white border-t border-slate-100 shrink-0 z-20 text-center">
                              <button
                                onClick={() => setIsMuted(prev => !prev)}
                                className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-250 flex items-center justify-center gap-1.5 cursor-pointer border ${
                                  isMuted
                                    ? "bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100"
                                    : "bg-sky-50 border-sky-150 text-sky-600 hover:bg-sky-100/50"
                                }`}
                              >
                                {isMuted ? (
                                  <>
                                    <BellOff className="w-3.5 h-3.5 text-amber-500" />
                                    <span>{uiLang === "kh" ? "បើកសំឡេងជូនដំណឹង (UNMUTE)" : uiLang === "zh" ? "取消静音广播 (UNMUTE)" : "UNMUTE BROADCASTER"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Bell className="w-3.5 h-3.5 text-sky-500" />
                                    <span>{uiLang === "kh" ? "បិទសំឡេងជូនដំណឹង (MUTE)" : uiLang === "zh" ? "静音广播 (MUTE)" : "MUTE BROADCASTER"}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* S27 Gesture Navigation pill */}
                            <div className="py-1.5 bg-white shrink-0 flex items-center justify-center border-t border-slate-200">
                              <div className="w-16 h-1 bg-slate-300 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                  ) : (
                    /* Reports Dashboard Sub-tab Rendering */
                    <div className="space-y-4">
                      {/* Metric Dashboard row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {/* 1. Total Registered Card */}
                        <div className="bg-white rounded-[24px] border border-slate-100 border-t-[4px] border-t-primary-500 py-4 px-4 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-all duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10.5px] font-black text-slate-500 uppercase tracking-wide leading-tight">
                              {uiLang === "kh" 
                                ? (isStudentMode ? "ចំនួនសិស្សសរុប" : "ចំនួនគ្រូសរុប")
                                : uiLang === "zh"
                                  ? (isStudentMode ? "学生总数" : "教师总数")
                                  : (isStudentMode ? "Total Students" : "Total Teachers")
                              }
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              {isStudentMode ? "(Total Registered)" : "(Total Teachers)"}
                            </span>
                            <h3 className="text-2xl font-black text-slate-800 mt-1 font-sans tracking-tight flex items-baseline gap-1">
                              {toKhmerNumeral(totalActiveCount)} <span className="text-[10px] font-bold text-slate-450">
                                {uiLang === "kh" ? "នាក់" : uiLang === "zh" ? "人" : "Pax"}
                              </span>
                            </h3>
                          </div>
                        </div>

                        {/* 2. Actual Present Card */}
                        <div className="bg-white rounded-[24px] border border-slate-100 border-t-[4px] border-t-emerald-500 py-4 px-4 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-all duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10.5px] font-black text-slate-500 uppercase tracking-wide leading-tight">
                              {uiLang === "kh" ? "វត្តមានជាក់ស្តែង" : uiLang === "zh" ? "实际出席" : "Actual Present"}
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              (Actual Present)
                            </span>
                            <h3 className="text-2xl font-black text-slate-800 mt-1 font-sans tracking-tight flex items-baseline gap-1">
                              {toKhmerNumeral(aggregatedPeriodStats.PRESENT)} <span className="text-[10px] font-bold text-slate-450">{aggregatedPeriodStats.unitWord}</span>
                            </h3>
                          </div>
                        </div>

                        {/* 3. Late Today Card */}
                        <div className="bg-white rounded-[24px] border border-slate-100 border-t-[4px] border-t-amber-400 py-4 px-4 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-all duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10.5px] font-black text-slate-500 uppercase tracking-wide leading-tight">
                              {aggregatedPeriodStats.lateTitleKh}
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              {aggregatedPeriodStats.lateTitleEn}
                            </span>
                            <h3 className="text-2xl font-black text-slate-800 mt-1 font-sans tracking-tight flex items-baseline gap-1">
                              {toKhmerNumeral(aggregatedPeriodStats.LATE)} <span className="text-[10px] font-bold text-slate-450">{aggregatedPeriodStats.unitWord}</span>
                            </h3>
                          </div>
                        </div>

                        {/* 4. Excused Today Card */}
                        <div className="bg-white rounded-[24px] border border-slate-100 border-t-[4px] border-t-sky-500 py-4 px-4 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-all duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                            <File className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10.5px] font-black text-slate-500 uppercase tracking-wide leading-tight">
                              {aggregatedPeriodStats.excuseTitleKh}
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              {aggregatedPeriodStats.excuseTitleEn}
                            </span>
                            <h3 className="text-2xl font-black text-slate-800 mt-1 font-sans tracking-tight flex items-baseline gap-1">
                              {toKhmerNumeral(aggregatedPeriodStats.PERMISSION)} <span className="text-[10px] font-bold text-slate-450">{aggregatedPeriodStats.unitWord}</span>
                            </h3>
                          </div>
                        </div>

                        {/* 5. Absent Today Card */}
                        <div className="bg-white rounded-[24px] border border-slate-100 border-t-[4px] border-t-rose-500 py-4 px-4 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-all duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                            <X className="w-5 h-5 stroke-[3]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10.5px] font-black text-slate-500 uppercase tracking-wide leading-tight">
                              {aggregatedPeriodStats.absentTitleKh}
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              {aggregatedPeriodStats.absentTitleEn}
                            </span>
                            <h3 className="text-2xl font-black text-slate-800 mt-1 font-sans tracking-tight flex items-baseline gap-1">
                              {toKhmerNumeral(aggregatedPeriodStats.ABSENT)} <span className="text-[10px] font-bold text-slate-450">{aggregatedPeriodStats.unitWord}</span>
                            </h3>
                          </div>
                        </div>

                        {/* 6. Avg Attendance Card */}
                        <div className="bg-white rounded-[24px] border border-slate-100 border-t-[4px] border-t-teal-500 py-4 px-4 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-all duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shrink-0">
                            <span className="text-lg font-black font-sans">%</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10.5px] font-black text-slate-500 uppercase tracking-wide leading-tight">
                              {uiLang === "kh" ? "អត្រាវត្តមានមធ្យម" : uiLang === "zh" ? "平均出勤率" : "Avg Attendance"}
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              (Avg Attendance)
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <h3 className="text-2xl font-black text-slate-800 font-sans tracking-tight">
                                {toKhmerNumeral(aggregatedPeriodStats.avgRate)}%
                              </h3>
                              {/* Horizontal progress bar */}
                              <div className="w-12 h-3 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200/50">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full" 
                                  style={{ width: `${aggregatedPeriodStats.avgRate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Filter Bar Row exactly like the screenshot */}
                      <div className="bg-white rounded-xl border border-slate-100 p-1.5 shadow-3xs flex flex-wrap lg:flex-nowrap items-center justify-between gap-1.5 overflow-x-auto w-full">
                        {/* Left Side: Periods, Date, Target Group */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Period Selector Toggle */}
                          <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/40 shrink-0">
                            {[
                              { id: 'day', label: idt("គិតជាថ្ងៃ", "Day", "按日") },
                              { id: 'month', label: idt("គិតជាខែ", "Month", "按月") },
                              { id: 'year', label: idt("គិតជាឆ្នាំ", "Year", "按年") }
                            ].map(btn => (
                              <button
                                key={btn.id}
                                onClick={() => setReportPeriod(btn.id as any)}
                                className={`px-2 py-1 rounded-md text-[10px] font-black tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                                  reportPeriod === btn.id
                                    ? "bg-white text-primary-600 shadow-3xs border border-slate-200/40"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>

                           {/* Beautiful Interactive Date Selection Control with Navigation */}
                          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200/80 shadow-3xs shrink-0 select-none">
                            {/* Center Selector Box */}
                            <div 
                              className="relative flex items-center gap-1 bg-white border border-slate-200/60 hover:border-primary-400 rounded-md px-2 py-1 text-[10px] font-black transition-all cursor-pointer shadow-3xs select-none min-w-[90px] justify-center"
                            >
                              <Calendar className="w-3 h-3 text-primary-600 shrink-0 pointer-events-none" />
                              <span className="font-sans text-primary-900 font-extrabold tracking-wide pointer-events-none">
                                {(() => {
                                  if (!attendanceDate) return "";
                                  const [y, m, d] = attendanceDate.split('-');
                                  if (reportPeriod === 'day') {
                                    return `${d}/${m}/${y}`;
                                  } else if (reportPeriod === 'month') {
                                    return `${idt("ខែ", "Month", "月份")} ${m}/${y}`;
                                  } else {
                                    return `${idt("ឆ្នាំ", "Year", "年份")} ${y}`;
                                  }
                                })()}
                              </span>
                              
                              {/* Overlay Native Selectors */}
                              {reportPeriod === 'day' && (
                                <input 
                                  type="date" 
                                  value={attendanceDate}
                                  onChange={(e) => setAttendanceDate(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 pointer-events-auto"
                                  style={{ minHeight: "unset", appearance: "auto", WebkitAppearance: "auto" }}
                                />
                              )}

                              {reportPeriod === 'month' && (
                                <input 
                                  type="month" 
                                  value={(() => {
                                    const [y, m] = attendanceDate.split('-');
                                    return `${y}-${m}`;
                                  })()}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const [selYear, selMonth] = e.target.value.split('-');
                                      setAttendanceDate(`${selYear}-${selMonth}-01`);
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 pointer-events-auto"
                                  style={{ minHeight: "unset", appearance: "auto", WebkitAppearance: "auto" }}
                                  id="report-month-select"
                                />
                              )}

                              {reportPeriod === 'year' && (
                                <select 
                                  value={attendanceDate.split('-')[0]}
                                  onChange={(e) => {
                                    setAttendanceDate(`${e.target.value}-01-01`);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-sans z-10 pointer-events-auto"
                                  style={{ minHeight: "unset", appearance: "auto", WebkitAppearance: "auto" }}
                                  id="report-year-select"
                                >
                                  {Array.from({ length: 11 }, (_, i) => 2020 + i).map(yr => (
                                    <option key={yr} value={yr}>{idt("ឆ្នាំ", "Year", "年份")} {yr}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>

                          {/* Student / Teacher Toggle */}
                          <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/40 shrink-0">
                            <button
                              onClick={() => {
                                      setAttendanceType('student');
                                      setAttendanceSearch('');
                              }}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                                isStudentMode
                                  ? "bg-white text-primary-600 shadow-3xs border border-slate-200/40"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                              id="btn-students-toggle"
                            >
                              <GraduationCap className="w-3 h-3" />
                              {idt("សិស្ស", "Students", "学生 (Students)")}
                            </button>
                            <button
                              onClick={() => {
                                      setAttendanceType('teacher');
                                      setAttendanceSearch('');
                              }}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                                !isStudentMode
                                  ? "bg-white text-primary-600 shadow-3xs border border-slate-200/40"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                              id="btn-teachers-toggle"
                            >
                              <Users className="w-3 h-3" />
                              {idt("គ្រូបង្រៀន", "Teachers", "教师 (Teachers)")}
                            </button>
                          </div>

                          {/* Show Daily Details Toggle (Only visible if period is month or year) */}
                          {reportPeriod !== 'day' && (
                            <button
                              onClick={() => setShowDailyDetails(!showDailyDetails)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer whitespace-nowrap border ${
                                showDailyDetails || attendanceSearch !== "" || attendanceCourseFilter !== "all"
                                  ? "bg-primary-50 text-primary-700 border-primary-200 shadow-3xs"
                                  : "bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-300 shadow-3xs"
                              }`}
                              title={idt("បង្ហាញព័ត៌មានលម្អិតតាមថ្ងៃនីមួយៗ", "Show daily details", "显示每日详情")}
                              id="btn-daily-details-toggle"
                            >
                              <List className="w-3 h-3 text-primary-500" />
                              <span>{idt("បង្ហាញព័ត៌មានតាមថ្ងៃ", "Daily Details", "按日显示详情 (Daily Details)")}</span>
                              <span className={`w-1 h-1 rounded-full ${showDailyDetails || attendanceSearch !== "" || attendanceCourseFilter !== "all" ? 'bg-primary-600 animate-pulse' : 'bg-slate-300'}`} />
                            </button>
                          )}
                        </div>

                        {/* Right Side: Search & Action Buttons */}
                        <div className="flex flex-nowrap items-center gap-1.5 w-auto justify-end">
                          {/* Search box with icon */}
                          <div className="relative flex-initial min-w-[125px] max-w-[150px]">
                            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={attendanceSearch}
                              onChange={(e) => setAttendanceSearch(e.target.value)}
                              placeholder={idt("ស្វែងរកឈ្មោះ...", "Search name...", "搜索姓名...")}
                              className="w-full pl-7 pr-2 py-1 border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] font-bold focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white placeholder-slate-400 font-sans"
                            />
                          </div>

                          {/* Save PDF */}
                          <button
                            disabled={isSavingPDF}
                            onClick={async () => {
                              if (isSavingPDF) return;
                              setIsSavingPDF(true);
                              showToast("កំពុងរៀបចំ និងទាញយកឯកសារ PDF... (Preparing and downloading PDF...)", "info");

                              // Prepare styling hooks for restoring later
                              const removedNodes: { node: Node; parent: Node; nextSibling: Node | null }[] = [];
                              const temporaryStyleElements: HTMLStyleElement[] = [];
                              const originalAdopted = (document as any).adoptedStyleSheets;
                              let restoredAdopted = false;
                              const originalGetComputedStyle = window.getComputedStyle;

                              try {
                                // Robust helper function to extract and convert oklab/oklch colors to standard sRGB format
                                const extractAndConvert = (funcType: string, inner: string): string => {
                                  const normalized = inner.replace(/,/g, ' ');
                                  const parts = normalized.trim().split(/\s+/);
                                  if (parts.length === 0) return "rgb(100, 116, 139)";
                                  
                                  let lStr = parts[0];
                                  let lVal = parseFloat(lStr);
                                  if (lStr.endsWith('%')) {
                                    lVal = parseFloat(lStr) / 100;
                                  }
                                  
                                  if (isNaN(lVal)) {
                                    return "rgb(100, 116, 139)";
                                  }
                                  
                                  let alpha = 1;
                                  const slashIndex = parts.indexOf('/');
                                  if (slashIndex !== -1 && slashIndex + 1 < parts.length) {
                                    alpha = parseFloat(parts[slashIndex + 1]);
                                  } else {
                                    const partWithSlash = parts.find(p => p.startsWith('/'));
                                    if (partWithSlash) {
                                      alpha = parseFloat(partWithSlash.substring(1));
                                    }
                                  }
                                  if (isNaN(alpha)) alpha = 1;

                                  if (lVal >= 0.96) {
                                    return alpha < 1 ? `rgba(255, 255, 255, ${alpha})` : "rgb(255, 255, 255)";
                                  }
                                  if (lVal <= 0.05) {
                                    return alpha < 1 ? `rgba(0, 0, 0, ${alpha})` : "rgb(0, 0, 0)";
                                  }
                                  
                                  try {
                                    if (funcType === 'oklab') {
                                      let aVal = parts[1] ? parseFloat(parts[1]) : 0;
                                      let bVal = parts[2] ? parseFloat(parts[2]) : 0;
                                      if (isNaN(aVal)) aVal = 0;
                                      if (isNaN(bVal)) bVal = 0;
                                      
                                      const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
                                      const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
                                      const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
                                      
                                      const l = l_ * l_ * l_;
                                      const m = m_ * m_ * m_;
                                      const s = s_ * s_ * s_;
                                      
                                      const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
                                      const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
                                      const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
                                      
                                      const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
                                      const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
                                      const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
                                      const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
                                      
                                      return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
                                    } else {
                                      let cVal = parts[1] ? parseFloat(parts[1]) : 0;
                                      let hVal = parts[2] ? parseFloat(parts[2]) : 0;
                                      if (isNaN(cVal)) cVal = 0;
                                      if (isNaN(hVal)) hVal = 0;
                                      
                                      const hRad = (hVal * Math.PI) / 180;
                                      const aVal = cVal * Math.cos(hRad);
                                      const bVal = cVal * Math.sin(hRad);
                                      
                                      const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
                                      const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
                                      const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
                                      
                                      const l = l_ * l_ * l_;
                                      const m = m_ * m_ * m_;
                                      const s = s_ * s_ * s_;
                                      
                                      const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
                                      const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
                                      const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
                                      
                                      const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
                                      const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
                                      const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
                                      const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
                                      
                                      return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
                                    }
                                  } catch (e) {
                                    return "rgb(100, 116, 139)";
                                  }
                                };

                                const sanitizeCssColors = (css: string): string => {
                                  let result = "";
                                  let i = 0;
                                  while (i < css.length) {
                                    const sub6 = css.substring(i, i + 6).toLowerCase();
                                    if (sub6 === "oklch(" || sub6 === "oklab(") {
                                      const funcType = sub6.slice(0, 5);
                                      i += 6;
                                      const start = i;
                                      let depth = 1;
                                      while (i < css.length && depth > 0) {
                                        if (css[i] === '(') {
                                          depth++;
                                        } else if (css[i] === ')') {
                                          depth--;
                                        }
                                        i++;
                                      }
                                      const inner = css.substring(start, i - 1);
                                      result += extractAndConvert(funcType, inner);
                                    } else {
                                      result += css[i];
                                      i++;
                                    }
                                  }
                                  return result;
                                };

                                // Intercept window.getComputedStyle to dynamically replace oklch/oklab values during PDF generation
                                window.getComputedStyle = function(el, pseudoElt) {
                                  const style = originalGetComputedStyle(el, pseudoElt);
                                  return new Proxy(style, {
                                    get(target, prop, receiver) {
                                      if (prop === 'getPropertyValue') {
                                        return function(propertyName: string) {
                                          const val = target.getPropertyValue(propertyName);
                                          if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
                                            return sanitizeCssColors(val);
                                          }
                                          return val;
                                        };
                                      }
                                      const val = Reflect.get(target, prop, target);
                                      if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
                                        return sanitizeCssColors(val);
                                      }
                                      if (typeof val === 'function') {
                                        return val.bind(target);
                                      }
                                      return val;
                                    }
                                  });
                                };

                                // 1. Load html2pdf dynamically from CDN
                                const jsPDF = (await import('jspdf')).default;
                const { safeToJpeg: toJpeg } = await import('../../lib/safe-html-to-image');

                                // 2. Grab the printable element
                                const originalElement = document.getElementById("printable-attendance-sheet");
                                if (!originalElement) {
                                  throw new Error("Could not find printable-attendance-sheet element");
                                }

                                // 3. Clone and configure the cloned element for proper rendering
                                const clone = originalElement.cloneNode(true) as HTMLElement;
                                clone.classList.remove("hidden");
                                clone.classList.remove("print:block");
                                clone.style.display = "block";
                                clone.style.visibility = "visible";
                                clone.style.width = "1123px"; // allow full table width rendering
                                clone.style.minWidth = "1123px";
                                clone.style.maxWidth = "1123px";
                                clone.style.padding = "24px";
                                clone.style.margin = "0 auto";
                                clone.style.backgroundColor = "#ffffff";
                                clone.style.color = "#000000";

                                // Ensure borders are strong and clear
                                const tables = clone.querySelectorAll("table, th, td");
                                tables.forEach((el: any) => {
                                  el.style.borderColor = "#94a3b8"; // Slate-400 borders
                                });

                                // Hide elements with 'no-print' class inside the clone
                                const noPrintItems = clone.querySelectorAll(".no-print");
                                noPrintItems.forEach((el: any) => {
                                  el.style.display = "none";
                                });

                                // Apply tweaks for better Khmer font rendering and prevent clipping
                                clone.querySelectorAll("td, th").forEach((el: any) => {
                                  el.style.paddingBottom = "14px";
                                  el.style.paddingTop = "14px";
                                  el.style.lineHeight = "1.8";
                                });
                                clone.querySelectorAll("span, div").forEach((el: any) => {
                                  el.style.lineHeight = "1.8";
                                  el.style.overflow = "visible";
                                });

                                // Sanitize any inline styles on the clone to remove unsupported color values (oklch, oklab)
                                const elementsWithInlineStyles = clone.querySelectorAll("[style]");
                                elementsWithInlineStyles.forEach((el: any) => {
                                  const inlineStyle = el.getAttribute("style") || "";
                                  if (inlineStyle.includes("oklch") || inlineStyle.includes("oklab")) {
                                    el.setAttribute("style", sanitizeCssColors(inlineStyle));
                                  }
                                });

                                // Append clone temporarily to an off-screen container
                                const tempDiv = document.createElement("div");
                                tempDiv.style.position = "fixed";
                                tempDiv.style.left = "0px";
                                tempDiv.style.top = "0px";
                                tempDiv.style.width = "1123px";
                                tempDiv.style.opacity = "0";
                                tempDiv.style.pointerEvents = "none";
                                tempDiv.style.zIndex = "-1000";
                                tempDiv.appendChild(clone);
                                document.body.appendChild(tempDiv);

                                // 4. Sanitize document stylesheets to replace "oklch" and "oklab" color functions
                                // This prevents html2canvas from throwing "Attempting to parse an unsupported color function"
                                try {
                                  // Clear adoptedStyleSheets (constructed stylesheets)
                                  if (originalAdopted && Array.isArray(originalAdopted)) {
                                    try {
                                      (document as any).adoptedStyleSheets = [];
                                      restoredAdopted = true;
                                    } catch (e) {
                                      console.warn("Could not clear adoptedStyleSheets:", e);
                                    }
                                  }

                                  // Process all stylesheets currently in the document
                                  const sheets = Array.from(document.styleSheets);
                                  for (const sheet of sheets) {
                                    try {
                                      if (sheet.cssRules) {
                                        // Serialize the entire stylesheet
                                        let cssText = "";
                                        const rules = Array.from(sheet.cssRules);
                                        for (const rule of rules) {
                                          cssText += rule.cssText + "\n";
                                        }

                                        // Check if it contains any unsupported color function
                                        if (cssText.includes("oklch") || cssText.includes("oklab")) {
                                          const sanitizedText = sanitizeCssColors(cssText);

                                          // Create a temporary style element with sanitized CSS
                                          const tempStyle = document.createElement("style");
                                          tempStyle.setAttribute("data-temp-sanitized-style", "true");
                                          tempStyle.textContent = sanitizedText;
                                          document.head.appendChild(tempStyle);
                                          temporaryStyleElements.push(tempStyle);

                                          // Physically remove the original sheet's ownerNode from DOM
                                          // to prevent html2canvas from seeing or parsing it
                                          if (sheet.ownerNode && sheet.ownerNode.parentNode) {
                                            const node = sheet.ownerNode;
                                            const parent = node.parentNode;
                                            const nextSibling = node.nextSibling;
                                            removedNodes.push({ node, parent, nextSibling });
                                            parent.removeChild(node);
                                          }
                                        }
                                      }
                                    } catch (sheetErr) {
                                      // If it's a CORS stylesheet, let's attempt to fetch it directly if it's a link element to be extra thorough
                                      const node = sheet.ownerNode;
                                      let fetchedAndSanitized = false;
                                      if (node && node.nodeName === "LINK") {
                                        const linkEl = node as HTMLLinkElement;
                                        if (linkEl.href) {
                                          try {
                                            const response = await fetch(linkEl.href);
                                            if (response.ok) {
                                              const rawText = await response.text();
                                              if (rawText.includes("oklch") || rawText.includes("oklab")) {
                                                const sanitizedText = sanitizeCssColors(rawText);

                                                const tempStyle = document.createElement("style");
                                                tempStyle.setAttribute("data-temp-sanitized-style", "true");
                                                tempStyle.textContent = sanitizedText;
                                                document.head.appendChild(tempStyle);
                                                temporaryStyleElements.push(tempStyle);

                                                if (linkEl.parentNode) {
                                                  const parent = linkEl.parentNode;
                                                  const nextSibling = linkEl.nextSibling;
                                                  removedNodes.push({ node: linkEl, parent, nextSibling });
                                                  parent.removeChild(linkEl);
                                                  fetchedAndSanitized = true;
                                                }
                                              }
                                            }
                                          } catch (fetchErr) {
                                            console.warn("Failed to fetch cross-origin stylesheet:", fetchErr);
                                          }
                                        }
                                      }

                                      // If we couldn't fetch/sanitize it, we MUST remove it temporarily anyway.
                                      // If we leave it in the DOM, html2canvas will fetch it (since useCORS is true)
                                      // and parse it, which will crash if it contains unsupported color functions like "oklab" or "oklch".
                                      if (!fetchedAndSanitized && node && node.parentNode) {
                                        const parent = node.parentNode;
                                        const nextSibling = node.nextSibling;
                                        removedNodes.push({ node, parent, nextSibling });
                                        parent.removeChild(node);
                                        console.log("Temporarily removed unreadable CORS stylesheet to prevent html2canvas crash:", node);
                                      }
                                    }
                                  }
                                } catch (styleSanitizeErr) {
                                  console.warn("Stylesheet sanitization failed, proceeding anyway:", styleSanitizeErr);
                                }

                                // 5. Define filename and options
                                const dateFormatted = attendanceDate.split('-').reverse().join('_');
                                const typeLabel = isStudentMode ? "Students" : "Teachers";
                                const fileName = `PLC_Attendance_Report_${typeLabel}_${dateFormatted}.pdf`;

                                const opt = {
                                  margin: [5, 5, 5, 5] as [number, number, number, number], // top, left, bottom, right in mm
                                  filename: fileName,
                                  image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
                                  html2canvas: { 
                                    ...({ scale: 2 } as any), 
                                    useCORS: true, 
                                    logging: false,
                                    letterRendering: true,
                                     
                                    scrollX: 0,
                                    scrollY: 0,
                                    windowWidth: 1123,
                                    backgroundColor: '#ffffff'
                                  },
                                  jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
                                };

                                // 6. Generate and save PDF
                                document.body.appendChild(clone);
                                const imgData = await toJpeg(clone, { quality: 0.98, backgroundColor: "#ffffff", pixelRatio: 2 });
                                document.body.removeChild(clone);
                                const pdf = new jsPDF({
                                    orientation: opt.jsPDF?.orientation || 'portrait',
                                    unit: 'in',
                                    format: 'a4'
                                });
                                const pdfWidth = pdf.internal.pageSize.getWidth();
                                const img = new Image();
                                img.src = imgData;
                                await new Promise(resolve => { img.onload = resolve; });
                                const pdfHeight = (img.height * pdfWidth) / img.width;
                                pdf.addImage(imgData, 'JPEG', 0.5, 0.5, pdfWidth - 1, pdfHeight - 1);
                                pdf.save(opt.filename || 'export.pdf');

                                // Cleanup clone element container
                                document.body.removeChild(tempDiv);
                                showToast("បានរក្សាទុកឯកសារ PDF ដោយជោគជ័យ! (PDF Saved Successfully!)", "success");
                              } catch (error) {
                                console.error("PDF generation failed:", error);
                                showToast(idt("ការបង្កើត PDF ដោយផ្ទាល់មានបញ្ហា កំពុងប្តូរទៅកាន់ការបោះពុម្ពជំនួសវិញ... (PDF generation failed, falling back to print view...)", "PDF generation failed, falling back to print view...", "PDF 生成失败，正在切换至打印视图..."), "error");
                                const printStyle = document.createElement("style");
                                printStyle.id = "print-landscape-style";
                                printStyle.textContent = "@media print { @page { size: A4 landscape !important; margin: 5mm !important; } }";
                                document.head.appendChild(printStyle);
                                
                                // Fallback to standard window.print()
                                const originalTitle = document.title;
                                const dateFormatted = attendanceDate.split('-').reverse().join('_');
                                const typeLabel = isStudentMode ? "Students" : "Teachers";
                                document.title = `PLC_Attendance_Report_${typeLabel}_${dateFormatted}`;
                                window.print();
                                setTimeout(() => {
                                  document.title = originalTitle;
                                  const el = document.getElementById("print-landscape-style");
                                  if (el) el.remove();
                                }, 500);
                              } finally {
                                // Restore original styles to make sure user UI looks perfect again
                                try {
                                  removedNodes.forEach(({ node, parent, nextSibling }) => {
                                    try {
                                      if (nextSibling) {
                                        parent.insertBefore(node, nextSibling);
                                      } else {
                                        parent.appendChild(node);
                                      }
                                    } catch (restoreNodeErr) {
                                      console.warn("Failed to restore node:", restoreNodeErr);
                                    }
                                  });
                                  temporaryStyleElements.forEach((tempStyle) => {
                                    if (tempStyle.parentNode) {
                                      tempStyle.parentNode.removeChild(tempStyle);
                                    }
                                  });
                                  if (restoredAdopted && originalAdopted) {
                                    (document as any).adoptedStyleSheets = originalAdopted;
                                  }
                                  if (originalGetComputedStyle) {
                                    window.getComputedStyle = originalGetComputedStyle;
                                  }
                                } catch (restoreErr) {
                                  console.error("Style restoration failed:", restoreErr);
                                }

                                setIsSavingPDF(false);
                              }
                            }}
                            className={`px-2 py-1 border border-rose-200 text-rose-600 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-3xs hover:border-rose-300 no-print ${
                              isSavingPDF ? "bg-rose-100/50 cursor-not-allowed opacity-75" : "bg-rose-50/10 hover:bg-rose-50"
                            }`}
                          >
                            {isSavingPDF ? (
                              <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                            ) : (
                              <File className="w-3 h-3 stroke-[2.5]" />
                            )}
                            {isSavingPDF ? idt("កំពុងរក្សាទុកជា PDF...", "Saving PDF...", "正在保存 PDF...") : idt("រក្សាទុកជា PDF", "Save PDF", "保存为 PDF")}
                          </button>

                          {/* Print Preview */}
                          <button
                            onClick={() => setIsAttendancePrintPreviewOpen(true)}
                            className="px-2 py-1 border border-primary-200 bg-primary-50/10 hover:bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-3xs hover:border-primary-300 no-print"
                          >
                            <Printer className="w-3 h-3 stroke-[2.5]" />
                            {idt("ការមើលមុនបោះពុម្ព", "Print Preview", "打印预览")}
                          </button>
                          <button
                            onClick={handleExportAttendanceExcel}
                            className="px-2 py-1 border border-blue-200 bg-blue-50/10 hover:bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-3xs hover:border-blue-300 no-print"
                          >
                            <Download className="w-3 h-3 stroke-[2.5]" />
                            {idt("ទាញយក Excel", "Export Excel", "导出 Excel")}
                          </button>


                          {/* Save Google Sheets */}
                          <button
                            onClick={() => {
                              setIsGoogleSheetsSyncingOpen(true);
                              setGoogleSheetsSyncStep('idle');
                            }}
                            className="px-2 py-1 border border-emerald-250 bg-emerald-50/10 hover:bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-3xs hover:border-emerald-300 no-print"
                          >
                            <Save className="w-3 h-3 stroke-[2.5]" />
                            {idt("រក្សាទុកជា Google Sheets", "Save Google Sheets", "保存至 Google 表格")}
                          </button>
                        </div>
                      </div>

                      {/* Main Dynamic Table Container */}
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden mt-4">
                        <div className="overflow-x-auto scroll-smooth scrollbar-none">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10.5px] font-black uppercase text-slate-550 tracking-wider">
                                <th className="px-5 py-1.5 text-slate-600">{idt("លេខសម្គាល់", "ID", "学号/工号")} <br/><span className="text-[8px] text-slate-400">ID</span></th>
                                <th className="px-5 py-1.5 text-slate-600">{idt("ឈ្មោះភាសាខ្មែរ និងអង់គ្លេស", "Name (Khmer & English)", "姓名 (柬文与英文)")} <br/><span className="text-[8px] text-slate-400">({idt("ខ្មែរ & អង់គ្លេស", "KHMER & ENGLISH", "柬文 & 英文")})</span></th>
                                <th className="px-5 py-1.5 text-center text-slate-600">{idt("កាលបរិច្ឆេទ", "Date", "日期")} <br/><span className="text-[8px] text-slate-400">(DATE)</span></th>
                                <th className="px-5 py-1.5 text-slate-600">{isStudentMode ? idt("វគ្គសិក្សា", "Course", "课程") : idt("មុខជំនាញឯកទេស", "Specialty", "专业")} <br/><span className="text-[8px] text-slate-400">({isStudentMode ? "COURSE" : "SPECIALTY"})</span></th>
                                <th className="px-5 py-1.5 text-center text-slate-600">{idt("ស្ថានភាព", "Status", "状态")} <br/><span className="text-[8px] text-slate-400">(STATUS)</span></th>
                                <th className="px-3 py-1.5 text-center text-slate-600">{isStudentMode ? idt("មករៀន", "Present", "来校") : idt("មកបង្រៀន", "Present", "上班")} <br/><span className="text-[8px] text-slate-400">(P)</span></th>
                                <th className="px-3 py-1.5 text-center text-slate-600">{idt("មកយឺត", "Late", "迟到")} <br/><span className="text-[8px] text-slate-400">(L)</span></th>
                                <th className="px-3 py-1.5 text-center text-slate-600">{idt("សុំច្បាប់", "Excused", "请假")} <br/><span className="text-[8px] text-slate-400">(E)</span></th>
                                <th className="px-3 py-1.5 text-center text-slate-600">{idt("អវត្តមាន", "Absent", "缺勤")} <br/><span className="text-[8px] text-slate-400">(A)</span></th>
                                <th className="px-5 py-1.5 text-center text-slate-600">{idt("មូលហេតុ", "Reason", "原因")} <br/><span className="text-[8px] text-slate-400">(REASON)</span></th>
                                <th className="px-5 py-1.5 text-center text-slate-600">{idt("ម៉ោងចូល", "Check In", "签到")} <br/><span className="text-[8px] text-slate-400">(IN)</span></th>
                                <th className="px-5 py-1.5 text-center text-slate-600">{idt("ម៉ោងចេញ", "Check Out", "签退")} <br/><span className="text-[8px] text-slate-400">(OUT)</span></th>
                                <th className="px-5 py-1.5 text-right text-slate-600">{idt("អត្រា (%)", "Rate (%)", "出勤率 (%)")} <br/><span className="text-[8px] text-slate-400">RATE (%)</span></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y-0 lg:divide-y lg:divide-slate-100 text-xs block lg:table-row-group p-3 lg:p-0 space-y-4 lg:space-y-0">
                              {(() => {
                                const filteredActiveList = isStudentMode ? filteredStudents : filteredTeachers;

                                if (filteredActiveList.length === 0) {
                                  return (
                                    <tr>
                                      <td colSpan={12} className="p-12 text-center text-slate-400 font-bold font-sans">
                                        {idt("មិនមានទិន្នន័យដើម្បីបង្ហាញទេ! 🔍", "No data to display! 🔍", "没有可显示的数据! 🔍")}
                                      </td>
                                    </tr>
                                  );
                                }

                                const getPeriodStats = (itemId: string) => {
                                  const [year, month] = attendanceDate.split('-');
                                  
                                  if (reportPeriod === 'day') {
                                    const cin = attendanceCheckInLog[attendanceDate]?.[itemId];
                                    const cout = attendanceCheckOutLog[attendanceDate]?.[itemId];
                                    
                                    const resolved = (() => {
                                      if (!cin && !cout) return null;
                                      if (!cin) return cout;
                                      if (!cout) return cin;
                                      if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                                      if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                                      if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                                      return 'ABSENT';
                                    })();

                                    return {
                                      p: resolved === 'PRESENT' ? 1 : 0,
                                      l: resolved === 'LATE' ? 1 : 0,
                                      e: resolved === 'PERMISSION' ? 1 : 0,
                                      a: resolved === 'ABSENT' ? 1 : 0,
                                      hasCin: !!cin,
                                      hasCout: !!cout,
                                      cinStatus: cin,
                                      coutStatus: cout,
                                      totalLogs: cin || cout ? 1 : 0,
                                      resolvedStatus: resolved
                                    };
                                  } else {
                                    const prefix = reportPeriod === 'month' ? `${year}-${month}` : year;
                                    let pCount = 0;
                                    let lCount = 0;
                                    let eCount = 0;
                                    let aCount = 0;
                                    let totalLogs = 0;
                                    
                                    const allDates = new Set<string>();
                                    Object.keys(attendanceCheckInLog).forEach(date => {
                                      if (date.startsWith(prefix)) allDates.add(date);
                                    });
                                    Object.keys(attendanceCheckOutLog).forEach(date => {
                                      if (date.startsWith(prefix)) allDates.add(date);
                                    });

                                    allDates.forEach(date => {
                                      const cin = attendanceCheckInLog[date]?.[itemId];
                                      const cout = attendanceCheckOutLog[date]?.[itemId];

                                      if (cin || cout) {
                                        totalLogs++;
                                        const resolved = (() => {
                                          if (!cin) return cout;
                                          if (!cout) return cin;
                                          if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                                          if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                                          if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                                          return 'ABSENT';
                                        })();

                                        if (resolved === 'PRESENT') pCount++;
                                        else if (resolved === 'LATE') lCount++;
                                        else if (resolved === 'PERMISSION') eCount++;
                                        else if (resolved === 'ABSENT') aCount++;
                                      }
                                    });
                                    
                                    return {
                                      p: pCount,
                                      l: lCount,
                                      e: eCount,
                                      a: aCount,
                                      totalLogs,
                                      hasCin: totalLogs > 0,
                                      hasCout: totalLogs > 0,
                                      cinStatus: null,
                                      coutStatus: null
                                    };
                                  }
                                };

                                const getRatePercent = (itemId: string, stats: any) => {
                                  if (reportPeriod === 'day') {
                                    const resolved = stats.resolvedStatus;
                                    if (!resolved) return "100%";
                                    if (resolved === 'PRESENT' || resolved === 'LATE' || resolved === 'PERMISSION') return "100%";
                                    return "0%";
                                  } else {
                                    const totalExpected = stats.totalLogs || 1;
                                    const positive = stats.p + stats.l + stats.e;
                                    return totalExpected > 0 ? `${Math.round((positive / totalExpected) * 100)}%` : "100%";
                                  }
                                };

                                const isShowingDailyDetails = reportPeriod !== 'day' && (showDailyDetails || attendanceSearch !== "" || attendanceCourseFilter !== "all");

                                const reportRows = (() => {
                                  const [year, month] = attendanceDate.split('-');
                                  const prefix = reportPeriod === 'month' ? `${year}-${month}` : year;

                                  if (reportPeriod === 'day') {
                                    // If Day report period, it's always one row per student/teacher for that day
                                    return filteredActiveList.map(item => {
                                      const stats = getPeriodStats(item.id);
                                      const rateStr = getRatePercent(item.id, stats);
                                      const cinTime = getLoggedTime(item.id, 'check-in', '08:00 AM', attendanceDate);
                                      const coutTime = getLoggedTime(item.id, 'check-out', '02:08 PM', attendanceDate);
                                      const cin = attendanceCheckInLog[attendanceDate]?.[item.id] || null;
                                      const cout = attendanceCheckOutLog[attendanceDate]?.[item.id] || null;
                                      const checkInNote = attendanceNotes[attendanceDate]?.[item.id]?.['check-in'] || "";
                                      const checkOutNote = attendanceNotes[attendanceDate]?.[item.id]?.['check-out'] || "";
                                      const reasonStr = checkInNote || checkOutNote || "-";

                                      return {
                                        key: `${item.id}`,
                                        item,
                                        date: attendanceDate,
                                        cin,
                                        cout,
                                        cinTime,
                                        coutTime,
                                        reasonStr,
                                        stats,
                                        rateStr
                                      };
                                    });
                                  } else if (isShowingDailyDetails) {
                                    // If Month/Year AND in Daily Details mode, map each student/teacher to multiple dates in the period where they have logs
                                    const allDates = new Set<string>();
                                    Object.keys(attendanceCheckInLog).forEach(date => {
                                      if (date.startsWith(prefix)) allDates.add(date);
                                    });
                                    Object.keys(attendanceCheckOutLog).forEach(date => {
                                      if (date.startsWith(prefix)) allDates.add(date);
                                    });

                                    const sortedDates = Array.from(allDates).sort().reverse(); // Show latest dates first
                                    const rows: any[] = [];

                                    filteredActiveList.forEach(item => {
                                      sortedDates.forEach(date => {
                                        const cin = attendanceCheckInLog[date]?.[item.id];
                                        const cout = attendanceCheckOutLog[date]?.[item.id];

                                        if (cin || cout) {
                                          const resolved = (() => {
                                            if (!cin) return cout;
                                            if (!cout) return cin;
                                            if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                                            if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                                            if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                                            return 'ABSENT';
                                          })();

                                          const stats = {
                                            p: resolved === 'PRESENT' ? 1 : 0,
                                            l: resolved === 'LATE' ? 1 : 0,
                                            e: resolved === 'PERMISSION' ? 1 : 0,
                                            a: resolved === 'ABSENT' ? 1 : 0,
                                            resolvedStatus: resolved
                                          };

                                          const rateStr = resolved === 'ABSENT' ? "0%" : "100%";
                                          const cinTime = getLoggedTime(item.id, 'check-in', '08:00 AM', date);
                                          const coutTime = getLoggedTime(item.id, 'check-out', '02:08 PM', date);
                                          const checkInNote = attendanceNotes[date]?.[item.id]?.['check-in'] || "";
                                          const checkOutNote = attendanceNotes[date]?.[item.id]?.['check-out'] || "";
                                          const reasonStr = checkInNote || checkOutNote || "-";

                                          rows.push({
                                            key: `${item.id}-${date}`,
                                            item,
                                            date,
                                            cin,
                                            cout,
                                            cinTime,
                                            coutTime,
                                            reasonStr,
                                            stats,
                                            rateStr
                                          });
                                        }
                                      });
                                    });

                                    return rows;
                                  } else {
                                    // Month/Year standard view: one row per student/teacher showing aggregated totals
                                    return filteredActiveList.map(item => {
                                      const stats = getPeriodStats(item.id);
                                      const rateStr = getRatePercent(item.id, stats);
                                      
                                      // In aggregated mode, we don't display a specific single-day's cin/cout unless they logged today
                                      const cin = attendanceCheckInLog[attendanceDate]?.[item.id] || null;
                                      const cout = attendanceCheckOutLog[attendanceDate]?.[item.id] || null;
                                      const cinTime = getLoggedTime(item.id, 'check-in', '08:00 AM', attendanceDate);
                                      const coutTime = getLoggedTime(item.id, 'check-out', '02:08 PM', attendanceDate);
                                      const checkInNote = attendanceNotes[attendanceDate]?.[item.id]?.['check-in'] || "";
                                      const checkOutNote = attendanceNotes[attendanceDate]?.[item.id]?.['check-out'] || "";
                                      const reasonStr = checkInNote || checkOutNote || "-";

                                      return {
                                        key: `${item.id}`,
                                        item,
                                        date: attendanceDate, // represents selected date or whole period
                                        cin,
                                        cout,
                                        cinTime,
                                        coutTime,
                                        reasonStr,
                                        stats,
                                        rateStr
                                      };
                                    });
                                  }
                                })();

                                return reportRows.map((row: any, idx) => {
                                  const { item, date, cin, cout, cinTime, coutTime, reasonStr, stats, rateStr } = row;
                                  const rateVal = parseInt(rateStr, 10);

                                  const rateTextColor = rateVal >= 80 
                                    ? "text-emerald-600 font-sans font-bold" 
                                    : rateVal >= 50 
                                      ? "text-amber-600 font-sans font-bold" 
                                      : "text-rose-600 font-sans font-bold";

                                  const renderStatusIndicator = (isActive: boolean, textColorClass: string) => {
                                    if (isActive) {
                                      return (
                                        <span className={`font-black text-[10.5px] mx-auto ${textColorClass}`}>
                                          ✓
                                        </span>
                                      );
                                    }
                                    return <span className="text-slate-300 font-bold text-[10.5px]">-</span>;
                                  };

                                  return (
                                    <tr key={row.key} className="hover:bg-slate-50/40 transition-colors">
                                      {/* 1. ID */}
                                      <td className="px-5 py-1">
                                        <span className="text-[9.5px] font-mono text-slate-600 font-bold">
                                          {isStudentMode ? item.studentId : item.teacherId || item.id}
                                        </span>
                                      </td>

                                      {/* 2. Khmer & English Names */}
                                      <td className="px-5 py-1">
                                        <div className="font-sans">
                                          <div className="font-black text-slate-800 text-[10.5px]">{item.nameKh}</div>
                                          <div className="text-[8.5px] text-slate-400 font-bold uppercase mt-0.5">({item.nameEn})</div>
                                        </div>
                                      </td>

                                      {/* 2.5. Date (Day/Month/Year) */}
                                      <td className="px-5 py-1 text-center whitespace-nowrap">
                                        <span className="font-sans text-[10px] font-semibold text-slate-600">
                                          {(() => {
                                            const [y, m, d] = date.split('-');
                                            return `${d}/${m}/${y}`;
                                          })()}
                                        </span>
                                      </td>

                                      {/* 3. Course */}
                                      <td className="px-5 py-1">
                                        <span className="font-bold text-slate-600 font-sans text-[10px]">
                                          {isStudentMode ? item.course : item.specialty || "General Specialist"}
                                        </span>
                                      </td>

                                      {/* 4. Status */}
                                      <td className="px-5 py-1 text-center">
                                        {isStudentMode ? (
                                          item.status === "STUDYING" ? (
                                            <span className="text-[9.5px] font-black text-emerald-600">
                                              {idt("កំពុងរៀន", "Studying", "在读")}
                                            </span>
                                          ) : item.status === "COMPLETED" ? (
                                            <span className="text-[9.5px] font-black text-blue-600">
                                              {idt("បញ្ចប់", "Completed", "结业")}
                                            </span>
                                          ) : (
                                            <span className="text-[9.5px] font-black text-rose-600">
                                              {idt("ឈប់រៀន", "Dropped", "退学")}
                                            </span>
                                          )
                                        ) : (
                                          <span className="text-[9.5px] font-black text-primary-600">
                                            {idt("កំពុងបង្រៀន", "Teaching", "在教")}
                                          </span>
                                        )}
                                      </td>

                                      {/* 5. P */}
                                      <td className="px-3 py-1 text-center">
                                        {reportPeriod === 'day' || isShowingDailyDetails
                                          ? renderStatusIndicator(stats.resolvedStatus === 'PRESENT', 'text-emerald-600')
                                          : stats.p === 0 
                                            ? <span className="text-slate-300 font-bold text-[10.5px]">-</span>
                                            : <span className="font-bold text-emerald-600 font-mono text-[10.5px]">{stats.p}</span>
                                        }
                                      </td>

                                      {/* 6. L */}
                                      <td className="px-3 py-1 text-center">
                                        {reportPeriod === 'day' || isShowingDailyDetails
                                          ? renderStatusIndicator(stats.resolvedStatus === 'LATE', 'text-amber-600')
                                          : stats.l === 0
                                            ? <span className="text-slate-300 font-bold text-[10.5px]">-</span>
                                            : <span className="font-bold text-amber-600 font-mono text-[10.5px]">{stats.l}</span>
                                        }
                                      </td>

                                      {/* 7. E */}
                                      <td className="px-3 py-1 text-center">
                                        {reportPeriod === 'day' || isShowingDailyDetails
                                          ? renderStatusIndicator(stats.resolvedStatus === 'PERMISSION', 'text-blue-600')
                                          : stats.e === 0
                                            ? <span className="text-slate-300 font-bold text-[10.5px]">-</span>
                                            : <span className="font-bold text-blue-600 font-mono text-[10.5px]">{stats.e}</span>
                                        }
                                      </td>

                                      {/* 8. A */}
                                      <td className="px-3 py-1 text-center">
                                        {reportPeriod === 'day' || isShowingDailyDetails
                                          ? renderStatusIndicator(stats.resolvedStatus === 'ABSENT', 'text-rose-600')
                                          : stats.a === 0
                                            ? <span className="text-slate-300 font-bold text-[10.5px]">-</span>
                                            : <span className="font-bold text-rose-600 font-mono text-[10.5px]">{stats.a}</span>
                                        }
                                      </td>

                                      {/* 9. REASON */}
                                      <td className="px-5 py-1 text-center font-bold text-slate-500 text-[9.5px]">
                                        {reasonStr}
                                      </td>

                                      {/* 10. IN */}
                                      <td className="px-5 py-1 text-center whitespace-nowrap">
                                        {cin ? (
                                          <span className="inline-flex items-center gap-1 text-slate-700 text-[9.5px] font-bold font-sans">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-pulse" />
                                            {cinTime}
                                          </span>
                                        ) : (
                                          <span className="text-slate-300 font-bold text-[9.5px]">-</span>
                                        )}
                                      </td>

                                      {/* 11. OUT */}
                                      <td className="px-5 py-1 text-center whitespace-nowrap">
                                        {cout ? (
                                          <span className="inline-flex items-center gap-1 text-primary-600 text-[9.5px] font-bold font-sans">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                            {coutTime}
                                          </span>
                                        ) : (
                                          <span className="text-slate-300 font-bold text-[9.5px]">-</span>
                                        )}
                                      </td>

                                      {/* 12. RATE */}
                                      <td className="px-5 py-1 text-right">
                                        <span className={`text-[9.5px] font-black ${rateTextColor}`}>
                                          {rateStr}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>

                        {/* Centered Khmer printed footer block */}
                        <div className="px-6 py-4.5 bg-slate-50/80 border-t border-slate-200 text-center">
                          <p className="text-[10px] font-bold text-slate-400 tracking-wide Khmer-font">
                            របាយការណ៍ត្រូវធានាបង្កើតឡើងយ៉ាងស្វ័យប្រវត្តិតាមរយៈប្រព័ន្ធ <span className="text-slate-500 font-extrabold font-sans">School Attendance Pro Core</span> • ពេលវេលាបោះពុម្ព៖ <span className="text-slate-500 font-black font-sans">{(() => {
                              const now = new Date();
                              const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
                              const [y, m, d] = attendanceDate.split('-');
                              return `${d}/${m}/${y}, ${timeStr}`;
                            })()}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Absence Note Popup Modal */}
                  <AnimatePresence>
                    {absenceModalData && (
                      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 15 }}
                          className="bg-white rounded-[24px] border border-slate-100/80 max-w-[380px] w-full overflow-hidden p-6 shadow-xl space-y-5"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between pb-1">
                            <div className="flex items-center gap-2.5">
                              <div className="text-[#5832E9]">
                                <MessageSquare className="w-5 h-5 text-[#5832E9]" />
                              </div>
                              <h3 className="font-extrabold text-slate-900 text-[16px] font-sans tracking-tight">
                                បញ្ជាក់ព័ត៌មានវត្តមាន
                              </h3>
                            </div>
                            <button
                              onClick={() => setAbsenceModalData(null)}
                              className="text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Body */}
                          <div className="space-y-4">
                            {/* Card with student info - Left aligned and matching the screenshot precisely */}
                            <div className="p-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl space-y-2.5 text-[12.5px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-slate-400 font-bold">គោត្តនាម-នាម KH:</span>
                                <span className="font-extrabold text-slate-800">{absenceModalData.nameKh}</span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-slate-400 font-bold">ប្រភេទ:</span>
                                {absenceModalData.status === 'ABSENT' ? (
                                  <span className="inline-flex px-3 py-0.5 bg-rose-50 text-rose-500 font-black text-[10px] rounded-full border border-rose-100/30">
                                    អវត្តមាន (Absent)
                                  </span>
                                ) : absenceModalData.status === 'PERMISSION' ? (
                                  <span className="inline-flex px-3 py-0.5 bg-blue-50 text-blue-500 font-black text-[10px] rounded-full border border-blue-100/30">
                                    ច្បាប់ (Permission)
                                  </span>
                                ) : (
                                  <span className="inline-flex px-3 py-0.5 bg-amber-50 text-amber-600 font-black text-[10px] rounded-full border border-amber-100/30">
                                    {absenceModalData.type === 'check-in' ? 'យឺត (Late)' : 'ចេញមុន (Early Leave)'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Textarea for Reason */}
                            <div className="space-y-2">
                              <label className="block text-xs font-extrabold text-slate-700">
                                មូលហេតុ / ព័ត៌មានបន្ថែម (Reason/Note) <span className="text-rose-500">*</span>
                              </label>
                              <textarea
                                value={absenceModalData.currentNote}
                                onChange={(e) => setAbsenceModalData(prev => prev ? { ...prev, currentNote: e.target.value } : null)}
                                className="w-full px-4 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5832E9]/20 focus:border-[#5832E9] font-semibold text-slate-700 bg-white placeholder-slate-400 outline-none text-xs leading-relaxed min-h-[95px] resize-none transition-all"
                                placeholder={idt("បញ្ចូលមូលហេតុ...", "Enter reason...", "输入原因...")}
                              />
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                              <button
                                onClick={() => setAbsenceModalData(null)}
                                className="px-5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-black text-xs rounded-full transition-all cursor-pointer flex-1 text-center"
                              >
                                បោះបង់
                              </button>
                              <button
                                onClick={() => {
                                  // 1. Log the attendance status
                                  logItemAttendance(
                                    absenceModalData.type,
                                    absenceModalData.id,
                                    absenceModalData.status,
                                    absenceModalData.nameKh,
                                    absenceModalData.courseOrSpecialty,
                                    absenceModalData.itemType,
                                    absenceModalData.nameEn,
                                    absenceModalData.currentNote
                                  );

                                  // 2. Save the note
                                  setAttendanceNotes(prev => ({
                                    ...prev,
                                    [attendanceDate]: {
                                      ...(prev[attendanceDate] || {}),
                                      [absenceModalData.id]: {
                                        ...(prev[attendanceDate]?.[absenceModalData.id] || {}),
                                        [absenceModalData.type]: absenceModalData.currentNote
                                      }
                                    }
                                  }));

                                  // 3. Close Modal
                                  setAbsenceModalData(null);
                                }}
                                className="px-5 py-1.5 bg-[#5832E9] hover:bg-[#4822d9] text-white font-black text-xs rounded-full transition-all cursor-pointer flex-1 text-center shadow-md shadow-[#5832E9]/10"
                              >
                                រក្សាទុក (Save)
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Student/Teacher Attendance History Modal */}
                  <AnimatePresence>
                    {selectedHistoryItem && (
                      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 15 }}
                          className="bg-white rounded-[24px] border border-slate-100 max-w-[500px] w-full overflow-hidden p-6 shadow-xl flex flex-col max-h-[85vh] no-print"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
                                <Calendar className="w-5 h-5 text-primary-600" />
                              </div>
                              <div className="text-left">
                                <h3 className="font-extrabold text-slate-900 text-[15px] Khmer-font leading-normal">
                                  {selectedHistoryItem.type === 'month' ? 'ប្រវត្តវត្តមានប្រចាំខែ' : 'របាយការណ៍វត្តមានប្រចាំឆ្នាំ'}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider font-sans">
                                  {selectedHistoryItem.nameKh} ({selectedHistoryItem.nameEn})
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedHistoryItem(null)}
                              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer font-sans"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Body Content */}
                          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                            {selectedHistoryItem.type === 'month' ? (() => {
                              // Compute monthly daily records
                              const [y, m] = attendanceDate.split('-');
                              const yearNum = parseInt(y, 10);
                              const monthNum = parseInt(m, 10);
                              const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
                              
                              let pTotal = 0;
                              let lTotal = 0;
                              let eTotal = 0;
                              let aTotal = 0;
                              
                              const dailyLogs = [];
                              for (let d = 1; d <= daysInMonth; d++) {
                                const dayStr = d.toString().padStart(2, '0');
                                const dateStr = `${y}-${m}-${dayStr}`;
                                
                                const cin = attendanceCheckInLog[dateStr]?.[selectedHistoryItem.id];
                                const cout = attendanceCheckOutLog[dateStr]?.[selectedHistoryItem.id];
                                const note = attendanceNotes[dateStr]?.[selectedHistoryItem.id]?.['check-in'] || 
                                             attendanceNotes[dateStr]?.[selectedHistoryItem.id]?.['check-out'];
                                
                                const resolved = (() => {
                                  if (!cin && !cout) return null;
                                  if (!cin) return cout;
                                  if (!cout) return cin;
                                  if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                                  if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                                  if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                                  return 'ABSENT';
                                })();
                                
                                if (resolved === 'PRESENT') pTotal++;
                                else if (resolved === 'LATE') lTotal++;
                                else if (resolved === 'PERMISSION') eTotal++;
                                else if (resolved === 'ABSENT') aTotal++;
                                
                                dailyLogs.push({
                                  date: dateStr,
                                  dayNum: d,
                                  cin,
                                  cout,
                                  resolved,
                                  note
                                });
                              }
                              
                              // Reverse list to show newest dates on top
                              dailyLogs.reverse();

                              return (
                                <div className="space-y-4">
                                  {/* Month summary widget */}
                                  <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200/65 p-3 rounded-2xl text-center">
                                    <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-3xs">
                                      <span className="block text-[8px] font-black text-slate-400 uppercase leading-none">P (មករៀន)</span>
                                      <span className={`text-sm font-black text-emerald-600 mt-1 block ${uiLang === 'kh' ? 'font-sans' : 'font-mono'}`}>{toKhmerNumeral(pTotal)}</span>
                                    </div>
                                    <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-3xs">
                                      <span className="block text-[8px] font-black text-slate-400 uppercase leading-none">L (មកយឺត)</span>
                                      <span className={`text-sm font-black text-amber-500 mt-1 block ${uiLang === 'kh' ? 'font-sans' : 'font-mono'}`}>{toKhmerNumeral(lTotal)}</span>
                                    </div>
                                    <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-3xs">
                                      <span className="block text-[8px] font-black text-slate-400 uppercase leading-none">E (សុំច្បាប់)</span>
                                      <span className={`text-sm font-black text-blue-500 mt-1 block ${uiLang === 'kh' ? 'font-sans' : 'font-mono'}`}>{toKhmerNumeral(eTotal)}</span>
                                    </div>
                                    <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-3xs">
                                      <span className="block text-[8px] font-black text-slate-400 uppercase leading-none">A (អវត្តមាន)</span>
                                      <span className={`text-sm font-black text-rose-500 mt-1 block ${uiLang === 'kh' ? 'font-sans' : 'font-mono'}`}>{toKhmerNumeral(aTotal)}</span>
                                    </div>
                                  </div>

                                  {/* Title indicating selected month */}
                                  <div className="text-[11.5px] font-black text-slate-700 flex justify-between px-1">
                                    <span>ព័ត៌មានលម្អិតប្រចាំថ្ងៃ (Daily Details)</span>
                                    <span className="text-primary-600 font-sans">ខែ {toKhmerNumeral(m)} / {toKhmerNumeral(y)}</span>
                                  </div>

                                  {/* Table or list of dates */}
                                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                                    {dailyLogs.map(log => {
                                      const dayName = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
                                      const displayDate = `${log.dayNum.toString().padStart(2, '0')}/${m}/${y}`;
                                      
                                      return (
                                        <div key={log.date} className="flex items-center justify-between p-2.5 hover:bg-slate-50/50 transition-colors text-left">
                                          <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0">
                                              <span className="text-[9px] text-slate-400 font-black uppercase leading-none font-sans">{dayName}</span>
                                              <span className="text-xs font-mono font-extrabold text-slate-700 mt-0.5 leading-none">{log.dayNum}</span>
                                            </div>
                                            <div>
                                              <span className="block text-[10.5px] font-extrabold text-slate-700 font-sans">{displayDate}</span>
                                              {log.note && (
                                                <span className="block text-[9px] text-rose-500 font-medium italic truncate max-w-[180px]">
                                                  Note: {log.note}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* Status badge */}
                                          <div>
                                            {log.resolved ? (() => {
                                              let label = "មករៀន";
                                              let color = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                              if (log.resolved === 'LATE') {
                                                label = "មកយឺត";
                                                color = "bg-amber-50 text-amber-600 border-amber-100";
                                              } else if (log.resolved === 'PERMISSION') {
                                                label = "សុំច្បាប់";
                                                color = "bg-blue-50 text-blue-600 border-blue-100";
                                              } else if (log.resolved === 'ABSENT') {
                                                label = "អវត្តមាន";
                                                color = "bg-rose-50 text-rose-600 border-rose-100";
                                              }
                                              return (
                                                <span className={`inline-flex px-2 py-0.5 border text-[9px] font-black rounded-full ${color}`}>
                                                  {label}
                                                </span>
                                              );
                                            })() : (
                                              <span className="text-[10px] text-slate-350 font-bold italic font-sans">- គ្មានទិន្នន័យ -</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })() : (() => {
                              // Compute yearly monthly summaries
                              const [y] = attendanceDate.split('-');
                              const yearNum = parseInt(y, 10);
                              
                              const monthSummaries = [];
                              for (let mNum = 1; mNum <= 12; mNum++) {
                                const mStr = mNum.toString().padStart(2, '0');
                                const prefix = `${y}-${mStr}`;
                                
                                let pCount = 0;
                                let lCount = 0;
                                let eCount = 0;
                                let aCount = 0;
                                let loggedDays = 0;

                                const allDates = new Set<string>();
                                Object.keys(attendanceCheckInLog).forEach(date => {
                                  if (date.startsWith(prefix)) allDates.add(date);
                                });
                                Object.keys(attendanceCheckOutLog).forEach(date => {
                                  if (date.startsWith(prefix)) allDates.add(date);
                                });

                                allDates.forEach(date => {
                                  const cin = attendanceCheckInLog[date]?.[selectedHistoryItem.id];
                                  const cout = attendanceCheckOutLog[date]?.[selectedHistoryItem.id];

                                  if (cin || cout) {
                                    loggedDays++;
                                    const resolved = (() => {
                                      if (!cin) return cout;
                                      if (!cout) return cin;
                                      if (cin === 'LATE' || cout === 'LATE') return 'LATE';
                                      if (cin === 'PERMISSION' || cout === 'PERMISSION') return 'PERMISSION';
                                      if (cin === 'PRESENT' || cout === 'PRESENT') return 'PRESENT';
                                      return 'ABSENT';
                                    })();

                                    if (resolved === 'PRESENT') pCount++;
                                    else if (resolved === 'LATE') lCount++;
                                    else if (resolved === 'PERMISSION') eCount++;
                                    else if (resolved === 'ABSENT') aCount++;
                                  }
                                });

                                monthSummaries.push({
                                  monthNum: mNum,
                                  monthName: new Date(yearNum, mNum - 1, 1).toLocaleDateString('en-US', { month: 'long' }),
                                  p: pCount,
                                  l: lCount,
                                  e: eCount,
                                  a: aCount,
                                  loggedDays
                                });
                              }

                              return (
                                <div className="space-y-4">
                                  <div className="text-[11.5px] font-black text-slate-700 flex justify-between px-1">
                                    <span>សេចក្តីសង្ខេបប្រចាំខែនីមួយៗ (Monthly Summaries)</span>
                                    <span className="text-amber-600 font-mono">Year {y}</span>
                                  </div>

                                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-left">
                                    {monthSummaries.map(mSum => {
                                      const hasLogs = mSum.loggedDays > 0;
                                      const totalExpected = mSum.loggedDays || 1;
                                      const positive = mSum.p + mSum.l + mSum.e;
                                      const ratePercent = hasLogs ? Math.round((positive / totalExpected) * 100) : null;
                                      
                                      return (
                                        <div key={mSum.monthNum} className="p-3 hover:bg-slate-50/50 transition-colors space-y-2">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span className="block text-xs font-black text-slate-800">ខែ {toKhmerNumeral(mSum.monthNum.toString().padStart(2, '0'))} ({mSum.monthName})</span>
                                              <span className="block text-[9.5px] text-slate-400 font-bold font-sans">កត់ត្រាបាន {toKhmerNumeral(mSum.loggedDays.toString())} ថ្ងៃ</span>
                                            </div>
                                            {ratePercent !== null ? (
                                              <span className={`px-2 py-0.5 text-[9.5px] border font-black rounded-full ${
                                                ratePercent >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                ratePercent >= 50 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                              }`}>
                                                អត្រាវត្តមាន៖ {toKhmerNumeral(ratePercent.toString())}%
                                              </span>
                                            ) : (
                                              <span className="text-[10px] text-slate-350 font-bold italic font-sans">- គ្មានទិន្នន័យ -</span>
                                            )}
                                          </div>

                                          {hasLogs && (
                                            <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-black pt-1 font-sans">
                                              <div className="bg-emerald-50/50 text-emerald-700 py-1 rounded border border-emerald-100/50">
                                                P: {toKhmerNumeral(mSum.p.toString())}
                                              </div>
                                              <div className="bg-amber-50/50 text-amber-700 py-1 rounded border border-amber-100/50">
                                                L: {toKhmerNumeral(mSum.l.toString())}
                                              </div>
                                              <div className="bg-blue-50/50 text-blue-700 py-1 rounded border border-blue-100/50">
                                                E: {toKhmerNumeral(mSum.e.toString())}
                                              </div>
                                              <div className="bg-rose-50/50 text-rose-700 py-1 rounded border border-rose-100/50">
                                                A: {toKhmerNumeral(mSum.a.toString())}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Footer */}
                          <div className="pt-3 border-t border-slate-200 flex justify-end shrink-0">
                            <button
                              onClick={() => setSelectedHistoryItem(null)}
                              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-full transition-all cursor-pointer font-sans"
                            >
                              {idt("បិទត្រឡប់ក្រោយ", "Close", "关闭")}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Telegram Bot Setup Config Modal */}
                  <AnimatePresence>
                    {showBotConfig && (
                      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 15 }}
                          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
                        >
                          <div className="px-6 py-4.5 bg-sky-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Send className="w-4.5 h-4.5 fill-white/20 text-white" />
                              <h3 className="font-extrabold text-sm uppercase tracking-wider">{idt("រៀបចំប្រព័ន្ធ Telegram Bot Alerts", "Setup Telegram Bot Alerts", "配置 Telegram 机器人通知")}</h3>
                            </div>
                            <button
                              onClick={() => setShowBotConfig(false)}
                              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="p-6 space-y-4">
                            <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl space-y-1.5">
                              <p className="text-[10px] font-black uppercase text-sky-700 tracking-wider">🤖 {idt("ស្ថានភាពភ្នាក់ងារ PLC TELE-SYNC", "PLC TELE-SYNC AGENT STATUS", "PLC 远程同步代理状态")}</p>
                              <p className="text-xs font-semibold leading-relaxed text-sky-800 font-sans">
                                {idt(
                                  "ប្រព័ន្ធស្វ័យប្រវត្តបានភ្ជាប់ទៅកាន់ឆានែល PLC Academy Channel រួចរាល់។ រាល់ពេលចុចកត់វត្តមាន ដំណឹង alerts នឹងបញ្ជូនទៅទូរស័ព្ទអាណាព្យាបាលភ្លាមៗ។",
                                  "Automated system successfully connected to PLC Academy Channel. Each time attendance is taken, alerts will be sent to parents' phones immediately.",
                                  "系统已成功连接至 PLC Academy 频道。每次记录考勤时，通知将立即发送至家长手机。"
                                )}
                              </p>
                            </div>

                            <div className="space-y-5 text-xs font-semibold">
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Telegram Bot Token ({idt("គ្រាប់សោប្រព័ន្ធ", "Bot Token", "机器人密钥")})
                                </label>
                                <input
                                  type="text"
                                  readOnly
                                  value="718392182:AAF9XuM89-1-PqLz_3m1_XvTz8"
                                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 font-mono text-slate-500 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Chat ID / Channel ID ({idt("អត្តសញ្ញាណក្រុម", "Chat/Channel ID", "群组/频道 ID")})
                                </label>
                                <input
                                  type="text"
                                  readOnly
                                  value="-1002183918239"
                                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 font-mono text-slate-500 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idt("Telegram Username ផ្លូវការ", "Official Telegram Username", "官方 Telegram 用户名")}
                                </label>
                                <div className="px-4 py-2.5 bg-sky-50 border border-sky-100 text-sky-700 rounded-xl font-bold flex items-center justify-between shadow-sm">
                                  <span>@PLCAcademyBot</span>
                                  <span className="text-[9px] font-black uppercase tracking-wider text-sky-600 bg-white px-2 py-0.5 rounded border border-sky-100 shadow-sm">
                                    {idt("ផ្លូវការ", "Official", "官方")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => setShowBotConfig(false)}
                              className="w-full py-3 mt-2 bg-sky-600 text-white hover:bg-sky-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
                            >
                              <span>{idt("យល់ព្រមយល់ដឹង", "I Understand", "我已知晓")}</span>
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Hidden Printable Sheet for direct window.print() */}
                  {renderPrintableAttendanceSheet(false)}

                  {/* Print Preview and Report Customization Modal */}
                  <AnimatePresence>
                    {isAttendancePrintPreviewOpen && (
                      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 15 }}
                          className="bg-white rounded-3xl border border-slate-100 max-w-7xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                          {/* Modal Header */}
                          <div className="px-6 py-4.5 bg-primary-600 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <Printer className="w-5 h-5 text-white" />
                              <h3 className="font-extrabold text-sm uppercase tracking-wider">ការកំណត់ និងទិដ្ឋភាពមុនបោះពុម្ព (Print Settings & Preview)</h3>
                            </div>
                            <button
                              onClick={() => setIsAttendancePrintPreviewOpen(false)}
                              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white cursor-pointer font-bold border-none outline-none"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Modal Body */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto bg-slate-50 flex-1">
                            {/* Left Settings Panel */}
                            <div className="lg:col-span-1 space-y-5 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-3xs text-left self-start">
                              <h4 className="text-xs font-black uppercase text-primary-700 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                <Settings className="w-4 h-4" />
                                ជម្រើសបោះពុម្ព (Print Options)
                              </h4>

                              {/* Title Input */}
                              <div className="space-y-1">
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{idt("ចំណងជើងរបាយការណ៍ (Report Title)", "Report Title", "报表标题")}</label>
                                <input
                                  type="text"
                                  value={printTitle}
                                  onChange={(e) => setPrintTitle(e.target.value)}
                                  placeholder={isStudentMode ? idt("របាយការណ៍វត្តមានសិស្សប្រចាំថ្ងៃ", "Daily Student Attendance Report", "学生每日出勤报告") : idt("របាយការណ៍វត្តមានគ្រូប្រចាំថ្ងៃ", "Daily Faculty Attendance Report", "教师每日出勤报告")}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 font-sans"
                                />
                              </div>

                              {/* Toggles */}
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                  <span>{idt("បង្ហាញឡូហ្គោសាលា (Show Logo)", "Show School Logo", "显示学校徽标")}</span>
                                  <input
                                    type="checkbox"
                                    checked={printShowLogo}
                                    onChange={(e) => setPrintShowLogo(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                  />
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                  <span>{idt("បង្ហាញហត្ថលេខា (Show Signatures)", "Show Signatures", "显示签名栏")}</span>
                                  <input
                                    type="checkbox"
                                    checked={printShowSignatures}
                                    onChange={(e) => setPrintShowSignatures(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                  />
                                </div>
                              </div>

                              {/* Column Visibility Selector */}
                              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{idt("ជ្រើសរើសជួរឈរ (Columns to Print)", "Columns to Print", "选择打印列")}</label>
                                <div className="grid grid-cols-1 gap-2 text-xs font-bold text-slate-600">
                                  {Object.keys(printSelectedColumns).map((colKey) => {
                                    const labels: { [key: string]: string } = {
                                      no: "ល.រ (No)",
                                      studentId: "លេខសម្គាល់ (ID)",
                                      name: "ឈ្មោះ (Name)",
                                      date: "កាលបរិច្ឆេទ (Date)",
                                      course: isStudentMode ? "វគ្គសិក្សា (Course)" : "ឯកទេស (Specialty)",
                                      status: "ស្ថានភាព",
                                      checkIn: "Check In",
                                      checkOut: "Check Out",
                                      reason: "មូលហេតុ (Reason)",
                                      rate: "អត្រា (%)"
                                    };
                                    return (
                                      <label key={colKey} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                                        <input
                                          type="checkbox"
                                          checked={(printSelectedColumns as any)[colKey]}
                                          onChange={(e) => setPrintSelectedColumns(prev => ({ ...prev, [colKey]: e.target.checked }))}
                                          className="w-3.5 h-3.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                        />
                                        <span>{labels[colKey] || colKey}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Right Preview Panel */}
                            <div className="lg:col-span-2 bg-slate-100 p-5 rounded-2xl border border-slate-200/60 overflow-y-auto flex flex-col justify-between max-h-[70vh]">
                              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                                {renderPrintableAttendanceSheet(true)}
                              </div>
                              <div className="mt-4 flex justify-end gap-3 shrink-0">
                                <button
                                  onClick={() => setIsAttendancePrintPreviewOpen(false)}
                                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                  {idt("បិទ", "Close", "关闭")}
                                </button>
                                <button
                                  onClick={() => window.print()}
                                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Printer className="w-4 h-4" />
                                  <span>{idt("បោះពុម្ពឥឡូវនេះ", "Print Now", "立即打印")}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Google Sheets Sync Modal */}
                  <AnimatePresence>
                    {isGoogleSheetsSyncingOpen && (
                      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 15 }}
                          className="bg-white rounded-3xl border border-slate-100  w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                          {/* Modal Header */}
                          <div className="px-6 py-4.5 bg-emerald-600 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <Database className="w-5 h-5 text-white" />
                              <h3 className="font-extrabold text-sm uppercase tracking-wider">{idt("នាំចេញទិន្នន័យទៅ Google Sheets", "Export to Google Sheets", "导出到 Google Sheets")}</h3>
                            </div>
                            <button
                              onClick={() => setIsGoogleSheetsSyncingOpen(false)}
                              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white cursor-pointer font-bold border-none outline-none"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Modal Body */}
                          <div className="p-6 overflow-y-auto bg-slate-50 flex-1 space-y-6 text-left">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-3xs space-y-4">
                              {/* Spreadsheet Info */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{idt("ឈ្មោះសន្លឹកកិច្ចការ", "Sheet Name", "工作表名称 (Sheet Name)")}</label>
                                <input
                                  type="text"
                                  value={googleSheetsName}
                                  onChange={(e) => setGoogleSheetsName(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 font-sans"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{idt("តំណភ្ជាប់ Google Sheets URL", "Spreadsheet Link (Google Sheets URL)", "电子表格链接 (Spreadsheet Link)")}</label>
                                <input
                                  type="text"
                                  value={googleSheetsURL}
                                  onChange={(e) => setGoogleSheetsURL(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 font-sans text-slate-500"
                                />
                              </div>
                            </div>

                            {/* Sync Logs Table */}
                            <div className="space-y-3 pt-2">
                              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider border-b border-slate-100 pb-2">
                                {idt("ប្រវត្តិនាំចេញកន្លងមក", "Sync Logs & History", "同步历史记录")}
                              </h4>
                              <div className="border border-slate-200 rounded-2xl overflow-hidden text-[10.5px]">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase">
                                      <th className="p-2.5 pl-4">{idt("កាលបរិច្ឆេទកត់ត្រា", "Sync Timestamp", "同步时间")}</th>
                                      <th className="p-2.5">{idt("ឈ្មោះសន្លឹកកិច្ចការ", "Sheet Name", "工作表名称")}</th>
                                      <th className="p-2.5 text-center">{idt("ចំនួនជួរ", "Rows Synced", "同步行数")}</th>
                                      <th className="p-2.5 pr-4 text-right">{idt("ស្ថានភាព", "Status", "状态")}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 font-sans text-slate-600">
                                    {googleSheetsSyncLogs.map(log => (
                                      <tr key={log.id} className="hover:bg-slate-50/50">
                                        <td className="p-2.5 pl-4 font-mono">{log.timestamp}</td>
                                        <td className="p-2.5 font-bold text-slate-800">{log.sheetName}</td>
                                        <td className="p-2.5 text-center font-bold font-mono">{log.recordsCount} Rows</td>
                                        <td className="p-2.5 pr-4 text-right">
                                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600">
                                            <Check className="w-3 h-3" />
                                            {log.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                          </div>

                          {/* Modal Actions Footer */}
                          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                            <button
                              onClick={() => {
                                setIsGoogleSheetsSyncingOpen(false);
                                setGoogleSheetsSyncStep('idle');
                              }}
                              className="px-5 py-2 bg-slate-200 hover:bg-slate-200 text-slate-750 font-black text-xs rounded-full transition-all cursor-pointer"
                            >
                              {idt("បិទត្រឡប់ក្រោយ", "Close", "关闭")}
                            </button>

                            {googleSheetsSyncStep === 'idle' ? (
                              <button
                                onClick={() => {
                                  setGoogleSheetsSyncStep('preparing');
                                  setTimeout(() => setGoogleSheetsSyncStep('connecting'), 1200);
                                  setTimeout(() => setGoogleSheetsSyncStep('saving'), 2600);
                                  setTimeout(() => {
                                    setGoogleSheetsSyncStep('success');
                                    const now = new Date();
                                    const timeStr = now.getFullYear() + "-" + 
                                                    String(now.getMonth()+1).padStart(2,'0') + "-" + 
                                                    String(now.getDate()).padStart(2,'0') + " " + 
                                                    now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
                                    const listCount = isStudentMode ? filteredStudents.length : filteredTeachers.length;
                                    setGoogleSheetsSyncLogs(prev => [
                                      {
                                        id: `log-${Date.now()}`,
                                        timestamp: timeStr,
                                        sheetName: googleSheetsName,
                                        recordsCount: listCount,
                                        status: 'SUCCESS'
                                      },
                                      ...prev
                                    ]);
                                    showToast(idt("បាននាំចេញទិន្នន័យទៅកាន់ Google Sheets ដោយជោគជ័យ!", "Synced completed successfully!", "成功同步数据到 Google Sheets！"), "success");
                                  }, 4200);
                                }}
                                className="px-6 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/10 border-none outline-none"
                              >
                                <Database className="w-4 h-4" />
                                {idt("ផ្ដើមនាំចេញ", "Start Export Sync", "开始同步")}
                              </button>
                            ) : googleSheetsSyncStep === 'success' ? (
                              <button
                                onClick={() => setGoogleSheetsSyncStep('idle')}
                                className="px-5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs rounded-full transition-all cursor-pointer border-none outline-none"
                              >
                                {idt("នាំចេញបន្ថែមទៀត", "Sync Again", "再次同步")}
                              </button>
                            ) : (
                              <button
                                disabled
                                className="px-6 py-1.5 bg-slate-300 text-slate-500 font-black text-xs rounded-full cursor-not-allowed flex items-center gap-2"
                              >
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {idt("កំពុងដំណើរការ...", "Syncing...", "同步中...")}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })()}

            {/* QR CODE ATTENDANCE SCANNER TAB */}
    </>
  );
}
