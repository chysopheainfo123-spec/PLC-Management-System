import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Loader2,
  RefreshCw,
  Cpu,
  Info,
  Save,
  Download,
  Eye,
  Check,
  Terminal,
  FileCode,
  ChevronDown,
  User,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  CreditCard,
  Coins,
  LayoutGrid,
  Award,
  Layers,
  CheckCircle,
  Sparkles,
  Server,
  ShieldCheck,
  HardDrive,
  Copy,
  Zap,
  Lock,
  ExternalLink,
  Code2
} from 'lucide-react';

export default function MySQLDBTab(props: any) {
  const {
    activeTab,
    dbCounts,
    generatedSql,
    generatingSql,
    handleGenerateAndDownloadSql,
    handleGenerateSql,
    handleLiveMigrate,
    handleTestMysqlConnection,
    migrating,
    migrationLogs,
    mysqlDbName,
    mysqlHost,
    mysqlPassword,
    mysqlPort,
    mysqlUser,
    setMysqlDbName,
    setMysqlHost,
    setMysqlPassword,
    setMysqlPort,
    setMysqlUser,
    setShowPrismaInMysql,
    showPrismaInMysql,
    showToast,
    students,
    teachers,
    testingConnection,
    toKhmerNumeral,
    token,
    uiLang
  } = props;

  const [localLang, setLocalLang] = React.useState(uiLang || localStorage.getItem("plc_lang") || "kh");
  const [copiedCode, setCopiedCode] = React.useState(false);

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

  const idt = (kh: string, en?: string, zh?: string) => {
    if (localLang === "en") return en || kh;
    if (localLang === "zh") return zh || en || kh;
    return kh;
  };

  return (
    <>
      {activeTab === "MySQL DB" && (
        <motion.div
          key="mysql-db-tab"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full space-y-6"
        >
          {/* MAIN CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            
            {/* HERO HEADER */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-6 md:p-7 text-white relative overflow-hidden">
              {/* Background Glow Accents */}
              <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute left-1/3 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-extrabold">
                    <Database className="w-3.5 h-3.5 text-indigo-300" />
                    <span>{idt("ប្រព័ន្ធសមកាលកម្មទិន្នន័យ", "Database Sync Engine", "数据库同步引擎")}</span>
                  </div>
                  <h3 className="font-black text-xl md:text-2xl text-white tracking-tight font-serif flex items-center gap-2.5">
                    <span>{idt("ការតភ្ជាប់ទិន្នន័យ MySQL", "MySQL Database Synchronization Hub", "MySQL 数据库同步中心")}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                    {idt(
                      "ធ្វើសមកាលកម្មទិន្នន័យរវាងប្រព័ន្ធគ្រប់គ្រងសាលានេះ (SQLite) ទៅកាន់មូលដ្ឋានទិន្នន័យ MySQL ខាងក្រៅ ឬទាញយកឯកសារ SQL Dump សម្រាប់ Import ដោយផ្ទាល់។",
                      "Synchronize data between this school management system and external MySQL databases or export structured SQL dumps.",
                      "在此学校管理系统与外部 MySQL 数据库之间同步数据或导出结构化 SQL 转储。"
                    )}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleTestMysqlConnection}
                    disabled={testingConnection}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md active:scale-95 disabled:opacity-50"
                  >
                    {testingConnection ? <Loader2 className="w-4 h-4 animate-spin text-indigo-200" /> : <RefreshCw className="w-4 h-4 text-indigo-200" />}
                    <span>{idt("តេស្តការតភ្ជាប់", "Test Connection", "测试连接")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLiveMigrate}
                    disabled={migrating}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-950/30 active:scale-95 disabled:opacity-50"
                  >
                    {migrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>{idt("ធ្វើសមកាលកម្មផ្ទាល់", "Live Sync", "实时同步")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* BODY SECTION */}
            <div className="p-5 md:p-7 space-y-6 bg-slate-50/60">

              {/* CLOUD CONTAINER NOTICE BANNER */}
              <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 md:p-5 flex items-start gap-3.5 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                  <Info className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-amber-950 text-sm flex items-center gap-2">
                    <span>{idt("💡 ព័ត៌មានណែនាំអំពីការតភ្ជាប់ MySQL លើ Cloud Container", "💡 Important Notice on MySQL Connection in Cloud Environment", "💡 关于云环境中 MySQL 连接的重要提示")}</span>
                  </div>
                  <p className="text-amber-900 leading-relaxed font-medium">
                    {idt(
                      "ដោយសារកម្មវិធីនេះកំពុងដំណើរការលើ Cloud Container ប្រសិនបើអ្នកប្រើ Host `localhost` ឬ `127.0.0.1` ការតេស្ត ឬ Sync នឹងបង្ហាញកំហុស `ECONNREFUSED 127.0.0.1:3306` ព្រោះគ្មាន MySQL Server ក្នុង Container ឡើយ។ ប្រសិនបើអ្នកចង់ផ្ទេរទិន្នន័យទៅ MySQL របស់អ្នក សូមប្រើប៊ូតុង 📥 'ទាញយកឯកសារ SQL' ខាងស្តាំ ដើម្បីទាញយកឯកសារ SQL ទៅ Import ចូល phpMyAdmin/MySQL Client ដោយផ្ទាល់។",
                      "Since this app runs in a Cloud Container, testing or syncing to `localhost` or `127.0.0.1` will result in `ECONNREFUSED 127.0.0.1:3306`. If you wish to migrate your data to your MySQL database, please click 📥 'Download SQL File' on the right to import into phpMyAdmin/MySQL Client directly.",
                      "由于此应用运行在云容器中，测试或同步到 `localhost` 或 `127.0.0.1` 会导致 `ECONNREFUSED`。如果您要迁移数据，请点击右侧的 📥 '下载 SQL 文件' 以直接导入 phpMyAdmin/MySQL。"
                    )}
                  </p>
                </div>
              </div>

              {/* TWO COLUMN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* LEFT COLUMN: CREDENTIALS FORM */}
                <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 md:p-7 space-y-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500"></div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-2xs">
                          <Lock className="w-5 h-5 text-indigo-600 stroke-[2.2]" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs md:text-sm">
                            {idt("ព័ត៌មានតភ្ជាប់ MySQL Credentials", "MySQL Connection Credentials", "MySQL 连接凭据")}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {idt("កំណត់ព័ត៌មាន Host, Port និង Database ខាងក្រៅ", "Configure external Host, Port & Database", "配置外部主机、端口和数据库")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                        <div className="sm:col-span-8 space-y-1.5">
                          <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5 text-indigo-500" />
                            <span>MySQL Host</span>
                          </label>
                          <input
                            type="text"
                            value={mysqlHost}
                            onChange={(e) => setMysqlHost(e.target.value)}
                            placeholder="localhost"
                            className="w-full px-3.5 py-2.5 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 font-mono bg-slate-50/80 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-2xs"
                          />
                        </div>

                        <div className="sm:col-span-4 space-y-1.5">
                          <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Port</span>
                          </label>
                          <input
                            type="text"
                            value={mysqlPort}
                            onChange={(e) => setMysqlPort(e.target.value)}
                            placeholder="3306"
                            className="w-full px-3.5 py-2.5 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 font-mono bg-slate-50/80 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Database Name</span>
                        </label>
                        <input
                          type="text"
                          value={mysqlDbName}
                          onChange={(e) => setMysqlDbName(e.target.value)}
                          placeholder="plc_school_db"
                          className="w-full px-3.5 py-2.5 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 font-mono bg-slate-50/80 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-2xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Username</span>
                          </label>
                          <input
                            type="text"
                            value={mysqlUser}
                            onChange={(e) => setMysqlUser(e.target.value)}
                            placeholder="root"
                            className="w-full px-3.5 py-2.5 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 font-mono bg-slate-50/80 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-2xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Password</span>
                          </label>
                          <input
                            type="password"
                            value={mysqlPassword}
                            onChange={(e) => setMysqlPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 font-mono bg-slate-50/80 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/system/settings", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                mysqlHost,
                                mysqlDbName,
                                mysqlPort: String(mysqlPort),
                                mysqlUser,
                                mysqlPassword
                              })
                            });
                            if (res.ok) {
                              showToast(idt("រក្សាទុកព័ត៌មានតភ្ជាប់បានជោគជ័យ!", "MySQL Connection Credentials saved successfully!", "成功保存 MySQL 连接凭据！"), "success");
                            } else {
                              showToast(idt("រក្សាទុកព័ត៌មានតភ្ជាប់បរាជ័យ!", "Failed to save connection credentials!", "保存连接凭据失败！"), "error");
                            }
                          } catch (err: any) {
                            console.error(err);
                            showToast(idt("កំហុស៖ ", "Error: ", "错误：") + err.message, "error");
                          }
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 text-white rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer shadow-md hover:shadow-lg border border-slate-800/80 group"
                      >
                        <Save className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-200" />
                        <span>{idt("រក្សាទុកព័ត៌មានតភ្ជាប់", "Save Connection Credentials", "保存连接凭据")}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: SQL EXPORT & STATS GRID */}
                  <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 md:p-7 space-y-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600"></div>

                    {/* HEADER TITLE */}
                    <div className="space-y-1.5 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-2xs">
                          <Code2 className="w-5 h-5 text-teal-600 stroke-[2.2]" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs md:text-sm flex items-center gap-2">
                            <span>{idt("បង្កើត & ទាញយកកូដ SQL", "SQL Generation & Download", "SQL 生成与下载")}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-200/60 font-mono">
                              MySQL Dump
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {idt(
                              "ទាញយកទិន្នន័យទាំងអស់ជាឯកសារ SQL ដើម្បីងាយស្រួលយកទៅ Import ចូលក្នុង phpMyAdmin ឬ MySQL client ខាងក្រៅដោយផ្ទាល់។",
                              "Download all database contents as a structured SQL dump file for easy importing into phpMyAdmin or external MySQL clients.",
                              "将所有数据库内容下载为结构化 SQL 转储文件，以便轻松导入 phpMyAdmin 或外部 MySQL 客户端。"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* STATS GRID */}
                    <div className="bg-slate-50/90 p-4 md:p-5 rounded-2xl border border-slate-200/80 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-600 flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{idt("ស្ថិតិទិន្នន័យ SQLite បច្ចុប្បន្នដែលត្រូវទាញយក៖", "Current Database Records Breakdown:", "当前要下载的数据库记录明细：")}</span>
                        </span>
                        <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
                          10 Tables
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                        {[
                          {
                            key: "User",
                            label: idt("គណនីបុគ្គលិក", "Staff Users", "员工账户"),
                            count: dbCounts.User,
                            unit: idt("នាក់", "users", "人"),
                            icon: User,
                            color: "text-blue-600 bg-blue-50 border-blue-200/80",
                          },
                          {
                            key: "Student",
                            label: idt("ទិន្នន័យសិស្ស", "Students", "学生记录"),
                            count: (dbCounts && dbCounts.Student) || (students || []).length,
                            unit: idt("នាក់", "students", "人"),
                            icon: GraduationCap,
                            color: "text-indigo-600 bg-indigo-50 border-indigo-200/80",
                          },
                          {
                            key: "Teacher",
                            label: idt("ទិន្នន័យគ្រូ", "Teachers", "教师记录"),
                            count: (dbCounts && dbCounts.Teacher) || (teachers || []).length,
                            unit: idt("នាក់", "teachers", "人"),
                            icon: Users,
                            color: "text-emerald-600 bg-emerald-50 border-emerald-200/80",
                          },
                          {
                            key: "Attendance",
                            label: idt("វត្តមានសិស្ស", "Student Attendance", "学生考勤"),
                            count: dbCounts.Attendance,
                            unit: idt("ដង", "records", "次"),
                            icon: Calendar,
                            color: "text-amber-600 bg-amber-50 border-amber-200/80",
                          },
                          {
                            key: "TeacherAttendance",
                            label: idt("វត្តមានគ្រូ", "Teacher Attendance", "教师考勤"),
                            count: dbCounts.TeacherAttendance,
                            unit: idt("ដង", "records", "次"),
                            icon: Clock,
                            color: "text-rose-600 bg-rose-50 border-rose-200/80",
                          },
                          {
                            key: "Invoice",
                            label: idt("វិក្កយបត្រ", "Invoices", "发票"),
                            count: dbCounts.Invoice,
                            unit: idt("ច្បាប់", "invoices", "张"),
                            icon: CreditCard,
                            color: "text-purple-600 bg-purple-50 border-purple-200/80",
                          },
                          {
                            key: "SalaryPayment",
                            label: idt("ប្រាក់បៀវត្សរ៍គ្រូ", "Teacher Salaries", "教师工资"),
                            count: dbCounts.SalaryPayment,
                            unit: idt("ដង", "payments", "次"),
                            icon: Coins,
                            color: "text-teal-600 bg-teal-50 border-teal-200/80",
                          },
                          {
                            key: "CertificateTemplate",
                            label: idt("គំរូវិញ្ញាបនបត្រ", "Templates", "证书模板"),
                            count: dbCounts.CertificateTemplate,
                            unit: idt("ផ្ទាំង", "templates", "套"),
                            icon: LayoutGrid,
                            color: "text-cyan-600 bg-cyan-50 border-cyan-200/80",
                          },
                          {
                            key: "Certificate",
                            label: idt("វិញ្ញាបនបត្រចេញ", "Issued Certs", "已发证书"),
                            count: dbCounts.Certificate,
                            unit: idt("សន្លឹក", "certificates", "张"),
                            icon: Award,
                            color: "text-orange-600 bg-orange-50 border-orange-200/80",
                          },
                          {
                            key: "Asset",
                            label: idt("សម្ភារៈសិក្សា", "School Assets", "学校物资"),
                            count: JSON.parse(localStorage.getItem("plc_school_assets") || "[]").length,
                            unit: idt("មុខ", "items", "种"),
                            icon: Layers,
                            color: "text-amber-700 bg-amber-50 border-amber-200/80",
                          },
                        ].map((table) => {
                          const IconComponent = table.icon;
                          return (
                            <div
                              key={table.key}
                              className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 flex items-center gap-2.5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 hover:border-indigo-400 group cursor-default"
                            >
                              <div className={`p-2 rounded-xl border ${table.color} shrink-0 group-hover:scale-105 transition-transform`}>
                                <IconComponent className="w-4 h-4 stroke-[2.2]" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span
                                  className="block text-[10px] sm:text-[11px] font-bold text-slate-500 leading-tight truncate"
                                  title={table.label}
                                >
                                  {table.label}
                                </span>
                                <span className="text-xs sm:text-sm font-black text-slate-900 font-mono block mt-0.5">
                                  {toKhmerNumeral(table.count)} <span className="text-[10px] font-semibold text-slate-500 font-sans">{table.unit}</span>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[11px] text-slate-600 font-bold flex items-center gap-2 pt-2 border-t border-slate-200/70 mt-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.2]" />
                        <span>{idt("ប្រព័ន្ធនឹងទាញយកតារាងទិន្នន័យទាំង ១០ របស់សាលាទាំងមូលដោយស្វ័យប្រវត្ត។", "The system will automatically download all 10 database tables for the school.", "系统将自动下载学校的所有 10 个数据库表。")}</span>
                      </div>
                    </div>

                  {/* SQL PREVIEW CODE TERMINAL */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                        {idt("កូដ SQL PREVIEW TERMINAL:", "SQL Code Preview Terminal:", "SQL 代码预览终端：")}
                      </span>
                      {generatedSql && (
                        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                          {toKhmerNumeral(Math.ceil(generatedSql.length / 1024).toString())} KB ({toKhmerNumeral(generatedSql.split('\n').length.toString())} {idt("បន្ទាត់", "lines", "行")})
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                      {/* Terminal Bar */}
                      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 ml-2">plc_school_db.sql</span>
                        </div>
                        {generatedSql && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedSql);
                              setCopiedCode(true);
                              setTimeout(() => setCopiedCode(false), 2000);
                              showToast(idt("បានចម្លងកូដ SQL រួចរាល់!", "SQL code copied to clipboard successfully!", "已成功复制 SQL 代码！"), "success");
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer active:scale-95"
                          >
                            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                            <span>{copiedCode ? idt("បានចម្លង", "Copied", "已复制") : idt("ចម្លងកូដ", "Copy SQL", "复制 SQL")}</span>
                          </button>
                        )}
                      </div>

                      {/* Code Area */}
                      <div className="p-4 min-h-[140px] max-h-[180px] overflow-y-auto scrollbar-none font-mono text-xs">
                        {generatedSql ? (
                          <pre className="text-[10px] font-mono text-emerald-400 leading-relaxed whitespace-pre select-all">
                            {generatedSql}
                          </pre>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center space-y-1.5 text-slate-500">
                            <Code2 className="w-8 h-8 text-slate-700 stroke-[1.5]" />
                            <span className="text-xs font-mono font-bold text-slate-400">
                              {idt("កូដ SQL មិនទាន់ត្រូវបានបង្កើតនៅឡើយទេ...", "SQL code has not been generated yet...", "SQL 代码尚未生成...")}
                            </span>
                            <span className="text-[10px] text-slate-500 font-sans">
                              {idt("សូមចុចប៊ូតុងខាងក្រោមដើម្បីមើលគំរូ ឬទាញយកឯកសារ SQL", "Click the button below to preview or download the SQL file.", "点击下方按钮预览或下载 SQL 文件。")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      <button
                        type="button"
                        onClick={handleGenerateAndDownloadSql}
                        disabled={generatingSql}
                        className="py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600 text-white rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 disabled:opacity-60 border border-indigo-500/30 group"
                      >
                        {generatingSql ? (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                        ) : (
                          <Download className="w-4 h-4 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                        <span>{idt("ទាញយកឯកសារ SQL (.sql)", "Download SQL File (.sql)", "下载 SQL 文件 (.sql)")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateSql}
                        disabled={generatingSql}
                        className="py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer border border-slate-800 shadow-md disabled:opacity-60 group"
                      >
                        {generatingSql ? (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                        ) : generatedSql ? (
                          <RefreshCw className="w-4 h-4 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-300 group-hover:scale-110 transition-transform" />
                        )}
                        <span>{generatedSql ? idt("បង្កើតកូដឡើងវិញ", "Re-Generate SQL", "重新生成 SQL") : idt("មើលគំរូកូដ SQL", "Preview SQL Code", "预览 SQL 代码")}</span>
                      </button>
                    </div>
                  </div>

                  {/* LIVE TERMINAL LOGS */}
                  <div className="bg-slate-950 text-slate-300 rounded-2xl p-4 border border-slate-800/90 space-y-3 font-mono shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider">
                          {idt("របាយការណ៍ដំណើរការ (Migration Terminal Log)", "Migration Terminal Log", "迁移终端日志")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800">
                        <span className="text-[9px] font-mono font-bold text-slate-400">STATUS: READY</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                    </div>
                    <div className="h-28 overflow-y-auto text-[10px] space-y-1.5 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 font-mono pr-1">
                      {migrationLogs.length > 0 ? (
                        migrationLogs.map((logLine, i) => (
                          <p
                            key={i}
                            className={
                              logLine.includes("ជោគជ័យ") || logLine.includes("🎉")
                                ? "text-emerald-400 font-semibold flex items-start gap-1"
                                : logLine.includes("បរាជ័យ") || logLine.includes("ECONNREFUSED")
                                ? "text-rose-400 font-semibold flex items-start gap-1"
                                : "text-slate-300 flex items-start gap-1"
                            }
                          >
                            <span className="text-indigo-400 shrink-0">&gt;</span>
                            <span>{logLine}</span>
                          </p>
                        ))
                      ) : (
                        <p className="text-slate-500 italic flex items-center gap-2 py-2">
                          <span className="text-indigo-500/60 font-bold">&gt;</span>
                          <span>{idt("មិនទាន់មានដំណើរការផ្ទេរទិន្នន័យនៅឡើយទេ... (Terminal idle)", "No migration process initiated... (Terminal idle)", "尚未启动任何迁移进程... (Terminal idle)")}</span>
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* ACCORDION: PRISMA & MYSQL SCHEMA CODE */}
              <div className="border border-slate-200/90 bg-white rounded-3xl overflow-hidden shadow-2xs w-full">
                <button
                  type="button"
                  onClick={() => setShowPrismaInMysql(!showPrismaInMysql)}
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50/80 transition-all text-left cursor-pointer outline-none gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs">
                      <FileCode className="w-5 h-5 text-indigo-600 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug break-normal whitespace-normal">
                        {idt("កូដ រចនាសម្ព័ន្ធ ទិន្នន័យ Prisma & MySQL Schema", "Prisma & MySQL Database Schema Code", "Prisma & MySQL 数据库结构代码")}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug mt-0.5 break-normal whitespace-normal">
                        {idt("មើល ព័ត៌មានលម្អិត នៃ Schema និង ទំនាក់ទំនង រវាង Tables ទាំងអស់", "View complete schema details and relationships of all database tables", "查看所有数据库表的完整结构和关系")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-xs bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 shrink-0 whitespace-nowrap">
                    <span>{showPrismaInMysql ? idt("លាក់", "Hide", "隐藏") : idt("បង្ហាញ", "Show Schema", "显示 Schema")}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPrismaInMysql ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {showPrismaInMysql && (
                  <div className="border-t border-slate-200/80 bg-slate-950">
                    <div className="p-4 sm:p-5 font-mono text-xs text-slate-300">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400 gap-2">
                        <span className="text-xs font-mono font-bold text-slate-300 truncate">prisma/schema.prisma</span>
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg font-sans font-extrabold shrink-0">
                          Prisma Core Schema
                        </span>
                      </div>
                      <div className="overflow-x-auto max-h-[480px] overflow-y-auto rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
                        <pre className="leading-relaxed whitespace-pre font-mono text-slate-200 text-[11px] sm:text-xs">
                          {PRISMA_SCHEMA_CODE}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

const PRISMA_SCHEMA_CODE = `generator client {
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
}
`;
