import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Camera, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle, Database, Cloud, UploadCloud, RefreshCw, AlertCircle, Trash, Key, FileDown, Lock } from 'lucide-react';
import { googleSignIn, initAuth, logoutGoogle } from '../../firebaseAuth';

export default function DatabaseTab(props: any) {
  const { dbActiveStep, dbTablesMetadata = {}, expandedFolders = {}, fetchFileContent, fetchWorkspaceTree, isLoadingFileContent, isLoadingWorkspace, selectedDbTable, selectedFile, setDbActiveStep, setExpandedFolders, setSelectedDbTable, setShowPrismaCode, showPrismaCode, toKhmerNumeral, workspaceError, workspaceFiles = [], uiLang } = props;
  const activeTab = "Database";

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

  const localIdt = (kh: string, en?: string) => {
    if (localLang === "en") return en || kh;
    return kh;
  };

  // Google Drive Backup States
  const [googleUser, setGoogleUser] = React.useState<any>(null);
  const [googleToken, setGoogleToken] = React.useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [isBackingUp, setIsBackingUp] = React.useState(false);
  const [isRestoring, setIsRestoring] = React.useState<string | null>(null);
  const [backupsList, setBackupsList] = React.useState<any[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = React.useState(false);
  const [backupStatusMsg, setBackupStatusMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirmRestore, setShowConfirmRestore] = React.useState<any | null>(null);

  // Initialize Auth state on mount
  React.useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        fetchBackups(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchBackups = async (tokenToUse: string | null = googleToken) => {
    const activeToken = tokenToUse || googleToken;
    if (!activeToken) return;

    setIsLoadingBackups(true);
    try {
      const appToken = localStorage.getItem("plc_auth_token");
      const res = await fetch("/api/backup/drive/list", {
        headers: {
          "Authorization": `Bearer ${appToken}`,
          "x-drive-token": activeToken
        }
      });
      const data = await res.json();
      if (data.success) {
        setBackupsList(data.backups || []);
      } else {
        console.error("Failed to fetch backups:", data.message);
      }
    } catch (error) {
      console.error("Error fetching backups:", error);
    } finally {
      setIsLoadingBackups(false);
    }
  };

  // Automated background backup if no backup created today
  React.useEffect(() => {
    const list = backupsList || [];
    if (googleToken && list.length > 0 && !isBackingUp) {
      const todayStr = new Date().toISOString().split('T')[0];
      const hasBackupToday = list.some(b => b && typeof b.createdTime === 'string' && b.createdTime.startsWith(todayStr));
      
      if (!hasBackupToday) {
        console.log("No backup found for today. Triggering auto-backup to Google Drive...");
        handleBackupNow(true);
      }
    }
  }, [googleToken, backupsList]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setBackupStatusMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        fetchBackups(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setBackupStatusMsg({ type: "error", text: "ការចូលគណនី Google បានបរាជ័យ!" });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setGoogleToken(null);
      setBackupsList([]);
      setBackupStatusMsg(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleBackupNow = async (isAuto = false) => {
    if (!googleToken) return;
    setIsBackingUp(true);
    if (!isAuto) {
      setBackupStatusMsg(null);
    }
    try {
      const appToken = localStorage.getItem("plc_auth_token");
      const res = await fetch("/api/backup/drive/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${appToken}`,
          "x-drive-token": googleToken
        }
      });
      const data = await res.json();
      if (data.success) {
        if (!isAuto) {
          setBackupStatusMsg({ type: "success", text: localIdt("ទិន្នន័យត្រូវបានរក្សាទុកទៅកាន់ Google Drive ដោយជោគជ័យ! 🎉", "Data successfully backed up to Google Drive! 🎉") });
        }
        fetchBackups(googleToken);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Backup failed:", error);
      if (!isAuto) {
        setBackupStatusMsg({ type: "error", text: error.message || localIdt("ការបម្រុងទុកទិន្នន័យបានបរាជ័យ!", "Backup failed!") });
      }
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (file: any) => {
    if (!googleToken || !file) return;
    setIsRestoring(file.id);
    setBackupStatusMsg(null);
    try {
      const appToken = localStorage.getItem("plc_auth_token");
      const res = await fetch("/api/backup/drive/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${appToken}`,
          "x-drive-token": googleToken
        },
        body: JSON.stringify({ fileId: file.id })
      });
      const data = await res.json();
      if (data.success) {
        setBackupStatusMsg({ type: "success", text: localIdt("ទិន្នន័យត្រូវបានទាញយកមកស្តារឡើងវិញដោយជោគជ័យ! ប្រព័ន្ធកំពុងដំណើរការឡើងវិញ។ 🎉", "Data successfully restored! System is reloading. 🎉") });
        setShowConfirmRestore(null);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Restore failed:", error);
      setBackupStatusMsg({ type: "error", text: error.message || localIdt("ការស្តារទិន្នន័យឡើងវិញបានបរាជ័យ!", "Data restoration failed!") });
    } finally {
      setIsRestoring(null);
    }
  };

  return (
    <>
{activeTab === "Database" && (
              <motion.div
                key="database-tab"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="flex flex-col space-y-6"
              >
                {/* 1. TOP HEADER (Blueprint Style) */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-100 shrink-0">
                      <Network className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight font-sans flex items-center gap-2">
                        <span>{localIdt("ស្វែងយល់សេចក្តីលម្អិត", "Explore Details")}</span>
                        <span className="text-slate-400 font-medium text-xs sm:text-sm">(Architect Workspace Blueprints)</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 font-bold mt-1 leading-relaxed">
                        {localIdt("ស្វែងយល់អំពីរចនាសម្ព័ន្ធទិន្នន័យប្រព័ន្ធ (Prisma Database Structure) និងរចនាសម្ព័ន្ធថតឯកសារគម្រោង (Directory Workspace Tree)", "Explore system database structure (Prisma Database Structure) and project directory structure (Directory Workspace Tree)")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Step Navigation Tabs inside Header */}
                  <div className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start xl:self-auto">
                    <button
                      onClick={() => {
                        setDbActiveStep("schema");
                        setShowPrismaCode(false);
                      }}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        dbActiveStep === "schema"
                          ? "bg-white text-primary-700 shadow-xs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      <span>Step 1: DB Schema</span>
                    </button>
                    <button
                      onClick={() => {
                        setDbActiveStep("directory");
                      }}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        dbActiveStep === "directory"
                          ? "bg-white text-primary-700 shadow-xs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Workflow className="w-4 h-4" />
                      <span>Step 2: Directory Tree</span>
                    </button>
                    <button
                      onClick={() => {
                        setDbActiveStep("backup");
                      }}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        dbActiveStep === "backup"
                          ? "bg-white text-primary-700 shadow-xs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Cloud className="w-4 h-4" />
                      <span>Step 3: Cloud Backup</span>
                    </button>
                  </div>
                </div>

                {/* 2. MAIN WORKSPACE CONTENT */}
                {dbActiveStep === "schema" ? (
                  <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs relative">
                    {/* Inner Header with actions */}
                    <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8.5 h-8.5 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                          <Server className="w-4.5 h-4.5 text-primary-400" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-wide uppercase font-sans">
                            Database Architecture (Prisma MySQL)
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                            ដំណោះស្រាយ: ប្លង់បច្ចេកទេស និងទំនាក់ទំនងរវាងតារាងទិន្នន័យ
                          </p>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowPrismaCode(!showPrismaCode);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-3xs border ${
                            showPrismaCode
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <FileCode className="w-4 h-4" />
                          <span>Prisma Schema Code</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Section based on selected view mode */}
                    {showPrismaCode ? (
                      /* Prisma schema file code view */
                      <div className="p-6 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto flex-1 min-h-0 overflow-y-auto rounded-b-3xl">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-500">
                          <span>prisma/schema.prisma</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-sans font-bold">Read-Only View</span>
                        </div>
                        <pre className="leading-relaxed">
{`generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id                  String       @id @default(uuid())
  email               String       @unique
  passwordHash        String
  fullName            String
  role                Role         @default(STAFF)
  telegramId          String?
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt
  recordedAttendances Attendance[] @relation("RecordedBy")
  teacherProfile      Teacher?
}

model Student {
  id                String        @id @default(uuid())
  studentId         String        @unique
  firstNameKh       String?
  lastNameKh        String?
  firstNameEn       String?
  lastNameEn        String?
  nameKh            String?
  nameEn            String?
  gender            String
  course            String?
  level             String?
  status            String?
  startDate         String?
  endDate           String?
  shift             String?
  fee               Float?
  paid              Float?
  due               Float?
  guardianName      String?
  guardianPhone     String?
  telegramConnected Boolean?      @default(false)
  dob               String?
  pob               String?
  fullFee           Float?
  discount          Float?
  hours             String?
  dateOfBirth       DateTime?
  photoUrl          String?
  parentTelegramId  String?
  phoneNumber       String?
  grade             String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  attendances       Attendance[]
  certificates      Certificate[]
  payments          Invoice[]
}

model Teacher {
  id             String              @id @default(uuid())
  teacherId      String              @unique
  firstNameKh    String?
  lastNameKh     String?
  firstNameEn    String?
  lastNameEn     String?
  nameKh         String?
  nameEn         String?
  gender         String
  specialty      String?
  phone          String?
  dob            String?
  pob            String?
  joinDate       String?
  leaveDate      String?
  experienceDays String?
  salary         Float?
  paymentStatus  String?
  status         String?
  notes          String?
  email          String?             @unique
  phoneNumber    String?
  photoUrl       String?
  telegramId     String?
  userId         String?             @unique
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
  salaries       SalaryPayment[]
  user           User?               @relation(fields: [userId], references: [id])
  attendances    TeacherAttendance[]
}

model Attendance {
  id                       String           @id @default(uuid())
  studentId                String
  status                   AttendanceStatus @default(PRESENT)
  date                     DateTime
  reason                   String?
  recordedById             String
  telegramNotificationSent Boolean          @default(false)
  createdAt                DateTime         @default(now())
  recordedBy               User             @relation("RecordedBy", fields: [recordedById], references: [id])
  student                  Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([studentId, date])
}

model TeacherAttendance {
  id                       String           @id @default(uuid())
  teacherId                String
  status                   AttendanceStatus @default(PRESENT)
  date                     DateTime
  reason                   String?
  telegramNotificationSent Boolean          @default(false)
  createdAt                DateTime         @default(now())
  teacher                  Teacher          @relation(fields: [teacherId], references: [id], onDelete: Cascade)

  @@unique([teacherId, date])
}

model Invoice {
  id            String        @id @default(uuid())
  invoiceNumber String        @unique
  studentId     String
  term          String
  amountDue     Decimal
  amountPaid    Decimal       @default(0.00)
  status        PaymentStatus @default(PENDING)
  paymentDate   DateTime?
  paymentMethod String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  student       Student       @relation(fields: [studentId], references: [id])
}

model SalaryPayment {
  id            String        @id @default(uuid())
  teacherId     String
  payPeriod     String
  baseSalary    Decimal
  bonus         Decimal       @default(0.00)
  deduction     Decimal       @default(0.00)
  totalPaid     Decimal
  status        PaymentStatus @default(PENDING)
  paymentDate   DateTime?
  invoiceNumber String        @unique
  createdAt     DateTime      @default(now())
  teacher       Teacher       @relation(fields: [teacherId], references: [id])
}

model CertificateTemplate {
  id           String        @id @default(uuid())
  title        String
  bgImageUrl   String
  contentXml   String?
  createdAt    DateTime      @default(now())
  certificates Certificate[]
}

model Certificate {
  id                String              @id @default(uuid())
  certificateNumber String              @unique
  studentId         String
  templateId        String
  issueDate         DateTime            @default(now())
  gradeTitle        String
  qrCodeUrl         String?
  template          CertificateTemplate @relation(fields: [templateId], references: [id])
  student           Student             @relation(fields: [studentId], references: [id], onDelete: Cascade)
}

enum Role {
  ADMIN
  TEACHER
  STAFF
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  PERMISSION
}

enum PaymentStatus {
  PENDING
  PAID
  OVERDUE
}`}
                        </pre>
                      </div>
                    ) : (
                      /* Main DB Interactive Schema Table Layout (High fidelity to screenshot!) */
                      <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* LEFT COLUMN: Sidebar with tables list */}
                        <div className="lg:col-span-3 border-r border-slate-200/60 p-5 space-y-4 bg-slate-50/20">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="font-extrabold text-slate-400 text-[10px] tracking-wider uppercase font-sans">
                              MySQL TABLES (9)
                            </span>
                          </div>
                          
                          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                            {Object.entries(dbTablesMetadata).map(([key, tbl]) => {
                              const isActive = selectedDbTable === key;
                              return (
                                <button
                                  key={key}
                                  onClick={() => setSelectedDbTable(key)}
                                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                                    isActive
                                      ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                                      : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Database className={`w-4 h-4 ${isActive ? "text-primary-400" : "text-slate-400"}`} />
                                    <span className="text-xs font-extrabold tracking-tight font-sans">{(tbl as any).name}</span>
                                  </div>
                                  <span className={`text-[9px] font-black tracking-wide px-2 py-0.5 rounded-md ${
                                    isActive 
                                      ? "bg-slate-800 text-slate-300" 
                                      : "bg-slate-100 text-slate-500"
                                  }`}>
                                    {(tbl as any).cols} cols
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Table detailed schema view */}
                        <div className="lg:col-span-9 p-6 space-y-6">
                          {/* Table detail header */}
                          {(() => {
                            const activeTbl = (dbTablesMetadata && dbTablesMetadata[selectedDbTable as keyof typeof dbTablesMetadata]) || (dbTablesMetadata && dbTablesMetadata.User) || { name: "User", khText: "", fields: [] };
                            const activeFields = activeTbl.fields || [];
                            return (
                              <div className="space-y-5 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs bg-primary-50 text-primary-700 font-black px-2.5 py-0.5 rounded border border-primary-200/60 uppercase font-sans">MODEL</span>
                                    <h4 className="font-black text-slate-900 text-lg sm:text-xl font-sans tracking-tight">
                                      {activeTbl.name}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>
                                    <span>{toKhmerNumeral(activeFields.length)} variables</span>
                                  </span>
                                </div>

                                {/* Table Cambodia Explain box */}
                                <div className="bg-amber-50/40 border border-amber-200/70 p-4.5 rounded-2xl flex items-start gap-3">
                                  <span className="text-lg shrink-0 mt-0.5">💡</span>
                                  <div className="text-xs leading-relaxed text-amber-900/95">
                                    <span className="font-black font-sans uppercase tracking-wider text-[10px] text-amber-700 block mb-0.5">ពន្យល់តារាង</span>
                                    <p className="font-bold">{activeTbl.khText}</p>
                                  </div>
                                </div>

                                {/* Detailed Fields table */}
                                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-3xs">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 font-sans">
                                          <th className="px-5 py-3.5">FIELD NAME</th>
                                          <th className="px-5 py-3.5">TYPE</th>
                                          <th className="px-5 py-3.5">CONSTRAINT</th>
                                          <th className="px-5 py-3.5">DESCRIPTION (ការពណ៌នាលម្អិត)</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-200 text-xs font-semibold text-slate-700">
                                        {activeFields.map((f, index) => (
                                          <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-5 py-3.5 font-bold font-sans text-slate-900 flex items-center gap-1.5">
                                              <span>{f.name}</span>
                                              {f.constraint === "PRIMARY KEY" && (
                                                <span className="text-[10px] text-amber-500" title="Primary Key">🔑</span>
                                              )}
                                              {f.constraint === "FOREIGN KEY" && (
                                                <span className="text-[10px] text-primary-500" title="Foreign Key">🔗</span>
                                              )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                              <span className="font-mono text-[11px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                                {f.type}
                                              </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                              {f.constraint !== "-" ? (
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                                                  f.constraint === "PRIMARY KEY"
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : f.constraint === "UNIQUE"
                                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                      : "bg-primary-50 text-primary-700 border-primary-200"
                                                }`}>
                                                  {f.constraint}
                                                </span>
                                              ) : (
                                                <span className="text-slate-300">-</span>
                                              )}
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-slate-600 leading-normal font-sans">
                                              {f.desc}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                ) : dbActiveStep === "directory" ? (
                  /* STEP 2: DIRECTORY WORKSPACE TREE */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Expandable Tree View */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs min-h-[500px] flex flex-col">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                        <span className="font-extrabold text-slate-800 text-xs tracking-wider uppercase font-sans">
                          PROJECT FOLDERS & FILES
                        </span>
                        <button
                          onClick={fetchWorkspaceTree}
                          className="text-[10px] text-primary-600 hover:text-primary-800 font-bold font-sans cursor-pointer flex items-center gap-1 bg-transparent border-none"
                        >
                          🔄 REFRESH
                        </button>
                      </div>

                      {/* Tree Render Structure */}
                      <div className="space-y-1 flex-1 overflow-y-auto max-h-[600px] pr-1">
                        {isLoadingWorkspace ? (
                          <div className="space-y-3 py-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="flex items-center gap-2 animate-pulse">
                                <div className="w-4 h-4 bg-slate-200 rounded" />
                                <div className="h-3 bg-slate-200 rounded w-24" />
                              </div>
                            ))}
                          </div>
                        ) : workspaceError ? (
                          <div className="text-center py-8 text-xs text-rose-500 font-bold font-sans">
                            {workspaceError}
                          </div>
                        ) : (workspaceFiles || []).length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-400 font-bold font-sans">
                            No files found in workspace root
                          </div>
                        ) : (
                          (() => {
                            const toggleLocalFolder = (folderPath: string) => {
                              setExpandedFolders((prev: any) => ({ ...prev, [folderPath]: !prev[folderPath] }));
                            };

                            const renderNode = (node: any, depth = 0) => {
                              const isFolder = node.type === "folder";
                              const isOpen = expandedFolders[node.path];
                              const isSelected = selectedFile?.path === node.path;

                              return (
                                <div key={node.path} className="select-none">
                                  <div
                                    onClick={() => {
                                      if (isFolder) {
                                        toggleLocalFolder(node.path);
                                      } else {
                                        fetchFileContent(node.path);
                                      }
                                    }}
                                    style={{ paddingLeft: `${depth * 14 + 8}px` }}
                                    className={`flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer text-xs font-bold transition-all ${
                                      isSelected 
                                        ? "bg-primary-600 text-white shadow-3xs" 
                                        : isFolder 
                                          ? "text-slate-700 hover:bg-slate-50" 
                                          : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    {isFolder ? (
                                      <>
                                        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                                        <Folder className={`w-4 h-4 shrink-0 ${isOpen ? "text-primary-500 fill-primary-100" : "text-slate-400 fill-slate-50"}`} />
                                        <span className="font-sans text-slate-800">{node.name}</span>
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-3.5 h-3.5 shrink-0" />
                                        <File className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                                        <span className={isSelected ? "text-white font-sans" : "text-slate-600 font-sans"}>{node.name}</span>
                                      </>
                                    )}
                                  </div>

                                  {isFolder && isOpen && node.children && (
                                    <div className="space-y-0.5 mt-0.5">
                                      {node.children.map((child: any) => renderNode(child, depth + 1))}
                                    </div>
                                  )}
                                </div>
                              );
                            };

                            return (workspaceFiles || []).map((f: any) => renderNode(f));
                          })()
                        )}
                      </div>
                    </div>

                    {/* Right Code Display Pane */}
                    <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden shadow-md flex flex-col min-h-[500px] max-h-[650px] relative">
                      <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-950 flex items-center justify-between text-xs text-slate-400 font-bold font-sans">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <span>{selectedFile ? selectedFile.path : "No file selected"}</span>
                        </div>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase">
                          {selectedFile ? selectedFile.lang : "-"}
                        </span>
                      </div>
                      
                      <div className="p-5 flex-1 overflow-auto font-mono text-xs text-slate-300 leading-relaxed">
                        {isLoadingFileContent ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                            <span>Loading file content from system...</span>
                          </div>
                        ) : selectedFile ? (
                          <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                            <FileCode className="w-8 h-8 opacity-40 animate-pulse" />
                            <span>Click any file on the left to inspect codebase</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STEP 3: CLOUD BACKUP (GOOGLE DRIVE) */
                  <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs space-y-6 animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                          <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase font-sans">
                            ប្រព័ន្ធបម្រុងទុកទិន្នន័យលើ Cloud (Google Drive Backup)
                          </h4>
                          <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                            ធានាសុវត្ថិភាពទិន្នន័យសាលារបស់លោកអ្នកដោយការរក្សាទុកដោយស្វ័យប្រវត្តិទៅកាន់ Google Drive ផ្ទាល់ខ្លួន
                          </p>
                        </div>
                      </div>
                      
                      {googleUser && (
                        <button
                          onClick={handleLogout}
                          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>ចាកចេញពីគណនី Google</span>
                        </button>
                      )}
                    </div>

                    {/* Status / Success Messages */}
                    {backupStatusMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border text-xs font-bold flex items-start gap-2.5 ${
                          backupStatusMsg.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-rose-50 border-rose-200 text-rose-800"
                        }`}
                      >
                        {backupStatusMsg.type === "success" ? (
                          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                        )}
                        <span>{backupStatusMsg.text}</span>
                      </motion.div>
                    )}

                    {!googleUser ? (
                      /* NOT CONNECTED STATE */
                      <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-3xs relative">
                          <Cloud className="w-8 h-8 text-primary-400" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
                            <Lock className="w-3 h-3 text-rose-500" />
                          </div>
                        </div>
                        <div>
                          <h5 className="text-slate-800 font-extrabold text-sm sm:text-base font-sans">
                            មិនទាន់បានតភ្ជាប់ Google Drive ឡើយ
                          </h5>
                          <p className="text-slate-500 text-xs font-bold mt-1.5 leading-relaxed">
                            សូមតភ្ជាប់គណនី Google របស់លោកអ្នក ដើម្បីបើកដំណើរការមុខងាររក្សាទុកទិន្នន័យស្វ័យប្រវត្តិ និងទាញយកទិន្នន័យឡើងវិញនៅពេលមានបញ្ហា។
                          </p>
                        </div>
                        
                        <button
                          onClick={handleLogin}
                          disabled={isLoggingIn}
                          className="gsi-material-button w-full sm:w-auto flex items-center justify-center"
                          style={{ margin: '12px auto 0 auto' }}
                        >
                          <div className="gsi-material-button-state"></div>
                          <div className="gsi-material-button-content-wrapper">
                            <div className="gsi-material-button-icon">
                              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                              </svg>
                            </div>
                            <span className="gsi-material-button-contents font-bold text-xs">Sign in with Google</span>
                          </div>
                        </button>
                      </div>
                    ) : (
                      /* CONNECTED STATE */
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Card: Backup Actions */}
                        <div className="lg:col-span-5 space-y-6">
                          {/* Account Connected Panel */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-3.5">
                            {googleUser.photoURL ? (
                              <img
                                src={googleUser.photoURL}
                                alt={googleUser.displayName || 'Google Account'}
                                className="w-11 h-11 rounded-full border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-primary-600 text-white font-black text-sm flex items-center justify-center border border-primary-700">
                                {googleUser.displayName ? googleUser.displayName.charAt(0).toUpperCase() : 'G'}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h5 className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight truncate">
                                {googleUser.displayName || 'Google Cloud Account'}
                              </h5>
                              <p className="text-[10px] text-slate-400 font-bold truncate mt-0.5">
                                {googleUser.email}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                                <span className="text-[9px] font-black text-emerald-600 tracking-wide uppercase">Connected</span>
                              </div>
                            </div>
                          </div>

                          {/* Auto-Backup Status explanation */}
                          <div className="bg-primary-50/40 border border-primary-100 p-5 rounded-2xl space-y-3.5">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary-500" />
                              <span className="text-xs font-extrabold text-primary-800 uppercase tracking-wide">
                                មុខងារ Auto-Backup ដំណើរការជោគជ័យ
                              </span>
                            </div>
                            <p className="text-[11px] text-primary-700 font-bold leading-relaxed">
                              ប្រព័ន្ធនឹងពិនិត្យ និងរក្សាទុកទិន្នន័យ (Prisma SQLite Database) របស់លោកអ្នកទៅកាន់ Cloud Drive ដោយស្វ័យប្រវត្តិជារៀងរាល់ថ្ងៃនៅពេលលោកអ្នកបើកដំណើរការផ្ទាំងគ្រប់គ្រងនេះ។
                            </p>
                          </div>

                          {/* Manual Backup Trigger Card */}
                          <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                            <div>
                              <h5 className="text-slate-800 font-black text-xs sm:text-sm tracking-tight font-sans">
                                រក្សាទុកទិន្នន័យដោយដៃ (Manual Cloud Backup)
                              </h5>
                              <p className="text-[10px] text-slate-400 font-bold mt-1 leading-normal">
                                លោកអ្នកអាចធ្វើការលោតទិន្នន័យបច្ចុប្បន្នភ្លាមៗទៅកាន់ Google Drive ដោយគ្រាន់តែចុចប៊ូតុងខាងក្រោម។
                              </p>
                            </div>

                            <button
                              onClick={() => handleBackupNow(false)}
                              disabled={isBackingUp}
                              className={`w-full py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-2 border text-white ${
                                isBackingUp
                                  ? "bg-slate-300 border-slate-300"
                                  : "bg-primary-600 hover:bg-primary-700 border-primary-700"
                              }`}
                            >
                              {isBackingUp ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>កំពុងរក្សាទុកទិន្នន័យទៅកាន់ Cloud...</span>
                                </>
                              ) : (
                                <>
                                  <UploadCloud className="w-4.5 h-4.5" />
                                  <span>បម្រុងទុកទិន្នន័យឥឡូវនេះ (Backup Now)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Right Card: Backup Archives List */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="font-extrabold text-slate-800 text-xs tracking-wider uppercase font-sans">
                              បញ្ជីឯកសារបម្រុងទុកនៅលើ Cloud ({(backupsList || []).length})
                            </span>
                            <button
                              onClick={() => fetchBackups(googleToken)}
                              disabled={isLoadingBackups}
                              className="text-[10px] text-primary-600 hover:text-primary-800 font-bold font-sans cursor-pointer flex items-center gap-1"
                            >
                              <RefreshCw className={`w-3 h-3 ${isLoadingBackups ? "animate-spin" : ""}`} />
                              <span>ទាញយកបញ្ជីសារជាថ្មី</span>
                            </button>
                          </div>

                          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                            {isLoadingBackups ? (
                              <div className="space-y-2.5 py-8">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
                                ))}
                              </div>
                            ) : (backupsList || []).length === 0 ? (
                              <div className="py-12 text-center text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-2xl space-y-2">
                                <Cloud className="w-8 h-8 mx-auto opacity-30 animate-pulse" />
                                <p>មិនមានឯកសារបម្រុងទុកនៅលើ Cloud ឡើយ។</p>
                              </div>
                            ) : (
                              (backupsList || []).map((file) => {
                                const createdDate = new Date(file.createdTime);
                                const dateFormatted = createdDate.toLocaleDateString('km-KH', {
                                  year: 'numeric', month: 'long', day: 'numeric',
                                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                                });
                                const sizeInMb = file.size ? (parseInt(file.size) / (1024 * 1024)).toFixed(2) : '0.00';

                                return (
                                  <div
                                    key={file.id}
                                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-3xs transition-all flex items-center justify-between bg-white gap-3 group"
                                  >
                                    <div className="min-w-0">
                                      <h6 className="font-bold text-slate-800 text-xs truncate font-mono">
                                        {file.name}
                                      </h6>
                                      <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-2">
                                        <span>📅 {dateFormatted}</span>
                                        <span>•</span>
                                        <span>📦 {toKhmerNumeral(sizeInMb)} MB</span>
                                      </p>
                                    </div>

                                    <button
                                      onClick={() => setShowConfirmRestore(file)}
                                      disabled={isRestoring !== null}
                                      className="px-3 py-1.5 border border-primary-200 hover:border-primary-300 text-primary-700 hover:bg-primary-50 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap opacity-90 group-hover:opacity-100 shrink-0"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                      <span>ស្តារឡើងវិញ (Restore)</span>
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Restore Confirmation Dialog Box Overlay */}
            <AnimatePresence>
              {showConfirmRestore && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl border border-slate-200 max-w-md w-full shadow-2xl p-6 overflow-hidden space-y-5"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm tracking-tight font-sans">
                          ការបញ្ជាក់៖ ស្តារទិន្នន័យឡើងវិញ (Restore Database Confirmation)
                        </h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          សកម្មភាពដែលមានហានិភ័យខ្ពស់ (Destructive Action)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-slate-600 font-bold leading-relaxed">
                        តើលោកអ្នកពិតជាចង់ស្តារទិន្នន័យពីថ្ងៃបម្រុងទុកនេះឡើងវិញមែនទេ?
                      </p>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-500">
                        <div className="truncate font-black text-slate-700 mb-1">📄 {showConfirmRestore.name}</div>
                        <div>📅 {new Date(showConfirmRestore.createdTime).toLocaleString('km-KH')}</div>
                      </div>
                      <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-900 text-[11px] font-bold leading-normal">
                        ⚠️ <strong>ការព្រមាន៖</strong> ការស្តារឡើងវិញនេះ នឹងលុប និងជំនួសទិន្នន័យបច្ចុប្បន្នទាំងអស់នៅលើកុំព្យូទ័រនេះភ្លាមៗ! សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានឡើយ។
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setShowConfirmRestore(null)}
                        disabled={isRestoring !== null}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        បោះបង់ (Cancel)
                      </button>
                      <button
                        onClick={() => handleRestore(showConfirmRestore)}
                        disabled={isRestoring !== null}
                        className="px-4.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border border-rose-700"
                      >
                        {isRestoring ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>កំពុងស្តារទិន្នន័យ...</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>យល់ព្រមស្តារឡើងវិញ (Confirm Restore)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>
  );
}
