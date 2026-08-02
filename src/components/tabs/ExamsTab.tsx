import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, List, Settings, FileText, X, Sparkles, Search, Calendar, BookOpen, RefreshCw, Clock, Share2, Copy, Check, Save, FileQuestion, HelpCircle, CheckSquare, ExternalLink, Award, Users, Eye, FileSpreadsheet, CheckCircle, ChevronDown } from "lucide-react";

interface StatusOption {
  id: string;
  labelKh: string;
  labelEn: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  descKh: string;
}

function StatusDropdown({
  value,
  onChange,
  localIdt
}: {
  value: string;
  onChange: (val: string) => void;
  localIdt: (kh: string, en?: string) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: StatusOption[] = [
    {
      id: "DRAFT",
      labelKh: "ព្រាងទុក (DRAFT)",
      labelEn: "Draft",
      badgeBg: "bg-amber-100/70",
      badgeText: "text-amber-800",
      dotColor: "bg-amber-500",
      descKh: "មិនទាន់បង្ហាញជូនសិស្សមើលឃើញ ឬធ្វើតេស្ត"
    },
    {
      id: "PUBLISHED",
      labelKh: "ផ្សព្វផ្សាយ (PUBLISHED)",
      labelEn: "Published",
      badgeBg: "bg-emerald-100/70",
      badgeText: "text-emerald-800",
      dotColor: "bg-emerald-500",
      descKh: "ផ្សព្វផ្សាយជាសាធារណៈ សិស្សអាចចូលធ្វើតេស្តបាន"
    }
  ];

  const currentOption = options.find(o => o.id === value) || options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-slate-800 text-xs sm:text-sm flex items-center justify-between cursor-pointer shadow-3xs"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full ${currentOption.dotColor} flex-shrink-0`} />
          <span className={`px-2 py-0.5 text-xs font-bold rounded-lg flex-shrink-0 ${currentOption.badgeBg} ${currentOption.badgeText}`}>
            {localIdt(currentOption.labelKh, currentOption.labelEn)}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-48 overflow-y-auto p-1 space-y-1 divide-y divide-slate-100">
            {options.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected ? "bg-blue-50/70 font-bold" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-bold ${opt.badgeText}`}>
                        {localIdt(opt.labelKh, opt.labelEn)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal truncate">
                        {opt.descKh}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
          <div className="p-1.5 bg-slate-50 text-[10px] text-center font-bold text-slate-400 border-t border-slate-100">
            {options.length} ជម្រើសមានស្រ្កូល (Scrollable Options)
          </div>
        </div>
      )}
    </div>
  );
}
import { Exam, Question } from "../../types";
import PracticePortal from "../PracticePortal";
import SubjectDropdown from "../SubjectDropdown";
import GradeLevelDropdown from "../GradeLevelDropdown";
import { STANDARD_SUBJECTS, GRADE_LEVELS, parseExamMeta, encodeExamMeta, getSubjectStyle, getAllSubjects } from "../../lib/examUtils";

interface ExamsTabProps {
  token: string;
  uiLang?: string;
  showToast?: (msg: string, type?: "success" | "error" | "warning" | "info") => void;
}

export default function ExamsTab({ token, uiLang, showToast }: ExamsTabProps) {
  const [localLang, setLocalLang] = useState(uiLang || localStorage.getItem("plc_lang") || "kh");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [activePracticeExamId, setActivePracticeExamId] = useState<string | null>(null);
  const [shareModalExam, setShareModalExam] = useState<Exam | null>(null);
  
  // Basic Search & Filter States
  const [examSearchQuery, setExamSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  
  // Basic Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("ចំណេះដឹងទូទៅ");
  const [gradeLevel, setGradeLevel] = useState("ទូទៅ / General");
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState("DRAFT");
  
  const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], answer: "", points: 1 }]);
  const [targetMaxScore, setTargetMaxScore] = useState<number>(100);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Student Results & Submissions States
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [selectedExamForResults, setSelectedExamForResults] = useState<Exam | null>(null);
  const [selectedStudentSubmission, setSelectedStudentSubmission] = useState<any | null>(null);
  const [resultSearchQuery, setResultSearchQuery] = useState("");
  const [resultFilterStatus, setResultFilterStatus] = useState<"ALL" | "PASSED" | "FAILED">("ALL");

  const loadSubmissions = () => {
    try {
      const subs = JSON.parse(localStorage.getItem("plc_local_exam_submissions") || "[]");
      setAllSubmissions(subs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSubmissions();
    const handleSubSubmitted = () => {
      loadSubmissions();
    };
    window.addEventListener("plc_exam_submitted", handleSubSubmitted);
    return () => window.removeEventListener("plc_exam_submitted", handleSubSubmitted);
  }, []);

  const getExamSubmissions = (examId: string) => {
    return allSubmissions.filter((s: any) => s.examId === examId);
  };

  const calculateGrade = (score: number, total: number) => {
    if (!total || total <= 0) return { pct: 0, grade: "F", labelKh: "ធ្លាក់ (F)", color: "text-rose-700 bg-rose-50 border-rose-200" };
    const pct = Math.round((score / total) * 100);
    if (pct >= 85) return { pct, grade: "A", labelKh: "និទ្ទេស A (ល្អប្រសើរ)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (pct >= 75) return { pct, grade: "B", labelKh: "និទ្ទេស B (ល្អណាស់)", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (pct >= 65) return { pct, grade: "C", labelKh: "និទ្ទេស C (ល្អ)", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (pct >= 50) return { pct, grade: "D", labelKh: "និទ្ទេស D (មធ្យម)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { pct, grade: "F", labelKh: "ធ្លាក់ / ត្រូវប្រឹងប្រែង (F)", color: "text-rose-700 bg-rose-50 border-rose-200" };
  };

  const distributeEqually = (targetTotal: number) => {
    if (questions.length === 0) return;
    const base = Math.floor(targetTotal / questions.length);
    const remainder = targetTotal % questions.length;
    
    const updated = questions.map((q, idx) => ({
      ...q,
      points: base + (idx < remainder ? 1 : 0)
    }));
    setQuestions(updated);
    if (showToast) {
      showToast(localIdt(`បានបែងចែកពិន្ទុពេញ ${targetTotal} ទៅកាន់សំណួរទាំង ${questions.length} ដោយជោគជ័យ!`, `Distributed ${targetTotal} total points across ${questions.length} questions!`), "info");
    }
  };

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/exams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setExams(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = selectedExam ? `/api/exams/${selectedExam.id}` : "/api/exams";
      const method = selectedExam ? "PUT" : "POST";
      const encodedDesc = encodeExamMeta(subject, gradeLevel, description);
      const body = { 
        title, 
        description: encodedDesc, 
        subject,
        gradeLevel,
        duration, 
        status, 
        targetMaxScore,
        totalPoints: targetMaxScore,
        teacherId: "dummy-teacher-id",
        questions: questions.map(q => ({
          text: q.text,
          options: JSON.stringify(q.options),
          answer: q.answer,
          points: q.points
        }))
      }; 
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowModal(false);
        fetchExams();
        setSelectedExam(null);
        setTitle("");
        setDescription("");
        setSubject("ចំណេះដឹងទូទៅ");
        setGradeLevel("ទូទៅ / General");
        setDuration(60);
        setStatus("DRAFT");
        setQuestions([{ text: "", options: ["", "", "", ""], answer: "", points: 1 }]);
        if (showToast) {
          showToast(localIdt("បានរក្សាទុកដោយជោគជ័យ!", "Saved successfully!"), "success");
        }
      } else {
        const errData = await res.json().catch(() => ({ error: "Unknown error occurred" }));
        if (showToast) {
          showToast(localIdt("ការរក្សាទុកបានបរាជ័យ៖ ", "Saving failed: ") + (errData.error || localIdt("ម៉ាស៊ីនបម្រើមានកំហុស", "Server error")), "error");
        } else {
          console.error("Saving failed:", errData.error);
        }
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast(localIdt("កំហុសក្នុងការតភ្ជាប់ទៅកាន់ប្រព័ន្ធ!", "Network / system connection error!"), "error");
      }
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/exams/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchExams();
        setDeleteConfirmId(null);
        if (showToast) {
          showToast(localIdt("បានលុបដោយជោគជ័យ!", "Deleted successfully!"), "success");
        }
      } else {
        const errData = await res.json().catch(() => ({ error: "Unknown error occurred" }));
        if (showToast) {
          showToast(localIdt("ការលុបបានបរាជ័យ៖ ", "Deletion failed: ") + (errData.error || localIdt("ម៉ាស៊ីនបម្រើមានកំហុស", "Server error")), "error");
        }
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast(localIdt("កំហុសក្នុងការតភ្ជាប់ទៅកាន់ប្រព័ន្ធ!", "Network / system connection error!"), "error");
      }
    }
  };

  // Calculate summary metrics
  const totalExams = exams.length;
  const publishedExams = exams.filter(e => e.status === "PUBLISHED").length;
  const draftExams = exams.filter(e => e.status === "DRAFT").length;
  const totalQuestions = exams.reduce((sum, e) => sum + (e.questions?.length || 0), 0);

  // Filter exams based on search query, status, subject, and grade filters
  const filteredExams = exams.filter(exam => {
    const meta = parseExamMeta(exam);
    const matchesSearch = 
      exam.title.toLowerCase().includes(examSearchQuery.toLowerCase()) || 
      meta.description.toLowerCase().includes(examSearchQuery.toLowerCase()) ||
      meta.subject.toLowerCase().includes(examSearchQuery.toLowerCase()) ||
      meta.gradeLevel.toLowerCase().includes(examSearchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || exam.status === statusFilter;
    const matchesSubject = subjectFilter === "ALL" || meta.subject === subjectFilter;
    const matchesGrade = gradeFilter === "ALL" || meta.gradeLevel === gradeFilter;

    return matchesSearch && matchesStatus && matchesSubject && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Header section with rich statistics integration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            {localIdt("ការគ្រប់គ្រងការប្រឡងអនឡាញ", "Online Exams Management")}
          </h2>
          <p className="text-xs sm:text-xs text-slate-500 mt-1 pl-1">{localIdt("បង្កើត គ្រប់គ្រង និងតាមដានរាល់វិញ្ញាសាប្រឡងរបស់សិស្ស", "Create, manage and publish interactive exam papers & quizzes")}</p>
        </div>
        <button 
          onClick={() => { 
            setSelectedExam(null); 
            setTitle(""); 
            setDescription(""); 
            setSubject("ចំណេះដឹងទូទៅ");
            setGradeLevel("ទូទៅ / General");
            setDuration(60); 
            setStatus("DRAFT"); 
            setQuestions([{ text: "", options: ["", "", "", ""], answer: "", points: 1 }]);
            setShowModal(true); 
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all duration-200 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          {localIdt("បង្កើតការប្រឡងថ្មី", "Create New Exam")}
        </button>
      </div>

      {/* 1. Statistics Cards Widget */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50 w-fit">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 w-fit">
              {localIdt("វិញ្ញាសា", "Exams")}
            </span>
          </div>
          <div>
            <span className="block text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">{localIdt("វិញ្ញាសាសរុប", "Total Exams")}</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800">{totalExams}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50 w-fit">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50 w-fit">
              {totalExams > 0 ? Math.round((publishedExams / totalExams) * 100) : 0}%
            </span>
          </div>
          <div>
            <span className="block text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">{localIdt("បានផ្សព្វផ្សាយ", "Published")}</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600">{publishedExams}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <div className="p-2 sm:p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/50 w-fit">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50 w-fit">
              {totalExams > 0 ? Math.round((draftExams / totalExams) * 100) : 0}%
            </span>
          </div>
          <div>
            <span className="block text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">{localIdt("រក្សាទុកជាព្រាង", "Draft Exams")}</span>
            <span className="text-xl sm:text-2xl font-black text-amber-600">{draftExams}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50 w-fit">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50 w-fit">
              {totalExams > 0 ? Math.round(totalQuestions / totalExams) : 0} Q/Exam
            </span>
          </div>
          <div>
            <span className="block text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">{localIdt("សំណួរសរុប", "Total Questions")}</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600">{totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filter Toolbar */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-100 flex flex-col lg:flex-row gap-2.5 items-center justify-between shadow-2xs">
        <div className="relative w-full lg:max-w-xs shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={examSearchQuery}
            onChange={e => setExamSearchQuery(e.target.value)}
            placeholder={localIdt("ស្វែងរកវិញ្ញាសា ឬមុខវិជ្ជា...", "Search exams or subjects...")}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs font-bold text-slate-700 transition-all"
          />
          {examSearchQuery && (
            <button
              type="button"
              onClick={() => setExamSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2.5 sm:gap-2 w-full lg:w-auto sm:justify-end">
          {/* Subject Filter Dropdown */}
          <div className="w-full sm:w-48 lg:w-44">
            <SubjectDropdown
              value={subjectFilter === "ALL" ? "ចំណេះដឹងទូទៅ" : subjectFilter}
              onChange={(val) => setSubjectFilter(val)}
              allowManage={true}
            />
          </div>

          {/* Grade Level Filter Dropdown */}
          <div className="w-full sm:w-48 lg:w-44">
            <GradeLevelDropdown
              value={gradeFilter === "ALL" ? "ទូទៅ / General" : gradeFilter}
              onChange={(val) => setGradeFilter(val)}
            />
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            {/* Status Pills */}
            <div className="flex flex-1 sm:flex-none gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
              {[
                { id: "ALL", label: localIdt("ទាំងអស់", "All") },
                { id: "PUBLISHED", label: localIdt("បានផ្សាយ", "Published") },
                { id: "DRAFT", label: localIdt("ព្រាងទុក", "Draft") }
              ].map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id)}
                  className={`flex-1 sm:flex-none px-2.5 py-1.5 sm:py-1 rounded-lg text-[10px] font-black tracking-wide uppercase transition-all cursor-pointer text-center ${
                    statusFilter === pill.id 
                      ? "bg-white text-blue-600 shadow-3xs border border-slate-200/50" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {(examSearchQuery || statusFilter !== "ALL" || subjectFilter !== "ALL" || gradeFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setExamSearchQuery("");
                  setStatusFilter("ALL");
                  setSubjectFilter("ALL");
                  setGradeFilter("ALL");
                }}
                className="px-2.5 py-1.5 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[11px] font-bold transition-all border border-rose-100 flex items-center gap-1 cursor-pointer shrink-0"
                title={localIdt("សម្អាតតម្រងស្វែងរក", "Reset search filters")}
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{localIdt("សម្អាត", "Reset")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Roster Table / Beautiful Empty State list wrapper */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{localIdt("កំពុងផ្ទុកទិន្នន័យ...", "Loading active exams...")}</p>
          </div>
        ) : filteredExams.length === 0 ? (
          /* Premium Empty State */
          <div className="p-12 sm:p-20 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-blue-50/80 border border-blue-100/50 rounded-2xl flex items-center justify-center text-blue-500 shadow-3xs">
              <FileText className="w-8 h-8 animate-pulse-subtle" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-slate-700 text-base">
                {examSearchQuery || statusFilter !== "ALL" 
                  ? localIdt("រកមិនឃើញលទ្ធផលការប្រឡងទេ", "No Exams Match Criteria")
                  : localIdt("មិនទាន់មានការប្រឡងនៅឡើយទេ", "No Online Exams Configured")}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium px-4">
                {examSearchQuery || statusFilter !== "ALL"
                  ? localIdt("សូមសាកល្បងស្វែងរកចំណងជើងផ្សេងទៀត ឬផ្លាស់ប្តូរតម្រងស្ថានភាព។", "Try editing your query or clearing status filters to find the required exams.")
                  : localIdt("ប្រព័ន្ធអនឡាញអនុញ្ញាតឱ្យសិស្សចូលរួមធ្វើការប្រឡងពីចម្ងាយ ស្វ័យប្រវត្តិតំឡើងពិន្ទុ និងគណនាទិន្នន័យភ្លាមៗ។", "The digital exam system empowers teachers to run web-based multiple choice, track test participation, and view performance curves.")}
              </p>
            </div>
            {(!examSearchQuery && statusFilter === "ALL") && (
              <button 
                onClick={() => {
                  setSelectedExam(null); 
                  setTitle(""); 
                  setDescription(""); 
                  setDuration(60); 
                  setStatus("DRAFT"); 
                  setQuestions([{ text: "", options: ["", "", "", ""], answer: "", points: 1 }]);
                  setShowModal(true); 
                }}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200/50 text-blue-600 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer shadow-3xs"
              >
                + {localIdt("បង្កើតវិញ្ញាសាដំបូងរបស់អ្នក", "Create Your First Exam")}
              </button>
            )}
          </div>
        ) : (
          <div className="p-3.5 sm:p-4 space-y-2.5">
            {filteredExams.map(exam => {
              const qCount = exam.questions?.length || 0;
              const meta = parseExamMeta(exam);
              const subStyle = getSubjectStyle(meta.subject);

              return (
                <div 
                  key={exam.id} 
                  className="relative overflow-hidden bg-white hover:bg-slate-50/30 border border-slate-100 hover:border-blue-200/50 p-3 sm:p-3.5 rounded-2xl shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  {/* Status Indicator Left Accent Bar */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                    exam.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  
                  <div className="flex items-start gap-3 pl-1.5">
                    <div className={`p-2 rounded-xl flex-shrink-0 ${
                      exam.status === 'PUBLISHED' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/30' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100/30'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedExam(exam);
                            setTitle(exam.title);
                            setDescription(meta.description);
                            setSubject(meta.subject);
                            setGradeLevel(meta.gradeLevel);
                            setDuration(exam.duration);
                            setStatus(exam.status);
                            if (exam.questions && exam.questions.length > 0) {
                              const mapped = exam.questions.map(q => {
                                let opts = ["", "", "", ""];
                                try {
                                  opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                                } catch (e) {
                                  if (typeof q.options === 'string') {
                                    opts = q.options.split(',');
                                  }
                                }
                                return { text: q.text, options: opts, answer: q.answer, points: q.points || 1 };
                              });
                              setQuestions(mapped);
                              setTargetMaxScore(mapped.reduce((s, q) => s + q.points, 0));
                            } else {
                              setQuestions([{ text: "", options: ["", "", "", ""], answer: "", points: 1 }]);
                              setTargetMaxScore(100);
                            }
                            setShowModal(true);
                          }}
                        >
                          {exam.title}
                        </h4>
                        
                        <span className={`inline-flex px-2 py-0.5 text-[9px] sm:text-[10px] font-black tracking-wider uppercase rounded-md border ${
                          exam.status === 'PUBLISHED' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/30' 
                            : 'bg-amber-50 text-amber-700 border-amber-200/30'
                        }`}>
                          {exam.status === 'PUBLISHED' ? localIdt('បានផ្សាយ', 'Published') : localIdt('ព្រាងទុក', 'Draft')}
                        </span>
                      </div>

                      {/* Subject & Grade Badges */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border flex items-center gap-1 ${subStyle.badgeBg} ${subStyle.badgeText} ${subStyle.badgeBorder}`}>
                          <BookOpen className="w-3 h-3" />
                          <span>{meta.subject}</span>
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md border bg-slate-100/80 text-slate-700 border-slate-200/60 flex items-center gap-1">
                          <Award className="w-3 h-3 text-slate-500" />
                          <span>{meta.gradeLevel}</span>
                        </span>
                      </div>
                      
                      {meta.description && (
                        <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-2xl line-clamp-1">
                          {meta.description}
                        </p>
                      )}
                      
                      {/* Meta information tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-slate-400 text-[10px] font-bold font-mono">
                        <div className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded-md border border-slate-100 transition-colors">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600 font-extrabold">{exam.duration} {localIdt("នាទី", "Mins")}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded-md border border-slate-100 transition-colors">
                          <BookOpen className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600 font-extrabold">{qCount} {localIdt("សំណួរ", "Questions")}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50/80 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200/60 transition-colors">
                          <Award className="w-3 h-3 text-amber-500" />
                          <span className="text-amber-800 font-extrabold">{exam.questions ? exam.questions.reduce((sum, q) => sum + (q.points || 1), 0) : 0} {localIdt("ពិន្ទុសរុប", "Total Pts")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons section */}
                  <div className="flex flex-wrap items-center gap-1 self-end md:self-auto border-t md:border-t-0 border-slate-100 pt-1.5 md:pt-0 w-full md:w-auto justify-end shrink-0">
                    {/* Instant Test Link for Teachers */}
                    <button 
                      type="button"
                      onClick={() => setActivePracticeExamId(exam.id)}
                      className="flex items-center gap-1 px-2 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 rounded-lg text-[11px] font-black transition-all cursor-pointer shadow-3xs"
                      title={localIdt("សាកល្បងធ្វើវិញ្ញាសានេះភ្លាមៗ (Teacher Instant Test)", "Open and test this practice exam instantly")}
                    >
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                      <span>{localIdt("សាកល្បងភ្លាមៗ", "Test Now")}</span>
                    </button>

                    {/* Shareable Link for Students */}
                    <button 
                      onClick={() => {
                        const link = `${window.location.origin}/?practice_exam=${exam.id}`;
                        try {
                          navigator.clipboard.writeText(link);
                        } catch (e) {
                          const textArea = document.createElement("textarea");
                          textArea.value = link;
                          document.body.appendChild(textArea);
                          textArea.select();
                          document.execCommand("copy");
                          document.body.removeChild(textArea);
                        }
                        setCopiedId(exam.id);
                        setShareModalExam(exam);
                        if (showToast) {
                          showToast(
                            localLang === "kh" 
                              ? "បានចម្លងតំណភ្ជាប់សិស្ស! សូមពិនិត្យផ្ទាំងព័ត៌មានចែករំលែក" 
                              : "Student link copied! Check share dialog details.", 
                            "info"
                          );
                        }
                        setTimeout(() => setCopiedId(null), 3000);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-blue-600 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/10 hover:border-blue-200/50 rounded-lg text-[11px] font-black transition-all cursor-pointer shadow-3xs"
                      title={localIdt("ចម្លងតំណភ្ជាប់ និងបើកផ្ទាំងចែករំលែកទៅសិស្ស (Public Student Link)", "Copy link & open share dialog for students")}
                    >
                      {copiedId === exam.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">{localIdt("បានចម្លង", "Copied")}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          <span>{localIdt("តំណភ្ជាប់សិស្ស", "Student Link")}</span>
                        </>
                      )}
                    </button>

                    {/* View Student Scores & Submissions Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedExamForResults(exam)}
                      className="flex items-center gap-1 px-2 py-1 text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg text-[11px] font-black transition-all cursor-pointer shadow-3xs"
                      title={localIdt("ស្រង់ពិន្ទុ & មើលលទ្ធផលសិស្សដែលបានប្រឡង", "Extract scores & view student submissions")}
                    >
                      <Users className="w-3 h-3 text-amber-600" />
                      <span>{localIdt("ស្រង់ពិន្ទុសិស្ស", "Student Scores")}</span>
                      {getExamSubmissions(exam.id).length > 0 && (
                        <span className="px-1.5 py-0.5 text-[9px] bg-amber-600 text-white font-mono font-black rounded-full">
                          {getExamSubmissions(exam.id).length}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedExam(exam);
                        setTitle(exam.title);
                        setSubject(exam.subject || "រូបវិទ្យា");
                        setGradeLevel(exam.gradeLevel || "ថ្នាក់ទី១២");
                        setDescription(exam.description || "");
                        setDuration(exam.duration);
                        setStatus(exam.status);
                        if (exam.questions && exam.questions.length > 0) {
                          const mapped = exam.questions.map(q => {
                            let opts = ["", "", "", ""];
                            try {
                              opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                            } catch (e) {
                              if (typeof q.options === 'string') {
                                opts = q.options.split(',');
                              }
                            }
                            return { text: q.text, options: opts, answer: q.answer, points: q.points || 1 };
                          });
                          setQuestions(mapped);
                          setTargetMaxScore(mapped.reduce((s, q) => s + q.points, 0));
                        } else {
                          setQuestions([{ text: "", options: ["", "", "", ""], answer: "", points: 1 }]);
                          setTargetMaxScore(100);
                        }
                        setShowModal(true);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-blue-600 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/10 hover:border-blue-200/50 rounded-lg text-[11px] font-black transition-all cursor-pointer shadow-3xs"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{localIdt("កែសម្រួល", "Edit")}</span>
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(exam.id)}
                      className="flex items-center gap-1 px-2 py-1 text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/10 hover:border-rose-200/50 rounded-lg text-[11px] font-black transition-all cursor-pointer shadow-3xs"
                      title={localIdt("លុបវិញ្ញាសា", "Delete Exam")}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{localIdt("លុប", "Delete")}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/50 backdrop-blur-md transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.2rem] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-200/80 ring-1 ring-slate-950/5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-4.5 flex items-center justify-between border-b border-slate-100 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/60 shadow-3xs">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base sm:text-lg">
                    {selectedExam ? localIdt("កែប្រែការប្រឡង", "Edit Exam") : localIdt("បង្កើតការប្រឡងថ្មី", "Create New Exam")}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {localIdt("កំណត់ព័ត៌មានទូទៅ និងកម្រងសំណួរសម្រាប់ប្រឡងអនឡាញ", "Configure exam settings and questions")}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowModal(false)} 
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              <div className="overflow-y-auto flex-1 p-4 sm:p-6 bg-slate-50/50">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.8fr] gap-5 lg:gap-6 items-start">
                  
                  {/* Left Column: General Settings */}
                  <div className="space-y-4 lg:sticky lg:top-0">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                        <Settings className="w-4 h-4 text-slate-500" />
                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">{localIdt("ព័ត៌មានទូទៅ", "General Info")}</h4>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          {localIdt("ចំណងជើងការប្រឡង", "Exam Title")} <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={title} 
                          onChange={e => setTitle(e.target.value)} 
                          required 
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800 text-sm placeholder-slate-400"
                          placeholder={localIdt("ឧ. ការប្រឡងឆមាសទី១ ថ្នាក់ទី១២", "e.g., Semester Exam")}
                        />
                      </div>

                      {/* Subject Selection */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          {localIdt("មុខវិជ្ជា / ជំនាញ", "Subject")}
                        </label>
                        <SubjectDropdown
                          value={subject}
                          onChange={(val) => setSubject(val)}
                          allowManage={true}
                        />
                      </div>

                      {/* Grade Level Selection */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          {localIdt("កម្រិតសិក្សា / ថ្នាក់", "Grade Level")}
                        </label>
                        <GradeLevelDropdown
                          value={gradeLevel}
                          onChange={(val) => setGradeLevel(val)}
                          allowManage={true}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">{localIdt("ការពិពណ៌នា", "Description")}</label>
                        <textarea 
                          value={description} 
                          onChange={e => setDescription(e.target.value)} 
                          rows={2}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none font-medium text-slate-700 text-xs sm:text-sm placeholder-slate-400"
                          placeholder={localIdt("ពណ៌នាខ្លីៗ...", "Short description...")}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">{localIdt("រយៈពេល (នាទី)", "Duration (Mins)")}</label>
                          <div className="relative">
                            <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                              type="number" 
                              value={duration} 
                              onChange={e => setDuration(parseInt(e.target.value) || 0)} 
                              required 
                              min={1}
                              className="w-full pl-9 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 text-center text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">{localIdt("ស្ថានភាព", "Status")}</label>
                          <StatusDropdown 
                            value={status} 
                            onChange={setStatus} 
                            localIdt={localIdt} 
                          />
                        </div>
                      </div>

                      {/* Clean Light Score Configuration Card */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                            <Award className="w-4 h-4 text-amber-500" />
                            {localIdt("ពិន្ទុពេញ (Max Target)", "Max Target Score")}
                          </span>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-3xs">
                            <input 
                              type="number"
                              min={1}
                              max={1000}
                              value={targetMaxScore}
                              onChange={e => setTargetMaxScore(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-12 text-center font-black font-mono text-slate-800 text-xs focus:outline-none"
                            />
                            <span className="text-[10px] font-bold text-slate-400">{localIdt("ពិន្ទុ", "pts")}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500">{localIdt("ពិន្ទុសរុបបច្ចុប្បន្ន៖", "Total Questions Score:")}</span>
                          <span className={`font-mono font-black px-2 py-0.5 rounded-md border text-xs ${
                            questions.reduce((sum, q) => sum + (q.points || 1), 0) === targetMaxScore
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {questions.reduce((sum, q) => sum + (q.points || 1), 0)} / {targetMaxScore}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => distributeEqually(targetMaxScore)}
                          className="w-full text-center py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{localIdt(`បែងចែកស្មើគ្នា (${targetMaxScore} ពិន្ទុ)`, `Balance All to ${targetMaxScore} Pts`)}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Preset Sample Quiz Loader */}
                    <button
                      type="button"
                      onClick={() => {
                        setTitle(localIdt("វិញ្ញាសាតេស្តចំណេះដឹងទូទៅ", "General Knowledge Quiz"));
                        setDescription(localIdt("វិញ្ញាសាតេស្តចំណេះដឹងទូទៅស្តីពីភូមិវិទ្យា ប្រវត្តិសាស្ត្រ និងវប្បធម៌ទូទៅ។", "General trivia quiz."));
                        setDuration(30);
                        setTargetMaxScore(15);
                        setQuestions([
                          {
                            text: localIdt("តើប្រាសាទអង្គរវត្តស្ថិតនៅក្នុងខេត្តណា?", "In which Cambodian province is Angkor Wat located?"),
                            options: [
                              localIdt("សៀមរាប", "Siem Reap"),
                              localIdt("ភ្នំពេញ", "Phnom Penh"),
                              localIdt("បាត់ដំបង", "Battambang"),
                              localIdt("កំពង់ចាម", "Kampong Cham")
                            ],
                            answer: localIdt("សៀមរាប", "Siem Reap"),
                            points: 5
                          },
                          {
                            text: localIdt("តើទន្លេណាវែងជាងគេបំផុតនៅលើពិភពលោក?", "Which is the longest river in the world?"),
                            options: [
                              localIdt("ទន្លេនីល (Nile River)", "Nile River"),
                              localIdt("ទន្លេអាម៉ាហ្សូន (Amazon River)", "Amazon River"),
                              localIdt("ទន្លេមេគង្គ (Mekong River)", "Mekong River"),
                              localIdt("ទន្លេយ៉ង់ស្វ៊ែរ (Yangtze River)", "Yangtze River")
                            ],
                            answer: localIdt("ទន្លេនីល (Nile River)", "Nile River"),
                            points: 5
                          },
                          {
                            text: localIdt("តើភ្នំណាដែលខ្ពស់ជាងគេបំផុតនៅលើភពផែនដី?", "Which is the tallest mountain on Earth?"),
                            options: [
                              localIdt("ភ្នំអេវឺរ៉េស (Mount Everest)", "Mount Everest"),
                              localIdt("ភ្នំ K2", "Mount K2"),
                              localIdt("ភ្នំហ្វូជី (Mount Fuji)", "Mount Fuji"),
                              localIdt("ភ្នំគីលីម៉ាន់ចារ៉ូ (Kilimanjaro)", "Mount Kilimanjaro")
                            ],
                            answer: localIdt("ភ្នំអេវឺរ៉េស (Mount Everest)", "Mount Everest"),
                            points: 5
                          }
                        ]);
                        if (showToast) {
                          showToast(localIdt("បានផ្ទុកសំណួរគំរូចំនួន ៣ រួចរាល់!", "Sample questions loaded!"), "info");
                        }
                      }}
                      className="w-full text-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-blue-200/60"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>{localIdt("ផ្ទុកសំណួរគំរូទូទៅ", "Load Sample Quiz")}</span>
                    </button>
                  </div>

                  {/* Right Column: Questions Panel */}
                  <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-3xs overflow-hidden w-full">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                          <List className="w-4 h-4" />
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
                          {localIdt("កម្រងសំណួរ", "Questions")} ({questions.length})
                        </h4>
                      </div>
                      
                      <button 
                        type="button" 
                        onClick={() => setQuestions([...questions, { text: "", options: ["", "", "", ""], answer: "", points: 1 }])} 
                        className="text-xs font-black px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> 
                        <span>{localIdt("ថែមសំណួរថ្មី", "Add Question")}</span>
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-4 overflow-y-auto bg-slate-50/30 max-h-[calc(80vh-180px)]">
                      {questions.map((q, qIdx) => (
                        <div 
                          key={qIdx} 
                          className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-3 relative shadow-3xs hover:border-slate-300 transition-all"
                        >
                          {/* Header of Question Item */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-blue-50/80 text-blue-700 text-xs font-bold rounded-lg border-none">
                                {localIdt(`សំណួរទី ${qIdx + 1}`, `Q${qIdx + 1}`)}
                              </span>

                              {/* Question Points Selector */}
                              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100/70 px-2.5 py-1 rounded-lg border-none">
                                <span>{localIdt("ពិន្ទុ៖", "Pts:")}</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={100}
                                  value={q.points ?? 1}
                                  onChange={e => {
                                    const val = Math.max(1, parseInt(e.target.value) || 1);
                                    const newQ = [...questions];
                                    newQ[qIdx].points = val;
                                    setQuestions(newQ);
                                  }}
                                  className="w-10 px-1 py-0.5 bg-white border-none rounded text-center font-extrabold text-slate-800 text-xs outline-none shadow-3xs"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {/* Move Up */}
                              {qIdx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const copy = [...questions];
                                    const temp = copy[qIdx - 1];
                                    copy[qIdx - 1] = copy[qIdx];
                                    copy[qIdx] = temp;
                                    setQuestions(copy);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer text-xs"
                                  title={localIdt("រំកិលឡើងលើ", "Move Up")}
                                >
                                  ▲
                                </button>
                              )}
                              {/* Move Down */}
                              {qIdx < questions.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const copy = [...questions];
                                    const temp = copy[qIdx + 1];
                                    copy[qIdx + 1] = copy[qIdx];
                                    copy[qIdx] = temp;
                                    setQuestions(copy);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer text-xs"
                                  title={localIdt("រំកិលចុះក្រោម", "Move Down")}
                                >
                                  ▼
                                </button>
                              )}
                              {/* Duplicate Question */}
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...questions];
                                  copy.splice(qIdx + 1, 0, {
                                    text: q.text ? `${q.text} (${localIdt("ចម្លង", "Copy")})` : "",
                                    options: [...q.options],
                                    answer: q.answer,
                                    points: q.points || 1
                                  });
                                  setQuestions(copy);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer"
                                title={localIdt("ចម្លងសំណួរនេះ", "Duplicate")}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Question */}
                              {questions.length > 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))} 
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all cursor-pointer" 
                                  title={localIdt("លុបសំណួរនេះ", "Delete")}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Question Input */}
                          <div className="space-y-1">
                            <input 
                              type="text" 
                              value={q.text} 
                              onChange={e => { const newQ = [...questions]; newQ[qIdx].text = e.target.value; setQuestions(newQ); }} 
                              spellCheck={false}
                              autoComplete="off"
                              className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none no-underline shadow-none transition-all text-slate-800 placeholder-slate-400" 
                              placeholder={localIdt("វាយបញ្ចូលសំណួរ...", "Enter question text...")} 
                              required 
                            />
                          </div>
                          
                          {/* Options Grid */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                {localIdt("ជម្រើសចម្លើយ (ចុចលើរង្វង់ដើម្បីជ្រើសរើសចម្លើយត្រូវ)", "Options (Click circle for correct answer)")}
                              </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, oIdx) => {
                                const letter = String.fromCharCode(65 + oIdx);
                                const isCorrect = q.answer === opt && opt !== "";

                                return (
                                  <div 
                                    key={oIdx} 
                                    className={`relative flex items-center border rounded-xl p-1 transition-all ${
                                      isCorrect
                                        ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/10"
                                        : "border-slate-200 bg-slate-50/40 hover:border-slate-300"
                                    }`}
                                  >
                                    {/* Letter badge */}
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ml-1 ${
                                      isCorrect
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-200/80 text-slate-600"
                                    }`}>
                                      {letter}
                                    </div>

                                    {/* Input field */}
                                    <input 
                                      type="text" 
                                      value={opt} 
                                      onChange={e => { 
                                        const newQ = [...questions]; 
                                        const oldOptVal = newQ[qIdx].options[oIdx];
                                        newQ[qIdx].options[oIdx] = e.target.value; 
                                        if (newQ[qIdx].answer === oldOptVal) {
                                          newQ[qIdx].answer = e.target.value;
                                        }
                                        setQuestions(newQ); 
                                      }} 
                                      spellCheck={false}
                                      autoComplete="off"
                                      className="w-full px-2 py-1.5 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none ring-0 shadow-none no-underline text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400" 
                                      placeholder={localIdt(`ជម្រើសទី ${oIdx + 1}`, `Option ${oIdx + 1}`)} 
                                      required 
                                    />

                                    {/* Radio select correct answer */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newQ = [...questions];
                                        newQ[qIdx].answer = opt;
                                        setQuestions(newQ);
                                      }}
                                      title={isCorrect ? "ចម្លើយត្រូវ" : "កំណត់ជាចម្លើយត្រូវ"}
                                      className={`p-1 rounded-md flex-shrink-0 mr-1 transition-all cursor-pointer ${
                                        isCorrect 
                                          ? "bg-emerald-600 text-white" 
                                          : "text-slate-300 hover:text-emerald-600 hover:bg-emerald-50"
                                      }`}
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer Actions */}
              <div className="px-6 sm:px-8 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between z-10">
                <div className="text-xs font-bold text-slate-400 hidden sm:block">
                  {questions.length} {localIdt("សំណួរក្នុងវិញ្ញាសា", "questions total")}
                </div>
                <div className="flex items-center gap-2.5 ml-auto">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold hover:bg-slate-100 rounded-xl transition-all cursor-pointer text-xs sm:text-sm"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all flex items-center gap-2 shadow-3xs cursor-pointer text-xs sm:text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>{localIdt("រក្សាទុកវិញ្ញាសា", "Save Exam")}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Beautiful Custom React-State Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-5 border border-rose-100">
              <Trash2 className="w-8 h-8 animate-bounce-subtle" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">{localIdt("តើអ្នកពិតជាចង់លុបវិញ្ញាសានេះមែនទេ?", "Are you sure you want to delete this exam?")}</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {localIdt("ការលុបនេះនឹងដកសំណួរទាំងអស់ និងលទ្ធផលប្រឡងរបស់សិស្សដែលពាក់ព័ន្ធទាំងអស់ចេញពីប្រព័ន្ធជាអចិន្ត្រៃយ៍។ សកម្មភាពនេះមិនអាចត្រឡប់ថយក្រោយវិញបានឡើយ។", "This deletion will permanently remove all questions and associated student results. This action cannot be undone.")}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm"
              >
                {localIdt("បោះបង់", "Cancel")}
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(deleteConfirmId)}
                className="flex-1 py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all text-sm"
              >
                {localIdt("យល់ព្រមលុប", "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Student Scores & Submissions Modal */}
      {selectedExamForResults && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/20">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider rounded-lg border border-amber-200/50">
                    {localIdt("តារាងស្រង់ពិន្ទុ & លទ្ធផលប្រឡង", "Student Score Sheet & Results")}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 line-clamp-1 mt-0.5">
                    {selectedExamForResults.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedExamForResults(null);
                  setSelectedStudentSubmission(null);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-slate-50/40">
              
              {/* Stat Cards */}
              {(() => {
                const subs = getExamSubmissions(selectedExamForResults.id);
                const totalSubs = subs.length;
                const questionPointsSum = selectedExamForResults.questions 
                  ? selectedExamForResults.questions.reduce((sum, q) => sum + (q.points || 1), 0)
                  : 0;
                
                const totalPossible = selectedExamForResults.targetMaxScore 
                  || selectedExamForResults.totalPoints 
                  || (subs.length > 0 && subs[0].totalPoints ? subs[0].totalPoints : 0)
                  || (questionPointsSum > 0 ? questionPointsSum : 100);
                
                const avgScore = totalSubs > 0 
                  ? Math.round((subs.reduce((s, item) => s + item.score, 0) / totalSubs) * 10) / 10 
                  : 0;
                const avgPercent = totalPossible > 0 ? Math.round((avgScore / totalPossible) * 100) : 0;
                
                const maxScore = totalSubs > 0 ? Math.max(...subs.map(item => item.score)) : 0;
                const passedCount = subs.filter(item => (item.score / (item.totalPoints || totalPossible)) >= 0.5).length;
                const passRate = totalSubs > 0 ? Math.round((passedCount / totalSubs) * 100) : 0;

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-3xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {localIdt("សិស្សប្រឡងសរុប", "Total Submissions")}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black font-mono text-slate-800">{totalSubs}</span>
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-3xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {localIdt("ពិន្ទុមធ្យមភាគ", "Class Average")}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black font-mono text-blue-600">{avgScore} / {totalPossible}</span>
                        <span className="text-xs font-extrabold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">{avgPercent}%</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-3xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {localIdt("ពិន្ទុខ្ពស់បំផុត", "Highest Score")}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black font-mono text-emerald-600">{maxScore} / {totalPossible}</span>
                        <Award className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-3xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {localIdt("អត្រាជាប់ (≥50%)", "Pass Rate")}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black font-mono text-amber-600">{passRate}%</span>
                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Filter & Export Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-3xs">
                {/* Search student name */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={localIdt("ស្វែងរកតាមឈ្មោះសិស្ស...", "Search student name...")}
                    value={resultSearchQuery}
                    onChange={e => setResultSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white pl-10 pr-4 py-2 text-xs font-bold rounded-xl outline-none transition-all"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={resultFilterStatus}
                  onChange={e => setResultFilterStatus(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl outline-none cursor-pointer"
                >
                  <option value="ALL">{localIdt("គ្រប់លទ្ធផល (All)", "All Results")}</option>
                  <option value="PASSED">{localIdt("ជាប់ (≥50%)", "Passed")}</option>
                  <option value="FAILED">{localIdt("ធ្លាក់ (<50%)", "Needs Improvement")}</option>
                </select>

                {/* Copy / Export to Excel Button */}
                <button
                  type="button"
                  onClick={() => {
                    const subs = getExamSubmissions(selectedExamForResults.id);
                    if (subs.length === 0) {
                      if (showToast) showToast(localIdt("មិនទាន់មានលទ្ធផលសិស្សសម្រាប់ស្រង់ចេញទេ", "No student results to export yet"), "warning");
                      return;
                    }
                    const header = `${localIdt("ឈ្មោះសិស្ស", "Student Name")}\t${localIdt("កាលបរិច្ឆេទប្រឡង", "Date & Time")}\t${localIdt("ពិន្ទុទទួលបាន", "Score")}\t${localIdt("ពិន្ទុពេញ", "Total Points")}\t${localIdt("ភាគរយ", "Percentage")}\t${localIdt("និទ្ទេស", "Grade")}`;
                    const rows = subs.map((s: any) => {
                      const total = s.totalPoints || 1;
                      const pct = Math.round((s.score / total) * 100);
                      const gInfo = calculateGrade(s.score, total);
                      const timeStr = new Date(s.submittedAt).toLocaleString('km-KH');
                      return `${s.studentName}\t${timeStr}\t${s.score}\t${total}\t${pct}%\t${gInfo.grade}`;
                    });
                    const tsv = [header, ...rows].join("\n");
                    navigator.clipboard.writeText(tsv);
                    if (showToast) {
                      showToast(localIdt("បានចម្លងតារាងស្រង់ពិន្ទុសម្រាប់ Paste ចូល Excel / Word ដោយជោគជ័យ!", "Copied score sheet formatted for Excel / Word export!"), "success");
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{localIdt("ចម្លងតារាងស្រង់ពិន្ទុ Excel", "Copy Score Register (Excel)")}</span>
                </button>
              </div>

              {/* Submissions Table */}
              <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-3xs">
                {(() => {
                  let subs = getExamSubmissions(selectedExamForResults.id);
                  if (resultSearchQuery.trim()) {
                    subs = subs.filter(s => s.studentName?.toLowerCase().includes(resultSearchQuery.toLowerCase()));
                  }
                  if (resultFilterStatus === "PASSED") {
                    subs = subs.filter(s => (s.score / (s.totalPoints || 1)) >= 0.5);
                  } else if (resultFilterStatus === "FAILED") {
                    subs = subs.filter(s => (s.score / (s.totalPoints || 1)) < 0.5);
                  }

                  if (subs.length === 0) {
                    return (
                      <div className="p-12 text-center space-y-3">
                        <Award className="w-12 h-12 text-slate-300 mx-auto" />
                        <p className="text-sm font-extrabold text-slate-600">
                          {localIdt("មិនទាន់មានសិស្សបំពេញវិញ្ញាសានេះនៅឡើយទេ", "No students have completed this exam yet.")}
                        </p>
                        <p className="text-xs text-slate-400">
                          {localIdt("នៅពេលសិស្សចុចធ្វើតេស្តតាម 'តំណភ្ជាប់សិស្ស' លទ្ធផលនឹងបង្ហាញនៅទីនេះភ្លាមៗ។", "When students complete the exam via the student link, their real scores will appear here instantly.")}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200/60 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            <th className="py-3.5 px-4 text-center">#</th>
                            <th className="py-3.5 px-4">{localIdt("ឈ្មោះសិស្ស", "Student Name")}</th>
                            <th className="py-3.5 px-4">{localIdt("កាលបរិច្ឆេទប្រឡង", "Submitted Date/Time")}</th>
                            <th className="py-3.5 px-4 text-center">{localIdt("ពិន្ទុទទួលបាន", "Score")}</th>
                            <th className="py-3.5 px-4 text-center">{localIdt("ភាគរយ & និទ្ទេស", "Grade / Status")}</th>
                            <th className="py-3.5 px-4 text-right">{localIdt("សកម្មភាព", "Actions")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                          {subs.map((sub: any, idx: number) => {
                            const totalPts = sub.totalPoints || 1;
                            const gInfo = calculateGrade(sub.score, totalPts);
                            const timeStr = new Date(sub.submittedAt).toLocaleString('km-KH', {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            });

                            return (
                              <tr key={sub.id || idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-extrabold">{idx + 1}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-black flex items-center justify-center text-xs">
                                      {sub.studentName ? sub.studentName.charAt(0) : "S"}
                                    </div>
                                    <span className="font-extrabold text-slate-800 text-sm">{sub.studentName}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 font-medium">{timeStr}</td>
                                <td className="py-3.5 px-4 text-center font-mono font-black text-slate-900 text-sm">
                                  <span className="text-blue-600">{sub.score}</span> / {totalPts}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-black border ${gInfo.color}`}>
                                    {gInfo.pct}% • {gInfo.grade}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedStudentSubmission(sub)}
                                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
                                      title={localIdt("មើលចម្លើយដែលសិស្សបានជ្រើសរើសតាមសំណួរនីមួយៗ", "View question-by-question student choices")}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>{localIdt("មើលចម្លើយលម្អិត", "View Answers")}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const allLocal = JSON.parse(localStorage.getItem("plc_local_exam_submissions") || "[]");
                                        const updated = allLocal.filter((s: any) => s.id !== sub.id);
                                        localStorage.setItem("plc_local_exam_submissions", JSON.stringify(updated));
                                        loadSubmissions();
                                        if (showToast) showToast(localIdt("បានលុបលទ្ធផលសិស្សរួចរាល់", "Student result deleted"), "info");
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                      title={localIdt("លុបលទ្ធផលនេះ", "Delete submission")}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedExamForResults(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
              >
                {localIdt("បិទផ្ទាំង", "Close")}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Student Question Answers Detail Modal */}
      {selectedStudentSubmission && selectedExamForResults && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center shadow-md text-sm">
                  {selectedStudentSubmission.studentName ? selectedStudentSubmission.studentName.charAt(0) : "S"}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">
                    {localIdt("ពិនិត្យចម្លើយរបស់សិស្ស", "Student Answer Breakdown")}
                  </span>
                  <h3 className="text-lg font-black text-slate-800">
                    {selectedStudentSubmission.studentName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentSubmission(null)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-slate-50/30">
              
              {/* Student Performance Banner */}
              {(() => {
                const answersObj = typeof selectedStudentSubmission.answers === 'string'
                  ? JSON.parse(selectedStudentSubmission.answers || '{}')
                  : selectedStudentSubmission.answers || {};
                
                const questionsList = selectedExamForResults.questions || [];
                const totalPossible = selectedStudentSubmission.totalPoints || 1;
                const pct = Math.round((selectedStudentSubmission.score / totalPossible) * 100);
                const gInfo = calculateGrade(selectedStudentSubmission.score, totalPossible);

                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-3xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {localIdt("ពិន្ទុទទួលបាន / ពិន្ទុពេញ", "Achieved Score")}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black font-mono text-blue-600">{selectedStudentSubmission.score}</span>
                          <span className="text-slate-400 font-mono font-bold">/ {totalPossible} {localIdt("ពិន្ទុ", "pts")}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl text-xs font-black border ${gInfo.color}`}>
                          {pct}% • {gInfo.labelKh}
                        </div>
                      </div>
                    </div>

                    {/* Questions List with Student Answers */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                        <FileQuestion className="w-4 h-4 text-blue-600" />
                        <span>{localIdt("លម្អិតចម្លើយតាមសំណួរនីមួយៗ", "Question-by-Question Response Details")}</span>
                      </h4>

                      {questionsList.map((q: Question, qIdx: number) => {
                        const studentChosen = answersObj[q.id] || answersObj[qIdx];
                        const isCorrect = studentChosen === q.answer;
                        const pts = q.points || 1;

                        return (
                          <div
                            key={q.id || qIdx}
                            className={`p-5 rounded-2xl bg-white border space-y-3 transition-all ${
                              isCorrect ? "border-emerald-200 shadow-3xs" : "border-rose-200 shadow-3xs"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <span className={`w-6 h-6 rounded-lg text-xs font-black font-mono flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                }`}>
                                  {qIdx + 1}
                                </span>
                                <p className="font-extrabold text-slate-800 text-sm leading-snug">
                                  {q.text}
                                </p>
                              </div>

                              <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border flex-shrink-0 ${
                                isCorrect ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}>
                                {isCorrect ? `+${pts} ${localIdt("ពិន្ទុ (ត្រូវ)", "pts (Correct)")}` : `0 / ${pts} ${localIdt("ពិន្ទុ (ខុស)", "pts (Incorrect)")}`}
                              </span>
                            </div>

                            {/* Display Student Selected Choice */}
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {localIdt("ចម្លើយដែលសិស្សបានជ្រើសរើស៖", "Student Selected:")}
                              </span>
                              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                                isCorrect ? "bg-emerald-50/70 border-emerald-300 text-emerald-900" : "bg-rose-50/70 border-rose-300 text-rose-900"
                              }`}>
                                <span>{studentChosen || localIdt("(សិស្សមិនបានឆ្លើយ)", "(Not Answered)")}</span>
                                {isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                ) : (
                                  <X className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                )}
                              </div>
                            </div>

                            {/* If incorrect, display correct answer */}
                            {!isCorrect && (
                              <div className="space-y-1 pt-1">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                                  {localIdt("ចម្លើយត្រឹមត្រូវគឺ៖", "Correct Answer:")}
                                </span>
                                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-900 text-xs font-bold flex items-center justify-between">
                                  <span>{q.answer}</span>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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

            <div className="px-8 py-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudentSubmission(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
              >
                {localIdt("ត្រឡប់ទៅតារាងពិន្ទុ", "Back to Score Sheet")}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Student Share Link Modal */}
      {shareModalExam && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.2rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 ring-1 ring-slate-950/5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/50 shadow-3xs">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base sm:text-lg">
                    {localIdt("តំណភ្ជាប់សម្រាប់ចែករំលែកទៅសិស្ស", "Student Practice & Exam Link")}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400">
                    {localIdt("សិស្សចុចលើ Link នេះដើម្បីចូលធ្វើតេស្តភ្លាមៗដោយមិនបាច់ Log In", "Students click this link to take the test instantly without logging in")}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShareModalExam(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 bg-slate-50/50">
              
              {/* Exam Details Card */}
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-3xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {parseExamMeta(shareModalExam).subject}
                  </span>
                  <span className="text-xs font-mono font-black text-slate-500">
                    ID: {shareModalExam.id}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {shareModalExam.title}
                </h4>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {shareModalExam.duration} {localIdt("នាទី", "Mins")}</span>
                  <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-blue-500" /> {shareModalExam.questions?.length || 0} {localIdt("សំណួរ", "Questions")}</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-emerald-500" /> {parseExamMeta(shareModalExam).gradeLevel}</span>
                </div>
              </div>

              {/* Share Link Field */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  {localIdt("តំណភ្ជាប់ប្រឡងអនឡាញ (Public Direct URL)", "Public Exam Direct Link")}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      readOnly
                      value={`${window.location.origin}/?practice_exam=${shareModalExam.id}`}
                      className="w-full pl-3 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold text-blue-900 select-all outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/?practice_exam=${shareModalExam.id}`;
                      
                      try {
                        navigator.clipboard.writeText(link);
                      } catch (e) {
                        const textArea = document.createElement("textarea");
                        textArea.value = link;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textArea);
                      }

                      setCopiedId(shareModalExam.id);
                      if (showToast) {
                        showToast(localIdt("បានចម្លងតំណភ្ជាប់សិស្សរួចរាល់!", "Student share link copied to clipboard!"), "success");
                      }
                      setTimeout(() => setCopiedId(null), 3000);
                    }}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm flex-shrink-0"
                  >
                    {copiedId === shareModalExam.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>{localIdt("បានចម្លង!", "Copied!")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{localIdt("ចម្លង Link", "Copy Link")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons: Open in New Tab & Test Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const link = `${window.location.origin}/?practice_exam=${shareModalExam.id}`;
                    window.open(link, '_blank');
                  }}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{localIdt("បើកក្នុង Tab ថ្មី (Open in New Tab)", "Open Link in New Tab")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const examId = shareModalExam.id;
                    setShareModalExam(null);
                    setActivePracticeExamId(examId);
                  }}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{localIdt("សាកល្បងប្រឡងក្នុងប្រព័ន្ធ", "Test Portal Directly")}</span>
                </button>
              </div>

              {/* Informational Tip */}
              <div className="p-3 bg-blue-50/80 border border-blue-200/60 rounded-xl text-xs font-semibold text-blue-900 leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  {localIdt(
                    "អ្នកអាចផ្ញើតំណភ្ជាប់នេះតាម Telegram, Facebook, ឬ Google Classroom។ សិស្សគ្រាន់តែចុចលើ Link ហើយបញ្ចូលឈ្មោះ រួចចាប់ផ្តើមប្រឡងបានភ្លាមៗ!",
                    "Share this link via Telegram, Facebook, or Google Classroom. Students simply enter their name and start the exam right away!"
                  )}
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShareModalExam(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
              >
                {localIdt("បិទ", "Close")}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Full screen Practice Exam Overlay */}
      {activePracticeExamId && (
        <div className="fixed inset-0 z-[120] bg-white overflow-y-auto">
          <PracticePortal 
            examId={activePracticeExamId} 
            onBack={() => setActivePracticeExamId(null)} 
          />
        </div>
      )}
    </div>
  );
}
