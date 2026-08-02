import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Key, UserPlus, ShieldCheck, Trash2, Search, Eye, EyeOff, Check, X, ShieldAlert, Layers, Smartphone, CheckCircle2, XCircle, HelpCircle, UserCheck, Sliders, Shield, Database, Activity, Clock, Monitor, Globe, RefreshCw, Cpu, Terminal, LogIn, Info, Users, Edit2, Save } from 'lucide-react';

export interface StaffAccount {
  id: string;
  nameKh: string;
  nameEn: string;
  username: string;
  role: "ADMIN" | "ACCOUNTANT" | "TEACHER" | "STUDENT";
  phone: string;
  pass: string;
  createdAt: string;
  permissions?: string[];
}

interface CredentialsTabProps {
  showToast: (message: string, type: "success" | "error" | "info") => void;
  uiLang?: "kh" | "en" | "zh";
  loggedInUser?: any;
}

const roleDefaults: Record<"ADMIN" | "ACCOUNTANT" | "TEACHER" | "STUDENT", string[]> = {
  ADMIN: ["Dashboard", "Analytics", "Announcements", "Students", "Courses", "Timetable", "Grading", "Exams", "Report Cards", "Certificates", "Library", "Alumni", "Teachers", "Leave", "Attendance", "QR Scan", "Attendance Display", "Parent Portal", "Finance", "Assets", "ID Card", "Credentials", "Settings", "MySQL DB"],
  ACCOUNTANT: ["Dashboard", "Analytics", "Announcements", "Students", "Courses", "Timetable", "Grading", "Report Cards", "Certificates", "Attendance", "QR Scan", "Finance"],
  TEACHER: ["Dashboard", "Students", "Courses", "Timetable", "Grading", "Exams", "Report Cards", "Attendance", "QR Scan", "Leave"],
  STUDENT: ["Dashboard", "Timetable", "Attendance", "Grading", "Report Cards", "Finance", "Library"]
};

const systemPermissions = [
  // GENERAL / REPORTS
  {
    key: "Dashboard",
    labelKh: "ផ្ទាំងគ្រប់គ្រង (Dashboard)",
    labelEn: "Dashboard Overview",
    labelZh: "系统仪表盘 (Dashboard)",
    descKh: "មើលរបាយការណ៍សង្ខេប សិស្សសរុប វត្តមាន និងចំណូល",
    descEn: "View overview reports, total students, attendance, and revenue.",
    descZh: "查看系统概览报告、学生总数、出勤情况和财务收入。"
  },
  {
    key: "Analytics",
    labelKh: "របាយការណ៍ (Analytics)",
    labelEn: "Analytics Reports",
    labelZh: "数据分析 (Analytics)",
    descKh: "មើលក្រាហ្វិកស្ថិតិសិស្ស ចំណូលចំណាយ និងវត្តមានលម្អិត",
    descEn: "View student statistics graphs, detailed revenue & attendance.",
    descZh: "查看学生统计图表、详细收入与出勤分析。"
  },
  {
    key: "Announcements",
    labelKh: "ផ្សព្វផ្សាយ (Announcements)",
    labelEn: "School Announcements",
    labelZh: "通知公告 (Announcements)",
    descKh: "បង្កើត និងផ្ញើសេចក្តីជូនដំណឹងទៅ Telegram អាណាព្យាបាល",
    descEn: "Create and broadcast school announcements to parent Telegram chats.",
    descZh: "发布学校公告并通过电报机器人推送到家长端。"
  },
  // ACADEMIC
  {
    key: "Students",
    labelKh: "សិស្សានុសិស្ស (Students)",
    labelEn: "Student Registry",
    labelZh: "学生管理 (Students)",
    descKh: "គ្រប់គ្រងឈ្មោះសិស្ស ចុះឈ្មោះ និងព័ត៌មានលម្អិតសិស្ស",
    descEn: "Manage student rosters, enrollment registration, and profiles.",
    descZh: "管理学生花名册、入学注册和个人档案信息。"
  },
  {
    key: "Courses",
    labelKh: "វគ្គសិក្សា (Courses)",
    labelEn: "Course Management",
    labelZh: "课程管理 (Courses)",
    descKh: "បង្កើត និងគ្រប់គ្រងមុខវិជ្ជា ម៉ោងសិក្សា និងកម្រិតសិក្សា",
    descEn: "Create and manage course subjects, study hours, and academic levels.",
    descZh: "开设并管理专业学科、学时设置和课程级别。"
  },
  {
    key: "Timetable",
    labelKh: "កាលវិភាគ (Timetable)",
    labelEn: "Class Timetable",
    labelZh: "课表排程 (Timetable)",
    descKh: "រៀបចំកាលវិភាគសិក្សាប្រចាំសប្តាហ៍សម្រាប់សិស្ស និងគ្រូ",
    descEn: "Organize weekly class timetables and room schedules.",
    descZh: "安排学生及授课教师的每周课程时间表与教室占用。"
  },
  {
    key: "Grading",
    labelKh: "ពិន្ទុ & ប្រឡង (Grading)",
    labelEn: "Gradebook & Results",
    labelZh: "成绩与评级 (Grading)",
    descKh: "បញ្ចូលពិន្ទុសិស្សប្រចាំខែ វាយតម្លៃលទ្ធផលសិក្សា",
    descEn: "Record monthly exam marks and student academic performance.",
    descZh: "录入学生月考成绩并评估其综合学业水平表现。"
  },
  {
    key: "Exams",
    labelKh: "ការប្រឡងអនឡាញ (Online Exams)",
    labelEn: "Online Examination",
    labelZh: "在线考试 (Online Exams)",
    descKh: "បង្កើតវិញ្ញាសាប្រឡងអនឡាញ និងលទ្ធផលប្រឡង",
    descEn: "Create digital test papers, customize quiz options, and check scores.",
    descZh: "在线出题组织考试、自定义试题选项并汇总自动评分。"
  },
  {
    key: "Report Cards",
    labelKh: "ព្រឹត្តិបត្រពិន្ទុ (Report Cards)",
    labelEn: "Student Report Cards",
    labelZh: "学生成绩单 (Report Cards)",
    descKh: "រៀបចំ និងបោះពុម្ពព្រឹត្តិបត្រពិន្ទុប្រចាំខែ/ឆមាស",
    descEn: "Compile, customize, and print monthly or semester progress cards.",
    descZh: "整理、自定义设计并打印学生月考或期末生成绩单。"
  },
  {
    key: "Certificates",
    labelKh: "វិញ្ញាបនបត្រ (Certificates)",
    labelEn: "Print Certificates",
    labelZh: "证书设计打印 (Certificates)",
    descKh: "រចនា និងបោះពុម្ពវិញ្ញាបនបត្របញ្ចប់ការសិក្សា",
    descEn: "Design, generate, and print graduation/course certificates.",
    descZh: "在线设计、生成并打印学生毕业证书/结业证书。"
  },
  {
    key: "Library",
    labelKh: "បណ្ណាល័យ (Library)",
    labelEn: "Library Manager",
    labelZh: "图书管理 (Library)",
    descKh: "គ្រប់គ្រងបញ្ជីសៀវភៅ ការខ្ចី និងសងសៀវភៅបណ្ណាល័យ",
    descEn: "Track book inventory, student rentals, and overdue returns.",
    descZh: "登记在库图书、记录学生借阅日志及逾期未还预警。"
  },
  {
    key: "Alumni",
    labelKh: "អតីតសិស្ស (Alumni)",
    labelEn: "Alumni Directory",
    labelZh: "校友名录 (Alumni)",
    descKh: "រក្សាទុកទិន្នន័យសិស្សដែលបានបញ្ចប់ការសិក្សា",
    descEn: "Maintain information and registry of successfully graduated students.",
    descZh: "保存并管理已顺利毕业离校的学生终身档案。"
  },
  // STAFF & HR
  {
    key: "Teachers",
    labelKh: "លោកគ្រូ-អ្នកគ្រូ (Teachers)",
    labelEn: "Teachers & Salary",
    labelZh: "教师与薪资 (Teachers)",
    descKh: "គ្រប់គ្រងបុគ្គលិក គ្រូបង្រៀន និងការបើកប្រាក់ខែ",
    descEn: "Manage teaching staff registry, profiles, and salary payments.",
    descZh: "管理在职教师花名册、个人档案以及每月薪资发放。"
  },
  {
    key: "Leave",
    labelKh: "សុំច្បាប់ (Leave Requests)",
    labelEn: "Staff Leave Requests",
    labelZh: "请假申请 (Leave Requests)",
    descKh: "គ្រប់គ្រងការសុំច្បាប់ឈប់សម្រាករបស់សិស្ស និងបុគ្គលិក",
    descEn: "Approve or track student and employee absenteeism leave filings.",
    descZh: "审核并记录学生或教职工的病假/事假等请假单。"
  },
  // OPERATIONS
  {
    key: "Attendance",
    labelKh: "វត្តមាន (Attendance)",
    labelEn: "Attendance Logging",
    labelZh: "考勤管理 (Attendance)",
    descKh: "កត់វត្តមានសិស្សប្រចាំថ្ងៃ និងវត្តមានគ្រូ",
    descEn: "Record daily student attendance and staff clock-in/out logs.",
    descZh: "记录每日学生考勤、教职工签到退以及考勤日志。"
  },
  {
    key: "QR Scan",
    labelKh: "ស្កេន QR កូដ (QR Scan)",
    labelEn: "QR Code Scanner",
    labelZh: "QR 扫码 (QR Scan)",
    descKh: "ស្កេនវត្តមានដោយស្វ័យប្រវត្តិតាម QR កូដ",
    descEn: "Scan attendance automatically using QR code IDs.",
    descZh: "使用内置/外置扫码设备扫描二维码自动登记考勤。"
  },
  {
    key: "Attendance Display",
    labelKh: "ផ្ទាំងបង្ហាញវត្តមាន (Attendance Display)",
    labelEn: "Live Attendance TV",
    labelZh: "考勤大屏 (Attendance Display)",
    descKh: "បង្ហាញវត្តមានស្កេនជោគជ័យលើទូរទស្សន៍/ម៉ូនីទ័រ",
    descEn: "Display real-time scanned attendance results on a classroom monitor.",
    descZh: "在大屏幕或监控电视上实时滚动播报考勤打卡结果。"
  },
  {
    key: "Parent Portal",
    labelKh: "ទំនាក់ទំនងអាណាព្យាបាល (Parent Portal)",
    labelEn: "Parent Telegram Portal",
    labelZh: "家长电报互联 (Parent Portal)",
    descKh: "តភ្ជាប់ និងគ្រប់គ្រង Telegram Chat ID របស់អាណាព្យាបាល",
    descEn: "Configure, sync, and manage parents' Telegram notification channels.",
    descZh: "连接并维护学生家长的 Telegram 专属通知通道。"
  },
  {
    key: "Finance",
    labelKh: "ហិរញ្ញវត្ថុ (Finance)",
    labelEn: "Finances & Billing",
    labelZh: "财务与账单 (Finance)",
    descKh: "គ្រប់គ្រងការបង់ថ្លៃសិក្សា វិក្កយបត្រ និងចំណូលចំណាយ",
    descEn: "Manage tuition fee payments, invoice records, and school expenses.",
    descZh: "管理学费收缴、打印发票凭证 and 学校日常收支账目。"
  },
  {
    key: "Assets",
    labelKh: "គ្រប់គ្រងទ្រព្យសម្បត្តិ (Inventory & Assets)",
    labelEn: "Inventory & Assets",
    labelZh: "校产与物资管理 (Inventory & Assets)",
    descKh: "កត់ត្រាទ្រព្យសម្បត្តិសាលា ឧបករណ៍ និងសម្ភារៈក្នុងបន្ទប់",
    descEn: "Track school property, lab equipment, and classroom inventory.",
    descZh: "登记学校固定资产、实验室设备和课室物资损耗。"
  },
  // SYSTEM CORE
  {
    key: "ID Card",
    labelKh: "កាតសម្គាល់ខ្លួន (ID Card)",
    labelEn: "Student/Staff ID Cards",
    labelZh: "证件设计打印 (ID Card)",
    descKh: "រចនា និងបោះពុម្ពកាតសិស្ស និងបុគ្គលិកជាមួយ QR/Barcode",
    descEn: "Design and print modern student/staff photo ID cards.",
    descZh: "在线排版并打印带条码/二维码的学生与教工证件卡。"
  },
  {
    key: "Credentials",
    labelKh: "គណនី និងសិទ្ធិ (Credentials)",
    labelEn: "Roles & Permissions",
    labelZh: "账户与权限管理 (Credentials)",
    descKh: "បង្កើត និងលុបគណនីបុគ្គលិក កែប្រែសិទ្ធិប្រព័ន្ធ",
    descEn: "Create or delete staff credentials and configure system permissions.",
    descZh: "创建、删除员工登录账户并精细化配置其系统权限。"
  },
  {
    key: "Settings",
    labelKh: "ការកំណត់ (Settings)",
    labelEn: "System Settings",
    labelZh: "核心系统设置 (Settings)",
    descKh: "កំណត់ព័ត៌មានសាលា លេខទូរស័ព្ទ និមិត្តសញ្ញា និង Telegram Bot",
    descEn: "Configure school profile, contact info, logo, and active Telegram bot tokens.",
    descZh: "配置学校名称地址、联系电话、标志、以及通知机器人令牌。"
  },
  {
    key: "MySQL DB",
    labelKh: "ផ្ទេរទិន្នន័យ MySQL (MySQL DB)",
    labelEn: "MySQL DB Migrator",
    labelZh: "MySQL 数据同步 (MySQL DB)",
    descKh: "ផ្ទេរទិន្នន័យពី MySQL ទៅកាន់ PostgreSQL Cloud DB",
    descEn: "Migrate or sync external school legacy databases to modern cloud.",
    descZh: "一键同步或迁移外部旧版数据库到云端 PostgreSQL。"
  }
];

export const CredentialsTab: React.FC<CredentialsTabProps> = ({ showToast, uiLang = "kh", loggedInUser }) => {
  const idt = (kh: string, en?: string, zh?: string) => {
    if (uiLang === "en") return en || kh;
    if (uiLang === "zh") return zh || en || kh;
    return kh;
  };

  const getStaffNameWithTitle = (nameKh: string, nameEn: string) => {
    if (uiLang === "kh") return nameKh;
    // For English or Chinese:
    let title = "";
    if (nameKh.startsWith("លោកគ្រូ")) {
      title = uiLang === "zh" ? " 老师" : " (Teacher)";
    } else if (nameKh.startsWith("អ្នកគ្រូ")) {
      title = uiLang === "zh" ? " 老师" : " (Teacher)";
    } else if (nameKh.startsWith("កញ្ញា")) {
      title = uiLang === "zh" ? " 女士" : " (Registrar)";
    }
    return `${nameEn}${title}`;
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-100", text: "text-slate-400" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) {
      return { score, label: idt("ខ្សោយ (Weak)", "Weak", "弱 (Weak)"), color: "bg-rose-500", text: "text-rose-500" };
    } else if (score <= 3) {
      return { score, label: idt("មធ្យម (Medium)", "Medium", "中 (Medium)"), color: "bg-amber-500", text: "text-amber-500" };
    } else {
      return { score, label: idt("ខ្លាំង (Strong)", "Strong", "强 (Strong)"), color: "bg-emerald-500", text: "text-emerald-500" };
    }
  };

  // Initialize staff list in localStorage to survive reloads and match design exactly
  const [staffList, setStaffList] = useState<StaffAccount[]>(() => {
    const saved = localStorage.getItem("sms_staff_credentials");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(s => s.nameEn === "SORN SAVY")) {
          // Reset to clean list (only default admin)
          localStorage.removeItem("sms_staff_credentials");
        } else {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing staff credentials", e);
      }
    }
    // Only default admin account so system remains secure and clean
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
      }
    ];
  });

  // Save staff list to localStorage when updated
  useEffect(() => {
    localStorage.setItem("sms_staff_credentials", JSON.stringify(staffList));
    window.dispatchEvent(new Event("sms_staff_perms_updated"));
  }, [staffList]);

  // Permission management states
  const [selectedStaffForPermsId, setSelectedStaffForPermsId] = useState<string>(() => {
    return "SMS-STAFF-101";
  });
  const [rightTab, setRightTab] = useState<"permissions" | "map">("permissions");
  
  // Edit mode states for custom permissions
  const [isEditingPerms, setIsEditingPerms] = useState<boolean>(false);
  const [draftPermissions, setDraftPermissions] = useState<string[]>([]);

  // Automatically reset/exit edit mode when staff member selection changes
  useEffect(() => {
    setIsEditingPerms(false);
    setDraftPermissions([]);
  }, [selectedStaffForPermsId]);

  const getStaffPermissions = (staff: StaffAccount): string[] => {
    return staff.permissions || roleDefaults[staff.role] || [];
  };

  // Handler to toggle an individual permission
  const handleTogglePermission = (staffId: string, permKey: string) => {
    if (!isEditingPerms) {
      showToast(idt("សូមចុចប៊ូតុង 'កែប្រែ' ជាមុនសិន ដើម្បីផ្លាស់ប្តូរសិទ្ធិ!", "Please click the 'Edit' button first to modify permissions!", "请先点击 “编辑” 按钮以进行修改！"), "info");
      return;
    }
    setDraftPermissions(prev => {
      if (prev.includes(permKey)) {
        return prev.filter(k => k !== permKey);
      } else {
        return [...prev, permKey];
      }
    });
  };

  // Handler to save the draft permissions to master staffList
  const handleSavePermissions = (staffId: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          permissions: draftPermissions
        };
      }
      return s;
    }));
    setIsEditingPerms(false);
    showToast(idt("បានរក្សាទុកសិទ្ធិប្រព័ន្ធថ្មីដោយជោគជ័យ!", "System permissions updated and saved successfully!", "系统权限已成功保存更新！"), "success");
  };

  // Handler to cancel editing and discard draft changes
  const handleCancelPermissions = () => {
    setIsEditingPerms(false);
    setDraftPermissions([]);
    showToast(idt("បានបោះបង់ការកែប្រែសិទ្ធិ!", "Cancelled permissions changes!", "已取消编辑权限！"), "info");
  };

  // Helper to restore defaults
  const handleRestoreDefaults = (staff: StaffAccount) => {
    const defaults = roleDefaults[staff.role];
    if (isEditingPerms) {
      setDraftPermissions(defaults);
      showToast(idt("បានបញ្ចូលសិទ្ធិលំនាំដើមរបស់តួនាទី! សូមចុច 'រក្សាទុក' ដើម្បីអនុវត្ត។", "Loaded default role permissions! Click 'Save' to apply.", "已载入角色默认预设，请点击 “保存” 以应用！"), "info");
    } else {
      setStaffList(prev => prev.map(s => {
        if (s.id === staff.id) {
          return {
            ...s,
            permissions: defaults
          };
        }
        return s;
      }));
      showToast(idt(`បានកំណត់សិទ្ធិរបស់ ${staff.nameEn} ទៅកាន់លំនាំដើមវិញរួចរាល់!`, `Successfully restored default permissions for ${staff.nameEn}!`, `已成功恢复 ${staff.nameEn} 的系统默认权限！`), "info");
    }
  };

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Active selected staff account for modals
  const [selectedStaff, setSelectedStaff] = useState<StaffAccount | null>(null);

  // Form states
  const [formNameKh, setFormNameKh] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPass, setFormPass] = useState("");
  const [formRole, setFormRole] = useState<"ADMIN" | "ACCOUNTANT" | "TEACHER" | "STUDENT">("ACCOUNTANT");
  
  const [newPassword, setNewPassword] = useState("");

  // Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Search filter
  const filteredStaff = staffList.filter(staff => {
    const searchLower = (searchTerm || '').toLowerCase();
    return (
      (staff.nameKh || '').toLowerCase().includes(searchLower) ||
      (staff.nameEn || '').toLowerCase().includes(searchLower) ||
      (staff.username || '').toLowerCase().includes(searchLower) ||
      staff.phone.includes(searchLower) ||
      (staff.id || '').toLowerCase().includes(searchLower)
    );
  });

  // Handle staff creation
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameKh || !formNameKh.trim() || !formNameEn || !formNameEn.trim() || !formUsername || !formPhone || !formPass) {
      showToast(idt("សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់!", "Please fill in all required fields!", "请填写所有必填字段！"), "error");
      return;
    }

    // 1. Validate English Name format
    const cleanFormNameEn = formNameEn.trim();
    const nameEnRegex = /^[A-Za-z\s.\-]+$/;
    if (!nameEnRegex.test(cleanFormNameEn)) {
      showToast(idt("ឈ្មោះជាភាសាអង់គ្លេសអាចមានតែអក្សរ ឃ្លា និងសញ្ញា (-) (.) ប៉ុណ្ណោះ!", "English name can only contain letters, spaces, hyphens, and dots!", "英文姓名只能包含字母、空格、连字符和点！"), "error");
      return;
    }

    // 2. Validate Username format (3-30 chars, alphanumeric/dots/underscores/hyphens)
    const cleanUsername = (formUsername || '').toLowerCase().trim();
    const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
    if (!usernameRegex.test(cleanUsername)) {
      showToast(idt("ឈ្មោះគណនីមិនត្រឹមត្រូវ! (៣ ដល់ ៣០ ខ្ទង់ អាចមានតែអក្សរ លេខ និងសញ្ញា . _ -)", "Invalid username format! (3 to 30 characters, letters, numbers, and . _ - only)", "用户名格式不正确！（3到30位，只能包含字母、数字和. _ -）"), "error");
      return;
    }

    // 3. Check if username is taken
    const isUsernameTaken = staffList.some(
      s => (s.username || '').toLowerCase() === cleanUsername
    );
    if (isUsernameTaken) {
      showToast(idt("ឈ្មោះគណនី (Username) នេះមានរួចហើយ!", "This username is already taken!", "此用户名已被注册使用！"), "error");
      return;
    }

    // 4. Validate Phone number
    const cleanPhone = formPhone.trim();
    const phoneRegex = /^[+0-9\s\-()]{8,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      showToast(idt("លេខទូរស័ព្ទមិនត្រឹមត្រូវ! (៨ ដល់ ១៥ ខ្ទង់)", "Invalid phone number format! (8 to 15 digits)", "电话号码格式不正确！（8到15位）"), "error");
      return;
    }

    // 5. Validate Password strength (min 6 characters)
    if (formPass.length < 6) {
      showToast(idt("លេខសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ ខ្ទង់!", "Password must be at least 6 characters long!", "密码长度必须至少为6位！"), "error");
      return;
    }

    // Strip HTML to prevent XSS
    const stripHtml = (str: string) => {
      if (!str) return "";
      return str.replace(/<[^>]*>?/gm, '').trim();
    };

    // Generate custom staff ID matching pattern
    const nextNum = staffList.reduce((max, s) => {
      const parts = s.id.split("-");
      const num = parseInt(parts[parts.length - 1], 10);
      return !isNaN(num) && num > max ? num : max;
    }, 100) + 1;
    const newId = `SMS-STAFF-${nextNum}`;

    const newStaff: StaffAccount = {
      id: newId,
      nameKh: stripHtml(formNameKh),
      nameEn: cleanFormNameEn.toUpperCase(),
      username: cleanUsername,
      role: formRole,
      phone: stripHtml(cleanPhone),
      pass: formPass,
      createdAt: new Date().toISOString().split("T")[0],
      permissions: roleDefaults[formRole]
    };

    setStaffList(prev => [...prev, newStaff]);
    showToast(idt(`បានបង្កើតគណនីបុគ្គលិកថ្មី ${cleanFormNameEn} រួចរាល់!`, `Successfully created new staff account ${cleanFormNameEn}!`, `成功创建新员工账户 ${cleanFormNameEn}！`), "success");
    
    // Reset Form
    setFormNameKh("");
    setFormNameEn("");
    setFormUsername("");
    setFormPhone("");
    setFormPass("");
    setFormRole("ACCOUNTANT");
    setIsCreateModalOpen(false);
  };

  // Handle password reset
  const handleResetPassword = () => {
    if (!selectedStaff || !newPassword) {
      showToast(idt("សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី!", "Please enter a new password!", "请输入新登录密码！"), "error");
      return;
    }

    setStaffList(prev => 
      prev.map(s => s.id === selectedStaff.id ? { ...s, pass: newPassword } : s)
    );
    
    showToast(idt(`បានប្តូរពាក្យសម្ងាត់សម្រាប់ ${selectedStaff.nameEn} រួចរាល់!`, `Successfully reset password for ${selectedStaff.nameEn}!`, `成功重置 ${selectedStaff.nameEn} 的登录密码！`), "success");
    setNewPassword("");
    setIsResetModalOpen(false);
    setSelectedStaff(null);
  };

  // Handle staff deletion
  const handleDeleteStaff = () => {
    if (!selectedStaff) return;

    // Prevent deleting the last Admin as a safety rule
    const adminCount = staffList.filter(s => s.role === "ADMIN").length;
    if (selectedStaff.role === "ADMIN" && adminCount <= 1) {
      showToast(idt("មិនអាចលុបគណនី Administrator ចុងក្រោយគេបានទេ!", "Cannot delete the last remaining Administrator account!", "无法删除系统中最后一名系统管理员！"), "error");
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);
      return;
    }

    setStaffList(prev => prev.filter(s => s.id !== selectedStaff.id));
    showToast(idt(`បានលុបគណនី ${selectedStaff.nameEn} ចេញពីប្រព័ន្ធ!`, `Successfully removed ${selectedStaff.nameEn} from the system!`, `成功从系统中移除账户 ${selectedStaff.nameEn}！`), "success");
    setIsDeleteModalOpen(false);
    setSelectedStaff(null);
  };

  // Render role badge helper
  const renderRoleBadge = (role: "ADMIN" | "ACCOUNTANT" | "TEACHER" | "STUDENT") => {
    switch (role) {
      case "ADMIN":
        return (
          <div className="flex flex-col items-start leading-none gap-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50/80 border border-blue-100 px-2.5 py-1 rounded-md uppercase tracking-wider font-sans shadow-3xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              SUPER ADMIN
            </span>
            <span className="text-[9px] text-slate-400 font-black">{idt("គ្រប់គ្រងទូទៅ", "Full Management", "全局系统管理")}</span>
          </div>
        );
      case "ACCOUNTANT":
        return (
          <div className="flex flex-col items-start leading-none gap-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50/80 border border-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider font-sans shadow-3xs">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              ACCOUNTANT
            </span>
            <span className="text-[9px] text-slate-400 font-black">{idt("ហិរញ្ញវត្ថុ", "Finance Only", "仅限财务")}</span>
          </div>
        );
      case "TEACHER":
        return (
          <div className="flex flex-col items-start leading-none gap-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50/80 border border-rose-100 px-2.5 py-1 rounded-md uppercase tracking-wider font-sans shadow-3xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              TEACHER
            </span>
            <span className="text-[9px] text-slate-400 font-black">{idt("ពិន្ទុ និងវត្តមាន", "Grading & Attendance", "学生考勤记录")}</span>
          </div>
        );
      case "STUDENT":
        return (
          <div className="flex flex-col items-start leading-none gap-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-sky-600 bg-sky-50/80 border border-sky-100 px-2.5 py-1 rounded-md uppercase tracking-wider font-sans shadow-3xs">
              <UserCheck className="w-3.5 h-3.5 text-sky-500" />
              STUDENT
            </span>
            <span className="text-[9px] text-slate-400 font-black">{idt("សិស្ស", "Student", "学生")}</span>
          </div>
        );
    }
  };

  const totalStaff = staffList.length;
  const adminCount = staffList.filter(s => s.role === "ADMIN").length;
  const teacherCount = staffList.filter(s => s.role === "TEACHER").length;
  const accountantCount = staffList.filter(s => s.role === "ACCOUNTANT").length;

  const activeUser = loggedInUser || (() => {
    const saved = localStorage.getItem("plc_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  })();

  const activeStaffMatch = activeUser ? staffList.find(s => (s.username || '').toLowerCase() === (activeUser.username || '').toLowerCase() || s.id === activeUser.id) : null;
  const activeUserPerms = activeStaffMatch 
    ? getStaffPermissions(activeStaffMatch) 
    : (activeUser ? (roleDefaults[activeUser.role as "ADMIN" | "ACCOUNTANT" | "TEACHER" | "STUDENT"] || roleDefaults["ADMIN"]) : roleDefaults["ADMIN"]);

  return (
    <div className="space-y-6">
      
      {/* 1. COMPACT CONTROLS HEADER ROW */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-1 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
            {idt("គ្រប់គ្រងគណនីបុគ្គលិក", "Staff Accounts Manager", "员工账号管理")}
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 self-stretch md:self-auto">
          {/* Removed Active User fake telemetry header */}

          <motion.button
            whileHover={{ scale: 1.02, translateY: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md border-none outline-none shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{idt("+ យូសឺរថ្មី (Create Staff)", "+ Create Staff Account", "+ 创建新账户 (Create Staff)")}</span>
          </motion.button>
        </div>
      </div>

      {/* 1.5 STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Accounts */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -4, boxShadow: "0 12px 20px -8px rgba(37, 99, 235, 0.12)" }}
          className="bg-white rounded-2xl border-t-4 border-t-blue-600 border-x border-b border-slate-200/80 p-5 shadow-3xs flex items-center gap-4 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-100/50 transition-colors">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-left leading-none">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-sans block mb-1">{idt("គណនីសរុប (Total Accounts)", "Total Accounts", "总账户数 (Total Accounts)")}</span>
            <div className="text-xl font-black text-slate-800 font-sans leading-none">{totalStaff}{idt(" គណនី", " Accounts", " 个账户")}</div>
            <span className="text-[9px] text-slate-400 font-bold mt-1.5 inline-block">{idt("សរុបក្នុងប្រព័ន្ធ", "Total in System", "系统总数")}</span>
          </div>
        </motion.div>

        {/* Global Admins */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -4, boxShadow: "0 12px 20px -8px rgba(37, 99, 235, 0.12)" }}
          className="bg-white rounded-2xl border-t-4 border-t-blue-500 border-x border-b border-slate-200/80 p-5 shadow-3xs flex items-center gap-4 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-100/50 transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-left leading-none">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider font-sans block mb-1">{idt("អ្នកគ្រប់គ្រងទូទៅ (Global Admins)", "Global Admins", "系统管理员 (Global Admins)")}</span>
            <div className="text-xl font-black text-slate-800 font-sans leading-none">{adminCount}{idt(" នាក់", " Users", " 人")}</div>
            <span className="text-[9px] text-slate-400 font-bold mt-1.5 inline-block">{idt("អ្នកគ្រប់គ្រងប្រព័ន្ធ", "System Admins", "系统管理员")}</span>
          </div>
        </motion.div>

        {/* Finance / Accounts */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -4, boxShadow: "0 12px 20px -8px rgba(16, 185, 129, 0.12)" }}
          className="bg-white rounded-2xl border-t-4 border-t-emerald-500 border-x border-b border-slate-200/80 p-5 shadow-3xs flex items-center gap-4 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-emerald-100/50 transition-colors">
            <Layers className="w-6 h-6" />
          </div>
          <div className="text-left leading-none">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider font-sans block mb-1">{idt("គណនេយ្យ (Finance)", "Finance", "财务管理员 (Finance)")}</span>
            <div className="text-xl font-black text-slate-800 font-sans leading-none">{accountantCount}{idt(" នាក់", " Users", " 人")}</div>
            <span className="text-[9px] text-slate-400 font-bold mt-1.5 inline-block">{idt("រដ្ឋបាលហិរញ្ញវត្ថុ", "Financial Admins", "财务人员")}</span>
          </div>
        </motion.div>

        {/* Teacher Faculty */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -4, boxShadow: "0 12px 20px -8px rgba(245, 158, 11, 0.12)" }}
          className="bg-white rounded-2xl border-t-4 border-t-amber-500 border-x border-b border-slate-200/80 p-5 shadow-3xs flex items-center gap-4 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-amber-100/50 transition-colors">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-left leading-none">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider font-sans block mb-1">{idt("គ្រូបង្រៀន (Teachers)", "Teachers", "教师职员 (Teachers)")}</span>
            <div className="text-xl font-black text-slate-800 font-sans leading-none">{teacherCount}{idt(" នាក់", " Users", " 人")}</div>
            <span className="text-[9px] text-slate-400 font-bold mt-1.5 inline-block">{idt("បុគ្គលិកសិក្សា", "Academic Staff", "教职员工")}</span>
          </div>
        </motion.div>
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* LEFT COLUMN: ACTIVE CREDENTIALS TABLE & SESSION DETAILS */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-slate-800 text-[13px] md:text-sm uppercase tracking-wider font-sans">
                  {idt("បញ្ជីគណនី (Accounts Database)", "Accounts Database", "账户数据库 (Accounts Database)")}
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={idt("ស្វែងរកគណនីបុគ្គលិក តាមរយៈឈ្មោះ, គណនី ឬលេខទូរស័ព្ទ...", "Search staff by name, username, or phone number...", "按姓名、登录账号或手机号码检索员工...")}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-[13px] font-bold text-slate-600 w-full md:w-[350px] lg:w-[450px] outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans placeholder:font-sans placeholder:font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Credentials list table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full min-w-[900px] text-left border-collapse text-xs md:text-[12.5px]">
                <thead>
                  <tr className="bg-slate-50/75 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                    <th className="px-5 py-3.5">{idt("បុគ្គលិក / ID", "Staff / ID", "员工成员 / ID")}</th>
                    <th className="px-5 py-3.5">{idt("គណនី (USERNAME)", "Username", "登录账号 (Username)")}</th>
                    <th className="px-5 py-3.5">{idt("តួនាទី / សិទ្ធិប្រើប្រាស់", "Role & Access", "系统角色 / 权限")}</th>
                    <th className="px-5 py-3.5">{idt("លេខទូរស័ព្ទ (PHONE)", "Phone", "手机 (Phone)")}</th>
                    <th className="px-5 py-3.5">{idt("ថ្ងៃបង្កើត (CREATED)", "Created", "创建日期 (Created)")}</th>
                    <th className="px-5 py-3.5 text-right">{idt("សកម្មភាព (ACTIONS)", "Actions", "操作 (Actions)")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs shrink-0">
                              {staff.nameEn.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-[11px] font-sans">{staff.nameKh}</div>
                              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed">
                                {staff.nameEn} <br/> <span className="opacity-70 font-mono tracking-normal">{staff.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="font-extrabold text-slate-700 text-xs font-mono">{staff.username}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-slate-400 font-extrabold">Pass:</span>
                            <div className="flex items-center bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                              <span className="text-slate-600 font-mono text-[10px] font-bold">
                                {visiblePasswords[staff.id] ? staff.pass : "••••••••"}
                              </span>
                            </div>
                            <button
                              onClick={() => togglePasswordVisibility(staff.id)}
                              className="text-slate-400 hover:text-primary-600 cursor-pointer p-0.5 transition-colors"
                            >
                              {visiblePasswords[staff.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            {staff.role === "ADMIN" && <ShieldCheck className="w-3 h-3 text-blue-600" />}
                            {staff.role === "ACCOUNTANT" && <Layers className="w-3 h-3 text-emerald-600" />}
                            {staff.role === "TEACHER" && <Users className="w-3 h-3 text-amber-600" />}
                            {staff.role === "STUDENT" && <UserCheck className="w-3 h-3 text-slate-600" />}
                            {staff.role}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[11px] font-bold text-slate-600 font-mono">
                          {staff.phone || "---"}
                        </td>
                        <td className="px-5 py-3 text-[10px] font-bold text-slate-400 font-mono">
                          {staff.createdAt}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedStaff(staff);
                                setNewPassword("");
                                setIsResetModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                              title={idt("ប្តូរពាក្យសម្ងាត់", "Reset Password", "重置密码")}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            {staff.id !== "SMS-STAFF-101" && (
                              <button
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title={idt("លុបគណនី", "Delete Account", "删除账户")}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-xs font-bold text-slate-400">
                        {idt("មិនមានទិន្នន័យគណនីទេ!", "No account data found!", "未找到账户数据！")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODALS AND OVERLAYS */}

      {/* A. CREATE STAFF CREDENTIAL MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md md:max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4.5 bg-primary-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-white" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-left">
                  {idt("បង្កើតគណនីបុគ្គលិកថ្មី (Create Staff)", "Create New Staff Account", "创建新员工账户 (Create Staff)")}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white cursor-pointer font-bold border-none outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateStaff} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {idt("ឈ្មោះខ្មែរ (Name Kh)", "Khmer Name (Name Kh)", "柬文姓名 (Name Kh)")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameKh}
                    onChange={(e) => setFormNameKh(e.target.value)}
                    placeholder={idt("ឧ. សឿង ដារ៉ា", "e.g. SARA", "例: SARA")}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {idt("ឈ្មោះអង់គ្លេស (Name En)", "English Name (Name En)", "英文姓名 (Name En)")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder={idt("ឧ. SEUNG DARA", "e.g. SEUNG DARA", "例: SEUNG DARA")}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500 font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {idt("លេខទូរស័ព្ទ (Phone Number)", "Phone Number", "手机号码 (Phone Number)")}
                </label>
                <input
                  type="text"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder={idt("ឧ. 012345678", "e.g. 012345678", "例: 012345678")}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-sans">
                  {idt("USERNAME (គណនីចូលប្រព័ន្ធ)", "Username", "登录账号 (Username)")}
                </label>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder={idt("ឧ. dara", "e.g. dara", "例: dara")}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-sans">
                  {idt("PASSWORD (លេខសម្ងាត់)", "Password", "登录密码 (Password)")}
                </label>
                <input
                  type="password"
                  required
                  value={formPass}
                  onChange={(e) => setFormPass(e.target.value)}
                  placeholder={idt("លេខសម្ងាត់យ៉ាងតិច ៦ ខ្ទង់", "At least 6 characters", "请输入至少6位字符")}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500 font-mono"
                />
                {/* Password Strength Meter (Security feature #3) */}
                {formPass && (
                  <div className="space-y-1 pt-1.5">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase">
                      <span className="text-slate-400">{idt("កម្រិតសុវត្ថិភាព៖", "Strength:", "密码安全强度：")}</span>
                      <span className={getPasswordStrength(formPass).text}>{getPasswordStrength(formPass).label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getPasswordStrength(formPass).color}`}
                        style={{ width: `${Math.min(100, (getPasswordStrength(formPass).score + 1) * 20)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {idt("ជ្រើសរើសតួនាទី (System Role)", "Select System Role", "分配系统角色 (System Role)")}
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 focus:outline-none focus:border-primary-500"
                >
                  <option value="ADMIN">{idt("Admin (អ្នកគ្រប់គ្រងទូទៅ)", "Admin (Full Access)", "管理员 (全局访问)")}</option>
                  <option value="ACCOUNTANT">{idt("Accountant (បុគ្គលិកគណនេយ្យ)", "Accountant", "会计")}</option>
                  <option value="TEACHER">{idt("Teacher (គ្រូបង្រៀន)", "Teacher (Grading & Attendance)", "教师 (评分和考勤)")}</option>
                  <option value="STUDENT">{idt("Student (សិស្ស)", "Student", "学生")}</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  {idt("បោះបង់", "Cancel", "取消")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{idt("រក្សាទុក (Create)", "Save & Create", "保存并创建 (Create)")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. RESET PASSWORD MODAL */}
      {isResetModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-sm w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary-400 animate-pulse" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-left">
                  {idt("ប្តូរពាក្យសម្ងាត់ (Reset Password)", "Reset Password", "重置登录密码 (Reset Password)")}
                </h3>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white cursor-pointer font-bold border-none outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-left">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {idt("គណនីដែលត្រូវប្តូរ៖", "Target Account:", "目标账户：")}
                </p>
                <p className="text-xs font-extrabold text-slate-800">
                  {getStaffNameWithTitle(selectedStaff.nameKh, selectedStaff.nameEn)}
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  Username: <span className="text-slate-700 font-bold">{selectedStaff.username}</span>
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-sans">
                  {idt("ពាក្យសម្ងាត់ថ្មី (New Password)", "New Password", "新登录密码 (New Password)")}
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={idt("បញ្ចូលលេខសម្ងាត់ថ្មី...", "Enter new password...", "请输入新登录密码...")}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end text-[10px] font-extrabold">
                <button
                  type="button"
                  onClick={() => {
                    const randomPass = Math.random().toString(36).slice(-8);
                    setNewPassword(randomPass);
                  }}
                  className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg cursor-pointer"
                >
                  {idt("ចៃដន្យ (Generate random)", "Generate Random", "随机生成密码 (Random)")}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 text-xs font-extrabold">
                <button
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  {idt("បោះបង់", "Cancel", "取消")}
                </button>
                <button
                  onClick={handleResetPassword}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{idt("បញ្ជាក់ការប្តូរ", "Confirm Change", "确认修改密码")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. CONFIRM DELETE MODAL */}
      {isDeleteModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-sm w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-inner">
                <Trash2 className="w-6 h-6 animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {idt("តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ?", "Are you sure you want to delete this account?", "您确定要永久删除此账户吗？")}
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  {idt("អ្នកកំពុងធ្វើការលុបគណនីរបស់ ", "You are deleting the account of ", "您正在删除账户 ")}
                  <span className="text-rose-600 font-extrabold">{getStaffNameWithTitle(selectedStaff.nameKh, selectedStaff.nameEn)}</span>
                  {idt(" ចេញពីប្រព័ន្ធគ្រប់គ្រងសាលា PLC Computer។ សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ!", " from the PLC Computer management system. This action cannot be undone!", "，此操作将清除其所有访问权限且不可撤销！")}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 text-xs font-extrabold">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedStaff(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  {idt("ទេ បោះបង់ (Cancel)", "No, Cancel", "放弃 (Cancel)")}
                </button>
                <button
                  onClick={handleDeleteStaff}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/10"
                >
                  {idt("បាទ លុបគណនី (Confirm Delete)", "Yes, Delete Account", "是的，确认删除 (Delete)")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
