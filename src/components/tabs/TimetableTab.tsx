import React, { useState, useEffect, useMemo } from "react";
import SearchableSelect from "../SearchableSelect";
import { 
  Calendar, Plus, Trash2, Edit, X, Save, AlertTriangle, ChevronDown, Check, 
  Search, Filter, LayoutGrid, List, Download, Sparkles, User, Users, BookOpen, Clock, AlertCircle, RefreshCw,
  BarChart2, PieChart, Activity, Info, HeartHandshake, MapPin, Copy, Printer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToExcel } from "../../exportUtils";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie
} from 'recharts';

export default function TimetableTab({ 
  teachers = [], 
  token, 
  uiLang: propUiLang, 
  courseOptions = [], 
  students = [],
  onAddCourseOption,
  onEditCourseOption,
  onDeleteCourseOption
}: any) {
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

  const idt = (kh: string, en?: string, zh?: string) => {
    if (localLang === "en") return en || kh;
    if (localLang === "zh") return zh || en || kh;
    return kh;
  };

  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Custom Days Config
  const [dayOptions, setDayOptions] = useState<string[]>([]);
  const [isOpenDayDropdown, setIsOpenDayDropdown] = useState(false);
  const [showAddDay, setShowAddDay] = useState(false);
  const [newCustomDay, setNewCustomDay] = useState("");
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editingDayValue, setEditingDayValue] = useState("");

  // Views & Filters
  const [viewMode, setViewMode] = useState<"list" | "grid" | "matrix">("grid");
  const [groupByMode, setGroupByMode] = useState<"day" | "room" | "teacher">("day");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isOpenFilterDayDropdown, setIsOpenFilterDayDropdown] = useState(false);
  const [isOpenFilterTeacherDropdown, setIsOpenFilterTeacherDropdown] = useState(false);
  const [isOpenFilterRoomDropdown, setIsOpenFilterRoomDropdown] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState<"utilization" | "workload" | "courses" | "advisor">("utilization");

  useEffect(() => {
    const saved = localStorage.getItem("plc_day_options");
    if (saved) {
      setDayOptions(JSON.parse(saved));
    } else {
      setDayOptions(["ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍", "អាទិត្យ"]);
    }
  }, []);

  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [isCustomSubject, setIsCustomSubject] = useState(false);

  const mergedSubjects = useMemo(() => {
    const list = new Set<string>();

    // Add courses from the database
    dbCourses.forEach(c => {
      if (c && c.title && c.title.trim()) {
        list.add(c.title.trim());
      }
    });

    // Add configured options from settings
    if (Array.isArray(courseOptions)) {
      courseOptions.forEach(opt => {
        if (opt && typeof opt === 'string' && opt.trim()) {
          list.add(opt.trim());
        }
      });
    }

    // Add courses from actual student registrations
    if (Array.isArray(students)) {
      students.forEach(s => {
        if (s && s.course && s.course.trim()) {
          list.add(s.course.trim());
        }
      });
    }

    // Standard defaults if there is absolutely nothing
    if (list.size === 0) {
      return ["Word", "Excel", "Photoshop", "Python", "Web Development", "UI/UX Design"];
    }

    return Array.from(list).sort((a, b) => a.localeCompare(b, 'km'));
  }, [dbCourses, courseOptions, students]);

  const handleAddCourseByName = (newValue: string) => {
    if (onAddCourseOption) {
      onAddCourseOption(newValue);
    }
  };

  const handleEditCourseByName = (oldValue: string, newValue: string) => {
    const idx = courseOptions.indexOf(oldValue);
    if (idx !== -1 && onEditCourseOption) {
      onEditCourseOption(idx, newValue);
    }
  };

  const handleDeleteCourseByName = async (value: string) => {
    // 1. Delete from config courseOptions (settings)
    const idx = courseOptions.indexOf(value);
    if (idx !== -1 && onDeleteCourseOption) {
      onDeleteCourseOption(idx);
    }

    // 2. Also delete from database dbCourses if it exists there as a course record
    const matchedDbCourse = dbCourses.find(c => c.title?.trim().toLowerCase() === value.trim().toLowerCase());
    if (matchedDbCourse) {
      try {
        const res = await fetch(`/api/courses/${matchedDbCourse.id}`, { 
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fetchTimetables();
        }
      } catch (error) {
        console.error("Failed to delete database course in TimetableTab:", error);
      }
    }
  };

  const handleSubjectChange = (subjectTitle: string) => {
    const matchedCourse = dbCourses.find(c => c.title?.trim().toLowerCase() === subjectTitle.trim().toLowerCase());
    if (matchedCourse && matchedCourse.teacherId) {
      setFormData(prev => ({
        ...prev,
        subject: subjectTitle,
        teacherId: matchedCourse.teacherId
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subject: subjectTitle
      }));
    }
  };

  const [formData, setFormData] = useState({
    teacherId: "",
    subject: "",
    room: "",
    dayOfWeek: "",
    startTime: "07:00",
    endTime: "08:00"
  });

  useEffect(() => {
    if (dayOptions.length > 0 && !formData.dayOfWeek) {
      setFormData(prev => ({ ...prev, dayOfWeek: dayOptions[0] }));
    }
  }, [dayOptions]);

  const handleAddDayOption = () => {
    const trimmed = newCustomDay.trim();
    if (!trimmed) {
      setShowAddDay(false);
      return;
    }
    if (!dayOptions.includes(trimmed)) {
      const updated = [...dayOptions, trimmed];
      setDayOptions(updated);
      localStorage.setItem("plc_day_options", JSON.stringify(updated));
      setFormData({ ...formData, dayOfWeek: trimmed });
    }
    setNewCustomDay("");
    setShowAddDay(false);
  };

  const handleEditDayOption = (index: number, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    const oldVal = dayOptions[index];
    if (dayOptions.includes(trimmed) && oldVal !== trimmed) return;
    
    const updated = [...dayOptions];
    updated[index] = trimmed;
    setDayOptions(updated);
    localStorage.setItem("plc_day_options", JSON.stringify(updated));
    if (formData.dayOfWeek === oldVal) {
      setFormData({ ...formData, dayOfWeek: trimmed });
    }
    setEditingDayIndex(null);
  };

  const handleDeleteDayOption = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const val = dayOptions[index];
    const updated = dayOptions.filter((_, i) => i !== index);
    setDayOptions(updated);
    localStorage.setItem("plc_day_options", JSON.stringify(updated));
    if (formData.dayOfWeek === val) {
      setFormData({ ...formData, dayOfWeek: updated[0] || "" });
    }
  };

  const fetchTimetables = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/timetables', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).catch(() => [])
    ])
      .then(([timetableData, coursesData]) => {
        setTimetables(Array.isArray(timetableData) ? timetableData : []);
        setDbCourses(Array.isArray(coursesData) ? coursesData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimetables();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!formData.teacherId || !formData.subject || !formData.room || !formData.startTime || !formData.endTime) {
        alert(idt("សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់", "Please fill in all required fields"));
        return;
    }
    
    try {
      const url = editingId ? `/api/timetables/${editingId}` : '/api/timetables';
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
        setFormData({ teacherId: "", subject: "", room: "", dayOfWeek: dayOptions[0] || "ច័ន្ទ", startTime: "07:00", endTime: "08:00" });
        setEditingId(null);
        setIsCustomSubject(false);
        fetchTimetables();
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || "Failed to save timetable");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred");
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/timetables/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchTimetables();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const [test, setTest] = useState(false); // just as state anchor if needed, actually not needed

  const openEdit = (tt: any) => {
    setFormData({
      teacherId: tt.teacherId,
      subject: tt.subject,
      room: tt.room,
      dayOfWeek: tt.dayOfWeek,
      startTime: tt.startTime,
      endTime: tt.endTime
    });
    setEditingId(tt.id);
    setIsCustomSubject(!mergedSubjects.includes(tt.subject));
    setShowAddModal(true);
    setErrorMsg("");
  };

  const handleAutoResolveRoomConflict = async (item: any, newRoom: string) => {
    try {
      const res = await fetch(`/api/timetables/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          teacherId: item.teacherId,
          subject: item.subject,
          room: newRoom,
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime
        })
      });
      if (res.ok) {
        fetchTimetables();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to auto-resolve conflict");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper functions for smart conflict checking
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const checkTimeOverlaps = (startA: string, endA: string, startB: string, endB: string): boolean => {
    const sA = parseTimeToMinutes(startA);
    const eA = parseTimeToMinutes(endA);
    const sB = parseTimeToMinutes(startB);
    const eB = parseTimeToMinutes(endB);
    return sA < eB && sB < eA; // overlapping logic
  };

  // Memoized Overlap Conflict Checker
  const conflicts = useMemo(() => {
    const result: Record<string, { type: 'room' | 'teacher' | 'both', detail: string }[]> = {};
    
    for (let i = 0; i < timetables.length; i++) {
      const t1 = timetables[i];
      for (let j = i + 1; j < timetables.length; j++) {
        const t2 = timetables[j];
        
        if (t1.dayOfWeek === t2.dayOfWeek) {
          const overlaps = checkTimeOverlaps(t1.startTime, t1.endTime, t2.startTime, t2.endTime);
          if (overlaps) {
            // Check classroom collision
            if (t1.room && t2.room && t1.room.trim().toLowerCase() === t2.room.trim().toLowerCase()) {
              if (!result[t1.id]) result[t1.id] = [];
              if (!result[t2.id]) result[t2.id] = [];
              
              const detail = idt(
                `ជាន់បន្ទប់ ${t1.room} (${t1.startTime}-${t1.endTime} ជាមួយ ${t2.startTime}-${t2.endTime})`,
                `Room collision ${t1.room} (${t1.startTime}-${t1.endTime} with ${t2.startTime}-${t2.endTime})`
              );
              result[t1.id].push({ type: 'room', detail });
              result[t2.id].push({ type: 'room', detail });
            }
            
            // Check teacher collision
            if (t1.teacherId && t2.teacherId && t1.teacherId === t2.teacherId) {
              if (!result[t1.id]) result[t1.id] = [];
              if (!result[t2.id]) result[t2.id] = [];
              
              const detail = idt(
                `គ្រូបង្រៀនជាន់ម៉ោង (${t1.startTime}-${t1.endTime} ជាមួយ ${t2.startTime}-${t2.endTime})`,
                `Teacher scheduled twice (${t1.startTime}-${t1.endTime} with ${t2.startTime}-${t2.endTime})`
              );
              result[t1.id].push({ type: 'teacher', detail });
              result[t2.id].push({ type: 'teacher', detail });
            }
          }
        }
      }
    }
    return result;
  }, [timetables, localLang]);

  // Seed sample records
  const handleSeedDemoData = async () => {
    if (teachers.length === 0) {
      alert(idt("សូមបង្កើតគ្រូបង្រៀនក្នុងផ្នែក បញ្ជីគ្រូបង្រៀន ជាមុនសិន។", "Please add some teachers in the Teachers list first."));
      return;
    }
    
    setIsSeeding(true);
    const demoData = [
      { subject: "Python & Data Science", room: "Lab A", dayOfWeek: "ច័ន្ទ", startTime: "13:00", endTime: "16:00" },
      { subject: "Graphic Design & UI/UX", room: "Room 102", dayOfWeek: "អង្គារ", startTime: "19:30", endTime: "21:00" },
      { subject: "English Communication", room: "Room 201", dayOfWeek: "ពុធ", startTime: "17:00", endTime: "18:00" },
      { subject: "Basic Computer Skills", room: "Lab B", dayOfWeek: "ព្រហស្បតិ៍", startTime: "08:00", endTime: "11:00" },
      { subject: "Web Development Full Stack", room: "Lab A", dayOfWeek: "សុក្រ", startTime: "18:00", endTime: "19:30" },
      { subject: "Advanced Mathematics", room: "Room 303", dayOfWeek: "សៅរ៍", startTime: "09:00", endTime: "11:30" }
    ];

    try {
      for (let i = 0; i < demoData.length; i++) {
        const tItem = demoData[i];
        const assignedTeacher = teachers[i % teachers.length];
        
        await fetch('/api/timetables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...tItem,
            teacherId: assignedTeacher.id
          })
        });
      }
      fetchTimetables();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Duplicate schedule helper
  const handleDuplicateSchedule = (t: any) => {
    setFormData({
      teacherId: t.teacherId || "",
      subject: t.subject || "",
      room: t.room || "",
      dayOfWeek: t.dayOfWeek || dayOptions[0] || "ច័ន្ទ",
      startTime: t.startTime || "07:00",
      endTime: t.endTime || "08:00"
    });
    setEditingId(null); // Force it to create as a new slot
    setIsCustomSubject(!mergedSubjects.includes(t.subject || ""));
    setErrorMsg("");
    setShowAddModal(true);
  };

  // Print timetable helper
  const handlePrintTimetable = () => {
    window.print();
  };

  // Export to Excel helper
  const handleExportExcel = () => {
    const dataToExport = filteredTimetables.map((t, idx) => ({
      [idt("ល.រ", "No.")]: idx + 1,
      [idt("គ្រូបង្រៀន", "Teacher")]: t.teacher ? (t.teacher.nameKh || t.teacher.nameEn || t.teacher.firstNameEn) : 'N/A',
      [idt("មុខវិជ្ជា", "Subject")]: t.subject,
      [idt("បន្ទប់សិក្សា", "Classroom/Room")]: t.room,
      [idt("ថ្ងៃសិក្សា", "Day of Week")]: t.dayOfWeek,
      [idt("ម៉ោងសិក្សា", "Class Hours")]: `${t.startTime} - ${t.endTime}`,
      [idt("ស្ថានភាពជាន់គ្នា", "Overlap Status")]: conflicts[t.id] ? idt("មានបញ្ហាជាន់ម៉ោង", "Conflict Detected") : idt("គ្មានបញ្ហាទេ", "No Conflicts")
    }));
    
    exportToExcel(
      dataToExport, 
      idt("កាលវិភាគសិក្សា", "Class_Timetable"), 
      idt("បញ្ជីកាលវិភាគសិក្សា និង ការបង្រៀន", "School Class Timetable & Scheduled Hours")
    );
  };

  // List of distinct rooms for the filter dropdown
  const distinctRooms = useMemo(() => {
    const rooms = timetables.map(t => t.room).filter(Boolean);
    return Array.from(new Set(rooms));
  }, [timetables]);

  // Filtered Timetable List
  const filteredTimetables = useMemo(() => {
    return timetables.filter(t => {
      const teacherName = t.teacher ? (t.teacher.nameKh || t.teacher.nameEn || t.teacher.firstNameEn || '').toLowerCase() : '';
      const subjectName = (t.subject || '').toLowerCase();
      const roomName = (t.room || '').toLowerCase();
      const s = searchTerm.toLowerCase();
      
      const matchesSearch = !searchTerm || 
        teacherName.includes(s) || 
        subjectName.includes(s) || 
        roomName.includes(s);
        
      const matchesTeacher = !selectedTeacherId || t.teacherId === selectedTeacherId;
      const matchesDay = !selectedDay || t.dayOfWeek === selectedDay;
      const matchesRoom = !selectedRoom || t.room === selectedRoom;

      return matchesSearch && matchesTeacher && matchesDay && matchesRoom;
    });
  }, [timetables, searchTerm, selectedTeacherId, selectedDay, selectedRoom]);

  // Grouped by Day for the Weekly Timetable Grid View
  const timetablesByDay = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    dayOptions.forEach(day => {
      grouped[day] = [];
    });
    
    filteredTimetables.forEach(t => {
      if (!grouped[t.dayOfWeek]) {
        grouped[t.dayOfWeek] = [];
      }
      grouped[t.dayOfWeek].push(t);
    });

    // Sort slots chronologically inside each day
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  }, [filteredTimetables, dayOptions]);

  // Grouped by Room for alternative Grid view columns
  const timetablesByRoom = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    distinctRooms.forEach(room => {
      grouped[room] = [];
    });
    filteredTimetables.forEach(t => {
      if (t.room) {
        if (!grouped[t.room]) grouped[t.room] = [];
        grouped[t.room].push(t);
      }
    });
    // Sort room slots by day position in dayOptions, then by startTime
    Object.keys(grouped).forEach(room => {
      grouped[room].sort((a, b) => {
        const dayIdxA = dayOptions.indexOf(a.dayOfWeek);
        const dayIdxB = dayOptions.indexOf(b.dayOfWeek);
        if (dayIdxA !== dayIdxB) return dayIdxA - dayIdxB;
        return a.startTime.localeCompare(b.startTime);
      });
    });
    return grouped;
  }, [filteredTimetables, distinctRooms, dayOptions]);

  // Distinct active teachers who have active schedules
  const distinctTeachersWithSchedules = useMemo(() => {
    const ids = timetables.map(t => t.teacherId).filter(Boolean);
    const uniqueIds = Array.from(new Set(ids));
    return uniqueIds.map(id => {
      return teachers.find((tc: any) => tc.id === id) || { id, nameKh: idt("គ្រូមិនស្គាល់", "Unknown"), firstNameEn: "Unknown" };
    }).filter(Boolean);
  }, [timetables, teachers, localLang]);

  // Grouped by Teacher for alternative Grid view columns
  const timetablesByTeacher = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    distinctTeachersWithSchedules.forEach(tc => {
      grouped[tc.id] = [];
    });
    filteredTimetables.forEach(t => {
      if (t.teacherId) {
        if (!grouped[t.teacherId]) grouped[t.teacherId] = [];
        grouped[t.teacherId].push(t);
      }
    });
    // Sort by day position, then by startTime
    Object.keys(grouped).forEach(tcId => {
      grouped[tcId].sort((a, b) => {
        const dayIdxA = dayOptions.indexOf(a.dayOfWeek);
        const dayIdxB = dayOptions.indexOf(b.dayOfWeek);
        if (dayIdxA !== dayIdxB) return dayIdxA - dayIdxB;
        return a.startTime.localeCompare(b.startTime);
      });
    });
    return grouped;
  }, [filteredTimetables, distinctTeachersWithSchedules, dayOptions]);

  // Unique sorted time slots for calendar matrix view
  const timeSlots = useMemo(() => {
    const slotsFromTimetable = timetables.map(t => `${t.startTime} - ${t.endTime}`).filter(Boolean);
    const uniqueSlots = Array.from(new Set(slotsFromTimetable));
    if (uniqueSlots.length === 0) {
      return ["08:00 - 11:00", "13:00 - 16:00", "17:00 - 18:00", "18:00 - 19:30", "19:30 - 21:00"];
    }
    return (uniqueSlots as string[]).sort((a: string, b: string) => {
      const startA = a.split(" - ")[0] || "00:00";
      const startB = b.split(" - ")[0] || "00:00";
      return startA.localeCompare(startB);
    });
  }, [timetables]);

  // KPI calculations
  const stats = useMemo(() => {
    const totalSchedules = timetables.length;
    const uniqueTeachers = new Set(timetables.map(t => t.teacherId).filter(Boolean)).size;
    const uniqueRooms = new Set(timetables.map(t => t.room).filter(Boolean)).size;
    const totalConflicts = Object.keys(conflicts).length;

    // Find Busiest Day
    const dayCounts: Record<string, number> = {};
    timetables.forEach(t => {
      dayCounts[t.dayOfWeek] = (dayCounts[t.dayOfWeek] || 0) + 1;
    });
    let busiestDay = idt("មិនទាន់មាន", "None");
    let maxCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxCount) {
        maxCount = count;
        busiestDay = day;
      }
    });

    return {
      totalSchedules,
      uniqueTeachers,
      uniqueRooms,
      totalConflicts,
      busiestDay: maxCount > 0 ? `${busiestDay} (${maxCount} ម៉ោង)` : busiestDay
    };
  }, [timetables, conflicts, localLang]);

  // Room Utilization analytics
  const roomData = useMemo(() => {
    const dataMap: Record<string, { room: string, count: number, totalMinutes: number }> = {};
    timetables.forEach(t => {
      if (!t.room) return;
      const r = t.room.trim();
      const dur = parseTimeToMinutes(t.endTime) - parseTimeToMinutes(t.startTime);
      if (!dataMap[r]) {
        dataMap[r] = { room: r, count: 0, totalMinutes: 0 };
      }
      dataMap[r].count += 1;
      dataMap[r].totalMinutes += dur > 0 ? dur : 0;
    });
    return Object.values(dataMap).map(d => ({
      name: d.room,
      classes: d.count,
      hours: Number((d.totalMinutes / 60).toFixed(1)),
      utilization: Math.min(100, Math.round((d.totalMinutes / (40 * 60)) * 100)) // assuming 40 hrs capacity
    })).sort((a, b) => b.hours - a.hours);
  }, [timetables]);

  // Teacher Workload analytics
  const teacherLoadData = useMemo(() => {
    const dataMap: Record<string, { name: string, count: number, totalMinutes: number }> = {};
    timetables.forEach(t => {
      if (!t.teacherId) return;
      const tObj = teachers.find((tc: any) => tc.id === t.teacherId);
      const name = tObj ? (tObj.nameKh || tObj.nameEn || tObj.firstNameEn) : 'N/A';
      const dur = parseTimeToMinutes(t.endTime) - parseTimeToMinutes(t.startTime);
      if (!dataMap[t.teacherId]) {
        dataMap[t.teacherId] = { name, count: 0, totalMinutes: 0 };
      }
      dataMap[t.teacherId].count += 1;
      dataMap[t.teacherId].totalMinutes += dur > 0 ? dur : 0;
    });
    return Object.values(dataMap).map(d => ({
      name: d.name,
      classes: d.count,
      hours: Number((d.totalMinutes / 60).toFixed(1))
    })).sort((a, b) => b.hours - a.hours);
  }, [timetables, teachers]);

  // Day Workload analytics
  const dayDistributionData = useMemo(() => {
    return dayOptions.map(day => {
      const daySlots = timetables.filter(t => t.dayOfWeek === day);
      const totalMinutes = daySlots.reduce((sum, t) => {
        const dur = parseTimeToMinutes(t.endTime) - parseTimeToMinutes(t.startTime);
        return sum + (dur > 0 ? dur : 0);
      }, 0);
      return {
        name: day,
        classes: daySlots.length,
        hours: Number((totalMinutes / 60).toFixed(1))
      };
    });
  }, [timetables, dayOptions]);

  // Course/Subject Scheduling load analytics
  const subjectLoadData = useMemo(() => {
    const dataMap: Record<string, { count: number, totalMinutes: number }> = {};
    timetables.forEach(t => {
      if (!t.subject) return;
      const sub = t.subject.trim();
      const dur = parseTimeToMinutes(t.endTime) - parseTimeToMinutes(t.startTime);
      if (!dataMap[sub]) {
        dataMap[sub] = { count: 0, totalMinutes: 0 };
      }
      dataMap[sub].count += 1;
      dataMap[sub].totalMinutes += dur > 0 ? dur : 0;
    });
    return Object.entries(dataMap).map(([subject, d]) => ({
      name: subject,
      classes: d.count,
      hours: Number((d.totalMinutes / 60).toFixed(1))
    })).sort((a, b) => b.hours - a.hours);
  }, [timetables]);

  // Conflict Advisor Insights
  const conflictAdvisorInsights = useMemo(() => {
    const list: { id: string, title: string, solution: string, type: 'room' | 'teacher', item: any, availableRooms: string[] }[] = [];
    
    Object.entries(conflicts).forEach(([id, rawCf]) => {
      const item = timetables.find(t => t.id === id);
      if (!item) return;
      
      const listCf = rawCf as any[];
      listCf.forEach(cf => {
        let solution = "";
        let availableRooms: string[] = [];
        if (cf.type === 'room') {
          // Suggest empty rooms during item's day & time
          const occupiedRoomsAtThisTime = timetables
            .filter(t => t.dayOfWeek === item.dayOfWeek && checkTimeOverlaps(item.startTime, item.endTime, t.startTime, t.endTime))
            .map(t => t.room?.trim().toLowerCase());
          
          availableRooms = distinctRooms.filter(r => !occupiedRoomsAtThisTime.includes(r.trim().toLowerCase()));
          if (availableRooms.length > 0) {
            solution = idt(
              `ដំណោះស្រាយ៖ អាចប្ដូរទៅបន្ទប់ [${availableRooms.join(', ')}] ព្រោះទំនេរនៅម៉ោងនេះ។`,
              `Solution: Move class to [${availableRooms.join(', ')}] which are unoccupied during this slot.`
            );
          } else {
            solution = idt(
              `ដំណោះស្រាយ៖ គួរផ្លាស់ប្ដូរម៉ោង ឬថ្ងៃសិក្សាផ្សេងព្រោះគ្រប់បន្ទប់ទាំងអស់ត្រូវបានប្រើប្រាស់។`,
              `Solution: Consider changing the time slot or day as all classrooms are booked.`
            );
          }
        } else if (cf.type === 'teacher') {
          solution = idt(
            `ដំណោះស្រាយ៖ ផ្លាស់ប្ដូរម៉ោងបង្រៀនរបស់គ្រូ ឬប្ដូរទៅថ្ងៃផ្សេងវិញ ដើម្បីជៀសវាងគ្រូជាន់ម៉ោងគ្នា។`,
            `Solution: Reschedule this slot to a different time or day to prevent double-booking the instructor.`
          );
        }
        
        list.push({
          id,
          title: `${item.subject} (${item.dayOfWeek} ${item.startTime}-${item.endTime})`,
          solution,
          type: cf.type as 'room' | 'teacher',
          item,
          availableRooms
        });
      });
    });
    
    // Deduplicate list by id + solution
    const uniqueList: typeof list = [];
    const seen = new Set<string>();
    list.forEach(x => {
      const key = `${x.id}-${x.solution}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueList.push(x);
      }
    });
    
    return uniqueList;
  }, [timetables, conflicts, distinctRooms]);

  return (
    <div className="w-full space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 px-1">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-200">
            <Calendar className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {idt("កាលវិភាគសិក្សា (Timetable)", "School Schedule & Timetable")}
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {idt("គ្រប់គ្រងការសិក្សា ការពារជាន់ម៉ោងគ្រូ និងបន្ទប់", "Prevent scheduling conflicts for rooms and instructors")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          {timetables.length > 0 && (
            <button 
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer border ${
                showAnalytics 
                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-md shadow-blue-100" 
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs"
              }`}
            >
              <BarChart2 className="w-4 h-4 text-blue-600" /> 
              {showAnalytics ? idt("លាក់ស្ថិតិវិភាគ", "Hide Analytics") : idt("បង្ហាញស្ថិតិវិភាគ", "Show Analytics")}
            </button>
          )}

          <button 
            onClick={() => { 
              setFormData({ 
                teacherId: "", 
                subject: "", 
                room: "", 
                dayOfWeek: dayOptions[0] || "ច័ន្ទ", 
                startTime: "07:00", 
                endTime: "08:00" 
              }); 
              setEditingId(null); 
              setErrorMsg(""); 
              setShowAddModal(true); 
            }} 
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {idt("បន្ថែមម៉ោងសិក្សា", "Add Schedule")}
          </button>
        </div>
      </div>

      {/* KPI Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Schedules */}
        <button 
          onClick={() => {
            setViewMode("list");
            setSearchTerm("");
            setSelectedTeacherId("");
            setSelectedDay("");
            setSelectedRoom("");
          }}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all relative overflow-hidden group text-left cursor-pointer active:scale-98"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-350 text-slate-800">
            <BookOpen className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-slate-400 block tracking-tight uppercase">
              {idt("ម៉ោងកាលវិភាគសរុប", "Total Slots")}
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-850">{stats.totalSchedules}</span>
            <span className="text-xs font-bold text-slate-400">{idt("ថ្នាក់រៀន", "Classes")}</span>
          </div>
        </button>

        {/* KPI 2: Scheduled Teachers */}
        <button 
          onClick={() => {
            setShowAnalytics(true);
            setAnalyticsTab("workload");
          }}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all relative overflow-hidden group text-left cursor-pointer active:scale-98"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-350 text-slate-800">
            <Users className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl transition-transform group-hover:scale-105">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-slate-400 block tracking-tight uppercase">
              {idt("គ្រូបង្រៀនសកម្ម", "Active Teachers")}
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-850">{stats.uniqueTeachers}</span>
            <span className="text-xs font-bold text-slate-400">{idt("នាក់", "Instructors")}</span>
          </div>
        </button>

        {/* KPI 3: Rooms used */}
        <button 
          onClick={() => {
            setShowAnalytics(true);
            setAnalyticsTab("utilization");
          }}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs hover:shadow-md hover:border-pink-200 hover:-translate-y-0.5 transition-all relative overflow-hidden group text-left cursor-pointer active:scale-98"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-350 text-slate-800">
            <Calendar className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl transition-transform group-hover:scale-105">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-slate-400 block tracking-tight uppercase">
              {idt("បន្ទប់កំពុងប្រើប្រាស់", "Active Rooms")}
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-850">{stats.uniqueRooms}</span>
            <span className="text-xs font-bold text-slate-400">{idt("បន្ទប់", "Classrooms")}</span>
          </div>
        </button>

        {/* KPI 4: Conflict Status */}
        <button 
          onClick={() => {
            setShowAnalytics(true);
            setAnalyticsTab("advisor");
          }}
          className={`p-5 rounded-3xl border shadow-2xs hover:shadow-md transition-all relative overflow-hidden group text-left cursor-pointer active:scale-98 ${
            stats.totalConflicts > 0 
              ? "bg-rose-50/10 border-rose-200 hover:border-rose-300 hover:bg-rose-50/20" 
              : "bg-white border-slate-100 hover:border-emerald-200"
          }`}
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-350 text-slate-800">
            <AlertTriangle className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-105 ${
              stats.totalConflicts > 0 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-emerald-50 text-emerald-600"
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-slate-400 block tracking-tight uppercase">
              {idt("បញ្ហាជាន់ម៉ោងគ្នា", "Conflicts / Overlaps")}
            </span>
          </div>
          <div className="mt-4">
            {stats.totalConflicts > 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-rose-600 animate-pulse">{stats.totalConflicts}</span>
                <span className="text-xs font-black text-rose-500 bg-rose-50 border border-rose-100/50 px-2 py-0.5 rounded-lg ml-1 shrink-0">
                  {idt("រកឃើញជាន់គ្នា", "Collisions")}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-base sm:text-lg font-black text-emerald-600 block truncate">{idt("គ្មានការជាន់គ្នាទេ", "Clean Schedule")}</span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Collapsible Analytics Section */}
      <AnimatePresence>
        {showAnalytics && timetables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm mb-6"
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-blue-50/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl shadow-sm border border-blue-50">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base sm:text-lg tracking-tight">
                    {idt("របាយការណ៍វិភាគកាលវិភាគ និងបន្ទប់សិក្សា", "Schedule Analytics & Room Utilization")}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-bold mt-1">
                    {idt("វិភាគអំពីបន្ទប់ដែលមមាញឹក ម៉ោងបង្រៀនរបស់គ្រូ និងជំនួយការដោះស្រាយបញ្ហាជាន់គ្នា", "Analyze room bookings, instructor workloads, and resolve conflicts automatically")}
                  </p>
                </div>
              </div>
              
              {/* Tabs selector */}
              <div className="flex items-center p-1.5 bg-slate-50 border border-slate-200/60 rounded-2xl self-stretch lg:self-auto shrink-0 shadow-2xs">
                <button
                  onClick={() => setAnalyticsTab("utilization")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    analyticsTab === "utilization" 
                      ? "bg-white text-blue-700 shadow-sm border border-slate-100" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 border border-transparent"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{idt("ការប្រើប្រាស់បន្ទប់", "Room Util")}</span>
                </button>
                <button
                  onClick={() => setAnalyticsTab("workload")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    analyticsTab === "workload" 
                      ? "bg-white text-blue-700 shadow-sm border border-slate-100" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 border border-transparent"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{idt("ម៉ោងបង្រៀនគ្រូ", "Teacher Loads")}</span>
                </button>
                <button
                  onClick={() => setAnalyticsTab("courses")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    analyticsTab === "courses" 
                      ? "bg-white text-blue-700 shadow-sm border border-slate-100" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 border border-transparent"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{idt("ការវិភាគវគ្គសិក្សា", "Course Loads")}</span>
                </button>
                <button
                  onClick={() => setAnalyticsTab("advisor")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    analyticsTab === "advisor" 
                      ? "bg-white text-blue-700 shadow-sm border border-slate-100" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 border border-transparent"
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>{idt("ជំនួយការដោះស្រាយ", "Conflict Advisor")}</span>
                </button>
              </div>
            </div>

            {/* Panel Body Content */}
            <div className="p-6 sm:p-8 bg-slate-50/40">
              {analyticsTab === "utilization" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Utilization Bar Chart Wrapper */}
                  <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-blue-500" />
                        {idt("ក្រាហ្វិកម៉ោងប្រើប្រាស់ក្នុងបន្ទប់នីមួយៗ", "Classrooms Total Scheduled Hours")}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {roomData.length} {idt("បន្ទប់", "Rooms")}
                      </span>
                    </div>
                    
                    {roomData.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        {idt("គ្មានទិន្នន័យបន្ទប់សិក្សាទេ", "No Classroom usage data available yet.")}
                      </div>
                    ) : (
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={roomData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="roomBarGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#2563eb" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                            <XAxis 
                              dataKey="name" 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                            />
                            <YAxis 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                            />
                            <RechartsTooltip
                              cursor={{ fill: '#f8fafc', radius: 8 }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-xl text-xs space-y-2 min-w-[160px] animate-fadeIn">
                                      <p className="font-extrabold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs" />
                                        {idt("បន្ទប់ ", "Room ")}{data.name}
                                      </p>
                                      <p className="font-bold flex justify-between gap-6 text-slate-500">
                                        <span>{idt("ម៉ោងសិក្សាសរុប៖", "Total Hours:")}</span>
                                        <span className="text-blue-600 font-black">{data.hours}h</span>
                                      </p>
                                      <p className="font-bold flex justify-between gap-6 text-slate-500">
                                        <span>{idt("ចំនួនថ្នាក់សិក្សា៖", "Classes:")}</span>
                                        <span className="text-blue-600 font-black">{data.classes}</span>
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="hours" radius={[8, 8, 0, 0]} barSize={28} fill="url(#roomBarGrad)">
                              {roomData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill="url(#roomBarGrad)"
                                  className="transition-all duration-300 hover:opacity-85"
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
 
                  {/* Summary progress list of utilization */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-blue-500 rounded-full" />
                        {idt("បន្ទប់ដែលមានការប្រើប្រាស់ខ្ពស់", "Busiest Classrooms")}
                      </h4>
                      <div className="space-y-3">
                        {roomData.slice(0, 4).map((room, i) => {
                           const colors = [
                             {bg: 'bg-blue-500', from: 'from-blue-500', to: 'to-blue-600'},
                             {bg: 'bg-blue-500', from: 'from-blue-500', to: 'to-blue-600'},
                             {bg: 'bg-emerald-500', from: 'from-emerald-500', to: 'to-emerald-600'},
                             {bg: 'bg-amber-500', from: 'from-amber-500', to: 'to-amber-600'},
                           ];
                           const c = colors[i % colors.length];
                           const maxHours = roomData[0]?.hours || 1;
                           const percent = (room.hours / maxHours) * 100;
                           return (
                             <div key={i} className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl space-y-2.5 transition-all group duration-200">
                               <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                 <span className="flex items-center gap-2">
                                   <span className={`w-2 h-2 rounded-full ${c.bg} shadow-xs shrink-0 group-hover:scale-125 transition-transform`} />
                                   <span className="font-extrabold text-slate-800">{idt("បន្ទប់ ", "Room ")}{room.name}</span>
                                 </span>
                                 <span className="text-[10px] font-bold text-slate-500 font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-3xs">
                                   <span className="text-slate-800 font-black">{room.hours}h</span>
                                   <span className="text-slate-300 mx-1">/</span>
                                   <span>{room.classes} {idt("ថ្នាក់", "Classes")}</span>
                                 </span>
                               </div>
                               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${Math.max(10, Math.min(100, percent))}%` }}
                                   transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.08 }}
                                   className={`bg-blue-500 h-full rounded-full`}
                                 />
                               </div>
                             </div>
                           );
                        })}
                        {roomData.length === 0 && (
                          <p className="text-xs text-slate-400 italic font-bold">{idt("មិនទាន់មានទិន្នន័យប្រើប្រាស់", "No room data calculated yet.")}</p>
                        )}
                      </div>
                    </div>
 
                    <div className="pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{idt("ការគណនាបន្ទប់មមាញឹកគឺផ្អែកលើផលបូកនៃរយៈពេលសិក្សា (ជាម៉ោង) នៃថ្នាក់រៀនទាំងអស់ក្នុងបន្ទប់នោះ។", "Busiest rooms are calculated based on the sum of scheduled class durations in hours.")}</span>
                    </div>
                  </div>
                </div>
              )}

              {analyticsTab === "workload" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Workload Bar Chart Wrapper */}
                  <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-500" />
                        {idt("ស្ថិតិម៉ោងបង្រៀនរបស់គ្រូនីមួយៗ", "Active Instructors Total Scheduled Hours")}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {teacherLoadData.length} {idt("គ្រូ", "Teachers")}
                      </span>
                    </div>
                    
                    {teacherLoadData.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        {idt("គ្មានទិន្នន័យគ្រូបង្រៀនសកម្មទេ", "No instructor teaching data available yet.")}
                      </div>
                    ) : (
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={teacherLoadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="teacherBarGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f472b6" />
                                <stop offset="100%" stopColor="#db2777" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                            <XAxis 
                              dataKey="name" 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                            />
                            <YAxis 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                            />
                            <RechartsTooltip
                              cursor={{ fill: '#f8fafc', radius: 8 }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-xl text-xs space-y-2 min-w-[160px] animate-fadeIn">
                                      <p className="font-extrabold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-xs" />
                                        {data.name}
                                      </p>
                                      <p className="font-bold flex justify-between gap-6 text-slate-500">
                                        <span>{idt("ម៉ោងបង្រៀនសរុប៖", "Total Teaching Hours:")}</span>
                                        <span className="text-pink-600 font-black">{data.hours}h</span>
                                      </p>
                                      <p className="font-bold flex justify-between gap-6 text-slate-500">
                                        <span>{idt("ចំនួនថ្នាក់បង្រៀន៖", "Number of Classes:")}</span>
                                        <span className="text-emerald-600 font-black">{data.classes}</span>
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="hours" radius={[8, 8, 0, 0]} barSize={28} fill="url(#teacherBarGrad)">
                              {teacherLoadData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill="url(#teacherBarGrad)"
                                  className="transition-all duration-300 hover:opacity-85"
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Day Workload summary List */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-pink-500 rounded-full" />
                        {idt("ម៉ោងសិក្សាតាមថ្ងៃនីមួយៗ", "Weekly Load Distribution")}
                      </h4>
                      <div className="space-y-2">
                        {dayDistributionData.map((day, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl text-xs font-bold transition-all duration-200">
                            <span className="text-slate-700 font-extrabold flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              {day.name}
                            </span>
                            <span className="text-slate-500 font-mono text-[11px] flex items-center gap-2">
                              <strong className="text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-3xs">{day.hours}h</strong>
                              <span className="text-slate-300">|</span>
                              <span>{day.classes} {idt("ថ្នាក់", "Slots")}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{idt("របាយការណ៍នេះជួយអោយអ្នកគ្រប់គ្រង អាចបែងចែកការងារបង្រៀនរបស់គ្រូៗអោយស្មើភាពគ្នា ជៀសវាងការលើសម៉ោងហួសកម្រិត។", "This workload summary helps administrators balance teaching tasks fairly across instructors to prevent burnout.")}</span>
                    </div>
                  </div>
                </div>
              )}

              {analyticsTab === "courses" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Subject Scheduled Hours Chart Wrapper */}
                  <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        {idt("ម៉ោងបង្រៀនសរុបតាមវគ្គសិក្សា", "Courses Total Scheduled Hours")}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {subjectLoadData.length} {idt("វគ្គសិក្សា", "Courses")}
                      </span>
                    </div>
                    
                    {subjectLoadData.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        {idt("គ្មានទិន្នន័យវគ្គសិក្សាទេ", "No course schedule data available yet.")}
                      </div>
                    ) : (
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={subjectLoadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="subjectBarGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                            <XAxis 
                              dataKey="name" 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                            />
                            <YAxis 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                            />
                            <RechartsTooltip
                              cursor={{ fill: '#f8fafc', radius: 8 }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-xl text-xs space-y-2 min-w-[160px] animate-fadeIn">
                                      <p className="font-extrabold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                                        {data.name}
                                      </p>
                                      <p className="font-bold flex justify-between gap-6 text-slate-500">
                                        <span>{idt("ម៉ោងសិក្សាសរុប៖", "Total Hours:")}</span>
                                        <span className="text-emerald-600 font-black">{data.hours}h</span>
                                      </p>
                                      <p className="font-bold flex justify-between gap-6 text-slate-500">
                                        <span>{idt("ចំនួនថ្នាក់សិក្សា៖", "Classes:")}</span>
                                        <span className="text-blue-600 font-black">{data.classes}</span>
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="hours" radius={[8, 8, 0, 0]} barSize={28} fill="url(#subjectBarGrad)">
                              {subjectLoadData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill="url(#subjectBarGrad)"
                                  className="transition-all duration-300 hover:opacity-85"
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Sidebar stats panel */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-emerald-500 rounded-full" />
                        {idt("វគ្គសិក្សាដែលមានសកម្មភាពច្រើនជាងគេ", "Most Scheduled Courses")}
                      </h4>
                      <div className="space-y-3">
                        {subjectLoadData.slice(0, 4).map((sub, i) => {
                           const colors = [
                             {bg: 'bg-emerald-500', from: 'from-emerald-500', to: 'to-emerald-600'},
                             {bg: 'bg-cyan-500', from: 'from-cyan-500', to: 'to-cyan-600'},
                             {bg: 'bg-blue-500', from: 'from-blue-500', to: 'to-blue-600'},
                             {bg: 'bg-amber-500', from: 'from-amber-500', to: 'to-amber-600'},
                           ];
                           const c = colors[i % colors.length];
                           const maxHours = subjectLoadData[0]?.hours || 1;
                           const percent = (sub.hours / maxHours) * 100;
                           return (
                             <div key={i} className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl space-y-2.5 transition-all group duration-200">
                               <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                 <span className="flex items-center gap-2 truncate">
                                   <span className={`w-2 h-2 rounded-full ${c.bg} shadow-xs shrink-0 group-hover:scale-125 transition-transform`} />
                                   <span className="font-extrabold text-slate-800 truncate">{sub.name}</span>
                                 </span>
                                 <span className="text-[10px] font-bold text-slate-500 font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-3xs shrink-0">
                                   <span className="text-slate-800 font-black">{sub.hours}h</span>
                                   <span className="text-slate-300 mx-1">/</span>
                                   <span>{sub.classes} {idt("ថ្នាក់", "Classes")}</span>
                                 </span>
                               </div>
                               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${Math.max(10, Math.min(100, percent))}%` }}
                                   transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.08 }}
                                   className={`bg-blue-500 h-full rounded-full`}
                                 />
                               </div>
                             </div>
                           );
                        })}
                        {subjectLoadData.length === 0 && (
                          <p className="text-xs text-slate-400 italic font-bold">{idt("មិនទាន់មានទិន្នន័យវគ្គសិក្សា", "No course schedule data calculated yet.")}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {idt("ទិន្នន័យវគ្គសិក្សាត្រូវបានរួមបញ្ចូលជាមួយម៉ូឌុល 'វគ្គសិក្សា' ដើម្បីធានាបាននូវការកក់កាលវិភាគសិក្សាត្រឹមត្រូវ និងមានរបៀបរៀបរយ។", "Course schedule data is integrated with the Courses module to ensure correct academic scheduling alignment.")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {analyticsTab === "advisor" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-rose-500 animate-pulse" />
                      {idt("ជំនួយការដោះស្រាយបញ្ហាជាន់ម៉ោងគ្នា", "Intelligent Conflict Resolution & Scheduling Advice")}
                    </h4>
                  </div>

                  {conflictAdvisorInsights.length === 0 ? (
                    <div className="bg-emerald-50/40 border border-emerald-100 p-8 rounded-3xl text-center space-y-4 flex flex-col items-center justify-center max-w-2xl mx-auto">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200/30 shadow-md animate-bounce">
                        <Check className="w-7 h-7 stroke-[3px]" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-emerald-800 text-base">{idt("កាលវិភាគល្អឥតខ្ចោះ គ្មានការជាន់ម៉ោងគ្នាឡើយ!", "Perfect Schedule, Zero Overlaps Detected!")}</h5>
                        <p className="text-slate-500 text-xs mt-1.5 font-bold leading-relaxed max-w-md mx-auto">
                          {idt("ប្រព័ន្ធបានត្រួតពិនិត្យរួចរាល់ និងរកឃើញថាគ្រូបង្រៀន និងបន្ទប់សិក្សានៅក្នុងសាលាទាំងអស់មិនមានការជាន់គ្នានោះទេ។ អ្នកអាចទាញយក Excel បានដោយសុវត្ថិភាព។", "The scheduler scanned all slots and confirmed no classrooms or teachers are double-booked. It is perfectly safe to publish.")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-none">
                      {conflictAdvisorInsights.map((advisor, i) => (
                        <div key={i} className="p-4 sm:p-5 bg-white border border-slate-100 rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-rose-100 hover:shadow-xs transition-all duration-300">
                          <div className="space-y-2 max-w-sm shrink-0">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg uppercase">
                              <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                              {advisor.type === 'room' ? idt("ជាន់បន្ទប់", "Room Conflict") : idt("គ្រូជាន់ម៉ោង", "Teacher Overlap")}
                            </span>
                            <h5 className="font-extrabold text-slate-800 text-sm">{advisor.title}</h5>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-1 justify-end w-full">
                            <p className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl leading-relaxed flex-1">
                              <span className="text-emerald-600 font-extrabold block text-[10px] uppercase tracking-wider mb-0.5">{idt("ដំណោះស្រាយស្នើឡើង៖", "Suggested Solution:")}</span>
                              {advisor.solution}
                            </p>
                            
                            {advisor.type === 'room' && advisor.availableRooms.length > 0 ? (
                              <button
                                onClick={() => handleAutoResolveRoomConflict(advisor.item, advisor.availableRooms[0])}
                                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black rounded-2xl shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>{idt(`ប្ដូរទៅបន្ទប់ ${advisor.availableRooms[0]}`, `Move to Rm ${advisor.availableRooms[0]}`)}</span>
                              </button>
                            ) : advisor.type === 'teacher' ? (
                              <button
                                onClick={() => openEdit(advisor.item)}
                                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-black rounded-2xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                                <span>{idt("កែប្រែកាលវិភាគ", "Reschedule")}</span>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Filters & View Toggle Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative z-30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Left View Mode Toggle Buttons */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full">
            <div className="p-1 bg-slate-100/80 rounded-xl flex items-center shrink-0">
              <button 
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid" 
                    ? "bg-white text-blue-600 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{idt("ទិដ្ឋភាពប្រចាំសប្តាហ៍", "Weekly Grid")}</span>
              </button>
              <button 
                onClick={() => setViewMode("matrix")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "matrix" 
                    ? "bg-white text-blue-600 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{idt("តារាងម៉ោងសិក្សា", "Schedule Matrix")}</span>
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list" 
                    ? "bg-white text-blue-600 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>{idt("បញ្ជីកាលវិភាគ", "List Table")}</span>
              </button>
            </div>

            {viewMode === "grid" && (
              <div className="p-1 bg-blue-50/70 border border-blue-100/30 rounded-xl flex items-center animate-fadeIn shrink-0">
                <span className="text-[10px] font-black text-blue-500 px-2.5 uppercase tracking-wider">{idt("តម្រៀបតាម៖", "Sort:")}</span>
                <button 
                  onClick={() => setGroupByMode("day")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    groupByMode === "day" 
                      ? "bg-blue-600 text-white shadow-2xs" 
                      : "text-blue-600 hover:bg-blue-50/60"
                  }`}
                >
                  {idt("ថ្ងៃសិក្សា", "Days")}
                </button>
                <button 
                  onClick={() => setGroupByMode("room")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    groupByMode === "room" 
                      ? "bg-blue-600 text-white shadow-2xs" 
                      : "text-blue-600 hover:bg-blue-50/60"
                  }`}
                >
                  {idt("បន្ទប់", "Rooms")}
                </button>
                <button 
                  onClick={() => setGroupByMode("teacher")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    groupByMode === "teacher" 
                      ? "bg-blue-600 text-white shadow-2xs" 
                      : "text-blue-600 hover:bg-blue-50/60"
                  }`}
                >
                  {idt("គ្រូបង្រៀន", "Teachers")}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-row items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportExcel}
                disabled={filteredTimetables.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-1.5 h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200/40 font-black text-xs transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                title={idt("ទាញយកជា Excel", "Export to Excel")}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{idt("ទាញយក Excel", "Export Excel")}</span>
              </button>
            </div>

            {/* Right Inputs & Search & Selects */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="relative shrink-0">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={idt("ស្វែងរកមុខវិជ្ជា/គ្រូ/បន្ទប់...", "Search subject/teacher/room...")} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full min-w-[160px] sm:w-52 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs transition-all h-9"
                />
              </div>

              {/* Filter by Day */}
              <div className="flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpenFilterDayDropdown(!isOpenFilterDayDropdown);
                      setIsOpenFilterTeacherDropdown(false);
                      setIsOpenFilterRoomDropdown(false);
                    }}
                    className={`bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2 py-1.5 font-bold text-[11px] sm:text-xs flex items-center justify-between gap-1 cursor-pointer transition-all hover:bg-white h-9 min-w-[90px] max-w-[120px] ${
                      isOpenFilterDayDropdown ? "border-blue-500 ring-2 ring-blue-500/10" : ""
                    }`}
                  >
                    <span className="truncate">{selectedDay || idt("ថ្ងៃសិក្សាទាំងអស់", "All Days")}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpenFilterDayDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {isOpenFilterDayDropdown && (
                    <>
                      <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenFilterDayDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 sm:left-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs w-36 overflow-hidden"
                      >
                        <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-1 dropdown-scrollbar">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDay("");
                              setIsOpenFilterDayDropdown(false);
                            }}
                            className={`w-full text-left py-1 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                              selectedDay === "" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            {idt("ថ្ងៃសិក្សាទាំងអស់", "All Days")}
                          </button>
                          {dayOptions.map(day => (
                            <button
                              type="button"
                              key={day}
                              onClick={() => {
                                setSelectedDay(day);
                                setIsOpenFilterDayDropdown(false);
                              }}
                              className={`w-full text-left py-1 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                                selectedDay === day ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>

              {/* Filter by Teacher */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpenFilterTeacherDropdown(!isOpenFilterTeacherDropdown);
                    setIsOpenFilterDayDropdown(false);
                    setIsOpenFilterRoomDropdown(false);
                  }}
                  className={`bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2 py-1.5 font-bold text-[11px] sm:text-xs flex items-center justify-between gap-1 cursor-pointer transition-all hover:bg-white h-9 min-w-[100px] max-w-[130px] ${
                    isOpenFilterTeacherDropdown ? "border-blue-500 ring-2 ring-blue-500/10" : ""
                  }`}
                >
                  <span className="truncate">
                    {selectedTeacherId 
                      ? (teachers.find((t: any) => t.id === selectedTeacherId)?.nameKh || teachers.find((t: any) => t.id === selectedTeacherId)?.nameEn || teachers.find((t: any) => t.id === selectedTeacherId)?.firstNameEn || selectedTeacherId)
                      : idt("គ្រូបង្រៀនទាំងអស់", "All Teachers")}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpenFilterTeacherDropdown ? "rotate-180" : ""}`} />
                </button>

                {isOpenFilterTeacherDropdown && (
                  <>
                    <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenFilterTeacherDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 sm:left-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs w-40 overflow-hidden"
                    >
                      <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-1 dropdown-scrollbar">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTeacherId("");
                            setIsOpenFilterTeacherDropdown(false);
                          }}
                          className={`w-full text-left py-1 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                            selectedTeacherId === "" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {idt("គ្រូបង្រៀនទាំងអស់", "All Teachers")}
                        </button>
                        {teachers.filter((t: any) => t.status === 'ACTIVE' || t.status === 'LEAVE').map((t: any) => {
                          const isSelected = selectedTeacherId === t.id;
                          return (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => {
                                setSelectedTeacherId(t.id);
                                setIsOpenFilterTeacherDropdown(false);
                              }}
                              className={`w-full text-left py-1 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                                isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              {t.nameKh || t.nameEn || t.firstNameEn}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Filter by Room */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpenFilterRoomDropdown(!isOpenFilterRoomDropdown);
                    setIsOpenFilterDayDropdown(false);
                    setIsOpenFilterTeacherDropdown(false);
                  }}
                  className={`bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2 py-1.5 font-bold text-[11px] sm:text-xs flex items-center justify-between gap-1 cursor-pointer transition-all hover:bg-white h-9 min-w-[100px] max-w-[130px] ${
                    isOpenFilterRoomDropdown ? "border-blue-500 ring-2 ring-blue-500/10" : ""
                  }`}
                >
                  <span className="truncate">{selectedRoom || idt("បន្ទប់ទាំងអស់", "All Classrooms")}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpenFilterRoomDropdown ? "rotate-180" : ""}`} />
                </button>

                {isOpenFilterRoomDropdown && (
                  <>
                    <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenFilterRoomDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 sm:left-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs w-36 overflow-hidden"
                    >
                      <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-1 dropdown-scrollbar">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRoom("");
                            setIsOpenFilterRoomDropdown(false);
                          }}
                          className={`w-full text-left py-1 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                            selectedRoom === "" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {idt("បន្ទប់ទាំងអស់", "All Classrooms")}
                        </button>
                        {distinctRooms.map(room => {
                          const isSelected = selectedRoom === room;
                          return (
                            <button
                              type="button"
                              key={room}
                              onClick={() => {
                                setSelectedRoom(room);
                                setIsOpenFilterRoomDropdown(false);
                              }}
                              className={`w-full text-left py-1 px-2 rounded-lg transition-all text-[11px] sm:text-xs font-bold cursor-pointer ${
                                isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              {room}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
                
              {(searchTerm || selectedTeacherId || selectedDay || selectedRoom) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTeacherId("");
                    setSelectedDay("");
                    setSelectedRoom("");
                  }}
                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                  title={idt("សម្អាតតម្រង", "Clear Filters")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Active Filter Badges */}
        {(searchTerm || selectedTeacherId || selectedDay || selectedRoom) && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100/70">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">
              {idt("តម្រងសកម្ម៖", "Active Filters:")}
            </span>
            
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-lg text-[10px] font-bold shadow-3xs">
                <span>{idt("ស្វែងរក៖", "Search:")} "{searchTerm}"</span>
                <button onClick={() => setSearchTerm("")} className="hover:text-rose-500 ml-1 cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            
            {selectedDay && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-lg text-[10px] font-bold shadow-3xs">
                <span>{idt("ថ្ងៃ៖", "Day:")} {selectedDay}</span>
                <button onClick={() => setSelectedDay("")} className="hover:text-rose-500 ml-1 cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            
            {selectedTeacherId && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-lg text-[10px] font-bold shadow-3xs">
                <span>
                  {idt("គ្រូ៖", "Teacher:")} {
                    teachers.find((tc: any) => tc.id === selectedTeacherId)?.nameKh || 
                    teachers.find((tc: any) => tc.id === selectedTeacherId)?.nameEn || 'N/A'
                  }
                </span>
                <button onClick={() => setSelectedTeacherId("")} className="hover:text-rose-500 ml-1 cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            
            {selectedRoom && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-lg text-[10px] font-bold shadow-3xs">
                <span>{idt("បន្ទប់៖", "Room:")} {selectedRoom}</span>
                <button onClick={() => setSelectedRoom("")} className="hover:text-rose-500 ml-1 cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedTeacherId("");
                setSelectedDay("");
                setSelectedRoom("");
              }}
              className="text-[10px] font-black text-rose-600 hover:text-rose-750 bg-rose-50 hover:bg-rose-100/70 border border-rose-200/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ml-auto"
            >
              {idt("លុបតម្រងទាំងអស់", "Clear All")}
            </button>
          </div>
        )}

      </div>

      {/* CSS Print Stylesheet injected inline for instant execution */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide all components except the main printable area */
          body * {
            visibility: hidden !important;
          }
          #printable-timetable-area, #printable-timetable-area * {
            visibility: visible !important;
          }
          #printable-timetable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Ensure column and text backgrounds print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          /* Reset page margins */
          @page {
            margin: 1.5cm;
            size: landscape;
          }
        }
      `}} />

      {/* Main Study Schedule Views Container */}
      <div id="printable-timetable-area" className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden min-h-[400px] relative">
        {/* Printable Official Header */}
        <div className="hidden print:block mb-8 text-center border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-widest">{idt("ព្រះរាជាណាចក្រកម្ពុជា", "Kingdom of Cambodia")}</h1>
              <h2 className="text-[9px] sm:text-[10px] font-bold text-slate-600 mt-0.5 tracking-wider">{idt("ជាតិ សាសនា ព្រះមហាក្សត្រ", "Nation Religion King")}</h2>
              <div className="h-0.5 w-16 bg-slate-300 mt-1" />
            </div>
            <div className="text-center">
              <h1 className="text-sm sm:text-base font-black text-slate-800">{idt("វិទ្យាស្ថានព័ត៌មានវិទ្យា និងបច្ចេកវិទ្យា", "Institute of Information Technology")}</h1>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 mt-0.5">{idt("ផ្នែករៀបចំកាលវិភាគសិក្សា និងបន្ទប់", "Department of Academic Academic Scheduling & Classrooms")}</p>
            </div>
            <div className="text-right text-[10px] sm:text-xs font-bold text-slate-500">
              <p>{idt("កាលបរិច្ឆេទ៖", "Date Created:")} {new Date().toLocaleDateString('kh-KH')}</p>
              <p>{idt("ជំនាន់៖", "Semester:")} {idt("ឆមាសទី ១ / ២០២៦", "Semester I / 2026")}</p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg sm:text-xl font-black text-slate-850 tracking-tight">{idt("តារាងកាលវិភាគ និងម៉ោងបង្រៀនផ្លូវការ", "Official Academic Timetable & Schedule")}</h2>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{idt(`ទិដ្ឋភាព៖ ${viewMode === 'list' ? 'តារាងបញ្ជី' : viewMode === 'grid' ? 'ប្រចាំសប្ដាហ៍' : 'ម៉ាទ្រីសកាលវិភាគ'}`, `View mode: ${viewMode}`)}</p>
          </div>
        </div>
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-slate-400">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold text-slate-500">{idt("កំពុងទាញយកទិន្នន័យកាលវិភាគ...", "Fetching timetable slots...")}</p>
          </div>
        ) : timetables.length === 0 ? (
          <div className="py-24 text-center px-4">
            <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-blue-100 shadow-inner">
              <Calendar className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">{idt("គ្មានទិន្នន័យកាលវិភាគទេ", "No Timetable Schedules Found")}</h3>
            <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              {idt("មិនទាន់មានម៉ោងសិក្សាដែលបានកំណត់ឡើងឡើយ។ សូមចុចបន្ថែមម៉ោងសិក្សាថ្មី ឬបញ្ចូលទិន្នន័យគំរូដើម្បីសាកល្បង។", "There are no teaching hours added yet. Click 'Add Schedule' or click the seed button to see it in action.")}
            </p>
            <div className="flex justify-center gap-3 mt-8">
              <button 
                onClick={() => setShowAddModal(true)} 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {idt("បន្ថែមម៉ោងសិក្សាថ្មី", "Add New Class Time")}
              </button>
            </div>
          </div>
        ) : filteredTimetables.length === 0 ? (
          <div className="py-24 text-center px-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-700">{idt("ស្វែងរកមិនឃើញលទ្ធផល", "No Matching Records")}</h3>
            <p className="text-slate-400 text-xs mt-1.5">{idt("សូមព្យាយាមផ្លាស់ប្តូរពាក្យគន្លឹះ ឬសម្អាតតម្រងស្វែងរក។", "Try changing keywords or resetting your filter choices.")}</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTeacherId("");
                setSelectedDay("");
                setSelectedRoom("");
              }}
              className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              {idt("សម្អាតតម្រងទាំងអស់", "Reset Filters")}
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* List View - Re-styled Modern Table */
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider">
                  <th className="px-5 py-3.5">{idt("ល.រ", "No.")}</th>
                  <th className="px-5 py-3.5">{idt("គ្រូបង្រៀន", "Teacher")}</th>
                  <th className="px-5 py-3.5">{idt("មុខវិជ្ជា & បន្ទប់", "Subject & Room")}</th>
                  <th className="px-5 py-3.5">{idt("ថ្ងៃសិក្សា", "Day")}</th>
                  <th className="px-5 py-3.5 text-center">{idt("ម៉ោងសិក្សា", "Class Hours")}</th>
                  <th className="px-5 py-3.5 text-right">{idt("សកម្មភាព", "Action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-sans">
                {filteredTimetables.map((t, index) => {
                  const hasConflict = conflicts[t.id] && conflicts[t.id].length > 0;
                  const initials = (t.teacher?.nameEn || t.teacher?.firstNameEn || '?').slice(0, 2).toUpperCase();
                  
                  const colors = [
                    'bg-blue-50 border-blue-100/70 text-blue-700',
                    'bg-blue-50 border-blue-100/70 text-blue-700',
                    'bg-emerald-50 border-emerald-150/70 text-emerald-700',
                    'bg-amber-50 border-amber-150/70 text-amber-700',
                    'bg-sky-50 border-sky-150/70 text-sky-700',
                    'bg-rose-50 border-rose-150/70 text-rose-700'
                  ];
                  const colorIdx = (t.teacher?.teacherId?.charCodeAt(t.teacher?.teacherId?.length - 1) || index) % colors.length;
                  const avatarColor = colors[colorIdx];

                  const roomConflicts = conflicts[t.id] || [];
                  const hasRoomConflict = roomConflicts.some(cf => cf.type === 'room');
                  let recommendedRoom: string | null = null;

                  if (hasRoomConflict) {
                    const occupiedRooms = timetables
                      .filter(x => x.id !== t.id && x.dayOfWeek === t.dayOfWeek && checkTimeOverlaps(t.startTime, t.endTime, x.startTime, x.endTime))
                      .map(x => x.room?.trim().toLowerCase());
                    
                    const freeRooms = distinctRooms.filter(r => r && !occupiedRooms.includes(r.trim().toLowerCase()));
                    if (freeRooms.length > 0) {
                      recommendedRoom = freeRooms[0];
                    }
                  }
                  
                  return (
                    <tr 
                      key={t.id} 
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        hasConflict ? "bg-rose-50/10" : ""
                      }`}
                    >
                      <td className="px-5 py-3 font-bold text-slate-400 font-mono w-12">{index + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-[10px] shadow-3xs uppercase shrink-0 ${avatarColor}`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 leading-tight">
                              {t.teacher?.nameKh || t.teacher?.nameEn || t.teacher?.firstNameEn}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {t.teacher?.teacherId || t.teacherId?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{t.subject}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            {idt("បន្ទប់៖", "Room:")} <strong className="text-slate-700">{t.room}</strong>
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-black text-slate-700 bg-slate-100 border border-slate-200/40 px-2.5 py-1 rounded-lg text-xs shadow-3xs">
                          {t.dayOfWeek}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-black text-blue-600 bg-blue-50/60 border border-blue-100/50 px-3 py-1 rounded-xl text-xs flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {t.startTime} - {t.endTime}
                          </span>
                          {hasConflict && (
                            <div className="mt-1 flex flex-col gap-0.5 max-w-[200px]">
                              {conflicts[t.id].map((cf, cidx) => (
                                <span 
                                  key={cidx} 
                                  className="text-[9px] font-extrabold text-rose-600 bg-rose-50 border border-rose-100/50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                                >
                                  <AlertCircle className="w-2.5 h-2.5 shrink-0 animate-pulse text-rose-500" />
                                  <span className="truncate">{cf.detail}</span>
                                </span>
                              ))}

                              {recommendedRoom && (
                                <button 
                                  onClick={() => handleAutoResolveRoomConflict(t, recommendedRoom!)}
                                  className="mt-1 text-[9px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-150 border border-emerald-250/30 px-2 py-0.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-102 active:scale-98"
                                  title={idt("ចុចដើម្បីផ្លាស់ប្ដូរទៅបន្ទប់នេះភ្លាមៗ", "Click to change to this room instantly")}
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                  <span>{idt(`ប្ដូរទៅបន្ទប់ [${recommendedRoom}] (ទំនេរ)`, `Switch to Room [${recommendedRoom}]`)}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDuplicateSchedule(t)} 
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200/30 transition-all cursor-pointer shadow-3xs"
                            title={idt("ចម្លងកាលវិភាគ", "Duplicate Schedule")}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => openEdit(t)} 
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200/30 transition-all cursor-pointer shadow-3xs"
                            title={idt("កែប្រែកាលវិភាគ", "Edit Schedule")}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(t.id)} 
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200/30 transition-all cursor-pointer shadow-3xs"
                            title={idt("លុបកាលវិភាគ", "Delete Schedule")}
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
        ) : viewMode === "grid" ? (
          /* Weekly Grid View - Professional Bento Box Cards with dynamic grouping */
          <div className="p-5 xl:p-6 bg-slate-50/50 animate-fadeIn">
            {groupByMode === "day" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-5">
                {dayOptions.map(day => {
                  const slots = timetablesByDay[day] || [];
                  const isActiveFilterDay = !selectedDay || selectedDay === day;
                  
                  return (
                    <div 
                      key={day} 
                      className={`flex flex-col bg-white rounded-3xl border transition-all duration-300 ${
                        isActiveFilterDay 
                          ? 'border-slate-200 shadow-sm opacity-100' 
                          : 'border-slate-100 opacity-50 hover:opacity-100'
                      }`}
                    >
                      {/* Header of Column (Day title) */}
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 text-sm tracking-tight">{day}</span>
                        <span className="font-mono text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100/50 px-2 py-0.5 rounded-lg shadow-2xs">
                          {slots.length}
                        </span>
                      </div>

                      {/* Class cards body list */}
                      <div className="p-4 space-y-4 flex-1 min-h-[160px]">
                        {slots.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                              <Calendar className="w-4 h-4 text-slate-300" />
                            </div>
                            <span className="text-xs font-bold text-slate-400">{idt("គ្មានម៉ោងទេ", "No classes")}</span>
                          </div>
                        ) : (
                          slots.map(t => {
                            const hasConflict = conflicts[t.id] && conflicts[t.id].length > 0;
                            
                            return (
                              <div 
                                key={t.id} 
                                className={`p-4 rounded-2xl border text-left relative group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${
                                  hasConflict 
                                    ? "border-rose-200 bg-rose-50/40 ring-1 ring-rose-200" 
                                    : "border-slate-200/70 bg-white hover:border-blue-300"
                                }`}
                              >
                                {/* Subject title */}
                                <p className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2" title={t.subject}>
                                  {t.subject}
                                </p>

                                {/* Time period */}
                                <div className="flex items-center gap-1.5 mt-2.5">
                                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 text-blue-600 shrink-0">
                                    <Clock className="w-3 h-3" />
                                  </span>
                                  <p className="text-[11px] font-black text-slate-700">
                                    {t.startTime} - {t.endTime}
                                  </p>
                                </div>

                                {/* Instructor */}
                                <div className="flex items-center gap-1.5 mt-2">
                                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 text-blue-600 shrink-0">
                                    <User className="w-3 h-3" />
                                  </span>
                                  <p className="text-[11px] font-bold text-slate-600 truncate">
                                    {t.teacher?.nameKh || t.teacher?.firstNameEn || idt("គ្មានគ្រូ", "No teacher")}
                                  </p>
                                </div>

                                {/* Room indicator & Actions */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-1 rounded-lg uppercase tracking-tight flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {t.room}
                                  </span>
                                  
                                  {/* Quick actions floating */}
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => openEdit(t)}
                                      className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => setDeleteConfirmId(t.id)}
                                      className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Conflict Alerts */}
                                {hasConflict && (
                                  <div className="mt-3 pt-2 border-t border-rose-100 space-y-1.5 animate-fadeIn">
                                    {conflicts[t.id].map((cf, cidx) => (
                                      <span 
                                        key={cidx} 
                                        className="text-[9px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200/60 px-1.5 py-1 rounded-md flex items-center gap-1 block leading-none truncate"
                                        title={cf.detail}
                                      >
                                        <AlertCircle className="w-2.5 h-2.5 shrink-0 text-rose-500 animate-pulse" />
                                        {cf.type === 'room' ? idt("ជាន់បន្ទប់", "Room collision") : idt("គ្រូជាន់ម៉ោង", "Teacher conflict")}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {groupByMode === "room" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {distinctRooms.map(room => {
                  const slots = timetablesByRoom[room] || [];
                  const isActiveRoom = !selectedRoom || selectedRoom.toLowerCase() === room.toLowerCase();
                  
                  return (
                    <div 
                      key={room} 
                      className={`flex flex-col bg-white rounded-3xl border transition-all duration-300 ${
                        isActiveRoom 
                          ? 'border-slate-200 shadow-sm opacity-100' 
                          : 'border-slate-100 opacity-50 hover:opacity-100'
                      }`}
                    >
                      {/* Column Header */}
                      <div className="p-4 border-b border-slate-100 bg-blue-50/50 rounded-t-3xl flex items-center justify-between">
                        <span className="font-extrabold text-blue-900 text-sm tracking-tight flex items-center gap-2">
                          <span className="p-1 bg-white rounded-lg shadow-2xs border border-blue-100 text-blue-600">
                            <MapPin className="w-3.5 h-3.5" />
                          </span>
                          {room}
                        </span>
                        <span className="font-mono text-[10px] font-black text-blue-600 bg-white border border-blue-200/50 px-2 py-0.5 rounded-lg shadow-2xs">
                          {slots.length}
                        </span>
                      </div>

                      {/* Body List */}
                      <div className="p-4 space-y-4 flex-1 min-h-[160px]">
                        {slots.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                              <Calendar className="w-4 h-4 text-slate-300" />
                            </div>
                            <span className="text-xs font-bold text-slate-400">{idt("គ្មានម៉ោង", "No Slots")}</span>
                          </div>
                        ) : (
                          slots.map(t => {
                            const hasConflict = conflicts[t.id] && conflicts[t.id].length > 0;
                            
                            return (
                              <div 
                                key={t.id} 
                                className={`p-4 rounded-2xl border text-left relative group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${
                                  hasConflict 
                                    ? "border-rose-200 bg-rose-50/40 ring-1 ring-rose-200" 
                                    : "border-slate-200/70 bg-white hover:border-blue-300"
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <p className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2" title={t.subject}>
                                    {t.subject}
                                  </p>
                                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200/50 px-2 py-1 rounded-lg shrink-0 shadow-2xs uppercase">
                                    {t.dayOfWeek}
                                  </span>
                                </div>

                                {/* Time period */}
                                <div className="flex items-center gap-1.5 mt-3">
                                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 text-blue-600 shrink-0">
                                    <Clock className="w-3 h-3" />
                                  </span>
                                  <p className="text-[11px] font-black text-slate-700">
                                    {t.startTime} - {t.endTime}
                                  </p>
                                </div>

                                {/* Instructor */}
                                <div className="flex items-center gap-1.5 mt-2">
                                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 text-blue-600 shrink-0">
                                    <User className="w-3 h-3" />
                                  </span>
                                  <p className="text-[11px] font-bold text-slate-600 truncate">
                                    {t.teacher?.nameKh || t.teacher?.firstNameEn || idt("គ្មានគ្រូ", "No teacher")}
                                  </p>
                                </div>

                                {/* Actions bottom strip */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => openEdit(t)}
                                      className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => setDeleteConfirmId(t.id)}
                                      className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {hasConflict && (
                                  <div className="mt-3 pt-2 border-t border-rose-100 space-y-1.5 animate-fadeIn">
                                    {conflicts[t.id].map((cf, cidx) => (
                                      <span 
                                        key={cidx} 
                                        className="text-[9px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200/60 px-1.5 py-1 rounded-md flex items-center gap-1 block leading-none truncate"
                                      >
                                        <AlertCircle className="w-2.5 h-2.5 shrink-0 text-rose-500 animate-pulse" />
                                        {cf.type === 'room' ? idt("ជាន់បន្ទប់", "Room collision") : idt("គ្រូជាន់ម៉ោង", "Teacher conflict")}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {groupByMode === "teacher" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {distinctTeachersWithSchedules.map(tc => {
                  const slots = timetablesByTeacher[tc.id] || [];
                  const isActiveTeacher = !selectedTeacherId || selectedTeacherId === tc.id;
                  
                  return (
                    <div 
                      key={tc.id} 
                      className={`flex flex-col bg-white rounded-3xl border transition-all duration-300 ${
                        isActiveTeacher 
                          ? 'border-slate-200 shadow-sm opacity-100' 
                          : 'border-slate-100 opacity-50 hover:opacity-100'
                      }`}
                    >
                      {/* Column Header */}
                      <div className="p-4 border-b border-slate-100 bg-emerald-50/50 rounded-t-3xl flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-white text-teal-600 flex items-center justify-center font-black text-[10px] uppercase shrink-0 border border-teal-100 shadow-2xs">
                            {(tc.nameEn || tc.firstNameEn || '?').slice(0, 2).toUpperCase()}
                          </span>
                          <span className="truncate max-w-[130px]">{tc.nameKh || tc.firstNameEn}</span>
                        </span>
                        <span className="font-mono text-[10px] font-black text-teal-700 bg-white border border-teal-200/50 px-2 py-0.5 rounded-lg shadow-2xs">
                          {slots.length}
                        </span>
                      </div>

                      {/* Body List */}
                      <div className="p-4 space-y-4 flex-1 min-h-[160px]">
                        {slots.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                              <Calendar className="w-4 h-4 text-slate-300" />
                            </div>
                            <span className="text-xs font-bold text-slate-400">{idt("គ្មានម៉ោង", "No Slots")}</span>
                          </div>
                        ) : (
                          slots.map(t => {
                            const hasConflict = conflicts[t.id] && conflicts[t.id].length > 0;
                            
                            return (
                              <div 
                                key={t.id} 
                                className={`p-4 rounded-2xl border text-left relative group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${
                                  hasConflict 
                                    ? "border-rose-200 bg-rose-50/40 ring-1 ring-rose-200" 
                                    : "border-slate-200/70 bg-white hover:border-emerald-300"
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <p className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2" title={t.subject}>
                                    {t.subject}
                                  </p>
                                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-1 rounded-lg shrink-0 shadow-2xs uppercase">
                                    {t.dayOfWeek}
                                  </span>
                                </div>

                                {/* Time period */}
                                <div className="flex items-center gap-1.5 mt-3">
                                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 text-blue-600 shrink-0">
                                    <Clock className="w-3 h-3" />
                                  </span>
                                  <p className="text-[11px] font-black text-slate-700">
                                    {t.startTime} - {t.endTime}
                                  </p>
                                </div>

                                {/* Room indicator */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200/50 px-2 py-1 rounded-lg uppercase tracking-tight flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {t.room}
                                  </span>
                                  
                                  {/* Quick actions floating */}
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => openEdit(t)}
                                      className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => setDeleteConfirmId(t.id)}
                                      className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {hasConflict && (
                                  <div className="mt-3 pt-2 border-t border-rose-100 space-y-1.5 animate-fadeIn">
                                    {conflicts[t.id].map((cf, cidx) => (
                                      <span 
                                        key={cidx} 
                                        className="text-[9px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200/60 px-1.5 py-1 rounded-md flex items-center gap-1 block leading-none truncate"
                                      >
                                        <AlertCircle className="w-2.5 h-2.5 shrink-0 text-rose-500 animate-pulse" />
                                        {cf.type === 'room' ? idt("ជាន់បន្ទប់", "Room collision") : idt("គ្រូជាន់ម៉ោង", "Teacher conflict")}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Matrix Scheduler Board View - Calendar Schedule Board */
          <div className="p-4 sm:p-6 overflow-x-auto scrollbar-none animate-fadeIn">
            <div className="min-w-[1000px] border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-3xs">
              {/* Table Header Row (Days) */}
              <div className="grid grid-cols-8 bg-slate-50/80 border-b border-slate-200 text-center font-black text-xs text-slate-700">
                <div className="p-3.5 border-r border-slate-200 bg-slate-100/50 text-left flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{idt("ម៉ោងសិក្សា", "Time Slots")}</span>
                </div>
                {dayOptions.map(day => {
                  const isActive = !selectedDay || selectedDay === day;
                  return (
                    <div 
                      key={day} 
                      className={`p-3.5 border-r border-slate-200 last:border-0 font-extrabold transition-all ${
                        isActive ? "text-blue-600 bg-blue-50/25" : "text-slate-400"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Grid Rows (Time periods) */}
              <div className="divide-y divide-slate-100">
                {timeSlots.map(period => {
                  const [periodStart, periodEnd] = period.split(" - ");
                  
                  return (
                    <div key={period} className="grid grid-cols-8 hover:bg-slate-50/20 transition-colors">
                      {/* Left Header - Time interval */}
                      <div className="p-3.5 border-r border-slate-200 bg-slate-50/40 flex flex-col justify-center">
                        <span className="font-mono font-black text-blue-700 text-xs">{periodStart}</span>
                        <span className="font-mono text-[10px] text-slate-400 mt-0.5">{idt("ដល់", "to")} {periodEnd}</span>
                      </div>

                      {/* Day cells */}
                      {dayOptions.map(day => {
                        const cellSlots = filteredTimetables.filter(t => {
                          const isDayMatch = t.dayOfWeek === day;
                          // Match slot overlaps or exact fits
                          const itemStartMin = parseTimeToMinutes(t.startTime);
                          const itemEndMin = parseTimeToMinutes(t.endTime);
                          const periodStartMin = parseTimeToMinutes(periodStart);
                          const periodEndMin = parseTimeToMinutes(periodEnd);
                          
                          // Check if item fits mostly within or exactly matches this slot
                          const fitsInSlot = (itemStartMin < periodEndMin && itemEndMin > periodStartMin);
                          return isDayMatch && fitsInSlot;
                        });

                        const isActiveDay = !selectedDay || selectedDay === day;

                        return (
                          <div 
                            key={day} 
                            className={`p-2 border-r border-slate-200 last:border-0 min-h-[110px] space-y-2 flex flex-col justify-start transition-all ${
                              isActiveDay ? "bg-white" : "bg-slate-50/30 opacity-40"
                            }`}
                          >
                            {cellSlots.length === 0 ? (
                              <div className="flex-1 flex items-center justify-center text-[10px] text-slate-300 italic">
                                -
                              </div>
                            ) : (
                              cellSlots.map(t => {
                                const hasConflict = conflicts[t.id] && conflicts[t.id].length > 0;
                                
                                return (
                                  <div 
                                    key={t.id} 
                                    className={`p-2 rounded-lg border text-left relative group transition-all duration-300 hover:shadow-xs ${
                                      hasConflict 
                                        ? "border-rose-300 bg-rose-50/40 ring-1 ring-rose-200" 
                                        : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-2xs"
                                    }`}
                                  >
                                    <p className="font-black text-[11px] text-slate-850 leading-tight truncate" title={t.subject}>
                                      {t.subject}
                                    </p>
                                    
                                    <p className="text-[9px] font-bold text-slate-500 mt-1 truncate">
                                      {t.teacher?.nameKh || t.teacher?.firstNameEn}
                                    </p>

                                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1">
                                      <span className="text-[8px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100/20 px-1 py-0.5 rounded-sm uppercase">
                                        Rm {t.room}
                                      </span>
                                      
                                      <span className="text-[8px] font-mono font-bold text-blue-600 bg-blue-50 px-1 rounded-sm shrink-0">
                                        {t.startTime}
                                      </span>
                                    </div>

                                    {/* Action Hover buttons */}
                                    <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => openEdit(t)}
                                        className="p-0.5 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-md border border-slate-200/50 transition-colors cursor-pointer"
                                      >
                                        <Edit className="w-2 h-2" />
                                      </button>
                                      <button 
                                        onClick={() => setDeleteConfirmId(t.id)}
                                        className="p-0.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-md border border-slate-200/50 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-2 h-2" />
                                      </button>
                                    </div>

                                    {/* Small Conflict Alert inside table cell */}
                                    {hasConflict && (
                                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full animate-ping" />
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Printable Official Footer / Signatures */}
        <div className="hidden print:flex justify-between items-center mt-14 px-10 pb-8 pt-6 border-t border-slate-200/85">
          <div className="text-center">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">{idt("រៀបចំដោយ", "PREPARED BY")}</p>
            <p className="text-[10px] font-bold text-slate-400 mb-10">{idt("ការិយាល័យសិក្សាធិការ", "Academic Affairs Office")}</p>
            <div className="w-40 border-b border-slate-300/80 mx-auto" />
            <p className="text-[10px] font-bold text-slate-500 mt-1">{idt("ហត្ថលេខា និងឈ្មោះ", "Signature & Name")}</p>
          </div>
          <div className="text-center bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200/60">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{idt("សរុបម៉ោងសិក្សា៖", "TOTAL CLASSES:")} {filteredTimetables.length}</p>
            <p className="text-[9px] font-bold text-slate-400 mt-1">{idt("ទិន្នន័យត្រូវបានផ្ទៀងផ្ទាត់រួចរាល់", "All slots are conflict-checked")}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">{idt("ពិនិត្យ និងអនុម័តដោយ", "APPROVED BY")}</p>
            <p className="text-[10px] font-bold text-slate-400 mb-10">{idt("នាយកវិទ្យាស្ថាន / សាកលវិទ្យាធិការ", "Institute Director / Dean")}</p>
            <div className="w-40 border-b border-slate-300/80 mx-auto" />
            <p className="text-[10px] font-bold text-slate-500 mt-1">{idt("ហត្ថលេខា និងត្រា", "Signature & Stamp")}</p>
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
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center border border-slate-100"
          >
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-2">
              {idt("បញ្ជាក់ការលុបកាលវិភាគ", "Confirm Timetable Deletion")}
            </h3>
            <p className="text-slate-500 text-xs mb-6 leading-relaxed">
              {idt("តើអ្នកពិតជាចង់លុបទិន្នន័យម៉ោងសិក្សានេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។", "Are you sure you want to delete this class slot? This action is permanent.")}
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                {idt("បោះបង់", "Cancel")}
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)} 
                className="flex-1 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-500/20 transition-colors cursor-pointer"
              >
                {idt("លុបចោល", "Delete")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add / Edit Schedule Modal */}
      <AnimatePresence>
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-blue-50/40">
              <h3 className="font-black text-slate-800 flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                  <Calendar className="w-5 h-5" />
                </div>
                {editingId ? idt("កែប្រែកាលវិភាគ", "Edit Class Schedule") : idt("បន្ថែមម៉ោងសិក្សាថ្មី", "Add New Schedule Slot")}
              </h3>
              <button onClick={() => { setShowAddModal(false); setIsCustomSubject(false); }} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {errorMsg && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs flex items-start gap-3 border border-rose-100 animate-shake">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-bold">{errorMsg}</span>
                </div>
              )}
            
              {/* Teacher selection */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  {idt("ជ្រើសរើសគ្រូបង្រៀន", "Instructor/Teacher *")}
                </label>
                <SearchableSelect
                  required
                  value={formData.teacherId}
                  onChange={(val: string) => setFormData({...formData, teacherId: val})}
                  placeholder={`-- ${idt("ជ្រើសរើសគ្រូ", "Select Teacher")} --`}
                  searchPlaceholder={idt("ស្វែងរក...", "Search...", "搜索...")}
                  options={teachers.filter((t: any) => t.status === 'ACTIVE' || t.status === 'LEAVE').map((t: any) => ({
                    value: t.id,
                    label: `${t.nameKh || t.nameEn || t.firstNameEn} (${t.teacherId || idt("គ្មានលេខកូដ", "No Code")})`
                  }))}
                  className="w-full text-xs font-bold"
                  triggerClassName="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                />
              </div>

              {/* Subject & Room in 1 row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                      {idt("មុខវិជ្ជា", "Subject *")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomSubject(!isCustomSubject)}
                      className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md shrink-0 leading-none"
                    >
                      {isCustomSubject 
                        ? idt("📋 ជ្រើសរើសវគ្គសិក្សា", "📋 Select Course") 
                        : idt("✏️ វាយបញ្ចូលផ្ទាល់", "✏️ Type Custom")}
                    </button>
                  </div>
                  
                  {isCustomSubject ? (
                    <input 
                      required 
                      type="text" 
                      value={formData.subject} 
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      placeholder="Python, UI/UX, English..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 font-bold text-xs sm:text-sm transition-all bg-slate-50 hover:bg-white" 
                    />
                  ) : (
                    <SearchableSelect
                      required
                      value={formData.subject}
                      onChange={handleSubjectChange}
                      placeholder={`-- ${idt("ជ្រើសរើសមុខវិជ្ជា", "Select Subject")} --`}
                      searchPlaceholder={idt("ស្វែងរកមុខវិជ្ជា...", "Search Subject...", "搜索科目...")}
                      options={mergedSubjects.map(sub => ({
                        value: sub,
                        label: sub
                      }))}
                      onEditOption={onEditCourseOption ? handleEditCourseByName : undefined}
                      onDeleteOption={onDeleteCourseOption ? handleDeleteCourseByName : undefined}
                      onAddOption={onAddCourseOption ? handleAddCourseByName : undefined}
                      addPlaceholder={idt("+ បន្ថែមវគ្គសិក្សាថ្មី...", "+ Add new course...", "+ 添加新课程...")}
                      className="w-full text-xs font-bold"
                      triggerClassName="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 h-[42px] flex items-center justify-between"
                    />
                  )}
                  
                  {/* Smart prefill notice */}
                  {!isCustomSubject && formData.subject && dbCourses.some(c => c.title?.trim().toLowerCase() === formData.subject.trim().toLowerCase() && c.teacherId) && (
                    <p className="text-[9px] text-emerald-600 font-black mt-1 animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
                      {idt("បានកំណត់គ្រូបង្រៀនស្វ័យប្រវត្តិតាមវគ្គសិក្សា!", "Auto-selected course instructor!")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    {idt("បន្ទប់សិក្សា", "Classroom/Room *")}
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={formData.room} 
                    onChange={e => setFormData({...formData, room: e.target.value})}
                    placeholder="Lab A, Room 102..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 font-bold text-xs sm:text-sm transition-all bg-slate-50 hover:bg-white" 
                  />
                </div>
              </div>

              {/* Day dropdown custom options */}
              <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                      {idt("ជ្រើសរើសថ្ងៃសិក្សា", "Scheduled Day *")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddDay(true)}
                      className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors leading-none shrink-0"
                    >
                      <Plus className="w-3 h-3" /> {idt("គ្រប់គ្រងថ្ងៃ", "Edit Days")}
                    </button>
                  </div>

                  {showAddDay ? (
                    <div className="flex items-center gap-3 h-[42px] animate-fadeIn">
                      <input
                        type="text"
                        value={newCustomDay}
                        onChange={(e) => setNewCustomDay(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDayOption();
                          } else if (e.key === "Escape") {
                            setShowAddDay(false);
                            setNewCustomDay("");
                          }
                        }}
                        placeholder={idt("បញ្ចូលថ្ងៃថ្មី...", "Enter day name...")}
                        className="flex-1 px-4 py-2 h-full rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-xs font-bold text-slate-850 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddDayOption}
                        className="px-4 h-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                      >
                        {idt("រក្សា", "Save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddDay(false);
                          setNewCustomDay("");
                        }}
                        className="px-3 h-full bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black cursor-pointer transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative h-[42px]">
                      <button
                        type="button"
                        onClick={() => setIsOpenDayDropdown(!isOpenDayDropdown)}
                        className={`w-full h-full px-4 py-2.5 rounded-xl border ${isOpenDayDropdown ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200'} text-xs sm:text-sm font-bold text-slate-700 bg-slate-50 hover:bg-white flex items-center justify-between text-left cursor-pointer transition-all`}
                      >
                        <span className="truncate">{formData.dayOfWeek || idt("ជ្រើសរើសថ្ងៃ...", "Select day...")}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenDayDropdown ? "rotate-180" : ""}`} />
                      </button>

                      {/* Dropdown Options */}
                      {isOpenDayDropdown && (
                        <>
                          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenDayDropdown(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 text-xs overflow-hidden"
                          >
                            <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-1 dropdown-scrollbar">
                              {dayOptions.map((opt, idx) => {
                                const isEditing = editingDayIndex === idx;
                                const isSelected = formData.dayOfWeek === opt;

                                return (
                                  <div 
                                    key={idx} 
                                    className={`flex items-center justify-between p-1.5 rounded-lg transition-all group ${
                                      isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                                    }`}
                                  >
                                    {isEditing ? (
                                      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                                        <input
                                          type="text"
                                          value={editingDayValue}
                                          onChange={(e) => setEditingDayValue(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              handleEditDayOption(idx, editingDayValue);
                                            } else if (e.key === "Escape") {
                                              setEditingDayIndex(null);
                                            }
                                          }}
                                          className="flex-1 px-2 py-1 border border-blue-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none"
                                          autoFocus
                                        />
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEditDayOption(idx, editingDayValue);
                                          }}
                                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer shrink-0 transition-colors"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setEditingDayIndex(null);
                                          }}
                                          className="p-1 text-slate-400 hover:bg-slate-100 rounded-md cursor-pointer shrink-0 transition-colors"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setFormData({...formData, dayOfWeek: opt});
                                            setIsOpenDayDropdown(false);
                                          }}
                                          className={`flex-1 text-left px-2 py-1 font-bold cursor-pointer truncate ${isSelected ? "text-blue-700" : "text-slate-600"}`}
                                        >
                                          {opt}
                                        </button>
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setEditingDayIndex(idx);
                                              setEditingDayValue(opt);
                                            }}
                                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                                            title={idt("កែប្រែ", "Edit")}
                                          >
                                            <Edit className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            disabled={dayOptions.length <= 1}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              handleDeleteDayOption(e, idx);
                                            }}
                                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors ml-0.5 disabled:opacity-30"
                                            title={idt("លុប", "Delete")}
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
                            
                            <div className="pt-1.5 mt-1 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowAddDay(true);
                                  setNewCustomDay("");
                                }}
                                className="w-full flex items-center justify-center gap-1 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{idt("បន្ថែមថ្ងៃថ្មី", "Add new day")}</span>
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </div>
                  )}
              </div>

              {/* Start & End Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    {idt("ម៉ោងចូលរៀន", "Start Time *")}
                  </label>
                  <input 
                    required 
                    type="time" 
                    value={formData.startTime} 
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-4 py-2.5 h-[42px] border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 font-bold text-xs sm:text-sm transition-all bg-slate-50 hover:bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    {idt("ម៉ោងចេញរៀន", "End Time *")}
                  </label>
                  <input 
                    required 
                    type="time" 
                    value={formData.endTime} 
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-4 py-2.5 h-[42px] border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 font-bold text-xs sm:text-sm transition-all bg-slate-50 hover:bg-white" 
                  />
                </div>
              </div>
              
              {/* Form buttons */}
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => { setShowAddModal(false); setIsCustomSubject(false); }} 
                  className="px-5 py-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  {idt("បោះបង់", "Cancel")}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> 
                  {idt("រក្សាទុកកាលវិភាគ", "Save Schedule")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
