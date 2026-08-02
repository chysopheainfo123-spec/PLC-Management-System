import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Loader2, FileText, CheckCircle2, XCircle, Award, Clock, BookOpen, 
  User, Check, ChevronRight, AlertCircle, RefreshCw, Trophy, Sparkles, LogOut
} from "lucide-react";
import { Exam, Question } from "../types";
import { parseExamMeta, getSubjectStyle } from "../lib/examUtils";

export default function PracticePortal({ examId, onBack }: { examId: string; onBack?: () => void }) {
  const [lang, setLang] = useState<"kh" | "en" | "zh">("kh");

  const handleExit = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("plc_lang") as "kh" | "en" | "zh";
    if (savedLang && ["kh", "en", "zh"].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const idt = (kh: string, en?: string, zh?: string) => {
    if (lang === "en") return en || kh;
    if (lang === "zh") return zh || en || kh;
    return kh;
  };

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreInfo, setScoreInfo] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/exams/${examId}`)
      .then(res => {
        if (!res.ok) throw new Error("Exam not found or failed to load");
        return res.json();
      })
      .then(data => {
        setExam(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [examId]);

  useEffect(() => {
    if (isStarted && !submitted && exam?.duration) {
      if (timeLeft === null) {
        setTimeLeft(exam.duration * 60);
      }
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted, submitted, exam, timeLeft]);

  const formatTime = (secs: number | null) => {
    if (secs === null) return "--:--";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    setIsStarted(true);
  };

  const handleSubmit = async () => {
    if (!exam) return;
    setLoading(true);

    let score = 0;
    let totalPoints = 0;
    exam.questions.forEach((q: any) => {
      totalPoints += q.points || 1;
      if (answers[q.id] === q.answer) {
        score += q.points || 1;
      }
    });

    const subRecord = {
      id: "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      examId: exam.id,
      studentId: "practice-mode",
      studentName: studentName.trim() || "សិស្ស / Student",
      score,
      totalPoints,
      answers: JSON.stringify(answers),
      submittedAt: new Date().toISOString()
    };

    // Store submission locally so teacher can review scores anytime
    try {
      const existingSubs = JSON.parse(localStorage.getItem("plc_local_exam_submissions") || "[]");
      existingSubs.unshift(subRecord);
      localStorage.setItem("plc_local_exam_submissions", JSON.stringify(existingSubs));
      window.dispatchEvent(new CustomEvent("plc_exam_submitted", { detail: subRecord }));
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await fetch(`/api/exams/${exam.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "practice-mode",
          studentName: studentName.trim(),
          answers: answers
        })
      });
      if (res.ok) {
        const result = await res.json();
        setScoreInfo(result);
        setSubmitted(true);
      } else {
        setScoreInfo({ score, totalPoints });
        setSubmitted(true);
      }
    } catch (err) {
      setScoreInfo({ score, totalPoints });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScoreInfo(null);
    setIsStarted(false);
  };

  if (loading && !exam) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-extrabold text-slate-500 font-mono tracking-widest uppercase">
            {idt("កំពុងផ្ទុកវិញ្ញាសា...", "Loading Exam Paper...", "正在加载试卷...")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-sm border border-slate-100">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-800 mb-2">
            {idt("រកមិនឃើញវិញ្ញាសាឡើយ", "Exam Not Found", "未找到试卷")}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {idt("តំណភ្ជាប់នេះមិនត្រឹមត្រូវ ឬវិញ្ញាសានេះត្រូវបានលុបចេញពីប្រព័ន្ធ។", "This practice link is invalid or the exam has been deleted.", "此练习链接无效或试卷已被删除。")}
          </p>
          <a href="/" className="px-5 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            {idt("ត្រឡប់ទៅទំព័រដើម", "Go to Portal", "返回首页")}
          </a>
        </div>
      </div>
    );
  }

  // Language buttons
  const langSelector = (
    <div className="flex items-center bg-white border border-slate-200/60 rounded-2xl p-1 shadow-xs">
      {(["kh", "en", "zh"] as const).map((l) => (
        <button
          key={l}
          onClick={() => {
            setLang(l);
            localStorage.setItem("plc_lang", l);
          }}
          className={`px-3 py-1 text-[11px] font-black rounded-xl transition-all ${
            lang === l
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {l === "kh" ? "ខ្មែរ" : l === "zh" ? "中文" : "EN"}
        </button>
      ))}
    </div>
  );

  // START SCREEN
  if (!isStarted) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl space-y-8 relative overflow-hidden">
          
          {/* Top banner accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-primary-600" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={handleExit}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all cursor-pointer"
                title={idt("ចាកចេញ / ត្រឡប់ក្រោយ", "Exit / Go Back", "退出 / 返回")}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <FileText className="w-7 h-7" />
              </div>
            </div>
            {langSelector}
          </div>

          {(() => {
            const meta = parseExamMeta(exam);
            const subStyle = getSubjectStyle(meta.subject);
            return (
              <>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 text-[11px] font-black rounded-lg border flex items-center gap-1.5 ${subStyle.badgeBg} ${subStyle.badgeText} ${subStyle.badgeBorder}`}>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{meta.subject}</span>
                    </span>
                    <span className="px-3 py-1 text-[11px] font-bold rounded-lg border bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-500" />
                      <span>{meta.gradeLevel}</span>
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                    {exam.title}
                  </h1>
                  {meta.description && (
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                      {meta.description}
                    </p>
                  )}
                </div>

                {/* Meta specs */}
                <div className="grid grid-cols-2 gap-4 py-4 px-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{exam.duration} {idt("នាទី", "Mins", "分钟")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>{exam.questions?.length || 0} {idt("សំណួរ", "Questions", "个问题")}</span>
                  </div>
                </div>
              </>
            );
          })()}

          <form onSubmit={handleStart} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                {idt("សូមបញ្ចូលឈ្មោះរបស់អ្នកដើម្បីចាប់ផ្ដើម", "Enter Your Name to Begin", "请输入您的姓名开始")}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder={idt("ឈ្មោះពេញរបស់អ្នក...", "Your full name...", "您的全名...")}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white pl-11 pr-4 py-3 text-sm font-bold text-slate-800 rounded-xl transition-all outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-sm"
            >
              <span>{idt("ចាប់ផ្ដើមធ្វើលំហាត់", "Start Practice Now", "立即开始练习")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // SUBMITTED RESULTS VIEW
  if (submitted && scoreInfo) {
    const totalQ = exam.questions?.length || 0;
    const answeredCount = Object.keys(answers).length;
    const scorePercent = scoreInfo.totalPoints > 0 ? Math.round((scoreInfo.score / scoreInfo.totalPoints) * 100) : 0;
    
    // Performance assessment
    let feedbackKh = "ព្យាយាមម្ដងទៀត ដើម្បីទទួលបានលទ្ធផលល្អជាងនេះ!";
    let feedbackEn = "Keep practicing to achieve a better score!";
    let colorClass = "bg-rose-500";
    let bgLight = "bg-rose-50/50";
    let textTheme = "text-rose-600";

    if (scorePercent >= 85) {
      feedbackKh = "អស្ចារ្យណាស់! អ្នកធ្វើបានល្អឥតខ្ចោះ។";
      feedbackEn = "Outstanding performance! You mastered this exam.";
      colorClass = "bg-emerald-500";
      bgLight = "bg-emerald-50/50";
      textTheme = "text-emerald-600";
    } else if (scorePercent >= 50) {
      feedbackKh = "ល្អណាស់! អ្នកបានប្រឡងជាប់ហើយ។";
      feedbackEn = "Good job! You passed the practice exam.";
      colorClass = "bg-blue-500";
      bgLight = "bg-blue-50/50";
      textTheme = "text-blue-600";
    }

    return (
      <div className="min-h-screen w-full bg-slate-50/50 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden mb-6">
          
          {/* Header Score Info */}
          <div className="bg-primary-600 p-8 text-white relative">
            
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                  {idt("លទ្ធផលសាកល្បង", "Practice Scorecard", "练习成绩单")}
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{exam.title}</h1>
                <p className="text-white/85 text-xs font-bold font-mono">
                  {idt("សិស្សអនុវត្ត៖", "Student Name:", "姓名：")} <span className="underline decoration-wavy decoration-white/40">{studentName}</span>
                </p>
              </div>
              <Trophy className="w-12 h-12 text-white/90 animate-bounce" />
            </div>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/25 flex flex-col items-center justify-center min-w-[70px]">
                  <span className="text-white/70 text-[9px] uppercase font-black tracking-wider">{idt("ពិន្ទុ", "Score", "得分")}</span>
                  <span className="text-2xl font-black font-mono mt-0.5">{scoreInfo.score}/{scoreInfo.totalPoints}</span>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/25 flex flex-col items-center justify-center min-w-[70px]">
                  <span className="text-white/70 text-[9px] uppercase font-black tracking-wider">{idt("ភាគរយ", "Percentage", "百分比")}</span>
                  <span className="text-2xl font-black font-mono mt-0.5">{scorePercent}%</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-white text-sm font-black tracking-wide leading-snug">{idt(feedbackKh, feedbackEn)}</p>
                <p className="text-white/70 text-[11px] font-medium mt-1">
                  {idt(`ឆ្លើយតបសំណួរចំនួន ${answeredCount} នៃ ${totalQ} សំណួរ`, `Answered ${answeredCount} of ${totalQ} questions`, `回答了 ${totalQ} 个问题中的 ${answeredCount} 个`)}
                </p>
              </div>
            </div>
          </div>

          {/* Details & Review Questions */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-3">
              {idt("ពិនិត្យចម្លើយឡើងវិញ", "Review Questions & Answers", "审查问题与答案")}
            </h3>

            <div className="space-y-4">
              {exam.questions.map((q: any, idx: number) => {
                let options = [];
                try { options = JSON.parse(q.options); } catch (e) { options = q.options.split(','); }
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.answer;

                return (
                  <div 
                    key={q.id} 
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isCorrect 
                        ? "bg-emerald-50/10 border-emerald-100" 
                        : userAnswer 
                          ? "bg-rose-50/10 border-rose-100" 
                          : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <p className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug">
                        {idx + 1}. {q.text}
                      </p>
                      
                      {/* Badge indicator */}
                      {userAnswer ? (
                        isCorrect ? (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            {idt("ត្រឹមត្រូវ", "Correct", "正确")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            {idt("ខុស", "Incorrect", "错误")}
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                          {idt("មិនទាន់ឆ្លើយ", "Unanswered", "未回答")}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {options.map((opt: string) => {
                        const isChosen = userAnswer === opt;
                        const isKey = q.answer === opt;
                        
                        let optStyle = "border-slate-200 bg-white text-slate-700";
                        if (isKey) {
                          optStyle = "border-emerald-300 bg-emerald-50/50 text-emerald-800 font-bold";
                        } else if (isChosen) {
                          optStyle = "border-rose-300 bg-rose-50/50 text-rose-800 font-bold";
                        }

                        return (
                          <div 
                            key={opt} 
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm transition-all ${optStyle}`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 ${
                              isKey 
                                ? "bg-emerald-500 text-white" 
                                : isChosen 
                                  ? "bg-rose-500 text-white" 
                                  : "bg-slate-100 text-slate-400"
                            }`}>
                              {isKey ? <Check className="w-2.5 h-2.5" /> : null}
                            </div>
                            <span className="truncate">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button 
                onClick={handleReset}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{idt("សាកល្បងម្ដងទៀត", "Try Practice Again", "再次尝试")}</span>
              </button>

              <button 
                type="button"
                onClick={handleExit}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl border border-slate-200/50 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{idt("ត្រឡប់ទៅទំព័រដើម", "Exit Practice Mode", "退出练习模式")}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ACTIVE EXAM PRACTICE SESSION
  return (
    <div className="min-h-screen w-full bg-slate-50/50 flex flex-col justify-between font-sans">
      
      {/* Sticky Top Progress Header */}
      <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between shadow-xs z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (confirm(idt("តើអ្នកប្រាកដជាចង់ចាកចេញពីការប្រឡងអនុវត្តនេះមែនទេ?", "Are you sure you want to exit this practice exam?", "您确定要退出此练习吗？"))) {
                handleExit();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-800 line-clamp-1">{exam.title}</h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold font-mono">
              <span className="text-blue-600 font-black">{studentName}</span>
              <span>•</span>
              <span>{exam.questions?.length || 0} {idt("សំណួរ", "Questions", "个问题")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Timer Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-black border transition-all ${
            (timeLeft ?? 999) < 300 
              ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" 
              : "bg-blue-50 text-blue-700 border-blue-200/60"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {langSelector}
        </div>
      </div>

      {/* Quick Jump Navigation Bar */}
      <div className="bg-slate-100/60 border-b border-slate-200/40 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex-shrink-0">
          {idt("រំលងទៅសំណួរ៖", "Jump to:", "跳转到：")}
        </span>
        <div className="flex items-center gap-1.5">
          {exam.questions.map((q: any, qIdx: number) => {
            const isAnswered = !!answers[q.id];
            return (
              <button
                key={q.id || qIdx}
                type="button"
                onClick={() => {
                  const el = document.getElementById(`practice-q-${q.id || qIdx}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-black transition-all flex items-center justify-center cursor-pointer ${
                  isAnswered
                    ? "bg-blue-600 text-white shadow-3xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:border-blue-300"
                }`}
              >
                {qIdx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {exam.questions.map((q: any, idx: number) => {
          let options = [];
          try { options = JSON.parse(q.options); } catch (e) { options = q.options.split(','); }
          const chosenOpt = answers[q.id];

          return (
            <div 
              key={q.id || idx} 
              id={`practice-q-${q.id || idx}`}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 ${
                chosenOpt 
                  ? "border-blue-200 shadow-xs ring-2 ring-blue-500/5" 
                  : "border-slate-100 shadow-2xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-blue-50 text-blue-700 text-xs font-black font-mono flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="font-black text-slate-800 text-sm sm:text-base leading-snug">
                    {q.text}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg border border-amber-200/60 flex-shrink-0">
                  {q.points || 1} {idt("ពិន្ទុ", "pts", "分")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((opt: string, oIdx: number) => {
                  const letter = String.fromCharCode(65 + oIdx);
                  const isChecked = answers[q.id] === opt;
                  return (
                    <label 
                      key={opt || oIdx} 
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isChecked 
                          ? "border-blue-500 bg-blue-50/30 text-blue-950 font-black ring-2 ring-blue-500/10 shadow-3xs" 
                          : "border-slate-200/70 hover:border-slate-300 bg-slate-50/40 hover:bg-white text-slate-700 font-bold"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt} 
                        checked={isChecked}
                        onChange={() => setAnswers({...answers, [q.id]: opt})}
                        className="sr-only" 
                      />
                      <span className={`w-6 h-6 rounded-xl text-[11px] font-mono font-black flex items-center justify-center flex-shrink-0 transition-all ${
                        isChecked ? "bg-blue-600 text-white" : "bg-slate-200/80 text-slate-600"
                      }`}>
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm leading-snug">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Submit bar */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-100/80 px-6 py-4 flex items-center justify-between z-30">
        <div className="text-xs font-bold text-slate-500 font-mono">
          {idt("បានឆ្លើយ៖", "Progress:", "已答：")} <span className="font-black text-blue-600 text-sm">{Object.keys(answers).length}</span> / {exam.questions?.length || 0}
        </div>

        <button 
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/25 text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer"
        >
          {idt("បញ្ជូនចម្លើយ (Submit Practice)", "Submit & Get Results", "提交练习并获得成绩")}
        </button>
      </div>

    </div>
  );
}
