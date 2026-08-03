import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, MessageSquare, Send, Bell, User, Phone, AlertCircle, CreditCard, AlignLeft, 
  CheckCircle2, RefreshCw, ExternalLink, ShieldCheck, Calendar, Award, FileText, 
  Receipt, Car, BookOpen, X, Check, ArrowRight
} from 'lucide-react';

export default function ParentPortalTab({ students, uiLang: propUiLang, showToast }: any) {
  const [localLang, setLocalLang] = useState(propUiLang || localStorage.getItem("plc_lang") || "kh");
  const [activeModal, setActiveModal] = useState<string | null>(null);

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

  const idt = (kh: string, en?: string, zh?: string) => {
    if (localLang === "en") return en || kh;
    if (localLang === "zh") return zh || en || kh;
    return kh;
  };

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("absence");
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const selectedStudent = (students || []).find((s: any) => s.id === selectedParent);

  const generateTemplate = (type: string, student: any) => {
    if (!student) return "";
    const nameKh = student.nameKh || student.nameEn || "";
    const nameEn = student.nameEn || "";
    const studentId = student.studentId || "";
    const course = student.course || "";

    switch (type) {
      case "absence":
        return `⚠️ <b>សេចក្តីជូនដំណឹងអំពីអវត្តមាន (Absence Notice)</b>\n\nសូមជម្រាបជូនអាណាព្យាបាលសិស្សឈ្មោះ <b>${nameKh} (${nameEn})</b> [ID: ${studentId}]៖\n\nសិស្សមិនបានចូលរួមរៀនថ្នាក់ <b>${course}</b> នៅថ្ងៃនេះទេ។ សូមអាណាព្យាបាលមេត្តាទំនាក់ទំនងមកសាលាវិញដើម្បីបញ្ជាក់ពីមូលហេតុនៃការអវត្តមាននេះ។\n\nសូមអរគុណ!`;
      case "payment":
        return `💳 <b>សេចក្តីជូនដំណឹងអំពីការបង់ថ្លៃសិក្សា (Tuition Fee Notice)</b>\n\nសូមជម្រាបជូនអាណាព្យាបាលសិស្សឈ្មោះ <b>${nameKh} (${nameEn})</b> [ID: ${studentId}]៖\n\nសូមជម្រាបជូនថា ការបង់ថ្លៃសិក្សារបស់សិស្សសម្រាប់ថ្នាក់ <b>${course}</b> គឺបានមកដល់កាលកំណត់ហើយ។ សូមអាណាព្យាបាលមេត្តាអញ្ជើញមកការិយាល័យគណនេយ្យដើម្បីធ្វើការទូទាត់។\n\nសូមអរគុណ!`;
      case "general":
        return `🔔 <b>សេចក្តីជូនដំណឹងទូទៅ (General Announcement)</b>\n\nសូមជម្រាបជូនអាណាព្យាបាលសិស្សឈ្មោះ <b>${nameKh} (${nameEn})</b> [ID: ${studentId}]៖\n\n[បញ្ចូលខ្លឹមសារសេចក្តីជូនដំណឹងនៅទីនេះ]\n\nសូមអរគុណ!`;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      setMessage(generateTemplate(msgType, selectedStudent));
    }
  }, [selectedParent, msgType]);

  const handleSend = async () => {
    if (message.trim()) {
      setIsSending(true);
      try {
        const token = localStorage.getItem("plc_auth_token");
        const res = await fetch("/api/notifications/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ message: message.trim() })
        });
        
        if (res.ok) {
          if (showToast) {
            showToast(idt("សារត្រូវបានផ្ញើតាម Telegram ដោយជោគជ័យ!", "Telegram message sent successfully!", "消息发送成功！"), "success");
          } else {
            alert(idt("សារត្រូវបានផ្ញើតាម Telegram ដោយជោគជ័យ!", "Telegram message sent successfully!", "消息发送成功！"));
          }
          setMessage("");
        } else {
          if (showToast) {
            showToast(idt("មានបញ្ហាក្នុងការផ្ញើសារ! សូមពិនិត្យការកំណត់ Telegram Bot របស់អ្នក។", "Failed to send message! Check Telegram Bot settings.", "发送消息失败！"), "error");
          } else {
            alert(idt("មានបញ្ហាក្នុងការផ្ញើសារ! សូមពិនិត្យការកំណត់ Telegram Bot របស់អ្នក។", "Failed to send message! Check Telegram Bot settings.", "发送消息失败！"));
          }
        }
      } catch (e) {
        if (showToast) {
          showToast("Network error", "error");
        } else {
          alert("Network error");
        }
      }
      setIsSending(false);
    }
  };

  const filteredStudents = (students || []).filter((s: any) => 
    s.status === 'STUDYING' && (
      (s.nameKh && s.nameKh.includes(search)) || 
      (s.nameEn && s.nameEn.toLowerCase().includes(search.toLowerCase())) || 
      (s.phone && s.phone.includes(search))
    )
  );

  return (
    <div className="bg-slate-50/50 flex flex-col p-4 md:p-8 space-y-6">
      
      {/* 1. TOP MENU SYSTEM OVERVIEW BANNER WITH 7 ACTION CARDS */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black uppercase">
                STUDENT & PARENT PORTAL MENU
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">៧ ឧបករណ៍ពេញលេញ</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 font-serif mt-1">
              {idt("ផ្ទាំងម៉ឺនុយអាណាព្យាបាល និងសិស្ស (Portal Menu System)", "Student & Parent Portal Menu System", "学生与家长门户菜单系统")}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/?portal_student=demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{idt("មើលផ្ទាំង Student Portal ផ្ទាល់", "Preview Student Portal Live", "预览学生门户")}</span>
            </a>
          </div>
        </div>

        {/* 7 MENU GRID CARDS MATCHING REQUEST */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {/* CARD 1: ទទួលកូន (Pickup Student) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveModal("pickup")}
            className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-amber-900 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-3xs group min-h-[110px]"
          >
            <Car className="w-8 h-8 mb-2 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black leading-tight tracking-tight">
              {idt("ទទួលកូន", "Pickup Student", "接送孩子")}
            </span>
          </motion.button>

          {/* CARD 2: បញ្ជីវត្តមាន (Attendance) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveModal("attendance")}
            className="p-4 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 text-blue-900 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-3xs group min-h-[110px]"
          >
            <Calendar className="w-8 h-8 mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black leading-tight tracking-tight">
              {idt("បញ្ជីវត្តមាន", "Attendance", "考勤记录")}
            </span>
          </motion.button>

          {/* CARD 3: លទ្ធផលប្រឡង (Exam Results) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveModal("exams")}
            className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 text-emerald-900 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-3xs group min-h-[110px]"
          >
            <FileText className="w-8 h-8 mb-2 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black leading-tight tracking-tight">
              {idt("លទ្ធផលប្រឡង", "Exam Results", "考试成绩")}
            </span>
          </motion.button>

          {/* CARD 4: តារាងកិត្តិយស (Honor Roll) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveModal("honor")}
            className="p-4 rounded-2xl bg-yellow-50/70 hover:bg-yellow-100/70 border border-yellow-200/80 text-yellow-900 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-3xs group min-h-[110px]"
          >
            <Award className="w-8 h-8 mb-2 text-yellow-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black leading-tight tracking-tight">
              {idt("តារាងកិត្តិយស", "Honor Roll", "光荣榜")}
            </span>
          </motion.button>

          {/* CARD 5: វិក្កយបត្រ (Invoice) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveModal("invoices")}
            className="p-4 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 text-indigo-900 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-3xs group min-h-[110px]"
          >
            <Receipt className="w-8 h-8 mb-2 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black leading-tight tracking-tight">
              {idt("វិក្កយបត្រ", "Invoices", "学费账单")}
            </span>
          </motion.button>

          {/* CARD 6: ប្រវត្តិការបង់ប្រាក់ (Payment History) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveModal("payments")}
            className="p-4 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200/80 text-purple-900 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-3xs group min-h-[110px]"
          >
            <CreditCard className="w-8 h-8 mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black leading-tight tracking-tight">
              {idt("ប្រវត្តិការបង់ប្រាក់", "Payments", "缴费历史")}
            </span>
          </motion.button>

          {/* CARD 7: ថ្នាក់រៀនទាំងអស់ (All Enrolled Classes) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveModal("classes")}
            className="p-4 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-300/80 text-slate-900 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-3xs group min-h-[110px]"
          >
            <BookOpen className="w-8 h-8 mb-2 text-slate-700 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black leading-tight tracking-tight">
              {idt("ថ្នាក់រៀនទាំងអស់", "Classes", "所有班级")}
            </span>
          </motion.button>
        </div>
      </div>

      {/* 2. MESSAGING CENTER PANEL */}
      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-80 lg:w-96 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col shrink-0 self-start">
          <div className="p-5 border-b border-slate-100 bg-white rounded-t-2xl">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-5">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              {idt("ទំនាក់ទំនង", "Communications", "联系")}
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={idt("ស្វែងរកមាតាបិតា...", "Search parents...", "搜索家长...")}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200/80 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 shadow-3xs transition-all placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-3 space-y-1.5 bg-slate-50/30 rounded-b-2xl">
            {filteredStudents.length > 0 ? filteredStudents.map((student: any) => (
              <button
                key={student.id}
                onClick={() => setSelectedParent(student.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3.5 group border ${
                  selectedParent === student.id 
                    ? 'bg-blue-50 border-blue-200/80 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-white hover:border-slate-200 hover:shadow-3xs'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  selectedParent === student.id 
                    ? 'bg-blue-100 border-blue-200 text-blue-600' 
                    : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className={`text-sm font-extrabold truncate transition-colors ${
                    selectedParent === student.id ? 'text-blue-900' : 'text-slate-700 group-hover:text-slate-900'
                  }`}>
                    <span className="font-medium text-xs text-slate-500 mr-1">{idt("អាណាព្យាបាល", "Parent of", "家长")}</span>
                    {student.nameKh}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone className={`w-3 h-3 ${selectedParent === student.id ? 'text-blue-400' : 'text-slate-400'}`} />
                    <p className={`text-xs font-bold truncate ${selectedParent === student.id ? 'text-blue-600' : 'text-slate-500'}`}>
                      {student.phone || '087 850 014 / 097 501 3648'}
                    </p>
                  </div>
                </div>
              </button>
            )) : (
              <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                <Search className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-sm font-medium">{idt("មិនមានទិន្នន័យទេ", "No results found", "未找到结果")}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col relative self-start">
          {selectedParent ? (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 bg-white rounded-t-2xl flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h3 className="font-black text-slate-800 text-xl">{idt("ផ្ញើសារ / សេចក្តីជូនដំណឹង", "Send Message / Notification", "发送消息/通知")}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {idt("ផ្ញើសារ SMS ឬ Telegram ទៅកាន់អាណាព្យាបាល", "Send automated SMS or Telegram message to parent", "向家长发送自动短信或电报消息")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50/80 text-blue-700 rounded-xl text-xs font-bold border border-blue-100/50 shadow-3xs">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </div>
                    <Bell className="w-3.5 h-3.5" /> 
                    {idt("Telegram Active", "Telegram Active", "电报已激活")}
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8 bg-slate-50/30 rounded-b-2xl">
                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Message Type Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">{idt("ជ្រើសរើសប្រភេទសារ", "Select Message Type", "选择消息类型")}</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: 'absence', icon: AlertCircle, label: idt("ជូនដំណឹងអវត្តមាន", "Absence Notice", "缺勤通知"), color: 'orange' },
                        { id: 'payment', icon: CreditCard, label: idt("ការបង់ប្រាក់", "Payment Due", "催款通知"), color: 'red' },
                        { id: 'general', icon: AlignLeft, label: idt("ទូទៅ", "General", "普通消息"), color: 'blue' }
                      ].map(type => (
                        <label key={type.id} className="relative cursor-pointer group">
                          <input 
                            type="radio" 
                            name="msgType" 
                            value={type.id}
                            checked={msgType === type.id}
                            onChange={(e) => setMsgType(e.target.value)}
                            className="peer sr-only" 
                          />
                          <div className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3
                            ${msgType === type.id 
                              ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-3xs'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                              ${msgType === type.id 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-600'
                              }`}
                            >
                              <type.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className={`font-bold text-sm ${msgType === type.id ? 'text-blue-900' : 'text-slate-700'}`}>
                                {type.label}
                              </div>
                            </div>
                            {msgType === type.id && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 text-blue-500">
                                <CheckCircle2 className="w-5 h-5" />
                              </motion.div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div>
                    <div className="flex justify-between items-center mb-3 ml-1">
                      <label className="block text-sm font-bold text-slate-700">{idt("ខ្លឹមសារ", "Content", "内容")}</label>
                      <button 
                        type="button"
                        onClick={() => {
                          if (selectedStudent) {
                            setMessage(generateTemplate(msgType, selectedStudent));
                            if (showToast) {
                              showToast(idt("បានបង្កើតគំរូសារឡើងវិញ!", "Template re-generated!", "模版重新生成！"), "info");
                            }
                          }
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100/80 border border-blue-100 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{idt("បង្កើតសារឡើងវិញ", "Regenerate Message", "重新生成消息")}</span>
                      </button>
                    </div>
                    <div className="relative group">
                      <textarea
                        rows={8}
                        value={message}
                        onChange={(e) => setMessage(e.target.value.substring(0, 10000))}
                        placeholder={idt("វាយបញ្ចូលសារនៅទីនេះ...", "Type your message here...", "在此输入您的消息...")}
                        className="w-full p-5 pb-10 border-2 border-slate-200/80 rounded-2xl text-[15px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white shadow-sm transition-all placeholder:text-slate-400 resize-y"
                      ></textarea>
                      <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 shadow-3xs">
                        {message.length} / 10000
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
                    <button 
                      onClick={() => setMessage("")} 
                      className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-3xs"
                    >
                      {idt("សម្អាត", "Clear", "清除")}
                    </button>
                    <button 
                      onClick={handleSend} 
                      disabled={!message.trim() || isSending} 
                      className="px-8 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-500/25 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 active:scale-[0.98]"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isSending ? idt("កំពុងផ្ញើ...", "Sending...", "发送中...") : idt("ផ្ញើសារ", "Send Message", "发送消息")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 p-12 min-h-[400px] text-center rounded-2xl">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                <MessageSquare className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-700 mb-2">{idt("សូមជ្រើសរើសអាណាព្យាបាល", "Select a Parent", "选择一个家长")}</h3>
              <p className="text-sm font-medium max-w-sm">
                {idt("ជ្រើសរើសអាណាព្យាបាលពីបញ្ជីខាងឆ្វេងដើម្បីចាប់ផ្តើមសរសេរ និងផ្ញើសារ", "Select a parent from the list on the left to start composing and sending a message.", "从左侧列表中选择一位家长，开始撰写和发送消息。")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DIALOGS FOR 7 MENU ITEMS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                    {activeModal === "pickup" && <Car className="w-5 h-5" />}
                    {activeModal === "attendance" && <Calendar className="w-5 h-5" />}
                    {activeModal === "exams" && <FileText className="w-5 h-5" />}
                    {activeModal === "honor" && <Award className="w-5 h-5" />}
                    {activeModal === "invoices" && <Receipt className="w-5 h-5" />}
                    {activeModal === "payments" && <CreditCard className="w-5 h-5" />}
                    {activeModal === "classes" && <BookOpen className="w-5 h-5" />}
                  </div>
                  <h3 className="font-black text-lg text-white font-serif">
                    {activeModal === "pickup" && "ព័ត៌មានទទួលកូន (Pickup Student)"}
                    {activeModal === "attendance" && "បញ្ជីវត្តមានសិស្ស (Attendance Records)"}
                    {activeModal === "exams" && "លទ្ធផលប្រឡងសិស្ស (Exam Results)"}
                    {activeModal === "honor" && "តារាងកិត្តិយស (Honor Roll)"}
                    {activeModal === "invoices" && "វិក្កយបត្រថ្លៃសិក្សា (Tuition Invoices)"}
                    {activeModal === "payments" && "ប្រវត្តិការបង់ប្រាក់ (Payment History)"}
                    {activeModal === "classes" && "ថ្នាក់រៀនទាំងអស់ (Enrolled Classes)"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-4 text-slate-800">
                {selectedStudent ? (
                  <div className="p-3.5 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {selectedStudent.nameKh?.[0] || 'ស'}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-indigo-950">{selectedStudent.nameKh || selectedStudent.nameEn} ({selectedStudent.studentId || 'N/A'})</div>
                        <div className="text-xs text-indigo-700 font-medium mt-0.5">ថ្នាក់៖ {selectedStudent.course || 'កុំព្យូទ័រ & អង់គ្លេស'} | អាណាព្យាបាល៖ {selectedStudent.parentName || 'ស៊ុន សុខត្រា'}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md shrink-0">
                      សិស្សសកម្ម
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>💡 បង្ហាញទិន្នន័យគំរូទូទៅ។ លោកអ្នកអាចជ្រើសរើសសិស្សជាក់ស្តែងពីបញ្ជីខាងឆ្វេង ដើម្បីមើលទិន្នន័យផ្ទាល់ខ្លួន។</span>
                  </div>
                )}

                {/* 1. PICKUP STUDENT */}
                {activeModal === "pickup" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900 uppercase tracking-wider">🚗 ប័ណ្ណទទួលកូនឌីជីថល (Pickup Authorization)</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">ផ្ទៀងផ្ទាត់រួចរាល់</span>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        អាណាព្យាបាលអាចបង្ហាញកាត QR Code នេះទៅកាន់លោកគ្រូអ្នកគ្រូទ្វារសាលា ដើម្បីទទួលកូនចេញពីសាលារៀនប្រកបដោយសុវត្ថិភាព។
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="text-xs font-extrabold text-slate-800 uppercase">ព័ត៌មានអ្នកទទួលកូនដែលបានអនុញ្ញាត៖</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 text-[10px] block font-bold">ឈ្មោះអាណាព្យាបាល</span>
                          <span className="font-bold text-slate-800">{selectedStudent?.parentName || "ស៊ុន សុខត្រា"}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 text-[10px] block font-bold">លេខទូរស័ព្ទអាណាព្យាបាល</span>
                          <span className="font-mono font-bold text-slate-800">{selectedStudent?.phone || "087 850 014"}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 text-[10px] block font-bold">ម៉ោងចេញពីសាលា</span>
                          <span className="font-bold text-slate-800">5:00 PM (ល្ងាច)</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 text-[10px] block font-bold">ស្ថានភាព QR Gate Pass</span>
                          <span className="font-bold text-emerald-600">សកម្ម (Active Pass)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ATTENDANCE */}
                {activeModal === "attendance" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                        <div className="text-lg font-black text-emerald-700">96%</div>
                        <div className="text-[10px] font-bold text-emerald-800">វត្តមានមកសាលា</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                        <div className="text-lg font-black text-amber-700">2 ថ្ងៃ</div>
                        <div className="text-[10px] font-bold text-amber-800">ច្បាប់អនុញ្ញាត</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-center">
                        <div className="text-lg font-black text-red-700">0 ថ្ងៃ</div>
                        <div className="text-[10px] font-bold text-red-800">អវត្តមានឥតច្បាប់</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="text-xs font-bold text-slate-700">កំណត់ត្រាវត្តមានចុងក្រោយ៖</div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center p-2 bg-white rounded-xl border border-slate-200">
                          <span>📅 ថ្ងៃចន្ទ, 03 សីហា 2026 (07:45 AM)</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">វត្តមាន</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-xl border border-slate-200">
                          <span>📅 ថ្ងៃសុក្រ, 31 កក្កដា 2026 (07:50 AM)</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">វត្តមាន</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. EXAM RESULTS */}
                {activeModal === "exams" && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-emerald-950">លទ្ធផលប្រឡងប្រចាំខែចុងក្រោយ</div>
                        <div className="text-[11px] text-emerald-800 mt-0.5">មធ្យមភាគ៖ <b>92.5 / 100</b></div>
                      </div>
                      <span className="text-base font-black px-3 py-1 bg-emerald-600 text-white rounded-xl shadow-xs">
                        និទ្ទេស A
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="font-extrabold text-slate-700 mb-1">ពិន្ទុតាមមុខវិជ្ជា៖</div>
                      <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200">
                        <span>💻 កុំព្យូទ័រ & គេហទំព័រ (Computer & Web)</span>
                        <span className="font-bold text-slate-900">98 / 100 (A)</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200">
                        <span>🇬🇧 ភាសាអង់គ្លេស (General English)</span>
                        <span className="font-bold text-slate-900">90 / 100 (A)</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200">
                        <span>📐 គណិតវិទ្យា (Mathematics)</span>
                        <span className="font-bold text-slate-900">89.5 / 100 (B+)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. HONOR ROLL */}
                {activeModal === "honor" && (
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-300/80 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-yellow-950 flex items-center justify-center shrink-0 shadow-sm font-black text-xl">
                        🏆
                      </div>
                      <div>
                        <div className="text-xs font-black text-yellow-950">តារាងកិត្តិយស - សិស្សពូកែប្រចាំខែ</div>
                        <div className="text-xs font-extrabold text-amber-800 mt-0.5">🥇 ចំណាត់ថ្នាក់លេខ ១ ប្រចាំថ្នាក់</div>
                        <div className="text-[10px] text-amber-700 mt-0.5">ទទួលបានប័ណ្ណសរសើរ និងមេដាយកិត្តិយសពីសាលារៀន</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. INVOICES */}
                {activeModal === "invoices" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="text-xs font-extrabold text-slate-800">វិក្កយបត្រថ្លៃសិក្សា (Tuition Invoices)</div>
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">INV-2026-0801 (ថ្លៃសិក្សាខែ សីហា)</div>
                            <div className="text-[11px] text-slate-500">កាលបរិច្ឆេទ៖ 01/08/2026</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-emerald-600 text-sm">$45.00</div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">បានបង់រួច</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. PAYMENTS */}
                {activeModal === "payments" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="text-xs font-extrabold text-slate-800">ប្រវត្តិការបង់ប្រាក់ (Payment History)</div>
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">បង់តាម ABA KHQR (#PAY-88219)</div>
                            <div className="text-[11px] text-slate-500">01/08/2026 - 09:30 AM</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-slate-900 text-sm">$45.00</div>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[9px] font-bold">ជោគជ័យ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. CLASSES */}
                {activeModal === "classes" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="text-xs font-extrabold text-slate-800">ថ្នាក់រៀនដែលបានចុះឈ្មោះ (Enrolled Classes)</div>
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <div className="font-extrabold text-slate-900">1. Computer & Web Development</div>
                          <div className="text-[11px] text-slate-600">⏰ ម៉ោង៖ 08:00 AM - 09:30 AM (ចន្ទ - សុក្រ)</div>
                          <div className="text-[11px] text-slate-600">🏫 បន្ទប់៖ Lab 02 | គ្រូបង្រៀន៖ លោកគ្រូ ចាន់ សុភ័ក្ត្រ</div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <div className="font-extrabold text-slate-900">2. General English Program (GEP Level 3)</div>
                          <div className="text-[11px] text-slate-600">⏰ ម៉ោង៖ 02:00 PM - 03:30 PM (ចន្ទ - សុក្រ)</div>
                          <div className="text-[11px] text-slate-600">🏫 បន្ទប់៖ Room 104 | គ្រូបង្រៀន៖ Teacher John</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  បិទ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

