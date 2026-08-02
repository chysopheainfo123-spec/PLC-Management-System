import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Trash, Search, GraduationCap, X, BookOpen, Clock, 
  Calendar, UserPlus, ChevronDown, Check, Sparkles, DollarSign, 
  User, Book, AlertCircle, Edit2, Eye, Award, Users, TrendingUp, Download, Filter,
  LayoutGrid, List, ArrowUpDown, ArrowUp, ArrowDown, BarChart3
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { exportToExcel } from '../../exportUtils';
import SearchableSelect from '../SearchableSelect';

export default function CoursesTab({ uiLang, token: propToken, students: propStudents, setStudents: propSetStudents, syncCourseOption, courseOptions = [] }: { uiLang?: string, token?: string, students?: any[], setStudents?: any, syncCourseOption?: (title: string) => void, courseOptions?: string[] } = {}) {
  const [localLang, setLocalLang] = useState(uiLang || localStorage.getItem("plc_lang") || "kh");
  const fallbackToken = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
  const token = propToken || fallbackToken;

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

  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  // Use passed students if available, otherwise fallback to local state (for standalone usage if any)
  const [localStudents, setLocalStudents] = useState<any[]>([]);
  const students = propStudents || localStudents;
  const setStudents = propSetStudents || setLocalStudents;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedPriceTier, setSelectedPriceTier] = useState('');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '', title: '', price: 0, duration: '', hours: '', teacherId: ''
  });
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<any | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const [formData, setFormData] = useState({
    title: '', price: 0, duration: '', hours: '', teacherId: ''
  });
  
  const [enrollData, setEnrollData] = useState({
    studentId: '', courseId: ''
  });

  // State for Add Course Dialog Search Dropdown (Teacher)
  const [teacherSearch, setTeacherSearch] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const teacherDropdownRef = useRef<HTMLDivElement>(null);

  // State for Edit Course Dialog Search Dropdown (Teacher)
  const [editTeacherSearch, setEditTeacherSearch] = useState('');
  const [isEditTeacherDropdownOpen, setIsEditTeacherDropdownOpen] = useState(false);
  const editTeacherDropdownRef = useRef<HTMLDivElement>(null);

  // State for Enroll Dialog Search Dropdowns (Student & Course)
  const [studentSearch, setStudentSearch] = useState('');
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const studentDropdownRef = useRef<HTMLDivElement>(null);

  const [courseSearch, setCourseSearch] = useState('');
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const courseDropdownRef = useRef<HTMLDivElement>(null);

  // Merge actual dynamic/real sources of course names to avoid using fake/hardcoded templates
  // 1. Configured course options from settings (courseOptions)
  // 2. Titles of actual created courses in the database (courses)
  // 3. Registered courses from actual student records in the database (students)
  const mergedCourseOptions = useMemo(() => {
    const list = new Set<string>();
    
    // Strictly prioritize actual courses set in timetables as requested by the user
    if (Array.isArray(timetables) && timetables.length > 0) {
      timetables.forEach(t => {
        if (t && t.subject && typeof t.subject === 'string' && t.subject.trim()) {
          list.add(t.subject.trim());
        }
      });
    } else {
      // Fallback only if no timetables exist yet
      if (Array.isArray(courseOptions)) {
        courseOptions.forEach(opt => {
          if (opt && typeof opt === 'string' && opt.trim()) {
            list.add(opt.trim());
          }
        });
      }
      
      if (Array.isArray(courses)) {
        courses.forEach(c => {
          if (c && c.title && c.title.trim()) {
            list.add(c.title.trim());
          }
        });
      }
      
      if (Array.isArray(students)) {
        students.forEach(s => {
          if (s && s.course && s.course.trim()) {
            list.add(s.course.trim());
          }
        });
      }

      if (list.size === 0) {
        return [
          "Microsoft Office Excel",
          "Microsoft Office Word",
          "Adobe Photoshop Full Course",
          "Web Development Coding Suite",
          "Python Core Programing",
          "Graphic Design Essentials"
        ];
      }
    }
    
    return Array.from(list).sort((a, b) => a.localeCompare(b, 'km'));
  }, [courseOptions, courses, students, timetables]);

  // State for Course Title Select Dropdown (Add dialog)
  const [isOpenCourseTitleDropdown, setIsOpenCourseTitleDropdown] = useState(false);
  const [courseTitleSearch, setCourseTitleSearch] = useState('');
  const courseTitleDropdownRef = useRef<HTMLDivElement>(null);

  // State for Course Title Select Dropdown (Edit dialog)
  const [isOpenEditCourseTitleDropdown, setIsOpenEditCourseTitleDropdown] = useState(false);
  const [editCourseTitleSearch, setEditCourseTitleSearch] = useState('');
  const editCourseTitleDropdownRef = useRef<HTMLDivElement>(null);

  const filteredCourseTitles = useMemo(() => {
    return mergedCourseOptions.filter(opt => 
      opt.toLowerCase().includes(courseTitleSearch.toLowerCase())
    );
  }, [mergedCourseOptions, courseTitleSearch]);

  const filteredEditCourseTitles = useMemo(() => {
    return mergedCourseOptions.filter(opt => 
      opt.toLowerCase().includes(editCourseTitleSearch.toLowerCase())
    );
  }, [mergedCourseOptions, editCourseTitleSearch]);

  // New interactive states
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [quickFilter, setQuickFilter] = useState<'all' | 'popular' | 'empty' | 'premium' | 'budget'>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Hours dropdown states and refs
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);
  const hoursDropdownRef = useRef<HTMLDivElement>(null);

  const [isEditHoursDropdownOpen, setIsEditHoursDropdownOpen] = useState(false);
  const editHoursDropdownRef = useRef<HTMLDivElement>(null);

  const convert24To12Standard = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "";
    const formatSingle = (t: string) => {
      const parts = t.split(":");
      if (parts.length < 2) return { str: t, hour: 0, min: "00", ampm: "AM" };
      const h = parseInt(parts[0], 10);
      const m = parts[1];
      const ampm = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayHStr = String(displayH).padStart(2, "0");
      return { str: `${displayHStr}:${m}`, hour: h, min: m, ampm };
    };
    const startObj = formatSingle(startTime);
    const endObj = formatSingle(endTime);
    return `${startObj.str} - ${endObj.str} ${endObj.ampm}`;
  };

  const selectedCourseSchedules = useMemo(() => {
    const title = formData.title;
    if (!title || !timetables) return [];
    return timetables.filter(t => t.subject?.trim().toLowerCase() === title.trim().toLowerCase());
  }, [timetables, formData.title]);

  const selectedEditCourseSchedules = useMemo(() => {
    const title = editFormData.title;
    if (!title || !timetables) return [];
    return timetables.filter(t => t.subject?.trim().toLowerCase() === title.trim().toLowerCase());
  }, [timetables, editFormData.title]);

  const uniqueTimetableHours = useMemo(() => {
    if (!timetables || timetables.length === 0) return [];
    const unique = new Set<string>();
    timetables.forEach(t => {
      if (t.startTime && t.endTime) {
        const hoursStr = `${t.startTime} - ${t.endTime}`;
        const hours12Str = convert24To12Standard(t.startTime, t.endTime);
        unique.add(hours12Str);
        unique.add(hoursStr);
      }
    });
    return Array.from(unique);
  }, [timetables]);

  // Click outside event listeners to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setIsTeacherDropdownOpen(false);
      }
      if (editTeacherDropdownRef.current && !editTeacherDropdownRef.current.contains(event.target as Node)) {
        setIsEditTeacherDropdownOpen(false);
      }
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
        setIsStudentDropdownOpen(false);
      }
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(event.target as Node)) {
        setIsCourseDropdownOpen(false);
      }
      if (courseTitleDropdownRef.current && !courseTitleDropdownRef.current.contains(event.target as Node)) {
        setIsOpenCourseTitleDropdown(false);
      }
      if (editCourseTitleDropdownRef.current && !editCourseTitleDropdownRef.current.contains(event.target as Node)) {
        setIsOpenEditCourseTitleDropdown(false);
      }
      if (hoursDropdownRef.current && !hoursDropdownRef.current.contains(event.target as Node)) {
        setIsHoursDropdownOpen(false);
      }
      if (editHoursDropdownRef.current && !editHoursDropdownRef.current.contains(event.target as Node)) {
        setIsEditHoursDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const promises: any[] = [
        fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => ({ data })),
        fetch('/api/teachers', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => ({ data })),
        fetch('/api/timetables', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => ({ data })).catch(() => ({ data: [] }))
      ];
      
      if (!propStudents) {
        promises.push(fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => ({ data })));
      }
      
      const results = await Promise.all(promises);
      setCourses(Array.isArray(results[0].data) ? results[0].data : []);
      const teachersList = results[1].data && Array.isArray(results[1].data.teachers) ? results[1].data.teachers : (Array.isArray(results[1].data) ? results[1].data : []);
      setTeachers(teachersList);
      setTimetables(Array.isArray(results[2].data) ? results[2].data : []);
      
      if (!propStudents && results[3]) {
        const studentsList = results[3].data && Array.isArray(results[3].data.students) ? results[3].data.students : (Array.isArray(results[3].data) ? results[3].data : []);
        setLocalStudents(studentsList);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.price < 0) return;
    try {
      await fetch('/api/courses', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        }, 
        body: JSON.stringify(formData) 
      });
      if (syncCourseOption && formData.title) {
        syncCourseOption(formData.title);
      }
      setIsAddDialogOpen(false);
      setFormData({ title: '', price: 0, duration: '', hours: '', teacherId: '' });
      setTeacherSearch('');
      fetchData();
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollData.studentId || !enrollData.courseId) return;
    try {
      await fetch('/api/enrollments', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        }, 
        body: JSON.stringify(enrollData) 
      });

      // Update the student's core course info to keep system consistent across tabs (Finance, Dashboard, etc)
      const selectedStudent = students.find(s => s.id === enrollData.studentId);
      const selectedCourse = courses.find(c => c.id === enrollData.courseId);
      if (selectedStudent && selectedCourse) {
        const updatedStudent = {
          ...selectedStudent,
          course: selectedCourse.title,
          fee: (selectedStudent.fee || 0) + Number(selectedCourse.price || 0),
          due: (selectedStudent.due || 0) + Number(selectedCourse.price || 0)
        };
        await fetch(`/api/students/${selectedStudent.id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedStudent)
        });
        setStudents((prev: any[]) => prev.map(s => s.id === selectedStudent.id ? updatedStudent : s));
      }

      setIsEnrollDialogOpen(false);
      setEnrollData({ studentId: '', courseId: '' });
      setStudentSearch('');
      setCourseSearch('');
      fetchData();
    } catch (error) {
      console.error("Failed to enroll student:", error);
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourseToDelete(id);
  };

  const executeDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      const res = await fetch(`/api/courses/${courseToDelete}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
         throw new Error("Failed to delete course on server");
      }
      fetchData();
      setCourseToDelete(null);
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert(localIdt("មានបញ្ហាក្នុងការលុបវគ្គសិក្សា", "Failed to delete course"));
      setCourseToDelete(null);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredCourses = useMemo(() => {
    let result = courses.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeacher = !selectedTeacherId || c.teacherId === selectedTeacherId;
      let matchesPrice = true;
      if (selectedPriceTier === 'low') matchesPrice = Number(c.price) < 50;
      else if (selectedPriceTier === 'mid') matchesPrice = Number(c.price) >= 50 && Number(c.price) <= 100;
      else if (selectedPriceTier === 'high') matchesPrice = Number(c.price) > 100;

      // Quick filter
      let matchesQuick = true;
      if (quickFilter === 'popular') matchesQuick = (c.enrollments?.length || 0) >= 3;
      else if (quickFilter === 'empty') matchesQuick = (c.enrollments?.length || 0) === 0;
      else if (quickFilter === 'premium') matchesQuick = Number(c.price) > 100;
      else if (quickFilter === 'budget') matchesQuick = Number(c.price) < 50;

      return matchesSearch && matchesTeacher && matchesPrice && matchesQuick;
    });

    // Apply Sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        let aValue: any = '';
        let bValue: any = '';

        if (sortConfig.key === 'title') {
          aValue = a.title || '';
          bValue = b.title || '';
        } else if (sortConfig.key === 'price') {
          aValue = Number(a.price || 0);
          bValue = Number(b.price || 0);
        } else if (sortConfig.key === 'duration') {
          aValue = a.duration || '';
          bValue = b.duration || '';
        } else if (sortConfig.key === 'students') {
          aValue = a.enrollments?.length || 0;
          bValue = b.enrollments?.length || 0;
        } else if (sortConfig.key === 'teacher') {
          const tA = a.teacher ? (a.teacher.nameKh || a.teacher.nameEn || '') : '';
          const tB = b.teacher ? (b.teacher.nameKh || b.teacher.nameEn || '') : '';
          aValue = tA;
          bValue = tB;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [courses, searchTerm, selectedTeacherId, selectedPriceTier, quickFilter, sortConfig]);

  // Chart data for advanced analytics
  const chartData = useMemo(() => {
    return courses.map(c => ({
      name: c.title.length > 15 ? c.title.slice(0, 13) + '...' : c.title,
      fullName: c.title,
      students: c.enrollments?.length || 0,
      revenue: (c.enrollments?.length || 0) * Number(c.price || 0),
      price: Number(c.price || 0)
    }));
  }, [courses]);

  // Autocomplete search filters
  const filteredTeachers = useMemo(() => {
    const searchLower = teacherSearch.toLowerCase();
    return teachers.filter(t => {
      if (t.status === 'EXITED' || t.status === 'STOP' || t.status === 'RESIGNED') return false;
      const nameKh = (t.nameKh || '').toLowerCase();
      const nameEn = (t.nameEn || '').toLowerCase();
      const teacherId = (t.teacherId || '').toLowerCase();
      return nameKh.includes(searchLower) || nameEn.includes(searchLower) || teacherId.includes(searchLower);
    });
  }, [teachers, teacherSearch]);

  const selectedTeacher = useMemo(() => {
    return teachers.find(t => t.id === formData.teacherId);
  }, [teachers, formData.teacherId]);

  const filteredStudents = useMemo(() => {
    const searchLower = studentSearch.toLowerCase();
    return students.filter(s => {
      if (s.status === 'COMPLETED' || s.status === 'STOP') return false;
      const nameKh = (s.nameKh || '').toLowerCase();
      const nameEn = (s.nameEn || '').toLowerCase();
      const sId = (s.studentId || '').toLowerCase();
      return nameKh.includes(searchLower) || nameEn.includes(searchLower) || sId.includes(searchLower);
    });
  }, [students, studentSearch]);

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === enrollData.studentId);
  }, [students, enrollData.studentId]);

  const filteredEnrollCourses = useMemo(() => {
    const searchLower = courseSearch.toLowerCase();
    return courses.filter(c => c.title.toLowerCase().includes(searchLower));
  }, [courses, courseSearch]);

  const selectedEnrollCourse = useMemo(() => {
    return courses.find(c => c.id === enrollData.courseId);
  }, [courses, enrollData.courseId]);

  // Edit Teacher Auto-Complete
  const filteredEditTeachers = useMemo(() => {
    const searchLower = editTeacherSearch.toLowerCase();
    return teachers.filter(t => {
      if (t.status === 'EXITED' || t.status === 'STOP' || t.status === 'RESIGNED') return false;
      const nameKh = (t.nameKh || '').toLowerCase();
      const nameEn = (t.nameEn || '').toLowerCase();
      const teacherId = (t.teacherId || '').toLowerCase();
      return nameKh.includes(searchLower) || nameEn.includes(searchLower) || teacherId.includes(searchLower);
    });
  }, [teachers, editTeacherSearch]);

  const selectedEditTeacher = useMemo(() => {
    return teachers.find(t => t.id === editFormData.teacherId);
  }, [teachers, editFormData.teacherId]);

  // Enrolled students resolver
  const enrolledStudents = useMemo(() => {
    if (!selectedCourseForStudents) return [];
    const enrolledIds = selectedCourseForStudents.enrollments?.map((e: any) => e.studentId) || [];
    return students.filter((s: any) => enrolledIds.includes(s.id));
  }, [selectedCourseForStudents, students]);

  // Edit Handlers
  const handleEditClick = (course: any) => {
    setEditFormData({
      id: course.id,
      title: course.title,
      price: Number(course.price || 0),
      duration: course.duration || '',
      hours: course.hours || '',
      teacherId: course.teacherId || ''
    });
    setEditTeacherSearch('');
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.title || editFormData.price < 0) return;
    try {
      await fetch(`/api/courses/${editFormData.id}`, { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        }, 
        body: JSON.stringify({
          title: editFormData.title,
          price: Number(editFormData.price),
          duration: editFormData.duration,
          hours: editFormData.hours,
          teacherId: editFormData.teacherId || null
        }) 
      });
      setIsEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  // Sample Seeder
  const handleSeedCourses = async () => {
    setIsSeeding(true);
    try {
      const sampleCourses = [
        { title: "Web Development Full Stack", price: 120, duration: "6 ខែ (6 Months)", hours: "ចន្ទ-សុក្រ 6:00PM - 7:30PM" },
        { title: "Basic Computer Skills", price: 45, duration: "3 ខែ (3 Months)", hours: "សៅរ៍-អាទិត្យ 8:00AM - 11:00AM" },
        { title: "English for Communication", price: 60, duration: "4 ខែ (4 Months)", hours: "ចន្ទ-សុក្រ 5:00PM - 6:00PM" },
        { title: "Graphic Design & UI/UX", price: 90, duration: "5 ខែ (5 Months)", hours: "ចន្ទ-សុក្រ 7:30PM - 9:00PM" },
        { title: "Python Programming & Data Science", price: 100, duration: "4 ខែ (4 Months)", hours: "សៅរ៍-អាទិត្យ 1:00PM - 4:00PM" }
      ];

      for (const sample of sampleCourses) {
        const randomTeacher = teachers.length > 0 ? teachers[Math.floor(Math.random() * teachers.length)] : null;
        await fetch('/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: sample.title,
            price: sample.price,
            duration: sample.duration,
            hours: sample.hours,
            teacherId: randomTeacher ? randomTeacher.id : ''
          })
        });
      }
      await fetchData();
    } catch (error) {
      console.error("Failed to seed sample courses:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredCourses.map((c, i) => ({
      [localIdt("ល.រ", "No.")]: i + 1,
      [localIdt("ឈ្មោះវគ្គសិក្សា", "Course Title")]: c.title,
      [localIdt("តម្លៃសិក្សា ($)", "Tuition Fee ($)")]: `$${Number(c.price).toFixed(2)}`,
      [localIdt("រយៈពេលសិក្សា", "Duration")]: c.duration || 'N/A',
      [localIdt("ម៉ោងសិក្សា", "Class Hours")]: c.hours || 'N/A',
      [localIdt("គ្រូបង្រៀន", "Teacher")]: c.teacher ? (c.teacher.nameKh || c.teacher.nameEn) : 'N/A',
      [localIdt("សិស្សចុះឈ្មោះ", "Enrolled Students")]: `${c.enrollments?.length || 0} នាក់`
    }));
    exportToExcel(exportData, localIdt("បញ្ជីឈ្មោះវគ្គសិក្សា", "Course_List"), localIdt("បញ្ជីឈ្មោះវគ្គសិក្សាទាំងអស់", "All Course List"));
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0);
    const activeTeachers = Array.from(new Set(courses.filter(c => c.teacherId).map(c => c.teacherId))).length;
    const avgPrice = totalCourses > 0 ? courses.reduce((sum, c) => sum + Number(c.price || 0), 0) / totalCourses : 0;
    
    // Additional metrics for premium analytics
    const maxPrice = totalCourses > 0 ? Math.max(...courses.map(c => Number(c.price || 0))) : 0;
    const minPrice = totalCourses > 0 ? Math.min(...courses.filter(c => Number(c.price || 0) > 0).map(c => Number(c.price || 0))) : 0;
    
    const estimatedRevenue = courses.reduce((sum, c) => sum + (Number(c.price || 0) * (c.enrollments?.length || 0)), 0);
    const zeroEnrollmentCourses = courses.filter(c => !c.enrollments || c.enrollments.length === 0);
    const zeroEnrollmentCount = zeroEnrollmentCourses.length;
    
    // Find most popular course
    let mostPopularCourse = null;
    let maxEnrollment = 0;
    courses.forEach(c => {
      const count = c.enrollments?.length || 0;
      if (count > maxEnrollment) {
        maxEnrollment = count;
        mostPopularCourse = c;
      }
    });

    return {
      totalCourses,
      totalEnrollments,
      activeTeachers,
      avgPrice,
      maxPrice,
      minPrice,
      estimatedRevenue,
      zeroEnrollmentCount,
      mostPopularCourse,
      maxEnrollment
    };
  }, [courses]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 font-sans">{localIdt("គ្រប់គ្រងការសិក្សា", "Course Management")}</h2>
          <p className="text-xs sm:text-xs text-slate-500 mt-1">{localIdt("រៀបចំវគ្គសិក្សាថ្មី និង ចុះឈ្មោះសិស្សចូលរៀន", "Organize courses and enroll students")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)} 
            className={`flex items-center px-4 py-1.5 rounded-xl transition-all font-bold text-sm shadow-xs border ${
              showAnalytics 
                ? 'bg-blue-50 text-blue-600 border-blue-200/50' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" /> {localIdt("វិភាគទិន្នន័យ", "Analytics")}
          </button>
          <button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="flex items-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 font-bold text-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> {localIdt("បន្ថែមវគ្គសិក្សាថ្មី", "Add New Course")}
          </button>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 border-l-4 border-l-blue-500 shadow-3xs flex items-center justify-between hover:shadow-md hover:border-slate-200/80 transition-all duration-300 group">
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">{localIdt("វគ្គសិក្សាសរុប", "Total Courses")}</span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalCourses}</h3>
            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 truncate">
              {stats.zeroEnrollmentCount > 0 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                  <span className="text-amber-600 font-semibold">{localIdt(`ទទេ៖ ${stats.zeroEnrollmentCount} វគ្គ`, `Empty: ${stats.zeroEnrollmentCount} courses`)}</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-emerald-600 font-semibold">{localIdt("គ្រប់វគ្គសិក្សាទាំងអស់សកម្ម", "All courses active")}</span>
                </>
              )}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300 ml-3">
            <BookOpen className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Total Enrolled Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 border-l-4 border-l-blue-500 shadow-3xs flex items-center justify-between hover:shadow-md hover:border-slate-200/80 transition-all duration-300 group">
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">{localIdt("សិស្សចុះឈ្មោះសរុប", "Total Enrollments")}</span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalEnrollments}</h3>
            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 truncate">
              {stats.mostPopularCourse ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                  <span className="text-blue-600 font-semibold truncate max-w-[150px]">{localIdt(`ពេញនិយម៖ ${stats.mostPopularCourse.title}`, `Popular: ${stats.mostPopularCourse.title}`)}</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />
                  <span className="text-slate-400 font-semibold">{localIdt("គ្មានសិស្ស", "No Students")}</span>
                </>
              )}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300 ml-3">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        {/* Active Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 border-l-4 border-l-emerald-500 shadow-3xs flex items-center justify-between hover:shadow-md hover:border-slate-200/80 transition-all duration-300 group">
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">{localIdt("គ្រូបង្រៀនសកម្ម", "Active Teachers")}</span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.activeTeachers}</h3>
            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-emerald-600 font-semibold">
                {localIdt("មធ្យម៖ ", "Avg: ")}{stats.activeTeachers > 0 ? (stats.totalCourses / stats.activeTeachers).toFixed(1) : 0}{localIdt(" វគ្គ/នាក់", " cls/tcher")}
              </span>
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-100 group-hover:scale-105 transition-all duration-300 ml-3">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Tuition Fee */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 border-l-4 border-l-amber-500 shadow-3xs flex items-center justify-between hover:shadow-md hover:border-slate-200/80 transition-all duration-300 group">
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">{localIdt("តម្លៃសិក្សាមធ្យម", "Avg. Tuition Fee")}</span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">${stats.avgPrice.toFixed(2)}</h3>
            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-amber-600 font-semibold">
                {localIdt("ចំណូលប៉ាន់ស្មាន៖ ", "Est. Revenue: ")}${stats.estimatedRevenue.toLocaleString()}
              </span>
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-100 group-hover:scale-105 transition-all duration-300 ml-3">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Collapsible Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full mt-4"
          >
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500 animate-pulse-subtle" />
                    {localIdt("ការវិភាគស៊ីជម្រៅនៃវគ្គសិក្សា និងចំណូល", "In-Depth Courses & Revenue Analytics")}
                  </h4>
                  <p className="text-xs text-slate-500">{localIdt("ទិន្នន័យជាក់ស្តែងសរុបតាមវគ្គសិក្សានីមួយៗប្រចាំថ្ងៃ", "Real-time comprehensive operational metrics updated daily")}</p>
                </div>
                {/* Visual Quick Indicators */}
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>{localIdt("ចំនួនសិស្ស", "Students")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>{localIdt("ចំណូល ($)", "Revenue ($)")}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart 1: Student Enrollment Distribution */}
                <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <div>
                    <h5 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      {localIdt("ចំនួនសិស្សតាមវគ្គសិក្សា", "Students per Course")}
                    </h5>
                    <p className="text-[10px] text-slate-400">{localIdt("ការប្រៀបធៀបចំនួនសិស្សដែលបានចុះឈ្មោះសិក្សាក្នុងវគ្គនីមួយៗ", "Comparison of students enrolled in each course")}</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height={256}>
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="gradientStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.95}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.7}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} 
                          labelStyle={{ fontWeight: 'extrabold', fontSize: 11, color: '#1e293b' }}
                          itemStyle={{ fontSize: 11, fontWeight: 'bold', color: '#2563eb' }}
                        />
                        <Bar dataKey="students" radius={[6, 6, 0, 0]} maxBarSize={28} fill="url(#gradientStudents)">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} className="hover:opacity-85 transition-opacity duration-200" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Summary Metric Footer */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200/50">
                    <span>{localIdt("វគ្គសិក្សាមានសិស្សច្រើនជាងគេ៖", "Highest Enrolled Course:")}</span>
                    <span className="text-blue-600 font-extrabold font-sans">
                      {chartData.length > 0 ? [...chartData].sort((a,b) => b.students - a.students)[0]?.fullName : "N/A"} 
                      ({chartData.length > 0 ? [...chartData].sort((a,b) => b.students - a.students)[0]?.students : 0} {localIdt("នាក់", "pax")})
                    </span>
                  </div>
                </div>

                {/* Chart 2: Revenue Distribution */}
                <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <div>
                    <h5 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      {localIdt("ចំណូលប៉ាន់ស្មានតាមវគ្គសិក្សា", "Estimated Revenue per Course")}
                    </h5>
                    <p className="text-[10px] text-slate-400">{localIdt("ចំណូលសរុបគិតជាដុល្លារផ្អែកលើចំនួនសិស្ស និងតម្លៃសិក្សា", "Total revenue in USD based on student count and tuition price")}</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height={256}>
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.95}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.7}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} unit="$" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} 
                          labelStyle={{ fontWeight: 'extrabold', fontSize: 11, color: '#1e293b' }}
                          itemStyle={{ fontSize: 11, fontWeight: 'bold', color: '#10b981' }}
                          formatter={(value) => [`$${value}`, localIdt("ចំណូលប៉ាន់ស្មាន", "Est. Revenue")]}
                        />
                        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={28} fill="url(#gradientRevenue)">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} className="hover:opacity-85 transition-opacity duration-200" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Summary Metric Footer */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200/50">
                    <span>{localIdt("ប្រភពចំណូលធំជាងគេ៖", "Top Revenue Stream:")}</span>
                    <span className="text-emerald-600 font-extrabold font-sans">
                      {chartData.length > 0 ? [...chartData].sort((a,b) => b.revenue - a.revenue)[0]?.fullName : "N/A"} 
                      (${chartData.length > 0 ? [...chartData].sort((a,b) => b.revenue - a.revenue)[0]?.revenue?.toLocaleString() : 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col relative">
        <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center justify-between xl:justify-start gap-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <BookOpen className="w-5 h-5" />
              </div>
               {localIdt("បញ្ជីវគ្គសិក្សា", "Course List")}
            </h3>
            
            {/* Download/Export button */}
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200/50 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              title={localIdt("ទាញយកជា Excel", "Export to Excel")}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{localIdt("ទាញយក Excel", "Export Excel")}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center self-start sm:self-auto bg-slate-100 rounded-xl p-0.5 border border-slate-200/40">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                title={localIdt("ទិដ្ឋភាពតារាង", "Table View")}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                title={localIdt("ទិដ្ឋភាពកាត", "Card View")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Search courses */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder={localIdt("ស្វែងរកវគ្គសិក្សា...", "Search courses...")} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-56 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm transition-all h-9"
              />
            </div>

            {/* Filter by Teacher */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial w-full sm:w-48 z-[40]">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="flex-1">
                <SearchableSelect
                  value={selectedTeacherId}
                  onChange={(val: string) => setSelectedTeacherId(val)}
                  placeholder={localIdt("គ្រូបង្រៀនទាំងអស់", "All Teachers")}
                  searchPlaceholder={localIdt("ស្វែងរកឈ្មោះគ្រូ...", "Search teacher...")}
                  options={[
                    { value: "", label: localIdt("គ្រូបង្រៀនទាំងអស់", "All Teachers") },
                    ...teachers
                      .filter(t => t.status !== 'EXITED' && t.status !== 'STOP' && t.status !== 'RESIGNED')
                      .map(t => ({
                        value: t.id,
                        label: t.nameKh || t.nameEn
                      }))
                  ]}
                  className="w-full text-xs font-bold"
                  triggerClassName="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 h-9 flex justify-between items-center"
                />
              </div>
            </div>

            {/* Filter by Price Tier */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial w-full sm:w-48 z-[40]">
              <div className="flex-1">
                <SearchableSelect
                  value={selectedPriceTier}
                  onChange={(val: string) => setSelectedPriceTier(val)}
                  placeholder={localIdt("តម្លៃសិក្សាទាំងអស់", "All Prices")}
                  searchPlaceholder={localIdt("ស្វែងរក...", "Search...")}
                  options={[
                    { value: "", label: localIdt("តម្លៃសិក្សាទាំងអស់", "All Prices") },
                    { value: "low", label: localIdt("ក្រោម $50", "Under $50") },
                    { value: "mid", label: localIdt("ចន្លោះ $50 - $100", "$50 - $100") },
                    { value: "high", label: localIdt("លើសពី $100", "Above $100") }
                  ]}
                  className="w-full text-xs font-bold"
                  triggerClassName="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 h-9 flex justify-between items-center"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || selectedTeacherId || selectedPriceTier || quickFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTeacherId('');
                  setSelectedPriceTier('');
                  setQuickFilter('all');
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl border border-rose-200/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>{localIdt("លុបតម្រង", "Clear Filters")}</span>
              </button>
            )}
          </div>
        </div>


        {viewMode === 'table' ? (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-left text-xs text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-3.5 font-bold cursor-pointer hover:bg-slate-100/80 transition-colors select-none" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1">
                      <span>{localIdt("ឈ្មោះវគ្គសិក្សា", "Course Title")}</span>
                      {sortConfig?.key === 'title' ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 font-bold cursor-pointer hover:bg-slate-100/80 transition-colors select-none" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1">
                      <span>{localIdt("តម្លៃសិក្សា", "Tuition Fee")}</span>
                      {sortConfig?.key === 'price' ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 font-bold cursor-pointer hover:bg-slate-100/80 transition-colors select-none" onClick={() => handleSort('duration')}>
                    <div className="flex items-center gap-1">
                      <span>{localIdt("រយៈពេល", "Duration")}</span>
                      {sortConfig?.key === 'duration' ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 font-bold">{localIdt("ម៉ោងសិក្សា", "Class Hours")}</th>
                  <th className="px-5 py-3.5 font-bold cursor-pointer hover:bg-slate-100/80 transition-colors select-none" onClick={() => handleSort('teacher')}>
                    <div className="flex items-center gap-1">
                      <span>{localIdt("គ្រូទទួលបន្ទុក", "Assigned Teacher")}</span>
                      {sortConfig?.key === 'teacher' ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-center cursor-pointer hover:bg-slate-100/80 transition-colors select-none" onClick={() => handleSort('students')}>
                    <div className="flex items-center justify-center gap-1">
                      <span>{localIdt("សិស្សសរុប", "Total Students")}</span>
                      {sortConfig?.key === 'students' ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-right">{localIdt("សកម្មភាព", "Action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                        {localIdt("កំពុងទាញយកទិន្នន័យ...", "Loading data...")}
                      </div>
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto px-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-2">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <p className="text-slate-500 font-bold text-base">{localIdt("មិនមានទិន្នន័យវគ្គសិក្សាទេ", "No course data found")}</p>
                        <p className="text-xs text-slate-400">{localIdt("អ្នកអាចបន្ថែមវគ្គសិក្សាដោយខ្លួនឯង ឬចុចខាងក្រោមដើម្បីបង្កើតវគ្គសិក្សាគំរូដ៏ពេញនិយមភ្លាមៗ!", "You can add custom courses or click below to quickly generate highly popular sample courses!")}</p>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                          <button onClick={() => setIsAddDialogOpen(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm">
                             <Plus className="w-4 h-4" /> {localIdt("បន្ថែមវគ្គសិក្សាថ្មី", "Add New Course")}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => {
                    const initials = course.title
                      .split(' ')
                      .map((w: string) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    const hasStudents = (course.enrollments?.length || 0) > 0;
                    
                    // Hash title to get a consistent premium gradient
                    let titleHash = 0;
                    const titleStr = course.title || '';
                    for (let i = 0; i < titleStr.length; i++) {
                      titleHash = titleStr.charCodeAt(i) + ((titleHash << 5) - titleHash);
                    }
                    const gradientIdx = Math.abs(titleHash) % 5;
                    const gradients = [
                      'bg-blue-500 text-white shadow-sm shadow-blue-500/10',
                      'bg-emerald-500 text-white shadow-sm shadow-emerald-500/10',
                      'bg-amber-500 text-white shadow-sm shadow-amber-500/10',
                      'bg-blue-500 text-white shadow-sm shadow-blue-500/10',
                      'bg-cyan-500 text-white shadow-sm shadow-cyan-500/10'
                    ];
                    const chosenGradient = gradients[gradientIdx];

                    return (
                      <motion.tr 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        key={course.id} 
                        className="hover:bg-slate-50/70 border-b border-slate-100/60 transition-all group"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 bg-blue-600 text-white">
                              {initials || <BookOpen className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-slate-800 text-sm leading-tight truncate max-w-[200px] xl:max-w-xs block" title={course.title}>
                                  {course.title}
                                </span>
                                {/* Soft Status Pill Badge */}
                                {!hasStudents ? (
                                  <span className="text-[10px] font-bold text-rose-500 shrink-0">
                                    {localIdt("គ្មានសិស្ស", "No Students")}
                                  </span>
                                ) : course.enrollments?.length === stats.maxEnrollment ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-250/40 shrink-0">
                                    🔥 {localIdt("ពេញនិយម", "Popular")}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-250/40 shrink-0">
                                    {localIdt("សកម្ម", "Active")}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {course.id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs border border-emerald-100/50 shadow-2xs">
                            ${Number(course.price).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{course.duration || localIdt('មិនកំណត់', 'Not Set')}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{course.hours || localIdt('មិនកំណត់', 'Not Set')}</span>
                            </div>
                            {(() => {
                              const courseSchedules = timetables.filter(t => t.subject?.trim().toLowerCase() === course.title?.trim().toLowerCase());
                              if (courseSchedules.length > 0) {
                                return (
                                  <div className="flex flex-wrap gap-1 mt-0.5 max-w-[180px]">
                                    {courseSchedules.map((sched, idx) => (
                                      <span key={idx} className="inline-flex items-center px-1 py-0.5 bg-blue-50/60 text-blue-700 text-[9px] font-black rounded-md border border-blue-100/40 leading-none shrink-0" title={`${sched.dayOfWeek} • ${sched.startTime}-${sched.endTime}`}>
                                        {sched.dayOfWeek.slice(0, 3)} • {sched.startTime}
                                      </span>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 text-slate-700 font-medium text-xs">
                             {course.teacher ? (
                                <>
                                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 border border-blue-200/40 flex items-center justify-center text-[10px] font-black shrink-0 shadow-3xs">
                                    {(course.teacher.nameKh || course.teacher.nameEn || '?')[0]}
                                  </div>
                                  <span className="truncate max-w-[120px] font-bold text-slate-700">{course.teacher.nameKh || course.teacher.nameEn}</span>
                                </>
                             ) : (
                               <button
                                 onClick={() => handleEditClick(course)}
                                 className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50/60 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-lg text-[10px] font-bold transition-all border border-amber-200/50 cursor-pointer active:scale-95 animate-pulse"
                                 title={localIdt("ចាត់តាំងគ្រូបង្រៀន", "Assign Teacher")}
                               >
                                 <UserPlus className="w-3 h-3" />
                                 <span>{localIdt("ចាត់តាំងគ្រូ", "Assign Teacher")}</span>
                               </button>
                             )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 border shadow-3xs transition-all ${
                            hasStudents 
                              ? 'bg-blue-50 text-blue-700 border-blue-200/60' 
                              : 'bg-slate-50 text-slate-400 border-slate-200/40'
                          }`}>
                            <GraduationCap className={`w-3.5 h-3.5 ${hasStudents ? 'text-blue-500' : 'text-slate-400'}`} />
                            <span>{course.enrollments?.length || 0} {localIdt('នាក់', 'Pax')}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                            {/* Quick Enroll button */}
                            <button 
                              type="button" 
                              onClick={() => {
                                setEnrollData({ studentId: '', courseId: course.id });
                                setIsEnrollDialogOpen(true);
                              }} 
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-xl border border-emerald-100/50 transition-all cursor-pointer shadow-3xs active:scale-90 duration-150" 
                              title={localIdt("ចុះឈ្មោះសិស្សថ្មី", "Quick Enroll Student")}
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                            </button>
                            
                            {/* View Enrolled Students */}
                            <button 
                              type="button" 
                              onClick={() => setSelectedCourseForStudents(course)} 
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-xl border border-blue-100/50 transition-all cursor-pointer shadow-3xs active:scale-90 duration-150" 
                              title={localIdt("មើលបញ្ជីសិស្ស", "View Enrolled Students")}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            
                            {/* Edit Course */}
                            <button 
                              type="button" 
                              onClick={() => handleEditClick(course)} 
                              className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 hover:text-sky-700 rounded-xl border border-sky-100/50 transition-all cursor-pointer shadow-3xs active:scale-90 duration-150" 
                              title={localIdt("កែសម្រួលវគ្គសិក្សា", "Edit Course")}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            
                            {/* Delete Course */}
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }} 
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl border border-rose-100/50 transition-all cursor-pointer shadow-3xs active:scale-90 duration-150" 
                              title={localIdt("លុបវគ្គសិក្សា", "Delete Course")}
                            >
                              <Trash className="w-3.5 h-3.5" />
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
        ) : (
          /* Cards View Mode */
          loading ? (
            <div className="text-center py-24 bg-slate-50/20 rounded-b-2xl">
              <div className="flex flex-col items-center justify-center text-slate-400">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                {localIdt("កំពុងទាញយកទិន្នន័យ...", "Loading data...")}
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/20 rounded-b-2xl">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">{localIdt("រកមិនឃើញវគ្គសិក្សាឡើយ", "No Courses Found")}</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                {localIdt("មិនមានវគ្គសិក្សាណាដែលត្រូវនឹងតម្រងស្វែងរករបស់អ្នកឡើយ។", "There are no courses matching your search filters.")}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setIsAddDialogOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm">
                   <Plus className="w-4 h-4" /> {localIdt("បន្ថែមវគ្គសិក្សាថ្មី", "Add New Course")}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-slate-50/10 rounded-b-2xl">
              {filteredCourses.map((course) => {
                const initials = course.title
                  .split(' ')
                  .map((w: string) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();
                const hasStudents = (course.enrollments?.length || 0) > 0;
                const studentsCount = course.enrollments?.length || 0;
                
                // Map to some visual capacity
                const maxCapacity = 25;
                const enrollmentPercentage = Math.min(100, Math.round((studentsCount / maxCapacity) * 100));

                let titleHash = 0;
                const titleStr = course.title || '';
                for (let i = 0; i < titleStr.length; i++) {
                  titleHash = titleStr.charCodeAt(i) + ((titleHash << 5) - titleHash);
                }
                const gradientIdx = Math.abs(titleHash) % 5;
                const gradients = [
                  'bg-blue-500 text-white shadow-sm shadow-blue-500/10',
                  'bg-emerald-500 text-white shadow-sm shadow-emerald-500/10',
                  'bg-amber-500 text-white shadow-sm shadow-amber-500/10',
                  'bg-blue-500 text-white shadow-sm shadow-blue-500/10',
                  'bg-cyan-500 text-white shadow-sm shadow-cyan-500/10'
                ];
                const borderColors = [
                  'hover:border-blue-300',
                  'hover:border-emerald-300',
                  'hover:border-amber-300',
                  'hover:border-blue-300',
                  'hover:border-cyan-300'
                ];
                const shadowColors = [
                  'hover:shadow-blue-500/10',
                  'hover:shadow-emerald-500/10',
                  'hover:shadow-amber-500/10',
                  'hover:shadow-blue-500/10',
                  'hover:shadow-cyan-500/10'
                ];
                const chosenGradient = gradients[gradientIdx];
                const chosenBorder = borderColors[gradientIdx];
                const chosenShadow = shadowColors[gradientIdx];

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    key={course.id}
                    className={`bg-white rounded-3xl border border-slate-100 p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative ${chosenBorder} ${chosenShadow}`}
                  >
                    <div className="space-y-4">
                      {/* Top Header Card row */}
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 bg-blue-600 text-white shadow-md">
                          {initials || <BookOpen className="w-5 h-5" />}
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl text-xs border border-emerald-100/40 shadow-3xs">
                            ${Number(course.price).toFixed(2)}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono mt-1">ID: {course.id.slice(0, 8)}</span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm xl:text-base leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h4>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {!hasStudents ? (
                            <span className="text-[10px] font-bold text-rose-500">
                              {localIdt("គ្មានសិស្ស", "No Students")}
                            </span>
                          ) : course.enrollments?.length === stats.maxEnrollment ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-250/40">
                              🔥 {localIdt("ពេញនិយម", "Popular")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-250/40">
                              {localIdt("សកម្ម", "Active")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Meta Info list */}
                      <div className="space-y-2 border-t border-slate-50 pt-3">
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{course.duration || localIdt('មិនកំណត់', 'Not Set')}</span>
                        </div>
                        <div className="flex items-start gap-2 text-slate-600 text-xs font-medium">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="truncate">{course.hours || localIdt('មិនកំណត់', 'Not Set')}</span>
                            {(() => {
                              const courseSchedules = timetables.filter(t => t.subject?.trim().toLowerCase() === course.title?.trim().toLowerCase());
                              if (courseSchedules.length > 0) {
                                return (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {courseSchedules.map((sched, idx) => (
                                      <span key={idx} className="inline-flex items-center px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black rounded-md border border-blue-100/30 shrink-0">
                                        {sched.dayOfWeek} • {sched.startTime}-{sched.endTime}
                                      </span>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                        
                        {/* Teacher Row */}
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          {course.teacher ? (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[9px] font-black border border-slate-200">
                                {(course.teacher.nameKh || course.teacher.nameEn || '?')[0]}
                              </div>
                              <span className="font-bold text-slate-700 truncate">{course.teacher.nameKh || course.teacher.nameEn}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(course)}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[9px] font-bold border border-amber-200/50 cursor-pointer"
                            >
                              <UserPlus className="w-2.5 h-2.5" />
                              <span>{localIdt("ចាត់តាំងគ្រូ", "Assign Teacher")}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Enrollment progress bar gauge */}
                      <div className="space-y-1.5 border-t border-slate-50 pt-3">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span>{localIdt("សិស្សចុះឈ្មោះសិក្សា", "Student Enrollments")}</span>
                          <span className={studentsCount > 0 ? "text-blue-600" : "text-slate-400"}>
                            {studentsCount} / {maxCapacity} {localIdt("នាក់", "Pax")}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              studentsCount === 0 
                                ? 'w-0 bg-slate-300' 
                                : enrollmentPercentage >= 80 
                                  ? 'bg-amber-500' 
                                  : 'bg-blue-600'
                            }`} 
                            style={{ width: `${studentsCount === 0 ? 0 : Math.max(8, enrollmentPercentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions buttons row */}
                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEnrollData({ studentId: '', courseId: course.id });
                          setIsEnrollDialogOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{localIdt("ចុះឈ្មោះ", "Enroll")}</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedCourseForStudents(course)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer border border-slate-100"
                        title={localIdt("មើលបញ្ជីសិស្ស", "View Enrolled Students")}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleEditClick(course)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer border border-slate-100"
                        title={localIdt("កែសម្រួល", "Edit Course")}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl transition-colors cursor-pointer border border-rose-100/30"
                        title={localIdt("លុបវគ្គសិក្សា", "Delete Course")}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Add New Course Modal */}
      <AnimatePresence>
        {isAddDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsTeacherDropdownOpen(false);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 relative z-10 font-sans"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{localIdt("បន្ថែមវគ្គសិក្សាថ្មី", "Add New Course")}</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{localIdt("សូមបំពេញព័ត៌មានលម្អិតដើម្បីបង្កើតវគ្គសិក្សាថ្មី", "Please fill in details to create a new course")}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setIsTeacherDropdownOpen(false);
                  }} 
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Course Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Book className="w-4 h-4 text-slate-400" />
                    {localIdt("ឈ្មោះវគ្គសិក្សា", "Course Title")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative" ref={courseTitleDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpenCourseTitleDropdown(!isOpenCourseTitleDropdown);
                        setCourseTitleSearch('');
                      }}
                      className="w-full pl-11 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 text-left flex items-center justify-between transition-all text-sm h-[50px] cursor-pointer"
                    >
                      <span className={formData.title ? "text-slate-700 font-bold" : "text-slate-400"}>
                        {formData.title || localIdt("ជ្រើសរើសឈ្មោះវគ្គសិក្សា...", "Select course title...")}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenCourseTitleDropdown ? "rotate-180" : ""}`} />
                    </button>
                    <Book className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                    <AnimatePresence>
                      {isOpenCourseTitleDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 z-[130] mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 text-sm flex flex-col"
                        >
                          {/* Search Input inside Dropdown */}
                          <div className="relative mb-2 shrink-0">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={courseTitleSearch}
                              onChange={(e) => setCourseTitleSearch(e.target.value)}
                              placeholder={localIdt("ស្វែងរក ឬ បញ្ចូលថ្មី...", "Search or type new name...")}
                              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 bg-slate-50 focus:bg-white transition-all"
                              autoFocus
                            />
                          </div>

                          {/* Options List with Scrollbar */}
                          <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-0.5 dropdown-scrollbar">
                            {filteredCourseTitles.map((opt, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, title: opt });
                                  setIsOpenCourseTitleDropdown(false);
                                }}
                                className={`w-full text-left py-2 px-3 rounded-xl transition-all text-xs font-bold flex items-center justify-between cursor-pointer ${
                                  formData.title === opt 
                                    ? "bg-blue-50 text-blue-700" 
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span>{opt}</span>
                                {formData.title === opt && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                              </button>
                            ))}

                            {/* Create custom option if searching for a non-existent name */}
                            {courseTitleSearch.trim() && !filteredCourseTitles.some(opt => opt.toLowerCase() === courseTitleSearch.trim().toLowerCase()) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, title: courseTitleSearch.trim() });
                                  setIsOpenCourseTitleDropdown(false);
                                }}
                                className="w-full text-left py-2 px-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 text-blue-700 transition-all text-xs font-black flex items-center gap-1.5 border border-dashed border-blue-200 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5 text-blue-600" />
                                <span>{localIdt(`ប្រើប្រាស់៖ "${courseTitleSearch.trim()}"`, `Use custom: "${courseTitleSearch.trim()}"`)}</span>
                              </button>
                            )}

                            {filteredCourseTitles.length === 0 && !courseTitleSearch.trim() && (
                              <div className="py-6 text-center text-xs text-slate-400 font-bold">
                                {localIdt("គ្មានជម្រើសវគ្គសិក្សា", "No course options available")}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      {localIdt("តម្លៃសិក្សា ($)", "Tuition Fee ($)")} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        required 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={formData.price} 
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-bold text-slate-700 transition-all text-sm" 
                      />
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {localIdt("រយៈពេលសិក្សា", "Duration")}
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={formData.duration} 
                        onChange={e => setFormData({...formData, duration: e.target.value})} 
                        placeholder={localIdt("ឧ. ៣ ខែ", "e.g., 3 Months")} 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 transition-all text-sm" 
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Class Hours */}
                <div className="space-y-1.5" ref={hoursDropdownRef}>
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {localIdt("ម៉ោងសិក្សា", "Class Hours")}
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={formData.hours} 
                      onChange={e => setFormData({...formData, hours: e.target.value})} 
                      onFocus={() => setIsHoursDropdownOpen(true)}
                      placeholder={localIdt("ឧ. ចន្ទ-សុក្រ ៥-៦ល្ងាច", "e.g., Mon-Fri 5-6 PM")} 
                      className="w-full pl-11 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 transition-all text-sm animate-none" 
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setIsHoursDropdownOpen(!isHoursDropdownOpen)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isHoursDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isHoursDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-64 overflow-y-auto"
                        >
                          {/* Course schedules if course is selected */}
                          {formData.title && selectedCourseSchedules.length > 0 && (
                            <div className="p-3 border-b border-slate-100 bg-blue-50/30">
                              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-2">
                                {localIdt(`កាលវិភាគសម្រាប់វគ្គ ${formData.title}`, `Timetable for ${formData.title}`)}
                              </span>
                              <div className="flex flex-col gap-1">
                                {selectedCourseSchedules.map((sched, idx) => {
                                  const formattedTime = convert24To12Standard(sched.startTime, sched.endTime);
                                  const textValue = `${sched.dayOfWeek} ${formattedTime}`;
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, hours: textValue });
                                        setIsHoursDropdownOpen(false);
                                      }}
                                      className="text-left w-full px-2.5 py-1.5 hover:bg-blue-50 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                                    >
                                      <span>{sched.dayOfWeek} • {formattedTime}</span>
                                      <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black">
                                        {sched.room || 'No Room'}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* All available hours across timetables */}
                          {uniqueTimetableHours.length > 0 && (
                            <div className="p-3 border-b border-slate-100">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                                {localIdt("ម៉ោងសិក្សាក្នុងកាលវិភាគទាំងអស់", "All Timetable Hours")}
                              </span>
                              <div className="grid grid-cols-2 gap-1">
                                {uniqueTimetableHours.map((hoursOpt, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, hours: hoursOpt });
                                      setIsHoursDropdownOpen(false);
                                    }}
                                    className="text-left w-full px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                  >
                                    {hoursOpt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Common presets */}
                          <div className="p-3 bg-slate-50/40">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                              {localIdt("គំរូទូទៅ", "Common Presets")}
                            </span>
                            <div className="flex flex-col gap-1">
                              {[
                                localIdt("ចន្ទ-សុក្រ ៥-៦ល្ងាច", "Mon-Fri 5:00 - 6:00 PM"),
                                localIdt("ចន្ទ-សុក្រ ៦:០០-៧:៣០ល្ងាច", "Mon-Fri 6:00 - 7:30 PM"),
                                localIdt("សៅរ៍-អាទិត្យ ៨-១១ព្រឹក", "Sat-Sun 8:00 - 11:00 AM"),
                                localIdt("សៅរ៍-អាទិត្យ ២-៥រសៀល", "Sat-Sun 2:00 - 5:00 PM")
                              ].map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, hours: preset });
                                    setIsHoursDropdownOpen(false);
                                  }}
                                  className="text-left w-full px-2.5 py-1.5 hover:bg-slate-100 text-slate-600 rounded-lg text-xs transition-all cursor-pointer"
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Teacher selection with autocomplete dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {localIdt("គ្រូបង្រៀន", "Teacher")}
                  </label>
                  
                  <div className="relative" ref={teacherDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xs">
                          {selectedTeacher ? (
                            <span>{(selectedTeacher.nameKh || selectedTeacher.nameEn || '?')[0]}</span>
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <span className={selectedTeacher ? "text-slate-800 font-bold text-sm" : "text-slate-400 text-sm"}>
                          {selectedTeacher ? (selectedTeacher.nameKh || selectedTeacher.nameEn) : localIdt("ជ្រើសរើសគ្រូបង្រៀន", "Select Teacher")}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isTeacherDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isTeacherDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-60"
                        >
                          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            <input
                              type="text"
                              placeholder={localIdt("ស្វែងរកឈ្មោះគ្រូ...", "Search teacher...")}
                              value={teacherSearch}
                              onChange={e => setTeacherSearch(e.target.value)}
                              className="w-full p-1.5 bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-slate-700 placeholder-slate-400"
                              autoFocus
                            />
                            {teacherSearch && (
                              <button 
                                type="button" 
                                onClick={() => setTeacherSearch('')}
                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto flex-1 max-h-48 divide-y divide-slate-50">
                            {filteredTeachers.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 font-medium">{localIdt("រកមិនឃើញទិន្នន័យឡើយ", "No data found")}</div>
                            ) : (
                              filteredTeachers.map(t => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, teacherId: t.id });
                                    setIsTeacherDropdownOpen(false);
                                    setTeacherSearch('');
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50/40 transition-colors ${formData.teacherId === t.id ? 'bg-blue-50/60 font-bold' : ''}`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                    {(t.nameKh || t.nameEn || '?')[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-slate-800 truncate">{t.nameKh || t.nameEn}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.teacherId}</div>
                                  </div>
                                  {formData.teacherId === t.id && (
                                    <Check className="w-4 h-4 text-blue-600 font-black shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-1">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setIsTeacherDropdownOpen(false);
                    }} 
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors active:scale-[0.98]"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit" 
                    disabled={!formData.title}
                    className={`px-6 py-3 font-bold rounded-2xl text-sm shadow-lg transition-all active:scale-[0.98] ${
                      !formData.title
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10 hover:shadow-blue-600/20'
                    }`}
                  >
                    {localIdt("រក្សាទុក", "Save")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enroll Student Modal */}
      <AnimatePresence>
        {isEnrollDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]"
              onClick={() => {
                setIsEnrollDialogOpen(false);
                setIsStudentDropdownOpen(false);
                setIsCourseDropdownOpen(false);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 relative z-10 font-sans"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{localIdt("ចុះឈ្មោះសិស្សចូលរៀនវគ្គថ្មី", "Enroll Student in New Course")}</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{localIdt("ជ្រើសរើសសិស្ស និងវគ្គសិក្សាដែលចង់អោយចូលរៀន", "Select student and course to enroll")}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsEnrollDialogOpen(false);
                    setIsStudentDropdownOpen(false);
                    setIsCourseDropdownOpen(false);
                  }} 
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleEnrollSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Student Selection Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {localIdt("សិស្ស", "Student")} <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="relative" ref={studentDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xs">
                          {selectedStudent ? (
                            <span>{(selectedStudent.nameKh || selectedStudent.nameEn || '?')[0]}</span>
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <span className={selectedStudent ? "text-slate-800 font-bold text-sm" : "text-slate-400 text-sm"}>
                          {selectedStudent ? `${selectedStudent.nameKh || selectedStudent.nameEn} (${selectedStudent.studentId})` : localIdt("ជ្រើសរើសសិស្ស", "Select Student")}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isStudentDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isStudentDropdownOpen && (
                        <motion.div
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           transition={{ duration: 0.15 }}
                           className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-60"
                        >
                          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            <input
                              type="text"
                              placeholder={localIdt("ស្វែងរកសិស្ស...", "Search student...")}
                              value={studentSearch}
                              onChange={e => setStudentSearch(e.target.value)}
                              className="w-full p-1.5 bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-slate-700 placeholder-slate-400"
                              autoFocus
                            />
                            {studentSearch && (
                              <button 
                                type="button" 
                                onClick={() => setStudentSearch('')}
                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto flex-1 max-h-48 divide-y divide-slate-50">
                            {filteredStudents.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 font-medium">{localIdt("រកមិនឃើញទិន្នន័យសិស្សឡើយ", "No student data found")}</div>
                            ) : (
                              filteredStudents.map(s => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => {
                                    setEnrollData({ ...enrollData, studentId: s.id });
                                    setIsStudentDropdownOpen(false);
                                    setStudentSearch('');
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50/40 transition-colors ${enrollData.studentId === s.id ? 'bg-blue-50/60 font-bold' : ''}`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                    {(s.nameKh || s.nameEn || '?')[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-slate-800 truncate">{s.nameKh || s.nameEn}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.studentId}</div>
                                  </div>
                                  {enrollData.studentId === s.id && (
                                    <Check className="w-4 h-4 text-blue-600 font-black shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Course Selection Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    {localIdt("វគ្គសិក្សា", "Course")} <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="relative" ref={courseDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xs">
                          {selectedEnrollCourse ? (
                            <span>{(selectedEnrollCourse.title || '?')[0]}</span>
                          ) : (
                            <BookOpen className="w-4 h-4" />
                          )}
                        </div>
                        <span className={selectedEnrollCourse ? "text-slate-800 font-bold text-sm" : "text-slate-400 text-sm"}>
                          {selectedEnrollCourse ? selectedEnrollCourse.title : localIdt("ជ្រើសរើសវគ្គសិក្សា", "Select Course")}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isCourseDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isCourseDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-60"
                        >
                          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            <input
                              type="text"
                              placeholder={localIdt("ស្វែងរកវគ្គសិក្សា...", "Search courses...")}
                              value={courseSearch}
                              onChange={e => setCourseSearch(e.target.value)}
                              className="w-full p-1.5 bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-slate-700 placeholder-slate-400"
                              autoFocus
                            />
                            {courseSearch && (
                              <button 
                                type="button" 
                                onClick={() => setCourseSearch('')}
                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto flex-1 max-h-48 divide-y divide-slate-50">
                            {filteredEnrollCourses.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 font-medium">{localIdt("រកមិនឃើញវគ្គសិក្សាឡើយ", "No courses found")}</div>
                            ) : (
                              filteredEnrollCourses.map(c => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    setEnrollData({ ...enrollData, courseId: c.id });
                                    setIsCourseDropdownOpen(false);
                                    setCourseSearch('');
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50/40 transition-colors ${enrollData.courseId === c.id ? 'bg-blue-50/60 font-bold' : ''}`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                    {(c.title || '?')[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-slate-800 truncate">{c.title}</div>
                                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">${Number(c.price).toFixed(2)}</div>
                                  </div>
                                  {enrollData.courseId === c.id && (
                                    <Check className="w-4 h-4 text-blue-600 font-black shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-1">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEnrollDialogOpen(false);
                      setIsStudentDropdownOpen(false);
                      setIsCourseDropdownOpen(false);
                    }} 
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors active:scale-[0.98]"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit" 
                    disabled={!enrollData.studentId || !enrollData.courseId}
                    className={`px-6 py-3 font-bold rounded-2xl text-sm shadow-lg transition-all active:scale-[0.98] ${
                      !enrollData.studentId || !enrollData.courseId 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10 hover:shadow-blue-600/20'
                    }`}
                  >
                    {localIdt("ចុះឈ្មោះ", "Enroll")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {courseToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setCourseToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden border border-slate-200"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {localIdt("បញ្ជាក់ការលុប", "Confirm Delete")}
                </h3>
                <p className="text-slate-500 mb-6 text-sm">
                  {localIdt("តើអ្នកពិតជាចង់លុបវគ្គសិក្សានេះមែនទេ? ទិន្នន័យដែលពាក់ព័ន្ធនឹងត្រូវលុបផងដែរ។", "Are you sure you want to delete this course? Related enrollments will be deleted.")}
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setCourseToDelete(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="button"
                    onClick={executeDeleteCourse}
                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-rose-500/20"
                  >
                    {localIdt("លុបចេញ", "Delete")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Course Modal */}
      <AnimatePresence>
        {isEditDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]"
              onClick={() => {
                setIsEditDialogOpen(false);
                setIsEditTeacherDropdownOpen(false);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 relative z-10 font-sans"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <Edit2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{localIdt("កែសម្រួលវគ្គសិក្សា", "Edit Course")}</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{localIdt("សូមកែសម្រួលព័ត៌មានលម្អិតនៃវគ្គសិក្សានេះ", "Please modify details of this course")}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setIsEditTeacherDropdownOpen(false);
                  }} 
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Course Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Book className="w-4 h-4 text-slate-400" />
                    {localIdt("ឈ្មោះវគ្គសិក្សា", "Course Title")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative" ref={editCourseTitleDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpenEditCourseTitleDropdown(!isOpenEditCourseTitleDropdown);
                        setEditCourseTitleSearch('');
                      }}
                      className="w-full pl-11 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 text-left flex items-center justify-between transition-all text-sm h-[50px] cursor-pointer"
                    >
                      <span className={editFormData.title ? "text-slate-700 font-bold" : "text-slate-400"}>
                        {editFormData.title || localIdt("ជ្រើសរើសឈ្មោះវគ្គសិក្សា...", "Select course title...")}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenEditCourseTitleDropdown ? "rotate-180" : ""}`} />
                    </button>
                    <Book className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                    <AnimatePresence>
                      {isOpenEditCourseTitleDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 z-[130] mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 text-sm flex flex-col"
                        >
                          {/* Search Input inside Dropdown */}
                          <div className="relative mb-2 shrink-0">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={editCourseTitleSearch}
                              onChange={(e) => setEditCourseTitleSearch(e.target.value)}
                              placeholder={localIdt("ស្វែងរក ឬ បញ្ចូលថ្មី...", "Search or type new name...")}
                              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 bg-slate-50 focus:bg-white transition-all"
                              autoFocus
                            />
                          </div>

                          {/* Options List with Scrollbar */}
                          <div className="overflow-y-auto max-h-[180px] space-y-0.5 pr-0.5 dropdown-scrollbar">
                            {filteredEditCourseTitles.map((opt, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setEditFormData({ ...editFormData, title: opt });
                                  setIsOpenEditCourseTitleDropdown(false);
                                }}
                                className={`w-full text-left py-2 px-3 rounded-xl transition-all text-xs font-bold flex items-center justify-between cursor-pointer ${
                                  editFormData.title === opt 
                                    ? "bg-blue-50 text-blue-700" 
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span>{opt}</span>
                                {editFormData.title === opt && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                              </button>
                            ))}

                            {/* Create custom option if searching for a non-existent name */}
                            {editCourseTitleSearch.trim() && !filteredEditCourseTitles.some(opt => opt.toLowerCase() === editCourseTitleSearch.trim().toLowerCase()) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditFormData({ ...editFormData, title: editCourseTitleSearch.trim() });
                                  setIsOpenEditCourseTitleDropdown(false);
                                }}
                                className="w-full text-left py-2 px-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 text-blue-700 transition-all text-xs font-black flex items-center gap-1.5 border border-dashed border-blue-200 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5 text-blue-600" />
                                <span>{localIdt(`ប្រើប្រាស់៖ "${editCourseTitleSearch.trim()}"`, `Use custom: "${editCourseTitleSearch.trim()}"`)}</span>
                              </button>
                            )}

                            {filteredEditCourseTitles.length === 0 && !editCourseTitleSearch.trim() && (
                              <div className="py-6 text-center text-xs text-slate-400 font-bold">
                                {localIdt("គ្មានជម្រើសវគ្គសិក្សា", "No course options available")}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      {localIdt("តម្លៃសិក្សា ($)", "Tuition Fee ($)")} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        required 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={editFormData.price} 
                        onChange={e => setEditFormData({...editFormData, price: Number(e.target.value)})} 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-bold text-slate-700 transition-all text-sm" 
                      />
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {localIdt("រយៈពេលសិក្សា", "Duration")}
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={editFormData.duration} 
                        onChange={e => setEditFormData({...editFormData, duration: e.target.value})} 
                        placeholder={localIdt("ឧ. ៣ ខែ", "e.g., 3 Months")} 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 transition-all text-sm" 
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Class Hours */}
                <div className="space-y-1.5" ref={editHoursDropdownRef}>
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {localIdt("ម៉ោងសិក្សា", "Class Hours")}
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={editFormData.hours} 
                      onChange={e => setEditFormData({...editFormData, hours: e.target.value})} 
                      onFocus={() => setIsEditHoursDropdownOpen(true)}
                      placeholder={localIdt("ឧ. ចន្ទ-សុក្រ ៥-៦ល្ងាច", "e.g., Mon-Fri 5-6 PM")} 
                      className="w-full pl-11 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium text-slate-700 transition-all text-sm animate-none" 
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setIsEditHoursDropdownOpen(!isEditHoursDropdownOpen)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isEditHoursDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isEditHoursDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-64 overflow-y-auto"
                        >
                          {/* Course schedules if course is selected */}
                          {editFormData.title && selectedEditCourseSchedules.length > 0 && (
                            <div className="p-3 border-b border-slate-100 bg-blue-50/30">
                              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-2">
                                {localIdt(`កាលវិភាគសម្រាប់វគ្គ ${editFormData.title}`, `Timetable for ${editFormData.title}`)}
                              </span>
                              <div className="flex flex-col gap-1">
                                {selectedEditCourseSchedules.map((sched, idx) => {
                                  const formattedTime = convert24To12Standard(sched.startTime, sched.endTime);
                                  const textValue = `${sched.dayOfWeek} ${formattedTime}`;
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setEditFormData({ ...editFormData, hours: textValue });
                                        setIsEditHoursDropdownOpen(false);
                                      }}
                                      className="text-left w-full px-2.5 py-1.5 hover:bg-blue-50 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                                    >
                                      <span>{sched.dayOfWeek} • {formattedTime}</span>
                                      <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black">
                                        {sched.room || 'No Room'}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* All available hours across timetables */}
                          {uniqueTimetableHours.length > 0 && (
                            <div className="p-3 border-b border-slate-100">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                                {localIdt("ម៉ោងសិក្សាក្នុងកាលវិភាគទាំងអស់", "All Timetable Hours")}
                              </span>
                              <div className="grid grid-cols-2 gap-1">
                                {uniqueTimetableHours.map((hoursOpt, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setEditFormData({ ...editFormData, hours: hoursOpt });
                                      setIsEditHoursDropdownOpen(false);
                                    }}
                                    className="text-left w-full px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                  >
                                    {hoursOpt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Common presets */}
                          <div className="p-3 bg-slate-50/40">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                              {localIdt("គំរូទូទៅ", "Common Presets")}
                            </span>
                            <div className="flex flex-col gap-1">
                              {[
                                localIdt("ចន្ទ-សុក្រ ៥-៦ល្ងាច", "Mon-Fri 5:00 - 6:00 PM"),
                                localIdt("ចន្ទ-សុក្រ ៦:០០-៧:៣០ល្ងាច", "Mon-Fri 6:00 - 7:30 PM"),
                                localIdt("សៅរ៍-អាទិត្យ ៨-១១ព្រឹក", "Sat-Sun 8:00 - 11:00 AM"),
                                localIdt("សៅរ៍-អាទិត្យ ២-៥រសៀល", "Sat-Sun 2:00 - 5:00 PM")
                              ].map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setEditFormData({ ...editFormData, hours: preset });
                                    setIsEditHoursDropdownOpen(false);
                                  }}
                                  className="text-left w-full px-2.5 py-1.5 hover:bg-slate-100 text-slate-600 rounded-lg text-xs transition-all cursor-pointer"
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Teacher selection with autocomplete dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {localIdt("គ្រូបង្រៀន", "Teacher")}
                  </label>
                  
                  <div className="relative" ref={editTeacherDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsEditTeacherDropdownOpen(!isEditTeacherDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xs">
                          {selectedEditTeacher ? (
                            <span>{(selectedEditTeacher.nameKh || selectedEditTeacher.nameEn || '?')[0]}</span>
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <span className={selectedEditTeacher ? "text-slate-800 font-bold text-sm" : "text-slate-400 text-sm"}>
                          {selectedEditTeacher ? (selectedEditTeacher.nameKh || selectedEditTeacher.nameEn) : localIdt("ជ្រើសរើសគ្រូបង្រៀន", "Select Teacher")}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isEditTeacherDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isEditTeacherDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-60"
                        >
                          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            <input
                              type="text"
                              placeholder={localIdt("ស្វែងរកឈ្មោះគ្រូ...", "Search teacher...")}
                              value={editTeacherSearch}
                              onChange={e => setEditTeacherSearch(e.target.value)}
                              className="w-full p-1.5 bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-slate-700 placeholder-slate-400"
                              autoFocus
                            />
                            {editTeacherSearch && (
                              <button 
                                type="button" 
                                onClick={() => setEditTeacherSearch('')}
                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto flex-1 max-h-48 divide-y divide-slate-50">
                            {filteredEditTeachers.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 font-medium">{localIdt("រកមិនឃើញទិន្នន័យឡើយ", "No data found")}</div>
                            ) : (
                              filteredEditTeachers.map(t => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => {
                                    setEditFormData({ ...editFormData, teacherId: t.id });
                                    setIsEditTeacherDropdownOpen(false);
                                    setEditTeacherSearch('');
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50/40 transition-colors ${editFormData.teacherId === t.id ? 'bg-blue-50/60 font-bold' : ''}`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                    {(t.nameKh || t.nameEn || '?')[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-slate-800 truncate">{t.nameKh || t.nameEn}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.teacherId}</div>
                                  </div>
                                  {editFormData.teacherId === t.id && (
                                    <Check className="w-4 h-4 text-blue-600 font-black shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-1">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setIsEditTeacherDropdownOpen(false);
                    }} 
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors active:scale-[0.98]"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit" 
                    disabled={!editFormData.title}
                    className={`px-6 py-3 font-bold rounded-2xl text-sm shadow-lg transition-all active:scale-[0.98] ${
                      !editFormData.title
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10 hover:shadow-blue-600/20'
                    }`}
                  >
                    {localIdt("រក្សាទុក", "Save")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Enrolled Students Modal */}
      <AnimatePresence>
        {selectedCourseForStudents && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]"
              onClick={() => setSelectedCourseForStudents(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 relative z-10 font-sans"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{selectedCourseForStudents.title}</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {localIdt(`បញ្ជីឈ្មោះសិស្សដែលបានចុះឈ្មោះសិក្សា (${enrolledStudents.length} នាក់)`, `List of enrolled students (${enrolledStudents.length} pax)`)}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCourseForStudents(null)} 
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Enrolled Students List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {enrolledStudents.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500">{localIdt("មិនទាន់មានសិស្សចុះឈ្មោះឡើយ", "No students enrolled yet")}</p>
                      <p className="text-xs text-slate-400 mt-1">{localIdt("សូមចុចប៊ូតុង \"ចុះឈ្មោះសិស្ស\" នៅទំព័រដើមដើម្បីចុះឈ្មោះ", "Please use the \"Enroll Student\" button to register students")}</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {enrolledStudents.map((student: any) => (
                      <div key={student.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs">
                            {student.gender === 'Female' || student.gender === 'ស្រី' ? '👩' : '👨'}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{student.nameKh || student.nameEn}</h4>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{student.studentId} • {student.phone || localIdt("គ្មានលេខទូរស័ព្ទ", "No phone")}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                          {student.gender || localIdt("មិនកំណត់", "N/A")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setSelectedCourseForStudents(null)} 
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                >
                  {localIdt("បិទ", "Close")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
