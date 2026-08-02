import React, { useState, useRef } from "react";
import SearchableSelect from "../SearchableSelect";
import { generatePDF } from "../../lib/pdf-generator";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Printer, Search, FileText, FileSignature, X, Download, User, BookOpen, GraduationCap, AlertCircle, Trophy, RotateCcw } from 'lucide-react';

export default function ReportCardsTab({ students, uiLang: propUiLang }: any) {
  const [localLang, setLocalLang] = useState(propUiLang || localStorage.getItem("plc_lang") || "kh");

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

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [singlePrintStudent, setSinglePrintStudent] = useState<any>(null);
  const [printingStudentId, setPrintingStudentId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const reportCardRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isBatchPrinting, setIsBatchPrinting] = useState(false);
  
  // Real-world sync: State for live grading data
  const [scores, setScores] = useState<any[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("2026-07");
  const [gradeFilter, setGradeFilter] = useState("ALL"); // ALL, GRADED, UNGRADED
  const [sortBy, setSortBy] = useState("NAME"); // NAME, AVG_DESC, AVG_ASC

  const fetchScores = () => {
    setLoadingScores(true);
    const token = localStorage.getItem("plc_auth_token");
    fetch('/api/scores', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const scoresArray = Array.isArray(data) ? data : [];
        setScores(scoresArray);
        
        // Auto-select latest month from fetched scores
        if (scoresArray.length > 0) {
          const monthsList = Array.from(new Set(scoresArray.map((s: any) => s.month))).filter(Boolean).sort();
          if (monthsList.length > 0) {
            const latest = monthsList[monthsList.length - 1];
            setSelectedMonth(latest);
          }
        }
      })
      .catch(err => {
        console.error("Error fetching scores for report cards:", err);
      })
      .finally(() => setLoadingScores(false));
  };

  React.useEffect(() => {
    fetchScores();
  }, []);

  // Automated Letter Grade mapping consistent with GradingTab.tsx
  const getGradeDetails = (val: number) => {
    if (val >= 100) return { letter: "A+", textKh: "ល្អប្រសើរ", textEn: "Outstanding", colorClass: "bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold" };
    if (val >= 90) return { letter: "A", textKh: "ល្អប្រសើរ", textEn: "Excellent", colorClass: "bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold" };
    if (val >= 80) return { letter: "B", textKh: "ល្អណាស់", textEn: "Very Good", colorClass: "bg-blue-100 text-blue-800 border-blue-300 font-extrabold" };
    if (val >= 70) return { letter: "C", textKh: "ល្អ", textEn: "Good", colorClass: "bg-blue-100 text-blue-800 border-blue-300 font-extrabold" };
    if (val >= 60) return { letter: "D", textKh: "ល្អបង្គួរ", textEn: "Above Average", colorClass: "bg-amber-100 text-amber-800 border-amber-300 font-extrabold" };
    if (val >= 50) return { letter: "E", textKh: "មធ្យម", textEn: "Average", colorClass: "bg-orange-100 text-orange-800 border-orange-300 font-extrabold" };
    return { letter: "F", textKh: "ខ្សោយ", textEn: "Weak", colorClass: "bg-rose-100 text-rose-800 border-rose-300 font-extrabold" };
  };

  // Get unique months present in scores or fall back to default seeded months
  const uniqueMonths = React.useMemo(() => {
    const list = Array.from(new Set(scores.map(s => s.month))).filter(Boolean).sort();
    if (list.length === 0) {
      return ["2026-05", "2026-06", "2026-07"];
    }
    return list;
  }, [scores]);

  const handlePrint = async () => {
    if (!reportCardRef.current && !selectedStudent) return;
    setIsPrinting(true);
    try {
      const targetEl = reportCardRef.current || document.getElementById('preview-report-card-area');
      if (targetEl) {
        await generatePDF(targetEl, `Report_Card_${selectedStudent?.nameEn || selectedStudent?.nameKh || 'Student'}.pdf`, 'portrait');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleSinglePrint = (student: any) => {
    if (!student) return;
    setSelectedStudent(student);
    setSinglePrintStudent(student);
    setPrintingStudentId(student.id);
    document.body.classList.add("printing-report");

    const originalTitle = document.title;
    const cleanName = student.nameEn || student.nameKh || 'Student';
    document.title = `ReportCard_${cleanName}_${selectedMonth}`;

    const cleanup = () => {
      document.body.classList.remove("printing-report");
      setSinglePrintStudent(null);
      setPrintingStudentId(null);
      document.title = originalTitle;
      window.removeEventListener("afterprint", cleanup);
      window.removeEventListener("focus", cleanup);
    };

    window.addEventListener("afterprint", cleanup);

    // Also trigger cleanup when user refocuses after print dialog closes
    setTimeout(() => {
      window.addEventListener("focus", cleanup, { once: true });
    }, 600);

    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error("Single print failed:", err);
      }
    }, 200);
  };

  const handleBatchPrint = () => {
    if (filteredStudents.length === 0) return;
    setIsBatchPrinting(true);
    setSinglePrintStudent(null);
    document.body.classList.add("printing-report");

    const originalTitle = document.title;
    document.title = `PLC_All_ReportCards_${selectedMonth}`;

    const handleAfterPrint = () => {
      document.body.classList.remove("printing-report");
      setIsBatchPrinting(false);
      document.title = originalTitle;
      window.removeEventListener("afterprint", handleAfterPrint);
      window.removeEventListener("focus", handleAfterPrint);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    setTimeout(() => {
      window.addEventListener("focus", handleAfterPrint, { once: true });
    }, 600);

    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error("Batch print failed:", err);
      }
    }, 250);
  };

  const openPreview = (student: any) => {
    setSelectedStudent(student);
    setIsPreviewOpen(true);
  };

  const getStatusColor = (status: string) => {
    if (status === 'STUDYING') return 'text-blue-600 bg-blue-50 border-blue-100';
    if (status === 'COMPLETED') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (status === 'STOP') return 'text-rose-600 bg-rose-50 border-rose-100';
    return 'text-slate-600 bg-slate-50 border-slate-100';
  };

  // Component to render the report card content dynamically
  const ReportCardContent = ({ student, isRef }: { student: any, isRef?: boolean }) => {
    if (!student) return null;
    
    // Filter actual scores for the selected student & month
    const studentScores = scores.filter(s => s.studentId === student.id && s.month === selectedMonth);
    const totalScore = studentScores.reduce((sum, s) => sum + s.score, 0);
    const avgScore = studentScores.length > 0 ? Number((totalScore / studentScores.length).toFixed(1)) : 0;
    const avgGrade = studentScores.length > 0 ? getGradeDetails(avgScore) : null;

    return (
      <div className="bg-white shadow-sm border border-slate-200 mx-auto max-w-3xl min-h-[800px] text-slate-800" ref={isRef ? reportCardRef : null} style={{ padding: '40px', fontFamily: '"Khmer OS Battambang", "Kantumruy Pro", "Inter", sans-serif' }}>
        {/* Report Card Header */}
        <div className="text-center mb-8 border-b-2 border-slate-200 pb-6">
          <p className="text-xs font-black text-blue-600 tracking-widest uppercase mb-1">PLC COMPUTER & LANGUAGE CENTER</p>
          <h1 className="text-2xl font-black text-slate-800 mb-1 uppercase tracking-tight">Official Student Report Card</h1>
          <h2 className="text-lg font-extrabold text-slate-600 mb-2">ព្រឹត្តិបត្រពិន្ទុផ្លូវការប្រចាំខែ</h2>
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-black rounded-md border border-slate-200">
            {idt(`ប្រចាំខែ៖ ${selectedMonth}`, `Grading Month: ${selectedMonth}`, `评估月份：${selectedMonth}`)}
          </span>
        </div>
        
        {/* Student Info Box */}
        <div className="grid grid-cols-2 gap-6 mb-8 border border-slate-200 rounded-xl p-5 bg-slate-50/80">
          <div className="space-y-2.5 text-xs">
            <div className="flex">
              <span className="w-32 font-bold text-slate-500">អត្តលេខ / Student ID:</span>
              <span className="font-black text-slate-800 uppercase">{student.studentId || student.id?.substring(0, 8)}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-500">ឈ្មោះ (ខ្មែរ):</span>
              <span className="font-extrabold text-slate-900">{student.nameKh || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Name (English):</span>
              <span className="font-black text-slate-800 uppercase">{student.nameEn || 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex">
              <span className="w-32 font-bold text-slate-500">វគ្គ/ជំនាញ Course:</span>
              <span className="font-black text-slate-800 uppercase">{student.course || "General Course"}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-500">កម្រិត / Level:</span>
              <span className="font-black text-slate-800 uppercase">{student.level || "Level 1"}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold text-slate-500">ស្ថានភាព Status:</span>
              <span className="font-bold text-emerald-700 uppercase">{student.status || "STUDYING"}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Scores Table */}
        <table className="w-full border-collapse mb-8 text-xs">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-300">
              <th className="py-3 px-4 text-left font-black text-slate-700 uppercase tracking-wider">Subject / មុខវិជ្ជា</th>
              <th className="py-3 px-4 text-center font-black text-slate-700 uppercase tracking-wider">Score / ពិន្ទុ</th>
              <th className="py-3 px-4 text-center font-black text-slate-700 uppercase tracking-wider">Grade / និទ្ទេស</th>
            </tr>
          </thead>
          <tbody>
            {studentScores.length === 0 ? (
              <tr className="border-b border-slate-200">
                <td colSpan={3} className="py-10 text-center font-bold text-slate-400 italic">
                  {idt("មិនទាន់មានទិន្នន័យពិន្ទុសម្រាប់ខែនេះទេ", "No scores recorded for this student in the selected month", "该学生在此月份没有成绩记录")}
                </td>
              </tr>
            ) : (
              studentScores.map((s, idx) => {
                const grade = getGradeDetails(s.score);
                return (
                  <tr key={s.id || idx} className="border-b border-slate-200">
                    <td className="py-3 px-4 font-bold text-slate-800">{s.subject}</td>
                    <td className="py-3 px-4 text-center font-mono font-black text-slate-800">{s.score}</td>
                    <td className="py-3 px-4 text-center font-black text-blue-600">
                      {grade.letter} ({idt(grade.textKh, grade.textEn)})
                    </td>
                  </tr>
                );
              })
            )}

            {studentScores.length > 0 && (
              <tr className="bg-slate-50 border-t-2 border-slate-300">
                <td className="py-3.5 px-4 font-black text-slate-800 text-right">TOTAL AVERAGE / មធ្យមភាគរួម៖</td>
                <td className="py-3.5 px-4 text-center font-mono font-black text-blue-600 text-sm">{avgScore}</td>
                <td className="py-3.5 px-4 text-center font-black text-emerald-600 text-sm">
                  {avgGrade?.letter} ({idt(avgGrade?.textKh, avgGrade?.textEn)})
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Grading Scale Reference */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-8 text-[10.5px] text-slate-600 flex justify-between items-center">
          <span className="font-bold text-slate-700">{idt("កម្រិតនិទ្ទេស / Scale:", "Scale:", "标准：")}</span>
          <span className="font-medium">A+ (100)</span>
          <span className="font-medium">A (90-99)</span>
          <span className="font-medium">B (80-89)</span>
          <span className="font-medium">C (70-79)</span>
          <span className="font-medium">D (60-69)</span>
          <span className="font-medium">E (50-59)</span>
          <span className="font-medium text-rose-600">F (&lt;50)</span>
        </div>
        
        <div className="grid grid-cols-2 mt-12 pt-6 px-6 border-t border-slate-200">
          <div className="text-center">
            <div className="w-44 border-b border-slate-400 mx-auto mb-2"></div>
            <p className="font-bold text-slate-700 text-xs">Teacher's Signature</p>
            <p className="text-[11px] text-slate-400 mt-0.5">ហត្ថលេខាគ្រូបង្រៀន</p>
          </div>
          <div className="text-center">
            <div className="w-44 border-b border-slate-400 mx-auto mb-2"></div>
            <p className="font-bold text-slate-700 text-xs">Director / Principal</p>
            <p className="text-[11px] text-slate-400 mt-0.5">ហត្ថលេខា និងត្រានាយក</p>
          </div>
        </div>
      </div>
    );
  };

  const [selectedCourse, setSelectedCourse] = useState("ALL");

  // Filter students based on status, course filter, grade status, search string, and sort
  const filteredStudents = students.filter((s: any) => {
    if (s.status !== 'STUDYING') return false;
    if (selectedCourse !== "ALL" && s.course !== selectedCourse) return false;
    
    const studentScores = scores.filter(sc => sc.studentId === s.id && sc.month === selectedMonth);
    const isGraded = studentScores.length > 0;
    if (gradeFilter === "GRADED" && !isGraded) return false;
    if (gradeFilter === "UNGRADED" && isGraded) return false;

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchKh = s.nameKh?.includes(search);
      const matchEn = s.nameEn?.toLowerCase().includes(q);
      const matchId = s.studentId?.toLowerCase().includes(q);
      if (!matchKh && !matchEn && !matchId) return false;
    }
    return true;
  }).sort((a: any, b: any) => {
    if (sortBy === "AVG_DESC" || sortBy === "AVG_ASC") {
      const aScores = scores.filter(s => s.studentId === a.id && s.month === selectedMonth);
      const bScores = scores.filter(s => s.studentId === b.id && s.month === selectedMonth);
      const aAvg = aScores.length > 0 ? aScores.reduce((sum, s) => sum + s.score, 0) / aScores.length : 0;
      const bAvg = bScores.length > 0 ? bScores.reduce((sum, s) => sum + s.score, 0) / bScores.length : 0;
      return sortBy === "AVG_DESC" ? bAvg - aAvg : aAvg - bAvg;
    }
    // Default sort by name
    const nameA = a.nameKh || a.nameEn || "";
    const nameB = b.nameKh || b.nameEn || "";
    return nameA.localeCompare(nameB, "km");
  });

  // Calculate class ranks among graded studying students for selected month
  const studentRanks = React.useMemo(() => {
    const gradedList = students
      .filter((s: any) => s.status === 'STUDYING')
      .map((s: any) => {
        const studentScores = scores.filter(sc => sc.studentId === s.id && sc.month === selectedMonth);
        const isGraded = studentScores.length > 0;
        const avgNum = isGraded ? (studentScores.reduce((sum, sc) => sum + sc.score, 0) / studentScores.length) : -1;
        return { id: s.id, avgNum };
      })
      .filter(item => item.avgNum >= 0)
      .sort((a, b) => b.avgNum - a.avgNum);

    const ranksMap: Record<string, number> = {};
    gradedList.forEach((item, index) => {
      ranksMap[item.id] = index + 1;
    });
    return ranksMap;
  }, [students, scores, selectedMonth]);

  const resetFilters = () => {
    setSelectedCourse("ALL");
    setGradeFilter("ALL");
    setSortBy("NAME");
    setSearch("");
  };

  const AVATAR_GRADIENTS = [
    "bg-blue-600",
    "bg-emerald-500",
    "bg-blue-600",
    "bg-amber-500",
    "bg-sky-500",
    "bg-rose-500"
  ];

  const getAvatarGradient = (str: string) => {
    if (!str) return AVATAR_GRADIENTS[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[index];
  };

  const getCourseBadgeStyle = (courseName: string) => {
    if (!courseName) return "bg-slate-50 text-slate-700 border-slate-200/80";
    const lower = courseName.toLowerCase();
    if (lower.includes("web") || lower.includes("html") || lower.includes("code")) {
      return "bg-blue-50/80 text-blue-700 border-blue-200/60";
    }
    if (lower.includes("photoshop") || lower.includes("design") || lower.includes("adobe")) {
      return "bg-blue-50/80 text-blue-700 border-blue-200/60";
    }
    if (lower.includes("word") || lower.includes("excel") || lower.includes("office")) {
      return "bg-emerald-50/80 text-emerald-700 border-emerald-200/60";
    }
    if (lower.includes("marketing") || lower.includes("digital")) {
      return "bg-amber-50/80 text-amber-800 border-amber-200/60";
    }
    if (lower.includes("hardware") || lower.includes("repair") || lower.includes("pc")) {
      return "bg-blue-50/80 text-blue-700 border-blue-200/60";
    }
    return "bg-slate-50 text-slate-700 border-slate-200/80";
  };

  const uniqueCourses = React.useMemo(() => {
    return Array.from(new Set(students.map((s: any) => s.course).filter(Boolean)));
  }, [students]);



  return (
    <div className="space-y-6">
      <div className="w-full flex flex-col">
        {/* Header Title & Top Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 flex items-center gap-2.5">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <FileSignature className="w-5 h-5" />
              </div>
              {idt("ព្រឹត្តិបត្រពិន្ទុ (Report Cards)", "Report Cards", "成绩单")}
            </h2>
            <p className="text-xs sm:text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {idt("បោះពុម្ពព្រឹត្តិបត្រពិន្ទុប្រចាំខែ និងឆមាសសម្រាប់សិស្ស", "Manage and print official student report cards", "打印月度和学期成绩单")}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter by Course */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-200/80 rounded-xl bg-white text-slate-700 text-xs font-bold shadow-3xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">{idt("គ្រប់ជំនាញ/វគ្គ", "All Courses", "所有课程")}</option>
              {uniqueCourses.map((c: any) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Month Selector Dropdown */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-200/80 rounded-xl bg-white text-slate-700 text-xs font-bold shadow-3xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {uniqueMonths.map((m) => (
                <option key={m} value={m}>
                  {idt(`សម្រាប់ខែ៖ ${m}`, `Month: ${m}`, `月份: ${m}`)}
                </option>
              ))}
            </select>

            {/* Grade Status Filter */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-200/80 rounded-xl bg-white text-slate-700 text-xs font-bold shadow-3xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">{idt("គ្រប់ស្ថានភាពពិន្ទុ", "All Grade Status", "所有成绩状态")}</option>
              <option value="GRADED">{idt("បានបញ្ចូលពិន្ទុ", "Graded Only", "已បញ្ចូល")}</option>
              <option value="UNGRADED">{idt("មិនទាន់មានពិន្ទុ", "Ungraded Only", "未បញ្ចូល")}</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-200/80 rounded-xl bg-white text-slate-700 text-xs font-bold shadow-3xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="NAME">{idt("រៀបតាមឈ្មោះ", "Sort by Name", "按姓名排序")}</option>
              <option value="AVG_DESC">{idt("ពិន្ទុខ្ពស់ - ទាប", "Highest Average", "按成绩从高到低")}</option>
              <option value="AVG_ASC">{idt("ពិន្ទុទាប - ខ្ពស់", "Lowest Average", "按成绩从低到高")}</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={idt("ស្វែងរកឈ្មោះសិស្ស...", "Search students...", "搜索学生...")}
                className="w-full sm:w-48 pl-10 pr-4 py-2.5 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-3xs transition-all placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Print All Button */}
            <button
              type="button"
              onClick={handleBatchPrint}
              disabled={filteredStudents.length === 0 || isBatchPrinting}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              title={idt("បោះពុម្ពព្រឹត្តិបត្រពិន្ទុទាំងអស់", "Print All Report Cards", "打印所有成绩单")}
            >
              {isBatchPrinting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{idt("បោះពុម្ពទាំងអស់", "Print All", "全部打印")}</span>
            </button>
          </div>
        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredStudents.map((student: any) => {
            const studentScores = scores.filter(s => s.studentId === student.id && s.month === selectedMonth);
            const isGraded = studentScores.length > 0;
            const avgNum = isGraded ? (studentScores.reduce((sum, s) => sum + s.score, 0) / studentScores.length) : 0;
            const avg = avgNum > 0 ? avgNum.toFixed(1) : "0";
            const gradeInfo = isGraded ? getGradeDetails(avgNum) : null;
            const rankNum = isGraded ? studentRanks[student.id] : null;
            const avatarGradient = getAvatarGradient(student.nameEn || student.nameKh || student.id);
            const courseBadgeStyle = getCourseBadgeStyle(student.course);

            return (
              <motion.div 
                key={student.id} 
                whileHover={{ y: -3, transition: { duration: 0.2 } }} 
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group cursor-default relative overflow-hidden"
              >
                <div>
                  {/* Top Student Header */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm shadow-xs flex items-center justify-center shrink-0">
                        {student.nameEn?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-slate-800 text-[13.5px] leading-snug group-hover:text-blue-600 transition-colors truncate">{student.nameKh}</h3>
                        <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">{student.nameEn || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[9.5px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md tracking-wider border border-slate-200/60 uppercase">
                        {student.studentId || student.id.substring(0,6)}
                      </span>
                      {rankNum && (
                        <span className={`text-[9.5px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5 ${
                          rankNum === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          rankNum === 2 ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                          rankNum === 3 ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                          'bg-blue-50 text-blue-700 border border-blue-200/80'
                        }`} title={idt(`ចំណាត់ថ្នាក់លេខ ${rankNum}`, `Class Rank #${rankNum}`, `班级排名 #${rankNum}`)}>
                          <Trophy className="w-2.5 h-2.5 shrink-0" />
                          <span>#{rankNum}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Student Details */}
                  <div className="space-y-2 mb-3.5">
                    <div className={`flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-xl border ${courseBadgeStyle}`}>
                      <GraduationCap className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      <span className="truncate">{student.course || 'General Course'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-0.5">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{student.level || 'Level 1'}</span>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${getStatusColor(student.status)}`}>
                        {student.status || 'STUDYING'}
                      </span>
                    </div>

                    {/* Grading Indicator & Letter Grade Pill */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px] font-bold">
                      {isGraded ? (
                        <>
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md truncate">
                            {idt(`បានបញ្ចូល ${studentScores.length} មុខវិជ្ជា`, `${studentScores.length} Subjects`, `${studentScores.length} 门`)}
                          </span>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="px-2 py-0.5 rounded-md border text-blue-700 bg-blue-50 border-blue-100">
                              {avg}
                            </span>
                            {gradeInfo && (
                              <span className={`px-2 py-0.5 rounded-md border font-black text-xs ${gradeInfo.colorClass}`} title={idt(gradeInfo.textKh, gradeInfo.textEn)}>
                                {gradeInfo.letter}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md w-full text-center flex items-center justify-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                          <span>{idt("មិនទាន់មានពិន្ទុ", "No Grades Saved", "暂无成绩")}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-slate-100/80">
                  <button 
                    type="button"
                    onClick={() => openPreview(student)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-blue-50/80 hover:bg-blue-100/90 text-blue-700 border border-blue-200/60 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap shadow-3xs hover:shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" /> 
                    <span>{idt("មើលមុន", "Preview", "预览")}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSinglePrint(student)}
                    disabled={printingStudentId === student.id}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-blue-200/60 hover:shadow-blue-300 active:scale-[0.98] cursor-pointer whitespace-nowrap disabled:opacity-75"
                  >
                    {printingStudentId === student.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                    ) : (
                      <Printer className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{idt("បោះពុម្ព", "Print", "打印")}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
          
          {filteredStudents.length === 0 && (
            <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-3xs">
                <Search className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-sm text-slate-700">{idt("មិនមានទិន្នន័យសិស្សទេ", "No students found matching your filters", "未找到符合条件的学生")}</p>
              <p className="text-xs font-medium text-slate-400 mt-1 max-w-sm">
                {idt("សូមព្យាយាមផ្លាស់ប្តូរពាក្យស្វែងរក ឬការចម្រោះផ្សេងទៀត", "Try clearing search filters or selecting a different course or month.", "尝试清空搜索条件或选择其他课程/月份。")}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{idt("សំអាតការចម្រោះ", "Reset Filters", "重置筛选")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">
                      {idt("ព្រឹត្តិបត្រពិន្ទុអូសសិស្ស", "Report Card Preview", "成绩单预览")}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      {selectedStudent.nameKh} ({selectedStudent.nameEn})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSinglePrint(selectedStudent)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    {idt("បោះពុម្ព", "Print", "打印")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrint()}
                    disabled={isPrinting}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 disabled:opacity-70 cursor-pointer text-white"
                  >
                    {isPrinting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    {idt("ទាញយក PDF", "Download PDF", "下载 PDF")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer ml-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Area Container */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50" id="preview-report-card-area">
                <ReportCardContent student={selectedStudent} isRef={false} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden printable area always in DOM for pdf-generator */}
      <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none" aria-hidden="true">
        <ReportCardContent student={selectedStudent} isRef={true} />
      </div>

      {/* Full Printable Area for window.print() */}
      <div id="reports-panel" className="print-only-container">
        {singlePrintStudent ? (
          <div className="w-full bg-white print:p-6">
            <ReportCardContent student={singlePrintStudent} />
          </div>
        ) : (
          filteredStudents.map((st: any, idx: number) => (
            <div 
              key={st.id || idx} 
              className="w-full bg-white print:p-6"
              style={{ pageBreakAfter: idx < filteredStudents.length - 1 ? 'always' : 'auto', breakAfter: idx < filteredStudents.length - 1 ? 'page' : 'auto' }}
            >
              <ReportCardContent student={st} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

