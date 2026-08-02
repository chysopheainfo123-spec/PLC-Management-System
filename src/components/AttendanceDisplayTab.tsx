import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Clock, ArrowDown, ArrowUp, BookOpen, Hourglass, Sparkles, Monitor, Maximize2, Minimize2, Calendar, TrendingUp, CheckCircle, Users, GraduationCap, RefreshCw } from 'lucide-react';
import { Student as StudentType } from "../types";

// Helper function to convert numbers to Khmer numerals
const toKhmerNumeral = (num: number | string) => {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num).split("").map(char => {
    const digit = parseInt(char, 10);
    return isNaN(digit) ? char : khmerDigits[digit];
  }).join("");
  };

// Helper function to format date to strings
const getKhmerDateString = (date: Date, targetLang?: string) => {
  const currentL = targetLang || localStorage.getItem("plc_lang") || "kh";
  if (currentL === "en") {
    return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } else if (currentL === "zh") {
    return date.toLocaleDateString("zh-CN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  const khmerDays = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"];
  const khmerMonths = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
  ];
  const dayOfWeek = khmerDays[date.getDay()];
  const dayOfMonth = toKhmerNumeral(date.getDate());
  const month = khmerMonths[date.getMonth()];
  const year = toKhmerNumeral(date.getFullYear());
  return `ថ្ងៃ${dayOfWeek} ទី${dayOfMonth} ខែ${month} ឆ្នាំ${year}`;
};

// Helper function to format time in numerals with AM/PM
const getKhmerTimeString = (date: Date, targetLang?: string) => {
  const currentL = targetLang || localStorage.getItem("plc_lang") || "kh";
  if (currentL !== "kh") {
    return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, '0');
  return `${toKhmerNumeral(hoursStr)}:${toKhmerNumeral(minutes)}:${toKhmerNumeral(seconds)} ${ampm}`;
};

// Helper function to extract or map student/teacher shift and hours correctly
const getShiftAndHours = (shiftStr: string | undefined, isTeacher: boolean, person?: any) => {
  if (person && person.hours && person.hours.trim() !== "" && person.hours.trim() !== "---") {
    return {
      shift: shiftStr || (isTeacher ? "ច័ន្ទ-សុក្រ (Mon-Fri)" : "---"),
      hours: person.hours
    };
  }

  if (isTeacher) {
    return {
      shift: "ច័ន្ទ-សុក្រ (Mon-Fri)",
      hours: "តាមកាលវិភាគ (Scheduled)"
    };
  }
  
  if (!shiftStr) {
    return {
      shift: "ច័ន្ទ-សុក្រ (Mon-Fri)",
      hours: "---"
    };
  }

  const timeRegex = /ម៉ោង\s*(\d+:\d+\s*-\s*\d+:\d+\s*[^\s]*)/;
  const match = shiftStr.match(timeRegex);
  if (match) {
    return {
      shift: "ច័ន្ទ-សុក្រ (Mon-Fri)",
      hours: match[1].trim()
    };
  }

  if (shiftStr.includes("ម៉ោងចន្ទ-សុក្រ")) {
    return {
      shift: "ច័ន្ទ-សុក្រ (Mon-Fri)",
      hours: "08:00 AM - 11:00 AM"
    };
  }

  if (shiftStr.includes("ចន្ទ-សុក្រ") || shiftStr.includes("ច័ន្ទ-សុក្រ")) {
    const cleanStr = shiftStr.replace(/ម៉ោង/g, "").trim();
    return {
      shift: "ច័ន្ទ-សុក្រ (Mon-Fri)",
      hours: cleanStr || "08:00 AM - 11:00 AM"
    };
  }

  if (shiftStr.startsWith("ម៉ោង")) {
    const hoursPart = shiftStr.replace(/ម៉ោង/g, "").trim();
    return {
      shift: "ច័ន្ទ-សុក្រ (Mon-Fri)",
      hours: hoursPart
    };
  }

  return {
    shift: shiftStr,
    hours: "---"
  };
};

const formatMMDD = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[1]}-${parts[2]}`;
    }
  } catch (e) {}
  return dateStr;
};

// Robust helper to parse diverse date and time strings securely
const parseDateTime = (dateStr: string, timeStr: string): number => {
  if (!dateStr) return 0;
  try {
    if (!timeStr) {
      return new Date(dateStr + "T00:00:00").getTime();
    }
    
    const cleanTime = timeStr.trim();
    const ampmMatch = cleanTime.match(/^(.*?)\s*(AM|PM)$/i);
    
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    
    if (ampmMatch) {
      const timePart = ampmMatch[1];
      const ampm = ampmMatch[2].toUpperCase();
      const parts = timePart.split(":");
      hours = parseInt(parts[0], 10) || 0;
      minutes = parseInt(parts[1], 10) || 0;
      seconds = parseInt(parts[2], 10) || 0;
      
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    } else {
      const parts = cleanTime.split(":");
      hours = parseInt(parts[0], 10) || 0;
      minutes = parseInt(parts[1], 10) || 0;
      seconds = parseInt(parts[2], 10) || 0;
    }
    
    const isoString = `${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const timestamp = new Date(isoString).getTime();
    return isNaN(timestamp) ? 0 : timestamp;
  } catch (e) {
    return 0;
  }
};

interface AttendanceDisplayTabProps {
  students: StudentType[];
  teachers: any[];
  telegramLogs: any[];
  uiLang?: string;
}

export default function AttendanceDisplayTab({
  students,
  teachers,
  telegramLogs,
  uiLang
}: AttendanceDisplayTabProps) {
  const [localLang, setLocalLang] = useState(uiLang || localStorage.getItem("plc_lang") || "kh");

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

  const lang = localLang;

  // State Management
  const [clock, setClock] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "student" | "teacher" | "check-in" | "check-out">("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ isDragging: boolean; startY: number; scrollTop: number }>({
    isDragging: false,
    startY: 0,
    scrollTop: 0
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('a')) {
      return;
    }

    const scrollContainer = isFullscreen 
      ? scrollContainerRef.current 
      : document.getElementById("main-content-scroll");

    if (!scrollContainer) return;

    dragStartRef.current = {
      isDragging: true,
      startY: e.pageY,
      scrollTop: scrollContainer.scrollTop
    };
    
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current.isDragging) return;
    
    const scrollContainer = isFullscreen 
      ? scrollContainerRef.current 
      : document.getElementById("main-content-scroll");

    if (!scrollContainer) return;

    e.preventDefault();
    const deltaY = e.pageY - dragStartRef.current.startY;
    scrollContainer.scrollTop = dragStartRef.current.scrollTop - deltaY;
  };

  const handleMouseUpOrLeave = () => {
    if (dragStartRef.current.isDragging) {
      dragStartRef.current.isDragging = false;
      setIsDragging(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isFullscreen) return;
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop += e.deltaY;
    }
  };

  // Manual scroll helper
  const handleScrollUp = () => {
    const container = isFullscreen 
      ? scrollContainerRef.current 
      : document.getElementById("main-content-scroll");
    if (container) {
      container.scrollBy({ top: -300, behavior: "smooth" });
    }
  };

  const handleScrollDown = () => {
    const container = isFullscreen 
      ? scrollContainerRef.current 
      : document.getElementById("main-content-scroll");
    if (container) {
      container.scrollBy({ top: 300, behavior: "smooth" });
    }
  };

  // Clock tick effect
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);


  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Helper for translating shift name dynamically
  const formatShift = (shiftName: string | undefined) => {
    if (!shiftName || shiftName === "---") return "---";
    if (lang === "kh") return shiftName;
    const s = (shiftName || '').toLowerCase();
    if (s.includes("ច័ន្ទ-សុក្រ") || s.includes("ចន្ទ-សុក្រ") || s.includes("mon-fri")) {
      return lang === "zh" ? "周一至周五 (Mon-Fri)" : "Monday - Friday (Mon-Fri)";
    }
    if (s.includes("សៅរ៍-អាទិត្យ") || s.includes("sat-sun")) {
      return lang === "zh" ? "周六至周日 (Sat-Sun)" : "Saturday - Sunday (Sat-Sun)";
    }
    return shiftName;
  };

  // Helper for translating hours dynamically
  const formatHours = (hoursVal: string | undefined) => {
    if (!hoursVal || hoursVal === "---") return "---";
    if (lang === "kh") return hoursVal;
    
    let clean = hoursVal;
    if (lang === "en" || lang === "zh") {
      clean = clean.replace(/ម៉ោង/g, "");
      clean = clean.replace(/ព្រឹក/g, lang === "zh" ? " 上午" : " AM");
      clean = clean.replace(/រសៀល/g, lang === "zh" ? " 下午" : " PM");
      clean = clean.replace(/ល្ងាច/g, lang === "zh" ? " 傍晚" : " PM");
      clean = clean.replace(/យប់/g, lang === "zh" ? " 晚上" : " PM");
      clean = clean.replace(/តាមការវិភាគ/g, lang === "zh" ? "按排班" : "Scheduled");
      clean = clean.replace(/Scheduled/gi, lang === "zh" ? "按排班" : "Scheduled");
    }
    return clean;
  };

  // Load custom individual rules from localStorage
  const individualRules = useMemo(() => {
    const saved = localStorage.getItem("sms_individual_scan_rules");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  }, [telegramLogs]);

  // Helper to retrieve effective study/work hours based on individual rules
  const getEffectiveHours = (personId: string, baseHours: string) => {
    const custom = individualRules[personId];
    if (custom && custom.studyStart && custom.studyEnd) {
      return `${custom.studyStart} - ${custom.studyEnd}`;
    }
    return baseHours;
  };

  // Create a fast-lookup map for students and teachers by ID to avoid nested O(N) lookup in JSX
  const personsMap = useMemo(() => {
    const map: { [key: string]: any } = {};
    students.forEach(s => {
      map[`student-${s.id}`] = s;
      map[`student-${s.studentId}`] = s;
    });
    teachers.forEach(t => {
      map[`teacher-${t.id}`] = t;
      map[`teacher-${t.teacherId}`] = t;
    });
    return map;
  }, [students, teachers]);

  // Group logs by studentId to show check-in and check-out together, and build total scan count map in one O(N) run
  const { groupedLogsList, scanCountsMap } = useMemo(() => {
    const groups: { [key: string]: any } = {};
    const counts: { [key: string]: number } = {};

    // 1. Build counts mapping in O(N)
    telegramLogs.forEach(log => {
      const key = log.studentId;
      counts[key] = (counts[key] || 0) + 1;
    });

    // 2. Sort by time ascending so that we process them in historical order
    const sortedLogs = [...telegramLogs].sort((a, b) => {
      return parseDateTime(a.date, a.time) - parseDateTime(b.date, b.time);
    });

    // 3. Populate groups
    sortedLogs.forEach(log => {
      const key = log.studentId;
      if (!groups[key]) {
        groups[key] = {
          studentId: log.studentId,
          dbId: log.dbId || log.studentId,
          name: log.name,
          nameEn: log.nameEn,
          itemType: log.itemType || "student",
          course: log.course,
          date: log.date
        };
      }

      if (log.type === "check-in") {
        groups[key].checkIn = {
          time: log.time,
          status: log.status,
          statusKh: log.statusKh
        };
      } else if (log.type === "check-out") {
        groups[key].checkOut = {
          time: log.time,
          status: log.status,
          statusKh: log.statusKh
        };
      }
    });

    // 4. Sort groups so that the most recently updated group is displayed first
    const list = Object.values(groups).sort((a: any, b: any) => {
      const aTime = Math.max(
        a.checkIn ? parseDateTime(a.date, a.checkIn.time) : 0,
        a.checkOut ? parseDateTime(a.date, a.checkOut.time) : 0
      );
      const bTime = Math.max(
        b.checkIn ? parseDateTime(b.date, b.checkIn.time) : 0,
        b.checkOut ? parseDateTime(b.date, b.checkOut.time) : 0
      );
      return bTime - aTime;
    });

    return { groupedLogsList: list, scanCountsMap: counts };
  }, [telegramLogs]);

  // Filter & Search Logic
  const filteredLogs = useMemo(() => {
    const query = (searchQuery || "").toLowerCase().trim();
    return groupedLogsList.filter(log => {
      const matchSearch = 
        (log.name || "").toLowerCase().includes(query) || 
        (log.nameEn || "").toLowerCase().includes(query) ||
        (log.studentId || "").toLowerCase().includes(query);

      if (!matchSearch) return false;

      if (filterType === "student") return log.itemType === "student";
      if (filterType === "teacher") return log.itemType === "teacher";
      if (filterType === "check-in") return !!log.checkIn;
      if (filterType === "check-out") return !!log.checkOut;

      return true;
    });
  }, [groupedLogsList, searchQuery, filterType]);

  // Auto scroll effect
  useEffect(() => {
    if (!autoScroll) return;
    
    let animationFrameId: number;
    let direction = 1; // 1 = down, -1 = up
    let pauseFrames = 0;
    const maxPauseFrames = 120; // Pause for about 2 seconds at 60fps
    
    const scroll = () => {
      const container = isFullscreen 
        ? scrollContainerRef.current 
        : document.getElementById("main-content-scroll");
        
      if (!container) {
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }
      
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) {
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }
      
      if (pauseFrames > 0) {
        pauseFrames--;
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }
      
      container.scrollTop += 0.85 * direction;
      
      if (direction === 1 && container.scrollTop >= maxScroll - 2) {
        direction = -1;
        pauseFrames = maxPauseFrames;
      } else if (direction === -1 && container.scrollTop <= 2) {
        direction = 1;
        pauseFrames = maxPauseFrames;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoScroll, isFullscreen, filteredLogs]);

  // Today Statistics
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const logsToday = telegramLogs.filter(l => l.date === todayStr);
    
    const checkIns = logsToday.filter(l => l.type === "check-in").length;
    const checkOuts = logsToday.filter(l => l.type === "check-out").length;
    
    // Unique people checked in today
    const activeMembers = new Set(logsToday.map(l => l.studentId)).size;

    return {
      totalLogs: logsToday.length,
      checkIns,
      checkOuts,
      activeMembers
    };
  }, [telegramLogs]);

  return (
    <div 
      ref={containerRef} 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onWheel={handleWheel}
      className={`w-full font-sans flex flex-col transition-all duration-300 text-slate-800 select-none ${
        isFullscreen ? "h-screen overflow-hidden bg-white p-6" : "min-h-screen bg-slate-50/70"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {/* Top Header / Branding area */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b pb-3 mb-4 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-primary-600 text-white shrink-0">
            <Monitor className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-800 leading-tight">
              {lang === "kh" ? "ផ្ទាំងបង្ហាញវត្តមានស្វ័យប្រវត្តិ" : lang === "en" ? "Live Attendance Display" : "实时大屏考勤展现"}
            </h1>
            <p className="text-[11px] font-bold text-slate-500 leading-normal">
              {lang === "kh" ? "ទិន្នន័យស្កេនវត្តមានដោយស្វ័យប្រវត្តិតាមរយៈ QR Code ជាក់ស្តែងភ្លាមៗ" : lang === "en" ? "Real-time automated school attendance feed via QR Code scan" : "全自动二维码/条形码扫码考勤实时显示终端"}
            </p>
          </div>
        </div>

        {/* Real-time elegant Clock & Buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 text-primary-600">
            <Clock className="w-4 h-4 animate-spin-slow text-primary-500" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[13px] font-black font-mono tracking-wider">
                {getKhmerTimeString(clock, lang)}
              </span>
              <span className="text-[9.5px] font-bold text-slate-500 mt-1">
                {getKhmerDateString(clock, lang)}
              </span>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-primary-600 transition-colors cursor-pointer"
            title={isFullscreen ? (lang === "kh" ? "ចាកចេញពីអេក្រង់ធំ" : "Exit Fullscreen") : (lang === "kh" ? "ពង្រីកអេក្រង់ធំ" : "Fullscreen Board")}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>



      {/* Main Grid View of real-time attendance cards */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-12 pr-1 scroll-smooth"
      >
        {filteredLogs.length === 0 ? (
          <div className="border border-dashed rounded-3xl p-16 text-center transition-all bg-white border-slate-200">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-100 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-slate-700">
              {lang === "kh" ? "មិនទាន់មានទិន្នន័យស្កេនវត្តមានទេ" : "No live scan logs found"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-medium">
              {lang === "kh" ? "ទិន្នន័យស្កេនវត្តមានរបស់គ្រូ និងសិស្សានុសិស្ស នឹងលេចឡើងនៅទីនេះភ្លាមៗនៅពេលស្កេន QR Code។" : "Attendance logs will pop up in real-time as soon as students or teachers scan their QR Code."}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-stretch justify-start gap-4">
            <AnimatePresence mode="popLayout">
              {filteredLogs.map((log, index) => {
                const isTeacher = log.itemType === "teacher";
                const hasCheckIn = !!log.checkIn;
                const hasCheckOut = !!log.checkOut;

                const totalPreviousScans = scanCountsMap[log.studentId] || 0;

                // Lookup actual student/teacher metadata
                const personKey = `${log.itemType || "student"}-${log.dbId || log.studentId}`;
                const person = personsMap[personKey] || personsMap[`${log.itemType || "student"}-${log.studentId}`];
                
                const displayId = person 
                  ? (isTeacher ? (person.teacherId || log.studentId) : (person.studentId || log.studentId)) 
                  : log.studentId;

                const shiftInfo = getShiftAndHours(person?.shift, isTeacher, person);

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    key={`${log.studentId}-${index}`}
                    className="w-full sm:w-[calc(270px+0.2cm)] shrink-0 border rounded-[22px] relative overflow-hidden flex flex-col pt-3.5 px-3.5 pb-5 transition-shadow bg-white border-slate-200/95 shadow-sm hover:shadow-md"
                  >
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      hasCheckIn && hasCheckOut 
                        ? "bg-emerald-600" 
                        : hasCheckIn 
                          ? "bg-emerald-500" 
                          : "bg-blue-500"
                    }`} />

                    {/* Top Header Row with capsules */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Counter Badge */}
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide flex items-center gap-1 shadow-3xs shrink-0 bg-amber-50 border border-amber-200/80 text-amber-700">
                        <span>⭐</span>
                        <span>{lang === "kh" ? `លើកទី ${toKhmerNumeral(totalPreviousScans)}` : `Scan #${totalPreviousScans}`}</span>
                      </span>

                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border tracking-wide flex items-center gap-1 shrink-0 ${
                        hasCheckIn && hasCheckOut 
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                          : hasCheckIn 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-sky-500/10 text-sky-450 border-sky-500/20"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        <span>
                          {hasCheckIn && hasCheckOut 
                            ? (lang === "kh" ? "ស្កេនរួចរាល់" : "Scan Completed") 
                            : hasCheckIn 
                              ? (lang === "kh" ? "កំពុងរៀន" : "Active In") 
                              : (lang === "kh" ? "ស្កេនចេញ" : "Checked Out")}
                        </span>
                      </span>
                    </div>

                    {/* Header Block: Avatar & names */}
                    <div className={`border border-l-[5px] rounded-[16px] p-2.5 flex items-center gap-2.5 mt-2.5 ${
                      isTeacher 
                        ? "border-l-emerald-500 bg-emerald-50/10 border-slate-200/30" 
                        : "border-l-sky-500 bg-sky-50/10 border-slate-200/30"
                    }`}>
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-xl text-white font-black text-sm flex items-center justify-center shrink-0 uppercase shadow-sm ${
                        isTeacher ? "bg-emerald-500" : "bg-sky-500"
                      }`}>
                        {(log.name || '').charAt(0)}
                      </div>

                      {/* Name Details */}
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-[14px] font-black tracking-wide truncate text-slate-800">
                          {log.name}
                        </div>
                        <div className="text-[10px] font-extrabold text-slate-400 font-sans tracking-wide truncate uppercase">
                          ({log.nameEn || (lang === "kh" ? "គ្មានឈ្មោះឡាតាំង" : "NO LATIN NAME")})
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1.5 items-center">
                          <span className="font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-3xs shrink-0 bg-white text-slate-500 border border-slate-200">
                            {displayId}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border flex items-center gap-1 shrink-0 ${
                            isTeacher 
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            <span>{isTeacher ? (lang === "kh" ? "គ្រូ" : "Teacher") : (lang === "kh" ? "សិស្ស" : "Student")}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Check-In / Check-Out Dual Box */}
                    <div className="grid grid-cols-2 gap-2 mt-3 p-2 rounded-2xl border bg-slate-50/50 border-slate-100">
                      {/* In */}
                      {log.checkIn ? (
                        <div className="rounded-xl py-1 px-2 flex flex-col justify-between shadow-3xs min-h-[46px] bg-emerald-50/60 text-slate-800">
                          <div className="flex items-center justify-between gap-1 text-[8.5px] font-black text-emerald-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <ArrowDown className="w-3.5 h-3.5" />
                              <span>{lang === "kh" ? "ស្កេនចូល" : "In"}</span>
                            </span>
                            {log.checkIn.status === "LATE" ? (
                              <span className="text-[7.5px] bg-red-500/10 text-red-400 border border-red-500/20 px-1 rounded font-black tracking-normal">
                                {lang === "kh" ? "យឺត" : "Late"}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-[11px] font-black mt-0.5 font-mono">
                            {log.checkIn.time}
                          </div>
                        </div>
                      ) : (
                        <div className="border border-dashed rounded-xl py-1 px-2 flex flex-col justify-center items-center text-center min-h-[46px] border-slate-200 bg-white/50 text-slate-350">
                          <ArrowDown className="w-3 h-3 text-slate-400 animate-bounce mb-0.5" />
                          <span className="text-[8px] font-black uppercase tracking-wider">{lang === "kh" ? "មិនទាន់ចូល" : "No In"}</span>
                        </div>
                      )}

                      {/* Out */}
                      {log.checkOut ? (
                        <div className="rounded-xl py-1 px-2 flex flex-col justify-between shadow-3xs min-h-[46px] bg-blue-50/60 text-slate-800">
                          <div className="flex items-center justify-between gap-1 text-[8.5px] font-black text-blue-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <ArrowUp className="w-3.5 h-3.5" />
                              <span>{lang === "kh" ? "ស្កេនចេញ" : "Out"}</span>
                            </span>
                            {log.checkOut.status === "EARLY_LEAVE" ? (
                              <span className="text-[7.5px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded font-black tracking-normal">
                                {lang === "kh" ? "ចេញមុន" : "Early"}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-[11px] font-black mt-0.5 font-mono">
                            {log.checkOut.time}
                          </div>
                        </div>
                      ) : (
                        <div className="border border-dashed rounded-xl py-1 px-2 flex flex-col justify-center items-center text-center min-h-[46px] border-slate-200 bg-white/50 text-slate-350">
                          <ArrowUp className="w-3 h-3 text-slate-400 mb-0.5" />
                          <span className="text-[8px] font-black uppercase tracking-wider">{lang === "kh" ? "មិនទាន់ចេញ" : "No Out"}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata lines */}
                    <div className="mt-3 space-y-1.5 border-b border-dashed pb-2.5 text-left border-slate-200">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3 text-slate-350" />
                          <span>{lang === "kh" ? "វគ្គសិក្សា" : "Course"}</span>
                        </span>
                        <span className="font-black text-right max-w-[130px] truncate text-slate-700">
                          {log.course}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-350" />
                          <span>{lang === "kh" ? "វេនសិក្សា" : "Shift"}</span>
                        </span>
                        <span className="font-black text-slate-700">{formatShift(shiftInfo.shift)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Hourglass className="w-3 h-3 text-slate-350" />
                          <span>{lang === "kh" ? "ម៉ោងសិក្សា" : "Hours"}</span>
                        </span>
                        <span className="font-black text-slate-700">
                          {formatHours(person ? getEffectiveHours(person.id, shiftInfo.hours) : shiftInfo.hours)}
                        </span>
                      </div>
                    </div>

                    {/* Logs History Segment */}
                    <div className="mt-2.5 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-primary-400" />
                            <span>{lang === "kh" ? "ប្រវត្តិនៃការស្កេនវត្តមាន (Logs)" : "Recent History"}</span>
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-[10px] font-bold text-slate-450">
                            <thead>
                              <tr className="border-b text-[9px] border-slate-100 text-slate-400">
                                <th className="pb-1 text-left font-extrabold">{lang === "kh" ? "ថ្ងៃខែ" : "Date"}</th>
                                <th className="pb-1 text-left font-extrabold">{lang === "kh" ? "ម៉ោង" : "Time"}</th>
                                <th className="pb-1 text-center font-extrabold">{lang === "kh" ? "ប្រភេទ" : "Type"}</th>
                                <th className="pb-1 text-right font-extrabold">{lang === "kh" ? "លទ្ធផល" : "Result"}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {telegramLogs
                                .filter(l => l.studentId === log.studentId)
                                .slice(0, 2)
                                .map((prevLog, pIdx) => {
                                  const isPrevCheckIn = prevLog.type === "check-in";
                                  
                                  let statusLabel = isPrevCheckIn 
                                    ? (lang === "kh" ? "គោរពវិន័យ" : "On Time") 
                                    : (lang === "kh" ? "ជោគជ័យ" : "Success");
                                  let statusColorClass = isPrevCheckIn ? "text-emerald-500" : "text-blue-500";
                                  
                                  if (prevLog.status === "LATE") {
                                    statusLabel = lang === "kh" ? "យឺតយ៉ាវ" : "Late";
                                    statusColorClass = "text-rose-500";
                                  } else if (prevLog.status === "EARLY_LEAVE") {
                                    statusLabel = lang === "kh" ? "ចេញមុន" : "Early";
                                    statusColorClass = "text-amber-500";
                                  } else if (prevLog.status === "PRESENT") {
                                    statusLabel = lang === "kh" ? "គោរពវិន័យ" : "On Time";
                                    statusColorClass = "text-emerald-500";
                                  } else if (prevLog.status === "DEPARTED") {
                                    statusLabel = lang === "kh" ? "ជោគជ័យ" : "Success";
                                    statusColorClass = "text-blue-500";
                                  } else if (prevLog.statusKh) {
                                    statusLabel = prevLog.statusKh.split(" ")[0];
                                  }

                                  return (
                                    <tr 
                                      key={pIdx} 
                                      className="border-b last:border-0 border-slate-50 hover:bg-slate-50/50"
                                    >
                                      <td className="py-1 font-mono text-left text-slate-400">{formatMMDD(prevLog.date)}</td>
                                      <td className="py-1 font-mono text-left text-slate-600">
                                        {prevLog.time.split(" ")[0]} {prevLog.time.split(" ")[1]}
                                      </td>
                                      <td className="py-1 text-center">
                                        <span className={`text-[9px] font-black ${
                                          isPrevCheckIn ? "text-emerald-500" : "text-blue-500"
                                        }`}>
                                          {isPrevCheckIn ? (lang === "kh" ? "ចូល" : "In") : (lang === "kh" ? "ចេញ" : "Out")}
                                        </span>
                                      </td>
                                      <td className="py-1 text-right">
                                        <span className={`text-[9px] font-black ${statusColorClass}`}>
                                          {statusLabel}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Scroll & Auto-Scroll Controls */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5">
        {/* Scroll Up Button */}
        <button
          onClick={handleScrollUp}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-600 border border-slate-200/80 shadow-lg flex items-center justify-center hover:text-primary-600 hover:border-primary-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={lang === "kh" ? "ស្ក្រូលឡើងលើ" : "Scroll Up"}
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Auto Scroll Toggle Button */}
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            autoScroll 
              ? "bg-primary-600 text-white border border-primary-500 shadow-primary-200" 
              : "bg-white text-slate-600 border border-slate-200/80"
          }`}
          title={lang === "kh" ? (autoScroll ? "ផ្អាកស្ក្រូលស្វ័យប្រវត្តិ" : "ស្ក្រូលស្វ័យប្រវត្តិតាមអេក្រង់") : "Toggle Auto-Scroll"}
        >
          <RefreshCw className={`w-5 h-5 ${autoScroll ? "animate-spin-slow" : ""}`} />
        </button>

        {/* Scroll Down Button */}
        <button
          onClick={handleScrollDown}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-600 border border-slate-200/80 shadow-lg flex items-center justify-center hover:text-primary-600 hover:border-primary-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={lang === "kh" ? "ស្ក្រូលចុះក្រោម" : "Scroll Down"}
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
