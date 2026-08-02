import React, { useState, useEffect, useRef } from "react";
import { generatePDF } from "../../lib/pdf-generator";
import { 
  Award, Search, Printer, Plus, Trash2, X, Save, Edit, 
  Sparkles, TrendingUp, GraduationCap, Calendar, BookOpen, 
  FileDown, CheckCircle2, AlertCircle, RefreshCw, ListFilter,
  ArrowUpDown, Filter, BarChart3, Star, Check, AlertTriangle, Users,
  ChevronDown
} from "lucide-react";
import SearchableSelect from "../SearchableSelect";
import { motion, AnimatePresence } from "motion/react";

export default function GradingTab({ students = [], token, uiLang: propUiLang, courseOptions = [] }: any) {
  const [localLang, setLocalLang] = useState(propUiLang || localStorage.getItem("plc_lang") || "kh");

  useEffect(() => {
    if (propUiLang) {
      setLocalLang(propUiLang);
    }
  }, [propUiLang]);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setLocalLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  const uiLang = localLang;

  const [scores, setScores] = useState<any[]>([]);
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [dbCourses, setDbCourses] = useState<any[]>([]);

  const actualCourseOptions = dbCourses.length > 0
    ? dbCourses.map((c: any) => c.title).filter(Boolean)
    : courseOptions;

  const availableSubjects = Array.from(new Set([
    ...actualCourseOptions,
    ...customSubjects,
    ...students.filter((s: any) => s.status === 'STUDYING' && s.course).map((s: any) => s.course),
    ...scores.map((s: any) => s.subject)
  ])).filter(Boolean);

  const handleAddCustomSubject = (newSub: string) => {
    if (newSub && !availableSubjects.includes(newSub)) {
      setCustomSubjects(prev => [...prev, newSub]);
    }
  };

  const isCourseMatch = (studentCourse: string, selectedSubject: string) => {
    if (!studentCourse || !selectedSubject) return false;
    const sCourse = studentCourse.trim().toLowerCase();
    const selSub = selectedSubject.trim().toLowerCase();
    
    if (sCourse === selSub) return true;
    
    const clean = (str: string) => str.replace(/\b(full\s+)?course\b/g, "").trim();
    const sCourseClean = clean(sCourse);
    const selSubClean = clean(selSub);
    
    if (sCourseClean === selSubClean) return true;
    if (sCourseClean.includes(selSubClean) || selSubClean.includes(sCourseClean)) return true;
    
    return sCourse.includes(selSub) || selSub.includes(sCourse);
  };

  const idt = (kh: string, en?: string, zh?: string) => {
    if (localLang === "en") return en || kh;
    if (localLang === "zh") return zh || en || kh;
    return kh;
  };

  const [loading, setLoading] = useState(true);
  const [isRanking, setIsRanking] = useState(false);

  // Premium Analytics, Bulk Scoring, and Profile States
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [studentProfileId, setStudentProfileId] = useState<string | null>(null);
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkMonth, setBulkMonth] = useState("");
  const [bulkGrades, setBulkGrades] = useState<{[studentId: string]: string}>({});
  const [bulkSearchQuery, setBulkSearchQuery] = useState("");
  const [filterBySelectedCourse, setFilterBySelectedCourse] = useState(true);
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  useEffect(() => {
    // Reset bulk grades for the new month/subject combination to prevent bleed
    setBulkGrades({});
    
    if (bulkSubject && bulkMonth && scores.length > 0) {
      const existingGrades: { [studentId: string]: string } = {};
      scores.forEach(s => {
        if (
          s.subject && isCourseMatch(s.subject, bulkSubject) &&
          s.month === bulkMonth
        ) {
          existingGrades[s.studentId] = String(s.score);
        }
      });
      setBulkGrades(existingGrades);
    }
  }, [bulkSubject, bulkMonth, scores]);
  const [analyticsSubjectFilter, setAnalyticsSubjectFilter] = useState("all");
  const [analyticsMonthFilter, setAnalyticsMonthFilter] = useState("all");

  // Custom Dropdown states for scrollable analytics dropdowns
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
        setSubjectDropdownOpen(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setMonthDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkSubject || !bulkMonth) {
      triggerNotification(idt("សូមជ្រើសរើសវគ្គសិក្សា និងខែសិក្សា!", "Please select course and month!"), "error");
      return;
    }

    const gradesPayload = Object.entries(bulkGrades)
      .map(([studentId, score]) => ({
        studentId,
        score: score === "" ? null : Number(score)
      }))
      .filter(item => item.score !== null && !isNaN(item.score));

    if (gradesPayload.length === 0) {
      triggerNotification(idt("សូមបញ្ចូលពិន្ទុយ៉ាងហោចណាស់សម្រាប់សិស្សម្នាក់!", "Please enter score for at least one student!"), "error");
      return;
    }

    setIsBulkSaving(true);
    try {
      const res = await fetch("/api/scores/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          month: bulkMonth,
          subject: bulkSubject,
          grades: gradesPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        triggerNotification(idt(`បានរក្សាទុកពិន្ទុសិស្សចំនួន ${data.count} នាក់ និងគណនាចំណាត់ថ្នាក់ដោយជោគជ័យ!`, `Successfully saved grades for ${data.count} students and updated rankings!`), "success");
        setShowBulkModal(false);
        setBulkGrades({});
        setBulkSubject("");
        setBulkMonth("");
        fetchScores();
      } else {
        const errData = await res.json();
        triggerNotification(errData.error || idt("រក្សាទុកពិន្ទុជាក្រុមបានបរាជ័យ!", "Bulk grade saving failed!"), "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification(idt("មានបញ្ហាការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Server connection error!"), "error");
    } finally {
      setIsBulkSaving(false);
    }
  };

  const autoFillBulkGrades = () => {
    const filled: {[key: string]: string} = {};
    students.filter((s: any) => s.status === 'STUDYING').forEach((s: any) => {
      const randomScore = Math.floor(55 + Math.random() * 44);
      filled[s.id] = String(randomScore);
    });
    setBulkGrades(filled);
    triggerNotification(idt("បានបំពេញពិន្ទុគំរូដោយស្វ័យប្រវត្ត!", "Auto-filled sample scores successfully!"), "info");
  };
  
  // Interactive filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [scoreTierFilter, setScoreTierFilter] = useState("all"); // all, excellent (>=90), passing (>=50), critical (<50)
  const [sortBy, setSortBy] = useState<"name" | "score" | "rank" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dropdown open states
  const [isOpenFilterSubjectDropdown, setIsOpenFilterSubjectDropdown] = useState(false);
  const [isOpenFilterMonthDropdown, setIsOpenFilterMonthDropdown] = useState(false);
  const [isOpenFilterTierDropdown, setIsOpenFilterTierDropdown] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const triggerNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = async () => {
    if (!printRef.current) return;
    setIsPrinting(true);
    try {
      await generatePDF(printRef.current, `Grading_Report_${new Date().toISOString().split('T')[0]}.pdf`, 'portrait');
      triggerNotification(idt("បានទាញយក PDF ដោយជោគជ័យ!", "PDF downloaded successfully!"), "success");
    } catch(err) {
      console.error(err);
      triggerNotification(idt("ការទាញយក PDF បានបរាជ័យ!", "PDF download failed!"), "error");
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExportCSV = () => {
    if (scores.length === 0) {
      triggerNotification(idt("គ្មានទិន្នន័យសម្រាប់ទាញយកទេ!", "No data available to export!"), "error");
      return;
    }
    
    // CSV Header row
    const headers = [
      idt("ឈ្មោះសិស្ស", "Student Name"),
      idt("អត្តសញ្ញាណប័ណ្ណ", "Student ID"),
      idt("វគ្គសិក្សា", "Course"),
      idt("ខែសិក្សា", "Month"),
      idt("ពិន្ទុ", "Score"),
      idt("ចំណាត់ថ្នាក់", "Rank"),
      idt("និទ្ទេស", "Grade")
    ];
    
    // CSV Data rows
    const rows = sortedScores.map(s => [
      `"${getStudentName(s.student).replace(/"/g, '""')}"`,
      `"${getStudentId(s.student).replace(/"/g, '""')}"`,
      `"${s.subject.replace(/"/g, '""')}"`,
      `"${s.month.replace(/"/g, '""')}"`,
      s.score,
      s.rank || '-',
      getGradeDetails(s.score).letter
    ]);
    
    // Combine to form CSV text (using standard UTF-8 BOM so MS Excel reads Khmer script correctly)
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Grading_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification(idt("បានទាញយក CSV ដោយជោគជ័យ!", "CSV exported successfully!"), "success");
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    month: "",
    subject: "",
    score: "",
    rank: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchScores = () => {
    setLoading(true);
    fetch('/api/scores', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setScores(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        triggerNotification(idt("មិនអាចទាញយកទិន្នន័យពិន្ទុបានទេ!", "Could not fetch scores data!"), "error");
      })
      .finally(() => setLoading(false));
  };

  const fetchDbCourses = () => {
    if (!token) return;
    fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCourses(data);
        }
      })
      .catch(err => console.error("Error fetching courses in GradingTab:", err));
  };

  useEffect(() => {
    fetchScores();
    fetchDbCourses();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.month || !formData.subject || !formData.score) {
        triggerNotification(idt("សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់!", "Please fill in all required fields!"), "error");
        return;
    }
    
    try {
      const url = editingId ? `/api/scores/${editingId}` : '/api/scores';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ studentId: "", month: "", subject: "", score: "", rank: "" });
        setEditingId(null);
        triggerNotification(
          editingId 
            ? idt("កែសម្រួលពិន្ទុបានជោគជ័យ!", "Score updated successfully!") 
            : idt("បានបញ្ចូលពិន្ទុថ្មីដោយជោគជ័យ!", "New score added successfully!"),
          "success"
        );
        fetchScores();
      } else {
        const errData = await res.json();
        triggerNotification(errData.error || idt("មានបញ្ហាពេលរក្សាទុក!", "Error saving record!"), "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification(idt("មានបញ្ហាការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Server connection error!"), "error");
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/scores/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        triggerNotification(idt("បានលុបពិន្ទុដោយជោគជ័យ!", "Score deleted successfully!"), "success");
        fetchScores();
      } else {
        triggerNotification(idt("ការលុបបានបរាជ័យ!", "Deletion failed!"), "error");
      }
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      triggerNotification(idt("មានបញ្ហាការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Server connection error!"), "error");
    }
  };

  const handleCalculateRanks = async () => {
    setIsRanking(true);
    try {
      const res = await fetch("/api/scores/calculate-ranks", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        triggerNotification(idt(`បានគណនាចំណាត់ថ្នាក់ឡើងវិញសម្រាប់ពិន្ទុចំនួន ${data.updatedCount} រួចរាល់!`, `Recalculated rankings for ${data.updatedCount} scores successfully!`), "success");
        fetchScores();
      } else {
        triggerNotification(idt("ការគណនាចំណាត់ថ្នាក់បានបរាជ័យ!", "Rank calculation failed!"), "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification(idt("មានបញ្ហាការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Server connection error!"), "error");
    } finally {
      setIsRanking(false);
    }
  };

  const openEdit = (score: any) => {
    setFormData({
      studentId: score.studentId,
      month: score.month,
      subject: score.subject,
      score: String(score.score),
      rank: score.rank ? String(score.rank) : ""
    });
    setEditingId(score.id);
    setShowAddModal(true);
  };

  // Helper to format student name robustly
  const getStudentName = (student: any) => {
    if (!student) return "N/A";
    if (student.nameKh) return student.nameKh;
    if (student.lastNameKh && student.firstNameKh) return `${student.lastNameKh} ${student.firstNameKh}`;
    if (student.nameEn) return student.nameEn;
    if (student.firstNameEn && student.lastNameEn) return `${student.firstNameEn} ${student.lastNameEn}`;
    if (student.firstNameEn) return student.firstNameEn;
    return student.studentId || "Student";
  };

  const getStudentId = (student: any) => {
    return student?.studentId || "N/A";
  };

  // Automated Letter Grade mapping
  const getGradeDetails = (val: number) => {
    if (val >= 100) return { letter: "A+", color: "bg-emerald-100 text-emerald-800 border-emerald-300", textKh: "ល្អប្រសើរ", textEn: "Outstanding" };
    if (val >= 90) return { letter: "A", color: "bg-emerald-50 text-emerald-700 border-emerald-200/80", textKh: "ល្អប្រសើរ", textEn: "Excellent" };
    if (val >= 80) return { letter: "B", color: "bg-teal-50 text-teal-700 border-teal-200/80", textKh: "ល្អណាស់", textEn: "Very Good" };
    if (val >= 70) return { letter: "C", color: "bg-blue-50 text-blue-700 border-blue-200/80", textKh: "ល្អ", textEn: "Good" };
    if (val >= 60) return { letter: "D", color: "bg-amber-50 text-amber-700 border-amber-200/80", textKh: "ល្អបង្គួរ", textEn: "Above Average" };
    if (val >= 50) return { letter: "E", color: "bg-orange-50 text-orange-700 border-orange-200/80", textKh: "មធ្យម", textEn: "Average" };
    return { letter: "F", color: "bg-rose-50 text-rose-700 border-rose-200/80", textKh: "ខ្សោយ", textEn: "Weak" };
  };

  // Extract subjects and months for filter dropdowns (only for active studying students)
  const uniqueSubjects = Array.from(new Set(scores.filter(s => s.student && s.student.status === 'STUDYING').map(s => s.subject))).filter(Boolean).sort();
  const uniqueMonths = Array.from(new Set(scores.filter(s => s.student && s.student.status === 'STUDYING').map(s => s.month))).filter(Boolean).sort();

  // 1. Filter and search logic (Calculated first to allow dynamic sync with active filter state)
  const filteredScores = scores.filter(s => {
    // Exclude completed or stopped students from daily operational view
    if (s.student && s.student.status !== 'STUDYING') return false;

    const studentName = getStudentName(s.student).toLowerCase();
    const studentId = getStudentId(s.student).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = studentName.includes(searchLower) || studentId.includes(searchLower) || s.subject.toLowerCase().includes(searchLower);
    const matchesSubject = !selectedSubject || s.subject === selectedSubject;
    const matchesMonth = !selectedMonth || s.month === selectedMonth;
    
    let matchesTier = true;
    if (scoreTierFilter === "excellent") matchesTier = s.score >= 90;
    else if (scoreTierFilter === "passing") matchesTier = s.score >= 50 && s.score < 90;
    else if (scoreTierFilter === "critical") matchesTier = s.score < 50;

    return matchesSearch && matchesSubject && matchesMonth && matchesTier;
  });

  // 2. Sort logic
  const sortedScores = [...filteredScores].sort((a, b) => {
    let valA: any = a;
    let valB: any = b;

    if (sortBy === "name") {
      valA = getStudentName(a.student);
      valB = getStudentName(b.student);
    } else if (sortBy === "score") {
      valA = a.score;
      valB = b.score;
    } else if (sortBy === "rank") {
      valA = a.rank || 9999;
      valB = b.rank || 9999;
    } else if (sortBy === "date") {
      valA = a.month;
      valB = b.month;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Dynamic calculations on active/filtered scores (allows immediate feedback on dashboard and PDF prints)
  const totalScoresCount = sortedScores.length;
  const averageScoreVal = totalScoresCount > 0 
    ? Number((sortedScores.reduce((sum, s) => sum + s.score, 0) / totalScoresCount).toFixed(1)) 
    : 0;
  const highestScoreVal = totalScoresCount > 0 
    ? Math.max(...sortedScores.map(s => s.score)) 
    : 0;
  const passRatePercentage = totalScoresCount > 0 
    ? Math.round((sortedScores.filter(s => s.score >= 50).length / totalScoresCount) * 100) 
    : 0;

  // Grade Counts & Analytics calculations (specific to active filter dataset!)
  const gradeCounts = { "A+": 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  sortedScores.forEach(s => {
    const g = getGradeDetails(s.score).letter;
    if (g in gradeCounts) gradeCounts[g as keyof typeof gradeCounts]++;
  });
  const maxGradeCount = Math.max(...Object.values(gradeCounts), 1);

  // Subject Stats for currently active/filtered data
  const subjectStats = uniqueSubjects.map(sub => {
    const subScores = sortedScores.filter(s => s.subject === sub);
    if (subScores.length === 0) return null;
    const avg = Number((subScores.reduce((sum, s) => sum + s.score, 0) / subScores.length).toFixed(1));
    const highest = Math.max(...subScores.map(s => s.score));
    const passRate = Math.round((subScores.filter(s => s.score >= 50).length / subScores.length) * 100);
    return { subject: sub, avg, highest, passRate, count: subScores.length };
  }).filter(Boolean) as any[];

  // Analytics-specific dynamic calculations for the interactive Analytics Center (only for active studying students)
  const analyticsScores = scores.filter(s => {
    if (!s.student || s.student.status !== 'STUDYING') return false;
    const matchesSubject = analyticsSubjectFilter === "all" || s.subject === analyticsSubjectFilter;
    const matchesMonth = analyticsMonthFilter === "all" || s.month === analyticsMonthFilter;
    return matchesSubject && matchesMonth;
  });

  const aTotalCount = analyticsScores.length;
  const aAverageVal = aTotalCount > 0 
    ? Number((analyticsScores.reduce((sum, s) => sum + s.score, 0) / aTotalCount).toFixed(1)) 
    : 0;
  const aHighestVal = aTotalCount > 0 
    ? Math.max(...analyticsScores.map(s => s.score)) 
    : 0;
  const aPassRate = aTotalCount > 0 
    ? Math.round((analyticsScores.filter(s => s.score >= 50).length / aTotalCount) * 100) 
    : 0;

  const aGradeCounts = { "A+": 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  analyticsScores.forEach(s => {
    const g = getGradeDetails(s.score).letter;
    if (g in aGradeCounts) aGradeCounts[g as keyof typeof aGradeCounts]++;
  });
  const aMaxGradeCount = Math.max(...Object.values(aGradeCounts), 1);

  const aSubjectStats = (analyticsSubjectFilter === "all" ? uniqueSubjects : [analyticsSubjectFilter]).map(sub => {
    const subScores = scores.filter(s => s.student && s.student.status === 'STUDYING' && s.subject === sub && (analyticsMonthFilter === "all" || s.month === analyticsMonthFilter));
    if (subScores.length === 0) return null;
    const avg = Number((subScores.reduce((sum, s) => sum + s.score, 0) / subScores.length).toFixed(1));
    const highest = Math.max(...subScores.map(s => s.score));
    const passRate = Math.round((subScores.filter(s => s.score >= 50).length / subScores.length) * 100);
    return { subject: sub, avg, highest, passRate, count: subScores.length };
  }).filter(Boolean) as any[];

  const getSmartInsightsText = () => {
    if (sortedScores.length === 0) {
      return idt("សូមបញ្ចូលពិន្ទុសិស្សដើម្បីបង្ហាញការវិភាគនិងអនុសាសន៍។", "Please insert student grades to display analysis and smart recommendations.");
    }

    let highestAvgSubject = "";
    let highestAvgVal = 0;
    let lowestAvgSubject = "";
    let lowestAvgVal = 100;

    subjectStats.forEach(stat => {
      if (stat.avg > highestAvgVal) {
        highestAvgVal = stat.avg;
        highestAvgSubject = stat.subject as string;
      }
      if (stat.avg < lowestAvgVal) {
        lowestAvgVal = stat.avg;
        lowestAvgSubject = stat.subject as string;
      }
    });

    const isHighPassing = passRatePercentage >= 90;
    const isLowPassing = passRatePercentage < 65;

    let textKh = "";
    let textEn = "";

    if (isHighPassing) {
      textKh += `📈 អត្រាប្រឡងជាប់សរុបមានកម្រិតខ្ពស់រហូតដល់ ${passRatePercentage}% នៃសិស្សទាំងអស់! លទ្ធផលសិក្សាជារួមល្អណាស់។ `;
      textEn += `📈 Excellent overall passing rate of ${passRatePercentage}% across all records! Student academic growth is strong. `;
    } else if (isLowPassing) {
      textKh += `⚠️ អត្រាប្រឡងជាប់សរុបគឺ ${passRatePercentage}% ស្ថិតក្នុងកម្រិតត្រូវយកចិត្តទុកដាក់ខ្ពស់។ សិស្សមួយចំនួនត្រូវការការបំប៉នបន្ថែម។ `;
      textEn += `⚠️ Overall passing rate is currently at ${passRatePercentage}%, which requires academic attention and support. `;
    } else {
      textKh += `📊 វឌ្ឍនភាពសិក្សាទូទៅមានស្ថេរភាពល្អ ជាមួយនឹងអត្រាប្រឡងជាប់ ${passRatePercentage}%។ `;
      textEn += `📊 Student progression is stable, with a standard overall passing rate of ${passRatePercentage}%. `;
    }

    if (highestAvgSubject) {
      textKh += `🏆 វគ្គសិក្សាដែលសិស្សទទួលបានលទ្ធផលល្អប្រសើរជាងគេគឺ «${highestAvgSubject}» ដែលមានមធ្យមភាគ ${highestAvgVal} ពិន្ទុ។ `;
      textEn += `🏆 The strongest performing course is "${highestAvgSubject}" with a peak class average of ${highestAvgVal} points. `;
    }

    if (lowestAvgSubject && lowestAvgSubject !== highestAvgSubject && lowestAvgVal < 65) {
      textKh += `🔍 វគ្គសិក្សា «${lowestAvgSubject}» មានមធ្យមភាគទាបជាងគេ (${lowestAvgVal} ពិន្ទុ) គួរមានការរៀបចំម៉ោងស្វ័យសិក្សា ឬលំហាត់ពង្រឹងបន្ថែម។`;
      textEn += `🔍 Conversely, "${lowestAvgSubject}" shows the lowest average of ${lowestAvgVal} points, indicating potential conceptual gaps that could benefit from extra tutorial exercises.`;
    } else if (lowestAvgSubject && lowestAvgSubject !== highestAvgSubject) {
      textKh += `⚙️ វគ្គសិក្សា «${lowestAvgSubject}» មានមធ្យមភាគ ${lowestAvgVal} ពិន្ទុ។`;
      textEn += `⚙️ "${lowestAvgSubject}" exhibits a steady score distribution with an average of ${lowestAvgVal} points.`;
    }

    return idt(textKh, textEn);
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc"); // Default to desc for intuitive ranking/scoring
    }
  };

  return (
    <div id="grading-panel" className="w-full space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-[100] max-w-sm w-full bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-4 flex items-start gap-3">
              {notification.type === "success" && (
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {notification.type === "error" && (
                <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              {notification.type === "info" && (
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">
                  {notification.type === "success" ? idt("ជោគជ័យ", "Success") : notification.type === "error" ? idt("មានបញ្ហា", "Error") : idt("ដំណឹង", "Info")}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Print Container Wrapper */}
      <div ref={printRef} className="w-full space-y-6">
        
        {/* Printable Header - Only visible when printing */}
        <div className="hidden print:block w-full pb-6 border-b-2 border-slate-800 text-slate-900 font-sans">
          <div className="grid grid-cols-2 justify-between items-start mb-6">
            <div className="text-left space-y-1">
              <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">{idt("ប្រព័ន្ធគ្រប់គ្រងសាលារៀន", "SCHOOL MANAGEMENT SYSTEM")}</h2>
              <p className="text-[11px] font-bold text-slate-600">{idt("ការិយាល័យសិក្សាធិការ", "Academic Affairs Office")}</p>
              <p className="text-[10px] text-slate-500">{idt("វិទ្យាស្ថានបច្ចេកវិទ្យាព័ត៌មាន", "Institute of Information Technology")}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[11px] font-black tracking-wide">{idt("ព្រះរាជាណាចក្រកម្ពុជា", "KINGDOM OF CAMBODIA")}</p>
              <p className="text-[10px] font-black tracking-wide">{idt("ជាតិ សាសនា ព្រះមហាក្សត្រ", "NATION RELIGION KING")}</p>
              <div className="flex justify-end pt-1">
                <div className="w-16 border-t border-slate-400"></div>
              </div>
            </div>
          </div>
          
          <div className="text-center my-6">
            <h1 className="text-xl font-black text-blue-900 tracking-tight">{idt("សន្លឹករបាយការណ៍ពិន្ទុ និងចំណាត់ថ្នាក់សិស្ស", "STUDENT ACADEMIC & GRADING REPORT")}</h1>
            <p className="text-xs text-slate-500 mt-1 font-bold italic">{idt("ប្រចាំខែសិក្សានីមួយៗ", "Monthly Performance Review")}</p>
          </div>

          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 font-bold">
            <div className="flex gap-4">
              <span>{idt("វគ្គសិក្សា៖ " + (selectedSubject || "ទាំងអស់"), "Course: " + (selectedSubject || "All"))}</span>
              <span>{idt("ខែសិក្សា៖ " + (selectedMonth || "ទាំងអស់"), "Period: " + (selectedMonth || "All"))}</span>
            </div>
            <div className="flex gap-4">
              <span>{idt("ចំនួនសិស្ស៖ " + sortedScores.length + " នាក់", "Students Count: " + sortedScores.length)}</span>
              <span>{idt("កាលបរិច្ឆេទបោះពុម្ព៖ " + new Date().toLocaleDateString('kh-KH'), "Print Date: " + new Date().toLocaleDateString())}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print py-4 mb-2">
          <div className="w-full sm:w-auto">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <span className="truncate">{idt("ប្រព័ន្ធគ្រប់គ្រងពិន្ទុ (Grading)", "Academics & Grading")}</span>
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium line-clamp-1 sm:line-clamp-none">
              {idt("កត់ត្រាពិន្ទុ គណនាចំណាត់ថ្នាក់សិស្ស និងទាញយកសន្លឹករបាយការណ៍", "Record student grades, auto-rank scores, and export printable sheets")}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
             <button 
               onClick={handleCalculateRanks} 
               disabled={isRanking || loading || scores.length === 0}
               className="flex-1 sm:flex-none justify-center px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-black flex items-center gap-1.5 border border-blue-200/50 transition-all duration-200 disabled:opacity-60 active:scale-95 whitespace-nowrap"
             >
               <RefreshCw className={"w-4 h-4 text-blue-500 shrink-0 " + (isRanking ? "animate-spin" : "")} /> 
               {isRanking ? idt("កំពុងគណនា...", "Ranking...") : idt("គណនាចំណាត់ថ្នាក់", "Calculate Ranks")}
             </button>

             <button 
               onClick={handlePrint} 
               disabled={isPrinting || scores.length === 0}
               className="flex-1 sm:flex-none justify-center px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-black flex items-center gap-2 shadow-3xs transition-all duration-200 disabled:opacity-50 active:scale-95 whitespace-nowrap"
             >
               <Printer className="w-4 h-4 text-slate-500 shrink-0" /> 
               {isPrinting ? idt("កំពុងទាញយក...", "Downloading...") : idt("ទាញយកជា PDF", "Download PDF")}
             </button>

             <button 
               onClick={handleExportCSV} 
               disabled={loading || scores.length === 0}
               className="flex-1 sm:flex-none justify-center px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-black flex items-center gap-2 shadow-3xs transition-all duration-200 disabled:opacity-50 active:scale-95 whitespace-nowrap"
             >
               <FileDown className="w-4 h-4 text-emerald-500 shrink-0" /> 
               {idt("ទាញយកជា CSV", "Download CSV")}
             </button>

             <button 
               onClick={() => setShowAnalytics(!showAnalytics)} 
               className={"flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all duration-200 active:scale-95 whitespace-nowrap " + (showAnalytics ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300")}
             >
               <BarChart3 className="w-4 h-4 shrink-0" /> 
               {showAnalytics ? idt("លាក់ការវិភាគ", "Hide Charts") : idt("បង្ហាញការវិភាគ", "Show Charts")}
             </button>

             <button 
               onClick={() => { setShowBulkModal(true); setBulkGrades({}); }} 
               className="flex-1 sm:flex-none justify-center px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/15 transition-all duration-200 active:scale-95 whitespace-nowrap"
             >
               <Plus className="w-4 h-4 shrink-0" /> {idt("បញ្ចូលពិន្ទុជាក្រុម", "Bulk Entry")}
             </button>
          </div>
        </div>

        {/* Expanded Analytics Dashboard Panel */}
        <AnimatePresence>
        {showAnalytics && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden no-print mb-6"
          >
            <div className="bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-8">
              
              {/* Main Analytics Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600 animate-pulse" />
                    {idt("មជ្ឈមណ្ឌលវិភាគការសិក្សាសិស្ស", "Academic Performance Analytics Center")}
                  </h3>
                  <p className="text-slate-500 text-xs">{idt("ស្ថិតិ និងការបែងចែកនិទ្ទេសសម្រាប់គ្រប់វគ្គសិក្សា", "Overview of grades, distributions, and averages across courses")}</p>
                </div>
                <button 
                  onClick={() => setShowAnalytics(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-black transition-all cursor-pointer shadow-3xs"
                >
                  {idt("លាក់ផ្ទាំងវិភាគ", "Hide Console")}
                </button>
              </div>

              {/* Inline Interactive Analytics Dashboard Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/50 text-xs relative z-40">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                  <span className="font-black text-slate-700 tracking-wide">{idt("តម្រងស្វែងរកគំនិតវិភាគ៖", "Dashboard Interactive Filters:")}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 z-40">
                  {/* Subject Dropdown Selector */}
                  <div ref={subjectDropdownRef} className="relative flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">{idt("វគ្គសិក្សា", "Course")}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectDropdownOpen(!subjectDropdownOpen);
                        setMonthDropdownOpen(false);
                      }}
                      className="px-3.5 py-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-800 rounded-lg outline-none text-[11px] font-black cursor-pointer transition-all flex items-center justify-between gap-2 shadow-2xs min-w-[155px]"
                    >
                      <span className="truncate max-w-[120px]">
                        {analyticsSubjectFilter === "all" ? idt("គ្រប់វគ្គសិក្សាទាំងអស់", "All Courses") : analyticsSubjectFilter}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${subjectDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {subjectDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden"
                        >
                          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                            <button
                              type="button"
                              onClick={() => {
                                setAnalyticsSubjectFilter("all");
                                setSubjectDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-[11px] font-bold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                                analyticsSubjectFilter === "all" ? "text-blue-600 bg-blue-50/50 font-black" : "text-slate-700"
                              }`}
                            >
                              <span>{idt("គ្រប់វគ្គសិក្សាទាំងអស់", "All Courses")}</span>
                              {analyticsSubjectFilter === "all" && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                            </button>
                            {uniqueSubjects.map(sub => (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => {
                                  setAnalyticsSubjectFilter(sub);
                                  setSubjectDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-[11px] font-bold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                                  analyticsSubjectFilter === sub ? "text-blue-600 bg-blue-50/50 font-black" : "text-slate-700"
                                }`}
                              >
                                <span className="truncate pr-2">{sub}</span>
                                {analyticsSubjectFilter === sub && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Month Dropdown Selector */}
                  <div ref={monthDropdownRef} className="relative flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">{idt("ខែសិក្សា", "Month")}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMonthDropdownOpen(!monthDropdownOpen);
                        setSubjectDropdownOpen(false);
                      }}
                      className="px-3.5 py-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-800 rounded-lg outline-none text-[11px] font-black cursor-pointer transition-all flex items-center justify-between gap-2 shadow-2xs min-w-[135px]"
                    >
                      <span className="truncate max-w-[90px]">
                        {analyticsMonthFilter === "all" ? idt("គ្រប់ខែសិក្សា", "All Months") : analyticsMonthFilter}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${monthDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {monthDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden"
                        >
                          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                            <button
                              type="button"
                              onClick={() => {
                                setAnalyticsMonthFilter("all");
                                setMonthDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-[11px] font-bold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                                analyticsMonthFilter === "all" ? "text-blue-600 bg-blue-50/50 font-black" : "text-slate-700"
                              }`}
                            >
                              <span>{idt("គ្រប់ខែសិក្សា", "All Months")}</span>
                              {analyticsMonthFilter === "all" && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                            </button>
                            {uniqueMonths.map(mon => (
                              <button
                                key={mon}
                                type="button"
                                onClick={() => {
                                  setAnalyticsMonthFilter(mon);
                                  setMonthDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-[11px] font-bold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                                  analyticsMonthFilter === mon ? "text-blue-600 bg-blue-50/50 font-black" : "text-slate-700"
                                }`}
                              >
                                <span className="truncate pr-2">{mon}</span>
                                {analyticsMonthFilter === mon && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Reset Filters */}
                  {(analyticsSubjectFilter !== "all" || analyticsMonthFilter !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        setAnalyticsSubjectFilter("all");
                        setAnalyticsMonthFilter("all");
                        triggerNotification(idt("បានសម្អាតតម្រងវិភាគ!", "Reset analytics filters successfully!"), "info");
                      }}
                      className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/50 rounded-lg text-[10px] font-black transition-all shadow-3xs cursor-pointer"
                    >
                      {idt("កំណត់ឡើងវិញ", "Reset")}
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Grid Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                
                {/* 1. Grade Letter Distribution (Custom SVG Chart) */}
                <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl flex flex-col justify-between shadow-2xs relative group/card">
                  <div>
                    <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-3">
                      <Award className="w-4.5 h-4.5 text-amber-500" />
                      {idt("ការបែងចែកនិទ្ទេស (GRADE DISTRIBUTION)", "Grade Tier Distribution")}
                    </h4>
                    
                    {/* Centered Chart Container */}
                    <div className="flex items-center justify-center py-6 sm:py-10">
                      <div className="flex items-end justify-between w-full h-44 px-1.5">
                        {["A+", "A", "B", "C", "D", "E", "F"].map(letter => {
                          const count = aGradeCounts[letter as keyof typeof aGradeCounts] || 0;
                          const percentage = aTotalCount > 0 ? (count / aTotalCount) * 100 : 0;
                          const heightPercent = aTotalCount > 0 ? (count / aMaxGradeCount) * 80 + 10 : 10;
                          
                          let barColor = "bg-rose-500 bg-rose-500 shadow-rose-500/20";
                          if (letter === "A+") barColor = "bg-emerald-600 bg-emerald-500 shadow-emerald-600/30";
                          else if (letter === "A") barColor = "bg-emerald-500 bg-emerald-400 shadow-emerald-500/20";
                          else if (letter === "B") barColor = "bg-teal-500 bg-teal-400 shadow-teal-500/20";
                          else if (letter === "C") barColor = "bg-blue-500 bg-blue-400 shadow-blue-500/20";
                          else if (letter === "D") barColor = "bg-amber-500 bg-amber-400 shadow-amber-500/20";
                          else if (letter === "E") barColor = "bg-orange-500 bg-orange-400 shadow-orange-500/20";

                          return (
                            <div key={letter} className="flex flex-col items-center flex-1 group/bar relative">
                              {/* Tooltip */}
                              <div className="absolute -top-11 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900/95 backdrop-blur-xs text-white text-[10px] py-1 px-2 rounded-lg border border-slate-800 font-black font-mono z-20 pointer-events-none whitespace-nowrap shadow-lg">
                                {count} {idt("សន្លឹក", "reports")} ({Math.round(percentage)}%)
                              </div>

                              <div className="w-full flex justify-center items-end h-32 pb-1 px-2">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${heightPercent}%` }}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                  className={`w-full rounded-t-xl ${barColor} shadow-md group-hover/bar:scale-y-[1.04] group-hover/bar:brightness-105 transition-all duration-300 origin-bottom cursor-pointer`}
                                />
                              </div>

                              <span className="text-[10px] font-black text-slate-800 mt-2 font-mono">{letter}</span>
                              <span className="text-[10px] font-extrabold text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100/60 mt-0.5">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 text-center font-bold italic border-t border-slate-50 pt-3">
                    {idt("📊 ស្ថិតិនៃការបែងចែកនិទ្ទេស និងលទ្ធផលសរុប!", "📊 Grade tier metrics of overall student performance!")}
                  </div>
                </div>

                {/* 2. Top Performing Students (Hall of Fame) */}
                <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-2xs">
                  <div>
                    <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-3 border-b border-slate-50 pb-3">
                      <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-400 animate-pulse" />
                      {idt("សិស្សឆ្នើមលេចធ្លោ (TOP STUDENTS)", "Outstanding Performers")}
                    </h4>

                    {analyticsScores.length === 0 ? (
                      <div className="text-center py-16 text-xs text-slate-400 font-bold italic">
                        {idt("ពុំទាន់មានព័ត៌មានពិន្ទុសម្រាប់លក្ខខណ្ឌជ្រើសរើសនេះទេ", "No scoring records for this filter")}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                        {(() => {
                          const uniqueStudents: { [key: string]: typeof analyticsScores[0] } = {};
                          analyticsScores.forEach(s => {
                            const studentKey = s.studentId || s.student?.id || s.student?.nameKh || s.student?.nameEn || s.id;
                            if (studentKey) {
                              if (!uniqueStudents[studentKey] || s.score > uniqueStudents[studentKey].score) {
                                uniqueStudents[studentKey] = s;
                              }
                            }
                          });
                          return Object.values(uniqueStudents)
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 15);
                        })().map((s, index) => {
                            let rankColor = "text-amber-600 bg-amber-50 border-amber-200/40";
                            if (index === 0) rankColor = "text-amber-600 bg-amber-50 border-amber-300 shadow-xs ring-2 ring-amber-400/10";
                            else if (index === 1) rankColor = "text-slate-600 bg-slate-50 border-slate-300 shadow-xs ring-2 ring-slate-400/10";
                            else if (index === 2) rankColor = "text-orange-600 bg-orange-50 border-orange-300 shadow-xs ring-2 ring-orange-400/10";
                            else rankColor = "text-blue-600 bg-blue-50/50 border-blue-100/50";
                            
                            return (
                              <div 
                                key={s.id} 
                                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:bg-slate-50/40 hover:translate-x-1 hover:shadow-3xs transition-all duration-200 text-xs"
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black font-mono text-[11px] border shrink-0 ${rankColor}`}>
                                    #{index + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setStudentProfileId(s.studentId || (s.student && s.student.id))}
                                    className="font-extrabold text-slate-800 hover:text-blue-600 text-left truncate max-w-[130px] transition-colors hover:underline focus:outline-none cursor-pointer"
                                    title={idt("ចុចដើម្បីមើលរបាយការណ៍", "Click to view academic report card")}
                                  >
                                    {getStudentName(s.student)}
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100/60 px-1.5 py-0.5 rounded-lg max-w-[85px] truncate">{s.subject}</span>
                                  <span className="font-black font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/40 shadow-3xs text-[11px]">
                                    {s.score}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[10px] text-slate-400 text-center font-bold italic border-t border-slate-50 pt-3">
                    {idt("🏆 បរិមាណសិស្សឆ្នើមលេចធ្លោ និងគំរូនៃថ្នាក់រៀន!", "🏆 Hall of fame highlighting topmost academic scores!")}
                  </div>
                </div>

                {/* 3. Subject-wide Performance breakdown */}
                <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl space-y-4 shadow-2xs md:col-span-2 lg:col-span-1">
                  <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-3">
                    <BookOpen className="w-4.5 h-4.5 text-blue-500" />
                    {idt("របាយការណ៍តាមវគ្គសិក្សា", "Course-wide Analytics")}
                  </h4>

                  {aSubjectStats.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-400 font-bold italic">
                      {idt("ពុំទាន់មានព័ត៌មានស្ថិតិ", "No subject statistics yet")}
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                      {aSubjectStats.map(stat => (
                        <div key={stat.subject} className="space-y-2 bg-slate-50/30 p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/80 transition-all duration-200">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="font-extrabold text-slate-800 truncate max-w-[180px] sm:max-w-[240px]" title={stat.subject}>{stat.subject}</span>
                            <span className="text-slate-500 font-medium">
                              Avg: <span className="font-mono text-blue-600 font-black text-xs">{stat.avg}</span>
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.avg}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-blue-600 rounded-full"
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400 font-black">
                            <span className="bg-white border border-slate-100 px-1.5 py-0.5 rounded-lg text-slate-500">{stat.count} {idt("នាក់", "Students")}</span>
                            <span className="bg-white border border-slate-100 px-1.5 py-0.5 rounded-lg">{idt("ជាប់", "Pass")}: <span className="text-emerald-600">{stat.passRate}%</span></span>
                            <span className="bg-white border border-slate-100 px-1.5 py-0.5 rounded-lg">{idt("ពិន្ទុខ្ពស់", "Max")}: <span className="text-amber-600">{stat.highest}</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* 4. Smart Insights row */}
              <div className="bg-blue-50/40 border border-blue-100/60 p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row gap-5 items-center justify-between shadow-2xs">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-400 animate-pulse" />
                    <h4 className="text-[11px] font-black uppercase text-blue-800 tracking-wider">
                      {idt("និន្នាការ និងការវិភាគវឌ្ឍនភាពឆ្លាតវៃ (SMART ACADEMIC INSIGHTS)", "AI Academic Trend Insight Generator")}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {getSmartInsightsText()}
                  </div>
                </div>
                {/* simulated interactive action */}
                <div className="flex flex-wrap gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      triggerNotification(idt("កំពុងវិភាគទិន្នន័យថ្នាក់រៀនឡើងវិញ...", "Re-analyzing class academic indicators..."), "info");
                      setTimeout(() => {
                        triggerNotification(idt("ការវិភាគទិន្នន័យបានបញ្ចប់ជាស្ថាពរ!", "Analysis refreshed successfully with latest student data!"), "success");
                      }, 1200);
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-black flex items-center gap-2 transition-all shadow-md shadow-blue-600/10 cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-white/80 animate-spin" style={{ animationDuration: '4s' }} />
                    {idt("ធ្វើបច្ចុប្បន្នភាពការវិភាគ", "Refresh Analysis")}
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Dashboard Analytics Widgets - Adaptively scales when filters apply! */}
        {(() => {
          const isFiltered = Boolean(searchTerm || selectedSubject || selectedMonth || scoreTierFilter !== "all");
          return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 no-print">
              
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">{idt("សរុបសន្លឹកពិន្ទុ", "Total Records")}</p>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{totalScoresCount}</h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {isFiltered ? idt("តាមតម្រងសកម្ម", "active in current filter") : idt("ក្នុងប្រព័ន្ធទាំងមូល", "registered in system")}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">{idt("ពិន្ទុមធ្យមភាគ", "Average Score")}</p>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{averageScoreVal} <span className="text-[10px] sm:text-xs text-slate-400 font-normal">/ 100</span></h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {isFiltered ? idt("មធ្យមភាគតាមតម្រងសកម្ម", "average of active filter") : idt("គណនាពីគ្រប់វគ្គសិក្សា", "across all courses")}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">{idt("ពិន្ទុខ្ពស់បំផុត", "Highest Grade")}</p>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{highestScoreVal} <span className="text-[10px] sm:text-xs text-slate-400 font-normal">/ 100</span></h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {isFiltered ? idt("ពិន្ទុខ្ពស់តាមតម្រងសកម្ម", "highest of active filter") : idt("សិស្សឆ្នើមបំផុត", "outstanding performance")}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-teal-50 text-teal-600 rounded-xl w-fit">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">{idt("អត្រាប្រឡងជាប់", "Passing Rate")}</p>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{passRatePercentage}%</h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {isFiltered ? idt("អត្រាជាប់តាមតម្រងសកម្ម", "pass rate of active filter") : idt("ពិន្ទុធំជាងឬស្មើ ៥០", "scores with 50+ / 100")}
                  </p>
                </div>
              </div>

            </div>
          );
        })()}

        {/* Filters and Control Board */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-3xs space-y-3 no-print">
          
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-blue-500" />
              {idt("ឧបករណ៍ចម្រោះទិន្នន័យ", "Advanced Score Filters")}
            </span>
            {(searchTerm || selectedSubject || selectedMonth || scoreTierFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSubject("");
                  setSelectedMonth("");
                  setScoreTierFilter("all");
                  setIsOpenFilterSubjectDropdown(false);
                  setIsOpenFilterMonthDropdown(false);
                  setIsOpenFilterTierDropdown(false);
                }}
                className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/30 rounded-lg transition-all active:scale-95"
              >
                {idt("លុបតម្រងទាំងអស់", "Clear Filters")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Name/Subject Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={idt("ស្វែងរកសិស្ស ឬវគ្គសិក្សា...", "Search student or course...")}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3 py-2 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Subject Select */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsOpenFilterSubjectDropdown(!isOpenFilterSubjectDropdown);
                  setIsOpenFilterMonthDropdown(false);
                  setIsOpenFilterTierDropdown(false);
                }}
                className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between transition-all cursor-pointer hover:bg-white min-h-[38px] ${
                  isOpenFilterSubjectDropdown ? "border-blue-500 ring-2 ring-blue-500/10" : ""
                }`}
              >
                <span className="truncate">
                  {selectedSubject || idt("វគ្គសិក្សាទាំងអស់", "All Courses")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpenFilterSubjectDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isOpenFilterSubjectDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs overflow-hidden"
                  >
                    <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-1 dropdown-scrollbar">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubject("");
                          setIsOpenFilterSubjectDropdown(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                          selectedSubject === "" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {idt("វគ្គសិក្សាទាំងអស់", "All Courses")}
                      </button>
                      {uniqueSubjects.map(sub => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            setSelectedSubject(sub);
                            setIsOpenFilterSubjectDropdown(false);
                          }}
                          className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                            selectedSubject === sub ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Month Select */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsOpenFilterMonthDropdown(!isOpenFilterMonthDropdown);
                  setIsOpenFilterSubjectDropdown(false);
                  setIsOpenFilterTierDropdown(false);
                }}
                className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between transition-all cursor-pointer hover:bg-white min-h-[38px] ${
                  isOpenFilterMonthDropdown ? "border-blue-500 ring-2 ring-blue-500/10" : ""
                }`}
              >
                <span className="truncate">
                  {selectedMonth || idt("ខែសិក្សាទាំងអស់", "All Months")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpenFilterMonthDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isOpenFilterMonthDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs overflow-hidden"
                  >
                    <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-1 dropdown-scrollbar">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMonth("");
                          setIsOpenFilterMonthDropdown(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                          selectedMonth === "" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {idt("ខែសិក្សាទាំងអស់", "All Months")}
                      </button>
                      {uniqueMonths.map(mon => (
                        <button
                          key={mon}
                          type="button"
                          onClick={() => {
                            setSelectedMonth(mon);
                            setIsOpenFilterMonthDropdown(false);
                          }}
                          className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                            selectedMonth === mon ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {mon}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Performance Level */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsOpenFilterTierDropdown(!isOpenFilterTierDropdown);
                  setIsOpenFilterSubjectDropdown(false);
                  setIsOpenFilterMonthDropdown(false);
                }}
                className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between transition-all cursor-pointer hover:bg-white min-h-[38px] ${
                  isOpenFilterTierDropdown ? "border-blue-500 ring-2 ring-blue-500/10" : ""
                }`}
              >
                <span className="truncate">
                  {scoreTierFilter === "all" ? idt("និទ្ទេសទាំងអស់ (All Grades)", "All Performance Grades") :
                   scoreTierFilter === "excellent" ? idt("និទ្ទេសល្អឆ្នើម (A / Score ≥ 90)", "Excellent (A / Score ≥ 90)") :
                   scoreTierFilter === "passing" ? idt("និទ្ទេសមធ្យម/ជាប់ (B/C/D/E / 50-89)", "Passing/Average (B/C/D/E / 50-89)") :
                   idt("ធ្លាក់ (F / Score < 50)", "Needs Improvement (F / Score < 50)")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpenFilterTierDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isOpenFilterTierDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs overflow-hidden"
                  >
                    <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-1 dropdown-scrollbar">
                      <button
                        type="button"
                        onClick={() => {
                          setScoreTierFilter("all");
                          setIsOpenFilterTierDropdown(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                          scoreTierFilter === "all" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {idt("និទ្ទេសទាំងអស់ (All Grades)", "All Performance Grades")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setScoreTierFilter("excellent");
                          setIsOpenFilterTierDropdown(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                          scoreTierFilter === "excellent" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {idt("និទ្ទេសល្អឆ្នើម (A / Score ≥ 90)", "Excellent (A / Score ≥ 90)")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setScoreTierFilter("passing");
                          setIsOpenFilterTierDropdown(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                          scoreTierFilter === "passing" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {idt("និទ្ទេសមធ្យម/ជាប់ (B/C/D/E / 50-89)", "Passing/Average (B/C/D/E / 50-89)")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setScoreTierFilter("critical");
                          setIsOpenFilterTierDropdown(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                          scoreTierFilter === "critical" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {idt("ធ្លាក់ (F / Score < 50)", "Needs Improvement (F / Score < 50)")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>


        </div>

        {/* Scores Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs overflow-hidden no-print">
          
          {/* Header containing result stats info */}
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
            <span className="text-xs text-slate-500 font-bold">
              {idt(`រកឃើញសន្លឹកពិន្ទុចំនួន ${sortedScores.length} ក្នុងចំណោម ${scores.length}`, `Showing ${sortedScores.length} of ${scores.length} score reports`)}
            </span>
            <div className="flex items-center gap-4 text-xs flex-wrap">
              <span className="text-slate-400">{idt("តម្រៀបតាម៖", "Sort by:")}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleSort("score")} 
                  className={`font-black flex items-center gap-0.5 transition-colors ${sortBy === "score" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {idt("ពិន្ទុ", "Score")}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
                <span className="text-slate-300">|</span>
                <button 
                  onClick={() => toggleSort("rank")} 
                  className={`font-black flex items-center gap-0.5 transition-colors ${sortBy === "rank" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {idt("ចំណាត់ថ្នាក់", "Rank")}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
                <span className="text-slate-300">|</span>
                <button 
                  onClick={() => toggleSort("name")} 
                  className={`font-black flex items-center gap-0.5 transition-colors ${sortBy === "name" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {idt("ឈ្មោះសិស្ស", "Student")}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/70 text-slate-500 font-black border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4 text-xs uppercase tracking-wider font-extrabold whitespace-nowrap">{idt("សិស្ស", "Student")}</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-wider font-extrabold whitespace-nowrap">{idt("វគ្គសិក្សា/ខែ", "Course / Period")}</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-wider font-extrabold text-center whitespace-nowrap">{idt("ពិន្ទុ", "Acquired Score")}</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-wider font-extrabold text-center whitespace-nowrap">{idt("និទ្ទេស", "Grade Tier")}</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-wider font-extrabold text-center whitespace-nowrap">{idt("ចំណាត់ថ្នាក់", "Class Rank")}</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-wider font-extrabold text-right no-print whitespace-nowrap">{idt("សកម្មភាព", "Action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="text-xs text-slate-400 font-bold">{idt("កំពុងទាញយកទិន្នន័យ...", "Loading scores data...")}</span>
                      </div>
                    </td>
                  </tr>
                ) : sortedScores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 px-4">
                      <div className="max-w-md mx-auto flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                          <Award className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-bold text-slate-700">{idt("គ្មានទិន្នន័យពិន្ទុសិស្សទេ", "No Grades Found")}</h3>
                        <p className="text-xs text-slate-400 mt-1 mb-6 text-center">
                          {idt("ពុំមានការកត់ត្រាពិន្ទុតាមលក្ខខណ្ឌចម្រោះខាងលើឡើយ។ សូមចុចប៊ូតុងបន្ថែមពិន្ទុថ្មី។", "There are no student scores found matching current filters. Click below to create a new one.")}
                        </p>
                        <div className="flex gap-3 no-print">
                          <button 
                            onClick={() => { setFormData({ studentId: "", month: "", subject: "", score: "", rank: "" }); setEditingId(null); setShowAddModal(true); }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all duration-200 shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                            {idt("បន្ថែមពិន្ទុថ្មី", "Add First Grade")}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedScores.map((s, index) => {
                    const grade = getGradeDetails(s.score);
                    const isPassed = s.score >= 50;
                    const studentInitials = getStudentName(s.student).slice(0, 2).toUpperCase();

                    return (
                      <motion.tr 
                        key={s.id} 
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: Math.min(index * 0.03, 0.4) }}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        {/* Student Name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-slate-600 text-xs shadow-3xs select-none">
                              {studentInitials}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-800 text-[13px] leading-tight mb-0.5">
                                {getStudentName(s.student)}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold">
                                ID: {getStudentId(s.student)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Subject & Month */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-700 text-xs flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              {s.subject}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 font-bold flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {s.month}
                            </span>
                          </div>
                        </td>

                        {/* Score Value + Progress bar */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col items-center justify-center min-w-[100px]">
                            <div className="flex items-baseline gap-0.5">
                              <span className={`text-[15px] font-black font-mono ${isPassed ? 'text-blue-600' : 'text-rose-600'}`}>{s.score}</span>
                              <span className="text-[10px] text-slate-400 font-bold">/100</span>
                            </div>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5 no-print">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${isPassed ? 'bg-blue-500' : 'bg-rose-500'}`} 
                                style={{ width: `${s.score}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Letter Grade Badge */}
                        <td className="px-5 py-3.5 text-center">
                          <span className={`text-xs font-extrabold tracking-wider ${grade.color.split(' ').find(c => c.startsWith('text-')) || 'text-slate-700'} inline-flex flex-col items-center`}>
                            <span className="text-[13px] font-black font-mono">{grade.letter}</span>
                            <span className="text-[8px] uppercase tracking-wide opacity-80 font-bold">{idt(grade.textKh, grade.textEn)}</span>
                          </span>
                        </td>

                        {/* Class Rank */}
                        <td className="px-5 py-3.5 text-center">
                          {s.rank ? (
                            <span className="text-xs font-black font-mono text-amber-800">{s.rank}</span>
                          ) : (
                            <span className="text-slate-400 text-xs font-bold">-</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right no-print">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => openEdit(s)} 
                               className="text-slate-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100/50 transition-all active:scale-90"
                               title={idt("កែប្រែ", "Edit Score")}
                             >
                               <Edit className="w-3.5 h-3.5" />
                             </button>
                             <button 
                               onClick={() => setDeleteConfirmId(s.id)} 
                               className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100/50 transition-all active:scale-90"
                               title={idt("លុប", "Delete Score")}
                             >
                               <Trash2 className="w-3.5 h-3.5" />
                             </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dedicated Print-Only Table Section */}
        <div className="hidden print:block w-full mt-6">
          <table className="w-full text-[11px] border-collapse border border-slate-400 text-slate-900 font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-black">
                <th className="border border-slate-400 px-2 py-2 text-center w-10">{idt("ល.រ", "No.")}</th>
                <th className="border border-slate-400 px-3 py-2 text-left">{idt("អត្តសញ្ញាណ", "Student ID")}</th>
                <th className="border border-slate-400 px-3 py-2 text-left">{idt("ឈ្មោះសិស្ស", "Student Name")}</th>
                <th className="border border-slate-400 px-3 py-2 text-left">{idt("វគ្គសិក្សា", "Course")}</th>
                <th className="border border-slate-400 px-3 py-2 text-center w-20">{idt("ខែសិក្សា", "Month")}</th>
                <th className="border border-slate-400 px-2 py-2 text-center w-16">{idt("ពិន្ទុ (100)", "Score")}</th>
                <th className="border border-slate-400 px-3 py-2 text-center w-24">{idt("និទ្ទេស", "Grade")}</th>
                <th className="border border-slate-400 px-2 py-2 text-center w-20">{idt("ចំណាត់ថ្នាក់", "Rank")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((s, idx) => {
                const grade = getGradeDetails(s.score);
                return (
                  <tr key={s.id} className="odd:bg-white even:bg-slate-50/40">
                    <td className="border border-slate-400 px-2 py-2 text-center font-bold font-mono">{idx + 1}</td>
                    <td className="border border-slate-400 px-3 py-2 font-mono font-bold">{getStudentId(s.student)}</td>
                    <td className="border border-slate-400 px-3 py-2 font-black text-slate-900">
                      <div className="flex flex-col">
                        <span>{s.student?.nameKh || getStudentName(s.student)}</span>
                        {s.student?.nameEn && <span className="text-[9px] font-bold text-slate-500 uppercase">{s.student.nameEn}</span>}
                      </div>
                    </td>
                    <td className="border border-slate-400 px-3 py-2 font-bold">{s.subject}</td>
                    <td className="border border-slate-400 px-3 py-2 text-center font-bold font-mono">{s.month}</td>
                    <td className="border border-slate-400 px-2 py-2 text-center font-black font-mono text-[12px]">{s.score}</td>
                    <td className="border border-slate-400 px-3 py-2 text-center">
                      <span className="font-black text-slate-800">{grade.letter} ({idt(grade.textKh, grade.textEn)})</span>
                    </td>
                    <td className="border border-slate-400 px-2 py-2 text-center font-black">
                      {s.rank ? `${idt("លេខ", "Rank")} ${s.rank}` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Report Summary Stats for Print */}
          <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-300 text-[10px] text-slate-700 font-bold">
            <div className="text-center space-y-1">
              <p className="text-slate-500 uppercase font-black text-[9px]">{idt("ពិន្ទុមធ្យមភាគ", "Average Score")}</p>
              <p className="text-sm font-black text-slate-800 font-mono">{averageScoreVal} / 100</p>
            </div>
            <div className="text-center space-y-1 border-l border-slate-300">
              <p className="text-slate-500 uppercase font-black text-[9px]">{idt("ពិន្ទុខ្ពស់បំផុត", "Highest Score")}</p>
              <p className="text-sm font-black text-slate-800 font-mono">{highestScoreVal} / 100</p>
            </div>
            <div className="text-center space-y-1 border-l border-slate-300">
              <p className="text-slate-500 uppercase font-black text-[9px]">{idt("អត្រាជាប់", "Pass Rate")}</p>
              <p className="text-sm font-black text-slate-800 font-mono">{passRatePercentage}%</p>
            </div>
            <div className="text-center space-y-1 border-l border-slate-300">
              <p className="text-slate-500 uppercase font-black text-[9px]">{idt("សិស្សសរុប", "Total Students")}</p>
              <p className="text-sm font-black text-slate-800 font-mono">{sortedScores.length} {idt("នាក់", "Students")}</p>
            </div>
          </div>

          {/* Official Signature Section */}
          <div className="mt-12 grid grid-cols-2 text-center text-slate-800 font-sans text-[11px] font-bold">
            <div className="space-y-12">
              <div>
                <p className="uppercase text-[9px] text-slate-500 tracking-wider">{idt("បានឃើញ និងឯកភាព", "Seen & Approved")}</p>
                <p className="font-black text-slate-950 mt-1">{idt("នាយកវិទ្យាស្ថាន / សាលារៀន", "School Director / Principal")}</p>
              </div>
              <div className="pt-8">
                <div className="w-40 border-b border-dashed border-slate-400 mx-auto"></div>
                <p className="text-[10px] text-slate-400 mt-2">{idt("(ហត្ថលេខា និងត្រា)", "(Signature & Stamp)")}</p>
              </div>
            </div>
            
            <div className="space-y-12">
              <div>
                <p className="text-slate-500 font-medium italic">
                  {idt(
                    `រាជធានីភ្នំពេញ, ថ្ងៃទី ${new Date().getDate()} ខែ ${new Date().getMonth() + 1} ឆ្នាំ ${new Date().getFullYear()}`,
                    `Phnom Penh, Date: ${new Date().toLocaleDateString()}`
                  )}
                </p>
                <p className="font-black text-slate-950 mt-1">{idt("អ្នករៀបចំរបាយការណ៍", "Prepared By / Registrar")}</p>
              </div>
              <div className="pt-8">
                <div className="w-40 border-b border-dashed border-slate-400 mx-auto"></div>
                <p className="text-[10px] text-slate-400 mt-2">{idt("(ហត្ថលេខា)", "(Signature)")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
      {deleteConfirmId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center border border-slate-100"
          >
            <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1.5">
              {idt("បញ្ជាក់ការលុបពិន្ទុ", "Confirm Score Deletion")}
            </h3>
            <p className="text-slate-500 text-xs mb-6 px-2 font-medium">
              {idt("តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ? សកម្មភាពនេះនឹងលុបពិន្ទុសិស្សម្នាក់នេះចោលភ្លាមៗ។", "Are you sure you want to delete this score record? This action will permanently delete this grading entry.")}
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all active:scale-95"
              >
                {idt("បោះបង់", "Cancel")}
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)} 
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black shadow-md shadow-rose-500/20 transition-all active:scale-95"
              >
                {idt("លុបចោល", "Delete Score")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add New/Edit Score Modal */}
      <AnimatePresence>
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-visible border border-slate-100"
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" />
                {editingId ? idt("កែប្រែព័ត៌មានពិន្ទុ", "Edit Student Score") : idt("បញ្ចូលពិន្ទុសិក្សាថ្មី", "Add Student Academic Score")}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              {/* Select Student */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">{idt("ជ្រើសរើសសិស្ស", "Select Student *")}</label>
                <SearchableSelect 
                  required
                  value={formData.studentId}
                  onChange={(val: string) => {
                    const student = students.find((s: any) => s.id === val);
                    const studentCourse = student?.course || "";
                    setFormData({
                      ...formData,
                      studentId: val,
                      subject: studentCourse || formData.subject
                    });
                  }}
                  placeholder={idt("-- ជ្រើសរើសសិស្ស --", "-- Select Student --")}
                  searchPlaceholder={idt("ស្វែងរកឈ្មោះសិស្ស...", "Search student by name...")}
                  options={students.filter((s: any) => s.status === 'STUDYING').map((s: any) => ({
                    value: s.id,
                    label: `${getStudentName(s)} (${getStudentId(s)})`
                  }))}
                  className="w-full text-xs font-bold"
                />
              </div>

              {/* Month Period and Subject Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">{idt("ខែសិក្សា", "Month Period *")}</label>
                  <input 
                    required type="month" 
                    value={formData.month} 
                    onChange={e => setFormData({...formData, month: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xs font-bold transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">{idt("ឈ្មោះវគ្គសិក្សា *", "Course Name *")}</label>
                  <SearchableSelect
                    options={actualCourseOptions.map((sub: string) => ({ label: sub, value: sub }))}
                    value={formData.subject}
                    onChange={(val: string) => setFormData({ ...formData, subject: val })}
                    placeholder={idt("ជ្រើសរើសឈ្មោះវគ្គសិក្សា...", "Select course name...")}
                    searchPlaceholder={idt("ស្វែងរក...", "Search...")}
                    required
                    triggerClassName="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xs font-bold transition-all flex justify-between items-center"
                  />
                </div>
              </div>

              {/* Score Value & Custom Rank Input */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-500" />
                      {idt("ពិន្ទុទទួលបាន (០-១០០)", "Score (0 - 100) *")}
                    </label>
                    <input 
                      required type="number" step="0.01" min="0" max="100"
                      value={formData.score} 
                      onChange={e => setFormData({...formData, score: e.target.value})}
                      placeholder="e.g. 85"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xs font-black font-mono transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      {idt("ចំណាត់ថ្នាក់ (មិនតម្រូវ)", "Class Rank (Optional)")}
                    </label>
                    <input 
                      type="number" min="1" 
                      value={formData.rank} 
                      onChange={e => setFormData({...formData, rank: e.target.value})}
                      placeholder={idt("ទុកទំនេរសម្រាប់ការគណនា", "Auto-calculated")}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xs font-black font-mono transition-all" 
                    />
                  </div>
                </div>

                {/* Quick Score Preset Buttons inside Add Modal */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ជ្រើសរើសពិន្ទុរហ័ស៖", "Quick Score Presets:")}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["50", "60", "70", "80", "90", "95", "100"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormData({ ...formData, score: preset })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                          formData.score === preset 
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20" 
                            : "bg-slate-100 text-slate-600 hover:bg-slate-250"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Automated Letter Grade Forecast */}
              {formData.score && !isNaN(Number(formData.score)) && (
                <div className="p-4 bg-slate-50 border border-blue-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-500">{idt("ការព្យាករណ៍និទ្ទេស៖", "Auto-grade Letter Preview:")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-black font-mono shadow-3xs ${getGradeDetails(Number(formData.score)).color}`}>
                      {getGradeDetails(Number(formData.score)).letter} ({idt(getGradeDetails(Number(formData.score)).textKh, getGradeDetails(Number(formData.score)).textEn)})
                    </span>
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs transition-colors active:scale-95"
                >
                  {idt("បោះបង់", "Cancel")}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/15 flex items-center gap-2 transition-all duration-200 active:scale-95"
                >
                  <Save className="w-4 h-4" /> {idt("រក្សាទុកពិន្ទុ", "Save Record")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* 1. Bulk Scoring Modal */}
      <AnimatePresence>
      {showBulkModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print"
        >
          <motion.div 
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/60">
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/50 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="block leading-tight">{idt("បញ្ចូលពិន្ទុជាក្រុមសម្រាប់ថ្នាក់រៀន", "Bulk Class Grading Console")}</span>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Academic Assessment Module</span>
                </div>
              </h3>
              <button 
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkSearchQuery("");
                }} 
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                
                {/* 1. Month and Subject Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {idt("ខែសិក្សា", "Month Period *")}
                    </label>
                    <input 
                      required type="month" 
                      value={bulkMonth} 
                      onChange={e => setBulkMonth(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xs font-bold transition-all text-slate-700 shadow-2xs" 
                    />
                  </div>
                   <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      {idt("ឈ្មោះវគ្គសិក្សា *", "Course Name *")}
                    </label>
                    <SearchableSelect
                      options={actualCourseOptions.map((sub: string) => ({ label: sub, value: sub }))}
                      value={bulkSubject}
                      onChange={(val: string) => setBulkSubject(val)}
                      placeholder={idt("ជ្រើសរើសឈ្មោះវគ្គសិក្សា...", "Select course name...")}
                      searchPlaceholder={idt("ស្វែងរក...", "Search...")}
                      required
                      triggerClassName="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xs font-bold transition-all text-slate-700 placeholder-slate-400 shadow-2xs flex justify-between items-center"
                    />
                  </div>
                </div>

                {/* 2. Control Row: Search, Progress, and Quick-Fill Tools */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Search Field & Group-Pulling Switch */}
                    <div className="lg:col-span-7 space-y-2.5">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={bulkSearchQuery}
                          onChange={e => setBulkSearchQuery(e.target.value)}
                          placeholder={idt("ស្វែងរកឈ្មោះសិស្ស ឬ អត្តសញ្ញាណប័ណ្ណ...", "Search roster by name or ID...")}
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xs font-bold transition-all placeholder-slate-400"
                        />
                      </div>
                      
                      {/* Filter by Course Group Option is now automatically enabled */}
                    </div>

                    {/* Completion Gauge */}
                    {(() => {
                      let activeStudents = students.filter((s: any) => s.status === 'STUDYING');
                      if (filterBySelectedCourse && bulkSubject) {
                        activeStudents = activeStudents.filter((student: any) => 
                          isCourseMatch(student.course, bulkSubject)
                        );
                      }
                      const gradedCount = activeStudents.filter((s: any) => bulkGrades[s.id] !== undefined && bulkGrades[s.id] !== "").length;
                      const progressPercent = activeStudents.length > 0 ? (gradedCount / activeStudents.length) * 100 : 0;
                      
                      // Dynamic progress color based on completeness
                      const gaugeColorClass = progressPercent === 100 
                        ? "bg-emerald-600" 
                        : progressPercent > 50 
                        ? "bg-blue-600" 
                        : "bg-blue-600";

                      return (
                        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1">
                              <span>{idt("វឌ្ឍនភាពបញ្ចូលពិន្ទុ", "Grading Completion")}</span>
                              <span className="text-blue-600 font-extrabold">{gradedCount} / {activeStudents.length} {idt("នាក់", "students")} ({progressPercent.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${gaugeColorClass} rounded-full transition-all duration-500`} 
                                style={{ width: `${progressPercent}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 4. Roster List & Grades Entry Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      {idt("បញ្ជីឈ្មោះសិស្ស និងប្រឡប់បញ្ចូលពិន្ទុ", "Class Roster & Grades Entry")}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {idt("ប្រើប្រាស់ Tab ដើម្បីប្តូរសិស្ស", "Press Tab to navigate")}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[44vh] overflow-y-auto pr-1.5 custom-scrollbar border border-slate-100 rounded-2xl p-2 bg-slate-50/20">
                    {(() => {
                      let activeStudents = students.filter((s: any) => s.status === 'STUDYING');

                      if (filterBySelectedCourse && bulkSubject) {
                        activeStudents = activeStudents.filter((student: any) => 
                          isCourseMatch(student.course, bulkSubject)
                        );
                      }

                      const filteredActiveStudents = activeStudents.filter((student: any) => {
                        if (!bulkSearchQuery) return true;
                        const name = getStudentName(student).toLowerCase();
                        const sid = getStudentId(student).toLowerCase();
                        const query = bulkSearchQuery.toLowerCase();
                        return name.includes(query) || sid.includes(query);
                      });

                      if (filteredActiveStudents.length === 0) {
                        return (
                          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 font-bold">
                            {bulkSearchQuery 
                              ? idt("រកមិនឃើញសិស្សដែលត្រូវនឹងការស្វែងរកទេ", "No students matched your search criteria") 
                              : bulkSubject && filterBySelectedCourse
                              ? idt(`គ្មានសិស្សនៅក្នុងវគ្គសិក្សា "${bulkSubject}" ឡើយ`, `No active students registered in "${bulkSubject}" course yet`)
                              : idt("គ្មានសិស្សនៅក្នុងបញ្ជីឈ្មោះឡើយ", "No active students registered in class yet")}
                          </div>
                        );
                      }

                      return filteredActiveStudents.map((student: any) => {
                        const sId = student.id;
                        const scoreValue = bulkGrades[sId] || "";
                        const hasScore = scoreValue !== "";

                        return (
                          <div 
                            key={sId} 
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 hover:bg-slate-50/80 hover:shadow-2xs group relative ${
                              hasScore 
                                ? "bg-white border-emerald-100/80 border-l-4 border-l-emerald-500" 
                                : "bg-white border-slate-100 border-l-4 border-l-slate-300"
                            } focus-within:bg-blue-50/15 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-400`}
                          >
                            {/* Student Profile Block */}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-[11px] font-mono border border-blue-100/40 shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
                                {getStudentName(student).slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-extrabold text-slate-700 truncate">{getStudentName(student)}</p>
                                <p className="text-[10px] font-bold text-slate-400 font-mono mt-0.5 tracking-wider flex items-center gap-1">
                                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{getStudentId(student)}</span>
                                  {hasScore && (
                                    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-black">
                                      <CheckCircle2 className="w-3 h-3" /> {idt("រួចរាល់", "Graded")}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            {/* Scoring Actions Block */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-end">
                              {/* Scoring Input and dynamic Letter Grade Badge */}
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <input 
                                    type="number" min="0" max="100" step="0.1"
                                    placeholder={idt("ពិន្ទុ", "Score")}
                                    value={scoreValue}
                                    onChange={e => setBulkGrades({...bulkGrades, [sId]: e.target.value})}
                                    className="w-24 px-3 py-2 bg-slate-50/50 hover:bg-slate-100/30 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xs font-black font-mono text-center transition-all text-slate-700"
                                  />
                                </div>
                                {scoreValue && !isNaN(Number(scoreValue)) ? (
                                  <span className={`w-10 h-8 flex items-center justify-center text-xs font-black rounded-xl border shadow-3xs ${getGradeDetails(Number(scoreValue)).color} transition-colors duration-200`}>
                                    {getGradeDetails(Number(scoreValue)).letter}
                                  </span>
                                ) : (
                                  <span className="w-10 h-8 flex items-center justify-center text-xs text-slate-300 font-bold border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                                    -
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 text-center sm:text-left flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {idt("* ចំណាត់ថ្នាក់ថ្នាក់នឹងត្រូវគណនាដោយស្វ័យប្រវត្តសម្រាប់ការផ្លាស់ប្តូរទាំងនេះ។", "* Student rankings will automatically recalculate upon submission.")}
                </span>
                <div className="flex gap-3 w-full sm:w-auto shrink-0">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowBulkModal(false);
                      setBulkSearchQuery("");
                    }} 
                    className="flex-1 sm:flex-none px-5 py-2.5 text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-3xs"
                  >
                    {idt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isBulkSaving || students.length === 0}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-600/15 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                  >
                    {isBulkSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {idt("កំពុងរក្សាទុក...", "Saving...")}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {idt("រក្សាទុកជាក្រុម", "Publish Grades")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* 2. Detailed Student Profile Report Modal */}
      <AnimatePresence>
      {studentProfileId && (() => {
        const student = students.find((st: any) => st.id === studentProfileId);
        if (!student) return null;
        
        const personalScores = scores.filter((sc: any) => sc.studentId === studentProfileId || (sc.student && sc.student.id === studentProfileId));
        const avgScore = personalScores.length > 0 
          ? Number((personalScores.reduce((sum, sc) => sum + sc.score, 0) / personalScores.length).toFixed(1))
          : 0;
        const letterDetails = getGradeDetails(avgScore);
        
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-visible border border-slate-100 flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
                <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                  {idt("របាយការណ៍វឌ្ឍនភាពសិក្សាសិស្ស", "Academic Report Card")}
                </h3>
                <button onClick={() => setStudentProfileId(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Header Information */}
                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100/50">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-extrabold shadow-lg shadow-blue-600/25">
                    {getStudentName(student).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800">{getStudentName(student)}</h4>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                      ID: <span className="font-mono text-blue-600 font-extrabold">{getStudentId(student)}</span>
                      {student.phone && <span className="text-slate-300">|</span>}
                      {student.phone && <span className="font-mono">{student.phone}</span>}
                    </p>
                    {student.classRoom && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100/40 rounded-md text-[10px] font-black text-blue-700">
                        {student.classRoom.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{idt("ពិន្ទុមធ្យមភាគ", "Cumulative GPA")}</span>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-extrabold text-slate-800">{avgScore}</span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">{idt("គិតជាមធ្យមគ្រប់វគ្គសិក្សា", "Average of all scored periods")}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{idt("និទ្ទេសរួមបង្គោល", "Overall Letter Grade")}</span>
                    <div className="mt-2">
                      <span className={`px-2.5 py-1 text-xs font-black font-mono rounded-lg border shadow-3xs ${letterDetails.color}`}>
                        {letterDetails.letter} ({idt(letterDetails.textKh, letterDetails.textEn)})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">{idt("ការវាយតម្លៃលើលទ្ធផលសិក្សា", "General progress rating")}</span>
                  </div>
                </div>

                {/* Score breakdown across subjects */}
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    {idt("លទ្ធផលលម្អិតតាមវគ្គសិក្សា", "Course Grade Breakdown")}
                  </h5>

                  {personalScores.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 font-bold border border-dashed border-slate-100 rounded-xl text-xs">
                      {idt("សិស្សម្នាក់នេះពុំទាន់មានពិន្ទុនៅឡើយទេ", "No historical grading logs for this student")}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {personalScores.map((sc: any) => {
                        const tier = getGradeDetails(sc.score);
                        return (
                          <div key={sc.id} className="p-3 bg-white border border-slate-100 rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <span className="font-extrabold text-slate-800">{sc.subject}</span>
                                <span className="ml-2 text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                  {sc.month}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-black font-mono text-slate-700">{sc.score} / 100</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${tier.color}`}>
                                  {tier.letter}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden flex">
                              <div 
                                className={`h-full rounded-full ${sc.score >= 50 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                style={{ width: `${sc.score}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                              <span>{idt("ចំណាត់ថ្នាក់ថ្នាក់៖", "Class Rank:")} <span className="text-blue-600 font-extrabold">{sc.rank || "-"}</span></span>
                              <span>{sc.score >= 50 ? idt("🟢 ជាប់លក្ខណៈសម្បត្តិ", "🟢 Satisfactory / Passed") : idt("🔴 ត្រូវការពង្រឹងបន្ថែម", "🔴 Critical / Remedial")}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setStudentProfileId(null)} 
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md transition-colors active:scale-95"
                >
                  {idt("បិទផ្ទាំង", "Dismiss Card")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}
      </AnimatePresence>

    </div>
  );
}
