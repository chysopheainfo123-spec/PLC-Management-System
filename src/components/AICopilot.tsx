import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, X, Bot, User as UserIcon, Loader2, Trash2, MessageSquare, FileText, BookOpen, Volume2 } from 'lucide-react';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AICopilotProps {
  token: string;
  appTheme?: string;
}

export default function AICopilot({ token, appTheme = "indigo" }: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"kh" | "en" | "zh">("kh");

  useEffect(() => {
    const checkLang = () => {
      const savedLang = localStorage.getItem("plc_lang") as "kh" | "en" | "zh";
      if (savedLang && (savedLang === "kh" || savedLang === "en" || savedLang === "zh")) {
        setLang(savedLang);
      }
    };
    checkLang();
    window.addEventListener("storage", checkLang);
    window.addEventListener("plcLanguageChange", checkLang);
    const interval = setInterval(checkLang, 1000);
    return () => {
      window.removeEventListener("storage", checkLang);
      window.removeEventListener("plcLanguageChange", checkLang);
      clearInterval(interval);
    };
  }, []);

  const idt = (kh: string, en?: string, zh?: string) => {
    if (lang === "en") return en || kh;
    if (lang === "zh") return zh || en || kh;
    return kh;
  };

  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize first greeting dynamically on mount and whenever lang changes if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "GREETING_MSG_PLACEHOLDER"
        }
      ]);
    }
  }, [lang]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    if (!textToSend) {
      setInput("");
    }

    const currentMessages = messages.length === 0 ? [] : messages;
    const newMessages: Message[] = [...currentMessages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || idt("មានបញ្ហាតភ្ជាប់ទៅ AI", "AI connection issue", "连接AI出现问题"));
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: idt(
            "សុំទោសផង មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើការ AI។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
            "Sorry, there is an issue connecting to the AI server. Please try again later.",
            "抱歉，连接到AI服务器时出现问题。请稍后再试。"
          ) 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm(idt("តើអ្នកចង់លុបប្រវត្តិជជែកជាមួយ AI មែនទេ?", "Do you want to clear the AI chat history?", "您确定要清除 AI 聊天记录吗？"))) {
      setMessages([
        {
          role: "assistant",
          content: "GREETING_MSG_PLACEHOLDER"
        }
      ]);
    }
  };

  // Helper to format response text (simple custom parser for bold, code blocks, lists and paragraphs)
  const renderFormattedContent = (content: string) => {
    return content.split("\n").map((line, idx) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith("###")) {
        return <h4 key={idx} className="text-sm font-bold text-slate-800 mt-2 mb-1">{trimmed.replace("###", "").trim()}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return <h3 key={idx} className="text-base font-extrabold text-slate-900 mt-3 mb-1.5">{trimmed.replace("##", "").trim()}</h3>;
      }
      if (trimmed.startsWith("#")) {
        return <h2 key={idx} className="text-lg font-black text-primary-900 mt-4 mb-2">{trimmed.replace("#", "").trim()}</h2>;
      }

      // Bullet points
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const textContent = trimmed.substring(1).trim();
        return (
          <ul key={idx} className="list-disc pl-5 my-0.5 text-slate-700">
            <li>{parseInlineElements(textContent)}</li>
          </ul>
        );
      }

      // Numbered points (e.g. "1. ")
      if (/^\d+\./.test(trimmed)) {
        const dotIdx = trimmed.indexOf(".");
        const textContent = trimmed.substring(dotIdx + 1).trim();
        const number = trimmed.substring(0, dotIdx + 1);
        return (
          <div key={idx} className="flex gap-1.5 pl-2 my-1 text-slate-700">
            <span className="font-bold text-primary-600 shrink-0">{number}</span>
            <span>{parseInlineElements(textContent)}</span>
          </div>
        );
      }

      // Default paragraph
      if (trimmed === "") {
        return <div key={idx} className="h-2"></div>;
      }

      return (
        <p key={idx} className="text-sm text-slate-700 leading-relaxed my-1">
          {parseInlineElements(line)}
        </p>
      );
    });
  };

  // Helper to parse inline elements like **bold** and `code`
  const parseInlineElements = (text: string) => {
    // Regex matching bold elements **text**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-rose-600 font-mono font-medium">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const getThemeColors = () => {
    switch (appTheme) {
      case "emerald":
        return {
          bg: "bg-emerald-600",
          hover: "hover:bg-emerald-700",
          text: "text-emerald-600",
          light: "bg-emerald-50",
          border: "border-emerald-100",
          ring: "focus:ring-emerald-500",
          gradient: "bg-emerald-600"
        };
      case "violet":
      case "indigo":
        return {
          bg: "bg-blue-600",
          hover: "hover:bg-blue-700",
          text: "text-blue-600",
          light: "bg-blue-50",
          border: "border-blue-100",
          ring: "focus:ring-blue-500",
          gradient: "bg-blue-600"
        };
      case "rose":
        return {
          bg: "bg-rose-600",
          hover: "hover:bg-rose-700",
          text: "text-rose-600",
          light: "bg-rose-50",
          border: "border-rose-100",
          ring: "focus:ring-rose-500",
          gradient: "bg-rose-600"
        };
      default: // indigo
        return {
          bg: "bg-primary-600",
          hover: "hover:bg-primary-700",
          text: "text-primary-600",
          light: "bg-primary-50",
          border: "border-primary-100",
          ring: "focus:ring-primary-500",
          gradient: "bg-primary-600"
        };
    }
  };

  const theme = getThemeColors();

  const presetPrompts = [
    {
      title: idt("📝 ព្រាងសំបុត្រអវត្តមាន", "📝 Draft Leave Letter", "📝 起草请假条"),
      prompt: idt(
        "ជួយសរសេរលិខិតសុំច្បាប់ ឬសេចក្តីជូនដំណឹងខ្លីមួយជាភាសាខ្មែរ សម្រាប់ផ្ញើទៅអាណាព្យាបាលសិស្ស ដែលអវត្តមានពីថ្នាក់រៀនដោយគ្មានការអនុញ្ញាត។",
        "Please write a short notification in English to send to parents of students who are absent from class without permission.",
        "请写一份中文简短通知，发送给未经批准缺课的学生家长。"
      )
    },
    {
      title: idt("📊 លំហាត់ Microsoft Excel", "📊 Microsoft Excel Exercises", "📊 微软 Excel 练习"),
      prompt: idt(
        "ជួយបង្កើតគំនិត ឬសំណួរលំហាត់អនុវត្តកុំព្យូទ័រ Excel សម្រាប់សិស្សកម្រិតដំបូង (ដូចជាការប្រើប្រាស់ SUM, AVERAGE, IF និងតារាងទិន្នន័យ)។",
        "Help generate Excel practice ideas or questions for beginner students (using SUM, AVERAGE, IF and data tables).",
        "帮助为初学者生成Excel练习创意或问题（例如使用 SUM、AVERAGE、IF 和数据表）。"
      )
    },
    {
      title: idt("📢 ផ្សព្វផ្សាយវគ្គសិក្សាថ្មី", "📢 Promote New Course", "📢 推广新课程"),
      prompt: idt(
        "ជួយព្រាងសារផ្សព្វផ្សាយខ្លីសម្រាប់ផុសហ្វេសប៊ុក (Facebook Post) អំពីការបើកវគ្គសិក្សាកុំព្យូទ័រថ្មីរបស់សាលា PLC Computer School (មានវគ្គរដ្ឋបាល ការរចនា និងសំណួរសួរចម្លើយ)។",
        "Help draft a short Facebook promotional post about the opening of new computer courses at PLC Computer School.",
        "帮助起草一份关于 PLC 电脑学校开设新电脑课程的 Facebook 短期推广帖。"
      )
    },
    {
      title: idt("💡 សកម្មភាពគ្រប់គ្រងថ្នាក់", "💡 Classroom Management", "💡 课堂管理技巧"),
      prompt: idt(
        "តើមានគំនិត ឬយុទ្ធសាស្ត្រអ្វីខ្លះដើម្បីឱ្យសិស្សានុសិស្សមានការចូលរួមស្វាហាប់ និងផ្តោតអារម្មណ៍បានល្អនៅក្នុងម៉ោងអនុវត្តកុំព្យូទ័រ?",
        "What are some ideas or strategies to keep students actively engaged and focused during computer practice hours?",
        "有哪些创意或策略可以让学生在电脑实践课期间保持积极参与和高度专注？"
      )
    }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-[100] font-sans">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full ${theme.bg} text-white flex items-center justify-center shadow-xl hover:shadow-primary-500/20 cursor-pointer relative group`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full"></span>
            </>
          )}

          {/* Tooltip */}
          <div className="absolute right-16 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
            {idt("ជំនួយការឆ្លាតវៃ AI (AI Copilot)", "AI Assistant (AI Copilot)", "智能AI助手 (AI Copilot)")}
          </div>
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 w-full max-w-[420px] h-[550px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl z-[100] flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className={`p-4 ${theme.gradient} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-3xs">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide flex items-center gap-1.5">
                    {idt("ជំនួយការឆ្លាតវៃ AI", "AI Copilot", "智能 AI 助手")}
                    <span className="text-[9px] bg-white/35 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      Active
                    </span>
                  </h3>
                  <p className="text-[10px] text-white/80 font-medium">PLC School AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  title={idt("លុបការសន្ទនា", "Clear Conversation", "清除聊天记录")}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/90 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/90 hover:text-white"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {messages.map((msg, i) => {
                const isPlaceholder = msg.content === "GREETING_MSG_PLACEHOLDER";
                const displayContent = isPlaceholder
                  ? idt(
                      "សួស្តី! ខ្ញុំជាជំនួយការឆ្លាតវៃ AI (PLC School AI Copilot)។ តើខ្ញុំអាចជួយលោកគ្រូ/អ្នកគ្រូ និងបុគ្គលិកក្នុងការងារសាលា ដូចជាព្រាងលិខិតសុំច្បាប់ ព្រាងសេចក្តីជូនដំណឹង រៀបចំកម្រងលំហាត់ (Word, Excel) ឬវិភាគព័ត៌មាននានាបានដោយរបៀបណា?",
                      "Hello! I am your AI Copilot. How can I help you with school tasks such as drafting leave requests, announcements, computer tasks, or analyzing data?",
                      "您好！我是您的智能 AI 助手。我能为您提供哪些学校工作方面的协助？例如起草请假条、通知、设计电脑练习题，或分析数据？"
                    )
                  : msg.content;

                return (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
                  >
                    {msg.role === "assistant" && (
                      <div className={`w-8 h-8 rounded-lg ${theme.light} border ${theme.border} ${theme.text} flex items-center justify-center shrink-0 shadow-3xs`}>
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-3xs leading-relaxed ${
                        msg.role === "user"
                          ? `${theme.bg} text-white rounded-br-none`
                          : "bg-white text-slate-800 border border-slate-200/60 rounded-bl-none"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap">{displayContent}</p>
                      ) : (
                        <div className="space-y-1">
                          {renderFormattedContent(displayContent)}
                        </div>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-primary-550 text-white flex items-center justify-center shrink-0 shadow-3xs">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${theme.light} border ${theme.border} ${theme.text} flex items-center justify-center shrink-0 shadow-3xs`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white text-slate-500 rounded-2xl rounded-bl-none border border-slate-200/60 px-4 py-3 shadow-3xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-450" />
                    <span className="text-xs font-medium">{idt("AI កំពុងវិភាគ និងសរសេរ...", "AI is analyzing and writing...", "AI正在分析和编写...")}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Presets prompts list (Only shown if no user messages sent yet, or to offer quick help) */}
            {messages.length === 1 && (
              <div className="p-3 bg-white border-t border-slate-200/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  {idt("សំណួររហ័ស (Quick Templates)", "Quick Templates", "快速提问模板")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {presetPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.prompt)}
                      className="text-left text-[11px] p-2 bg-slate-50 hover:bg-primary-50 border border-slate-200/65 hover:border-primary-150 rounded-xl font-medium transition-all duration-200 cursor-pointer text-slate-600 hover:text-primary-750"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder={idt("សួរអ្វីមួយទៅកាន់ AI...", "Ask something to AI...", "问点什么吧...")}
                className={`flex-1 min-h-[40px] px-3.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-250 hover:border-slate-350 rounded-xl text-sm focus:outline-hidden focus:ring-2 ${theme.ring} transition-all duration-200`}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`w-10 h-10 rounded-xl ${
                  isLoading || !input.trim() 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : `${theme.bg} ${theme.hover} text-white cursor-pointer hover:scale-[1.03]`
                } flex items-center justify-center shadow-md transition-all duration-200`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
