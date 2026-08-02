import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Loader2, CheckCircle, Calendar, CreditCard, Award, FileText, Check,
  Bell, Plus, BookOpen, Megaphone, Globe, QrCode, Search, ChevronRight, X, Phone, MapPin,
  Clock, AlertCircle, Send, User, ChevronDown, RefreshCw, BarChart3, Star, LogOut,
  Camera, Upload, Save, Sparkles, ImageIcon
} from "lucide-react";

// ============================================================================
// CUSTOM SVG ICONS MATCHING THE GUARDIAN PORTAL HOME SCREEN EXACTLY
// ============================================================================

// 1. ទទួលកូន (Pickup Student Icon: Red pins connected by blue dashed route)
const PickupStudentIcon = ({ className = "w-11 h-11", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Dashed Route Path */}
    <path d="M22 36C22 36 28 42 34 32C40 22 32 18 32 18" stroke="#0284c7" strokeWidth="3" strokeDasharray="3 3" strokeLinecap="round" />
    {/* Start Map Pin (Bottom Left) */}
    <path d="M22 28C19.2386 28 17 30.2386 17 33C17 37 22 42 22 42C22 42 27 37 27 33C27 30.2386 24.7614 28 22 28Z" fill={fillColor} />
    <circle cx="22" cy="32.5" r="2" fill="#FFFFFF" />
    {/* End Map Pin (Top Right) */}
    <path d="M34 12C31.2386 12 29 14.2386 29 17C29 21 34 26 34 26C34 26 39 21 39 17C39 14.2386 36.7614 12 34 12Z" fill={fillColor} />
    <circle cx="34" cy="16.5" r="2" fill="#FFFFFF" />
  </svg>
);

// 2. បញ្ជីវត្តមាន (Attendance Icon: Calendar with clock)
const AttendanceCalendarIcon = ({ className = "w-11 h-11", fillColor = "#e02424" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Calendar Body */}
    <rect x="12" y="14" width="32" height="30" rx="6" fill="#FFFFFF" stroke={fillColor} strokeWidth="3" />
    {/* Red Top Banner */}
    <path d="M12 18C12 15.7909 13.7909 14 16 14H40C42.2091 14 44 15.7909 44 18V22H12V18Z" fill={fillColor} />
    {/* Calendar Binder Rings */}
    <rect x="20" y="10" width="3" height="7" rx="1.5" fill="#f59e0b" />
    <rect x="33" y="10" width="3" height="7" rx="1.5" fill="#f59e0b" />
    {/* Calendar Grid Dots */}
    <circle cx="20" cy="28" r="1.5" fill="#94a3b8" />
    <circle cx="28" cy="28" r="1.5" fill="#94a3b8" />
    <circle cx="36" cy="28" r="1.5" fill="#94a3b8" />
    <circle cx="20" cy="34" r="1.5" fill="#94a3b8" />
    <circle cx="28" cy="34" r="1.5" fill="#94a3b8" />
    {/* Clock Badge (Bottom Right) */}
    <circle cx="37" cy="37" r="8" fill="#f59e0b" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M37 33V37L40 39" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 3. លទ្ធផលប្រឡង (Exam Results Icon: Report sheet with A+ badge)
const ExamResultsIcon = ({ className = "w-11 h-11", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Document Paper */}
    <rect x="14" y="10" width="28" height="36" rx="5" fill="#FFFFFF" stroke={fillColor} strokeWidth="3" />
    {/* Horizontal Lines */}
    <line x1="20" y1="18" x2="30" y2="18" stroke={fillColor} strokeWidth="3" strokeLinecap="round" />
    <line x1="20" y1="25" x2="36" y2="25" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="31" x2="34" y2="31" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="37" x2="28" y2="37" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
    {/* Red A+ Grade Badge */}
    <rect x="28" y="14" width="16" height="16" rx="4" fill={fillColor} />
    <text x="36" y="26" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">A+</text>
  </svg>
);

// 4. តារាងកិត្តិយស (Honor Roll Icon: 3 bar chart with 3 stars)
const HonorRollIcon = ({ className = "w-11 h-11", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 3 Bar Chart Columns */}
    <rect x="16" y="28" width="6" height="14" rx="2" fill={fillColor} />
    <rect x="25" y="20" width="6" height="22" rx="2" fill={fillColor} />
    <rect x="34" y="24" width="6" height="18" rx="2" fill={fillColor} />
    {/* Yellow Stars on Top */}
    <path d="M19 23L19.8 24.8L21.8 25L20.3 26.4L20.7 28.3L19 27.3L17.3 28.3L17.7 26.4L16.2 25L18.2 24.8L19 23Z" fill="#f59e0b" />
    <path d="M28 15L28.9 17.1L31.2 17.3L29.5 18.9L30 21.2L28 20L26 21.2L26.5 18.9L24.8 17.3L27.1 17.1L28 15Z" fill="#f59e0b" />
    <path d="M37 19L37.8 20.8L39.8 21L38.3 22.4L38.7 24.3L37 23.3L35.3 24.3L35.7 22.4L34.2 21L36.2 20.8L37 19Z" fill="#f59e0b" />
  </svg>
);

// 5. វិក្កយបត្រ (Invoice Receipt Icon: Scroll receipt)
const InvoiceReceiptIcon = ({ className = "w-11 h-11", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Paper Receipt with zig-zag edge */}
    <path d="M18 10C18 10 21 12 24 10C27 8 30 10 33 10C36 12 39 10 39 10V44C39 44 36 42 33 44C30 46 27 44 24 44C21 42 18 44 18 44V10Z" fill={fillColor} />
    <line x1="23" y1="18" x2="34" y2="18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="23" y1="24" x2="34" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="23" y1="30" x2="34" y2="30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="23" y1="36" x2="30" y2="36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 6. ប្រវត្តិការបង់ប្រាក់ (Payment History Icon: Hand holding card with waves)
const PaymentTapIcon = ({ className = "w-11 h-11", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hand */}
    <path d="M16 38C16 38 18 36 21 36H26V42H20L16 38Z" fill="#38bdf8" />
    {/* Credit Card */}
    <rect x="22" y="20" width="22" height="15" rx="3" fill={fillColor} transform="rotate(-15 22 20)" />
    <rect x="23" y="24" width="20" height="3" fill="#f59e0b" transform="rotate(-15 23 24)" />
    {/* Contactless Signal Waves */}
    <path d="M38 16C40 18 40 21 38 23" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    <path d="M41 13C45 17 45 23 41 27" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Red Graduation Cap Icon for Menu View
const RedGradCapIcon = ({ className = "w-8 h-8", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8L4 18L24 28L44 18L24 8Z" fill={fillColor} stroke={fillColor} strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 21.5V32C10 32 16 38 24 38C32 38 38 32 38 32V21.5" stroke={fillColor} strokeWidth="3" strokeLinecap="round" />
    <path d="M40 20V34" stroke={fillColor} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="40" cy="35" r="2.5" fill={fillColor} />
  </svg>
);

// Custom SVG Icon for Library matching the user's screenshot exactly (Black square rounded border, Crimson book with text "បណ្ណាល័យ")
const LibraryAppIcon = ({ className = "w-10 h-10", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="52" height="52" rx="12" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
    {/* Open Book Icon */}
    <path d="M20 22C20 22 25 18 32 20C39 18 44 22 44 22V38C44 38 39 34 32 36C25 34 20 38 20 38V22Z" fill="none" stroke={fillColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="32" y1="20" x2="32" y2="36" stroke={fillColor} strokeWidth="3" strokeLinecap="round" />
    {/* Text "បណ្ណាល័យ" in Crimson Khmer Font */}
    <text x="32" y="48" fill={fillColor} fontSize="9.5" fontWeight="900" textAnchor="middle" fontFamily="serif">
      បណ្ណាល័យ
    </text>
  </svg>
);

// Custom SVG Icons for Student Menu Screen matching user reference image
const ClipboardCheckIcon = ({ className = "w-12 h-12", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="36" rx="6" fill={fillColor} />
    <path d="M16 5C16 3.89543 16.8954 3 18 3H30C31.1046 3 32 3.89543 32 5V9H16V5Z" fill={fillColor} />
    <rect x="18" y="4" width="12" height="4" rx="2" fill="#FFFFFF" />
    <path d="M15 25L21 31L33 19" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FolderHomeIcon = ({ className = "w-12 h-12", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 11C4 8.23858 6.23858 6 9 6H18.5858C19.9119 6 21.1837 6.52678 22.1213 7.46447L24.8787 10.2218C25.8163 11.1595 27.0881 11.6863 28.4142 11.6863H39C41.7614 11.6863 44 13.9249 44 16.6863V39C44 41.7614 41.7614 44 39 44H9C6.23858 44 4 41.7614 4 39V11Z" fill={fillColor} />
    <path d="M24 18L15 25V36H33V25L24 18Z" fill="#FFFFFF" />
    <rect x="21" y="28" width="6" height="8" rx="1" fill={fillColor} />
  </svg>
);

const ReceiptTextIcon = ({ className = "w-12 h-12", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="5" width="36" height="38" rx="6" fill={fillColor} />
    <line x1="14" y1="15" x2="34" y2="15" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="14" y1="23" x2="34" y2="23" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="14" y1="31" x2="26" y2="31" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

const DollarCircleIcon = ({ className = "w-12 h-12", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="21" fill={fillColor} />
    <circle cx="24" cy="24" r="16" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="22 10" />
    <text x="24" y="31" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">$</text>
  </svg>
);

const WhistleTimerIcon = ({ className = "w-12 h-12", fillColor = "#8f1218" }: { className?: string; fillColor?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="26" r="18" fill={fillColor} />
    <path d="M20 4H28" stroke={fillColor} strokeWidth="4" strokeLinecap="round" />
    <path d="M24 4V8" stroke={fillColor} strokeWidth="3" strokeLinecap="round" />
    <path d="M36 12L39 9" stroke={fillColor} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M10 18L4 14V22L10 18Z" fill={fillColor} />
    <circle cx="24" cy="26" r="13" fill={fillColor} stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M24 18V26L29 29" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// High Quality Student Avatars wearing school uniforms
const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300", // Girl 1
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300", // Girl 2
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300", // Boy 1
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"  // Boy 2
];

// High Resolution Tech Banner Carousel Image
const DEFAULT_BANNER_IMG = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800";

export default function StudentPortal({ studentId }: { studentId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(studentId);
  const [sysSettings, setSysSettings] = useState<any>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [portalCoverImage, setPortalCoverImage] = useState("");
  const [portalBannerTitle, setPortalBannerTitle] = useState("");
  const [portalBannerSubtitle, setPortalBannerSubtitle] = useState("");
  const [isSavingPortalBanner, setIsSavingPortalBanner] = useState(false);

  const activePortalSlides = (sysSettings?.bannerSlides && Array.isArray(sysSettings.bannerSlides) && sysSettings.bannerSlides.length >= 3)
    ? sysSettings.bannerSlides
    : [
        {
          id: 1,
          title: sysSettings?.bannerTitle || "វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ",
          subtitle: sysSettings?.bannerSubtitle || "អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ",
          image: sysSettings?.coverImage || sysSettings?.bannerImage || DEFAULT_BANNER_IMG
        },
        {
          id: 2,
          title: "បន្ទប់កុំព្យូទ័រ ICT",
          subtitle: "ការសិក្សាបច្ចេកវិទ្យា និងកម្មវិធីកុំព្យូទ័រទំនើប",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: 3,
          title: "ការសិក្សាកូដ & បច្ចេកវិទ្យា",
          subtitle: "អភិវឌ្ឍជំនាញកូដ និងការគិតបែបរចនា",
          image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
        }
      ];

  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % activePortalSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activePortalSlides.length]);

  const bannerPresets = [
    {
      name: "បន្ទប់កុំព្យូទ័រ ICT",
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "ការសិក្សាកូដ & បច្ចេកវិទ្យា",
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "សិក្ខាសាលា & សន្និសីទ",
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "ថ្នាក់រៀនអប់រំបច្ចេកវិទ្យា",
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const handleOpenBannerModal = () => {
    setPortalCoverImage(sysSettings?.coverImage || sysSettings?.bannerImage || DEFAULT_BANNER_IMG);
    setPortalBannerTitle(sysSettings?.bannerTitle || "វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ");
    setPortalBannerSubtitle(sysSettings?.bannerSubtitle || "អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ");
    setIsBannerModalOpen(true);
  };

  const handleSavePortalBanner = async () => {
    setIsSavingPortalBanner(true);
    try {
      const res = await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coverImage: portalCoverImage,
          bannerImage: portalCoverImage,
          bannerTitle: portalBannerTitle,
          bannerSubtitle: portalBannerSubtitle
        })
      });
      if (res.ok) {
        setSysSettings((prev: any) => ({
          ...prev,
          coverImage: portalCoverImage,
          bannerImage: portalCoverImage,
          bannerTitle: portalBannerTitle,
          bannerSubtitle: portalBannerSubtitle
        }));
        setIsBannerModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingPortalBanner(false);
    }
  };

  useEffect(() => {
    fetch("/api/system/settings")
      .then(res => res.json())
      .then(json => {
        setSysSettings(json);
        if (json.schoolPhone) {
          setLeaveGuardianPhone(json.schoolPhone);
        }
      })
      .catch(err => console.error("Error loading system settings:", err));
  }, []);

  const themeCfg = (() => {
    const t = sysSettings?.appTheme?.toLowerCase() || "crimson";
    if (t === "indigo" || t === "blue" || t === "navy") {
      return {
        bannerBg: "bg-[#1e3a8a]",
        cardGradient: "bg-[#1e3a8a]",
        primaryColor: "#1e3a8a",
        primaryBg: "bg-[#1e3a8a]",
        textColor: "text-[#1e3a8a]",
        borderColor: "border-[#1e3a8a]",
        ringColor: "ring-[#1e3a8a]/20",
        sealBg: "bg-[#1e3a8a]"
      };
    } else if (t === "emerald" || t === "green") {
      return {
        bannerBg: "bg-[#065f46]",
        cardGradient: "bg-[#065f46]",
        primaryColor: "#065f46",
        primaryBg: "bg-[#065f46]",
        textColor: "text-[#065f46]",
        borderColor: "border-[#065f46]",
        ringColor: "ring-[#065f46]/20",
        sealBg: "bg-[#065f46]"
      };
    } else if (t === "purple" || t === "violet") {
      return {
        bannerBg: "bg-[#581c87]",
        cardGradient: "bg-[#581c87]",
        primaryColor: "#581c87",
        primaryBg: "bg-[#581c87]",
        textColor: "text-[#581c87]",
        borderColor: "border-[#581c87]",
        ringColor: "ring-[#581c87]/20",
        sealBg: "bg-[#581c87]"
      };
    } else if (t === "amber" || t === "orange") {
      return {
        bannerBg: "bg-[#78350f]",
        cardGradient: "bg-[#78350f]",
        primaryColor: "#78350f",
        primaryBg: "bg-[#78350f]",
        textColor: "text-[#78350f]",
        borderColor: "border-[#78350f]",
        ringColor: "ring-[#78350f]/20",
        sealBg: "bg-[#78350f]"
      };
    }
    return {
      bannerBg: "bg-[#8f1218]",
      cardGradient: "bg-[#8f1218]",
      primaryColor: "#8f1218",
      primaryBg: "bg-[#8f1218]",
      textColor: "text-[#8f1218]",
      borderColor: "border-[#8f1218]",
      ringColor: "ring-[#8f1218]/20",
      sealBg: "bg-[#8f1218]"
    };
  })();

  // View Screen Mode: "overview" (Guardian Home Screen as requested) | "menu" (Detailed Student Menu)
  const [viewMode, setViewMode] = useState<"overview" | "menu">("overview");

  // Bottom Navigation Bar Active Tab ("home" | "library" | "announcements" | "info")
  const [activeBottomTab, setActiveBottomTab] = useState<"home" | "library" | "announcements" | "info">("home");

  // Action Modals
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isHonorModalOpen, setIsHonorModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isClassesModalOpen, setIsClassesModalOpen] = useState(false);

  // Leave Request Form State
  const [leaveType, setLeaveType] = useState("ឈឺ (Sick Leave)");
  const [leaveStartDate, setLeaveStartDate] = useState("2026-07-28");
  const [leaveEndDate, setLeaveEndDate] = useState("2026-07-28");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveGuardianPhone, setLeaveGuardianPhone] = useState("087 850 014 / 097 501 3648");
  const [isLeaveSubmitted, setIsLeaveSubmitted] = useState(false);
  const [leaveRequestsList, setLeaveRequestsList] = useState([
    {
      id: "LR-001",
      dateRange: "12/05/2026",
      type: "ធុរៈគ្រួសារ",
      days: "1 ថ្ងៃ",
      reason: "ទៅចូលរួមពិធីអាពាហ៍ពិពាហ៍សាច់ញាតិនៅខេត្តសៀមរាប",
      status: "APPROVED",
      statusKh: "បានអនុម័ត",
    },
  ]);

  // Library State
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState("all");
  const [readingBook, setReadingBook] = useState<any>(null);
  const [readerPage, setReaderPage] = useState(1);
  const [borrowedBooks, setBorrowedBooks] = useState<string[]>(["b1"]);

  // Sample E-Books Data for Library
  const sampleBooks = [
    {
      id: "b1",
      title: "គណិតវិទ្យា ថ្នាក់ទី៥",
      titleEn: "Mathematics Grade 5",
      author: "ក្រសួងអប់រំ យុវជន និងកីឡា",
      category: "textbook",
      categoryKh: "សៀវភៅពុម្ព",
      coverColor: "bg-blue-600",
      totalPages: 184,
      borrowedCount: 124,
      rating: 4.9,
      description: "សៀវភៅសិក្សាគោលគណិតវិទ្យា ថ្នាក់ទី៥ រួមមានមេរៀនចំនួន សំនួនទសភាគ ប្រភាគ ធរណីមាត្រ និងរង្វាស់រង្វាល់។",
      chapters: [
        { title: "មេរៀនទី១: ចំនួនដល់ ១ ០០០ ០០០", page: 1, content: "មេរៀនទី១៖ ចំនួនដល់ ១ ០០០ ០០០\n\n១. ការអាន និងការសរសេរចំនួន\nចំនួនដែលមាន ៦ ខ្ទង់ មានខ្ទង់រាយ ខ្ទង់ដប់ ខ្ទង់រយ ខ្ទង់ពាន់ ខ្ទង់ម៉ឺន និងខ្ទង់សែន។\nឧទាហរណ៍៖ ២៥៤ ៦៨០ អានថា «ពីររយហាសិបបួនពាន់ ប្រាំរយប៉ែតសិប»។\n\n២. ការប្រៀបធៀប និងរៀបលំដាប់ចំនួន\nដើមី្បប្រៀបធៀបចំនួនពីរ យើងត្រូវរាប់ចំនួនខ្ទង់។ ចំនួនដែលមានខ្ទង់ច្រើនជាង គឺធំជាង។" },
        { title: "មេរៀនទី២: ប្រភាគ និងវិធីបូកដកប្រភាគ", page: 25, content: "មេរៀនទី២៖ ប្រភាគ និងវិធីបូកដកប្រភាគ\n\n១. ប្រភាគដែលមានភាគបែងដូចគ្នា\nដើមី្បបូក ឬដកប្រភាគដែលមានភាគបែងដូចគ្នា យើងបូក ឬដកភាគយក និងរក្សាភាគបែងនៅដដែល។\nឧទាហរណ៍៖ ៣/៨ + ៤/៨ = ៧/៨" },
        { title: "មេរៀនទី៣: ចំនួនទសភាគ", page: 50, content: "មេរៀនទី៣៖ ចំនួនទសភាគ\n\n១. និយមន័យចំនួនទសភាគ\nចំនួនទសភាគជាចំនួនដែលមានសញ្ញាក្បៀស (,) សម្រាប់ខណ្ឌផ្នែកគត់ និងផ្នែកទសភាគ។" }
      ]
    },
    {
      id: "b2",
      title: "ភាសាខ្មែរ ថ្នាក់ទី៥",
      titleEn: "Khmer Literature Grade 5",
      author: "ក្រសួងអប់រំ យុវជន និងកីឡា",
      category: "textbook",
      categoryKh: "សៀវភៅពុម្ព",
      coverColor: "bg-red-600",
      totalPages: 210,
      borrowedCount: 198,
      rating: 5.0,
      description: "អំណាន សំណេរ វេយ្យាករណ៍ និងការតែងសេចក្តី សម្រាប់សិស្សថ្នាក់ទី៥។",
      chapters: [
        { title: "មេរៀនទី១: ការគោរព និងការដឹងគុណ", page: 1, content: "មេរៀនទី១៖ ការគោរព និងការដឹងគុណ\n\nអំណាន៖ «សិស្សល្អ»\nសិស្សល្អតែងតែមានសុជីវធម៌ គោរពគ្រូបង្រៀន និងមាតាបិតា។ ការដឹងគុណជាគុណធម៌ដ៏ឧត្តមរបស់មនុស្សគ្រប់រូប។" },
        { title: "មេរៀនទី២: ធម្មជាតិ និងបរិស្ថាន", page: 30, content: "មេរៀនទី២៖ ធម្មជាតិ និងបរិស្ថាន\n\nអំណាន៖ «ព្រៃឈើជាជីវិត»\nព្រៃឈើផ្តល់អុកស៊ីសែន ការពារដីពីការបាក់ស្រុត និងជាជម្រកសត្វព្រៃ។" }
      ]
    },
    {
      id: "b3",
      title: "Primary English Grade 5",
      titleEn: "Primary English Grade 5",
      author: "MoEYS & Cambridge",
      category: "textbook",
      categoryKh: "សៀវភៅពុម្ព",
      coverColor: "from-emerald-600 to-[#8f1218]",
      totalPages: 140,
      borrowedCount: 156,
      rating: 4.8,
      description: "English student book for Grade 5 including listening, speaking, reading, and grammar activities.",
      chapters: [
        { title: "Unit 1: Back to School", page: 1, content: "Unit 1: Back to School!\n\nWelcome back to school! In this unit, you will learn to introduce yourself, talk about your school subjects, and describe your daily routines." },
        { title: "Unit 2: My Family and Friends", page: 20, content: "Unit 2: My Family and Friends\n\nVocabulary: Father, Mother, Brother, Sister, Teacher, Friend.\nGrammar: Present Continuous Tense (e.g. He is reading a book)." }
      ]
    },
    {
      id: "b4",
      title: "ប្រជុំរឿងព្រេងខ្មែរ ភាគ១",
      titleEn: "Khmer Folk Tales Vol. 1",
      author: "ពុទ្ធសាសនបណ្ឌិត្យ",
      category: "story",
      categoryKh: "រឿងនិទាន",
      coverColor: "from-[#8f1218] to-blue-900",
      totalPages: 160,
      borrowedCount: 310,
      rating: 4.9,
      description: "រឿងព្រេងបុរាណខ្មែរអប់រំចិត្តគំនិត ដូចជារឿងធនញ្ជ័យ រឿងចៅសាញ់ និងរឿងខ្លាធំ និងចៅទន្សាយ។",
      chapters: [
        { title: "រឿង៖ ចៅទន្សាយ និងខ្លា", page: 1, content: "រឿង៖ ចៅទន្សាយ និងខ្លា\n\nកាលពីព្រេងនាយ មានខ្លាមួយក្បាលអាងខ្លួនមានកម្លាំងខ្លាំង តែងតែគំរាមកំហែងសត្វឯទៀតៗក្នុងព្រៃ។ ថ្ងៃមួយ ចៅទន្សាយបានប្រើប្រាជ្ញាឈ្លាសវៃដើម្បីបង្រៀនមេរៀនដល់ខ្លានោះ..." },
        { title: "រឿង៖ ធនញ្ជ័យ", page: 40, content: "រឿង៖ ធនញ្ជ័យ\n\nធនញ្ជ័យជាកុមារម្នាក់ដែលមានប្រាជ្ញាឈ្លាសវៃ និងស្ទាត់ជំនាញខាងដោះស្រាយបញ្ហាលំបាកៗ..." }
      ]
    },
    {
      id: "b5",
      title: "វិញ្ញាសាប្រឡងគណិតវិទ្យា ថ្នាក់ទី៥",
      titleEn: "Math Exam Preparation Grade 5",
      author: "ក្រុមការងារបច្ចេកទេសសាលា",
      category: "exam",
      categoryKh: "វិញ្ញាសាប្រឡង",
      coverColor: "bg-amber-600",
      totalPages: 95,
      borrowedCount: 220,
      rating: 4.9,
      description: "ប្រមូលផ្តុំវិញ្ញាសាប្រឡងឆមាស និងប្រឡងប្រចាំខែ រួមទាំងអត្រាកំណែពិស្ដារ។",
      chapters: [
        { title: "វិញ្ញាសាទី១: ប្រឡងប្រចាំខែមករា", page: 1, content: "វិញ្ញាសាទី១៖ ប្រឡងប្រចាំខែមករា (រយះពេល ៦០ នាទី)\n\n១. គណនាប្រមាណវិធីបូក ដក គុណ ចែក (៤ ពិន្ទុ)\nក) ២៥ ៤៦០ + ១៨ ៧២០ = ?\nខ) ៤៥ ០០០ - ២៣ ៦៥០ = ?\n\n២. ចោទគណិតវិទ្យា (៦ ពិន្ទុ)\nសាលារៀនមួយមានសិស្សសរុប ១ ២៥០ នាក់។ បើសិស្សស្រីមានចំនួន ៦៨០ នាក់ តើសិស្សប្រុសមានចំនួនប៉ុន្មាននាក់?" }
      ]
    }
  ];

  // Pickup Student Notification Form State
  const [pickupTime, setPickupTime] = useState("11:30 AM");
  const [guardianNote, setGuardianNote] = useState("");
  const [isPickupSent, setIsPickupSent] = useState(false);

  const fetchData = (targetId: string) => {
    setLoading(true);
    fetch(`/api/portal/student/${encodeURIComponent(targetId)}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(selectedStudentId);
  }, [selectedStudentId]);

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    try {
      const res = await fetch("/api/portal/leave-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: data?.id || selectedStudentId,
          startDate: leaveStartDate,
          endDate: leaveEndDate,
          type: leaveType,
          reason: leaveReason
        })
      });
      const json = await res.json();
      if (json.success) {
        setIsLeaveSubmitted(true);
        const newReq = {
          id: `LR-00${leaveRequestsList.length + 1}`,
          dateRange: `${leaveStartDate} ដល់ ${leaveEndDate}`,
          type: leaveType,
          days: "1 ថ្ងៃ",
          reason: leaveReason,
          status: "PENDING",
          statusKh: "កំពុងពិនិត្យ",
        };
        setLeaveRequestsList((prev) => [newReq, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setIsLeaveSubmitted(true);
      const newReq = {
        id: `LR-00${leaveRequestsList.length + 1}`,
        dateRange: `${leaveStartDate} ដល់ ${leaveEndDate}`,
        type: leaveType,
        days: "1 ថ្ងៃ",
        reason: leaveReason,
        status: "PENDING",
        statusKh: "កំពុងពិនិត្យ",
      };
      setLeaveRequestsList((prev) => [newReq, ...prev]);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 animate-spin text-[#8f1218]" />
        <span className="text-xs font-black text-slate-500 mt-3 uppercase tracking-wider">
          កំពុងទាញយកទិន្នន័យពីប្រព័ន្ធ...
        </span>
      </div>
    );
  }

  // Children / Students List (From Backend or Demo matching user reference)
  const childrenList = data?.children && data.children.length > 0 ? data.children : [
    {
      id: "child-1",
      studentId: "RTK0008132",
      nameKh: "សម្បត្តិ សុខមាន",
      photoUrl: DEFAULT_AVATARS[0],
      course: "ភាសាខ្មែរ ថ្នាក់ទី៥",
      level: "ក"
    },
    {
      id: "child-2",
      studentId: data?.studentId || "RTK0008132",
      nameKh: data?.nameKh || "ស្រីមាស ពេជ្រ",
      photoUrl: data?.photoUrl || DEFAULT_AVATARS[1],
      course: data?.course || "អង់គ្លេសកម្រិត១",
      level: data?.level || "ខ"
    },
    {
      id: "child-3",
      studentId: "STU003",
      nameKh: "ប្រុសមាស ពេជ្រ",
      photoUrl: DEFAULT_AVATARS[2],
      course: "បឋមសិក្សា ថ្នាក់ទី៣",
      level: "A"
    }
  ];

  // Current active student
  const currentStudentName = data?.nameKh || (data?.firstNameKh ? `${data.firstNameKh} ${data.lastNameKh}` : "ស្រីមាស ពេជ្រ");
  const currentStudentId = data?.studentId || "RTK0008132";
  const currentClassName = data?.course ? `${data.course} ${data.level || ''}`.trim() : "អង់គ្លេសកម្រិត១ ខ";

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] font-sans select-none flex flex-col items-center relative pb-16">
      
      {/* MAX WIDTH WRAPPER MATCHING MOBILE DISPLAY */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#ffffff] flex flex-col shadow-2xl relative overflow-hidden border-x border-slate-100">
        
        {/* ========================================================================= */}
        {/* 1. TOP DYNAMIC THEME BANNER HEADER                                       */}
        {/* ========================================================================= */}
        <div className={`w-full ${themeCfg.bannerBg} text-white pt-4 pb-6 px-4 relative z-10 shadow-md`}>
          
          {viewMode === "menu" ? (
            /* MENU VIEW HEADER: Back arrow, "ម៉ឺនុយ", Student Avatar & Info */
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setViewMode("overview"); setActiveBottomTab("home"); }}
                  className="p-1 -ml-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                </button>
                <h1 className="text-xl font-black text-white font-serif tracking-tight">
                  ម៉ឺនុយ
                </h1>
              </div>

              {/* Student Profile Info Banner inside Theme Header */}
              <div className="flex items-center gap-3.5 pt-1 px-1">
                <div className="w-14 h-14 rounded-full border-2 border-white/90 overflow-hidden bg-slate-200 shrink-0 shadow-sm">
                  <img
                    src={data?.photoUrl || DEFAULT_AVATARS[1]}
                    alt={currentStudentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight font-serif">
                    {currentStudentName}
                  </h2>
                  <p className="text-xs font-mono text-white/90 font-bold mt-0.5 tracking-wide">
                    {currentStudentId}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* OVERVIEW MODE HEADER: School Seal & Bell / Profile Icons */
            <div className="flex items-center justify-between">
              {/* School Logo Seal & Khmer Title */}
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#f59e0b] shadow-md flex items-center justify-center overflow-hidden shrink-0">
                  {sysSettings?.schoolLogo ? (
                    <img src={sysSettings.schoolLogo} alt="School Logo" className="w-full h-full object-contain p-0.5" />
                  ) : (
                    <div className={`w-full h-full rounded-full ${themeCfg.sealBg} flex flex-col items-center justify-center text-white p-1 text-center border border-amber-300`}>
                      <svg className="w-6 h-6 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-base sm:text-lg font-black text-white font-serif leading-tight drop-shadow-xs">
                    {sysSettings?.schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                  </h1>
                  <p className="text-[11px] font-serif text-amber-200 tracking-wider font-semibold opacity-90 leading-none">
                    {sysSettings?.schoolName || "PLC Computer School"}
                  </p>
                </div>
              </div>

              {/* Right Icons: Bell Notification & Parent Avatar */}
              <div className="flex items-center gap-3">
                {/* Bell Notification */}
                <button
                  type="button"
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="relative p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer active:scale-95"
                >
                  <Bell className="w-6 h-6 stroke-[2]" />
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-black flex items-center justify-center border-2 border-[#8f1218]">
                    2
                  </span>
                </button>

                {/* Guardian Profile Avatar (Click to toggle menu/overview mode) */}
                <button
                  type="button"
                  onClick={() => {
                    if (viewMode === "overview") {
                      setViewMode("menu");
                      setActiveBottomTab("info");
                    } else {
                      setViewMode("overview");
                      setActiveBottomTab("home");
                    }
                  }}
                  className="w-10 h-10 rounded-full border-2 border-amber-300 overflow-hidden bg-slate-200 shadow-md cursor-pointer active:scale-95 shrink-0"
                  title="ចុចដើម្បីមើលម៉ឺនុយ"
                >
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                    alt="Guardian"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE A: GUARDIAN PORTAL HOME (OVERVIEW SCREEN - EXACT FROM IMAGE)   */}
        {/* ========================================================================= */}
        {viewMode === "overview" ? (
          <div className="flex-1 w-full bg-[#ffffff] px-4 pt-3 pb-20 space-y-5">
            
            {/* 1. HERO BANNER CAROUSEL */}
            <div className="w-full rounded-3xl overflow-hidden shadow-md relative bg-slate-900 border border-slate-100 group">
              <img
                src={activePortalSlides[activeBannerIdx]?.image || DEFAULT_BANNER_IMG}
                alt={activePortalSlides[activeBannerIdx]?.title || "Computer Training Event"}
                className="w-full h-44 sm:h-52 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_BANNER_IMG;
                }}
              />

              <div className="absolute inset-0 bg-slate-900/80 flex flex-col justify-end p-4 text-white">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  {activePortalSlides[activeBannerIdx]?.title || "វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ"}
                </span>
                <p className="text-sm font-bold text-white line-clamp-1">
                  {activePortalSlides[activeBannerIdx]?.subtitle || "អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ"}
                </p>
                {/* Carousel Pagination Dots */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  {activePortalSlides.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveBannerIdx(idx)}
                      className={`transition-all rounded-full cursor-pointer ${
                        activeBannerIdx === idx ? "w-5 h-2 bg-[#0284c7] shadow-xs" : "w-2 h-2 bg-white/70 hover:bg-white"
                      }`}
                      title={`ផ្ទាំងទី ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. STUDENTS HORIZONTAL CAROUSEL WITH FLOATING PLUS ICON */}
            <div className="relative pt-1 pb-2">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
                
                {/* Floating Blue Add / Switch Student Icon Button */}
                <button
                  type="button"
                  onClick={() => setIsChildModalOpen(true)}
                  className="w-12 h-12 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center shadow-lg cursor-pointer active:scale-95 shrink-0 transition-transform"
                  title="បន្ថែម / ជ្រើសរើសសិស្ស"
                >
                  <Search className="w-6 h-6 stroke-[3]" />
                </button>

                {/* Student Photo Cards List */}
                {childrenList.map((child: any, idx: number) => {
                  const isSelected = selectedStudentId === child?.studentId || selectedStudentId === child?.id || (data?.id === child?.id && idx === 1);
                  const avatarUrl = child?.photoUrl || DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];
                  
                  return (
                    <motion.button
                      key={child.id || idx}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(child.studentId || child.id);
                        fetchData(child.studentId || child.id);
                      }}
                      className={`relative w-28 sm:w-32 h-36 sm:h-40 rounded-2xl overflow-hidden shadow-sm shrink-0 border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "border-[#0284c7] ring-2 ring-[#0284c7]/40 scale-102" 
                          : "border-slate-200 opacity-90 hover:opacity-100"
                      }`}
                    >
                      {/* Student Portrait Photo */}
                      <img
                        src={avatarUrl}
                        alt={child.nameKh}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay Solid Dark & Name Pill */}
                      <div className="absolute inset-0 bg-slate-900/70 flex items-end p-2">
                        <div className="w-full bg-white/30 backdrop-blur-md rounded-xl py-1 px-1.5 text-center border border-white/40 shadow-xs">
                          <span className="text-[11px] font-black text-white drop-shadow-md truncate block">
                            {child.nameKh}
                          </span>
                        </div>
                      </div>

                      {/* Active Indicator Badge */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}

              </div>
            </div>

            {/* 3. 6 MAIN ACTION GRID CARDS ( EXACT MATCHING REFERENCE IMAGE ) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
              
              {/* CARD 1: ទទួលកូន (Pickup Student) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setIsPickupModalOpen(true)}
                className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[130px]"
              >
                <PickupStudentIcon fillColor={themeCfg.primaryColor} className="w-14 h-14 sm:w-16 sm:h-16 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                  ទទួលកូន
                </span>
              </motion.button>

              {/* CARD 2: បញ្ជីវត្តមាន (Attendance) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setIsAttendanceModalOpen(true)}
                className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[130px]"
              >
                <AttendanceCalendarIcon fillColor={themeCfg.primaryColor} className="w-14 h-14 sm:w-16 sm:h-16 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                  បញ្ជីវត្តមាន
                </span>
              </motion.button>

              {/* CARD 3: លទ្ធផលប្រឡង (Exam Results) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setIsExamModalOpen(true)}
                className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[130px]"
              >
                <ExamResultsIcon fillColor={themeCfg.primaryColor} className="w-14 h-14 sm:w-16 sm:h-16 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                  លទ្ធផលប្រឡង
                </span>
              </motion.button>

              {/* CARD 4: តារាងកិត្តិយស (Honor Roll) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setIsHonorModalOpen(true)}
                className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[130px]"
              >
                <HonorRollIcon fillColor={themeCfg.primaryColor} className="w-14 h-14 sm:w-16 sm:h-16 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                  តារាងកិត្តិយស
                </span>
              </motion.button>

              {/* CARD 5: វិក្កយបត្រ (Invoice) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[130px]"
              >
                <InvoiceReceiptIcon fillColor={themeCfg.primaryColor} className="w-14 h-14 sm:w-16 sm:h-16 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                  វិក្កយបត្រ
                </span>
              </motion.button>

              {/* CARD 6: ប្រវត្តិការបង់ប្រាក់ (Payment History) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setIsPaymentHistoryModalOpen(true)}
                className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[130px]"
              >
                <PaymentTapIcon fillColor={themeCfg.primaryColor} className="w-14 h-14 sm:w-16 sm:h-16 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                  ប្រវត្តិការបង់ប្រាក់
                </span>
              </motion.button>

            </div>

          </div>
        ) : (
          /* VIEW MODE B: DETAILED STUDENT MENU VIEW (EXACT MATCH TO REFERENCE IMAGE) */
          <div className="flex-1 w-full bg-[#ffffff] pt-5 px-4 pb-24 space-y-6">
            
            {/* 1. SECTION: ថ្នាក់កំពុងរៀន (ENROLLED CLASS) */}
            <div className="space-y-2.5">
              <h3 className="text-sm sm:text-base font-black text-[#1e293b] tracking-tight font-serif">
                ថ្នាក់កំពុងរៀន
              </h3>
              <div className="bg-[#f4f5f7] p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200/60 shadow-2xs">
                <RedGradCapIcon fillColor={themeCfg.primaryColor} className="w-9 h-9 shrink-0" />
                <span className="text-sm sm:text-base font-black text-slate-800">
                  {currentClassName}
                </span>
              </div>
            </div>

            {/* 2. SECTION: សកម្មភាព (ACTIVITIES GRID) */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-black text-[#1e293b] tracking-tight font-serif flex items-center justify-between">
                <span>ឧបករណ៍ និងសកម្មភាព (Tools & Activities)</span>
                <span className="text-[11px] font-mono font-bold text-slate-400">៦ ឧបករណ៍</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                
                {/* CARD 1: បញ្ជីវត្តមានទាំងអស់ */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(true)}
                  className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[125px]"
                >
                  <ClipboardCheckIcon fillColor={themeCfg.primaryColor} className="w-12 h-12 sm:w-14 sm:h-14 mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                    បញ្ជីវត្តមានទាំងអស់
                  </span>
                </motion.button>

                {/* CARD 2: ថ្នាក់រៀនទាំងអស់ */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setIsClassesModalOpen(true)}
                  className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[125px]"
                >
                  <FolderHomeIcon fillColor={themeCfg.primaryColor} className="w-12 h-12 sm:w-14 sm:h-14 mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                    ថ្នាក់រៀនទាំងអស់
                  </span>
                </motion.button>

                {/* CARD 3: លទ្ធផលប្រឡង */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setIsExamModalOpen(true)}
                  className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[125px]"
                >
                  <ExamResultsIcon fillColor={themeCfg.primaryColor} className="w-12 h-12 sm:w-14 sm:h-14 mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                    លទ្ធផលប្រឡង
                  </span>
                </motion.button>

                {/* CARD 4: តារាងកិត្តិយស */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setIsHonorModalOpen(true)}
                  className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[125px]"
                >
                  <HonorRollIcon fillColor={themeCfg.primaryColor} className="w-12 h-12 sm:w-14 sm:h-14 mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                    តារាងកិត្តិយស
                  </span>
                </motion.button>

                {/* CARD 5: វិក្កយបត្រ */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[125px]"
                >
                  <ReceiptTextIcon fillColor={themeCfg.primaryColor} className="w-12 h-12 sm:w-14 sm:h-14 mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                    វិក្កយបត្រ
                  </span>
                </motion.button>

                {/* CARD 6: ប្រវត្តិការបង់ប្រាក់ */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setIsPaymentHistoryModalOpen(true)}
                  className="bg-[#f4f5f7] hover:bg-[#eaeef3] p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border border-slate-200/60 shadow-2xs group min-h-[125px]"
                >
                  <DollarCircleIcon fillColor={themeCfg.primaryColor} className="w-12 h-12 sm:w-14 sm:h-14 mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-xs sm:text-sm font-black text-[#1e293b] leading-tight tracking-tight">
                    ប្រវត្តិការបង់ប្រាក់
                  </span>
                </motion.button>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. FIXED BOTTOM NAVIGATION BAR                                            */}
        {/* ========================================================================= */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 shadow-lg z-30 flex items-center justify-around py-2.5 px-2">
          
          {/* TAB 1: ទំព័រដើម (Home) */}
          <button
            type="button"
            onClick={() => { setActiveBottomTab("home"); setViewMode("overview"); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeBottomTab === "home" ? themeCfg.textColor : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-[10px] font-black tracking-tight">ទំព័រដើម</span>
          </button>

          {/* TAB 2: បណ្ណាល័យ (Library) */}
          <button
            type="button"
            onClick={() => { setActiveBottomTab("library"); setIsLibraryModalOpen(true); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeBottomTab === "library" ? themeCfg.textColor : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight">បណ្ណាល័យ</span>
          </button>

          {/* TAB 3: សេចក្តីជូនដំណឹង (Announcements) */}
          <button
            type="button"
            onClick={() => { setActiveBottomTab("announcements"); setIsNotificationModalOpen(true); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeBottomTab === "announcements" ? themeCfg.textColor : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Megaphone className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight">សេចក្តីជូនដំណឹង</span>
          </button>

          {/* TAB 4: ព័ត៌មាន (Info -> Opens Student Menu Screen directly) */}
          <button
            type="button"
            onClick={() => { setActiveBottomTab("info"); setViewMode("menu"); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeBottomTab === "info" ? themeCfg.textColor : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Globe className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight">ព័ត៌មាន</span>
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ទទួលកូន (PICKUP STUDENT & QR CODE)                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPickupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsPickupModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <QrCode className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">ប្រព័ន្ធទទួលកូន (Student Pickup QR)</h3>
                  <p className="text-xs text-slate-400 font-medium">បណ្ណសម្គាល់ និងជូនដំណឹងទទួលកូនចេញពីសាលា</p>
                </div>
              </div>

              {/* QR Code Card */}
              <div className="bg-[#f4f5f7] p-5 rounded-2xl border border-slate-200 text-center space-y-3 mb-4">
                <div className="w-40 h-40 mx-auto bg-white p-2 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PICKUP_STUDENT_${currentStudentId}`}
                    alt="Pickup QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs font-mono font-bold text-slate-700">
                  កូដសម្គាល់៖ <span className={themeCfg.textColor}>{currentStudentId}</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  សូមបង្ហាញ QR Code នេះជូនលោកគ្រូ អ្នកគ្រូ ឬសន្តិសុខសាលាពេលមកទទួលកូន
                </p>
              </div>

              {/* Notification to School Form */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-800">ជូនដំណឹងដល់សាលាមុនមកដល់៖</h4>
                
                {isPickupSent ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>បានផ្ញើការជូនដំណឹងមកទទួលកូនជោគជ័យ! សាលាកំពុងរៀបចំសិស្ស។</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">ម៉ោងមកដល់</label>
                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        >
                          <option value="11:30 AM">11:30 AM (វេនព្រឹក)</option>
                          <option value="05:00 PM">05:00 PM (វេនរសៀល)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">អ្នកមកទទួល</label>
                        <input
                          type="text"
                          defaultValue="អាណាព្យាបាល (ម្តាយ)"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPickupSent(true);
                        setTimeout(() => setIsPickupSent(false), 4000);
                      }}
                      className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Send className="w-4 h-4" />
                      <span>ផ្ញើការជូនដំណឹងមកទទួល (Send Arrival Notice)</span>
                    </button>
                  </>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: បញ្ជីវត្តមាន (ATTENDANCE LOG)                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAttendanceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Calendar className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">បញ្ជីវត្តមាន (Attendance Records)</h3>
                  <p className="text-xs text-slate-400 font-medium">កំណត់ត្រាវត្តមានផ្ទាល់ពីប្រព័ន្ធសាលា</p>
                </div>
              </div>

              {/* Attendance Statistics Summary */}
              {(() => {
                const attendancesList = data?.attendances && data.attendances.length > 0 ? data.attendances : [
                  { id: "att-1", date: new Date().toISOString(), status: "PRESENT", reason: "វត្តមានធម្មតា" },
                  { id: "att-2", date: new Date(Date.now() - 86400000).toISOString(), status: "PRESENT", reason: "វត្តមានធម្មតា" },
                  { id: "att-3", date: new Date(Date.now() - 172800000).toISOString(), status: "PRESENT", reason: "វត្តមានធម្មតា" },
                  { id: "att-4", date: new Date(Date.now() - 259200000).toISOString(), status: "PERMISSION", reason: "សុំច្បាប់ឈឺ" },
                  { id: "att-5", date: new Date(Date.now() - 345600000).toISOString(), status: "PRESENT", reason: "វត្តមានធម្មតា" },
                ];

                const totalPresent = attendancesList.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length;
                const totalAbsent = attendancesList.filter((a: any) => a.status === 'ABSENT').length;
                const totalPermission = attendancesList.filter((a: any) => a.status === 'PERMISSION' || a.status === 'LEAVE' || a.status === 'ABSENT_WITH_PERMISSION').length;

                return (
                  <>
                    <div className="bg-[#f4f5f7] p-4 rounded-2xl border border-slate-200/80 flex items-center justify-around mb-4 text-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">វត្តមាន</span>
                        <span className="text-base font-black text-emerald-600">{totalPresent} ថ្ងៃ</span>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-300" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">អវត្តមាន</span>
                        <span className="text-base font-black text-rose-600">{totalAbsent} ថ្ងៃ</span>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-300" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">មានច្បាប់</span>
                        <span className="text-base font-black text-amber-600">{totalPermission} ថ្ងៃ</span>
                      </div>
                    </div>

                    {/* Attendance List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {attendancesList.map((item: any, idx: number) => {
                        const isPresent = item.status === "PRESENT" || item.status === "LATE";
                        const isPermission = item.status === "PERMISSION" || item.status === "LEAVE" || item.status === "ABSENT_WITH_PERMISSION";
                        const dateStr = item.date ? new Date(item.date).toLocaleDateString("km-KH", { year: 'numeric', month: 'long', day: 'numeric' }) : `ថ្ងៃទី ${20 - idx} កក្កដា ២០២៦`;

                        return (
                          <div key={item.id || idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                isPresent ? "bg-emerald-100 text-emerald-700" : isPermission ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                              }`}>
                                {isPresent ? <CheckCircle className="w-4 h-4" /> : isPermission ? <Clock className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="font-black text-slate-800 block">{dateStr}</span>
                                <span className="text-[10.5px] text-slate-400">
                                  {item.reason || (isPresent ? "ម៉ោង 08:00 AM - 11:00 AM" : "សុំច្បាប់")}
                                </span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase ${
                              isPresent ? "bg-emerald-100 text-emerald-800" : isPermission ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                            }`}>
                              {isPresent ? "វត្តមាន" : isPermission ? "មានច្បាប់" : "អវត្តមាន"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: លទ្ធផលប្រឡង (EXAM RESULTS & REPORT CARD)                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isExamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Award className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">លទ្ធផលប្រឡង (Exam Results)</h3>
                  <p className="text-xs text-slate-400 font-medium">របាយការណ៍ពិន្ទុ និងនិទ្ទេសប្រចាំខែ/ឆមាស</p>
                </div>
              </div>

              {/* Overall Score Summary */}
              {(() => {
                const scoreRecords = data?.scores && data.scores.length > 0 ? data.scores : [
                  { id: "sc-1", subject: "ភាសាអង់គ្លេស (Listening & Speaking)", score: 99, maxScore: 100, month: "កក្កដា ២០២៦", grade: "A+" },
                  { id: "sc-2", subject: "អំណាន និងសំណេរ (Reading & Writing)", score: 98, maxScore: 100, month: "កក្កដា ២០២៦", grade: "A+" },
                  { id: "sc-3", subject: "គណិតវិទ្យា (Math)", score: 97, maxScore: 100, month: "កក្កដា ២០២៦", grade: "A+" },
                  { id: "sc-4", subject: "វិទ្យាសាស្ត្រ (Science)", score: 96, maxScore: 100, month: "កក្កដា ២០២៦", grade: "A+" },
                ];

                const totalScore = scoreRecords.reduce((acc: number, curr: any) => acc + (Number(curr.score) || 0), 0);
                const avgScore = scoreRecords.length > 0 ? (totalScore / scoreRecords.length).toFixed(1) : "97.5";
                const overallGrade = Number(avgScore) >= 95 ? "A+" : Number(avgScore) >= 85 ? "A" : Number(avgScore) >= 75 ? "B" : "C";

                return (
                  <>
                    <div className={`${themeCfg.cardGradient} text-white p-4.5 rounded-2xl shadow-md space-y-2 mb-4`}>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-rose-200 font-bold uppercase">ឆមាសទី១ - ២០២៦</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black text-[10px]">
                          ចំណាត់ថ្នាក់លេខ ១
                        </span>
                      </div>
                      <div className="flex justify-between items-end pt-1">
                        <div>
                          <span className="text-2xl font-black font-mono text-white">{avgScore}</span>
                          <span className="text-xs text-rose-200 font-bold"> / 100</span>
                        </div>
                        <span className="text-xl font-black text-amber-300 font-serif">និទ្ទេស {overallGrade}</span>
                      </div>
                    </div>

                    {/* Subject Breakdown */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      <h4 className="text-xs font-black text-slate-800">ពិន្ទុតាមមុខវិជ្ជា៖</h4>
                      {scoreRecords.map((sc: any, idx: number) => (
                        <div key={sc.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">{idx + 1}. {sc.subject}</span>
                          <span className="font-mono font-black text-emerald-600">{sc.score} / {sc.maxScore || 100} ({sc.grade || "A+"})</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: តារាងកិត្តិយស (HONOR ROLL BOARD)                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isHonorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsHonorModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Star className="w-6 h-6 stroke-[2] text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">តារាងកិត្តិយស (Honor Roll)</h3>
                  <p className="text-xs text-slate-400 font-medium">សិស្សឆ្នើមប្រចាំខែកក្កដា ២០២៦</p>
                </div>
              </div>

              {/* Honor Student Certificate Card */}
              {(() => {
                const honorStudents = data?.honorRollStudents && data.honorRollStudents.length > 0 ? data.honorRollStudents : [
                  { id: "h1", nameKh: currentStudentName, photoUrl: data?.photoUrl || DEFAULT_AVATARS[0], course: currentClassName, rank: 1, gpa: "98.5 (A+)" },
                  { id: "h2", nameKh: "ចាន់ សុខា", photoUrl: DEFAULT_AVATARS[1], course: "ថ្នាក់ទី៥ ក", rank: 2, gpa: "97.2 (A+)" },
                  { id: "h3", nameKh: "លី ហេង", photoUrl: DEFAULT_AVATARS[2], course: "ថ្នាក់ទី៥ ខ", rank: 3, gpa: "96.8 (A)" },
                  { id: "h4", nameKh: "គឹម ស៊ាង", photoUrl: DEFAULT_AVATARS[3], course: "ថ្នាក់ទី៥ ក", rank: 4, gpa: "95.5 (A)" },
                ];

                const top1 = honorStudents[0];

                return (
                  <div className="space-y-3">
                    <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 text-center space-y-3 mb-2">
                      <div className="w-20 h-20 mx-auto rounded-full border-4 border-amber-400 overflow-hidden shadow-lg bg-white">
                        <img src={top1.photoUrl || DEFAULT_AVATARS[0]} alt={top1.nameKh} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 font-serif">{top1.nameKh}</h4>
                        <p className={`text-xs font-bold ${themeCfg.textColor}`}>{top1.course || currentClassName}</p>
                      </div>
                      <div className="bg-white/80 py-1.5 px-3 rounded-full border border-amber-300 inline-block text-xs font-black text-amber-800">
                        🏆 សិស្សពូកែទូទាំងសាលា ចំណាត់ថ្នាក់លេខ ១
                      </div>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      <h4 className="text-xs font-black text-slate-800 font-serif">បញ្ជីសិស្សឆ្នើមប្រចាំខែ ({honorStudents.length})</h4>
                      {honorStudents.map((st: any, idx: number) => (
                        <div key={st.id || idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                            idx === 0 ? "bg-amber-400 text-slate-900" : idx === 1 ? "bg-slate-300 text-slate-800" : idx === 2 ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                            <img src={st.photoUrl || DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length]} alt={st.nameKh} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <h5 className="font-black text-slate-800 truncate">{st.nameKh}</h5>
                            <p className="text-[10px] text-slate-400">{st.course || "ថ្នាក់ទូទៅ"}</p>
                          </div>
                          <span className="text-xs font-mono font-black text-emerald-600">{st.gpa || "98% (A+)"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 5: វិក្កយបត្រ (INVOICE & FEE)                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">វិក្កយបត្រថ្លៃសិក្សា (Invoices)</h3>
                  <p className="text-xs text-slate-400 font-medium">ស្ថានភាពបង់ប្រាក់ និងវិក្កយបត្រផ្លូវការ</p>
                </div>
              </div>

              {/* Fee Summary */}
              {(() => {
                const baseTuition = data?.baseFee ? Number(data.baseFee) : 120;
                const discountVal = data?.discount ? Number(data.discount) : 0;
                const netTuition = Math.max(0, baseTuition - discountVal);

                const paymentsList = data?.payments && data.payments.length > 0 ? data.payments : [
                  {
                    id: "p-1",
                    invoiceNumber: "INV-2026-0891",
                    receiptNumber: "REC-2026-001",
                    amount: netTuition || 120,
                    status: "PAID",
                    createdAt: new Date().toISOString(),
                    feeType: "ថ្លៃសិក្សាឆមាសទី១"
                  }
                ];

                const totalPaid = paymentsList.filter((p: any) => p.status === 'PAID' || p.status === 'APPROVED' || p.status === 'SUCCESS').reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
                const balanceDue = Math.max(0, netTuition - totalPaid);

                return (
                  <>
                    <div className={`${themeCfg.cardGradient} text-white p-4.5 rounded-2xl shadow-md space-y-2 mb-4`}>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-rose-200 font-bold uppercase">ថ្លៃសិក្សាសរុប</span>
                        <span className="font-mono font-bold">${netTuition.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 flex justify-between items-center">
                        <span className="text-sm font-black text-white">ប្រាក់ត្រូវបង់ (Balance Due)</span>
                        <span className="text-lg font-black text-amber-300 font-mono">${balanceDue.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {paymentsList.map((inv: any, idx: number) => {
                        const invNo = inv.invoiceNumber || `INV-2026-0${idx + 101}`;
                        const dateStr = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("km-KH") : "01/07/2026";
                        const isPaid = inv.status === "PAID" || inv.status === "APPROVED" || inv.status === "SUCCESS";

                        return (
                          <div key={inv.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-black text-slate-800 block">{invNo}</span>
                              <span className="text-[10.5px] text-slate-400">{dateStr} • {inv.feeType || "ថ្លៃសិក្សា"}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-black font-mono text-slate-800 block">${Number(inv.amount || netTuition).toFixed(2)}</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {isPaid ? "បានបង់រួច (PAID)" : "រង់ចាំបង់ (PENDING)"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 6: ប្រវត្តិការបង់ប្រាក់ (PAYMENT HISTORY)                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPaymentHistoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsPaymentHistoryModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <CreditCard className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">ប្រវត្តិការបង់ប្រាក់ (Payment History)</h3>
                  <p className="text-xs text-slate-400 font-medium">កំណត់ត្រាប្រតិបត្តិការបង់ប្រាក់កន្លងមក</p>
                </div>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(() => {
                  const paymentHistoryList = data?.payments && data.payments.length > 0 ? data.payments : [
                    {
                      id: "pay-1",
                      receiptNumber: "REC-2026-001",
                      paymentMethod: "ABA KHQR",
                      amount: data?.baseFee ? Number(data.baseFee) : 120,
                      status: "APPROVED",
                      createdAt: new Date().toISOString()
                    }
                  ];

                  return paymentHistoryList.map((pay: any, idx: number) => {
                    const recNo = pay.receiptNumber || `REC-2026-00${idx + 1}`;
                    const method = pay.paymentMethod || "ABA KHQR";
                    const dateStr = pay.createdAt ? new Date(pay.createdAt).toLocaleDateString("km-KH") : "01/07/2026";
                    const amountVal = pay.amount ? Number(pay.amount).toFixed(2) : "120.00";

                    return (
                      <div key={pay.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-black text-slate-800 block">បង្កាន់ដៃលេខ: {recNo}</span>
                          <span className="text-[10.5px] text-slate-400">{dateStr} ({method})</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black font-mono text-emerald-600 block text-sm">+${amountVal}</span>
                          <span className="text-[10px] text-emerald-600 font-bold">ជោគជ័យ</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 7: សេចក្តីជូនដំណឹង (NOTIFICATION MODAL)                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isNotificationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsNotificationModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Bell className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">សេចក្តីជូនដំណឹង (Notifications)</h3>
                  <p className="text-xs text-slate-400 font-medium">ព័ត៌មាន និងការជូនដំណឹងពីសាលារៀន</p>
                </div>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(() => {
                  const announcementsList = data?.announcements && data.announcements.length > 0 ? data.announcements : [
                    {
                      id: "ann-1",
                      title: "📢 ជូនដំណឹងអំពីការឈប់សម្រាក",
                      sentAt: "២ ម៉ោងមុន",
                      content: `${sysSettings?.schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} សូមជូនដំណឹងដល់អាណាព្យាបាលសិស្សទាំងអស់អំពីការឈប់សម្រាកក្នុងឱកាសពិធីបុណ្យភ្ជុំបិណ្ឌខាងមុខនេះ...`
                    },
                    {
                      id: "ann-2",
                      title: "📝 កាលវិភាគប្រឡងឆមាស",
                      sentAt: "ម្សិលមិញ",
                      content: "សូមជម្រាបជូនអំពីកាលវិភាគប្រឡងឆមាសទី១ សម្រាប់សិស្សានុសិស្សគ្រប់កម្រិតថ្នាក់ សូមអាណាព្យាបាលជួយរំលឹកសិស្សឱ្យខិតខំរៀនសូត្រ..."
                    }
                  ];

                  return announcementsList.map((ann: any, idx: number) => (
                    <div key={ann.id || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-black ${themeCfg.textColor}`}>{ann.title}</span>
                        <span className="text-[10px] font-bold text-slate-400">{ann.sentAt || "ថ្មីៗ"}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {ann.content}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 8: SWITCH STUDENT MODAL                                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isChildModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 relative border border-slate-100"
            >
              <button
                onClick={() => setIsChildModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-black text-slate-800 mb-1">
                ជ្រើសរើសឈ្មោះសិស្ស (Select Student)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                សូមជ្រើសរើសកូនដែលលោកអ្នកចង់មើលព័ត៌មាន៖
              </p>

              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {childrenList.map((child: any, idx: number) => {
                  const isSelected = selectedStudentId === child?.studentId || selectedStudentId === child?.id || (data?.id === child?.id);
                  const avatarUrl = child?.photoUrl || DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];
                  
                  return (
                    <button
                      key={child.id || idx}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(child.studentId || child.id);
                        fetchData(child.studentId || child.id);
                        setIsChildModalOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer border text-left ${
                        isSelected 
                          ? "bg-[#8f1218]/5 border-[#8f1218] ring-1 ring-[#8f1218]" 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                        <img src={avatarUrl} alt={child.nameKh} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-800 truncate">
                          {child.nameKh || "សិស្ស"}
                        </h4>
                        <p className="text-xs font-mono text-slate-500">
                          ID: {child.studentId || child.id}
                        </p>
                        <span className="text-[10px] text-[#8f1218] font-bold">
                          {child.course || "ថ្នាក់រៀន"} {child.level || ''}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#8f1218] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 9: DIGITAL LIBRARY MODAL (បណ្ណាល័យឌីជីថល)                           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isLibraryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 relative border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsLibraryModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header with Custom Icon */}
              <div className="flex items-center gap-3.5 mb-4 shrink-0 pr-8">
                <LibraryAppIcon className="w-12 h-12 shrink-0 drop-shadow-xs" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-serif leading-tight">
                    បណ្ណាល័យឌីជីថល (Digital Library)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    សៀវភៅសិក្សា ឯកសារស្រាវជ្រាវ និងរឿងនិទាន
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3 shrink-0">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={librarySearchQuery}
                  onChange={(e) => setLibrarySearchQuery(e.target.value)}
                  placeholder="ស្វែងរកសៀវភៅ ឬអ្នកនិពន្ធ..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#8f1218] focus:bg-white transition-all"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 shrink-0 no-scrollbar">
                {[
                  { id: "all", label: "ទាំងអស់" },
                  { id: "textbook", label: "សៀវភៅពុម្ព" },
                  { id: "story", label: "រឿងនិទាន" },
                  { id: "exam", label: "វិញ្ញាសាប្រឡង" },
                ].map((cat) => {
                  const isActive = selectedLibraryCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedLibraryCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#8f1218] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Book List Scroll Area */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
                {sampleBooks
                  .filter((b) => {
                    const matchesCategory = selectedLibraryCategory === "all" || b.category === selectedLibraryCategory;
                    const matchesSearch = b.title.includes(librarySearchQuery) || b.titleEn.toLowerCase().includes(librarySearchQuery.toLowerCase()) || b.author.includes(librarySearchQuery);
                    return matchesCategory && matchesSearch;
                  })
                  .map((book) => {
                    const isBorrowed = borrowedBooks.includes(book.id);

                    return (
                      <div
                        key={book.id}
                        className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200/80 transition-all flex gap-3.5 items-start group shadow-2xs"
                      >
                        {/* Book Cover Design */}
                        <div className="w-20 h-28 rounded-xl bg-primary-600 p-2 text-white flex flex-col justify-between shadow-md shrink-0 border border-white/20 relative overflow-hidden">
                          <div className="text-[9px] font-black uppercase tracking-wider opacity-90 line-clamp-1">
                            {book.categoryKh}
                          </div>
                          <div className="my-auto text-center">
                            <h4 className="text-[11px] font-black font-serif leading-tight line-clamp-2 drop-shadow-xs">
                              {book.title}
                            </h4>
                          </div>
                          <div className="text-[8px] opacity-80 text-center font-mono truncate">
                            {book.author}
                          </div>
                        </div>

                        {/* Book Details & Actions */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-28">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold text-[#8f1218] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                {book.categoryKh}
                              </span>
                              <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{book.rating}</span>
                              </div>
                            </div>

                            <h4 className="text-sm font-black text-slate-800 line-clamp-1 font-serif">
                              {book.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                              {book.description}
                            </p>
                          </div>

                          {/* Footer Info & Buttons */}
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 mt-1">
                            <span className="text-[10px] font-medium text-slate-400">
                              {book.totalPages} ទំព័រ
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Borrow Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (isBorrowed) {
                                    setBorrowedBooks(borrowedBooks.filter((id) => id !== book.id));
                                  } else {
                                    setBorrowedBooks([...borrowedBooks, book.id]);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                                  isBorrowed
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                }`}
                              >
                                {isBorrowed ? "បានខ្ចី ✓" : "ខ្ចីសៀវភៅ"}
                              </button>

                              {/* Read Book Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setReadingBook(book);
                                  setReaderPage(1);
                                }}
                                className="px-3 py-1 bg-[#8f1218] hover:bg-[#a3161d] text-white rounded-xl text-[10px] font-black shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>អាន</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 10: INTERACTIVE E-BOOK READER MODAL                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {readingBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-[#faf8f5] rounded-3xl shadow-2xl relative border border-amber-200/60 flex flex-col h-[88vh] overflow-hidden"
            >
              {/* Reader Header */}
              <div className="bg-[#8f1218] text-white p-3.5 px-4 flex items-center justify-between shrink-0 shadow-md">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setReadingBook(null)}
                    className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-white truncate font-serif">
                      {readingBook.title}
                    </h3>
                    <p className="text-[10px] text-amber-200 truncate">
                      {readingBook.chapters[readerPage - 1]?.title || `ទំព័រទី ${readerPage}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-bold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                    {readerPage} / {readingBook.chapters.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReadingBook(null)}
                    className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chapter Content Canvas */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 font-serif text-slate-800 leading-relaxed text-sm sm:text-base">
                <div className="border-b border-amber-200/80 pb-3 mb-4">
                  <span className="text-[10px] font-black uppercase text-[#8f1218] tracking-widest block mb-1">
                    {readingBook.categoryKh} • {readingBook.author}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {readingBook.chapters[readerPage - 1]?.title || `ជំពូកទី ${readerPage}`}
                  </h2>
                </div>

                <div className="whitespace-pre-line text-justify leading-loose font-serif text-slate-800">
                  {readingBook.chapters[readerPage - 1]?.content || "មាតិការកំពុងរៀបចំទាញយក..."}
                </div>
              </div>

              {/* Reader Footer Navigation */}
              <div className="bg-amber-100/80 border-t border-amber-200 p-3 px-4 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  disabled={readerPage <= 1}
                  onClick={() => setReaderPage(readerPage - 1)}
                  className="px-4 py-2 bg-white hover:bg-amber-50 disabled:opacity-40 disabled:hover:bg-white text-slate-800 rounded-2xl text-xs font-black shadow-xs border border-amber-200 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ទំព័រមុន</span>
                </button>

                <div className="text-center">
                  <span className="text-xs font-bold text-slate-700 font-serif">
                    ទំព័រ {readerPage} នៃ {readingBook.chapters.length}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={readerPage >= readingBook.chapters.length}
                  onClick={() => setReaderPage(readerPage + 1)}
                  className="px-4 py-2 bg-[#8f1218] hover:bg-[#a3161d] disabled:opacity-40 disabled:hover:bg-[#8f1218] text-white rounded-2xl text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <span>ទំព័របន្ទាប់</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 11: សុំច្បាប់ (LEAVE PERMISSION REQUEST MODAL)                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isLeaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  setIsLeaveSubmitted(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header with Whistle/Timer Icon */}
              <div className="flex items-center gap-3.5 mb-4 shrink-0 pr-8">
                <WhistleTimerIcon className="w-12 h-12 shrink-0 drop-shadow-xs" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-serif leading-tight">
                    ទម្រង់សុំច្បាប់ឈប់សម្រាក (Leave Request)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ផ្ញើសំណើទៅកាន់នាយកដ្ឋានសិក្សា និងគ្រូបន្ទុកថ្នាក់
                  </p>
                </div>
              </div>

              {/* Success Notification Banner */}
              {isLeaveSubmitted ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3 my-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-emerald-900 font-serif">
                      សំណើសុំច្បាប់ត្រូវបានផ្ញើដោយជោគជ័យ!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      ព័ត៌មាននៃការសុំច្បាប់ត្រូវបានបញ្ជូនទៅកាន់គ្រូបន្ទុកថ្នាក់ និងលោកនាយក${sysSettings?.schoolKhmerName || "សាលា"}ដើម្បីពិនិត្យ និងអនុម័ត។
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLeaveSubmitted(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    បង្កើតសំណើសុំច្បាប់ថ្មីទៀត
                  </button>
                </motion.div>
              ) : (
                /* Leave Request Form */
                <form
                  onSubmit={handleLeaveSubmit}
                  className="space-y-4"
                >
                  {/* Student Info Box */}
                  <div className="p-3.5 rounded-2xl flex items-center gap-3" style={{ backgroundColor: `${themeCfg.primaryColor}0d`, borderColor: `${themeCfg.primaryColor}33`, borderWidth: '1px' }}>
                    <div className="w-11 h-11 rounded-full border-2 overflow-hidden bg-slate-200 shrink-0" style={{ borderColor: themeCfg.primaryColor }}>
                      <img src={data?.photoUrl || DEFAULT_AVATARS[0]} alt={currentStudentName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] font-bold ${themeCfg.textColor} uppercase tracking-wider block`}>
                        សិស្សសុំច្បាប់
                      </span>
                      <h4 className="text-sm font-black text-slate-800 truncate font-serif">
                        {currentStudentName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {currentClassName} • ID: {currentStudentId}
                      </p>
                    </div>
                  </div>

                  {/* Leave Type Options */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">
                      ប្រភេទនៃការសុំច្បាប់ <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "ឈឺ (Sick Leave)", label: "🤒 ឈឺ" },
                        { id: "ធុរៈផ្ទាល់ខ្លួន (Personal)", label: "🏡 ធុរៈផ្ទាល់ខ្លួន" },
                        { id: "ផ្សេងៗ (Other)", label: "📝 ផ្សេងៗ" },
                      ].map((t) => {
                        const isSelected = leaveType === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setLeaveType(t.id)}
                            className={`p-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
                              isSelected
                                ? `${themeCfg.primaryBg} text-white shadow-xs`
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-700 block">
                        ចាប់ពីថ្ងៃទី <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-700 block">
                        ដល់ថ្ងៃទី <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Reason Textarea */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 block">
                      មូលហេតុនៃការសុំច្បាប់ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="សូមរៀបរាប់ពីមូលហេតុនៃការសុំច្បាប់ (ឧទាហរណ៍៖ សិស្សមានអាការៈក្តៅខ្លួន និងឈឺក្បាល...)"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Guardian Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 block">
                      លេខទូរស័ព្ទទំនាក់ទំនងអាណាព្យាបាល
                    </label>
                    <input
                      type="text"
                      value={leaveGuardianPhone}
                      onChange={(e) => setLeaveGuardianPhone(e.target.value)}
                      placeholder={sysSettings?.schoolPhone || "087 850 014 / 097 501 3648"}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </div>

                  {/* Attach Medical/Doctor Note (Optional) */}
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-1.5">
                    <span className="text-xs font-bold text-slate-600 block">
                      📎 បញ្ជូនលិខិតបញ្ជាក់ពីគ្រូពេទ្យ ឬឯកសារពាក់ព័ន្ធ (ជម្រើសបន្ថែម)
                    </span>
                    <button
                      type="button"
                      onClick={() => alert("លោកអ្នកអាចថតរូប ឬជ្រើសរើសលិខិតបញ្ជាក់ពីគ្រូពេទ្យដើម្បីភ្ជាប់ជាមួយសំណើ។")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-[11px] font-black text-slate-700 cursor-pointer shadow-2xs"
                    >
                      + បន្ថែមរូបភាពលិខិតបញ្ជាក់
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full py-3.5 ${themeCfg.primaryBg} hover:opacity-90 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98`}
                  >
                    <Send className="w-4 h-4" />
                    <span>ផ្ញើសំណើសុំច្បាប់ (Submit Request)</span>
                  </button>
                </form>
              )}

              {/* Past Leave Requests History */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2.5">
                <h4 className="text-xs font-black text-slate-800 font-serif flex items-center justify-between">
                  <span>ប្រវត្តិសុំច្បាប់កន្លងមក ({leaveRequestsList.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">ប្រព័ន្ធស្វ័យប្រវត្តិ</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {leaveRequestsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-black ${themeCfg.textColor}`}>{item.type}</span>
                          <span className="text-[10px] font-bold text-slate-400">• {item.dateRange}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{item.reason}</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.statusKh}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 12: ថ្នាក់រៀនទាំងអស់ (ALL ENROLLED CLASSES MODAL)                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isClassesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsClassesModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3.5 mb-5 shrink-0 pr-8">
                <FolderHomeIcon className="w-12 h-12 shrink-0 drop-shadow-xs" fillColor={themeCfg.primaryColor} />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-serif leading-tight">
                    បញ្ជីថ្នាក់រៀនទាំងអស់ (All Classes)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ព័ត៌មានថ្នាក់រៀន កាលវិភាគ និងគ្រូបន្ទុកថ្នាក់របស់សិស្ស
                  </p>
                </div>
              </div>

              {/* Student Header Card */}
              <div className="p-3.5 rounded-2xl flex items-center gap-3 mb-4" style={{ backgroundColor: `${themeCfg.primaryColor}0d`, borderColor: `${themeCfg.primaryColor}33`, borderWidth: '1px' }}>
                <div className="w-12 h-12 rounded-full border-2 overflow-hidden bg-slate-200 shrink-0" style={{ borderColor: themeCfg.primaryColor }}>
                  <img src={data?.photoUrl || DEFAULT_AVATARS[0]} alt={currentStudentName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold ${themeCfg.textColor} uppercase tracking-wider block`}>
                    សិស្សចុះឈ្មោះរៀន
                  </span>
                  <h4 className="text-sm font-black text-slate-800 truncate font-serif">
                    {currentStudentName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    អត្តលេខ៖ {currentStudentId} • {sysSettings?.schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                  </p>
                </div>
              </div>

              {/* List of Enrolled Classes */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 font-serif uppercase tracking-wider">
                  ថ្នាក់កំពុងសិក្សាសរុប (៣ ថ្នាក់)
                </h4>

                {/* Class Item 1: Khmer General Education */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black inline-block mb-1" style={{ backgroundColor: `${themeCfg.primaryColor}1a`, color: themeCfg.primaryColor }}>
                        ចំណេះទូទៅខ្មែរ
                      </span>
                      <h5 className="text-sm font-black text-slate-800 font-serif">
                        {currentClassName}
                      </h5>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black shrink-0">
                      កំពុងសិក្សា
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">កាលវិភាគសិក្សា</span>
                      <p className="font-bold text-slate-700">ច័ន្ទ - សុក្រ (08:00 - 11:00 AM)</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">បន្ទប់សិក្សា</span>
                      <p className="font-bold text-slate-700">បន្ទប់ B204 (ជាន់ទី ២)</p>
                    </div>
                  </div>

                  <div className="text-xs pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">គ្រូបន្ទុកថ្នាក់៖ <strong className="text-slate-800">អ្នកគ្រូ សុខ ចាន់ថន</strong></span>
                    <button
                      type="button"
                      onClick={() => alert(`កាលវិភាគលម្អិតថ្នាក់ ${currentClassName}៖\n- ច័ន្ទ៖ ភាសាខ្មែរ & គណិតវិទ្យា\n- អង្គារ៖ វិទ្យាសាស្ត្រ & សិក្សាសង្គម\n- ពុធ៖ ភាសាខ្មែរ & គណិតវិទ្យា\n- ព្រហស្បតិ៍៖ ភាសាអង់គ្លេស & កីឡា\n- សុក្រ៖ គូររូប & សីលធម៌ពលរដ្ឋ`)}
                      className={`px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-black ${themeCfg.textColor} cursor-pointer shadow-2xs`}
                    >
                      មើលកាលវិភាគ ➔
                    </button>
                  </div>
                </div>

                {/* Class Item 2: General English Program */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-black inline-block mb-1">
                        ភាសាអង់គ្លេសទូទៅ (GEP)
                      </span>
                      <h5 className="text-sm font-black text-slate-800 font-serif">
                        General English Program (GEP Level 6)
                      </h5>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black shrink-0">
                      កំពុងសិក្សា
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">កាលវិភាគសិក្សា</span>
                      <p className="font-bold text-slate-700">ច័ន្ទ - សុក្រ (01:30 - 04:30 PM)</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">បន្ទប់សិក្សា</span>
                      <p className="font-bold text-slate-700">បន្ទប់ A102 (ជាន់ទី ១)</p>
                    </div>
                  </div>

                  <div className="text-xs pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">គ្រូបន្ទុកថ្នាក់៖ <strong className="text-slate-800">Mr. John Smith</strong></span>
                    <button
                      type="button"
                      onClick={() => alert("កាលវិភាគ GEP Level 6៖\n- Reading & Writing: 01:30 PM - 03:00 PM\n- Listening & Speaking: 03:15 PM - 04:30 PM")}
                      className={`px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-black ${themeCfg.textColor} cursor-pointer shadow-2xs`}
                    >
                      មើលកាលវិភាគ ➔
                    </button>
                  </div>
                </div>

                {/* Class Item 3: Computer & IT */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black inline-block mb-1">
                        កុំព្យូទ័រ & បច្ចេកវិទ្យា
                      </span>
                      <h5 className="text-sm font-black text-slate-800 font-serif">
                        Computer & Digital Skills (Basic Level 2)
                      </h5>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black shrink-0">
                      កំពុងសិក្សា
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">កាលវិភាគសិក្សា</span>
                      <p className="font-bold text-slate-700">សៅរ៍ - អាទិត្យ (08:00 - 11:00 AM)</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">បន្ទប់សិក្សា</span>
                      <p className="font-bold text-slate-700">បន្ទប់ Computer Lab 01</p>
                    </div>
                  </div>

                  <div className="text-xs pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">គ្រូបន្ទុកថ្នាក់៖ <strong className="text-slate-800">លោកគ្រូ ចាន់ តារា</strong></span>
                    <button
                      type="button"
                      onClick={() => alert("កាលវិភាគកុំព្យូទ័រ៖\n- Microsoft Word & Excel Skills\n- Coding Basics & Internet Safety")}
                      className={`px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-black ${themeCfg.textColor} cursor-pointer shadow-2xs`}
                    >
                      មើលកាលវិភាគ ➔
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK BANNER SETTINGS MODAL */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm">កំណត់រូបតាំង / រូបបដា</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Banner Preview */}
              <div className="rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-200 shadow-inner">
                <img
                  src={portalCoverImage || DEFAULT_BANNER_IMG}
                  alt="Preview"
                  className="w-full h-32 object-cover opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_BANNER_IMG;
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] font-black text-amber-300 uppercase">
                    {portalBannerTitle || "វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ"}
                  </span>
                  <p className="text-xs font-bold line-clamp-1">
                    {portalBannerSubtitle || "អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ"}
                  </p>
                </div>
              </div>

              {/* Preset selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">ជ្រើសរើសរូបភាពគំរូស្រាប់</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {bannerPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPortalCoverImage(preset.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer h-12 ${
                        portalCoverImage === preset.url ? "border-amber-500 ring-2 ring-amber-500/30 scale-105" : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* URL or Upload */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">URL រូបភាព</label>
                  <input
                    type="url"
                    value={portalCoverImage}
                    onChange={(e) => setPortalCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">ចំណងជើង</label>
                  <input
                    type="text"
                    value={portalBannerTitle}
                    onChange={(e) => setPortalBannerTitle(e.target.value)}
                    placeholder="ឧ. វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">អនុចំណងជើង</label>
                  <input
                    type="text"
                    value={portalBannerSubtitle}
                    onChange={(e) => setPortalBannerSubtitle(e.target.value)}
                    placeholder="ឧ. អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធី"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  onClick={handleSavePortalBanner}
                  disabled={isSavingPortalBanner}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingPortalBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>រក្សាទុក</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
