import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Camera, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle, Database, Loader2, RefreshCw } from 'lucide-react';

export default function MySQLDBTab(props: any) {
  const { activeTab, dbCounts, generatedSql, generatingSql, handleGenerateAndDownloadSql, handleGenerateSql, handleLiveMigrate, handleTestMysqlConnection, migrating, migrationLogs, mysqlDbName, mysqlHost, mysqlPassword, mysqlPort, mysqlUser, setMysqlDbName, setMysqlHost, setMysqlPassword, setMysqlPort, setMysqlUser, setShowPrismaInMysql, showPrismaInMysql, showToast, students, teachers, testingConnection, toKhmerNumeral, token, uiLang } = props;

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
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="w-full space-y-6"
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-blue-600 p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-lg flex items-center gap-2">
                          <Database className="w-5 h-5" />
                          {idt("ការតភ្ជាប់ទិន្នន័យ MySQL", "MySQL DB Synchronization Hub (MySQL DB Synchronization Hub)", "MySQL 数据库同步中心 (MySQL DB Synchronization Hub)")}
                        </h3>
                        <p className="text-xs text-blue-100 font-semibold leading-relaxed">
                          {idt("ធ្វើសមកាលកម្មទិន្នន័យរវាងប្រព័ន្ធគ្រប់គ្រងសាលានេះ ទៅកាន់មូលដ្ឋានទិន្នន័យ MySQL ខាងក្រៅដោយផ្ទាល់។", "Directly synchronize database between this school system (SQLite) and an external MySQL database.", "直接在此学校系统 (SQLite) 与外部 MySQL 数据库之间进行数据同步。")}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleTestMysqlConnection}
                          disabled={testingConnection}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          {testingConnection ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          <span>{idt("តេស្តការតភ្ជាប់", "Test Sync (Test Sync)", "测试同步 (Test Sync)")}</span>
                        </button>

                        <button
                          onClick={handleLiveMigrate}
                          disabled={migrating}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          {migrating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
                          <span>{idt("ធ្វើសមកាលកម្មផ្ទាល់", "Live Sync (Live Sync)", "实时同步 (Live Sync)")}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50">
                    {/* Database Credentials Form */}
                    <div className="md:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                        {idt("ទិន្នន័យតភ្ជាប់ MySQL Credentials", "MySQL Connection Credentials", "MySQL 连接凭据")}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">MySQL Host</label>
                          <input
                            type="text"
                            value={mysqlHost}
                            onChange={(e) => setMysqlHost(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono bg-slate-50/50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Port</label>
                          <input
                            type="text"
                            value={mysqlPort}
                            onChange={(e) => setMysqlPort(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono bg-slate-50/50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database Name</label>
                        <input
                          type="text"
                          value={mysqlDbName}
                          onChange={(e) => setMysqlDbName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono bg-slate-50/50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Username</label>
                          <input
                            type="text"
                            value={mysqlUser}
                            onChange={(e) => setMysqlUser(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono bg-slate-50/50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                          <input
                            type="password"
                            value={mysqlPassword}
                            onChange={(e) => setMysqlPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono bg-slate-50/50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

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
                              showToast(idt("រក្សាទុកព័ត៌មានតភ្ជាប់បានជោគជ័យ! (MySQL Credentials saved!)", "MySQL Connection Credentials saved successfully!", "成功保存 MySQL 连接凭据！"), "success");
                            } else {
                              showToast(idt("រក្សាទុកព័ត៌មានតភ្ជាប់បរាជ័យ!", "Failed to save connection credentials!", "保存连接凭据失败！"), "error");
                            }
                          } catch (err: any) {
                            console.error(err);
                            showToast(idt("កំហុស៖ ", "Error: ", "错误：") + err.message, "error");
                          }
                        }}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer mt-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {idt("រក្សាទុកព័ត៌មានតភ្ជាប់", "Save Credentials (Save Credentials)", "保存凭据 (Save Credentials)")}
                      </button>
                    </div>

                    {/* SQL Generator & Statistics Box */}
                    <div className="md:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-xs flex flex-col justify-between">
                      
                      {/* Section Title & Description */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary-700">
                          <Database className="w-4 h-4" />
                          <h4 className="font-extrabold text-[#2563eb] text-xs uppercase tracking-wider">
                            SQL GENERATION & DOWNLOAD
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                          {idt("ទាញយកទិន្នន័យទាំងអស់ជាឯកសារ SQL ដើម្បីងាយស្រួលយកទៅ Import ចូលក្នុង phpMyAdmin ឬ MySQL client ខាងក្រៅដោយផ្ទាល់ និងមានសុវត្ថិភាពខ្ពស់។", "Download all database contents as an SQL dump file for easy and secure importing into phpMyAdmin or external MySQL clients.", "将所有数据库内容下载为 SQL 转储文件，以便轻松、安全地导入到 phpMyAdmin 或外部 MySQL 客户端中。")}
                        </p>
                      </div>

                      {/* Database Stats Badge Container */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">
                          {idt("ស្ថិតិទិន្នន័យ SQLite បច្ចុប្បន្នដែលត្រូវទាញយក៖", "Current SQLite database stats to download:", "当前要下载的 SQLite 数据库统计信息：")}
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {[
                            {
                              key: "User",
                              label: idt("គណនីបុគ្គលិក", "Staff Accounts (User)", "员工账户 (User)"),
                              count: dbCounts.User,
                              unit: idt("នាក់", "users", "人"),
                              icon: User,
                              color: "text-blue-500 bg-blue-50 border-blue-100",
                            },
                            {
                              key: "Student",
                              label: idt("ទិន្នន័យសិស្ស", "Student Records (Student)", "学生记录 (Student)"),
                              count: (dbCounts && dbCounts.Student) || (students || []).length,
                              unit: idt("នាក់", "students", "人"),
                              icon: GraduationCap,
                              color: "text-primary-500 bg-primary-50 border-primary-100",
                            },
                            {
                              key: "Teacher",
                              label: idt("ទិន្នន័យគ្រូ", "Teacher Records (Teacher)", "教师记录 (Teacher)"),
                              count: (dbCounts && dbCounts.Teacher) || (teachers || []).length,
                              unit: idt("នាក់", "teachers", "人"),
                              icon: Users,
                              color: "text-emerald-500 bg-emerald-50 border-emerald-100",
                            },
                            {
                              key: "Attendance",
                              label: idt("វត្តមានសិស្ស", "Student Attendance (Attendance)", "学生考勤 (Attendance)"),
                              count: dbCounts.Attendance,
                              unit: idt("ដង", "records", "次"),
                              icon: Calendar,
                              color: "text-amber-500 bg-amber-50 border-amber-100",
                            },
                            {
                              key: "TeacherAttendance",
                              label: idt("វត្តមានគ្រូ", "Teacher Attendance (Teacher Attendance)", "教师考勤 (Teacher Attendance)"),
                              count: dbCounts.TeacherAttendance,
                              unit: idt("ដង", "records", "次"),
                              icon: Clock,
                              color: "text-rose-500 bg-rose-50 border-rose-100",
                            },
                            {
                              key: "Invoice",
                              label: idt("វិក្កយបត្រ", "Invoices & Payments (Invoice)", "发票与付款 (Invoice)"),
                              count: dbCounts.Invoice,
                              unit: idt("ច្បាប់", "invoices", "张"),
                              icon: CreditCard,
                              color: "text-blue-500 bg-blue-50 border-blue-100",
                            },
                            {
                              key: "SalaryPayment",
                              label: idt("ប្រាក់បៀវត្សរ៍គ្រូ", "Teacher Salaries (Salary)", "教师工资 (Salary)"),
                              count: dbCounts.SalaryPayment,
                              unit: idt("ដង", "payments", "次"),
                              icon: Coins,
                              color: "text-teal-500 bg-teal-50 border-teal-100",
                            },
                            {
                              key: "CertificateTemplate",
                              label: idt("គំរូវិញ្ញាបនបត្រ", "Certificate Templates (Template)", "证书模板 (Template)"),
                              count: dbCounts.CertificateTemplate,
                              unit: idt("ផ្ទាំង", "templates", "套"),
                              icon: LayoutGrid,
                              color: "text-cyan-500 bg-cyan-50 border-cyan-100",
                            },
                            {
                              key: "Certificate",
                              label: idt("វិញ្ញាបនបត្រដែលចេញ", "Issued Certificates (Cert)", "已发证书 (Cert)"),
                              count: dbCounts.Certificate,
                              unit: idt("សន្លឹក", "certificates", "张"),
                              icon: Award,
                              color: "text-orange-500 bg-orange-50 border-orange-100",
                            },
                            {
                              key: "Asset",
                              label: idt("គ្រប់គ្រងសម្ភារៈសិក្សា", "Assets & Materials (Asset)", "学校物资设备 (Asset)"),
                              count: JSON.parse(localStorage.getItem("plc_school_assets") || "[]").length,
                              unit: idt("មុខ", "items", "种"),
                              icon: Layers,
                              color: "text-amber-600 bg-amber-50 border-amber-200",
                            },
                          ].map((table) => {
                            const IconComponent = table.icon;
                            return (
                              <div key={table.key} className="bg-white p-2.5 rounded-xl border border-slate-200/50 flex items-center gap-2.5 shadow-3xs hover:shadow-2xs transition-all hover:border-slate-300">
                                <div className={`p-2 rounded-lg border ${table.color.split(' ').slice(1).join(' ')} shrink-0`}>
                                  <IconComponent className={`w-3.5 h-3.5 ${table.color.split(' ')[0]}`} />
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-[7.5px] font-black text-slate-400 uppercase truncate">
                                    {table.label}
                                  </span>
                                  <span className="text-xs font-black text-slate-700 font-mono">
                                    {toKhmerNumeral(table.count)} {table.unit}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-[8.5px] text-slate-500 font-bold flex items-center gap-1.5 mt-1 bg-primary-50/50 p-1.5 rounded-md text-primary-700 border border-primary-100/30">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0 text-primary-500" />
                          <span>{idt("ប្រព័ន្ធនឹងទាញយកតារាងទិន្នន័យទាំង ១០ របស់សាលាទាំងមូលដោយស្វ័យប្រវត្ត។", "The system will automatically download all 10 database tables for the entire school.", "系统将自动下载整个学校的所有 10 个数据库表。")}</span>
                        </div>
                      </div>

                      {/* SQL Code Preview Container */}
                      <div className="space-y-3">
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">
                          {idt("កូដ SQL Preview៖", "SQL Code Preview:", "SQL 代码预览：")}
                        </span>
                        <div className="bg-slate-900 rounded-xl p-4 relative min-h-[120px] flex flex-col justify-between border border-slate-800">
                          {generatedSql ? (
                            <div className="w-full flex flex-col justify-between h-full space-y-2">
                              <pre className="text-[9.5px] font-mono text-primary-300 w-full overflow-x-auto max-h-[160px] whitespace-pre overflow-y-auto scrollbar-none select-all leading-normal">
                                {generatedSql}
                              </pre>
                              <div className="text-[8.5px] font-bold text-slate-400 bg-slate-800/60 p-1 rounded max-w-fit px-2 border border-slate-700/50">
                                Size: {toKhmerNumeral(Math.ceil(generatedSql.length / 1024).toString())} KB ({toKhmerNumeral(generatedSql.split('\n').length.toString())} Lines)
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-1 w-full h-full">
                              <span className="text-[10px] font-mono text-slate-500 font-bold">{idt("កូដ SQL មិនទាន់ត្រូវបានបង្កើតនៅឡើយទេ...", "SQL code has not been generated yet...", "SQL 代码尚未生成...")}</span>
                              <span className="text-[8.5px] text-slate-600 font-semibold font-sans">{idt("សូមចុចប៊ូតុងខាងក្រោមដើម្បីទាញយក ឬមើលគំរូកូដ", "Please click the button below to download or preview the code.", "请点击下方按钮下载或预览代码。")}</span>
                            </div>
                          )}

                          {generatedSql && (
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(generatedSql);
                                  showToast(idt("បានចម្លងកូដ SQL រួចរាល់! (SQL copied!)", "SQL code copied to clipboard successfully!", "已成功复制 SQL 代码！"), "success");
                                }}
                                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 hover:text-emerald-400 text-white rounded-md text-[9.5px] font-bold transition-all backdrop-blur-md flex items-center gap-1 border border-white/5 cursor-pointer shadow-sm"
                              >
                                <Check className="w-3 h-3" />
                                {idt("ចម្លង", "Copy (Copy)", "复制 (Copy)")}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Control Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={handleGenerateAndDownloadSql}
                            disabled={generatingSql}
                            className="py-2.5 bg-[#2563eb] hover:bg-[#2b1fbb] text-white rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-primary-100 disabled:opacity-60"
                          >
                            {generatingSql ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            {idt("ទាញយកឯកសារ SQL", "Download SQL File (Download .SQL)", "下载 SQL 文件 (Download .SQL)")}
                          </button>

                          <button
                            type="button"
                            onClick={handleGenerateSql}
                            disabled={generatingSql}
                            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer border border-slate-200/60 disabled:opacity-60"
                          >
                            {generatingSql ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : generatedSql ? (
                              <RefreshCw className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                            {generatedSql ? idt("បង្កើតកូដឡើងវិញ", "Re-Generate", "重新生成") : idt("មើលគំរូកូដ SQL", "Preview SQL Code", "预览 SQL 代码")}
                          </button>
                        </div>
                      </div>

                      {/* Live Sync Log Terminal Section (Single and elegant) */}
                      <div className="bg-slate-950 text-slate-300 rounded-xl p-5 border border-slate-900 space-y-3 font-mono shadow-inner">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <div className="flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-primary-400" />
                            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                              {idt("របាយការណ៍ដំណើរការ", "Migration Output Terminal (Migration Output Terminal)", "数据迁移输出终端 (Migration Output Terminal)")}
                            </span>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <div className="h-28 overflow-y-auto text-[9.5px] space-y-1.5 leading-relaxed scrollbar-none font-mono">
                          {migrationLogs.length > 0 ? (
                            migrationLogs.map((logLine, i) => (
                              <p key={i} className={logLine.includes("ជោគជ័យ") || logLine.includes("🎉") ? "text-emerald-400" : logLine.includes("បរាជ័យ") ? "text-rose-400" : "text-slate-300"}>
                                {logLine}
                              </p>
                            ))
                          ) : (
                            <p className="text-slate-600 italic">{idt("មិនទាន់មានដំណើរការផ្ទេរទិន្នន័យនៅឡើយទេ...", "No migration process has been initiated yet... (Terminal idle)", "尚未启动任何迁移进程... (Terminal idle)")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRISMA MYSQL SCHEMA CODE ACCORDION */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50/35">
                    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setShowPrismaInMysql(!showPrismaInMysql)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                            <FileCode className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <span className="font-extrabold text-xs uppercase text-slate-800 tracking-wider block">
                              {idt("រចនាសម្ព័ន្ធតារាងទិន្នន័យ PRISMA & MYSQL SCHEMA CODE", "PRISMA & MYSQL DATABASE SCHEMA CODE", "PRISMA & MYSQL 数据库结构代码")}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                              {idt("មើលព័ត៌មានលម្អិតនៃ Schema និងទំនាក់ទំនងរវាង Tables ទាំង ៩", "View complete schema details and relationships of all 9 tables", "查看所有 9 个数据表的完整结构和关系")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-xs">
                          <span>{showPrismaInMysql ? idt("លាក់", "Hide", "隐藏") : idt("បង្ហាញ", "Show", "显示")}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPrismaInMysql ? "rotate-180" : ""}`} />
                        </div>
                      </button>

                      {showPrismaInMysql && (
                        <div className="border-t border-slate-100">
                          {/* Prisma code view */}
                          <div className="p-5 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-none">
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-500">
                              <span>prisma/schema.prisma</span>
                              <span className="text-[10px] bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded uppercase font-sans font-black">Prisma Core</span>
                            </div>
                            <pre className="leading-relaxed whitespace-pre font-mono">
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}    </>
  );
}
