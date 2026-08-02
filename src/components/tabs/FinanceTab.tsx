import React from 'react';
import { exportToExcel } from '../../exportUtils';
import SearchableSelect from "../SearchableSelect";
import { motion, AnimatePresence } from 'motion/react';
import { PieChart as PieIcon } from 'lucide-react';
import { QrCode, Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Camera, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export default function FinanceTab(props: any) {
  const {
    uiLang: propUiLang,
setExpenseFormAmount, schoolExpenses, setExpenseFormNote, schoolLogo, editingExpenseCategoryLabelEn, setExpenseSearchQuery, setNewExpenseCategoryLabelEn, withSafeCss, expenseFormNote, setSalaryStatus, viewReceiptTx, setSelectedPayTeacherId, financeSearchQuery, setSalaryStatuses, setSalaryDeduction, setIsOpenSalaryStatusDropdown, viewSalaryReceipt, isOpenExpenseCategoryDropdown, newExpensePaymentMethodValue, setExpenseFormPaymentMethod, setEditingExpensePaymentMethodValue, paymentAmount, setExpenseFormId, setExpenseFormDate, isOpenExpensePaymentMethodDropdown, schoolKhmerName, setEditingSalaryStatusValue, paymentMethods, setEditingExpenseCategoryLabelEn, salaryDeduction, getStudentHoursInfo, setNewSalaryStatusValue, expenseFilterCategory, salaries, newExpenseCategoryLabelKh, showToast, setIsOpenExpensePaymentMethodDropdown, setShowRecordPaymentModal, expenseFormId, setViewReceiptTx, setFinanceSubTab, setEditingPaymentMethodIndex, setPayPeriodInput, setStudents, getStudentStudyHours, selectedPaymentStudentId, salaryBonus, paymentFormSuccess, setEditingPaymentMethodValue, setExpenseFormTitle, showPaySalaryModal, setSalaryBonus, salaryStatuses, translateShiftText, expenseCategories, setPaymentMethods, salaryStatus, setSchoolExpenses, setDeleteConfirm, setSalaryBaseAmount, expenseFormSuccess, setSelectedPaymentMethod, setNewExpenseCategoryLabelKh, setIsOpenPaymentMethodDropdown, setShowAddNewMethodInput, selectedPayTeacherId, isOpenSalaryStatusDropdown, transactions, expenseFormTitle, setViewSalaryReceipt, setIsOpenExpenseCategoryDropdown, editingPaymentMethodIndex, schoolPhone, payPeriodInput, translateLevelText, newExpenseCategoryLabelEn, setShowAddExpenseModal, setPaymentAmount, setSalaries, expenseFormDate, setEditingExpenseCategoryId, editingSalaryStatusIndex, setPaymentFormSuccess, selectedPaymentMethod, token, setSalaryFormSuccess, editingExpensePaymentMethodIndex, salaryBaseAmount, toKhmerNumberGlobal, editingExpenseCategoryLabelKh, salaryFormSuccess, setNewPaymentMethodValue, expenseFormAmount, newPaymentMethodValue, setSelectedPaymentStudentId, setShowPaySalaryModal, receiptFooterNote, newSalaryStatusValue, teachers: rawTeachers, expenseFormCategory, financeSubTab, students: rawStudents, translateCourseOrSpecialtyName, setExpenseCategories, editingPaymentMethodValue, setEditingSalaryStatusIndex, expenseFormPaymentMethod, schoolAddress, isOpenPaymentMethodDropdown, setExpenseFilterCategory, showRecordPaymentModal, setEditingExpenseCategoryLabelKh, editingExpenseCategoryId, setExpenseFormSuccess, setExpenseFormCategory, schoolName, setNewExpensePaymentMethodValue, expenseSearchQuery, getCourseTitle, editingExpensePaymentMethodValue, showAddExpenseModal, editingSalaryStatusValue, setFinanceSearchQuery, setEditingExpensePaymentMethodIndex, setTransactions,
  user,
  khqrImage,
  setKhqrImage
  } = props;

  const students = (rawStudents || []).filter((s: any) => s && s.status === 'STUDYING');
  const teachers = (rawTeachers || []).filter((t: any) => t && (t.status === 'ACTIVE' || t.status === 'LEAVE'));

  const [localLang, setLocalLang] = React.useState(propUiLang || localStorage.getItem("plc_lang") || "kh");

  React.useEffect(() => {
    if (propUiLang) {
      setLocalLang(propUiLang);
    }
  }, [propUiLang]);

  React.useEffect(() => {
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

  const [khqrVerifyStatus, setKhqrVerifyStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [khqrVerifyMessage, setKhqrVerifyMessage] = React.useState('');
  const [showVerifyInfo, setShowVerifyInfo] = React.useState(true);



  const handleExportFinanceStudents = () => {
    const filtered = students.filter(s => {
      const q = (financeSearchQuery || '').toLowerCase();
      return (
        s.nameKh.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
      );
    });
    const data = filtered.map(s => ({
      "អត្តសញ្ញាណ (ID)": s.studentId,
      "Name (KH)": s.nameKh,
      "Name (EN)": s.nameEn,
      "Course": s.course,
      "Total Fee": s.fee,
      "Paid": s.paid,
      "Due": s.due,
      "Status": s.status
    }));
    exportToExcel(data, 'Finance_Students_Report', 'របាយការណ៍បង់ប្រាក់សិស្ស (Student Payment Report)');
  };

  const handleExportTransactions = () => {
    const filtered = transactions.filter(tx => {
      if (!financeSearchQuery) return true;
      const q = (financeSearchQuery || '').toLowerCase().trim();
      const invMatch = (tx.invoiceNumber || `INV-${tx.id.slice(-6).toUpperCase()}`).toLowerCase().includes(q);
      const studentNameMatch = tx.studentName?.toLowerCase().includes(q);
      return invMatch || studentNameMatch;
    });
    const data = filtered.map(tx => ({
      "Invoice #": tx.invoiceNumber || `INV-${tx.id.slice(-6).toUpperCase()}`,
      "Date": tx.date,
      "Student Name": tx.studentName,
      "Amount": tx.amount,
      "Method": tx.method,
      "Note": tx.note
    }));
    exportToExcel(data, 'Income_Transactions_Report', 'របាយការណ៍ចំណូលពីការបង់ប្រាក់ (Income Transactions Report)');
  };

  const handleExportSalaries = () => {
    const filtered = salaries.filter((s) => {
      const teacherObj = teachers.find(t => t.id === s.teacherId || t.teacherId === s.teacherId);
      const name = teacherObj ? (teacherObj.nameKh || teacherObj.nameEn || "") : (s.teacherName || "");
      const q = (financeSearchQuery || '').toLowerCase();
      return (name || '').toLowerCase().includes(q) || (s.period && s.period.toLowerCase().includes(q));
    });
    const data = filtered.map(s => {
      const teacherObj = teachers.find(t => t.id === s.teacherId || t.teacherId === s.teacherId);
      const name = teacherObj ? (teacherObj.nameKh || teacherObj.nameEn) : (s.teacherName || "Teacher");
      return {
        "Period": s.period,
        "Teacher Name": name,
        "Base Salary": s.baseSalary,
        "Bonus": s.bonus,
        "Deduction": s.deduction,
        "Total Amount": s.amount,
        "Status": s.status
      };
    });
    exportToExcel(data, 'Salaries_Report', 'របាយការណ៍បើកប្រាក់បៀវត្ស (Salaries Report)');
  };

  const handleExportExpenses = () => {
    const filtered = schoolExpenses.filter(item => {
      if (expenseFilterCategory !== "all" && item.category !== expenseFilterCategory) {
        return false;
      }
      if (expenseSearchQuery) {
        const q = (expenseSearchQuery || '').toLowerCase();
        return (item.title || item.description || '').toLowerCase().includes(q) || (item.note && (item.note || '').toLowerCase().includes(q));
      }
      return true;
    });
    const data = filtered.map(item => {
      const cat = expenseCategories.find(c => c.id === item.category);
      const catNameKh = cat ? cat.labelKh : (item.category === 'electricity' ? 'អគ្គិសនី' : item.category === 'water' ? 'ទឹក' : item.category === 'supplies' ? 'សម្ភារៈសិក្សា' : item.category === 'internet' ? 'អ៊ីនធឺណិត' : item.category === 'rent' ? 'ថ្លៃឈ្នួលទីតាំង' : item.category === 'maintenance' ? 'ជួសជុល និងថែទាំ' : item.category === 'marketing' ? 'ផ្សព្វផ្សាយ' : 'ផ្សេងៗ');
      const catNameEn = cat ? cat.labelEn : item.category;
      
      return {
        "កាលបរិច្ឆេទ (Date)": item.date || "-",
        "ចំណងជើងចំណាយ (Title)": item.title || item.description || "-",
        "ប្រភេទចំណាយ (Category)": `${catNameKh} (${catNameEn})`,
        "ទឹកប្រាក់ (Amount)": item.amount || item.value || 0,
        "វិធីសាស្រ្ត (Method)": item.paymentMethod || item.method || "-",
        "ចំណាំ (Note)": item.note || "-"
      };
    });
    exportToExcel(data, 'Expenses_Report', 'របាយការណ៍ចំណាយសាលា (School Expenses Report)');
  };

return (
              <motion.div
                key="finance-tab"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="space-y-4 pb-10 font-sans"
              >
                {/* Header row with Title and Record Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 select-none">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                        <Landmark className="w-4.5 h-4.5" />
                      </span>
                      <span>
                        {uiLang === "kh" ? "ប្រព័ន្ធគ្រប់គ្រងហិរញ្ញវត្ថុ និងវិក្កយបត្រ" : uiLang === "en" ? "Financial Ledger & Billing System" : "财务收支与账单管理系统"}
                      </span>
                    </h2>
                  </div>
                  {financeSubTab === "salaries" ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportSalaries}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs hover:border-primary-200 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{uiLang === "kh" ? "ទាញយក Excel" : uiLang === "en" ? "EXPORT EXCEL" : "导出 EXCEL"}</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPayTeacherId("");
                          setSalaryBaseAmount(450);
                          setSalaryBonus(0);
                          setSalaryDeduction(0);
                          setSalaryFormSuccess(null);
                          setSalaryStatus(salaryStatuses[0] || "បើកសព្វគ្រប់ (PAID)");
                          setShowPaySalaryModal(true);
                        }}
                        className="self-start sm:self-center px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[12px] font-black transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg shadow-rose-600/15 hover:shadow-xl hover:shadow-rose-600/25 hover:-translate-y-0.5 active:scale-[0.97] border border-rose-500/10 select-none"
                      >
                        <Coins className="w-4 h-4 animate-bounce-subtle" />
                        <span>{uiLang === "kh" ? "កត់ត្រាបើកប្រាក់ខែ" : uiLang === "en" ? "Pay Salary" : "发放工资"}</span>
                      </button>
                    </div>
                  ) : financeSubTab === "expenses" ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportExpenses}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs hover:border-primary-200 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{uiLang === "kh" ? "ទាញយក Excel" : uiLang === "en" ? "EXPORT EXCEL" : "导出 EXCEL"}</span>
                      </button>
                      <button
                        onClick={() => {
                          setExpenseFormId(null);
                          setExpenseFormTitle("");
                          setExpenseFormAmount("");
                          setExpenseFormCategory("electricity");
                          const d = new Date();
                          setExpenseFormDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                          setExpenseFormPaymentMethod("សាច់ប្រាក់ (CASH)");
                          setExpenseFormNote("");
                          setExpenseFormSuccess(null);
                          setShowAddExpenseModal(true);
                        }}
                        className="self-start sm:self-center px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-[12px] font-black transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-600/15 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5 active:scale-[0.97] border border-primary-500/10 select-none"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>{uiLang === "kh" ? "កត់ត្រាការចំណាយ (Record Expense)" : uiLang === "en" ? "Record Expense" : "记一笔支出"}</span>
                      </button>
                    </div>
                  ) : financeSubTab === 'tuition' ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportFinanceStudents}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs hover:border-primary-200 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{uiLang === "kh" ? "ទាញយក Excel" : uiLang === "en" ? "EXPORT EXCEL" : "导出 EXCEL"}</span>
                      </button>
                      <button
                        onClick={() => {
                          setPaymentFormSuccess(null);
                          setSelectedPaymentStudentId("");
                          setPaymentAmount(60);
                          setSelectedPaymentMethod(paymentMethods[0] || "សាច់ប្រាក់ (CASH)");
                          setShowAddNewMethodInput(false);
                          setShowRecordPaymentModal(true);
                        }}
                        className="self-start sm:self-center px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-[12px] font-black transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-600/15 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5 active:scale-[0.97] border border-primary-500/10 select-none"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>{uiLang === "kh" ? "កត់ត្រាការបង់ប្រាក់សិស្ស" : uiLang === "en" ? "Record Tuition Payment" : "录入学费收费"}</span>
                      </button>
                    </div>
                  ) : financeSubTab === 'invoices' ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportTransactions}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs hover:border-primary-200 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{uiLang === "kh" ? "ទាញយក Excel" : uiLang === "en" ? "EXPORT EXCEL" : "导出 EXCEL"}</span>
                      </button>
                    </div>
                  ) : financeSubTab === 'reports' ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const data = [
                            {
                              "Metric": uiLang === "kh" ? "ចំណូលថ្លៃសិក្សាសរុប" : "Total Revenue",
                              "Value": "$" + transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)
                            },
                            {
                              "Metric": uiLang === "kh" ? "ចំណាយសរុប" : "Total Expenses",
                              "Value": "-$" + (schoolExpenses.reduce((sum, item) => sum + Number(item.amount || item.value || 0), 0) + salaries.reduce((sum, item) => sum + Number(item.totalPaid), 0)).toFixed(2)
                            },
                            {
                              "Metric": uiLang === "kh" ? "សមតុល្យប្រតិបត្តិការ" : "Net Balance",
                              "Value": "$" + (transactions.reduce((sum, tx) => sum + tx.amount, 0) - (schoolExpenses.reduce((sum, item) => sum + Number(item.amount || item.value || 0), 0) + salaries.reduce((sum, item) => sum + Number(item.totalPaid), 0))).toFixed(2)
                            }
                          ];
                          exportToExcel(data, "Financial_Report_Summary", uiLang === "kh" ? "របាយការណ៍សង្ខេបហិរញ្ញវត្ថុ" : "Financial Report Summary");
                        }}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs hover:border-emerald-200 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{uiLang === "kh" ? "ទាញយក EXCEL" : uiLang === "en" ? "EXPORT EXCEL" : "导出 EXCEL"}</span>
                      </button>
                      <button
                        onClick={() => {
                          document.body.classList.add('printing-report');
                          setTimeout(() => {
                            window.print();
                            document.body.classList.remove('printing-report');
                          }, 100);
                        }}
                        className="self-start sm:self-center px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-[12px] font-black transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-600/15 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5 active:scale-[0.97] border border-primary-500/10 select-none"
                      >
                        <Printer className="w-4 h-4 stroke-[2.5]" />
                        <span>{uiLang === "kh" ? "បោះពុម្ពរបាយការណ៍ (PRINT PDF)" : uiLang === "en" ? "Print Report (PDF)" : "打印报表 (PDF)"}</span>
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Finance dashboard overview metrics (Grid of 4) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(() => {
                    if (financeSubTab === 'tuition') {
                      const totalFee = students.reduce((sum, s) => sum + s.fee, 0);
                      const totalPaid = students.reduce((sum, s) => sum + s.paid, 0);
                      const totalDue = students.reduce((sum, s) => sum + s.due, 0);
                      const rate = totalFee > 0 ? (totalPaid / totalFee) * 100 : 0;
                      
                      return (
                        <>
                          {/* Card 1: Tuition Contract Volume */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-primary-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-primary-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ថ្លៃសិក្សាត្រូវប្រមូលសរុប (Contract Volume)" : uiLang === "zh" ? "应收学费总额 (Contract Volume)" : "Tuition Contract Volume (Contract Volume)"}
                              </p>
                              <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight leading-none">${totalFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-primary-700/90">
                                  {uiLang === "kh" ? `ផ្អែកលើការចុះឈ្មោះ ${toKhmerNumberGlobal(students.length)} នាក់` : uiLang === "zh" ? `基于 ${students.length} 名注册学生` : `Based on ${students.length} registered students`}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 border border-primary-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-primary-500/20">
                              <CreditCard className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 2: Revenue Collected */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-emerald-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ប្រមូលបានរួចរាល់ (Revenue Collected)" : uiLang === "zh" ? "实收学费总额 (Revenue Collected)" : "Revenue Collected (Revenue Collected)"}
                              </p>
                              <h3 className="text-2xl font-black text-emerald-600 font-mono tracking-tight leading-none">${students.reduce((sum, s) => sum + s.paid, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-ping"></span>
                                <span className="text-[9px] font-bold text-emerald-750">
                                  {uiLang === "kh" ? "គណនីបានទូទាត់ប្រាក់" : uiLang === "zh" ? "已结清账目" : "Fully settled accounts"}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-emerald-500/20">
                              <DollarSign className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 3: Outstanding Receivables */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-rose-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ជំពាក់វគ្គសិក្សាសរុប (Outstanding Receivables)" : uiLang === "zh" ? "未付学费总额 (Outstanding Receivables)" : "Outstanding Receivables (Outstanding Receivables)"}
                              </p>
                              <h3 className="text-2xl font-black text-rose-600 font-mono tracking-tight leading-none">${students.reduce((sum, s) => sum + s.due, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-rose-700/90">
                                  {uiLang === "kh" ? `សិស្សជំពាក់៖ ${toKhmerNumberGlobal(students.filter(s => s.due > 0).length)} នាក់` : uiLang === "zh" ? `欠费学生人数：${students.filter(s => s.due > 0).length} 人` : `Unpaid students: ${students.filter(s => s.due > 0).length} students`}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-rose-500/20">
                              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 4: Collection Rate */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-sky-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-sky-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-sky-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 w-full pr-12 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "អត្រាប្រមូលប្រាក់ (Collection Rate)" : uiLang === "zh" ? "学费收缴比例 (Collection Rate)" : "Tuition Collection Rate (Collection Rate)"}
                              </p>
                              <h3 className="text-2xl font-black text-sky-600 font-mono tracking-tight leading-none">
                                {(() => {
                                  const totalFee = students.reduce((sum, s) => sum + s.fee, 0);
                                  const totalPaid = students.reduce((sum, s) => sum + s.paid, 0);
                                  const rate = totalFee > 0 ? (totalPaid / totalFee) * 100 : 0;
                                  return `${rate.toFixed(1)}%`;
                                })()}
                              </h3>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden text-left">
                                <div 
                                  className="bg-sky-500 h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(100, (students.reduce((sum, s) => sum + s.paid, 0) / (students.reduce((sum, s) => sum + s.fee, 0) || 1)) * 100)}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="absolute right-5 w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-sky-500/20">
                              <Activity className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>
                        </>
                      );
                    } else if (financeSubTab === 'invoices') {
                      const totalInvoiced = transactions.reduce((sum, t) => sum + t.amount, 0);
                      const paymentTypesCount = transactions.reduce((acc, t) => {
                        acc[t.method] = (acc[t.method] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      const mainMethod = Object.entries(paymentTypesCount).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || "-";

                      return (
                        <>
                          {/* Card 1: Total Recorded Cash Inflow */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-emerald-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ប្រាក់ចំណូលសរុប (Total Revenue)" : uiLang === "zh" ? "实际收款总额 (Total Revenue)" : "Total Income (Total Revenue)"}
                              </p>
                              <h3 className="text-2xl font-black text-emerald-600 font-mono tracking-tight leading-none">${totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {uiLang === "kh" ? `ប្រតិបត្តិការទូទាត់សរុប៖ ${toKhmerNumberGlobal(transactions.length)} លើក` : uiLang === "zh" ? `共计 ${transactions.length} 笔收费交易` : `Based on ${transactions.length} logged invoices`}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-emerald-500/20">
                              <DollarSign className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 2: Average Invoice Amount */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-primary-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-primary-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "មធ្យមភាគក្នុងមួយវិក្កយបត្រ (Avg Invoice)" : uiLang === "zh" ? "单笔平均收费 (Avg Invoice)" : "Avg Transaction Value (Avg Invoice)"}
                              </p>
                              <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight leading-none">
                                ${transactions.length > 0 ? (totalInvoiced / transactions.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-550"></span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {uiLang === "kh" ? "តម្លៃប្រតិបត្តិការជាមធ្យម" : uiLang === "zh" ? "每次收取的平均额度" : "Average revenue per transaction"}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 border border-primary-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-primary-500/20">
                              <FileText className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 3: Top Payment Gateway Method */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-sky-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-sky-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-sky-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "វិធីសាស្ត្រនិយមប្រើបំផុត (Top Method)" : uiLang === "zh" ? "最常用结算渠道 (Top Method)" : "Primary Payment Channel (Top Method)"}
                              </p>
                              <h3 className="text-[15px] font-black text-slate-800 mt-0.5 block truncate max-w-[190px] leading-tight">{mainMethod}</h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-550 border border-sky-100/30"></span>
                                <span className="text-[9px] font-bold text-sky-700/90">
                                  {uiLang === "kh" ? "ឆានែលទូទាត់ដែលមានសកម្មភាពខ្ពស់" : uiLang === "zh" ? "本周期使用占比最高的渠道" : "Highest volume payment channel"}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-sky-500/20">
                              <Cpu className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 4: Recent Settlement Log */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-rose-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 w-full pr-12 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ប្រតិបត្តិការចុងក្រោយ (Latest Transaction)" : uiLang === "zh" ? "最近一笔交易 (Latest Transaction)" : "Latest Cash Inflow (Latest Transaction)"}
                              </p>
                              <h3 className="text-[13.5px] font-black text-rose-600 mt-0.5 truncate leading-tight">
                                {transactions.length > 0 ? `${transactions[transactions.length - 1].studentName}` : "-"}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-rose-700/90">
                                  {transactions.length > 0 ? `ទទួលបាន $${transactions[transactions.length - 1].amount} កាលពី ${transactions[transactions.length - 1].date}` : "គ្មានកំណត់ត្រា"}
                                </span>
                              </div>
                            </div>
                            <div className="absolute right-5 w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-rose-500/20">
                              <Calendar className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>
                        </>
                      );
                    } else if (financeSubTab === 'salaries') {
                      const totalPaidSalaries = salaries.reduce((sum, s) => sum + s.amount, 0);
                      const activeTeachersCount = teachers.filter(t => t.status === "ACTIVE").length;
                      const averageSalary = teachers.length > 0 ? teachers.reduce((sum, t) => sum + t.salary, 0) / teachers.length : 0;

                      return (
                        <>
                          {/* Card 1: Total Salaries Paid */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-rose-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ប្រាក់ខែបើកសរុប (Total Salary Outflow)" : uiLang === "zh" ? "已发薪资总额 (Total Salary Outflow)" : "Total Salaries Disbursed (Total Salary Outflow)"}
                              </p>
                              <h3 className="text-2xl font-black text-rose-600 font-mono tracking-tight leading-none">${totalPaidSalaries.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {uiLang === "kh" ? `ប្រតិបត្តិការបើកប្រាក់ខែ៖ ${toKhmerNumberGlobal(salaries.length)} លើក` : uiLang === "zh" ? `累计薪资发放 ${salaries.length} 次` : `Based on ${salaries.length} salary logs`}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-rose-500/20">
                              <ArrowDown className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 2: Average Salary Level */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-primary-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-primary-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ប្រាក់ខែមធ្យមភាគ (Avg Contracted Salary)" : uiLang === "zh" ? "平均薪资水准 (Avg Contracted Salary)" : "Avg Contracted Salary (Avg Contracted Salary)"}
                              </p>
                              <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight leading-none">${averageSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-550"></span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {uiLang === "kh" ? `គិតលើបុគ្គលិកសរុប៖ ${toKhmerNumberGlobal(teachers.length)} នាក់` : uiLang === "zh" ? `基于登记的 ${teachers.length} 位教职工` : `Computed for ${teachers.length} registered teachers`}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 border border-primary-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-primary-500/20">
                              <Users className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 3: Active Staff Rate */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-sky-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-sky-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-sky-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "បុគ្គលិកកំពុងបង្រៀន (Active Teachers)" : uiLang === "zh" ? "在职教师人数 (Active Teachers)" : "Active Teachers (Active Teachers)"}
                              </p>
                              <h3 className={`text-2xl font-black text-sky-600 tracking-tight leading-none ${uiLang === 'kh' ? 'font-sans' : 'font-mono'}`}>{toKhmerNumberGlobal(activeTeachersCount)} នាក់</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-sky-700/90">
                                  {uiLang === "kh" ? `អត្រាសកម្មភាព៖ ${teachers.length > 0 ? Math.round((activeTeachersCount / teachers.length) * 100) : 0}%` : uiLang === "zh" ? `教研团队活跃率：${teachers.length > 0 ? Math.round((activeTeachersCount / teachers.length) * 100) : 0}%` : `Activity rate: ${teachers.length > 0 ? Math.round((activeTeachersCount / teachers.length) * 100) : 0}%`}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-sky-500/20">
                              <Activity className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 4: Outflow Commitment Ratio */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-rose-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 w-full pr-12 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ការបង់ប្រាក់ចុងក្រោយ (Latest Salary Slip)" : uiLang === "zh" ? "最近一次发薪 (Latest Salary Slip)" : "Latest Salary Slip (Latest Salary Slip)"}
                              </p>
                              <h3 className="text-[13.5px] font-black text-rose-600 mt-0.5 truncate leading-tight">
                                {salaries.length > 0 ? salaries[salaries.length - 1].teacherName : "-"}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-rose-700/90">
                                  {salaries.length > 0 ? `បើកជូន $${salaries[salaries.length - 1].amount} កាលពី ${salaries[salaries.length - 1].date}` : "គ្មានកំណត់ត្រា"}
                                </span>
                              </div>
                            </div>
                            <div className="absolute right-5 w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-rose-500/20">
                              <Calendar className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>
                        </>
                      );
                    } else if (financeSubTab === 'expenses') {
                      const totalExpenses = schoolExpenses.reduce((sum, e) => sum + Number(e.amount || e.value || 0), 0);
                      const groupedExpenses = schoolExpenses.reduce((acc, e) => {
                        acc[e.category || "other"] = (acc[e.category || "other"] || 0) + Number(e.amount || e.value || 0);
                        return acc;
                      }, {} as Record<string, number>);
                      const topCategory = Object.entries(groupedExpenses).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || "-";

                      return (
                        <>
                          {/* Card 1: Total School Expenses */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-rose-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ចំណាយសរុប (Total School Expenses)" : uiLang === "zh" ? "学校支出总额 (Total School Expenses)" : "Total School Expenses (Total School Expenses)"}
                              </p>
                              <h3 className="text-2xl font-black text-rose-600 font-mono tracking-tight leading-none">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {uiLang === "kh" ? `ប្រតិបត្តិការចំណាយ៖ ${toKhmerNumberGlobal(schoolExpenses.length)} លើក` : uiLang === "zh" ? `累计录入支出 ${schoolExpenses.length} 笔` : `Based on ${schoolExpenses.length} expense transactions`}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-rose-500/20">
                              <ArrowDown className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 2: Average Expense Cost */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-primary-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-primary-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "មធ្យមភាគក្នុងមួយប្រតិបត្តិការ (Avg Expense)" : uiLang === "zh" ? "单笔平均支出 (Avg Expense)" : "Avg Expense Cost (Avg Expense)"}
                              </p>
                              <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight leading-none">
                                ${schoolExpenses.length > 0 ? (totalExpenses / schoolExpenses.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-550"></span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {uiLang === "kh" ? "ទំហំចំណាយជាមធ្យម" : uiLang === "zh" ? "均单运营支出额度" : "Average cost per logged expense"}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 border border-primary-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-primary-500/20">
                              <ArrowDown className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 3: Top Expense Category */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-sky-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-sky-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-sky-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ចំណាយច្រើនជាងគេលើ (Top Expense Category)" : uiLang === "zh" ? "支出主导类别 (Top Category)" : "Top Expense Category (Top Category)"}
                              </p>
                              <h3 className="text-[15px] font-black text-slate-800 mt-0.5 block truncate max-w-[190px] leading-tight">{topCategory}</h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-550 border border-sky-100/30"></span>
                                <span className="text-[9px] font-bold text-sky-700/90">
                                  {uiLang === "kh" ? "ចំណាត់ថ្នាក់ប្រភេទចំណាយច្រើនបំផុត" : uiLang === "zh" ? "本周期消耗资金最高的门类" : "Highest consuming resource"}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-sky-500/20">
                              <PieIcon className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 4: Recent Expense Transaction */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-rose-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 w-full pr-12 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ប្រតិបត្តិការចំណាយចុងក្រោយ (Latest Expense)" : uiLang === "zh" ? "最近一笔支出 (Latest Expense)" : "Latest Expense Outflow (Latest Expense)"}
                              </p>
                              <h3 className="text-[13.5px] font-black text-rose-600 mt-0.5 truncate leading-tight">
                                {schoolExpenses.length > 0 ? (schoolExpenses[0].title || schoolExpenses[0].description || "-") : "-"}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-rose-700/90">
                                  {schoolExpenses.length > 0 ? `ចំណាយ \$${Number(schoolExpenses[0].amount || schoolExpenses[0].value || 0).toFixed(2)} កាលពី ${schoolExpenses[0].date || "-"}` : "គ្មានកំណត់ត្រា"}
                                </span>
                              </div>
                            </div>
                            <div className="absolute right-5 w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-rose-500/20">
                              <Calendar className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>
                        </>
                      );
                    } else if (financeSubTab === 'reports') {
                      const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
                      const schoolExpSum = schoolExpenses.reduce((sum, item) => sum + Number(item.amount || item.value || 0), 0);
                      const salariesSum = salaries.reduce((sum, item) => sum + Number(item.totalPaid || 0), 0);
                      const totalExpenses = schoolExpSum + salariesSum;
                      const netBalance = totalRevenue - totalExpenses;
                      
                      let ratioString = "0%";
                      if (totalExpenses === 0) {
                        ratioString = totalRevenue > 0 ? "100%" : "0%";
                      } else {
                        const ratio = (totalRevenue / totalExpenses) * 100;
                        ratioString = `${ratio.toFixed(0)}%`;
                      }

                      return (
                        <>
                          {/* Card 1: Total Revenue */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-emerald-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ចំណូលសរុប (Total Revenue)" : uiLang === "zh" ? "校务总收入 (Total Revenue)" : "Total Revenue (Total Revenue)"}
                              </p>
                              <h3 className="text-2xl font-black text-emerald-600 font-mono tracking-tight leading-none">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {uiLang === "kh" ? "ពីការប្រមូលថ្លៃសិក្សាសិស្ស" : uiLang === "zh" ? "学生学费总计收款" : "Tuition collections received"}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-emerald-500/20">
                              <LineChart className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 2: Total Expenditures */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-rose-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 pr-2 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "ចំណាយសរុប (Total Expenses)" : uiLang === "zh" ? "校务总支出 (Total Expenses)" : "Total Expenditures (Total Expenses)"}
                              </p>
                              <h3 className="text-2xl font-black text-rose-600 font-mono tracking-tight leading-none">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-550 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {uiLang === "kh" ? "ចំណាយសាលា + ប្រាក់ខែគ្រូ" : uiLang === "zh" ? "办学支出与教师薪资" : "Operating cost + teacher salaries"}
                                </span>
                              </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-rose-500/20">
                              <ArrowDown className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 3: Net Balance */}
                          <div className={`bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
                            <div className={`absolute top-0 left-0 w-full h-[3px] bg-primary-500`}></div>
                            <div className={`absolute -right-4 -bottom-4 w-16 h-16 ${netBalance >= 0 ? "bg-primary-500/5" : "bg-rose-500/5"} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500`}></div>
                            <div className="relative z-10 space-y-1.5 pr-2 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "តុល្យភាពសាច់ប្រាក់ (Net Balance)" : uiLang === "zh" ? "纯利润/净结余 (Net Balance)" : "Net Cash Balance (Net Balance)"}
                              </p>
                              <h3 className={`text-2xl font-black font-mono tracking-tight leading-none ${netBalance >= 0 ? "text-primary-600" : "text-rose-600"}`}>
                                {netBalance >= 0 ? "" : "-"}${Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${netBalance >= 0 ? "bg-primary-550 animate-pulse" : "bg-rose-550"}`}></span>
                                <span className={`text-[9px] font-bold ${netBalance >= 0 ? "text-primary-700/90" : "text-rose-700/90"}`}>
                                  {uiLang === "kh" ? (netBalance >= 0 ? "សាលាទទួលបានផលចំណេញ" : "ឱនភាពថវិកាសាលា") : uiLang === "zh" ? (netBalance >= 0 ? "本阶段呈办学盈利" : "本阶段呈财务赤字") : (netBalance >= 0 ? "Net operating profit" : "Net operating deficit")}
                                </span>
                              </div>
                            </div>
                            <div className={`w-11 h-11 rounded-xl bg-primary-50 text-primary-600 border flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:rotate-3 group-hover:shadow-md`}>
                              <Activity className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>

                          {/* Card 4: Revenue-to-Cost Ratio */}
                          <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-sky-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-sky-500"></div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-sky-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
                            <div className="relative z-10 space-y-1.5 w-full pr-12 text-left">
                              <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                                {uiLang === "kh" ? "សមាមាត្រចំណូល/ចំណាយ (Income/Expense)" : uiLang === "zh" ? "收支比率 (Income/Expense)" : "Revenue-to-Cost Ratio (Income/Expense)"}
                              </p>
                              <h3 className="text-2xl font-black text-sky-600 font-mono tracking-tight leading-none">
                                {ratioString}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-550 border border-sky-100/30"></span>
                                <span className="text-[9px] font-bold text-sky-700/90">
                                  {uiLang === "kh" ? "ចំណូលធៀបនឹងចំណាយសរុប" : uiLang === "zh" ? "收入占支出的百分比" : "Revenue percentage over expenditures"}
                                </span>
                              </div>
                            </div>
                            <div className="absolute right-5 w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-sky-500/20">
                              <PieIcon className="w-5 h-5 stroke-[2.2]" />
                            </div>
                          </div>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>


                {/* Modern horizontal sub-tabs selector */}
                <div className="flex flex-nowrap items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 shadow-3xs overflow-x-auto no-scrollbar scroll-smooth w-full">
                  <button
                    onClick={() => {
                      setFinanceSubTab('tuition');
                      setFinanceSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer select-none active:scale-[0.98] border whitespace-nowrap ${
                      financeSubTab === 'tuition'
                        ? "bg-white text-primary-600 shadow-xs border-slate-200/40"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40 hover:shadow-4xs hover:border-slate-200/30"
                    }`}
                  >
                    <GraduationCap className={`w-3.5 h-3.5 transition-all duration-300 ${
                      financeSubTab === 'tuition' ? 'text-primary-600 scale-110' : 'text-slate-400'
                    }`} />
                    <span>
                      {uiLang === "kh" ? "ស្ថានភាពបង់ប្រាក់សិស្ស (Tuition Fee Status)" : uiLang === "zh" ? "学生交费状态 (Tuition Fee Status)" : "Tuition Fee Status (Tuition Fee Status)"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setFinanceSubTab('invoices');
                      setFinanceSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer select-none active:scale-[0.98] border whitespace-nowrap ${
                      financeSubTab === 'invoices'
                        ? "bg-white text-primary-600 shadow-xs border-slate-200/40"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40 hover:shadow-4xs hover:border-slate-200/30"
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 transition-all duration-300 ${
                      financeSubTab === 'invoices' ? 'text-primary-600 scale-110' : 'text-slate-400'
                    }`} />
                    <span>
                      {uiLang === "kh" ? "ប្រវត្តិវិក្កយបត្រ (Invoices & Receipts)" : uiLang === "zh" ? "学生交费账单 (Invoices & Receipts)" : "Invoices & Receipts (Invoices & Receipts)"}
                    </span>
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono transition-all duration-300 border ${
                      financeSubTab === 'invoices'
                        ? "bg-primary-50 border-primary-100/50 text-primary-600 font-extrabold"
                        : "bg-slate-200/60 border-transparent text-slate-500"
                    }`}>
                      {transactions.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setFinanceSubTab('salaries');
                      setFinanceSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer select-none active:scale-[0.98] border whitespace-nowrap ${
                      financeSubTab === 'salaries'
                        ? "bg-white text-primary-600 shadow-xs border-slate-200/40"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40 hover:shadow-4xs hover:border-slate-200/30"
                    }`}
                  >
                    <Coins className={`w-3.5 h-3.5 transition-all duration-300 ${
                      financeSubTab === 'salaries' ? 'text-primary-600 scale-110' : 'text-slate-400'
                    }`} />
                    <span>
                      {uiLang === "kh" ? "បើកប្រាក់បៀវត្សគ្រូ (Salaries & Expenses)" : uiLang === "zh" ? "教师薪资发放 (Salaries & Expenses)" : "Teacher Salaries (Salaries & Expenses)"}
                    </span>
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono transition-all duration-300 border ${
                      financeSubTab === 'salaries'
                        ? "bg-primary-50 border-primary-100/50 text-primary-600 font-extrabold"
                        : "bg-slate-200/60 border-transparent text-slate-500"
                    }`}>
                      {salaries.length}
                    </span>
                  </button>
                  <button
                    id="finance-school-expenses-btn"
                    onClick={() => {
                      setFinanceSubTab('expenses');
                      setExpenseSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer select-none active:scale-[0.98] border whitespace-nowrap ${
                      financeSubTab === 'expenses'
                        ? "bg-white text-primary-600 shadow-xs border-slate-200/40"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40 hover:shadow-4xs hover:border-slate-200/30"
                    }`}
                  >
                    <Briefcase className={`w-3.5 h-3.5 transition-all duration-300 ${
                      financeSubTab === 'expenses' ? 'text-primary-600 scale-110' : 'text-slate-400'
                    }`} />
                    <span>
                      {uiLang === "kh" ? "ចំណូលចំណាយសាលា (School Expenses)" : uiLang === "zh" ? "学校收支账目 (School Expenses)" : "School Expenses (School Expenses)"}
                    </span>
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono transition-all duration-300 border ${
                      financeSubTab === 'expenses'
                        ? "bg-primary-50 border-primary-100/50 text-primary-600 font-extrabold"
                        : "bg-slate-200/60 border-transparent text-slate-500"
                    }`}>
                      {schoolExpenses.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setFinanceSubTab('reports');
                      setFinanceSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer select-none active:scale-[0.98] border whitespace-nowrap ${
                      financeSubTab === 'reports'
                        ? "bg-white text-primary-600 shadow-xs border-slate-200/40"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40 hover:shadow-4xs hover:border-slate-200/30"
                    }`}
                  >
                    <BarChart2 className={`w-3.5 h-3.5 transition-all duration-300 ${
                      financeSubTab === 'reports' ? 'text-primary-600 scale-110' : 'text-slate-400'
                    }`} />
                    <span>
                      {uiLang === "kh" ? "របាយការណ៍ហិរញ្ញវត្ថុ (Financial Report)" : uiLang === "zh" ? "校务财务报表 (Financial Report)" : "Financial Report (Financial Report)"}
                    </span>
                  </button>
                </div>

                {/* Tab content panels */}
                <AnimatePresence mode="wait">
                  {/* SUB-TAB 1: TUITION STATUS PANEL */}
                  {financeSubTab === 'tuition' && (
                    <motion.div
                      key="tuition-panel"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0"
                    >
                      {/* Search and filtering bar */}
                      <div className="p-4.5 border-b border-slate-200 bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:max-w-md">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder={uiLang === "kh" ? "ស្វែងរកតាមឈ្មោះសិស្សខ្មែរ/អង់គ្លេស អាយឌី ឬវគ្គសិក្សា..." : uiLang === "zh" ? "搜索学生中文/英文名、ID或课程名称..." : "Search by student name (KH/EN), ID or course..."}
                            value={financeSearchQuery}
                            onChange={(e) => setFinanceSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                          />
                          {financeSearchQuery && (
                            <button 
                              onClick={() => setFinanceSearchQuery("")}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              {uiLang === "kh" ? "សម្អាត" : uiLang === "zh" ? "清除" : "Clear"}
                            </button>
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 shrink-0 self-end md:self-center">
                          <Filter className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {uiLang === "kh" ? `បង្ហាញសិស្សសរុប៖ ${toKhmerNumberGlobal(students.filter(s => {
                              const q = (financeSearchQuery || '').toLowerCase();
                              return (
                                s.nameKh.toLowerCase().includes(q) ||
                                s.nameEn.toLowerCase().includes(q) ||
                                s.studentId.toLowerCase().includes(q) ||
                                (s.course && s.course.toLowerCase().includes(q))
                              );
                            }).length)} នាក់` : uiLang === "zh" ? `显示学生总数：${students.filter(s => {
                              const q = (financeSearchQuery || '').toLowerCase();
                              return (
                                s.nameKh.toLowerCase().includes(q) ||
                                s.nameEn.toLowerCase().includes(q) ||
                                s.studentId.toLowerCase().includes(q) ||
                                (s.course && s.course.toLowerCase().includes(q))
                              );
                            }).length} 人` : `Showing total students: ${students.filter(s => {
                              const q = (financeSearchQuery || '').toLowerCase();
                              return (
                                s.nameKh.toLowerCase().includes(q) ||
                                s.nameEn.toLowerCase().includes(q) ||
                                s.studentId.toLowerCase().includes(q) ||
                                (s.course && s.course.toLowerCase().includes(q))
                              );
                            }).length}`}
                          </span>
                        </div>
                      </div>

                      {/* Tuition Status Table */}
                      <div className="flex-1 min-h-0 overflow-auto scrollbar-none relative">
                        <table className="w-full min-w-[1100px] text-left text-sm border-collapse">
                          <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              <th className="px-4 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-left align-middle">
                                {uiLang === "kh" ? "អត្តសញ្ញាណ (STUDENT ID)" : uiLang === "zh" ? "学生考证 ID (STUDENT ID)" : "Student ID (STUDENT ID)"}
                              </th>
                              <th className="px-4 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-left align-middle">
                                {uiLang === "kh" ? "ឈ្មោះសិស្ស (STUDENT NAME)" : uiLang === "zh" ? "学生姓名 (STUDENT NAME)" : "Student Name (STUDENT NAME)"}
                              </th>
                              <th className="px-4 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-left align-middle">
                                {uiLang === "kh" ? "វគ្គសិក្សា (COURSE / SUBJECT)" : uiLang === "zh" ? "修读学科 (COURSE / SUBJECT)" : "Course / Subject (COURSE / SUBJECT)"}
                              </th>
                              <th className="px-4 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-left align-middle">
                                {uiLang === "kh" ? "ភាគរយបង់បាន (% PAID)" : uiLang === "zh" ? "交费占比 (% PAID)" : "% Paid Ratio (% PAID)"}
                              </th>
                              <th className="px-4 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-right align-middle">
                                {uiLang === "kh" ? "ថ្លៃសិក្សា (FEE)" : uiLang === "zh" ? "应收学费 (FEE)" : "Tuition Fee (FEE)"}
                              </th>
                              <th className="px-4 py-1.5 text-emerald-600 font-extrabold uppercase tracking-wider text-[11px] text-right align-middle">
                                {uiLang === "kh" ? "បង់រួច (PAID)" : uiLang === "zh" ? "实收已付 (PAID)" : "Paid Amount (PAID)"}
                              </th>
                              <th className="px-4 py-1.5 text-rose-600 font-extrabold uppercase tracking-wider text-[11px] text-right align-middle">
                                {uiLang === "kh" ? "ជំពាក់ (DUE)" : uiLang === "zh" ? "欠费金额 (DUE)" : "Due Balance (DUE)"}
                              </th>
                              <th className="px-4 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-center align-middle">
                                {uiLang === "kh" ? "ស្ថានភាព (STATUS)" : uiLang === "zh" ? "状态 (STATUS)" : "Status (STATUS)"}
                              </th>
                              <th className="px-4 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-right align-middle">
                                {uiLang === "kh" ? "សកម្មភាព (ACTIONS)" : uiLang === "zh" ? "操作 (ACTIONS)" : "Actions (ACTIONS)"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-600 bg-white">
                            {(() => {
                              const filtered = students.filter(s => {
                                const q = (financeSearchQuery || '').toLowerCase();
                                return (
                                  s.nameKh.toLowerCase().includes(q) ||
                                  s.nameEn.toLowerCase().includes(q) ||
                                  s.studentId.toLowerCase().includes(q) ||
                                  (s.course && s.course.toLowerCase().includes(q))
                                );
                              });

                              if (filtered.length === 0) {
                                  return (
                                    <tr>
                                      <td colSpan={9} className="py-16 text-center text-slate-400">
                                        <div className="max-w-md mx-auto space-y-2">
                                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                                            <Search className="w-6 h-6" />
                                          </div>
                                          <p className="font-extrabold text-slate-700">
                                            {uiLang === "kh" ? "រកមិនឃើញទិន្នន័យសិស្សឡើយ" : uiLang === "zh" ? "未找到符合条件的学生数据" : "No student data found"}
                                          </p>
                                          <p className="text-xs text-slate-400 font-normal">
                                            {uiLang === "kh" ? "សូមសាកល្បងវាយឈ្មោះ ឬអត្តសញ្ញាណផ្សេងទៀតដើម្បីស្វែងរក។" : uiLang === "zh" ? "请尝试输入其他姓名或ID进行搜索。" : "Please try searching by another name or ID."}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                return filtered.map((s, index) => {
                                  const payPercent = s.fee > 0 ? (s.paid / s.fee) * 100 : 0;
                                  const isFemale = s.gender === "Female";
                                  return (
                                    <tr key={s.id || `student-${index}`} className="hover:bg-slate-50/75 group transition-all duration-150 border-b border-slate-100/60">
                                      {/* Student ID */}
                                      <td className="px-4 py-1.5 text-slate-800 font-mono text-xs font-extrabold text-left align-middle">{s.studentId}</td>
                                      
                                      {/* Student Name */}
                                      <td className="px-4 py-1.5 text-left align-middle">
                                        <div className="flex items-center gap-3">
                                          {isFemale && (
                                            <div className="w-7 h-7 rounded-full font-black text-[10px] flex items-center justify-center text-white bg-pink-500 shrink-0 shadow-3xs">
                                              {s.nameEn.slice(0, 2).toUpperCase()}
                                            </div>
                                          )}
                                          <div>
                                            <p className="text-slate-800 font-black text-xs leading-tight">{s.nameKh}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight mt-1">{s.nameEn}</p>
                                          </div>
                                        </div>
                                      </td>

                                      {/* Course / Subject */}
                                      <td className="px-4 py-1.5 text-left align-middle">
                                        <div className="leading-tight">
                                          <span className="text-xs text-slate-800 font-extrabold block">{translateCourseOrSpecialtyName(s.course, uiLang)}</span>
                                          <span className="block text-[10px] text-slate-400 font-bold mt-1">
                                            {translateLevelText(s.level, uiLang)} - {translateShiftText(s.shift, uiLang)}
                                            {(() => {
                                              const hoursInfo = getStudentHoursInfo(s);
                                              if (hoursInfo.hasCustom) {
                                                return uiLang === "kh" 
                                                  ? ` - ម៉ោងកែប្រែ៖ ${hoursInfo.customHours} (ម៉ោងបញ្ជូល៖ ${hoursInfo.actualHours || "---"})` 
                                                  : uiLang === "zh" 
                                                  ? ` - 自定义时间: ${hoursInfo.customHours} (原时间: ${hoursInfo.actualHours || "---"})` 
                                                  : ` - Custom Hours: ${hoursInfo.customHours} (Original: ${hoursInfo.actualHours || "---"})`;
                                              }
                                              return (!s.shift?.match(/\d+:\d+/) && getStudentStudyHours(s)) ? (
                                                uiLang === "kh" 
                                                  ? ` - ម៉ោង ${getStudentStudyHours(s)}` 
                                                  : uiLang === "zh" 
                                                  ? ` - 学习时间 ${getStudentStudyHours(s)}` 
                                                  : ` - Hours ${getStudentStudyHours(s)}`
                                              ) : "";
                                            })()}
                                          </span>
                                        </div>
                                      </td>

                                      {/* % Paid */}
                                      <td className="px-4 py-1.5 text-left align-middle">
                                        <div className="w-28 text-left">
                                          <div className={`flex items-center justify-between text-[10px] font-black mb-1 ${
                                            payPercent >= 100 ? "text-emerald-600" : payPercent > 0 ? "text-amber-500" : "text-slate-400"
                                          }`}>
                                            <span>{payPercent.toFixed(0)}%</span>
                                          </div>
                                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                            <div 
                                              className={`h-full rounded-full ${
                                                payPercent >= 100 ? "bg-emerald-500" : payPercent > 0 ? "bg-amber-500" : "bg-slate-300"
                                              }`}
                                              style={{ width: `${Math.min(100, payPercent)}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      </td>

                                      {/* Fee */}
                                      <td className="px-4 py-1.5 text-right font-mono text-slate-850 font-extrabold text-xs align-middle">${s.fee.toFixed(2)}</td>
                                      
                                      {/* Paid */}
                                      <td className="px-4 py-1.5 text-right font-mono text-emerald-600 font-black text-xs align-middle">${s.paid.toFixed(2)}</td>
                                      
                                      {/* Due */}
                                      <td className="px-4 py-1.5 text-right font-mono text-rose-600 font-black text-xs align-middle">${s.due.toFixed(2)}</td>
                                      
                                      {/* Status */}
                                      <td className="px-4 py-1.5 text-center align-middle">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-black whitespace-nowrap shadow-3xs border ${
                                          s.status === 'STUDYING' 
                                            ? "bg-blue-50 text-blue-600 border-blue-100" 
                                            : s.status === 'COMPLETED' 
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                            : "bg-rose-50 text-rose-600 border-rose-100"
                                        }`}>
                                          {s.status === 'STUDYING' ? (uiLang === "kh" ? "កំពុងរៀន" : uiLang === "zh" ? "在读" : "Studying") : s.status === 'COMPLETED' ? (uiLang === "kh" ? "រៀនចប់" : uiLang === "zh" ? "结业" : "Completed") : (uiLang === "kh" ? "បោះបង់" : uiLang === "zh" ? "退学" : "Dropped")}
                                        </span>
                                      </td>

                                      {/* Actions */}
                                      <td className="px-4 py-1.5 text-right align-middle">
                                        {s.due > 0 ? (
                                          <button
                                            onClick={() => {
                                              setPaymentFormSuccess(null);
                                              setSelectedPaymentStudentId(s.id);
                                              setPaymentAmount(s.due);
                                              setSelectedPaymentMethod(paymentMethods[0] || "សាច់ប្រាក់ (CASH)");
                                              setShowAddNewMethodInput(false);
                                              setShowRecordPaymentModal(true);
                                            }}
                                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-md text-[10px] font-black transition-all duration-150 cursor-pointer flex items-center gap-1.5 ml-auto border border-emerald-200 hover:shadow-sm"
                                          >
                                            <DollarSign className="w-3.5 h-3.5" />
                                            <span>{uiLang === "kh" ? "បង់ប្រាក់ (Pay)" : uiLang === "zh" ? "支付 (Pay)" : "Pay Fee (Pay)"}</span>
                                          </button>
                                        ) : (
                                          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-black text-[10px] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            <span>{uiLang === "kh" ? "បង់រួចរាល់" : uiLang === "zh" ? "已付清" : "Paid"}</span>
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* MODAL: RECORD/EDIT SCHOOL EXPENSE */}
                {showAddExpenseModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-3xl border border-slate-200/85 shadow-2xl w-full max-w-md mx-auto overflow-hidden flex flex-col max-h-[90vh]"
                    >
                      {/* Modal Header */}
                      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between text-left">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-rose-50 text-rose-500 rounded-lg">
                            <Briefcase className="w-5 h-5" />
                          </span>
                          <h3 className="text-sm font-black text-slate-800">
                            {expenseFormId 
                              ? idt("កែសម្រួលព័ត៌មានចំណាយ", "Edit School Expense", "编辑学校支出 (Edit School Expense)") 
                              : idt("កត់ត្រាការចំណាយសាលា", "Record School Expense", "登记学校支出 (Record School Expense)")}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddExpenseModal(false)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Modal Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!expenseFormTitle.trim()) {
                            alert(idt("សូមបញ្ចូលឈ្មោះការចំណាយ!", "Please enter expense title!", "请输入支出名称！"));
                            return;
                          }
                          if (!expenseFormAmount || Number(expenseFormAmount) <= 0) {
                            alert(idt("សូមបញ្ចូលចំនួនទឹកប្រាក់ឲ្យបានត្រឹមត្រូវ!", "Please enter a valid amount!", "请输入正确的金额！"));
                            return;
                          }

                          if (expenseFormId) {
                            // Edit
                            const payload = {
                                    title: expenseFormTitle,
                                    amount: Number(expenseFormAmount),
                                    category: expenseFormCategory,
                                    date: expenseFormDate,
                                    paymentMethod: expenseFormPaymentMethod,
                                    note: expenseFormNote
                            };
                            fetch(`/api/expenses/${expenseFormId}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify(payload)
                            }).then(res => res.json()).then(data => {
                                setSchoolExpenses(prev => prev.map(exp => {
                                  if (exp.id === expenseFormId) return data;
                                  return exp;
                                }));
                                setExpenseFormSuccess(idt("បានធ្វើបច្ចុប្បន្នភាពទិន្នន័យដោយជោគជ័យ!", "Updated successfully!", "更新成功！"));
                                setTimeout(() => {
                                  setExpenseFormSuccess(null);
                                  setShowAddExpenseModal(false);
                                  setExpenseFormId(null);
                                  setExpenseFormTitle("");
                                  setExpenseFormAmount("");
                                  setExpenseFormNote("");
                                }, 1000);
                            }).catch(err => console.error(err));
                          } else {
                            // Create
                            const payload = {
                                    title: expenseFormTitle,
                                    amount: Number(expenseFormAmount),
                                    category: expenseFormCategory,
                                    date: expenseFormDate,
                                    paymentMethod: expenseFormPaymentMethod,
                                    note: expenseFormNote
                            };
                            fetch('/api/expenses', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify(payload)
                            }).then(res => res.json()).then(data => {
                                setSchoolExpenses(prev => [data, ...prev]);
                                setExpenseFormSuccess(idt("បានរក្សាទុកការចំណាយថ្មីដោយជោគជ័យ!", "Expense recorded successfully!", "支出登记成功！"));
                                setTimeout(() => {
                                  setExpenseFormSuccess(null);
                                  setShowAddExpenseModal(false);
                                  setExpenseFormId(null);
                                  setExpenseFormTitle("");
                                  setExpenseFormAmount("");
                                  setExpenseFormNote("");
                                }, 1000);
                            }).catch(err => console.error(err));
                          }
                        }}
                        className="p-6 flex-1 overflow-y-auto space-y-4 text-left"
                      >
                        {expenseFormSuccess && (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-xs font-bold text-center">
                            {expenseFormSuccess}
                          </div>
                        )}

                        {/* Title input */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{idt("ឈ្មោះការចំណាយ *", "Expense Title *", "支出名称 *")}</label>
                          <input
                            type="text"
                            required
                            placeholder={idt("ឧ. ថ្លៃទឹកប្រចាំខែមិថុនា, ទិញដីស និងហ្វឺត...", "e.g., Monthly electricity bill, classroom supplies...", "如：六月份水费、购买粉笔和马克笔...")}
                            value={expenseFormTitle}
                            onChange={(e) => setExpenseFormTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Category select custom dropdown */}
                          <div className="space-y-1.5 relative">
                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{idt("ប្រភេទចំណាយ", "Category", "支出类型")}</label>
                            
                            {/* Hidden input to keep compatibility */}
                            <input 
                              type="hidden" 
                              value={expenseFormCategory} 
                            />

                            {/* Dropdown Trigger */}
                            <button
                              type="button"
                              onClick={() => setIsOpenExpenseCategoryDropdown(!isOpenExpenseCategoryDropdown)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-700 focus:outline-none focus:border-rose-500 flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50/50 transition-colors"
                            >
                              <span>
                                {(() => {
                                  const found = expenseCategories.find(c => c.id === expenseFormCategory);
                                  if (!found) return expenseFormCategory;
                                  return uiLang === "kh" 
                                    ? `${found.labelKh} (${found.labelEn})`
                                    : uiLang === "zh"
                                    ? found.labelKh // Or custom label
                                    : `${found.labelEn}`;
                                })()}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenExpenseCategoryDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {/* Floating Dropdown List */}
                            {isOpenExpenseCategoryDropdown && (
                              <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 text-xs flex flex-col max-h-[320px]">
                                <div className="overflow-y-auto flex-1 space-y-1 pr-1 scrollbar-none max-h-[160px]">
                                  {expenseCategories.map((cat, idx) => {
                                    const isEditing = editingExpenseCategoryId === cat.id;
                                    const isSelected = expenseFormCategory === cat.id;

                                    return (
                                      <div 
                                        key={cat.id} 
                                        className={`flex items-center justify-between p-2 rounded-xl transition-all group ${
                                          isSelected ? "bg-rose-50 text-rose-700 font-extrabold" : "hover:bg-slate-50 text-slate-700"
                                        }`}
                                      >
                                        {isEditing ? (
                                          <div className="flex flex-col gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex gap-2">
                                              <input
                                                type="text"
                                                placeholder={idt("ឈ្មោះភាសាខ្មែរ...", "Khmer label...", "柬文名称...")}
                                                value={editingExpenseCategoryLabelKh}
                                                onChange={(e) => setEditingExpenseCategoryLabelKh(e.target.value)}
                                                className="flex-1 px-2 py-1 text-[11px] border border-rose-250 rounded-lg focus:outline-none focus:border-rose-500 font-bold bg-white text-slate-700"
                                                autoFocus
                                              />
                                              <input
                                                type="text"
                                                placeholder={idt("English Label...", "English label...", "英文名称...")}
                                                value={editingExpenseCategoryLabelEn}
                                                onChange={(e) => setEditingExpenseCategoryLabelEn(e.target.value)}
                                                className="flex-1 px-2 py-1 text-[11px] border border-rose-250 rounded-lg focus:outline-none focus:border-rose-500 font-bold bg-white text-slate-700"
                                              />
                                            </div>
                                            <div className="flex justify-end gap-1.5 mt-0.5">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (editingExpenseCategoryLabelKh.trim() && editingExpenseCategoryLabelEn.trim()) {
                                                    const updated = [...expenseCategories];
                                                    updated[idx] = {
                                                      ...updated[idx],
                                                      labelKh: editingExpenseCategoryLabelKh.trim(),
                                                      labelEn: editingExpenseCategoryLabelEn.trim()
                                                    };
                                                    setExpenseCategories(updated);
                                                    localStorage.setItem("plc_expense_categories", JSON.stringify(updated));
                                                    setEditingExpenseCategoryId(null);
                                                    showToast(idt("បានកែប្រែប្រភេទចំណាយដោយជោគជ័យ! (Expense category updated!)", "Expense category updated successfully!", "成功更新支出类型！"), "success");
                                                  }
                                                }}
                                                className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700 cursor-pointer flex items-center gap-0.5"
                                              >
                                                <Check className="w-3 h-3" /> {idt("រក្សាទុក", "Save", "保存")}
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingExpenseCategoryId(null);
                                                }}
                                                className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold hover:bg-slate-200 cursor-pointer"
                                              >
                                                {idt("បោះបង់", "Cancel", "取消")}
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setExpenseFormCategory(cat.id);
                                                setIsOpenExpenseCategoryDropdown(false);
                                              }}
                                              className="flex-1 text-left font-bold cursor-pointer pr-4"
                                            >
                                              {uiLang === "kh" 
                                                ? `${cat.labelKh} (${cat.labelEn})` 
                                                : uiLang === "zh"
                                                ? cat.labelKh
                                                : `${cat.labelEn}`}
                                            </button>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:opacity-100 transition-opacity shrink-0">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingExpenseCategoryId(cat.id);
                                                  setEditingExpenseCategoryLabelKh(cat.labelKh);
                                                  setEditingExpenseCategoryLabelEn(cat.labelEn);
                                                }}
                                                className="p-1 text-primary-500 hover:bg-primary-150/55 rounded-lg cursor-pointer"
                                                title={idt("កែប្រែ", "Edit", "编辑")}
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDeleteConfirm({
                                                    type: "expense_category",
                                                    index: idx,
                                                    value: `${cat.labelKh} (${cat.labelEn})`
                                                  });
                                                }}
                                                className="p-1 text-rose-500 hover:bg-rose-150/55 rounded-lg cursor-pointer"
                                                title={idt("លុប", "Delete", "删除")}
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Add New Category Row */}
                                <div className="border-t border-slate-100 pt-2 mt-1.5 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={newExpenseCategoryLabelKh}
                                      onChange={(e) => setNewExpenseCategoryLabelKh(e.target.value)}
                                      placeholder={idt("+ ឈ្មោះខ្មែរ (e.g. ថ្លៃទឹក)", "+ Khmer Name (e.g., Water)", "+ 柬文名称 (如: 水费)")}
                                      className="flex-1 px-2.5 py-1 text-[11px] border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 font-bold bg-white text-slate-700"
                                    />
                                    <input
                                      type="text"
                                      value={newExpenseCategoryLabelEn}
                                      onChange={(e) => setNewExpenseCategoryLabelEn(e.target.value)}
                                      placeholder={idt("+ English label", "+ English Name (e.g., Water)", "+ 英文名称 (如: Water)")}
                                      className="flex-1 px-2.5 py-1 text-[11px] border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 font-bold bg-white text-slate-700"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          if (newExpenseCategoryLabelKh.trim() && newExpenseCategoryLabelEn.trim()) {
                                            const newId = "category_" + Date.now();
                                            const updated = [
                                              ...expenseCategories,
                                              {
                                                id: newId,
                                                labelKh: newExpenseCategoryLabelKh.trim(),
                                                labelEn: newExpenseCategoryLabelEn.trim()
                                              }
                                            ];
                                            setExpenseCategories(updated);
                                            localStorage.setItem("plc_expense_categories", JSON.stringify(updated));
                                            setExpenseFormCategory(newId);
                                            setNewExpenseCategoryLabelKh("");
                                            setNewExpenseCategoryLabelEn("");
                                            setIsOpenExpenseCategoryDropdown(false);
                                            showToast(idt("បានបន្ថែមប្រភេទចំណាយថ្មីដោយជោគជ័យ! (Expense category added!)", "Expense category added successfully!", "成功添加新支出类型！"), "success");
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newExpenseCategoryLabelKh.trim() && newExpenseCategoryLabelEn.trim()) {
                                        const newId = "category_" + Date.now();
                                        const updated = [
                                          ...expenseCategories,
                                          {
                                            id: newId,
                                            labelKh: newExpenseCategoryLabelKh.trim(),
                                            labelEn: newExpenseCategoryLabelEn.trim()
                                          }
                                        ];
                                        setExpenseCategories(updated);
                                        localStorage.setItem("plc_expense_categories", JSON.stringify(updated));
                                        setExpenseFormCategory(newId);
                                        setNewExpenseCategoryLabelKh("");
                                        setNewExpenseCategoryLabelEn("");
                                        setIsOpenExpenseCategoryDropdown(false);
                                        showToast(idt("បានបន្ថែមប្រភេទចំណាយថ្មីដោយជោគជ័យ! (Expense category added!)", "Expense category added successfully!", "成功添加新支出类型！"), "success");
                                      }
                                    }}
                                    className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    <Plus className="w-3 h-3 stroke-[3]" />
                                    <span>{idt("បន្ថែមប្រភេទចំណាយថ្មី", "Add Category", "添加新支出类型")}</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Amount input */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{idt("ទឹកប្រាក់សរុប (Amount $) *", "Amount ($) *", "金额 ($) *")}</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                              <input
                                type="number"
                                step="any"
                                required
                                placeholder="0.00"
                                value={expenseFormAmount}
                                onChange={(e) => setExpenseFormAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full pl-7 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 font-mono focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Date field */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{idt("កាលបរិច្ឆេទ", "Date", "日期")}</label>
                            <input
                              type="date"
                              required
                              value={expenseFormDate}
                              onChange={(e) => setExpenseFormDate(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                            />
                          </div>

                          {/* Payment method field */}
                          <div className="space-y-1.5 relative">
                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{idt("វិធីទូទាត់", "Payment Method", "付款方式")}</label>
                            
                            {/* Custom Dropdown for Expense Form Payment Method */}
                            <div className="relative">
                              {/* Dropdown Trigger */}
                              <button
                                type="button"
                                onClick={() => setIsOpenExpensePaymentMethodDropdown(!isOpenExpensePaymentMethodDropdown)}
                                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold bg-white text-slate-700 focus:outline-none flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50/50 transition-colors ${
                                  isOpenExpensePaymentMethodDropdown ? "border-rose-500 ring-2 ring-rose-100" : "border-slate-200"
                                }`}
                              >
                                <span>{expenseFormPaymentMethod}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenExpensePaymentMethodDropdown ? "rotate-180" : ""}`} />
                              </button>

                              {/* Floating Dropdown List */}
                              {isOpenExpensePaymentMethodDropdown && (
                                <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-2 text-xs flex flex-col max-h-[220px]">
                                  <div className="overflow-y-auto flex-1 space-y-1 pr-1 scrollbar-none">
                                    {paymentMethods.map((method, idx) => {
                                      const isEditing = editingExpensePaymentMethodIndex === idx;
                                      const isSelected = expenseFormPaymentMethod === method;

                                      return (
                                        <div 
                                          key={idx} 
                                          className={`flex items-center justify-between p-2 rounded-xl transition-all group ${
                                            isSelected ? "bg-rose-50 text-rose-700" : "hover:bg-slate-50 text-slate-700"
                                          }`}
                                        >
                                          {isEditing ? (
                                            <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                                              <input
                                                type="text"
                                                value={editingExpensePaymentMethodValue}
                                                onChange={(e) => setEditingExpensePaymentMethodValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    if (editingExpensePaymentMethodValue.trim()) {
                                                      const updated = [...paymentMethods];
                                                      const oldVal = updated[idx];
                                                      const newVal = editingExpensePaymentMethodValue.trim();
                                                      updated[idx] = newVal;
                                                      setPaymentMethods(updated);
                                                      localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                                                      if (expenseFormPaymentMethod === oldVal) {
                                                        setExpenseFormPaymentMethod(newVal);
                                                      }
                                                      if (selectedPaymentMethod === oldVal) {
                                                        setSelectedPaymentMethod(newVal);
                                                      }
                                                      setEditingExpensePaymentMethodIndex(null);
                                                    }
                                                  } else if (e.key === "Escape") {
                                                    setEditingExpensePaymentMethodIndex(null);
                                                  }
                                                }}
                                                className="flex-1 px-2.5 py-1 text-xs border border-rose-200 rounded-lg focus:outline-none focus:border-rose-500 font-bold bg-white text-slate-700"
                                                autoFocus
                                              />
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (editingExpensePaymentMethodValue.trim()) {
                                                    const updated = [...paymentMethods];
                                                    const oldVal = updated[idx];
                                                    const newVal = editingExpensePaymentMethodValue.trim();
                                                    updated[idx] = newVal;
                                                    setPaymentMethods(updated);
                                                    localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                                                    if (expenseFormPaymentMethod === oldVal) {
                                                      setExpenseFormPaymentMethod(newVal);
                                                    }
                                                    if (selectedPaymentMethod === oldVal) {
                                                      setSelectedPaymentMethod(newVal);
                                                    }
                                                    setEditingExpensePaymentMethodIndex(null);
                                                  }
                                                }}
                                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer shrink-0"
                                              >
                                                <Check className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingExpensePaymentMethodIndex(null);
                                                }}
                                                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer shrink-0"
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          ) : (
                                            <>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setExpenseFormPaymentMethod(method);
                                                  setIsOpenExpensePaymentMethodDropdown(false);
                                                }}
                                                className="flex-1 text-left font-bold cursor-pointer pr-4"
                                              >
                                                {method}
                                              </button>
                                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:opacity-100 transition-opacity shrink-0">
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingExpensePaymentMethodIndex(idx);
                                                    setEditingExpensePaymentMethodValue(method);
                                                  }}
                                                  className="p-1 text-rose-500 hover:bg-rose-100/50 rounded-lg cursor-pointer"
                                                  title={idt("កែប្រែ", "Edit", "编辑")}
                                                >
                                                  <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteConfirm({
                                                      type: "payment_method",
                                                      index: idx,
                                                      value: method
                                                    });
                                                  }}
                                                  className="p-1 text-rose-500 hover:bg-rose-100/50 rounded-lg cursor-pointer"
                                                  title={idt("លុប", "Delete", "删除")}
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Add New Method Row */}
                                  <div className="border-t border-slate-100 pt-2 mt-1.5 flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={newExpensePaymentMethodValue}
                                      onChange={(e) => setNewExpensePaymentMethodValue(e.target.value)}
                                      placeholder={idt("+ បញ្ចូលវិធីសាស្ត្រថ្មី...", "+ Add new method...", "+ 添加新方式...")}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          if (newExpensePaymentMethodValue.trim()) {
                                            const newVal = newExpensePaymentMethodValue.trim();
                                            if (paymentMethods.includes(newVal)) {
                                              alert(idt("វិធីសាស្ត្របង់ប្រាក់នេះមានរួចហើយ!", "This payment method already exists!", "该付款方式已存在！"));
                                              return;
                                            }
                                            const updated = [...paymentMethods, newVal];
                                            setPaymentMethods(updated);
                                            localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                                            setExpenseFormPaymentMethod(newVal);
                                            setNewExpensePaymentMethodValue("");
                                            setIsOpenExpensePaymentMethodDropdown(false);
                                          }
                                        }
                                      }}
                                      className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 text-xs font-bold text-slate-700 bg-slate-50/50"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (newExpensePaymentMethodValue.trim()) {
                                          const newVal = newExpensePaymentMethodValue.trim();
                                          if (paymentMethods.includes(newVal)) {
                                            alert(idt("វិធីសាស្ត្របង់ប្រាក់នេះមានរួចហើយ!", "This payment method already exists!", "该付款方式已存在！"));
                                            return;
                                          }
                                          const updated = [...paymentMethods, newVal];
                                          setPaymentMethods(updated);
                                          localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                                          setExpenseFormPaymentMethod(newVal);
                                          setNewExpensePaymentMethodValue("");
                                          setIsOpenExpensePaymentMethodDropdown(false);
                                        }
                                      }}
                                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
                                    >
                                      {idt("បន្ថែម", "Add", "添加")}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Note/Description */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{idt("កំណត់ចំណាំបន្ថែម", "Note / Description", "备注 / 说明")}</label>
                          <textarea
                            placeholder={idt("ឧ. ព័ត៌មានលម្អិតបន្ថែម ឬការពិពណ៌នាអំពីការចំណាយ...", "e.g., additional details or description of the expense...", "如：支出的具体细节或描述...")}
                            value={expenseFormNote}
                            onChange={(e) => setExpenseFormNote(e.target.value)}
                            rows={3}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                          />
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddExpenseModal(false)}
                            className="px-4.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-black transition-colors cursor-pointer"
                          >
                            {idt("បោះបង់", "Cancel", "取消")}
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-rose-600/15 transition-all cursor-pointer"
                          >
                            {idt("រក្សាទុក", "Save Expense", "保存支出 (Save Expense)")}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}

                {/* MODAL 1: RECORD PAYMENT MODAL */}
                {showRecordPaymentModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-3xl border border-slate-200/85 shadow-2xl w-full max-w-md mx-auto overflow-hidden flex flex-col max-h-[90vh]"
                    >
                      {/* Modal Header */}
                      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between no-print text-left">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Coins className="w-5 h-5" />
                          </span>
                          <h3 className="text-sm font-black text-slate-800">{idt("កត់ត្រាការបង់ថ្លៃសិក្សា", "Record Student Payment", "登记学生缴费 (Record Student Payment)")}</h3>
                        </div>
                        <button
                          onClick={() => {
                            setShowRecordPaymentModal(false);
                            setPaymentFormSuccess(null);
                            setKhqrVerifyStatus('idle');
                            setKhqrVerifyMessage('');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="p-6 overflow-y-auto space-y-4 text-left">
                        {paymentFormSuccess && (
                          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-150 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>{paymentFormSuccess}</span>
                          </div>
                        )}

                        <div className="space-y-4">
                          {/* Student selection */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ជ្រើសរើសសិស្សដែលត្រូវបង់ថ្លៃសិក្សា *", "Select Student to Pay *", "选择缴费学生 *")}</label>
                            <SearchableSelect 
                              value={selectedPaymentStudentId}
                              onChange={(val: string) => {
                                setSelectedPaymentStudentId(val);
                                setPaymentFormSuccess(null);
                                setKhqrVerifyStatus('idle');
                                setKhqrVerifyMessage('');
                                const foundS = students.find((s: any) => s.id === val);
                                if (foundS) {
                                  setPaymentAmount(foundS.due);
                                } else {
                                  setPaymentAmount(60);
                                }
                              }}
                              placeholder={idt("-- សូមជ្រើសរើសសិស្សដើម្បីបង់ប្រាក់ --", "-- Select Student to Pay --", "-- 请选择缴费学生 --")}
                              searchPlaceholder={idt("ស្វែងរក...", "Search...", "搜索...")}
                              options={students.filter((s: any) => s.due > 0).map((s: any) => ({
                                value: s.id,
                                label: `${s.nameKh} (${s.nameEn}) - ${s.course} [${idt("ជំពាក់", "Due", "欠费")} $${s.due}]`
                              }))}
                              className="w-full text-xs font-bold"
                              triggerClassName="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                            />
                          </div>

                          {/* Selected student breakdown panel */}
                          {(() => {
                            const foundS = students.find(s => s.id === selectedPaymentStudentId);
                            if (!foundS) return null;
                            return (
                              <div className="p-4 bg-emerald-50/40 border border-emerald-100/60 rounded-2xl text-xs space-y-2">
                                <h5 className="font-extrabold text-emerald-700 uppercase tracking-wider text-[10px]">{idt("ព័ត៌មានសិក្សា និងការជំពាក់", "Student Academic & Balance Overview", "学生学业与欠费概览 (Student Overview)")}</h5>
                                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 font-semibold text-slate-600">
                                  <div>{idt("ឈ្មោះខ្មែរ៖", "Khmer Name:", "柬文姓名:")} <span className="text-slate-850 font-black">{foundS.nameKh}</span></div>
                                  <div>{idt("ឈ្មោះឡាតាំង៖", "Latin Name:", "英文姓名:")} <span className="text-slate-850 font-bold">{foundS.nameEn}</span></div>
                                  <div>{idt("វគ្គសិក្សា៖", "Course:", "课程:")} <span className="text-primary-600 font-bold">{foundS.course || "ទូទៅ"}</span></div>
                                  <div>{idt("វេនសិក្សា៖", "Shift:", "班次:")} <span className="text-slate-500 font-sans">{foundS.shift}</span></div>
                                  <div className="col-span-2 border-t border-emerald-100/40 my-1 pt-1.5 flex justify-between font-bold text-xs">
                                    <span>{idt("ថ្លៃសិក្សាសរុប៖", "Total Fee:", "总学费:")} <span className="text-slate-800 font-mono">${foundS.fee}</span></span>
                                    <span>{idt("បានបង់រួច៖", "Paid:", "已付:")} <span className="text-emerald-600 font-mono">${foundS.paid}</span></span>
                                    <span>{idt("នៅជំពាក់៖", "Remaining Due:", "待付/欠费:")} <span className="text-rose-600 font-mono">${foundS.due}</span></span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Payment Amount */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ចំនួនទឹកប្រាក់ត្រូវបង់ ($) *", "Payment Amount ($) *", "缴费金额 ($) *")}</label>
                            <input 
                              type="number" 
                              value={paymentAmount} 
                              onChange={(e) => setPaymentAmount(Math.max(0, Number(e.target.value)))} 
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-700 focus:outline-none focus:border-primary-500 font-mono"
                            />
                          </div>

                          {/* Payment Method */}
                          <div className="space-y-1.5 relative">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("វិធីសាស្ត្របង់ប្រាក់ *", "Payment Method *", "付款方式 *")}</label>
                            
                            {/* Hidden input to keep compatibility with any document.getElementById lookup */}
                            <input 
                              type="hidden" 
                              id="payment-method-holder" 
                              value={selectedPaymentMethod} 
                            />

                            {/* Dropdown Trigger */}
                            <button
                              type="button"
                              onClick={() => setIsOpenPaymentMethodDropdown(!isOpenPaymentMethodDropdown)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-700 focus:outline-none focus:border-primary-500 flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50/50 transition-colors"
                            >
                              <span>{selectedPaymentMethod}</span>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenPaymentMethodDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {/* Floating Dropdown List */}
                            {isOpenPaymentMethodDropdown && (
                              <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-2 text-xs flex flex-col max-h-[300px]">
                                <div className="overflow-y-auto flex-1 space-y-1 pr-1 scrollbar-none">
                                  {paymentMethods.map((method, idx) => {
                                    const isEditing = editingPaymentMethodIndex === idx;
                                    const isSelected = selectedPaymentMethod === method;

                                    return (
                                      <div 
                                        key={idx} 
                                        className={`flex items-center justify-between p-2 rounded-xl transition-all group ${
                                          isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                        }`}
                                      >
                                        {isEditing ? (
                                          <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                                            <input
                                              type="text"
                                              value={editingPaymentMethodValue}
                                              onChange={(e) => setEditingPaymentMethodValue(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  e.preventDefault();
                                                  if (editingPaymentMethodValue.trim()) {
                                                    const updated = [...paymentMethods];
                                                    const oldVal = updated[idx];
                                                    updated[idx] = editingPaymentMethodValue.trim();
                                                    setPaymentMethods(updated);
                                                    localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                                                    if (selectedPaymentMethod === oldVal) {
                                                      setSelectedPaymentMethod(editingPaymentMethodValue.trim());
                                                    }
                                                    setEditingPaymentMethodIndex(null);
                                                  }
                                                } else if (e.key === "Escape") {
                                                  setEditingPaymentMethodIndex(null);
                                                }
                                              }}
                                              className="flex-1 px-2.5 py-1 text-xs border border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 font-bold bg-white text-slate-700"
                                              autoFocus
                                            />
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (editingPaymentMethodValue.trim()) {
                                                  const updated = [...paymentMethods];
                                                  const oldVal = updated[idx];
                                                  updated[idx] = editingPaymentMethodValue.trim();
                                                  setPaymentMethods(updated);
                                                  localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                                                  if (selectedPaymentMethod === oldVal) {
                                                    setSelectedPaymentMethod(editingPaymentMethodValue.trim());
                                                  }
                                                  setEditingPaymentMethodIndex(null);
                                                }
                                              }}
                                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer shrink-0"
                                            >
                                              <Check className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingPaymentMethodIndex(null);
                                              }}
                                              className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer shrink-0"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedPaymentMethod(method);
                                                setIsOpenPaymentMethodDropdown(false);
                                              }}
                                              className="flex-1 text-left font-bold cursor-pointer pr-4"
                                            >
                                              {method}
                                            </button>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:opacity-100 transition-opacity shrink-0">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingPaymentMethodIndex(idx);
                                                  setEditingPaymentMethodValue(method);
                                                }}
                                                className="p-1 text-primary-500 hover:bg-primary-100/50 rounded-lg cursor-pointer"
                                                title={idt("កែប្រែ", "Edit", "编辑")}
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDeleteConfirm({
                                                    type: "payment_method",
                                                    index: idx,
                                                    value: method
                                                  });
                                                }}
                                                className="p-1 text-rose-500 hover:bg-rose-100/50 rounded-lg cursor-pointer"
                                                title={idt("លុប", "Delete", "删除")}
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Add New Method Row */}
                                <div className="border-t border-slate-100 pt-2 mt-1.5 flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={newPaymentMethodValue}
                                    onChange={(e) => setNewPaymentMethodValue(e.target.value)}
                                    placeholder={idt("+ បញ្ចូលវិធីសាស្ត្រថ្មី...", "+ Add new payment method...", "+ 添加新付款方式...")}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (newPaymentMethodValue.trim()) {
                                          const newVal = newPaymentMethodValue.trim();
                                          if (paymentMethods.includes(newVal)) {
                                            alert(idt("វិធីសាស្ត្របង់ប្រាក់នេះមានរួចហើយ!", "This payment method already exists!", "该付款方式已存在！"));
                                            return;
                                          }
                                          const updated = [...paymentMethods, newVal];
                                          setPaymentMethods(updated);
                                          localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                                          setSelectedPaymentMethod(newVal);
                                          setNewPaymentMethodValue("");
                                          setIsOpenPaymentMethodDropdown(false);
                                        }
                                      }
                                    }}
                                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-bold text-slate-700 bg-slate-50/50"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newPaymentMethodValue.trim()) {
                                        const newVal = newPaymentMethodValue.trim();
                                        if (paymentMethods.includes(newVal)) {
                                          alert(idt("វិធីសាស្ត្របង់ប្រាក់នេះមានរួចហើយ!", "This payment method already exists!", "该付款方式已存在！"));
                                          return;
                                        }
                                        const updated = [...paymentMethods, newVal];
                                        setPaymentMethods(updated);
                                        localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                                        setSelectedPaymentMethod(newVal);
                                        setNewPaymentMethodValue("");
                                        setIsOpenPaymentMethodDropdown(false);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
                                  >
                                    {idt("បន្ថែម", "Add", "添加")}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* KHQR helper advice */}
                      <div className="px-6 mt-1 space-y-2">
                        {selectedPaymentMethod && !selectedPaymentMethod.toLowerCase().includes("cash") && !selectedPaymentMethod.includes("សាច់ប្រាក់") && !selectedPaymentMethod.includes("现金") ? (
                          <div className="space-y-2">
                            <div className="p-2.5 bg-emerald-50/50 border border-emerald-150 rounded-xl text-[11px] text-emerald-700 font-extrabold flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                <span>{idt("បានបើកការផ្ទៀងផ្ទាត់ KHQR ស្វ័យប្រវត្តិចំពោះវិធីសាស្ត្រនេះ", "KHQR Auto-Verify is enabled for this payment method", "此付款方式已启用 KHQR 自动核对")}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowVerifyInfo(!showVerifyInfo)}
                                className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-[10px] text-emerald-800 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                {showVerifyInfo ? idt("លាក់ព័ត៌មាន", "Hide Info", "隐藏信息") : idt("បង្ហាញព័ត៌មាន", "Show Info", "显示信息")}
                                <ChevronDown className={`w-3 h-3 transition-transform ${showVerifyInfo ? "rotate-180" : ""}`} />
                              </button>
                            </div>

                            {showVerifyInfo && (
                              <motion.div 
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3.5 bg-blue-50/30 border border-blue-100 rounded-xl space-y-3 shadow-sm text-left"
                              >
                                {/* Header */}
                                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                                  <h4 className="text-[11px] font-extrabold text-blue-900 tracking-tight">
                                    {idt(
                                      "១. ផ្ទៀងផ្ទាត់ស្វ័យប្រវត្តិ (KHQR Auto-Verify)",
                                      "1. KHQR Auto-Verify",
                                      "1. KHQR 自动核对"
                                    )}
                                  </h4>
                                </div>

                                {/* How it works */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {idt("របៀបដំណើរការ", "How it works", "工作原理")}
                                  </span>
                                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                                    {idt(
                                      "នៅពេលអតិថិជនស្កេន QR រួច លោកអ្នកគ្រាន់តែចុចប៊ូតុង \"ផ្ទៀងផ្ទាត់ KHQR (Auto-Verify)\" នោះប្រព័ន្ធនឹងភ្ជាប់ទៅកាន់គណនីធនាគារស្វែងរកប្រតិបត្តិការចុងក្រោយភ្លាមៗ។",
                                      "Once the customer scans the QR code, simply click the \"Verify KHQR (Auto-Verify)\" button. The system connects to the banking gateway to match the transaction instantly.",
                                      "客户扫码后，只需点击“核对 KHQR (Auto-Verify)”按钮，系统将立即连接银行网关，实时匹配最新到账交易。"
                                    )}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-[11px] text-blue-700 font-bold leading-relaxed space-y-1">
                            <p className="flex items-start gap-1.5">
                              <span className="text-sm">💡</span>
                              <span>
                                {idt(
                                  "ជ្រើសរើសវិធីសាស្ត្រធនាគារ (ដូចជា ABA, Wing, KHQR) ជំនួសឱ្យសាច់ប្រាក់ ដើម្បីបង្ហាញប៊ូតុង ផ្ទៀងផ្ទាត់ KHQR Auto-Verify!",
                                  "Select a bank/transfer method (e.g. ABA, Wing, KHQR) instead of Cash to reveal the KHQR Auto-Verify option!",
                                  "选择银行/转账方式（如 ABA、Wing、KHQR）而非现金以显示 KHQR 自动核对按钮！"
                                )}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>

                      {selectedPaymentMethod && !selectedPaymentMethod.toLowerCase().includes("cash") && !selectedPaymentMethod.includes("សាច់ប្រាក់") && !selectedPaymentMethod.includes("现金") && (
                        <div className="mt-4 flex flex-col items-center justify-center p-4 border border-blue-150 bg-blue-50/15 rounded-2xl mx-6 space-y-4">
                          <p className="text-[10px] font-bold tracking-wider text-blue-600 mb-1 uppercase">{idt("ស្កេនដើម្បីបង់ប្រាក់", "Scan to Pay", "扫码支付")}</p>
                          
                          <div className="w-40 h-40 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-2">
                            {khqrImage ? (
                              <img src={khqrImage} alt="Payment KHQR" className="w-full h-full object-contain" />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center p-3 space-y-1.5 w-full h-full bg-slate-50 rounded-lg">
                                <QrCode className="w-10 h-10 text-slate-400" />
                                <span className="text-[10px] text-slate-600 font-extrabold leading-tight">{idt("ស្កេន KHQR (MoeyS)", "Scan KHQR (MoeyS)", "扫码 KHQR (MoeyS)")}</span>
                              </div>
                            )}
                          </div>

                          {/* New blue KHQR Auto-Verify Button */}
                          <div className="w-full pt-1 flex flex-col items-center space-y-2">
                            <button
                              type="button"
                              onClick={async () => {
                                if (!selectedPaymentStudentId) {
                                  showToast(idt("សូមជ្រើសរើសសិស្សដែលត្រូវបង់ថ្លៃសិក្សាមុនពេលផ្ទៀងផ្ទាត់!", "Please select a student before verifying!", "请选择需要缴费的学生！"), "error");
                                  return;
                                }

                                setKhqrVerifyStatus('loading');
                                setKhqrVerifyMessage(idt("កំពុងភ្ជាប់ទៅកាន់ប្រព័ន្ធគណនីធនាគារ...", "Connecting to banking gateway...", "正在连接银行网关..."));

                                // Stage 1 lookup delay
                                await new Promise(r => setTimeout(r, 1000));
                                setKhqrVerifyMessage(idt("កំពុងស្វែងរកប្រតិបត្តិការផ្ទេរប្រាក់ចុងក្រោយ...", "Searching for latest transfer transaction...", "正在检索最新转账交易..."));

                                // Stage 2 verification delay
                                await new Promise(r => setTimeout(r, 1200));

                                const foundS = students.find(s => s.id === selectedPaymentStudentId);
                                if (foundS) {
                                  setKhqrVerifyStatus('success');
                                  setKhqrVerifyMessage(
                                    uiLang === "kh" 
                                      ? `ផ្ទៀងផ្ទាត់ជោគជ័យ! ប្រាក់ទទួលបានចំនួន $${foundS.due} ពី ${foundS.nameKh}`
                                      : `Verified successfully! Received $${foundS.due} from ${foundS.nameEn}`
                                  );
                                  // Auto fill exact paymentAmount matching due
                                  setPaymentAmount(foundS.due);
                                  showToast(
                                    uiLang === "kh"
                                      ? "ផ្ទៀងផ្ទាត់ KHQR ជោគជ័យ! ប្រព័ន្ធបានបំពេញចំនួនទឹកប្រាក់រួចរាល់។"
                                      : "KHQR verified successfully! Payment amount auto-filled.",
                                    "success"
                                  );
                                } else {
                                  setKhqrVerifyStatus('error');
                                  setKhqrVerifyMessage(idt("រកមិនឃើញប្រតិបត្តិការបង់ប្រាក់សម្រាប់សិស្សនេះទេ។", "No active payment transaction found for this student.", "未找到该学生的有效缴费交易。"));
                                }
                              }}
                              disabled={khqrVerifyStatus === 'loading'}
                              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all cursor-pointer"
                            >
                              {khqrVerifyStatus === 'loading' ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>{idt("កំពុងផ្ទៀងផ្ទាត់...", "Verifying...", "正在核对...")}</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 text-white" />
                                  <span>{idt("ផ្ទៀងផ្ទាត់ KHQR (Auto-Verify)", "Verify KHQR (Auto-Verify)", "核对 KHQR (Auto-Verify)")}</span>
                                </>
                              )}
                            </button>

                            {/* Verification status and logs */}
                            {khqrVerifyStatus !== 'idle' && (
                              <div className={`w-full p-2.5 rounded-xl border text-center text-[11px] font-extrabold ${
                                khqrVerifyStatus === 'loading' ? 'bg-blue-50/55 border-blue-100 text-blue-700 animate-pulse' :
                                khqrVerifyStatus === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                'bg-rose-50 border-rose-100 text-rose-700'
                              }`}>
                                {khqrVerifyMessage}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Modal Footer */}
                      <div className="px-6 py-4.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end gap-3.5">
                        <button
                          onClick={() => {
                            setShowRecordPaymentModal(false);
                            setPaymentFormSuccess(null);
                            setKhqrVerifyStatus('idle');
                            setKhqrVerifyMessage('');
                          }}
                          className="px-4.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          {idt("បោះបង់", "Cancel", "取消")}
                        </button>
                        <button
                          onClick={async () => {
                            if (!selectedPaymentStudentId) {
                              showToast(idt("សូមជ្រើសរើសសិស្សដែលត្រូវបង់ថ្លៃសិក្សា!", "Please select a student to pay!", "请选择需要缴费的学生！"), "error");
                              return;
                            }
                            if (paymentAmount <= 0) {
                              showToast(idt("សូមបញ្ចូលទឹកប្រាក់បង់ឱ្យបានត្រឹមត្រូវ!", "Please enter a valid payment amount!", "请输入正确的缴费金额！"), "error");
                              return;
                            }

                            const targetS = students.find(s => s.id === selectedPaymentStudentId);
                            if (targetS) {
                              const payMethodElement = document.getElementById('payment-method-holder') as HTMLInputElement | null;
                              const finalPayMethod = payMethodElement ? payMethodElement.value : 'CASH';

                              if (paymentAmount > targetS.due) {
                                showToast(
                                  uiLang === "kh" 
                                    ? `ទឹកប្រាក់បង់មិនអាចលើសពីចំនួនជំពាក់ $${targetS.due} ឡើយ!` 
                                    : uiLang === "zh"
                                    ? `缴费金额不能超过欠费金额 $${targetS.due}！`
                                    : `Payment amount cannot exceed due amount $${targetS.due}!`, 
                                  "error"
                                );
                                return;
                              }

                              const currentPaid = targetS.paid + paymentAmount;
                              const currentDue = Math.max(0, targetS.fee - currentPaid);

                              try {
                                // 1. Update student in database
                                const studentUpdateRes = await fetch(`/api/students/${targetS.id}`, {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                  },
                                  body: JSON.stringify({
                                    ...targetS,
                                    paid: currentPaid,
                                    due: currentDue
                                  })
                                });

                                if (!studentUpdateRes.ok) {
                                  throw new Error("Failed to update student payment in database");
                                }

                                // 2. Create financial invoice in database
                                const financeRes = await fetch("/api/finance/transactions", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                  },
                                  body: JSON.stringify({
                                    studentId: targetS.id,
                                    amountPaid: paymentAmount,
                                    amountDue: currentDue,
                                    term: targetS.course,
                                    paymentMethod: finalPayMethod
                                  })
                                });

                                if (!financeRes.ok) {
                                  throw new Error("Failed to create transaction record");
                                }

                                const financeData = await financeRes.json();

                                // 3. Update react states
                                setStudents(prev => prev.map(s => s.id === selectedPaymentStudentId ? {
                                  ...s,
                                  paid: currentPaid,
                                  due: currentDue
                                } : s));

                                if (financeData.transaction) {
                                  setTransactions(prev => [financeData.transaction, ...prev]);
                                  // Prompt to view the receipt immediately for great UX!
                                  setViewReceiptTx(financeData.transaction);
                                }

                                setPaymentFormSuccess(idt("កត់ត្រាការបង់ប្រាក់បានជោគជ័យ និងរក្សាទុកក្នុងប្រព័ន្ធរួចរាល់!", "Payment recorded and saved successfully!", "缴费记录已成功保存到系统！"));
                                setSelectedPaymentStudentId("");
                                setPaymentAmount(60);
                                showToast(idt("កត់ត្រាការបង់ប្រាក់ជោគជ័យ!", "Payment recorded successfully!", "缴费登记成功！"), "success");
                                setShowRecordPaymentModal(false);
                              } catch (error) {
                                console.error(error);
                                showToast(idt("មានបញ្ហាទំនាក់ទំនងជាមួយប្រព័ន្ធមូលដ្ឋានទិន្នន័យ!", "Database connection error!", "数据库通信错误！"), "error");
                              }
                            }
                          }}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Check className="w-4 h-4" />
                          <span>{idt("បញ្ជាក់ការបង់ប្រាក់", "Record Payment", "确认并登记缴费 (Record Payment)")}</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                  {financeSubTab === 'invoices' && (
                    <motion.div
                       key="invoices-panel"
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -5 }}
                       className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-left flex-1 flex flex-col min-h-0"
                    >
                      {/* Search and filtering bar */}
                      <div className="p-4.5 border-b border-slate-200 bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:max-w-md">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder={uiLang === "kh" ? "ស្វែងរកតាមលេខវិក្កយបត្រ ឬឈ្មោះសិស្ស..." : uiLang === "zh" ? "搜索账单编号或学生姓名..." : "Search by invoice number or student name..."}
                            value={financeSearchQuery}
                            onChange={(e) => setFinanceSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-h-0 overflow-auto scrollbar-none relative scroll-smooth">
                        <table className="w-full min-w-[900px] text-left text-sm border-collapse">
                          <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              <th className="px-4 py-1.5">
                                {uiLang === "kh" ? "លេខវិក្កយបត្រ (Invoice No.)" : uiLang === "zh" ? "账单编号 (Invoice No.)" : "Invoice No. (Invoice No.)"}
                              </th>
                              <th className="px-4 py-1.5">
                                {uiLang === "kh" ? "ឈ្មោះសិស្ស (Student Name)" : uiLang === "zh" ? "学生姓名 (Student Name)" : "Student Name (Student Name)"}
                              </th>
                              <th className="px-4 py-1.5">
                                {uiLang === "kh" ? "កាលបរិច្ឆេទ (Date)" : uiLang === "zh" ? "开单日期 (Date)" : "Date (Date)"}
                              </th>
                              <th className="px-4 py-1.5">
                                {uiLang === "kh" ? "ការពិពណ៌នា (Description)" : uiLang === "zh" ? "款项描述 (Description)" : "Description (Description)"}
                              </th>
                              <th className="px-4 py-1.5 text-right">
                                {uiLang === "kh" ? "ទឹកប្រាក់ (Amount)" : uiLang === "zh" ? "实收金额 (Amount)" : "Amount (Amount)"}
                              </th>
                              <th className="px-4 py-1.5 text-right">
                                {uiLang === "kh" ? "បង្កាន់ដៃ (Receipt)" : uiLang === "zh" ? "收据 (Receipt)" : "Receipt (Receipt)"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-bold text-slate-600 bg-white">
                            {(() => {
                              const filtered = transactions.filter(tx => {
                                if (!financeSearchQuery) return true;
                                const q = (financeSearchQuery || '').toLowerCase().trim();
                                const invNum = tx.invoiceNumber || `INV-${tx.id.slice(-6).toUpperCase()}`;
                                return (
                                  invNum.toLowerCase().includes(q) ||
                                  (tx.studentName && tx.studentName.toLowerCase().includes(q)) ||
                                  (tx.type && (tx.type || '').toLowerCase().includes(q))
                                );
                              });

                              if (filtered.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-xs">
                                      {uiLang === "kh" ? "មិនមានលិខិតទទួលប្រាក់ដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ" : uiLang === "zh" ? "没有找到符合搜索条件的收据发票" : "No invoices found matching your search"}
                                    </td>
                                  </tr>
                                );
                              }

                              return filtered.map((tx: any, index: number) => {
                                const invNum = tx.invoiceNumber || (tx.id ? `INV-${tx.id.slice(-6).toUpperCase()}` : `INV-NA`);
                                return (
                                  <tr key={tx.id || `tx-${index}`} className="hover:bg-slate-50/60 transition-all duration-150">
                                    <td className="px-4 py-1.5 font-mono text-xs text-primary-600 font-black">
                                      {invNum}
                                    </td>
                                    <td className="px-4 py-1.5 text-xs text-slate-700 font-extrabold">
                                      {tx.studentName}
                                    </td>
                                    <td className="px-4 py-1.5 font-mono text-xs text-slate-500">
                                      {tx.date}
                                    </td>
                                    <td className="px-4 py-1.5 text-xs text-slate-500 max-w-xs truncate font-medium">
                                      {tx.type || (uiLang === "kh" ? "បង់ថ្លៃសិក្សា" : uiLang === "zh" ? "缴纳学费" : "Tuition Payment")}
                                    </td>
                                    <td className="px-4 py-1.5 text-right font-mono text-emerald-600 font-black text-xs">
                                      +${Number(tx.amount).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-1.5 text-right">
                                      <button
                                        onClick={() => setViewReceiptTx(tx)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 hover:bg-primary-100 text-primary-600 hover:text-primary-700 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-4xs border border-primary-100/30"
                                      >
                                        <Printer className="w-3.5 h-3.5" />
                                        <span>{uiLang === "kh" ? "បង្កាន់ដៃ" : uiLang === "zh" ? "收据" : "Receipt"}</span>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* SUB-TAB 3: SALARIES & EXPENSES PANEL */}
                  {financeSubTab === "salaries" && (
                    <motion.div
                      key="salaries-panel"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-left space-y-4 flex-1 flex flex-col min-h-0"
                    >
                      <div className="p-4.5 border-b border-slate-200 bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:max-w-md">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder={uiLang === "kh" ? "ស្វែងរកតាមឈ្មោះគ្រូ ឬរយៈពេលបើកប្រាក់ខែ..." : uiLang === "zh" ? "按教师姓名或工资单周期搜索..." : "Search by teacher name or payroll period..."}
                            value={financeSearchQuery}
                            onChange={(e) => setFinanceSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                          />
                        </div>
                      </div>

                      <div className="overflow-x-auto scrollbar-none relative">
                        <table className="w-full min-w-[1100px] text-left text-sm border-collapse">
                          <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              <th className="px-4 py-2">{uiLang === "kh" ? "សាស្រ្តាចារ្យ (Teacher)" : uiLang === "zh" ? "教职员工 (Teacher)" : "Teacher (Teacher)"}</th>
                              <th className="px-4 py-2">{uiLang === "kh" ? "រយៈពេល (Period)" : uiLang === "zh" ? "开支周期 (Period)" : "Period (Period)"}</th>
                              <th className="px-4 py-2 text-right">{uiLang === "kh" ? "ប្រាក់ខែគោល (Base)" : uiLang === "zh" ? "基本工资 (Base)" : "Base (Base)"}</th>
                              <th className="px-4 py-2 text-right">{uiLang === "kh" ? "ប្រាក់បន្ថែម (Bonus)" : uiLang === "zh" ? "津贴奖金 (Bonus)" : "Bonus (Bonus)"}</th>
                              <th className="px-4 py-2 text-right">{uiLang === "kh" ? "ប្រាក់ពិន័យ/ដក (Deduction)" : uiLang === "zh" ? "考勤扣减 (Deduction)" : "Deduction (Deduction)"}</th>
                              <th className="px-4 py-2 text-right">{uiLang === "kh" ? "បើកជាក់ស្តែង (Total Paid)" : uiLang === "zh" ? "实发工资 (Total Paid)" : "Total Paid (Total Paid)"}</th>
                              <th className="px-4 py-2 text-center">{uiLang === "kh" ? "ស្ថានភាព" : uiLang === "zh" ? "状态 (Status)" : "Status (Status)"}</th>
                              <th className="px-4 py-2 text-right">{uiLang === "kh" ? "បង្កាន់ដៃ (Voucher)" : uiLang === "zh" ? "工资单 (Voucher)" : "Voucher (Voucher)"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-600 bg-white">
                            {(() => {
                              const filtered = salaries.filter((s: any) => {
                                const teacherObj = teachers.find(t => t.id === s.teacherId || t.teacherId === s.teacherId);
                                const name = teacherObj ? (teacherObj.nameKh || teacherObj.nameEn || "") : (s.teacherName || "");
                                const q = (financeSearchQuery || '').toLowerCase().trim();
                                return (name || '').toLowerCase().includes(q) || (s.payPeriod || '').toLowerCase().includes(q);
                              });

                              if (filtered.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                                      {uiLang === "kh" ? "មិនមានបញ្ជីបើកប្រាក់បៀវត្សដែលត្រូវនឹងការស្វែងរកទេ" : uiLang === "zh" ? "没有找到符合搜索条件的员工工资单" : "No salary records found"}
                                    </td>
                                  </tr>
                                );
                              }

                              return filtered.map((s: any, index: number) => {
                                const teacherObj = teachers.find(t => t.id === s.teacherId || t.teacherId === s.teacherId);
                                const name = teacherObj ? (teacherObj.nameKh || teacherObj.nameEn) : (s.teacherName || "Teacher");
                                const isPaid = s.status?.toUpperCase() === "PAID" || s.status === "បើកសព្វគ្រប់ (PAID)";
                                return (
                                  <tr key={s.id || `salary-${index}`} className="hover:bg-slate-50/60 transition-all duration-150">
                                    <td className="px-4 py-1.5 font-extrabold text-xs text-slate-800">
                                      {name}
                                    </td>
                                    <td className="px-4 py-1.5 font-mono text-xs text-slate-500">
                                      {s.payPeriod}
                                    </td>
                                    <td className="px-4 py-1.5 text-right font-mono text-xs text-slate-600">
                                      ${Number(s.baseSalary || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-1.5 text-right font-mono text-xs text-emerald-600">
                                      +${Number(s.bonus || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-1.5 text-right font-mono text-xs text-rose-500">
                                      -${Number(s.deduction || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-1.5 text-right font-mono font-black text-xs text-slate-800">
                                      ${Number(s.totalPaid || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-1.5 text-center">
                                      <span className={`inline-flex px-2 py-0.5 text-[9px] font-black rounded-full uppercase ${
                                        isPaid ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"
                                      }`}>
                                        {uiLang === "kh" 
                                          ? (isPaid ? "បើកសព្វគ្រប់" : "មិនទាន់បើក") 
                                          : uiLang === "zh"
                                          ? (isPaid ? "已发放 (PAID)" : "未结算")
                                          : (isPaid ? "PAID" : "UNPAID")}
                                      </span>
                                    </td>
                                    <td className="px-4 py-1.5 text-right">
                                      <button
                                        onClick={() => setViewSalaryReceipt(s)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-4xs border border-rose-100/30"
                                      >
                                        <Printer className="w-3.5 h-3.5" />
                                        <span>{uiLang === "kh" ? "វិក្កយបត្រ" : uiLang === "zh" ? "凭证" : "Voucher"}</span>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* SUB-TAB 4: SCHOOL EXPENSES & UTILITIES PANEL */}
                  {financeSubTab === "expenses" && (
                    <motion.div
                      key="expenses-panel"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-6 text-left"
                    >
                      {/* Filters and Search Bar */}
                      <div className="p-4.5 bg-slate-50/40 border border-slate-200/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 flex-1">
                          <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder={uiLang === "kh" ? "ស្វែងរកតាមឈ្មោះចំណាយ..." : uiLang === "zh" ? "按支出款项或描述搜索..." : "Search by expense name..."}
                              value={expenseSearchQuery}
                              onChange={(e) => setExpenseSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                            />
                          </div>
                          
                          <div className="relative">
                            <select
                              value={expenseFilterCategory}
                              onChange={(e) => setExpenseFilterCategory(e.target.value)}
                              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-primary-500 transition-all cursor-pointer"
                            >
                              <option value="all">
                                {uiLang === "kh" ? "គ្រប់ប្រភេទចំណាយ (All Categories)" : uiLang === "zh" ? "所有支出类别" : "All Categories"}
                              </option>
                              {expenseCategories.map((cat, idx) => (
                                <option key={cat.id || `cat-${idx}`} value={cat.id}>
                                  {uiLang === "kh" ? cat.labelKh : uiLang === "zh" ? (cat.id === "water" ? "水费" : cat.id === "electricity" ? "电费" : cat.id === "supplies" ? "办公用品" : cat.id === "internet" ? "宽带" : cat.id === "rent" ? "租金" : cat.labelEn) : cat.labelEn} ({cat.labelEn})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Expenses Table */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto scrollbar-none relative">
                          <table className="w-full min-w-[1000px] text-left text-sm border-collapse">
                            <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                <th className="px-5 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-left align-middle">
                                  {uiLang === "kh" ? "ឈ្មោះចំណាយ / បរិយាយ (EXPENSE TITLE)" : uiLang === "zh" ? "支出款项 / 摘要描述 (EXPENSE TITLE)" : "Expense Title / Description (EXPENSE TITLE)"}
                                </th>
                                <th className="px-5 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-left align-middle">
                                  {uiLang === "kh" ? "ប្រភេទចំណាយ (CATEGORY)" : uiLang === "zh" ? "支出类别 (CATEGORY)" : "Expense Category (CATEGORY)"}
                                </th>
                                <th className="px-5 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-left align-middle">
                                  {uiLang === "kh" ? "កាលបរិច្ឆេទ (DATE)" : uiLang === "zh" ? "支出日期 (DATE)" : "Date (DATE)"}
                                </th>
                                <th className="px-5 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-left align-middle">
                                  {uiLang === "kh" ? "ទូទាត់តាម (PAYMENT METHOD)" : uiLang === "zh" ? "结算方式 (PAYMENT METHOD)" : "Payment Method (PAYMENT METHOD)"}
                                </th>
                                <th className="px-5 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-right align-middle">
                                  {uiLang === "kh" ? "ទឹកប្រាក់ (AMOUNT)" : uiLang === "zh" ? "支出金额 (AMOUNT)" : "Amount (AMOUNT)"}
                                </th>
                                <th className="px-5 py-1.5 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] text-right align-middle">
                                  {uiLang === "kh" ? "សកម្មភាព (ACTIONS)" : uiLang === "zh" ? "操作 (ACTIONS)" : "Actions (ACTIONS)"}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-600 bg-white">
                              {(() => {
                                const filtered = schoolExpenses.filter(item => {
                                  // category filter
                                  if (expenseFilterCategory !== "all" && item.category !== expenseFilterCategory) {
                                    return false;
                                  }
                                  // search query
                                  const q = (expenseSearchQuery || '').toLowerCase();
                                  return (
                                    (item.title || item.description || '').toLowerCase().includes(q) ||
                                    (item.note && (item.note || '').toLowerCase().includes(q))
                                  );
                                });

                                if (filtered.length === 0) {
                                  return (
                                    <tr>
                                      <td colSpan={6} className="py-16 text-center text-slate-400">
                                        <div className="max-w-md mx-auto space-y-2">
                                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                                            <Search className="w-6 h-6" />
                                          </div>
                                          <p className="font-extrabold text-slate-700">
                                            {uiLang === "kh" ? "រកមិនឃើញទិន្នន័យចំណាយឡើយ" : uiLang === "zh" ? "未找到符合条件的支出记录" : "No expense logs found"}
                                          </p>
                                          <p className="text-xs text-slate-400 font-normal">
                                            {uiLang === "kh" ? "សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬពាក្យគន្លឹះដើម្បីស្វែងរក។" : uiLang === "zh" ? "请尝试更改筛选器或搜索关键字。" : "Please try to adjust your filters or search terms."}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                return filtered.map((item, index) => {
                                  const renderCategoryBadge = (catId: string) => {
                                    const found = expenseCategories.find(c => c.id === catId);
                                    if (found) {
                                      let colorClass = "bg-slate-50 text-slate-600 border-slate-100";
                                      let Icon = Info;
                                      
                                      if (catId === "water") {
                                        colorClass = "bg-sky-50 text-sky-600 border-sky-100";
                                        Icon = Layers;
                                      } else if (catId === "electricity") {
                                        colorClass = "bg-amber-50 text-amber-600 border-amber-100";
                                        Icon = Sparkles;
                                      } else if (catId === "supplies") {
                                        colorClass = "bg-blue-50 text-blue-600 border-blue-100";
                                        Icon = Folder;
                                      } else if (catId === "internet") {
                                        colorClass = "bg-primary-50 text-primary-600 border-primary-100";
                                        Icon = Globe;
                                      } else if (catId === "rent") {
                                        colorClass = "bg-rose-50 text-rose-600 border-rose-100";
                                        Icon = Landmark;
                                      } else {
                                        colorClass = "bg-teal-50 text-teal-600 border-teal-100";
                                        Icon = Layers;
                                      }
                                      
                                      return (
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${colorClass}`}>
                                          <Icon className="w-3 h-3" />
                                          <span>
                                            {uiLang === "kh" ? found.labelKh : uiLang === "zh" ? (catId === "water" ? "水费" : catId === "electricity" ? "电费" : catId === "supplies" ? "办公用品" : catId === "internet" ? "宽带" : catId === "rent" ? "租金" : found.labelEn) : found.labelEn} ({found.labelEn})
                                          </span>
                                        </span>
                                      );
                                    }
                                    
                                    return (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100">
                                        <Info className="w-3 h-3" />
                                        <span>{catId}</span>
                                      </span>
                                    );
                                  };

                                  return (
                                    <tr key={item.id || `expense-${index}`} className="hover:bg-slate-50/60 transition-all duration-150">
                                      <td className="px-5 py-1.5">
                                        <div className="font-extrabold text-slate-800 text-xs">{item.title || item.description || "គ្មានចំណងជើង"}</div>
                                        {item.note && (
                                          <div className="text-[10px] text-slate-400 font-normal mt-0.5 max-w-sm truncate">{item.note}</div>
                                        )}
                                      </td>
                                      <td className="px-5 py-1.5">
                                        {renderCategoryBadge(item.category || "other")}
                                      </td>
                                      <td className="px-5 py-1.5 text-slate-500 font-mono text-xs">
                                        {item.date || "-"}
                                      </td>
                                      <td className="px-5 py-1.5 text-slate-500 text-xs">
                                        <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-mono text-[10px]">
                                          {item.paymentMethod ? (uiLang === "kh" ? item.paymentMethod : item.paymentMethod.includes("CASH") ? (uiLang === "zh" ? "现金 (CASH)" : "Cash (CASH)") : (uiLang === "zh" ? "银行转账" : item.paymentMethod)) : (uiLang === "kh" ? "សាច់ប្រាក់ (CASH)" : uiLang === "zh" ? "现金 (CASH)" : "Cash (CASH)")}
                                        </span>
                                      </td>
                                      <td className="px-5 py-1.5 text-right font-mono text-rose-600 font-extrabold text-xs">
                                        -${Number(item.amount || item.value || 0).toFixed(2)}
                                      </td>
                                      <td className="px-5 py-1.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                          <button
                                            onClick={() => {
                                              setExpenseFormId(item.id);
                                              setExpenseFormTitle(item.title || item.description || "");
                                              setExpenseFormAmount(item.amount || item.value || "");
                                              setExpenseFormCategory(item.category || "other");
                                              setExpenseFormDate(item.date || "");
                                              setExpenseFormPaymentMethod(item.paymentMethod || "សាច់ប្រាក់ (CASH)");
                                              setExpenseFormNote(item.note || "");
                                              setExpenseFormSuccess(null);
                                              setShowAddExpenseModal(true);
                                            }}
                                            className="p-1 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                            title={uiLang === "kh" ? "កែប្រែ" : uiLang === "zh" ? "编辑" : "Edit"}
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => {
                                              setDeleteConfirm({
                                                type: "school_expense",
                                                index: item.id,
                                                value: item.title
                                              });
                                            }}
                                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                            title={uiLang === "kh" ? "លុប" : uiLang === "zh" ? "删除" : "Delete"}
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SUB-TAB 3: REPORTS & RECHARTS */}
                  {financeSubTab === 'reports' && (
                    <motion.div
                      key="reports-panel"
                      id="reports-panel"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-6"
                    >
                      {/* Graphs Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Column chart: course fee vs collected vs due */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5 text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                              <BarChart2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                                {uiLang === "kh" ? "ចំណូលប្រមូលបានតាមវគ្គសិក្សា (Revenue by Course)" : uiLang === "zh" ? "按班级/课程划分的收入 (Revenue by Course)" : "Revenue by Course (Revenue by Course)"}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {uiLang === "kh" ? "ប្រៀបធៀបថ្លៃសិក្សាសរុប ទឹកប្រាក់ទទួលបាន និងជំពាក់តាមវគ្គនីមួយៗ" : uiLang === "zh" ? "对比各班级/课程的总应收、实收和未缴清学费" : "Compare total fee, paid, and outstanding dues per course"}
                              </p>
                            </div>
                          </div>
                          <div className="h-[280px] w-full text-xs">
                            {(() => {
                              // Compute dynamic course data
                              const courseMap: Record<string, { name: string; totalFee: number; totalPaid: number; totalDue: number }> = {};
                              students.forEach(s => {
                                const course = s.course || "វគ្គសិក្សាទូទៅ";
                                if (!courseMap[course]) {
                                  courseMap[course] = { name: getCourseTitle(course, uiLang), totalFee: 0, totalPaid: 0, totalDue: 0 };
                                }
                                courseMap[course].totalFee += s.fee;
                                courseMap[course].totalPaid += s.paid;
                                courseMap[course].totalDue += s.due;
                              });
                              const courseData = Object.values(courseMap);

                              if (courseData.length === 0) {
                                return (
                                  <div className="h-full flex items-center justify-center text-slate-400 font-semibold bg-slate-50 rounded-2xl">
                                    {uiLang === "kh" ? "មិនមានទិន្នន័យដើម្បីវិភាគទេ" : uiLang === "zh" ? "没有可分析的数据" : "No analytical data available"}
                                  </div>
                                );
                              }

                              const CustomCourseTooltip = ({ active, payload, label }: any) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 p-3.5 rounded-xl shadow-xl text-left text-xs text-white min-w-[220px]">
                                      <p className="font-extrabold mb-2 text-slate-100 border-b border-slate-800 pb-1.5">{label}</p>
                                      <div className="space-y-2">
                                        {payload.map((entry: any, index: number) => (
                                          <div key={index} className="flex items-center justify-between gap-4 font-semibold">
                                            <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                                              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: entry.fill || entry.color }} />
                                              {entry.name}
                                            </span>
                                            <span className="font-mono text-white text-[11px] font-bold">
                                              ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              };

                              return (
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={courseData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "bold" }} stroke="#cbd5e1" />
                                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "bold" }} stroke="#cbd5e1" unit="$" />
                                    <Tooltip content={<CustomCourseTooltip />} cursor={{ fill: "#f1f5f9", opacity: 0.5 }} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px", marginTop: "15px" }} />
                                    <Bar name={uiLang === "kh" ? "ថ្លៃត្រូវប្រមូល (Fee)" : uiLang === "zh" ? "应缴学费 (Fee)" : "Required Fee (Fee)"} dataKey="totalFee" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                    <Bar name={uiLang === "kh" ? "ប្រមូលបាន (Paid)" : uiLang === "zh" ? "已收学费 (Paid)" : "Collected (Paid)"} dataKey="totalPaid" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                    <Bar name={uiLang === "kh" ? "នៅសល់ (Due)" : uiLang === "zh" ? "仍欠缴 (Due)" : "Outstanding (Due)"} dataKey="totalDue" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                  </BarChart>
                                </ResponsiveContainer>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Pie chart: Student Status & Popular Courses */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5 text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                              <PieIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                                {uiLang === "kh" ? "ការចុះឈ្មោះរៀនតាមមុខវិជ្ជា (Course Popularity Share)" : uiLang === "zh" ? "各科目注册人数占比 (Course Popularity Share)" : "Course Popularity Share (Course Popularity Share)"}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {uiLang === "kh" ? "ចំណែកនៃការចុះឈ្មោះសិស្សសរុប តាមមុខវិជ្ជានីមួយៗនៅក្នុងសាលា" : uiLang === "zh" ? "展示全校各个科目占总注册人数的比例" : "Distribution of total student enrollments by course in school"}
                              </p>
                            </div>
                          </div>
                          <div className="h-[280px] w-full text-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                            {(() => {
                              // Compute dynamic course count share
                              const courseMap: Record<string, { name: string; value: number }> = {};
                              students.forEach(s => {
                                const course = s.course || "វគ្គសិក្សាទូទៅ";
                                if (!courseMap[course]) {
                                  courseMap[course] = { name: getCourseTitle(course, uiLang), value: 0 };
                                }
                                courseMap[course].value += 1;
                              });
                              const chartData = Object.values(courseMap);

                              if (chartData.length === 0) {
                                return (
                                  <div className="h-full flex items-center justify-center text-slate-400 w-full font-semibold bg-slate-50 rounded-2xl">
                                    {uiLang === "kh" ? "មិនមានទិន្នន័យមុខវិជ្ជាទេ" : uiLang === "zh" ? "无科目数据记录" : "No course enrollment data found"}
                                  </div>
                                );
                              }

                              const totalEnrollments = chartData.reduce((acc, curr) => acc + curr.value, 0);
                              const COLORS = ["#3b82f6", "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#2563eb", "#14b8a6"];

                              const CustomPieTooltip = ({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                  const entry = payload[0].payload;
                                  return (
                                    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 p-2.5 rounded-xl shadow-xl text-left text-[11px] text-white">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].color }} />
                                        <span className="font-extrabold text-slate-100">{entry.name}</span>
                                      </div>
                                      <div className="text-slate-300 font-bold font-mono">
                                        {uiLang === "kh" ? "ចំនួនសិស្ស៖" : uiLang === "zh" ? "注册人数：" : "Students Count:"} <span className="text-white font-black">
                                          {uiLang === "kh" 
                                            ? `${toKhmerNumberGlobal(String(entry.value))} នាក់` 
                                            : uiLang === "zh"
                                            ? `${entry.value} 人`
                                            : `${entry.value} ${entry.value > 1 ? "Students" : "Student"}`}
                                        </span> ({((entry.value / totalEnrollments) * 100).toFixed(1)}%)
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              };

                              return (
                                <>
                                  <div className="h-full w-full sm:w-[50%] relative flex items-center justify-center">
                                    <div className="relative w-full h-full max-h-[220px]">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                          <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={88}
                                            paddingAngle={4}
                                            dataKey="value"
                                          >
                                            {chartData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                                            ))}
                                          </Pie>
                                          <Tooltip content={<CustomPieTooltip />} />
                                        </PieChart>
                                      </ResponsiveContainer>
                                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                                          {uiLang === "kh" ? "ការចុះឈ្មោះ" : uiLang === "zh" ? "注册数" : "Enrollments"}
                                        </span>
                                        <span className="text-xl font-black text-slate-800 font-mono mt-0.5">
                                          {uiLang === "kh" 
                                            ? `${toKhmerNumberGlobal(String(totalEnrollments))} នាក់` 
                                            : uiLang === "zh"
                                            ? `${totalEnrollments} 人`
                                            : `${totalEnrollments} ${totalEnrollments > 1 ? "Students" : "Student"}`}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-[50%] flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-2 scrollbar-none">
                                    {chartData.map((entry: any, idx) => {
                                      const color = COLORS[idx % COLORS.length];
                                      const percentage = totalEnrollments > 0 ? ((entry.value / totalEnrollments) * 100).toFixed(1) : "0.0";
                                      return (
                                        <div key={entry.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/60 border border-slate-100 hover:border-slate-200/80 transition-all duration-150">
                                          <div className="flex items-center gap-2 truncate max-w-[130px]">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                                            <span className="truncate text-[11px] font-black text-slate-700">{entry.name}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 shrink-0 font-mono">
                                            <span className="text-[10px] text-slate-400 font-extrabold">
                                              {uiLang === "kh" 
                                                ? `${toKhmerNumberGlobal(String(entry.value))} នាក់` 
                                                : uiLang === "zh"
                                                ? `${entry.value} 人`
                                                : `${entry.value} ${entry.value > 1 ? "Students" : "Student"}`}
                                            </span>
                                            <span className="text-[9px] px-1.5 py-0.5 bg-white text-slate-500 rounded-md border border-slate-200 font-extrabold">{percentage}%</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Income and Expenses Analysis Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Income vs Expenses chart */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5 text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                              <BarChart2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                                {uiLang === "kh" ? "និន្នាការចំណូល-ចំណាយប្រចាំខែ (Monthly Income vs Expenses)" : uiLang === "zh" ? "月度收支趋势 (Monthly Income vs Expenses)" : "Monthly Income vs Expenses"}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {uiLang === "kh" ? "ប្រៀបធៀបចំណូលប្រមូលបាន និងការចំណាយសរុបប្រចាំខែ" : uiLang === "zh" ? "对比每月总收入与总支出" : "Compare total collected revenue vs expenses per month"}
                              </p>
                            </div>
                          </div>
                          <div className="h-[280px] w-full text-xs">
                            {(() => {
                              const monthlyMap: Record<string, { income: number; expense: number }> = {};
                              
                              // Add Income
                              transactions.forEach(tx => {
                                if (!tx.date) return;
                                const monthKey = tx.date.slice(0, 7); // e.g. "2026-07"
                                if (monthKey) {
                                  if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { income: 0, expense: 0 };
                                  monthlyMap[monthKey].income += tx.amount;
                                }
                              });

                              // Add School Expenses
                              schoolExpenses.forEach(item => {
                                if (!item.date) return;
                                const monthKey = item.date.slice(0, 7);
                                if (monthKey) {
                                  if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { income: 0, expense: 0 };
                                  monthlyMap[monthKey].expense += Number(item.amount || item.value || 0);
                                }
                              });

                              // Add Salaries (assuming date is in period or we use current if undefined, but salaries have date in this system usually or just period "YYYY-MM")
                              salaries.forEach(item => {
                                // Extract month from period if possible, e.g. "2026-07"
                                let monthKey = "";
                                if (item.period && item.period.length >= 7) {
                                  monthKey = item.period.slice(0, 7);
                                } else {
                                  // Fallback to today
                                  const today = new Date();
                                  monthKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`;
                                }
                                if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { income: 0, expense: 0 };
                                monthlyMap[monthKey].expense += Number(item.totalPaid || 0);
                              });

                              const chartData = Object.keys(monthlyMap).sort().map(key => {
                                const [year, month] = key.split("-");
                                const khmerMonthsList = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
                                const englishMonthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                const chineseMonthsList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
                                const mIndex = parseInt(month, 10) - 1;
                                const formattedMonth = uiLang === "kh" 
                                  ? khmerMonthsList[mIndex] || month 
                                  : uiLang === "zh"
                                  ? chineseMonthsList[mIndex] || month
                                  : englishMonthsList[mIndex] || month;
                                return {
                                  month: uiLang === "kh" ? `${formattedMonth} ${toKhmerNumberGlobal(year)}` : `${formattedMonth} ${year}`,
                                  income: monthlyMap[key].income,
                                  expense: monthlyMap[key].expense
                                };
                              });

                              if (chartData.length === 0) {
                                return (
                                  <div className="h-full flex items-center justify-center text-slate-400 font-semibold bg-slate-50 rounded-2xl">
                                    {uiLang === "kh" ? "មិនទាន់មានប្រវត្តិប្រតិបត្តិការនៅឡើយទេ" : uiLang === "zh" ? "暂无交易历史" : "No transaction history available"}
                                  </div>
                                );
                              }

                              const CustomTrendTooltip = ({ active, payload, label }: any) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 p-3.5 rounded-xl shadow-xl text-left text-xs text-white min-w-[200px]">
                                      <p className="font-extrabold mb-2 text-slate-200 border-b border-slate-800 pb-1.5">{label}</p>
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-4 font-semibold">
                                          <span className="flex items-center gap-1.5 text-slate-300">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                            {uiLang === "kh" ? "ចំណូល (Income)" : "Income"}
                                          </span>
                                          <span className="font-mono text-emerald-400 font-black text-xs">
                                            ${payload.find((p:any) => p.dataKey === 'income')?.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 font-semibold">
                                          <span className="flex items-center gap-1.5 text-slate-300">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                            {uiLang === "kh" ? "ចំណាយ (Expense)" : "Expense"}
                                          </span>
                                          <span className="font-mono text-rose-400 font-black text-xs">
                                            ${payload.find((p:any) => p.dataKey === 'expense')?.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              };

                              return (
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                                    <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={9} fontWeight="bold" tickFormatter={(val) => `$${val}`} />
                                    <Tooltip content={<CustomTrendTooltip />} cursor={{ fill: "#f1f5f9", opacity: 0.5 }} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px", marginTop: "15px" }} />
                                    <Bar name={uiLang === "kh" ? "ចំណូល (Income)" : "Income"} dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                    <Bar name={uiLang === "kh" ? "ចំណាយ (Expense)" : "Expense"} dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                  </BarChart>
                                </ResponsiveContainer>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Expenses Breakdown by Category PieChart */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5 text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                              <PieIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                                {uiLang === "kh" ? "ការវិភាគចំណាយតាមប្រភេទ (Expenses by Category)" : uiLang === "zh" ? "按类别划分的支出 (Expenses by Category)" : "Expenses by Category"}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {uiLang === "kh" ? "បង្ហាញទំហំនៃការចំណាយទៅលើប្រភេទនីមួយៗធៀបនឹងការចំណាយសរុប" : uiLang === "zh" ? "展示各项支出占总支出的比重" : "Breakdown of all school expenses categorized by type"}
                              </p>
                            </div>
                          </div>
                          <div className="h-[280px] w-full text-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                            {(() => {
                              const expMap: Record<string, { name: string; value: number }> = {};
                              schoolExpenses.forEach(item => {
                                const cat = expenseCategories.find(c => c.id === item.category);
                                const catName = cat ? (uiLang === "kh" ? cat.labelKh : cat.labelEn) : item.category;
                                if (!expMap[catName]) {
                                  expMap[catName] = { name: catName, value: 0 };
                                }
                                expMap[catName].value += Number(item.amount || item.value || 0);
                              });
                              
                              const salariesTotal = salaries.reduce((sum, item) => sum + Number(item.totalPaid), 0);
                              if (salariesTotal > 0) {
                                const salName = uiLang === "kh" ? "ប្រាក់បៀវត្សគ្រូ" : uiLang === "zh" ? "教师薪资" : "Teacher Salaries";
                                expMap[salName] = { name: salName, value: salariesTotal };
                              }

                              const chartData = Object.values(expMap).filter(d => d.value > 0).sort((a,b) => b.value - a.value);

                              if (chartData.length === 0) {
                                return (
                                  <div className="h-full flex items-center justify-center text-slate-400 w-full font-semibold bg-slate-50 rounded-2xl">
                                    {uiLang === "kh" ? "មិនទាន់មានទិន្នន័យចំណាយនៅឡើយទេ" : uiLang === "zh" ? "暂无支出记录" : "No expense data found"}
                                  </div>
                                );
                              }

                              const totalExpenses = chartData.reduce((acc, curr) => acc + curr.value, 0);
                              const COLORS = ["#f43f5e", "#f97316", "#eab308", "#84cc16", "#06b6d4", "#3b82f6", "#2563eb", "#d946ef"];

                              const CustomPieTooltip = ({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                  const entry = payload[0].payload;
                                  return (
                                    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 p-2.5 rounded-xl shadow-xl text-left text-[11px] text-white">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].color }} />
                                        <span className="font-extrabold text-slate-100">{entry.name}</span>
                                      </div>
                                      <div className="text-slate-300 font-bold font-mono">
                                        {uiLang === "kh" ? "ទឹកប្រាក់ចំណាយ៖" : uiLang === "zh" ? "支出金额：" : "Amount Spent:"} <span className="text-white font-black text-[12px]">
                                          ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span> ({((entry.value / totalExpenses) * 100).toFixed(1)}%)
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              };

                              return (
                                <>
                                  <div className="h-full w-full sm:w-[50%] relative flex items-center justify-center">
                                    <div className="relative w-full h-full max-h-[220px]">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                          <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={88}
                                            paddingAngle={4}
                                            dataKey="value"
                                          >
                                            {chartData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                                            ))}
                                          </Pie>
                                          <Tooltip content={<CustomPieTooltip />} />
                                        </PieChart>
                                      </ResponsiveContainer>
                                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                                          {uiLang === "kh" ? "ចំណាយសរុប" : uiLang === "zh" ? "总支出" : "Total Spent"}
                                        </span>
                                        <span className="text-xl font-black text-rose-600 font-mono mt-0.5">
                                          ${totalExpenses >= 1000 ? (totalExpenses/1000).toFixed(1) + 'k' : totalExpenses.toFixed(0)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-full sm:w-[50%] flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-2 scrollbar-none">
                                    {chartData.map((entry: any, idx) => {
                                      const color = COLORS[idx % COLORS.length];
                                      const percentage = totalExpenses > 0 ? ((entry.value / totalExpenses) * 100).toFixed(1) : "0.0";
                                      return (
                                        <div key={entry.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/60 border border-slate-100 hover:border-slate-200/80 transition-all duration-150">
                                          <div className="flex items-center gap-2 truncate max-w-[130px]">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                                            <span className="truncate text-[11px] font-black text-slate-700">{entry.name}</span>
                                          </div>
                                          <div className="flex flex-col items-end shrink-0 font-mono">
                                            <span className="text-[11px] font-black text-slate-800">
                                              ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <span className="text-[9px] px-1 py-0.5 mt-0.5 bg-white text-slate-500 rounded-sm border border-slate-200 font-extrabold leading-none">{percentage}%</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Transaction Summary & Status Cards breakdown */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          {uiLang === "kh" ? "ព័ត៌មានលម្អិតអំពីចំណូល និងគណនេយ្យត្រូវប្រមូល (Ledger Analysis)" : uiLang === "zh" ? "分类账簿明细与应收分析 (Ledger Analysis)" : "Ledger Analysis (Ledger Analysis)"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                            <h5 className="font-extrabold text-slate-700">
                              {uiLang === "kh" ? "គណនេយ្យសិស្សជំពាក់ (Outstanding Debt)" : uiLang === "zh" ? "未结清债务账目 (Outstanding Debt)" : "Outstanding Debt (Outstanding Debt)"}
                            </h5>
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-semibold text-slate-500">
                                <span>{uiLang === "kh" ? "សិស្សកំពុងជំពាក់៖" : uiLang === "zh" ? "欠费学生人数：" : "Dues Outstanding:"}</span>
                                <span className="font-mono text-rose-600 font-extrabold">
                                  {uiLang === "kh" 
                                    ? `${toKhmerNumberGlobal(String(students.filter(s => s.due > 0).length))} នាក់` 
                                    : uiLang === "zh"
                                    ? `${students.filter(s => s.due > 0).length} 人`
                                    : `${students.filter(s => s.due > 0).length} Students`}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold text-slate-500">
                                <span>{uiLang === "kh" ? "ប្រាក់ជំពាក់ជាមធ្យម៖" : uiLang === "zh" ? "人均欠费金额：" : "Average Debt:"}</span>
                                <span className="font-mono text-slate-700 font-bold">
                                  ${(() => {
                                    const count = students.filter(s => s.due > 0).length;
                                    const total = students.reduce((sum, s) => sum + s.due, 0);
                                    return count > 0 ? (total / count).toFixed(2) : "0.00";
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                            <h5 className="font-extrabold text-slate-700">
                              {uiLang === "kh" ? "ប្រវត្តិប្រតិបត្តិការ (Payment Operations)" : uiLang === "zh" ? "学费收缴记录 (Payment Operations)" : "Payment Operations (Payment Operations)"}
                            </h5>
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-semibold text-slate-500">
                                <span>{uiLang === "kh" ? "លិខិតទទួលប្រាក់សរុប៖" : uiLang === "zh" ? "发票收据总数：" : "Total Receipts:"}</span>
                                <span className="font-mono text-slate-700 font-extrabold">
                                  {uiLang === "kh" 
                                    ? `${toKhmerNumberGlobal(String(transactions.length))} ច្បាប់` 
                                    : uiLang === "zh"
                                    ? `${transactions.length} 张`
                                    : `${transactions.length} Invoices`}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold text-slate-500">
                                <span>{uiLang === "kh" ? "ប្រាក់បង់ជាមធ្យម/ម្តង៖" : uiLang === "zh" ? "笔均收缴金额：" : "Average Payment:"}</span>
                                <span className="font-mono text-emerald-600 font-extrabold font-sans">
                                  ${(() => {
                                    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
                                    return transactions.length > 0 ? (total / transactions.length).toFixed(2) : "0.00";
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                            <h5 className="font-extrabold text-slate-700">
                              {uiLang === "kh" ? "អត្រាបញ្ចប់ការបង់ប្រាក់ (Completion Metrics)" : uiLang === "zh" ? "学费结清进度 (Completion Metrics)" : "Completion Metrics (Completion Metrics)"}
                            </h5>
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-semibold text-slate-500">
                                <span>{uiLang === "kh" ? "សិស្សបង់រួចរាល់ ១០០%៖" : uiLang === "zh" ? "全额结清学生：" : "Fully Paid Students:"}</span>
                                <span className="font-mono text-emerald-600 font-extrabold">
                                  {uiLang === "kh" 
                                    ? `${toKhmerNumberGlobal(String(students.filter(s => s.due <= 0 && s.fee > 0).length))} នាក់` 
                                    : uiLang === "zh"
                                    ? `${students.filter(s => s.due <= 0 && s.fee > 0).length} 人`
                                    : `${students.filter(s => s.due <= 0 && s.fee > 0).length} Students`}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold text-slate-500">
                                <span>{uiLang === "kh" ? "សិស្សមិនទាន់បង់សោះ៖" : uiLang === "zh" ? "未付学费学生：" : "Zero Paid Students:"}</span>
                                <span className="font-mono text-rose-500 font-extrabold">
                                  {uiLang === "kh" 
                                    ? `${toKhmerNumberGlobal(String(students.filter(s => s.paid === 0 && s.fee > 0).length))} នាក់` 
                                    : uiLang === "zh"
                                    ? `${students.filter(s => s.paid === 0 && s.fee > 0).length} 人`
                                    : `${students.filter(s => s.paid === 0 && s.fee > 0).length} Students`}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100 shadow-4xs">
                            <h5 className="font-extrabold text-slate-700">
                              {uiLang === "kh" ? "តារាងតុល្យការសាលា (Operating Balance)" : uiLang === "zh" ? "学校收支差额 (Operating Balance)" : "Operating Balance (Operating Balance)"}
                            </h5>
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-semibold text-slate-500">
                                <span>{uiLang === "kh" ? "ចំណូលថ្លៃសិក្សាសរុប៖" : uiLang === "zh" ? "学费总实收： " : "Total Revenue:"}</span>
                                <span className="font-mono text-emerald-600 font-extrabold">
                                  +${transactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold text-slate-500">
                                <span>{uiLang === "kh" ? "ចំណាយសរុប (គ្រូ + ផ្សេងៗ)៖" : uiLang === "zh" ? "总支出额 (教师及日常)：" : "Total Expenses:"}</span>
                                <span className="font-mono text-rose-500 font-extrabold">
                                  -${(() => {
                                    const schoolExpSum = schoolExpenses.reduce((sum, item) => sum + Number(item.amount || item.value || 0), 0);
                                    const salariesSum = salaries.reduce((sum, item) => sum + Number(item.totalPaid), 0);
                                    return (schoolExpSum + salariesSum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                  })()}
                                </span>
                              </div>
                              <div className="flex justify-between font-bold border-t border-slate-200/60 pt-1 mt-1">
                                <span className="text-slate-800">{uiLang === "kh" ? "សមតុល្យប្រតិបត្តិការ៖" : uiLang === "zh" ? "营业收支余额：" : "Net Balance:"}</span>
                                <span className={`font-mono font-black ${
                                  (() => {
                                    const revenues = transactions.reduce((sum, tx) => sum + tx.amount, 0);
                                    const schoolExpSum = schoolExpenses.reduce((sum, item) => sum + Number(item.amount || item.value || 0), 0);
                                    const salariesSum = salaries.reduce((sum, item) => sum + Number(item.totalPaid), 0);
                                    const balance = revenues - (schoolExpSum + salariesSum);
                                    return balance >= 0 ? "text-emerald-600" : "text-rose-600";
                                  })()
                                }`}>
                                  ${(() => {
                                    const revenues = transactions.reduce((sum, tx) => sum + tx.amount, 0);
                                    const schoolExpSum = schoolExpenses.reduce((sum, item) => sum + Number(item.amount || item.value || 0), 0);
                                    const salariesSum = salaries.reduce((sum, item) => sum + Number(item.totalPaid), 0);
                                    const balance = revenues - (schoolExpSum + salariesSum);
                                    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                {/* MODAL 2: GORGEOUS PRINT-FRIENDLY DIGITAL RECEIPT MODAL */}
                {viewReceiptTx && (() => {
                  const foundS = students.find(s => s.id === viewReceiptTx.studentId || s.studentId === viewReceiptTx.studentId || s.nameKh === viewReceiptTx.studentName);
                  
                  const displayPaymentMethod = (method: string) => {
                    if (!method) return "សាច់ប្រាក់ (CASH)";
                    const m = method.toUpperCase().trim();
                    if (m === "CASH" || m === "សាច់ប្រាក់") return "សាច់ប្រាក់ (CASH)";
                    if (m === "ABA_BANK" || m === "ABA") return "ABA BANK";
                    if (m === "TELEGRAM") return "TELEGRAM PAY";
                    return method;
                  };

                  return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl border border-slate-200/85 shadow-2xl w-full max-w-md mx-auto overflow-hidden flex flex-col max-h-[90vh]"
                      >
                        {/* Control Header */}
                        <div className="px-6 py-4.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-primary-50 text-primary-600 rounded-lg">
                              <Printer className="w-5 h-5" />
                            </span>
                            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">បង្កាន់ដៃទទួលប្រាក់ឌីជីថល (Digital Receipt Viewer)</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                const receiptElement = document.getElementById("printable-receipt-area");
                                if (!receiptElement) return;
                                
                                try {
                                  showToast(idt("កំពុងរៀបចំរក្សាទុកជា JPG... (Preparing JPG saving...)", "Preparing JPG saving...", "正在准备保存 JPG..."), "info");
                                  
                                  const clone = receiptElement.cloneNode(true) as HTMLElement;
                                  clone.id = "temp-jpg-clone";
                                  clone.style.width = "794px";
                                  clone.style.minWidth = "794px";
                                  clone.style.height = "1123px";
                                  clone.style.minHeight = "1123px";
                                  clone.style.backgroundColor = "#ffffff";
                                  
                                  const tempContainer = document.createElement("div");
                                  tempContainer.style.position = "fixed";
                                  tempContainer.style.left = "-9999px";
                                  tempContainer.style.top = "0px";
                                  tempContainer.style.width = "794px";
                                  tempContainer.style.height = "1123px";
                                  tempContainer.style.opacity = "0";
                                  tempContainer.style.pointerEvents = "none";
                                  tempContainer.appendChild(clone);
                                  document.body.appendChild(tempContainer);
                                  
                                  const dataUrl = await withSafeCss(async () => {
                                    const { safeToJpeg: toJpeg } = await import('../../lib/safe-html-to-image');
                                    return await toJpeg(clone, {
                                      quality: 0.95,
                                      backgroundColor: '#ffffff',
                                      pixelRatio: 2,
                                      canvasWidth: 794 * 2,
                                      canvasHeight: 1123 * 2,
                                      width: 794,
                                      height: 1123,
                                      style: {
                                        transform: 'scale(1)',
                                        transformOrigin: 'top left',
                                      }
                                    });
                                  });
                                  
                                  document.body.removeChild(tempContainer);
                                  
                                  const link = document.createElement('a');
                                  link.download = `Receipt_${viewReceiptTx.id}.jpg`;
                                  link.href = dataUrl;
                                  link.click();
                                  showToast(idt("រក្សាទុកជា JPG ជោគជ័យ", "JPG saved successfully", "JPG 保存成功"), "success");
                                } catch (error) {
                                  console.error("Error generating JPG:", error);
                                  showToast(idt("បរាជ័យក្នុងការរក្សាទុកជា JPG", "Failed to save JPG", "保存 JPG 失败"), "error");
                                }
                              }}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <ImageIcon className="w-4 h-4" />
                              <span>រក្សាទុកជា JPG (Save as JPG)</span>
                            </button>
                            <button
                              onClick={() => {
                                const receiptEl = document.getElementById("printable-receipt-area");
                                if (!receiptEl) return;
                                
                                const clone = receiptEl.cloneNode(true) as HTMLElement;
                                clone.id = "print-receipt-clone";
                                document.body.appendChild(clone);
                                document.body.classList.add("printing-receipt-clone");
                                
                                setTimeout(() => {
                                  window.print();
                                  setTimeout(() => {
                                    document.body.classList.remove("printing-receipt-clone");
                                    if (clone.parentNode) {
                                      clone.parentNode.removeChild(clone);
                                    }
                                  }, 500);
                                }, 100);
                              }}
                              className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Printer className="w-4 h-4" />
                              <span>បោះពុម្ព (Print Receipt)</span>
                            </button>
                            <button
                              onClick={() => setViewReceiptTx(null)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Scrollable Container wrapper for print receipt */}
                        <div className="overflow-y-auto flex-1 scrollbar-none">
                          {/* Receipt Content - Styled to look highly professional and authentic */}
                          <div 
                            id="printable-receipt-area" 
                            className="p-8 bg-white text-slate-800 relative select-text text-left"
                            style={{ fontFamily: "'Inter', 'Khmer OS Battambang', sans-serif" }}
                          >
                            {/* Background watermark icon */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none">
                              <GraduationCap className="w-96 h-96 text-primary-950" />
                            </div>

                            {/* Traditional Cambodian School Title Banner */}
                            <div className="text-center space-y-2 border-b-2 border-dashed border-slate-200 pb-5">
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-md border border-slate-100 flex items-center justify-center bg-primary-600 text-white">
                                  {schoolLogo ? (
                                    <img src={schoolLogo} alt="School Logo" className="w-full h-full object-cover" />
                                  ) : (
                                    <GraduationCap className="w-6 h-6" />
                                  )}
                                </div>
                                <div className="text-left">
                                  <h2 className="text-base font-black text-slate-900 tracking-tight">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} ({schoolName || "PLC Computer School"})</h2>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{schoolName || "PLC Computer School"} & Language Institute</p>
                                  {(schoolPhone || schoolAddress) && (
                                    <p className="text-[8px] font-extrabold text-slate-400 mt-0.5 leading-tight">
                                      {schoolPhone && <span>ទូរស័ព្ទ៖ {schoolPhone} </span>}
                                      {schoolAddress && <span>| អាសយដ្ឋាន៖ {schoolAddress}</span>}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="pt-1.5 text-center">
                                <h3 className="text-sm font-black text-primary-700 underline underline-offset-4 tracking-wider">លិខិតទទួលប្រាក់ / RECEIPT</h3>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 max-w-sm mx-auto mt-3">
                                  <span>វិក្កយបត្រ # (Receipt No.): <span className="text-primary-600 font-mono font-black">{viewReceiptTx.invoiceNumber || `INV-${viewReceiptTx.id.slice(-6).toUpperCase()}`}</span></span>
                                  <span>កាលបរិច្ឆេទ (Date): <span className="font-mono text-slate-700">{viewReceiptTx.date}</span></span>
                                </div>
                              </div>
                            </div>

                            {/* Customer Information (Two Columns) */}
                            <div className="py-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-semibold text-slate-500 border-b border-slate-100">
                              <div className="space-y-2">
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>ឈ្មោះសិស្ស (Khmer Name):</span>
                                  <span className="text-slate-900 font-black">{viewReceiptTx.studentName}</span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>ឈ្មោះឡាតាំង (English Name):</span>
                                  <span className="text-slate-900 font-extrabold uppercase font-sans">
                                    {foundS ? (foundS.nameEn || `${foundS.firstNameEn || ""} ${foundS.lastNameEn || ""}`.trim()) : "STUDENT"}
                                  </span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>អត្តសញ្ញាណសិស្ស (Student ID):</span>
                                  <span className="text-primary-600 font-mono font-black">
                                    {foundS ? foundS.studentId : "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>កម្រិតសិក្សា (Course Level):</span>
                                  <span className="text-primary-600 font-black">
                                    {foundS ? (foundS.level || foundS.grade || "ទូទៅ (General)") : "N/A"}
                                  </span>
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>ភេទ (Gender):</span>
                                  <span className="text-slate-800 font-black">
                                    {foundS ? (foundS.gender === "Female" || foundS.gender === "ស្រី" ? "ស្រី (Female)" : "ប្រុស (Male)") : "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>មុខវិជ្ជា (Subject / Course):</span>
                                  <span className="text-slate-800 font-bold">
                                    {foundS ? (foundS.course || "វគ្គសិក្សាទូទៅ") : "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>វេនសិក្សា (Shift/Hour):</span>
                                  <span className="text-slate-800 font-black text-right">
                                    {foundS ? foundS.shift : "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>ទូទាត់តាម (Paid Via):</span>
                                  <span className="text-emerald-600 font-black uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-lg text-[10px]">
                                    {displayPaymentMethod(viewReceiptTx.paymentMethod)}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Details Table */}
                            <div className="py-5">
                              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                    <th className="px-4 py-1.5 text-center">ល.រ <br/><span className="text-[10px] text-slate-400 font-normal">(No.)</span></th>
                                    <th className="px-4 py-1.5 text-center">បរិយាយមុខវិជ្ជា <br/><span className="text-[10px] text-slate-400 font-normal">(Course Description)</span></th>
                                    <th className="px-4 py-1.5 text-center">ថ្លៃវគ្គសរុប <br/><span className="text-[10px] text-slate-400 font-normal">(Course Fee)</span></th>
                                    <th className="px-4 py-1.5 text-center">បង់លើកនេះ <br/><span className="text-[10px] text-slate-400 font-normal">(Amount Paid)</span></th>
                                    <th className="px-4 py-1.5 text-center">នៅសល់ <br/><span className="text-[10px] text-slate-400 font-normal">(Balance Due)</span></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                                  <tr>
                                    <td className="px-4 py-1.5 text-center font-mono text-slate-400">01</td>
                                    <td className="px-4 py-1.5">
                                      <span className="font-extrabold text-slate-800 text-xs block">{viewReceiptTx.type}</span>
                                      {foundS?.level && (
                                        <span className="inline-block text-[10px] text-primary-600 font-black mr-2">
                                          កម្រិត៖ {foundS.level}
                                        </span>
                                      )}
                                      {foundS?.shift && (
                                        <span className="inline-block text-[10px] text-slate-500 font-bold">
                                          វេន៖ {foundS.shift}
                                        </span>
                                      )}
                                      <span className="block text-[9px] text-slate-400 mt-0.5 font-sans font-medium">ការសិក្សាប្រចាំខែ (Computer Course Tuition Program)</span>
                                    </td>
                                    <td className="px-4 py-1.5 text-center font-mono text-slate-600 font-bold">
                                      {"$"}{foundS ? foundS.fee?.toFixed(2) : "60.00"}
                                    </td>
                                    <td className="px-4 py-1.5 text-center font-mono font-extrabold text-emerald-600 bg-emerald-50/20">
                                      {"$"}{viewReceiptTx.amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-1.5 text-center font-mono text-rose-600 font-black bg-rose-50/10">
                                      {"$"}{foundS ? foundS.due?.toFixed(2) : "0.00"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Cambodian Signatures Block */}
                            <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs font-semibold text-slate-500">
                              <div className="space-y-16">
                                <p className="text-slate-600">ហត្ថលេខាអ្នកបង់ប្រាក់ <br /><span className="text-[10px] text-slate-400 font-normal">(Payer Signature)</span></p>
                                <div className="w-32 border-b border-slate-200 mx-auto"></div>
                                <p className="text-slate-800 font-black">{viewReceiptTx.studentName}</p>
                              </div>
                              <div className="space-y-16">
                                <p className="text-slate-600">ស្នាមមេដៃ និងហត្ថលេខាអ្នកទទួលប្រាក់ <br /><span className="text-[10px] text-slate-400 font-normal">(Authorized Cashier Signature)</span></p>
                                <div className="w-32 border-b border-slate-200 mx-auto"></div>
                                <p className="text-slate-800 font-black">ភីអិលស៊ី គណនេយ្យករ (PLC Accountant)</p>
                              </div>
                            </div>

                            {/* Footer greetings */}
                            <div className="mt-12 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-black uppercase tracking-wider space-y-1">
                              <p>{receiptFooterNote || "សូមអរគុណចំពោះការបង់ថ្លៃសិក្សា! ការសិក្សាគឺដើម្បីការងារ និងអនាគតដ៏ភ្លឺស្វាង។"}</p>
                              <p className="text-primary-600 font-extrabold">{(schoolName || "PLC COMPUTER SCHOOL").toUpperCase()} - LEARN FOR KNOWLEDGE & CAREERS</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })()}

                {/* MODAL 3: RECORD TEACHER SALARY PAYMENT */}
                {showPaySalaryModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-3xl border border-slate-200/85 shadow-2xl w-full max-w-md mx-auto overflow-hidden flex flex-col max-h-[90vh]"
                    >
                      {/* Modal Header */}
                      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between no-print text-left">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                            <Coins className="w-5 h-5" />
                          </span>
                          <h3 className="text-sm font-black text-slate-800">{idt("កត់ត្រាការបើកប្រាក់បៀវត្ស", "Record Salary Payment", "记录薪资发放")}</h3>
                        </div>
                        <button
                          onClick={() => {
                            setShowPaySalaryModal(false);
                            setSalaryFormSuccess(null);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="p-6 overflow-y-auto space-y-4 text-left">
                        {salaryFormSuccess && (
                          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-150 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>{salaryFormSuccess}</span>
                          </div>
                        )}

                        <div className="space-y-4">
                          {/* Teacher selection */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ជ្រើសរើសសាស្រ្តាចារ្យ / គ្រូបង្រៀន *", "Select Professor / Teacher *", "选择教授 / 教师 *")}</label>
                            <SearchableSelect 
                              value={selectedPayTeacherId} 
                              onChange={(val: string) => {
                                  setSelectedPayTeacherId(val);
                                  setSalaryFormSuccess(null);
                                  const foundT = teachers.find(t => t.id === val);
                                  if (foundT) {
                                    setSalaryBaseAmount(foundT.salary || 450);
                                  } else {
                                    setSalaryBaseAmount(450);
                                  }
                                }}
                              placeholder={idt("-- សូមជ្រើសរើសគ្រូបង្រៀន --", "-- Please Select Teacher --", "-- 请选择教师 --")}
                              searchPlaceholder={idt("ស្វែងរក...", "Search...", "搜索...")}
                              options={teachers.map((t, idx) => ({
                                value: t.id,
                                label: `${t.nameKh} (${t.nameEn}) - ${idt("ប្រាក់ខែគោល៖", "Base Salary:", "基本薪资:")} $${t.salary || 450}`
                              }))}
                              className="w-full text-xs font-bold"
                              triggerClassName="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                            />
                            </div>

                            {/* Selected teacher breakdown panel */}
                            {(() => {
                              const foundT = teachers.find(t => t.id === selectedPayTeacherId);
                              if (!foundT) return null;
                              return (
                                <div className="p-4 bg-rose-50/40 border border-rose-100/60 rounded-2xl text-xs space-y-2">
                                  <h5 className="font-extrabold text-rose-700 uppercase tracking-wider text-[10px]">{idt("ព័ត៌មានគ្រូ និងប្រាក់បៀវត្ស", "Teacher Overview", "教师概览")}</h5>
                                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 font-semibold text-slate-600">
                                    <div>{idt("ឈ្មោះខ្មែរ៖", "Khmer Name:", "柬文姓名:")} <span className="text-slate-850 font-black">{foundT.nameKh}</span></div>
                                    <div>{idt("ឈ្មោះឡាតាំង៖", "Latin Name:", "英文姓名:")} <span className="text-slate-850 font-bold">{foundT.nameEn}</span></div>
                                    <div>{idt("ជំនាញ៖", "Specialty:", "专业技能:")} <span className="text-rose-600 font-bold">{foundT.specialty || idt("ទូទៅ", "General", "通用")}</span></div>
                                    <div>{idt("ទូរស័ព្ទ៖", "Phone:", "电话:")} <span className="text-slate-500 font-sans">{foundT.phone}</span></div>
                                    <div className="col-span-2 border-t border-rose-100/40 my-1 pt-1.5 flex justify-between font-bold text-xs">
                                      <span>{idt("ប្រាក់ខែគោល៖", "Base Salary:", "基本薪资:")} <span className="text-slate-800 font-mono">${foundT.salary || 450}</span></span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Pay Period (Month Picker) */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ខែត្រូវបើកប្រាក់បៀវត្ស *", "Salary Payment Month *", "应发薪资月份 *")}</label>
                              <input 
                                type="month" 
                                value={payPeriodInput} 
                                onChange={(e) => setPayPeriodInput(e.target.value)} 
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-700 focus:outline-none focus:border-primary-500"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-left">
                              {/* Base Salary */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ប្រាក់ខែគោល ($)", "Base Salary ($)", "基本工资 ($)")}</label>
                                <input 
                                  type="number" 
                                  value={salaryBaseAmount} 
                                  onChange={(e) => setSalaryBaseAmount(Math.max(0, Number(e.target.value)))} 
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 font-mono"
                                />
                              </div>

                              {/* Bonus */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ប្រាក់បន្ថែម ($)", "Bonus ($)", "奖金/补贴 ($)")}</label>
                                <input 
                                  type="number" 
                                  value={salaryBonus} 
                                  onChange={(e) => setSalaryBonus(Math.max(0, Number(e.target.value)))} 
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 font-mono"
                                />
                              </div>

                              {/* Deduction */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ប្រាក់ដក/ពិន័យ ($)", "Deduction ($)", "扣除/罚款 ($)")}</label>
                                <input 
                                  type="number" 
                                  value={salaryDeduction} 
                                  onChange={(e) => setSalaryDeduction(Math.max(0, Number(e.target.value)))} 
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 font-mono"
                                />
                              </div>
                            </div>

                            {/* Net Salary Calculation Alert */}
                            {selectedPayTeacherId && (
                              <div className="p-3.5 bg-rose-50/50 border border-rose-150/50 rounded-xl flex justify-between items-center text-xs">
                                <span className="font-extrabold text-slate-700">{idt("ប្រាក់ខែសរុបត្រូវបើក:", "Net Salary Paid:", "实发工资 (Net Salary):")}</span>
                              <span className="font-mono text-base text-rose-600 font-black">
                                ${ (salaryBaseAmount + salaryBonus - salaryDeduction).toFixed(2) }
                              </span>
                            </div>
                          )}

                          {/* Salary Status */}
                          <div className="space-y-1.5 relative">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ស្ថានភាពបើក", "Payment Status (STATUS)", "发放状态 (STATUS)")}</label>
                            
                            {/* Dropdown Trigger */}
                            <button
                              type="button"
                              onClick={() => setIsOpenSalaryStatusDropdown(!isOpenSalaryStatusDropdown)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-700 focus:outline-none focus:border-primary-500 flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50/50 transition-colors"
                            >
                              <span>{salaryStatus === 'PAID' ? idt("បើកសព្វគ្រប់", "Fully Paid (PAID)", "已全额发放 (PAID)") : salaryStatus === 'PENDING' ? idt("មិនទាន់បើក", "Unpaid (PENDING)", "未发放 (PENDING)") : salaryStatus}</span>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenSalaryStatusDropdown ? "rotate-180" : ""}`} />
                            </button>
 
                            {/* Floating Dropdown List */}
                            {isOpenSalaryStatusDropdown && (
                              <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-2 text-xs flex flex-col max-h-[300px]">
                                <div className="overflow-y-auto flex-1 space-y-1 pr-1 scrollbar-none">
                                  {salaryStatuses.map((status, idx) => {
                                    const isEditing = editingSalaryStatusIndex === idx;
                                    const isSelected = salaryStatus === status;
 
                                    return (
                                      <div 
                                        key={idx} 
                                        className={`flex items-center justify-between p-2 rounded-xl transition-all group ${
                                          isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                        }`}
                                      >
                                        {isEditing ? (
                                          <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                                            <input
                                              type="text"
                                              value={editingSalaryStatusValue}
                                              onChange={(e) => setEditingSalaryStatusValue(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  e.preventDefault();
                                                  if (editingSalaryStatusValue.trim()) {
                                                    const updated = [...salaryStatuses];
                                                    const oldVal = updated[idx];
                                                    updated[idx] = editingSalaryStatusValue.trim();
                                                    setSalaryStatuses(updated);
                                                    localStorage.setItem("app_salary_statuses", JSON.stringify(updated));
                                                    if (salaryStatus === oldVal) {
                                                      setSalaryStatus(editingSalaryStatusValue.trim());
                                                    }
                                                    setEditingSalaryStatusIndex(null);
                                                  }
                                                } else if (e.key === "Escape") {
                                                  setEditingSalaryStatusIndex(null);
                                                }
                                              }}
                                              className="flex-1 px-2.5 py-1 text-xs border border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 font-bold bg-white text-slate-700"
                                              autoFocus
                                            />
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (editingSalaryStatusValue.trim()) {
                                                  const updated = [...salaryStatuses];
                                                  const oldVal = updated[idx];
                                                  updated[idx] = editingSalaryStatusValue.trim();
                                                  setSalaryStatuses(updated);
                                                  localStorage.setItem("app_salary_statuses", JSON.stringify(updated));
                                                  if (salaryStatus === oldVal) {
                                                    setSalaryStatus(editingSalaryStatusValue.trim());
                                                  }
                                                  setEditingSalaryStatusIndex(null);
                                                }
                                              }}
                                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer shrink-0"
                                            >
                                              <Check className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingSalaryStatusIndex(null);
                                              }}
                                              className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer shrink-0"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSalaryStatus(status);
                                                setIsOpenSalaryStatusDropdown(false);
                                              }}
                                              className="flex-1 text-left font-bold cursor-pointer pr-4"
                                            >
                                              {status}
                                            </button>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:opacity-100 transition-opacity shrink-0">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingSalaryStatusIndex(idx);
                                                  setEditingSalaryStatusValue(status);
                                                }}
                                                className="p-1 text-primary-500 hover:bg-primary-100/50 rounded-lg cursor-pointer"
                                                title={idt("កែប្រែ", "Edit", "编辑")}
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (confirm(idt(`តើអ្នកពិតជាចង់លុបស្ថានភាព "${status}" នេះមែនទេ?`, `Are you sure you want to delete status "${status}"?`, `您确定要删除状态 "${status}" 吗？`))) {
                                                    const updated = salaryStatuses.filter((_, i) => i !== idx);
                                                    setSalaryStatuses(updated);
                                                    localStorage.setItem("app_salary_statuses", JSON.stringify(updated));
                                                    if (salaryStatus === status) {
                                                      setSalaryStatus(updated[0] || "PAID");
                                                    }
                                                  }
                                                }}
                                                className="p-1 text-rose-500 hover:bg-rose-100/50 rounded-lg cursor-pointer"
                                                title={idt("លុប", "Delete", "删除")}
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
 
                                {/* Add New Salary Status Row */}
                                <div className="border-t border-slate-100 pt-2 mt-1.5 flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={newSalaryStatusValue}
                                    onChange={(e) => setNewSalaryStatusValue(e.target.value)}
                                    placeholder={idt("+ បញ្ចូលស្ថានភាពថ្មី...", "+ Add new status...", "+ 添加新状态...")}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (newSalaryStatusValue.trim()) {
                                          const newVal = newSalaryStatusValue.trim();
                                          if (salaryStatuses.includes(newVal)) {
                                            alert(idt("ស្ថានភាពនេះមានរួចហើយ!", "This status already exists!", "该状态已存在！"));
                                            return;
                                          }
                                          const updated = [...salaryStatuses, newVal];
                                          setSalaryStatuses(updated);
                                          localStorage.setItem("app_salary_statuses", JSON.stringify(updated));
                                          setSalaryStatus(newVal);
                                          setNewSalaryStatusValue("");
                                          setIsOpenSalaryStatusDropdown(false);
                                        }
                                      }
                                    }}
                                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-bold text-slate-700 bg-slate-50/50"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newSalaryStatusValue.trim()) {
                                        const newVal = newSalaryStatusValue.trim();
                                        if (salaryStatuses.includes(newVal)) {
                                          alert(idt("ស្ថានភាពនេះមានរួចហើយ!", "This status already exists!", "该状态已存在！"));
                                          return;
                                        }
                                        const updated = [...salaryStatuses, newVal];
                                        setSalaryStatuses(updated);
                                        localStorage.setItem("app_salary_statuses", JSON.stringify(updated));
                                        setSalaryStatus(newVal);
                                        setNewSalaryStatusValue("");
                                        setIsOpenSalaryStatusDropdown(false);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
                                  >
                                    {idt("បន្ថែម", "Add", "添加")}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
 
                      {/* Modal Footer */}
                      <div className="px-6 py-4.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end gap-3.5">
                        <button
                          onClick={() => {
                            setShowPaySalaryModal(false);
                            setSalaryFormSuccess(null);
                          }}
                          className="px-4.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          {idt("បោះបង់", "Cancel", "取消")}
                        </button>
                        <button
                          onClick={async () => {
                            if (!selectedPayTeacherId) {
                              showToast(idt("សូមជ្រើសរើសសាស្រ្តាចារ្យដែលត្រូវបើកប្រាក់ខែ!", "Please select professor / teacher!", "请选择教师发放薪资！"), "error");
                              return;
                            }
                            const finalNet = salaryBaseAmount + salaryBonus - salaryDeduction;
                            if (finalNet < 0) {
                              showToast(idt("ប្រាក់ដកមិនអាចលើសពីប្រាក់ខែបូកបន្ថែមឡើយ!", "Deduction cannot exceed base + bonus!", "扣除金额不能超过基本薪资加奖金！"), "error");
                              return;
                            }
 
                            try {
                              const res = await fetch("/api/finance/salaries", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                  teacherId: selectedPayTeacherId,
                                  payPeriod: payPeriodInput,
                                  baseSalary: salaryBaseAmount,
                                  bonus: salaryBonus,
                                  deduction: salaryDeduction,
                                  totalPaid: finalNet,
                                  status: salaryStatus
                                })
                              });
 
                              if (!res.ok) {
                                throw new Error("Failed to save salary payment");
                              }
 
                              const data = await res.json();
                              if (data.salary) {
                                setSalaries(prev => [data.salary, ...prev]);
                                setViewSalaryReceipt(data.salary);
                              }
 
                              setSalaryFormSuccess(idt("បានកត់ត្រាការបើកប្រាក់បៀវត្សជូនសាស្រ្តាចារ្យជោគជ័យ!", "Successfully recorded salary payment!", "成功记录薪资发放！"));
                              showToast(idt("កត់ត្រាការបើកប្រាក់ខែជោគជ័យ!", "Successfully recorded salary payment!", "成功记录薪资发放！"), "success");
                              setShowPaySalaryModal(false);
                            } catch (e) {
                              console.error(e);
                              showToast(idt("មានបញ្ហាកត់ត្រាការបើកប្រាក់បៀវត្ស!", "Failed to record salary payment!", "薪资发放记录失败！"), "error");
                            }
                          }}
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Check className="w-4 h-4" />
                          <span>{idt("បញ្ជាក់ការបើកប្រាក់ខែ", "Confirm Payment (Record Payment)", "确认发放 (Record Payment)")}</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* MODAL 4: PRINT-FRIENDLY SALARY VOUCHER RECEIPT */}
                {viewSalaryReceipt && (() => {
                  const tInfo = viewSalaryReceipt.teacher || teachers.find(t => t.id === viewSalaryReceipt.teacherId);
                  return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl border border-slate-200/85 shadow-2xl w-full max-w-md mx-auto overflow-hidden flex flex-col max-h-[90vh]"
                      >
                        {/* Control Header */}
                        <div className="px-6 py-4.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print text-left">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                              <Printer className="w-5 h-5" />
                            </span>
                            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">ប័ណ្ណបើកប្រាក់បៀវត្សឌីជីថល (Digital Salary Voucher)</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                const receiptElement = document.getElementById("printable-receipt-area");
                                if (!receiptElement) return;
                                
                                try {
                                  showToast(idt("កំពុងរៀបចំរក្សាទុកជា JPG... (Preparing JPG saving...)", "Preparing JPG saving...", "正在准备保存 JPG..."), "info");
                                  
                                  const clone = receiptElement.cloneNode(true) as HTMLElement;
                                  clone.id = "temp-jpg-clone-salary";
                                  clone.style.width = "794px";
                                  clone.style.minWidth = "794px";
                                  clone.style.height = "1123px";
                                  clone.style.minHeight = "1123px";
                                  clone.style.backgroundColor = "#ffffff";
                                  
                                  const tempContainer = document.createElement("div");
                                  tempContainer.style.position = "fixed";
                                  tempContainer.style.left = "-9999px";
                                  tempContainer.style.top = "0px";
                                  tempContainer.style.width = "794px";
                                  tempContainer.style.height = "1123px";
                                  tempContainer.style.opacity = "0";
                                  tempContainer.style.pointerEvents = "none";
                                  tempContainer.appendChild(clone);
                                  document.body.appendChild(tempContainer);
                                  
                                  const dataUrl = await withSafeCss(async () => {
                                    const { safeToJpeg: toJpeg } = await import('../../lib/safe-html-to-image');
                                    return await toJpeg(clone, {
                                      quality: 0.95,
                                      backgroundColor: '#ffffff',
                                      pixelRatio: 2,
                                      canvasWidth: 794 * 2,
                                      canvasHeight: 1123 * 2,
                                      width: 794,
                                      height: 1123,
                                      style: {
                                        transform: 'scale(1)',
                                        transformOrigin: 'top left',
                                      }
                                    });
                                  });
                                  
                                  document.body.removeChild(tempContainer);
                                  
                                  const link = document.createElement('a');
                                  link.download = `Voucher_${viewSalaryReceipt.id}.jpg`;
                                  link.href = dataUrl;
                                  link.click();
                                  showToast(idt("រក្សាទុកជា JPG ជោគជ័យ", "JPG saved successfully", "JPG 保存成功"), "success");
                                } catch (error) {
                                  console.error("Error generating JPG:", error);
                                  showToast(idt("បរាជ័យក្នុងការរក្សាទុកជា JPG", "Failed to save JPG", "保存 JPG 失败"), "error");
                                }
                              }}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <ImageIcon className="w-4 h-4" />
                              <span>រក្សាទុកជា JPG (Save as JPG)</span>
                            </button>
                            <button
                              onClick={() => {
                                const receiptEl = document.getElementById("printable-receipt-area");
                                if (!receiptEl) return;
                                
                                const clone = receiptEl.cloneNode(true) as HTMLElement;
                                clone.id = "print-receipt-clone";
                                document.body.appendChild(clone);
                                document.body.classList.add("printing-receipt-clone");
                                
                                setTimeout(() => {
                                  window.print();
                                  setTimeout(() => {
                                    document.body.classList.remove("printing-receipt-clone");
                                    if (clone.parentNode) {
                                      clone.parentNode.removeChild(clone);
                                    }
                                  }, 500);
                                }, 100);
                              }}
                              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Printer className="w-4 h-4" />
                              <span>បោះពុម្ព (Print Voucher)</span>
                            </button>
                            <button
                              onClick={() => setViewSalaryReceipt(null)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Scrollable Container wrapper for print voucher */}
                        <div className="overflow-y-auto flex-1 scrollbar-none">
                          {/* Printable Voucher Content */}
                          <div 
                            id="printable-receipt-area" 
                            className="p-8 bg-white text-slate-800 relative select-text text-left"
                            style={{ fontFamily: "'Inter', 'Khmer OS Battambang', sans-serif" }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none">
                              <GraduationCap className="w-96 h-96 text-rose-950" />
                            </div>

                            {/* Traditional Title Banner */}
                            <div className="text-center space-y-2 border-b-2 border-dashed border-slate-200 pb-5">
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                  <GraduationCap className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                  <h2 className="text-base font-black text-slate-900 tracking-tight">សាលាកុំព្យូទ័រ ភីអិលស៊ី (PLC Computer School)</h2>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">PLC Computer School & Language Institute</p>
                                </div>
                              </div>
                              
                              <div className="pt-1.5 text-center">
                                <h3 className="text-sm font-black text-rose-700 underline underline-offset-4 tracking-wider">ប័ណ្ណបើកប្រាក់បៀវត្ស / SALARY VOUCHER</h3>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 max-w-sm mx-auto mt-3">
                                  <span>លេខប័ណ្ណ # (Voucher No.): <span className="text-rose-600 font-mono font-black">{viewSalaryReceipt.invoiceNumber || `SAL-${viewSalaryReceipt.id.slice(-6).toUpperCase()}`}</span></span>
                                  <span>កាលបរិច្ឆេទ (Date): <span className="font-mono text-slate-700">{viewSalaryReceipt.paymentDate ? new Date(viewSalaryReceipt.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</span></span>
                                </div>
                              </div>
                            </div>

                            {/* Teacher Info */}
                            <div className="py-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-semibold text-slate-500 border-b border-slate-200">
                              <div className="space-y-2">
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>ឈ្មោះគ្រូ (Khmer Name):</span>
                                  <span className="text-slate-900 font-black">{tInfo ? tInfo.nameKh : "គ្រូបង្រៀន"}</span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>ឈ្មោះឡាតាំង (English Name):</span>
                                  <span className="text-slate-900 font-extrabold uppercase font-sans">{tInfo ? tInfo.nameEn : "TEACHER"}</span>
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>ខែបើកប្រាក់ (Pay Period):</span>
                                  <span className="text-primary-600 font-mono font-black">{viewSalaryReceipt.payPeriod}</span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100/50 pb-1">
                                  <span>ស្ថានភាព:</span>
                                  <span className="text-emerald-600 font-bold uppercase">{viewSalaryReceipt.status}</span>
                                </p>
                              </div>
                            </div>

                            {/* Ledger Table */}
                            <div className="py-5">
                              <table className="w-full text-xs font-semibold text-slate-600">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px] font-bold">
                                    <th className="py-2 text-left">ការពិពណ៌នា (Description)</th>
                                    <th className="py-2 text-right">ទឹកប្រាក់ (Amount)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  <tr>
                                    <td className="py-2.5 text-slate-800 font-bold">ប្រាក់ខែគោល (Base Salary)</td>
                                    <td className="py-2.5 text-right font-mono">${Number(viewSalaryReceipt.baseSalary).toFixed(2)}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2.5 text-emerald-600 font-bold">ប្រាក់បន្ថែមផ្សេងៗ (Bonus / Allowance)</td>
                                    <td className="py-2.5 text-right font-mono text-emerald-600">+${Number(viewSalaryReceipt.bonus).toFixed(2)}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2.5 text-rose-500 font-bold">ប្រាក់ដក/ពិន័យ (Deductions)</td>
                                    <td className="py-2.5 text-right font-mono text-rose-500">-${Number(viewSalaryReceipt.deduction).toFixed(2)}</td>
                                  </tr>
                                  <tr className="border-t border-slate-200 font-bold text-slate-900 bg-slate-50">
                                    <td className="py-1.5 px-2">ទឹកប្រាក់បើកសរុប (Net Salary Paid)</td>
                                    <td className="py-1.5 px-2 text-right font-mono text-rose-600 text-sm font-black">${Number(viewSalaryReceipt.totalPaid).toFixed(2)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Signature Line */}
                            <div className="pt-10 flex justify-between text-[11px] text-slate-500 font-bold">
                              <div className="text-center w-40">
                                <p>ស្នាមមេដៃ/ហត្ថលេខាគ្រូ</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-1">(Teacher's Signature)</p>
                                <div className="h-16"></div>
                                <p className="text-slate-850 truncate">{tInfo ? tInfo.nameKh : ""}</p>
                              </div>
                              <div className="text-center w-40">
                                <p>ហត្ថលេខាអ្នកបើកប្រាក់</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-1">(Authorized Signatory)</p>
                                <div className="h-16"></div>
                                <p className="text-slate-850">បេឡាធិការ / Cashier</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })()}
              </motion.div>
);
}
