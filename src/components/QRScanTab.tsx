import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, ArrowDown, ArrowUp, GraduationCap, User, Search, SlidersHorizontal, List, LayoutGrid, Clock, Camera, Check, X, BookOpen, Hourglass, Sparkles, Settings2, Edit3, Save, Undo2, UserCheck, Users, ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
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
  hours = hours ? hours : 12; // the hour '0' should be '12'
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

  // If the shift string has a time pattern like "ម៉ោង 5:30 - 6:30 យប់" or "ម៉ោង 2:00 - 3:30 រសៀល"
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

const parseShiftTimes = (hoursStr: string): { start: string; end: string } | null => {
  if (!hoursStr || hoursStr === "---" || hoursStr.includes("Scheduled") || hoursStr.includes("តាមកាលវិភាគ")) {
    return null;
  }

  try {
    const parts = hoursStr.split("-").map(p => p.trim());
    if (parts.length === 2) {
      const startStr = parts[0];
      const endStr = parts[1];

      const hasPM = (s: string) => {
        const lower = (s || '').toLowerCase();
        return lower.includes("pm") || lower.includes("p.m.") || s.includes("រសៀល") || s.includes("ល្ងាច") || s.includes("យប់");
      };

      const hasAM = (s: string) => {
        const lower = (s || '').toLowerCase();
        return lower.includes("am") || lower.includes("a.m.") || s.includes("ព្រឹក");
      };

      const parseTimeTo24h = (timeStr: string, isStart: boolean, siblingHour?: number): string | null => {
        const match = timeStr.match(/(\d+):(\d+)/);
        if (!match) return null;
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        
        let isPM = hasPM(timeStr);
        let isAM = hasAM(timeStr);

        if (isStart && !isPM && !isAM) {
          if (hasPM(endStr)) {
            if (siblingHour !== undefined) {
              if (h <= siblingHour) {
                isPM = true;
              } else {
                isAM = true;
              }
            } else {
              isPM = true;
            }
          } else if (hasAM(endStr)) {
            isAM = true;
          }
        }

        if (isPM && h < 12) h += 12;
        if (!isPM && h === 12) h = 0;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      };

      const endMatch = endStr.match(/(\d+):(\d+)/);
      const endHour = endMatch ? parseInt(endMatch[1]) : undefined;

      const start = parseTimeTo24h(startStr, true, endHour);
      const end = parseTimeTo24h(endStr, false);

      if (start && end) {
        return { start, end };
      }
    }
  } catch (e) {
    console.error("Error parsing hoursStr", e);
  }

  return null;
};

const minutesToTimeStr = (totalMinutes: number): string => {
  let m = totalMinutes;
  if (m < 0) m += 24 * 60; // handle wrap around if any
  m = m % (24 * 60);
  let h = Math.floor(m / 60);
  const mins = m % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${String(h).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${ampm}`;
};



interface QRScanTabProps {
  students: StudentType[];
  teachers: any[];
  telegramLogs: any[];
  setTelegramLogs: React.Dispatch<React.SetStateAction<any[]>>;
  attendanceCheckInLog: any;
  setAttendanceCheckInLog: React.Dispatch<React.SetStateAction<any>>;
  attendanceCheckOutLog: any;
  setAttendanceCheckOutLog: React.Dispatch<React.SetStateAction<any>>;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  uiLang?: string;
}

export default function QRScanTab({
  students: rawStudents,
  teachers: rawTeachers,
  telegramLogs,
  setTelegramLogs,
  attendanceCheckInLog,
  setAttendanceCheckInLog,
  attendanceCheckOutLog,
  setAttendanceCheckOutLog,
  showToast,
  uiLang
}: QRScanTabProps) {
  const students = useMemo(() => (rawStudents || []).filter((s: any) => s && s.status === 'STUDYING'), [rawStudents]);
  const teachers = useMemo(() => (rawTeachers || []).filter((t: any) => t && (t.status === 'ACTIVE' || t.status === 'LEAVE')), [rawTeachers]);

  const lang = uiLang || localStorage.getItem("plc_lang") || "kh";
  
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

  // Navigation & UI state
  const [clock, setClock] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const handlePrevDay = () => {
    const parts = selectedDate.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const handleNextDay = () => {
    const parts = selectedDate.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "student" | "teacher" | "check-in" | "check-out">("all");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [isSessionFeedHidden, setIsSessionFeedHidden] = useState(true);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Ref and helper for scrolling session feed
  const sessionFeedContainerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (err) {
        // Fallback for older browsers
        dateInputRef.current.click();
      }
    }
  };

  const scrollSessionFeed = (direction: "up" | "down") => {
    if (sessionFeedContainerRef.current) {
      const container = sessionFeedContainerRef.current;
      const scrollAmount = 260; // Scroll by 260px (around 1 card height)
      if (direction === "up") {
        container.scrollBy({ top: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ top: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Scanner states
  const [isScanning, setIsScanning] = useState(false);
  const [selectedScanStudentId, setSelectedScanStudentId] = useState("");
  const [scanMode, setScanMode] = useState<"check-in" | "check-out">("check-in");
  const [soundFeedback, setSoundFeedback] = useState<"classic" | "cyber" | "triad" | "mute">("classic");
  const [consoleRoleFilter, setConsoleRoleFilter] = useState<"all" | "student" | "teacher">("all");
  const [isConsoleDropdownOpen, setIsConsoleDropdownOpen] = useState(false);
  const [consoleDropdownSearch, setConsoleDropdownSearch] = useState("");

  // Scan Rules and Conditions State
  const [lateCheckInTime, setLateCheckInTime] = useState("08:15");
  const [earlyCheckOutTime, setEarlyCheckOutTime] = useState("11:00");

  // Staff accounts from localStorage fallback to mock default
  const staffList = useMemo(() => {
    const saved = localStorage.getItem("sms_staff_credentials");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "SMS-STAFF-101",
        nameKh: "លោកគ្រូ អឿត",
        nameEn: "CHEY ATHET",
        username: "admin",
        role: "ADMIN",
        phone: "012345678",
        pass: "admin123",
        createdAt: "2026-01-01"
      },
      {
        id: "SMS-STAFF-102",
        nameKh: "អ្នកគ្រូ នីតា",
        nameEn: "SREY NITA",
        username: "nita",
        role: "REGISTRAR",
        phone: "098765432",
        pass: "nita123",
        createdAt: "2026-01-02"
      },
      {
        id: "SMS-STAFF-103",
        nameKh: "លោក វុទ្ធី",
        nameEn: "KONG VUTHY",
        username: "vuthy",
        role: "REGISTRAR",
        phone: "015112233",
        pass: "vuthy123",
        createdAt: "2026-01-03"
      }
    ];
  }, []);

  // Dictionary of custom scan rules per person ID
  const [individualRules, setIndividualRules] = useState<Record<string, { lateIn: string; earlyOut: string; studyStart?: string; studyEnd?: string }>>(() => {
    const saved = localStorage.getItem("sms_individual_scan_rules");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Helper to retrieve effective study/work hours based on individual rules
  const getEffectiveHours = (personId: string, baseHours: string) => {
    const custom = individualRules[personId];
    if (custom && custom.studyStart && custom.studyEnd) {
      return `${custom.studyStart} - ${custom.studyEnd}`;
    }
    return baseHours;
  };

  // Unified options for scan rules configuration (Students, Teachers, Staffs)
  const configRuleOptions = useMemo(() => {
    const list: { id: string; displayId: string; name: string; nameEn: string; type: "student" | "teacher" | "staff"; details: string; hours: string; rawPerson: any }[] = [];
    
    // Add students
    students.forEach(s => {
      if (s.status === "STUDYING") {
        const shiftInfo = getShiftAndHours(s.shift, false, s);
        list.push({
          id: s.id,
          displayId: s.studentId,
          name: s.nameKh,
          nameEn: s.nameEn || "",
          type: "student",
          details: s.course
            ? `${s.course}${s.level ? ` (${s.level})` : ""}`
            : "សិស្ស",
          hours: getEffectiveHours(s.id, shiftInfo.hours),
          rawPerson: s
        });
      }
    });

    // Add teachers
    teachers.forEach(t => {
      if (t.status !== "SUSPENDED" && t.status !== "EXITED") {
        const shiftInfo = getShiftAndHours(t.shift, true, t);
        list.push({
          id: t.id,
          displayId: t.teacherId,
          name: t.nameKh || t.name || "",
          nameEn: t.nameEn || "",
          type: "teacher",
          details: t.specialty || "គ្រូបង្រៀន",
          hours: getEffectiveHours(t.id, shiftInfo.hours),
          rawPerson: t
        });
      }
    });

    // Add staffs
    staffList.forEach(s => {
      list.push({
        id: s.id,
        displayId: s.id,
        name: s.nameKh,
        nameEn: s.nameEn || "",
        type: "staff",
        details: s.role === "ADMIN" ? "អភិបាល (Admin)" : "បុគ្គលិក",
        hours: getEffectiveHours(s.id, "08:00 AM - 17:00 PM"),
        rawPerson: s
      });
    });

    return list;
  }, [students, teachers, staffList, individualRules]);

  // Selected person state specifically for scan conditions editing
  const [ruleFilterType, setRuleFilterType] = useState<"all" | "student" | "teacher" | "staff">("all");
  const [ruleSelectedPersonId, setRuleSelectedPersonId] = useState("");
  const [isRuleDropdownOpen, setIsRuleDropdownOpen] = useState(false);
  const [ruleDropdownSearch, setRuleDropdownSearch] = useState("");

  const currentRulePerson = useMemo(() => {
    const availableOptions = ruleFilterType === "all" ? configRuleOptions : configRuleOptions.filter(o => o.type === ruleFilterType);
    const pid = ruleSelectedPersonId;
    const found = availableOptions.find(o => o.id === pid);
    if (found) return found;
    return availableOptions[0] || null;
  }, [configRuleOptions, ruleFilterType, ruleSelectedPersonId]);

  const filteredRuleOptions = useMemo(() => {
    const baseOptions = ruleFilterType === "all" ? configRuleOptions : configRuleOptions.filter(o => o.type === ruleFilterType);
    if (!ruleDropdownSearch) return baseOptions;
    const s = (ruleDropdownSearch || '').toLowerCase();
    return baseOptions.filter(o => 
      (o.name || "").toLowerCase().includes(s) || 
      (o.nameEn || "").toLowerCase().includes(s) || 
      (o.id || "").toLowerCase().includes(s) ||
      (o.displayId || "").toLowerCase().includes(s) ||
      (o.details || "").toLowerCase().includes(s)
    );
  }, [configRuleOptions, ruleFilterType, ruleDropdownSearch]);

  const [isEditingRule, setIsEditingRule] = useState(false);
  const [ruleLateIn, setRuleLateIn] = useState("08:15");
  const [ruleEarlyOut, setRuleEarlyOut] = useState("11:00");
  const [ruleStudyStart, setRuleStudyStart] = useState("08:00");
  const [ruleStudyEnd, setRuleStudyEnd] = useState("11:00");

  const currentRulePersonFullDetails = useMemo(() => {
    if (!currentRulePerson) return null;
    const isTeacher = currentRulePerson.type === "teacher";
    const isStaff = currentRulePerson.type === "staff";
    
    if (isStaff) {
      const person = currentRulePerson.rawPerson;
      return {
        person: {
          gender: person.role === "ADMIN" ? "ប្រុស (Male)" : "ស្រី (Female)",
          phone: person.phone,
          status: "ACTIVE",
          role: person.role
        },
        shiftInfo: {
          shift: "ច័ន្ទ-សុក្រ (Mon-Fri)",
          hours: "08:00 AM - 17:00 PM"
        }
      };
    }
    
    const person = isTeacher
      ? teachers.find(t => t.id === currentRulePerson.id || t.teacherId === currentRulePerson.displayId)
      : students.find(s => s.id === currentRulePerson.id || s.studentId === currentRulePerson.displayId);
      
    return {
      person,
      shiftInfo: getShiftAndHours(person?.shift, isTeacher, person)
    };
  }, [currentRulePerson, students, teachers]);

  // Validate that current time is within study/work hours
  const isTimeValidForShift = (personId: string, hoursStr: string, isCheckIn: boolean, currentHour: number, currentMinute: number): { isValid: boolean; reason?: string } => {
    let startMinutes: number;
    let endMinutes: number;
    let displayHours = hoursStr;

    // 1. Check individual rules first
    const custom = individualRules[personId];
    if (custom && custom.studyStart && custom.studyEnd) {
      displayHours = `${custom.studyStart} - ${custom.studyEnd}`;
      const [startH, startM] = custom.studyStart.split(":").map(Number);
      const [endH, endM] = custom.studyEnd.split(":").map(Number);
      startMinutes = startH * 60 + startM;
      endMinutes = endH * 60 + endM;
    } else {
      // 2. Parse from shift hoursStr
      const times = parseShiftTimes(hoursStr);
      if (!times) {
        // Fallback: If we cannot parse hours (e.g. "Scheduled" or "---"), let's resolve default shift hours based on the shift context!
        let fallbackStart = "08:00";
        let fallbackEnd = "11:00";
        if ((hoursStr || '').toLowerCase().includes("night") || hoursStr.includes("យប់") || hoursStr.includes("ល្ងាច")) {
          fallbackStart = "17:30";
          fallbackEnd = "18:30";
          displayHours = "05:30 PM - 06:30 PM";
        } else if ((hoursStr || '').toLowerCase().includes("afternoon") || hoursStr.includes("រសៀល")) {
          fallbackStart = "14:00";
          fallbackEnd = "15:30";
          displayHours = "02:00 PM - 03:30 PM";
        } else {
          displayHours = "08:00 AM - 11:00 AM";
        }
        const [startH, startM] = fallbackStart.split(":").map(Number);
        const [endH, endM] = fallbackEnd.split(":").map(Number);
        startMinutes = startH * 60 + startM;
        endMinutes = endH * 60 + endM;
      } else {
        const [startH, startM] = times.start.split(":").map(Number);
        startMinutes = startH * 60 + startM;
        const [endH, endM] = times.end.split(":").map(Number);
        endMinutes = endH * 60 + endM;
      }
    }

    const currentMinutes = currentHour * 60 + currentMinute;

    if (isCheckIn) {
      // Check-In is allowed:
      // - From 60 minutes before the start time
      // - Up to the end time of the class
      const checkInStart = startMinutes - 60;
      const checkInEnd = endMinutes;

      if (currentMinutes < checkInStart) {
        return { 
          isValid: false, 
          reason: lang === "en" 
            ? `It's not scan time yet! Scheduled class starts from ${displayHours}. You can check-in starting at ${minutesToTimeStr(checkInStart)}.` 
            : lang === "zh" 
              ? `未到签到时间！安排的课程开始于 ${displayHours}。您可以在 ${minutesToTimeStr(checkInStart)} 开始签到。` 
              : `មិនទាន់ដល់ម៉ោងស្កេនចូលទេ! ម៉ោងសិក្សាគឺចាប់ពី ${displayHours}។ អ្នកអាចស្កេនចូលបានចាប់ពីម៉ោង ${minutesToTimeStr(checkInStart)} តទៅ។` 
        };
      }
      if (currentMinutes > checkInEnd) {
        return { 
          isValid: false, 
          reason: lang === "en" 
            ? `Class time is over! Class hours are ${displayHours}. Cannot check-in anymore.` 
            : lang === "zh" 
              ? `课程时间已过！课程时间为 ${displayHours}。无法再签到。` 
              : `ហួសម៉ោងសិក្សាហើយ! ម៉ោងសិក្សាគឺ ${displayHours}។ មិនអាចស្កេនចូលបានទៀតទេ។` 
        };
      }
    } else {
      // Check-Out is allowed:
      // - From startMinutes onwards (e.g. once the class/shift starts)
      // - Up to 120 minutes after the end time of the class
      const checkOutStart = startMinutes;
      const checkOutEnd = endMinutes + 120;

      if (currentMinutes < checkOutStart) {
        return { 
          isValid: false, 
          reason: lang === "en" 
            ? `It's not checkout time yet! Scheduled hours are from ${displayHours}.` 
            : lang === "zh" 
              ? `未到签退时间！安排的时间是 ${displayHours}。` 
              : `មិនទាន់ដល់ម៉ោងស្កេនចេញទេ! ម៉ោងសិក្សាគឺចាប់ពី ${displayHours}។` 
        };
      }
      if (currentMinutes > checkOutEnd) {
        return { 
          isValid: false, 
          reason: lang === "en" 
            ? `Checkout time has expired! Class was ${displayHours} (Checkout allowed until ${minutesToTimeStr(checkOutEnd)}).` 
            : lang === "zh" 
              ? `签退时间已过期！课程时间是 ${displayHours} （允许在 ${minutesToTimeStr(checkOutEnd)} 之前签退）。` 
              : `ហួសម៉ោងស្កេនចេញហើយ! ម៉ោងសិក្សាគឺ ${displayHours} (អនុញ្ញាតអោយស្កេនចេញរហូតដល់ ${minutesToTimeStr(checkOutEnd)})។` 
        };
      }
    }

    return { isValid: true };
  };

  // Determine suggested scan mode automatically based on rules
  const detectSuggestedScanMode = (personId: string, hoursStr: string, currentHour: number, currentMinute: number): "check-in" | "check-out" => {
    // 1. First, check history for the selected date
    const hasCheckedInToday = telegramLogs.some(log => 
      log.dbId === personId && 
      log.type === "check-in" && 
      (log.date || new Date().toISOString().split("T")[0]) === selectedDate
    );
    const hasCheckedOutToday = telegramLogs.some(log => 
      log.dbId === personId && 
      log.type === "check-out" && 
      (log.date || new Date().toISOString().split("T")[0]) === selectedDate
    );

    if (hasCheckedInToday && !hasCheckedOutToday) {
      return "check-out";
    }
    if (hasCheckedInToday && hasCheckedOutToday) {
      return "check-in"; // both done, reset suggested to check-in
    }

    let displayHours = hoursStr;
    const custom = individualRules[personId];
    if (custom && custom.studyStart && custom.studyEnd) {
      displayHours = `${custom.studyStart} - ${custom.studyEnd}`;
    }

    if (!displayHours || displayHours === "---" || displayHours.includes("Scheduled") || displayHours.includes("តាមកាលវិភាគ")) {
      return currentHour < 12 ? "check-in" : "check-out";
    }

    const times = parseShiftTimes(displayHours);
    if (!times) {
      if ((displayHours || '').toLowerCase().includes("night") || displayHours.includes("យប់") || displayHours.includes("ល្ងាច")) {
        return currentHour >= 16 ? "check-in" : "check-out";
      }
      if ((displayHours || '').toLowerCase().includes("afternoon") || displayHours.includes("រសៀល")) {
        return (currentHour >= 12 && currentHour < 15) ? "check-in" : "check-out";
      }
      return currentHour < 11 ? "check-in" : "check-out";
    }

    const currentMinutes = currentHour * 60 + currentMinute;
    const [startH, startM] = times.start.split(":").map(Number);
    const startMinutes = startH * 60 + startM;

    const [endH, endM] = times.end.split(":").map(Number);
    const endMinutes = endH * 60 + endM;

    // Anytime before the midpoint of the class, suggest "check-in"
    const midpoint = startMinutes + (endMinutes - startMinutes) / 2;
    if (currentMinutes < midpoint) {
      return "check-in";
    }
    return "check-out";
  };

  // Sync edit values whenever currentRulePerson or individualRules change
  useEffect(() => {
    if (currentRulePerson) {
      const pid = currentRulePerson.id;
      const personRules = individualRules[pid];
      if (personRules) {
        setRuleLateIn(personRules.lateIn || "08:15");
        setRuleEarlyOut(personRules.earlyOut || "11:00");
        setRuleStudyStart(personRules.studyStart || "08:00");
        setRuleStudyEnd(personRules.studyEnd || "11:00");
      } else {
        let defaultLate = "08:15";
        let defaultEarly = "11:00";
        let defaultStudyStart = "08:00";
        let defaultStudyEnd = "11:00";
        if (currentRulePersonFullDetails?.shiftInfo?.hours) {
          const parsed = parseShiftTimes(currentRulePersonFullDetails.shiftInfo.hours);
          if (parsed) {
            defaultStudyStart = parsed.start;
            defaultStudyEnd = parsed.end;
            const [sh, sm] = parsed.start.split(":").map(Number);
            let lm = sm + 15;
            let lh = sh;
            if (lm >= 60) {
              lm -= 60;
              lh += 1;
            }
            defaultLate = `${String(lh).padStart(2, "0")}:${String(lm).padStart(2, "0")}`;
            defaultEarly = parsed.end;
          } else {
            const shiftName = currentRulePersonFullDetails.shiftInfo.shift || "";
            const hoursStr = currentRulePersonFullDetails.shiftInfo.hours || "";
            if (hoursStr.includes("យប់") || hoursStr.includes("ល្ងាច") || shiftName.includes("យប់")) {
              defaultStudyStart = "17:30";
              defaultStudyEnd = "18:30";
              defaultLate = "17:45";
              defaultEarly = "18:30";
            } else if (hoursStr.includes("រសៀល") || shiftName.includes("រសៀល")) {
              defaultStudyStart = "14:00";
              defaultStudyEnd = "15:30";
              defaultLate = "14:15";
              defaultEarly = "15:30";
            }
          }
        }
        setRuleLateIn(defaultLate);
        setRuleEarlyOut(defaultEarly);
        setRuleStudyStart(defaultStudyStart);
        setRuleStudyEnd(defaultStudyEnd);
      }
      setIsEditingRule(false);
    }
  }, [currentRulePerson, individualRules, currentRulePersonFullDetails]);

  // Keep digital clock running
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date helper
  const formatMMDD = (dateStr?: string) => {
    if (!dateStr) return "07-01";
    try {
      const parts = dateStr.split("-");
      if (parts.length >= 3) {
        return `${parts[1]}-${parts[2]}`;
      }
    } catch (e) {}
    return "07-01";
  };

  // Sound generator using Web Audio API
  const playBeep = (type: "classic" | "cyber" | "triad" | "mute") => {
    if (type === "mute") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === "classic") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "cyber") {
        // Quick high-pitch double chirp
        const playChirp = (delay: number, freq: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + delay + 0.04);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.04);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.04);
        };
        playChirp(0, 1200);
        playChirp(0.06, 1600);
      } else if (type === "triad") {
        // C5, E5, G5 arpeggio
        const playNote = (delay: number, freq: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + duration);
        };
        playNote(0, 523.25, 0.08); // C5
        playNote(0.05, 659.25, 0.08); // E5
        playNote(0.10, 783.99, 0.15); // G5
      }
    } catch (e) {
      console.error("Audio Web API not supported or blocked", e);
    }
  };

  // Default option selected in trigger list
  useEffect(() => {
    if (students.length > 0 && !selectedScanStudentId) {
      setSelectedScanStudentId(students[0].id);
    }
  }, [students, selectedScanStudentId]);

  // Combined personnel list for selector dropdown
  const scanOptions = useMemo(() => {
    const list: { id: string; displayId: string; name: string; nameEn: string; type: "student" | "teacher"; details: string }[] = [];
    students.forEach(s => {
      if (s.status === "STUDYING") {
        list.push({
          id: s.id,
          displayId: s.studentId,
          name: s.nameKh,
          nameEn: s.nameEn || "",
          type: "student",
          details: s.course
            ? `${s.course}${s.level ? ` (${s.level})` : ""}`
            : "សិស្ស"
        });
      }
    });
    teachers.forEach(t => {
      if (t.status !== "SUSPENDED" && t.status !== "EXITED") {
        list.push({
          id: t.id,
          displayId: t.teacherId,
          name: t.nameKh || t.name || "",
          nameEn: t.nameEn || "",
          type: "teacher",
          details: t.specialty || "គ្រូបង្រៀន"
        });
      }
    });
    return list;
  }, [students, teachers]);

  // Filtered scan options for selector dropdown based on console role filter
  const filteredScanOptions = useMemo(() => {
    if (consoleRoleFilter === "all") return scanOptions;
    return scanOptions.filter(o => o.type === consoleRoleFilter);
  }, [scanOptions, consoleRoleFilter]);

  const finalFilteredOptions = useMemo(() => {
    if (!consoleDropdownSearch) return filteredScanOptions;
    const s = (consoleDropdownSearch || '').toLowerCase();
    return filteredScanOptions.filter(o => 
      (o.name || "").toLowerCase().includes(s) || 
      (o.nameEn || "").toLowerCase().includes(s) || 
      (o.id || "").toLowerCase().includes(s) ||
      (o.displayId || "").toLowerCase().includes(s) ||
      (o.details || "").toLowerCase().includes(s)
    );
  }, [filteredScanOptions, consoleDropdownSearch]);

  // Synchronize selection when filtered scan options change
  useEffect(() => {
    if (filteredScanOptions.length > 0) {
      const isStillAvailable = filteredScanOptions.some(opt => opt.id === selectedScanStudentId);
      if (!isStillAvailable) {
        setSelectedScanStudentId(filteredScanOptions[0].id);
      }
    }
  }, [filteredScanOptions, selectedScanStudentId]);

  // Find currently selected preview person in simulated scanner
  const selectedScanPerson = useMemo(() => {
    return scanOptions.find(o => o.id === selectedScanStudentId) || scanOptions[0] || null;
  }, [scanOptions, selectedScanStudentId]);

  // Lookup the actual student or teacher details to capture shift and study hours
  const selectedPersonFullDetails = useMemo(() => {
    if (!selectedScanPerson) return null;
    const isTeacher = selectedScanPerson.type === "teacher";
    const person = isTeacher
      ? teachers.find(t => t.id === selectedScanPerson.id || t.teacherId === selectedScanPerson.displayId)
      : students.find(s => s.id === selectedScanPerson.id || s.studentId === selectedScanPerson.displayId);
    return {
      person,
      shiftInfo: getShiftAndHours(person?.shift, isTeacher, person)
    };
  }, [selectedScanPerson, students, teachers]);

  // Automatically adjust scan mode when selected person, clock, selected date, or rules change
  useEffect(() => {
    if (!selectedPersonFullDetails?.shiftInfo?.hours) return;
    const now = new Date();
    const suggestedMode = detectSuggestedScanMode(
      selectedScanPerson?.id || "",
      selectedPersonFullDetails.shiftInfo.hours,
      now.getHours(),
      now.getMinutes()
    );
    setScanMode(prev => prev === suggestedMode ? prev : suggestedMode);
  }, [selectedScanStudentId, selectedPersonFullDetails, clock, selectedDate, telegramLogs, individualRules]);

  // Filter telegramLogs by selectedDate for stats and grouped logs
  const logsForSelectedDate = useMemo(() => {
    return telegramLogs.filter(l => {
      const logDate = l.date || new Date().toISOString().split("T")[0];
      return logDate === selectedDate;
    });
  }, [telegramLogs, selectedDate]);

  // Dynamic calculations for stat counters
  const totalScans = logsForSelectedDate.length;
  const checkInCount = logsForSelectedDate.filter(l => l.type === "check-in").length;
  const checkOutCount = logsForSelectedDate.filter(l => l.type === "check-out").length;
  const uniqueStudents = new Set(logsForSelectedDate.filter(l => l.itemType === "student").map(l => l.studentId)).size;
  const uniqueTeachers = new Set(logsForSelectedDate.filter(l => l.itemType === "teacher").map(l => l.studentId)).size;

  // Group logs by studentId to show check-in and check-out together
  const groupedLogs = useMemo(() => {
    const groups: { [key: string]: any } = {};

    logsForSelectedDate.forEach(log => {
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
        if (!groups[key].checkIn) {
          groups[key].checkIn = {
            time: log.time,
            status: log.status,
            statusKh: log.statusKh
          };
        }
      } else if (log.type === "check-out") {
        if (!groups[key].checkOut) {
          groups[key].checkOut = {
            time: log.time,
            status: log.status,
            statusKh: log.statusKh
          };
        }
      }
    });

    return Object.values(groups);
  }, [logsForSelectedDate]);

  // Filter & Search Logic on grouped logs
  const filteredLogs = useMemo(() => {
    return groupedLogs.filter(log => {
      const term = (searchQuery || "").toLowerCase();
      const matchSearch = 
        (log.name || "").toLowerCase().includes(term) || 
        (log.nameEn || "").toLowerCase().includes(term) ||
        (log.studentId || "").toLowerCase().includes(term);

      if (!matchSearch) return false;

      if (filterType === "student") return log.itemType === "student";
      if (filterType === "teacher") return log.itemType === "teacher";
      if (filterType === "check-in") return !!log.checkIn;
      if (filterType === "check-out") return !!log.checkOut;

      return true;
    });
  }, [groupedLogs, searchQuery, filterType]);

  // Handle simulated scan trigger
  const handleSimulatedScan = () => {
    if (!selectedScanPerson) {
      showToast(
        lang === "kh" 
          ? "សូមជ្រើសរើសបុគ្គលដើម្បីស្កេន!" 
          : lang === "zh" 
            ? "请选择要刷卡的目标人员！" 
            : "Please select a target member to scan!", 
        "error"
      );
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Determine scan type (Check-In vs Check-Out)
    let isCheckIn = scanMode === "check-in";

    // Validate that current time is within study/work hours
    const hoursStr = selectedPersonFullDetails?.shiftInfo?.hours || "---";
    const validation = isTimeValidForShift(selectedScanPerson.id, hoursStr, isCheckIn, currentHour, currentMinute);
    if (!validation.isValid) {
      // Play error buzz sound
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch (e) {}

      showToast(
        validation.reason || (
          lang === "kh" 
            ? "មិនអាចស្កេនបានទេ៖ ខុសម៉ោងដែលបានកំណត់!" 
            : lang === "zh" 
              ? "扫码失败：当前不在考勤规则允许的班次时间段内！" 
              : "Scan Rejected: Current time is outside authorized shift hours!"
        ), 
        "error"
      );
      return;
    }

    // Check for duplicate scans on the current day for the selected person
    const todayStr = selectedDate;
    const isAlreadyScanned = telegramLogs.some(log => 
      log.dbId === selectedScanPerson.id && 
      log.type === (isCheckIn ? "check-in" : "check-out") && 
      log.date === todayStr
    );

    if (isAlreadyScanned) {
      // Play error buzz sound
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch (e) {}

      const modeText = isCheckIn 
        ? (lang === "kh" ? "ស្កេនចូល" : lang === "zh" ? "签到" : "checked-in") 
        : (lang === "kh" ? "ស្កេនចេញ" : lang === "zh" ? "签退" : "checked-out");
      showToast(
        lang === "kh" 
          ? `បរាជ័យ៖ ${selectedScanPerson.name} បាន${modeText}រួចរាល់ហើយសម្រាប់ថ្ងៃនេះ!` 
          : lang === "zh" 
            ? `失败：${selectedScanPerson.name} 今天已经完成${modeText}！` 
            : `Failed: ${selectedScanPerson.name} has already ${modeText} for today!`, 
        "error"
      );
      return;
    }

    // Sound effect (only played on success)
    playBeep(soundFeedback);

    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    let statusText = "PRESENT";
    let statusKhText = isCheckIn ? "វត្តមាន (PRESENT)" : "ម៉ោងចេញ (CHECK-OUT)";

    // Apply late & early departure rules
    let effectiveLate = lateCheckInTime;
    let effectiveEarly = earlyCheckOutTime;
    
    if (selectedScanPerson?.id && individualRules[selectedScanPerson.id]) {
      const customRule = individualRules[selectedScanPerson.id];
      if (customRule.lateIn) effectiveLate = customRule.lateIn;
      if (customRule.earlyOut) effectiveEarly = customRule.earlyOut;
    }

    if (isCheckIn) {
      try {
        const [lateH, lateM] = effectiveLate.split(":").map(Number);
        if (!isNaN(lateH) && !isNaN(lateM)) {
          if (currentHour > lateH || (currentHour === lateH && currentMinute > lateM)) {
            statusText = "LATE";
            statusKhText = "យឺតយ៉ាវ (LATE)";
          } else {
            statusText = "PRESENT";
            statusKhText = "គោរពវិន័យ (ON TIME)";
          }
        }
      } catch (e) {}
    } else {
      try {
        const [earlyH, earlyM] = effectiveEarly.split(":").map(Number);
        if (!isNaN(earlyH) && !isNaN(earlyM)) {
          if (currentHour < earlyH || (currentHour === earlyH && currentMinute < earlyM)) {
            statusText = "EARLY_LEAVE";
            statusKhText = "ចេញមុនម៉ោង (EARLY)";
          } else {
            statusText = "DEPARTED";
            statusKhText = "ជោគជ័យ (SUCCESS)";
          }
        }
      } catch (e) {}
    }

    // Construct new log record
    const newLog = {
      type: isCheckIn ? "check-in" : "check-out",
      name: selectedScanPerson.name,
      nameEn: selectedScanPerson.nameEn,
      studentId: selectedScanPerson.displayId, // Store correct formatted display ID
      dbId: selectedScanPerson.id, // Store DB ID for state mapping
      status: statusText,
      statusKh: statusKhText,
      course: selectedScanPerson.details,
      time: timeString,
      itemType: selectedScanPerson.type,
      date: selectedDate
    };

    // Prepend to list
    setTelegramLogs(prev => [newLog, ...prev]);

    // Live state triggers matching the structure of Dashboard.tsx
    if (isCheckIn) {
      setAttendanceCheckInLog((prev: any) => {
        const todayLog = prev[todayStr] ? { ...prev[todayStr] } : {};
        todayLog[selectedScanPerson.id] = statusText;
        return { ...prev, [todayStr]: todayLog };
      });
      let statusLabelForToast = "";
      if (statusText === "LATE") {
        statusLabelForToast = lang === "kh" ? "យឺតយ៉ាវ" : lang === "zh" ? "迟到" : "Late";
      } else {
        statusLabelForToast = lang === "kh" ? "គោរពវិន័យ" : lang === "zh" ? "正常" : "On Time";
      }
      showToast(
        lang === "kh" 
          ? `ស្កេនចូលជោគជ័យ៖ ${selectedScanPerson.name} (${statusLabelForToast})` 
          : lang === "zh" 
            ? `签到成功：${selectedScanPerson.name} (${statusLabelForToast})` 
            : `Check-in successful: ${selectedScanPerson.name} (${statusLabelForToast})`, 
        statusText === "LATE" ? "info" : "success"
      );
    } else {
      setAttendanceCheckOutLog((prev: any) => {
        const todayLog = prev[todayStr] ? { ...prev[todayStr] } : {};
        todayLog[selectedScanPerson.id] = statusText;
        return { ...prev, [todayStr]: todayLog };
      });
      let outStatusLabelForToast = "";
      if (statusText === "EARLY_LEAVE") {
        outStatusLabelForToast = lang === "kh" ? "ចេញមុន" : lang === "zh" ? "早退" : "Early Out";
      } else {
        outStatusLabelForToast = lang === "kh" ? "ជោគជ័យ" : lang === "zh" ? "成功" : "Success";
      }
      showToast(
        lang === "kh" 
          ? `ស្កេនចេញជោគជ័យ៖ ${selectedScanPerson.name} (${outStatusLabelForToast})` 
          : lang === "zh" 
            ? `签退成功：${selectedScanPerson.name} (${outStatusLabelForToast})` 
            : `Check-out successful: ${selectedScanPerson.name} (${outStatusLabelForToast})`, 
        statusText === "EARLY_LEAVE" ? "info" : "success"
      );
    }
  };

  // Camera mock activation
  const toggleCameraScanner = () => {
    if (!isScanning) {
      setIsScanning(true);
      showToast(
        lang === "kh" 
          ? "កំពុងចាប់ផ្តើមបើកកាមេរ៉ាស្កេនកូដ..." 
          : lang === "zh" 
            ? "正在初始化并启动扫码摄像头..." 
            : "Initializing and activating camera scanner...", 
        "info"
      );
      // Autocomplete scan after 4 seconds as a fun live feature!
      setTimeout(() => {
        setIsScanning(false);
      }, 5000);
    } else {
      setIsScanning(false);
    }
  };


  return (
    <div id="qr-scanner-tab" className="space-y-4">

      {/* Upper Control Bar with toggle to hide the entire Session Feed list and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-3xs">
            <Settings2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="text-xs md:text-sm font-black text-slate-800 tracking-wide uppercase">
              {lang === "kh" ? "ផ្ទាំងបញ្ជានិងស្កេនកូដ" : lang === "zh" ? "扫码控制中心" : "SCAN CONTROL CENTER"}
            </h2>
            <p className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">
              {lang === "kh" ? "គ្រប់គ្រង និងស្កេនវត្តមានដោយស្វ័យប្រវត្តិ" : lang === "zh" ? "管理和自动扫描签到" : "Manage and Scan Attendance Automatically"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Rules Config Modal Trigger Button */}
          <button
            onClick={() => setIsRulesModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-xl text-[11px] font-black tracking-wide transition-all shadow-3xs hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            {lang === "kh" ? "កំណត់លក្ខខណ្ឌ ស្កេនចូល-ស្កេនចេញ" : lang === "zh" ? "设置签到/签退时间判定标准" : "Scan Thresholds Rules"}
          </button>

          <button
            onClick={() => setIsSessionFeedHidden(!isSessionFeedHidden)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all border shadow-3xs hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer ${
              isSessionFeedHidden
                ? "bg-primary-600 text-white border-primary-600 hover:bg-primary-750"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {isSessionFeedHidden ? (
              <>
                <LayoutGrid className="w-4 h-4" />
                {lang === "kh" ? "បង្ហាញប្រវត្តិស្កេនសរុប (Show Session Feed)" : lang === "zh" ? "显示今日扫码记录 (Show Session Feed)" : "Show Session Feed (Show Session Feed)"}
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                {lang === "kh" ? "លាក់ប្រវត្តិស្កេនទាំងអស់ (Hide Session Feed)" : lang === "zh" ? "隐藏今日扫码记录 (Hide Session Feed)" : "Hide Session Feed (Hide Session Feed)"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Bottom Section Grid - Moves simulated scan console to align with stats row on the top right */}
      <div className={`grid grid-cols-1 ${isSessionFeedHidden ? "xl:grid-cols-1" : "xl:grid-cols-4"} gap-6 items-start mt-4`}>
        {/* Left: Stats, Toolbar, and Session feed list */}
        {!isSessionFeedHidden && (
          <div className="xl:col-span-3 space-y-4">
          {/* 5 Stats Cards Row - Beautifully redesigned with premium cards, soft glow hover effects and vibrant layouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Total Scans */}
        <div id="stat-card-total" className="bg-white border border-slate-200/90 rounded-[20px] p-4 flex items-center gap-3.5 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 hover:border-blue-300/60 transition-all duration-200 group">
          {/* Subtle floating colored background blob for premium depth */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-blue-50/40 blur-md group-hover:bg-blue-50/60 transition-colors" />
          {/* Top colored accent line pill */}
          <div className="absolute top-3 left-0 w-1 h-8 bg-blue-500 rounded-r-full" />
          
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100/70 flex items-center justify-center shrink-0 text-blue-600 shadow-3xs group-hover:scale-105 transition-transform">
            <Smartphone className="w-5.5 h-5.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[8px] text-slate-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
              {lang === "kh" ? "ស្កេនសរុប • TOTAL" : lang === "zh" ? "扫码总计 • TOTAL" : "TOTAL SCANS • TOTAL"}
            </div>
            <div className="text-xl font-black text-slate-800 mt-0.5 tracking-wide flex items-baseline gap-1">
              <span>{lang === "kh" ? toKhmerNumeral(totalScans) : totalScans}</span>
              <span className="text-[10px] font-bold text-slate-400">{lang === "kh" ? "ដង" : lang === "zh" ? "次" : "times"}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Check-In */}
        <div id="stat-card-checkin" className="bg-white border border-slate-200/90 rounded-[20px] p-4 flex items-center gap-3.5 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5 hover:border-emerald-300/60 transition-all duration-200 group">
          {/* Subtle floating colored background blob */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-emerald-50/40 blur-md group-hover:bg-emerald-50/60 transition-colors" />
          {/* Top colored accent line pill */}
          <div className="absolute top-3 left-0 w-1 h-8 bg-emerald-500 rounded-r-full" />
          
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100/70 flex items-center justify-center shrink-0 text-emerald-600 shadow-3xs group-hover:scale-105 transition-transform">
            <div className="w-7 h-7 rounded-full bg-emerald-100/80 flex items-center justify-center">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[8px] text-slate-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              {lang === "kh" ? "ស្កេនចូល • CHECK-IN" : lang === "zh" ? "签到数 • CHECK-IN" : "CHECK-IN • CHECK-IN"}
            </div>
            <div className="text-xl font-black text-slate-800 mt-0.5 tracking-wide flex items-baseline gap-1">
              <span>{lang === "kh" ? toKhmerNumeral(checkInCount) : checkInCount}</span>
              <span className="text-[10px] font-bold text-slate-400">{lang === "kh" ? "នាក់" : lang === "zh" ? "人" : "pax"}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Check-Out */}
        <div id="stat-card-checkout" className="bg-white border border-slate-200/90 rounded-[20px] p-4 flex items-center gap-3.5 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-sky-500/5 hover:-translate-y-0.5 hover:border-sky-300/60 transition-all duration-200 group">
          {/* Subtle floating colored background blob */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-sky-50/40 blur-md group-hover:bg-sky-50/60 transition-colors" />
          {/* Top colored accent line pill */}
          <div className="absolute top-3 left-0 w-1 h-8 bg-sky-400 rounded-r-full" />
          
          <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100/70 flex items-center justify-center shrink-0 text-sky-600 shadow-3xs group-hover:scale-105 transition-transform">
            <div className="w-7 h-7 rounded-full bg-sky-100/80 flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[8px] text-slate-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-sky-400 animate-pulse" />
              {lang === "kh" ? "ស្កេនចេញ • CHECK-OUT" : lang === "zh" ? "签退数 • CHECK-OUT" : "CHECK-OUT • CHECK-OUT"}
            </div>
            <div className="text-xl font-black text-slate-800 mt-0.5 tracking-wide flex items-baseline gap-1">
              <span>{lang === "kh" ? toKhmerNumeral(checkOutCount) : checkOutCount}</span>
              <span className="text-[10px] font-bold text-slate-400">{lang === "kh" ? "នាក់" : lang === "zh" ? "人" : "pax"}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Students */}
        <div id="stat-card-students" className="bg-white border border-slate-200/90 rounded-[20px] p-4 flex items-center gap-3.5 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 hover:border-blue-300/60 transition-all duration-200 group">
          {/* Subtle floating colored background blob */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-blue-50/40 blur-md group-hover:bg-blue-50/60 transition-colors" />
          {/* Top colored accent line pill */}
          <div className="absolute top-3 left-0 w-1 h-8 bg-blue-500 rounded-r-full" />
          
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100/70 flex items-center justify-center shrink-0 text-blue-600 shadow-3xs group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[8px] text-slate-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
              {lang === "kh" ? "សិស្សវត្តមាន • STUDENTS" : lang === "zh" ? "在校学生 • STUDENTS" : "PRESENT STUDENTS • STUDENTS"}
            </div>
            <div className="text-xl font-black text-slate-800 mt-0.5 tracking-wide flex items-baseline gap-1">
              <span>{lang === "kh" ? toKhmerNumeral(uniqueStudents) : uniqueStudents}</span>
              <span className="text-[10px] font-bold text-slate-400">{lang === "kh" ? "នាក់" : lang === "zh" ? "人" : "pax"}</span>
            </div>
          </div>
        </div>

        {/* Card 5: Teachers */}
        <div id="stat-card-teachers" className="bg-white border border-slate-200/90 rounded-[20px] p-4 flex items-center gap-3.5 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-amber-500/5 hover:-translate-y-0.5 hover:border-amber-300/60 transition-all duration-200 group">
          {/* Subtle floating colored background blob */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-amber-50/40 blur-md group-hover:bg-amber-50/60 transition-colors" />
          {/* Top colored accent line pill */}
          <div className="absolute top-3 left-0 w-1 h-8 bg-amber-500 rounded-r-full" />
          
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100/70 flex items-center justify-center shrink-0 text-amber-600 shadow-3xs group-hover:scale-105 transition-transform">
            <User className="w-5.5 h-5.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[8px] text-slate-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              {lang === "kh" ? "គ្រូវត្តមាន • TEACHERS" : lang === "zh" ? "在岗教师 • TEACHERS" : "PRESENT TEACHERS • TEACHERS"}
            </div>
            <div className="text-xl font-black text-slate-800 mt-0.5 tracking-wide flex items-baseline gap-1">
              <span>{lang === "kh" ? toKhmerNumeral(uniqueTeachers) : uniqueTeachers}</span>
              <span className="text-[10px] font-bold text-slate-400">{lang === "kh" ? "នាក់" : lang === "zh" ? "人" : "pax"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar Row - Compact single-row layout */}
      <div className="bg-white border border-slate-200/80 rounded-2xl py-2 px-3 flex items-center justify-between gap-3 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-5 bg-primary-600 rounded-full"></div>
          <span className="text-[11px] md:text-xs lg:text-sm font-black text-slate-700 tracking-wide">
            {lang === "kh" ? "ប្រវត្តិស្កេនក្នុងវេននេះ • SESSION FEED" : lang === "zh" ? "今日扫码记录 • SESSION FEED" : "TODAY'S SESSION FEED • SESSION FEED"}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Calendar Date Navigation Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200/50 shrink-0 select-none">
            {/* Previous Day Button */}
            <button
              type="button"
              onClick={handlePrevDay}
              title={lang === "kh" ? "ថ្ងៃមុន" : lang === "zh" ? "前一天" : "Previous Day"}
              className="w-7 h-7 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-primary-600 border border-slate-200/40 shadow-3xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Calendar Date Indicator / Picker */}
            <div 
              onClick={handleDateClick}
              className="relative flex items-center gap-1.5 px-3 py-1 bg-primary-50/70 border border-primary-100/50 rounded-full text-[10px] md:text-xs font-black text-primary-700 shrink-0 select-none cursor-pointer hover:bg-primary-100/40 active:scale-95 transition-all shadow-3xs"
            >
              <Calendar className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>
                {(() => {
                  const parts = selectedDate.split("-").map(Number);
                  const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
                  return getKhmerDateString(localDate, lang);
                })()}
              </span>
              <input 
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 pointer-events-auto"
                style={{ 
                  minHeight: "unset", 
                  appearance: "auto", 
                  WebkitAppearance: "auto" 
                }}
              />
            </div>

            {/* Next Day Button */}
            <button
              type="button"
              onClick={handleNextDay}
              title={lang === "kh" ? "ថ្ងៃបន្ទាប់" : lang === "zh" ? "后一天" : "Next Day"}
              className="w-7 h-7 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-primary-600 border border-slate-200/40 shadow-3xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[120px] md:min-w-[180px] lg:min-w-[210px] max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder={lang === "kh" ? "ស្វែងរក..." : lang === "zh" ? "搜索..." : "Search..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-3 py-1.5 text-[10px] md:text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/50 shrink-0">
            <button 
              onClick={() => setFilterType("all")} 
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] lg:text-[11px] font-black transition-all ${filterType === "all" ? "bg-white text-primary-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              {lang === "kh" ? "ទាំងអស់" : lang === "zh" ? "全部" : "All"}
            </button>
            <button 
              onClick={() => setFilterType("student")} 
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] lg:text-[11px] font-black transition-all ${filterType === "student" ? "bg-white text-primary-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              {lang === "kh" ? "សិស្ស" : lang === "zh" ? "学生" : "Students"}
            </button>
            <button 
              onClick={() => setFilterType("teacher")} 
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] lg:text-[11px] font-black transition-all ${filterType === "teacher" ? "bg-white text-primary-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              {lang === "kh" ? "គ្រូ" : lang === "zh" ? "教师" : "Teachers"}
            </button>
            <button 
              onClick={() => setFilterType("check-in")} 
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] lg:text-[11px] font-black transition-all ${filterType === "check-in" ? "bg-white text-primary-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              {lang === "kh" ? "ស្កេនចូល" : lang === "zh" ? "签到" : "Check-In"}
            </button>
            <button 
              onClick={() => setFilterType("check-out")} 
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] lg:text-[11px] font-black transition-all ${filterType === "check-out" ? "bg-white text-primary-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              {lang === "kh" ? "ស្កេនចេញ" : lang === "zh" ? "签退" : "Check-Out"}
            </button>
          </div>

          {/* Grid/List toggles */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 shrink-0">
            <button 
              onClick={() => setLayoutMode("grid")}
              className={`p-1.5 rounded transition-all ${layoutMode === "grid" ? "bg-white text-primary-600 shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setLayoutMode("list")}
              className={`p-1.5 rounded transition-all ${layoutMode === "list" ? "bg-white text-primary-600 shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Scroll Controls */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 shrink-0">
            <button 
              onClick={() => scrollSessionFeed("up")}
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-white transition-all cursor-pointer flex items-center justify-center"
              title={lang === "kh" ? "ស្រ្កូលឡើងលើ" : lang === "zh" ? "向上滚动" : "Scroll Up"}
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => scrollSessionFeed("down")}
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-white transition-all cursor-pointer flex items-center justify-center"
              title={lang === "kh" ? "ស្រ្កូលចុះក្រោម" : lang === "zh" ? "向下滚动" : "Scroll Down"}
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>


        </div>
      </div>

      {/* Session feed list of scanned cards */}
      <div 
        ref={sessionFeedContainerRef}
        className="max-h-[620px] overflow-y-auto pr-1 scroll-smooth space-y-4"
      >
          {filteredLogs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-350 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-black text-slate-700">
                {lang === "kh" ? "រកមិនឃើញទិន្នន័យស្កេនទេ" : lang === "zh" ? "未找到任何扫码记录" : "No scan records found"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-medium">
                {lang === "kh" ? "មិនមានកំណត់ត្រាណាដែលត្រូវនឹងការស្វែងរក ឬការចម្រោះរបស់អ្នកនៅក្នុងវេននេះទេ។" : lang === "zh" ? "没有找到符合您当前搜索和筛选条件的考勤记录。" : "There are no records matching your search or filters in this session."}
              </p>
            </div>
          ) : layoutMode === "grid" ? (
            <div className="flex flex-wrap items-stretch justify-start gap-4">
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log, index) => {
                  const isTeacher = log.itemType === "teacher";
                  const hasCheckIn = !!log.checkIn;
                  const hasCheckOut = !!log.checkOut;

                  // Check scan times for specific counter
                  const totalPreviousScans = telegramLogs.filter(l => l.studentId === log.studentId).length;

                  // Lookup the actual student or teacher details to capture shift and study hours
                  const person = isTeacher
                    ? teachers.find(t => t.id === log.dbId || t.teacherId === log.studentId)
                    : students.find(s => s.id === log.dbId || s.studentId === log.studentId);
                  
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
                      className="w-full sm:w-[calc(270px-0.8cm)] shrink-0 bg-white border border-slate-200/90 rounded-[22px] relative overflow-hidden flex flex-col pt-3.5 px-3.5 pb-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Top thin accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-emerald-500`} />

                      {/* Top Header Row of the Card with separate capsules */}
                      <div className="flex flex-wrap items-center gap-1">
                        {/* 1. Counter Badge */}
                        <span className="bg-amber-50 border border-amber-200/80 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide flex items-center gap-1 shadow-3xs shrink-0">
                          <span>⭐</span>
                          <span>{lang === "kh" ? `លើកទី ${toKhmerNumeral(totalPreviousScans)}` : lang === "zh" ? `第 ${totalPreviousScans} 次` : `Scan #${totalPreviousScans}`}</span>
                        </span>
                        
                        {/* 2. Unified Status Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border tracking-wide flex items-center gap-1 shrink-0 ${
                          hasCheckIn && hasCheckOut 
                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                            : hasCheckIn 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-sky-50 text-sky-700 border-sky-200"
                        }`}>
                          <span className={hasCheckIn && hasCheckOut ? "text-blue-500" : hasCheckIn ? "text-emerald-500" : "text-sky-400"}>●</span>
                          <span>
                            {hasCheckIn && hasCheckOut 
                              ? (lang === "kh" ? "ស្កេនរួចរាល់" : lang === "zh" ? "全部完成" : "Scan Completed") 
                              : hasCheckIn 
                                ? (lang === "kh" ? "កំពុងរៀន" : lang === "zh" ? "学习/工作" : "Active In") 
                                : (lang === "kh" ? "ស្កេនចេញ" : lang === "zh" ? "签退离场" : "Checked Out")}
                          </span>
                        </span>
                      </div>

                      {/* Rounded Box Enclosing Avatar & Names exactly like image */}
                      <div className={`border border-slate-200/40 border-l-[5px] ${isTeacher ? "border-l-emerald-500 bg-emerald-50/10" : "border-l-sky-500 bg-sky-50/10"} rounded-[16px] p-2.5 flex items-center gap-2.5 mt-2.5`}>
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl text-white font-black text-sm flex items-center justify-center shrink-0 uppercase shadow-3xs ${isTeacher ? "bg-emerald-500" : "bg-sky-500"}`}>
                          {(log.name || '').charAt(0)}
                        </div>

                        {/* Name Block */}
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-black text-slate-800 tracking-wide truncate">{log.name}</div>
                          <div className="text-[10px] font-extrabold text-slate-400 font-sans tracking-wide truncate uppercase">
                            ({log.nameEn || (lang === "kh" ? "គ្មានឈ្មោះឡាតាំង" : lang === "zh" ? "无英文名" : "NO LATIN NAME")})
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1.5 items-center">
                            <span className="bg-white text-slate-500 border border-slate-200 font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-3xs shrink-0">
                              {displayId}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border flex items-center gap-1 shrink-0 ${
                              isTeacher 
                                ? "bg-amber-50 text-amber-700 border-amber-200" 
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}>
                              <span className={isTeacher ? "text-amber-500" : "text-blue-500"}>●</span>
                              <span>{isTeacher ? (lang === "kh" ? "គ្រូ" : lang === "zh" ? "教师" : "Teacher") : (lang === "kh" ? "សិស្ស" : lang === "zh" ? "学生" : "Student")}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Check-In & Check-Out Dual Panels Row */}
                      <div className="grid grid-cols-2 gap-2 mt-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                        {/* Check-In Panel */}
                        {log.checkIn ? (
                          <div className="bg-emerald-50/60 rounded-xl py-1 px-2 flex flex-col justify-between shadow-3xs min-h-[46px]">
                            <div className="flex items-center justify-between gap-1 text-[8.5px] font-black text-emerald-700 uppercase tracking-wider">
                              <span className="flex items-center gap-1">
                                <ArrowDown className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{lang === "kh" ? "ស្កេនចូល" : lang === "zh" ? "签到" : "In"}</span>
                              </span>
                              {log.checkIn.status === "LATE" ? (
                                <span className="text-[7.5px] bg-red-100/80 text-red-700 border border-red-200 px-1 rounded font-black tracking-normal">{lang === "kh" ? "យឺត" : lang === "zh" ? "迟到" : "Late"}</span>
                              ) : null}
                            </div>
                            <div className="text-[11px] font-black text-slate-800 mt-0.5 font-mono">
                              {log.checkIn.time}
                            </div>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 rounded-xl py-1 px-2 flex flex-col justify-center items-center text-center bg-white/50 text-slate-350 min-h-[46px]">
                            <ArrowDown className="w-3 h-3 text-slate-300 animate-bounce mb-0.5" />
                            <span className="text-[8px] font-black uppercase tracking-wider">{lang === "kh" ? "មិនទាន់ចូល" : lang === "zh" ? "未签到" : "No In"}</span>
                          </div>
                        )}

                        {/* Check-Out Panel */}
                        {log.checkOut ? (
                          <div className="bg-blue-50/60 rounded-xl py-1 px-2 flex flex-col justify-between shadow-3xs min-h-[46px]">
                            <div className="flex items-center justify-between gap-1 text-[8.5px] font-black text-blue-700 uppercase tracking-wider">
                              <span className="flex items-center gap-1">
                                <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
                                <span>{lang === "kh" ? "ស្កេនចេញ" : lang === "zh" ? "签退" : "Out"}</span>
                              </span>
                              {log.checkOut.status === "EARLY_LEAVE" ? (
                                <span className="text-[7.5px] bg-amber-100/80 text-amber-700 border border-amber-200 px-1 rounded font-black tracking-normal">{lang === "kh" ? "ចេញមុន" : lang === "zh" ? "早退" : "Early"}</span>
                              ) : null}
                            </div>
                            <div className="text-[11px] font-black text-slate-800 mt-0.5 font-mono">
                              {log.checkOut.time}
                            </div>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 rounded-xl py-1 px-2 flex flex-col justify-center items-center text-center bg-white/50 text-slate-350 min-h-[46px]">
                            <ArrowUp className="w-3 h-3 text-slate-300 mb-0.5" />
                            <span className="text-[8px] font-black uppercase tracking-wider">{lang === "kh" ? "មិនទាន់ចេញ" : lang === "zh" ? "未签退" : "No Out"}</span>
                          </div>
                        )}
                      </div>

                      {/* Course / Shift / Hour Metadata list */}
                      <div className="mt-3 space-y-1.5 border-b border-dashed border-slate-200 pb-2.5">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-slate-350" />
                            {lang === "kh" ? "វគ្គសិក្សា (Course)" : lang === "zh" ? "课程/专业 (Course)" : "Enrolled Course (Course)"}
                          </span>
                          <span className="text-slate-700 font-black text-right max-w-[130px] truncate" title={log.course}>
                            {log.course}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-350" />
                            {lang === "kh" ? "វេនសិក្សា (Shift)" : lang === "zh" ? "考勤班次 (Shift)" : "Duty Shift (Shift)"}
                          </span>
                          <span className="text-slate-700 font-black">{formatShift(shiftInfo.shift)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Hourglass className="w-3 h-3 text-slate-350" />
                            {lang === "kh" ? "ម៉ោងសិក្សា" : lang === "zh" ? "班次时间 (Hours)" : "Shift Hours (Hours)"}
                          </span>
                          <span className="text-slate-700 font-black">
                            {formatHours(person ? getEffectiveHours(person.id, shiftInfo.hours) : shiftInfo.hours)}
                          </span>
                        </div>
                      </div>

                      {/* Log history section */}
                      <div className="mt-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-primary-400" />
                              {lang === "kh" ? "ប្រវត្តិស្កេនកន្លងមក (Logs)" : lang === "zh" ? "历史刷卡日志 (Logs)" : "Recent History (Logs)"}
                            </span>
                            <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full text-[9px] font-black shadow-3xs">
                              {lang === "kh" ? `សរុប ${toKhmerNumeral(totalPreviousScans)} ដង` : lang === "zh" ? `总计 ${totalPreviousScans} 次` : `Total: ${totalPreviousScans} scans`}
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-[10px] font-bold text-slate-500">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 text-[9px]">
                                  <th className="pb-1 text-left font-extrabold">{lang === "kh" ? "ថ្ងៃខែ" : lang === "zh" ? "日期" : "Date"}</th>
                                  <th className="pb-1 text-left font-extrabold">{lang === "kh" ? "ម៉ោង" : lang === "zh" ? "时间" : "Time"}</th>
                                  <th className="pb-1 text-center font-extrabold">{lang === "kh" ? "ប្រភេទ" : lang === "zh" ? "状态" : "Type"}</th>
                                  <th className="pb-1 text-right font-extrabold">{lang === "kh" ? "លទ្ធផល" : lang === "zh" ? "结果" : "Result"}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {telegramLogs
                                  .filter(l => l.studentId === log.studentId)
                                  .slice(0, 2)
                                  .map((prevLog, pIdx) => {
                                    const isPrevCheckIn = prevLog.type === "check-in";
                                    
                                    // Determine result label and text color dynamically
                                    let statusLabel = isPrevCheckIn 
                                      ? (lang === "kh" ? "គោរពវិន័យ" : lang === "zh" ? "正常" : "On Time") 
                                      : (lang === "kh" ? "ជោគជ័យ" : lang === "zh" ? "成功" : "Success");
                                    let statusColorClass = isPrevCheckIn ? "text-emerald-600" : "text-blue-600";
                                    
                                    if (prevLog.status === "LATE") {
                                      statusLabel = lang === "kh" ? "យឺតយ៉ាវ" : lang === "zh" ? "迟到" : "Late";
                                      statusColorClass = "text-rose-500";
                                    } else if (prevLog.status === "EARLY_LEAVE") {
                                      statusLabel = lang === "kh" ? "ចេញមុន" : lang === "zh" ? "早退" : "Early";
                                      statusColorClass = "text-amber-500";
                                    } else if (prevLog.status === "PRESENT") {
                                      statusLabel = lang === "kh" ? "គោរពវិន័យ" : lang === "zh" ? "正常" : "On Time";
                                      statusColorClass = "text-emerald-600";
                                    } else if (prevLog.status === "DEPARTED") {
                                      statusLabel = lang === "kh" ? "ជោគជ័យ" : lang === "zh" ? "成功" : "Success";
                                      statusColorClass = "text-blue-600";
                                    } else if (prevLog.statusKh) {
                                      statusLabel = prevLog.statusKh.split(" ")[0];
                                    }

                                    return (
                                      <tr key={pIdx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                        <td className="py-1 font-mono text-left text-slate-400">{formatMMDD(prevLog.date)}</td>
                                        <td className="py-1 font-mono text-left text-slate-600">{prevLog.time.split(" ")[0]} {prevLog.time.split(" ")[1]}</td>
                                        <td className="py-1 text-center">
                                          <span className={`text-[9px] font-black bg-transparent ${
                                            isPrevCheckIn 
                                              ? "text-emerald-600" 
                                              : "text-blue-600"
                                          }`}>
                                            {isPrevCheckIn ? (lang === "kh" ? "ចូល" : lang === "zh" ? "签到" : "In") : (lang === "kh" ? "ចេញ" : lang === "zh" ? "签退" : "Out")}
                                          </span>
                                        </td>
                                        <td className="py-1 text-right">
                                          <span className={`text-[9px] font-black bg-transparent ${statusColorClass}`}>
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
          ) : (
            /* List View */
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs overflow-x-auto">
              <table className="w-full min-w-[900px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">{lang === "kh" ? "បុគ្គលស្កេន" : lang === "zh" ? "人员姓名 (Name)" : "Personnel Name"}</th>
                    <th className="py-3 px-4">{lang === "kh" ? "លេខសម្គាល់ ID" : lang === "zh" ? "学号/工号 ID" : "ID Identifier"}</th>
                    <th className="py-3 px-4">{lang === "kh" ? "ប្រភេទ" : lang === "zh" ? "身份类型" : "Identity Type"}</th>
                    <th className="py-3 px-4">{lang === "kh" ? "វគ្គសិក្សា" : lang === "zh" ? "课程/班级" : "Course/Specialty"}</th>
                    <th className="py-3 px-4 text-center">{lang === "kh" ? "ម៉ោងចូល" : lang === "zh" ? "签到时间" : "Check-In"}</th>
                    <th className="py-3 px-4 text-center">{lang === "kh" ? "ម៉ោងចេញ" : lang === "zh" ? "签退时间" : "Check-Out"}</th>
                    <th className="py-3 px-4 text-right">{lang === "kh" ? "ស្ថានភាព" : lang === "zh" ? "状态" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-600">
                  {filteredLogs.map((log, idx) => {
                    return (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-black text-slate-800">{log.name}</span>
                            <span className="text-[10px] text-slate-400 ml-1.5 font-sans uppercase font-medium">({log.nameEn})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{log.studentId}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase ${
                            log.itemType === "teacher" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-150" 
                              : "bg-sky-50 text-sky-700 border-sky-150"
                          }`}>
                            {log.itemType === "teacher" ? (lang === "kh" ? "គ្រូ" : lang === "zh" ? "教师" : "Teacher") : (lang === "kh" ? "សិស្ស" : lang === "zh" ? "学生" : "Student")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{log.course}</td>
                        <td className="py-3 px-4 text-center">
                          {log.checkIn ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                              {log.checkIn.time}
                            </span>
                          ) : (
                            <span className="text-slate-350 font-medium">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {log.checkOut ? (
                            <span className="bg-blue-50 text-blue-700 border border-blue-150 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                              {log.checkOut.time}
                            </span>
                          ) : (
                            <span className="text-slate-350 font-medium">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                            log.checkIn && log.checkOut
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-150"
                          }`}>
                            {log.checkIn && log.checkOut 
                              ? (lang === "kh" ? "ស្កេនរួចរាល់" : lang === "zh" ? "全部完成" : "Scan Completed") 
                              : (lang === "kh" ? "កំពុងរៀន" : lang === "zh" ? "正在学习" : "Active In")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
        )}

        {/* Right Columns: Sidebar Controls */}
        <div className={isSessionFeedHidden ? "w-full max-w-none grid grid-cols-1 lg:grid-cols-[1.7fr_2.3fr] xl:grid-cols-[1.7fr_2.3fr] gap-6 items-stretch lg:min-h-[580px] xl:min-h-[660px] 2xl:min-h-[760px] mt-2" : "space-y-6 xl:col-span-1"}>
          {/* Component 1: Simulated Scan Console (ON TOP exactly like image) */}
          <div id="quick-scanner-simulator" className="bg-white border border-slate-200/90 rounded-[28px] p-5 shadow-sm relative overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {lang === "kh" ? "ប្រអប់ស្កេនរហ័ស" : lang === "zh" ? "模拟刷卡控制台" : "Quick Scan Simulator"}
                </h3>
                <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">SIMULATED SCAN CONSOLE</p>
              </div>
            </div>

            {/* Inputs & Controls */}
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Role Quick Filter Tabs inside Console */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>{lang === "kh" ? "ស្វែងរកតាមប្រភេទបុគ្គលិក (Filter by Role)" : lang === "zh" ? "按人员类别筛选 (Filter by Role)" : "Filter by Role (Filter by Role)"}</span>
                  <span className="text-[9px] text-primary-500 bg-primary-50 border border-primary-150 px-1.5 py-0.2 rounded font-black uppercase">
                    {lang === "kh" ? "តម្រងរហ័ស" : lang === "zh" ? "快速过滤" : "Quick Filter"}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 border border-slate-200/50 rounded-xl">
                  {(["all", "student", "teacher"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setConsoleRoleFilter(role)}
                      className={`py-1.5 rounded-lg text-[9.5px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        consoleRoleFilter === role
                          ? "bg-white text-primary-600 shadow-2xs border border-slate-100"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/30"
                      }`}
                    >
                      {role === "all" ? (
                        <span>{lang === "kh" ? "ទាំងអស់" : lang === "zh" ? "全部" : "All"}</span>
                      ) : role === "student" ? (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                          {lang === "kh" ? "សិស្ស" : lang === "zh" ? "学生" : "Student"}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-amber-500" />
                          {lang === "kh" ? "គ្រូបង្រៀន" : lang === "zh" ? "教师" : "Teacher"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personnel Dropdown */}
              <div className="relative">
                <label className="block text-[11px] font-extrabold text-slate-600 mb-1.5">
                  {lang === "kh" ? "ជ្រើសរើសបុគ្គលស្កេន (Dropdown Selector)" : lang === "zh" ? "选择刷卡人员 (Dropdown Selector)" : "Select Scan Person (Dropdown Selector)"} <span className="text-red-500">*</span>
                </label>
                
                {/* Custom Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsConsoleDropdownOpen(!isConsoleDropdownOpen)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="truncate">
                    {selectedScanPerson ? (
                      `${selectedScanPerson.name} (${selectedScanPerson.nameEn}) — ${selectedScanPerson.details}`
                    ) : (
                      lang === "kh" ? "ជ្រើសរើសសមាជិក..." : lang === "zh" ? "选择成员..." : "Select member..."
                    )}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isConsoleDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Popover Menu */}
                {isConsoleDropdownOpen && (
                  <>
                    {/* Click-outside Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => {
                        setIsConsoleDropdownOpen(false);
                        setConsoleDropdownSearch("");
                      }}
                    />
                    
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-lg z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {/* Search Bar inside Dropdown */}
                      <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder={lang === "kh" ? "ស្វែងរកតាមឈ្មោះ ឬ ID..." : lang === "zh" ? "输入姓名或ID搜索..." : "Search by name or ID..."}
                          value={consoleDropdownSearch}
                          onChange={(e) => setConsoleDropdownSearch(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none font-sans"
                        />
                        {consoleDropdownSearch && (
                          <button
                            type="button"
                            onClick={() => setConsoleDropdownSearch("")}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      {/* Scrollable Options List */}
                      <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 scrollbar-none">
                        {finalFilteredOptions.length > 0 ? (
                          finalFilteredOptions.map((opt) => {
                            const isSelected = opt.id === selectedScanStudentId;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setSelectedScanStudentId(opt.id);
                                  setIsConsoleDropdownOpen(false);
                                  setConsoleDropdownSearch("");
                                }}
                                className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected 
                                    ? "bg-primary-50 text-primary-700 font-extrabold" 
                                    : "text-slate-600 hover:bg-slate-50 font-medium"
                                }`}
                              >
                                <div className="flex flex-col gap-0.5 truncate">
                                  <span className={isSelected ? "font-black" : "font-extrabold"}>
                                    {opt.name} ({opt.nameEn})
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {opt.displayId || opt.id} • {opt.details}
                                  </span>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-primary-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-6 text-center text-xs font-bold text-slate-400">
                            {lang === "kh" ? "រកមិនឃើញលទ្ធផល!" : lang === "zh" ? "未找到任何匹配项!" : "No results found!"}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>


              {/* Beep Alert Type selection */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 mb-1.5">
                  {lang === "kh" ? "សំឡេងបញ្ជាក់ការស្កេន (Scanner Alert Feedbacks)" : lang === "zh" ? "刷卡反馈提示音 (Scanner Alert Feedbacks)" : "Scanner Alert Sounds (Scanner Alert Feedbacks)"}
                </label>
                <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/55">
                  {(["classic", "cyber", "triad", "mute"] as const).map((snd) => (
                    <button
                      key={snd}
                      type="button"
                      onClick={() => {
                        setSoundFeedback(snd);
                        playBeep(snd);
                      }}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                        soundFeedback === snd
                          ? "bg-primary-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {snd === "classic" 
                        ? (lang === "kh" ? "បុរាណ" : lang === "zh" ? "经典" : "Classic") 
                        : snd === "cyber" 
                          ? (lang === "kh" ? "ព័ត៌មានវិទ្យា" : lang === "zh" ? "科技" : "Cyber") 
                          : snd === "triad" 
                            ? (lang === "kh" ? "លឿន" : lang === "zh" ? "和弦" : "Triad") 
                            : (lang === "kh" ? "ស្ងាត់" : lang === "zh" ? "静音" : "Mute")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Card Preview inside Console Panel */}
              {selectedScanPerson && (
                <div className="border border-slate-100 rounded-2xl p-3 bg-slate-50 flex items-center justify-between shadow-2xs relative overflow-hidden">
                  <div className="absolute right-[-10px] bottom-[-15px] text-slate-200/20 pointer-events-none">
                    <Smartphone className="w-16 h-16 transform rotate-12" />
                  </div>

                  <div className="flex items-center gap-2.5 z-10">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center">
                      {(selectedScanPerson.name || '').charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        {selectedScanPerson.name}
                        <span className="bg-orange-100 text-orange-700 text-[8.5px] font-black px-1.5 py-0.2 rounded border border-orange-200">
                          {selectedScanPerson.type === "teacher" ? (lang === "kh" ? "គ្រូ" : lang === "zh" ? "教师" : "Teacher") : (lang === "kh" ? "សិស្ស" : lang === "zh" ? "学生" : "Student")}
                        </span>
                      </div>
                      <div className="text-[9px] font-extrabold text-slate-400 font-mono mt-0.5">
                        {selectedScanPerson.displayId || selectedScanPerson.id} • <span className="text-[8px] text-slate-350">{selectedScanPerson.details}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 z-10 shrink-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[8.5px] font-black text-emerald-600 tracking-wider">
                      {lang === "kh" ? "រួចរាល់" : lang === "zh" ? "就绪" : "READY"}
                    </span>
                  </div>
                </div>
              )}

              {/* Trigger button */}
              <button
                type="button"
                onClick={handleSimulatedScan}
                className="w-full mt-auto bg-primary-600 hover:bg-primary-750 text-white py-3 rounded-2xl text-[12px] font-black tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                {lang === "kh" ? "បញ្ជូនការស្កេនភ្លាមៗ (Trigger Beep Scan)" : lang === "zh" ? "立即发送刷卡信号 (Trigger Beep Scan)" : "Trigger Beep Scan (Trigger Beep Scan)"}
              </button>
            </div>
          </div>

          {/* Component 2: Live Camera Scanner (ON BOTTOM exactly like image) */}
          <div id="live-camera-feed-card" className="bg-white border border-slate-200/90 rounded-[28px] p-5 shadow-sm flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {lang === "kh" ? "កាមេរ៉ាស្កេនកូដ" : lang === "zh" ? "相机扫码器" : "Camera QR Scanner"}
                </h3>
                <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">AUTO CAMERA CAPTURE LENS</p>
              </div>
            </div>

            {/* Simulated Live View Finder Screen */}
            <div className="relative flex-1 min-h-[320px] lg:min-h-[360px] mb-5 rounded-2xl bg-black border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-4">
              {isScanning ? (
                <>
                  {/* Blinking camera lens overlay */}
                  <div className="absolute inset-0 border-[3px] border-emerald-500/70 rounded-2xl pointer-events-none animate-pulse"></div>
                  
                  {/* Target sight brackets */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/80"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/80"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/80"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/80"></div>
 
                  {/* Red Laser Scanning line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] animate-[bounce_2s_infinite]"></div>
 
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute top-3 right-3"></span>
 
                  <div className="text-white z-10">
                    <div className="text-[10px] font-black tracking-widest text-emerald-400 animate-pulse">
                      {lang === "kh" ? "កាមេរ៉ាកំពុងដំណើរការ" : lang === "zh" ? "相机镜头处于激活状态" : "LENS FEED IS ACTIVE"}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold tracking-wide mt-1">
                      {lang === "kh" ? "ស្កេនស្វែងរកកាតសម្គាល់ QR / BARCODE..." : lang === "zh" ? "将二维码/条形码对准相机以进行识别..." : "Align QR or Barcode ID cards with the camera screen..."}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Sight brackets (gray) */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-slate-700"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-slate-700"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-slate-700"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-slate-700"></div>
 
                  <Camera className="w-8 h-8 text-slate-700 mb-2" />
                  <div className="text-[10px] font-black text-slate-500">
                    {lang === "kh" ? "កាមេរ៉ាមិនទាន់ដំណើរការ" : lang === "zh" ? "扫码镜头未开启" : "Camera lens is disabled"}
                  </div>
                  <div className="text-[9px] text-slate-600 font-medium px-2 mt-1">
                    {lang === "kh" ? "សូមចុចប៊ូតុងខាងក្រោម ដើម្បីបើកការស្កេនតាមកាមេរ៉ា" : lang === "zh" ? "请点击下方按钮启动自动相机扫码识别" : "Please click the button below to turn on the camera"}
                  </div>
                </>
              )}
            </div>
 
            {/* Launch Camera Button */}
            <button
              type="button"
              onClick={toggleCameraScanner}
              className={`w-full mt-auto py-3 rounded-2xl text-[11px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isScanning
                  ? "bg-red-500 hover:bg-red-650 text-white shadow"
                  : "bg-primary-600 hover:bg-primary-750 text-white shadow-md active:scale-98"
              }`}
            >
              {isScanning ? (
                <>
                  <X className="w-4 h-4" />
                  {lang === "kh" ? "បិទកាមេរ៉ាស្កេន (Deactivate Lens)" : lang === "zh" ? "关闭相机镜头 (Deactivate Lens)" : "Close Camera Lens (Deactivate Lens)"}
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  {lang === "kh" ? "បើកកាមេរ៉ាស្កេន (Launch Camera Module)" : lang === "zh" ? "启动相机扫码 (Launch Camera Module)" : "Launch Camera Module (Launch Camera Module)"}
                </>
              )}
            </button>
          </div>
 
          {/* Component 1.5 deleted per user request */}
        </div>
      </div>

      {/* Scan Rules Configuration Modal */}
      <AnimatePresence>
        {isRulesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative w-full max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-white border border-slate-200/90 rounded-[28px] p-8 shadow-2xl max-h-[95vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 transition-colors"
            >
              {/* Close button at the top right corner */}
              <button
                type="button"
                onClick={() => {
                  setIsRulesModalOpen(false);
                  setIsRuleDropdownOpen(false);
                  setIsEditingRule(false);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Settings2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black text-slate-700 uppercase tracking-wider pr-8">
                    {lang === "kh" ? "កំណត់លក្ខខណ្ឌ ស្កេនចូល-ស្កេនចេញ" : lang === "zh" ? "设置签到/签退时间判定标准" : "Scan Thresholds Rules Configuration"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">SCAN CONDITIONS & THRESHOLDS</p>
                </div>
              </div>

              {/* Inside rules config content */}
              <div className="space-y-4">
                {/* Filter Tabs & Unified selector for Student, Teacher, Staff */}
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs md:text-sm font-extrabold text-slate-600 mb-2.5 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-primary-500" />
                      {lang === "kh" ? "ជ្រើសរើសប្រភេទសមាជិក (Select Member Type)" : lang === "zh" ? "选择成员类型 (Select Member Type)" : "Select Member Type (Select Member Type)"}
                    </label>
                    {/* Type Filter Tabs */}
                    <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 shadow-3xs items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setRuleFilterType("all");
                          setIsEditingRule(false);
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs md:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          ruleFilterType === "all"
                            ? "bg-white text-primary-600 shadow-xs border border-slate-200/30 font-black"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        {lang === "kh" ? "ទាំងអស់" : lang === "zh" ? "全部" : "All"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRuleFilterType("student");
                          setIsEditingRule(false);
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs md:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          ruleFilterType === "student"
                            ? "bg-white text-primary-600 shadow-xs border border-slate-200/30 font-black"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        {lang === "kh" ? "សិស្ស" : lang === "zh" ? "学生" : "Student"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRuleFilterType("teacher");
                          setIsEditingRule(false);
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs md:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          ruleFilterType === "teacher"
                            ? "bg-white text-rose-600 shadow-xs border border-slate-200/30 font-black"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        {lang === "kh" ? "គ្រូ" : lang === "zh" ? "教师" : "Teacher"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRuleFilterType("staff");
                          setIsEditingRule(false);
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs md:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          ruleFilterType === "staff"
                            ? "bg-white text-emerald-600 shadow-xs border border-slate-200/30 font-black"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        {lang === "kh" ? "បុគ្គលិក" : lang === "zh" ? "员工" : "Staff"}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs md:text-sm font-extrabold text-slate-600 mb-2 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-primary-500" />
                      {lang === "kh" ? "ជ្រើសរើសឈ្មោះសិស្ស-គ្រូ-បុគ្គលិក (Select Person)" : lang === "zh" ? "选择具体人员 (Select Person)" : "Select Person (Select Person)"}
                    </label>
                    
                    {/* Custom Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsRuleDropdownOpen(!isRuleDropdownOpen)}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 flex items-center justify-between transition-all cursor-pointer font-sans"
                    >
                      <span className="truncate font-black text-slate-750">
                        {currentRulePerson ? (
                          `${currentRulePerson.name} (${currentRulePerson.nameEn}) — ${currentRulePerson.hours}`
                        ) : (
                          lang === "kh" ? "ជ្រើសរើសសមាជិក..." : lang === "zh" ? "选择成员..." : "Select member..."
                        )}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isRuleDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Options List */}
                    {isRuleDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsRuleDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-lg z-45 overflow-hidden flex flex-col max-h-[250px]">
                          {/* Search Input inside Dropdown */}
                          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative">
                              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={ruleDropdownSearch}
                                onChange={(e) => setRuleDropdownSearch(e.target.value)}
                                placeholder={lang === "kh" ? "ស្វែងរកឈ្មោះ ឬ ID..." : lang === "zh" ? "搜索姓名或卡号..." : "Search name or ID..."}
                                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-bold focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                              />
                            </div>
                          </div>

                          <div className="overflow-y-auto divide-y divide-slate-100 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {filteredRuleOptions.length > 0 ? (
                              filteredRuleOptions.map((opt) => {
                                const isSelected = ruleSelectedPersonId === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setRuleSelectedPersonId(opt.id);
                                      setIsEditingRule(false);
                                      setIsRuleDropdownOpen(false);
                                      setRuleDropdownSearch("");
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-all cursor-pointer ${
                                      isSelected 
                                        ? "bg-primary-50 text-primary-700 font-extrabold" 
                                        : "text-slate-600 hover:bg-slate-50 font-medium"
                                    }`}
                                  >
                                    <div className="flex flex-col gap-0.5 truncate">
                                      <span className={isSelected ? "font-black" : "font-extrabold"}>
                                        {opt.name} ({opt.nameEn})
                                      </span>
                                      <span className="text-[11.5px] text-slate-400 font-mono">
                                        {opt.displayId || opt.id} • {opt.hours}
                                      </span>
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-primary-600 shrink-0 ml-2" />}
                                  </button>
                                );
                              })
                            ) : (
                              <div className="px-4 py-6 text-center text-sm font-bold text-slate-400">
                                {lang === "kh" ? "រកមិនឃើញលទ្ធផល!" : lang === "zh" ? "未找到任何匹配项!" : "No results found!"}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Study schedule assistant for selected person */}
                {currentRulePerson && currentRulePersonFullDetails && (
                  <motion.div 
                    key={`modal-${currentRulePerson.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-50/50 border border-primary-100 rounded-2xl p-5 md:p-6 space-y-3.5 text-left animate-fade-in"
                  >
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black uppercase text-primary-800 tracking-wider">
                      <Sparkles className="w-4.5 h-4.5 text-primary-600 animate-spin-slow" />
                      <span>{lang === "kh" ? "ព័ត៌មានម៉ោងសិក្សាជាក់ស្ដែង" : lang === "zh" ? "签到排班安排详情 (SCHEDULE INFO)" : "Effective Schedule Details (SCHEDULE INFO)"}</span>
                    </div>
                    <div className="text-xs md:text-sm space-y-2.5 font-bold text-slate-700">
                      <div className="flex justify-between border-b border-primary-100/40 pb-1.5">
                        <span className="text-slate-400">{lang === "kh" ? "ឈ្មោះស្កេន:" : lang === "zh" ? "签到姓名:" : "Scan Name:"}</span>
                        <span className="text-primary-950 font-black">
                          {currentRulePerson.name} ({currentRulePerson.type === "teacher" ? (lang === "kh" ? "គ្រូ" : lang === "zh" ? "教师" : "Teacher") : currentRulePerson.type === "staff" ? (lang === "kh" ? "បុគ្គលិក" : lang === "zh" ? "员工" : "Staff") : (lang === "kh" ? "សិស្ស" : lang === "zh" ? "学生" : "Student")})
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-primary-100/40 pb-1.5">
                        <span className="text-slate-400">{lang === "kh" ? "អត្តសញ្ញាណ ID:" : lang === "zh" ? "考勤卡号 ID:" : "Card ID:"}</span>
                        <span className="text-primary-950 font-black font-mono">{currentRulePerson.displayId}</span>
                      </div>
                      <div className="flex justify-between border-b border-primary-100/40 pb-1.5">
                        <span className="text-slate-400">{lang === "kh" ? "ភេទ (Gender):" : lang === "zh" ? "性别 (Gender):" : "Gender (Gender):"}</span>
                        <span className="text-slate-800 font-black font-sans">
                          {currentRulePersonFullDetails.person?.gender === "Female" || currentRulePersonFullDetails.person?.gender === "ស្រី"
                            ? (lang === "kh" ? "ស្រី (Female)" : lang === "zh" ? "女 (Female)" : "Female (Female)") 
                            : currentRulePersonFullDetails.person?.gender === "Male" || currentRulePersonFullDetails.person?.gender === "ប្រុស"
                            ? (lang === "kh" ? "ប្រុស (Male)" : lang === "zh" ? "男 (Male)" : "Male (Male)") 
                            : currentRulePersonFullDetails.person?.gender || "---"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-primary-100/40 pb-1.5">
                        <span className="text-slate-400">
                          {currentRulePerson.type === "teacher" ? (lang === "kh" ? "ជំនាញបង្រៀន:" : lang === "zh" ? "任教专业:" : "Teaching Specialty:") : currentRulePerson.type === "staff" ? (lang === "kh" ? "តួនាទី:" : lang === "zh" ? "职务角色:" : "Staff Role:") : (lang === "kh" ? "វគ្គសិក្សា & កម្រិត:" : lang === "zh" ? "修读课程 & 级别:" : "Course & Level:")}
                        </span>
                        <span className="text-slate-800 font-black">
                          {currentRulePerson.type === "teacher" 
                            ? (currentRulePersonFullDetails.person?.specialty || "---")
                            : currentRulePerson.type === "staff"
                            ? (currentRulePersonFullDetails.person?.role || "---")
                            : (currentRulePersonFullDetails.person?.course 
                                ? `${currentRulePersonFullDetails.person.course}${currentRulePersonFullDetails.person.level ? ` (${currentRulePersonFullDetails.person.level})` : ""}`
                                : "---"
                              )}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-primary-100/40 pb-1.5 font-sans">
                        <span className="text-slate-400">{lang === "kh" ? "វេនសិក្សា:" : lang === "zh" ? "考勤班次:" : "Shift Group:"}</span>
                        <span className="text-slate-800 font-black">
                          {lang === "kh" ? currentRulePersonFullDetails.shiftInfo.shift : lang === "zh" ? currentRulePersonFullDetails.shiftInfo.shift.replace("ព្រឹក", "早上").replace("រសៀល", "下午").replace("ល្ងាច", "傍晚") : currentRulePersonFullDetails.shiftInfo.shift.replace("ព្រឹក", "Morning").replace("រសៀល", "Afternoon").replace("ល្ងាច", "Evening")}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-primary-100/40 pb-1.5">
                        <span className="text-slate-400">{lang === "kh" ? "ម៉ោងសិក្សាជាក់ស្ដែង:" : lang === "zh" ? "班次规定时间:" : "Shift Hours:"}</span>
                        <span className="text-slate-800 font-black font-mono">
                          {getEffectiveHours(currentRulePerson.id, currentRulePersonFullDetails.shiftInfo.hours)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-primary-100/40 pb-1.5">
                        <span className="text-slate-400">{lang === "kh" ? "ស្ថានភាព:" : lang === "zh" ? "状态 (Status):" : "Status (Status):"}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] md:text-[11px] font-black ${
                          currentRulePersonFullDetails.person?.status === "STUDYING" || currentRulePersonFullDetails.person?.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/40"
                            : "bg-amber-50 text-amber-700 border border-amber-200/40"
                        }`}>
                          {currentRulePersonFullDetails.person?.status === "STUDYING" 
                            ? (lang === "kh" ? "កំពុងសិក្សា (STUDYING)" : lang === "zh" ? "在读 (STUDYING)" : "Studying (STUDYING)") 
                            : currentRulePersonFullDetails.person?.status === "ACTIVE"
                            ? (lang === "kh" ? "សកម្ម (ACTIVE)" : lang === "zh" ? "启用中 (ACTIVE)" : "Active (ACTIVE)")
                            : currentRulePersonFullDetails.person?.status || "---"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-primary-100/40 pb-1.5">
                        <span className="text-slate-400">{lang === "kh" ? "លេខទូរស័ព្ទ:" : lang === "zh" ? "联系电话:" : "Phone Number:"}</span>
                        <span className="text-slate-800 font-black font-mono">
                          {currentRulePersonFullDetails.person?.phoneNumber || 
                           currentRulePersonFullDetails.person?.phone || 
                           currentRulePersonFullDetails.person?.guardianPhone || 
                           "---"}
                        </span>
                      </div>
                      <div className="flex justify-between pt-0.5">
                        <span className="text-slate-400">{lang === "kh" ? "ទម្រង់ដែលត្រូវស្កេន:" : lang === "zh" ? "当前打卡方向:" : "Scan Direction:"}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] md:text-[11px] font-black uppercase ${
                          scanMode === "check-in" 
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}>
                          {scanMode === "check-in" ? (lang === "kh" ? "ស្កេនចូល (IN)" : lang === "zh" ? "签到入场 (IN)" : "Check In (IN)") : (lang === "kh" ? "ស្កេនចេញ (OUT)" : lang === "zh" ? "签退退场 (OUT)" : "Check Out (OUT)")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Study Hours Settings */}
                <div className="grid grid-cols-2 gap-4 mb-3 border-b border-dashed border-slate-200/60 pb-4 text-left">
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] md:text-[11.5px] font-extrabold text-primary-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                      {lang === "kh" ? "ម៉ោងចាប់ផ្ដើមរៀន (Study Start)" : lang === "zh" ? "规定到岗/到校时间 (Study Start)" : "Required Arrival Time (Study Start)"}
                    </label>
                    <input
                      type="text"
                      value={ruleStudyStart}
                      onChange={(e) => setRuleStudyStart(e.target.value)}
                      disabled={!isEditingRule}
                      placeholder="08:00"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all ${
                        isEditingRule 
                          ? "bg-white border-primary-300 text-primary-700 font-extrabold" 
                          : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 font-semibold block text-center">{lang === "kh" ? "ម៉ោងចូលសិក្សាជាក់ស្ដែង" : lang === "zh" ? "日常或上午规定上课/到岗时刻" : "Official schedule check-in hours"}</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] md:text-[11.5px] font-extrabold text-blue-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {lang === "kh" ? "ម៉ោងបញ្ចប់រៀន (Study End)" : lang === "zh" ? "规定离校/离岗时间 (Study End)" : "Required Departure Time (Study End)"}
                    </label>
                    <input
                      type="text"
                      value={ruleStudyEnd}
                      onChange={(e) => setRuleStudyEnd(e.target.value)}
                      disabled={!isEditingRule}
                      placeholder="11:00"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all ${
                        isEditingRule 
                          ? "bg-white border-blue-300 text-blue-700 font-extrabold" 
                          : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 font-semibold block text-center">{lang === "kh" ? "ម៉ោងចេញសិក្សាជាក់ស្ដែង" : lang === "zh" ? "日常或下午规定下课/放行时刻" : "Official schedule check-out hours"}</span>
                  </div>
                </div>

                {/* Dual threshold settings */}
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] md:text-[11.5px] font-extrabold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      {lang === "kh" ? "ម៉ោងកំណត់យឺត (Late In)" : lang === "zh" ? "迟到判定界限 (Late In)" : "Tardy Check-In Limit (Late In)"}
                    </label>
                    <input
                      type="text"
                      value={ruleLateIn}
                      onChange={(e) => setRuleLateIn(e.target.value)}
                      disabled={!isEditingRule}
                      placeholder="08:15"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all ${
                        isEditingRule 
                          ? "bg-white border-rose-300 text-rose-700 font-extrabold" 
                          : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 font-semibold block text-center">{lang === "kh" ? "លើសម៉ោងនេះចាត់ទុកថា \"យឺត\"" : lang === "zh" ? "迟于该时间刷卡判定为 \"迟到\"" : "After this threshold is marked as \"TARDY\""}</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] md:text-[11.5px] font-extrabold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {lang === "kh" ? "ចេញមុនម៉ោង (Early Out)" : lang === "zh" ? "早退判定界限 (Early Out)" : "Early Out Limit (Early Out)"}
                    </label>
                    <input
                      type="text"
                      value={ruleEarlyOut}
                      onChange={(e) => setRuleEarlyOut(e.target.value)}
                      disabled={!isEditingRule}
                      placeholder="11:00"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all ${
                        isEditingRule 
                          ? "bg-white border-amber-300 text-amber-700 font-extrabold" 
                          : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 font-semibold block text-center">{lang === "kh" ? "មុនម៉ោងនេះចាត់ទុកថា \"ចេញមុន\"" : lang === "zh" ? "早于该时间刷卡判定为 \"早退\"" : "Before this threshold is marked as \"EARLY_OUT\""}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3">
                  {!isEditingRule ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingRule(true)}
                      className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs md:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                    >
                      <Edit3 className="w-4 h-4 text-slate-500" />
                      {lang === "kh" ? "កែប្រែការកំណត់ (Edit Thresholds)" : lang === "zh" ? "自定义并编辑此人标准 (Edit Thresholds)" : "Edit Custom Thresholds (Edit Thresholds)"}
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentRulePerson) {
                            const pid = currentRulePerson.id;
                            const updated = {
                              ...individualRules,
                              [pid]: {
                                lateIn: ruleLateIn,
                                earlyOut: ruleEarlyOut,
                                studyStart: ruleStudyStart,
                                studyEnd: ruleStudyEnd
                              }
                            };
                            setIndividualRules(updated);
                            localStorage.setItem("sms_individual_scan_rules", JSON.stringify(updated));
                            setIsEditingRule(false);
                            showToast(
                              lang === "en" 
                                ? `Successfully updated custom scan rules for ${currentRulePerson.name}!` 
                                : lang === "zh" 
                                  ? `成功更新 ${currentRulePerson.name} 的个性化考勤判定规则！` 
                                  : `បានកែប្រែការកំណត់សម្រាប់ ${currentRulePerson.name} ដោយជោគជ័យ!`, 
                              "success"
                            );
                          }
                        }}
                        className="py-3 bg-primary-600 hover:bg-primary-750 text-white rounded-xl text-xs md:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow active:scale-98"
                      >
                        <Save className="w-4 h-4" />
                        {lang === "kh" ? "រក្សាទុក (Save)" : lang === "zh" ? "保存规则 (Save)" : "Save Rules (Save)"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (currentRulePerson) {
                            const saved = individualRules[currentRulePerson.id];
                            let defaultLate = "08:15";
                            let defaultEarly = "11:00";
                            let defaultStudyStart = "08:00";
                            let defaultStudyEnd = "11:00";
                            if (saved) {
                              defaultLate = saved.lateIn;
                              defaultEarly = saved.earlyOut;
                              defaultStudyStart = saved.studyStart || "08:00";
                              defaultStudyEnd = saved.studyEnd || "11:00";
                            } else {
                              if (currentRulePersonFullDetails) {
                                const hoursStr = currentRulePersonFullDetails.shiftInfo.hours || "";
                                const parsed = parseShiftTimes(hoursStr);
                                if (parsed) {
                                  defaultStudyStart = parsed.start;
                                  defaultStudyEnd = parsed.end;
                                  const [shStr, smStr] = parsed.start.split(":");
                                  const sh = parseInt(shStr, 10);
                                  const sm = parseInt(smStr, 10);
                                  if (!isNaN(sh) && !isNaN(sm)) {
                                    let lm = sm + 15;
                                    let lh = sh;
                                    if (lm >= 60) {
                                      lm -= 60;
                                      lh += 1;
                                    }
                                    defaultLate = `${String(lh).padStart(2, "0")}:${String(lm).padStart(2, "0")}`;
                                    defaultEarly = parsed.end;
                                  } else {
                                    const shiftName = currentRulePersonFullDetails.shiftInfo.shift || "";
                                    const hoursStr2 = currentRulePersonFullDetails.shiftInfo.hours || "";
                                    if (hoursStr2.includes("យប់") || hoursStr2.includes("ល្ងាច") || shiftName.includes("យប់")) {
                                      defaultStudyStart = "17:30";
                                      defaultStudyEnd = "18:30";
                                      defaultLate = "17:45";
                                      defaultEarly = "18:30";
                                    } else if (hoursStr2.includes("រសៀល") || shiftName.includes("រសៀល")) {
                                      defaultStudyStart = "14:00";
                                      defaultStudyEnd = "15:30";
                                      defaultLate = "14:15";
                                      defaultEarly = "15:30";
                                    }
                                  }
                                }
                              }
                            }
                            setRuleLateIn(defaultLate);
                            setRuleEarlyOut(defaultEarly);
                            setRuleStudyStart(defaultStudyStart);
                            setRuleStudyEnd(defaultStudyEnd);
                          }
                          setIsEditingRule(false);
                        }}
                        className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs md:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200 active:scale-98"
                      >
                        <Undo2 className="w-4 h-4" />
                        {lang === "kh" ? "បោះបង់ (Cancel)" : lang === "zh" ? "取消编辑 (Cancel)" : "Cancel Edit (Cancel)"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
