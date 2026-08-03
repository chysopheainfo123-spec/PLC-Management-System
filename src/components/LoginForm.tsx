import LanguageSelector from "./LanguageSelector";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, User, KeyRound, ShieldCheck, GraduationCap, Zap, CheckCircle2, Globe, Phone, MapPin, Info, Send, Sparkles, X, HeartHandshake, ArrowLeft, Mail, UserCheck, Star, ChevronRight, ChevronLeft, Cpu, Laptop, Code, Network, Database, Server } from 'lucide-react';
import { AuthResponse } from "../types";

// Subtle Shadowy ICT / Technology Background Pattern Overlay with Full Area Stripes (ឆ្នួតៗ)
const IctShadowyBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Clean subtle ambient lighting glows */}
    <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />
    <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-amber-300/10 rounded-full blur-xl pointer-events-none" />
  </div>
);

// High resolution Cambodian Students Sampeah Illustration SVG
const CambodianStudentsIllustration = ({ className = "w-full max-w-[280px]" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="240" cy="280" rx="200" ry="80" fill="url(#bgGlow)" opacity="0.4" />
    <defs>
      <radialGradient id="bgGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 280) scale(200 80)">
        <stop stopColor="#F59E0B" stopOpacity="0.4" />
        <stop offset="1" stopColor="#991B1B" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="girlShirt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="boyShirt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="scarfRed" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>

    {/* GIRL STUDENT (LEFT) */}
    <g id="GirlStudent">
      <path d="M120 220 Q160 210 200 220 L220 370 L100 370 Z" fill="url(#girlShirt)" />
      <path d="M135 220 Q160 250 185 220 L175 290 Q160 300 145 290 Z" fill="url(#scarfRed)" />
      <path d="M142 225 L178 225 L160 270 Z" fill="#B91C1C" />
      <rect x="156" y="270" width="8" height="40" rx="3" fill="#991B1B" />
      
      <circle cx="188" cy="255" r="7" fill="#F59E0B" stroke="#991B1B" strokeWidth="1.5" />

      <rect x="150" y="195" width="20" height="28" rx="6" fill="#FBCFE8" opacity="0.6" />
      <path d="M148 198 Q160 212 172 198 Z" fill="#F3A37C" />
      <ellipse cx="160" cy="165" rx="36" ry="42" fill="#FFDFC4" />
      <path d="M120 150 Q110 220 125 310 Q145 320 150 280 L135 180 Z" fill="#1E293B" />
      <path d="M200 150 Q210 220 195 310 Q175 320 170 280 L185 180 Z" fill="#1E293B" />
      <path d="M122 160 C120 115 200 115 198 160 C190 130 130 130 122 160 Z" fill="#0F172A" />
      <path d="M130 145 Q160 162 190 145 Q160 135 130 145 Z" fill="#1E293B" />

      <ellipse cx="146" cy="162" rx="3.5" ry="4.5" fill="#0F172A" />
      <ellipse cx="174" cy="162" rx="3.5" ry="4.5" fill="#0F172A" />
      <path d="M144 155 Q146 152 149 155" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M171 155 Q174 152 177 155" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="140" cy="170" rx="5" ry="3" fill="#F43F5E" opacity="0.3" />
      <ellipse cx="180" cy="170" rx="5" ry="3" fill="#F43F5E" opacity="0.3" />
      <path d="M152 176 Q160 186 168 176" fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />

      <path d="M130 250 Q160 210 160 200 Q160 210 190 250" fill="none" stroke="#FFDFC4" strokeWidth="14" strokeLinecap="round" />
      <path d="M154 195 Q160 180 166 195 L164 215 L156 215 Z" fill="#FFDFC4" stroke="#E2E8F0" strokeWidth="1" />
    </g>

    {/* BOY STUDENT (RIGHT) */}
    <g id="BoyStudent">
      <path d="M270 220 Q310 210 350 220 L370 370 L250 370 Z" fill="url(#boyShirt)" />
      <path d="M302 218 L318 218 L314 285 L310 295 L306 285 Z" fill="url(#scarfRed)" />
      <polygon points="304,216 316,216 314,226 306,226" fill="#7F1D1D" />
      <circle cx="338" cy="255" r="7" fill="#F59E0B" stroke="#991B1B" strokeWidth="1.5" />

      <rect x="300" y="195" width="20" height="28" rx="6" fill="#FBCFE8" opacity="0.6" />
      <path d="M298 198 Q310 212 322 198 Z" fill="#F3A37C" />
      <ellipse cx="310" cy="165" rx="35" ry="40" fill="#FFDFC4" />
      <path d="M272 155 C270 110 350 110 348 155 C340 120 280 120 272 155 Z" fill="#0F172A" />
      <path d="M275 150 Q310 130 345 150 Q325 138 310 138 Q295 138 275 150 Z" fill="#1E293B" />

      <rect x="286" y="152" width="20" height="16" rx="4" fill="none" stroke="#0F172A" strokeWidth="2.5" />
      <rect x="314" y="152" width="20" height="16" rx="4" fill="none" stroke="#0F172A" strokeWidth="2.5" />
      <line x1="306" y1="160" x2="314" y2="160" stroke="#0F172A" strokeWidth="2.5" />

      <ellipse cx="296" cy="160" rx="3" ry="4" fill="#0F172A" />
      <ellipse cx="324" cy="160" rx="3" ry="4" fill="#0F172A" />
      <ellipse cx="290" cy="170" rx="4" ry="2.5" fill="#F43F5E" opacity="0.25" />
      <ellipse cx="330" cy="170" rx="4" ry="2.5" fill="#F43F5E" opacity="0.25" />
      <path d="M302 176 Q310 186 318 176" fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />

      <path d="M280 250 Q310 210 310 200 Q310 210 340 250" fill="none" stroke="#FFDFC4" strokeWidth="14" strokeLinecap="round" />
      <path d="M304 195 Q310 180 316 195 L314 215 L306 215 Z" fill="#FFDFC4" stroke="#E2E8F0" strokeWidth="1" />
    </g>
  </svg>
);

const ParentsIllustration = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pBgGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff7ed" />
        <stop offset="100%" stopColor="#fef3c7" />
      </linearGradient>
      <linearGradient id="pDadShirt" x1="20" y1="60" x2="60" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      <linearGradient id="pMomShirt" x1="60" y1="60" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
      <filter id="pDropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>

    {/* Soft glowing backdrop circle */}
    <circle cx="60" cy="60" r="54" fill="url(#pBgGrad)" stroke="#fde68a" strokeWidth="2" />
    
    {/* Heart symbol for family care */}
    <path d="M60 22 C55 16 46 18 46 25 C46 32 60 41 60 41 C60 41 74 32 74 25 C74 18 65 16 60 22 Z" fill="#f43f5e" opacity="0.85" filter="url(#pDropShadow)" />

    {/* Father (Left) */}
    <g id="Dad" filter="url(#pDropShadow)">
      <path d="M26 40 C26 28 36 24 44 24 C52 24 58 29 58 38 C58 42 54 44 54 44 C54 44 26 44 26 40 Z" fill="#1e293b" />
      <circle cx="41" cy="45" r="13" fill="#fed7aa" />
      <circle cx="28" cy="45" r="2.5" fill="#fdba74" />
      <circle cx="54" cy="45" r="2.5" fill="#fdba74" />
      <circle cx="36" cy="44" r="1.5" fill="#0f172a" />
      <circle cx="46" cy="44" r="1.5" fill="#0f172a" />
      <path d="M37 51 C39 54 43 54 45 51" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M19 92 C19 75 29 65 41 65 C53 65 61 75 61 92 Z" fill="url(#pDadShirt)" />
      <path d="M36 65 L41 74 L46 65" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>

    {/* Mother (Right) */}
    <g id="Mom" filter="url(#pDropShadow)">
      <path d="M60 46 C60 28 72 23 81 23 C90 23 100 28 100 46 C100 58 96 66 96 66 C96 66 60 58 60 46 Z" fill="#0f172a" />
      <circle cx="79" cy="47" r="13" fill="#fed7aa" />
      <circle cx="74" cy="46" r="1.5" fill="#0f172a" />
      <circle cx="84" cy="46" r="1.5" fill="#0f172a" />
      <path d="M72 43 Q74 41 76 43" stroke="#0f172a" strokeWidth="1.2" fill="none" />
      <path d="M82 43 Q84 41 86 43" stroke="#0f172a" strokeWidth="1.2" fill="none" />
      <path d="M75 53 C77 56 81 56 83 53" stroke="#be123c" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M59 92 C59 76 68 67 79 67 C90 67 98 76 98 92 Z" fill="url(#pMomShirt)" />
      <path d="M72 68 Q79 75 86 68" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

const StudentIllustration = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sBgGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#eff6ff" />
        <stop offset="100%" stopColor="#dbeafe" />
      </linearGradient>
      <linearGradient id="sRobeGrad" x1="30" y1="60" x2="90" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#991b1b" />
        <stop offset="100%" stopColor="#701a75" />
      </linearGradient>
      <linearGradient id="sCapGrad" x1="20" y1="20" x2="100" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="sGoldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <filter id="sDropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.18" />
      </filter>
    </defs>

    {/* Backdrop circle */}
    <circle cx="60" cy="60" r="54" fill="url(#sBgGrad)" stroke="#bfdbfe" strokeWidth="2" />

    {/* Sparkle stars */}
    <path d="M96 22 L98 28 L104 30 L98 32 L96 38 L94 32 L88 30 L94 28 Z" fill="url(#sGoldGrad)" opacity="0.9" />
    <path d="M22 36 L23.5 40 L28 41.5 L23.5 43 L22 47 L20.5 43 L16 41.5 L20.5 40 Z" fill="url(#sGoldGrad)" opacity="0.75" />

    {/* Student / Graduate Body */}
    <g id="Student" filter="url(#sDropShadow)">
      <path d="M42 48 C42 32 50 28 60 28 C70 28 78 32 78 48 C78 54 76 58 76 58 C76 58 44 58 44 58 Z" fill="#0f172a" />
      <circle cx="60" cy="50" r="14" fill="#fed7aa" />
      <circle cx="53" cy="49" r="1.8" fill="#0f172a" />
      <circle cx="67" cy="49" r="1.8" fill="#0f172a" />
      <circle cx="54" cy="48" r="0.6" fill="#ffffff" />
      <circle cx="68" cy="48" r="0.6" fill="#ffffff" />
      <path d="M54 56 C57 60 63 60 66 56" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 94 C30 74 42 66 60 66 C78 66 90 74 90 94 Z" fill="url(#sRobeGrad)" />
      <path d="M48 66 L60 82 L72 66 L60 72 Z" fill="url(#sGoldGrad)" />
      <path d="M58 71 L60 78 L62 71 Z" fill="#ffffff" />

      {/* Graduation Cap */}
      <path d="M50 26 C50 22 70 22 70 26 L68 30 C68 30 52 30 52 30 Z" fill="#1e3a8a" />
      <path d="M22 24 L60 12 L98 24 L60 36 Z" fill="url(#sCapGrad)" filter="url(#sDropShadow)" />
      <path d="M60 12 L98 24 L60 36 Z" fill="#ffffff" opacity="0.15" />
      <circle cx="60" cy="24" r="3" fill="url(#sGoldGrad)" />
      <path d="M60 24 Q82 25 86 38" stroke="url(#sGoldGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M84 38 L88 38 L87 48 L85 48 Z" fill="url(#sGoldGrad)" />
      <circle cx="86" cy="38" r="2" fill="#b45309" />
    </g>
  </svg>
);

const getLoginTranslations = (uiLang: string, schoolName: string, schoolKhmerName: string, developerName: string, developerKhmerName: string) => ({
  kh: {
    title: uiLang === "kh" ? schoolKhmerName : schoolName,
    subtitle: "STUDENT ATTENDANCE & ACADEMICS ENGINE",
    secureLogin: "ចូលគ្រប់គ្រងប្រព័ន្ធ (SYSTEM SECURE LOGIN)",
    failed: "បរាជ័យក្នុងការចូល (Login Failed)",
    success: "ជោគជ័យ (Authorized Successfully)",
    usernameLabel: "ឈ្មោះគណនី ឬ អ៊ីមែល (Username or Email)",
    passwordLabel: "លេខសម្ងាត់ (Password)",
    rememberMe: "ចងចាំគណនី (Remember Me)",
    lockedMsg: "គណនីត្រូវបានចាក់សោតាម IP",
    submitButton: "ផ្ទៀងផ្ទាត់ និងចូលគណនី",
    verifying: "កំពុងផ្ទៀងផ្ទាត់ព័ត៌មាន...",
    demoTitle: "គណនីគំរូសម្រាប់សាកល្បងប្រព័ន្ធ (Demo Accounts Presets)",
    adminRole: "អ្នកគ្រប់គ្រង (Admin)",
    teacherRole: "លោកគ្រូ/អ្នកគ្រូ (Teacher)",
    adminDesc: "គ្រប់គ្រងសិស្ស គ្រូ ហិរញ្ញវត្ថុ វិញ្ញាបនបត្រ និងការកំណត់។",
    teacherDesc: "មើលស្ថិតិវត្តមានសិស្ស កត់ត្រាវត្តមាន ស្កេន QR របាយការណ៍។",
    fillBtn: "បំពេញស្វ័យប្រវត្ត",
    quickBtn: "ចូលភ្លាមៗ",
    footer: `© 2026 ${developerKhmerName}`,
    version: "ជំនាន់ (Version) 9.0.0",
    exampleUser: "ឈ្មោះគណនី",
    enterPass: "បញ្ចូលលេខសម្ងាត់",
    changeLang: "ប្ដូរភាសា",
    selectLang: "ជ្រើសរើសភាសា",
    emptyError: "សូមបញ្ចូលឈ្មោះគណនី និងលេខសម្ងាត់! (Please enter credentials!)",
    connError: "មិនអាចភ្ជាប់ទៅកាន់ប្រព័ន្ធបានទេ! (Connection error!)",
    loginErrDefault: "មានបញ្ហាក្នុងការចូលប្រើប្រាស់! (Login failed!)"
  },
  en: {
    title: uiLang === "kh" ? schoolKhmerName : schoolName,
    subtitle: "STUDENT ATTENDANCE & ACADEMICS ENGINE",
    secureLogin: "SYSTEM SECURE LOGIN",
    failed: "Login Failed",
    success: "Authorized Successfully",
    usernameLabel: "Username or Email",
    passwordLabel: "Password",
    rememberMe: "Remember Me",
    lockedMsg: "Account restricted by IP",
    submitButton: "Verify & Secure Sign In",
    verifying: "Verifying...",
    demoTitle: "Demo Accounts Presets",
    adminRole: "Administrator (Admin)",
    teacherRole: "Faculty (Teacher)",
    adminDesc: "Manage students, teachers, finances, certificates, and system config.",
    teacherDesc: "View student attendance stats, record attendance, scan QR, reports.",
    fillBtn: "Autofill",
    quickBtn: "Quick Sign In",
    footer: `© 2026 ${developerName}`,
    version: "Version 9.0.0",
    exampleUser: "Username (e.g. admin)",
    enterPass: "Enter your password",
    changeLang: "Change Language",
    selectLang: "Select Language",
    emptyError: "Please enter your username and password!",
    connError: "Failed to connect to the system!",
    loginErrDefault: "Invalid credentials or login issue!"
  },
  zh: {
    title: schoolName,
    subtitle: "学生考勤与学术管理系统",
    secureLogin: "系统安全登录",
    failed: "登录失败",
    success: "授权成功",
    usernameLabel: "账号或电子邮件",
    passwordLabel: "登录密码",
    rememberMe: "记住登录信息",
    lockedMsg: "账户受 IP 地址安全限制",
    submitButton: "验证并安全登录",
    verifying: "正在进行身份验证...",
    demoTitle: "系统演示账户",
    adminRole: "系统管理员 (Admin)",
    teacherRole: "学校教师 (Teacher)",
    adminDesc: "管理学生、教师、财务、学术证书及系统参数配置。",
    teacherDesc: "查看学生考勤统计、录入考勤、QR 扫码签到及报表。",
    fillBtn: "自动填充",
    quickBtn: "一键登录",
    footer: `© 2026 ${developerName}`,
    version: "Version 9.0.0",
    exampleUser: "用户名",
    enterPass: "请输入密码",
    changeLang: "切换语言",
    selectLang: "选择语言",
    emptyError: "请输入用户名和密码！",
    connError: "无法连接到系统！",
    loginErrDefault: "登录凭据无效或网络问题！"
  }
});

interface LoginFormProps {
  onLoginSuccess: (authData: AuthResponse) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const queryParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isAdminUrl = queryParams.get("admin_login") === "true" ||
                     queryParams.get("mode") === "admin" ||
                     queryParams.get("mode") === "staff";
  const isParentUrl = !isAdminUrl && (
                      queryParams.get("parent_login") === "true" ||
                      queryParams.get("portal_student") === "login" ||
                      queryParams.get("portal_student") === "parent" ||
                      queryParams.get("portal_student") === "guardian" ||
                      queryParams.get("mode") === "parent"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"staff" | "student">(isParentUrl ? "student" : "staff"); // Default to Staff if admin_login=true or default
  const [studentIdInput, setStudentIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [autofillSource, setAutofillSource] = useState<"admin" | "teacher" | null>(null);
  
  const [sampleStudents, setSampleStudents] = useState<Array<{ phone: string; name: string; studentId: string; email?: string }>>([]);

  // Guardian / Student Portal Modal States
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [showGuardianForgotInfo, setShowGuardianForgotInfo] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  // Forgot Password Screen & API States
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotTarget, setForgotTarget] = useState<"admin" | "student">("admin");
  const [forgotStep, setForgotStep] = useState<"select" | "input" | "result" | "reset_success">("select");
  const [forgotMethod, setForgotMethod] = useState<"phone" | "email" | "student_id">("phone");
  const [forgotQuery, setForgotQuery] = useState("");
  const [forgotSearchResult, setForgotSearchResult] = useState<any>(null);
  const [forgotSearchLoading, setForgotSearchLoading] = useState(false);
  const [forgotSearchError, setForgotSearchError] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Dedicated Registration Screen States
  const [isRegisterScreenOpen, setIsRegisterScreenOpen] = useState(false);
  const [registerType, setRegisterType] = useState<"parent" | "student" | null>(null);
  const [registerStep, setRegisterStep] = useState<"select" | "form" | "input" | "result" | "success">("select");
  
  // Registration Form Fields matching exact user screenshot
  const [regStudentId, setRegStudentId] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regFormError, setRegFormError] = useState<string | null>(null);

  const [registerQuery, setRegisterQuery] = useState("");
  const [registerSearchResult, setRegisterSearchResult] = useState<any>(null);
  const [registerSearchLoading, setRegisterSearchLoading] = useState(false);
  const [registerSearchError, setRegisterSearchError] = useState<string | null>(null);
  const [registerSubmitLoading, setRegisterSubmitLoading] = useState(false);
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);

  const handleSelectRegisterType = (type: "parent" | "student") => {
    setRegisterType(type);
    setRegStudentId("");
    setRegFirstName("");
    setRegLastName("");
    setRegPhone("");
    setRegPassword("");
    setRegConfirmPassword("");
    setRegFormError(null);
    setRegisterQuery("");
    setRegisterSearchResult(null);
    setRegisterSearchError(null);
    setRegisterStep("form"); // Default directly to the screenshot form
  };

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegFormError(null);

    if (registerType === "student") {
      if (!regStudentId.trim()) {
        setRegFormError("សូមបញ្ចូលលេខសំគាល់សិស្ស!");
        return;
      }
      if (!regPassword.trim()) {
        setRegFormError("សូមបញ្ចូលពាក្យសម្ងាត់!");
        return;
      }
      if (regPassword.length < 6) {
        setRegFormError("ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៦ តួ!");
        return;
      }
      if (regPassword !== regConfirmPassword) {
        setRegFormError("ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!");
        return;
      }
    } else {
      if (!regFirstName.trim() || !regLastName.trim()) {
        setRegFormError("សូមបញ្ចូលនាម និងគោត្តនាមអាណាព្យាបាលឱ្យបានពេញលេញ!");
        return;
      }
      if (!regPhone.trim()) {
        setRegFormError("សូមបញ្ចូលលេខទូរស័ព្ទអាណាព្យាបាល!");
        return;
      }
      if (!regPassword.trim()) {
        setRegFormError("សូមបញ្ចូលពាក្យសម្ងាត់!");
        return;
      }
      if (regPassword.length < 6) {
        setRegFormError("ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៦ តួ!");
        return;
      }
      if (regPassword !== regConfirmPassword) {
        setRegFormError("ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!");
        return;
      }
    }

    setRegisterSubmitLoading(true);
    try {
      const res = await fetch("/api/auth/register/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: registerType,
          studentId: registerType === "student" ? regStudentId.trim() : undefined,
          firstName: registerType === "parent" ? regFirstName.trim() : undefined,
          lastName: registerType === "parent" ? regLastName.trim() : undefined,
          phone: registerType === "parent" ? regPhone.trim() : undefined,
          password: regPassword.trim()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "មិនអាចចុះឈ្មោះបានទេ!");
      }
      setRegisterSearchResult(data);
      setRegisterSuccessMsg(data.message);
      setRegisterStep("success");
    } catch (err: any) {
      setRegFormError(err.message || "មានបញ្ហាក្នុងការចុះឈ្មោះ!");
    } finally {
      setRegisterSubmitLoading(false);
    }
  };

  const handleRegisterSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerQuery.trim()) return;
    setRegisterSearchLoading(true);
    setRegisterSearchError(null);
    try {
      const res = await fetch("/api/auth/register/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: registerType, query: registerQuery.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "រកមិនឃើញទិន្នន័យស្របគ្នាក្នុងប្រព័ន្ធឡើយ!");
      }
      setRegisterSearchResult(data);
      setRegisterStep("result");
    } catch (err: any) {
      setRegisterSearchError(err.message || "មានបញ្ហាក្នុងការស្វែងរក!");
    } finally {
      setRegisterSearchLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPassword.trim()) return;
    setRegisterSubmitLoading(true);
    try {
      const selectedStudentId = registerSearchResult?.data?.[0]?.studentId || registerQuery.trim();
      const res = await fetch("/api/auth/register/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: registerType,
          studentId: selectedStudentId,
          phone: registerQuery.trim(),
          password: regPassword.trim()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "មិនអាចចុះឈ្មោះបានទេ!");
      }
      setRegisterSuccessMsg(data.message);
      setRegisterStep("success");
    } catch (err: any) {
      alert(err.message || "មានបញ្ហាក្នុងការចុះឈ្មោះ!");
    } finally {
      setRegisterSubmitLoading(false);
    }
  };

  const handleSelectForgotMethod = (method: "phone" | "email" | "student_id") => {
    setForgotMethod(method);
    setForgotQuery("");
    setForgotSearchResult(null);
    setForgotSearchError(null);
    setForgotStep("input");
  };

  const handleForgotSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotQuery.trim()) return;
    setForgotSearchLoading(true);
    setForgotSearchError(null);
    try {
      const res = await fetch("/api/auth/forgot-password/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: forgotMethod, query: forgotQuery.trim(), target: forgotTarget })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "រកមិនឃើញទិន្នន័យស្របគ្នាក្នុងប្រព័ន្ធឡើយ!");
      }
      setForgotSearchResult(data);
      setForgotStep("result");
    } catch (err: any) {
      setForgotSearchError(err.message || "មានបញ្ហាក្នុងការស្វែងរក!");
    } finally {
      setForgotSearchLoading(false);
    }
  };

  const handleForgotResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) return;
    setResetLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: forgotMethod, query: forgotQuery.trim(), newPassword: newPasswordInput.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "មិនអាចផ្លាស់ប្តូរពាក្យសម្ងាត់បានទេ!");
      }
      setResetSuccessMsg(data.message);
      setForgotStep("reset_success");
    } catch (err: any) {
      alert(err.message || "មានបញ្ហាក្នុងការកំណត់ពាក្យសម្ងាត់!");
    } finally {
      setResetLoading(false);
    }
  };

  const [uiLang, setUiLang] = useState<"en" | "kh">(
    (localStorage.getItem("plc_lang") as "en" | "kh") || "kh"
  );
  
  // System Settings State
  const [schoolName, setSchoolName] = useState("PLC Computer School");
  const [schoolKhmerName, setSchoolKhmerName] = useState("សាលាកុំព្យូទ័រ ភីអិលស៊ី");
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [schoolPhone, setSchoolPhone] = useState("087 850 014 / 097 501 3648");
  const [schoolAddress, setSchoolAddress] = useState("រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា (Phnom Penh, Cambodia)");
  const [schoolTelegram, setSchoolTelegram] = useState("plccomputerschool");
  const [directorName, setDirectorName] = useState("ជី សុភា (CHY SOPHEA)");
  const [developerName, setDeveloperName] = useState("PLC Computer School");
  const [developerKhmerName, setDeveloperKhmerName] = useState("ភីអិលស៊ី កុំព្យូទ័រ");
  const [developerPhone, setDeveloperPhone] = useState("087 850 014");
  const [developerTelegram, setDeveloperTelegram] = useState("https://t.me/plccomputerschool");
  const [appTheme, setAppTheme] = useState("indigo");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode") || params.get("type") || params.get("role");
    const isAdminParam = params.get("admin_login") === "true";
    const isParentParam = params.get("parent_login") === "true";

    if (isAdminParam || modeParam === "staff" || modeParam === "admin" || modeParam === "teacher") {
      setLoginMode("staff");
      setIsPortalModalOpen(false);
    } else if (isParentParam || modeParam === "guardian" || modeParam === "student" || modeParam === "parent") {
      setLoginMode("student");
      setIsPortalModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/system/settings");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data.schoolName) setSchoolName(data.schoolName);
            if (data.schoolKhmerName) setSchoolKhmerName(data.schoolKhmerName);
            if (data.schoolLogo) setSchoolLogo(data.schoolLogo);
            if (data.schoolPhone) setSchoolPhone(data.schoolPhone);
            if (data.schoolAddress) setSchoolAddress(data.schoolAddress);
            if (data.schoolTelegram) setSchoolTelegram(data.schoolTelegram);
            if (data.directorName) setDirectorName(data.directorName);
            if (data.developerName) setDeveloperName(data.developerName);
            if (data.developerKhmerName) setDeveloperKhmerName(data.developerKhmerName);
            if (data.developerPhone) setDeveloperPhone(data.developerPhone);
            if (data.developerTelegram) setDeveloperTelegram(data.developerTelegram);
            if (data.appTheme) setAppTheme(data.appTheme);
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    const fetchSampleStudents = async () => {
      try {
        const res = await fetch("/api/public/sample-students");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.samples) && data.samples.length > 0) {
            setSampleStudents(data.samples);
          }
        }
      } catch (err) {
        console.error("Failed to fetch sample students:", err);
      }
    };

    loadSettings();
    fetchSampleStudents();
  }, []);

  const themeCfg = (() => {
    const t = appTheme?.toLowerCase() || "";
    if (t === "crimson" || t === "red") {
      return {
        bannerBg: "bg-[#8f1218]",
        sloganText: "text-[#8f1218]",
        sloganBar: "bg-[#8f1218]",
        focusRing: "focus-within:border-[#8f1218] focus-within:ring-[#8f1218]/10",
        sealBg: "bg-[#8f1218]",
        primaryBtn: "bg-[#8f1218] hover:bg-[#770d13]"
      };
    } else if (t === "emerald" || t === "green") {
      return {
        bannerBg: "bg-[#065f46]",
        sloganText: "text-[#065f46]",
        sloganBar: "bg-[#065f46]",
        focusRing: "focus-within:border-[#065f46] focus-within:ring-[#065f46]/10",
        sealBg: "bg-[#065f46]",
        primaryBtn: "bg-[#065f46] hover:bg-[#022c22]"
      };
    } else if (t === "purple" || t === "violet") {
      return {
        bannerBg: "bg-[#581c87]",
        sloganText: "text-[#581c87]",
        sloganBar: "bg-[#581c87]",
        focusRing: "focus-within:border-[#581c87] focus-within:ring-[#581c87]/10",
        sealBg: "bg-[#581c87]",
        primaryBtn: "bg-[#581c87] hover:bg-[#2e1065]"
      };
    } else if (t === "amber" || t === "orange") {
      return {
        bannerBg: "bg-[#78350f]",
        sloganText: "text-[#78350f]",
        sloganBar: "bg-[#78350f]",
        focusRing: "focus-within:border-[#78350f] focus-within:ring-[#78350f]/10",
        sealBg: "bg-[#78350f]",
        primaryBtn: "bg-[#78350f] hover:bg-[#451a03]"
      };
    }
    // Default Royal / Navy Blue Theme matching user reference image
    return {
      bannerBg: "bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900",
      sloganText: "text-[#1e3a8a]",
      sloganBar: "bg-[#1e3a8a]",
      focusRing: "focus-within:border-blue-600 focus-within:ring-blue-600/10",
      sealBg: "bg-[#1e3a8a]",
      primaryBtn: "bg-blue-600 hover:bg-blue-700 text-white"
    };
  })();

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setUiLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  // Translation helper
  const lt = (key: keyof ReturnType<typeof getLoginTranslations>["kh"]) => {
    const translations = getLoginTranslations(uiLang, schoolName, schoolKhmerName, developerName, developerKhmerName);
    return (translations as any)[uiLang]?.[key] || translations.kh[key] || "";
  };

  // Quick autofill helper for Staff
  const handleAutofill = (type: "admin" | "teacher", autoSubmit = false) => {
    setError(null);
    setAutofillSource(type);
    
    const targetEmail = type === "admin" ? "admin" : "teacher@plc.com";
    const targetPassword = type === "admin" ? "admin123" : "teacher123";
    
    setEmail(targetEmail);
    setPassword(targetPassword);
    if (autoSubmit) {
      setIsLoading(true);
      setTimeout(async () => {
        await executeLogin(targetEmail, targetPassword);
      }, 600);
    } else {
      setTimeout(() => setAutofillSource(null), 1000);
    }
  };

  // Perform login API execution
  const executeLogin = async (usr: string, psw: string) => {
    try {
      let data: any = null;
      let isDemoMode = false;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: usr.trim(), password: psw.trim() }),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || lt("loginErrDefault"));
          }
        } else {
          throw new Error("Server returned non-JSON response");
        }
      } catch (fetchErr: any) {
        // If fetch returns an error thrown from non-ok response, re-throw it so the user sees the actual error message
        if (fetchErr.message && !fetchErr.message.includes("Failed to fetch") && !fetchErr.message.includes("NetworkError")) {
          throw fetchErr;
        }

        console.warn("Backend offline/unreachable. Demo fallback...", fetchErr);
        
        const rawUsr = usr.trim();
        const rawPsw = psw.trim();

        const isAdmin = (rawUsr === "admin" && (rawPsw === "admin123" || rawPsw === "admin")) || (rawUsr === "admin@plc.com" && (rawPsw === "admin123" || rawPsw === "admin"));
        const isTeacher = (rawUsr === "teacher" && rawPsw === "teacher123") || (rawUsr === "teacher@plc.com" && rawPsw === "teacher123");

        if (isAdmin || isTeacher) {
          isDemoMode = true;
          const role = isTeacher ? "TEACHER" : "ADMIN";
          data = {
            token: "demo_auth_token_bypass",
            user: {
              id: role === "ADMIN" ? "demo-admin" : "demo-teacher",
              email: rawUsr.includes("@") ? rawUsr : (role === "ADMIN" ? "admin@plc.com" : "teacher@plc.com"),
              name: role === "ADMIN" ? "Admin (Demo Mode)" : "Teacher (Demo Mode)",
              role: role
            }
          };
        } else {
          throw new Error(
            "ឈ្មោះអ្នកប្រើប្រាស់/អ៊ីម៉ែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ! (សូមពិនិត្យមើលអក្សរធំ-តូច Case Sensitive)"
          );
        }
      }

      if (rememberMe) {
        localStorage.setItem("plc_remembered_email", usr.trim());
        localStorage.setItem("plc_remember_me", "true");
      } else {
        localStorage.removeItem("plc_remembered_email");
        localStorage.setItem("plc_remember_me", "false");
      }

      if (isDemoMode) {
        setSuccessMsg(lt("success") + " (របៀបសាកល្បង - Demo Mode)");
      } else {
        setSuccessMsg(lt("success"));
      }

      setTimeout(() => {
        onLoginSuccess(data);
      }, 800);
    } catch (err: any) {
      setError(err.message || lt("connError"));
      setIsLoading(false);
      setAutofillSource(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMode === "student") {
      const inputVal = studentIdInput.trim();
      if (!inputVal) {
        setError("សូមបញ្ចូលលេខសំគាល់សិស្ស ឬលេខទូរស័ព្ទអាណាព្យាបាល!");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/portal/student/${encodeURIComponent(inputVal)}`);
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || `រកមិនឃើញទិន្នន័យសិស្ស ឬអាណាព្យាបាលដែលមានលេខសំគាល់/លេខទូរស័ព្ទ (${inputVal}) ក្នុងប្រព័ន្ធជាក់ស្តែងឡើយ! សូមពិនិត្យឡើងវិញ ឬចុះឈ្មោះគណនីថ្មី។`);
        }
        setSuccessMsg("បានផ្ទៀងផ្ទាត់ទិន្នន័យពីប្រព័ន្ធជោគជ័យ! កំពុងចូលទៅកាន់ប្រព័ន្ធសិស្ស/អាណាព្យាបាល...");
        setTimeout(() => {
          window.location.href = `/?portal_student=${encodeURIComponent(data.studentId || data.id || inputVal)}`;
        }, 600);
      } catch (err: any) {
        setError(err.message || "មានបញ្ហាក្នុងការស្វែងរកទិន្នន័យក្នុងប្រព័ន្ធ!");
        setIsLoading(false);
      }
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError(lt("emptyError"));
      return;
    }
    setIsLoading(true);
    setError(null);
    await executeLogin(email, password);
  };

  // Dedicated Forgot Password Screen matching the modern Login Form design
  if (isForgotPasswordOpen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-100/80 p-3 sm:p-6 font-sans select-none relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-indigo-200/40 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 opacity-40 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl shadow-indigo-950/15 border border-slate-200/80 overflow-hidden z-10 relative flex flex-col justify-between"
        >
          {/* TOP MODERN GRADIENT HEADER BANNER WITH ABSTRACT WAVE ART */}
          <div className="w-full bg-gradient-to-br from-[#2b337c] via-[#4352b2] to-[#5967cb] relative pt-4 pb-16 px-4 sm:px-5 border-b border-white/10">
            
            {/* Abstract Floating Circles & Wave Overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-[32px] sm:rounded-t-[36px]">
              <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-black/25 blur-2xs"></div>
              <div className="absolute -right-8 -top-10 w-48 h-48 rounded-full bg-white/20 backdrop-blur-md"></div>
              <div className="absolute right-6 top-8 w-28 h-28 rounded-full bg-white/25 shadow-inner"></div>
              
              {/* SVG Wave Lines Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" fill="none">
                <path d="M-50,120 C100,60 200,180 450,90 L450,200 L-50,200 Z" fill="white" fillOpacity="0.1" />
                <path d="M-50,140 C120,80 250,190 450,110 L450,200 L-50,200 Z" fill="white" fillOpacity="0.15" />
              </svg>
            </div>

            {/* Top Control Bar with Back Arrow & Language Selector */}
            <div className="relative z-30 flex items-center justify-between w-full mb-3">
              <button
                type="button"
                onClick={() => {
                  if (forgotStep !== "select") {
                    setForgotStep("select");
                  } else {
                    setIsForgotPasswordOpen(false);
                    if (forgotTarget === "student") {
                      setLoginMode("student");
                    } else {
                      setLoginMode("staff");
                    }
                  }
                }}
                className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all cursor-pointer active:scale-95 border border-white/15"
                title="ត្រឡប់ក្រោយ"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Clean Integrated Language Selector */}
              <LanguageSelector className="flex items-center" />
            </div>

            {/* WELCOME BADGE HEADER TEXT */}
            <div className="relative z-10 flex items-center justify-center gap-2 max-w-sm mx-auto mt-1 py-1 text-white">
              <ShieldCheck className="w-4.5 h-4.5 text-amber-300 shrink-0" />
              <span className="text-sm font-black tracking-wide truncate">
                {forgotTarget === "student" ? "ស្វែងរកគណនី / កំណត់ពាក្យសម្ងាត់" : "កំណត់ពាក្យសម្ងាត់ Admin / គ្រូ"}
              </span>
            </div>
          </div>

          {/* OVERLAPPING WHITE CONTENT SHEET WITH BIG ROUNDED CORNERS */}
          <div className="-mt-10 relative z-20 bg-white rounded-t-[32px] sm:rounded-t-[36px] px-6 sm:px-8 pt-7 pb-6 flex-1 flex flex-col justify-between">
            <div>
              {/* SCHOOL HEADING */}
              <div className="text-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4352b2] tracking-tight">
                  {uiLang === 'en' ? 'PLC Computer School' : 'សាលាកុំព្យូទ័រ ភី អិល ស៊ី'}
                </h1>
              </div>

              {/* SLOGAN & INSTRUCTION */}
              <div className="flex flex-col items-center mb-5 text-center">
                <h2 className="text-[#1e3a8a] font-black text-sm sm:text-base font-battambang tracking-tight">
                  ស្វែងរកគណនី ឬកំណត់ពាក្យសម្ងាត់
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-1 mb-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                </div>
                <p className="text-xs text-slate-500 font-bold leading-relaxed px-2">
                  {forgotTarget === "student"
                    ? "សូមជ្រើសរើសវិធីសាស្ត្រស្វែងរកគណនីខាងក្រោម៖"
                    : "សូមទំនាក់ទំនងទៅកាន់អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) តាមរយៈ Telegram ឬលេខទូរស័ព្ទខាងក្រោម៖"}
                </p>
              </div>

              {/* FORGOT PASSWORD SELECT STEP */}
              {forgotStep === "select" && (
                <div className="w-full space-y-3 pt-1">
                  {forgotTarget === "student" ? (
                    /* GUARDIAN / STUDENT PILL BUTTONS */
                    <div className="w-full space-y-3">
                      {/* 1. BY PHONE BUTTON (WARM AMBER / ORANGE) */}
                      <button
                        type="button"
                        onClick={() => handleSelectForgotMethod("phone")}
                        className="group relative w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white font-black text-sm sm:text-base tracking-wide shadow-md shadow-amber-500/25 border border-amber-300/40 transition-all duration-200 flex items-center justify-between cursor-pointer overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs ring-1 ring-white/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <Phone className="w-4 h-4 text-white stroke-[2.5]" />
                          </div>
                          <span className="drop-shadow-xs">តាមទូរស័ព្ទ</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                      </button>

                      {/* 2. BY EMAIL BUTTON (SOFT CORAL / ROSE) */}
                      <button
                        type="button"
                        onClick={() => handleSelectForgotMethod("email")}
                        className="group relative w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 active:scale-[0.98] text-white font-black text-sm sm:text-base tracking-wide shadow-md shadow-rose-500/25 border border-rose-300/40 transition-all duration-200 flex items-center justify-between cursor-pointer overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs ring-1 ring-white/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <Mail className="w-4 h-4 text-white stroke-[2.5]" />
                          </div>
                          <span className="drop-shadow-xs">តាមអ៊ីម៉ែល</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                      </button>

                      {/* DIVIDER LINE WITH BADGE */}
                      <div className="flex items-center my-3 gap-3 text-slate-300 w-full px-1">
                        <div className="h-[1px] flex-1 bg-slate-200" />
                        <span className="text-[11px] font-bold text-slate-500 tracking-tight whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                          ជម្រើសនេះគឺសម្រាប់តែសិស្សប៉ុណ្ណោះ
                        </span>
                        <div className="h-[1px] flex-1 bg-slate-200" />
                      </div>

                      {/* 3. STUDENT ID BUTTON (SOFT INDIGO / BLUE) */}
                      <button
                        type="button"
                        onClick={() => handleSelectForgotMethod("student_id")}
                        className="group relative w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-[0.98] text-white font-black text-sm sm:text-base tracking-wide shadow-md shadow-indigo-500/25 border border-indigo-300/40 transition-all duration-200 flex items-center justify-between cursor-pointer overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs ring-1 ring-white/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <UserCheck className="w-4 h-4 text-white stroke-[2.5]" />
                          </div>
                          <span className="drop-shadow-xs">លេខសំគាល់សិស្ស</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                      </button>
                    </div>
                  ) : (
                    /* ADMIN / STAFF FORGOT PASSWORD FLOW */
                    <div className="space-y-3">
                      {/* TELEGRAM */}
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        href={
                          schoolTelegram
                            ? schoolTelegram.startsWith("http")
                              ? schoolTelegram
                              : `https://t.me/${schoolTelegram.replace("@", "").trim()}?text=${encodeURIComponent("ជម្រាបសួរអ្នកគ្រប់គ្រងប្រព័ន្ធ! ខ្ញុំបាទ/នាងខ្ញុំសូមស្នើសុំកំណត់ពាក្យសម្ងាត់ឡើងវិញ។")}`
                            : developerTelegram || "https://t.me/plccomputerschool"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full p-4 rounded-2xl bg-[#4352b2] hover:bg-[#344199] text-white font-bold shadow-md shadow-indigo-900/20 border border-indigo-300/30 transition-all flex items-center justify-between gap-3 cursor-pointer group text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white group-hover:scale-110 transition-transform">
                            <Send className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">ស្នើសុំតាម TELEGRAM</div>
                            <div className="text-xs sm:text-sm font-black tracking-tight truncate drop-shadow-3xs">
                              {schoolTelegram
                                ? schoolTelegram.startsWith("http")
                                  ? schoolTelegram
                                  : `https://t.me/${schoolTelegram.replace("@", "").trim()}`
                                : "https://t.me/plccomputerschool"}
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-white text-[#4352b2] text-xs font-black shrink-0 shadow-xs group-hover:bg-amber-300 group-hover:text-slate-900 transition-colors">
                          ផ្ញើសារ ✈️
                        </div>
                      </motion.a>

                      {/* PHONE NUMBERS */}
                      <div className="w-full p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-left space-y-2 shadow-xs">
                        <div className="flex items-center gap-2 text-amber-900">
                          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Phone className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">លេខទូរស័ព្ទអ្នកគ្រប់គ្រងប្រព័ន្ធ / រដ្ឋបាល</div>
                            <div className="text-xs font-black text-amber-950">ទំនាក់ទំនងផ្ទាល់តាមទូរស័ព្ទ</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {Array.from(
                            new Set(
                              [
                                ...(schoolPhone || "087 850 014 / 097 501 3648").split("/"),
                                developerPhone || ""
                              ]
                                .map((p) => p.trim())
                                .filter(Boolean)
                            )
                          ).map((phoneNum, idx) => {
                            const telHref = `tel:${phoneNum.replace(/\s+/g, "")}`;
                            return (
                              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200/70 shadow-3xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-xs font-black text-slate-800 font-mono">📞 {phoneNum}</span>
                                </div>
                                <a
                                  href={telHref}
                                  className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-colors shadow-xs active:scale-95"
                                >
                                  ហៅចេញ
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* INPUT / SEARCH STEP ("input") */}
              {forgotStep === "input" && (
                <form onSubmit={handleForgotSearchSubmit} className="w-full space-y-3.5 pt-1 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      {forgotMethod === "phone" ? "ផ្លាស់ប្ដូរពាក្យសម្ងាត់ដោយប្រើលេខទូរស័ព្ទ" :
                       forgotMethod === "email" ? "ផ្លាស់ប្ដូរពាក្យសម្ងាត់ដោយប្រើអ៊ីម៉ែល" :
                       "ផ្លាស់ប្ដូរពាក្យសម្ងាត់ដោយប្រើអត្តលេខ / ID"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={forgotQuery}
                        onChange={(e) => setForgotQuery(e.target.value)}
                        placeholder={
                          forgotMethod === "phone" ? "សូមបញ្ចូលលេខទូរស័ព្ទ..." :
                          forgotMethod === "email" ? "សូមបញ្ចូលអាសយដ្ឋានអ៊ីម៉ែល..." :
                          "សូមបញ្ចូលលេខសំគាល់សិស្ស..."
                        }
                        autoFocus
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#4352b2]/10 focus:border-[#4352b2] transition-all"
                      />
                    </div>
                  </div>

                  {/* Instructional guide box */}
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">
                      <span className="font-bold block text-indigo-950 mb-0.5">អក្សរណែនាំ៖</span>
                      {forgotMethod === "phone" && "សូមបញ្ចូលលេខទូរស័ព្ទរបស់សិស្ស ឬអាណាព្យាបាលដែលបានចុះឈ្មោះក្នុងប្រព័ន្ធសាលារៀន ដើម្បីផ្ទៀងផ្ទាត់ និងផ្លាស់ប្ដូរពាក្យសម្ងាត់។"}
                      {forgotMethod === "email" && "សូមបញ្ចូលអាសយដ្ឋានអ៊ីម៉ែលដែលបានភ្ជាប់ជាមួយគណនីរបស់អ្នក ដើម្បីស្វែងរកទិន្នន័យក្នុងប្រព័ន្ធ។"}
                      {forgotMethod === "student_id" && "សូមបញ្ចូលអត្តលេខសិស្ស (Student ID) ឬឈ្មោះគណនីរបស់អ្នកដែលបានផ្តល់ជូនដោយសាលា។"}
                    </div>
                  </div>



                  {forgotSearchError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{forgotSearchError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotSearchLoading}
                    className="w-full py-3.5 rounded-full bg-[#4352b2] hover:bg-[#344199] text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-indigo-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {forgotSearchLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>ស្វែងរកគណនីក្នុងប្រព័ន្ធ</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* RESULT / ACCOUNT FOUND STEP ("result") */}
              {forgotStep === "result" && forgotSearchResult && forgotSearchResult.data && (
                <div className="w-full space-y-3.5 text-left">
                  <div className="bg-slate-50 border-2 border-emerald-500/30 p-4 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-800 font-black text-base shrink-0 overflow-hidden shadow-xs">
                        {forgotSearchResult?.data?.photoUrl ? (
                          <img src={forgotSearchResult.data.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase mb-0.5">
                          {forgotSearchResult.type === "student" ? `កូដសិស្ស៖ ${forgotSearchResult?.data?.studentId}` :
                           forgotSearchResult.type === "teacher" ? `កូដគ្រូបង្រៀន៖ ${forgotSearchResult?.data?.teacherId || 'TEA-001'}` :
                           `គណនី ${forgotSearchResult?.data?.role === 'ADMIN' ? 'អ្នកគ្រប់គ្រង (Admin)' : 'បុគ្គលិករដ្ឋបាល (Staff)'}`}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                          {forgotSearchResult?.data?.nameKh || forgotSearchResult?.data?.fullName || "ឈ្មោះអ្នកប្រើប្រាស់"}
                        </h4>
                        <div className="text-[11px] text-slate-600 font-bold truncate">
                          {forgotSearchResult?.data?.course || forgotSearchResult?.data?.email || "ព័ត៌មានគណនី"}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/80 pt-2.5 text-[11px] font-bold text-slate-700 space-y-1.5">
                      {forgotSearchResult?.data?.phoneNumber && (
                        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                          <span>📞 លេខទូរស័ព្ទ៖ <strong className="text-slate-900">{forgotSearchResult.data.phoneNumber}</strong></span>
                          <a href={`tel:${forgotSearchResult.data.phoneNumber.replace(/\s+/g, '')}`} className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-700 transition-colors">
                            ហៅចេញ
                          </a>
                        </div>
                      )}
                      {forgotSearchResult?.data?.email && (
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          ✉️ អ៊ីម៉ែល៖ <strong className="text-slate-900">{forgotSearchResult.data.email}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleForgotResetSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-700 block uppercase">
                        បញ្ចូលពាក្យសម្ងាត់ថ្មី
                      </label>
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="ពាក្យសម្ងាត់ថ្មី (យ៉ាងហោច ៦ តួ)"
                        required
                        minLength={6}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#4352b2] focus:ring-2 focus:ring-[#4352b2]/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-3.5 rounded-full bg-[#4352b2] hover:bg-[#344199] text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {resetLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <span>រក្សាទុកពាក្យសម្ងាត់ថ្មី</span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* RESET SUCCESS STEP ("reset_success") */}
              {forgotStep === "reset_success" && (
                <div className="w-full space-y-4 text-center py-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-200 shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-emerald-800">ផ្លាស់ប្តូរជោគជ័យ!</h4>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed px-2">
                      {resetSuccessMsg || "ពាក្យសម្ងាត់របស់អ្នកត្រូវបានកំណត់ឡើងវិញរួចរាល់។ សូមចូលប្រើប្រាស់ដោយប្រើពាក្យសម្ងាត់ថ្មី។"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordOpen(false);
                      setLoginMode("student");
                    }}
                    className="w-full py-3.5 rounded-full bg-[#4352b2] hover:bg-[#344199] text-white font-extrabold text-sm uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    <span>ចូលប្រើប្រាស់ឥឡូវនេះ</span>
                  </button>
                </div>
              )}

            </div>

            {/* Footer Area with Version */}
            <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans border-t border-slate-100 mt-6">
              <span>©2026 {schoolName || "PLC Computer School"}</span>
              <span>Version 1.3.6</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dedicated Registration Screen matching the modern Login Form design
  if (isRegisterScreenOpen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-100/80 p-3 sm:p-6 font-sans select-none relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-indigo-200/40 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 opacity-40 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl shadow-indigo-950/15 border border-slate-200/80 overflow-hidden z-10 relative flex flex-col justify-between"
        >
          {/* TOP MODERN GRADIENT HEADER BANNER WITH ABSTRACT WAVE ART */}
          <div className="w-full bg-gradient-to-br from-[#2b337c] via-[#4352b2] to-[#5967cb] relative pt-4 pb-16 px-4 sm:px-5 border-b border-white/10">
            
            {/* Abstract Floating Circles & Wave Overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-[32px] sm:rounded-t-[36px]">
              <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-black/25 blur-2xs"></div>
              <div className="absolute -right-8 -top-10 w-48 h-48 rounded-full bg-white/20 backdrop-blur-md"></div>
              <div className="absolute right-6 top-8 w-28 h-28 rounded-full bg-white/25 shadow-inner"></div>
              
              {/* SVG Wave Lines Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" fill="none">
                <path d="M-50,120 C100,60 200,180 450,90 L450,200 L-50,200 Z" fill="white" fillOpacity="0.1" />
                <path d="M-50,140 C120,80 250,190 450,110 L450,200 L-50,200 Z" fill="white" fillOpacity="0.15" />
              </svg>
            </div>

            {/* Top Control Bar with Back Arrow & Language Selector */}
            <div className="relative z-30 flex items-center justify-between w-full mb-3">
              <button
                type="button"
                onClick={() => {
                  if (registerStep !== "select") {
                    setRegisterStep("select");
                  } else {
                    setIsRegisterScreenOpen(false);
                  }
                }}
                className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all cursor-pointer active:scale-95 border border-white/15"
                title="ត្រឡប់ក្រោយ"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Clean Integrated Language Selector */}
              <LanguageSelector className="flex items-center" />
            </div>

            {/* WELCOME BADGE HEADER TEXT */}
            <div className="relative z-10 flex items-center justify-center gap-2 max-w-sm mx-auto mt-1 py-1 text-white">
              <Sparkles className="w-4.5 h-4.5 text-amber-300 shrink-0" />
              <span className="text-sm font-black tracking-wide truncate">
                ចុះឈ្មោះប្រើប្រាស់ប្រព័ន្ធ (REGISTER)
              </span>
            </div>
          </div>

          {/* OVERLAPPING WHITE CONTENT SHEET WITH BIG ROUNDED CORNERS */}
          <div className="-mt-10 relative z-20 bg-white rounded-t-[32px] sm:rounded-t-[36px] px-6 sm:px-8 pt-7 pb-6 flex-1 flex flex-col justify-between">
            <div>
              {/* SCHOOL HEADING */}
              <div className="text-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4352b2] tracking-tight">
                  {uiLang === 'en' ? 'PLC Computer School' : 'សាលាកុំព្យូទ័រ ភី អិល ស៊ី'}
                </h1>
              </div>

              {/* SLOGAN & INSTRUCTION */}
              <div className="flex flex-col items-center mb-5 text-center">
                <h2 className="text-[#1e3a8a] font-black text-sm sm:text-base font-battambang tracking-tight">
                  សិក្សាបច្ចេកវិទ្យាឌីជីថល ដើម្បីភាពរីកចម្រើនទៅមុខ
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-1 mb-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                </div>
                {registerStep === "select" && (
                  <p className="text-xs text-slate-500 font-bold leading-relaxed px-2">
                    សូមជ្រើសរើសប្រភេទគណនីដែលអ្នកចង់ចុះឈ្មោះ៖
                  </p>
                )}
              </div>

              {/* STEP 1: 2 CARDS FOR SELECTION ("ឪពុកម្តាយ" vs "សិស្ស") */}
              {registerStep === "select" && (
                <div className="grid grid-cols-2 gap-3.5 w-full pt-1">
                  
                  {/* CARD 1: PARENTS ("ឪពុកម្តាយ") */}
                  <button
                    type="button"
                    onClick={() => handleSelectRegisterType("parent")}
                    className="bg-slate-50 rounded-2xl p-4 sm:p-5 border-2 border-slate-100 hover:border-[#4352b2] hover:bg-indigo-50/40 hover:shadow-md transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group"
                  >
                    <div className="p-1 rounded-2xl bg-white shadow-2xs group-hover:scale-105 transition-transform">
                      <ParentsIllustration className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                    <span className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight group-hover:text-[#4352b2] transition-colors">
                      ឪពុកម្តាយ
                    </span>
                  </button>

                  {/* CARD 2: STUDENTS ("សិស្ស") */}
                  <button
                    type="button"
                    onClick={() => handleSelectRegisterType("student")}
                    className="bg-slate-50 rounded-2xl p-4 sm:p-5 border-2 border-slate-100 hover:border-[#4352b2] hover:bg-indigo-50/40 hover:shadow-md transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group"
                  >
                    <div className="p-1 rounded-2xl bg-white shadow-2xs group-hover:scale-105 transition-transform">
                      <StudentIllustration className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                    <span className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight group-hover:text-[#4352b2] transition-colors">
                      សិស្ស
                    </span>
                  </button>

                </div>
              )}

              {/* STEP 2: REGISTRATION FORM FOR PARENTS / STUDENTS */}
              {registerStep === "form" && (
                <form onSubmit={handleRegisterFormSubmit} className="w-full space-y-3 pt-1 text-left">
                  
                  {registerType === "student" ? (
                    <>
                      {/* Student Field 1: Student ID */}
                      <div className="w-full relative flex items-center bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-[#4352b2]/10 focus-within:border-[#4352b2] rounded-full h-11 px-4 transition-all">
                        <div className="w-5 h-5 text-slate-400 shrink-0 mr-3 flex items-center justify-center">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="16" rx="3" />
                            <circle cx="9" cy="10" r="2.5" />
                            <path d="M15 8h2" />
                            <path d="M15 12h2" />
                            <path d="M6 16c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={regStudentId}
                          onChange={(e) => setRegStudentId(e.target.value)}
                          placeholder="សូមបញ្ចូលលេខសំគាល់សិស្ស"
                          required
                          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* Student Field 2: Password */}
                      <div className="w-full relative flex items-center bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-[#4352b2]/10 focus-within:border-[#4352b2] rounded-full h-11 px-4 transition-all">
                        <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="សូមបញ្ចូលពាក្យសម្ងាត់"
                          required
                          minLength={6}
                          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* Student Field 3: Confirm Password */}
                      <div className="w-full relative flex items-center bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-[#4352b2]/10 focus-within:border-[#4352b2] rounded-full h-11 px-4 transition-all">
                        <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="សូមបញ្ចូលបញ្ជាក់ពាក្យសម្ងាត់"
                          required
                          minLength={6}
                          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Parent Field 1: First Name */}
                      <div className="w-full relative flex items-center bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-[#4352b2]/10 focus-within:border-[#4352b2] rounded-full h-11 px-4 transition-all">
                        <User className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                        <input
                          type="text"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="សូមបញ្ចូលនាម"
                          required
                          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* Parent Field 2: Last Name */}
                      <div className="w-full relative flex items-center bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-[#4352b2]/10 focus-within:border-[#4352b2] rounded-full h-11 px-4 transition-all">
                        <User className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                        <input
                          type="text"
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="សូមបញ្ចូលគោត្តនាម"
                          required
                          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* Parent Field 3: Phone Number with +855 badge */}
                      <div className="w-full relative flex items-center bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-[#4352b2]/10 focus-within:border-[#4352b2] rounded-full h-11 px-4 transition-all">
                        <span className="font-extrabold text-slate-800 text-xs shrink-0 mr-3 pr-2.5 border-r border-slate-200">
                          +855
                        </span>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="សូមបញ្ចូលលេខទូរស័ព្ទ"
                          required
                          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* Parent Field 4: Password */}
                      <div className="w-full relative flex items-center bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-[#4352b2]/10 focus-within:border-[#4352b2] rounded-full h-11 px-4 transition-all">
                        <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="សូមបញ្ចូលពាក្យសម្ងាត់"
                          required
                          minLength={6}
                          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {/* Parent Field 5: Confirm Password */}
                      <div className="w-full relative flex items-center bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-[#4352b2]/10 focus-within:border-[#4352b2] rounded-full h-11 px-4 transition-all">
                        <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="សូមបញ្ចូលបញ្ជាក់ពាក្យសម្ងាត់"
                          required
                          minLength={6}
                          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </>
                  )}

                  {/* Error Banner if any */}
                  {regFormError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{regFormError}</span>
                    </div>
                  )}

                  {/* PRIMARY ACTION BUTTON */}
                  <button
                    type="submit"
                    disabled={registerSubmitLoading}
                    className="w-full py-3.5 rounded-full bg-[#4352b2] hover:bg-[#344199] text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-indigo-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 overflow-hidden"
                  >
                    {registerSubmitLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>ចុះឈ្មោះចូលប្រើ</span>
                      </>
                    )}
                  </button>

                  {/* Secondary Option link to search by student code */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setRegisterStep("input")}
                      className="text-xs font-bold text-slate-500 hover:text-[#4352b2] transition-colors cursor-pointer"
                    >
                      ឬស្វែងរកតាមលេខសំគាល់សិស្ស (Student ID)
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: INPUT FORM FOR SEARCHING SYSTEM DATA */}
              {registerStep === "input" && (
                <form onSubmit={handleRegisterSearchSubmit} className="w-full space-y-3.5 pt-1 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      {registerType === "parent" ? "បញ្ចូលលេខទូរស័ព្ទអាណាព្យាបាល ឬកូដសិស្ស" : "បញ្ចូលលេខសំគាល់សិស្ស (Student ID)"}
                    </label>
                    <input
                      type="text"
                      value={registerQuery}
                      onChange={(e) => setRegisterQuery(e.target.value)}
                      placeholder={registerType === "parent" ? "សូមបញ្ចូលលេខទូរស័ព្ទ ឬកូដសិស្ស..." : "សូមបញ្ចូលលេខសំគាល់សិស្ស..."}
                      autoFocus
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#4352b2]/10 focus:border-[#4352b2] transition-all"
                    />
                  </div>

                  {/* Instructional guide box */}
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">
                      <span className="font-bold block text-indigo-950 mb-0.5">អក្សរណែនាំ៖</span>
                      {registerType === "parent"
                        ? "សូមបញ្ចូលលេខទូរស័ព្ទរបស់អាណាព្យាបាល ឬអត្តលេខសិស្សដែលបានចុះឈ្មោះក្នុងប្រព័ន្ធ ដើម្បីស្វែងរកទិន្នន័យ និងចុះឈ្មោះប្រើប្រាស់។"
                        : "សូមបញ្ចូលលេខសំគាល់សិស្ស (Student ID) ដែលសាលារៀនបានផ្តល់ជូនដើម្បីបង្កើតគណនីប្រើប្រាស់។"}
                    </div>
                  </div>



                  {registerSearchError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{registerSearchError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={registerSearchLoading}
                    className="w-full py-3.5 rounded-full bg-[#4352b2] hover:bg-[#344199] text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-indigo-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {registerSearchLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <span>ស្វែងរកព័ត៌មានក្នុងប្រព័ន្ធ</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 3: RESULT MATCHED & PASSWORD CREATION */}
              {registerStep === "result" && registerSearchResult && (
                <div className="w-full space-y-3.5 text-left">
                  <div className="bg-slate-50 border-2 border-emerald-500/30 p-3.5 rounded-2xl shadow-sm space-y-2 max-h-[40vh] overflow-y-auto">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      រកឃើញទិន្នន័យស្របគ្នា ({registerSearchResult.count})
                    </span>
                    {registerSearchResult.data?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 pt-1 border-t border-slate-200/60 first:border-0 first:pt-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-black shrink-0 overflow-hidden text-xs">
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-indigo-700">{item.studentId}</div>
                          <h4 className="text-xs font-black text-slate-800">{item.nameKh}</h4>
                          <div className="text-[10px] text-slate-500 font-bold">{item.course} - {item.level}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-700 block uppercase">
                        បង្កើតពាក្យសម្ងាត់សម្រាប់ចូលប្រើប្រាស់
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="ពាក្យសម្ងាត់ (យ៉ាងហោច ៦ តួ)"
                        required
                        minLength={6}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#4352b2]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={registerSubmitLoading}
                      className="w-full py-3.5 rounded-full bg-[#4352b2] hover:bg-[#344199] text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {registerSubmitLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <span>ចុះឈ្មោះ និងបង្កើតគណនី</span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {registerStep === "success" && (
                <div className="w-full space-y-4 text-center py-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-200 shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-emerald-800">ចុះឈ្មោះជោគជ័យ!</h4>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed px-2">
                      {registerSuccessMsg || "គណនីរបស់អ្នកត្រូវបានបង្កើត និងភ្ជាប់ទៅប្រព័ន្ធរួចរាល់។"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterScreenOpen(false);
                      setLoginMode("student");
                    }}
                    className="w-full py-3.5 rounded-full bg-[#4352b2] hover:bg-[#344199] text-white font-extrabold text-sm uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    <span>ចូលប្រើប្រាស់ឥឡូវនេះ</span>
                  </button>
                </div>
              )}

            </div>

            {/* Footer Area with Version */}
            <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans border-t border-slate-100 mt-6">
              <span>©2026 {schoolName || "PLC Computer School"}</span>
              <span>Version 1.3.6</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Guardian / Student Mobile Portal Interface matching Admin Login Form design
  if (loginMode === "student") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-100/80 p-3 sm:p-6 font-sans select-none relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-indigo-200/40 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 opacity-40 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl shadow-indigo-950/15 border border-slate-200/80 overflow-hidden z-10 relative flex flex-col justify-between"
        >
          {/* TOP MODERN GRADIENT HEADER BANNER WITH ABSTRACT WAVE ART */}
          <div className="w-full bg-gradient-to-br from-[#2b337c] via-[#4352b2] to-[#5967cb] relative pt-4 pb-16 px-4 sm:px-5 border-b border-white/10">
            
            {/* Abstract Floating Circles & Wave Overlay clipped to top corners */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-[32px] sm:rounded-t-[36px]">
              <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-black/25 blur-2xs"></div>
              <div className="absolute -right-8 -top-10 w-48 h-48 rounded-full bg-white/20 backdrop-blur-md"></div>
              <div className="absolute right-6 top-8 w-28 h-28 rounded-full bg-white/25 shadow-inner"></div>
              
              {/* Subtle SVG Wave Lines Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" fill="none">
                <path d="M-50,120 C100,60 200,180 450,90 L450,200 L-50,200 Z" fill="white" fillOpacity="0.1" />
                <path d="M-50,140 C120,80 250,190 450,110 L450,200 L-50,200 Z" fill="white" fillOpacity="0.15" />
              </svg>
            </div>

            {/* Top Control Bar with Language Selector */}
            <div className="relative z-30 flex items-center justify-end w-full mb-3">
              {/* Clean Integrated Language Selector */}
              <LanguageSelector className="flex items-center" />
            </div>

            {/* WELCOME BADGE HEADER TEXT */}
            <div className="relative z-10 flex items-center justify-center gap-2 max-w-sm mx-auto mt-1 py-1 text-white">
              <ShieldCheck className="w-4.5 h-4.5 text-amber-300 shrink-0" />
              <span className="text-sm font-black tracking-wide truncate">
                {uiLang === 'en' ? 'Welcome to Student & Guardian Portal' : 'សូមស្វាគមន៍! មកកាន់ប្រព័ន្ធសិស្ស និងអាណាព្យាបាល'}
              </span>
            </div>
          </div>

          {/* OVERLAPPING WHITE CONTENT SHEET WITH BIG ROUNDED CORNERS */}
          <div className="-mt-10 relative z-20 bg-white rounded-t-[32px] sm:rounded-t-[36px] px-6 sm:px-8 pt-7 pb-6 flex-1 flex flex-col justify-between">
            <div>
              {/* SCHOOL HEADING MATCHING ADMIN FORM STYLE */}
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4352b2] tracking-tight">
                  {uiLang === 'en' ? 'PLC Computer School' : 'សាលាកុំព្យូទ័រ ភី អិល ស៊ី'}
                </h1>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  {uiLang === 'en' ? 'Student & Guardian Portal' : 'ចូលប្រព័ន្ធអាណាព្យាបាល និងសិស្ស'}
                </p>
              </div>

              {/* Dynamic Error or Success Feedbacks */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error-box"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5 shadow-xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <div className="leading-relaxed text-left">
                      <div className="font-black text-rose-900">{lt("failed")}</div>
                      <div className="font-bold mt-0.5">{error}</div>
                    </div>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div
                    key="success-box"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-start gap-2.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 animate-bounce" />
                    <div className="leading-relaxed text-left">
                      <div className="font-black text-emerald-900">{lt("success")}</div>
                      <div className="font-bold mt-0.5">{successMsg}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STUDENT & GUARDIAN LOGIN FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* FIELD 1: STUDENT ID OR PHONE */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-slate-500">
                    {uiLang === 'en' ? 'Student ID or Guardian Phone' : 'លេខកូដសិស្ស ឬ លេខទូរស័ព្ទអាណាព្យាបាល'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studentIdInput}
                      onChange={(e) => setStudentIdInput(e.target.value)}
                      placeholder={uiLang === 'en' ? 'Enter Student ID or Guardian Phone...' : 'សូមបញ្ចូលលេខកូដសិស្ស ឬ លេខទូរស័ព្ទ...'}
                      autoFocus
                      required
                      className="w-full px-4 py-3 sm:py-3.5 rounded-2xl border border-slate-200/90 bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#4352b2]/10 focus:border-[#4352b2] transition-all placeholder:text-slate-400/80 shadow-2xs"
                    />
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-600 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-[#4352b2] shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-bold text-slate-800">អក្សរណែនាំ៖ </span>
                      {uiLang === 'en' 
                        ? 'Enter registered Student ID or Guardian Phone number to access student portal data.'
                        : 'សូមបញ្ចូលលេខកូដសិស្ស (Student ID) ឬលេខទូរស័ព្ទអាណាព្យាបាលដែលបានចុះឈ្មោះក្នុងប្រព័ន្ធសាលារៀន។'}
                    </div>
                  </div>
                </div>

                {/* FIELD 2: PASSWORD */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-slate-500">
                    {uiLang === 'en' ? 'Password' : 'ពាក្យសម្ងាត់'}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={uiLang === 'en' ? 'Enter password' : 'សូមបញ្ចូលពាក្យសម្ងាត់'}
                      className="w-full pl-4 pr-11 py-3 sm:py-3.5 rounded-2xl border border-slate-200/90 bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#4352b2]/10 focus:border-[#4352b2] transition-all placeholder:text-slate-400/80 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* LOGIN SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-[#4352b2] hover:bg-[#344199] text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-indigo-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      <UserCheck className="w-4.5 h-4.5" />
                      <span>{uiLang === 'en' ? 'Login to Portal' : 'ចូលប្រើប្រាស់ប្រព័ន្ធ'}</span>
                    </>
                  )}
                </button>

                {/* FORGOT PASSWORD & REGISTER LINKS */}
                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotTarget("student");
                      setIsForgotPasswordOpen(true);
                      setForgotStep("select");
                    }}
                    className="text-[#4352b2] font-bold hover:underline cursor-pointer"
                  >
                    {uiLang === 'en' ? 'Forgot Password?' : 'ភ្លេចពាក្យសម្ងាត់?'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterScreenOpen(true);
                      setRegisterStep("select");
                    }}
                    className="text-slate-600 font-bold hover:text-[#4352b2] hover:underline cursor-pointer"
                  >
                    {uiLang === 'en' ? 'Register' : 'ចុះឈ្មោះចូលប្រើ'}
                  </button>
                </div>



              </form>
            </div>

            {/* Footer Area with Version */}
            <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans border-t border-slate-100 mt-6">
              <span>©2026 {schoolName || "PLC Computer School"}</span>
              <span>Version 1.3.6</span>
            </div>
          </div>
        </motion.div>



        {/* --- MODAL 2: REGISTER MODAL ("ចុះឈ្មោះចូលប្រើ") --- */}
        <AnimatePresence>
          {isRegisterModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-slate-100"
              >
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-2xl ${themeCfg.primaryBtn || "bg-blue-600"} text-white flex items-center justify-center shadow-md shrink-0`}>
                    <HeartHandshake className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">ចុះឈ្មោះប្រើប្រាស់អាណាព្យាបាល</h3>
                    <p className="text-xs text-slate-400 font-medium">ទំនាក់ទំនងការិយាល័យដើម្បីភ្ជាប់គណនី</p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed my-3">
                  <p className="font-bold text-slate-800">
                    សូមជម្រាបជូនអាណាព្យាបាល៖
                  </p>
                  <p>
                    ដើម្បីចុះឈ្មោះ ឬតភ្ជាប់លេខទូរស័ព្ទអាណាព្យាបាលទៅកាន់គណនីសិស្ស សូមផ្ញើសារ ឬទំនាក់ទំនងមកកាន់ការិយាល័យរដ្ឋបាលសាលារៀន ឬតេឡេក្រាមផ្លូវការ៖
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5 font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Phone className={`w-4 h-4 ${themeCfg.sloganText}`} />
                      <span>{schoolPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-blue-500" />
                      <span>{schoolTelegram}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterModalOpen(false);
                    setIsPortalModalOpen(true);
                  }}
                  className={`w-full py-3.5 rounded-full ${themeCfg.primaryBtn || "bg-blue-600 hover:bg-blue-700"} text-white font-black text-sm uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <span>ចូលប្រើប្រាស់ដោយប្រើកូដសិស្ស</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL 3: ABOUT SCHOOL MODAL ("អំពីសាលា") --- */}
        <AnimatePresence>
          {isAboutModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-slate-100"
              >
                <button
                  type="button"
                  onClick={() => setIsAboutModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#0070ba] text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
                    <Info className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">អំពីសាលារៀន</h3>
                    <p className="text-xs text-slate-400 font-medium">ព័ត៌មានទូទៅ និងទំនាក់ទំនងសាលារៀន</p>
                  </div>
                </div>

                <div className="space-y-2.5 my-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-400 block">ឈ្មោះសាលា</span>
                      <span className="text-xs font-black text-slate-800">{schoolKhmerName} ({schoolName})</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <User className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-400 block">នាយកសាលារៀន</span>
                      <span className="text-xs font-black text-slate-800">{directorName}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-400 block">លេខទូរស័ព្ទទំនាក់ទំនង</span>
                      <span className="text-xs font-black text-slate-800">{schoolPhone}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-400 block">អាសយដ្ឋាន</span>
                      <span className="text-xs font-bold text-slate-700">{schoolAddress}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAboutModalOpen(false)}
                  className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-all cursor-pointer mt-2"
                >
                  បិទ
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  // Staff Login View (for Admin & Teachers)
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100/80 p-3 sm:p-6 font-sans select-none relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-indigo-200/40 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 opacity-40 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl shadow-indigo-950/15 border border-slate-200/80 overflow-hidden z-10 relative flex flex-col justify-between"
      >
        {/* TOP MODERN GRADIENT HEADER BANNER WITH ABSTRACT WAVE ART */}
        <div className="w-full bg-gradient-to-br from-[#2b337c] via-[#4352b2] to-[#5967cb] relative pt-4 pb-16 px-4 sm:px-5 border-b border-white/10">
          
          {/* Abstract Floating Circles & Wave Overlay clipped to top corners */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-[32px] sm:rounded-t-[36px]">
            <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-black/25 blur-2xs"></div>
            <div className="absolute -right-8 -top-10 w-48 h-48 rounded-full bg-white/20 backdrop-blur-md"></div>
            <div className="absolute right-6 top-8 w-28 h-28 rounded-full bg-white/25 shadow-inner"></div>
            
            {/* Subtle SVG Wave Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" fill="none">
              <path d="M-50,120 C100,60 200,180 450,90 L450,200 L-50,200 Z" fill="white" fillOpacity="0.1" />
              <path d="M-50,140 C120,80 250,190 450,110 L450,200 L-50,200 Z" fill="white" fillOpacity="0.15" />
            </svg>
          </div>

          {/* Top Control Bar with Language Selector */}
          <div className="relative z-30 flex items-center justify-end w-full mb-3">
            {/* Clean Integrated Language Selector */}
            <LanguageSelector className="flex items-center" />
          </div>

          {/* WELCOME BADGE HEADER TEXT */}
          <div className="relative z-10 flex items-center justify-center gap-2 max-w-sm mx-auto mt-1 py-1 text-white">
            <ShieldCheck className="w-4.5 h-4.5 text-amber-300 shrink-0" />
            <span className="text-sm font-black tracking-wide truncate">
              {uiLang === 'en' ? 'Welcome! to Management System' : 'សូមស្វាគមន៍! មកកាន់ប្រព័ន្ធគ្រប់គ្រង'}
            </span>
          </div>
        </div>

        {/* OVERLAPPING WHITE CONTENT SHEET WITH BIG ROUNDED CORNERS */}
        <div className="-mt-10 relative z-20 bg-white rounded-t-[32px] sm:rounded-t-[36px] px-6 sm:px-8 pt-7 pb-6 flex-1 flex flex-col justify-between">
          <div>
            {/* SCHOOL HEADING MATCHING REQUESTED TEXT */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4352b2] tracking-tight">
                {uiLang === 'en' ? 'PLC Computer School' : 'សាលាកុំព្យូទ័រ ភី អិល ស៊ី'}
              </h1>
            </div>

            {/* Dynamic Error or Success Feedbacks */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error-box"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5 shadow-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div className="leading-relaxed text-left">
                    <div className="font-black text-rose-900">{lt("failed")}</div>
                    <div className="font-bold mt-0.5">{error}</div>
                  </div>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-start gap-2.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 animate-bounce" />
                  <div className="leading-relaxed text-left">
                    <div className="font-black text-emerald-900">{lt("success")}</div>
                    <div className="font-bold mt-0.5">{successMsg}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MAIN LOGIN FORM MATCHING SCREENSHOT */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* FIELD 1: EMAIL / USERNAME */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-500">
                  {uiLang === 'en' ? 'Email' : 'ឈ្មោះគណនី ឬ អ៊ីម៉ែល'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (autofillSource) setAutofillSource(null);
                    }}
                    placeholder={uiLang === 'en' ? 'kristin.watson@example.com' : 'សូមបញ្ចូលឈ្មោះគណនី ឬ អ៊ីម៉ែល'}
                    autoFocus
                    required
                    className={`w-full px-4 py-3 sm:py-3.5 rounded-2xl border bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#4352b2]/10 focus:border-[#4352b2] transition-all placeholder:text-slate-400/80 shadow-2xs ${
                      autofillSource ? "border-[#4352b2] bg-indigo-50/20 ring-2 ring-[#4352b2]/20" : "border-slate-200/90"
                    }`}
                  />
                </div>
              </div>

              {/* FIELD 2: PASSWORD */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-500">
                  {uiLang === 'en' ? 'Password' : 'ពាក្យសម្ងាត់'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (autofillSource) setAutofillSource(null);
                    }}
                    placeholder={uiLang === 'en' ? '••••••••••••' : '••••••••••••'}
                    required
                    className={`w-full pl-4 pr-11 py-3 sm:py-3.5 rounded-2xl border bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#4352b2]/10 focus:border-[#4352b2] transition-all placeholder:text-slate-400/80 shadow-2xs ${
                      autofillSource ? "border-[#4352b2] bg-indigo-50/20 ring-2 ring-[#4352b2]/20" : "border-slate-200/90"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* UTILITIES: REMEMBER ME & FORGOT PASSWORD */}
              <div className="flex items-center justify-between pt-1 pb-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md text-[#4352b2] border-slate-300 focus:ring-[#4352b2]/30 accent-[#4352b2] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                    {uiLang === 'en' ? 'Remember me' : 'ចងចាំគណនី'}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotTarget("admin");
                    setIsForgotPasswordOpen(true);
                    setForgotStep("select");
                  }}
                  className="text-xs font-extrabold text-[#4352b2] hover:text-[#2a347d] hover:underline cursor-pointer transition-colors"
                >
                  {uiLang === 'en' ? 'Forgot password?' : 'ភ្លេចពាក្យសម្ងាត់?'}
                </button>
              </div>

              {/* ACTION BUTTON: FULL WIDTH INDIGO BLUE PILL ("Sign in" / "ចូលប្រើប្រាស់") */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#4352b2] hover:bg-[#323e91] active:scale-[0.98] text-white font-extrabold text-base tracking-wide shadow-lg shadow-[#4352b2]/25 hover:shadow-xl hover:shadow-[#4352b2]/35 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>{lt("verifying")}</span>
                  </>
                ) : (
                  <span>{uiLang === 'en' ? 'Sign in' : 'ចូលប្រើប្រាស់'}</span>
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer Area with Version */}
          <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans border-t border-slate-100 mt-4">
            <span>©2026 {schoolName || "PLC Computer School"}</span>
            <span>{lt("version")}</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
