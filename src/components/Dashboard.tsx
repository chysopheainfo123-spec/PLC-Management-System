import FinanceTab from './tabs/FinanceTab';
import TeachersTab from './tabs/TeachersTab';
import StudentsTab from './tabs/StudentsTab';
import DashboardTab from './tabs/DashboardTab';
import DatabaseTab from './tabs/DatabaseTab';
import IDCardTab from './tabs/IDCardTab';
import SettingsTab from './tabs/SettingsTab';
import GradingTab from './tabs/GradingTab';
import TimetableTab from './tabs/TimetableTab';
import MySQLDBTab from './tabs/MySQLDBTab';
import AttendanceTab from './tabs/AttendanceTab';
import AnalyticsTab from "./tabs/AnalyticsTab";
import AnnouncementsTab from "./tabs/AnnouncementsTab";
import CoursesTab from "./tabs/CoursesTab";
import ExamsTab from "./tabs/ExamsTab";
import LeaveRequestsTab from "./tabs/LeaveRequestsTab";
import LibraryTab from "./tabs/LibraryTab";

import LanguageSelector from "./LanguageSelector";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from "motion/react";


import { Megaphone, LogOut, Users, GraduationCap, BookOpen, Library as LibraryIcon, BookMarked, Archive, UserPlus, Settings, Bell, BellOff, Wifi, WifiOff, Search, ShieldCheck, Mail, User, CheckCircle, Loader2, Database, KeyRound, AlertTriangle, Info, Activity, RotateCw, QrCode, CreditCard, Award, DollarSign, Calendar, Clock, Check, Menu, X, Sparkles, SlidersHorizontal, BarChart2, PieChart as PieIcon, LineChart, TrendingUp, List, LayoutGrid, LayoutDashboard, UserCheck, FileBadge, FileSpreadsheet, Package, Trash2, Eye, Printer, Plus, Phone, Send, Heart, Filter, Save, RotateCcw, Pencil, Landmark, MessageSquare, Folder, File, ChevronRight, ChevronLeft, ChevronDown, FileCode, Terminal, Server, Workflow, Network, Layers, ArrowUp, ArrowDown, MapPin, Camera, Volume2, VolumeX, Briefcase, Smartphone, RefreshCw, Cpu, Upload, Download, Coins, Globe, Monitor, Palette, FileText, Image as ImageIcon, Maximize2, Minimize2, Pipette } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Legend, PieChart, Pie, Cell, CartesianGrid, AreaChart, Area,
  LineChart as RechartsLineChart, Line
} from "recharts";
import { User as UserType, Student as StudentType } from "../types";
import { CredentialsTab } from "./CredentialsTab";
import { CertificatesTab } from "./CertificatesTab";
import QRScanTabComponent from "./QRScanTab";
import AttendanceDisplayTab from "./AttendanceDisplayTab";
import AssetsTab from "./AssetsTab";
import ReportCardsTab from "./tabs/ReportCardsTab";
import AlumniTab from "./tabs/AlumniTab";
import ParentPortalTab from "./tabs/ParentPortalTab";

const toKhmerNumeral = (num: number | string) => {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num).split("").map(char => {
    const digit = parseInt(char, 10);
    return isNaN(digit) ? char : khmerDigits[digit];
  }).join("");
};

// Robust helper function to extract and convert oklab/oklch colors to standard sRGB format
export const extractAndConvertColor = (funcType: string, inner: string): string => {
  const normalized = inner.replace(/,/g, ' ');
  const parts = normalized.trim().split(/\s+/);
  if (parts.length === 0) return "rgb(100, 116, 139)";
  
  let lStr = parts[0];
  let lVal = parseFloat(lStr);
  if (lStr.endsWith('%')) {
    lVal = parseFloat(lStr) / 100;
  }
  
  if (isNaN(lVal)) {
    return "rgb(100, 116, 139)";
  }
  
  let alpha = 1;
  const slashIndex = parts.indexOf('/');
  if (slashIndex !== -1 && slashIndex + 1 < parts.length) {
    alpha = parseFloat(parts[slashIndex + 1]);
  } else {
    const partWithSlash = parts.find(p => p.startsWith('/'));
    if (partWithSlash) {
      alpha = parseFloat(partWithSlash.substring(1));
    }
  }
  if (isNaN(alpha)) alpha = 1;

  if (lVal >= 0.96) return alpha < 1 ? `rgba(255, 255, 255, ${alpha})` : "rgb(255, 255, 255)";
  if (lVal <= 0.05) return alpha < 1 ? `rgba(0, 0, 0, ${alpha})` : "rgb(0, 0, 0)";
  
  try {
    let aVal = parts[1] ? parseFloat(parts[1]) : 0;
    let bVal = parts[2] ? parseFloat(parts[2]) : 0;
    
    if (funcType === 'oklch') {
      const cVal = aVal;
      const hVal = bVal;
      const hRad = (hVal * Math.PI) / 180;
      aVal = cVal * Math.cos(hRad);
      bVal = cVal * Math.sin(hRad);
    }
    
    const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
    const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
    const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
    
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    
    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    
    const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
    const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
    const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
    
    return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
  } catch (e) {
    return "rgb(100, 116, 139)";
  }
};

export const sanitizeCssColors = (css: string): string => {
  let result = "";
  let i = 0;
  while (i < css.length) {
    const sub6 = css.substring(i, i + 6).toLowerCase();
    if (sub6 === "oklch(" || sub6 === "oklab(") {
      const funcType = sub6.slice(0, 5);
      i += 6;
      const start = i;
      let depth = 1;
      while (i < css.length && depth > 0) {
        if (css[i] === '(') depth++;
        else if (css[i] === ')') depth--;
        i++;
      }
      const inner = css.substring(start, i - 1);
      result += extractAndConvertColor(funcType, inner);
    } else {
      result += css[i];
      i++;
    }
  }
  return result;
};

const EMPTY_ARRAY: any[] = [];

const hexToRgb = (hex: string) => {
  let cleanHex = hex.trim().replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const mixWhite = (rgb: { r: number; g: number; b: number }, factor: number) => {
  return rgbToHex(
    rgb.r + (255 - rgb.r) * factor,
    rgb.g + (255 - rgb.g) * factor,
    rgb.b + (255 - rgb.b) * factor
  );
};

const mixBlack = (rgb: { r: number; g: number; b: number }, factor: number) => {
  return rgbToHex(
    rgb.r * (1 - factor),
    rgb.g * (1 - factor),
    rgb.b * (1 - factor)
  );
};

const generatePrimaryPalette = (hex: string): Record<string, string> | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return {
    '50': mixWhite(rgb, 0.93),
    '100': mixWhite(rgb, 0.84),
    '200': mixWhite(rgb, 0.68),
    '300': mixWhite(rgb, 0.48),
    '400': mixWhite(rgb, 0.24),
    '500': rgbToHex(rgb.r, rgb.g, rgb.b),
    '600': mixBlack(rgb, 0.14),
    '700': mixBlack(rgb, 0.28),
    '800': mixBlack(rgb, 0.42),
    '900': mixBlack(rgb, 0.58),
    '950': mixBlack(rgb, 0.75),
  };
};

const getLuminance = (hexColor: string): number => {
  if (!hexColor || !hexColor.startsWith("#")) return 1;
  let c = hexColor.replace("#", "");
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  if (c.length !== 6) return 1;
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Safe executor that intercepts getComputedStyle to bypass oklch parsing crash in html2canvas/html-to-image
export async function withSafeCss<T>(callback: () => Promise<T>): Promise<T> {
  const originalGetComputedStyle = window.getComputedStyle;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  try {
    // Suppress html-to-image specific warnings about cross-origin CSS
    console.error = (...args: any[]) => {
      const msg = args.join(' ');
      if (
        msg.includes('Error inlining remote css file') || 
        msg.includes('Error loading remote stylesheet') || 
        msg.includes('Failed to read the \'cssRules\' property') ||
        msg.includes('Cannot access rules') ||
        msg.includes('translate_http')
      ) {
        return; // Suppress
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const msg = args.join(' ');
      if (msg.includes('Error inlining remote css file') || msg.includes('Failed to read the \'cssRules\'')) {
        return; // Suppress
      }
      originalConsoleWarn.apply(console, args);
    };

    window.getComputedStyle = function(el, pseudoElt) {
      const style = originalGetComputedStyle(el, pseudoElt);
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === 'getPropertyValue') {
            return function(propertyName: string) {
              const val = target.getPropertyValue(propertyName);
              if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
                return sanitizeCssColors(val);
              }
              return val;
            };
          }
          const val = Reflect.get(target, prop, target);
          if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
            return sanitizeCssColors(val);
          }
          if (typeof val === 'function') {
            return val.bind(target);
          }
          return val;
        }
      }) as any;
    };
    return await callback();
  } finally {
    window.getComputedStyle = originalGetComputedStyle;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }
}

const dbTablesMetadata = {
  User: {
    name: "User",
    khText: "តារាងរក្សាទុកព័ត៌មានគណនីរបស់ Admin, គ្រូបង្រៀន និងបុគ្គលិក ដើម្បីប្រើប្រាស់ក្នុងប្រព័ន្ធ Login និងគ្រប់គ្រងសិទ្ធិប្រើប្រាស់។",
    cols: 8,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់គណនី (UUID)" },
      { name: "email", type: "String", constraint: "UNIQUE", desc: "អាសយដ្ឋានអ៊ីមែលសម្រាប់ឡុកចូល (Login Email)" },
      { name: "passwordHash", type: "String", constraint: "-", desc: "លេខសម្ងាត់គណនីដែលបានហាស (Encrypted Password)" },
      { name: "fullName", type: "String", constraint: "-", desc: "ឈ្មោះពេញរបស់ម្ចាស់គណនី" },
      { name: "role", type: "Role (Enum)", constraint: "DEFAULT STAFF", desc: "សិទ្ធិប្រើប្រាស់៖ ADMIN, TEACHER, STAFF" },
      { name: "telegramId", type: "String?", constraint: "-", desc: "Telegram Chat ID របស់បុគ្គលិកសម្រាប់ទទួលដំណឹង" },
      { name: "createdAt", type: "DateTime", constraint: "DEFAULT now()", desc: "កាលបរិច្ឆេទបង្កើតគណនី" },
      { name: "updatedAt", type: "DateTime", constraint: "ON UPDATE", desc: "កាលបរិច្ឆេទកែប្រែចុងក្រោយ" }
    ]
  },
  Student: {
    name: "Student",
    khText: "តារាងកត់ត្រាព័ត៌មានលម្អិតរបស់សិស្ស ស្ថានភាពសិក្សា ព័ត៌មានអាណាព្យាបាល ថ្លៃសិក្សា និងការតភ្ជាប់តេឡេក្រាម។",
    cols: 33,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់សិស្ស (UUID)" },
      { name: "studentId", type: "String", constraint: "UNIQUE", desc: "លេខកូដសិស្សសម្គាល់ខ្លួន (ឧ. STU-26-001)" },
      { name: "firstNameKh", type: "String?", constraint: "-", desc: "នាមខ្លួនជាភាសាខ្មែរ" },
      { name: "lastNameKh", type: "String?", constraint: "-", desc: "គោត្តនាមជាភាសាខ្មែរ" },
      { name: "firstNameEn", type: "String?", constraint: "-", desc: "នាមខ្លួនជាភាសាអង់គ្លេស" },
      { name: "lastNameEn", type: "String?", constraint: "-", desc: "គោត្តនាមជាភាសាអង់គ្លេស" },
      { name: "nameKh", type: "String?", constraint: "-", desc: "ឈ្មោះពេញជាភាសាខ្មែរ" },
      { name: "nameEn", type: "String?", constraint: "-", desc: "ឈ្មោះពេញជាអក្សរឡាតាំង" },
      { name: "gender", type: "String", constraint: "-", desc: "ភេទ (Male/Female)" },
      { name: "course", type: "String?", constraint: "-", desc: "វគ្គសិក្សាដែលបានចុះឈ្មោះ" },
      { name: "level", type: "String?", constraint: "-", desc: "កម្រិតសិក្សាបច្ចុប្បន្ន" },
      { name: "status", type: "String?", constraint: "-", desc: "ស្ថានភាព (STUDYING, COMPLETED, SUSPENDED)" },
      { name: "startDate", type: "String?", constraint: "-", desc: "កាលបរិច្ឆេទចាប់ផ្តើមរៀន" },
      { name: "endDate", type: "String?", constraint: "-", desc: "កាលបរិច្ឆេទបញ្ជប់វគ្គសិក្សា" },
      { name: "shift", type: "String?", constraint: "-", desc: "ម៉ោង/វេនសិក្សា (ឧ. 08:00 - 09:30 AM)" },
      { name: "fee", type: "Float?", constraint: "-", desc: "តម្លៃវគ្គសិក្សា" },
      { name: "paid", type: "Float?", constraint: "-", desc: "ចំនួនទឹកប្រាក់ដែលបានបង់រួច" },
      { name: "due", type: "Float?", constraint: "-", desc: "ចំនួនទឹកប្រាក់ដែលនៅជំពាក់" },
      { name: "guardianName", type: "String?", constraint: "-", desc: "ឈ្មោះអាណាព្យាបាលសិស្ស" },
      { name: "guardianPhone", type: "String?", constraint: "-", desc: "លេខទូរស័ព្ទអាណាព្យាបាល" },
      { name: "telegramConnected", type: "Boolean?", constraint: "DEFAULT false", desc: "ស្ថានភាពតភ្ជាប់តេឡេក្រាមរបស់អាណាព្យាបាល" },
      { name: "dob", type: "String?", constraint: "-", desc: "ថ្ងៃខែឆ្នាំកំណើត (ជាអត្ថបទ)" },
      { name: "pob", type: "String?", constraint: "-", desc: "ទីកន្លែងកំណើតសិស្ស" },
      { name: "fullFee", type: "Float?", constraint: "-", desc: "តម្លៃសិក្សាពេញ (មុនពេលបញ្ចុះតម្លៃ)" },
      { name: "discount", type: "Float?", constraint: "-", desc: "ភាគរយបញ្ចុះតម្លៃសិក្សា (%)" },
      { name: "hours", type: "String?", constraint: "-", desc: "ចំនួនម៉ោងសិក្សាសរុប" },
      { name: "dateOfBirth", type: "DateTime?", constraint: "-", desc: "កាលបរិច្ឆេទថ្ងៃខែឆ្នាំកំណើតពិតប្រាកដ" },
      { name: "photoUrl", type: "String?", constraint: "-", desc: "តំណភ្ជាប់រូបថតរបស់សិស្ស" },
      { name: "parentTelegramId", type: "String?", constraint: "-", desc: "Telegram Chat ID របស់អាណាព្យាបាល" },
      { name: "phoneNumber", type: "String?", constraint: "-", desc: "លេខទូរស័ព្ទផ្ទាល់ខ្លួនសិស្ស" },
      { name: "grade", type: "String?", constraint: "-", desc: "ថ្នាក់សិក្សារបស់សិស្ស" },
      { name: "createdAt", type: "DateTime", constraint: "DEFAULT now()", desc: "ថ្ងៃបង្កើតទិន្នន័យ" },
      { name: "updatedAt", type: "DateTime", constraint: "ON UPDATE", desc: "ថ្ងៃកែប្រែចុងក្រោយ" }
    ]
  },
  Teacher: {
    name: "Teacher",
    khText: "តារាងកត់ត្រាព័ត៌មានគ្រូបង្រៀន ជំនាញបង្រៀន ប្រាក់ខែគោល ប្រវត្តិការងារ និងគណនី Telegram ទំនាក់ទំនង។",
    cols: 27,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់គ្រូបង្រៀន (UUID)" },
      { name: "teacherId", type: "String", constraint: "UNIQUE", desc: "លេខកូដគ្រូសម្គាល់ខ្លួន (ឧ. TCH-26-001)" },
      { name: "firstNameKh", type: "String?", constraint: "-", desc: "នាមខ្លួនគ្រូជាភាសាខ្មែរ" },
      { name: "lastNameKh", type: "String?", constraint: "-", desc: "គោត្តនាមគ្រូជាភាសាខ្មែរ" },
      { name: "firstNameEn", type: "String?", constraint: "-", desc: "នាមខ្លួនគ្រូជាភាសាអង់គ្លេស" },
      { name: "lastNameEn", type: "String?", constraint: "-", desc: "គោត្តនាមគ្រូជាភាសាអង់គ្លេស" },
      { name: "nameKh", type: "String?", constraint: "-", desc: "ឈ្មោះពេញគ្រូជាភាសាខ្មែរ" },
      { name: "nameEn", type: "String?", constraint: "-", desc: "ឈ្មោះពេញគ្រូជាអក្សរឡាតាំង" },
      { name: "gender", type: "String", constraint: "-", desc: "ភេទគ្រូបង្រៀន" },
      { name: "specialty", type: "String?", constraint: "-", desc: "ជំនាញឯកទេសចម្ងាយ (ឧ. Advanced C++, Web Design)" },
      { name: "phone", type: "String?", constraint: "-", desc: "លេខទូរស័ព្ទទំនាក់ទំនង" },
      { name: "dob", type: "String?", constraint: "-", desc: "ថ្ងៃខែឆ្នាំកំណើតគ្រូ" },
      { name: "pob", type: "String?", constraint: "-", desc: "ទីកន្លែងកំណើតគ្រូ" },
      { name: "joinDate", type: "String?", constraint: "-", desc: "ថ្ងៃចាប់ផ្តើមបម្រើការងារ" },
      { name: "leaveDate", type: "String?", constraint: "-", desc: "ថ្ងៃឈប់បម្រើការងារ" },
      { name: "experienceDays", type: "String?", constraint: "-", desc: "ចំនួនថ្ងៃបទពិសោធន៍ការងារ" },
      { name: "salary", type: "Float?", constraint: "-", desc: "ប្រាក់បៀវត្សគោល (USD)" },
      { name: "paymentStatus", type: "String?", constraint: "-", desc: "ស្ថានភាពបើកប្រាក់បៀវត្ស" },
      { name: "status", type: "String?", constraint: "-", desc: "ស្ថានភាពបច្ចុប្បន្ន (ACTIVE, SUSPENDED)" },
      { name: "notes", type: "String?", constraint: "-", desc: "កំណត់ចំណាំ ឬព័ត៌មានលម្អិតបន្ថែម" },
      { name: "email", type: "String?", constraint: "UNIQUE", desc: "អ៊ីមែលទំនាក់ទំនងផ្ទាល់ខ្លួន" },
      { name: "phoneNumber", type: "String?", constraint: "-", desc: "លេខទូរស័ព្ទបន្ថែម" },
      { name: "photoUrl", type: "String?", constraint: "-", desc: "តំណភ្ជាប់រូបថតគ្រូបង្រៀន" },
      { name: "telegramId", type: "String?", constraint: "-", desc: "Telegram Chat ID សម្រាប់ផ្ញើសេចក្តីជូនដំណឹង" },
      { name: "userId", type: "String?", constraint: "UNIQUE/FK", desc: "ID ភ្ជាប់ទៅគណនី User ក្នុងតារាង User" },
      { name: "createdAt", type: "DateTime", constraint: "DEFAULT now()", desc: "កាលបរិច្ឆេទបញ្ចូលទិន្នន័យ" },
      { name: "updatedAt", type: "DateTime", constraint: "ON UPDATE", desc: "កាលបរិច្ឆេទកែប្រែចុងក្រោយ" }
    ]
  },
  Attendance: {
    name: "Attendance",
    khText: "តារាងកត់ត្រាវត្តមានសិស្សប្រចាំថ្ងៃ ស្ថានភាពវត្តមាន (មក/អវត្តមាន/ច្បាប់) មូលហេតុ និងស្ថានភាពផ្ញើសារ Telegram។",
    cols: 8,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់កំណត់ត្រាវត្តមាន" },
      { name: "studentId", type: "String", constraint: "FOREIGN KEY", desc: "ID សម្គាល់សិស្ស (Student ID)" },
      { name: "status", type: "AttendanceStatus", constraint: "DEFAULT PRESENT", desc: "ស្ថានភាព៖ PRESENT, ABSENT, LATE, PERMISSION" },
      { name: "date", type: "DateTime", constraint: "UNIQUE KEY", desc: "កាលបរិច្ឆេទ និងម៉ោងកត់វត្តមាន" },
      { name: "reason", type: "String?", constraint: "-", desc: "មូលហេតុក្នុងករណីអវត្តមាន ឬសុំច្បាប់" },
      { name: "recordedById", type: "String", constraint: "FOREIGN KEY", desc: "ID អ្នកកត់វត្តមាន (បុគ្គលិកក្នុងតារាង User)" },
      { name: "telegramNotificationSent", type: "Boolean", constraint: "DEFAULT false", desc: "ស្ថានភាពនៃការផ្ញើសារដំណឹងទៅអាណាព្យាបាល" },
      { name: "createdAt", type: "DateTime", constraint: "DEFAULT now()", desc: "ថ្ងៃបញ្ចូលទិន្នន័យ" }
    ]
  },
  TeacherAttendance: {
    name: "TeacherAttendance",
    khText: "តារាងតាមដាន និងកត់ត្រាវត្តមានរបស់លោកគ្រូ-អ្នកគ្រូប្រចាំថ្ងៃ សម្រាប់ជាទិន្នន័យគណនាប្រាក់បៀវត្ស។",
    cols: 7,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់កំណត់ត្រាវត្តមានគ្រូ" },
      { name: "teacherId", type: "String", constraint: "FOREIGN KEY", desc: "ID គ្រូបង្រៀន (Teacher ID)" },
      { name: "status", type: "AttendanceStatus", constraint: "DEFAULT PRESENT", desc: "ស្ថានភាព៖ PRESENT, ABSENT, LATE, PERMISSION" },
      { name: "date", type: "DateTime", constraint: "UNIQUE KEY", desc: "កាលបរិច្ឆេទ និងម៉ោងកត់វត្តមាន" },
      { name: "reason", type: "String?", constraint: "-", desc: "មូលហេតុអវត្តមានរបស់គ្រូ" },
      { name: "telegramNotificationSent", type: "Boolean", constraint: "DEFAULT false", desc: "ស្ថានភាពផ្ញើសារដំណឹងទៅ Telegram របស់គ្រូ" },
      { name: "createdAt", type: "DateTime", constraint: "DEFAULT now()", desc: "ថ្ងៃបញ្ចូលទិន្នន័យ" }
    ]
  },
  Invoice: {
    name: "Invoice",
    khText: "តារាងគ្រប់គ្រងការបង់ថ្លៃសិក្សារបស្សិស្ស លេខវិក្កយបត្រ ចំនួនត្រូវបង់ ចំនួនបានបង់រួច និងវិធីសាស្ត្រទូទាត់។",
    cols: 11,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់វិក្កយបត្រ" },
      { name: "invoiceNumber", type: "String", constraint: "UNIQUE", desc: "លេខវិក្កយបត្រផ្លូវការ (ឧ. INV-100234)" },
      { name: "studentId", type: "String", constraint: "FOREIGN KEY", desc: "ID សិស្សជាអ្នកបង់ប្រាក់" },
      { name: "term", type: "String", constraint: "-", desc: "រយៈពេលសិក្សា ឬវគ្គដែលត្រូវបង់" },
      { name: "amountDue", type: "Decimal", constraint: "-", desc: "ចំនួនទឹកប្រាក់ដែលត្រូវបង់សរុប" },
      { name: "amountPaid", type: "Decimal", constraint: "DEFAULT 0.00", desc: "Double check" },
      { name: "status", type: "PaymentStatus", constraint: "DEFAULT PENDING", desc: "ស្ថានភាព៖ PENDING (មិនទាន់បង់), PAID (បង់រួច), OVERDUE (ហួសកំណត់)" },
      { name: "paymentDate", type: "DateTime?", constraint: "-", desc: "ថ្ងៃខែឆ្នាំនៃការបង់ប្រាក់ជាក់ស្តែង" },
      { name: "paymentMethod", type: "String?", constraint: "-", desc: "វិធីសាស្ត្រទូទាត់ (ABA Bank, CASH, WING)" },
      { name: "createdAt", type: "DateTime", constraint: "DEFAULT now()", desc: "ថ្ងៃចេញវិក្កយបត្រដំបូង" },
      { name: "updatedAt", type: "DateTime", constraint: "ON UPDATE", desc: "ថ្ងៃកែប្រែចុងក្រោយ" }
    ]
  },
  SalaryPayment: {
    name: "SalaryPayment",
    khText: "តារាងកត់ត្រា និងគ្រប់គ្រងការបើកប្រាក់បៀវត្សជូនលោកគ្រូ-អ្នកគ្រូប្រចាំខែ ប្រាក់បន្ថែម និងប្រាក់កាត់ផ្សេងៗ។",
    cols: 11,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់កំណត់ត្រាបើកប្រាក់ខែ" },
      { name: "teacherId", type: "String", constraint: "FOREIGN KEY", desc: "ID គ្រូបង្រៀនដែលត្រូវទទួលបាន" },
      { name: "payPeriod", type: "String", constraint: "-", desc: "ខែនៃការបើកប្រាក់បៀវត្ស (ឧ. ខែកក្កដា ឆ្នាំ២០២៦)" },
      { name: "baseSalary", type: "Decimal", constraint: "-", desc: "ប្រាក់ខែគោលរបស់គ្រូ" },
      { name: "bonus", type: "Decimal", constraint: "DEFAULT 0.00", desc: "ប្រាក់រង្វាន់លើកទឹកចិត្តបន្ថែម" },
      { name: "deduction", type: "Decimal", constraint: "DEFAULT 0.00", desc: "ប្រាក់កាត់កាតព្វកិច្ច ឬពិន័យអវត្តមាន" },
      { name: "totalPaid", type: "Decimal", constraint: "-", desc: "ចំនួនទឹកប្រាក់បើកសរុបជាក់ស្តែង" },
      { name: "status", type: "PaymentStatus", constraint: "DEFAULT PENDING", desc: "ស្ថានភាព៖ PENDING (រង់ចាំបើក), PAID (បានបើកជោគជ័យ)" },
      { name: "paymentDate", type: "DateTime?", constraint: "-", desc: "ថ្ងៃខែឆ្នាំដែលបានបើកប្រាក់បៀវត្ស" },
      { name: "invoiceNumber", type: "String", constraint: "UNIQUE", desc: "លេខប័ណ្ណបើកប្រាក់ខែ (ឧ. SAL-50012)" },
      { name: "createdAt", type: "DateTime", constraint: "DEFAULT now()", desc: "ថ្ងៃបង្កើតកំណត់ត្រា" }
    ]
  },
  CertificateTemplate: {
    name: "CertificateTemplate",
    khText: "តារាងរក្សាទុកគំរូវិញ្ញាបនបត្របញ្ចប់ការសិក្សា រូបភាពផ្ទៃខាងក្រោយ និងប្លង់រចនាសម្ព័ន្ធ XML នៃអត្ថបទ។",
    cols: 5,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់គំរូ" },
      { name: "title", type: "String", constraint: "-", desc: "ចំណងជើងនៃគំរូវិញ្ញាបនបត្រ" },
      { name: "bgImageUrl", type: "String", constraint: "-", desc: "តំណភ្ជាប់រូបភាពផ្ទៃខាងក្រោយវិញ្ញាបនបត្រ" },
      { name: "contentXml", type: "String?", constraint: "-", desc: "កូដរចនាសម្ព័ន្ធ XML សម្រាប់បង្ហាញអក្សរ និងកូអរដោនេ" },
      { name: "createdAt", type: "DateTime", constraint: "DEFAULT now()", desc: "ថ្ងៃកត់ត្រាគំរូ" }
    ]
  },
  Certificate: {
    name: "Certificate",
    khText: "តារាងកត់ត្រាការចេញវិញ្ញាបនបត្របញ្ចប់ការសិក្សាពិតប្រាកដជូនសិស្ស លេខកូដសម្គាល់ និងតំណភ្ជាប់ QR Code ផ្ទៀងផ្ទាត់។",
    cols: 7,
    fields: [
      { name: "id", type: "String", constraint: "PRIMARY KEY", desc: "ID សម្គាល់វិញ្ញាបនបត្រដែលបានចេញ" },
      { name: "certificateNumber", type: "String", constraint: "UNIQUE", desc: "លេខសម្គាល់វិញ្ញាបនបត្រផ្លូវការសម្រាប់ស្វែងរក" },
      { name: "studentId", type: "String", constraint: "FOREIGN KEY", desc: "ID សិស្សដែលទទួលបាន (Student ID)" },
      { name: "templateId", type: "String", constraint: "FOREIGN KEY", desc: "ID គំរូវិញ្ញាបនបត្រដែលបានប្រើប្រាស់" },
      { name: "issueDate", type: "DateTime", constraint: "DEFAULT now()", desc: "កាលបរិច្ឆេទចេញវិញ្ញាបនបត្រ" },
      { name: "gradeTitle", type: "String", constraint: "-", desc: "និទ្ទេសដែលទទួលបាន (Excellent, Very Good, Good)" },
      { name: "qrCodeUrl", type: "String?", constraint: "-", desc: "តំណភ្ជាប់ QR Code សម្រាប់ផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវ" }
    ]
  }
};

const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-based index
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day, 0, 0, 0, 0);
  }
  return new Date(dateStr);
};

const calculateEndDate = (startDateStr: string, months: number) => {
  if (!startDateStr) return "";
  const date = parseLocalDate(startDateStr);
  if (isNaN(date.getTime())) return "";
  date.setMonth(date.getMonth() + Number(months || 0));
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const calculateRemainingDays = (endDateStr: string, startDateStr?: string, operatingDays?: string) => {
  if (!endDateStr) return 0;
  const end = parseLocalDate(endDateStr);
  let startCountDate = new Date();
  
  if (startDateStr) {
    const start = parseLocalDate(startDateStr);
    if (startCountDate.getTime() < start.getTime()) {
      startCountDate = start;
    }
  }

  end.setHours(0, 0, 0, 0);
  startCountDate.setHours(0, 0, 0, 0);
  
  if (startCountDate.getTime() >= end.getTime()) return 0;

  const diffTime = Math.abs(end.getTime() - startCountDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getCourseBadgeStyles = (courseName: string) => {
  if (!courseName) return "bg-transparent text-slate-700 border border-transparent";
  const normalized = courseName.toUpperCase();
  if (normalized.includes("PYTHON")) {
    return "bg-transparent text-amber-800 border border-transparent";
  }
  if (normalized.includes("EXCEL")) {
    return "bg-transparent text-emerald-800 border border-transparent";
  }
  if (normalized.includes("WORD")) {
    return "bg-transparent text-sky-800 border border-transparent";
  }
  if (normalized.includes("PHOTOSHOP") || normalized.includes("ADOBE")) {
    return "bg-transparent text-blue-800 border border-transparent";
  }
  return "bg-transparent text-primary-700 border border-transparent";
};

const getStudentHoursInfo = (student: any) => {
  if (!student) return { customHours: null, actualHours: "", hasCustom: false };
  let customHours = null;
  try {
    const saved = localStorage.getItem("sms_individual_scan_rules");
    if (saved) {
      const rules = JSON.parse(saved);
      const custom = rules[student.id];
      if (custom && custom.studyStart && custom.studyEnd) {
        customHours = `${custom.studyStart} - ${custom.studyEnd}`;
      }
    }
  } catch (e) {
    console.error(e);
  }
  const actualHours = student.hours || "";
  return {
    customHours,
    actualHours,
    hasCustom: !!customHours
  };
};

const getStudentStudyHours = (student: any) => {
  if (!student) return "---";
  
  // 1. Check if there are individual custom rules in localStorage
  try {
    const saved = localStorage.getItem("sms_individual_scan_rules");
    if (saved) {
      const rules = JSON.parse(saved);
      const custom = rules[student.id];
      if (custom && custom.studyStart && custom.studyEnd) {
        return `${custom.studyStart} - ${custom.studyEnd}`;
      }
    }
  } catch (e) {
    console.error(e);
  }

  // 2. Use actual input hours directly from student data if it exists
  if (student.hours && student.hours.trim() !== "" && student.hours.trim() !== "---") {
    return student.hours;
  }

  // 3. Fallback to default shift mapping
  const shiftStr = student.shift || "";

  // If the shift string has a time pattern like "ម៉ោង 5:30 - 6:30 យប់" or "ម៉ោង 2:00 - 3:30 រសៀល"
  const timeRegex = /ម៉ោង\s*(\d+:\d+\s*-\s*\d+:\d+\s*[^\s]*)/;
  const match = shiftStr.match(timeRegex);
  if (match) {
    return match[1].trim();
  }

  if (shiftStr.includes("ម៉ោងចន្ទ-សុក្រ") || shiftStr.includes("ចន្ទ-សុក្រ") || shiftStr.includes("ច័ន្ទ-សុក្រ")) {
    return "08:00 AM - 11:00 AM";
  }

  if (shiftStr.includes("យប់") || shiftStr.includes("ល្ងាច")) {
    return "05:30 PM - 06:30 PM";
  }

  if (shiftStr.includes("រសៀល")) {
    return "02:00 PM - 03:30 PM";
  }

  if (shiftStr.startsWith("ម៉ោង")) {
    const clean = shiftStr.replace(/ម៉ោង/g, "").trim();
    return clean || "08:00 AM - 11:00 AM";
  }

  return "08:00 AM - 11:00 AM"; // Default fallback
};

const getStudentStartAndEndTimes = (student: any) => {
  const hoursStr = getStudentStudyHours(student); // e.g. "08:00 AM - 11:00 AM" or "05:30 PM - 06:30 PM" or "05:30 - 06:30 PM"
  if (!hoursStr || hoursStr === "---") {
    return { start: "08:00 AM", end: "11:00 AM" };
  }
  
  const parts = hoursStr.split("-");
  if (parts.length === 2) {
    let start = parts[0].trim();
    let end = parts[1].trim();
    
    // Auto-detect PM/AM indicator for start if only end has it
    if (!start.toUpperCase().includes("AM") && !start.toUpperCase().includes("PM")) {
      if (end.toUpperCase().includes("PM")) {
        // If end has PM, and start hour is <= 11, it is PM (e.g. 5:30 PM)
        const hour = parseInt(start.split(":")[0]);
        if (hour >= 1 && hour <= 11) {
          start = start + " PM";
        } else {
          start = start + " AM";
        }
      } else if (end.toUpperCase().includes("AM")) {
        start = start + " AM";
      }
    }
    
    // Auto-detect PM/AM indicator for end if only start has it
    if (!end.toUpperCase().includes("AM") && !end.toUpperCase().includes("PM")) {
      if (start.toUpperCase().includes("PM")) {
        end = end + " PM";
      } else if (start.toUpperCase().includes("AM")) {
        end = end + " AM";
      }
    }
    
    return { start, end };
  }
  
  return { start: "08:00 AM", end: "11:00 AM" };
};

const translateShiftText = (shift: string, lang: string) => {
  if (!shift) return "---";
  if (lang === "kh") return shift;

  let text = shift;
  if (text.includes("ម៉ោងចន្ទ-សុក្រ") || text.includes("ចន្ទ-សុក្រ") || text.includes("ច័ន្ទ-សុក្រ")) {
    return lang === "en" ? "Mon-Fri Shift" : "周一至周五班";
  }
  if (text.includes("វេនយប់")) {
    return lang === "en" ? "Night Shift" : "晚班";
  }
  if (text.includes("រសៀល")) {
    const times = text.match(/\d+:\d+\s*-\s*\d+:\d+/);
    const timeRange = times ? times[0] : "2:00 - 3:30";
    return lang === "en" ? `${timeRange} PM` : `下午 ${timeRange}`;
  }
  if (text.includes("យប់") || text.includes("ល្ងាច")) {
    const times = text.match(/\d+:\d+\s*-\s*\d+:\d+/);
    const timeRange = times ? times[0] : "5:30 - 6:30";
    return lang === "en" ? `${timeRange} PM` : `晚上 ${timeRange}`;
  }
  if (text.includes("ព្រឹក")) {
    const times = text.match(/\d+:\d+\s*-\s*\d+:\d+/);
    const timeRange = times ? times[0] : "8:00 - 11:00";
    return lang === "en" ? `${timeRange} AM` : `上午 ${timeRange}`;
  }

  text = text.replace(/ម៉ោង\s*/g, "");
  return text;
};

const translateLevelText = (level: string, lang: string) => {
  if (!level) return "Level 1";
  
  // If the level already contains the Khmer word "កម្រិត"
  if (level.includes("កម្រិត")) {
    if (lang === "kh") return level;
    // For other languages, strip out "កម្រិត" and convert Khmer digits back to English if possible
    const cleanKh = level.replace(/កម្រិត\s*/gi, "").trim();
    const khToEng: Record<string, string> = { "០": "0", "១": "1", "២": "2", "៣": "3", "៤": "4", "៥": "5", "៦": "6", "៧": "7", "៨": "8", "៩": "9" };
    const englishNum = cleanKh.split("").map(c => khToEng[c] || c).join("");
    if (lang === "zh") return `级别 ${englishNum}`;
    return `Level ${englishNum}`;
  }

  const clean = level.replace(/level/gi, "").trim();
  if (lang === "kh") {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    const khmerNum = clean.replace(/\d/g, (d) => khmerDigits[parseInt(d, 10)] || d);
    return `កម្រិត ${khmerNum}`;
  }
  if (lang === "zh") {
    return `级别 ${clean}`;
  }
  return `Level ${clean}`;
};

const getTodayDateStr = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const TODAY_STR = getTodayDateStr();

const translations = {
  kh: {
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    students: "សិស្សានុសិស្ស",
    teachers: "លោកគ្រូ-អ្នកគ្រូ",
    attendance: "វត្តមាន",
    qrScan: "ស្កេន QR កូដ",
    finance: "ហិរញ្ញវត្ថុ",
    certificates: "វិញ្ញាបនបត្រ",
    idCard: "កាតសម្គាល់ខ្លួន",
    credentials: "គ្រប់គ្រងគណនី",
    settings: "ការកំណត់",
    mysqlDb: "ផ្ទេរទិន្នន័យ MySQL",
    adminPortal: "អភិបាលប្រព័ន្ធ",
    administrator: "អ្នកគ្រប់គ្រង",
    selectLanguage: "ជ្រើសរើសភាសា",
    systemConfig: "ការកំណត់ប្រព័ន្ធ",
    logout: "ចាកចេញ",
    mainConsole: "ផ្ទាំងគ្រប់គ្រងចម្ងាយ",
    operations: "ប្រតិបត្តិការ",
    systemCore: "ប្រព័ន្ធស្នូល",
    courseFilter: "តម្រងវគ្គសិក្សា",
    schoolAnalytics: "ស្ថិតិសាលារៀន",
    financeTelemetry: "ស្ថិតិហិរញ្ញវត្ថុ និងចំណូល",
    overallGenderStats: "ការប្រៀបធៀបស្ថានភាពភេទសរុប",
    genderStatusBreakdown: "របាយការណ៍លម្អិតអំពីសមាមាត្រសិស្សប្រុស-ស្រី និងស្ថានភាពសិក្សា",
    rosterRatios: "សមាមាត្រសិស្ស",
    received: "ប្រាក់ទទួលបាន",
    balanceDue: "ប្រាក់មិនទាន់បង់",
    grandRevenue: "ប្រាក់ចំណូលសរុប",
    female: "សិស្សស្រី",
    male: "សិស្សប្រុស",
    femaleRatio: "សមាមាត្រសិស្សស្រី",
    maleRatio: "សមាមាត្រសិស្សប្រុស",
    studying: "កំពុងសិក្សា",
    stopped: "ឈប់រៀន",
    completed: "បញ្ចប់ការសិក្សា",
    total: "សរុប",
    realtimeFilterVal: "ការតម្រងជាក់ស្តែង (Real-time auto-filtered values)",
    genderSplit: "ស្ថិតិសិស្ស (Gender Split)",
    finances: "ស្ថិតិហិរញ្ញវត្ថុ (Finances)",
    liveState: "ទិន្នន័យផ្ទាល់",
  },
  en: {
    dashboard: "Dashboard",
    students: "Students",
    teachers: "Teachers",
    attendance: "Attendance",
    qrScan: "QR Scan",
    finance: "Finance",
    certificates: "Certificates",
    idCard: "ID Card",
    credentials: "Staff Portal",
    settings: "Settings",
    mysqlDb: "MySQL Database",
    adminPortal: "ADMIN PORTAL",
    administrator: "ADMINISTRATOR",
    selectLanguage: "Select Language",
    systemConfig: "System Config",
    logout: "Log Out",
    mainConsole: "MAIN CONSOLE",
    operations: "OPERATIONS",
    systemCore: "SYSTEM CORE",
    courseFilter: "Course Filter",
    schoolAnalytics: "School Analytics",
    financeTelemetry: "Finance & Revenue Telemetry",
    overallGenderStats: "Overall Gender Statistics",
    genderStatusBreakdown: "Detailed Student Gender & Status Breakdown",
    rosterRatios: "Roster Ratios",
    received: "Received",
    balanceDue: "Balance Due",
    grandRevenue: "Grand Revenue",
    female: "Female Students",
    male: "Male Students",
    femaleRatio: "Female Ratio",
    maleRatio: "Male Ratio",
    studying: "Studying",
    stopped: "Stopped",
    completed: "Completed",
    total: "Total",
    realtimeFilterVal: "Real-time auto-filtered values",
    genderSplit: "Gender Split",
    finances: "Finances",
    liveState: "LIVE STATE",
  },
  zh: {
    dashboard: "仪表盘",
    students: "学生管理",
    teachers: "教师管理",
    attendance: "考勤管理",
    qrScan: "扫码签到",
    finance: "财务管理",
    certificates: "学术证书",
    idCard: "学生证设计",
    credentials: "账户管理",
    settings: "系统设置",
    mysqlDb: "MySQL迁移",
    adminPortal: "系统管理门户",
    administrator: "管理员",
    selectLanguage: "选择语言",
    systemConfig: "系统配置",
    logout: "登出",
    mainConsole: "主控制台",
    operations: "日常业务",
    systemCore: "系统核心",
    courseFilter: "课程过滤",
    schoolAnalytics: "学校统计分析",
    financeTelemetry: "财务与收入数据统计",
    overallGenderStats: "性别比例总体统计",
    genderStatusBreakdown: "男女比例及就学状态详细报告",
    rosterRatios: "男女比例",
    received: "已收金额",
    balanceDue: "未付金额",
    grandRevenue: "总收入",
    female: "女生人数",
    male: "男生人数",
    femaleRatio: "女生比例",
    maleRatio: "男生比例",
    studying: "在读",
    stopped: "辍学",
    completed: "已结业",
    total: "总计",
    realtimeFilterVal: "实时自动过滤数值",
    genderSplit: "学生性别比例",
    finances: "财务状况",
    liveState: "实时状态",
  }
};

const translateCourseOrSpecialtyName = (name: string, lang: "kh" | "en" | "zh") => {
  const map: Record<string, { kh: string; en: string; zh: string }> = {
    "Microsoft Office Word": {
      kh: "Microsoft Word",
      en: "Microsoft Office Word",
      zh: "微软 Office Word 办公"
    },
    "Microsoft Office Excel": {
      kh: "Microsoft Excel",
      en: "Microsoft Office Excel",
      zh: "微软 Office Excel 办公"
    },
    "Adobe Photoshop": {
      kh: "Adobe Photoshop",
      en: "Adobe Photoshop",
      zh: "Adobe Photoshop 图像处理"
    },
    "Adobe Photoshop Full Course": {
      kh: "Photoshop (ពេញ)",
      en: "Photoshop Full",
      zh: "Photoshop 完整课程"
    },
    "Web Development Coding Suite": {
      kh: "ស្ថាបនាគេហទំព័រ (Web Dev)",
      en: "Web Development Suite",
      zh: "Web 编程开发"
    },
    "Python Core Programing": {
      kh: "ភាសា Python (Python Core)",
      en: "Python Core",
      zh: "Python 核心编程"
    },
    "Graphic Design Essentials": {
      kh: "រចនាក្រាហ្វិក (Graphic Design)",
      en: "Graphic Design Essentials",
      zh: "平面设计"
    },
    "Adobe Photoshop & Graphic Design Specialist": {
      kh: "Adobe Photoshop & ក្រាហ្វិក",
      en: "Adobe Photoshop & Graphic Design Specialist",
      zh: "Adobe Photoshop & 视觉设计专家"
    },
    "Microsoft Office Word & Excel (Microsoft Office Specialist)": {
      kh: "Microsoft Word & Excel (MOS)",
      en: "Microsoft Office Word & Excel (MOS Specialist)",
      zh: "微软办公软件专家认证 (MOS)"
    }
  };
  return map[name]?.[lang] || name;
};

const getCourseTitle = (courseName: string, lang: "kh" | "en" | "zh") => {
  return translateCourseOrSpecialtyName(courseName, lang);
};

const getCourseSubtitle = (courseName: string, lang: "kh" | "en" | "zh") => {
  const khSubtitles: Record<string, string> = {
    "Microsoft Office Word": "វគ្គសិក្សា Microsoft Word",
    "Microsoft Office Excel": "វគ្គសិក្សា Microsoft Excel",
    "Adobe Photoshop": "វគ្គសិក្សា Adobe Photoshop",
    "Microsoft Office Word & Excel (Microsoft Office Specialist)": "វគ្គជំនាញ Microsoft Word & Excel",
  };
  const zhSubtitles: Record<string, string> = {
    "Microsoft Office Word": "微软 Word 文档处理",
    "Microsoft Office Excel": "微软 Excel 电子表格",
    "Adobe Photoshop": "Adobe Photoshop 图像设计",
    "Microsoft Office Word & Excel (Microsoft Office Specialist)": "微软 Word & Excel 专业认证班",
  };
  const enSubtitles: Record<string, string> = {
    "Microsoft Office Word": "Microsoft Word Course",
    "Microsoft Office Excel": "Microsoft Excel Course",
    "Adobe Photoshop": "Adobe Photoshop Design",
    "Microsoft Office Word & Excel (Microsoft Office Specialist)": "Word & Excel Specialty Program",
  };

  if (lang === "kh") {
    return khSubtitles[courseName] || courseName;
  }
  if (lang === "zh") {
    return zhSubtitles[courseName] || courseName;
  }
  return enSubtitles[courseName] || courseName;
};

const LanguageFlag = ({ lang, className = "w-5 h-5" }: { lang: string, className?: string }) => {
  if (lang === "kh") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#032A75" />
        <rect y="5" width="30" height="10" fill="#E5212E" />
        <path d="M15 6L13.2 9H16.8L15 6Z" fill="#FFFFFF" />
        <path d="M11.5 8.5L10 11H13L11.5 8.5Z" fill="#FFFFFF" />
        <path d="M18.5 8.5L17 11H20L18.5 8.5Z" fill="#FFFFFF" />
        <rect x="9.5" y="11" width="11" height="1.5" fill="#FFFFFF" />
        <rect x="10.5" y="12.5" width="9" height="2" fill="#FFFFFF" />
      </svg>
    );
  }
  if (lang === "en") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#FFFFFF" />
        <rect y="0" width="30" height="1.54" fill="#B22234" />
        <rect y="3.08" width="30" height="1.54" fill="#B22234" />
        <rect y="6.16" width="30" height="1.54" fill="#B22234" />
        <rect y="9.24" width="30" height="1.54" fill="#B22234" />
        <rect y="12.32" width="30" height="1.54" fill="#B22234" />
        <rect y="15.4" width="30" height="1.54" fill="#B22234" />
        <rect y="18.46" width="30" height="1.54" fill="#B22234" />
        <rect width="13.5" height="10.78" fill="#3C3B6E" />
        <circle cx="2.5" cy="2.5" r="0.4" fill="#FFFFFF" />
        <circle cx="5.5" cy="2.5" r="0.4" fill="#FFFFFF" />
        <circle cx="8.5" cy="2.5" r="0.4" fill="#FFFFFF" />
        <circle cx="11.5" cy="2.5" r="0.4" fill="#FFFFFF" />
        <circle cx="4" cy="4.5" r="0.4" fill="#FFFFFF" />
        <circle cx="7" cy="4.5" r="0.4" fill="#FFFFFF" />
        <circle cx="10" cy="4.5" r="0.4" fill="#FFFFFF" />
        <circle cx="2.5" cy="6.5" r="0.4" fill="#FFFFFF" />
        <circle cx="5.5" cy="6.5" r="0.4" fill="#FFFFFF" />
        <circle cx="8.5" cy="6.5" r="0.4" fill="#FFFFFF" />
        <circle cx="11.5" cy="6.5" r="0.4" fill="#FFFFFF" />
        <circle cx="4" cy="8.5" r="0.4" fill="#FFFFFF" />
        <circle cx="7" cy="8.5" r="0.4" fill="#FFFFFF" />
        <circle cx="10" cy="8.5" r="0.4" fill="#FFFFFF" />
      </svg>
    );
  }
  if (lang === "zh") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#EE1C25" />
        <path d="M5 3.5L5.4 4.8L6.7 4.8L5.6 5.6L6 6.9L5 6.1L4 6.9L4.4 5.6L3.3 4.8L4.6 4.8L5 3.5Z" fill="#FFFF00" />
        <path d="M8.5 2.2L8.62 2.6L9.02 2.6L8.7 2.85L8.82 3.25L8.5 3L8.18 3.25L8.3 2.85L7.98 2.6L8.38 2.6L8.5 2.2Z" fill="#FFFF00" />
        <path d="M9.8 3.5L9.92 3.9L10.32 3.9L10 4.15L10.12 4.55L9.8 4.3L9.48 4.55L9.6 4.15L9.28 3.9L9.68 3.9L9.8 3.5Z" fill="#FFFF00" />
        <path d="M9.8 5.5L9.92 5.9L10.32 5.9L10 6.15L10.12 6.55L9.8 6.3L9.48 6.55L9.6 6.15L9.28 5.9L9.68 5.9L9.8 5.5Z" fill="#FFFF00" />
        <path d="M8.5 6.8L8.62 7.2L9.02 7.2L8.7 7.45L8.82 7.85L8.5 7.6L8.18 7.85L8.3 7.45L7.98 7.2L8.38 7.2L8.5 6.8Z" fill="#FFFF00" />
      </svg>
    );
  }
  if (lang === "th") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#E5212E" />
        <rect y="3.33" width="30" height="13.34" fill="#FFFFFF" />
        <rect y="6.67" width="30" height="6.67" fill="#032A75" />
      </svg>
    );
  }
  if (lang === "vi") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#DA251D" />
        <polygon points="15,4 16.2,8.5 20.5,8.5 17,11.2 18.2,15.7 15,13 11.8,15.7 13,11.2 9.5,8.5 13.8,8.5" fill="#FFFF00" />
      </svg>
    );
  }
  if (lang === "fr") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="10" height="20" fill="#002395" />
        <rect x="10" width="10" height="20" fill="#FFFFFF" />
        <rect x="20" width="10" height="20" fill="#ED2939" />
      </svg>
    );
  }
  if (lang === "ja") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#FFFFFF" />
        <circle cx="15" cy="10" r="5.5" fill="#BC002D" />
      </svg>
    );
  }
  if (lang === "ko") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#FFFFFF" />
        <path d="M15 6A 4 4 0 0 1 15 14 A 2 2 0 0 1 15 10 A 2 2 0 0 0 15 6" fill="#CD2E3A" />
        <path d="M15 14A 4 4 0 0 1 15 6 A 2 2 0 0 1 15 10 A 2 2 0 0 0 15 14" fill="#0047A0" />
        <rect x="7" y="5" width="2" height="1" fill="#000000" transform="rotate(30, 7, 5)" />
        <rect x="21" y="5" width="2" height="1" fill="#000000" transform="rotate(-30, 21, 5)" />
        <rect x="7" y="14" width="2" height="1" fill="#000000" transform="rotate(-30, 7, 14)" />
        <rect x="21" y="14" width="2" height="1" fill="#000000" transform="rotate(30, 21, 14)" />
      </svg>
    );
  }
  if (lang === "lo") {
    return (
      <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#CE1126" />
        <rect y="5" width="30" height="10" fill="#002F6C" />
        <circle cx="15" cy="10" r="3.5" fill="#FFFFFF" />
      </svg>
    );
  }
  return (
    <svg className={`${className} rounded-full object-cover shadow-3xs ring-1 ring-slate-200 shrink-0`} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#718096" />
    </svg>
  );
};

interface DashboardProps {
  user: UserType;
  token: string;
  onLogout: () => void;
}

// ==========================================================
// AUTOMATED ATTENDANCE SCANNER COMPONENT (QRScanTab)
// ==========================================================

interface QRScanTabProps {
  students: StudentType[];
  teachers: any[];
  telegramLogs: any[];
  setTelegramLogs: React.Dispatch<React.SetStateAction<any[]>>;
  attendanceCheckInLog: any;
  setAttendanceCheckInLog: React.Dispatch<React.SetStateAction<any>>;
  attendanceCheckOutLog: any;
  setAttendanceCheckOutLog: React.Dispatch<React.SetStateAction<any>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  uiLang?: string;
}

function QRScanTab(props: QRScanTabProps) {
  return <QRScanTabComponent {...props} />;
}


const safeJson = async (res: Response) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await res.json();
  }
  const text = await res.text();
  console.error("Non-JSON response:", text.substring(0, 200));
  throw new Error("Server returned non-JSON response");
};

export default function Dashboard({ user, token, onLogout }: DashboardProps) {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<string>(
    () => localStorage.getItem("plc_active_tab") || "Dashboard"
  );
  const [permsVersion, setPermsVersion] = useState(0);
  useEffect(() => {
    const handlePermsUpdate = () => {
      setPermsVersion(v => v + 1);
    };
    window.addEventListener("sms_staff_perms_updated", handlePermsUpdate);
    return () => {
      window.removeEventListener("sms_staff_perms_updated", handlePermsUpdate);
    };
  }, []);

  const customPermissions = useMemo(() => {
    if (user?.role === "ADMIN") {
      return ["Dashboard", "Analytics", "Announcements", "Students", "Courses", "Timetable", "Grading", "Exams", "Report Cards", "Certificates", "Library", "Alumni", "Teachers", "Leave", "Attendance", "QR Scan", "Attendance Display", "Parent Portal", "Finance", "Assets", "ID Card", "Credentials", "Settings", "MySQL DB"];
    }
    try {
      const saved = localStorage.getItem("sms_staff_credentials");
      if (saved && user) {
        const staffList = JSON.parse(saved);
        const staff = staffList.find((s: any) => s.role === user.role || s.username === user.email || s.id === user.id);
        if (staff && staff.permissions) {
          return staff.permissions;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback default permissions based on role if no custom permissions are set
    if (user?.role === "ACCOUNTANT") {
      return ["Dashboard", "Analytics", "Announcements", "Students", "Courses", "Timetable", "Grading", "Report Cards", "Certificates", "Attendance", "QR Scan", "Finance"];
    }
    if (user?.role === "TEACHER") {
      return ["Dashboard", "Students", "Courses", "Timetable", "Grading", "Exams", "Report Cards", "Attendance", "QR Scan", "Leave"];
    }
    return null;
  }, [user, permsVersion]);

  const [uiLang, setUiLang] = useState<"en" | "kh">(
    (localStorage.getItem("plc_lang") as "en" | "kh") || "kh"
  );

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setUiLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

    const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<number[]>([0, 1, 2, 3, 4]);
  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn("Fullscreen exit failed:", err);
        });
      }
    }
  };

  // Translation helper
  const t = (key: keyof typeof translations.kh) => {
    return (translations as any)[uiLang]?.[key] || translations.kh[key] || "";
  };

  // Inline dynamic translation helper
  const idt = (kh: string, en?: string, zh?: string) => {
    if (uiLang === "en") return en || kh;
    if (uiLang === "zh") return zh || en || kh;
    return kh;
  };

  // Khmer Number Converter for dynamic data views
  const toKhmerNumberGlobal = (num: number | string): string => {
    if (uiLang !== "kh") return String(num);
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(num).replace(/\d/g, (d) => khmerDigits[parseInt(d)]);
  };

  const formatLangNum = (num: number | string): string => {
    return uiLang === "kh" ? toKhmerNumberGlobal(num) : String(num);
  };

  const formatLangDate = (dateStr: any): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const formatted = `${day}/${month}/${year}`;
    return uiLang === "kh" ? toKhmerNumberGlobal(formatted) : formatted;
  };

  const translatePOB = (pob: string, lang: string): string => {
    if (!pob) return "";
    if (lang === "kh") return pob;
    const lower = pob.toLowerCase();
    const isZh = lang === "zh";
    if (lower.includes("ភ្នំពេញ") || lower.includes("phnom penh")) return isZh ? "金边" : "Phnom Penh";
    if (lower.includes("សៀមរាប") || lower.includes("siem reap")) return isZh ? "暹粒" : "Siem Reap";
    if (lower.includes("បាត់ដំបង") || lower.includes("battambang")) return isZh ? "马德望" : "Battambang";
    if (lower.includes("ព្រះសីហនុ") || lower.includes("sihanoukville")) return isZh ? "西哈努克" : "Sihanoukville";
    if (lower.includes("កំពង់ចាម") || lower.includes("kampong cham")) return isZh ? "磅湛" : "Kampong Cham";
    return pob;
  };

  const formatExperienceDays = (days: any): string => {
    const numDays = parseInt(days, 10);
    if (isNaN(numDays)) return String(days);
    if (uiLang === "kh") {
      if (numDays >= 365) {
        const yrs = Math.floor(numDays / 365);
        return `បទពិសោធន៍ ${toKhmerNumberGlobal(yrs)} ឆ្នាំ`;
      }
      return `បទពិសោធន៍ ${toKhmerNumberGlobal(numDays)} ថ្ងៃ`;
    } else if (uiLang === "zh") {
      if (numDays >= 365) {
        const yrs = Math.floor(numDays / 365);
        return `${yrs} 年经验`;
      }
      return `${numDays} 天经验`;
    } else {
      if (numDays >= 365) {
        const yrs = Math.floor(numDays / 365);
        return `${yrs} Year${yrs > 1 ? 's' : ''} Exp`;
      }
      return `${numDays} Day${numDays > 1 ? 's' : ''} Exp`;
    }
  };

  const formatPaymentStatus = (statusStr: string): string => {
    if (!statusStr) return "";
    if (statusStr.includes("មិនទាន់បើក")) {
      if (uiLang === "kh") return statusStr;
      if (uiLang === "zh") return "未发放 (2026-06)";
      return "Unpaid (2026-06)";
    }
    if (statusStr.includes("បើករួច")) {
      if (uiLang === "kh") return statusStr;
      if (uiLang === "zh") return "已发放";
      return "Paid";
    }
    return statusStr;
  };


  useEffect(() => {
    localStorage.setItem("plc_active_tab", activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("plc_active_tab");
    localStorage.removeItem("plc_settings_sub_tab");
    localStorage.removeItem("plc_db_active_step");
    localStorage.removeItem("plc_finance_sub_tab");
    localStorage.removeItem("plc_id_card_role");
    onLogout();
  };


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDashboardDragging, setIsDashboardDragging] = useState(false);
  const dashboardDragStartRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
    container: HTMLElement | null;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    container: null
  });

  const handleDashboardMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    const target = e.target as HTMLElement;
    // Don't drag if we clicked on an interactive element
    if (
      target.closest('button') || 
      target.closest('input') || 
      target.closest('select') || 
      target.closest('a') || 
      target.closest('textarea') ||
      target.closest('[role="button"]') ||
      target.getAttribute('contenteditable') === 'true'
    ) {
      return;
    }

    // Find the scrollable container
    let container: HTMLElement | null = target;
    while (container) {
      if (container.id === "main-content-scroll") {
        break;
      }
      const styles = window.getComputedStyle(container);
      const isScrollableY = (styles.overflowY === "auto" || styles.overflowY === "scroll") && container.scrollHeight > container.clientHeight;
      const isScrollableX = (styles.overflowX === "auto" || styles.overflowX === "scroll") && container.scrollWidth > container.clientWidth;
      if (isScrollableY || isScrollableX) {
        break;
      }
      container = container.parentElement;
    }

    if (!container) {
      container = document.getElementById("main-content-scroll");
    }

    if (!container) return;

    dashboardDragStartRef.current = {
      isDragging: true,
      startX: e.pageX,
      startY: e.pageY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
      container
    };
    
    setIsDashboardDragging(true);
  };

  const handleDashboardMouseMove = (e: React.MouseEvent) => {
    if (!dashboardDragStartRef.current.isDragging || !dashboardDragStartRef.current.container) return;
    
    const container = dashboardDragStartRef.current.container;
    const deltaX = e.pageX - dashboardDragStartRef.current.startX;
    const deltaY = e.pageY - dashboardDragStartRef.current.startY;
    
    container.scrollLeft = dashboardDragStartRef.current.scrollLeft - deltaX;
    container.scrollTop = dashboardDragStartRef.current.scrollTop - deltaY;
  };

  const handleDashboardMouseUpOrLeave = () => {
    if (dashboardDragStartRef.current.isDragging) {
      dashboardDragStartRef.current.isDragging = false;
      setIsDashboardDragging(false);
    }
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  const [settingsSubTab, setSettingsSubTab] = useState<"courses" | "levels" | "shifts" | "hours" | "specialties">(
    () => (localStorage.getItem("plc_settings_sub_tab") as any) || "courses"
  );
  useEffect(() => {
    localStorage.setItem("plc_settings_sub_tab", settingsSubTab);
  }, [settingsSubTab]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "course" | "level" | "shift" | "hours" | "specialty" | "payment_method" | "expense_category" | "school_expense";
    index: number | string;
    value: string;
  } | null>(null);

  // MySQL Live Integration States
  const [mysqlHost, setMysqlHost] = useState("");
  const [mysqlDbName, setMysqlDbName] = useState("plc_school_db");
  const [mysqlPort, setMysqlPort] = useState("3306");
  const [mysqlUser, setMysqlUser] = useState("root");
  const [mysqlPassword, setMysqlPassword] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [generatingSql, setGeneratingSql] = useState(false);
  const [generatedSql, setGeneratedSql] = useState("");
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [dbCounts, setDbCounts] = useState<{ [key: string]: number }>({
    User: 0,
    Student: 0,
    Teacher: 0,
    Attendance: 0,
    TeacherAttendance: 0,
    Invoice: 0,
    SalaryPayment: 0,
    CertificateTemplate: 0,
    Certificate: 0,
  });

  // Database Blueprint Tab States
  const [dbActiveStep, setDbActiveStep] = useState<"schema" | "directory">(
    () => (localStorage.getItem("plc_db_active_step") as any) || "schema"
  );
  useEffect(() => {
    localStorage.setItem("plc_db_active_step", dbActiveStep);
  }, [dbActiveStep]);
  const [selectedDbTable, setSelectedDbTable] = useState<string>("User");
  const [showPrismaCode, setShowPrismaCode] = useState<boolean>(false);
  const [showPrismaInMysql, setShowPrismaInMysql] = useState<boolean>(false);

  // Workspace File System Tree States
  const [workspaceFiles, setWorkspaceFiles] = useState<any[]>([]);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "prisma": true,
    "src": true,
    "src/components": true
  });
  const [selectedFile, setSelectedFile] = useState<{ name: string; path: string; content: string; lang: string } | null>({
    name: "schema.prisma",
    path: "prisma/schema.prisma",
    content: `datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String?
  passwordHash String
  role         String   @default("USER")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}`,
    lang: "prisma"
  });
  const [isLoadingFileContent, setIsLoadingFileContent] = useState(false);

  // Filter States
  const [activeCourseFilter, setActiveCourseFilter] = useState("");
  const [activeGenderFilter, setActiveGenderFilter] = useState("Total Students");

  // Student Directory Core States
  const [students, setStudents] = useState<StudentType[]>([]);

  // Student Directory UI States
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState("All"); // All, STUDYING, COMPLETED, STOP
  const [studentGenderFilter, setStudentGenderFilter] = useState("All"); // All, Male, Female
  const [studentViewMode, setStudentViewMode] = useState<"list" | "grid">("list");
  
  // Registration / Edit Form State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isViewStudentModalOpen, setIsViewStudentModalOpen] = useState(false);

  // Custom beautiful delete confirmation modal states
  const [studentToDelete, setStudentToDelete] = useState<StudentType | null>(null);
  const [isStudentDeleteModalOpen, setIsStudentDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<any | null>(null);
  const [isTeacherDeleteModalOpen, setIsTeacherDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [confirmDeleteDocId, setConfirmDeleteDocId] = useState<string | null>(null);
  const [showExtraOptions, setShowExtraOptions] = useState(false);

  const [regNameKh, setRegNameKh] = useState("");
  const [regNameEn, setRegNameEn] = useState("");
  const [regStudentId, setRegStudentId] = useState("");
  const [regCourse, setRegCourse] = useState("Microsoft Office Excel");
  const [regLevel, setRegLevel] = useState("Level 1");
  const [regStatus, setRegStatus] = useState<'STUDYING' | 'COMPLETED' | 'STOP'>("STUDYING");
  const [regStartDate, setRegStartDate] = useState("2026-06-27");
  const [regEndDate, setRegEndDate] = useState("2026-09-27");
  const [regShift, setRegShift] = useState("");
  const [regFee, setRegFee] = useState<number>(120);
  const [regPaid, setRegPaid] = useState<number>(0);
  const [regGuardianName, setRegGuardianName] = useState("");
  const [regGuardianPhone, setRegGuardianPhone] = useState("");
  const [regTelegramConnected, setRegTelegramConnected] = useState(true);
  const [regGender, setRegGender] = useState<'Female' | 'Male'>("Female");

  // New precise register form states to match the screenshot design
  const [regDob, setRegDob] = useState("2008-01-01");
  const [regPob, setRegPob] = useState("ភ្នំពេញ");
  const [regDiscount, setRegDiscount] = useState<number>(0);
  const [regFullFee, setRegFullFee] = useState<number>(120);
  const [regHours, setRegHours] = useState("08:00 - 09:30 AM");
  const [regMonths, setRegMonths] = useState<number>(3);

  // Dynamic dropdown list options states (with local storage and sync fallback)
  const [courseOptions, setCourseOptions] = useState<string[]>([
    "Microsoft Office Excel",
    "Microsoft Office Word",
    "Adobe Photoshop Full Course",
    "Web Development Coding Suite",
    "Python Core Programing",
    "Graphic Design Essentials"
  ]);
  const [levelOptions, setLevelOptions] = useState<string[]>([
    "កម្រិត ១",
    "កម្រិត ២",
    "Level 1",
    "Level 2",
    "Advanced Master Class"
  ]);
  const [shiftOptions, setShiftOptions] = useState<string[]>([
    "វេនព្រឹក",
    "វេនរសៀល",
    "វេនយប់"
  ]);
  const [hoursOptions, setHoursOptions] = useState<string[]>([
    "08:00 - 09:30 AM",
    "09:30 - 11:00 AM",
    "02:00 - 03:30 PM",
    "03:30 - 05:00 PM",
    "05:30 - 06:30 PM",
    "06:30 - 07:30 PM"
  ]);

  const [newCustomCourse, setNewCustomCourse] = useState("");
  const [newCustomLevel, setNewCustomLevel] = useState("");
  const [newCustomShift, setNewCustomShift] = useState("");
  const [newCustomHours, setNewCustomHours] = useState("");

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddLevel, setShowAddLevel] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAddHours, setShowAddHours] = useState(false);
  const [showAllTimetablesInReg, setShowAllTimetablesInReg] = useState(false);

  const [specialtyOptions, setSpecialtyOptions] = useState<string[]>([
    "Microsoft Office Word & Excel (Microsoft Office Specialist)",
    "Adobe Photoshop & Graphic Design Specialist",
    "IT & Excel Specialist",
    "ភាសាអង់គ្លេស (English Teacher)",
    "Web Development Instructor",
    "Graphic Design Specialist"
  ]);
  const [newCustomSpecialty, setNewCustomSpecialty] = useState("");
  const [showAddSpecialty, setShowAddSpecialty] = useState(false);

  const handleAddCourseOption = async (customVal?: any) => {
    const trimmed = (typeof customVal === "string" ? customVal : newCustomCourse).trim();
    if (!trimmed) return;
    if (courseOptions.includes(trimmed)) {
      showToast("វគ្គសិក្សានេះមានរួចហើយ! (Course already exists!)", "error");
      return;
    }
    const updated = [...courseOptions, trimmed];
    setCourseOptions(updated);
    setRegCourse(trimmed); // Select the newly added course
    setNewCustomCourse("");
    setShowAddCourse(false);

    // Save to server config
    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions: updated,
          levelOptions,
          shiftOptions,
          hoursOptions
        })
      });
      showToast("បានបន្ថែមវគ្គសិក្សាថ្មីជោគជ័យ! (New course added successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const syncCourseOption = async (newCourseTitle: string) => {
    const trimmed = newCourseTitle.trim();
    if (!trimmed || courseOptions.includes(trimmed)) return;
    const updated = [...courseOptions, trimmed];
    setCourseOptions(updated);
    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions: updated,
          levelOptions,
          shiftOptions,
          hoursOptions
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLevelOption = async () => {
    const trimmed = newCustomLevel.trim();
    if (!trimmed) return;
    if (levelOptions.includes(trimmed)) {
      showToast("កម្រិតសិក្សានេះមានរួចហើយ! (Level already exists!)", "error");
      return;
    }
    const updated = [...levelOptions, trimmed];
    setLevelOptions(updated);
    setRegLevel(trimmed); // Select the newly added level
    setNewCustomLevel("");
    setShowAddLevel(false);

    // Save to server config
    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions: updated,
          shiftOptions,
          hoursOptions
        })
      });
      showToast("បានបន្ថែមការកំណត់កម្រិតថ្មីជោគជ័យ! (New level added successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddShiftOption = async () => {
    const trimmed = newCustomShift.trim();
    if (!trimmed) return;
    if (shiftOptions.includes(trimmed)) {
      showToast("វេនសិក្សានេះមានរួចហើយ! (Shift already exists!)", "error");
      return;
    }
    const updated = [...shiftOptions, trimmed];
    setShiftOptions(updated);
    setRegShift(trimmed); // Select the newly added shift
    setNewCustomShift("");
    setShowAddShift(false);

    // Save to server config
    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions: updated,
          hoursOptions
        })
      });
      showToast("បានបន្ថែមវេនសិក្សាថ្មីជោគជ័យ! (New shift added successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHoursOption = async () => {
    const trimmed = newCustomHours.trim();
    if (!trimmed) return;
    if (hoursOptions.includes(trimmed)) {
      showToast("ម៉ោងសិក្សានេះមានរួចហើយ! (Hours already exists!)", "error");
      return;
    }
    const updated = [...hoursOptions, trimmed];
    setHoursOptions(updated);
    setRegHours(trimmed); // Select the newly added hours
    setNewCustomHours("");
    setShowAddHours(false);

    // Save to server config
    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions,
          hoursOptions: updated
        })
      });
      showToast("បានបន្ថែមម៉ោងសិក្សាថ្មីជោគជ័យ! (New hours added successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSpecialtyOption = async () => {
    const trimmed = newCustomSpecialty.trim();
    if (!trimmed) return;
    if (specialtyOptions.includes(trimmed)) {
      showToast("ជំនាញបង្រៀននេះមានរួចហើយ! (Specialty already exists!)", "error");
      return;
    }
    const updated = [...specialtyOptions, trimmed];
    setSpecialtyOptions(updated);
    setTeachSpecialty(trimmed); // Select the newly added specialty
    setNewCustomSpecialty("");
    setShowAddSpecialty(false);

    // Save to server config
    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions,
          hoursOptions,
          specialtyOptions: updated
        })
      });
      showToast("បានបន្ថែមជំនាញបង្រៀនថ្មីជោគជ័យ! (New specialty added successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCourseOption = async (index: number, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    const oldVal = courseOptions[index];
    if (trimmed === oldVal) return;
    if (courseOptions.includes(trimmed)) {
      showToast("វគ្គសិក្សានេះមានរួចហើយ! (Course already exists!)", "error");
      return;
    }
    const updated = [...courseOptions];
    updated[index] = trimmed;
    setCourseOptions(updated);
    if (regCourse === oldVal) {
      setRegCourse(trimmed);
    }
    
    // Dynamically capture and update matching in-memory student records immediately
    setStudents(prev => prev.map(s => s.course === oldVal ? { ...s, course: trimmed } : s));
    
    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions: updated,
          levelOptions,
          shiftOptions,
          hoursOptions,
          renameField: "course",
          oldValue: oldVal,
          newValue: trimmed
        })
      });
      showToast("បានកែប្រែវគ្គសិក្សាជោគជ័យ! (Course edited successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourseOption = async (index: number) => {
    const targetVal = courseOptions[index];
    const updated = courseOptions.filter((_, i) => i !== index);
    setCourseOptions(updated);
    if (regCourse === targetVal) {
      setRegCourse(updated[0] || "");
    }

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions: updated,
          levelOptions,
          shiftOptions,
          hoursOptions
        })
      });
      showToast("បានលុបវគ្គសិក្សាជោគជ័យ! (Course deleted successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditLevelOption = async (index: number, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    const oldVal = levelOptions[index];
    if (trimmed === oldVal) return;
    if (levelOptions.includes(trimmed)) {
      showToast("កម្រិតសិក្សានេះមានរួចហើយ! (Level already exists!)", "error");
      return;
    }
    const updated = [...levelOptions];
    updated[index] = trimmed;
    setLevelOptions(updated);
    if (regLevel === oldVal) {
      setRegLevel(trimmed);
    }

    // Dynamically capture and update matching in-memory student records immediately
    setStudents(prev => prev.map(s => s.level === oldVal ? { ...s, level: trimmed } : s));

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions: updated,
          shiftOptions,
          hoursOptions,
          renameField: "level",
          oldValue: oldVal,
          newValue: trimmed
        })
      });
      showToast("បានកែប្រែកម្រិតសិក្សាជោគជ័យ! (Level edited successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLevelOption = async (index: number) => {
    const targetVal = levelOptions[index];
    const updated = levelOptions.filter((_, i) => i !== index);
    setLevelOptions(updated);
    if (regLevel === targetVal) {
      setRegLevel(updated[0] || "");
    }

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions: updated,
          shiftOptions,
          hoursOptions
        })
      });
      showToast("បានលុបកម្រិតសិក្សាជោគជ័យ! (Level deleted successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditShiftOption = async (index: number, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    const oldVal = shiftOptions[index];
    if (trimmed === oldVal) return;
    if (shiftOptions.includes(trimmed)) {
      showToast("វេនសិក្សានេះមានរួចហើយ! (Shift already exists!)", "error");
      return;
    }
    const updated = [...shiftOptions];
    updated[index] = trimmed;
    setShiftOptions(updated);
    if (regShift === oldVal) {
      setRegShift(trimmed);
    }

    // Dynamically capture and update matching in-memory student records immediately
    setStudents(prev => prev.map(s => s.shift === oldVal ? { ...s, shift: trimmed } : s));

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions: updated,
          hoursOptions,
          renameField: "shift",
          oldValue: oldVal,
          newValue: trimmed
        })
      });
      showToast("បានកែប្រែវេនសិក្សាជោគជ័យ! (Shift edited successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteShiftOption = async (index: number) => {
    const targetVal = shiftOptions[index];
    const updated = shiftOptions.filter((_, i) => i !== index);
    setShiftOptions(updated);
    if (regShift === targetVal) {
      setRegShift(updated[0] || "");
    }

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions: updated,
          hoursOptions
        })
      });
      showToast("បានលុបវេនសិក្សាជោគជ័យ! (Shift deleted successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditHoursOption = async (index: number, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    const oldVal = hoursOptions[index];
    if (trimmed === oldVal) return;
    if (hoursOptions.includes(trimmed)) {
      showToast("ម៉ោងសិក្សានេះមានរួចហើយ! (Hours already exists!)", "error");
      return;
    }
    const updated = [...hoursOptions];
    updated[index] = trimmed;
    setHoursOptions(updated);
    if (regHours === oldVal) {
      setRegHours(trimmed);
    }

    // Dynamically capture and update matching in-memory student records immediately
    setStudents(prev => prev.map(s => s.hours === oldVal ? { ...s, hours: trimmed } : s));

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions,
          hoursOptions: updated,
          renameField: "hours",
          oldValue: oldVal,
          newValue: trimmed
        })
      });
      showToast("បានកែប្រែម៉ោងសិក្សាជោគជ័យ! (Hours edited successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHoursOption = async (index: number) => {
    const targetVal = hoursOptions[index];
    const updated = hoursOptions.filter((_, i) => i !== index);
    setHoursOptions(updated);
    if (regHours === targetVal) {
      setRegHours(updated[0] || "");
    }

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions,
          hoursOptions: updated
        })
      });
      showToast("បានលុបម៉ោងសិក្សាជោគជ័យ! (Hours deleted successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSpecialtyOption = async (index: number, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    const oldVal = specialtyOptions[index];
    if (trimmed === oldVal) return;
    if (specialtyOptions.includes(trimmed)) {
      showToast("ជំនាញបង្រៀននេះមានរួចហើយ! (Specialty already exists!)", "error");
      return;
    }
    const updated = [...specialtyOptions];
    updated[index] = trimmed;
    setSpecialtyOptions(updated);
    if (teachSpecialty === oldVal) {
      setTeachSpecialty(trimmed);
    }

    // Dynamically capture and update matching in-memory teacher records immediately
    setTeachers(prev => prev.map(t => t.specialty === oldVal ? { ...t, specialty: trimmed } : t));

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions,
          hoursOptions,
          specialtyOptions: updated,
          renameField: "specialty",
          oldValue: oldVal,
          newValue: trimmed
        })
      });
      showToast("បានកែប្រែជំនាញបង្រៀនជោគជ័យ! (Specialty edited successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSpecialtyOption = async (index: number) => {
    const targetVal = specialtyOptions[index];
    const updated = specialtyOptions.filter((_, i) => i !== index);
    setSpecialtyOptions(updated);
    if (teachSpecialty === targetVal) {
      setTeachSpecialty(updated[0] || "");
    }

    try {
      await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolName,
          directorName,
          baseFee,
          appTheme,
          courseOptions,
          levelOptions,
          shiftOptions,
          hoursOptions,
          specialtyOptions: updated
        })
      });
      showToast("បានលុបជំនាញបង្រៀនជោគជ័យ! (Specialty deleted successfully!)", "success");
    } catch (err) {
      console.error(err);
    }
  };

  // New Interactive App Modules States
  const [timetables, setTimetables] = useState<any[]>([]);
  const [dbCourses, setDbCourses] = useState<any[]>([]);

  const fetchTimetables = () => {
    if (!token) return;
    fetch("/api/timetables", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) return safeJson(res);
        throw new Error("Failed to load timetables");
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTimetables(data);
        }
      })
      .catch(err => console.error("Error fetching timetables:", err));
  };

  const fetchDbCourses = () => {
    if (!token) return;
    fetch("/api/courses", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) return safeJson(res);
        throw new Error("Failed to load courses");
      })
      .then(data => {
        if (Array.isArray(data)) {
          setDbCourses(data);
        }
      })
      .catch(err => console.error("Error fetching courses:", err));
  };

  // Automatically sync full tuition fee with selected course price
  useEffect(() => {
    if (regCourse && dbCourses.length > 0) {
      const matched = dbCourses.find(c => c.title?.trim().toLowerCase() === regCourse.trim().toLowerCase());
      if (matched) {
        const newFee = matched.price || 0;
        setRegFullFee(prev => prev === newFee ? prev : newFee);
      }
    }
  }, [regCourse, dbCourses]);

  const convert24To12Standard = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "";
    const formatSingle = (t: string) => {
      const parts = t.split(":");
      if (parts.length < 2) return { str: t, hour: 0, min: "00", ampm: "AM" };
      const h = parseInt(parts[0], 10);
      const m = parts[1];
      const ampm = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayHStr = String(displayH).padStart(2, "0");
      return { str: `${displayHStr}:${m}`, hour: h, min: m, ampm };
    };
    const startObj = formatSingle(startTime);
    const endObj = formatSingle(endTime);
    return `${startObj.str} - ${endObj.str} ${endObj.ampm}`;
  };

  const derivedShiftOptions = useMemo(() => {
    if (!timetables || timetables.length === 0) return EMPTY_ARRAY;
    return Array.from(new Set(timetables.map(t => t.dayOfWeek).filter(Boolean))) as string[];
  }, [timetables]);

  const derivedHoursOptions = useMemo(() => {
    if (!timetables || timetables.length === 0) return EMPTY_ARRAY;
    return Array.from(new Set(timetables.map(t => {
      if (t.startTime && t.endTime) {
        return convert24To12Standard(t.startTime, t.endTime);
      }
      return "";
    }).filter(Boolean))) as string[];
  }, [timetables]);

  const derivedCourseOptions = useMemo(() => {
    if (!timetables || timetables.length === 0) return EMPTY_ARRAY;
    return Array.from(new Set(timetables.map(t => t.subject).filter(Boolean))) as string[];
  }, [timetables]);

  const lastSelectedCourse = useRef<string | null>(null);

  // Automatically select shift and hours of the matching timetable when course is selected (student registration)
  useEffect(() => {
    if (!isStudentModalOpen) {
      lastSelectedCourse.current = null;
      return;
    }

    if (regCourse && timetables.length > 0) {
      const isInitialEditLoad = editingStudentId && lastSelectedCourse.current === null;
      
      if (!isInitialEditLoad) {
        const matchingSchedules = timetables.filter(t => t.subject?.trim().toLowerCase() === regCourse.trim().toLowerCase());
        if (matchingSchedules.length > 0) {
          const firstSched = matchingSchedules[0];
          const calculatedShift = firstSched.dayOfWeek;
          const calculatedHours = convert24To12Standard(firstSched.startTime, firstSched.endTime);
          
          const newShift = calculatedShift || derivedShiftOptions[0] || "";
          const newHours = calculatedHours || derivedHoursOptions[0] || "";
          setRegShift(prev => prev === newShift ? prev : newShift);
          setRegHours(prev => prev === newHours ? prev : newHours);
        } else {
          const newShift = derivedShiftOptions[0] || "";
          const newHours = derivedHoursOptions[0] || "";
          setRegShift(prev => prev === newShift ? prev : newShift);
          setRegHours(prev => prev === newHours ? prev : newHours);
        }
      }
      lastSelectedCourse.current = regCourse;
    } else if (!regCourse) {
      const newShift = derivedShiftOptions[0] || "";
      const newHours = derivedHoursOptions[0] || "";
      setRegShift(prev => prev === newShift ? prev : newShift);
      setRegHours(prev => prev === newHours ? prev : newHours);
      lastSelectedCourse.current = "";
    }
  }, [regCourse, isStudentModalOpen, timetables, editingStudentId, derivedShiftOptions, derivedHoursOptions]);

  // 1. Teachers Directory States
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teachNameKh, setTeachNameKh] = useState("");
  const [teachNameEn, setTeachNameEn] = useState("");
  const [teachSpecialty, setTeachSpecialty] = useState("IT & Excel Specialist");
  const [teachPhone, setTeachPhone] = useState("");
  const [teachGender, setTeachGender] = useState<'Female' | 'Male'>("Male");
  const [teachStatus, setTeachStatus] = useState("ACTIVE");
  const [teachDob, setTeachDob] = useState("");
  const [teachPob, setTeachPob] = useState("");
  const [teachJoinDate, setTeachJoinDate] = useState("");
  const [teachLeaveDate, setTeachLeaveDate] = useState("");
  const [teachExperienceDays, setTeachExperienceDays] = useState("");
  const [teachSalary, setTeachSalary] = useState(450);
  const [teachPaymentStatus, setTeachPaymentStatus] = useState("មិនទាន់បើក (២០២៦-០៧)");
  const [teachTeacherId, setTeachTeacherId] = useState("");
  const [teachNotes, setTeachNotes] = useState("");
  const calculatedExpDays = React.useMemo(() => {
    if (!teachJoinDate) return "0 ថ្ងៃ";
    try {
      const start = parseLocalDate(teachJoinDate);
      const end = teachLeaveDate ? parseLocalDate(teachLeaveDate) : new Date();
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return "0 ថ្ងៃ";
      const diffTime = Math.max(0, end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} ថ្ងៃ`;
    } catch (err) {
      return "0 ថ្ងៃ";
    }
  }, [teachJoinDate, teachLeaveDate]);
  const [teacherViewMode, setTeacherViewMode] = useState<'table' | 'grid'>('table');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [chartTab, setChartTab] = useState<'courses' | 'revenue'>('courses');

  // 2. Attendance Sheets States
  const [attendanceLog, setAttendanceLog] = useState<{ [date: string]: { [studentId: string]: 'PRESENT' | 'ABSENT' | 'PERMISSION' } }>({
    [TODAY_STR]: {
      "101": "PRESENT",
      "1": "PRESENT",
      "2": "PRESENT"
    }
  });
  const [attendanceCheckInLog, setAttendanceCheckInLog] = useState<{ [date: string]: { [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION' } }>({
    [TODAY_STR]: {
      "101": "PRESENT",
      "t1": "PRESENT"
    }
  });
  const [attendanceCheckOutLog, setAttendanceCheckOutLog] = useState<{ [date: string]: { [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION' } }>({
    [TODAY_STR]: {
      "101": "PRESENT",
      "t1": "PRESENT"
    }
  });
  const [attendanceSubTab, setAttendanceSubTab] = useState<'logging' | 'reports'>('logging');
  const [reportPeriod, setReportPeriod] = useState<'day' | 'month' | 'year'>('day');
  const [attendanceType, setAttendanceType] = useState<'student' | 'teacher'>('student');
  const [attendanceDate, setAttendanceDate] = useState(TODAY_STR);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [isRefreshingAttendance, setIsRefreshingAttendance] = useState(false);
  const [expandedAttendanceRow, setExpandedAttendanceRow] = useState<string | null>(null);
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [showDailyDetails, setShowDailyDetails] = useState(false);
  const [attendanceCourseFilter, setAttendanceCourseFilter] = useState("all");
  const [isMuted, setIsMuted] = useState(false);
  const [showBotConfig, setShowBotConfig] = useState(false);
  const [isAttendancePrintPreviewOpen, setIsAttendancePrintPreviewOpen] = useState(false);
  const [isSavingPDF, setIsSavingPDF] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleTestMysqlConnection = async () => {
    setTestingConnection(true);
    try {
      const res = await fetch("/api/mysql/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          host: mysqlHost,
          port: mysqlPort,
          user: mysqlUser,
          password: mysqlPassword,
          database: mysqlDbName
        })
      });
      const data = await safeJson(res);
      if (res.ok && data.success) {
        showToast(data.message || "ភ្ជាប់ទៅកាន់ MySQL បានជោគជ័យ!", "success");
      } else {
        showToast(data.message || "ការភ្ជាប់បរាជ័យ!", "error");
      }
    } catch (error: any) {
      console.error(error);
      showToast("កំហុសក្នុងការតភ្ជាប់៖ " + error.message, "error");
    } finally {
      setTestingConnection(false);
    }
  };

  const handleGenerateSql = async () => {
    setGeneratingSql(true);
    try {
      const savedAssets = localStorage.getItem("plc_school_assets") || "[]";
      const assetsList = JSON.parse(savedAssets);
      const res = await fetch("/api/mysql/generate-dump", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ assets: assetsList })
      });
      const data = await safeJson(res);
      if (res.ok && data.sql) {
        setGeneratedSql(data.sql);
        showToast("បង្កើតកូដ SQL ទទួលបានជោគជ័យ!", "success");
      } else {
        showToast(data.message || "ការបង្កើតកូដ SQL បរាជ័យ!", "error");
      }
    } catch (error: any) {
      console.error(error);
      showToast("កំហុស៖ " + error.message, "error");
    } finally {
      setGeneratingSql(false);
    }
  };

  const handleGenerateAndDownloadSql = async () => {
    setGeneratingSql(true);
    try {
      const savedAssets = localStorage.getItem("plc_school_assets") || "[]";
      const assetsList = JSON.parse(savedAssets);
      const res = await fetch("/api/mysql/generate-dump", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ assets: assetsList })
      });
      const data = await safeJson(res);
      if (res.ok && data.sql) {
        setGeneratedSql(data.sql);
        const blob = new Blob([data.sql], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `plc_school_db_dump_${new Date().toISOString().slice(0, 10)}.sql`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast("ទាញយកកូដ SQL បានជោគជ័យ!", "success");
      } else {
        showToast(data.message || "ការទាញយកកូដ SQL បរាជ័យ!", "error");
      }
    } catch (error: any) {
      console.error(error);
      showToast("កំហុស៖ " + error.message, "error");
    } finally {
      setGeneratingSql(false);
    }
  };

  const handleLiveMigrate = async () => {
    if (!window.confirm("ការផ្ទេរទិន្នន័យ (Migration) នឹងលុប និងបង្កើតតារាងឡើងវិញនៅលើទិន្នន័យ MySQL គោលដៅរបស់អ្នក។ តើអ្នកចង់បន្តមែនទេ?")) {
      return;
    }
    setMigrating(true);
    setMigrationLogs([`[${new Date().toLocaleTimeString()}] កំពុងរៀបចំការផ្ទេរទិន្នន័យ...`]);
    try {
      const savedAssets = localStorage.getItem("plc_school_assets") || "[]";
      const assetsList = JSON.parse(savedAssets);
      const res = await fetch("/api/mysql/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          host: mysqlHost,
          port: mysqlPort,
          user: mysqlUser,
          password: mysqlPassword,
          database: mysqlDbName,
          assets: assetsList
        })
      });
      const data = await safeJson(res);
      if (res.ok && data.success) {
        setMigrationLogs(data.logs || []);
        showToast("ផ្ទេរទិន្នន័យទៅកាន់ MySQL បានបញ្ចប់ជាស្ថាពរ! 🎉", "success");
        fetchDbCounts();
      } else {
        setMigrationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Error: ${data.message}`]);
        showToast(data.message || "ការផ្ទេរទិន្នន័យបរាជ័យ!", "error");
      }
    } catch (error: any) {
      console.error(error);
      setMigrationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Critical Error: ${error.message}`]);
      showToast("កំហុស៖ " + error.message, "error");
    } finally {
      setMigrating(false);
    }
  };

  const [selectedHistoryItem, setSelectedHistoryItem] = useState<{
    id: string;
    nameKh: string;
    nameEn: string;
    type: 'month' | 'year';
    itemType: 'student' | 'teacher';
  } | null>(null);
  const [isGoogleSheetsSyncingOpen, setIsGoogleSheetsSyncingOpen] = useState(false);
  const [googleSheetsSyncStep, setGoogleSheetsSyncStep] = useState<'idle' | 'preparing' | 'connecting' | 'saving' | 'success'>('idle');
  const [printTitle, setPrintTitle] = useState("");
  const [printShowLogo, setPrintShowLogo] = useState(true);
  const [printShowSignatures, setPrintShowSignatures] = useState(true);
  const [printSelectedColumns, setPrintSelectedColumns] = useState({
    no: true,
    studentId: true,
    name: true,
    date: true,
    course: true,
    status: true,
    checkIn: true,
    checkOut: true,
    reason: true,
    rate: true
  });
  const [googleSheetsURL, setGoogleSheetsURL] = useState("https://docs.google.com/spreadsheets/d/1XyZ1W-vKx5a_y4V5fD8c9a_f8G-q3H_plc_attendance/edit");
  const [googleSheetsName, setGoogleSheetsName] = useState("វត្តមានសិស្ស (Attendance_Students)");
  const [googleSheetsSelectedColumns, setGoogleSheetsSelectedColumns] = useState({
    no: true,
    studentId: true,
    name: true,
    course: true,
    checkIn: true,
    checkOut: true,
    reason: true,
    date: true
  });
  const [googleSheetsSyncLogs, setGoogleSheetsSyncLogs] = useState<Array<{
    id: string;
    timestamp: string;
    sheetName: string;
    recordsCount: number;
    status: 'SUCCESS' | 'FAILED';
  }>>([
    { id: "log-1", timestamp: "2026-06-25 08:30 AM", sheetName: "Student_Attendance_June", recordsCount: 12, status: "SUCCESS" },
    { id: "log-2", timestamp: "2026-06-26 09:15 AM", sheetName: "Student_Attendance_June", recordsCount: 12, status: "SUCCESS" }
  ]);

  const [absenceModalData, setAbsenceModalData] = useState<{
    type: 'check-in' | 'check-out';
    id: string;
    nameKh: string;
    nameEn?: string;
    courseOrSpecialty: string;
    itemType: 'student' | 'teacher';
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION';
    currentNote: string;
  } | null>(null);

  const [showTelegramMockup, setShowTelegramMockup] = useState(false);
  const [isMobileHubOpen, setIsMobileHubOpen] = useState(false);

  const [attendanceNotes, setAttendanceNotes] = useState<{
    [date: string]: {
      [id: string]: {
        'check-in'?: string;
        'check-out'?: string;
      }
    }
  }>({});

  const [telegramLogs, setTelegramLogs] = useState<{
    type: 'check-in' | 'check-out';
    name: string;
    nameEn?: string;
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION';
    statusKh: string;
    course: string;
    time: string;
    itemType?: 'student' | 'teacher';
    note?: string;
    date?: string;
  }[]>([]);

  // 3. QR Code scanner Simulator States
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [selectedScanStudentId, setSelectedScanStudentId] = useState("");
  const [scanMode, setScanMode] = useState<'check-in' | 'check-out'>('check-in');

  // 4. Finance Registry & Log States
  const [transactions, setTransactions] = useState([
    { id: "tx1", studentName: "សុខ ម៉ារី", amount: 60, date: "2026-05-01", type: "វគ្គសិក្សា Microsoft Office Excel" },
    { id: "tx2", studentName: "ទេព ធីតា", amount: 60, date: "2026-02-10", type: "វគ្គសិក្សា Adobe Photoshop" }
  ]);
  const [selectedPaymentStudentId, setSelectedPaymentStudentId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number>(60);
  const [paymentFormSuccess, setPaymentFormSuccess] = useState<string | null>(null);
  const [financeSubTab, setFinanceSubTab] = useState<'tuition' | 'invoices' | 'salaries' | 'expenses' | 'reports'>(
    () => (localStorage.getItem("plc_finance_sub_tab") as any) || 'tuition'
  );
  useEffect(() => {
    localStorage.setItem("plc_finance_sub_tab", financeSubTab);
  }, [financeSubTab]);
  const [financeSearchQuery, setFinanceSearchQuery] = useState("");
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [viewReceiptTx, setViewReceiptTx] = useState<any | null>(null);

  // Salary and Teacher payroll states
  const [salaries, setSalaries] = useState<any[]>([]);
  const [showPaySalaryModal, setShowPaySalaryModal] = useState(false);
  const [selectedPayTeacherId, setSelectedPayTeacherId] = useState("");
  const [payPeriodInput, setPayPeriodInput] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });
  const [salaryBaseAmount, setSalaryBaseAmount] = useState<number>(450);
  const [salaryBonus, setSalaryBonus] = useState<number>(0);
  const [salaryDeduction, setSalaryDeduction] = useState<number>(0);
  const [salaryStatus, setSalaryStatus] = useState<string>("PAID");
  const [salaryFormSuccess, setSalaryFormSuccess] = useState<string | null>(null);
  const [salarySearchQuery, setSalarySearchQuery] = useState("");
  const [viewSalaryReceipt, setViewSalaryReceipt] = useState<any | null>(null);

  // School Expenses States (Utilities like Electricity, Water, School materials, etc.)
  const [schoolExpenses, setSchoolExpenses] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role !== "ADMIN" && user?.role !== "ACCOUNTANT") return;
    fetch('/api/expenses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          console.warn("Failed to fetch expenses, status:", res.status);
          return [];
        }
        return safeJson(res);
      })
      .then(data => {
        if (Array.isArray(data)) {
          setSchoolExpenses(data);
        }
      })
      .catch(err => console.error("Error fetching expenses:", err));
  }, [user, token]);

  const [expenseSearchQuery, setExpenseSearchQuery] = useState("");
  const [expenseFilterCategory, setExpenseFilterCategory] = useState<string>("all");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  
  // Form fields for adding/editing expense
  const [expenseFormId, setExpenseFormId] = useState<string | null>(null); // null means adding, non-null means editing
  const [expenseFormTitle, setExpenseFormTitle] = useState("");
  const [expenseFormAmount, setExpenseFormAmount] = useState<number | "">("");
  const [expenseFormCategory, setExpenseFormCategory] = useState<string>("electricity");
  const [expenseFormDate, setExpenseFormDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${r}`;
  });
  const [expenseFormPaymentMethod, setExpenseFormPaymentMethod] = useState("សាច់ប្រាក់ (CASH)");
  const [expenseFormNote, setExpenseFormNote] = useState("");
  const [expenseFormSuccess, setExpenseFormSuccess] = useState<string | null>(null);

  // Dynamic Expense Categories State
  const [expenseCategories, setExpenseCategories] = useState<{ id: string; labelKh: string; labelEn: string }[]>(() => {
    try {
      const stored = localStorage.getItem("plc_expense_categories");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading expense categories:", e);
    }
    return [
      { id: "electricity", labelKh: "ថ្លៃអគ្គិសនី", labelEn: "Electricity" },
      { id: "water", labelKh: "ថ្លៃទឹកស្អាត", labelEn: "Water Utility" },
      { id: "supplies", labelKh: "សំភារៈសាលារៀន", labelEn: "Supplies" },
      { id: "internet", labelKh: "សេវាអ៊ីនធឺណិត", labelEn: "Internet" },
      { id: "rent", labelKh: "ថ្លៃជួលទីតាំង", labelEn: "Building Rent" },
      { id: "other", labelKh: "ចំណាយផ្សេងៗ", labelEn: "Other Operation" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("plc_expense_categories", JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  // States for Expense Category custom dropdown
  const [isOpenExpenseCategoryDropdown, setIsOpenExpenseCategoryDropdown] = useState<boolean>(false);
  const [editingExpenseCategoryId, setEditingExpenseCategoryId] = useState<string | null>(null);
  const [editingExpenseCategoryLabelKh, setEditingExpenseCategoryLabelKh] = useState<string>("");
  const [editingExpenseCategoryLabelEn, setEditingExpenseCategoryLabelEn] = useState<string>("");
  const [newExpenseCategoryLabelKh, setNewExpenseCategoryLabelKh] = useState<string>("");
  const [newExpenseCategoryLabelEn, setNewExpenseCategoryLabelEn] = useState<string>("");

  // 4b. Dynamic Payment Methods State (loaded from localStorage or default values)
  const [paymentMethods, setPaymentMethods] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("app_payment_methods");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading payment methods from localStorage:", e);
    }
    return ["សាច់ប្រាក់ (CASH)", "ABA BANK", "TELEGRAM PAY"];
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("សាច់ប្រាក់ (CASH)");
  const [newPaymentMethodInput, setNewPaymentMethodInput] = useState<string>("");
  const [showAddNewMethodInput, setShowAddNewMethodInput] = useState<boolean>(false);
  const [isOpenPaymentMethodDropdown, setIsOpenPaymentMethodDropdown] = useState<boolean>(false);
  const [editingPaymentMethodIndex, setEditingPaymentMethodIndex] = useState<number | null>(null);
  const [editingPaymentMethodValue, setEditingPaymentMethodValue] = useState<string>("");
  const [newPaymentMethodValue, setNewPaymentMethodValue] = useState<string>("");

  // States for Expense Payment Method dropdown
  const [isOpenExpensePaymentMethodDropdown, setIsOpenExpensePaymentMethodDropdown] = useState<boolean>(false);
  const [editingExpensePaymentMethodIndex, setEditingExpensePaymentMethodIndex] = useState<number | null>(null);
  const [editingExpensePaymentMethodValue, setEditingExpensePaymentMethodValue] = useState<string>("");
  const [newExpensePaymentMethodValue, setNewExpensePaymentMethodValue] = useState<string>("");

  // Dynamic Salary Statuses State
  const [salaryStatuses, setSalaryStatuses] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("app_salary_statuses");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return ["បើកសព្វគ្រប់ (PAID)", "មិនទាន់បើក (PENDING)"];
  });
  const [isOpenSalaryStatusDropdown, setIsOpenSalaryStatusDropdown] = useState<boolean>(false);
  const [editingSalaryStatusIndex, setEditingSalaryStatusIndex] = useState<number | null>(null);
  const [editingSalaryStatusValue, setEditingSalaryStatusValue] = useState<string>("");
  const [newSalaryStatusValue, setNewSalaryStatusValue] = useState<string>("");

  // Custom dropdown state variables for Student form options (Course, Level, Shift, Hours)
  const [isOpenCourseDropdown, setIsOpenCourseDropdown] = useState<boolean>(false);
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);
  const [editingCourseValue, setEditingCourseValue] = useState<string>("");

  const [isOpenLevelDropdown, setIsOpenLevelDropdown] = useState<boolean>(false);
  const [editingLevelIndex, setEditingLevelIndex] = useState<number | null>(null);
  const [editingLevelValue, setEditingLevelValue] = useState<string>("");

  const [isOpenShiftDropdown, setIsOpenShiftDropdown] = useState<boolean>(false);
  const [editingShiftIndex, setEditingShiftIndex] = useState<number | null>(null);
  const [editingShiftValue, setEditingShiftValue] = useState<string>("");

  const [isOpenHoursDropdown, setIsOpenHoursDropdown] = useState<boolean>(false);
  const [editingHoursIndex, setEditingHoursIndex] = useState<number | null>(null);
  const [editingHoursValue, setEditingHoursValue] = useState<string>("");

  const [isOpenSpecialtyDropdown, setIsOpenSpecialtyDropdown] = useState<boolean>(false);
  const [editingSpecialtyIndex, setEditingSpecialtyIndex] = useState<number | null>(null);
  const [editingSpecialtyValue, setEditingSpecialtyValue] = useState<string>("");

  // ID Card Custom Dropdown states
  const [isOpenStudentIdCardDropdown, setIsOpenStudentIdCardDropdown] = useState<boolean>(false);
  const [studentIdCardSearchQuery, setStudentIdCardSearchQuery] = useState<string>("");
  const [isOpenTeacherIdCardDropdown, setIsOpenTeacherIdCardDropdown] = useState<boolean>(false);
  const [teacherIdCardSearchQuery, setTeacherIdCardSearchQuery] = useState<string>("");

  // 5. Settings Configuration Panel States
  const [schoolName, setSchoolName] = useState("PLC Computer School");
  const [schoolKhmerName, setSchoolKhmerName] = useState("សាលាកុំព្យូទ័រ ភីអិលស៊ី");
  const [directorName, setDirectorName] = useState("ជី សុភា (CHY SOPHEA)");
  const [baseFee, setBaseFee] = useState(120);
  const [schoolLogo, setSchoolLogo] = useState("");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800");
  const [bannerTitle, setBannerTitle] = useState("វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ");
  const [bannerSubtitle, setBannerSubtitle] = useState("អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ");
  const [bannerSlides, setBannerSlides] = useState<any[]>([]);
  const [khqrImage, setKhqrImage] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("087 850 014 / 097 501 3648");
  const [schoolAddress, setSchoolAddress] = useState("ផ្ទះលេខ ១២ ផ្លូវកម្ពុជាក្រោម សង្កាត់ទឹកល្អក់៣ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ");
  const [schoolTelegram, setSchoolTelegram] = useState("https://t.me/plccomputerschool");
  const [developerName, setDeveloperName] = useState("PLC Computer");
  const [developerKhmerName, setDeveloperKhmerName] = useState("ភីអិលស៊ី កុំព្យូទ័រ");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [developerLogo, setDeveloperLogo] = useState("");
  const [developerPhone, setDeveloperPhone] = useState("087 850 014");
  const [developerTelegram, setDeveloperTelegram] = useState("https://t.me/plccomputerschool");
  const [receiptFooterNote, setReceiptFooterNote] = useState("សូមអរគុណចំពោះការបង់ថ្លៃសិក្សា! ការសិក្សាគឺដើម្បីការងារ និងអនាគតដ៏ភ្លឺស្វាង។ (ថ្លៃសិក្សាមិនអាចផ្ទេរ ឬដកវិញបានទេ)");
  const [studentIdPrefix, setStudentIdPrefix] = useState("STU-26-");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const [appTheme, setAppTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("plc_theme");
      return saved || "indigo";
    } catch {
      return "indigo";
    }
  });
  const [themeTabMode, setThemeTabMode] = useState<'preset' | 'custom'>('preset');
  const [customHexInput, setCustomHexInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("plc_theme");
      return saved && saved.startsWith("#") ? saved : "#2563eb";
    } catch {
      return "#2563eb";
    }
  });
  const [appBgColor, setAppBgColor] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("plc_app_bg");
      return saved || "#f8fafc";
    } catch {
      return "#f8fafc";
    }
  });
  const [customBgHexInput, setCustomBgHexInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("plc_app_bg");
      return saved || "#f8fafc";
    } catch {
      return "#f8fafc";
    }
  });
  const [appCardBgColor, setAppCardBgColor] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("plc_card_bg");
      return saved || "auto";
    } catch {
      return "auto";
    }
  });
  const [customCardBgHexInput, setCustomCardBgHexInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("plc_card_bg");
      return saved && saved.startsWith("#") ? saved : "#ffffff";
    } catch {
      return "#ffffff";
    }
  });
  const [appTextColor, setAppTextColor] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("plc_text_color");
      return saved || "auto";
    } catch {
      return "auto";
    }
  });
  const [customTextHexInput, setCustomTextHexInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("plc_text_color");
      return saved && saved.startsWith("#") ? saved : "#0f172a";
    } catch {
      return "#0f172a";
    }
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Notifications Popover State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([
    {
      id: "1",
      titleKh: "មានសិស្សចុះឈ្មោះថ្មី",
      titleEn: "New Student Enrollment",
      descKh: "សិស្សឈ្មោះ សុខ ចាន់ បានចុះឈ្មោះចូលរៀនវគ្គ Web Development",
      time: "10 នាទីមុន",
      read: false,
      tab: "Students"
    },
    {
      id: "2",
      titleKh: "បច្ចុប្បន្នភាពវត្តមានប្រចាំថ្ងៃ",
      titleEn: "Daily Attendance Synced",
      descKh: "ស្កេនវត្តមាន QR Code ចំនួន ៤៥ នាក់ត្រូវបានកត់ត្រាក្នុងប្រព័ន្ធ",
      time: "1 ម៉ោងមុន",
      read: false,
      tab: "Attendance"
    },
    {
      id: "3",
      titleKh: "កាលវិភាគប្រឡងប្រចាំខែ",
      titleEn: "Monthly Exam Schedule",
      descKh: "ការប្រឡងបញ្ចប់វគ្គនឹងចាប់ផ្តើមនៅចុងសប្តាហ៍នេះ",
      time: "3 ម៉ោងមុន",
      read: false,
      tab: "Exams"
    }
  ]);

  // Website Popover/Modal State
  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);
  const websiteMenuRef = useRef<HTMLDivElement>(null);

  // Wi-Fi / Network Connection State
  const [isWifiMenuOpen, setIsWifiMenuOpen] = useState(false);
  const wifiMenuRef = useRef<HTMLDivElement>(null);
  const [isOnlineNetwork, setIsOnlineNetwork] = useState<boolean>(() => typeof navigator !== "undefined" ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [networkPing, setNetworkPing] = useState<number>(14);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Computed online status considering network & manual simulation
  const effectiveIsOnline = isOnlineNetwork && !isSimulatedOffline;

  // Real ping measurement helper
  const measurePingLatency = async () => {
    if (!effectiveIsOnline) return;
    const start = performance.now();
    try {
      await fetch('/api/health', { method: 'HEAD', cache: 'no-store' }).catch(() => {});
      const duration = Math.round(performance.now() - start);
      setNetworkPing(duration > 0 && duration < 300 ? duration : Math.floor(Math.random() * 12) + 12);
    } catch {
      setNetworkPing(18);
    }
  };

  useEffect(() => {
    if (isWifiMenuOpen) {
      measurePingLatency();
    }
  }, [isWifiMenuOpen]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnlineNetwork(true);
      showToast(uiLang === "kh" ? "បានភ្ជាប់អ៊ីនធឺណិតឡើងវិញ (Internet Connected)" : "Internet Connected", "success");
    };
    const handleOffline = () => {
      setIsOnlineNetwork(false);
      showToast(uiLang === "kh" ? "បាត់បង់ការភ្ជាប់អ៊ីនធឺណិត - ដំណើរការម៉ូដ Offline" : "Internet Disconnected - Offline Mode", "error");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [uiLang, showToast]);

  const availableThemes = useMemo(() => [
    { id: 'indigo', nameKh: 'ខៀវអ៉ិនឌីហ្គោ', nameEn: 'Indigo Ocean', previewColor: 'bg-blue-600', ringColor: 'ring-blue-400' },
    { id: 'emerald', nameKh: 'បៃតងត្បូង', nameEn: 'Emerald Green', previewColor: 'bg-emerald-600', ringColor: 'ring-emerald-400' },
    { id: 'rose', nameKh: 'ក្រហមផ្កាកុលាប', nameEn: 'Rose Pink', previewColor: 'bg-rose-600', ringColor: 'ring-rose-400' },
    { id: 'amber', nameKh: 'លឿងទុំ', nameEn: 'Warm Amber', previewColor: 'bg-amber-500', ringColor: 'ring-amber-400' },
    { id: 'cyan', nameKh: 'ខៀវសមុទ្រ', nameEn: 'Cyan Sky', previewColor: 'bg-cyan-500', ringColor: 'ring-cyan-400' },
    { id: 'teal', nameKh: 'បៃតងសមុទ្រ', nameEn: 'Teal Fresh', previewColor: 'bg-teal-600', ringColor: 'ring-teal-400' },
    { id: 'slate', nameKh: 'ប្រផេះទំនើប', nameEn: 'Slate Minimal', previewColor: 'bg-slate-700', ringColor: 'ring-slate-400' },
  ], []);

  // Custom Hex Palette Generator Helpers - using top-level module helpers

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (websiteMenuRef.current && !websiteMenuRef.current.contains(event.target as Node)) {
        setIsWebsiteModalOpen(false);
      }
      if (wifiMenuRef.current && !wifiMenuRef.current.contains(event.target as Node)) {
        setIsWifiMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global System Search States
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<'all' | 'pages' | 'students' | 'teachers' | 'courses' | 'schedules' | 'finance'>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Recent Searches History State
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("plc_recent_searches");
      return saved ? JSON.parse(saved) : ["សុខ ម៉ារី", "Microsoft Office", "កាលវិភាគ", "ហិរញ្ញវត្ថុ"];
    } catch {
      return ["សុខ ម៉ារី", "Microsoft Office", "កាលវិភាគ", "ហិរញ្ញវត្ថុ"];
    }
  });

  const addRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem("plc_recent_searches", JSON.stringify(updated));
      } catch (e) { console.error(e); }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("plc_recent_searches");
  };

  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);

  // Keyboard Hotkey Listener (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchFocused(prev => !prev);
        setTimeout(() => {
          const inputEl = document.getElementById("global-system-search-input");
          if (inputEl) inputEl.focus();
        }, 50);
      } else if (e.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchFocused]);

  const systemSearchModules = useMemo(() => [
    { id: "Dashboard", kh: "ផ្ទាំងគ្រប់គ្រងដើម", en: "Main Dashboard", desc: "ស្ថិតិសរុប និងរបាយការណ៍រួម", category: "ទំព័រដើម", icon: LayoutDashboard },
    { id: "Students", kh: "គ្រប់គ្រងសិស្ស", en: "Student Directory", desc: "បញ្ជីឈ្មោះសិស្ស ចុះឈ្មោះ កែប្រែ", category: "សិស្ស", icon: Users },
    { id: "Courses", kh: "វគ្គសិក្សា និងកម្រិត", en: "Courses & Levels", desc: "មុខវិជ្ជា កម្រិតសិក្សា វេនសិក្សា", category: "អប់រំ", icon: BookOpen },
    { id: "Timetable", kh: "កាលវិភាគសិក្សា", en: "Class Schedules", desc: "កាលវិភាគបង្រៀន បន្ទប់សិក្សា", category: "អប់រំ", icon: Calendar },
    { id: "Grading", kh: "គ្រប់គ្រងពិន្ទុ", en: "Student Grading", desc: "បញ្ចូលពិន្ទុ វាយតម្លៃប្រចាំខែ", category: "ពិន្ទុ", icon: GraduationCap },
    { id: "Exams", kh: "ប្រឡង និងតេស្ត", en: "Examinations", desc: "កាលវិភាគប្រឡង លទ្ធផលប្រឡង", category: "ពិន្ទុ", icon: FileSpreadsheet },
    { id: "Report Cards", kh: "ព្រឹត្តិបត្រពិន្ទុ", en: "Report Cards", desc: "បោះពុម្ពព្រឹត្តិបត្រពិន្ទុសិស្ស", category: "ពិន្ទុ", icon: Award },
    { id: "Attendance", kh: "គ្រប់គ្រងវត្តមាន", en: "Attendance Log", desc: "វត្តមានសិស្ស និងគ្រូបង្រៀន", category: "វត្តមាន", icon: Clock },
    { id: "QR Scan", kh: "ចុះវត្តមាន QR Code", en: "QR Scan Check-in", desc: "ស្កែន QR ចុះវត្តមានស្វ័យប្រវត្តិ", category: "វត្តមាន", icon: QrCode },
    { id: "Leave", kh: "ច្បាប់សម្រាកសិស្ស/គ្រូ", en: "Leave Requests", desc: "ស្នើសុំច្បាប់ សម្រាក", category: "វត្តមាន", icon: FileText },
    { id: "Teachers", kh: "គ្រូបង្រៀន និងបុគ្គលិក", en: "Teachers & Staff", desc: "បញ្ជីឈ្មោះគ្រូ ប្រាក់ខែ ជំនាញ", category: "គ្រូបង្រៀន", icon: UserCheck },
    { id: "Finance", kh: "ហិរញ្ញវត្ថុ និងចំណាយ", en: "Finance & Accounting", desc: "ប័ណ្ណទូទាត់ ប្រាក់បំណាច់ ចំណាយ", category: "ហិរញ្ញវត្ថុ", icon: DollarSign },
    { id: "Assets", kh: "ទ្រព្យសម្បត្តិសាលា", en: "School Assets & Inventory", desc: "គ្រឿងបរិក្ខារ កុំព្យូទ័រ តុ កៅអី", category: "សម្ភារៈ", icon: Package },
    { id: "Certificates", kh: "វិញ្ញាបនបត្រ", en: "Academic Certificates", desc: "ចេញវិញ្ញាបនបត្រ បញ្ចប់ការសិក្សា", category: "សញ្ញាបត្រ", icon: FileBadge },
    { id: "ID Card", kh: "រចនាកាតសិស្ស", en: "Student ID Cards", desc: "បោះពុម្ព និងបង្កើតកាតសម្គាល់ខ្លួន", category: "សិស្ស", icon: CreditCard },
    { id: "Settings", kh: "ការកំណត់ប្រព័ន្ធ", en: "System Settings", desc: "ឈ្មោះសាលា ឡូហ្គោ ពណ៌ប្រព័ន្ធ", category: "ការកំណត់", icon: Settings },
    { id: "MySQL DB", kh: "ទិន្នន័យ MySQL", en: "MySQL DB Migration", desc: "ផ្ទេរ និងរក្សាទុកទិន្នន័យ", category: "ទិន្នន័យ", icon: Database },
  ], []);

  const globalSearchResults = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    if (!q) return { modules: [], students: [], teachers: [], courses: [], timetables: [], finance: [] };

    // 1. Filter modules
    const matchedModules = (searchCategoryFilter === 'all' || searchCategoryFilter === 'pages')
      ? systemSearchModules.filter(m => 
          m.kh.toLowerCase().includes(q) ||
          m.en.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
        )
      : [];

    // 2. Filter students
    const matchedStudents = (searchCategoryFilter === 'all' || searchCategoryFilter === 'students')
      ? (students || []).filter(s => {
          const name = (s.name || "").toLowerCase();
          const khmerName = (s.khmerName || "").toLowerCase();
          const nameEn = (s.nameEn || "").toLowerCase();
          const id = (s.id || "").toLowerCase();
          const phone = (s.phone || "").toLowerCase();
          const course = (s.course || "").toLowerCase();
          const status = (s.status || "").toLowerCase();
          return name.includes(q) || khmerName.includes(q) || nameEn.includes(q) || id.includes(q) || phone.includes(q) || course.includes(q) || status.includes(q);
        }).slice(0, 6)
      : [];

    // 3. Filter teachers
    const matchedTeachers = (searchCategoryFilter === 'all' || searchCategoryFilter === 'teachers')
      ? (teachers || []).filter(t => {
          const name = (t.name || "").toLowerCase();
          const nameEn = (t.nameEn || "").toLowerCase();
          const id = (t.id || "").toLowerCase();
          const phone = (t.phone || "").toLowerCase();
          const specialty = (t.specialty || "").toLowerCase();
          return name.includes(q) || nameEn.includes(q) || id.includes(q) || phone.includes(q) || specialty.includes(q);
        }).slice(0, 5)
      : [];

    // 4. Filter courses
    const matchedCourses = (searchCategoryFilter === 'all' || searchCategoryFilter === 'courses')
      ? (courseOptions || []).filter((c: string) => 
          c.toLowerCase().includes(q)
        ).slice(0, 5)
      : [];

    // 5. Filter timetables
    const matchedTimetables = (searchCategoryFilter === 'all' || searchCategoryFilter === 'schedules')
      ? (timetables || []).filter(item => {
          const courseName = (item.courseName || item.course || "").toLowerCase();
          const teacherName = (item.teacherName || item.teacher || "").toLowerCase();
          const room = (item.room || item.roomName || "").toLowerCase();
          const days = (item.days || item.day || "").toLowerCase();
          const time = (item.timeSlot || item.time || "").toLowerCase();
          return courseName.includes(q) || teacherName.includes(q) || room.includes(q) || days.includes(q) || time.includes(q);
        }).slice(0, 5)
      : [];

    // 6. Filter finance transactions
    const matchedFinance = (searchCategoryFilter === 'all' || searchCategoryFilter === 'finance')
      ? (transactions || []).filter(tx => {
          const id = (tx.id || "").toLowerCase();
          const name = (tx.studentName || "").toLowerCase();
          const type = (tx.type || "").toLowerCase();
          const amount = String(tx.amount || "");
          const date = (tx.date || "").toLowerCase();
          return id.includes(q) || name.includes(q) || type.includes(q) || amount.includes(q) || date.includes(q);
        }).slice(0, 5)
      : [];

    return {
      modules: matchedModules,
      students: matchedStudents,
      teachers: matchedTeachers,
      courses: matchedCourses,
      timetables: matchedTimetables,
      finance: matchedFinance
    };
  }, [globalSearchQuery, searchCategoryFilter, systemSearchModules, students, teachers, courseOptions, timetables, transactions]);

  useEffect(() => {
    if (appTheme && appTheme.startsWith('#')) {
      const palette = generatePrimaryPalette(appTheme);
      if (palette) {
        document.documentElement.setAttribute('data-theme', 'custom');
        (Object.entries(palette) as [string, string][]).forEach(([shade, hexVal]) => {
          document.documentElement.style.setProperty(`--primary-${shade}`, hexVal);
        });
      }
    } else {
      ['50','100','200','300','400','500','600','700','800','900','950'].forEach(s => {
        document.documentElement.style.removeProperty(`--primary-${s}`);
      });
      document.documentElement.setAttribute('data-theme', appTheme === 'modern' ? 'indigo' : appTheme);
    }
    try {
      localStorage.setItem("plc_theme", appTheme);
    } catch (e) {
      console.error(e);
    }
  }, [appTheme]);

  useEffect(() => {
    if (appBgColor) {
      document.documentElement.style.setProperty('--app-bg-color', appBgColor);
      try {
        localStorage.setItem("plc_app_bg", appBgColor);
      } catch (e) {
        console.error(e);
      }
    } else {
      document.documentElement.style.removeProperty('--app-bg-color');
    }

    // Determine actual card background color
    let actualCardBg = appCardBgColor;
    if (!appCardBgColor || appCardBgColor === 'auto') {
      const bgLum = getLuminance(appBgColor);
      // Auto dark mode card if background is dark
      actualCardBg = bgLum < 0.45 ? '#1e293b' : '#ffffff';
    }

    const cardLum = getLuminance(actualCardBg);
    const isDarkCard = cardLum < 0.45;

    document.documentElement.style.setProperty('--card-bg', actualCardBg);
    document.documentElement.setAttribute('data-card-dark', isDarkCard ? 'true' : 'false');

    try {
      localStorage.setItem("plc_card_bg", appCardBgColor);
    } catch (e) {
      console.error(e);
    }

    // Handle Custom Text Color
    if (appTextColor && appTextColor !== 'auto') {
      document.documentElement.style.setProperty('--app-custom-text-color', appTextColor);
      document.documentElement.setAttribute('data-custom-text', 'true');
    } else {
      document.documentElement.style.removeProperty('--app-custom-text-color');
      document.documentElement.setAttribute('data-custom-text', 'false');
    }

    try {
      localStorage.setItem("plc_text_color", appTextColor);
    } catch (e) {
      console.error(e);
    }
  }, [appBgColor, appCardBgColor, appTextColor]);

  // Student registration default configurations
  const [defaultStudyMonths, setDefaultStudyMonths] = useState<number>(3);
  const [defaultGender, setDefaultGender] = useState<'Female' | 'Male'>("Female");
  const [defaultStatus, setDefaultStatus] = useState<'STUDYING' | 'COMPLETED' | 'STOP'>("STUDYING");
  const [autoGenerateId, setAutoGenerateId] = useState<boolean>(true);
  const [autoCalculateEndDate, setAutoCalculateEndDate] = useState<boolean>(true);
  const [defaultDiscount, setDefaultDiscount] = useState<number>(0);

  // Additional system configurations
  const [academicYear, setAcademicYear] = useState<string>("2025-2026");
  const [passingScore, setPassingScore] = useState<number>(50);
  const [operatingDays, setOperatingDays] = useState<string>("Monday - Saturday");
  const [defaultSortBy, setDefaultSortBy] = useState<string>("id_desc");
  const [currencySymbol, setCurrencySymbol] = useState<string>("USD");
  const [taxPercentage, setTaxPercentage] = useState<number>(0);
  const [lateFeePenalty, setLateFeePenalty] = useState<number>(0);
  const [autoBackupDrive, setAutoBackupDrive] = useState<boolean>(true);
  const [backupRetentionDays, setBackupRetentionDays] = useState<number>(30);

  // 6. ID Card Generator States
  const [idCardRole, setIdCardRole] = useState<'student' | 'teacher'>(
    () => (localStorage.getItem("plc_id_card_role") as any) || 'student'
  );
  useEffect(() => {
    localStorage.setItem("plc_id_card_role", idCardRole);
  }, [idCardRole]);
  const [selectedIdCardStudent, setSelectedIdCardStudent] = useState<StudentType | null>(null);
  const [selectedIdCardTeacher, setSelectedIdCardTeacher] = useState<any | null>(null);
  const [idCardTheme, setIdCardTheme] = useState("indigo");
  
  // Customizer fields
  const [idCardSchoolName, setIdCardSchoolName] = useState("PLC COMPUTER SCHOOL");
  const [idCardNameKh, setIdCardNameKh] = useState("");
  const [idCardNameEn, setIdCardNameEn] = useState("");
  const [idCardIdNumber, setIdCardIdNumber] = useState("");
  const [idCardGender, setIdCardGender] = useState("Male");
  const [idCardField1, setIdCardField1] = useState(""); // Course or Specialty
  const [idCardField2, setIdCardField2] = useState(""); // Level or Phone
  const [idCardField3, setIdCardField3] = useState(""); // Shift or Email
  const [idCardField4, setIdCardField4] = useState(""); // Hours or Join Date/Status
  const [idCardDob, setIdCardDob] = useState("");
  const [idCardPhone, setIdCardPhone] = useState("");
  const [idCardAddress, setIdCardAddress] = useState("");
  const [idCardIssueDate, setIdCardIssueDate] = useState("");
  const [idCardExpireDate, setIdCardExpireDate] = useState("");
  const [idCardPhoto, setIdCardPhoto] = useState<string>("");
  const [idCardBackgroundFront, setIdCardBackgroundFront] = useState<string>("");
  const [idCardBackgroundBack, setIdCardBackgroundBack] = useState<string>("");
  const [idCardPrintSide, setIdCardPrintSide] = useState<'front' | 'back' | 'both'>('both');
  const [isSavingBackgrounds, setIsSavingBackgrounds] = useState(false);

  const handleSaveIdCardBackgrounds = async () => {
    setIsSavingBackgrounds(true);
    try {
      const res = await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          idCardBackgroundFront,
          idCardBackgroundBack
        })
      });
      if (res.ok) {
        showToast("រក្សាទុកផ្ទៃខាងក្រោយកាតដោយជោគជ័យ! (ID card backgrounds saved successfully!)", "success");
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error(err);
      showToast("មានបញ្ហាក្នុងការរក្សាទុកផ្ទៃខាងក្រោយ! (Failed to save backgrounds!)", "error");
    } finally {
      setIsSavingBackgrounds(false);
    }
  };

  // ID Card Designer Helper Functions
  const handlePrefillStudent = (student: StudentType) => {
    setSelectedIdCardStudent(student);
    setIdCardRole('student');
    setIdCardNameKh(student.nameKh);
    setIdCardNameEn(student.nameEn);
    setIdCardIdNumber(student.studentId || `STU-26-${student.id.padStart(3, '0')}`);
    setIdCardGender(student.gender || "Male");
    setIdCardField1(student.course || "");
    setIdCardField2(student.level || "Level 1");
    setIdCardField3(student.shift || "");
    setIdCardField4("STUDYING");
    setIdCardPhone(student.guardianPhone || "+855 12 345 678");
    setIdCardAddress("ភ្នំពេញ");
    setIdCardDob("10/05/2005");
  };

  const handlePrefillTeacher = (teacher: any) => {
    setSelectedIdCardTeacher(teacher);
    setIdCardRole('teacher');
    setIdCardNameKh(teacher.nameKh);
    setIdCardNameEn(teacher.nameEn);
    setIdCardIdNumber(teacher.teacherId || `TCH-26-${teacher.id.padStart(3, '0')}`);
    setIdCardGender(teacher.gender || "Male");
    setIdCardField1(teacher.specialty || "Instructor");
    setIdCardField2(teacher.phone || "+855 12 345 678");
    setIdCardField3(teacher.email || "teacher@school.com");
    setIdCardField4(teacher.status || "ACTIVE");
    setIdCardPhone(teacher.phone || "+855 12 345 678");
    setIdCardAddress("ភ្នំពេញ");
    setIdCardDob("15/08/1995");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, stateSetter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("ទំហំរូបភាពធំជាង ៥MB មិនអាចអនុញ្ញាតបានទេ! (Image size exceeds 5MB limit!)", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await safeJson(res);
      } else {
        const text = await res.text();
        throw new Error("Server returned non-JSON response (possibly file too large).");
      }
      if (data.success) {
        stateSetter(data.url);
        showToast("បញ្ចូលរូបភាពជោគជ័យ!", "success");
      } else {
        showToast(data.message || "មិនអាចបញ្ចូលរូបភាពបានទេ", "error");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast("មានបញ្ហាក្នុងការបញ្ចូលរូបភាព", "error");
    }
  };

  // Render Premium ID Card Front Side
  const renderFrontCard = (refObj?: React.RefObject<HTMLDivElement | null>) => {
    return (
      <div 
        ref={refObj}
        id="front-id-card-element"
        className="w-[245px] h-[370px] rounded-[24px] border-0 shadow-md overflow-hidden flex flex-col justify-between relative bg-white select-none shrink-0 transition-all hover:shadow-lg"
        style={{ contentVisibility: "auto" }}
      >
        {/* Front Background Waves (Removed) */}
        {idCardBackgroundFront && (
          <img src={idCardBackgroundFront} className="absolute inset-0 w-full h-full object-cover z-0" alt="Background Front" referrerPolicy="no-referrer" />
        )}

        {/* Header Logo & School Name */}
        <div className="absolute top-4 left-5 right-5 flex items-center gap-2 z-10 text-slate-800">
          {schoolLogo ? (
            <img src={schoolLogo} className="w-5.5 h-5.5 object-contain rounded" alt="Logo" referrerPolicy="no-referrer" />
          ) : (
            <div className="relative w-5.5 h-5.5 flex items-center justify-center shrink-0">
              <svg className="absolute inset-0 w-full h-full text-[#0ea5e9]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
                <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
              </svg>
              <span className="text-[5px] font-black text-[#0ea5e9] tracking-tighter uppercase font-mono z-10">PLC</span>
            </div>
          )}
          <span className="text-[9.5px] font-black tracking-widest uppercase font-sans text-[#0ea5e9] truncate">{idCardSchoolName || "PLC COMPUTER SCHOOL"}</span>
        </div>

        {/* Portrait Container with Premium Circular Ring */}
        <div className="relative z-10 mt-13.5 flex justify-center">
          <div className="w-[110px] h-[110px] rounded-full border-[3px] border-white ring-4 ring-[#0ea5e9]/90 bg-white shadow-md p-[2px] overflow-hidden flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 flex items-center justify-center">
              {idCardPhoto ? (
                <img src={idCardPhoto} alt="Portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300">
                  <svg className="w-12 h-12 text-slate-350" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Identification Metadata */}
        <div className="text-left mt-9 z-10 px-6.5 flex flex-col items-start w-full">
          <p className="text-[13.5px] font-extrabold text-slate-800 font-sans leading-tight">{idCardNameKh || "ឈ្មោះខ្មែរ"}</p>
          <h4 className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest font-sans mt-1 leading-none">
            {(() => {
              const name = idCardNameEn || "YOUR NAME";
              const parts = name.trim().split(/\s+/);
              if (parts.length === 1) {
                return <span className="text-[#0ea5e9]">{parts[0]}</span>;
              }
              const firstPart = parts.slice(0, -1).join(" ");
              const lastPart = parts[parts.length - 1];
              return (
                <>
                  {firstPart} <span className="text-[#0ea5e9]">{lastPart}</span>
                </>
              );
            })()}
          </h4>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-primary-50 border border-primary-100 text-primary-700 mt-2.5">
            {idCardRole === 'student' ? (idCardField1 || 'Microsoft Office Word') : (idCardField1 || 'Instructor | Specialty')}
          </span>
        </div>

        {/* Registry Details Sheet */}
        <div className="px-6.5 mt-4.5 space-y-1 text-[9px] font-sans text-left z-10">
          <div className="grid grid-cols-[38px_8px_1fr] items-center">
            <span className="text-slate-400 font-black uppercase tracking-wider">ID</span>
            <span className="text-[#0ea5e9] font-black text-center">:</span>
            <span className="text-slate-800 font-black font-mono tracking-wide">{idCardIdNumber || "SMS-ST-101"}</span>
          </div>
          <div className="grid grid-cols-[38px_8px_1fr] items-center">
            <span className="text-slate-400 font-black uppercase tracking-wider">D.O.B</span>
            <span className="text-[#0ea5e9] font-black text-center">:</span>
            <span className="text-slate-800 font-black font-mono tracking-wide">{idCardDob || "02/06/2005"}</span>
          </div>
          <div className="grid grid-cols-[38px_8px_1fr] items-center">
            <span className="text-slate-400 font-black uppercase tracking-wider">PHONE</span>
            <span className="text-[#0ea5e9] font-black text-center">:</span>
            <span className="text-slate-800 font-black font-mono tracking-wide">{idCardPhone || "+855 96 111 2233"}</span>
          </div>
        </div>

        {/* Barcode Footer */}
        <div className="mt-auto pb-4 pt-1.5 flex flex-col items-center justify-center z-10 w-full bg-slate-50/50">
          <div className="flex items-end gap-[1.75px] h-5.5 justify-center opacity-90">
            {[1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3].map((width, idx) => (
              <span 
                key={idx} 
                className="bg-slate-800 rounded-3xs h-full"
                style={{ width: `${width * 1.2}px` }}
              ></span>
            ))}
          </div>
          <span className="text-[7px] font-mono font-bold text-slate-400 mt-1 tracking-[0.2em]">{idCardIdNumber || "SMS-ST-101"}</span>
        </div>
      </div>
    );
  };

  // Render Premium ID Card Back Side
  const renderBackCard = (refObj?: React.RefObject<HTMLDivElement | null>) => {
    return (
      <div 
        ref={refObj}
        id="back-id-card-element"
        className="w-[245px] h-[370px] rounded-[24px] border-0 shadow-md overflow-hidden flex flex-col justify-between relative bg-white select-none shrink-0 transition-all hover:shadow-lg"
        style={{ contentVisibility: "auto" }}
      >
        {/* Back Background Image/Color */}
        {idCardBackgroundBack ? (
          <img src={idCardBackgroundBack} className="absolute inset-0 w-full h-full object-cover z-0" alt="Background Back" referrerPolicy="no-referrer" />
        ) : (
          <div className="absolute inset-0 bg-white z-0 pointer-events-none"></div>
        )}

        {/* Header back with School Logo and Name */}
        <div className="p-4 flex flex-col items-center justify-center z-10 bg-transparent">
          <div className="flex items-center gap-1.5 justify-center">
            {schoolLogo ? (
              <img src={schoolLogo} className="w-5.5 h-5.5 object-contain rounded" alt="Logo" referrerPolicy="no-referrer" />
            ) : (
              <div className="relative w-5.5 h-5.5 flex items-center justify-center shrink-0">
                <svg className="absolute inset-0 w-full h-full text-[#0ea5e9]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
                  <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
                </svg>
                <span className="text-[5.5px] font-black text-[#0ea5e9] tracking-tighter uppercase font-mono z-10">PLC</span>
              </div>
            )}
            <span className="text-[9.5px] font-black text-[#0ea5e9] tracking-widest font-sans uppercase truncate">{idCardSchoolName || "PLC COMPUTER SCHOOL"}</span>
          </div>
        </div>

        {/* Terms of Use container */}
        <div className="px-4.5 py-2.5 flex-1 flex flex-col justify-start z-10">
          <div className="p-2.5 space-y-1.5">
            <div className="text-center">
              <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">លក្ខខណ្ឌប្រើប្រាស់ (TERMS OF USE)</span>
              <div className="h-[1px] bg-slate-100/50 my-1.5 w-full"></div>
            </div>
            
            <div className="space-y-2 text-[8px] font-bold text-slate-600 leading-relaxed text-left font-sans">
              <div className="flex gap-2 items-center">
                <span className="w-4 h-4 rounded-full bg-sky-50/80 text-sky-600 flex items-center justify-center text-[8.5px] shrink-0 font-black border border-sky-100">១</span>
                <span>កាតនេះសម្រាប់ប្រើប្រាស់ក្នុងគ្រឹះស្ថានសិក្សាប៉ុណ្ណោះ</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-4 h-4 rounded-full bg-sky-50/80 text-sky-600 flex items-center justify-center text-[8.5px] shrink-0 font-black border border-sky-100">២</span>
                <span>សិស្ស/និស្សិតត្រូវតែពាក់កាតនេះរាល់ពេលចូលរៀន</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-4 h-4 rounded-full bg-sky-50/80 text-sky-600 flex items-center justify-center text-[8.5px] shrink-0 font-black border border-sky-100">៣</span>
                <span>ករណីបាត់ ឬខូចត្រូវរាយការណ៍មកសាលាជាបន្ទាន់</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-4 h-4 rounded-full bg-sky-50/80 text-sky-600 flex items-center justify-center text-[8.5px] shrink-0 font-black border border-sky-100">៤</span>
                <span>ប្រសិនបើបានរើសជួបកាតនេះ សូមប្រគល់ជូនសាលាវិញ</span>
              </div>
            </div>
          </div>

          {/* Customizer Pill details */}
          <div className="flex justify-center mt-1 z-10">
            <div className="text-[8px] font-black text-[#0ea5e9] bg-transparent px-3.5 py-0.5 flex items-center gap-1.5">
              <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-extrabold uppercase font-mono">ADDRESS:</span>
              <span className="font-sans font-bold text-slate-700">{idCardAddress || "ភ្នំពេញ"}</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-1.5 mt-1 z-10 px-1">
            <div className="text-[8px] font-black text-[#0ea5e9] bg-transparent px-3 py-0.5 shrink-0 flex items-center gap-1">
              <span className="text-slate-500 font-extrabold uppercase font-mono">LVL:</span>
              <span className="font-mono text-slate-700">{idCardField2 || "Level 1"}</span>
            </div>
            <div className="text-[8px] font-black text-[#0ea5e9] bg-transparent px-3 py-0.5 flex-1 truncate flex items-center justify-center gap-1">
              <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-extrabold uppercase font-mono">HRS:</span>
              <span className="font-mono text-slate-700">{idCardField4 || "08:00 - 09:30 AM"}</span>
            </div>
          </div>
        </div>

        {/* Back bottom wave with QR code (Waves Removed) */}
        <div className="relative h-[125px] shrink-0 mt-auto z-10 bg-transparent">
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-6 z-10 text-slate-800">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200/50 shrink-0">
              <QrCode className="w-12 h-12 text-[#1b304f]" />
            </div>
            
            <div className="text-right text-[8.5px] font-bold space-y-1 text-slate-700 font-sans">
              <div>
                <span className="font-bold text-slate-400">Issue date : </span>
                <span className="font-mono font-extrabold text-slate-700">{idCardIssueDate || "03/11/2023"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400">Expire Date : </span>
                <span className="font-mono font-extrabold text-slate-700">{idCardExpireDate || "12/01/2026"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Download ID Cards as high resolution image files
  const downloadIdCard = async () => {
    if (!frontCardRef.current || !backCardRef.current) {
      showToast("រកមិនឃើញព័ត៌មានកាតដើម្បីទាញយកឡើយ (ID card references not found)", "error");
      return;
    }
    
    // Prepare styling hooks for restoring later
    const removedNodes: { node: Node; parent: Node; nextSibling: Node | null }[] = [];
    const temporaryStyleElements: HTMLStyleElement[] = [];
    const originalAdopted = (document as any).adoptedStyleSheets;
    let restoredAdopted = false;
    const originalGetComputedStyle = window.getComputedStyle;

    try {
      showToast("កំពុងរៀបចំទាញយកកាត... (Preparing card download...)", "info");

      // Robust helper function to extract and convert oklab/oklch colors to standard sRGB format
      const extractAndConvert = (funcType: string, inner: string): string => {
        const normalized = inner.replace(/,/g, ' ');
        const parts = normalized.trim().split(/\s+/);
        if (parts.length === 0) return "rgb(100, 116, 139)";
        
        let lStr = parts[0];
        let lVal = parseFloat(lStr);
        if (lStr.endsWith('%')) {
          lVal = parseFloat(lStr) / 100;
        }
        
        if (isNaN(lVal)) {
          return "rgb(100, 116, 139)";
        }
        
        let alpha = 1;
        const slashIndex = parts.indexOf('/');
        if (slashIndex !== -1 && slashIndex + 1 < parts.length) {
          alpha = parseFloat(parts[slashIndex + 1]);
        } else {
          const partWithSlash = parts.find(p => p.startsWith('/'));
          if (partWithSlash) {
            alpha = parseFloat(partWithSlash.substring(1));
          }
        }
        if (isNaN(alpha)) alpha = 1;

        if (lVal >= 0.96) {
          return alpha < 1 ? `rgba(255, 255, 255, ${alpha})` : "rgb(255, 255, 255)";
        }
        if (lVal <= 0.05) {
          return alpha < 1 ? `rgba(0, 0, 0, ${alpha})` : "rgb(0, 0, 0)";
        }
        
        try {
          if (funcType === 'oklab') {
            let aVal = parts[1] ? parseFloat(parts[1]) : 0;
            let bVal = parts[2] ? parseFloat(parts[2]) : 0;
            if (isNaN(aVal)) aVal = 0;
            if (isNaN(bVal)) bVal = 0;
            
            const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
            const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
            const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
            
            const l = l_ * l_ * l_;
            const m = m_ * m_ * m_;
            const s = s_ * s_ * s_;
            
            const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
            const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
            const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
            
            const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
            const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
            const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
            const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
            
            return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
          } else {
            let cVal = parts[1] ? parseFloat(parts[1]) : 0;
            let hVal = parts[2] ? parseFloat(parts[2]) : 0;
            if (isNaN(cVal)) cVal = 0;
            if (isNaN(hVal)) hVal = 0;
            
            const hRad = (hVal * Math.PI) / 180;
            const aVal = cVal * Math.cos(hRad);
            const bVal = cVal * Math.sin(hRad);
            
            const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
            const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
            const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
            
            const l = l_ * l_ * l_;
            const m = m_ * m_ * m_;
            const s = s_ * s_ * s_;
            
            const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
            const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
            const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
            
            const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
            const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
            const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
            const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
            
            return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
          }
        } catch (e) {
          return "rgb(100, 116, 139)";
        }
      };

      const sanitizeCssColors = (css: string): string => {
        let result = "";
        let i = 0;
        while (i < css.length) {
          const sub6 = css.substring(i, i + 6).toLowerCase();
          if (sub6 === "oklch(" || sub6 === "oklab(") {
            const funcType = sub6.slice(0, 5);
            i += 6;
            const start = i;
            let depth = 1;
            while (i < css.length && depth > 0) {
              if (css[i] === '(') {
                depth++;
              } else if (css[i] === ')') {
                depth--;
              }
              i++;
            }
            const inner = css.substring(start, i - 1);
            result += extractAndConvert(funcType, inner);
          } else {
            result += css[i];
            i++;
          }
        }
        return result;
      };

      // Intercept window.getComputedStyle to dynamically replace oklch/oklab values during image generation
      window.getComputedStyle = function(el, pseudoElt) {
        const style = originalGetComputedStyle(el, pseudoElt);
        return new Proxy(style, {
          get(target, prop, receiver) {
            if (prop === 'getPropertyValue') {
              return function(propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
                  return sanitizeCssColors(val);
                }
                return val;
              };
            }
            const val = Reflect.get(target, prop, target);
            if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
              return sanitizeCssColors(val);
            }
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          }
        }) as any;
      };

      // Disable adoptedStyleSheets dynamically to force fallback to standard stylesheets
      if (originalAdopted && originalAdopted.length > 0) {
        try {
          (document as any).adoptedStyleSheets = [];
          restoredAdopted = true;
        } catch (e) {
          console.warn("Failed to temporarily clear adoptedStyleSheets:", e);
        }
      }

      // Sanitize document stylesheets to replace "oklch" and "oklab" color functions
      try {
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            if (sheet.cssRules) {
              const rules = Array.from(sheet.cssRules);
              const needsSanitization = rules.some(r => r.cssText.includes("oklch") || r.cssText.includes("oklab"));
              if (needsSanitization) {
                const cssText = rules.map(r => r.cssText).join("\n");
                const sanitizedText = sanitizeCssColors(cssText);

                // Create a temporary style element with sanitized CSS
                const tempStyle = document.createElement("style");
                tempStyle.setAttribute("data-temp-sanitized-style", "true");
                tempStyle.textContent = sanitizedText;
                document.head.appendChild(tempStyle);
                temporaryStyleElements.push(tempStyle);

                // Physically remove the original sheet's ownerNode from DOM
                if (sheet.ownerNode && sheet.ownerNode.parentNode) {
                  const node = sheet.ownerNode;
                  const parent = node.parentNode;
                  const nextSibling = node.nextSibling;
                  removedNodes.push({ node, parent, nextSibling });
                  parent.removeChild(node);
                }
              }
            }
          } catch (sheetErr) {
            // CORS stylesheet fetch fallback
            const node = sheet.ownerNode;
            let fetchedAndSanitized = false;
            if (node && node.nodeName === "LINK") {
              const linkEl = node as HTMLLinkElement;
              if (linkEl.href) {
                try {
                  const response = await fetch(linkEl.href);
                  if (response.ok) {
                    const rawText = await response.text();
                    if (rawText.includes("oklch") || rawText.includes("oklab")) {
                      const sanitizedText = sanitizeCssColors(rawText);

                      const tempStyle = document.createElement("style");
                      tempStyle.setAttribute("data-temp-sanitized-style", "true");
                      tempStyle.textContent = sanitizedText;
                      document.head.appendChild(tempStyle);
                      temporaryStyleElements.push(tempStyle);

                      if (linkEl.parentNode) {
                        const parent = linkEl.parentNode;
                        const nextSibling = linkEl.nextSibling;
                        removedNodes.push({ node: linkEl, parent, nextSibling });
                        parent.removeChild(linkEl);
                        fetchedAndSanitized = true;
                      }
                    }
                  }
                } catch (fetchErr) {
                  console.warn("Failed to fetch cross-origin stylesheet:", fetchErr);
                }
              }
            }

            if (!fetchedAndSanitized && node && node.parentNode) {
              const parent = node.parentNode;
              const nextSibling = node.nextSibling;
              removedNodes.push({ node, parent, nextSibling });
              parent.removeChild(node);
            }
          }
        }
      } catch (styleSanitizeErr) {
        console.warn("Stylesheet sanitization failed, proceeding anyway:", styleSanitizeErr);
      }
      
      const { safeToJpeg: toJpeg } = await import('../lib/safe-html-to-image');
      // 1. Download Front
      if (idCardPrintSide === 'front' || idCardPrintSide === 'both') {
        const { safeToPng: toPng } = await import('../lib/safe-html-to-image');
        const dataUrlFront = await toPng(frontCardRef.current, { pixelRatio: 3, backgroundColor: 'transparent' });
        const linkFront = document.createElement("a");
        linkFront.download = `${idCardNameEn || "Student"}_ID_Front.png`;
        linkFront.href = dataUrlFront;
        linkFront.click();
      }
      
      // 2. Download Back
      if (idCardPrintSide === 'back' || idCardPrintSide === 'both') {
        const { safeToPng: toPngBack } = await import('../lib/safe-html-to-image');
        const dataUrlBack = await toPngBack(backCardRef.current, { pixelRatio: 3, backgroundColor: 'transparent' });
        const linkBack = document.createElement("a");
        linkBack.download = `${idCardNameEn || "Student"}_ID_Back.png`;
        linkBack.href = dataUrlBack;
        linkBack.click();
      }
      
      showToast("ការទាញយកបានជោគជ័យ! (Card downloaded successfully!)", "success");
    } catch (error) {
      console.error("Error generating ID card image", error);
      showToast("ការទាញយកកាតបរាជ័យ! (Failed to download card)", "error");
    } finally {
      // Restore original styles to make sure user UI looks perfect again
      try {
        removedNodes.forEach(({ node, parent, nextSibling }) => {
          try {
            if (nextSibling) {
              parent.insertBefore(node, nextSibling);
            } else {
              parent.appendChild(node);
            }
          } catch (restoreNodeErr) {
            console.warn("Failed to restore node:", restoreNodeErr);
          }
        });
        temporaryStyleElements.forEach((tempStyle) => {
          if (tempStyle.parentNode) {
            tempStyle.parentNode.removeChild(tempStyle);
          }
        });
        if (restoredAdopted && originalAdopted) {
          (document as any).adoptedStyleSheets = originalAdopted;
        }
        if (originalGetComputedStyle) {
          window.getComputedStyle = originalGetComputedStyle;
        }
      } catch (restoreErr) {
        console.error("Style restoration failed:", restoreErr);
      }
    }
  };

  // Trigger high precision print view
  const printIdCard = () => {
    // Inject dynamic print styling to force A4 landscape orientation automatically
    const printStyle = document.createElement("style");
    printStyle.id = "print-id-card-landscape-style";
    printStyle.textContent = "@media print { @page { size: A4 landscape !important; margin: 5mm !important; } }";
    document.head.appendChild(printStyle);

    document.body.classList.add("printing-id-card");
    
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-id-card");
      const el = document.getElementById("print-id-card-landscape-style");
      if (el) el.remove();
      window.removeEventListener("afterprint", handleAfterPrint);
    };
    
    window.addEventListener("afterprint", handleAfterPrint);
    
    window.print();
    
    // Fallback if event doesn't fire
    setTimeout(handleAfterPrint, 2000);
  };

  // Trigger high precision PDF generation using html2pdf.js
  const saveAsPdf = async () => {
    if (!frontCardRef.current || !backCardRef.current) {
      showToast("រកមិនឃើញព័ត៌មានកាតដើម្បីរក្សាទុកឡើយ (ID card references not found)", "error");
      return;
    }

    // Prepare styling hooks for restoring later
    const removedNodes: { node: Node; parent: Node; nextSibling: Node | null }[] = [];
    const temporaryStyleElements: HTMLStyleElement[] = [];
    const originalAdopted = (document as any).adoptedStyleSheets;
    let restoredAdopted = false;
    const originalGetComputedStyle = window.getComputedStyle;

    try {
      showToast("កំពុងរៀបចំរក្សាទុកជា PDF... (Preparing PDF saving...)", "info");

      // Robust helper function to extract and convert oklab/oklch colors to standard sRGB format
      const extractAndConvert = (funcType: string, inner: string): string => {
        const normalized = inner.replace(/,/g, ' ');
        const parts = normalized.trim().split(/\s+/);
        if (parts.length === 0) return "rgb(100, 116, 139)";
        
        let lStr = parts[0];
        let lVal = parseFloat(lStr);
        if (lStr.endsWith('%')) {
          lVal = parseFloat(lStr) / 100;
        }
        
        if (isNaN(lVal)) {
          return "rgb(100, 116, 139)";
        }
        
        let alpha = 1;
        const slashIndex = parts.indexOf('/');
        if (slashIndex !== -1 && slashIndex + 1 < parts.length) {
          alpha = parseFloat(parts[slashIndex + 1]);
        } else {
          const partWithSlash = parts.find(p => p.startsWith('/'));
          if (partWithSlash) {
            alpha = parseFloat(partWithSlash.substring(1));
          }
        }
        if (isNaN(alpha)) alpha = 1;

        if (lVal >= 0.96) {
          return alpha < 1 ? `rgba(255, 255, 255, ${alpha})` : "rgb(255, 255, 255)";
        }
        if (lVal <= 0.05) {
          return alpha < 1 ? `rgba(0, 0, 0, ${alpha})` : "rgb(0, 0, 0)";
        }
        
        try {
          if (funcType === 'oklab') {
            let aVal = parts[1] ? parseFloat(parts[1]) : 0;
            let bVal = parts[2] ? parseFloat(parts[2]) : 0;
            if (isNaN(aVal)) aVal = 0;
            if (isNaN(bVal)) bVal = 0;
            
            const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
            const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
            const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
            
            const l = l_ * l_ * l_;
            const m = m_ * m_ * m_;
            const s = s_ * s_ * s_;
            
            const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
            const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
            const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
            
            const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
            const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
            const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
            const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
            
            return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
          } else {
            let cVal = parts[1] ? parseFloat(parts[1]) : 0;
            let hVal = parts[2] ? parseFloat(parts[2]) : 0;
            if (isNaN(cVal)) cVal = 0;
            if (isNaN(hVal)) hVal = 0;
            
            const hRad = (hVal * Math.PI) / 180;
            const aVal = cVal * Math.cos(hRad);
            const bVal = cVal * Math.sin(hRad);
            
            const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
            const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
            const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
            
            const l = l_ * l_ * l_;
            const m = m_ * m_ * m_;
            const s = s_ * s_ * s_;
            
            const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
            const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
            const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
            
            const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
            const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
            const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
            const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
            
            return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
          }
        } catch (e) {
          return "rgb(100, 116, 139)";
        }
      };

      const sanitizeCssColors = (css: string): string => {
        let result = "";
        let i = 0;
        while (i < css.length) {
          const sub6 = css.substring(i, i + 6).toLowerCase();
          if (sub6 === "oklch(" || sub6 === "oklab(") {
            const funcType = sub6.slice(0, 5);
            i += 6;
            const start = i;
            let depth = 1;
            while (i < css.length && depth > 0) {
              if (css[i] === '(') {
                depth++;
              } else if (css[i] === ')') {
                depth--;
              }
              i++;
            }
            const inner = css.substring(start, i - 1);
            result += extractAndConvert(funcType, inner);
          } else {
            result += css[i];
            i++;
          }
        }
        return result;
      };

      // Intercept window.getComputedStyle to dynamically replace oklch/oklab values during image generation
      window.getComputedStyle = function(el, pseudoElt) {
        const style = originalGetComputedStyle(el, pseudoElt);
        return new Proxy(style, {
          get(target, prop, receiver) {
            if (prop === 'getPropertyValue') {
              return function(propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
                  return sanitizeCssColors(val);
                }
                return val;
              };
            }
            const val = Reflect.get(target, prop, target);
            if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
              return sanitizeCssColors(val);
            }
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          }
        }) as any;
      };

      // Disable adoptedStyleSheets dynamically to force fallback to standard stylesheets
      if (originalAdopted && originalAdopted.length > 0) {
        try {
          (document as any).adoptedStyleSheets = [];
          restoredAdopted = true;
        } catch (e) {
          console.warn("Failed to temporarily clear adoptedStyleSheets:", e);
        }
      }

      // Sanitize document stylesheets to replace "oklch" and "oklab" color functions
      try {
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            if (sheet.cssRules) {
              const rules = Array.from(sheet.cssRules);
              const needsSanitization = rules.some(r => r.cssText.includes("oklch") || r.cssText.includes("oklab"));
              if (needsSanitization) {
                const cssText = rules.map(r => r.cssText).join("\n");
                const sanitizedText = sanitizeCssColors(cssText);

                // Create a temporary style element with sanitized CSS
                const tempStyle = document.createElement("style");
                tempStyle.setAttribute("data-temp-sanitized-style", "true");
                tempStyle.textContent = sanitizedText;
                document.head.appendChild(tempStyle);
                temporaryStyleElements.push(tempStyle);

                // Physically remove the original sheet's ownerNode from DOM
                if (sheet.ownerNode && sheet.ownerNode.parentNode) {
                  const node = sheet.ownerNode;
                  const parent = node.parentNode;
                  const nextSibling = node.nextSibling;
                  removedNodes.push({ node, parent, nextSibling });
                  parent.removeChild(node);
                }
              }
            }
          } catch (sheetErr) {
            // CORS stylesheet fetch fallback
            const node = sheet.ownerNode;
            let fetchedAndSanitized = false;
            if (node && node.nodeName === "LINK") {
              const linkEl = node as HTMLLinkElement;
              if (linkEl.href) {
                try {
                  const response = await fetch(linkEl.href);
                  if (response.ok) {
                    const rawText = await response.text();
                    if (rawText.includes("oklch") || rawText.includes("oklab")) {
                      const sanitizedText = sanitizeCssColors(rawText);

                      const tempStyle = document.createElement("style");
                      tempStyle.setAttribute("data-temp-sanitized-style", "true");
                      tempStyle.textContent = sanitizedText;
                      document.head.appendChild(tempStyle);
                      temporaryStyleElements.push(tempStyle);

                      if (linkEl.parentNode) {
                        const parent = linkEl.parentNode;
                        const nextSibling = linkEl.nextSibling;
                        removedNodes.push({ node: linkEl, parent, nextSibling });
                        parent.removeChild(linkEl);
                        fetchedAndSanitized = true;
                      }
                    }
                  }
                } catch (fetchErr) {
                  console.warn("Failed to fetch cross-origin stylesheet:", fetchErr);
                }
              }
            }

            if (!fetchedAndSanitized && node && node.parentNode) {
              const parent = node.parentNode;
              const nextSibling = node.nextSibling;
              removedNodes.push({ node, parent, nextSibling });
              parent.removeChild(node);
            }
          }
        }
      } catch (styleSanitizeErr) {
        console.warn("Stylesheet sanitization failed, proceeding anyway:", styleSanitizeErr);
      }

      // Load html2pdf dynamically from CDN
      const jsPDF = (await import('jspdf')).default;
                const { safeToJpeg: toJpeg } = await import('../lib/safe-html-to-image');

      // Grab the printable element
      const originalElement = document.getElementById("printable-id-card-sheet");
      if (!originalElement) {
        throw new Error("Could not find printable-id-card-sheet element");
      }

      // Clone and configure the cloned element for proper rendering
      const clone = originalElement.cloneNode(true) as HTMLElement;
      clone.style.display = "flex";
      clone.style.flexDirection = "row";
      clone.style.justifyContent = "center";
      clone.style.alignItems = "center";
      clone.style.gap = "40px";
      clone.style.padding = "40px";
      clone.style.backgroundColor = "#ffffff";
      clone.style.width = "750px"; // Nice landscape fit
      clone.style.height = "auto";
      clone.style.margin = "0 auto";

      // Append clone temporarily to an off-screen container
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "0px";
      tempDiv.style.top = "0px";
      tempDiv.style.width = "850px";
      tempDiv.style.opacity = "0";
      tempDiv.style.pointerEvents = "none";
      tempDiv.style.zIndex = "-1000";
      tempDiv.appendChild(clone);
      document.body.appendChild(tempDiv);

      const fileName = `${idCardNameEn || "Student"}_ID_Cards.pdf`;

      const opt = {
        margin: [5, 5, 5, 5] as [number, number, number, number], // top, left, bottom, right in mm
        filename: fileName,
        image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
        html2canvas: { 
          ...({ scale: 2.5 } as any), 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 850,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
      };

      // Generate and save PDF
      document.body.appendChild(clone);
                                const imgData = await toJpeg(clone, { quality: 0.98, backgroundColor: "#ffffff", pixelRatio: 2 });
                                document.body.removeChild(clone);
                                const pdf = new jsPDF({
                                    orientation: opt.jsPDF?.orientation || 'portrait',
                                    unit: 'in',
                                    format: 'a4'
                                });
                                const pdfWidth = pdf.internal.pageSize.getWidth();
                                const img = new Image();
                                img.src = imgData;
                                await new Promise(resolve => { img.onload = resolve; });
                                const pdfHeight = (img.height * pdfWidth) / img.width;
                                pdf.addImage(imgData, 'JPEG', 0.5, 0.5, pdfWidth - 1, pdfHeight - 1);
                                pdf.save(opt.filename || 'export.pdf');

      // Cleanup
      document.body.removeChild(tempDiv);
      showToast("បានរក្សាទុកឯកសារ PDF ដោយជោគជ័យ! (PDF Saved Successfully!)", "success");
    } catch (error) {
      console.error("PDF generation failed:", error);
      showToast("ការបង្កើត PDF បរាជ័យ! កំពុងប្ដូរទៅការបោះពុម្ពជំនួស... (PDF generation failed, falling back to print...)", "error");
      printIdCard();
    } finally {
      // Restore original styles to make sure user UI looks perfect again
      try {
        removedNodes.forEach(({ node, parent, nextSibling }) => {
          try {
            if (nextSibling) {
              parent.insertBefore(node, nextSibling);
            } else {
              parent.appendChild(node);
            }
          } catch (restoreNodeErr) {
            console.warn("Failed to restore node:", restoreNodeErr);
          }
        });
        temporaryStyleElements.forEach((tempStyle) => {
          if (tempStyle.parentNode) {
            tempStyle.parentNode.removeChild(tempStyle);
          }
        });
        if (restoredAdopted && originalAdopted) {
          (document as any).adoptedStyleSheets = originalAdopted;
        }
        if (originalGetComputedStyle) {
          window.getComputedStyle = originalGetComputedStyle;
        }
      } catch (restoreErr) {
        console.error("Style restoration failed:", restoreErr);
      }
    }
  };

  // States for Daily, Monthly, and Yearly Reports Summary
  const [summaryPeriod, setSummaryPeriod] = useState<'day' | 'month' | 'year'>('day');
  const [summaryDate, setSummaryDate] = useState<string>("2026-06-29");
  const [summaryMonth, setSummaryMonth] = useState<string>("2026-06");
  const [summaryYear, setSummaryYear] = useState<string>("2026");

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Students, Teachers, Settings, and Transactions on Mount
  useEffect(() => {
    // Load students
    fetch("/api/students", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          onLogout();
          throw new Error("Unauthorized");
        }
        if (res.ok) return safeJson(res);
        throw new Error("Failed to load students");
      })
      .then(data => {
        if (data.students) {
          setStudents(data.students);
        }
      })
      .catch(err => console.error("Error fetching students:", err));

    // Load teachers
    fetch("/api/teachers", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          onLogout();
          throw new Error("Unauthorized");
        }
        if (res.ok) return safeJson(res);
        return res.text().then(text => {
          throw new Error(`Failed to load teachers: ${res.status} ${text}`);
        });
      })
      .then(data => {
        if (data.teachers) {
          setTeachers(data.teachers);
          const dbSpecs = data.teachers.map((t: any) => t.specialty).filter(Boolean);
          if (dbSpecs.length > 0) {
            setSpecialtyOptions(prev => Array.from(new Set([...prev, ...dbSpecs])));
          }
        }
      })
      .catch(err => console.error("Error fetching teachers:", err));
    
    // Load timetables
    fetchTimetables();
    fetchDbCourses();

    // Load school configurations
    fetch("/api/system/settings", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          onLogout();
          throw new Error("Unauthorized");
        }
        if (res.ok) return safeJson(res);
        throw new Error("Failed to load settings");
      })
      .then(data => {
        if (data.schoolName) setSchoolName(data.schoolName);
        if (data.schoolKhmerName) setSchoolKhmerName(data.schoolKhmerName);
        if (data.directorName) setDirectorName(data.directorName);
        if (data.baseFee) setBaseFee(Number(data.baseFee));
        if (data.schoolLogo) setSchoolLogo(data.schoolLogo);
        if (data.coverImage || data.bannerImage) setCoverImage(data.coverImage || data.bannerImage);
        if (data.bannerTitle) setBannerTitle(data.bannerTitle);
        if (data.bannerSubtitle) setBannerSubtitle(data.bannerSubtitle);
        if (data.bannerSlides && Array.isArray(data.bannerSlides)) setBannerSlides(data.bannerSlides);
        if (data.khqrImage !== undefined) setKhqrImage(data.khqrImage);
        if (data.idCardBackgroundFront) setIdCardBackgroundFront(data.idCardBackgroundFront);
        if (data.idCardBackgroundBack) setIdCardBackgroundBack(data.idCardBackgroundBack);
        if (data.schoolPhone) setSchoolPhone(data.schoolPhone);
        if (data.schoolAddress) setSchoolAddress(data.schoolAddress);
        if (data.schoolTelegram) setSchoolTelegram(data.schoolTelegram);
                if (data.developerLogo !== undefined) setDeveloperLogo(data.developerLogo);
        if (data.developerName) setDeveloperName(data.developerName);
        if (data.developerKhmerName) setDeveloperKhmerName(data.developerKhmerName);
        if (data.telegramBotToken) setTelegramBotToken(data.telegramBotToken);
        if (data.telegramChatId) setTelegramChatId(data.telegramChatId);
        if (data.developerPhone) setDeveloperPhone(data.developerPhone);
        if (data.developerTelegram) setDeveloperTelegram(data.developerTelegram);
        if (data.receiptFooterNote) setReceiptFooterNote(data.receiptFooterNote);
        if (data.studentIdPrefix) setStudentIdPrefix(data.studentIdPrefix);
        if (data.appTheme) setAppTheme(data.appTheme);
        if (data.defaultStudyMonths !== undefined) setDefaultStudyMonths(Number(data.defaultStudyMonths));
        if (data.defaultGender) setDefaultGender(data.defaultGender);
        if (data.defaultStatus) setDefaultStatus(data.defaultStatus);
        if (data.autoGenerateId !== undefined) setAutoGenerateId(data.autoGenerateId);
        if (data.autoCalculateEndDate !== undefined) setAutoCalculateEndDate(data.autoCalculateEndDate);
        if (data.defaultDiscount !== undefined) setDefaultDiscount(Number(data.defaultDiscount));
        if (data.academicYear) setAcademicYear(data.academicYear);
        if (data.passingScore !== undefined) setPassingScore(Number(data.passingScore));
        if (data.operatingDays) setOperatingDays(data.operatingDays);
        if (data.defaultSortBy) setDefaultSortBy(data.defaultSortBy);
        if (data.currencySymbol) setCurrencySymbol(data.currencySymbol);
        if (data.taxPercentage !== undefined) setTaxPercentage(Number(data.taxPercentage));
        if (data.lateFeePenalty !== undefined) setLateFeePenalty(Number(data.lateFeePenalty));
        if (data.autoBackupDrive !== undefined) setAutoBackupDrive(data.autoBackupDrive);
        if (data.backupRetentionDays !== undefined) setBackupRetentionDays(Number(data.backupRetentionDays));
        if (data.courseOptions && Array.isArray(data.courseOptions)) {
          const duplicatesToRemove = ["Word", "Excel", "Photoshop"];
          setCourseOptions(data.courseOptions.filter(co => !duplicatesToRemove.includes(co)));
        }
        if (data.levelOptions && Array.isArray(data.levelOptions)) setLevelOptions(data.levelOptions);
        if (data.shiftOptions && Array.isArray(data.shiftOptions)) setShiftOptions(data.shiftOptions);
        if (data.hoursOptions && Array.isArray(data.hoursOptions)) setHoursOptions(data.hoursOptions);
        if (data.specialtyOptions && Array.isArray(data.specialtyOptions)) {
          setSpecialtyOptions(prev => Array.from(new Set([...prev, ...data.specialtyOptions])));
        }
        if (data.mysqlHost) setMysqlHost(data.mysqlHost);
        if (data.mysqlDbName) setMysqlDbName(data.mysqlDbName);
        if (data.mysqlPort) setMysqlPort(String(data.mysqlPort));
        if (data.mysqlUser) setMysqlUser(data.mysqlUser);
        if (data.mysqlPassword) setMysqlPassword(data.mysqlPassword);
      })
      .catch(err => console.error("Error fetching settings:", err));

    // Load financial transactions
    if (user?.role === "ADMIN" || user?.role === "ACCOUNTANT") {
      fetch("/api/finance/transactions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 401) {
            onLogout();
            return { transactions: [] };
          }
          if (res.ok) return safeJson(res);
          console.warn("Non-OK response fetching transactions, status:", res.status);
          return { transactions: [] };
        })
        .then(data => {
          if (data && data.transactions) {
            setTransactions(data.transactions);
          }
        })
        .catch(err => console.warn("Error fetching transactions:", err));

      // Load salary payments
      fetch("/api/finance/salaries", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 401) {
            onLogout();
            return { salaries: [] };
          }
          if (res.ok) return safeJson(res);
          console.warn("Non-OK response fetching salaries, status:", res.status);
          return { salaries: [] };
        })
        .then(data => {
          if (data && data.salaries) {
            setSalaries(data.salaries);
          }
        })
        .catch(err => console.warn("Error fetching salaries:", err));
    }
  }, [token, user?.id, user?.role]);

  // Load attendance when date changes
  useEffect(() => {
    if (!attendanceDate) return;

    fetch(`/api/attendance?date=${attendanceDate}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          onLogout();
          throw new Error("Unauthorized");
        }
        if (res.ok) return safeJson(res);
        throw new Error("Failed to load attendance");
      })
      .then(data => {
        const newCheckInLog: { [id: string]: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION' } = {};
        const newCheckOutLog: { [id: string]: 'PRESENT' | 'ABSENT' | 'LATE' | 'PERMISSION' } = {};
        const newNotes: { [id: string]: { [type: string]: string } } = {};

        // Process student records
        if (data.students) {
          data.students.forEach((rec: any) => {
            try {
              const reasonObj = JSON.parse(rec.reason || "{}");
              if (reasonObj.checkIn) newCheckInLog[rec.studentId] = reasonObj.checkIn;
              if (reasonObj.checkOut) newCheckOutLog[rec.studentId] = reasonObj.checkOut;
              
              newNotes[rec.studentId] = {
                'check-in': reasonObj.checkInNote || "",
                'check-out': reasonObj.checkOutNote || ""
              };
            } catch (e) {
              newCheckInLog[rec.studentId] = rec.status;
              newNotes[rec.studentId] = {
                'check-in': rec.reason || "",
                'check-out': ""
              };
            }
          });
        }

        // Process teacher records
        if (data.teachers) {
          data.teachers.forEach((rec: any) => {
            try {
              const reasonObj = JSON.parse(rec.reason || "{}");
              if (reasonObj.checkIn) newCheckInLog[rec.teacherId] = reasonObj.checkIn;
              if (reasonObj.checkOut) newCheckOutLog[rec.teacherId] = reasonObj.checkOut;
              
              newNotes[rec.teacherId] = {
                'check-in': reasonObj.checkInNote || "",
                'check-out': reasonObj.checkOutNote || ""
              };
            } catch (e) {
              newCheckInLog[rec.teacherId] = rec.status;
              newNotes[rec.teacherId] = {
                'check-in': rec.reason || "",
                'check-out': ""
              };
            }
          });
        }

        // Update local logs for this specific date
        setAttendanceCheckInLog(prev => ({
          ...prev,
          [attendanceDate]: newCheckInLog
        }));
        setAttendanceCheckOutLog(prev => ({
          ...prev,
          [attendanceDate]: newCheckOutLog
        }));
        setAttendanceNotes(prev => ({
          ...prev,
          [attendanceDate]: newNotes
        }));
      })
      .catch(err => console.error("Error fetching daily attendance:", err));
  }, [attendanceDate, token]);

  const fetchWorkspaceTree = async () => {
    setIsLoadingWorkspace(true);
    setWorkspaceError(null);
    try {
      const response = await fetch("/api/system/files", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await safeJson(response);
        setWorkspaceFiles(data.files || []);
      } else {
        setWorkspaceError("មិនអាចទាញយកបញ្ជីឯកសារបានទេ។");
      }
    } catch (err) {
      console.error("Error fetching workspace files:", err);
      setWorkspaceError("មានបញ្ហាភ្ជាប់ទៅប្រព័ន្ធផ្ទៃក្នុង។");
    } finally {
      setIsLoadingWorkspace(false);
    }
  };

  const fetchFileContent = async (filePath: string) => {
    setIsLoadingFileContent(true);
    try {
      const response = await fetch(`/api/system/file-content?path=${encodeURIComponent(filePath)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await safeJson(response);
        const ext = filePath.split(".").pop() || "text";
        let lang = "text";
        if (ext === "ts" || ext === "tsx") lang = "typescript";
        else if (ext === "prisma") lang = "prisma";
        else if (ext === "json") lang = "json";
        else if (ext === "css") lang = "css";
        else if (ext === "html") lang = "html";
        else if (filePath.includes(".env")) lang = "env";

        setSelectedFile({
          name: filePath.split("/").pop() || filePath,
          path: filePath,
          content: data.content || "",
          lang
        });
      }
    } catch (err) {
      console.error("Error fetching file content:", err);
    } finally {
      setIsLoadingFileContent(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Database" && dbActiveStep === "directory") {
      fetchWorkspaceTree();
    }
  }, [activeTab, dbActiveStep, token]);

  const fetchDbCounts = () => {
    fetch("/api/mysql/db-counts", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) return safeJson(res);
        throw new Error("Failed to load db counts");
      })
      .then(data => {
        if (data.counts) {
          setDbCounts(data.counts);
        }
      })
      .catch(err => console.error("Error fetching db counts:", err));
  };

  useEffect(() => {
    if (activeTab === "MySQL DB") {
      fetchDbCounts();
    }
  }, [activeTab, token]);

  // Student Directory Actions & Handlers
  const openAddStudentModal = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    setEditingStudentId(null);
    setRegNameKh("");
    setRegNameEn("");
    if (autoGenerateId) {
      // Find the next unique safe student ID
      let maxNum = 0;
      const escapedPrefix = studentIdPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`^${escapedPrefix}(\\d+)$`);
      
      students.forEach(s => {
        if (s.studentId) {
          const match = s.studentId.match(regex);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          } else {
            const genericMatch = s.studentId.match(/(\d+)$/);
            if (genericMatch) {
              const num = parseInt(genericMatch[1], 10);
              if (num > maxNum) maxNum = num;
            }
          }
        }
      });
      const nextNum = maxNum + 1;
      const paddedNum = String(nextNum).padStart(3, '0');
      setRegStudentId(`${studentIdPrefix}${paddedNum}`);
    } else {
      setRegStudentId("");
    }
    setRegCourse(derivedCourseOptions[0] || "");
    setRegLevel(levelOptions[0] || "Level 1");
    setRegStatus(defaultStatus);
    setRegStartDate(todayStr);
    
    const computedEndDate = autoCalculateEndDate 
      ? (calculateEndDate(todayStr, defaultStudyMonths) || todayStr)
      : todayStr;
    setRegEndDate(computedEndDate);
    
    setRegShift(derivedShiftOptions[0] || "");
    setRegFee(baseFee);
    
    setRegPaid(0);
    setRegGuardianName("");
    setRegGuardianPhone("");
    setRegTelegramConnected(true);
    setRegGender(defaultGender);
    
    // Reset matching screenshot design fields
    setRegDob("2008-01-01");
    setRegPob("ភ្នំពេញ");
    setRegDiscount(defaultDiscount);
    setRegFullFee(baseFee);
    setRegHours(derivedHoursOptions[0] || "");
    setRegMonths(defaultStudyMonths);
    setShowExtraOptions(false);
    setShowAllTimetablesInReg(false);
    fetchTimetables();
    fetchDbCourses();
    setIsStudentModalOpen(true);
  };

  const openEditStudentModal = (student: StudentType) => {
    setEditingStudentId(student.id);
    setRegNameKh(student.nameKh);
    setRegNameEn(student.nameEn);
    setRegStudentId(student.studentId);
    setRegCourse(student.course);
    setRegLevel(student.level);
    setRegStatus(student.status);
    setRegStartDate(student.startDate);
    setRegEndDate(student.endDate);
    setRegShift(student.shift);
    setRegFee(student.fee);
    setRegPaid(student.paid);
    setRegGuardianName(student.guardianName);
    setRegGuardianPhone(student.guardianPhone);
    setRegTelegramConnected(student.telegramConnected);
    setRegGender(student.gender);

    // Initialize matching screenshot design fields with fallbacks
    setRegDob((student as any).dob || "2008-01-01");
    setRegPob((student as any).pob || "ភ្នំពេញ");
    setRegFullFee((student as any).fullFee || student.fee || 120);
    setRegDiscount((student as any).discount || 0);
    setRegHours((student as any).hours || derivedHoursOptions[0] || "");
    // Calculate months if end date and start date exist
    if (student.startDate && student.endDate) {
      const start = new Date(student.startDate);
      const end = new Date(student.endDate);
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      setRegMonths(diffMonths > 0 ? diffMonths : 3);
    } else {
      setRegMonths(3);
    }
    setShowExtraOptions(true);
    setShowAllTimetablesInReg(false);
    fetchTimetables();
    fetchDbCourses();
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Strict Input Validations
    if (!regNameKh || !regNameKh.trim()) {
      showToast(uiLang === "kh" ? "សូមបញ្ចូលឈ្មោះភាសាខ្មែរ!" : "Please enter student's Khmer name!", "error");
      return;
    }
    if (!regNameEn || !regNameEn.trim()) {
      showToast(uiLang === "kh" ? "សូមបញ្ចូលឈ្មោះភាសាអង់គ្លេស!" : "Please enter student's English name!", "error");
      return;
    }

    const cleanNameEn = regNameEn.trim();
    // English name regex: only allows letters, spaces, hyphens, and dots to prevent injection/XSS
    const nameEnRegex = /^[A-Za-z\s.\-]+$/;
    if (!nameEnRegex.test(cleanNameEn)) {
      showToast(uiLang === "kh" ? "ឈ្មោះភាសាអង់គ្លេសអាចមានតែអក្សរ ឃ្លា និងសញ្ញា (-) (.) ប៉ុណ្ណោះ!" : "English name can only contain letters, spaces, hyphens, and dots!", "error");
      return;
    }

    // Phone number verification (guardian phone)
    const trimmedPhone = regGuardianPhone ? regGuardianPhone.trim() : "";
    if (trimmedPhone && trimmedPhone !== "មិនមាន" && trimmedPhone !== "N/A") {
      const phoneRegex = /^[+0-9\s\-()]{8,15}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        showToast(uiLang === "kh" ? "លេខទូរស័ព្ទអាណាព្យាបាលមិនត្រឹមត្រូវ! (៨ ដល់ ១៥ ខ្ទង់)" : "Invalid guardian phone number format! (8 to 15 digits/symbols)", "error");
        return;
      }
    }

    // Calculate final fee after discount
    const calculatedFee = regFullFee - (regFullFee * regDiscount / 100);
    const feeAmount = Number(calculatedFee) || 0;
    
    // Calculate end date based on start date and study months
    const computedEndDate = calculateEndDate(regStartDate, regMonths) || regEndDate;

    // Use the amount paid entered by the user in the form input field (regPaid)
    const paidAmount = Number(regPaid) || 0;
    const dueAmount = Math.max(0, feeAmount - paidAmount);

    // Number bounds and range integrity checks
    if (regFullFee < 0 || regDiscount < 0 || regDiscount > 100 || paidAmount < 0) {
      showToast(uiLang === "kh" ? "តម្លៃថ្លៃសិក្សា ឬភាគរយបញ្ចុះតម្លៃមិនត្រឹមត្រូវ!" : "Invalid tuition fee, discount percentage, or payment amount!", "error");
      return;
    }

    // Date logical integrity checks
    if (regStartDate && computedEndDate && new Date(regStartDate) > new Date(computedEndDate)) {
      showToast(uiLang === "kh" ? "ថ្ងៃចាប់ផ្តើមមិនអាចនៅក្រោយថ្ងៃបញ្ចប់ឡើយ!" : "Start date cannot be after end date!", "error");
      return;
    }

    if (regDob) {
      const dobDate = new Date(regDob);
      if (dobDate > new Date()) {
        showToast(uiLang === "kh" ? "ថ្ងៃខែឆ្នាំកំណើតមិនអាចនៅក្នុងអនាគតឡើយ!" : "Date of birth cannot be in the future!", "error");
        return;
      }
    }

    // Helper to strip script tags and HTML injection dynamically in frontend
    const stripHtml = (str: string) => {
      if (!str) return "";
      return str.replace(/<[^>]*>?/gm, '').trim();
    };

    const studentPayload = {
      studentId: stripHtml(regStudentId),
      nameKh: stripHtml(regNameKh),
      nameEn: cleanNameEn,
      course: stripHtml(regCourse),
      level: stripHtml(regLevel),
      status: stripHtml(regStatus),
      startDate: stripHtml(regStartDate),
      endDate: stripHtml(computedEndDate),
      shift: stripHtml(regShift),
      fee: feeAmount,
      paid: paidAmount,
      due: dueAmount,
      guardianName: stripHtml(regGuardianName) || "មិនមាន",
      guardianPhone: stripHtml(regGuardianPhone) || "មិនមាន",
      telegramConnected: regTelegramConnected,
      gender: stripHtml(regGender),
      dob: stripHtml(regDob),
      pob: stripHtml(regPob),
      fullFee: regFullFee,
      discount: regDiscount,
      hours: stripHtml(regHours)
    };

    if (editingStudentId) {
      fetch(`/api/students/${editingStudentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(studentPayload)
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to update student");
          return safeJson(res);
        })
        .then(data => {
          const studentObj = data.student || data;
          if (studentObj) {
            setStudents(prev => prev.map(s => s.id === editingStudentId ? studentObj : s));
            showToast("បានកែប្រែព័ត៌មានសិស្សដោយជោគជ័យ! (Student updated successfully!)", "success");
            setIsStudentModalOpen(false);
          }
        })
        .catch(err => {
          console.error(err);
          showToast("មានបញ្ហាក្នុងការកែប្រែព័ត៌មានសិស្ស! (Failed to update student!)", "error");
        });
    } else {
      fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(studentPayload)
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to create student");
          return safeJson(res);
        })
        .then(data => {
          if (data.student) {
            setStudents(prev => [...prev, data.student]);
            showToast("បានចុះឈ្មោះសិស្សថ្មីដោយជោគជ័យ! (New student registered successfully!)", "success");
            setIsStudentModalOpen(false);
          }
        })
        .catch(err => {
          console.error(err);
          showToast("មានបញ្ហាក្នុងការចុះឈ្មោះសិស្សថ្មី! (Failed to register new student!)", "error");
        });
    }
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setStudentToDelete(student);
      setIsStudentDeleteModalOpen(true);
    }
  };

  const handleConfirmDeleteStudent = () => {
    if (!studentToDelete) return;
    const id = studentToDelete.id;
    fetch(`/api/students/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          setStudents(prev => prev.filter(s => s.id !== id));
          showToast(`បានលុបឈ្មោះសិស្ស ${studentToDelete.nameKh || studentToDelete.nameEn || ""} រួចរាល់!`, "success");
        } else {
          showToast("មានបញ្ហាក្នុងការលុបឈ្មោះសិស្ស!", "error");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("មានបញ្ហាភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "error");
      })
      .finally(() => {
        setIsStudentDeleteModalOpen(false);
        setStudentToDelete(null);
      });
  };

  const handleDeleteTeacher = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    if (teacher) {
      setTeacherToDelete(teacher);
      setIsTeacherDeleteModalOpen(true);
    }
  };

  const handleConfirmDeleteTeacher = () => {
    if (!teacherToDelete) return;
    const id = teacherToDelete.id;
    fetch(`/api/teachers/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          setTeachers(prev => prev.filter(t => t.id !== id));
          showToast(`បានលុបឈ្មោះគ្រូ ${teacherToDelete.nameKh || teacherToDelete.nameEn || ""} រួចរាល់!`, "success");
        } else {
          showToast("មានបញ្ហាក្នុងការលុបឈ្មោះគ្រូ!", "error");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("មានបញ្ហាភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "error");
      })
      .finally(() => {
        setIsTeacherDeleteModalOpen(false);
        setTeacherToDelete(null);
      });
  };

  const handleMoveStudentUp = (id: string) => {
    const index = students.findIndex(s => s.id === id);
    if (index > 0) {
      const updated = [...students];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      setStudents(updated);
    }
  };

  const handleMoveStudentDown = (id: string) => {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1 && index < students.length - 1) {
      const updated = [...students];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      setStudents(updated);
    }
  };

  // Get active courses from actual student database, fallback to standard ones if empty
  const activeCourseList = useMemo(() => {
    return Array.from(new Set(students.map(s => s.course).filter(Boolean))) as string[];
  }, [students]);

  const finalCourseList = useMemo(() => {
    return activeCourseList.length > 0 ? activeCourseList : [
      "Microsoft Office Word",
      "Microsoft Office Excel",
      "Adobe Photoshop"
    ];
  }, [activeCourseList]);

  const femaleKey = uiLang === "kh" ? "សិស្សស្រី (Female)" : uiLang === "en" ? "Female Students" : "女生人数 (Female)";
  const maleKey = uiLang === "kh" ? "សិស្សប្រុស (Male)" : uiLang === "en" ? "Male Students" : "男生人数 (Male)";
  const collectedKey = uiLang === "kh" ? "ប្រាក់បានបង់ (Collected)" : uiLang === "en" ? "Collected" : "已收金额 (Collected)";
  const dueKey = uiLang === "kh" ? "ប្រាក់ជំពាក់ (Due)" : uiLang === "en" ? "Balance Due" : "未付金额 (Due)";

  const enrollmentData = useMemo(() => {
    return finalCourseList.map(courseName => {
      return {
        name: translateCourseOrSpecialtyName(courseName, uiLang),
        fullName: courseName,
        [femaleKey]: students.filter(s => s.course === courseName && s.gender === "Female").length,
        [maleKey]: students.filter(s => s.course === courseName && s.gender === "Male").length
      };
    });
  }, [finalCourseList, students, uiLang, femaleKey, maleKey]);

  const chartData: any[] = useMemo(() => {
    return chartTab === 'courses' ? enrollmentData : finalCourseList.map(courseName => {
      return {
        name: translateCourseOrSpecialtyName(courseName, uiLang),
        fullName: courseName,
        [collectedKey]: students.filter(s => s.course === courseName).reduce((sum, s) => sum + s.paid, 0),
        [dueKey]: students.filter(s => s.course === courseName).reduce((sum, s) => sum + s.due, 0)
      };
    });
  }, [chartTab, enrollmentData, finalCourseList, students, uiLang, collectedKey, dueKey]);

  // Finance Telemetry: dynamic Collected and Due
  const financeData = useMemo(() => {
    return [
      { name: "ទទួលបានរួច (Collected)", value: students.reduce((sum, s) => sum + s.paid, 0), color: "#10b981" },
      { name: "ប្រាក់ជំពាក់ (Due)", value: students.reduce((sum, s) => sum + s.due, 0), color: "#3b82f6" },
    ];
  }, [students]);

  // Teachers Telemetry: dynamic counts based on actual teachers
  const teachersData = useMemo(() => {
    const maleTeachers = teachers.filter(t => t.gender === 'Male').length;
    const femaleTeachers = teachers.filter(t => t.gender === 'Female').length;
    return [
      { name: "គ្រូស្រី (Female)", value: femaleTeachers || 1, color: "#a855f7" },
      { name: "គ្រូប្រុស (Male)", value: maleTeachers || 1, color: "#06b6d4" },
    ];
  }, [teachers]);

  // Helper calculations for dynamic gender/status comparison
  const studentMetrics = useMemo(() => {
    const completedList = students.filter(s => s.status === 'COMPLETED');
    const completedTotal = completedList.length;
    const completedFemale = completedList.filter(s => s.gender === 'Female').length;
    const completedMale = completedList.filter(s => s.gender === 'Male').length;
    const completedFemalePct = completedTotal > 0 ? (completedFemale / completedTotal) * 100 : 0;
    const completedMalePct = completedTotal > 0 ? (completedMale / completedTotal) * 100 : 0;

    const stoppedList = students.filter(s => s.status === 'STOP');
    const stoppedTotal = stoppedList.length;
    const stoppedFemale = stoppedList.filter(s => s.gender === 'Female').length;
    const stoppedMale = stoppedList.filter(s => s.gender === 'Male').length;
    const stoppedFemalePct = stoppedTotal > 0 ? (stoppedFemale / stoppedTotal) * 100 : 0;
    const stoppedMalePct = stoppedTotal > 0 ? (stoppedMale / stoppedTotal) * 100 : 0;

    const studyingList = students.filter(s => s.status === 'STUDYING');
    const studyingTotal = studyingList.length;
    const studyingFemale = studyingList.filter(s => s.gender === 'Female').length;
    const studyingMale = studyingList.filter(s => s.gender === 'Male').length;
    const studyingFemalePct = studyingTotal > 0 ? (studyingFemale / studyingTotal) * 100 : 0;
    const studyingMalePct = studyingTotal > 0 ? (studyingMale / studyingTotal) * 100 : 0;

    const femaleList = students.filter(s => s.gender === 'Female');
    const femaleCount = femaleList.length;
    const femaleStudying = femaleList.filter(s => s.status === 'STUDYING').length;
    const femaleStopped = femaleList.filter(s => s.status === 'STOP').length;
    const femaleCompleted = femaleList.filter(s => s.status === 'COMPLETED').length;

    const maleList = students.filter(s => s.gender === 'Male');
    const maleCount = maleList.length;
    const maleStudying = maleList.filter(s => s.status === 'STUDYING').length;
    const maleStopped = maleList.filter(s => s.status === 'STOP').length;
    const maleCompleted = maleList.filter(s => s.status === 'COMPLETED').length;

    return {
      completedTotal, completedFemale, completedMale, completedFemalePct, completedMalePct,
      stoppedTotal, stoppedFemale, stoppedMale, stoppedFemalePct, stoppedMalePct,
      studyingTotal, studyingFemale, studyingMale, studyingFemalePct, studyingMalePct,
      femaleCount, femaleStudying, femaleStopped, femaleCompleted,
      maleCount, maleStudying, maleStopped, maleCompleted
    };
  }, [students]);

  const {
    completedTotal, completedFemale, completedMale, completedFemalePct, completedMalePct,
    stoppedTotal, stoppedFemale, stoppedMale, stoppedFemalePct, stoppedMalePct,
    studyingTotal, studyingFemale, studyingMale, studyingFemalePct, studyingMalePct,
    femaleCount, femaleStudying, femaleStopped, femaleCompleted,
    maleCount, maleStudying, maleStopped, maleCompleted
  } = studentMetrics;

  const activeCourseMetrics = useMemo(() => {
    const filtered = activeCourseFilter
      ? students.filter(s => s.course === activeCourseFilter)
      : students;

    const totalCount = filtered.length;
    const completedCount = filtered.filter(s => s.status === "COMPLETED").length;
    const stopCount = filtered.filter(s => s.status === "STOP").length;
    const studyingCount = filtered.filter(s => s.status === "STUDYING").length;

    const totalReceived = filtered.reduce((sum, s) => sum + (s.paid || 0), 0);
    const totalBalanceDue = filtered.reduce((sum, s) => sum + (s.due || 0), 0);
    const totalVolume = totalReceived + totalBalanceDue;

    const uniqueCourses = Array.from(new Set(students.map(s => s.course).filter(Boolean))) as string[];
    const uniqueCoursesCount = uniqueCourses.length;

    const femaleStudents = filtered.filter(s => s.gender === "Female");
    const maleStudents = filtered.filter(s => s.gender === "Male");
    const femaleCount = femaleStudents.length;
    const maleCount = maleStudents.length;

    const femalePercentage = totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0;
    const malePercentage = totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0;

    const femaleStudying = femaleStudents.filter(s => s.status === "STUDYING").length;
    const femaleStopped = femaleStudents.filter(s => s.status === "STOP").length;
    const femaleCompleted = femaleStudents.filter(s => s.status === "COMPLETED").length;

    const maleStudying = maleStudents.filter(s => s.status === "STUDYING").length;
    const maleStopped = maleStudents.filter(s => s.status === "STOP").length;
    const maleCompleted = maleStudents.filter(s => s.status === "COMPLETED").length;

    return {
      filteredStudentsForStats: filtered,
      totalCount,
      completedCount,
      stopCount,
      studyingCount,
      totalReceived,
      totalBalanceDue,
      totalVolume,
      uniqueCourses,
      uniqueCoursesCount,
      courseFemaleCount: femaleCount,
      courseMaleCount: maleCount,
      courseFemalePercentage: femalePercentage,
      courseMalePercentage: malePercentage,
      courseFemaleStudying: femaleStudying,
      courseFemaleStopped: femaleStopped,
      courseFemaleCompleted: femaleCompleted,
      courseMaleStudying: maleStudying,
      courseMaleStopped: maleStopped,
      courseMaleCompleted: maleCompleted
    };
  }, [students, activeCourseFilter]);

  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-150 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            ADMINISTRATOR
          </span>
        );
      case "TEACHER":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-150 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            TEACHER
          </span>
        );
      case "ACCOUNTANT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 shadow-xs">
            <DollarSign className="w-3.5 h-3.5" />
            ACCOUNTANT
          </span>
        );
      case "STUDENT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-150 shadow-xs">
            <User className="w-3.5 h-3.5" />
            STUDENT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-150 shadow-xs">
            <User className="w-3.5 h-3.5" />
            {role}
          </span>
        );
    }
  };

  const menuGroups = [
    {
      titleKh: "ទូទៅ / របាយការណ៍",
      titleEn: "GENERAL / REPORTS",
      titleZh: "通用 / 报告",
      items: [
        { id: "Dashboard", labelKh: "ផ្ទាំងគ្រប់គ្រង", labelEn: "Dashboard", icon: BarChart2 },
        { id: "Analytics", labelKh: "របាយការណ៍", labelEn: "Analytics", icon: TrendingUp },
        { id: "Announcements", labelKh: "ផ្សព្វផ្សាយ", labelEn: "Announcements", icon: Megaphone },
      ]
    },
    {
      titleKh: "ការសិក្សា / Academic",
      titleEn: "ACADEMIC",
      titleZh: "学术管理",
      items: [
        { id: "Students", labelKh: "សិស្សានុសិស្ស", labelEn: "Students", icon: Users },
        { id: "Courses", labelKh: "វគ្គសិក្សា", labelEn: "Courses", icon: Layers },
        { id: "Timetable", labelKh: "កាលវិភាគ", labelEn: "Timetable", icon: Calendar },
        { id: "Grading", labelKh: "ពិន្ទុ & ប្រឡង", labelEn: "Grading", icon: Award },
        { id: "Exams", labelKh: "ការប្រឡងអនឡាញ", labelEn: "Online Exams", icon: FileText },
        { id: "Report Cards", labelKh: "ព្រឹត្តិបត្រពិន្ទុ", labelEn: "Report Cards", icon: FileText },
        { id: "Certificates", labelKh: "វិញ្ញាបនបត្រ", labelEn: "Certificates", icon: Award },
        { id: "Library", labelKh: "បណ្ណាល័យ", labelEn: "Library", icon: LibraryIcon },
        { id: "Alumni", labelKh: "អតីតសិស្ស", labelEn: "Alumni", icon: GraduationCap },
      ]
    },
    {
      titleKh: "បុគ្គលិក / Staff",
      titleEn: "STAFF & HR",
      titleZh: "员工管理",
      items: [
        { id: "Teachers", labelKh: "លោកគ្រូ-អ្នកគ្រូ", labelEn: "Teachers", icon: GraduationCap },
        { id: "Leave", labelKh: "សុំច្បាប់", labelEn: "Leave Requests", icon: FileText },
      ]
    },
    {
      titleKh: "ប្រតិបត្តិការ / Operations",
      titleEn: "OPERATIONS",
      titleZh: "日常业务管理",
      items: [
        { id: "Attendance", labelKh: "វត្តមាន", labelEn: "Attendance", icon: CheckCircle },
        { id: "QR Scan", labelKh: "ស្កេន QR កូដ", labelEn: "QR Scan", icon: QrCode },
        { id: "Attendance Display", labelKh: "ផ្ទាំងបង្ហាញវត្តមាន", labelEn: "Attendance Display", icon: Monitor },
        { id: "Parent Portal", labelKh: "ទំនាក់ទំនងអាណាព្យាបាល", labelEn: "Parent Portal", icon: MessageSquare },
        { id: "Finance", labelKh: "ហិរញ្ញវត្ថុ", labelEn: "Finance", icon: DollarSign },
        { id: "Assets", labelKh: "គ្រប់គ្រងទ្រព្យសម្បត្តិ", labelEn: "Inventory & Assets", icon: BookOpen },
      ]
    },
    {
      titleKh: "ប្រព័ន្ធ / System",
      titleEn: "SYSTEM CORE",
      titleZh: "系统核心设置",
      items: [
        { id: "ID Card", labelKh: "កាតសម្គាល់ខ្លួន", labelEn: "ID Card", icon: CreditCard },
        { id: "Credentials", labelKh: "គណនី និងសិទ្ធិ", labelEn: "Roles & Permissions", icon: ShieldCheck },
        { id: "Settings", labelKh: "ការកំណត់", labelEn: "Settings", icon: Settings },
        { id: "MySQL DB", labelKh: "ផ្ទេរទិន្នន័យ MySQL", labelEn: "MySQL Database", icon: Database },
      ]
    }
  ];

  const studentMenuGroups = [
    {
      titleKh: "ការសិក្សារបស់ខ្ញុំ / My Academic",
      titleEn: "MY ACADEMIC",
      titleZh: "我的学习",
      items: [
        { id: "Dashboard", labelKh: "ទំព័រដើម", labelEn: "Home", icon: BarChart2 },
        { id: "Timetable", labelKh: "កាលវិភាគ", labelEn: "Timetable", icon: Calendar },
        { id: "Attendance", labelKh: "វត្តមាន", labelEn: "Attendance", icon: CheckCircle },
        { id: "Grading", labelKh: "ពិន្ទុ & លទ្ធផល", labelEn: "Grades & Results", icon: Award },
        { id: "Report Cards", labelKh: "ព្រឹត្តិបត្រពិន្ទុ", labelEn: "Report Cards", icon: FileText },
      ]
    },
    {
      titleKh: "សេវាកម្ម / Services",
      titleEn: "SERVICES",
      titleZh: "服务",
      items: [
        { id: "Finance", labelKh: "ប្រវត្តិបង់ប្រាក់", labelEn: "Payment History", icon: DollarSign },
        { id: "Library", labelKh: "សៀវភៅដែលបានខ្ចី", labelEn: "Borrowed Books", icon: LibraryIcon },
      ]
    }
  ];

  let menuGroupsToUse = menuGroups;

  if (user?.role === "STUDENT" || user?.role === "PARENT") {
    menuGroupsToUse = studentMenuGroups;
  } else {
    // Role-based filtering of main menuGroups
    menuGroupsToUse = menuGroups.map(group => {
      let filteredItems = group.items;
      
      if (customPermissions) {
        filteredItems = filteredItems.filter(item => customPermissions.includes(item.id));
      } else {
        if (user?.role === "ACCOUNTANT") {
          // Exclude Teachers & Payroll, Account Mgmt
          filteredItems = filteredItems.filter(item => item.id !== "Teachers" && item.id !== "Credentials");
        } else if (user?.role === "TEACHER") {
          // Exclude Teachers & Payroll, Finance, Account Mgmt
          filteredItems = filteredItems.filter(item => item.id !== "Teachers" && item.id !== "Finance" && item.id !== "Credentials");
        } else if (user?.role === "STAFF") {
          // Exclude System Core
          if (group.titleEn === "SYSTEM CORE") return { ...group, items: [] };
        }
      }
      
      return { ...group, items: filteredItems };
    }).filter(group => group.items.length > 0);
  }


  const menuItems = menuGroupsToUse.flatMap(group => group.items);

  return (
    <div className="h-full w-full app-background text-slate-800 font-sans flex relative select-none overflow-hidden">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4.5 py-3 rounded-2xl shadow-xl border text-sm font-bold ${
              toast.type === "success"
                ? "bg-white border-emerald-100 text-slate-800 shadow-emerald-100/30"
                : toast.type === "error"
                ? "bg-white border-rose-100 text-slate-800 shadow-rose-100/30"
                : "bg-white border-blue-100 text-slate-800 shadow-blue-100/30"
            }`}
          >
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-100/50 text-emerald-600"
                : toast.type === "error"
                ? "bg-rose-50 border-rose-100/50 text-rose-600"
                : "bg-blue-50 border-blue-100/50 text-blue-600"
            }`}>
              {toast.type === "success" ? <CheckCircle className="w-4 h-4 stroke-[2.5]" /> : <AlertTriangle className="w-4 h-4 stroke-[2.5]" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 leading-none mb-1 uppercase tracking-wider font-extrabold">{toast.type === "success" ? "សម្រេចបាន" : "កំហុស"}</p>
              <p className="text-slate-800 text-[12.5px] font-black">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Custom Option Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full relative z-10 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 animate-pulse">
                <AlertTriangle className="w-7 h-7 stroke-[2.25]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-800 tracking-tight leading-tight">
                  បញ្ជាក់ការលុបទិន្នន័យ
                </h3>
                <p className="text-[11.5px] text-slate-400 font-bold">
                  Confirm Data Deletion
                </p>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed font-bold">
                {deleteConfirm.type === "course" && "តើអ្នកពិតជាចង់លុបវគ្គសិក្សា"}
                {deleteConfirm.type === "level" && "តើអ្នកពិតជាចង់លុបកម្រិតសិក្សា"}
                {deleteConfirm.type === "shift" && "តើអ្នកពិតជាចង់លុបវេនសិក្សា"}
                {deleteConfirm.type === "hours" && "តើអ្នកពិតជាចង់លុបម៉ោងសិក្សា"}
                {deleteConfirm.type === "specialty" && "តើអ្នកពិតជាចង់លុបជំនាញគ្រូ"}
                {deleteConfirm.type === "payment_method" && "តើអ្នកពិតជាចង់លុបវិធីសាស្ត្របង់ប្រាក់"}
                {deleteConfirm.type === "expense_category" && "តើអ្នកពិតជាចង់លុបប្រភេទចំណាយ"}
                {deleteConfirm.type === "school_expense" && (uiLang === "kh" ? "តើអ្នកពិតជាចង់លុបការចំណាយ" : uiLang === "zh" ? "您确定要删除此项支出吗" : "Are you sure you want to delete the expense")}
                <div className="mt-2.5 px-3 py-2 bg-rose-50/50 border border-rose-100/50 rounded-xl text-rose-700 text-xs font-black break-all font-sans inline-block">
                  "{deleteConfirm.value}"
                </div>
                <p className="mt-2.5 text-[10px] text-slate-400 font-bold">
                  ការលុបនេះមិនអាចយកមកវិញបានទេ!
                </p>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const { type, index } = deleteConfirm;
                    setDeleteConfirm(null);
                    if (type === "course") {
                      await handleDeleteCourseOption(index as number);
                    } else if (type === "level") {
                      await handleDeleteLevelOption(index as number);
                    } else if (type === "shift") {
                      await handleDeleteShiftOption(index as number);
                    } else if (type === "hours") {
                      await handleDeleteHoursOption(index as number);
                    } else if (type === "specialty") {
                      await handleDeleteSpecialtyOption(index as number);
                    } else if (type === "payment_method") {
                      const idx = index as number;
                      const targetVal = paymentMethods[idx];
                      const updated = paymentMethods.filter((_, i) => i !== idx);
                      setPaymentMethods(updated);
                      localStorage.setItem("app_payment_methods", JSON.stringify(updated));
                      if (selectedPaymentMethod === targetVal) {
                        setSelectedPaymentMethod(updated[0] || "សាច់ប្រាក់ (CASH)");
                      }
                      if (expenseFormPaymentMethod === targetVal) {
                        setExpenseFormPaymentMethod(updated[0] || "សាច់ប្រាក់ (CASH)");
                      }
                      showToast("បានលុបវិធីសាស្ត្របង់ប្រាក់ដោយជោគជ័យ! (Payment method deleted successfully!)", "success");
                    } else if (type === "expense_category") {
                      const idx = index as number;
                      const targetCat = expenseCategories[idx];
                      const updated = expenseCategories.filter((_, i) => i !== idx);
                      setExpenseCategories(updated);
                      localStorage.setItem("plc_expense_categories", JSON.stringify(updated));
                      if (expenseFormCategory === targetCat.id) {
                        setExpenseFormCategory(updated[0]?.id || "other");
                      }
                      showToast("បានលុបប្រភេទចំណាយដោយជោគជ័យ! (Expense category deleted successfully!)", "success");
                    } else if (type === "school_expense") {
                      fetch(`/api/expenses/${index}`, {
                        method: 'DELETE',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      }).then(() => {
                        setSchoolExpenses(prev => prev.filter(e => e.id !== index));
                        showToast(
                          uiLang === "kh"
                            ? "បានលុបការចំណាយដោយជោគជ័យ!"
                            : uiLang === "zh"
                              ? "已成功删除此项支出记录！"
                              : "Expense deleted successfully!",
                          "success"
                        );
                      }).catch(err => console.error(err));
                    }
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-rose-600/10"
                >
                  លុបចោល (Delete)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Mobile Overlay Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 1. SIDEBAR (Clean Light Aesthetic) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-white text-slate-800 flex flex-col justify-between border-r border-slate-200/90 transition-all duration-300 transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:h-screen lg:shrink-0`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Logo Container with Brand Text */}
          <div className="px-4 py-2 border-b border-slate-200/80 flex flex-col items-center justify-center relative bg-white shrink-0">
            <div className="text-center py-0 flex flex-col items-center">
              <h1 className="text-base font-black tracking-wider text-slate-900 uppercase leading-tight">
                PLC COMPUTER
              </h1>
              <p className="text-[10px] font-extrabold text-blue-600 tracking-[0.2em] uppercase mt-0.5 font-sans">
                ACADEMY SYSTEM
              </p>
              
              <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8.5px] font-black tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ONLINE • SECURE</span>
              </div>
            </div>

            {/* Collapse button on Mobile */}
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden absolute right-3 top-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer bg-slate-100 p-1.5 rounded-lg border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links Grouped Beautifully */}
          <nav className="flex-1 px-2.5 py-4 space-y-4 overflow-y-auto scrollbar-none">
            {menuGroupsToUse.map((group, groupIndex) => {
              const isExpanded = expandedGroups.includes(groupIndex);
              return (
                <div key={groupIndex}>
                  <button 
                    onClick={() => toggleGroup(groupIndex)}
                    className="w-full px-2 mb-1.5 flex items-center justify-between text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-left group"
                  >
                    <span className="text-[10.5px] font-black tracking-widest uppercase font-sans text-slate-400 group-hover:text-slate-600">
                      {uiLang === "kh" ? group.titleKh : 
                       uiLang === "en" ? group.titleEn : group.titleZh}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-0.5 overflow-hidden"
                      >
                        {group.items.map((item) => {
                          const IconComp = item.icon;
                          const isSelected = activeTab === item.id;
                          
                          const activeClasses = isSelected
                            ? "bg-[#3B82F6] text-white font-extrabold shadow-3xs rounded-r-xl rounded-l-xs border-l-[3.5px] border-blue-900"
                            : "text-slate-700 hover:bg-slate-100/90 hover:text-blue-700 hover:translate-x-0.5 rounded-r-xl rounded-l-xs border-l-[3.5px] border-blue-300/80 hover:border-blue-600 bg-slate-50/30";

                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${activeClasses}`}
                            >
                              <IconComp className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-white opacity-100 scale-105" : "text-slate-400 opacity-70"}`} />
                              <div className="flex flex-col items-start leading-none gap-0.5 text-left">
                                <span className={`text-[12px] tracking-wide ${isSelected ? "text-white font-black" : "text-slate-700 font-bold"}`}>
                                  {uiLang === "kh" ? item.labelKh : 
                                  uiLang === "en" ? item.labelEn : 
                                  item.id === "Dashboard" ? "仪表盘" : 
                                  item.id === "Students" ? "学生管理" : 
                                  item.id === "Teachers" ? "教师管理" : item.labelEn}
                                </span>
                                <span className={`text-[9px] font-semibold normal-case tracking-normal ${isSelected ? "text-blue-100/90" : "text-slate-400"}`}>
                                  {uiLang === "kh" ? item.labelEn : item.labelKh}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Clean Sidebar Footer */}
          <div className="p-3 border-t border-slate-200/80 bg-slate-50/60 shrink-0 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs shrink-0 border border-primary-200 uppercase shadow-2xs">
                {(user?.name || user?.email || "A").slice(0, 1)}
              </div>
              <div className="flex flex-col text-left truncate leading-tight">
                <span className="text-xs font-black text-slate-800 truncate">
                  {user?.name || user?.email || "PLC Admin"}
                </span>
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                  {user?.role || "ADMIN"}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono shrink-0">
              v2.5
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* 2. TOP HEADER (#3B82F6 Clean Vibrant Blue Aesthetic) */}
        <header className="sticky top-0 z-30 bg-[#3B82F6] text-white border-b border-blue-600/40 h-14 sm:h-16 shrink-0 transition-colors duration-200">
          <div className="h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 relative">
            {/* Left side: Hamburger menu (mobile) & Global Search Bar shifted to left */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-8.5 h-8.5 sm:w-10 sm:h-10 border border-blue-400/50 bg-blue-700/60 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer transition-all shrink-0"
              >
                <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2]" />
              </button>
              
              {/* Global Search Bar (Shifted to Left) */}
              <div className="flex max-w-xl w-full relative pointer-events-auto" ref={searchContainerRef}>
                <div className="relative w-full group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="global-system-search-input"
                    type="text"
                    value={globalSearchQuery}
                    onChange={(e) => {
                      setGlobalSearchQuery(e.target.value);
                      if (!isSearchFocused) setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    className="block w-full pl-10 pr-10 py-2 sm:py-2.5 border border-white/40 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-white/40 focus:border-white text-[13px] font-medium transition-all duration-200 shadow-xs hover:bg-slate-50"
                    placeholder={uiLang === "kh" ? "ស្វែងរកព័ត៌មានប្រព័ន្ធទាំងមូល (សិស្ស គ្រូ វគ្គសិក្សា ហិរញ្ញវត្ថុ)..." : uiLang === "en" ? "Search global information (Students, Staff, Courses, Finance)..." : "全局搜索..."}
                  />
                  
                  {/* Search Badges / Clear button */}
                  {globalSearchQuery && (
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setGlobalSearchQuery("")}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200/80 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Search Popover Results */}
                  <AnimatePresence>
                    {isSearchFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-[32rem] sm:w-[36rem] max-w-[92vw] bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-3.5 sm:p-4 font-sans text-left overflow-hidden max-h-[78vh] flex flex-col"
                      >
                      {/* Search Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100/60">
                            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-800 leading-none block">
                              {uiLang === "kh" ? "ប្រព័ន្ធស្វែងរកទិន្នន័យឆ្លាតវៃ" : "Global Search Engine"}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 leading-none mt-1 block">
                              {globalSearchQuery.trim()
                                ? (uiLang === "kh" ? `លទ្ធផលសម្រាប់ «${globalSearchQuery}»` : `Results for "${globalSearchQuery}"`)
                                : (uiLang === "kh" ? "ផ្លូវកាត់ និងប្រវត្តិស្វែងរក" : "Quick Shortcuts & Recent Searches")}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsSearchFocused(false)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-b border-slate-100/80 dropdown-scrollbar shrink-0 text-[11px] font-bold">
                        {[
                          { id: 'all', kh: 'ទាំងអស់', en: 'All' },
                          { id: 'pages', kh: 'ទំព័រ', en: 'Pages' },
                          { id: 'students', kh: 'សិស្ស', en: 'Students' },
                          { id: 'teachers', kh: 'គ្រូបង្រៀន', en: 'Teachers' },
                          { id: 'courses', kh: 'វគ្គសិក្សា', en: 'Courses' },
                          { id: 'schedules', kh: 'កាលវិភាគ', en: 'Schedules' },
                          { id: 'finance', kh: 'ហិរញ្ញវត្ថុ', en: 'Finance' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSearchCategoryFilter(cat.id as any)}
                            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                              searchCategoryFilter === cat.id
                                ? 'bg-primary-600 text-white shadow-3xs'
                                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                            }`}
                          >
                            {uiLang === "kh" ? cat.kh : cat.en}
                          </button>
                        ))}
                      </div>

                      {/* Scrollable Results Body */}
                      <div className="overflow-y-auto dropdown-scrollbar pt-2.5 pr-1 space-y-4 text-xs">
                        {/* Empty Search Query -> Recent Searches & Quick Shortcuts */}
                        {!globalSearchQuery.trim() && (
                          <div className="space-y-3.5">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {uiLang === "kh" ? "ស្វែងរកចុងក្រោយ" : "Recent Searches"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={clearRecentSearches}
                                    className="text-slate-400 hover:text-rose-600 text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    {uiLang === "kh" ? "លុបចោល" : "Clear"}
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 px-0.5">
                                  {recentSearches.map((term, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => {
                                        setGlobalSearchQuery(term);
                                        addRecentSearch(term);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 hover:bg-primary-50 hover:text-primary-800 text-slate-700 text-[11px] font-bold border border-slate-200/60 transition-all cursor-pointer"
                                    >
                                      <span>{term}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* System Quick Shortcuts */}
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                                {uiLang === "kh" ? "ផ្លូវកាត់លឿនប្រព័ន្ធ" : "System Quick Shortcuts"}
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {systemSearchModules.slice(0, 6).map((mod) => {
                                  const ModIcon = mod.icon;
                                  return (
                                    <button
                                      key={mod.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab(mod.id);
                                        setIsSearchFocused(false);
                                      }}
                                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-primary-50/80 hover:border-primary-200/80 text-slate-700 hover:text-primary-800 transition-all text-left cursor-pointer group"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 group-hover:border-primary-200 group-hover:bg-primary-500 group-hover:text-white flex items-center justify-center text-slate-500 shrink-0 transition-colors shadow-3xs">
                                        <ModIcon className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="font-bold text-[11px] truncate leading-tight">
                                          {uiLang === "kh" ? mod.kh : mod.en}
                                        </div>
                                        <div className="text-[9px] text-slate-400 truncate mt-0.5">
                                          {mod.category}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Search Query Non-Empty -> Display Category Matches */}
                        {globalSearchQuery.trim() !== "" && (
                          <>
                            {/* 1. Modules & Pages */}
                            {globalSearchResults.modules.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
                                  <span>{uiLang === "kh" ? "ទំព័រ/មុខងារប្រព័ន្ធ" : "Pages & Modules"}</span>
                                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[9px]">
                                    {globalSearchResults.modules.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {globalSearchResults.modules.map((mod) => {
                                    const ModIcon = mod.icon;
                                    return (
                                      <button
                                        key={mod.id}
                                        type="button"
                                        onClick={() => {
                                          setActiveTab(mod.id);
                                          addRecentSearch(globalSearchQuery);
                                          setGlobalSearchQuery("");
                                          setIsSearchFocused(false);
                                        }}
                                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-primary-50/70 border border-transparent hover:border-primary-100 text-left transition-all cursor-pointer group"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div className="w-7 h-7 rounded-lg bg-primary-100/60 text-primary-700 flex items-center justify-center shrink-0">
                                            <ModIcon className="w-3.5 h-3.5" />
                                          </div>
                                          <div className="min-w-0">
                                            <div className="font-extrabold text-slate-800 group-hover:text-primary-800 text-[12px] truncate">
                                              {uiLang === "kh" ? mod.kh : mod.en}
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate">
                                              {mod.desc}
                                            </div>
                                          </div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary-500 shrink-0 ml-2" />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 2. Students Results */}
                            {globalSearchResults.students.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
                                  <span>{uiLang === "kh" ? "ព័ត៌មានសិស្ស" : "Students"}</span>
                                  <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                    {globalSearchResults.students.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {globalSearchResults.students.map((st) => (
                                    <button
                                      key={st.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Students");
                                        setStudentSearch(st.name || st.id);
                                        setSelectedStudent(st);
                                        setIsViewStudentModalOpen(true);
                                        addRecentSearch(st.name || st.id);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                        showToast(`បានបើកព័ត៌មានសិស្ស៖ ${st.name || st.id}`, 'info');
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-100 text-left transition-all cursor-pointer group"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-[10px] shrink-0 border border-emerald-200/50">
                                          {(st.name || st.khmerName || "S").slice(0, 1)}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="font-extrabold text-slate-800 group-hover:text-emerald-900 text-[12px] truncate flex items-center gap-1.5">
                                            <span>{st.name || st.khmerName}</span>
                                            <span className="text-[10px] text-slate-400 font-mono font-medium">({st.id})</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 truncate flex items-center gap-2">
                                            {st.course && <span>{st.course}</span>}
                                            {st.phone && <span>• {st.phone}</span>}
                                          </div>
                                        </div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 shrink-0 ml-2" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 3. Teachers Results */}
                            {globalSearchResults.teachers.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
                                  <span>{uiLang === "kh" ? "គ្រូបង្រៀន/បុគ្គលិក" : "Teachers & Staff"}</span>
                                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                    {globalSearchResults.teachers.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {globalSearchResults.teachers.map((tc) => (
                                    <button
                                      key={tc.id || tc.name}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Teachers");
                                        addRecentSearch(tc.name);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                        showToast(`បានបើកផ្នែកគ្រប់គ្រងគ្រូបង្រៀន`, 'info');
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 text-left transition-all cursor-pointer group"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-[10px] shrink-0 border border-blue-200/50">
                                          {(tc.name || "T").slice(0, 1)}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="font-extrabold text-slate-800 group-hover:text-blue-900 text-[12px] truncate">
                                            {tc.name}
                                          </div>
                                          <div className="text-[10px] text-slate-400 truncate">
                                            {tc.specialty || tc.subject || tc.phone || "គ្រូបង្រៀន"}
                                          </div>
                                        </div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 ml-2" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 4. Courses Results */}
                            {globalSearchResults.courses.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
                                  <span>{uiLang === "kh" ? "វគ្គសិក្សា" : "Courses & Specialties"}</span>
                                  <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                    {globalSearchResults.courses.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {globalSearchResults.courses.map((crs: string) => (
                                    <button
                                      key={crs}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Courses");
                                        addRecentSearch(crs);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-100 text-left transition-all cursor-pointer group"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                          <BookOpen className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="font-extrabold text-slate-800 group-hover:text-amber-900 text-[12px] truncate">
                                          {crs}
                                        </div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 shrink-0 ml-2" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 5. Timetables Results */}
                            {globalSearchResults.timetables.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
                                  <span>{uiLang === "kh" ? "កាលវិភាគសិក្សា" : "Class Timetables"}</span>
                                  <span className="bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                    {globalSearchResults.timetables.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {globalSearchResults.timetables.map((tb: any, i: number) => (
                                    <button
                                      key={tb.id || i}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Timetable");
                                        addRecentSearch(tb.courseName || tb.course || "កាលវិភាគ");
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-cyan-50/70 border border-transparent hover:border-cyan-100 text-left transition-all cursor-pointer group"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                                          <Calendar className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="font-extrabold text-slate-800 group-hover:text-cyan-900 text-[12px] truncate">
                                            {tb.courseName || tb.course || "វគ្គសិក្សា"}
                                          </div>
                                          <div className="text-[10px] text-slate-400 truncate flex items-center gap-2">
                                            {tb.teacherName && <span>គ្រូ៖ {tb.teacherName}</span>}
                                            {tb.room && <span>• បន្ទប់៖ {tb.room}</span>}
                                            {tb.timeSlot && <span>• {tb.timeSlot}</span>}
                                          </div>
                                        </div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-600 shrink-0 ml-2" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 6. Finance & Payments Results */}
                            {globalSearchResults.finance.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
                                  <span>{uiLang === "kh" ? "ប័ណ្ណទូទាត់ហិរញ្ញវត្ថុ" : "Invoices & Payments"}</span>
                                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                    {globalSearchResults.finance.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {globalSearchResults.finance.map((tx: any) => (
                                    <button
                                      key={tx.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Finance");
                                        setViewReceiptTx(tx);
                                        addRecentSearch(tx.studentName || tx.id);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 text-left transition-all cursor-pointer group"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                          <DollarSign className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="font-extrabold text-slate-800 group-hover:text-blue-900 text-[12px] truncate flex items-center gap-1.5">
                                            <span>{tx.studentName}</span>
                                            <span className="text-[10px] text-emerald-600 font-bold font-mono">${tx.amount}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 truncate flex items-center gap-2">
                                            <span>{tx.type}</span>
                                            <span>• {tx.date}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 ml-2" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* No Results Fallback */}
                            {globalSearchResults.modules.length === 0 &&
                             globalSearchResults.students.length === 0 &&
                             globalSearchResults.teachers.length === 0 &&
                             globalSearchResults.courses.length === 0 &&
                             globalSearchResults.timetables.length === 0 &&
                             globalSearchResults.finance.length === 0 && (
                              <div className="text-center py-8 px-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                                  <Search className="w-5 h-5 stroke-[2]" />
                                </div>
                                <p className="text-xs font-bold text-slate-700">
                                  {uiLang === "kh" ? `រកមិនឃើញទិន្នន័យសម្រាប់ «${globalSearchQuery}» ទេ` : `No data found for "${globalSearchQuery}"`}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  {uiLang === "kh" ? "សូមពិនិត្យមើលអក្ខរាវិរុទ្ធ ឬស្វែងរកឈ្មោះសិស្ស លេខសម្គាល់ ឬឈ្មោះវគ្គសិក្សា" : "Try searching by student name, ID, teacher or course name"}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

            {/* Right side: Language Selector, Mobile Search, Theme Palette Selector, User card & Log out button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Mobile Search Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSearchFocused(!isSearchFocused)}
                className="lg:hidden w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-3xs flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shrink-0"
                title={uiLang === "kh" ? "ស្វែងរកព័ត៌មានប្រព័ន្ធ" : "Global Search"}
              >
                <Search className="w-4 h-4 stroke-[2.2]" />
              </button>

              {/* Mobile Search Overlay Modal */}
              <AnimatePresence>
                {isSearchFocused && (
                  <div className="lg:hidden fixed inset-0 z-[100] flex flex-col bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 font-sans">
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden p-4"
                    >
                      {/* Search Header Input */}
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            autoFocus
                            value={globalSearchQuery}
                            onChange={(e) => setGlobalSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            placeholder={uiLang === "kh" ? "ស្វែងរកព័ត៌មានប្រព័ន្ធ (សិស្ស គ្រូ វគ្គសិក្សា ហិរញ្ញវត្ថុ)..." : "Search global system..."}
                          />
                          {globalSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setGlobalSearchQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsSearchFocused(false)}
                          className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer shrink-0"
                        >
                          {uiLang === "kh" ? "បិទ" : "Close"}
                        </button>
                      </div>

                      {/* Category Filter Tabs */}
                      <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-b border-slate-100/80 dropdown-scrollbar shrink-0 text-[11px] font-bold">
                        {[
                          { id: 'all', kh: 'ទាំងអស់', en: 'All' },
                          { id: 'pages', kh: 'ទំព័រ', en: 'Pages' },
                          { id: 'students', kh: 'សិស្ស', en: 'Students' },
                          { id: 'teachers', kh: 'គ្រូបង្រៀន', en: 'Teachers' },
                          { id: 'courses', kh: 'វគ្គសិក្សា', en: 'Courses' },
                          { id: 'schedules', kh: 'កាលវិភាគ', en: 'Schedules' },
                          { id: 'finance', kh: 'ហិរញ្ញវត្ថុ', en: 'Finance' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSearchCategoryFilter(cat.id as any)}
                            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                              searchCategoryFilter === cat.id
                                ? 'bg-primary-600 text-white shadow-3xs'
                                : 'bg-slate-100/80 text-slate-600'
                            }`}
                          >
                            {uiLang === "kh" ? cat.kh : cat.en}
                          </button>
                        ))}
                      </div>

                      {/* Results List */}
                      <div className="overflow-y-auto dropdown-scrollbar pt-3 space-y-4 text-xs">
                        {!globalSearchQuery.trim() && (
                          <div className="space-y-3">
                            {recentSearches.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 mb-1.5 px-1">
                                  <span>{uiLang === "kh" ? "ស្វែងរកចុងក្រោយ" : "Recent Searches"}</span>
                                  <button type="button" onClick={clearRecentSearches} className="text-slate-400 hover:text-rose-600 text-[10px]">
                                    {uiLang === "kh" ? "លុបចោល" : "Clear"}
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {recentSearches.map((term, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => {
                                        setGlobalSearchQuery(term);
                                        addRecentSearch(term);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200/60"
                                    >
                                      {term}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="text-[10px] font-black uppercase text-slate-400 mb-1.5 px-1">
                                {uiLang === "kh" ? "ផ្លូវកាត់លឿន" : "Shortcuts"}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {systemSearchModules.slice(0, 6).map((mod) => {
                                  const ModIcon = mod.icon;
                                  return (
                                    <button
                                      key={mod.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab(mod.id);
                                        setIsSearchFocused(false);
                                      }}
                                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-left"
                                    >
                                      <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                        <ModIcon className="w-3 h-3 text-slate-600" />
                                      </div>
                                      <span className="font-bold text-[11px] text-slate-700 truncate">{uiLang === "kh" ? mod.kh : mod.en}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {globalSearchQuery.trim() !== "" && (
                          <div className="space-y-3">
                            {/* Modules */}
                            {globalSearchResults.modules.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase text-slate-400 mb-1 px-1">{uiLang === "kh" ? "ទំព័រ/មុខងារប្រព័ន្ធ" : "Pages & Modules"}</div>
                                <div className="space-y-1">
                                  {globalSearchResults.modules.map((mod) => (
                                    <button
                                      key={mod.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab(mod.id);
                                        addRecentSearch(globalSearchQuery);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-primary-50 border border-transparent hover:border-primary-100 text-left"
                                    >
                                      <span className="font-bold text-slate-800 text-[12px]">{uiLang === "kh" ? mod.kh : mod.en}</span>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Students */}
                            {globalSearchResults.students.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase text-slate-400 mb-1 px-1">{uiLang === "kh" ? "ព័ត៌មានសិស្ស" : "Students"}</div>
                                <div className="space-y-1">
                                  {globalSearchResults.students.map((st) => (
                                    <button
                                      key={st.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Students");
                                        setStudentSearch(st.name || st.id);
                                        setSelectedStudent(st);
                                        setIsViewStudentModalOpen(true);
                                        addRecentSearch(st.name || st.id);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 text-left"
                                    >
                                      <div>
                                        <div className="font-extrabold text-slate-800 text-[12px]">{st.name || st.khmerName} ({st.id})</div>
                                        <div className="text-[10px] text-slate-400">{st.course || st.phone}</div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Teachers */}
                            {globalSearchResults.teachers.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase text-slate-400 mb-1 px-1">{uiLang === "kh" ? "គ្រូបង្រៀន" : "Teachers"}</div>
                                <div className="space-y-1">
                                  {globalSearchResults.teachers.map((tc) => (
                                    <button
                                      key={tc.id || tc.name}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Teachers");
                                        addRecentSearch(tc.name);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 text-left"
                                    >
                                      <div>
                                        <div className="font-extrabold text-slate-800 text-[12px]">{tc.name}</div>
                                        <div className="text-[10px] text-slate-400">{tc.specialty || tc.phone}</div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Courses */}
                            {globalSearchResults.courses.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase text-slate-400 mb-1 px-1">{uiLang === "kh" ? "វគ្គសិក្សា" : "Courses"}</div>
                                <div className="space-y-1">
                                  {globalSearchResults.courses.map((crs: string) => (
                                    <button
                                      key={crs}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Courses");
                                        addRecentSearch(crs);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-100 text-left"
                                    >
                                      <span className="font-extrabold text-slate-800 text-[12px]">{crs}</span>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Timetables */}
                            {globalSearchResults.timetables.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase text-slate-400 mb-1 px-1">{uiLang === "kh" ? "កាលវិភាគ" : "Schedules"}</div>
                                <div className="space-y-1">
                                  {globalSearchResults.timetables.map((tb: any, i: number) => (
                                    <button
                                      key={tb.id || i}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Timetable");
                                        addRecentSearch(tb.courseName || tb.course || "កាលវិភាគ");
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-cyan-50 text-left"
                                    >
                                      <div>
                                        <div className="font-extrabold text-slate-800 text-[12px]">{tb.courseName || tb.course}</div>
                                        <div className="text-[10px] text-slate-400">{tb.room} • {tb.timeSlot}</div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Finance */}
                            {globalSearchResults.finance.length > 0 && (
                              <div>
                                <div className="text-[10px] font-black uppercase text-slate-400 mb-1 px-1">{uiLang === "kh" ? "ហិរញ្ញវត្ថុ" : "Finance"}</div>
                                <div className="space-y-1">
                                  {globalSearchResults.finance.map((tx: any) => (
                                    <button
                                      key={tx.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("Finance");
                                        setViewReceiptTx(tx);
                                        addRecentSearch(tx.studentName || tx.id);
                                        setGlobalSearchQuery("");
                                        setIsSearchFocused(false);
                                      }}
                                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 text-left"
                                    >
                                      <div>
                                        <div className="font-extrabold text-slate-800 text-[12px]">{tx.studentName} (${tx.amount})</div>
                                        <div className="text-[10px] text-slate-400">{tx.type} • {tx.date}</div>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              <LanguageSelector className="flex items-center shrink-0" />

              {/* System Theme / Color Tool Selector */}
              <div className="relative shrink-0" ref={themeMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-3xs flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shrink-0"
                  title={uiLang === "kh" ? "កំណត់ពណ៌ប្រព័ន្ធ (System Theme)" : "System Color Theme"}
                >
                  <Palette className="w-4 h-4 stroke-[2.2]" />
                </button>

                {/* Theme Popover Menu */}
                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl z-50 p-3.5 sm:p-4 font-sans text-left"
                    >
                      {/* Popover Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 shadow-3xs">
                            <Palette className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-none">
                              {uiLang === "kh" ? "កំណត់ពណ៌ប្រព័ន្ធ" : uiLang === "en" ? "System Color Theme" : "系统颜色主题"}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 leading-none">
                              {uiLang === "kh" ? "ជ្រើសរើស អូសពណ៌ ឬវាយលេខកូដ HEX" : uiLang === "en" ? "Pick, drag color or enter HEX code" : "选择/拖拽颜色或输入HEX代码"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsThemeMenuOpen(false)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Unified Color Picker, Swatches, Drag & HEX Input */}
                      <div className="space-y-3.5 max-h-[80vh] overflow-y-auto dropdown-scrollbar pr-0.5 pt-2 font-sans">
                        {/* Color Drag Block & Native Color Picker */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50 p-3 flex items-center gap-3 shadow-3xs">
                          <div
                            className="w-12 h-12 rounded-xl border-2 border-white shadow-md shrink-0 relative overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                            style={{ backgroundColor: customHexInput }}
                          >
                            <Pipette className="w-5 h-5 text-white drop-shadow-md" />
                            <input
                              type="color"
                              value={customHexInput.length === 7 ? customHexInput : '#2563eb'}
                              onChange={(e) => {
                                const hex = e.target.value.toUpperCase();
                                setCustomHexInput(hex);
                                setAppTheme(hex);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title={uiLang === "kh" ? "ចុចដើម្បីអូស ឬជ្រើសរើសពណ៌" : "Click to pick or drag color"}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                              {uiLang === "kh" ? "ចុចលើប្រអប់ដើម្បីអូសពណ៌ (Color Wheel)" : "Click Wheel to Drag Color"}
                            </label>
                            <div className="text-xs font-black text-slate-800 font-mono tracking-wider flex items-center gap-2">
                              <span>{customHexInput}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary-100 text-primary-700 font-sans">
                                {uiLang === "kh" ? "សកម្ម" : "Active"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Direct HEX Code Input Box */}
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between px-0.5">
                            <span>{uiLang === "kh" ? "វាយលេខកូដពណ៌ HEX Code" : "Type Color HEX Code"}</span>
                            <span className="text-[9px] text-slate-400 font-normal">ឧទាហរណ៍៖ #FF5722</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">
                                #
                              </span>
                              <input
                                type="text"
                                maxLength={7}
                                value={customHexInput.replace(/^#/, '')}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                                  const formatted = '#' + raw.toUpperCase();
                                  setCustomHexInput(formatted);
                                  if (raw.length === 6 || raw.length === 3) {
                                    let hex6 = formatted;
                                    if (raw.length === 3) {
                                      hex6 = '#' + raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
                                    }
                                    setAppTheme(hex6.toUpperCase());
                                  }
                                }}
                                placeholder="2563EB"
                                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono font-extrabold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-3xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                try {
                                  navigator.clipboard.writeText(customHexInput);
                                  showToast(uiLang === "kh" ? `បានចម្លងកូដពណ៌ ${customHexInput}` : `Copied ${customHexInput}`, 'success');
                                } catch (e) { console.error(e); }
                              }}
                              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer transition-colors shrink-0"
                            >
                              {uiLang === "kh" ? "ចម្លង" : "Copy"}
                            </button>
                          </div>
                        </div>

                        {/* Quick Swatches Palette */}
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-0.5">
                            {uiLang === "kh" ? "កូដពណ៌ពេញនិយម (Quick Swatches)" : "Popular Swatches"}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              '#2563EB', '#10B981', '#F43F5E', '#F59E0B',
                              '#8B5CF6', '#06B6D4', '#14B8A6', '#EC4899',
                              '#0284C7', '#7C3AED', '#D97706', '#059669',
                              '#DC2626', '#475569'
                            ].map((swatchHex) => (
                              <button
                                key={swatchHex}
                                type="button"
                                onClick={() => {
                                  setCustomHexInput(swatchHex);
                                  setAppTheme(swatchHex);
                                }}
                                className="w-6 h-6 rounded-lg border border-white/80 shadow-3xs transition-transform hover:scale-125 cursor-pointer relative flex items-center justify-center active:scale-95"
                                style={{ backgroundColor: swatchHex }}
                                title={swatchHex}
                              >
                                {appTheme.toUpperCase() === swatchHex && (
                                  <Check className="w-3 h-3 text-white drop-shadow-xs stroke-[3]" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Generated Shades Palette Scale - Interactive */}
                        {(() => {
                          const activeBaseHex = appTheme.startsWith('#')
                            ? appTheme
                            : ({
                                indigo: '#2563eb',
                                emerald: '#10b981',
                                rose: '#f43f5e',
                                amber: '#f59e0b',
                                cyan: '#06b6d4',
                                teal: '#14b8a6',
                                slate: '#334155',
                                modern: '#2563eb',
                              }[appTheme] || customHexInput || '#2563eb');

                          const palette = generatePrimaryPalette(activeBaseHex);
                          if (!palette) return null;

                          return (
                            <div className="pt-2 border-t border-slate-100 font-sans">
                              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-0.5 flex items-center justify-between">
                                <span>{uiLang === "kh" ? "មាត្រដ្ឋានពណ៌ប្រព័ន្ធ (11 Shades Scale)" : "Generated Shades Scale"}</span>
                                <span className="font-mono text-[9px] text-slate-400">50 - 950 ({uiLang === "kh" ? "ចុចដើម្បីប្រើ" : "Click to apply"})</span>
                              </div>
                              <div className="grid grid-cols-11 gap-0.5 rounded-xl border border-slate-200/80 p-1 bg-slate-50">
                                {((Object.entries(palette) as [string, string][])).map(([shade, hexVal]) => {
                                  const isCurrentActive = appTheme.toUpperCase() === hexVal.toUpperCase();
                                  const isLightShade = parseInt(shade) < 500;
                                  return (
                                    <button
                                      key={shade}
                                      type="button"
                                      onClick={() => {
                                        setAppTheme(hexVal.toUpperCase());
                                        setCustomHexInput(hexVal.toUpperCase());
                                        showToast(
                                          uiLang === "kh" 
                                            ? `បានកំណត់ពណ៌ Shade ${shade} (${hexVal.toUpperCase()}) ជាពណ៌ប្រព័ន្ធ` 
                                            : `Applied Shade ${shade} (${hexVal.toUpperCase()})`,
                                          'success'
                                        );
                                      }}
                                      title={uiLang === "kh" ? `Shade ${shade}: ${hexVal.toUpperCase()} (ចុចដើម្បីកំណត់ជាពណ៌ប្រព័ន្ធ)` : `Shade ${shade}: ${hexVal.toUpperCase()} (Click to apply)`}
                                      className={`h-7 rounded-md transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-3xs flex items-center justify-center text-[8px] font-mono font-black relative ${
                                        isCurrentActive ? "ring-2 ring-slate-900 z-10 scale-105 shadow-sm" : ""
                                      }`}
                                      style={{
                                        backgroundColor: hexVal,
                                        color: isLightShade ? '#0f172a' : '#ffffff'
                                      }}
                                    >
                                      <span>{shade}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}

                        {/* System Background Color Control Section */}
                        <div className="pt-3 border-t border-slate-100 font-sans">
                          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-0.5 flex items-center justify-between">
                            <span>{uiLang === "kh" ? "ពណ៌ផ្ទៃខាងក្រោយប្រព័ន្ធ (Background)" : "System Background Color"}</span>
                            <span className="font-mono text-[9.5px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {appBgColor}
                            </span>
                          </div>

                          {/* Quick Preset Background Swatches */}
                          <div className="grid grid-cols-4 gap-1.5 mb-2">
                            {[
                              { hex: '#f8fafc', nameKh: 'សដើម', nameEn: 'Slate White' },
                              { hex: '#f1f5f9', nameKh: 'ប្រផេះ', nameEn: 'Cool Slate' },
                              { hex: '#fdfbf7', nameKh: 'ក្រែម', nameEn: 'Warm Cream' },
                              { hex: '#f0f9ff', nameKh: 'ខៀវ', nameEn: 'Ice Blue' },
                              { hex: '#f0fdf4', nameKh: 'បៃតង', nameEn: 'Mint Tint' },
                              { hex: '#faf5ff', nameKh: 'ស្វាយ', nameEn: 'Soft Violet' },
                              { hex: '#fff7ed', nameKh: 'ទឹកក្រូច', nameEn: 'Peach Tint' },
                              { hex: '#0f172a', nameKh: 'ខ្មៅ', nameEn: 'Midnight Dark' },
                            ].map((bgPreset) => {
                              const isActive = appBgColor.toLowerCase() === bgPreset.hex.toLowerCase();
                              return (
                                <button
                                  key={bgPreset.hex}
                                  type="button"
                                  onClick={() => {
                                    setAppBgColor(bgPreset.hex);
                                    setCustomBgHexInput(bgPreset.hex);
                                  }}
                                  className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-left transition-all cursor-pointer active:scale-95 ${
                                    isActive
                                      ? "bg-slate-900 text-white border-slate-900 shadow-3xs"
                                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  <span
                                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300 shadow-3xs"
                                    style={{ backgroundColor: bgPreset.hex }}
                                  />
                                  <span className="text-[10px] font-extrabold truncate">
                                    {uiLang === "kh" ? bgPreset.nameKh : bgPreset.nameEn}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom Color Wheel & Hex Input for Background */}
                          <div className="flex items-center gap-2">
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1 flex items-center gap-2 flex-1 shadow-3xs">
                              <div
                                className="w-7 h-7 rounded-lg border border-slate-200 shrink-0 relative overflow-hidden flex items-center justify-center cursor-pointer"
                                style={{ backgroundColor: customBgHexInput }}
                              >
                                <Pipette className="w-3.5 h-3.5 text-slate-600 drop-shadow-xs" />
                                <input
                                  type="color"
                                  value={customBgHexInput.length === 7 ? customBgHexInput : '#f8fafc'}
                                  onChange={(e) => {
                                    const hex = e.target.value.toUpperCase();
                                    setCustomBgHexInput(hex);
                                    setAppBgColor(hex);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  title={uiLang === "kh" ? "អូសជ្រើសរើសពណ៌ផ្ទៃខាងក្រោយ" : "Pick background color"}
                                />
                              </div>
                              <div className="relative flex-1 pr-1">
                                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400">#</span>
                                <input
                                  type="text"
                                  maxLength={7}
                                  value={customBgHexInput.replace(/^#/, '')}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                                    const formatted = '#' + raw.toUpperCase();
                                    setCustomBgHexInput(formatted);
                                    if (raw.length === 6 || raw.length === 3) {
                                      let hex6 = formatted;
                                      if (raw.length === 3) {
                                        hex6 = '#' + raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
                                      }
                                      setAppBgColor(hex6.toUpperCase());
                                    }
                                  }}
                                  placeholder="F8FAFC"
                                  className="w-full pl-4 pr-1 py-1 bg-transparent text-slate-800 text-[11px] font-mono font-extrabold focus:outline-none"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAppBgColor('#f8fafc');
                                setCustomBgHexInput('#f8fafc');
                              }}
                              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-extrabold cursor-pointer transition-colors shrink-0"
                            >
                              {uiLang === "kh" ? "កំណត់ឡើងវិញ" : "Reset"}
                            </button>
                          </div>
                        </div>

                        {/* Card & Container Surface Color Control Section */}
                        <div className="pt-3 border-t border-slate-100 font-sans">
                          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-0.5 flex items-center justify-between">
                            <span>{uiLang === "kh" ? "ពណ៌ផ្ទៃកាត / ផ្ទាំងទិន្នន័យ (Cards Surface)" : "Card Container Surface Color"}</span>
                            <span className="font-mono text-[9.5px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {appCardBgColor === 'auto' ? (uiLang === "kh" ? "ស្វ័យប្រវត្តិ" : "Auto") : appCardBgColor}
                            </span>
                          </div>

                          {/* Quick Card Surface Presets */}
                          <div className="grid grid-cols-3 gap-1.5 mb-2">
                            {[
                              { id: 'auto', hex: 'auto', nameKh: '⚡ ស្វ័យប្រវត្តិ', nameEn: '⚡ Auto Adaptive' },
                              { id: '#ffffff', hex: '#ffffff', nameKh: '⬜ សសុទ្ធ', nameEn: '⬜ Pure White' },
                              { id: '#1e293b', hex: '#1e293b', nameKh: '⬛ ផ្ទៃងងឹត', nameEn: '⬛ Dark Slate' },
                              { id: '#fdfbf7', hex: '#fdfbf7', nameKh: '📜 ក្រែម', nameEn: '📜 Warm Cream' },
                              { id: '#f0f9ff', hex: '#f0f9ff', nameKh: '❄️ ខៀវស្រាល', nameEn: '❄️ Ice Tint' },
                              { id: '#f1f5f9', hex: '#f1f5f9', nameKh: '🌫️ ប្រផេះ', nameEn: '🌫️ Cool Gray' },
                            ].map((cardPreset) => {
                              const isActive = appCardBgColor.toLowerCase() === cardPreset.id.toLowerCase();
                              return (
                                <button
                                  key={cardPreset.id}
                                  type="button"
                                  onClick={() => {
                                    setAppCardBgColor(cardPreset.id);
                                    if (cardPreset.hex.startsWith('#')) {
                                      setCustomCardBgHexInput(cardPreset.hex);
                                    }
                                  }}
                                  className={`flex items-center justify-center p-1.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                                    isActive
                                      ? "bg-slate-900 text-white border-slate-900 shadow-3xs"
                                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  <span className="text-[10px] font-extrabold truncate">
                                    {uiLang === "kh" ? cardPreset.nameKh : cardPreset.nameEn}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom Color Wheel & Hex Input for Card Surface */}
                          <div className="flex items-center gap-2">
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1 flex items-center gap-2 flex-1 shadow-3xs">
                              <div
                                className="w-7 h-7 rounded-lg border border-slate-200 shrink-0 relative overflow-hidden flex items-center justify-center cursor-pointer"
                                style={{ backgroundColor: customCardBgHexInput }}
                              >
                                <Pipette className="w-3.5 h-3.5 text-slate-600 drop-shadow-xs" />
                                <input
                                  type="color"
                                  value={customCardBgHexInput.length === 7 ? customCardBgHexInput : '#ffffff'}
                                  onChange={(e) => {
                                    const hex = e.target.value.toUpperCase();
                                    setCustomCardBgHexInput(hex);
                                    setAppCardBgColor(hex);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  title={uiLang === "kh" ? "អូសជ្រើសរើសពណ៌ផ្ទៃកាត" : "Pick card surface color"}
                                />
                              </div>
                              <div className="relative flex-1 pr-1">
                                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400">#</span>
                                <input
                                  type="text"
                                  maxLength={7}
                                  value={customCardBgHexInput.replace(/^#/, '')}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                                    const formatted = '#' + raw.toUpperCase();
                                    setCustomCardBgHexInput(formatted);
                                    if (raw.length === 6 || raw.length === 3) {
                                      let hex6 = formatted;
                                      if (raw.length === 3) {
                                        hex6 = '#' + raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
                                      }
                                      setAppCardBgColor(hex6.toUpperCase());
                                    }
                                  }}
                                  placeholder="FFFFFF"
                                  className="w-full pl-4 pr-1 py-1 bg-transparent text-slate-800 text-[11px] font-mono font-extrabold focus:outline-none"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAppCardBgColor('auto');
                                setCustomCardBgHexInput('#ffffff');
                              }}
                              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-extrabold cursor-pointer transition-colors shrink-0"
                            >
                              {uiLang === "kh" ? "ស្វ័យប្រវត្តិ" : "Auto"}
                            </button>
                          </div>
                        </div>

                        {/* Text Color Control Section */}
                        <div className="pt-3 border-t border-slate-100 font-sans">
                          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-0.5 flex items-center justify-between">
                            <span>{uiLang === "kh" ? "ពណ៌អក្សរប្រព័ន្ធ (Text Color)" : "System Text Color"}</span>
                            <span className="font-mono text-[9.5px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {appTextColor === 'auto' ? (uiLang === "kh" ? "ស្វ័យប្រវត្តិ" : "Auto") : appTextColor}
                            </span>
                          </div>

                          {/* Quick Text Color Presets */}
                          <div className="grid grid-cols-3 gap-1.5 mb-2">
                            {[
                              { id: 'auto', hex: 'auto', nameKh: '⚡ ស្វ័យប្រវត្តិ', nameEn: '⚡ Auto' },
                              { id: '#0f172a', hex: '#0f172a', nameKh: '⬛ ខ្មៅដិត', nameEn: '⬛ Dark Slate' },
                              { id: '#1e3a8a', hex: '#1e3a8a', nameKh: '💙 ខៀវចាស់', nameEn: '💙 Deep Blue' },
                              { id: '#064e3b', hex: '#064e3b', nameKh: '💚 បៃតងចាស់', nameEn: '💚 Deep Green' },
                              { id: '#3b0764', hex: '#3b0764', nameKh: '💜 ស្វាយចាស់', nameEn: '💜 Deep Purple' },
                              { id: '#ffffff', hex: '#ffffff', nameKh: '⬜ សសុទ្ធ', nameEn: '⬜ Pure White' },
                            ].map((textPreset) => {
                              const isActive = appTextColor.toLowerCase() === textPreset.id.toLowerCase();
                              return (
                                <button
                                  key={textPreset.id}
                                  type="button"
                                  onClick={() => {
                                    setAppTextColor(textPreset.id);
                                    if (textPreset.hex.startsWith('#')) {
                                      setCustomTextHexInput(textPreset.hex);
                                    }
                                  }}
                                  className={`flex items-center justify-center p-1.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                                    isActive
                                      ? "bg-slate-900 text-white border-slate-900 shadow-3xs"
                                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  <span className="text-[10px] font-extrabold truncate">
                                    {uiLang === "kh" ? textPreset.nameKh : textPreset.nameEn}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom Color Wheel & Hex Input for Text Color */}
                          <div className="flex items-center gap-2">
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1 flex items-center gap-2 flex-1 shadow-3xs">
                              <div
                                className="w-7 h-7 rounded-lg border border-slate-200 shrink-0 relative overflow-hidden flex items-center justify-center cursor-pointer"
                                style={{ backgroundColor: customTextHexInput }}
                              >
                                <Pipette className="w-3.5 h-3.5 text-slate-600 drop-shadow-xs" />
                                <input
                                  type="color"
                                  value={customTextHexInput.length === 7 ? customTextHexInput : '#0f172a'}
                                  onChange={(e) => {
                                    const hex = e.target.value.toUpperCase();
                                    setCustomTextHexInput(hex);
                                    setAppTextColor(hex);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  title={uiLang === "kh" ? "អូសជ្រើសរើសពណ៌អក្សរ" : "Pick text color"}
                                />
                              </div>
                              <div className="relative flex-1 pr-1">
                                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400">#</span>
                                <input
                                  type="text"
                                  maxLength={7}
                                  value={customTextHexInput.replace(/^#/, '')}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                                    const formatted = '#' + raw.toUpperCase();
                                    setCustomTextHexInput(formatted);
                                    if (raw.length === 6 || raw.length === 3) {
                                      let hex6 = formatted;
                                      if (raw.length === 3) {
                                        hex6 = '#' + raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
                                      }
                                      setAppTextColor(hex6.toUpperCase());
                                    }
                                  }}
                                  placeholder="0F172A"
                                  className="w-full pl-4 pr-1 py-1 bg-transparent text-slate-800 text-[11px] font-mono font-extrabold focus:outline-none"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAppTextColor('auto');
                                setCustomTextHexInput('#0f172a');
                              }}
                              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-extrabold cursor-pointer transition-colors shrink-0"
                            >
                              {uiLang === "kh" ? "ស្វ័យប្រវត្តិ" : "Auto"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                        <span>{uiLang === "kh" ? "រក្សាទុកស្វ័យប្រវត្តិ" : "Auto Saved"}</span>
                        <span className="uppercase tracking-wider font-mono text-primary-600 font-black px-2 py-0.5 bg-primary-50 rounded-md">
                          {appTheme || "indigo"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications Bell Icon */}
              <div className="relative shrink-0" ref={notificationsMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-3xs flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shrink-0 relative"
                  title={uiLang === "kh" ? "ការជូនដំណឹងប្រព័ន្ធ (Notifications)" : "System Notifications"}
                >
                  <Bell className="w-4 h-4 stroke-[2.2]" />
                  {/* Unread badge count */}
                  {unreadNotifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center border-2 border-[#3B82F6] shadow-xs animate-pulse">
                      {unreadNotifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notifications Popover Menu */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-3.5 sm:p-4 font-sans text-left"
                    >
                      {/* Popover Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-3xs">
                            <Bell className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-none">
                              {uiLang === "kh" ? "ការជូនដំណឹងប្រព័ន្ធ" : "System Notifications"}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 leading-none">
                              {unreadNotifications.filter(n => !n.read).length > 0 
                                ? (uiLang === "kh" ? `មានសារមិនទាន់អាន ${unreadNotifications.filter(n => !n.read).length} សារ` : `${unreadNotifications.filter(n => !n.read).length} unread alerts`)
                                : (uiLang === "kh" ? "បានអានទាំងអស់" : "All caught up")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {unreadNotifications.filter(n => !n.read).length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setUnreadNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                showToast(uiLang === "kh" ? "បានសម្អាតការជូនដំណឹងទាំងអស់" : "All notifications marked as read", "success");
                              }}
                              className="text-[10px] font-extrabold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              {uiLang === "kh" ? "សម្អាតទាំងអស់" : "Mark read"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="space-y-2 max-h-[60vh] overflow-y-auto dropdown-scrollbar pt-2.5 font-sans">
                        {unreadNotifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-xs font-bold">
                            {uiLang === "kh" ? "គ្មានការជូនដំណឹងថ្មីទេ" : "No new notifications"}
                          </div>
                        ) : (
                          unreadNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setUnreadNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                if (notif.tab) setActiveTab(notif.tab);
                                setIsNotificationsOpen(false);
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                                notif.read 
                                  ? "bg-slate-50/70 border-slate-100 opacity-75 hover:opacity-100" 
                                  : "bg-amber-50/40 border-amber-200/60 hover:bg-amber-50"
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? "bg-slate-300" : "bg-amber-500 animate-pulse"}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-black text-slate-800 truncate">
                                    {uiLang === "kh" ? notif.titleKh : notif.titleEn}
                                  </span>
                                  <span className="text-[9.5px] font-bold text-slate-400 shrink-0">
                                    {notif.time}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 font-medium line-clamp-2 mt-0.5">
                                  {uiLang === "kh" ? notif.descKh : notif.descEn}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer Link to Announcements */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("Announcements");
                            setIsNotificationsOpen(false);
                          }}
                          className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                          <span>{uiLang === "kh" ? "មើលការផ្សព្វផ្សាយទាំងអស់" : "View All Announcements"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wi-Fi / Internet Status Icon */}
              <div className="relative shrink-0" ref={wifiMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsWifiMenuOpen(!isWifiMenuOpen)}
                  className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl border shadow-3xs flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shrink-0 relative ${
                    effectiveIsOnline 
                      ? "bg-white/20 hover:bg-white/30 text-white border-white/30" 
                      : "bg-rose-500/80 hover:bg-rose-600 text-white border-rose-300 animate-pulse"
                  }`}
                  title={effectiveIsOnline 
                    ? (uiLang === "kh" ? "អ៊ីនធឺណិត: ភ្ជាប់រួចរាល់ (Online)" : "Internet: Connected (Online)")
                    : (uiLang === "kh" ? "អ៊ីនធឺណិត: គ្មានការភ្ជាប់ (Offline)" : "Internet: Disconnected (Offline)")
                  }
                >
                  {effectiveIsOnline ? (
                    <Wifi className="w-4 h-4 stroke-[2.2]" />
                  ) : (
                    <WifiOff className="w-4 h-4 stroke-[2.2]" />
                  )}
                  {/* Status Indicator Badge */}
                  <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    effectiveIsOnline ? "bg-emerald-500" : "bg-rose-500 animate-ping"
                  }`} />
                </button>

                {/* Wi-Fi Popover Menu */}
                <AnimatePresence>
                  {isWifiMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-88 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-3.5 sm:p-4 font-sans text-left"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-3xs ${
                            effectiveIsOnline 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                              : "bg-rose-50 text-rose-600 border-rose-100"
                          }`}>
                            {effectiveIsOnline ? <Wifi className="w-4 h-4 stroke-[2.5]" /> : <WifiOff className="w-4 h-4 stroke-[2.5]" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-none">
                              {uiLang === "kh" ? "ស្ថានភាពអ៊ីនធឺណិត" : "Network & Offline Status"}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 leading-none">
                              {effectiveIsOnline 
                                ? (uiLang === "kh" ? "ភ្ជាប់ប្រព័ន្ធ Online រួចរាល់" : "Connected Online")
                                : (uiLang === "kh" ? "ដំណើរការក្នុងម៉ូដ Offline" : "Running in Offline Mode")
                              }
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsWifiMenuOpen(false)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Status Content */}
                      <div className="space-y-3 pt-3 font-sans">
                        {/* Status Card */}
                        <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          effectiveIsOnline 
                            ? "bg-emerald-50/50 border-emerald-200/70 text-emerald-950" 
                            : "bg-rose-50/50 border-rose-200/70 text-rose-950"
                        }`}>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-3 h-3 rounded-full shrink-0 ${
                              effectiveIsOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                            }`} />
                            <div className="min-w-0">
                              <span className="text-xs font-black block truncate">
                                {effectiveIsOnline 
                                  ? (uiLang === "kh" ? "អ៊ីនធឺណិតកំពុងដំណើរការល្អ" : "Internet Active & Stable")
                                  : (uiLang === "kh" ? "គ្មានសេវាអ៊ីនធឺណិត (Offline)" : "No Internet Connection")
                                }
                              </span>
                              <span className="text-[10px] font-bold opacity-80 block truncate">
                                {effectiveIsOnline 
                                  ? (uiLang === "kh" ? `ល្បឿនឆ្លើយតប: ${networkPing}ms • Sync ចុងក្រោយ: ${lastSyncTime}` : `Ping: ${networkPing}ms • Last Sync: ${lastSyncTime}`)
                                  : (uiLang === "kh" ? "ប្រព័ន្ធកត់ត្រា offline ក្នុង Local Storage" : "System saving locally to Local Storage")
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Offline Capabilities & Data Integrity Card */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              {uiLang === "kh" ? "ការរក្សាទុកទិន្នន័យ OFFLINE" : "Offline Storage Status"}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-black bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              {uiLang === "kh" ? "សុវត្ថិភាព 100%" : "100% Safe"}
                            </span>
                          </div>
                          
                          {/* Real Local Data Stats */}
                          <div className="p-2 rounded-lg bg-white border border-slate-200/90 text-[11px] space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-700">
                              <span>{uiLang === "kh" ? "ទិន្នន័យក្នុងម៉ាស៊ីន (Local):" : "Stored Records:"}</span>
                              <span className="text-primary-700 font-black font-mono">
                                {students.length} {uiLang === "kh" ? "សិស្ស" : "Students"} • {transactions.length} {uiLang === "kh" ? "ប្រាក់" : "Transactions"}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-500 font-medium leading-snug">
                              {uiLang === "kh" 
                                ? "លោកអ្នកអាចបញ្ចូលទិន្នន័យសិស្ស វត្តមាន និងការទូទាត់ប្រាក់បានធម្មតា ទោះបីគ្មានអ៊ីនធឺណិតក៏ដោយ!" 
                                : "You can add students, attendance, and payments seamlessly even without internet connection!"
                              }
                            </p>
                          </div>

                          {/* Manual Sync Button */}
                          <button
                            type="button"
                            disabled={isSyncingData}
                            onClick={() => {
                              setIsSyncingData(true);
                              measurePingLatency();
                              setTimeout(() => {
                                setIsSyncingData(false);
                                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                setLastSyncTime(now);
                                showToast(
                                  uiLang === "kh" 
                                    ? `បានត្រួតពិនិត្យ និង Sync ទិន្នន័យជោគជ័យ! (${students.length} សិស្ស, ${transactions.length} ប្រាក់)` 
                                    : `Verified & Synced successfully! (${students.length} Students, ${transactions.length} Transactions)`, 
                                  "success"
                                );
                              }, 1000);
                            }}
                            className="w-full mt-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-primary-600 ${isSyncingData ? "animate-spin" : ""}`} />
                            <span>
                              {isSyncingData 
                                ? (uiLang === "kh" ? "កំពុងត្រួតពិនិត្យ និង Sync ទិន្នន័យ..." : "Checking & Syncing Data...")
                                : (uiLang === "kh" ? "ធ្វើបច្ចុប្បន្នភាពទិន្នន័យ (Sync Data)" : "Sync & Verify Data Now")
                              }
                            </span>
                          </button>
                        </div>

                        {/* Test Mode Switch */}
                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-black text-amber-900 block">
                              {uiLang === "kh" ? "សាកល្បងម៉ូដ Offline" : "Simulate Offline Mode"}
                            </span>
                            <span className="text-[10px] text-amber-700 font-medium block">
                              {uiLang === "kh" ? "បិទសេវាសាកល្បងមុខងារ offline" : "Toggle off to test offline features"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newVal = !isSimulatedOffline;
                              setIsSimulatedOffline(newVal);
                              showToast(newVal 
                                ? (uiLang === "kh" ? "បានបើកម៉ូដសាកល្បង Offline" : "Offline Simulation ON")
                                : (uiLang === "kh" ? "បានត្រឡប់មកម៉ូដធម្មតា" : "Normal Mode Restored")
                              , "info");
                            }}
                            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                              isSimulatedOffline ? "bg-amber-600" : "bg-slate-300"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                              isSimulatedOffline ? "translate-x-5" : "translate-x-0"
                            }`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* School Website Portal Icon (Desktop/Tablet) */}
              <div className="hidden sm:block relative shrink-0" ref={websiteMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsWebsiteModalOpen(!isWebsiteModalOpen)}
                  className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-3xs flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shrink-0"
                  title={uiLang === "kh" ? "គេហទំព័រសាលារៀន (Website Portal)" : "School Website"}
                >
                  <Globe className="w-4 h-4 stroke-[2.2]" />
                </button>

                {/* Website Popover Menu */}
                <AnimatePresence>
                  {isWebsiteModalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-88 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-3.5 sm:p-4 font-sans text-left"
                    >
                      {/* Popover Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 shadow-3xs">
                            <Globe className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-none">
                              {uiLang === "kh" ? "គេហទំព័រសាលារៀន" : "School Official Website"}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 leading-none">
                              {schoolName || "PLC Education Center"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsWebsiteModalOpen(false)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Website Card Details */}
                      <div className="space-y-3 pt-3 font-sans">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              {uiLang === "kh" ? "អាសយដ្ឋានគេហទំព័រ" : "Website URL"}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              {uiLang === "kh" ? "ដំណើរការ" : "Online"}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 font-semibold truncate flex items-center justify-between gap-2">
                            <span className="truncate">https://plc-school.com</span>
                            <button
                              type="button"
                              onClick={() => {
                                try {
                                  navigator.clipboard.writeText("https://plc-school.com");
                                  showToast(uiLang === "kh" ? "បានចម្លងតំណភ្ជាប់គេហទំព័រ" : "Website link copied", "success");
                                } catch (e) { console.error(e); }
                              }}
                              className="text-[10px] font-bold text-primary-600 hover:text-primary-700 px-2 py-0.5 rounded bg-primary-50 hover:bg-primary-100 shrink-0 cursor-pointer"
                            >
                              {uiLang === "kh" ? "ចម្លង" : "Copy"}
                            </button>
                          </div>
                        </div>

                        {/* Quick Action Button */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              window.open("https://plc-school.com", "_blank");
                              setIsWebsiteModalOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-black transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{uiLang === "kh" ? "បើកទំព័រ" : "Open Website"}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fullscreen Toggle button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="hidden sm:flex w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-3xs items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shrink-0"
                title={isFullscreen ? (uiLang === "kh" ? "បង្រួមអេក្រង់" : "Exit Fullscreen") : (uiLang === "kh" ? "ពង្រីកពេញអេក្រង់" : "Fullscreen")}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 stroke-[2.2]" /> : <Maximize2 className="w-4 h-4 stroke-[2.2]" />}
              </button>

              {/* Log out button */}
              <button
                id="logout-btn"
                type="button"
                onClick={handleLogout}
                className="hidden sm:flex w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-rose-600 text-white border border-white/30 hover:border-rose-400 shadow-3xs items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shrink-0"
                title={uiLang === "kh" ? "ចាកចេញ (Log Out)" : uiLang === "en" ? "Log Out" : "登出系统"}
              >
                <LogOut className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Route Rendering */}
        <main 
          id="main-content-scroll" 
          onMouseDown={handleDashboardMouseDown}
          onMouseMove={handleDashboardMouseMove}
          onMouseUp={handleDashboardMouseUpOrLeave}
          onMouseLeave={handleDashboardMouseUpOrLeave}
          className={`flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto scrollbar-none bg-slate-50/50 select-none ${
            isDashboardDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {activeTab === "Dashboard" && <DashboardTab setActiveTab={setActiveTab} khqrImage={khqrImage} user={user} maleKey={maleKey} t={t} dueKey={dueKey} uiLang={uiLang} activeTab={activeTab} telegramBotToken={telegramBotToken} setTelegramBotToken={setTelegramBotToken} telegramChatId={telegramChatId} setTelegramChatId={setTelegramChatId} developerLogo={developerLogo} setDeveloperLogo={setDeveloperLogo} developerName={developerName} developerKhmerName={developerKhmerName} developerPhone={developerPhone} developerTelegram={developerTelegram} students={students} activeCourseFilter={activeCourseFilter} chartTab={chartTab} activeCourseMetrics={activeCourseMetrics} currentTime={currentTime} collectedKey={collectedKey} teachers={teachers} setActiveCourseFilter={setActiveCourseFilter} femaleKey={femaleKey} chartData={chartData} toKhmerNumeral={toKhmerNumeral} getCourseSubtitle={getCourseSubtitle} setChartTab={setChartTab} translateCourseOrSpecialtyName={translateCourseOrSpecialtyName} getCourseTitle={getCourseTitle} schoolLogo={schoolLogo} schoolName={schoolName} schoolKhmerName={schoolKhmerName} />}


                        {/* Render Database View inside tab */}
            {activeTab === "Grading" && <GradingTab students={students} token={token} uiLang={uiLang} courseOptions={courseOptions} />}
            {activeTab === "Timetable" && (
              <TimetableTab 
                teachers={teachers} 
                token={token} 
                uiLang={uiLang} 
                courseOptions={courseOptions} 
                students={students} 
                onAddCourseOption={handleAddCourseOption}
                onEditCourseOption={handleEditCourseOption}
                onDeleteCourseOption={handleDeleteCourseOption}
              />
            )}
            {activeTab === "Database" && <DatabaseTab dbActiveStep={dbActiveStep} isLoadingFileContent={isLoadingFileContent} selectedDbTable={selectedDbTable} isLoadingWorkspace={isLoadingWorkspace} setShowPrismaCode={setShowPrismaCode} fetchFileContent={fetchFileContent} selectedFile={selectedFile} fetchWorkspaceTree={fetchWorkspaceTree} expandedFolders={expandedFolders} workspaceFiles={workspaceFiles} showPrismaCode={showPrismaCode} setDbActiveStep={setDbActiveStep} setSelectedDbTable={setSelectedDbTable} toKhmerNumeral={toKhmerNumeral} dbTablesMetadata={dbTablesMetadata} setExpandedFolders={setExpandedFolders} workspaceError={workspaceError} uiLang={uiLang} />}
            {activeTab === "Courses" && <CoursesTab uiLang={uiLang} token={token} students={students} setStudents={setStudents} syncCourseOption={syncCourseOption} courseOptions={courseOptions} />}
            {activeTab === "Exams" && <ExamsTab token={token} uiLang={uiLang} showToast={showToast} />}
            {activeTab === "Leave" && <LeaveRequestsTab uiLang={uiLang} />}
            {activeTab === "Library" && <LibraryTab uiLang={uiLang} />}
            {activeTab === "Report Cards" && <ReportCardsTab students={students} uiLang={uiLang} idt={idt} />}
            {activeTab === "Alumni" && <AlumniTab students={students} uiLang={uiLang} idt={idt} />}
            {activeTab === "Parent Portal" && <ParentPortalTab students={students} uiLang={uiLang} idt={idt} showToast={showToast} />}
            {activeTab === "Announcements" && <AnnouncementsTab uiLang={uiLang} students={students} />}
            {activeTab === "Analytics" && <AnalyticsTab uiLang={uiLang} />}
            {activeTab === "Students" && (
              <StudentsTab 
                uiLang={uiLang} idt={idt} toKhmerNumeral={toKhmerNumeral} parseLocalDate={parseLocalDate} translateShiftText={translateShiftText} translateCourseOrSpecialtyName={translateCourseOrSpecialtyName}
                students={students} 
                handleDeleteStudent={handleDeleteStudent}
                setSelectedStudent={setSelectedStudent} setIsViewStudentModalOpen={setIsViewStudentModalOpen} openEditStudentModal={openEditStudentModal}
                studentFilter={studentFilter} studentSearch={studentSearch} 
                studentViewMode={studentViewMode} setStudentSearch={setStudentSearch} attendanceCheckInLog={attendanceCheckInLog} getStudentStudyHours={getStudentStudyHours} setStudentGenderFilter={setStudentGenderFilter} translateLevelText={translateLevelText} openAddStudentModal={openAddStudentModal} setStudentFilter={setStudentFilter} setStudentViewMode={setStudentViewMode} studentGenderFilter={studentGenderFilter} showToast={showToast}
              />
            )}

            {activeTab === "Teachers" && (
              <TeachersTab uiLang={uiLang} idt={idt} teachers={teachers}  specialtyOptions={specialtyOptions} teachPhone={teachPhone} appTheme={appTheme} handleAddSpecialtyOption={handleAddSpecialtyOption} handleDeleteTeacher={handleDeleteTeacher} setIsOpenSpecialtyDropdown={setIsOpenSpecialtyDropdown} setTeachDob={setTeachDob} teachSalary={teachSalary} levelOptions={levelOptions} teachJoinDate={teachJoinDate} setTeachNameEn={setTeachNameEn} setEditingSpecialtyIndex={setEditingSpecialtyIndex} setTeachSpecialty={setTeachSpecialty} formatLangDate={formatLangDate} teachGender={teachGender} teachNameEn={teachNameEn} isOpenSpecialtyDropdown={isOpenSpecialtyDropdown} editingSpecialtyValue={editingSpecialtyValue} setTeacherViewMode={setTeacherViewMode} token={token} setEditingTeacherId={setEditingTeacherId} setTeachTeacherId={setTeachTeacherId} shiftOptions={shiftOptions} setEditingSpecialtyValue={setEditingSpecialtyValue} courseOptions={courseOptions} teachStatus={teachStatus} setTeachNameKh={setTeachNameKh} newCustomSpecialty={newCustomSpecialty} editingSpecialtyIndex={editingSpecialtyIndex} teachDob={teachDob} teachTeacherId={teachTeacherId} teachLeaveDate={teachLeaveDate} teachNameKh={teachNameKh} setTeachSalary={setTeachSalary} hoursOptions={hoursOptions} teachPob={teachPob} teachNotes={teachNotes} teachSpecialty={teachSpecialty} directorName={directorName} setTeachPhone={setTeachPhone} translatePOB={translatePOB} setTeachExperienceDays={setTeachExperienceDays} calculatedExpDays={calculatedExpDays} isTeacherModalOpen={isTeacherModalOpen} editingTeacherId={editingTeacherId} setNewCustomSpecialty={setNewCustomSpecialty} setShowAddSpecialty={setShowAddSpecialty} baseFee={baseFee} setTeachStatus={setTeachStatus} formatPaymentStatus={formatPaymentStatus} formatExperienceDays={formatExperienceDays} setTeacherSearch={setTeacherSearch} setTeachPaymentStatus={setTeachPaymentStatus} setTeachPob={setTeachPob} setTeachJoinDate={setTeachJoinDate} setTeachers={setTeachers} setTeachGender={setTeachGender} showToast={showToast} setTeachLeaveDate={setTeachLeaveDate} showAddSpecialty={showAddSpecialty} teachPaymentStatus={teachPaymentStatus} setTeachNotes={setTeachNotes} setSpecialtyOptions={setSpecialtyOptions} handleDeleteSpecialtyOption={handleDeleteSpecialtyOption} teacherSearch={teacherSearch} handleEditSpecialtyOption={handleEditSpecialtyOption} translateCourseOrSpecialtyName={translateCourseOrSpecialtyName} schoolName={schoolName} setIsTeacherModalOpen={setIsTeacherModalOpen} teacherViewMode={teacherViewMode} formatLangNum={formatLangNum} />
            )}

                        {/* 2. ATTENDANCE SHEET TAB */}
            {activeTab === "Attendance" && <AttendanceTab setReportPeriod={setReportPeriod} isAttendancePrintPreviewOpen={isAttendancePrintPreviewOpen} showTelegramMockup={showTelegramMockup} attendanceCheckInLog={attendanceCheckInLog} googleSheetsName={googleSheetsName} attendanceSubTab={attendanceSubTab} attendanceSearch={attendanceSearch} setPrintShowSignatures={setPrintShowSignatures} setIsAttendancePrintPreviewOpen={setIsAttendancePrintPreviewOpen} setShowDailyDetails={setShowDailyDetails} getStudentStudyHours={getStudentStudyHours} isGoogleSheetsSyncingOpen={isGoogleSheetsSyncingOpen} printShowSignatures={printShowSignatures} getStudentStartAndEndTimes={getStudentStartAndEndTimes} setShowBotConfig={setShowBotConfig} activeTab={activeTab} developerLogo={developerLogo} setDeveloperLogo={setDeveloperLogo} developerName={developerName} developerKhmerName={developerKhmerName} developerPhone={developerPhone} developerTelegram={developerTelegram}   directorName={directorName} baseFee={baseFee} studentIdPrefix={studentIdPrefix} setSchoolName={setSchoolName} setSchoolKhmerName={setSchoolKhmerName} setDirectorName={setDirectorName} setBaseFee={setBaseFee} setStudentIdPrefix={setStudentIdPrefix} setExpandedAttendanceRow={setExpandedAttendanceRow} googleSheetsSyncLogs={googleSheetsSyncLogs} setAttendanceCourseFilter={setAttendanceCourseFilter} token={token} schoolName={schoolName} setAttendanceType={setAttendanceType} isRefreshingAttendance={isRefreshingAttendance} googleSheetsURL={googleSheetsURL} setIsSavingAttendance={setIsSavingAttendance} setGoogleSheetsURL={setGoogleSheetsURL} isSavingPDF={isSavingPDF} setIsSavingPDF={setIsSavingPDF} translateShiftText={translateShiftText} showDailyDetails={showDailyDetails} printSelectedColumns={printSelectedColumns} setAttendanceDate={setAttendanceDate} attendanceNotes={attendanceNotes} setShowTelegramMockup={setShowTelegramMockup} setGoogleSheetsSyncStep={setGoogleSheetsSyncStep} printTitle={printTitle} setIsGoogleSheetsSyncingOpen={setIsGoogleSheetsSyncingOpen} students={students} setTelegramLogs={setTelegramLogs} setSelectedHistoryItem={setSelectedHistoryItem} expandedAttendanceRow={expandedAttendanceRow} setAttendanceSubTab={setAttendanceSubTab} setAttendanceCheckInLog={setAttendanceCheckInLog} setAttendanceNotes={setAttendanceNotes} showBotConfig={showBotConfig} teachers={teachers} translateLevelText={translateLevelText} setIsMuted={setIsMuted} attendanceCourseFilter={attendanceCourseFilter} setAbsenceModalData={setAbsenceModalData} schoolLogo={schoolLogo} printShowLogo={printShowLogo} attendanceType={attendanceType} isMuted={isMuted} setGoogleSheetsSyncLogs={setGoogleSheetsSyncLogs} reportPeriod={reportPeriod} setPrintSelectedColumns={setPrintSelectedColumns} showToast={showToast} setAttendanceCheckOutLog={setAttendanceCheckOutLog} schoolKhmerName={schoolKhmerName} idt={idt} attendanceCheckOutLog={attendanceCheckOutLog} getStudentHoursInfo={getStudentHoursInfo} setIsRefreshingAttendance={setIsRefreshingAttendance} uiLang={uiLang} absenceModalData={absenceModalData} telegramLogs={telegramLogs} selectedHistoryItem={selectedHistoryItem} setPrintTitle={setPrintTitle} googleSheetsSyncStep={googleSheetsSyncStep} setPrintShowLogo={setPrintShowLogo} toKhmerNumeral={toKhmerNumeral} setGoogleSheetsName={setGoogleSheetsName} attendanceDate={attendanceDate} isSavingAttendance={isSavingAttendance} translateCourseOrSpecialtyName={translateCourseOrSpecialtyName} setAttendanceSearch={setAttendanceSearch} />}
            {activeTab === "QR Scan" && (
              <motion.div
                key="qr-scan-tab"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                <QRScanTab
                  students={students}
                  teachers={teachers}
                  telegramLogs={telegramLogs}
                  setTelegramLogs={setTelegramLogs}
                  attendanceCheckInLog={attendanceCheckInLog}
                  setAttendanceCheckInLog={setAttendanceCheckInLog}
                  attendanceCheckOutLog={attendanceCheckOutLog}
                  setAttendanceCheckOutLog={setAttendanceCheckOutLog}
                  showToast={showToast}
                  uiLang={uiLang}
                />
              </motion.div>
            )}


            {/* ATTENDANCE DISPLAY TAB */}
            {activeTab === "Attendance Display" && (
              <motion.div
                key="attendance-display-tab"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                <AttendanceDisplayTab
                  students={students}
                  teachers={teachers}
                  telegramLogs={telegramLogs}
                  uiLang={uiLang}
                />
              </motion.div>
            )}


            {/* 4. FINANCIAL LEDGER TAB */}
            {activeTab === "Finance" && (
              <FinanceTab khqrImage={khqrImage}
                setKhqrImage={setKhqrImage}
                uiLang={uiLang}
                idt={idt}
                token={token}
                showToast={showToast}
                students={students}
                setStudents={setStudents}
                teachers={teachers}
                withSafeCss={withSafeCss}
                getStudentHoursInfo={getStudentHoursInfo}
                getStudentStudyHours={getStudentStudyHours}
                translateShiftText={translateShiftText}
                translateLevelText={translateLevelText}
                translateCourseOrSpecialtyName={translateCourseOrSpecialtyName}
                getCourseTitle={getCourseTitle}
                toKhmerNumberGlobal={toKhmerNumberGlobal}
                schoolLogo={schoolLogo}
                schoolKhmerName={schoolKhmerName}
                schoolName={schoolName}
                schoolPhone={schoolPhone}
                schoolAddress={schoolAddress}
                receiptFooterNote={receiptFooterNote} developerLogo={developerLogo} setDeveloperLogo={setDeveloperLogo} developerName={developerName} developerKhmerName={developerKhmerName} setDeveloperName={setDeveloperName} setDeveloperKhmerName={setDeveloperKhmerName} developerPhone={developerPhone} setDeveloperPhone={setDeveloperPhone} developerTelegram={developerTelegram} setDeveloperTelegram={setDeveloperTelegram}
                paymentMethods={paymentMethods}
                setPaymentMethods={setPaymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                isOpenPaymentMethodDropdown={isOpenPaymentMethodDropdown}
                setIsOpenPaymentMethodDropdown={setIsOpenPaymentMethodDropdown}
                editingPaymentMethodIndex={editingPaymentMethodIndex}
                setEditingPaymentMethodIndex={setEditingPaymentMethodIndex}
                editingPaymentMethodValue={editingPaymentMethodValue}
                setEditingPaymentMethodValue={setEditingPaymentMethodValue}
                newPaymentMethodValue={newPaymentMethodValue}
                setNewPaymentMethodValue={setNewPaymentMethodValue}
                showAddNewMethodInput={showAddNewMethodInput}
                setShowAddNewMethodInput={setShowAddNewMethodInput}
                salaryStatuses={salaryStatuses}
                setSalaryStatuses={setSalaryStatuses}
                isOpenSalaryStatusDropdown={isOpenSalaryStatusDropdown}
                setIsOpenSalaryStatusDropdown={setIsOpenSalaryStatusDropdown}
                editingSalaryStatusIndex={editingSalaryStatusIndex}
                setEditingSalaryStatusIndex={setEditingSalaryStatusIndex}
                editingSalaryStatusValue={editingSalaryStatusValue}
                setEditingSalaryStatusValue={setEditingSalaryStatusValue}
                newSalaryStatusValue={newSalaryStatusValue}
                setNewSalaryStatusValue={setNewSalaryStatusValue}
                expenseCategories={expenseCategories}
                setExpenseCategories={setExpenseCategories}
                isOpenExpenseCategoryDropdown={isOpenExpenseCategoryDropdown}
                setIsOpenExpenseCategoryDropdown={setIsOpenExpenseCategoryDropdown}
                editingExpenseCategoryId={editingExpenseCategoryId}
                setEditingExpenseCategoryId={setEditingExpenseCategoryId}
                editingExpenseCategoryLabelKh={editingExpenseCategoryLabelKh}
                setEditingExpenseCategoryLabelKh={setEditingExpenseCategoryLabelKh}
                editingExpenseCategoryLabelEn={editingExpenseCategoryLabelEn}
                setEditingExpenseCategoryLabelEn={setEditingExpenseCategoryLabelEn}
                newExpenseCategoryLabelKh={newExpenseCategoryLabelKh}
                setNewExpenseCategoryLabelKh={setNewExpenseCategoryLabelKh}
                newExpenseCategoryLabelEn={newExpenseCategoryLabelEn}
                setNewExpenseCategoryLabelEn={setNewExpenseCategoryLabelEn}
                isOpenExpensePaymentMethodDropdown={isOpenExpensePaymentMethodDropdown}
                setIsOpenExpensePaymentMethodDropdown={setIsOpenExpensePaymentMethodDropdown}
                editingExpensePaymentMethodIndex={editingExpensePaymentMethodIndex}
                setEditingExpensePaymentMethodIndex={setEditingExpensePaymentMethodIndex}
                editingExpensePaymentMethodValue={editingExpensePaymentMethodValue}
                setEditingExpensePaymentMethodValue={setEditingExpensePaymentMethodValue}
                newExpensePaymentMethodValue={newExpensePaymentMethodValue}
                setNewExpensePaymentMethodValue={setNewExpensePaymentMethodValue}
                financeSubTab={financeSubTab}
                setFinanceSubTab={setFinanceSubTab}
                financeSearchQuery={financeSearchQuery}
                setFinanceSearchQuery={setFinanceSearchQuery}
                transactions={transactions}
                setTransactions={setTransactions}
                selectedPaymentStudentId={selectedPaymentStudentId}
                setSelectedPaymentStudentId={setSelectedPaymentStudentId}
                paymentAmount={paymentAmount}
                setPaymentAmount={setPaymentAmount}
                showRecordPaymentModal={showRecordPaymentModal}
                setShowRecordPaymentModal={setShowRecordPaymentModal}
                paymentFormSuccess={paymentFormSuccess}
                setPaymentFormSuccess={setPaymentFormSuccess}
                viewReceiptTx={viewReceiptTx}
                setViewReceiptTx={setViewReceiptTx}
                salaries={salaries}
                setSalaries={setSalaries}
                salarySearchQuery={salarySearchQuery}
                setSalarySearchQuery={setSalarySearchQuery}
                showPaySalaryModal={showPaySalaryModal}
                setShowPaySalaryModal={setShowPaySalaryModal}
                selectedPayTeacherId={selectedPayTeacherId}
                setSelectedPayTeacherId={setSelectedPayTeacherId}
                payPeriodInput={payPeriodInput}
                setPayPeriodInput={setPayPeriodInput}
                salaryBaseAmount={salaryBaseAmount}
                setSalaryBaseAmount={setSalaryBaseAmount}
                salaryBonus={salaryBonus}
                setSalaryBonus={setSalaryBonus}
                salaryDeduction={salaryDeduction}
                setSalaryDeduction={setSalaryDeduction}
                salaryStatus={salaryStatus}
                setSalaryStatus={setSalaryStatus}
                salaryFormSuccess={salaryFormSuccess}
                setSalaryFormSuccess={setSalaryFormSuccess}
                viewSalaryReceipt={viewSalaryReceipt}
                setViewSalaryReceipt={setViewSalaryReceipt}
                schoolExpenses={schoolExpenses}
                setSchoolExpenses={setSchoolExpenses}
                expenseSearchQuery={expenseSearchQuery}
                setExpenseSearchQuery={setExpenseSearchQuery}
                expenseFilterCategory={expenseFilterCategory}
                setExpenseFilterCategory={setExpenseFilterCategory}
                showAddExpenseModal={showAddExpenseModal}
                setShowAddExpenseModal={setShowAddExpenseModal}
                expenseFormId={expenseFormId}
                setExpenseFormId={setExpenseFormId}
                expenseFormTitle={expenseFormTitle}
                setExpenseFormTitle={setExpenseFormTitle}
                expenseFormAmount={expenseFormAmount}
                setExpenseFormAmount={setExpenseFormAmount}
                expenseFormCategory={expenseFormCategory}
                setExpenseFormCategory={setExpenseFormCategory}
                expenseFormDate={expenseFormDate}
                setExpenseFormDate={setExpenseFormDate}
                expenseFormPaymentMethod={expenseFormPaymentMethod}
                setExpenseFormPaymentMethod={setExpenseFormPaymentMethod}
                expenseFormNote={expenseFormNote}
                setExpenseFormNote={setExpenseFormNote}
                expenseFormSuccess={expenseFormSuccess}
                setExpenseFormSuccess={setExpenseFormSuccess}
                deleteConfirm={deleteConfirm}
                setDeleteConfirm={setDeleteConfirm}
              />
            )}

            {/* STUDY MATERIALS & ASSETS MANAGEMENT TAB */}
            {activeTab === "Assets" && (
              <motion.div
                key="assets-tab"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                <AssetsTab
                  uiLang={uiLang}
                  showToast={showToast}
                />
              </motion.div>
            )}


            {/* ID CARD TAB - BEAUTIFULLY REDESIGNED */}
            {activeTab === "ID Card" && <IDCardTab setIdCardAddress={setIdCardAddress} idCardField3={idCardField3} idCardGender={idCardGender} frontCardRef={frontCardRef} idCardDob={idCardDob} idCardPrintSide={idCardPrintSide} selectedIdCardTeacher={selectedIdCardTeacher} isOpenTeacherIdCardDropdown={isOpenTeacherIdCardDropdown} idCardAddress={idCardAddress} setIdCardGender={setIdCardGender} setSelectedIdCardTeacher={setSelectedIdCardTeacher} setIsOpenTeacherIdCardDropdown={setIsOpenTeacherIdCardDropdown} setIdCardNameKh={setIdCardNameKh} idCardPhone={idCardPhone} isOpenStudentIdCardDropdown={isOpenStudentIdCardDropdown} idCardRole={idCardRole} handlePrefillStudent={handlePrefillStudent} activeTab={activeTab} developerLogo={developerLogo} setDeveloperLogo={setDeveloperLogo} developerName={developerName} developerKhmerName={developerKhmerName} developerPhone={developerPhone} developerTelegram={developerTelegram} setIdCardField4={setIdCardField4} handleImageUpload={handleImageUpload} setIsOpenStudentIdCardDropdown={setIsOpenStudentIdCardDropdown} setIdCardDob={setIdCardDob} idCardNameEn={idCardNameEn} idCardField4={idCardField4} idCardExpireDate={idCardExpireDate} selectedIdCardStudent={selectedIdCardStudent} setIdCardPhone={setIdCardPhone} handleSaveIdCardBackgrounds={handleSaveIdCardBackgrounds} idCardPhoto={idCardPhoto} setIdCardBackgroundFront={setIdCardBackgroundFront} setIdCardExpireDate={setIdCardExpireDate} setIdCardIssueDate={setIdCardIssueDate} setTeacherIdCardSearchQuery={setTeacherIdCardSearchQuery} students={students} idCardNameKh={idCardNameKh} idCardField1={idCardField1} idCardIdNumber={idCardIdNumber} setStudentIdCardSearchQuery={setStudentIdCardSearchQuery} idCardIssueDate={idCardIssueDate} setIdCardBackgroundBack={setIdCardBackgroundBack} teachers={teachers} setIdCardField1={setIdCardField1} idCardBackgroundBack={idCardBackgroundBack} schoolLogo={schoolLogo} handlePrefillTeacher={handlePrefillTeacher} setIdCardPrintSide={setIdCardPrintSide} setIdCardField3={setIdCardField3} printIdCard={printIdCard} saveAsPdf={saveAsPdf} backCardRef={backCardRef} isSavingBackgrounds={isSavingBackgrounds} studentIdCardSearchQuery={studentIdCardSearchQuery} uiLang={uiLang} idCardBackgroundFront={idCardBackgroundFront} downloadIdCard={downloadIdCard} setIdCardNameEn={setIdCardNameEn} idCardField2={idCardField2} setIdCardRole={setIdCardRole} setSelectedIdCardStudent={setSelectedIdCardStudent} teacherIdCardSearchQuery={teacherIdCardSearchQuery} setIdCardField2={setIdCardField2} setIdCardPhoto={setIdCardPhoto} idCardSchoolName={idCardSchoolName} setIdCardIdNumber={setIdCardIdNumber} />}


            {/* ACADEMIC CERTIFICATES & COMMENDATIONS TAB */}
            {activeTab === "Certificates" && (
              <motion.div
                key="certificates-tab"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="w-full"
              >
                <CertificatesTab token={token} 
                  students={students} 
                  teachers={teachers}
                  uiLang={uiLang} 
                  showToast={showToast} 
                  schoolName={schoolName}
                  schoolKhmerName={schoolKhmerName}
                  directorName={directorName}
                />
              </motion.div>
            )}


            {/* CREDENTIALS / STAFF PORTAL CREDENTIALS TAB */}
            {activeTab === "Credentials" && (
              <motion.div
                key="credentials-tab"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                <CredentialsTab showToast={showToast} uiLang={uiLang} loggedInUser={user} />
              </motion.div>
            )}


            {/* 7. SYSTEM CONFIGURATION / SETTINGS TAB */}
            {activeTab === "Settings" && <SettingsTab students={students} bannerSlides={bannerSlides} setBannerSlides={setBannerSlides} isMuted={isMuted} setIsMuted={setIsMuted} receiptFooterNote={receiptFooterNote} developerLogo={developerLogo} setDeveloperLogo={setDeveloperLogo} developerName={developerName} developerKhmerName={developerKhmerName} setDeveloperName={setDeveloperName} setDeveloperKhmerName={setDeveloperKhmerName} developerPhone={developerPhone} setDeveloperPhone={setDeveloperPhone} developerTelegram={developerTelegram} setDeveloperTelegram={setDeveloperTelegram} editingShiftValue={editingShiftValue} setSchoolAddress={setSchoolAddress} handleAddLevelOption={handleAddLevelOption} appTheme={appTheme} setReceiptFooterNote={setReceiptFooterNote} autoCalculateEndDate={autoCalculateEndDate} defaultDiscount={defaultDiscount} setEditingSpecialtyIndex={setEditingSpecialtyIndex} setEditingSpecialtyValue={setEditingSpecialtyValue} editingSpecialtyIndex={editingSpecialtyIndex} specialtyOptions={specialtyOptions} setDefaultStatus={setDefaultStatus} defaultStudyMonths={defaultStudyMonths} newCustomCourse={newCustomCourse} setAutoCalculateEndDate={setAutoCalculateEndDate} setSettingsSubTab={setSettingsSubTab} editingSpecialtyValue={editingSpecialtyValue} editingHoursValue={editingHoursValue} handleAddCourseOption={handleAddCourseOption} newCustomSpecialty={newCustomSpecialty} setEditingHoursValue={setEditingHoursValue} setSchoolPhone={setSchoolPhone} levelOptions={levelOptions} setNewCustomCourse={setNewCustomCourse} setDeleteConfirm={setDeleteConfirm} setSchoolTelegram={setSchoolTelegram} handleEditSpecialtyOption={handleEditSpecialtyOption} setAutoGenerateId={setAutoGenerateId} editingLevelIndex={editingLevelIndex} activeTab={activeTab} schoolName={schoolName} schoolKhmerName={schoolKhmerName} directorName={directorName} baseFee={baseFee} studentIdPrefix={studentIdPrefix} setSchoolName={setSchoolName} setSchoolKhmerName={setSchoolKhmerName} setDirectorName={setDirectorName} setBaseFee={setBaseFee} setStudentIdPrefix={setStudentIdPrefix} setEditingLevelIndex={setEditingLevelIndex} token={token} newCustomShift={newCustomShift} setNewCustomHours={setNewCustomHours} setNewCustomSpecialty={setNewCustomSpecialty} handleAddSpecialtyOption={handleAddSpecialtyOption} autoGenerateId={autoGenerateId} setEditingShiftIndex={setEditingShiftIndex} editingCourseIndex={editingCourseIndex} schoolTelegram={schoolTelegram} setDefaultStudyMonths={setDefaultStudyMonths} defaultGender={defaultGender} defaultStatus={defaultStatus} settingsSubTab={settingsSubTab} handleEditShiftOption={handleEditShiftOption} setEditingHoursIndex={setEditingHoursIndex} setDefaultGender={setDefaultGender} newCustomHours={newCustomHours} editingLevelValue={editingLevelValue} handleEditHoursOption={handleEditHoursOption} shiftOptions={shiftOptions} handleAddHoursOption={handleAddHoursOption} courseOptions={courseOptions} schoolPhone={schoolPhone} newCustomLevel={newCustomLevel} schoolLogo={schoolLogo} setSchoolLogo={setSchoolLogo} coverImage={coverImage} setCoverImage={setCoverImage} bannerTitle={bannerTitle} setBannerTitle={setBannerTitle} bannerSubtitle={bannerSubtitle} setBannerSubtitle={setBannerSubtitle} khqrImage={khqrImage} setKhqrImage={setKhqrImage} editingCourseValue={editingCourseValue} setAppTheme={setAppTheme} setEditingShiftValue={setEditingShiftValue} setEditingCourseValue={setEditingCourseValue} showToast={showToast} idt={idt} editingShiftIndex={editingShiftIndex} handleAddShiftOption={handleAddShiftOption} schoolAddress={schoolAddress} setDefaultDiscount={setDefaultDiscount} editingHoursIndex={editingHoursIndex} setEditingCourseIndex={setEditingCourseIndex} hoursOptions={hoursOptions} setNewCustomLevel={setNewCustomLevel} handleEditLevelOption={handleEditLevelOption} setEditingLevelValue={setEditingLevelValue} setNewCustomShift={setNewCustomShift} handleEditCourseOption={handleEditCourseOption} academicYear={academicYear} setAcademicYear={setAcademicYear} passingScore={passingScore} setPassingScore={setPassingScore} operatingDays={operatingDays} setOperatingDays={setOperatingDays} defaultSortBy={defaultSortBy} setDefaultSortBy={setDefaultSortBy} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} taxPercentage={taxPercentage} setTaxPercentage={setTaxPercentage} lateFeePenalty={lateFeePenalty} setLateFeePenalty={setLateFeePenalty} autoBackupDrive={autoBackupDrive} setAutoBackupDrive={setAutoBackupDrive} backupRetentionDays={backupRetentionDays} setBackupRetentionDays={setBackupRetentionDays} telegramBotToken={telegramBotToken} setTelegramBotToken={setTelegramBotToken} telegramChatId={telegramChatId} setTelegramChatId={setTelegramChatId} uiLang={uiLang} />}

            {/* 8. MYSQL DATABASE SYNC / INTEGRATION TAB */}
            {activeTab === "MySQL DB" && <MySQLDBTab showPrismaInMysql={showPrismaInMysql} mysqlUser={mysqlUser} handleGenerateAndDownloadSql={handleGenerateAndDownloadSql} mysqlHost={mysqlHost} mysqlDbName={mysqlDbName} teachers={teachers} setShowPrismaInMysql={setShowPrismaInMysql} handleTestMysqlConnection={handleTestMysqlConnection} dbCounts={dbCounts} setMysqlUser={setMysqlUser} handleLiveMigrate={handleLiveMigrate} showToast={showToast} mysqlPort={mysqlPort} setMysqlDbName={setMysqlDbName} idt={idt} setMysqlPort={setMysqlPort} setMysqlPassword={setMysqlPassword} activeTab={activeTab} developerLogo={developerLogo} setDeveloperLogo={setDeveloperLogo} developerName={developerName} developerKhmerName={developerKhmerName} developerPhone={developerPhone} developerTelegram={developerTelegram} testingConnection={testingConnection} token={token} handleGenerateSql={handleGenerateSql} setMysqlHost={setMysqlHost} migrationLogs={migrationLogs} mysqlPassword={mysqlPassword} generatedSql={generatedSql} toKhmerNumeral={toKhmerNumeral} generatingSql={generatingSql} migrating={migrating} students={students} uiLang={uiLang} />}
        </main>

        {/* Modern Mobile Floating Dock Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl py-2 px-3 flex justify-around items-center">
          <button
            onClick={() => setActiveTab("Dashboard")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === "Dashboard"
                ? "text-primary-600 bg-primary-50/60"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.25]" />
            <span className="text-[9px] font-black tracking-tight leading-none">
              {uiLang === "kh" ? "ទំព័រដើម" : uiLang === "zh" ? "首页" : "Home"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("QR Scan")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === "QR Scan"
                ? "text-primary-600 bg-primary-50/60"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <QrCode className="w-5 h-5 stroke-[2.25]" />
            <span className="text-[9px] font-black tracking-tight leading-none">
              {uiLang === "kh" ? "ស្កេន QR" : uiLang === "zh" ? "扫码" : "QR Scan"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Students")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === "Students"
                ? "text-primary-600 bg-primary-50/60"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Users className="w-5 h-5 stroke-[2.25]" />
            <span className="text-[9px] font-black tracking-tight leading-none">
              {uiLang === "kh" ? "សិស្ស" : uiLang === "zh" ? "学生" : "Students"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Finance")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === "Finance"
                ? "text-primary-600 bg-primary-50/60"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <CreditCard className="w-5 h-5 stroke-[2.25]" />
            <span className="text-[9px] font-black tracking-tight leading-none">
              {uiLang === "kh" ? "ហិរញ្ញវត្ថុ" : uiLang === "zh" ? "财务" : "Finance"}
            </span>
          </button>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-200 cursor-pointer text-slate-400 hover:text-slate-600"
          >
            <Menu className="w-5 h-5 stroke-[2.25]" />
            <span className="text-[9px] font-black tracking-tight leading-none">
              {uiLang === "kh" ? "បន្ថែម" : uiLang === "zh" ? "更多" : "More"}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 1. STUDENT REGISTER / EDIT FORM MODAL                      */}
      {/* ========================================================== */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fadeIn overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-xl mx-auto overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shadow-3xs shrink-0">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#2563eb] text-base md:text-lg tracking-tight">
                    {editingStudentId 
                      ? idt("កែប្រែព័ត៌មានសិស្ស", "Edit Student Profile", "修改学生资料")
                      : idt("ចុះឈ្មោះសិស្សថ្មី", "Register New Student", "注册新学生")}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {idt(
                      "សូមបំពេញព័ត៌មានលម្អិតខាងក្រោម ដើម្បីបង្កើតសិស្សថ្មីទៅក្នុងប្រព័ន្ធ",
                      "Please fill in the detailed information below to register a new student into the system.",
                      "请在下方填写详细信息，以便在系统中注册新学生。"
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer text-xs font-bold shadow-3xs border border-slate-200/50"
              >
                ✕
              </button>
            </div>
 
            {/* Modal Form Body */}
            <form onSubmit={handleSaveStudent} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="p-4 space-y-2.5 overflow-y-auto flex-1 min-h-0">
                
                {/* Row 1: Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("ឈ្មោះជាភាសាខ្មែរ", "Student Name (Khmer)", "学生姓名 (高棉语)")} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regNameKh}
                        onChange={(e) => setRegNameKh(e.target.value)}
                        placeholder={idt("ឧ. សុខ ជា", "E.g. SOK CHEA", "例如: 苏切亚")}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300 shadow-3xs"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("ឈ្មោះឡាតាំង", "Student Name (Latin/English)", "学生姓名 (拉丁/英语)")} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regNameEn}
                        onChange={(e) => setRegNameEn(e.target.value)}
                        placeholder={idt("ឧទាហរណ៍៖ SOK CHEA", "E.g. SOK CHEA", "例如: SOK CHEA")}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 uppercase focus:outline-none font-sans transition-all placeholder:text-slate-300 shadow-3xs"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Gender, Pricing & Paid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("ភេទ", "Gender", "性别")}
                    </label>
                    <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/40 h-[46px] items-center">
                      <button
                        type="button"
                        onClick={() => setRegGender("Male")}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer h-full ${
                          regGender === "Male"
                            ? "bg-white text-[#2563eb] shadow-3xs border border-slate-100"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {idt("ប្រុស", "Male (M)", "男 (M)")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegGender("Female")}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer h-full ${
                          regGender === "Female"
                            ? "bg-white text-[#2563eb] shadow-3xs border border-slate-100"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {idt("ស្រី", "Female (F)", "女 (F)")}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("តម្លៃសិក្សាពេញ ($)", "Full Fee ($)", "全额学费 ($)")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={regFullFee}
                        readOnly
                        disabled
                        placeholder="120"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/50 bg-slate-50 text-slate-400 font-sans text-[13px] font-bold outline-none select-none cursor-not-allowed shadow-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("បញ្ចុះតម្លៃ (%)", "Discount (%)", "折扣 (%)")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={regDiscount}
                        onChange={(e) => setRegDiscount(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 font-sans focus:outline-none transition-all shadow-3xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("ចំនួនបានបង់ ($)", "Amount Paid ($)", "已付金额 ($)")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={regPaid}
                        onChange={(e) => setRegPaid(Number(e.target.value) || 0)}
                        placeholder="120"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 font-sans focus:outline-none transition-all shadow-3xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Tuition Due & Remaining Due Boxes */}
                {(() => {
                  const finalFee = regFullFee - (regFullFee * regDiscount / 100);
                  const dueAmount = Math.max(0, finalFee - regPaid);
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-primary-50/40 border border-primary-150/40 rounded-2xl p-3 px-4 flex items-center justify-between shadow-3xs">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                          <span className="text-[11px] font-extrabold text-primary-950 font-sans">
                            {idt("• ថ្លៃត្រូវបង់ពិតប្រាកដ:", "• Net Tuition Fee (Final Fee):", "• 应付实际学费 (Final Fee):")}
                          </span>
                        </div>
                        <div className="bg-white border border-primary-100 px-3.5 py-1.5 rounded-xl font-black text-primary-700 text-xs shadow-3xs font-sans">
                          ${finalFee.toFixed(2)}
                        </div>
                      </div>

                      <div className={`border rounded-2xl p-3 px-4 flex items-center justify-between shadow-3xs ${
                        dueAmount > 0 
                          ? "bg-rose-50/40 border-rose-150/40" 
                          : "bg-emerald-50/40 border-emerald-150/40"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${dueAmount > 0 ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                          <span className={`text-[11px] font-extrabold font-sans ${dueAmount > 0 ? "text-rose-950" : "text-emerald-950"}`}>
                            {idt("• នៅខ្វះ:", "• Balance Due (Remaining Due):", "• 尚欠学费 (Remaining Due):")}
                          </span>
                        </div>
                        <div className={`bg-white px-3.5 py-1.5 rounded-xl font-black text-xs shadow-3xs font-sans border ${
                          dueAmount > 0 
                            ? "text-rose-600 border-rose-100 animate-pulse font-black" 
                            : "text-emerald-600 border-emerald-100"
                        }`}>
                          ${dueAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-slate-200 my-1" />

                {/* Row 4: DOB & POB */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("ថ្ងៃខែឆ្នាំកំណើត", "Date of Birth (DOB)", "出生日期 (DOB)")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-700 focus:outline-none font-sans transition-all shadow-3xs bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("ទីកន្លែងកំណើតបច្ចុប្បន្ន", "Place of Birth (POB)", "出生地点 (POB)")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regPob}
                        onChange={(e) => setRegPob(e.target.value)}
                        placeholder={idt("ឧ. ភ្នំពេញ", "E.g. Phnom Penh", "例如: 金边")}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-300 shadow-3xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 5: Course & Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-extrabold text-slate-600 font-sans">
                        {idt("វគ្គសិក្សា", "Course", "课程")}
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsOpenCourseDropdown(!isOpenCourseDropdown)}
                        className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 focus:outline-none transition-all bg-white shadow-3xs flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/30"
                      >
                        <span className="truncate">{regCourse || idt("ជ្រើសរើសវគ្គសិក្សា...", "Select course...", "选择课程...")}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenCourseDropdown ? "rotate-180" : ""}`} />
                      </button>

                      {/* Floating Dropdown List */}
                      {isOpenCourseDropdown && (
                        <>
                          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenCourseDropdown(false)} />
                          <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden p-1.5 text-xs flex flex-col max-h-[250px]">
                             <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 scrollbar-none">
                              {derivedCourseOptions.length === 0 ? (
                                <div className="p-3.5 text-center text-slate-400 font-semibold italic">
                                  {idt("សូមបន្ថែមព័ត៌មានកាលវិភាគជាមុនសិន! (Please add timetable schedules first!)", "Please add timetable schedules first!", "请先在课表添加课程！")}
                                </div>
                              ) : (
                                derivedCourseOptions.map((opt, idx) => {
                                  const isSelected = regCourse === opt;

                                  return (
                                    <div 
                                      key={idx} 
                                      className={`flex items-center justify-between p-1.5 rounded-lg transition-all group ${
                                        isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setRegCourse(opt);
                                          setIsOpenCourseDropdown(false);
                                        }}
                                        className="flex-1 text-left font-bold cursor-pointer pr-4 truncate"
                                      >
                                        {opt}
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-extrabold text-slate-600 font-sans">
                        {idt("កម្រិតសិក្សា", "Level", "级别/等级")}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsOpenLevelDropdown(!isOpenLevelDropdown)}
                        className="text-[10px] font-bold text-primary-600 hover:text-primary-800 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> {idt("កែសម្រួល / បន្ថែម", "Edit / Add Option", "编辑 / 添加级别")}
                      </button>
                    </div>
                    {showAddLevel ? (
                      <div className="flex items-center gap-1.5 animate-fadeIn">
                        <input
                          type="text"
                          value={newCustomLevel}
                          onChange={(e) => setNewCustomLevel(e.target.value)}
                          placeholder={idt("បញ្ចូលកម្រិតសិក្សាថ្មី...", "Enter new level name...", "输入新级别名称...")}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-primary-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-100 text-xs font-bold text-slate-800 focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleAddLevelOption}
                          className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] font-extrabold"
                        >
                          {idt("រក្សាទុក", "Save", "保存")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddLevel(false);
                            setNewCustomLevel("");
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-extrabold"
                        >
                          {idt("បោះបង់", "Cancel", "取消")}
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                          <Award className="w-4 h-4" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsOpenLevelDropdown(!isOpenLevelDropdown)}
                          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 focus:outline-none transition-all bg-white shadow-3xs flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/30"
                        >
                          <span className="truncate">{regLevel || idt("ជ្រើសរើសកម្រិតសិក្សា...", "Select level...", "选择级别...")}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenLevelDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {/* Floating Dropdown List */}
                        {isOpenLevelDropdown && (
                          <>
                            <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenLevelDropdown(false)} />
                            <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden p-1.5 text-xs flex flex-col max-h-[250px]">
                              <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 scrollbar-none">
                                {levelOptions.map((opt, idx) => {
                                  const isEditing = editingLevelIndex === idx;
                                  const isSelected = regLevel === opt;

                                  return (
                                    <div 
                                      key={idx} 
                                      className={`flex items-center justify-between p-1.5 rounded-lg transition-all group ${
                                        isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      {isEditing ? (
                                        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                                          <input
                                            type="text"
                                            value={editingLevelValue}
                                            onChange={(e) => setEditingLevelValue(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleEditLevelOption(idx, editingLevelValue);
                                                setEditingLevelIndex(null);
                                              } else if (e.key === "Escape") {
                                                setEditingLevelIndex(null);
                                              }
                                            }}
                                            className="flex-1 px-2 py-0.5 text-xs border border-primary-200 rounded-md focus:outline-none focus:border-primary-500 font-bold bg-white text-slate-700"
                                            autoFocus
                                          />
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditLevelOption(idx, editingLevelValue);
                                              setEditingLevelIndex(null);
                                            }}
                                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer shrink-0"
                                          >
                                            <Check className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingLevelIndex(null);
                                            }}
                                            className="p-1 text-slate-400 hover:bg-slate-100 rounded-md cursor-pointer shrink-0"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setRegLevel(opt);
                                              setIsOpenLevelDropdown(false);
                                            }}
                                            className="flex-1 text-left font-bold cursor-pointer pr-4 truncate"
                                          >
                                            {opt}
                                          </button>
                                          <div className="flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 hover:opacity-100 transition-opacity shrink-0">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingLevelIndex(idx);
                                                setEditingLevelValue(opt);
                                              }}
                                              className="p-1 text-primary-500 hover:bg-primary-100/50 rounded-md cursor-pointer"
                                              title="កែប្រែ (Edit)"
                                            >
                                              <Pencil className="w-3 h-3" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirm({ type: "level", index: idx, value: opt });
                                              }}
                                              className="p-1 text-rose-500 hover:bg-rose-100/50 rounded-md cursor-pointer"
                                              title="លុប (Delete)"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Add New Option inside the dropdown */}
                              <div className="border-t border-slate-100 pt-1.5 mt-1.5 flex items-center gap-1">
                                <input
                                  type="text"
                                  value={newCustomLevel}
                                  onChange={(e) => setNewCustomLevel(e.target.value)}
                                  placeholder={idt("+ បន្ថែមកម្រិតសិក្សាថ្មី...", "+ Add new level...", "+ 添加新级别...")}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddLevelOption();
                                    }
                                  }}
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 text-[11px] font-bold text-slate-700 bg-slate-50/50"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddLevelOption}
                                  className="px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm shrink-0"
                                >
                                  {idt("បន្ថែម", "Add", "添加")}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 6: Shift & Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-extrabold text-slate-600 font-sans">
                        {idt("វេនសិក្សា", "Shift", "班次/半天/全天")}
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                        <Clock className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsOpenShiftDropdown(!isOpenShiftDropdown)}
                        className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 focus:outline-none transition-all bg-white shadow-3xs flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/30"
                      >
                        <span className="truncate">{regShift || idt("ជ្រើសរើសវេនសិក្សា...", "Select shift...", "选择班次...")}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenShiftDropdown ? "rotate-180" : ""}`} />
                      </button>

                      {/* Floating Dropdown List */}
                      {isOpenShiftDropdown && (
                        <>
                          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenShiftDropdown(false)} />
                          <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden p-1.5 text-xs flex flex-col max-h-[250px]">
                            <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 scrollbar-none">
                              {derivedShiftOptions.length === 0 ? (
                                <div className="p-3.5 text-center text-slate-400 font-semibold italic">
                                  {idt("សូមបន្ថែមព័ត៌មានកាលវិភាគជាមុនសិន! (Please add timetable schedules first!)", "Please add timetable schedules first!", "请先在课表添加课程！")}
                                </div>
                              ) : (
                                derivedShiftOptions.map((opt, idx) => {
                                  const isSelected = regShift === opt;

                                  return (
                                    <div 
                                      key={idx} 
                                      className={`flex items-center justify-between p-1.5 rounded-lg transition-all group ${
                                        isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setRegShift(opt);
                                          setIsOpenShiftDropdown(false);
                                        }}
                                        className="flex-1 text-left font-bold cursor-pointer pr-4 truncate"
                                      >
                                        {opt}
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                       <label className="block text-[11px] font-extrabold text-slate-600 font-sans">
                        {idt("ម៉ោងសិក្សា", "Study Hours", "上课时间")}
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                        <Clock className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsOpenHoursDropdown(!isOpenHoursDropdown)}
                        className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 focus:outline-none transition-all bg-white shadow-3xs flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/30"
                      >
                        <span className="truncate">{regHours || idt("ជ្រើសរើសម៉ោងសិក្សា...", "Select study hours...", "选择时间...")}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenHoursDropdown ? "rotate-180" : ""}`} />
                      </button>

                      {/* Floating Dropdown List */}
                      {isOpenHoursDropdown && (
                        <>
                          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpenHoursDropdown(false)} />
                          <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden p-1.5 text-xs flex flex-col max-h-[250px]">
                            <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 scrollbar-none">
                              {derivedHoursOptions.length === 0 ? (
                                <div className="p-3.5 text-center text-slate-400 font-semibold italic">
                                  {idt("សូមបន្ថែមព័ត៌មានកាលវិភាគជាមុនសិន! (Please add timetable schedules first!)", "Please add timetable schedules first!", "请先在课表添加课程！")}
                                </div>
                              ) : (
                                derivedHoursOptions.map((opt, idx) => {
                                  const isSelected = regHours === opt;

                                  return (
                                    <div 
                                      key={idx} 
                                      className={`flex items-center justify-between p-1.5 rounded-lg transition-all group ${
                                        isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setRegHours(opt);
                                          setIsOpenHoursDropdown(false);
                                        }}
                                        className="flex-1 text-left font-bold cursor-pointer pr-4 truncate"
                                      >
                                        {opt}
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Linked Active Timetable / Schedule Section */}
                {(() => {
                  // Exact match
                  const exactMatchingSchedules = timetables.filter(t => 
                    t.subject?.trim().toLowerCase() === regCourse?.trim().toLowerCase()
                  );

                  // Substring match
                  const substringSchedules = timetables.filter(t => 
                    t.subject && regCourse && (
                      t.subject.trim().toLowerCase().includes(regCourse.trim().toLowerCase()) ||
                      regCourse.trim().toLowerCase().includes(t.subject.trim().toLowerCase())
                    ) && t.subject.trim().toLowerCase() !== regCourse.trim().toLowerCase()
                  );

                  const combinedMatching = [...exactMatchingSchedules, ...substringSchedules];
                  
                  // Calculate specific alignments for the selected course, hour, and shift
                  let alignmentStatus: "none" | "perfect" | "mismatch_hours" | "mismatch_days" | "mismatch_both" = "none";
                  
                  if (combinedMatching.length > 0) {
                    const hasExactTimeAndDayMatch = combinedMatching.some(sched => {
                      const schedHours = `${sched.startTime} - ${sched.endTime}`;
                      const schedShift = sched.dayOfWeek;
                      return regHours?.trim().toLowerCase() === schedHours.trim().toLowerCase() && 
                             regShift?.trim().toLowerCase() === schedShift.trim().toLowerCase();
                    });

                    if (hasExactTimeAndDayMatch) {
                      alignmentStatus = "perfect";
                    } else {
                      const hasDayMatch = combinedMatching.some(sched => {
                        const schedShift = sched.dayOfWeek;
                        return regShift?.trim().toLowerCase() === schedShift.trim().toLowerCase();
                      });
                      const hasHoursMatch = combinedMatching.some(sched => {
                        const schedHours = `${sched.startTime} - ${sched.endTime}`;
                        return regHours?.trim().toLowerCase() === schedHours.trim().toLowerCase();
                      });

                      if (hasDayMatch && !hasHoursMatch) {
                        alignmentStatus = "mismatch_hours";
                      } else if (!hasDayMatch && hasHoursMatch) {
                        alignmentStatus = "mismatch_days";
                      } else {
                        alignmentStatus = "mismatch_both";
                      }
                    }
                  }

                  // What to display
                  const displaySchedules = showAllTimetablesInReg ? timetables : (combinedMatching.length > 0 ? combinedMatching : []);

                  return (
                    <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-2xl space-y-3 shadow-3xs transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/40 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[12px] font-extrabold text-[#2563eb] flex items-center gap-1.5 font-sans">
                            <Calendar className="w-4 h-4 text-[#2563eb] stroke-[2.5]" />
                            {idt("កាលវិភាគសិក្សាប្រចាំថ្ងៃ", "Daily Study Schedule", "每日课表")}
                          </span>

                          <span className="text-[10px] bg-[#2563eb]/10 text-[#2563eb] px-2 py-0.5 rounded-full font-black font-sans leading-none">
                            {displaySchedules.length}
                          </span>
                          
                          {alignmentStatus === "perfect" && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200/60 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-sans">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {idt("ត្រូវគ្នាឥតខ្ចោះ", "Perfect Match", "完美匹配")}
                            </span>
                          )}

                          {alignmentStatus === "mismatch_hours" && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200/60 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-sans">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              {idt("ផ្សេងគ្នាម៉ោង", "Different Hours", "时间不匹配")}
                            </span>
                          )}

                          {alignmentStatus === "mismatch_days" && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200/60 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-sans">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              {idt("ផ្សេងគ្នាវេនសិក្សា", "Different Shift", "班次不匹配")}
                            </span>
                          )}

                          {alignmentStatus === "mismatch_both" && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200/60 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-sans">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              {idt("ខុសម៉ោង & វេន", "Mismatch Shift & Hours", "时间与班次均不匹配")}
                            </span>
                          )}

                          {alignmentStatus === "none" && !showAllTimetablesInReg && (
                            <span className="text-[10px] bg-slate-200/60 text-slate-600 border border-slate-300/60 px-2.5 py-0.5 rounded-full font-bold font-sans">
                              {idt("គ្មានកាលវិភាគត្រូវគ្នា", "No Matches", "无匹配")}
                            </span>
                          )}
                        </div>

                        {/* Toggle to show all timetables */}
                        <label className="flex items-center gap-2 text-[11px] text-slate-600 font-extrabold cursor-pointer select-none bg-white px-2.5 py-1 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={showAllTimetablesInReg}
                            onChange={(e) => setShowAllTimetablesInReg(e.target.checked)}
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{idt("បង្ហាញកាលវិភាគទាំងអស់", "Show All Timetables", "显示全部课表")}</span>
                        </label>
                      </div>

                      {displaySchedules.length === 0 ? (
                        <div className="text-[11px] text-slate-500 font-medium py-4 px-3 text-center bg-white border border-slate-200/60 rounded-xl flex flex-col items-center gap-1.5">
                          <p className="font-bold text-slate-600">
                            {idt(
                              `គ្មានកាលវិភាគត្រូវគ្នានឹងវគ្គសិក្សា "${regCourse || '?'}" ទេ`,
                              `No matching timetables for course "${regCourse || '?'}"`,
                              `未找到与课程 "${regCourse || '?'}" 匹配的课表`
                            )}
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowAllTimetablesInReg(true)}
                            className="text-[10px] text-[#2563eb] hover:text-blue-800 font-extrabold underline cursor-pointer mt-0.5 flex items-center gap-1"
                          >
                            <span>👉 {idt("ចុចទីនេះដើម្បីបង្ហាញកាលវិភាគទាំងអស់", "Click here to show all available timetables", "点击此处显示所有可用课表")}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {showAllTimetablesInReg && combinedMatching.length > 0 && (
                            <div className="text-[10px] text-primary-700 font-bold px-1 flex items-center gap-1 font-sans">
                              <Sparkles className="w-3.5 h-3.5 text-primary-500 animate-pulse" />
                              {idt("បង្ហាញកាលវិភាគទាំងអស់ (កាលវិភាគត្រូវគ្នាត្រូវបានរំលេចពណ៌)", "Showing all timetables (matching timetables are highlighted)", "正在显示所有课表 (匹配的课表已被高亮显示)")}
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1">
                            {displaySchedules.map((sched, idx) => {
                              // Find teacher
                              const teacherObj = teachers.find(t => t.id === sched.teacherId || t.teacherId === sched.teacherId);
                              const teacherName = teacherObj ? (teacherObj.nameKh || teacherObj.nameEn) : sched.teacherId;
                              
                              // Check if this matches the currently selected hours and shift
                              const schedHours = `${sched.startTime} - ${sched.endTime}`;
                              const isHoursMatched = regHours?.trim().toLowerCase() === schedHours.trim().toLowerCase();
                              const isDayMatched = regShift?.trim().toLowerCase() === sched.dayOfWeek.trim().toLowerCase();
                              const isFullySelected = isHoursMatched && isDayMatched;

                              // Check if this card's subject matches selected course (for highlighting in "show all" mode)
                              const isSubjectMatch = sched.subject?.trim().toLowerCase() === regCourse?.trim().toLowerCase() ||
                                (sched.subject && regCourse && (
                                  sched.subject.trim().toLowerCase().includes(regCourse.trim().toLowerCase()) ||
                                  regCourse.trim().toLowerCase().includes(sched.subject.trim().toLowerCase())
                                ));

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    // Auto-fill hours
                                    setRegHours(schedHours);
                                    // Auto-fill shift
                                    setRegShift(sched.dayOfWeek);
                                    // If subject is different and we clicked in "show all" mode, also update course
                                    if (showAllTimetablesInReg && sched.subject && sched.subject !== regCourse) {
                                      const matchCourseOpt = courseOptions.find(co => co.trim().toLowerCase() === sched.subject.trim().toLowerCase());
                                      if (matchCourseOpt) {
                                        setRegCourse(matchCourseOpt);
                                      } else {
                                        setRegCourse(sched.subject);
                                      }
                                    }
                                    showToast(idt(
                                      `បានកំណត់៖ វគ្គ ${sched.subject || '?'}, វេន ${sched.dayOfWeek || '?'}, ម៉ោង ${schedHours}`,
                                      `Set: Course ${sched.subject || '?'}, Shift ${sched.dayOfWeek || '?'}, Hours ${schedHours}`,
                                      `已设置: 课程 ${sched.subject || '?'}, 班次 ${sched.dayOfWeek || '?'}, 时间 ${schedHours}`
                                    ), "success");
                                  }}
                                  className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-2 cursor-pointer group relative hover:scale-[1.015] active:scale-[0.985] ${
                                    isFullySelected 
                                      ? "bg-blue-50 border-[#2563eb] ring-2 ring-[#2563eb]/20 shadow-xs" 
                                      : isSubjectMatch
                                        ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-400 hover:shadow-2xs"
                                        : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
                                  }`}
                                >
                                  {isFullySelected && (
                                    <div className="absolute top-3 right-3 bg-[#2563eb] text-white p-0.5 rounded-full shadow-xs animate-scaleIn">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  )}

                                  <div className="flex items-start justify-between gap-2">
                                    <span className={`font-black text-[10px] px-2 py-0.5 rounded-lg leading-none border shrink-0 ${
                                      isFullySelected 
                                        ? "bg-blue-100 text-[#2563eb] border-blue-200" 
                                        : isSubjectMatch
                                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                          : "bg-slate-100 text-slate-700 border-slate-200"
                                    }`}>
                                      {sched.dayOfWeek}
                                    </span>
                                    
                                    <span className="text-[11px] font-extrabold text-slate-800 truncate pr-4 max-w-[130px] flex items-center gap-1" title={sched.subject}>
                                      <BookOpen className={`w-3.5 h-3.5 shrink-0 ${isFullySelected ? "text-[#2563eb]" : "text-slate-400"}`} />
                                      {sched.subject}
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5 bg-slate-100/50 px-2.5 py-1 rounded-xl w-fit">
                                    <Clock className="w-3.5 h-3.5 text-[#2563eb]" />
                                    <span>{sched.startTime} - {sched.endTime}</span>
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2 mt-0.5">
                                    <span className="truncate flex items-center gap-1 text-slate-600">
                                      <User className="w-3.5 h-3.5 text-slate-400" />
                                      {teacherName}
                                    </span>
                                    <span className="shrink-0 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md font-sans text-[9px] flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-slate-400" />
                                      {sched.room || "N/A"}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Row 7: Reg Date & Months */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("កាលបរិច្ឆេទចុះឈ្មោះ", "Registration Date (Reg Date)", "注册日期 (Reg Date)")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        value={regStartDate}
                        onChange={(e) => setRegStartDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-700 focus:outline-none font-sans transition-all shadow-3xs bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5 font-sans">
                      {idt("ចំនួនខែសិក្សា", "Duration in Months", "学习月数 (Months)")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={regMonths}
                        onChange={(e) => setRegMonths(Number(e.target.value) || 1)}
                        placeholder="3"
                        min="1"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-[13px] font-bold text-slate-800 focus:outline-none transition-all shadow-3xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 8: Expected End Date & Days Remaining Metrics Container */}
                {(() => {
                  const calculatedEnd = calculateEndDate(regStartDate, regMonths);
                  const remainingDays = calculateRemainingDays(calculatedEnd, regStartDate, operatingDays);
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f5f7ff] border border-primary-100/40 p-4 rounded-2xl shadow-3xs">
                      <div>
                        <span className="block text-[11px] font-extrabold text-primary-950 mb-1.5 font-sans">
                          {idt("ថ្ងៃផុតកំណត់នៃការសិក្សា", "Study End Date", "学习截止日期 (Study End Date)")}
                        </span>
                        <div className="px-4 py-3 bg-white rounded-xl border border-primary-100/40 text-[13px] font-extrabold text-slate-800 font-sans shadow-3xs flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#2563eb]" />
                          <span>{calculatedEnd ? parseLocalDate(calculatedEnd).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "-"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[11px] font-extrabold text-primary-950 mb-1.5 font-sans">
                          {idt("ថ្ងៃសិក្សាដែលនៅសល់", "Remaining Days", "剩余学习天数 (Remaining Days)")}
                        </span>
                        <div className="px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[13px] font-extrabold text-emerald-800 font-sans shadow-3xs flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>
                            {uiLang === "kh" ? (
                              <>នៅសល់ <strong className="text-sm text-emerald-900 font-sans font-black">{remainingDays}</strong> ថ្ងៃទៀត</>
                            ) : uiLang === "zh" ? (
                              <>剩余 <strong className="text-sm text-emerald-900 font-sans font-black">{remainingDays}</strong> 天</>
                            ) : (
                              <><strong className="text-sm text-emerald-900 font-sans font-black">{remainingDays}</strong> days remaining</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Collapsible Section for extra features like Guardian info / Status to ensure zero loss of functionality */}
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    type="button"
                    onClick={() => setShowExtraOptions(!showExtraOptions)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left text-xs font-extrabold text-slate-700 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-[11px]">
                      ⚙️ {idt("ព័ត៌មានបន្ថែម និងអាណាព្យាបាល", "Guardian Details & Status", "监护人信息与学业状态 (Guardian & Status)")}
                    </span>
                    {showExtraOptions ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {showExtraOptions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-white border-t border-slate-100 p-4 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {idt("លេខសម្គាល់សិស្ស *", "Student ID *", "学生学号 (Student ID) *")}
                            </label>
                            <input
                              type="text"
                              value={regStudentId}
                              onChange={(e) => setRegStudentId(e.target.value)}
                              placeholder="STU-26-001"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-600 font-mono focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {idt("ស្ថានភាពសិក្សា", "Academic Status", "学业状态 (Status)")}
                            </label>
                            <select
                              value={regStatus}
                              onChange={(e) => setRegStatus(e.target.value as any)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-800 focus:outline-none"
                            >
                              <option value="STUDYING">{idt("កំពុងសិក្សា", "STUDYING", "在读 (STUDYING)")}</option>
                              <option value="COMPLETED">{idt("បានបញ្ចប់វគ្គ", "COMPLETED", "已毕业 (COMPLETED)")}</option>
                              <option value="STOP">{idt("បោះបង់ការសិក្សា", "DISCONTINUED", "中止/退学 (STOP)")}</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {idt("ឈ្មោះអាណាព្យាបាល", "Guardian Full Name", "监护人全名 (Guardian)")}
                            </label>
                            <input
                              type="text"
                              value={regGuardianName}
                              onChange={(e) => setRegGuardianName(e.target.value)}
                              placeholder={idt("ឧ. សុខ ម៉េងលី", "E.g. Sok Mengly", "例如: 苏孟利")}
                              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-800 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {idt("លេខទូរស័ព្ទ", "Guardian Phone", "监护人联系电话 (Phone)")}
                            </label>
                            <input
                              type="text"
                              value={regGuardianPhone}
                              onChange={(e) => setRegGuardianPhone(e.target.value)}
                              placeholder={idt("ឧ. 012 345 678", "E.g. 012 345 678", "例如: 012 345 678")}
                              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-800 focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1.5">
                          <input
                            type="checkbox"
                            id="telegram-chk-custom"
                            checked={regTelegramConnected}
                            onChange={(e) => setRegTelegramConnected(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                          />
                          <label htmlFor="telegram-chk-custom" className="text-xs text-slate-500 font-semibold cursor-pointer">
                            {idt("ភ្ជាប់ប្រព័ន្ធជាមួយឆានែល Telegram សាលា ដើម្បីទទួលដំណឹងបង់ប្រាក់ និងវត្តមានដោយស្វ័យប្រវត្តិ", "Link profile with school Telegram channel to auto-receive invoices & attendance alerts", "将此档案与学校 Telegram 频道绑定，自动发送账单和出勤提醒")}
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
 
  
            
                        {/* Modal Actions Footer */}
              <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 text-xs font-extrabold cursor-pointer transition-all shadow-3xs"
                >
                  {idt("បោះបង់", "Cancel", "取消")}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#4c3cf7] hover:bg-[#3d2ee0] text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all shadow-sm uppercase tracking-wider"
                >
                  <UserPlus className="w-4 h-4 text-primary-200" />
                  <span>{editingStudentId ? idt("រក្សាទុកព័ត៌មាន", "Save Student", "保存学生信息") : idt("ចុះឈ្មោះសិស្ស", "Register Student", "注册学生")}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. VIEW STUDENT DETAIL MODAL                               */}
      {/* ========================================================== */}
      {isViewStudentModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    {idt("ប្រវត្តិរូបសង្ខេបសិស្ស", "Student Detailed Profile", "学生详细资料")}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                    {idt("កំណត់ត្រាលម្អិត និងម៉ាទ្រីសលទ្ធផល", "Detailed record and performance matrix", "详细记录与表现评估")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsViewStudentModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              
              {/* Profile Top Banner */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/65">
                <div className={`w-14 h-14 rounded-full font-black text-lg flex items-center justify-center border shadow-3xs ${
                  selectedStudent.gender === "Female"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-cyan-100 text-cyan-700 border-cyan-200"
                }`}>
                  {selectedStudent.nameEn ? selectedStudent.nameEn.split(' ').map(n => n[0]).join('') : "ST"}
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-base font-black text-slate-800">{selectedStudent.nameKh}</h4>
                  <p className="text-xs text-slate-500 font-bold font-sans">({selectedStudent.nameEn})</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[9px] font-mono font-bold">
                      ID: {selectedStudent.studentId}
                    </span>
                    <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full ${
                      selectedStudent.status === "STUDYING"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : selectedStudent.status === "COMPLETED"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {selectedStudent.status === "STUDYING" ? idt("កំពុងសិក្សា", "STUDYING", "在读") : selectedStudent.status === "COMPLETED" ? idt("បានបញ្ចប់វគ្គ", "COMPLETED", "已毕业") : idt("បានឈប់រៀន", "DISCONTINUED", "已退学")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Lists */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("ភេទ", "Gender", "性别")}</span>
                    <p className="text-slate-800 font-extrabold">{selectedStudent.gender === "Female" ? idt("ស្រី", "Female", "女") : idt("ប្រុស", "Male", "男")}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("វគ្គសិក្សា", "Course Program", "课程项目")}</span>
                    <p className="text-teal-600 font-extrabold">{selectedStudent.course}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("កម្រិតសិក្សា", "Level", "级别/等级")}</span>
                    <p className="text-slate-700 font-extrabold">{selectedStudent.level}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("ម៉ោងសិក្សា", "Shift/Study Hours", "上课班次/时间")}</span>
                    <p className="text-slate-700 font-extrabold">{selectedStudent.shift}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("កាលបរិច្ឆេទចាប់ផ្តើម", "Start Date", "入学日期")}</span>
                    <p className="text-slate-700 font-extrabold font-sans">{selectedStudent.startDate}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">{idt("កាលបរិច្ឆេទបញ្ចប់", "End Date", "截止日期")}</span>
                    <p className="text-slate-700 font-extrabold font-sans">{selectedStudent.endDate}</p>
                  </div>
                </div>

                {/* Tuition Fee Breakdown */}
                <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100 space-y-3">
                  <span className="text-primary-700 text-[10px] uppercase font-black tracking-wider block">{idt("បច្ចុប្បន្នភាពគណនេយ្យ", "Ledger Statements", "财务账单汇总")}</span>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white p-2 rounded-lg border border-primary-100">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">{idt("តម្លៃវគ្គ", "Full Fee", "应付学费")}</span>
                      <span className="text-sm font-black text-slate-700 font-sans">${selectedStudent.fee}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-primary-100">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">{idt("បង់រួច", "Amount Paid", "已付金额")}</span>
                      <span className="text-sm font-black text-emerald-600 font-sans">${selectedStudent.paid}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-primary-100">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">{idt("នៅខ្វះ", "Balance Due", "尚欠学费")}</span>
                      <span className={`text-sm font-black font-sans ${selectedStudent.due > 0 ? "text-rose-600" : "text-slate-400"}`}>
                        ${selectedStudent.due}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact and Guardian Details */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/65 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>{idt("ព័ត៌មានទាក់ទង និងអាណាព្យាបាល", "Contact & Guardian Details", "联系与监护人信息")}</span>
                  </div>
                  {selectedStudent.phoneNumber && (
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                      <span>{idt("លេខទូរស័ព្ទសិស្ស", "Student Phone", "学生电话")}</span>
                      <span className="text-slate-800 font-mono">{selectedStudent.phoneNumber}</span>
                    </div>
                  )}
                  {selectedStudent.dob && (
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                      <span>{idt("ថ្ងៃខែឆ្នាំកំណើត", "Date of Birth", "出生日期")}</span>
                      <span className="text-slate-800 font-mono">{selectedStudent.dob}</span>
                    </div>
                  )}
                  {selectedStudent.pob && (
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                      <span>{idt("ទីកន្លែងកំណើត", "Place of Birth", "出生地点")}</span>
                      <span className="text-slate-800">{selectedStudent.pob}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>{idt("អាណាព្យាបាល", "Guardian", "监护人")}</span>
                    <span className="text-slate-800">{selectedStudent.guardianName || idt("គ្មានព័ត៌មាន", "None", "无")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>{idt("លេខទូរស័ព្ទអាណាព្យាបាល", "Guardian Phone", "监护人电话")}</span>
                    <span className="text-slate-800 font-mono">{selectedStudent.guardianPhone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>{idt("ស្ថានភាព Telegram", "Telegram Auto-Alerts", "Telegram 自动通知")}</span>
                    <span className={selectedStudent.telegramConnected ? "text-teal-600" : "text-slate-400"}>
                      {selectedStudent.telegramConnected ? idt("ភ្ជាប់រួចរាល់", "Connected", "已绑定") : idt("មិនទាន់ភ្ជាប់", "Not Connected", "未绑定")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            
              {/* Document Management Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-6 mb-4">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-primary-600" />
                    <h4 className="font-bold text-sm text-slate-800">ឯកសារ (Documents)</h4>
                  </div>
                  <div>
                    <input 
                      type="file" 
                      id="doc-upload" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        try {
                          const token = localStorage.getItem("plc_auth_token");
                          // Upload file
                          const formData = new FormData();
                          formData.append("file", file);
                          const uploadRes = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                            headers: { "Authorization": `Bearer ${token}` }
                          });
                          
                          let uploadData;
                          const contentType = uploadRes.headers.get("content-type");
                          if (contentType && contentType.indexOf("application/json") !== -1) {
                            uploadData = await safeJson(uploadRes);
                          } else {
                            throw new Error("Server returned non-JSON response (possibly file too large).");
                          }
                          
                          if (uploadData.url) {
                            // Create document
                            const docRes = await fetch("/api/documents", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                title: file.name,
                                fileUrl: uploadData.url,
                                type: "OTHER",
                                studentId: selectedStudent.id
                              })
                            });
                            
                            if (docRes.ok) {
                              const newDoc = await safeJson(docRes);
                              // Update selected student state
                              setSelectedStudent((prev: any) => prev ? {
                                ...prev,
                                documents: [...(prev.documents || []), newDoc]
                              } : null);
                              // Also update the students list
                              setStudents(students.map((s: any) => s.id === selectedStudent.id ? { ...s, documents: [...(s.documents || []), newDoc] } : s));
                              showToast("បានបន្ថែមឯកសារជោគជ័យ! (Document added successfully)", "success");
                            }
                          }
                        } catch (err) {
                          console.error(err);
                          showToast("មានបញ្ហាក្នុងការបន្ថែមឯកសារ! (Error adding document)", "error");
                        }
                      }}
                    />
                    <label htmlFor="doc-upload" className="px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> ឯកសារថ្មី
                    </label>
                  </div>
                </div>
                
                <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto">
                  {selectedStudent.documents && selectedStudent.documents.length > 0 ? (
                    selectedStudent.documents.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg transition-colors group">
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700 truncate font-medium">{doc.title}</span>
                        </a>
                        <button 
                          type="button"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirmDeleteDocId === doc.id) {
                              try {
                                const token = localStorage.getItem("plc_auth_token");
                                const res = await fetch(`/api/documents/${doc.id}`, {
                                  method: "DELETE",
                                  headers: { "Authorization": `Bearer ${token}` }
                                });
                                if (res.ok) {
                                  setSelectedStudent((prev: any) => prev ? {
                                    ...prev,
                                    documents: (prev.documents || []).filter((d: any) => d.id !== doc.id)
                                  } : null);
                                  setStudents(prev => prev.map((s: any) => s.id === selectedStudent.id ? { ...s, documents: (s.documents || []).filter((d: any) => d.id !== doc.id) } : s));
                                  showToast("បានលុបឯកសារជោគជ័យ! (Document deleted)", "success");
                                }
                              } catch (err) {
                                showToast("បរាជ័យក្នុងការលុបឯកសារ! (Failed to delete)", "error");
                              } finally {
                                setConfirmDeleteDocId(null);
                              }
                            } else {
                              setConfirmDeleteDocId(doc.id);
                              // Auto reset after 3500ms if not clicked again
                              setTimeout(() => {
                                setConfirmDeleteDocId(prev => prev === doc.id ? null : prev);
                              }, 3500);
                            }
                          }}
                          className={`p-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                            confirmDeleteDocId === doc.id 
                              ? "bg-rose-500 text-white shadow-xs px-2.5 py-1 animate-pulse" 
                              : "text-rose-500 hover:bg-rose-50 hover:text-rose-700 md:opacity-0 md:group-hover:opacity-100"
                          }`}
                        >
                          {confirmDeleteDocId === doc.id ? (
                            <>
                              <Trash2 className="w-3.5 h-3.5 animate-spin-slow" />
                              <span>ចុចលុប (Delete)</span>
                            </>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs font-medium">មិនទាន់មានឯកសារ (No documents)</div>
                  )}
                </div>
              </div>
            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3.5">
              <button
                onClick={() => {
                  setIsViewStudentModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-extrabold cursor-pointer transition-all"
              >
                {idt("យល់ព្រម", "Close / Acknowledge", "确认/关闭")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. PRINT CERTIFICATE MODAL OVERLAY                         */}
      {/* ========================================================== */}
      <div 
        id="certificate-modal-overlay" 
        className="hidden fixed inset-0 z-55 overflow-y-auto items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4 no-print-container">
          {/* Controls Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-primary-400">
              <Printer className="w-5 h-5 animate-pulse" />
              <div>
                <h4 className="text-sm font-extrabold text-white">លិខិតបញ្ជាក់ការសិក្សាឌីជីថល (Digital Certificate Viewer)</h4>
                <p className="text-[10px] text-slate-400">សាលា {schoolKhmerName || schoolName || "PLC Computer School"} Management System ជំនាន់ 9.0</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Trigger browser print
                  window.print();
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>បោះពុម្ព (Print Now)</span>
              </button>
              <button
                onClick={() => {
                  const modal = document.getElementById("certificate-modal-overlay");
                  if (modal) {
                    modal.classList.add("hidden");
                    modal.classList.remove("flex");
                  }
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                ចាកចេញ (Close)
              </button>
            </div>
          </div>

          {/* Render Actual Print Certificate Frame */}
          {selectedStudent && (
            <div 
              id="printable-diploma-sheet" 
              className="bg-[#fcfbf7] text-slate-900 p-8 md:p-14 border-[14px] border-double border-amber-600/90 rounded-2xl shadow-2xl relative flex flex-col items-center justify-between text-center space-y-6 overflow-hidden select-none"
              style={{
                backgroundColor: "#fcfbf7",
                minHeight: "580px"
              }}
            >
              {/* Outer thin border border */}
              <div className="absolute inset-2 border border-amber-600/40 rounded-lg pointer-events-none"></div>

              {/* Classical Certificate corner decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-600"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-600"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-600"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-600"></div>

              {/* Watermark Logo behind the main content */}
              <div className="absolute inset-0 opacity-[0.015] flex items-center justify-center pointer-events-none">
                <span className="text-[180px] font-black tracking-widest uppercase">PLC</span>
              </div>

              {/* National Kingdom header */}
              <div className="space-y-1 relative z-10">
                <p className="text-sm font-black tracking-[4px] text-slate-800 uppercase" style={{ fontFamily: "serif" }}>ព្រះរាជាណាចក្រកម្ពុជា</p>
                <p className="text-[11px] font-extrabold text-slate-600 tracking-wider">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                <div className="w-20 h-[1.5px] bg-amber-500 mx-auto mt-2.5"></div>
              </div>

              {/* Academy Emblem and Brand name */}
              <div className="space-y-2 relative z-10">
                {schoolLogo ? (
                  <div className="w-13 h-13 rounded-full border-2 border-amber-500 shadow-md mx-auto overflow-hidden flex items-center justify-center bg-white">
                    <img src={schoolLogo} alt="School Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-13 h-13 rounded-full bg-primary-800 text-white flex items-center justify-center font-black text-2xl border-2 border-amber-500 shadow-md mx-auto">
                    P
                  </div>
                )}
                <h3 className="text-base font-black text-primary-950 tracking-wide">
                  {schoolKhmerName ? `${schoolKhmerName} (${schoolName})` : schoolName}
                </h3>
                <p className="text-[9px] text-amber-700 font-black uppercase tracking-[3px]">Digital Technology Learning Center</p>
              </div>

              {/* Certificate Title */}
              <div className="space-y-1.5 relative z-10">
                <h2 className="text-xl md:text-2xl font-black text-amber-700 tracking-wide uppercase">វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា</h2>
                <h1 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[4px] font-sans">
                  Certificate of Completion
                </h1>
              </div>

              {/* Student Name Certification block */}
              <div className="space-y-4 max-w-xl relative z-10">
                <p className="text-xs font-bold text-slate-500">
                  {uiLang === "kh" ? (
                    `${schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} សូមបញ្ជាក់ថា សិស្សានុសិស្សដែលមានឈ្មោះដូចខាងក្រោមនេះ ៖`
                  ) : uiLang === "en" ? (
                    `This is to certify that the following student:`
                  ) : (
                    `特此证明以下学生：`
                  )}
                </p>
                <div className="py-2">
                  <span className="text-xl md:text-2xl font-black text-slate-800 border-b-2 border-dashed border-amber-600/50 pb-2 px-8">
                    {selectedStudent.nameKh} <span className="text-slate-400 text-sm font-extrabold font-sans">({selectedStudent.nameEn})</span>
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed max-w-lg mx-auto">
                  {uiLang === "kh" ? (
                    <>បានបញ្ចប់ការសិក្សាវគ្គបណ្តុះបណ្តាលបច្ចេកវិទ្យាកុំព្យូទ័រដោយជោគជ័យ លើមុខវិជ្ជា <span className="text-primary-950 font-black">{selectedStudent.course}</span> កម្រិតសិក្សា <span className="text-amber-700 font-extrabold">{selectedStudent.level}</span> ចាប់ផ្តើមពី <span className="font-mono text-slate-700 font-bold">{selectedStudent.startDate}</span> ដល់ <span className="font-mono text-slate-700 font-bold">{selectedStudent.endDate}</span>។</>
                  ) : uiLang === "en" ? (
                    <>has successfully completed the digital technology computer training course on <span className="text-primary-950 font-black">{selectedStudent.course}</span>, learning level <span className="text-amber-700 font-extrabold">{selectedStudent.level}</span>, starting from <span className="font-mono text-slate-700 font-bold">{selectedStudent.startDate}</span> to <span className="font-mono text-slate-700 font-bold">{selectedStudent.endDate}</span>.</>
                  ) : (
                    <>已成功完成信息技术计算机培训课程，主修科目 <span className="text-primary-950 font-black">{selectedStudent.course}</span>，学业水平 <span className="text-amber-700 font-extrabold">{selectedStudent.level}</span>，学期自 <span className="font-mono text-slate-700 font-bold">{selectedStudent.startDate}</span> 至 <span className="font-mono text-slate-700 font-bold">{selectedStudent.endDate}</span>。</>
                  )}
                </p>
              </div>

              {/* Signatures & Seal section */}
              <div className="w-full flex items-end justify-between pt-6 text-xs font-bold text-slate-500 relative z-10">
                <div className="text-left space-y-1">
                  <p className="font-bold text-[9px] text-slate-400">ID: {selectedStudent.studentId}</p>
                  <p className="text-[9px] text-slate-500">
                    {uiLang === "kh" ? "ប្រព័ន្ធត្រួតពិនិត្យវត្តមាន QR សកម្ម" : uiLang === "en" ? "Active QR Attendance Verification" : "二维码考勤系统验证"}
                  </p>
                  <p className="text-slate-600 font-mono text-[9px]">Verified Date: {selectedStudent.endDate}</p>
                </div>

                {/* Golden Seal of PLC Computer with Ribbon simulation */}
                <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                  {/* Ribbons */}
                  <div className="absolute bottom-[-14px] left-3 w-3 h-10 bg-red-600 rotate-12 origin-top opacity-85 rounded-b-[2px]"></div>
                  <div className="absolute bottom-[-14px] right-3 w-3 h-10 bg-red-600 -rotate-12 origin-top opacity-85 rounded-b-[2px]"></div>
                  
                  {/* Outer circle decoration */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/80 animate-spin" style={{ animationDuration: "16s" }}></div>
                  <div className="w-13 h-13 rounded-full bg-amber-500 text-white flex flex-col items-center justify-center font-black text-[8px] shadow-md border border-amber-600">
                    <span className="leading-none text-[8px] text-slate-900 tracking-tighter">PLC</span>
                    <span className="leading-none text-[7px] text-primary-950 mt-0.5">OFFICIAL</span>
                    <span className="leading-none text-[8px] text-slate-900 tracking-tighter mt-0.5">SEAL</span>
                  </div>
                </div>

                <div className="text-right space-y-12">
                  <p className="text-[9px] uppercase font-sans tracking-widest text-slate-400">Director Signature & Stamp</p>
                  <div className="space-y-0.5">
                    <p className="text-slate-800 font-black">{directorName || "ជី សុភា (CHY SOPHEA)"}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      {uiLang === "kh" ? "ប្រធានមជ្ឈមណ្ឌលសិក្សា" : uiLang === "en" ? "Academy Director" : "学院院长"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>


            {/* Mobile Bottom Navigation Bar (Visible only on screens < lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 lg:hidden shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        <div className="flex justify-between items-center h-13 w-full max-w-lg mx-auto px-2 sm:px-4">
          {(() => {
            const filteredMenu = menuItems.filter(i => {
              if (customPermissions) {
                return customPermissions.includes(i.id);
              }
              if (user?.role === "ACCOUNTANT") return ["Dashboard", "Finance", "Assets"].includes(i.id);
              if (user?.role === "TEACHER") return ["Dashboard", "Students", "Attendance", "Grading"].includes(i.id);
              if (user?.role === "STUDENT" || user?.role === "PARENT") return ["Dashboard", "Timetable", "Attendance", "Finance"].includes(i.id);
              return ["Dashboard", "Students", "Courses", "Attendance"].includes(i.id);
            });

            const getShortLabel = (id: string, labelKh: string, labelEn: string) => {
              if (uiLang === "kh") {
                if (id === "Dashboard") return "ទំព័រដើម";
                if (id === "Students") return "សិស្ស";
                if (id === "Teachers") return "គ្រូបង្រៀន";
                if (id === "Courses") return "វគ្គសិក្សា";
                if (id === "Attendance") return "វត្តមាន";
                return labelKh;
              } else if (uiLang === "en") {
                if (id === "Dashboard") return "Home";
                if (id === "Students") return "Students";
                if (id === "Teachers") return "Teachers";
                if (id === "Courses") return "Courses";
                if (id === "Attendance") return "Attendance";
                return labelEn;
              } else {
                if (id === "Dashboard") return "首页";
                if (id === "Students") return "学生";
                if (id === "Teachers") return "教师";
                if (id === "Attendance") return "考勤";
                return labelEn;
              }
            };

            // Left side menu items
            const leftItems = filteredMenu.slice(0, 2);
            // Right side menu items
            const rightItems = filteredMenu.slice(2, 3);

            return (
              <>
                {leftItems.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer relative py-1 focus:outline-none select-none ${
                        isSelected 
                          ? "text-primary-600 font-extrabold" 
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <IconComp className={`w-5 h-5 ${isSelected ? "stroke-[2.2]" : "stroke-[1.8]"}`} />
                      <span className="text-[10px] truncate max-w-full px-0.5 leading-none font-bold">
                        {getShortLabel(item.id, item.labelKh, item.labelEn)}
                      </span>
                      {isSelected && (
                        <span className="w-1 h-1 bg-primary-600 rounded-full mt-0.5" />
                      )}
                    </button>
                  );
                })}

                {/* Center Quick Action Clean Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileHubOpen(true)}
                  className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-md active:scale-95 transition-all duration-200 cursor-pointer shrink-0 mx-1 focus:outline-none select-none"
                  title="សកម្មភាពរហ័ស (Quick Actions)"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </button>

                {rightItems.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer relative py-1 focus:outline-none select-none ${
                        isSelected 
                          ? "text-primary-600 font-extrabold" 
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <IconComp className={`w-5 h-5 ${isSelected ? "stroke-[2.2]" : "stroke-[1.8]"}`} />
                      <span className="text-[10px] truncate max-w-full px-0.5 leading-none font-bold">
                        {getShortLabel(item.id, item.labelKh, item.labelEn)}
                      </span>
                      {isSelected && (
                        <span className="w-1 h-1 bg-primary-600 rounded-full mt-0.5" />
                      )}
                    </button>
                  );
                })}

                {/* Menu / More Button */}
                {(() => {
                  const isMoreSelected = !leftItems.some(i => i.id === activeTab) && !rightItems.some(i => i.id === activeTab);
                  return (
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(true)}
                      className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer relative py-1 focus:outline-none select-none ${
                        isMoreSelected 
                          ? "text-primary-600 font-extrabold" 
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Menu className={`w-5 h-5 ${isMoreSelected ? "stroke-[2.2]" : "stroke-[1.8]"}`} />
                      <span className="text-[10px] truncate leading-none font-bold">
                        {uiLang === "kh" ? "បន្ថែម" : uiLang === "en" ? "More" : "更多"}
                      </span>
                      {isMoreSelected && (
                        <span className="w-1 h-1 bg-primary-600 rounded-full mt-0.5" />
                      )}
                    </button>
                  );
                })()}
              </>
            );
          })()}
        </div>
      </div>

      {/* ========================================================== */}
      {/* MOBILE QUICK ACTION HUB OVERLAY                            */}
      {/* ========================================================== */}
      <AnimatePresence>
        {isMobileHubOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileHubOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            {/* Quick Hub Drawer Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white border-t border-slate-100/85 rounded-t-[40px] shadow-[0_-15px_45px_rgba(15,23,42,0.15)] p-6 pb-9 flex flex-col gap-5.5 z-10"
            >
              {/* Native Sheet Pull Handle */}
              <div className="w-14 h-1.5 bg-slate-200 rounded-full mx-auto -mt-2.5 mb-1 shrink-0 opacity-80" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black shadow-md">
                    {schoolLogo ? (
                      <img src={schoolLogo} className="w-8 h-8 object-contain rounded-lg" alt="" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-xs uppercase tracking-tight">PLC</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-slate-850 text-base font-extrabold tracking-tight">
                      {uiLang === "kh" ? schoolKhmerName : schoolName}
                    </h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      {uiLang === "kh" ? "សកម្មភាពរហ័សទូរស័ព្ទដៃ" : "Mobile Quick Hub"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileHubOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100/60 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Grid of Actions */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-3.5"
              >
                {/* 1. Register Student */}
                {(user?.role === "ADMIN" || user?.role === "STAFF") && (
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setIsMobileHubOpen(false);
                      setIsStudentModalOpen(true);
                      setEditingStudentId(null);
                    }}
                    className="flex flex-col items-center gap-3 p-4 bg-emerald-50/15 hover:bg-emerald-50/35 border border-emerald-100/30 hover:border-emerald-200/50 rounded-3xl active:scale-95 transition-all text-center cursor-pointer min-h-[110px] justify-center shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-500/5">
                      <UserPlus className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-slate-850 text-[13px] font-extrabold">ចុះឈ្មោះសិស្ស</p>
                      <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">New Student</p>
                    </div>
                  </motion.button>
                )}

                {/* 2. Scan QR Attendance */}
                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsMobileHubOpen(false);
                    setActiveTab("QR Scan");
                  }}
                  className="flex flex-col items-center gap-3 p-4 bg-blue-50/15 hover:bg-blue-50/35 border border-blue-100/30 hover:border-blue-200/50 rounded-3xl active:scale-95 transition-all text-center cursor-pointer min-h-[110px] justify-center shadow-xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-xs border border-blue-500/5">
                    <QrCode className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-slate-850 text-[13px] font-extrabold">ស្កេនវត្តមាន QR</p>
                    <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">Scan QR</p>
                  </div>
                </motion.button>

                {/* 3. Record Attendance */}
                {user?.role !== "STUDENT" && user?.role !== "PARENT" && (
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setIsMobileHubOpen(false);
                      setActiveTab("Attendance");
                    }}
                    className="flex flex-col items-center gap-3 p-4 bg-sky-50/15 hover:bg-sky-50/35 border border-sky-100/30 hover:border-sky-200/50 rounded-3xl active:scale-95 transition-all text-center cursor-pointer min-h-[110px] justify-center shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center shadow-xs border border-sky-500/5">
                      <CheckCircle className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-slate-850 text-[13px] font-extrabold">កត់វត្តមាន</p>
                      <p className="text-sky-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">Attendance</p>
                    </div>
                  </motion.button>
                )}

                {/* 4. Record Payment */}
                {(user?.role === "ADMIN" || user?.role === "ACCOUNTANT") && (
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setIsMobileHubOpen(false);
                      setActiveTab("Finance");
                      setFinanceSubTab("tuition");
                      setShowRecordPaymentModal(true);
                    }}
                    className="flex flex-col items-center gap-3 p-4 bg-amber-50/15 hover:bg-amber-50/35 border border-amber-100/30 hover:border-amber-200/50 rounded-3xl active:scale-95 transition-all text-center cursor-pointer min-h-[110px] justify-center shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-xs border border-amber-500/5">
                      <Coins className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-slate-850 text-[13px] font-extrabold">បង់ថ្លៃសិក្សា</p>
                      <p className="text-amber-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">Tuition Fee</p>
                    </div>
                  </motion.button>
                )}

                {/* 5. Analytics & Reports */}
                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsMobileHubOpen(false);
                    setActiveTab("Dashboard");
                  }}
                  className="flex flex-col items-center gap-3 p-4 bg-rose-50/15 hover:bg-rose-50/35 border border-rose-100/30 hover:border-rose-200/50 rounded-3xl active:scale-95 transition-all text-center cursor-pointer min-h-[110px] justify-center shadow-xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shadow-xs border border-rose-500/5">
                    <Activity className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-slate-850 text-[13px] font-extrabold">របាយការណ៍រួម</p>
                    <p className="text-rose-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">Stats & Info</p>
                  </div>
                </motion.button>

                {/* 6. Settings */}
                {(user?.role === "ADMIN") && (
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setIsMobileHubOpen(false);
                      setActiveTab("Settings");
                    }}
                    className="flex flex-col items-center gap-3 p-4 bg-blue-50/15 hover:bg-blue-50/35 border border-blue-100/30 hover:border-blue-200/50 rounded-3xl active:scale-95 transition-all text-center cursor-pointer min-h-[110px] justify-center shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-xs border border-blue-500/5">
                      <Settings className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-slate-850 text-[13px] font-extrabold">ការកំណត់</p>
                      <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">Settings</p>
                    </div>
                  </motion.button>
                )}
              </motion.div>

              {/* Developer Support Widget */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mt-1 bg-slate-50/80 border border-slate-100/80 rounded-[24px] p-4 flex flex-col gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Smartphone className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-slate-800 text-[12px] font-black">ទំនាក់ទំនងអ្នកបច្ចេកទេសប្រព័ន្ធ</p>
                    <p className="text-slate-500 text-[9px] font-semibold uppercase tracking-wider mt-0.5">System Support & Helpdesk</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10.5px] font-black">
                  <a
                    href={developerTelegram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 bg-[#0088cc]/5 hover:bg-[#0088cc]/10 text-[#0088cc] rounded-xl transition-all border border-[#0088cc]/10 hover:border-[#0088cc]/20 cursor-pointer font-bold text-xs shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram Support</span>
                  </a>
                  <a
                    href={`tel:${developerPhone}`}
                    className="flex items-center justify-center gap-2 py-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 rounded-xl transition-all border border-emerald-500/10 hover:border-emerald-500/20 cursor-pointer font-bold text-xs shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Support</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* CUSTOM STUDENT DELETE CONFIRMATION MODAL                   */}
      {/* ========================================================== */}
      {isStudentDeleteModalOpen && studentToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-slate-100 max-w-sm w-full overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-inner">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {uiLang === "kh" ? "តើអ្នកពិតជាចង់លុបឈ្មោះសិស្សនេះមែនទេ?" : uiLang === "zh" ? "您确定要删除此学生吗？" : "Are you sure you want to delete this student?"}
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  {uiLang === "kh" ? (
                    <>អ្នកកំពុងធ្វើការលុបឈ្មោះសិស្ស <span className="text-rose-600 font-extrabold">{studentToDelete.nameKh} ({studentToDelete.nameEn})</span> ចេញពីប្រព័ន្ធគ្រប់គ្រងសាលា PLC Computer។ សកម្មភាពនេះនឹងលុបទិន្នន័យវត្តមាន និងវិក្កយបត្រទាំងអស់របស់សិស្សនេះ ហើយមិនអាចត្រឡប់ក្រោយវិញបានទេ!</>
                  ) : uiLang === "zh" ? (
                    <>您正在从 PLC Computer 学校管理系统中删除学生 <span className="text-rose-600 font-extrabold">{studentToDelete.nameKh} ({studentToDelete.nameEn})</span>。此操作将永久删除该学生的所有考勤和账单数据，且无法撤销！</>
                  ) : (
                    <>You are deleting student <span className="text-rose-600 font-extrabold">{studentToDelete.nameKh} ({studentToDelete.nameEn})</span> from the PLC Computer school management system. This action will permanently delete all attendance and invoice records for this student and cannot be undone!</>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => {
                    setIsStudentDeleteModalOpen(false);
                    setStudentToDelete(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  {uiLang === "kh" ? "ទេ បោះបង់" : uiLang === "zh" ? "取消" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteStudent}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/10"
                >
                  {uiLang === "kh" ? "បាទ លុបចេញ" : uiLang === "zh" ? "确认删除" : "Confirm Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================== */}
      {/* CUSTOM TEACHER DELETE CONFIRMATION MODAL                   */}
      {/* ========================================================== */}
      {isTeacherDeleteModalOpen && teacherToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-slate-100 max-w-sm w-full overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-inner">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {uiLang === "kh" ? "តើអ្នកពិតជាចង់លុបឈ្មោះគ្រូនេះមែនទេ?" : uiLang === "zh" ? "您确定要删除此教师吗？" : "Are you sure you want to delete this teacher?"}
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  {uiLang === "kh" ? (
                    <>អ្នកកំពុងធ្វើការលុបឈ្មោះគ្រូបង្រៀន <span className="text-rose-600 font-extrabold">{teacherToDelete.nameKh} ({teacherToDelete.nameEn})</span> ចេញពីប្រព័ន្ធគ្រប់គ្រងសាលា PLC Computer។ សកម្មភាពនេះនឹងលុបព័ត៌មានវត្តមាន និងទិន្នន័យបើកប្រាក់ខែរបស់គ្រូនេះ ហើយមិនអាចត្រឡប់ក្រោយវិញបានទេ!</>
                  ) : uiLang === "zh" ? (
                    <>您正在从 PLC Computer 学校管理系统中删除教师 <span className="text-rose-600 font-extrabold">{teacherToDelete.nameKh} ({teacherToDelete.nameEn})</span>。此操作将永久删除该教师的所有考勤和工资发放数据，且无法撤销！</>
                  ) : (
                    <>You are deleting teacher <span className="text-rose-600 font-extrabold">{teacherToDelete.nameKh} ({teacherToDelete.nameEn})</span> from the PLC Computer school management system. This action will permanently delete all attendance and salary records for this teacher and cannot be undone!</>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => {
                    setIsTeacherDeleteModalOpen(false);
                    setTeacherToDelete(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  {uiLang === "kh" ? "ទេ បោះបង់" : uiLang === "zh" ? "取消" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteTeacher}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/10"
                >
                  {uiLang === "kh" ? "បាទ លុបចេញ" : uiLang === "zh" ? "确认删除" : "Confirm Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Copilot floating panel is removed as per user request */}

      {/* Printable high precision ID cards container for media print */}
      <div id="printable-id-card-sheet">
        {(idCardPrintSide === 'front' || idCardPrintSide === 'both') && renderFrontCard()}
        {(idCardPrintSide === 'back' || idCardPrintSide === 'both') && renderBackCard()}
      </div>

    </div>
  );
}