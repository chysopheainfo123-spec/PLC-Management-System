import { withSafeCss } from './Dashboard';
import React, { useState, useEffect, useRef } from "react";
import SearchableSelect from "./SearchableSelect";
import { motion } from "motion/react";


import { Award, Printer, Download, Search, Sparkles, User, Users, Calendar, FileText, Check, RotateCcw, SlidersHorizontal, BookOpen, QrCode, Upload, Image, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Student as StudentType } from "../types";

interface CertificatesTabProps {
  token?: string;
  students: StudentType[];
  teachers?: any[];
  uiLang: "kh" | "en" | "zh";
  showToast: (msg: string, type: "success" | "error" | "info") => void;
  schoolName?: string;
  schoolKhmerName?: string;
  directorName?: string;
}

export function CertificatesTab({ 
  students, 
  teachers = [], 
  uiLang, 
  showToast, 
  token,
  schoolName: globalSchoolName,
  schoolKhmerName: globalSchoolKhmerName,
  directorName: globalDirectorName
}: CertificatesTabProps) {
  // Translate helper
  const idt = (kh: string, en?: string, zh?: string) => {
    if (uiLang === "en") return en || kh;
    if (uiLang === "zh") return zh || en || kh;
    return kh;
  };

  // List of completed students
  const completedStudents = students.filter(s => s.status === "COMPLETED");
  const activeStudents = students.filter(s => s.status === "STUDYING");

  // Recipient Mode & State
  const [recipientMode, setRecipientMode] = useState<"student" | "teacher_staff">("student");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  // Certificate Type
  // - "academic": វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា (Academic Certificate)
  // - "commendation": បណ្ណសសើរ (Certificate of Commendation)
  // - "appreciation": លិខិតសរសើរ (Certificate of Appreciation)
  const [certType, setCertType] = useState<"academic" | "commendation" | "appreciation">("academic");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "studying">("all");

  // Editable Certificate Fields
  const [studentNameKh, setStudentNameKh] = useState("");
  const [studentNameEn, setStudentNameEn] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [courseName, setCourseName] = useState("");
  const [level, setLevel] = useState("");
  const [grade, setGrade] = useState("ល្អប្រសើរ");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [studyHours, setStudyHours] = useState("៤៥ ម៉ោង");
  const [certNumber, setCertNumber] = useState("");
  const [directorName, setDirectorName] = useState("ជី សុភា");
  const [directorTitleKh, setDirectorTitleKh] = useState("នាយកវិទ្យាស្ថាន");
  const [directorTitleEn, setDirectorTitleEn] = useState("Director of Institute");
  const [issueDateKh, setIssueDateKh] = useState("ថ្ងៃទី០៨ ខែកក្កដា ឆ្នាំ២០២៦");
  const [issueDateEn, setIssueDateEn] = useState("July 8, 2026");
  const [schoolNameKh, setSchoolNameKh] = useState("សាលាបច្ចេកវិទ្យា ភីអិលស៊ី");
  const [schoolNameEn, setSchoolNameEn] = useState("PLC Technology School");
  const [showSchoolName, setShowSchoolName] = useState(true);

  useEffect(() => {
    if (globalSchoolKhmerName) {
      setSchoolNameKh(globalSchoolKhmerName);
    }
    if (globalSchoolName) {
      setSchoolNameEn(globalSchoolName);
    }
    if (globalDirectorName) {
      const cleanDirectorName = globalDirectorName.includes("(") 
        ? globalDirectorName.split("(")[0].trim() 
        : globalDirectorName;
      setDirectorName(cleanDirectorName);
    }
  }, [globalSchoolKhmerName, globalSchoolName, globalDirectorName]);

  // --- Auto Translation Helper functions ---
  const khmerToEngDigits = (str: string): string => {
    const map: { [key: string]: string } = {
      "០": "0", "១": "1", "២": "2", "៣": "3", "៤": "4",
      "៥": "5", "៦": "6", "៧": "7", "៨": "8", "៩": "9"
    };
    return str.split("").map(char => map[char] || char).join("");
  };

  const translateKhmerDateToEnglish = (khmer: string): string => {
    const months: { [key: string]: string } = {
      "មករា": "January", "កុម្ភៈ": "February", "មីនា": "March",
      "មេសា": "April", "ឧសភា": "May", "មិថុនា": "June",
      "កក្កដា": "July", "សីហា": "August", "កញ្ញា": "September",
      "តុលា": "October", "វិច្ឆិកា": "November", "ធ្នូ": "December"
    };

    let matchedMonth = "";
    let engMonth = "";
    for (const kmMonth of Object.keys(months)) {
      if (khmer.includes(kmMonth)) {
        matchedMonth = kmMonth;
        engMonth = months[kmMonth];
        break;
      }
    }

    if (!engMonth) return "";

    let day = "";
    const dayMatch = khmer.match(/ថ្ងៃទី\s*([០-៩]+)/);
    if (dayMatch) {
      day = khmerToEngDigits(dayMatch[1]);
    } else {
      const monthIndex = khmer.indexOf(matchedMonth);
      const beforeMonth = khmer.substring(0, monthIndex);
      const digitsMatch = beforeMonth.match(/([០-៩]+)/);
      if (digitsMatch) {
        day = khmerToEngDigits(digitsMatch[1]);
      }
    }

    let year = "";
    const yearMatch = khmer.match(/ឆ្នាំ\s*([០-៩]+)/);
    if (yearMatch) {
      year = khmerToEngDigits(yearMatch[1]);
    } else {
      const monthIndex = khmer.indexOf(matchedMonth);
      const afterMonth = khmer.substring(monthIndex + matchedMonth.length);
      const digitsMatch = afterMonth.match(/([០-៩]+)/);
      if (digitsMatch) {
        year = khmerToEngDigits(digitsMatch[1]);
      }
    }

    if (day && year) {
      return `${engMonth} ${parseInt(day, 10)}, ${year}`;
    } else if (year) {
      return `${engMonth} ${year}`;
    } else {
      return engMonth;
    }
  };

  const translateKhmerTitleToEnglish = (khmer: string): string => {
    const trimmed = khmer.trim();
    if (!trimmed) return "";

    const dict: { [key: string]: string } = {
      "នាយកវិទ្យាស្ថាន": "Director of Institute",
      "នាយករងវិទ្យាស្ថាន": "Deputy Director of Institute",
      "នាយកសាលា": "School Principal",
      "នាយករងសាលា": "Deputy School Principal",
      "នាយកគ្រប់គ្រង": "Managing Director",
      "នាយកប្រតិបត្តិ": "Executive Director",
      "នាយករង": "Deputy Director",
      "នាយក": "Director",
      "នាយកមជ្ឈមណ្ឌល": "Director of Center",
      "នាយករងមជ្ឈមណ្ឌល": "Deputy Director of Center",
      "ប្រធានវិទ្យាស្ថាន": "President of Institute",
      "អនុប្រធានវិទ្យាស្ថាន": "Vice President of Institute",
      "ប្រធានមជ្ឈមណ្ឌល": "Head of Center",
      "អនុប្រធានមជ្ឈមណ្ឌល": "Deputy Head of Center",
      "ប្រធានផ្នែក": "Department Head",
      "អនុប្រធានផ្នែក": "Deputy Department Head",
      "ប្រធានការិយាល័យ": "Head of Office",
      "អនុប្រធានការិយាល័យ": "Deputy Head of Office",
      "ប្រធាន": "President",
      "អនុប្រធាន": "Vice President",
      "ស្ថាបនិក": "Founder",
      "សហស្ថាបនិក": "Co-Founder",
      "គ្រូបង្រៀន": "Teacher",
      "គ្រូបង្គោល": "Lead Teacher",
      "សាស្ត្រាចារ្យ": "Professor",
      "បណ្ណារក្ស": "Librarian",
      "រដ្ឋបាល": "Administrator",
      "អ្នកសម្របសម្រួល": "Coordinator",
      "ប្រធានបច្ចេកទេស": "Technical Head",
      "ជំនួយការ": "Assistant",
      "លេខា": "Secretary",
      "លេខាធិការ": "Secretary",
      "គណនេយ្យ": "Accountant",
      "គណនេយ្យករ": "Accountant",
      "បេឡា": "Cashier",
      "បេឡាករ": "Cashier",
      "វិទ្យាស្ថាន": "Institute",
      "មជ្ឈមណ្ឌល": "Center",
      "សាលា": "School",
      "ផ្នែក": "Department",
      "ការិយាល័យ": "Office",
    };

    if (dict[trimmed]) return dict[trimmed];

    // If there is "និង" (and) or " / " or " ," split and translate each segment
    const separators = [" និង ", " / ", " & ", " , ", ", ", " "];
    for (const sep of separators) {
      if (trimmed.includes(sep)) {
        const parts = trimmed.split(sep);
        const translatedParts: string[] = parts.map(p => {
          const pTrimmed = p.trim();
          return dict[pTrimmed] || translateKhmerTitleToEnglish(pTrimmed);
        });
        if (translatedParts.every(Boolean)) {
          const engSep = sep === " និង " ? " & " : sep;
          return translatedParts.join(engSep);
        }
      }
    }

    if (trimmed.startsWith("ប្រធាន")) {
      const sub = trimmed.substring(6).trim();
      if (sub) {
        const subEng = dict[sub] || sub;
        return `Head of ${subEng}`;
      }
    }
    if (trimmed.startsWith("អនុប្រធាន")) {
      const sub = trimmed.substring(9).trim();
      if (sub) {
        const subEng = dict[sub] || sub;
        return `Deputy Head of ${subEng}`;
      }
    }
    if (trimmed.startsWith("នាយក")) {
      const sub = trimmed.substring(4).trim();
      if (sub) {
        const subEng = dict[sub] || sub;
        return `Director of ${subEng}`;
      }
    }
    if (trimmed.startsWith("នាយករង")) {
      const sub = trimmed.substring(6).trim();
      if (sub) {
        const subEng = dict[sub] || sub;
        return `Deputy Director of ${subEng}`;
      }
    }

    return "";
  };

  // 1. Title Auto-translation Effect
  useEffect(() => {
    if (!directorTitleKh || !directorTitleKh.trim()) return;

    // Local dictionary match first (instant)
    const localMatch = translateKhmerTitleToEnglish(directorTitleKh);
    if (localMatch) {
      setDirectorTitleEn(localMatch);
      return;
    }

    // Debounced API fallback
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=km&tl=en&dt=t&q=${encodeURIComponent(directorTitleKh)}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            const translated = data[0][0][0];
            // Format to Title Case
            const titleCase = translated
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ");
            setDirectorTitleEn(titleCase);
          }
        }
      } catch (err) {
        console.error("Auto translation error:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [directorTitleKh]);

  // 2. Date Auto-translation Effect
  useEffect(() => {
    if (!issueDateKh || !issueDateKh.trim()) return;

    // Try parsing/translating locally first (instant)
    const localDateMatch = translateKhmerDateToEnglish(issueDateKh);
    if (localDateMatch) {
      setIssueDateEn(localDateMatch);
      return;
    }

    // Debounced API fallback
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=km&tl=en&dt=t&q=${encodeURIComponent(issueDateKh)}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            const translated = data[0][0][0];
            setIssueDateEn(translated);
          }
        }
      } catch (err) {
        console.error("Auto date translation error:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [issueDateKh]);


  
  // Custom Styles
  const [borderStyle, setBorderStyle] = useState<"gold-royal" | "red-ceremonial" | "modern-navy">("gold-royal");
  const [showQrCode, setShowQrCode] = useState(true);
  const [showStamp, setShowStamp] = useState(true);
  const [showBorder, setShowBorder] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [customSealText, setCustomSealText] = useState("PLC Technology School");
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const handleUpload = async (file: File, setUrl: (url: string) => void) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast(idt("ទំហំរូបភាពធំជាង ៥MB!", "Image exceeds 5MB!", "图片超过5MB！"), "error");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUrl(data.url);
        showToast(idt("បានផ្ទុកឡើងរូបភាពជោគជ័យ!", "Image uploaded successfully!", "图片上传成功！"), "success");
      } else {
        showToast(data.message || "Error uploading image", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Error uploading image", "error");
    }
  };

  const [studentPhoto, setStudentPhoto] = useState<string | null>(null);
  const [showStudentPhoto, setShowStudentPhoto] = useState(true);
  const [customSealImage, setCustomSealImage] = useState<string | null>(null);
  const [sealOffsetX, setSealOffsetX] = useState<number>(0);
  const [sealOffsetY, setSealOffsetY] = useState<number>(0);
  const [sealSize, setSealSize] = useState<number>(1);
  const [sealRotation, setSealRotation] = useState<number>(0);
  const [headerYOffset, setHeaderYOffset] = useState<number>(0);
  const [titleYOffset, setTitleYOffset] = useState<number>(0);
  const [bodyYOffset, setBodyYOffset] = useState<number>(0);
  const [footerYOffset, setFooterYOffset] = useState<number>(0);
  const [footerLeftXOffset, setFooterLeftXOffset] = useState<number>(0);
  const [footerLeftYOffset, setFooterLeftYOffset] = useState<number>(0);
  const [footerRightXOffset, setFooterRightXOffset] = useState<number>(0);
  const [footerRightYOffset, setFooterRightYOffset] = useState<number>(0);
  const [isAlignExpanded, setIsAlignExpanded] = useState<boolean>(false);
  const [isElementsExpanded, setIsElementsExpanded] = useState<boolean>(false);
  const [isTemplateExpanded, setIsTemplateExpanded] = useState<boolean>(false);
  const [isCustomBgExpanded, setIsCustomBgExpanded] = useState<boolean>(false);
  const [isStudentPhotoExpanded, setIsStudentPhotoExpanded] = useState<boolean>(false);
  const [isStampExpanded, setIsStampExpanded] = useState<boolean>(false);

  const getBorderColorHex = () => {
    if (borderStyle === "gold-royal") return "#fbbf24";
    if (borderStyle === "red-ceremonial") return "#be123c";
    return "#1e293b"; // modern-navy (slate-800)
  };

  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      const parentWidth = containerRef.current?.getBoundingClientRect().width || 1123;
      // We want the inner container (1123px wide) to scale down to fit the parent width perfectly
      const availableWidth = parentWidth - 48; // p-4 or p-8 container spacing
      const newScale = Math.min(1, availableWidth / 1123);
      setScale(newScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Auto fill when student changes
  useEffect(() => {
    if (selectedStudentId && recipientMode === "student") {
      const student = students.find(s => s.id === selectedStudentId);
      if (student) {
        setStudentNameKh(student.nameKh || "");
        setStudentNameEn(student.nameEn || "");
        setGender(student.gender || "Male");
        setCourseName(student.course || "");
        setLevel(student.level || "Level 1");
        setStartDate(student.startDate || "");
        setEndDate(student.endDate || "");
        
        // Custom hours fallback
        setStudyHours(student.hours ? String(student.hours) : "៤៥ ម៉ោង");
        
        // Auto certificate number
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const stId = student.studentId ? student.studentId.replace("SMS-ST-", "") : "ST";
        setCertNumber(`PLC-CERT-${stId}-${randomNum}`);
        
        // Determine default grade based on payment/due or random excellent/very good
        const gradeOptions = [
          "ល្អប្រសើរ",
          "ល្អណាស់ (Very Good)",
          "ល្អ (Good)"
        ];
        const randomGrade = gradeOptions[student.id === "101" ? 0 : (Number(student.id) % 3)];
        setGrade(randomGrade || "ល្អប្រសើរ");

        showToast(idt("បានបំពេញទិន្នន័យសិស្សស្វ័យប្រវត្តិ!", "Student data auto-filled!", "学生数据已自动填充！"), "success");
      }
    }
  }, [selectedStudentId, recipientMode]);

  // Auto fill when teacher/staff changes
  useEffect(() => {
    if (selectedTeacherId && recipientMode === "teacher_staff") {
      const teacher = teachers.find(t => t.id === selectedTeacherId);
      if (teacher) {
        setStudentNameKh(teacher.nameKh || "");
        setStudentNameEn(teacher.nameEn || "");
        setGender(teacher.gender || "Male");
        setCourseName(teacher.specialty || "IT Specialist");
        setLevel(idt("គ្រូបង្រៀន", "Instructor", "教师") || "");
        setStartDate(teacher.joinDate || "2026-01-01");
        setEndDate(teacher.leaveDate || idt("បច្ចុប្បន្ន", "Present", "至今") || "");
        
        // Custom hours/duration fallback for staff
        const expDays = teacher.experienceDays ? `${teacher.experienceDays} ${idt("ថ្ងៃ", "Days", "天")}` : "";
        setStudyHours(expDays || idt("ពេញម៉ោង", "Full-time", "全职") || "");
        
        // Auto certificate number
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const code = teacher.teacherId ? teacher.teacherId.replace("SMS-T-", "") : (teacher.id || "STAFF");
        setCertNumber(`PLC-STAFF-CERT-${code}-${randomNum}`);
        
        // Grade is Outstanding or Excellence
        setGrade(idt("បុគ្គលិកឆ្នើម", "Outstanding Staff", "优秀员工") || "");

        // Smart UX: automatically switch certificate type to commendation or appreciation
        if (certType === "academic") {
          setCertType("commendation");
        }

        showToast(idt("បានបំពេញទិន្នន័យគ្រូ/បុគ្គលិកស្វ័យប្រវត្តិ!", "Teacher/Staff data auto-filled!", "教师/员工数据已自动填充！"), "success");
      }
    }
  }, [selectedTeacherId, recipientMode]);

  // Load first student by default
  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      // Prefer completed if any
      const firstTarget = completedStudents.length > 0 ? completedStudents[0] : students[0];
      setSelectedStudentId(firstTarget.id);
    }
  }, [students]);

  // Load first teacher by default
  useEffect(() => {
    if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teachers]);

  // Helper to trigger print of the certificate element
  const handlePrint = () => {
    if (!certificateRef.current) return;

    // 1. Inject dynamic print styling to force A4 landscape orientation automatically
    const printStyle = document.createElement("style");
    printStyle.id = "print-cert-landscape-style";
    printStyle.textContent = "@media print { @page { size: A4 landscape !important; margin: 0 !important; } }";
    document.head.appendChild(printStyle);

    // 2. Add class to body to trigger print overrides in index.css
    document.body.classList.add("printing-certificate");

    const handleAfterPrint = () => {
      document.body.classList.remove("printing-certificate");
      const el = document.getElementById("print-cert-landscape-style");
      if (el) el.remove();
      window.removeEventListener("afterprint", handleAfterPrint);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    // 3. Trigger standard browser print dialog
    window.print();

    // Fallback if event doesn't fire
    setTimeout(handleAfterPrint, 2000);
  };

  // Helper to download as high-res PNG or PDF
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const handleDownload = async (format: "png" | "pdf") => {
    if (!certificateRef.current) return;
    
    // Create a pristine cloned element to prevent mobile clipping and scale/transform issues
    const originalNode = certificateRef.current;
    const clone = originalNode.cloneNode(true) as HTMLDivElement;
    
    // Position the clone completely off-screen but visible in DOM so html2canvas can render it fully at full scale
    clone.style.position = "fixed";
    clone.style.top = "0px";
    clone.style.left = "-10000px";
    clone.style.width = "1123px";
    clone.style.height = "794px";
    clone.style.minWidth = "1123px";
    clone.style.minHeight = "794px";
    clone.style.maxWidth = "1123px";
    clone.style.maxHeight = "794px";
    clone.style.transform = "none";
    clone.style.margin = "0";
    clone.style.zIndex = "-10000";
    clone.style.visibility = "visible";
    clone.style.opacity = "1";
    clone.style.boxShadow = "none";
    clone.classList.remove("shadow-2xl");
    
    document.body.appendChild(clone);

    const removedNodes: { node: Node; parent: Node; nextSibling: Node | null }[] = [];
    const temporaryStyleElements: HTMLStyleElement[] = [];
    const originalAdopted = (document as any).adoptedStyleSheets;
    let restoredAdopted = false;
    const originalGetComputedStyle = window.getComputedStyle;

    try {
      if (format === "pdf") {
        setIsDownloadingPdf(true);
        showToast(idt("កំពុងបង្កើតឯកសារ PDF...", "Generating PDF certificate...", "正在生成PDF证书..."), "info");
      } else {
        setIsDownloading(true);
        showToast(idt("កំពុងបង្កើតរូបភាពវិញ្ញាបនបត្រ...", "Generating certificate image...", "正在生成证书图片..."), "info");
      }
      
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

      // Intercept window.getComputedStyle to dynamically replace oklch/oklab values during image generation
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
        }) as any;
      };

      // Disable adoptedStyleSheets dynamically to force fallback to standard stylesheets
      if (originalAdopted && originalAdopted.length > 0) {
        try {
          (document as any).adoptedStyleSheets = [];
          restoredAdopted = true;
        } catch (e) {
          console.warn("Failed to temporarily clear adoptedStyleSheets:", e);
        }
      }

      // Sanitize document stylesheets to replace "oklch" and "oklab" color functions
      try {
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            if (sheet.cssRules) {
              const rules = Array.from(sheet.cssRules);
              const needsSanitization = rules.some(r => r.cssText.includes("oklch") || r.cssText.includes("oklab"));
              if (needsSanitization) {
                const cssText = rules.map(r => r.cssText).join("\n");
                const sanitizedText = sanitizeCssColors(cssText);

                // Create a temporary style element with sanitized CSS
                const tempStyle = document.createElement("style");
                tempStyle.setAttribute("data-temp-sanitized-style", "true");
                tempStyle.textContent = sanitizedText;
                document.head.appendChild(tempStyle);
                temporaryStyleElements.push(tempStyle);

                // Physically remove the original sheet's ownerNode from DOM
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
            // CORS stylesheet fetch fallback
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

            if (!fetchedAndSanitized && node && node.parentNode) {
              const parent = node.parentNode;
              const nextSibling = node.nextSibling;
              removedNodes.push({ node, parent, nextSibling });
              parent.removeChild(node);
            }
          }
        }
      } catch (styleSanitizeErr) {
        console.warn("Stylesheet sanitization failed, proceeding anyway:", styleSanitizeErr);
      }
      
      const { safeToJpeg: toJpeg } = await import('../lib/safe-html-to-image');
      const jsPDF = (await import('jspdf')).default;
      const canvas = await withSafeCss(async () => await html2canvas(clone, {
        ...({ scale: 2 } as any), // Double resolution for crystal clear prints
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 1123,
        height: 794,
        windowWidth: 1123,
        windowHeight: 794,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0
      }));
      
      const imgData = canvas.toDataURL("image/png");
      if (format === "pdf") {
        const pdf = new jsPDF("l", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
        pdf.save(`${studentNameEn.replace(/\s+/g, "_")}_${certType}_certificate.pdf`);
        showToast(idt("បានទាញយក PDF ដោយជោគជ័យ!", "PDF Certificate downloaded successfully!", "PDF证书下载成功！"), "success");
      } else {
        const link = document.createElement("a");
        link.download = `${studentNameEn.replace(/\s+/g, "_")}_${certType}_certificate.png`;
        link.href = imgData;
        link.click();
        showToast(idt("បានទាញយករូបភាពដោយជោគជ័យ!", "Certificate downloaded successfully!", "证书图片下载成功！"), "success");
      }
    } catch (err) {
      console.error(err);
      showToast(idt("មានបញ្ហាក្នុងការទាញយក!", "Failed to download certificate!", "生成证书失败！"), "error");
    } finally {
      // Clean up clone from DOM
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }

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
      setIsDownloading(false);
      setIsDownloadingPdf(false);
    }
  };

  // Khmer numbers conversion helper for Khmer dates
  const toKhmerNumbers = (numStr: string) => {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return numStr.replace(/\d/g, (digit) => khmerDigits[parseInt(digit)]);
  };

  const filteredStudentsForDropdown = students.filter(s => {
    if (filterStatus === "completed") return s.status === "COMPLETED";
    if (filterStatus === "studying") return s.status === "STUDYING";
    return true;
  });

  return (
    <div className="w-full space-y-8 print:p-0 print:bg-white">
      {/* 1. Print CSS Overrides */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate-area, #printable-certificate-area * {
            visibility: visible !important;
          }
          #printable-certificate-area {
            display: flex !important;
            position: fixed !important;
            z-index: 9999999 !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            min-width: 297mm !important;
            max-width: 297mm !important;
            min-height: 210mm !important;
            max-height: 210mm !important;
            transform: none !important;
            margin: 0 !important;
            padding: 12mm !important;
            border: ${showBorder ? `solid 14px ${getBorderColorHex()}` : "none"} !important;
            box-shadow: none !important;
            background-color: ${showBackground ? "white" : "transparent"} !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 landscape !important;
            margin: 0 !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.4);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.6);
        }
      `}</style>

      {/* Quick Filter & Student/Teacher Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-3xs space-y-3 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <span className="text-xs font-black text-slate-700 flex items-center gap-2">
            {recipientMode === "student" ? (
              <>
                <User className="w-4 h-4 text-primary-500" />
                <span>{idt("ជ្រើសរើសសិស្សទទួល", "Select Recipient Student", "选择获得证书学生")}</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4 text-rose-500" />
                <span>{idt("ជ្រើសរើសគ្រូ ឬបុគ្គលិកទទួល", "Select Teacher/Staff Recipient", "选择获得证书教师与员工")}</span>
              </>
            )}
          </span>
          
          {/* Segmented Control Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => {
                setRecipientMode("student");
                // Fill first student automatically
                if (students.length > 0) {
                  const firstTarget = completedStudents.length > 0 ? completedStudents[0] : students[0];
                  setSelectedStudentId(firstTarget.id);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recipientMode === "student"
                  ? "bg-white text-primary-600 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{idt("សិស្ស", "Student", "学生")}</span>
            </button>
            <button
              onClick={() => {
                setRecipientMode("teacher_staff");
                // Fill first teacher automatically
                if (teachers.length > 0) {
                  setSelectedTeacherId(teachers[0].id);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                recipientMode === "teacher_staff"
                  ? "bg-white text-rose-600 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{idt("គ្រូ / បុគ្គលិក", "Teacher/Staff", "教师/员工")}</span>
            </button>
          </div>
        </div>

        {recipientMode === "student" ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {idt("សិស្សក្នុងបញ្ជី", "Recipient Dropdown", "毕业生名单")}
              </label>
              <div className="flex gap-1.5 text-[9px] font-black">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    filterStatus === "all" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {idt("ទាំងអស់", "All")} ({students.length})
                </button>
                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    filterStatus === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {idt("ចប់ការសិក្សា", "Completed")} ({completedStudents.length})
                </button>
              </div>
            </div>
            <div className="relative">
              <SearchableSelect
                value={selectedStudentId}
                onChange={(val: string) => setSelectedStudentId(val)}
                placeholder={`-- ${idt("ជ្រើសរើសសិស្ស", "Select Student", "请选择学生")} --`}
                searchPlaceholder={idt("ស្វែងរកសិស្ស...", "Search student...", "搜索学生...")}
                options={filteredStudentsForDropdown.map((s) => ({
                  value: s.id,
                  label: `${s.nameKh} (${s.nameEn}) - ${s.course} [${s.status === "COMPLETED" ? "GRADUATED" : "STUDYING"}]`
                }))}
                className="w-full text-xs font-bold"
                triggerClassName="w-full h-11 px-3 border border-slate-200 bg-slate-50 rounded-xl flex items-center justify-between text-slate-800"
              />
            </div>
            <p className="text-[10px] font-semibold text-slate-400 italic">
              * {idt("ការជ្រើសរើសសិស្សនឹងបំពេញព័ត៌មានសិក្សាទាំងអស់ដោយស្វ័យប្រវត្តិ", "Selecting a student automatically extracts their course, level, duration and name info.", "选择学生将自动关联并导入该学生的课程、级别、学习起止日期及中英文姓名。")}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {idt("គ្រូ / បុគ្គលិកក្នុងបញ្ជី", "Teachers & Staff Dropdown", "教师和员工名单")}
            </label>
            <div className="relative">
              <SearchableSelect
                value={selectedTeacherId}
                onChange={(val: string) => setSelectedTeacherId(val)}
                placeholder={`-- ${idt("ជ្រើសរើសគ្រូ / បុគ្គលិក", "Select Teacher / Staff", "请选择教师/员工")} --`}
                searchPlaceholder={idt("ស្វែងរកគ្រូ/បុគ្គលិក...", "Search teacher/staff...", "搜索教师/员工...")}
                options={teachers.map((t) => ({
                  value: t.id,
                  label: `${t.nameKh} (${t.nameEn}) - ${t.specialty} [${t.status}]`
                }))}
                className="w-full text-xs font-bold"
                triggerClassName="w-full h-11 px-3 border border-slate-200 bg-slate-50 rounded-xl flex items-center justify-between text-slate-800"
              />
            </div>
            <p className="text-[10px] font-semibold text-slate-400 italic">
              * {idt("ការជ្រើសរើសគ្រូ ឬបុគ្គលិក នឹងបំពេញព័ត៌មាន និងជំនាញដោយស្វ័យប្រវត្តិសម្រាប់ការធ្វើបណ្ណសសើរ ឬលិខិតសរសើរ។", "Selecting a teacher or staff automatically fills their profile and specialty info for commendation or appreciation certificates.", "选择教师或员工将自动导入其基本资料和专长，以快速制作荣誉证书或表彰信。")}
            </p>
          </div>
        )}
      </div>

      {/* Main Grid: Settings on Left, Live Canvas on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start print:block print:w-full">
        
        {/* LEFT COLUMN: DESIGNER CONTROLS & SELECTION (Hidden on Print) */}
        <div className="xl:col-span-4 space-y-6 print:hidden xl:sticky xl:top-6">
          
          {/* Certificate Styling and Template controls */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-3xs space-y-6 xl:max-h-[calc(100vh-140px)] xl:overflow-y-auto custom-scrollbar">
            <button
              type="button"
              onClick={() => setIsTemplateExpanded(!isTemplateExpanded)}
              className="w-full flex items-center justify-between text-left group focus:outline-none border-b border-slate-100 pb-3"
            >
              <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                {idt("រចនាបថ និងប្រភេទវិញ្ញាបនបត្រ", "Template Settings & Options", "证书类型与版式选择")}
              </span>
              <div className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-xl transition-colors">
                {isTemplateExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {isTemplateExpanded && (
              <>
                {/* Template selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {idt("ប្រភេទវិញ្ញាបនបត្រ", "Certificate Document Type", "证书奖状种类")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setCertType("academic");
                        setBorderStyle("gold-royal");
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        certType === "academic"
                          ? "bg-primary-50/50 border-primary-200 text-primary-700 font-extrabold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-500 font-bold"
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span className="text-[10px] truncate">{idt("វិញ្ញាបនបត្រ", "Certificate", "毕业证书")}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCertType("commendation");
                        setBorderStyle("red-ceremonial");
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        certType === "commendation"
                          ? "bg-rose-50/50 border-rose-200 text-rose-700 font-extrabold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-500 font-bold"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] truncate">{idt("បណ្ណសសើរ", "Commendation", "荣誉奖状")}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCertType("appreciation");
                        setBorderStyle("modern-navy");
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        certType === "appreciation"
                          ? "bg-slate-50/80 border-slate-300 text-slate-800 font-extrabold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-500 font-bold"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-[10px] truncate">{idt("លិខិតសរសើរ", "Appreciation", "表彰信")}</span>
                    </button>
                  </div>
                </div>

                {/* Border theme style */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {idt("រចនាបថគែមជាយ", "Border Palette", "外框花纹配色")}
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: "gold-royal", label: idt("ពណ៌មាស", "Royal Gold"), color: "bg-amber-400" },
                      { id: "red-ceremonial", label: idt("ពណ៌ក្រហម", "Ceremonial Red"), color: "bg-rose-650" },
                      { id: "modern-navy", label: idt("ពណ៌ខៀវ", "Modern Navy"), color: "bg-primary-900" }
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setBorderStyle(style.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                          borderStyle === style.id ? "bg-slate-900 border-slate-950 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${style.color}`} />
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Custom details form */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {idt("កែសម្រួលព័ត៌មានលម្អិត", "Fine-Tune Certificate Text", "手动微调证书文字")}
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ឈ្មោះខ្មែរ", "Khmer Name")}</label>
                  <input
                    type="text"
                    value={studentNameKh || ""}
                    onChange={(e) => setStudentNameKh(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ឈ្មោះឡាតាំង", "Latin Name")}</label>
                  <input
                    type="text"
                    value={studentNameEn || ""}
                    onChange={(e) => setStudentNameEn(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-sans uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ភេទ", "Gender")}</label>
                  <select
                    value={gender || "Male"}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <option value="Male">{idt("ប្រុស", "Male")}</option>
                    <option value="Female">{idt("ស្រី", "Female")}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("និទ្ទេស", "Grade / Merit")}</label>
                  <input
                    type="text"
                    value={grade || ""}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("វគ្គសិក្សា", "Course / Subject")}</label>
                <input
                  type="text"
                  value={courseName || ""}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("កម្រិត", "Level")}</label>
                  <input
                    type="text"
                    value={level || ""}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ម៉ោងសិក្សាសរុប", "Total Hours")}</label>
                  <input
                    type="text"
                    value={studyHours || ""}
                    onChange={(e) => setStudyHours(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ថ្ងៃចាប់ផ្តើម", "Start Date")}</label>
                  <input
                    type="date"
                    value={startDate || ""}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ថ្ងៃបញ្ចប់", "End Date")}</label>
                  <input
                    type="date"
                    value={endDate || ""}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("លេខបញ្ជាក់វិញ្ញាបនបត្រ", "Certificate No.")}</label>
                <input
                  type="text"
                  value={certNumber || ""}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono"
                />
              </div>

              {/* Show / Hide Elements Controls */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsElementsExpanded(!isElementsExpanded)}
                  className="w-full flex items-center justify-between text-left group focus:outline-none"
                >
                  <span className="text-[10px] font-black text-primary-600 uppercase tracking-wider block">
                    {idt("លាក់ ឬបង្ហាញផ្នែកផ្សេងៗ", "Show / Hide Elements", "显示与隐藏选项")}
                  </span>
                  <div className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-xl transition-colors">
                    {isElementsExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
                
                {isElementsExpanded && (
                  <div className="space-y-1.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  {/* Toggle 1: Border */}
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-3xs transition-all cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700">{idt("បង្ហាញស៊ុមព័ទ្ធជុំវិញ", "Show Border Frame", "显示外框")}</p>
                        <p className="text-[9px] font-semibold text-slate-400">{idt("ស៊ុមតុបតែងជាយ", "Decorative border frame", "证书装饰花纹外框")}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!showBorder}
                      onChange={(e) => setShowBorder(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 2: Background Tint */}
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-3xs transition-all cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700">{idt("បង្ហាញពណ៌ផ្ទៃខាងក្រោយ", "Show Background Colors", "显示背景底纹")}</p>
                        <p className="text-[9px] font-semibold text-slate-400">{idt("ផ្ទៃក្រោយពណ៌ស្រាល", "Light background tints", "证书内部淡雅背景底色")}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!showBackground}
                      onChange={(e) => setShowBackground(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 3: Logo Watermark */}
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-3xs transition-all cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-550/10 flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700">{idt("បង្ហាញ LOGO Watermark", "Show Watermark Logo", "显示水印LOGO")}</p>
                        <p className="text-[9px] font-semibold text-slate-400">{idt("ឡូហ្គោព្រាលកណ្តាល", "Faded background logo", "证书中心淡化LOGO水印")}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!showWatermark}
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 4: Student Photo */}
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-3xs transition-all cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700">{idt("បង្ហាញរូបថតសិស្ស ៤x៦", "Show Student Photo", "显示学生照片")}</p>
                        <p className="text-[9px] font-semibold text-slate-400">{idt("រូបភាពសិស្សផ្ទាល់ខ្លួន", "4x6 portrait photo", "学生本人的4x6免冠照片")}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!showStudentPhoto}
                      onChange={(e) => setShowStudentPhoto(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 6: Security QR Code */}
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-3xs transition-all cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-550/10 flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform">
                        <QrCode className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700">{idt("បង្ហាញកូដ QR ស្កេនពិនិត្យ", "Show Validation QR Code", "显示验证二维码")}</p>
                        <p className="text-[9px] font-semibold text-slate-400">{idt("សម្រាប់ស្កេនផ្ទៀងផ្ទាត់", "QR for verification", "防伪安全核验二维码")}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!showQrCode}
                      onChange={(e) => setShowQrCode(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle 7: Institutional Stamp/Seal */}
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-3xs transition-all cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700">{idt("បង្ហាញត្រាវិទ្យាស្ថានផ្លូវការ", "Show Official Stamp", "显示官方印章")}</p>
                        <p className="text-[9px] font-semibold text-slate-400">{idt("ត្រាក្រហមផ្លូវការ", "Red official institute seal", "落款处的红色官方印章")}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!showStamp}
                      onChange={(e) => setShowStamp(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>
                </div>
              )}
            </div>

              {/* Align Text with Background Template */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsAlignExpanded(!isAlignExpanded)}
                  className="w-full flex items-center justify-between text-left group focus:outline-none"
                >
                  <span className="text-[10px] font-black text-primary-600 uppercase tracking-wider block">
                    {idt("កែសម្រួលគម្លាតអក្សរផ្ទៃក្រោយ", "Align Text with Background", "对齐背景文字")}
                  </span>
                  <div className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-xl transition-colors">
                    {isAlignExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
                
                {isAlignExpanded && (
                  <div className="space-y-3.5 text-left bg-primary-50/20 p-3.5 rounded-2xl border border-primary-50/50">
                  <div>
                    <div className="flex justify-between font-medium text-[10px] text-slate-600 mb-1">
                      <span>{idt("រំកិលផ្នែកខាងលើ", "Header Vertical Shift", "页眉上下移动")}</span>
                      <span className="font-mono text-primary-600 font-bold">{headerYOffset > 0 ? `+${headerYOffset}` : headerYOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="1"
                      value={headerYOffset}
                      onChange={(e) => setHeaderYOffset(parseInt(e.target.value))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[10px] text-slate-600 mb-1">
                      <span>{idt("រំកិលចំណងជើង", "Title Vertical Shift", "标题上下移动")}</span>
                      <span className="font-mono text-primary-600 font-bold">{titleYOffset > 0 ? `+${titleYOffset}` : titleYOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="1"
                      value={titleYOffset}
                      onChange={(e) => setTitleYOffset(parseInt(e.target.value))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[10px] text-slate-600 mb-1">
                      <span>{idt("រំកិលផ្នែកព័ត៌មាន", "Body Content Vertical Shift", "正文上下移动")}</span>
                      <span className="font-mono text-primary-600 font-bold">{bodyYOffset > 0 ? `+${bodyYOffset}` : bodyYOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="1"
                      value={bodyYOffset}
                      onChange={(e) => setBodyYOffset(parseInt(e.target.value))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />
                  </div>



                  <div>
                    <div className="flex justify-between font-medium text-[10px] text-slate-600 mb-1">
                      <span>{idt("រំកិលលេខបញ្ជាក់ និង QR ឆ្វេង-ស្តាំ", "Footer ID & QR Horizontal Shift", "页脚编号与QR左右移动")}</span>
                      <span className="font-mono text-primary-600 font-bold">{footerLeftXOffset > 0 ? `+${footerLeftXOffset}` : footerLeftXOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="1"
                      value={footerLeftXOffset}
                      onChange={(e) => setFooterLeftXOffset(parseInt(e.target.value))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[10px] text-slate-600 mb-1">
                      <span>{idt("រំកិលលេខបញ្ជាក់ និង QR លើ-ក្រោម", "Footer ID & QR Vertical Shift", "页脚编号与QR上下移动")}</span>
                      <span className="font-mono text-primary-600 font-bold">{footerLeftYOffset > 0 ? `+${footerLeftYOffset}` : footerLeftYOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="1"
                      value={footerLeftYOffset}
                      onChange={(e) => setFooterLeftYOffset(parseInt(e.target.value))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[10px] text-slate-600 mb-1">
                      <span>{idt("រំកិលផ្នែកហត្ថលេខា ឆ្វេង-ស្តាំ", "Signature Horizontal Shift", "签名落款左右移动")}</span>
                      <span className="font-mono text-primary-600 font-bold">{footerRightXOffset > 0 ? `+${footerRightXOffset}` : footerRightXOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="1"
                      value={footerRightXOffset}
                      onChange={(e) => setFooterRightXOffset(parseInt(e.target.value))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[10px] text-slate-600 mb-1">
                      <span>{idt("រំកិលផ្នែកហត្ថលេខា លើ-ក្រោម", "Signature Vertical Shift", "签名落款上下移动")}</span>
                      <span className="font-mono text-primary-600 font-bold">{footerRightYOffset > 0 ? `+${footerRightYOffset}` : footerRightYOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="1"
                      value={footerRightYOffset}
                      onChange={(e) => setFooterRightYOffset(parseInt(e.target.value))}
                      className="w-full accent-primary-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>



              {/* Signee Details */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ឈ្មោះអ្នកចុះហត្ថលេខា (នាយក)", "Director's Name")}</label>
                  <input
                    type="text"
                    value={directorName || ""}
                    onChange={(e) => setDirectorName(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("តួនាទី", "Title (Khmer)")}</label>
                    <input
                      type="text"
                      value={directorTitleKh || ""}
                      onChange={(e) => setDirectorTitleKh(e.target.value)}
                      className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("តួនាទី", "Title (English)")}</label>
                    <input
                      type="text"
                      value={directorTitleEn || ""}
                      onChange={(e) => setDirectorTitleEn(e.target.value)}
                      className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ថ្ងៃចេញ", "Issue Date (Kh)")}</label>
                    <input
                      type="text"
                      value={issueDateKh || ""}
                      onChange={(e) => setIssueDateKh(e.target.value)}
                      className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">{idt("ថ្ងៃចេញ", "Issue Date (En)")}</label>
                    <input
                      type="text"
                      value={issueDateEn || ""}
                      onChange={(e) => setIssueDateEn(e.target.value)}
                      className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Left Column (Hidden on Print) */}
              <div className="border-t border-slate-100 pt-5 space-y-2.5">
                <button
                  onClick={handlePrint}
                  className="w-full h-11 flex items-center justify-center gap-2 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-3xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{idt("បោះពុម្ព", "Print", "打印证书")}</span>
                </button>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleDownload("png")}
                    disabled={isDownloading || isDownloadingPdf}
                    className="h-11 flex items-center justify-center gap-1.5 px-3 bg-primary-600 hover:bg-primary-750 active:scale-95 text-white text-[11px] font-black rounded-xl transition-all shadow-3xs cursor-pointer disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span className="truncate">{idt("ទាញយក", "Save PNG", "保存PNG")}</span>
                  </button>

                  <button
                    onClick={() => handleDownload("pdf")}
                    disabled={isDownloading || isDownloadingPdf}
                    className="h-11 flex items-center justify-center gap-1.5 px-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-[11px] font-black rounded-xl transition-all shadow-3xs cursor-pointer disabled:opacity-50"
                  >
                    {isDownloadingPdf ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span className="truncate">{idt("រក្សាទុក PDF", "Save PDF", "保存为PDF")}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME PREVIEW STAGE & CANVAS */}
        <div className="xl:col-span-8 flex flex-col items-center justify-center print:block print:w-full">
          
          {/* Certificate Board Frame Wrapper */}
          <div 
            ref={containerRef}
            style={{ height: `${794 * scale + 32}px` }}
            className="w-full bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner print:p-0 print:bg-white print:border-none print:shadow-none print:overflow-visible transition-all duration-300"
          >
            
            {/* THE CANVAS CONTAINER THAT WILL BE PRINTED OR DOWNLOADED */}
            <div
              id="printable-certificate-area"
              ref={certificateRef}
              style={{
                width: "1123px",
                height: "794px",
                minWidth: "1123px",
                minHeight: "794px",
                maxWidth: "1123px",
                maxHeight: "794px",
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
              className={`relative shadow-[0_12px_40px_rgba(0,0,0,0.06)] pt-10 pb-6 px-12 flex flex-col justify-between overflow-hidden select-none select-none print:shadow-none print:pt-10 print:pb-6 print:px-12 shrink-0 ${
                showBackground ? "bg-white" : "bg-transparent"
              } ${
                showBorder
                  ? `border-[14px] print:border-[16px] ${
                      borderStyle === "gold-royal"
                        ? "border-amber-400"
                        : borderStyle === "red-ceremonial"
                        ? "border-rose-700"
                        : "border-slate-800"
                    }`
                  : "border-0 print:border-0 border-transparent"
              } ${
                showBackground
                  ? borderStyle === "gold-royal"
                    ? "bg-amber-50/5"
                    : borderStyle === "red-ceremonial"
                    ? "bg-rose-50/5"
                    : "bg-slate-50/5"
                  : ""
              }`}
            >
              {/* Custom background image if uploaded and enabled */}
              {showBackground && customBackground && (
                <div 
                  className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                  style={{ backgroundImage: `url(${customBackground})` }}
                />
              )}

              {/* Background watermark/seal graphics (Subtle) */}
              {showWatermark && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Award className="w-[450px] h-[450px] stroke-[0.5]" />
                </div>
              )}

              {/* Decorative Corner Borders - Classic Khmer motifs inspired layout */}
              {showBorder && (
                <>
                  <div className={`absolute top-2 left-2 w-14 h-14 border-t-4 border-l-4 pointer-events-none ${
                    borderStyle === "gold-royal" ? "border-amber-400/80" : borderStyle === "red-ceremonial" ? "border-rose-750" : "border-slate-800"
                  }`} />
                  <div className={`absolute top-2 right-2 w-14 h-14 border-t-4 border-r-4 pointer-events-none ${
                    borderStyle === "gold-royal" ? "border-amber-400/80" : borderStyle === "red-ceremonial" ? "border-rose-750" : "border-slate-800"
                  }`} />
                  <div className={`absolute bottom-2 left-2 w-14 h-14 border-b-4 border-l-4 pointer-events-none ${
                    borderStyle === "gold-royal" ? "border-amber-400/80" : borderStyle === "red-ceremonial" ? "border-rose-750" : "border-slate-800"
                  }`} />
                  <div className={`absolute bottom-2 right-2 w-14 h-14 border-b-4 border-r-4 pointer-events-none ${
                    borderStyle === "gold-royal" ? "border-amber-400/80" : borderStyle === "red-ceremonial" ? "border-rose-750" : "border-slate-800"
                  }`} />
                </>
              )}

              {/* Inner Double Thin Border */}
              {showBorder && (
                <div className={`absolute inset-3 border-2 pointer-events-none opacity-50 ${
                  borderStyle === "gold-royal" ? "border-amber-300" : borderStyle === "red-ceremonial" ? "border-rose-400" : "border-slate-500"
                }`} />
              )}

              {/* ==================== TEMPLATE 1: ACADEMIC CERTIFICATE ==================== */}
              {certType === "academic" && (
                <div className="w-full h-full flex flex-col justify-between relative z-10 text-center">
                  
                  {/* Top Header Group */}
                  <div className="space-y-2 transition-transform duration-200" style={{ transform: `translateY(${headerYOffset}px)` }}>
                    {/* Certificate Top: Kingdom Header */}
                    <div className="flex flex-col items-center">
                      <h4 className="text-[18px] font-normal text-slate-900 font-moul tracking-wide leading-relaxed">
                        ព្រះរាជាណាចក្រកម្ពុជា
                      </h4>
                      <h5 className="text-[16px] font-normal text-slate-850 font-moul tracking-wider mt-1 leading-relaxed">
                        ជាតិ សាសនា ព្រះមហាក្សត្រ
                      </h5>
                      <div className="w-20 h-0.5 bg-amber-400 mx-auto mt-2 opacity-80" />
                      <p className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-sans mt-1.5">
                        Kingdom of Cambodia &bull; Nation Religion King
                      </p>
                    </div>
                  </div>

                  {/* Certificate Title Banner */}
                  <div className="my-2.5 py-1.5 bg-amber-500/10 border-y border-amber-300/40 transition-transform duration-200" style={{ transform: `translateY(${titleYOffset}px)` }}>
                    <h1 className="text-2xl font-normal text-amber-500 font-moul tracking-wider leading-relaxed">
                      វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា
                    </h1>
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans mt-1.5">
                      Certificate of Academic Completion
                    </h2>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2.5 px-4 transition-transform duration-200" style={{ transform: `translateY(${bodyYOffset}px)` }}>
                    <p className="text-[13px] font-bold text-slate-500 leading-relaxed font-siemreap">
                      វិទ្យាស្ថានបច្ចេកវិទ្យាបញ្ជាក់ថា / This is to certify that:
                    </p>

                    {/* Student Name */}
                    <div className="space-y-0.5">
                      <h2 className="text-[26px] font-black text-slate-900 underline underline-offset-4 decoration-amber-400">
                        {studentNameKh || (recipientMode === "student" ? "ឈ្មោះសិស្ស" : "ឈ្មោះគ្រូ / បុគ្គលិក")}
                      </h2>
                      <h3 className="text-[16px] font-black text-primary-900 font-sans uppercase tracking-widest mt-0.5">
                        {studentNameEn || (recipientMode === "student" ? "STUDENT NAME" : "TEACHER / STAFF NAME")}
                      </h3>
                      <p className="text-[12px] font-bold text-slate-400 mt-0.5">
                        ភេទ / Gender: <span className="text-slate-800">{gender === "Male" ? "ប្រុស (Male)" : "ស្រី (Female)"}</span>
                      </p>
                    </div>

                    {/* Course completion Details */}
                    <div className="max-w-[850px] mx-auto space-y-1 text-[16.5px] text-slate-700 leading-relaxed font-semibold">
                      <p>
                        {recipientMode === "student" ? (
                          <>
                            បានបញ្ចប់វគ្គបណ្តុះបណ្តាលដោយជោគជ័យលើមុខជំនាញ៖{" "}
                            <span className="text-primary-900 font-bold text-[18px] underline decoration-primary-200 decoration-2 underline-offset-4">{courseName || "វគ្គសិក្សា"}</span>
                            {" "}កម្រិត / Level: <span className="text-primary-900 font-bold text-[18px]">
                              {(() => {
                                const lvl = level || "1";
                                if ((lvl || '').toLowerCase() === "level 1" || lvl === "1") return "កម្រិត១";
                                if ((lvl || '').toLowerCase() === "level 2" || lvl === "2") return "កម្រិត២";
                                if ((lvl || '').toLowerCase() === "level 3" || lvl === "3") return "កម្រិត៣";
                                if ((lvl || '').toLowerCase() === "level 4" || lvl === "4") return "កម្រិត៤";
                                if ((lvl || '').toLowerCase() === "level 5" || lvl === "5") return "កម្រិត៥";
                                return lvl.replace(/level/gi, "កម្រិត")
                                  .replace(/1/g, "១")
                                  .replace(/2/g, "២")
                                  .replace(/3/g, "៣")
                                  .replace(/4/g, "៤")
                                  .replace(/5/g, "៥")
                                  .replace(/6/g, "៦")
                                  .replace(/7/g, "៧")
                                  .replace(/8/g, "៨")
                                  .replace(/9/g, "៩")
                                  .replace(/0/g, "០");
                              })()}
                            </span>
                          </>
                        ) : (
                          <>
                            បានរួមចំណែក និងបង្រៀនដោយជោគជ័យលើមុខជំនាញ៖{" "}
                            <span className="text-primary-900 font-bold text-[18px] underline decoration-primary-200 decoration-2 underline-offset-4">{courseName || "ជំនាញ"}</span>
                            {" "}តួនាទី / Role: <span className="text-primary-900 font-bold text-[18px]">{level || "គ្រូបង្រៀន"}</span>
                          </>
                        )}
                      </p>
                      <p className="text-slate-500 font-medium text-[16px]">
                        {recipientMode === "student" ? (
                          <>
                            Has successfully graduated and satisfied all academic requirements for the training course of:{" "}
                            <span className="text-slate-900 font-bold block mt-0.5 uppercase font-sans text-[15.5px] tracking-wide">
                              {courseName || "Course Name"} &bull; {level || "Level 1"}
                            </span>
                          </>
                        ) : (
                          <>
                            Has successfully contributed and demonstrated teaching excellence for the specialty of:{" "}
                            <span className="text-slate-900 font-bold block mt-0.5 uppercase font-sans text-[15.5px] tracking-wide">
                              {courseName || "Specialty"} &bull; {level || "Instructor"}
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Period and score details */}
                    <div className="max-w-md mx-auto grid grid-cols-3 gap-1.5 py-1.5 px-3 rounded-lg border border-slate-100 bg-slate-50/50 text-[11px] font-extrabold text-slate-600">
                      <div>
                        <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                          {recipientMode === "student" ? idt("រយៈពេលសិក្សា", "Study Period") : idt("រយៈពេលបម្រើការ", "Service Period")}
                        </span>
                        <span className="text-slate-800 font-sans block mt-0.5 text-[10px]">
                          {startDate && endDate ? `${startDate} to ${endDate}` : "2026-06-01 to 2026-09-01"}
                        </span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                          {recipientMode === "student" ? idt("ម៉ោងសិក្សាសរុប", "Total Hours") : idt("បទពិសោធន៍បង្រៀន", "Teaching Hours")}
                        </span>
                        <span className="text-slate-800 block mt-0.5 text-[10px]">{studyHours || "45 Hours"}</span>
                      </div>
                      <div>
                        <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                          {recipientMode === "student" ? idt("និទ្ទេសរួម", "Grade / Remark") : idt("ការវាយតម្លៃ", "Evaluation")}
                        </span>
                        <span className="text-emerald-700 block mt-0.5 font-bold text-[10px]">{grade || "Excellent"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Seal and Signature Section */}
                  <div className="mt-3 grid grid-cols-12 gap-4 items-end text-left transition-transform duration-200" style={{ transform: `translateY(${footerYOffset}px)` }}>
                    {/* Left: Certificate ID and Verification QR Code */}
                    <div className="col-span-4 space-y-1.5 self-end transition-transform duration-200" style={{ transform: `translate(${footerLeftXOffset}px, ${footerLeftYOffset}px)` }}>
                      <div className="text-[9px] text-slate-400 font-mono font-bold space-y-0.5">
                        <p>លេខបញ្ជាក់ / ID: <span className="text-slate-700 font-bold">{certNumber || "PLC-CERT-X991"}</span></p>
                        <p>ចេញផ្សាយ / Issued: <span className="text-slate-700">{issueDateEn}</span></p>
                      </div>

                      {showQrCode && (
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 max-w-[130px]">
                          <div className="w-9 h-9 border border-slate-200 p-0.5 rounded bg-white flex items-center justify-center shrink-0">
                            <QrCode className="w-full h-full text-slate-800" />
                          </div>
                          <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider leading-2">
                            ស្កេនផ្ទៀងផ្ទាត់<br />
                            <span className="text-[5.5px] font-mono">SCAN TO SECURELY VERIFY</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Middle: 4x6 Student Photo */}
                    <div className="col-span-4 flex flex-col items-center justify-end h-full relative">
                      {showStudentPhoto && (
                        studentPhoto ? (
                          <div className="relative flex flex-col items-center justify-end">
                            <div className="w-[80px] h-[120px] bg-slate-50 overflow-hidden shadow-xs flex items-center justify-center relative">
                              <img
                                src={studentPhoto}
                                alt="Student 4x6"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <p className="text-[7px] font-black text-slate-400 mt-1 uppercase tracking-wider font-sans leading-none">
                              {idt("រូបថត ៤x៦", "Photo 4x6", "4x6照片")}
                            </p>
                          </div>
                        ) : (
                          <div className="w-[80px] h-[120px] rounded flex flex-col items-center justify-center bg-slate-50/20 text-slate-400 text-center select-none">
                            <span className="text-[8px] font-extrabold leading-tight">រូបថត ៤x៦</span>
                            <span className="text-[6.5px] font-bold text-slate-300 font-sans mt-0.5">(Photo 4x6)</span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Right: Signature & Stamp */}
                    <div className="col-span-4 text-center relative flex flex-col items-center transition-transform duration-200" style={{ transform: `translate(${footerRightXOffset}px, ${footerRightYOffset}px)` }}>
                      <div className="space-y-0.5 font-bold relative z-10">
                        <p className="text-[11px] text-slate-500">{issueDateKh}</p>
                        <p className="text-[11px] text-slate-800 font-black">{directorTitleKh}</p>
                        <p className="text-[8.5px] text-slate-400 uppercase tracking-wider font-sans">{directorTitleEn}</p>
                        
                        {/* Signature Line space */}
                        <div className="h-6 flex items-center justify-center relative">
                          {/* Simulated handwritten signature */}
                          <svg className="w-24 h-8 text-primary-800/80 opacity-90 absolute" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10,25 C30,10 50,30 70,12 C80,5 90,20 85,32 C80,38 72,25 78,15 C85,5 95,20 98,28" strokeLinecap="round" />
                          </svg>
                        </div>
                        
                        <p className="text-[13px] font-black text-slate-800 underline underline-offset-2 tracking-wide">
                          {directorName || "លី សីហា"}
                        </p>
                      </div>

                      {/* Circular Red Stamp Official Seal Overlaying Signature */}
                      {showStamp && (
                        <div 
                          style={{
                            transform: `translate(${sealOffsetX}px, ${sealOffsetY}px) rotate(${sealRotation !== 0 ? sealRotation : 12}deg) scale(${sealSize})`,
                          }}
                          className="absolute right-4 bottom-2 w-24 h-24 flex items-center justify-center pointer-events-none opacity-85 z-0 transition-transform duration-75 origin-center"
                        >
                          {customSealImage ? (
                            <img 
                              src={customSealImage} 
                              alt="School Seal" 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full border-4 border-rose-600/80 flex items-center justify-center relative">
                              <div className="absolute inset-1 rounded-full border border-dashed border-rose-600/70" />
                              <div className="text-center p-1 font-bold text-rose-600/90 tracking-tight leading-2.5 flex flex-col items-center justify-center">
                                <span className="text-[6.5px] font-extrabold">សាលាបច្ចេកវិទ្យា ភីអិលស៊ី</span>
                                <Award className="w-4.5 h-4.5 my-0.5 text-rose-600/80" />
                                <span className="text-[5.5px] uppercase font-sans font-black tracking-widest">PLC SCHOOL</span>
                                <span className="text-[4.5px] text-rose-500/80 font-mono">OFFICIAL SEAL</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* ==================== TEMPLATE 2: CERTIFICATE OF COMMENDATION ==================== */}
              {certType === "commendation" && (
                <div className="w-full h-full flex flex-col justify-between relative z-10 text-center">
                  
                  {/* Top Header Group */}
                  <div className="space-y-1.5 transition-transform duration-200" style={{ transform: `translateY(${headerYOffset}px)` }}>
                    {/* Seal header ornament */}
                    <div className="flex justify-center mt-0">
                      <div className="w-8 h-8 rounded-full bg-rose-700 flex items-center justify-center text-white shadow-md">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                    </div>
                  </div>

                  {/* Ribbon Commendation banner */}
                  <div className="my-2.5 py-1.5 bg-rose-700/10 border-y border-rose-600/30 transition-transform duration-200" style={{ transform: `translateY(${titleYOffset}px)` }}>
                    <h1 className="text-3xl font-normal text-rose-700 font-moul tracking-widest leading-relaxed">
                      បណ្ណសសើរ
                    </h1>
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans mt-1.5">
                      Certificate of Commendation
                    </h2>
                  </div>

                  {/* Award wording statement */}
                  <div className="space-y-2.5 px-4 transition-transform duration-200" style={{ transform: `translateY(${bodyYOffset}px)` }}>
                    <p className="text-[11px] font-black text-rose-800 uppercase tracking-wider">
                      បណ្ណសសើរនេះជូនចំពោះ / PROUDLY PRESENTED TO:
                    </p>

                    {/* Recipient Name in beautiful style */}
                    <div className="space-y-0.5">
                      <h2 className="text-2xl font-black text-slate-900 drop-shadow-xs">
                        {studentNameKh || (recipientMode === "student" ? "ឈ្មោះសិស្ស" : "ឈ្មោះគ្រូ / បុគ្គលិក")}
                      </h2>
                      <h3 className="text-sm font-black text-rose-700 font-sans tracking-widest uppercase mt-0.5">
                        {studentNameEn || (recipientMode === "student" ? "STUDENT NAME" : "TEACHER / STAFF NAME")}
                      </h3>
                    </div>

                    {/* Merit reason */}
                    <div className="max-w-xl mx-auto space-y-1 text-slate-600 leading-relaxed font-bold text-[11px]">
                      <p className="text-slate-800 text-[12px] font-semibold">
                        {recipientMode === "student" ? (
                          <>
                            ដែលបានខិតខំប្រឹងប្រែងសិក្សា និងទទួលបានលទ្ធផល{" "}
                            <span className="text-rose-700 font-black underline decoration-amber-400 decoration-2">{grade || "ល្អប្រសើរ"}</span>
                            {" "}ក្នុងមុខវិជ្ជា៖{" "}
                            <span className="text-rose-700 font-black">{courseName || "វគ្គសិក្សា"}</span>
                          </>
                        ) : (
                          <>
                            ដែលបានខិតខំប្រឹងប្រែងបំពេញការងារ និងទទួលបានលទ្ធផល{" "}
                            <span className="text-rose-700 font-black underline decoration-amber-400 decoration-2">{grade || "ល្អប្រសើរ"}</span>
                            {" "}ក្នុងតួនាទីជាគ្រូបង្រៀនមុខជំនាញ៖{" "}
                            <span className="text-rose-700 font-black">{courseName || "ជំនាញ"}</span>
                          </>
                        )}
                      </p>
                      <p className="text-slate-400 font-medium italic text-[10.5px]">
                        {recipientMode === "student" ? (
                          `In recognition of their outstanding academic performance, diligent efforts, disciplined character and high moral conduct in completing the course of: `
                        ) : (
                          `In recognition of their outstanding teaching performance, dedication to educational excellence, professional conduct and commitment to: `
                        )}
                        <span className="text-slate-800 font-extrabold font-sans block mt-0.5 text-[11px] tracking-wide">
                          {courseName || "Course Name"} {recipientMode === "student" ? `(${level || "Level 1"})` : ""}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="mt-3 grid grid-cols-12 gap-4 items-end text-left transition-transform duration-200" style={{ transform: `translateY(${footerYOffset}px)` }}>
                    {/* Left side Verification */}
                    <div className="col-span-4 space-y-1.5 self-end transition-transform duration-200" style={{ transform: `translate(${footerLeftXOffset}px, ${footerLeftYOffset}px)` }}>
                      <div className="text-[9px] text-slate-400 font-mono font-bold">
                        <p>លេខសម្គាល់ / Ref No: <span className="text-slate-700 font-bold">{certNumber || "PLC-COM-X991"}</span></p>
                        <p>ចេញថ្ងៃទី / Date: <span className="text-slate-700">{issueDateEn}</span></p>
                      </div>

                      {showQrCode && (
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 max-w-[130px]">
                          <div className="w-9 h-9 border border-slate-200 p-0.5 rounded bg-white flex items-center justify-center shrink-0">
                            <QrCode className="w-full h-full text-slate-800" />
                          </div>
                          <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider leading-2">
                            ស្កេនពិនិត្យបញ្ជាក់<br />
                            <span className="text-[5.5px] font-mono">SCAN TO VERIFY AWARDEE</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Middle: 4x6 Student Photo */}
                    <div className="col-span-4 flex flex-col items-center justify-end h-full relative">
                      {showStudentPhoto && (
                        studentPhoto ? (
                          <div className="relative flex flex-col items-center justify-end">
                            <div className="w-[80px] h-[120px] bg-slate-50 overflow-hidden shadow-xs flex items-center justify-center relative">
                              <img
                                src={studentPhoto}
                                alt="Student 4x6"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <p className="text-[7px] font-black text-slate-400 mt-1 uppercase tracking-wider font-sans leading-none">
                              {idt("រូបថត ៤x៦", "Photo 4x6", "4x6照片")}
                            </p>
                          </div>
                        ) : (
                          <div className="w-[80px] h-[120px] rounded flex flex-col items-center justify-center bg-slate-50/20 text-slate-400 text-center select-none">
                            <span className="text-[8px] font-extrabold leading-tight">រូបថត ៤x៦</span>
                            <span className="text-[6.5px] font-bold text-slate-300 font-sans mt-0.5">(Photo 4x6)</span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Right Signature & Stamp */}
                    <div className="col-span-4 text-center relative flex flex-col items-center transition-transform duration-200" style={{ transform: `translate(${footerRightXOffset}px, ${footerRightYOffset}px)` }}>
                      <div className="space-y-0.5 font-bold relative z-10">
                        <p className="text-[11px] text-slate-500">{issueDateKh}</p>
                        <p className="text-[11px] text-rose-800 font-black">{directorTitleKh}</p>
                        <p className="text-[8.5px] text-slate-400 uppercase tracking-wider font-sans">{directorTitleEn}</p>
                        
                        {/* Signature Space */}
                        <div className="h-6 flex items-center justify-center relative">
                          <svg className="w-24 h-8 text-rose-800/80 opacity-90 absolute" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10,25 C30,10 50,30 70,12 C80,5 90,20 85,32 C80,38 72,25 78,15 C85,5 95,20 98,28" strokeLinecap="round" />
                          </svg>
                        </div>
                        
                        <p className="text-[13px] font-black text-slate-800 underline underline-offset-2 tracking-wide">
                          {directorName || "លី សីហា"}
                        </p>
                      </div>

                      {/* Official Stamp */}
                      {showStamp && (
                        <div 
                          style={{
                            transform: `translate(${sealOffsetX}px, ${sealOffsetY}px) rotate(${sealRotation !== 0 ? sealRotation : 6}deg) scale(${sealSize})`,
                          }}
                          className="absolute right-4 bottom-2 w-24 h-24 flex items-center justify-center pointer-events-none opacity-85 z-0 transition-transform duration-75 origin-center"
                        >
                          {customSealImage ? (
                            <img 
                              src={customSealImage} 
                              alt="School Seal" 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full border-4 border-rose-600/80 flex items-center justify-center relative">
                              <div className="absolute inset-1 rounded-full border border-dashed border-rose-600/70" />
                              <div className="text-center p-1 font-bold text-rose-600/90 tracking-tight leading-2.5 flex flex-col items-center justify-center">
                                <span className="text-[6.5px] font-extrabold">សាលាបច្ចេកវិទ្យា ភីអិលស៊ី</span>
                                <Sparkles className="w-4.5 h-4.5 my-0.5 text-rose-600/80" />
                                <span className="text-[5.5px] uppercase font-sans font-black tracking-widest">PLC SCHOOL</span>
                                <span className="text-[4.5px] text-rose-500/80 font-mono">OFFICIAL SEAL</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* ==================== TEMPLATE 3: CERTIFICATE OF APPRECIATION ==================== */}
              {certType === "appreciation" && (
                <div className="w-full h-full flex flex-col justify-between relative z-10 text-center">
                  
                  {/* Top Header Group */}
                  <div className="space-y-1.5 transition-transform duration-200" style={{ transform: `translateY(${headerYOffset}px)` }}>
                    {/* Header Crest Logo */}
                    <div className="flex justify-center mt-0">
                      <div className={`w-9 h-9 border-2 rounded-full flex items-center justify-center ${
                        borderStyle === "modern-navy" ? "border-slate-800 text-slate-800" : "border-amber-400 text-amber-500"
                      }`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Institution Name */}
                    {showSchoolName && (
                      <div className="space-y-0.5">
                        <h3 className="text-[15px] font-bold tracking-widest text-slate-800 uppercase font-mono">
                          {schoolNameEn.toUpperCase()}
                        </h3>
                        <div className="w-12 h-[1px] bg-slate-300 mx-auto my-1" />
                      </div>
                    )}
                  </div>

                  {/* Certificate Heading */}
                  <div className="my-2.5 py-1.5 transition-transform duration-200" style={{ transform: `translateY(${titleYOffset}px)` }}>
                    <h1 className="text-3xl font-normal text-slate-800 font-moul tracking-wide uppercase leading-relaxed">
                      លិខិតសរសើរ
                    </h1>
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans mt-1.5">
                      Certificate of Appreciation
                    </h2>
                  </div>

                  {/* Body Wording */}
                  <div className="space-y-2.5 px-4 transition-transform duration-200" style={{ transform: `translateY(${bodyYOffset}px)` }}>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      THIS CERTIFICATE IS THANKFULLY PRESENTED TO:
                    </p>

                    {/* Name */}
                    <div className="space-y-0.5">
                      <h2 className="text-2xl font-black text-slate-900">
                        {studentNameKh || (recipientMode === "student" ? "ឈ្មោះសិស្ស" : "ឈ្មោះគ្រូ / បុគ្គលិក")}
                      </h2>
                      <h3 className="text-sm font-bold text-slate-600 font-mono uppercase tracking-widest mt-0.5">
                        {studentNameEn || (recipientMode === "student" ? "STUDENT NAME" : "TEACHER / STAFF NAME")}
                      </h3>
                    </div>

                    {/* Reason */}
                    <div className="max-w-xl mx-auto space-y-1 text-slate-600 leading-relaxed font-bold text-[11px]">
                      <p className="text-slate-800 text-[12px] font-semibold">
                        {recipientMode === "student" ? (
                          <>
                            ដែលទទួលបានការវាយតម្លៃខ្ពស់ចំពោះការលះបង់ ចំណេះដឹង និងវិន័យដ៏ល្អប្រសើរក្នុងវគ្គសិក្សា៖{" "}
                            <span className="text-primary-900 font-black text-[12.5px] underline decoration-slate-300 underline-offset-4">{courseName || "វគ្គសិក្សា"}</span>
                          </>
                        ) : (
                          <>
                            ដែលទទួលបានការវាយតម្លៃខ្ពស់ចំពោះការលះបង់ ចំណេះដឹង និងការប្តេជ្ញាចិត្តខ្ពស់ក្នុងការបណ្តុះបណ្តាល៖{" "}
                            <span className="text-primary-900 font-black text-[12.5px] underline decoration-slate-300 underline-offset-4">{courseName || "ជំនាញ"}</span>
                          </>
                        )}
                      </p>
                      <p className="text-slate-400 font-medium italic text-[10.5px]">
                        {recipientMode === "student" ? (
                          `In sincere appreciation for their academic diligence, outstanding support, and admirable pursuit of technological excellence during the course of study.`
                        ) : (
                          `In sincere appreciation for their outstanding teaching performance, educational dedication, and admirable commitment to training high-quality human resources.`
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="mt-3 grid grid-cols-12 gap-4 items-end text-left transition-transform duration-200" style={{ transform: `translateY(${footerYOffset}px)` }}>
                    {/* Left side Verification */}
                    <div className="col-span-4 space-y-1.5 self-end transition-transform duration-200" style={{ transform: `translate(${footerLeftXOffset}px, ${footerLeftYOffset}px)` }}>
                      <div className="text-[9px] text-slate-400 font-mono font-bold">
                        <p>លេខកូដ / Cert ID: <span className="text-slate-700 font-bold">{certNumber || "PLC-APP-X991"}</span></p>
                        <p>ចេញថ្ងៃទី / Issued: <span className="text-slate-700">{issueDateEn}</span></p>
                      </div>

                      {showQrCode && (
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 max-w-[130px]">
                          <div className="w-9 h-9 border border-slate-200 p-0.5 rounded bg-white flex items-center justify-center shrink-0">
                            <QrCode className="w-full h-full text-slate-800" />
                          </div>
                          <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider leading-2">
                            ស្កេនពិនិត្យភាពត្រឹមត្រូវ<br />
                            <span className="text-[5.5px] font-mono">SCAN FOR AUTHENTICATION</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Middle: 4x6 Student Photo */}
                    <div className="col-span-4 flex flex-col items-center justify-end h-full relative">
                      {showStudentPhoto && (
                        studentPhoto ? (
                          <div className="relative flex flex-col items-center justify-end">
                            <div className="w-[80px] h-[120px] bg-slate-50 overflow-hidden shadow-xs flex items-center justify-center relative">
                              <img
                                src={studentPhoto}
                                alt="Student 4x6"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <p className="text-[7px] font-black text-slate-400 mt-1 uppercase tracking-wider font-sans leading-none">
                              {idt("រូបថត ៤x៦", "Photo 4x6", "4x6照片")}
                            </p>
                          </div>
                        ) : (
                          <div className="w-[80px] h-[120px] rounded flex flex-col items-center justify-center bg-slate-50/20 text-slate-400 text-center select-none">
                            <span className="text-[8px] font-extrabold leading-tight">រូបថត ៤x៦</span>
                            <span className="text-[6.5px] font-bold text-slate-300 font-sans mt-0.5">(Photo 4x6)</span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Right Signature & Stamp */}
                    <div className="col-span-4 text-center relative flex flex-col items-center transition-transform duration-200" style={{ transform: `translate(${footerRightXOffset}px, ${footerRightYOffset}px)` }}>
                      <div className="space-y-0.5 font-bold relative z-10">
                        <p className="text-[11px] text-slate-500">{issueDateKh}</p>
                        <p className="text-[11px] text-slate-800 font-black">{directorTitleKh}</p>
                        <p className="text-[8.5px] text-slate-400 uppercase tracking-wider font-sans">{directorTitleEn}</p>
                        
                        {/* Signature Space */}
                        <div className="h-6 flex items-center justify-center relative">
                          <svg className="w-24 h-8 text-slate-800 opacity-90 absolute" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10,25 C30,10 50,30 70,12 C80,5 90,20 85,32 C80,38 72,25 78,15 C85,5 95,20 98,28" strokeLinecap="round" />
                          </svg>
                        </div>
                        
                        <p className="text-[13px] font-black text-slate-800 underline underline-offset-2 tracking-wide">
                          {directorName || "លី សីហា"}
                        </p>
                      </div>

                      {/* Official Stamp */}
                      {showStamp && (
                        <div 
                          style={{
                            transform: `translate(${sealOffsetX}px, ${sealOffsetY}px) rotate(${sealRotation !== 0 ? sealRotation : 12}deg) scale(${sealSize})`,
                          }}
                          className="absolute right-4 bottom-2 w-24 h-24 flex items-center justify-center pointer-events-none opacity-85 z-0 transition-transform duration-75 origin-center"
                        >
                          {customSealImage ? (
                            <img 
                              src={customSealImage} 
                              alt="School Seal" 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full border-4 border-rose-600/80 flex items-center justify-center relative">
                              <div className="absolute inset-1 rounded-full border border-dashed border-rose-600/70" />
                              <div className="text-center p-1 font-bold text-rose-600/90 tracking-tight leading-2.5 flex flex-col items-center justify-center">
                                <span className="text-[6.5px] font-extrabold">សាលាបច្ចេកវិទ្យា ភីអិលស៊ី</span>
                                <BookOpen className="w-4.5 h-4.5 my-0.5 text-rose-600/80" />
                                <span className="text-[5.5px] uppercase font-sans font-black tracking-widest">PLC SCHOOL</span>
                                <span className="text-[4.5px] text-rose-500/80 font-mono">OFFICIAL SEAL</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

          {/* Side-by-Side: Custom Background and 4x6 Photo Uploads (Hidden on Print) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 print:hidden">
            {/* Custom Background Image Upload Feature */}
            <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-3xs text-left">
              <button
                type="button"
                onClick={() => setIsCustomBgExpanded(!isCustomBgExpanded)}
                className="w-full flex items-center justify-between text-left group focus:outline-none mb-3"
              >
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {idt("បញ្ចូលរូបភាពផ្ទៃខាងក្រោយផ្ទាល់ខ្លួន", "Custom Background Image Upload", "上传自定义背景图片")}
                  </span>
                </div>
                <div className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-xl transition-colors">
                  {isCustomBgExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isCustomBgExpanded && (
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                  {/* Drag and Drop / Input Field Container */}
                  <div className="relative flex-1 w-full">
                    <input
                      type="file"
                      id="custom-bg-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUpload(file, setCustomBackground);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="custom-bg-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary-400 bg-slate-50/50 hover:bg-primary-50/20 px-4 py-6 h-full rounded-2xl cursor-pointer transition-all duration-250 group text-center"
                    >
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary-500 mb-2 transition-colors" />
                      <span className="text-xs font-black text-slate-700 group-hover:text-primary-600 mb-0.5">
                        {idt("ជ្រើសរើសរូបភាពផ្ទៃខាងក្រោយ", "Choose Image File", "点击选择背景图片")}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        PNG, JPG, JPEG, WEBP or SVG (A4 Landscape: 1123 × 794 px)
                      </span>
                    </label>
                  </div>

                  {/* Preview Thumbnail and Controls if an image is uploaded */}
                  {customBackground && (
                    <div className="flex flex-col items-center justify-between p-3 border border-slate-200 bg-slate-50 rounded-2xl w-full md:w-40 shrink-0">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-3xs flex items-center justify-center">
                        <img 
                          src={customBackground} 
                          alt="Uploaded Background" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full">
                            {idt("ផ្ទៃខាងក្រោយបច្ចុប្បន្ន", "Active Background", "当前背景")}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setCustomBackground(null);
                          showToast(
                            idt("បានលុបរូបភាពផ្ទៃខាងក្រោយរួចរាល់!", "Custom background removed!", "已清除自定义背景！"),
                            "info"
                          );
                        }}
                        className="mt-2.5 w-full h-8 flex items-center justify-center gap-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-black rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{idt("លុបចេញ", "Remove BG", "清除背景")}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Custom 4x6 Student Photo Upload Feature */}
            <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-3xs text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setIsStudentPhotoExpanded(!isStudentPhotoExpanded)}
                  className="flex-1 flex items-center justify-between text-left group focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {idt("បញ្ចូលរូបថតសិស្ស ៤x៦", "Upload 4x6 Student Photo", "上传4x6学生照片")}
                    </span>
                  </div>
                  <div className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-xl transition-colors mr-2">
                    {isStudentPhotoExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
                {/* Show/Hide Toggle Checkbox */}
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={showStudentPhoto}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowStudentPhoto(checked);
                      if (checked) {
                        setIsStudentPhotoExpanded(true);
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span>{idt("បង្ហាញក្នុងសញ្ញាបត្រ", "Show on Certificate", "在证书上显示")}</span>
                </label>
              </div>

              {isStudentPhotoExpanded && (
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                  {/* Drag and Drop / Input Field Container */}
                  <div className="relative flex-1 w-full">
                    <input
                      type="file"
                      id="student-photo-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUpload(file, setStudentPhoto);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="student-photo-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary-400 bg-slate-50/50 hover:bg-primary-50/20 px-4 py-6 h-full rounded-2xl cursor-pointer transition-all duration-250 group text-center"
                    >
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary-500 mb-2 transition-colors" />
                      <span className="text-xs font-black text-slate-700 group-hover:text-primary-600 mb-0.5">
                        {idt("ជ្រើសរើសរូបថតសិស្ស ៤x៦", "Choose 4x6 Photo File", "点击选择4x6照片")}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        PNG, JPG, JPEG or WEBP (Standard Portrait Ratio 2:3 / 4x6)
                      </span>
                    </label>
                  </div>

                  {/* Preview Thumbnail and Controls if a photo is uploaded */}
                  {studentPhoto && (
                    <div className="flex flex-col items-center justify-between p-3 border border-slate-200 bg-slate-50 rounded-2xl w-full md:w-40 shrink-0">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-3xs flex items-center justify-center">
                        <img 
                          src={studentPhoto} 
                          alt="Uploaded Student" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full">
                            {idt("រូបថតបច្ចុប្បន្ន", "Active Photo", "当前照片")}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setStudentPhoto(null);
                          showToast(
                            idt("បានលុបរូបថតសិស្សរួចរាល់!", "Student photo removed!", "已清除学生照片！"),
                            "info"
                          );
                        }}
                        className="mt-2.5 w-full h-8 flex items-center justify-center gap-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-black rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{idt("លុបចេញ", "Remove Photo", "清除照片")}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Official Red Stamp Controls (Hidden on Print) */}
          <div className="w-full mt-6 bg-white p-5 rounded-3xl border border-slate-200 shadow-3xs text-left print:hidden">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!showStamp}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setShowStamp(checked);
                    if (checked) {
                      setIsStampExpanded(true);
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span className="uppercase tracking-wider">{idt("បង្ហាញត្រាផ្លូវការ", "Show Circular Red Seal Stamp", "加盖官方红色红章印")}</span>
              </label>
              <button
                type="button"
                onClick={() => setIsStampExpanded(!isStampExpanded)}
                className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-xl transition-colors focus:outline-none cursor-pointer"
              >
                {isStampExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {isStampExpanded && showStamp && (
              <div className="space-y-3.5 text-left bg-slate-50/50 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-primary-500" />
                    {idt("ត្រាសាលាផ្ទាល់ខ្លួន", "Custom School Seal", "自定义学校印章")}
                  </span>
                  {customSealImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomSealImage(null);
                        setSealOffsetX(0);
                        setSealOffsetY(0);
                        setSealSize(1);
                        setSealRotation(0);
                        showToast(idt("បានលុបត្រាផ្ទាល់ខ្លួន", "Custom seal removed", "已移除自订印章"), "info");
                      }}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {idt("លុបត្រា", "Remove", "移除")}
                    </button>
                  )}
                </div>

                {/* File Upload Field */}
                <div className="relative">
                  <input
                    type="file"
                    id="custom-seal-file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUpload(file, setCustomSealImage);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="custom-seal-file"
                    className="flex flex-col items-center justify-center border border-dashed border-slate-200 bg-white rounded-lg p-2.5 hover:border-primary-500 hover:bg-primary-50/10 transition-all cursor-pointer text-center group"
                  >
                    {customSealImage ? (
                      <div className="flex items-center gap-2">
                        <img src={customSealImage} className="w-9 h-9 object-contain rounded border border-slate-100" alt="Seal preview" referrerPolicy="no-referrer" />
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-primary-600 block leading-tight">
                            {idt("បានផ្ទុកឡើងរួចរាល់", "Upload completed", "已成功上传")}
                          </span>
                          <span className="text-[8.5px] text-slate-400 block mt-0.5">
                            {idt("ចុចដើម្បីប្តូរត្រា", "Click to change seal", "点击更换印章")}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-4 h-4 text-slate-400 group-hover:text-primary-500 mx-auto" />
                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary-600">
                          {idt("ផ្ទុកត្រាសាលា (PNG, JPG)", "Upload School Seal (PNG, JPG)", "上传印章 (PNG, JPG)")}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Positioning / Offset Controls */}
                <div className="space-y-2 pt-1 border-t border-slate-200">
                  {/* Slider Controls */}
                  <div className="space-y-2 text-[10px] text-slate-600">
                    <div>
                      <div className="flex justify-between font-medium text-slate-500 mb-0.5">
                        <span>{idt("ឆ្វេង-ស្តាំ", "Horizontal", "左右")}</span>
                        <span className="font-mono text-slate-700 font-bold">{sealOffsetX > 0 ? `+${sealOffsetX}` : sealOffsetX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="1"
                        value={sealOffsetX}
                        onChange={(e) => setSealOffsetX(parseInt(e.target.value))}
                        className="w-full accent-primary-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-medium text-slate-500 mb-0.5">
                        <span>{idt("លើ-ក្រោម", "Vertical", "上下")}</span>
                        <span className="font-mono text-slate-700 font-bold">{sealOffsetY > 0 ? `+${sealOffsetY}` : sealOffsetY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="1"
                        value={sealOffsetY}
                        onChange={(e) => setSealOffsetY(parseInt(e.target.value))}
                        className="w-full accent-primary-600 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <div className="flex justify-between font-medium text-slate-400 text-[9px] mb-0.5">
                          <span>{idt("ទំហំ", "Scale", "大小")}</span>
                          <span className="font-mono text-slate-700 font-bold">{sealSize.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.4"
                          max="2.5"
                          step="0.05"
                          value={sealSize}
                          onChange={(e) => setSealSize(parseFloat(e.target.value))}
                          className="w-full accent-primary-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-medium text-slate-400 text-[9px] mb-0.5">
                          <span>{idt("បង្វិល", "Rotate", "旋转")}</span>
                          <span className="font-mono text-slate-700 font-bold">{sealRotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="5"
                          value={sealRotation}
                          onChange={(e) => setSealRotation(parseInt(e.target.value))}
                          className="w-full accent-primary-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>





        </div>

      </div>
    </div>
  );
}
