import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, MessageSquare, Send, Bell, User, Phone, AlertCircle, CreditCard, AlignLeft, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ParentPortalTab({ students, uiLang: propUiLang, showToast }: any) {
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
    <div className="bg-slate-50/50 flex p-4 md:p-8">
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
    </div>
  );
}

