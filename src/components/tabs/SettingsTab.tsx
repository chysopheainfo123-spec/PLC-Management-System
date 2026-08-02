import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Camera, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle, Upload, QrCode, Palette, Send, Settings, SlidersHorizontal, Shield, Hash, Minus, Truck, Loader2, Link, Copy, ExternalLink, Share2, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';


const PermissionItem = ({ checked, labelKh, labelEn }: { checked: boolean; labelKh: string; labelEn: string }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${checked ? "bg-primary-100 text-primary-600" : "bg-slate-100 text-slate-300"}`}>
        {checked ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3 stroke-[3]" />}
      </div>
      <span className={`text-xs font-bold ${checked ? "text-slate-700" : "text-slate-400 line-through decoration-slate-300"}`}>
        {labelKh} <span className="font-medium opacity-60 ml-1">({labelEn})</span>
      </span>
    </div>
  );
};

const missionTemplates = [
  {
    title: "ទិញសម្ភារៈសិក្សា",
    purpose: "ទិញសម្ភារៈសិក្សាបន្ថែមសម្រាប់ថ្នាក់រៀនថ្មី និងការិយាល័យ",
    destination: "ផ្សារអូរឫស្សី រាជធានីភ្នំពេញ",
    transport: "រថយន្តសាលា"
  },
  {
    title: "ចូលរួមសិក្ខាសាលា",
    purpose: "ចូលរួមសិក្ខាសាលាស្តីពី ការអភិវឌ្ឍន៍ជំនាញបច្ចេកវិទ្យាអប់រំជំនាន់ថ្មី",
    destination: "សណ្ឋាគាររ៉េស៊ីដង់ ខេត្តសៀមរាប",
    transport: "រថយន្តឈ្នួល"
  },
  {
    title: "ផ្សព្វផ្សាយវគ្គសិក្សា",
    purpose: "ចុះយុទ្ធនាការផ្សព្វផ្សាយវគ្គសិក្សាថ្មី និងចុះឈ្មោះសិស្សានុសិស្ស",
    destination: "វិទ្យាល័យនានា ក្នុងខេត្តបាត់ដំបង",
    transport: "ម៉ូតូផ្ទាល់ខ្លួន"
  },
  {
    title: "ដឹកនាំសិស្សប្រឡង",
    purpose: "ដឹកនាំសិស្សានុសិស្សចូលរួមប្រឡងប្រជែងសមត្ថភាពផ្នែកព័ត៌មានវិទ្យាថ្នាក់ជាតិ",
    destination: "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ",
    transport: "រថយន្តសាលា"
  },
  {
    title: "វគ្គបណ្តុះបណ្តាល",
    purpose: "ចូលរួមវគ្គបណ្តុះបណ្តាលគរុកោសល្យ និងវិធីសាស្ត្របង្រៀនកុំព្យូទ័រឈានមុខ",
    destination: "មជ្ឈមណ្ឌលជាតិ សហប្រតិបត្តិការ រាជធានីភ្នំពេញ",
    transport: "ម៉ូតូសាលា"
  }
];

export default function SettingsTab(props: any) {
  const [activeCategory, setActiveCategory] = React.useState<"school" | "banner" | "telegram" | "khqr" | "permissions" | "mission" | "login_links">("school");
  const [isEditingDeveloper, setIsEditingDeveloper] = React.useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = React.useState(false);
  const [qrPosterModal, setQrPosterModal] = React.useState<"admin" | "guardian" | null>(null);
  const [previewScale, setPreviewScale] = React.useState(0.7);
  const [showStampGraphic, setShowStampGraphic] = React.useState(true);
  const [currentMissionId, setCurrentMissionId] = React.useState<string | null>(null);
  const [savedMissionLetters, setSavedMissionLetters] = React.useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("plc_mission_letters") || "[]");
    } catch (e) {
      return [];
    }
  });

  const initialMissionForm = {
    documentType: "mission",
    letterNo: "",
    staffName: "",
    staffGender: "ប្រុស",
    staffPosition: "",
    dob: "",
    idCardNo: "",
    joinedDate: "",
    employmentStatus: "កំពុងបម្រើការងារ",
    salary: "",
    showSalary: false,
    destination: "",
    purpose: "",
    startDate: "",
    endDate: "",
    duration: "",
    transport: "",
    allowance: "",
    issueDate: new Date().toISOString().split('T')[0]
  };

  const [missionForm, setMissionForm] = React.useState(initialMissionForm);

  const formatDateToPrint = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const saveMissionLetter = (letter: any) => {
    try {
      const exists = savedMissionLetters.findIndex(l => l.id === letter.id);
      let updated;
      if (exists >= 0) {
        updated = [...savedMissionLetters];
        updated[exists] = letter;
        showToast(idt("បានធ្វើបច្ចុប្បន្នភាពរួចរាល់!", "Letter updated successfully!", "更新成功！"), "success");
      } else {
        updated = [letter, ...savedMissionLetters];
        showToast(idt("រក្សាទុកជោគជ័យ!", "Letter saved successfully!", "保存成功！"), "success");
      }
      setSavedMissionLetters(updated);
      localStorage.setItem("plc_mission_letters", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
      showToast("Error saving letter", "error");
    }
  };

  const handleNewMissionForm = () => {
    setCurrentMissionId(null);
    setMissionForm({
      ...initialMissionForm,
      letterNo: `PLC-${new Date().getFullYear()}-${toKhmerNum(savedMissionLetters.length + 1)}`
    });
  };

  const handleExportWord = () => {
    exportToWord();
  };
  
  // Advanced Mission Features states
  const [teachersList, setTeachersList] = React.useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = React.useState(false);
  const [showTeacherSuggestions, setShowTeacherSuggestions] = React.useState(false);
  const [layoutFontSize, setLayoutFontSize] = React.useState<"small" | "medium" | "large">("medium");
  const [showStaffSig, setShowStaffSig] = React.useState(true);
  const [showAllowanceRow, setShowAllowanceRow] = React.useState(true);
  const [showStampBox, setShowStampBox] = React.useState(true);

  // Fetch teachers for search selection
  React.useEffect(() => {
    if ((activeCategory === "mission" || isMissionModalOpen) && props.token) {
      setLoadingTeachers(true);
      fetch("/api/teachers", {
        headers: {
          "Authorization": `Bearer ${props.token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.teachers) {
            setTeachersList(data.teachers);
          }
        })
        .catch(err => console.error("Error loading teachers inside SettingsTab:", err))
        .finally(() => setLoadingTeachers(false));
    }
  }, [activeCategory, isMissionModalOpen, props.token]);

  // Auto-calculate Duration from StartDate and EndDate
  // We'll update the duration if both dates are available
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start day
      if (diffDays > 0) {
        return `${toKhmerNum(diffDays)} ថ្ងៃ`;
      }
    }
    return "១ ថ្ងៃ";
  };

  // Khmer translations & number helpers
  const toKhmerNum = (val: string | number) => {
    const khNums = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(val).replace(/[0-9]/g, (w) => khNums[parseInt(w, 10)]);
  };

  const getKhmerDateText = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const khMonths = [
      "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
      "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
    ];
    const day = date.getDate();
    const month = khMonths[date.getMonth()];
    const year = date.getFullYear();
    return `ថ្ងៃទី ${toKhmerNum(day)} ខែ${month} ឆ្នាំ ${toKhmerNum(year)}`;
  };

  const getProvinceFromAddress = () => {
    if (!schoolAddress) return "ភ្នំពេញ";
    
    const addressClean = schoolAddress.trim();
    
    // Check for standard Khmer province/city names
    const provinces = [
      "ភ្នំពេញ", "រាជធានីភ្នំពេញ", "កណ្តាល", "ខេត្តកណ្តាល", "កំពង់ចាម", "ខេត្តកំពង់ចាម",
      "កំពង់ធំ", "ខេត្តកំពង់ធំ", "កំពង់ឆ្នាំង", "ខេត្តកំពង់ឆ្នាំង", "កំពង់ស្ពឺ", "ខេត្តកំពង់ស្ពឺ",
      "កំពត", "ខេត្តកំពត", "កែប", "ខេត្តកែប", "កោះកុង", "ខេត្តកោះកុង", "ក្រចេះ", "ខេត្តក្រចេះ",
      "ព្រះវិហារ", "ខេត្តព្រះវិហារ", "ព្រៃវែង", "ខេត្តព្រៃវែង", "ពោធិ៍សាត់", "ខេត្តពោធិ៍សាត់",
      "រតនគិរី", "ខេត្តរតនគិរី", "សៀមរាប", "ខេត្តសៀមរាប", "ព្រះសីហនុ", "ខេត្តព្រះសីហនុ",
      "ស្ទឹងត្រែង", "ខេត្តស្ទឹងត្រែង", "ស្វាយរៀង", "ខេត្តស្វាយរៀង", "តាកែវ", "ខេត្តតាកែវ",
      "ឧត្តរមានជ័យ", "ខេត្តឧត្តរមានជ័យ", "ប៉ៃលិន", "ខេត្តប៉ៃលិន", "មណ្ឌលគិរី", "ខេត្តមណ្ឌលគិរី",
      "បាត់ដំបង", "ខេត្តបាត់ដំបង", "បន្ទាយមានជ័យ", "ខេត្តបន្ទាយមានជ័យ", "ត្បូងឃ្មុំ", "ខេត្តត្បូងឃ្មុំ"
    ];

    for (const prov of provinces) {
      if (addressClean.includes(prov)) {
        return prov.replace(/^(ខេត្ត|រាជធានី)/, "");
      }
    }
    
    return "ភ្នំពេញ";
  };

  // Auto calculate duration on form dates change
  React.useEffect(() => {
    if (missionForm.startDate && missionForm.endDate) {
      const computed = calculateDuration(missionForm.startDate, missionForm.endDate);
      if (computed) {
        setMissionForm(prev => prev.duration === computed ? prev : { ...prev, duration: computed });
      }
    }
  }, [missionForm.startDate, missionForm.endDate]);

  const exportToWord = (letter?: any) => {
    try {
      const form = letter || missionForm;
      const isEmployment = form.documentType === "employment";
      const docTitle = isEmployment ? "លិខិតបញ្ជាក់ការងារ - Certificate of Employment" : "លិខិតបញ្ជាការងារ - Mission Order";
      const filename = `${isEmployment ? "Employment_Certificate" : "Mission_Order"}_${form.staffName || "Staff"}`;
      
      const formattedDob = formatDateToPrint(form.dob);
      const formattedJoinedDate = formatDateToPrint(form.joinedDate);
      const formattedEndDate = formatDateToPrint(form.endDate);
      const formattedIssueDate = getKhmerDateText(form.issueDate);
      
      let bodyContentHtml = "";
      
      if (isEmployment) {
        bodyContentHtml = `
          <div style="margin-top: 25px; text-align: justify; font-family: 'Kantumruy Pro', sans-serif;">
            <p style="text-indent: 45px; margin-bottom: 20px; font-weight: 500; font-size: 11pt;">
              យើងខ្ញុំ នាយកសាលា <b style="font-family: 'Moul', serif; color: #000000;">${schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</b> សូមបញ្ជាក់ថា៖
            </p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 25px 0 25px 40px; font-family: 'Kantumruy Pro', sans-serif; font-size: 11pt;">
              <tr>
                <td style="padding: 8px 0; width: 160px; color: #555555;">លោក / លោកស្រី៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.staffName || "\u00A0"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555;">ភេទ៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.staffGender || "\u00A0"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555;">ថ្ងៃខែឆ្នាំកំណើត៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${formattedDob || "\u00A0"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555;">អត្តសញ្ញាណប័ណ្ណ៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.idCardNo || "\u00A0"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555;">តួនាទីបច្ចុប្បន្ន៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.staffPosition || "\u00A0"}</td>
              </tr>
            </table>

            <p style="text-indent: 45px; margin-bottom: 15px; line-height: 1.8; font-weight: 500; font-size: 11pt;">
              សាមីខ្លួនពិតជាបានបំពេញការងារនៅក្នុងស្ថាប័នរបស់យើងខ្ញុំ ចាប់តាំងពី <b style="color: #000000;">${formattedJoinedDate || "\u00A0"}</b> 
              ${form.employmentStatus === "កំពុងបម្រើការងារ" ? "រហូតមកដល់បច្ចុប្បន្ន" : `រហូតដល់ថ្ងៃទី ${formattedEndDate}`} 
              ក្នុងតួនាទីជា <b style="color: #000000;">${form.staffPosition || "\u00A0"}</b>${
                form.showSalary && form.salary ? ` ដោយទទួលបានប្រាក់បៀវត្សរ៍ប្រចាំខែចំនួន $${form.salary}` : ""
              }។
            </p>
            
            <p style="text-indent: 45px; margin-bottom: 15px; line-height: 1.8; color: #333333; font-style: italic; font-weight: 500; font-size: 11pt;">
              ក្នុងអំឡុងពេលបំពេញការងារកន្លងមក លោក/លោកស្រី តែងតែមានការខិតខំប្រឹងប្រែងយកចិត្តទុកដាក់ខ្ពស់ មានសីលធម៌វិជ្ជាជីវៈល្អ រួសរាយរាក់ទាក់ និងសហការបានយ៉ាងល្អប្រសើរជាមួយមិត្តរួមការងារគ្រប់ផ្នែក។
            </p>
            
            <p style="text-indent: 45px; margin-bottom: 15px; line-height: 1.8; font-weight: 500; font-size: 11pt;">
              លិខិតបញ្ជាក់ការងារនេះ ត្រូវបានចេញជូនសាមីខ្លួន ដើម្បីយកទៅប្រើប្រាស់ជាផ្លូវការតាមការគួរ។
            </p>
          </div>
        `;
      } else {
        bodyContentHtml = `
          <div style="margin-top: 25px; text-align: justify; font-family: 'Kantumruy Pro', sans-serif;">
            <p style="text-indent: 45px; margin-bottom: 15px; font-weight: 500; font-size: 11pt;">
              យើងខ្ញុំ នាយកសាលា <b style="font-family: 'Moul', serif; color: #000000;">${schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</b> បង្គាប់មក៖
            </p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 25px 0 25px 40px; font-family: 'Kantumruy Pro', sans-serif; font-size: 11pt;">
              <tr>
                <td style="padding: 8px 0; width: 160px; color: #555555;">លោក / លោកស្រី៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.staffName || "\u00A0"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555;">ភេទ៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.staffGender || "\u00A0"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555;">តួនាទី៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.staffPosition || "\u00A0"}</td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin: 25px 0 25px 20px; font-family: 'Kantumruy Pro', sans-serif; font-size: 11pt;">
              <tr>
                <td style="padding: 8px 0; width: 180px; color: #555555; vertical-align: top;">ត្រូវទៅបំពេញភារកិច្ចនៅ៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.destination || "\u00A0"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; vertical-align: top;">គោលបំណង / ភារកិច្ច៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc; line-height: 1.6;">${form.purpose || "\u00A0"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; vertical-align: top;">រយៈពេល៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.duration || "\u00A0"} (ចាប់ពី ${getKhmerDateText(form.startDate)} ដល់ ${getKhmerDateText(form.endDate)})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; vertical-align: top;">មធ្យោបាយធ្វើដំណើរ៖</td>
                <td style="padding: 8px 0; color: #000000; font-weight: bold; border-bottom: 1px dashed #cccccc;">${form.transport || "\u00A0"}</td>
              </tr>
              ${showAllowanceRow && form.allowance ? `
              <tr>
                <td style="padding: 8px 0; width: 180px; color: #555555; vertical-align: top;">កម្រៃឧបត្ថម្ភ៖</td>
                <td style="padding: 8px 0; color: #3b82f6; font-weight: 800; border-bottom: 1px dashed #cccccc;">$${form.allowance}</td>
              </tr>
              ` : ""}
            </table>
            
            <p style="color: #555555; font-style: italic; font-size: 10pt; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.6;">
              * នាយកសាលា សង្ឃឹមយ៉ាងមុតមាំថា លោក/លោកស្រី នឹងខិតខំប្រឹងប្រែងបំពេញភារកិច្ចនេះឱ្យទទួលបានលទ្ធផលល្អប្រសើរជាទីគាប់ចិត្ត。<br/>
              * The School Director strongly believes that you will perform this mission with dedication and achieve high results.
            </p>
          </div>
        `;
      }

      const htmlString = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${docTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;700;900&family=Moul&display=swap');
            body {
              font-family: 'Kantumruy Pro', 'Inter', sans-serif;
              color: #000000;
              font-size: 11pt;
              line-height: 1.6;
              padding: 40px;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #000000;
              padding-bottom: 15px;
            }
            .header-left {
              text-align: left;
              width: 50%;
            }
            .header-right {
              text-align: center;
              width: 50%;
            }
            .moul-text {
              font-family: 'Moul', serif;
              color: #000000;
            }
            .title-section {
              text-align: center;
              margin: 40px 0 20px 0;
            }
            .doc-title {
              font-family: 'Moul', serif;
              font-size: 16pt;
              color: #000000;
              margin-bottom: 5px;
            }
            .doc-subtitle {
              font-weight: 900;
              font-size: 10pt;
              color: #555555;
              letter-spacing: 1.5px;
            }
            .signature-table {
              width: 100%;
              margin-top: 60px;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <table class="header-table">
            <tr>
              <td class="header-left" style="vertical-align: top;">
                <h2 class="moul-text" style="font-size: 11.5pt; margin: 0;">${schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</h2>
                <h3 style="font-size: 9pt; font-weight: bold; margin: 3px 0 0 0; text-transform: uppercase; color: #555555;">${schoolName || "PLC Computer School"}</h3>
                <p style="font-size: 8pt; color: #777777; margin: 4px 0 0 0;">${schoolPhone}</p>
                <p style="font-size: 8pt; color: #777777; margin: 2px 0 0 0;">${schoolAddress}</p>
              </td>
              <td class="header-right" style="vertical-align: top;">
                <h2 class="moul-text" style="font-size: 10pt; margin: 0;">ព្រះរាជាណាចក្រកម្ពុជា</h2>
                <h3 style="font-size: 9pt; font-weight: bold; margin: 3px 0 0 0; font-family: 'Moul', serif;">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                <p style="font-size: 9pt; font-style: italic; font-family: Georgia, serif; color: #555555; margin: 3px 0 0 0;">Kingdom of Cambodia</p>
                <p style="font-size: 8pt; color: #555555; margin: 2px 0 0 0;">Nation Religion King</p>
                <div style="color: #cccccc; font-size: 10pt; margin-top: 3px;">~.~.~.~.~</div>
              </td>
            </tr>
          </table>

          <!-- Title -->
          <div class="title-section">
            <h1 class="doc-title">${isEmployment ? "លិខិតបញ្ជាក់ការងារ" : "លិខិតបញ្ជាការងារ"}</h1>
            <p class="doc-subtitle">${isEmployment ? "CERTIFICATE OF EMPLOYMENT" : "MISSION ORDER / WORK ORDER"}</p>
            <p style="font-weight: bold; font-size: 10pt; margin-top: 8px;">
              លេខ៖ <span style="font-family: monospace;">${toKhmerNum(missionForm.letterNo)}</span>
            </p>
          </div>

          <!-- Body -->
          ${bodyContentHtml}

          <!-- Signatures -->
          <table class="signature-table">
            <tr>
              <td style="width: 40%; text-align: center; vertical-align: top;">
                ${showStaffSig ? `
                  <p style="font-size: 10pt; font-weight: bold; color: #555555; margin: 0;">
                    ${isEmployment ? "បានឃើញ និងអនុញ្ញាត" : "សាមីខ្លួនទទួលភារកិច្ច"}
                  </p>
                  <p style="font-size: 8pt; color: #888888; margin: 2px 0 0 0;">
                    ${isEmployment ? "Seen & Approved" : "Assigned Staff"}
                  </p>
                  <div style="height: 60px;"></div>
                  <p style="font-size: 10pt; font-weight: bold; color: #333333; margin: 0;">${missionForm.staffName || "....................................................."}</p>
                ` : ""}
              </td>
              <td style="width: 60%; text-align: center; vertical-align: top;">
                <p style="font-size: 10pt; font-weight: bold; color: #000000; margin: 0;">
                  ធ្វើនៅ ${getProvinceFromAddress()}, ${formattedIssueDate}
                </p>
                <p class="moul-text" style="font-size: 9.5pt; margin: 6px 0 0 0; font-family: 'Moul', serif; font-weight: bold;">នាយកសាលា / Director</p>
                
                <div style="height: 60px; margin: 5px 0;">
                  <!-- Space for Signature & Stamp -->
                </div>
                
                <p style="font-size: 10pt; font-weight: bold; color: #000000; text-decoration: underline; margin: 0;">${directorName || "ជី សុភា (CHY SOPHEA)"}</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff' + htmlString], {
        type: 'application/msword;charset=utf-8'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(idt("ទាញយកឯកសារ Word ជោគជ័យ!", "Downloaded Word file successfully!", "下载Word文件成功！"), "success");
    } catch (error) {
      console.error("Error exporting to Word", error);
      showToast(idt("ទាញយកបរាជ័យ!", "Download failed!", "下载失败！"), "error");
    }
  };

  const deleteMissionLetter = (id: string) => {
    try {
      const updated = savedMissionLetters.filter(l => l.id !== id);
      setSavedMissionLetters(updated);
      localStorage.setItem("plc_mission_letters", JSON.stringify(updated));
      showToast(idt("បានលុបជោគជ័យ!", "Deleted successfully!", "删除成功！"), "success");
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if ((isMissionModalOpen || activeCategory === "mission") && !currentMissionId && missionForm.staffName === "") {
      handleNewMissionForm();
    }
  }, [isMissionModalOpen, activeCategory]);

  const { activeTab, isMuted, setIsMuted, appTheme, autoCalculateEndDate, autoGenerateId, courseOptions, defaultDiscount, defaultGender, defaultStatus, defaultStudyMonths, editingCourseIndex, editingCourseValue, editingHoursIndex, editingHoursValue, editingLevelIndex, editingLevelValue, editingShiftIndex, editingShiftValue, editingSpecialtyIndex, editingSpecialtyValue, handleAddCourseOption, handleAddHoursOption, handleAddLevelOption, handleAddShiftOption, handleAddSpecialtyOption, handleEditCourseOption, handleEditHoursOption, handleEditLevelOption, handleEditShiftOption, handleEditSpecialtyOption, hoursOptions, levelOptions, newCustomCourse, newCustomHours, newCustomLevel, newCustomShift, newCustomSpecialty, receiptFooterNote, developerLogo, setDeveloperLogo, developerName, setDeveloperName, telegramBotToken, setTelegramBotToken, telegramChatId, setTelegramChatId, developerKhmerName, setDeveloperKhmerName, developerPhone, setDeveloperPhone, developerTelegram, setDeveloperTelegram, schoolName, schoolKhmerName, directorName, baseFee, studentIdPrefix, setSchoolName, setSchoolKhmerName, setDirectorName, setBaseFee, setStudentIdPrefix, schoolAddress, schoolLogo, khqrImage, setKhqrImage, schoolPhone, schoolTelegram, setAppTheme, setAutoCalculateEndDate, setAutoGenerateId, setDefaultDiscount, setDefaultGender, setDefaultStatus, setDefaultStudyMonths, setDeleteConfirm, setEditingCourseIndex, setEditingCourseValue, setEditingHoursIndex, setEditingHoursValue, setEditingLevelIndex, setEditingLevelValue, setEditingShiftIndex, setEditingShiftValue, setEditingSpecialtyIndex, setEditingSpecialtyValue, setNewCustomCourse, setNewCustomHours, setNewCustomLevel, setNewCustomShift, setNewCustomSpecialty, setReceiptFooterNote, setSchoolAddress, setSchoolLogo, setSchoolPhone, setSchoolTelegram, setSettingsSubTab, settingsSubTab, shiftOptions, showToast, specialtyOptions, token, academicYear, setAcademicYear, passingScore, setPassingScore, operatingDays, setOperatingDays, defaultSortBy, setDefaultSortBy, currencySymbol, setCurrencySymbol, taxPercentage, setTaxPercentage, lateFeePenalty, setLateFeePenalty, autoBackupDrive, setAutoBackupDrive, backupRetentionDays, setBackupRetentionDays, uiLang } = props;

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

  const [coverImage, setCoverImageState] = React.useState<string>(() => props.coverImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800");
  const [bannerTitle, setBannerTitleState] = React.useState<string>(() => props.bannerTitle || "វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ");
  const [bannerSubtitle, setBannerSubtitleState] = React.useState<string>(() => props.bannerSubtitle || "អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ");
  const [isSavingBanner, setIsSavingBanner] = React.useState<boolean>(false);

  const DEFAULT_SLIDES = [
    {
      id: 1,
      title: props.bannerTitle || "វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ",
      subtitle: props.bannerSubtitle || "អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ",
      image: props.coverImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
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

  const [bannerSlides, setBannerSlidesState] = React.useState<Array<{id: number; title: string; subtitle: string; image: string}>>(() => {
    if (props.bannerSlides && Array.isArray(props.bannerSlides) && props.bannerSlides.length >= 3) {
      return props.bannerSlides;
    }
    return DEFAULT_SLIDES;
  });

  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (props.bannerSlides && Array.isArray(props.bannerSlides) && props.bannerSlides.length > 0) {
      setBannerSlidesState(props.bannerSlides);
    }
  }, [props.bannerSlides]);

  React.useEffect(() => {
    if (props.coverImage) setCoverImageState(props.coverImage);
    if (props.bannerTitle) setBannerTitleState(props.bannerTitle);
    if (props.bannerSubtitle) setBannerSubtitleState(props.bannerSubtitle);
  }, [props.coverImage, props.bannerTitle, props.bannerSubtitle]);

  const updateActiveSlide = (field: "title" | "subtitle" | "image", value: string) => {
    setBannerSlidesState((prev) => {
      const copy = [...prev];
      if (!copy[activeSlideIndex]) {
        copy[activeSlideIndex] = { id: activeSlideIndex + 1, title: "", subtitle: "", image: "" };
      }
      copy[activeSlideIndex] = { ...copy[activeSlideIndex], [field]: value };
      return copy;
    });

    if (activeSlideIndex === 0) {
      if (field === "image") {
        setCoverImageState(value);
        if (props.setCoverImage) props.setCoverImage(value);
      } else if (field === "title") {
        setBannerTitleState(value);
        if (props.setBannerTitle) props.setBannerTitle(value);
      } else if (field === "subtitle") {
        setBannerSubtitleState(value);
        if (props.setBannerSubtitle) props.setBannerSubtitle(value);
      }
    }
  };

  const bannerPresets = [
    {
      name: "បន្ទប់កុំព្យូទ័រ ICT (Computer Lab)",
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "ការសិក្សាកូដ & បច្ចេកវិទ្យា (Coding & Tech)",
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "សិក្ខាសាលា & សន្និសីទ (Seminar Event)",
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "ថ្នាក់រៀនអប់រំបច្ចេកវិទ្យា (Digital Classroom)",
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("ទំហំរូបភាពធំពេក! សូមជ្រើសរើសរូបភាពទំហំក្រោម 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateActiveSlide("image", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBannerSettings = async () => {
    setIsSavingBanner(true);
    try {
      const slide1 = bannerSlides[0] || DEFAULT_SLIDES[0];
      const res = await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          coverImage: slide1.image,
          bannerImage: slide1.image,
          bannerTitle: slide1.title,
          bannerSubtitle: slide1.subtitle,
          bannerSlides
        })
      });
      if (res.ok) {
        showToast(idt("រក្សាទុកកំណត់រូបតាំង និងផ្ទាំងបដាទាំង ៣ ជោគជ័យ!", "Banner settings for 3 slides saved successfully!", "3张横幅设置保存成功！"), "success");
        if (props.setCoverImage) props.setCoverImage(slide1.image);
        if (props.setBannerTitle) props.setBannerTitle(slide1.title);
        if (props.setBannerSubtitle) props.setBannerSubtitle(slide1.subtitle);
        if (props.setBannerSlides) props.setBannerSlides(bannerSlides);
      } else {
        showToast(idt("រក្សាទុកការកំណត់បរាជ័យ!", "Failed to save settings!", "保存失败！"), "error");
      }
    } catch (err) {
      console.error("Save banner error:", err);
      showToast(idt("មានបញ្ហាក្នុងការរក្សាទុក!", "Error saving settings!", "保存出错！"), "error");
    } finally {
      setIsSavingBanner(false);
    }
  };

  
  const handleDeveloperLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setDeveloperLogo(data.url);
        showToast("បញ្ចូលរូបភាពជោគជ័យ!", "success");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      showToast("បរាជ័យក្នុងការបញ្ចូលរូបភាព!", "error");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSchoolLogo(data.url);
        showToast("បញ្ចូលរូបភាពជោគជ័យ!", "success");
      } else {
        showToast(data.message || "មិនអាចបញ្ចូលរូបភាពបានទេ", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast("មានបញ្ហាក្នុងការបញ្ចូលរូបភាព", "error");
    }
  };

  const [diagnosticData, setDiagnosticData] = React.useState<any>(null);
  const [runningDiagnostics, setRunningDiagnostics] = React.useState(false);
  const [clearingCache, setClearingCache] = React.useState(false);

  const runDiagnostics = async () => {
    setRunningDiagnostics(true);
    const startTime = performance.now();
    try {
      const res = await fetch("/api/mysql/db-counts", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const duration = Math.round(performance.now() - startTime);
      if (res.ok) {
        const data = await res.json();
        setDiagnosticData({
          counts: data.counts,
          latency: duration,
          checkedAt: new Date().toLocaleTimeString()
        });
        showToast(idt("ការវិភាគទិន្នន័យបានជោគជ័យ!", "Database diagnostics ran successfully!", "数据库诊断运行成功！"), "success");
      } else {
        showToast("មិនអាចវិភាគទិន្នន័យបានទេ", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("មានកំហុសពេលរត់ការវិភាគ", "error");
    } finally {
      setRunningDiagnostics(false);
    }
  };

  const handleClearCache = () => {
    setClearingCache(true);
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      showToast(idt("បានសម្អាតឃ្លាំងសម្ងាត់ប្រព័ន្ធរួចរាល់! កំពុងផ្ទុកឡើងវិញ...", "Client cache cleared! Reloading...", "客户端缓存已清理！正在重新加载..."), "success");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, 800);
  };

  const categories = [
    {
      id: "school" as const,
      nameKh: "ព័ត៌មាន & ការរចនា",
      nameEn: "School & Brand",
      nameZh: "学校与品牌",
      descKh: "ព័ត៌មានទូទៅ ឡូហ្គោ និងប្រធានបទ",
      descEn: "General info, logo, and app themes",
      descZh: "基本信息、徽标和应用主题",
      icon: Landmark,
      color: "text-primary-600 bg-primary-50 border-primary-100",
      activeColor: "bg-primary-600 text-white"
    },
    {
      id: "banner" as const,
      nameKh: "រូបតាំង / រូបបដា",
      nameEn: "Banner / Cover Image",
      nameZh: "横幅与封面图",
      descKh: "កំណត់រូបតាំង និងចំណងជើងផ្ទាំងបដា",
      descEn: "Customize banner & cover image",
      descZh: "自定义横幅与封面图片",
      icon: ImageIcon,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      activeColor: "bg-amber-600 text-white"
    },
    {
      id: "telegram" as const,
      nameKh: "ការភ្ជាប់ Telegram",
      nameEn: "Telegram Integration",
      nameZh: "Telegram 集成",
      descKh: "ការភ្ជាប់ Telegram Bot Token & Chat ID",
      descEn: "Configure Bot Token and Chat ID",
      descZh: "配置 Bot Token 和 Chat ID",
      icon: Send,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      activeColor: "bg-blue-600 text-white"
    },
    {
      id: "khqr" as const,
      nameKh: "រូបភាព KHQR",
      nameEn: "KHQR Image",
      nameZh: "KHQR 图像",
      descKh: "រូបភាព KHQR បង់ប្រាក់",
      descEn: "Payment KHQR Image",
      descZh: "付款 KHQR 图像",
      icon: QrCode,
      color: "text-sky-600 bg-sky-50 border-sky-100",
      activeColor: "bg-sky-600 text-white"
    },
    {
      id: "mission" as const,
      nameKh: "លិខិតបញ្ជាការងារ",
      nameEn: "Work Order",
      nameZh: "派遣工作函",
      descKh: "លិខិតបញ្ជាការងារបុគ្គលិក",
      descEn: "Staff Work Orders",
      descZh: "员工工作派遣函",
      icon: FileText,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      activeColor: "bg-blue-600 text-white"
    },
    {
      id: "login_links" as const,
      nameKh: "តំណភ្ជាប់ចូលប្រព័ន្ធ",
      nameEn: "Login & Portal Links",
      nameZh: "登录与门户链接",
      descKh: "តំណ Form Login Admin និង Form Login អាណាព្យាបាល",
      descEn: "Admin & Guardian login forms and links",
      descZh: "管理员与家长登录链接",
      icon: ShieldCheck,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      activeColor: "bg-blue-600 text-white"
    }
  ];

  const renderMissionCreatorContent = (isModal: boolean, onClose?: () => void) => {
    const isEmployment = missionForm.documentType === "employment";
    const accentColorClass = isEmployment 
      ? "bg-emerald-600 shadow-emerald-500/15" 
      : "bg-blue-600 shadow-blue-500/15";

    return (
      <div className={`flex flex-col h-full bg-[#0c1432] text-slate-100 ${isModal ? 'rounded-3xl' : 'rounded-2xl'} overflow-hidden border border-[#20346c]/40 shadow-[0_0_50px_rgba(30,58,138,0.25)] relative text-left`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#20346c]/35 bg-black/25 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl ${isEmployment ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-blue-500/10 border-blue-500/30'} flex items-center justify-center border shadow-[0_0_15px_rgba(99,102,241,0.05)]`}>
              <FileText className={`w-5 h-5 ${isEmployment ? 'text-emerald-400' : 'text-blue-400'}`} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                {isEmployment ? "លិខិតបញ្ជាក់ការងារ (Certificate of Employment)" : "លិខិតបញ្ជាការងារ (Mission Order / Work Assignment)"}
                <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 tracking-widest uppercase">PRO</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">បង្កើត រចនា និងបោះពុម្ពលិខិតផ្លូវការសម្រាប់គ្រូ និងបុគ្គលិកសាលា</p>
            </div>
          </div>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-700/60"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-full">
          {/* Left Panel: Inputs + History */}
          <div className="w-full lg:w-[45%] border-r border-[#20346c]/25 p-6 overflow-y-auto flex flex-col gap-6 bg-black/15 custom-scrollbar">
            {/* Document Type Switch */}
            <div className="relative p-1 bg-black/35 border border-[#20346c]/40 rounded-2xl flex shadow-inner">
              <button
                type="button"
                onClick={() => setMissionForm(prev => ({ ...prev, documentType: "mission" }))}
                className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative z-10 ${
                  missionForm.documentType === "mission"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                លិខិតបញ្ជាការងារ (Mission)
              </button>
              <button
                type="button"
                onClick={() => setMissionForm(prev => ({ ...prev, documentType: "employment" }))}
                className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative z-10 ${
                  missionForm.documentType === "employment"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Award className="w-4 h-4" />
                លិខិតបញ្ជាក់ការងារ (Work Cert)
              </button>
            </div>

            {/* Form Inputs Group */}
            <div className="bg-black/10 border border-[#20346c]/30 rounded-3xl p-5 space-y-6 backdrop-blur-sm relative overflow-hidden text-left">
              <div className={`absolute top-0 left-0 w-32 h-32 ${isEmployment ? 'bg-emerald-500/5' : 'bg-blue-500/5'} rounded-full blur-3xl pointer-events-none`}></div>
              
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className={`w-4 h-4 ${isEmployment ? 'text-emerald-400' : 'text-blue-400'}`} />
                  រៀបចំលម្អិតលិខិត (Form Builder)
                </span>
                <button
                  type="button"
                  onClick={handleNewMissionForm}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 cursor-pointer transition-all border border-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  បង្កើតថ្មី (New)
                </button>
              </div>

              {/* Group 1: Document Identifier */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded bg-black/40 border ${isEmployment ? 'border-emerald-500/35 text-emerald-400' : 'border-blue-500/35 text-blue-400'}`}>01</span>
                  <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase">ព័ត៌មានអត្តសញ្ញាណលិខិត</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Hash className="w-3 h-3 text-slate-500" /> លេខលិខិត (Letter No.)
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-slate-500">
                        <Hash className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={missionForm.letterNo}
                        onChange={(e) => setMissionForm({ ...missionForm, letterNo: e.target.value })}
                        placeholder="ឧ. PLC-2026-០១"
                        className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" /> កាលបរិច្ឆេទចេញលិខិត
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="date"
                        value={missionForm.issueDate}
                        onChange={(e) => setMissionForm({ ...missionForm, issueDate: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-mono cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 2: Staff Profiles */}
              <div className="space-y-4 pt-2 border-t border-[#20346c]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded bg-black/40 border ${isEmployment ? 'border-emerald-500/35 text-emerald-400' : 'border-blue-500/35 text-blue-400'}`}>02</span>
                    <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase">ព័ត៌មានបុគ្គលិកសាមីខ្លួន</span>
                  </div>
                  {teachersList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowTeacherSuggestions(!showTeacherSuggestions)}
                      className="text-[9px] text-blue-400 hover:text-blue-300 font-black flex items-center gap-1 select-none focus:outline-none cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" /> ស្វែងរកបុគ្គលិក ({teachersList.length})
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 relative text-left">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-500" /> ឈ្មោះបុគ្គលិក (Staff Name)
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-slate-500">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={missionForm.staffName}
                        onChange={(e) => setMissionForm({ ...missionForm, staffName: e.target.value })}
                        onFocus={() => setShowTeacherSuggestions(true)}
                        placeholder="ឧ. ស៊ន សុភ័ក្ត្រ"
                        className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Teacher Suggestions Dropdown with beautiful glass design */}
                    {showTeacherSuggestions && (
                      <div className="absolute z-50 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-[#0a1128]/95 border border-[#1e3470]/40 rounded-2xl shadow-2xl p-1.5 divide-y divide-slate-800/50 backdrop-blur-lg custom-scrollbar">
                        <div className="flex justify-between items-center p-2 border-b border-[#1e3470]/30 bg-[#0a1128] sticky top-0 z-10">
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">បុគ្គលិកក្នុងបញ្ជីផ្លូវការ</span>
                          <button 
                            type="button" 
                            onClick={() => setShowTeacherSuggestions(false)}
                            className="text-[9px] text-slate-400 hover:text-white font-black bg-black/40 px-2 py-0.5 rounded-md border border-[#1e3470]/30"
                          >
                            បិទ (Close)
                          </button>
                        </div>
                        {teachersList.filter(t => {
                          const q = (missionForm.staffName || "").toLowerCase();
                          return !q || (t.nameKh || "").toLowerCase().includes(q) || (t.nameEn || "").toLowerCase().includes(q);
                        }).length === 0 ? (
                          <div className="p-4 text-center text-[10px] text-slate-500 font-bold flex flex-col items-center gap-1">
                            <User className="w-4 h-4 opacity-35" />
                            {loadingTeachers ? "កំពុងទាញយក..." : "រកមិនឃើញគ្រូ/បុគ្គលិក"}
                          </div>
                        ) : (
                          teachersList.filter(t => {
                            const q = (missionForm.staffName || "").toLowerCase();
                            return !q || (t.nameKh || "").toLowerCase().includes(q) || (t.nameEn || "").toLowerCase().includes(q);
                          }).map((teacher: any) => (
                            <button
                              key={teacher.id || teacher.teacherId}
                              type="button"
                              onClick={() => {
                                setMissionForm(prev => ({
                                  ...prev,
                                  staffName: teacher.nameKh || teacher.nameEn,
                                  staffGender: teacher.gender === "Female" || teacher.gender === "ស្រី" ? "ស្រី" : "ប្រុស",
                                  staffPosition: teacher.specialty || "គ្រូបង្រៀន"
                                }));
                                setShowTeacherSuggestions(false);
                                showToast(idt("បានបំពេញទិន្នន័យបុគ្គលិកស្វ័យប្រវត្តិ!", "Auto-filled staff info!", "已自动填写人员信息！"), "success");
                              }}
                              className="w-full text-left p-2.5 hover:bg-blue-600/10 rounded-lg flex items-center justify-between text-xs transition-all duration-150 cursor-pointer group"
                            >
                              <div>
                                <p className="font-extrabold text-slate-200 group-hover:text-blue-300 transition-colors">{teacher.nameKh || teacher.nameEn}</p>
                                <p className="text-[9px] text-slate-500 font-medium">{teacher.specialty || "គ្រូបង្រៀន"}</p>
                              </div>
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-black/35 border border-[#1e3470]/30 text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                {teacher.gender === "Female" || teacher.gender === "ស្រី" ? "ស្រី" : "ប្រុស"}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-slate-500" /> ភេទ (Gender)
                      </label>
                      <select
                        value={missionForm.staffGender}
                        onChange={(e) => setMissionForm({ ...missionForm, staffGender: e.target.value })}
                        className="w-full px-3 py-2.5 bg-black/25 border border-[#20346c]/40 hover:border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                      >
                        <option value="ប្រុស">ប្រុស (Male)</option>
                        <option value="ស្រី">ស្រី (Female)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-slate-500" /> មុខតំណែង (Position)
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-slate-500">
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={missionForm.staffPosition}
                          onChange={(e) => setMissionForm({ ...missionForm, staffPosition: e.target.value })}
                          placeholder="ឧ. គ្រូបង្រៀន, បុគ្គលិកការិយាល័យ"
                          className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {isEmployment && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" /> ថ្ងៃខែឆ្នាំកំណើត (DOB)
                        </label>
                        <input
                          type="date"
                          value={missionForm.dob}
                          onChange={(e) => setMissionForm({ ...missionForm, dob: e.target.value })}
                          className="w-full px-3 py-2.5 bg-black/25 border border-[#20346c]/40 hover:border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <CreditCard className="w-3 h-3 text-slate-500" /> លេខអត្តសញ្ញាណប័ណ្ណ
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 text-slate-500">
                            <CreditCard className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            value={missionForm.idCardNo}
                            onChange={(e) => setMissionForm({ ...missionForm, idCardNo: e.target.value })}
                            placeholder="ឧ. 012345678"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Group 3: Document Content details */}
              <div className="space-y-4 pt-2 border-t border-[#20346c]/30">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded bg-black/40 border ${isEmployment ? 'border-emerald-500/35 text-emerald-400' : 'border-blue-500/35 text-blue-400'}`}>03</span>
                  <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase">លម្អិតបេសកកម្ម និងភារកិច្ច</span>
                </div>

                {isEmployment ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" /> ថ្ងៃចូលបម្រើការងារ
                        </label>
                        <input
                          type="date"
                          value={missionForm.joinedDate}
                          onChange={(e) => setMissionForm({ ...missionForm, joinedDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-black/25 border border-[#20346c]/40 hover:border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-slate-500" /> ស្ថានភាពការងារ (Status)
                        </label>
                        <select
                          value={missionForm.employmentStatus}
                          onChange={(e) => setMissionForm({ ...missionForm, employmentStatus: e.target.value })}
                          className="w-full px-3 py-2.5 bg-black/25 border border-[#20346c]/40 hover:border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                        >
                          <option value="កំពុងបម្រើការងារ">កំពុងបម្រើការងារ (Currently Employed)</option>
                          <option value="បានឈប់បម្រើការងារ">បានឈប់បម្រើការងារ (Resigned/Former)</option>
                        </select>
                      </div>
                    </div>

                    {!isEmployment && missionForm.employmentStatus === "បានឈប់បម្រើការងារ" && (
                      <div className="space-y-1.5 text-left animate-fadeIn">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" /> កាលបរិច្ឆេទឈប់បំពេញការងារ
                        </label>
                        <input
                          type="date"
                          value={missionForm.endDate}
                          onChange={(e) => setMissionForm({ ...missionForm, endDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-black/25 border border-[#20346c]/40 hover:border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono cursor-pointer"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-black/15 p-3.5 rounded-2xl border border-[#20346c]/25">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <DollarSign className="w-3 h-3 text-blue-400" /> ប្រាក់ខែ / Salary ($)
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 text-slate-500">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            value={missionForm.salary}
                            onChange={(e) => setMissionForm({ ...missionForm, salary: e.target.value })}
                            placeholder="ឧ. 350"
                            className="w-full pl-9 pr-3 py-2 bg-black/25 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
                          />
                        </div>
                      </div>
                      <div className="py-2 text-left">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={missionForm.showSalary || false}
                            onChange={(e) => setMissionForm({ ...missionForm, showSalary: e.target.checked })}
                            className="rounded border-[#20346c]/40 bg-black/30 text-blue-600 focus:ring-blue-500/30 w-4 h-4 cursor-pointer transition-all"
                          />
                          <span className="text-[10px] font-extrabold text-slate-300">បង្ហាញប្រាក់ខែក្នុងលិខិត</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-500" /> ទីកន្លែងបំពេញភារកិច្ច (Destination)
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            value={missionForm.destination}
                            onChange={(e) => setMissionForm({ ...missionForm, destination: e.target.value })}
                            placeholder="ឧ. ខេត្តសៀមរាប"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Truck className="w-3 h-3 text-slate-500" /> មធ្យោបាយធ្វើដំណើរ (Transport)
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 text-slate-500">
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            value={missionForm.transport}
                            onChange={(e) => setMissionForm({ ...missionForm, transport: e.target.value })}
                            placeholder="ឧ. ម៉ូតូផ្ទាល់ខ្លួន, រថយន្តសាលា"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" /> កាលបរិច្ឆេទចាប់ផ្ដើម
                        </label>
                        <input
                          type="date"
                          value={missionForm.startDate}
                          onChange={(e) => setMissionForm({ ...missionForm, startDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-black/25 border border-[#20346c]/40 hover:border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" /> កាលបរិច្ឆេទបញ្ចប់
                        </label>
                        <input
                          type="date"
                          value={missionForm.endDate}
                          onChange={(e) => setMissionForm({ ...missionForm, endDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-black/25 border border-[#20346c]/40 hover:border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" /> រយៈពេល (Duration)
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            value={missionForm.duration}
                            onChange={(e) => setMissionForm({ ...missionForm, duration: e.target.value })}
                            placeholder="ឧ. ១ ថ្ងៃ, ៣ ថ្ងៃ"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <DollarSign className="w-3 h-3 text-blue-400" /> ថវិកាឧបត្ថម្ភ (Allowance $)
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 text-slate-500">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            value={missionForm.allowance}
                            onChange={(e) => setMissionForm({ ...missionForm, allowance: e.target.value })}
                            placeholder="ឧ. 50"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-slate-500" /> ភារកិច្ច / គោលបំណងបេសកកម្ម (Purpose)
                      </label>
                      <textarea
                        rows={2.5}
                        value={missionForm.purpose}
                        onChange={(e) => setMissionForm({ ...missionForm, purpose: e.target.value })}
                        placeholder="ឧ. ចូលរួមវគ្គបណ្តុះបណ្តាលព័ត៌មានវិទ្យាជំនាន់ថ្មី ផ្ដោតលើការគ្រប់គ្រងទិន្នន័យ..."
                        className="w-full px-3.5 py-2.5 bg-black/25 hover:bg-black/40 border border-[#20346c]/40 hover:border-slate-700/80 focus:border-blue-400 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all resize-none custom-scrollbar"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons with high-end premium design */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#20346c]/30">
                <button
                   type="button"
                   onClick={() => {
                     const id = currentMissionId || `mission-${Date.now()}`;
                     const letter = { ...missionForm, id };
                     if (!currentMissionId) setCurrentMissionId(id);
                     saveMissionLetter(letter);
                   }}
                   className="py-3 bg-black/40 hover:bg-black/60 active:bg-black/40 text-slate-100 border border-[#20346c]/40 hover:border-[#20346c]/85 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md hover:translate-y-[-1px] active:translate-y-[0px]"
                >
                  <Save className="w-4 h-4 text-blue-400" />
                  រក្សាទុក (Save)
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const id = currentMissionId || `mission-${Date.now()}`;
                    const letter = { ...missionForm, id };
                    if (!currentMissionId) setCurrentMissionId(id);
                    saveMissionLetter(letter);
                    setTimeout(() => {
                      window.print();
                    }, 100);
                  }}
                  className={`py-3 ${accentColorClass.includes('emerald') ? 'bg-emerald-600' : 'bg-blue-600'} text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-500/30 hover:translate-y-[-1px] active:translate-y-[0px]`}
                >
                  <Printer className="w-4 h-4" />
                  បោះពុម្ព (Print now)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const id = currentMissionId || `mission-${Date.now()}`;
                    const letter = { ...missionForm, id };
                    if (!currentMissionId) setCurrentMissionId(id);
                    saveMissionLetter(letter);
                    showToast(idt("ណែនាំ៖ ជ្រើសរើស 'Save as PDF' ក្នុងប្រអប់បោះពុម្ព ដើម្បីរក្សាទុកជា PDF!", "Tip: Select 'Save as PDF' in the destination field of the print window!", "提示：在打印窗口的目标中选择'保存为PDF'！"), "info");
                    setTimeout(() => {
                      window.print();
                    }, 500);
                  }}
                  className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px]"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  រក្សាទុកជា PDF
                </button>
                <button
                  type="button"
                  onClick={handleExportWord}
                  className="py-2.5 bg-blue-500/10 hover:bg-blue-500/20 active:bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:border-blue-500/40 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px]"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  រក្សាទុកជា File Word
                </button>
              </div>
            </div>

            {/* Presets Card (Only if Document Type is Mission) */}
            {!isEmployment && (
              <div className="bg-black/10 border border-[#20346c]/30 rounded-3xl p-5 space-y-3.5 backdrop-blur-sm text-left">
                <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 border-b border-[#20346c]/30 pb-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  គំរូភារកិច្ចរហ័ស (Quick Templates)
                </span>
                <p className="text-[10px] text-slate-400 font-medium">ចុចលើគំរូខាងក្រោមដើម្បីបំពេញព័ត៌មានបេសកកម្មដោយស្វ័យប្រវត្តិ៖</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {missionTemplates.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMissionForm(prev => ({
                          ...prev,
                          purpose: tpl.purpose,
                          destination: tpl.destination,
                          transport: tpl.transport
                        }));
                        showToast(idt(`បានអនុវត្តគំរូ "${tpl.title}"!`, `Applied template "${tpl.title}"!`, `已应用模板 "${tpl.title}"!`), "success");
                      }}
                      className="text-[10px] font-extrabold px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-600/15 border border-slate-800 hover:border-blue-500/30 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Print Settings Options */}
            <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl p-5 space-y-4 backdrop-blur-sm text-left">
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800/60 pb-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                ការកំណត់ប្លង់បោះពុម្ព (Print & Layout)
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Font size control */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ទំហំអក្សរ A4 (Font Size)</label>
                  <div className="flex bg-slate-950/80 rounded-xl p-1 border border-slate-850">
                    {(["small", "medium", "large"] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setLayoutFontSize(sz);
                          showToast(idt(`បានប្តូរទំហំអក្សរទៅ៖ ${sz === "small" ? "តូច" : sz === "medium" ? "មធ្យម" : "ធំ"}`, `Font size set to ${sz}`, `字体大小已设为 ${sz}`), "success");
                        }}
                        className={`flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all duration-200 cursor-pointer ${
                          layoutFontSize === sz 
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {sz === "small" ? "តូច" : sz === "medium" ? "មធ្យម" : "ធំ"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transport preset helper (only if type is mission) */}
                {!isEmployment && (
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">មធ្យោបាយរហ័ស (Transport)</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setMissionForm(prev => ({ ...prev, transport: e.target.value }));
                          showToast(idt("បានប្តូរមធ្យោបាយធ្វើដំណើរ!", "Transport updated!", "交通工具已更新！"), "success");
                        }
                      }}
                      value={missionForm.transport}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="ម៉ូតូផ្ទាល់ខ្លួន">ម៉ូតូផ្ទាល់ខ្លួន (Own Moto)</option>
                      <option value="ម៉ូតូសាលា">ម៉ូតូសាលា (School Moto)</option>
                      <option value="រថយន្តសាលា">រថយន្តសាលា (School Car)</option>
                      <option value="រថយន្តឈ្នួល">រថយន្តឈ្នួល (Public Taxi)</option>
                      <option value="ដើរ / ថ្មើរជើង">ដើរ / ថ្មើរជើង (By foot)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Checklist Toggles with nice modern layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-slate-950/40 p-3 rounded-2xl border border-slate-850 text-left">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showStaffSig}
                    onChange={(e) => setShowStaffSig(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500/30 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[10px] font-extrabold text-slate-300">ហត្ថលេខាបុគ្គលិក</span>
                </label>
                
                {!isEmployment && (
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showAllowanceRow}
                      onChange={(e) => setShowAllowanceRow(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500/30 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[10px] font-extrabold text-slate-300">បង្ហាញកម្រៃឧបត្ថម្ភ</span>
                  </label>
                )}

                <label className="flex items-center gap-2.5 cursor-pointer select-none col-span-1 sm:col-span-2 border-t border-slate-800/40 pt-2 mt-1">
                  <input
                    type="checkbox"
                    checked={showStampBox}
                    onChange={(e) => setShowStampBox(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500/30 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[10px] font-extrabold text-slate-300">បង្ហាញត្រានិងហត្ថលេខានាយក (Print)</span>
                </label>
              </div>
            </div>

            {/* History List */}
            <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl p-5 flex flex-col overflow-hidden min-h-[240px] text-left">
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-800/60 pb-2 shrink-0">
                <Clock className="w-4 h-4 text-blue-400" />
                ប្រវត្តិលិខិតសរុប ({toKhmerNum(savedMissionLetters.length)})
              </span>
              
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1.5 custom-scrollbar">
                {savedMissionLetters.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
                    <File className="w-10 h-10 opacity-15 mb-2 text-slate-300" />
                    <p className="text-[10px] font-black">មិនទាន់មានប្រវត្តិលិខិតនៅឡើយទេ</p>
                  </div>
                ) : (
                  savedMissionLetters.map((letter: any) => (
                    <div
                      key={letter.id}
                      onClick={() => {
                        setCurrentMissionId(letter.id);
                        setMissionForm({
                          documentType: letter.documentType || "mission",
                          letterNo: letter.letterNo,
                          staffName: letter.staffName,
                          staffGender: letter.staffGender,
                          staffPosition: letter.staffPosition,
                          destination: letter.destination || "",
                          purpose: letter.purpose || "",
                          duration: letter.duration || "១ ថ្ងៃ",
                          startDate: letter.startDate || new Date().toISOString().split("T")[0],
                          endDate: letter.endDate || new Date().toISOString().split("T")[0],
                          transport: letter.transport || "ម៉ូតូផ្ទាល់ខ្លួន",
                          allowance: letter.allowance || "0.00",
                          issueDate: letter.issueDate,
                          dob: letter.dob || "1995-01-01",
                          idCardNo: letter.idCardNo || "",
                          joinedDate: letter.joinedDate || new Date().toISOString().split("T")[0],
                          employmentStatus: letter.employmentStatus || "កំពុងបម្រើការងារ",
                          salary: letter.salary || "350.00",
                          showSalary: letter.showSalary || false,
                        });
                        showToast(idt("បានទាញយកទិន្នន័យបុគ្គលិក!", "Staff data loaded!", "已加载人员数据！"), "success");
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex justify-between items-center group relative ${
                        currentMissionId === letter.id
                          ? "bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/5"
                          : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/30"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono bg-slate-950 text-blue-400 px-2 py-0.5 rounded-lg border border-slate-800 shrink-0 font-extrabold">
                            {letter.letterNo}
                          </span>
                          
                          <span className={`text-[8px] px-1.5 py-0.5 border rounded-md uppercase font-black shrink-0 ${
                            letter.documentType === "employment"
                              ? "bg-emerald-950/60 text-emerald-300 border-emerald-900/50"
                              : "bg-blue-950/60 text-blue-300 border-blue-900/50"
                          }`}>
                            {letter.documentType === "employment" ? "បញ្ជាក់ការងារ" : "បញ្ជាការងារ"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-extrabold line-clamp-1">
                          {letter.staffName} • <span className="text-slate-400 font-medium">{letter.staffPosition || "បុគ្គលិក"}</span>
                        </p>
                        <p className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {getKhmerDateText(letter.issueDate)}
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMissionLetter(letter.id);
                        }}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 cursor-pointer shrink-0 border border-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Beautiful Live Preview + Scale Controls */}
          <div className="flex-1 bg-slate-950 p-6 overflow-hidden flex flex-col items-center justify-between min-h-[400px] relative border-l border-slate-900">
            {/* Interactive Preview Toolbar */}
            <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 mb-4 backdrop-blur-md z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live A4 Preview</span>
              </div>
              
              {/* Zoom & Seal control buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewScale(prev => Math.max(0.4, prev - 0.05))}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] font-mono font-bold px-2 py-1 bg-slate-950 rounded-lg border border-slate-800 text-blue-400 select-none min-w-[45px] text-center">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewScale(prev => Math.min(1.2, prev + 0.05))}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScale(0.7)}
                  className="p-1.5 bg-slate-950 hover:bg-slate-850 rounded-lg text-slate-500 hover:text-blue-400 border border-slate-800 transition-all cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-slate-800 mx-1"></div>

                {/* Stamp graphic toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setShowStampGraphic(!showStampGraphic);
                    showToast(showStampGraphic ? "បានលាក់ត្រានិងហត្ថលេខាគំរូ!" : "បានបង្ហាញត្រានិងហត្ថលេខាគំរូ!", "info");
                  }}
                  className={`px-2.5 py-1 text-[9px] font-black rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                    showStampGraphic
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Shield className="w-3 h-3 text-blue-400" />
                  ត្រាគំរូ (Mock Stamp)
                </button>
              </div>
            </div>

            {/* Scale Container with elegant dark glowing background */}
            <div className="flex-1 w-full overflow-auto flex items-start justify-center custom-scrollbar py-2 relative">
              <div 
                className="bg-[#fafbf9] text-black border border-slate-300 rounded-xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65),0_0_40px_rgba(0,0,0,0.1)] p-12 flex flex-col justify-between transition-all duration-300 select-text relative ring-1 ring-black/5" 
                style={{ 
                  fontFamily: "'Kantumruy Pro', sans-serif",
                  width: "210mm",
                  minWidth: "210mm",
                  minHeight: "297mm",
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top center",
                  marginBottom: `calc(297mm * (${previewScale} - 1) + 20px)`
                }}
              >
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-double pb-4 border-slate-400 relative text-left">
                  <div className="flex items-center gap-4">
                    {schoolLogo ? (
                      <img src={schoolLogo} alt="School Logo" className="w-14 h-14 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                        <GraduationCap className="w-6 h-6 text-slate-500" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-moul text-[11px] text-black leading-normal">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</h2>
                      <h3 className="text-[8px] font-bold text-slate-800 tracking-wider uppercase mt-0.5">{schoolName || "PLC Computer School"}</h3>
                      <p className="text-[7px] text-slate-600 mt-0.5">{schoolPhone}</p>
                      <p className="text-[7px] text-slate-600">{schoolAddress}</p>
                    </div>
                  </div>
                  
                  <div className="text-center select-none">
                    <h2 className="font-moul text-[11px] text-black leading-normal">ព្រះរាជាណាចក្រកម្ពុជា</h2>
                    <h3 className="font-moul text-[9px] text-black mt-1 leading-normal">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                    <p className="text-[8px] font-serif italic text-slate-700 mt-0.5">Kingdom of Cambodia</p>
                    <p className="text-[7px] font-sans text-slate-600 leading-none">Nation Religion King</p>
                    
                    {/* Beautiful traditional visual divider */}
                    <div className="flex justify-center my-1 select-none">
                      <svg className="w-16 h-1.5 text-slate-600" viewBox="0 0 100 10" fill="currentColor">
                        <path d="M0,5 L40,5 L45,2 L50,8 L55,2 L60,5 L100,5" stroke="currentColor" strokeWidth="0.5" fill="none" />
                        <circle cx="50" cy="5" r="1.2" className="fill-red-500 stroke-red-500" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Letter Title */}
                <div className="text-center my-6">
                  {isEmployment ? (
                    <>
                      <h1 className="font-moul text-base text-black tracking-wide leading-normal">លិខិតបញ្ជាក់ការងារ</h1>
                      <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mt-0.5">CERTIFICATE OF EMPLOYMENT</h2>
                    </>
                  ) : (
                    <>
                      <h1 className="font-moul text-base text-black tracking-wide leading-normal">លិខិតបញ្ជាការងារ</h1>
                      <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mt-0.5">MISSION ORDER / WORK ORDER</h2>
                    </>
                  )}
                  <p className="text-[11px] font-bold text-slate-800 mt-1.5">
                    លេខ៖ <span className="font-mono">{toKhmerNum(missionForm.letterNo)}</span>
                  </p>
                </div>

                {/* Document Main Content */}
                <div className={`flex-1 py-4 font-sans text-black leading-[2.2] ${
                  layoutFontSize === "small" ? "text-[12px]" : layoutFontSize === "large" ? "text-[15px]" : "text-[13px]"
                }`}>
                  {isEmployment ? (
                    <div className="space-y-5 text-black text-left">
                      <p className="indent-10 text-justify font-medium">
                        យើងខ្ញុំ នាយកសាលា <span className="font-moul text-black">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</span> សូមបញ្ជាក់ថា៖
                      </p>

                      {/* Elegant Dotted Form Layout with Hover Highlights */}
                      <div className="space-y-3.5 my-6 pl-8">
                        <div className="flex items-center gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded px-1.5 transition-all">
                          <span className="w-36 text-slate-700 shrink-0 font-medium">លោក / លោកស្រី៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                            {missionForm.staffName || "\u00A0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded px-1.5 transition-all">
                          <span className="w-36 text-slate-700 shrink-0 font-medium">ភេទ៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                            {missionForm.staffGender || "\u00A0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded px-1.5 transition-all">
                          <span className="w-36 text-slate-700 shrink-0 font-medium">ថ្ងៃខែឆ្នាំកំណើត៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5 font-mono">
                            {formatDateToPrint(missionForm.dob) || "\u00A0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded px-1.5 transition-all">
                          <span className="w-36 text-slate-700 shrink-0 font-medium">អត្តសញ្ញាណប័ណ្ណ៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5 font-mono">
                            {missionForm.idCardNo || "\u00A0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded px-1.5 transition-all">
                          <span className="w-36 text-slate-700 shrink-0 font-medium">តួនាទីបច្ចុប្បន្ន៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                            {missionForm.staffPosition || "\u00A0"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2 text-justify">
                        <p className="indent-10 font-medium leading-[2.2]">
                          សាមីខ្លួនពិតជាបានបំពេញការងារនៅក្នុងស្ថាប័នរបស់យើងខ្ញុំ ចាប់តាំងពី <span className="text-black font-bold font-mono">{formatDateToPrint(missionForm.joinedDate) || "...................."}</span> {
                            missionForm.employmentStatus === "កំពុងបម្រើការងារ" 
                              ? "រហូតមកដល់បច្ចុប្បន្ន" 
                              : `រហូតដល់ថ្ងៃទី ${formatDateToPrint(missionForm.endDate)}`
                          } ក្នុងតួនាទីជា <span className="text-black font-bold">{missionForm.staffPosition || "...................."}</span>{
                            missionForm.showSalary && missionForm.salary ? ` ដោយទទួលបានប្រាក់បៀវត្សរ៍ប្រចាំខែចំនួន $${missionForm.salary}` : ""
                          }។
                        </p>
                        <p className="indent-10 text-slate-800 italic font-medium leading-[2.2]">
                          ក្នុងអំឡុងពេលបំពេញការងារកន្លងមក លោក/លោកស្រី តែងតែមានការខិតខំប្រឹងប្រែងយកចិត្តទុកដាក់ខ្ពស់ មានសីលធម៌វិជ្ជាជីវៈល្អ រួសរាយរាក់ទាក់ និងសហការបានយ៉ាងល្អប្រសើរជាមួយមិត្តរួមការងារគ្រប់ផ្នែក។
                        </p>
                        <p className="indent-10 font-medium leading-[2.2]">
                          លិខិតបញ្ជាក់ការងារនេះ ត្រូវបានចេញជូនសាមីខ្លួន ដើម្បីយកទៅប្រើប្រាស់ជាផ្លូវការតាមការគួរ។
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5 text-black font-sans text-left">
                      <p className="indent-10 text-justify font-medium">
                        យើងខ្ញុំ នាយកសាលា <span className="font-moul text-black">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</span> បង្គាប់មក៖
                      </p>
                      
                      {/* Elegant Dotted Form Layout */}
                      <div className="space-y-3.5 my-6 pl-8">
                        <div className="flex items-center gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded px-1.5 transition-all">
                          <span className="w-36 text-slate-700 shrink-0 font-medium">លោក / លោកស្រី៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                            {missionForm.staffName || "\u00A0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded px-1.5 transition-all">
                          <span className="w-36 text-slate-700 shrink-0 font-medium">ភេទ៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                            {missionForm.staffGender || "\u00A0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded px-1.5 transition-all">
                          <span className="w-36 text-slate-700 shrink-0 font-medium">តួនាទី៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                            {missionForm.staffPosition || "\u00A0"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3.5 mt-5 pl-4 font-medium">
                        <div className="flex items-start gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded p-1 transition-all">
                          <span className="w-48 text-slate-700 shrink-0">ត្រូវទៅបំពេញភារកិច្ចនៅ៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5 leading-relaxed font-sans">
                            {missionForm.destination || "\u00A0"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded p-1 transition-all">
                          <span className="w-48 text-slate-700 shrink-0">គោលបំណង / ភារកិច្ច៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5 leading-relaxed text-justify font-sans">
                            {missionForm.purpose || "\u00A0"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded p-1 transition-all">
                          <span className="w-48 text-slate-700 shrink-0">រយៈពេល៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                            {missionForm.duration || "...................."} (ចាប់ពី {getKhmerDateText(missionForm.startDate)} ដល់ {getKhmerDateText(missionForm.endDate)})
                          </span>
                        </div>
                        <div className="flex items-start gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded p-1 transition-all">
                          <span className="w-48 text-slate-700 shrink-0">មធ្យោបាយធ្វើដំណើរ៖</span>
                          <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5 font-medium">
                            {missionForm.transport || "\u00A0"}
                          </span>
                        </div>
                        {showAllowanceRow && missionForm.allowance && (
                          <div className="flex items-start gap-2 group/field hover:bg-blue-500/5 hover:ring-1 hover:ring-blue-500/10 rounded p-1 transition-all">
                            <span className="w-48 text-slate-700 shrink-0 font-bold">កម្រៃឧបត្ថម្ភ៖</span>
                            <span className="flex-1 font-extrabold text-blue-600 border-b border-dashed border-slate-350 pb-0.5 font-mono">
                              ${missionForm.allowance}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-slate-800 leading-relaxed pt-5 italic text-[11px] font-medium font-sans border-t border-slate-200 mt-4">
                        <p>* នាយកសាលា សង្ឃឹមយ៉ាងមុតមាំថា លោក/លោកស្រី នឹងខិតខំប្រឹងប្រែងបំពេញភារកិច្ចនេះឱ្យទទួលបានលទ្ធផលល្អប្រសើរជាទីគាប់ចិត្ត។</p>
                        <p>* The School Director strongly believes that you will perform this mission with dedication and achieve high results.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Signature Section */}
                <div className="flex justify-between items-end mt-4 select-none font-sans relative">
                  <div className="text-center w-1/3">
                    {showStaffSig && (
                      <>
                        <p className="text-[10px] font-bold text-slate-600">
                          {isEmployment ? "បានឃើញ និងអនុញ្ញាត" : "សាមីខ្លួនទទួលភារកិច្ច"}
                        </p>
                        <p className="text-[8px] font-medium text-slate-500 uppercase mt-0.5">
                          {isEmployment ? "Seen & Approved" : "Assigned Staff"}
                        </p>
                        <div className="h-12"></div>
                        <p className="text-[10px] font-bold text-slate-900">{missionForm.staffName || "......................................."}</p>
                      </>
                    )}
                  </div>
                  
                  <div className="text-center w-1/2 relative">
                    <p className="text-[10px] font-bold text-slate-800">
                      ធ្វើនៅ {getProvinceFromAddress()}, {getKhmerDateText(missionForm.issueDate)}
                    </p>
                    <p className="text-[10px] font-moul text-black mt-1 leading-normal">នាយកសាលា / Director</p>
                    
                    <div className="h-16 flex items-center justify-center relative my-1">
                      {showStampBox && !showStampGraphic && (
                        <div className="border border-slate-300/60 rounded px-2.5 py-1 text-[8px] text-slate-400 font-mono tracking-wider uppercase select-none font-sans">
                          SIGNATURE & STAMP
                        </div>
                      )}
                      
                      {/* ULTRA-REALISTIC VECTOR STAMP AND BLUE INK SIGNATURE WATERMARK */}
                      {showStampBox && showStampGraphic && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none select-none flex items-center justify-center opacity-95 rotate-6 hover:rotate-3 transition-transform duration-300 z-10 filter drop-shadow-[0_4px_8px_rgba(220,38,38,0.12)]">
                          <svg viewBox="0 0 100 100" className="w-28 h-28">
                            <defs>
                              <filter id="authentic-ink-bleed-preview" x="-20%" y="-20%" width="140%" height="140%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="4" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="distorted" />
                                <feGaussianBlur in="distorted" stdDeviation="0.45" result="blurred" />
                                <feMerge>
                                  <feMergeNode in="blurred" />
                                  <feMergeNode in="SourceGraphic" opacity="0.3" />
                                </feMerge>
                              </filter>
                              <filter id="signature-ink-bleed-preview" x="-20%" y="-20%" width="140%" height="140%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="3" result="sigNoise" />
                                <feDisplacementMap in="SourceGraphic" in2="sigNoise" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="sigDistorted" />
                                <feGaussianBlur in="sigDistorted" stdDeviation="0.3" result="sigBlurred" />
                                <feMerge>
                                  <feMergeNode in="sigBlurred" />
                                  <feMergeNode in="SourceGraphic" opacity="0.4" />
                                </feMerge>
                              </filter>
                            </defs>

                            <g filter="url(#authentic-ink-bleed-preview)">
                              <circle cx="50" cy="50" r="44" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                              <circle cx="50" cy="50" r="39" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3, 1.5" />
                              <circle cx="50" cy="50" r="34" fill="none" stroke="#dc2626" strokeWidth="1" />
                              
                              <path id="preview-stamp-text-path-top" d="M 16 50 a 34 34 0 0 1 68 0" fill="transparent" />
                              <path id="preview-stamp-text-path-bottom" d="M 84 50 a 34 34 0 0 1 -68 0" fill="transparent" />
                              
                              <text className="text-[5.5px] fill-red-600 font-extrabold tracking-widest font-sans">
                                <textPath href="#preview-stamp-text-path-top" startOffset="50%" textAnchor="middle">
                                  {schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                                </textPath>
                              </text>
                              <text className="text-[4.5px] fill-red-600 font-extrabold tracking-widest">
                                <textPath href="#preview-stamp-text-path-bottom" startOffset="50%" textAnchor="middle">
                                  {schoolName || "PLC COMPUTER SCHOOL"}
                                </textPath>
                              </text>

                              <g transform="translate(41, 38)">
                                <path d="M9 1L1 5L9 9L17 5L9 1Z M1 5V11C1 11 4 14 9 14C14 14 17 11 17 11V5 M17 6V11" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 8.5V13" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
                                <circle cx="14" cy="13" r="1.2" fill="#dc2626" />
                              </g>
                              <text x="50" y="65" className="text-[4.5px] fill-red-600 font-black text-center font-sans tracking-widest" textAnchor="middle">
                                DIRECTOR
                              </text>
                            </g>
                          </svg>

                          <div className="absolute top-4 left-1 w-28 h-20 pointer-events-none select-none flex items-center justify-center opacity-95">
                            <svg viewBox="0 0 100 50" className="w-full h-full">
                              <g filter="url(#signature-ink-bleed-preview)" stroke="#1d4ed8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M 8 36 C 16 33, 24 10, 32 24 C 40 38, 44 8, 52 14 C 60 20, 64 4, 72 8 C 80 12, 84 32, 92 20 C 96 14, 98 26, 106 22" strokeWidth="2.4" />
                                <path d="M 22 28 C 36 12, 64 8, 88 18" strokeWidth="1.6" opacity="0.85" />
                                <path d="M 12 34 C 18 32, 28 22, 34 26" strokeWidth="1.2" opacity="0.7" />
                                <path d="M 45 16 C 50 14, 56 12, 62 18" strokeWidth="1.0" opacity="0.6" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-[10px] font-bold text-black underline font-sans z-20 relative">{directorName || "ជី សុភា (CHY SOPHEA)"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (

    <>
{activeTab === "Settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
              >
                {/* Left Navigation Sidebar */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-3xs p-4 lg:p-5 space-y-3 lg:sticky lg:top-6">
                    <div className="pb-3 border-b border-slate-100 px-1">
                      <h2 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase flex items-center gap-2">
                        <Settings className="w-4.5 h-4.5 text-primary-600" />
                        <span>{idt("ការកំណត់ប្រព័ន្ធ", "System Settings", "系统设置")}</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 font-bold leading-tight mt-1">
                        {idt("រៀបចំរចនាសម្ព័ន្ធសាលា និងសុវត្ថិភាព", "Configure school and system", "配置学校基本信息与系统安全")}
                      </p>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
                      {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer border group shrink-0 ${
                              isActive
                                ? "bg-slate-950 border-slate-950 text-white shadow-sm"
                                : "bg-slate-50/40 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                            }`}
                            style={{ minWidth: "180px" }}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-3xs transition-transform group-hover:scale-105 ${
                              isActive ? "bg-white/10 text-white border border-white/10" : cat.color + " border border-current/10"
                            }`}>
                              <IconComponent className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-black leading-tight truncate">
                                {idt(cat.nameKh, cat.nameEn, cat.nameZh)}
                              </span>
                              <span className={`text-[9px] font-bold leading-tight mt-0.5 truncate hidden lg:block ${
                                isActive ? "text-slate-300" : "text-slate-400"
                              }`}>
                                {idt(cat.descKh, cat.descEn, cat.descZh)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Content based on activeCategory */}
                <div className="lg:col-span-9 flex flex-col gap-6">
                  {activeCategory === "school" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-6"
                    >
                      {/* Card 1: School Configurations */}
                      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 lg:p-7 space-y-6">
                    <div className="pb-4 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-3xs shrink-0">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
                          {idt("ការកំណត់ប្រព័ន្ធសាលា", "School Configurations (SCHOOL CONFIGURATIONS)", "学校配置 (SCHOOL CONFIGURATIONS)")}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold leading-tight">
                          {idt("កំណត់ព័ត៌មានទូទៅរបស់សាលា ឡូហ្គោ លេខទូរស័ព្ទ និងអាសយដ្ឋានសម្រាប់បង្ហាញលើកាត និងវិក្កយបត្រ", "Set general school information, logo, phone, and address to display on cards and invoices", "设置学校的基本信息、LOGO、电话和地址，以便显示在卡片和发票上")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">



                        

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <Landmark className="w-3.5 h-3.5 text-primary-500" />
                            <span>{idt("ឈ្មោះសាលា (ភាសាខ្មែរ)", "School Name (Khmer)", "学校名称 (柬文)")}</span>
                          </label>
                          <input 
                            type="text" 
                            value={schoolKhmerName} 
                            onChange={(e) => setSchoolKhmerName(e.target.value)} 
                            placeholder={idt("ឧ. សាលាកុំព្យូទ័រ ភីអិលស៊ី", "e.g. PLC Computer School", "例如: PLC 电脑学校")}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <Landmark className="w-3.5 h-3.5 text-primary-500" />
                            <span>{idt("ឈ្មោះសាលា (ភាសាអង់គ្លេស)", "School Name (English)", "学校名称 (英文)")}</span>
                          </label>
                          <input 
                            type="text" 
                            value={schoolName} 
                            onChange={(e) => setSchoolName(e.target.value)} 
                            placeholder={idt("ឧ. PLC Computer School", "e.g. PLC Computer School", "例如: PLC Computer School")}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <Phone className="w-3.5 h-3.5 text-primary-500" />
                            <span>{idt("លេខទូរស័ព្ទសាលា", "School Phone (SCHOOL PHONE)", "学校电话 (SCHOOL PHONE)")}</span>
                          </label>
                          <input 
                            type="text" 
                            value={schoolPhone} 
                            onChange={(e) => setSchoolPhone(e.target.value)} 
                            placeholder={idt("ឧ. 012 345 678", "e.g. 012 345 678", "例如: 012 345 678")}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <Send className="w-3.5 h-3.5 text-primary-500" />
                            <span>{idt("តេឡេក្រាមសាលា", "School Telegram URL (SCHOOL TELEGRAM URL)", "学校电报链接 (SCHOOL TELEGRAM URL)")}</span>
                          </label>
                          <input 
                            type="text" 
                            value={schoolTelegram} 
                            onChange={(e) => setSchoolTelegram(e.target.value)} 
                            placeholder={idt("ឧ. https://t.me/plccomputer", "e.g. https://t.me/plccomputer", "例如: https://t.me/plccomputer")}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <User className="w-3.5 h-3.5 text-primary-500" />
                            <span>{idt("ឈ្មោះនាយកសាលា", "Director Name", "校长姓名")}</span>
                          </label>
                          <input 
                            type="text" 
                            value={directorName} 
                            onChange={(e) => setDirectorName(e.target.value)} 
                            placeholder={idt("ឧ. ជី សុភា (CHY SOPHEA)", "e.g. CHY SOPHEA", "例如: CHY SOPHEA")}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-primary-500" />
                            <span>{idt("បុព្វបទលេខសម្គាល់សិស្ស", "Student ID Prefix", "学号前缀")}</span>
                          </label>
                          <input 
                            type="text" 
                            value={studentIdPrefix} 
                            onChange={(e) => setStudentIdPrefix(e.target.value)} 
                            placeholder={idt("ឧ. STU-26-", "e.g. STU-26-", "例如: STU-26-")}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5 text-primary-500" />
                          <span>{idt("អាសយដ្ឋានសាលា", "School Address (SCHOOL ADDRESS)", "学校地址 (SCHOOL ADDRESS)")}</span>
                        </label>
                        <input 
                          type="text" 
                          value={schoolAddress} 
                          onChange={(e) => setSchoolAddress(e.target.value)} 
                          placeholder={idt("ឧ. ភ្នំពេញ, ប្រទេសកម្ពុជា", "e.g. Phnom Penh, Cambodia", "例如: 柬埔寨金边")}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <ImageIcon className="w-3.5 h-3.5 text-primary-500" />
                            <span>{idt("ឡូហ្គោសាលា", "School Logo URL (SCHOOL LOGO URL)", "学校LOGO链接 (SCHOOL LOGO URL)")}</span>
                          </label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={schoolLogo} 
                                onChange={(e) => setSchoolLogo(e.target.value)} 
                                placeholder="https://..."
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs font-mono"
                              />
                              <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors border border-primary-100">
                                <Upload className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                              </label>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <Palette className="w-3.5 h-3.5 text-primary-500" />
                            <span>{idt("ប្រធានបទកម្មវិធី", "App Theme (APP THEME)", "应用主题 (APP THEME)")}</span>
                          </label>
                          <select
                            value={appTheme}
                            onChange={(e) => setAppTheme(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs"
                          >
                            <option value="indigo">{idt("ពណ៌ខៀវ (Modern Indigo)", "Modern Indigo", "现代靛蓝 (Modern Indigo)")}</option>
                            <option value="emerald">{idt("ពណ៌បៃតង (Classic Emerald)", "Classic Emerald", "经典翠绿 (Classic Emerald)")}</option>
                            <option value="rose">{idt("ពណ៌ផ្កាឈូក (Elegant Rose)", "Elegant Rose", "优雅玫瑰红 (Elegant Rose)")}</option>
                            <option value="amber">{idt("ពណ៌មាស (Warm Amber)", "Warm Amber", "温暖琥珀黄 (Warm Amber)")}</option>
                            <option value="cyan">{idt("ពណ៌ខៀវសមុទ្រ (Cyan Sky)", "Cyan Sky", "青空 (Cyan Sky)")}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          <FileText className="w-3.5 h-3.5 text-primary-500" />
                          <span>{idt("កំណត់សម្គាល់ខាងក្រោមវិក្កយបត្រ", "Receipt Footer Note (RECEIPT FOOTER NOTE)", "收据页脚备注 (RECEIPT FOOTER NOTE)")}</span>
                        </label>
                        <textarea
                          rows={2}
                          value={receiptFooterNote}
                          onChange={(e) => setReceiptFooterNote(e.target.value)}
                          placeholder={idt("កំណត់សម្គាល់...", "Notes...", "备注...")}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/system/export-all-data", {
                              headers: { "Authorization": `Bearer ${token}` }
                            });
                            if (res.ok) {
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              let filename = "System_Data_Export_" + new Date().toISOString().split("T")[0] + ".xlsx";
                              
                              const contentDisposition = res.headers.get("Content-Disposition");
                              if (contentDisposition) {
                                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                                if (filenameMatch && filenameMatch.length === 2) {
                                  filename = filenameMatch[1];
                                }
                              }
                              a.download = filename;
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                              window.URL.revokeObjectURL(url);
                              showToast(idt("ទាញយកទិន្នន័យបានជោគជ័យ!", "Data exported successfully!", "导出数据成功！"), "success");
                            } else {
                              showToast(idt("មិនអាចទាញយកទិន្នន័យបានទេ!", "Failed to export data!", "导出数据失败！"), "error");
                            }
                          } catch(err) {
                            console.error(err);
                            showToast(idt("មានបញ្ហាភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Connection error!", "与服务器连接出错！"), "error");
                          }
                        }}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{idt("ទាញយកទិន្នន័យប្រព័ន្ធ", "Export System Data", "导出系统数据")}</span>
                      </button>
                      
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
                                schoolName,
                                schoolKhmerName,
                                directorName,
                                baseFee,
                                schoolLogo,

                                khqrImage,

                                schoolPhone,
                                schoolAddress,
                                schoolTelegram,
                                receiptFooterNote, developerLogo, developerName, developerKhmerName, developerPhone, developerTelegram,
                                studentIdPrefix,
                                appTheme,
                                courseOptions,
                                levelOptions,
                                shiftOptions,
                                hoursOptions
                              })
                            });
                            if (res.ok) {
                              showToast(idt("បានរក្សាទុកការកំណត់ជោគជ័យ!", "Settings saved successfully!", "设置保存成功！"), "success");
                            } else {
                              showToast(idt("រក្សាទុកការកំណត់បរាជ័យ!", "Failed to save settings!", "设置保存失败！"), "error");
                            }
                          } catch (err) {
                            console.error(err);
                            showToast(idt("មានបញ្ហាភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Connection error!", "与服务器连接出错！"), "error");
                          }
                        }}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>{idt("រក្សាទុក", "Save Config (SAVE SCHOOL CONFIG)", "保存设置 (SAVE SCHOOL CONFIG)")}</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 lg:p-8 space-y-8 mt-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="pb-5 border-b border-slate-100/80 flex items-center justify-between gap-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                          <Terminal className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-extrabold text-slate-800 text-base tracking-wide uppercase">
                            {idt("ព័ត៌មានអ្នកអភិវឌ្ឍន៍", "Developer Information", "开发者信息")}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium leading-tight">
                            {idt("កំណត់ព័ត៌មានអំពីអ្នកអភិវឌ្ឍន៍កម្មវិធីនេះ", "Set information about the developer of this application", "设置关于此应用程序开发者的信息")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Interactive Developer Profile Card */}
                        <div className="lg:col-span-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center text-center space-y-4 shadow-3xs relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider self-start">
                            {idt("ការបង្ហាញព័ត៌មាន", "Profile Preview", "预览展示")}
                          </span>
                          
                          <div className="w-20 h-20 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative group">
                            {developerLogo ? (
                              <img 
                                src={developerLogo} 
                                alt="Developer" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl">
                                {developerName ? developerName.charAt(0) : "D"}
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-extrabold text-slate-800 text-sm tracking-wide">
                              {developerKhmerName || idt("ភីអិលស៊ី កុំព្យូទ័រ", "PLC Computer", "PLC 计算机")}
                            </h4>
                            <p className="text-xs text-slate-500 font-semibold">
                              {developerName || "PLC Computer"}
                            </p>
                          </div>

                          <div className="w-full pt-4 border-t border-slate-200/60 flex flex-col gap-2.5 text-left">
                            {developerPhone && (
                              <a href={`tel:${developerPhone}`} className="flex items-center gap-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
                                <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span>{developerPhone}</span>
                              </a>
                            )}
                            {developerTelegram && (
                              <a 
                                href={developerTelegram.startsWith("http") ? developerTelegram : `https://t.me/${developerTelegram.replace("@", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors truncate"
                              >
                                <Send className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="truncate">{developerTelegram}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Right Column: Information form fields */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Developer Logo Upload */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                              <Upload className="w-3.5 h-3.5 text-blue-500" />
                              <span>{idt("រូបភាពអ្នកអភិវឌ្ឍន៍ (URL ឬ ផ្ទុកឡើង)", "Developer Logo (URL or Upload)", "开发者标志 (URL 或 上传)")}</span>
                            </label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={developerLogo || ""} 
                                onChange={(e) => setDeveloperLogo(e.target.value)} 
                                placeholder="https://..."
                                disabled={!isEditingDeveloper}
                                className={`flex-1 px-4 py-2.5 border rounded-xl text-xs font-bold transition-all shadow-3xs font-mono ${!isEditingDeveloper ? "bg-slate-50/70 border-slate-200/60 text-slate-600" : "border-slate-200 text-slate-800 bg-white hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500"}`}
                              />
                              {isEditingDeveloper && (
                                <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors border border-primary-100 shrink-0">
                                  <Upload className="w-4 h-4" />
                                  <input type="file" className="hidden" accept="image/*" onChange={handleDeveloperLogoUpload} />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* Developer Name English */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                              <User className="w-3.5 h-3.5 text-blue-500" />
                              <span>{idt("ឈ្មោះអ្នកអភិវឌ្ឍន៍ (អង់គ្លេស)", "Developer Name (English)", "开发者名称 (英文)")}</span>
                            </label>
                            <input 
                              type="text" 
                              value={developerName || ""} 
                              onChange={(e) => setDeveloperName(e.target.value)} 
                              placeholder={idt("ឧ. PLC Computer", "e.g. PLC Computer", "例如: PLC Computer")}
                              disabled={!isEditingDeveloper}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs font-bold transition-all shadow-3xs ${!isEditingDeveloper ? "bg-slate-50/70 border-slate-200/60 text-slate-600" : "border-slate-200 text-slate-800 bg-white hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500"}`}
                            />
                          </div>

                          {/* Developer Name Khmer */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                              <User className="w-3.5 h-3.5 text-blue-500" />
                              <span>{idt("ឈ្មោះអ្នកអភិវឌ្ឍន៍ (ខ្មែរ)", "Developer Name (Khmer)", "开发者名称 (柬文)")}</span>
                            </label>
                            <input 
                              type="text" 
                              value={developerKhmerName || ""} 
                              onChange={(e) => setDeveloperKhmerName(e.target.value)} 
                              placeholder={idt("ឧ. ភីអិលស៊ី កុំព្យូទ័រ", "e.g. PLC Computer (Khmer)", "例如: PLC Computer (Khmer)")}
                              disabled={!isEditingDeveloper}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs font-bold transition-all shadow-3xs ${!isEditingDeveloper ? "bg-slate-50/70 border-slate-200/60 text-slate-600" : "border-slate-200 text-slate-800 bg-white hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500"}`}
                            />
                          </div>

                          {/* Phone Number */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                              <Phone className="w-3.5 h-3.5 text-blue-500" />
                              <span>{idt("លេខទូរស័ព្ទ", "Phone Number", "电话号码")}</span>
                            </label>
                            <input 
                              type="text" 
                              value={developerPhone || ""} 
                              onChange={(e) => setDeveloperPhone(e.target.value)} 
                              placeholder={idt("ឧ. 012 345 678", "e.g. 012 345 678", "例如: 012 345 678")}
                              disabled={!isEditingDeveloper}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs font-bold transition-all shadow-3xs ${!isEditingDeveloper ? "bg-slate-50/70 border-slate-200/60 text-slate-600" : "border-slate-200 text-slate-800 bg-white hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500"}`}
                            />
                          </div>

                          {/* Telegram / Website */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                              <Send className="w-3.5 h-3.5 text-blue-500" />
                              <span>{idt("តេឡេក្រាម ឬ គេហទំព័រ", "Telegram / Website", "电报 / 网站")}</span>
                            </label>
                            <input 
                              type="text" 
                              value={developerTelegram || ""} 
                              onChange={(e) => setDeveloperTelegram(e.target.value)} 
                              placeholder={idt("ឧ. https://t.me/plccomputer", "e.g. https://t.me/...", "例如: https://t.me/...")}
                              disabled={!isEditingDeveloper}
                              className={`w-full px-4 py-2.5 border rounded-xl text-xs font-bold transition-all shadow-3xs ${!isEditingDeveloper ? "bg-slate-50/70 border-slate-200/60 text-slate-600" : "border-slate-200 text-slate-800 bg-white hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500"}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons at the bottom of the section */}
                      <div className="pt-5 border-t border-slate-100 flex justify-end gap-3 z-10 relative">
                        {!isEditingDeveloper ? (
                          <button
                            type="button"
                            onClick={() => setIsEditingDeveloper(true)}
                            className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border border-blue-100/50 cursor-pointer shadow-3xs"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>{idt("កែប្រែព័ត៌មាន", "Edit Information", "编辑信息")}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setIsEditingDeveloper(false)}
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{idt("បោះបង់", "Cancel", "取消")}</span>
                            </button>
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
                                      schoolName,
                                      schoolKhmerName,
                                      directorName,
                                      baseFee,
                                      schoolLogo,
                                      khqrImage,
                                      schoolPhone,
                                      schoolAddress,
                                      schoolTelegram,
                                      receiptFooterNote,
                                      developerLogo,
                                      developerName,
                                      developerKhmerName,
                                      developerPhone,
                                      developerTelegram,
                                      studentIdPrefix,
                                      appTheme,
                                      courseOptions,
                                      levelOptions,
                                      shiftOptions,
                                      hoursOptions
                                    })
                                  });
                                  if (res.ok) {
                                    showToast(idt("បានរក្សាទុកការកំណត់ជោគជ័យ!", "Settings saved successfully!", "设置保存成功！"), "success");
                                    setIsEditingDeveloper(false);
                                  } else {
                                    showToast(idt("រក្សាទុកការកំណត់បរាជ័យ!", "Failed to save settings!", "设置保存失败！"), "error");
                                  }
                                } catch (err) {
                                  console.error(err);
                                  showToast(idt("មានបញ្ហាភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Connection error!", "与服务器连接出错！"), "error");
                                }
                              }}
                              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                            >
                              <Save className="w-4 h-4" />
                              <span>{idt("រក្សាទុកព័ត៌មាន", "Save Information", "保存信息")}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  </motion.div>
                  )}

{activeCategory === "banner" && (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-6"
  >
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-3xs shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
              {idt("កំណត់រូបតាំង & ផ្ទាំងបដា (Banner / Cover Image)", "Banner / Cover Image Settings", "横幅与封面图设置")}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold leading-tight">
              {idt("ផ្លាស់ប្តូររូបភាពគម្រប ចំណងជើង និងការបង្ហាញនៅលើផ្ទាំងដើមសិស្សានុសិស្ស", "Customize hero banner image, title and subtitles on student portal", "自定义学生端首页横幅图、标题与副标题")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveBannerSettings}
          disabled={isSavingBanner}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSavingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{idt("រក្សាទុកកំណត់រូបតាំង", "Save Banner Settings", "保存横幅设置")}</span>
        </button>
      </div>

      {/* SLIDE SELECTION TABS */}
      <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>{idt("ជ្រើសរើសផ្ទាំងបដាដើម្បីកំណត់ (ជ្រើសរើសផ្ទាំងទី ១, ២ ឬ ៣)", "Select Banner Slide to Edit (Slide 1, 2 or 3)", "选择要编辑的横幅页 (第 1、2 或 3 页)")}</span>
          </label>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
            {idt("សរុប ៣ ផ្ទាំងបដា", "Total 3 Slides", "共3页")}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-0.5">
          {[0, 1, 2].map((idx) => {
            const isCurrent = activeSlideIndex === idx;
            const slide = bannerSlides[idx] || DEFAULT_SLIDES[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 text-center ${
                  isCurrent
                    ? "bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40 scale-102 font-black"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-bold"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${isCurrent ? "bg-white text-amber-600" : "bg-slate-200 text-slate-700"}`}>
                    {idx + 1}
                  </span>
                  <span>{idt(`ផ្ទាំងទី ${idx + 1}`, `Slide ${idx + 1}`, `第 ${idx + 1} 页`)}</span>
                </div>
                <span className={`text-[10px] truncate max-w-full ${isCurrent ? "text-amber-100 font-medium" : "text-slate-400"}`}>
                  {slide.title || `ចំណងជើង ${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LIVE PREVIEW BANNER CARD */}
      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{idt(`ទិដ្ឋភាពបង្ហាញជាក់ស្តែង (Live Preview - ផ្ទាំងទី ${activeSlideIndex + 1})`, `Live Banner Preview - Slide ${activeSlideIndex + 1}`, `实时横幅预览 - 第 ${activeSlideIndex + 1} 页`)}</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
            {idt("ចុចលើចំណុចខាងក្រោមដើម្បីប្តូរផ្ទាំងមើល", "Click dots to switch preview slide", "点击小圆点可切换预览页")}
          </span>
        </label>
        
        <div className="w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-lg relative bg-slate-900 border border-slate-200 group transition-all">
          <img
            src={bannerSlides[activeSlideIndex]?.image || coverImage}
            alt="Banner Preview"
            className="w-full h-48 sm:h-56 object-cover opacity-90 transition-all duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800";
            }}
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-5 text-white">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider drop-shadow-sm">
              {bannerSlides[activeSlideIndex]?.title || "ចំណងជើង"}
            </span>
            <p className="text-sm font-bold text-white line-clamp-2 mt-0.5 drop-shadow-sm">
              {bannerSlides[activeSlideIndex]?.subtitle || "អនុចំណងជើង"}
            </p>
            {/* Carousel Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {[0, 1, 2].map((dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveSlideIndex(dotIdx)}
                  className={`transition-all rounded-full cursor-pointer ${
                    activeSlideIndex === dotIdx ? "w-5 h-2.5 bg-amber-400 shadow-xs" : "w-2 h-2 bg-white/70 hover:bg-white"
                  }`}
                  title={`ប្តូរទៅផ្ទាំងទី ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BANNER EDIT FIELDS FOR ACTIVE SLIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <span>{idt(`ចំណងជើងរូបតាំង ផ្ទាំងទី ${activeSlideIndex + 1}`, `Banner Title (Slide ${activeSlideIndex + 1})`, `横幅标题 (第 ${activeSlideIndex + 1} 页)`)}</span>
          </label>
          <input
            type="text"
            value={bannerSlides[activeSlideIndex]?.title || ""}
            onChange={(e) => updateActiveSlide("title", e.target.value)}
            placeholder="ឧ. វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <span>{idt(`ពិពណ៌នា/អនុចំណងជើង ផ្ទាំងទី ${activeSlideIndex + 1}`, `Banner Subtitle (Slide ${activeSlideIndex + 1})`, `横幅副标题 (第 ${activeSlideIndex + 1} 页)`)}</span>
          </label>
          <input
            type="text"
            value={bannerSlides[activeSlideIndex]?.subtitle || ""}
            onChange={(e) => updateActiveSlide("subtitle", e.target.value)}
            placeholder="ឧ. អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធី"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* UPLOAD / URL IMAGE CONTROL FOR ACTIVE SLIDE */}
      <div className="space-y-3 pt-2">
        <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
          {idt(`ជ្រើសរើសរូបភាព ឬ បញ្ចូល URL សម្រាប់ផ្ទាំងទី ${activeSlideIndex + 1}`, `Upload Image or Enter URL for Slide ${activeSlideIndex + 1}`, `上传图片或输入 URL (第 ${activeSlideIndex + 1} 页)`)}
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <label className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>{idt("ជ្រើសរើសរូបភាពពីម៉ាស៊ីន", "Upload Local Image", "上传本地图片")}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
          </label>

          <span className="text-xs font-bold text-slate-400 hidden sm:inline">{idt("ឬ", "OR", "或")}</span>

          <input
            type="url"
            value={bannerSlides[activeSlideIndex]?.image || ""}
            onChange={(e) => updateActiveSlide("image", e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* PRESET IMAGE GALLERY FOR ACTIVE SLIDE */}
      <div className="space-y-3 pt-2">
        <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-amber-500" />
          <span>{idt("ជ្រើសរើសរូបភាពគំរូស្រាប់ (Preset Gallery)", "Preset Sample Banners", "预设示例图")}</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {bannerPresets.map((preset, idx) => {
            const isSelected = (bannerSlides[activeSlideIndex]?.image || "") === preset.url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => updateActiveSlide("image", preset.url)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group text-left ${
                  isSelected ? "border-amber-500 ring-2 ring-amber-500/30 scale-105 shadow-md" : "border-slate-200 hover:border-amber-300 opacity-80 hover:opacity-100"
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-20 object-cover" />
                <div className="p-1.5 bg-slate-900/90 text-white text-[9px] font-bold truncate">
                  {preset.name}
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </motion.div>
)}

{activeCategory === "telegram" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-6"
                    >
                      {/* Card 4: Telegram Integration */}
                      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                        <div className="pb-4 border-b border-slate-100 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-3xs shrink-0">
                            <Send className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
                              {idt("ការភ្ជាប់ Telegram (Telegram Integration)", "Telegram Integration", "Telegram 集成")}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold leading-tight">
                              {idt("បញ្ចូល Telegram Bot Token និង Chat ID សម្រាប់ផ្ញើសារដំណឹងផ្សេងៗ និងដំណឹងអវត្តមានសិស្ស", "Enter Telegram Bot Token and Chat ID to send notifications and student absence alerts", "输入 Telegram Bot Token 和 Chat ID 以发送通知和学生缺勤警报")}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                              <span className="text-blue-500 font-bold">Bot Token</span>
                            </label>
                            <input 
                              type="text" 
                              value={telegramBotToken || ""} 
                              onChange={(e) => setTelegramBotToken(e.target.value)} 
                              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                              <span className="text-blue-500 font-bold">Chat ID / Group ID</span>
                            </label>
                            <input 
                              type="text" 
                              value={telegramChatId || ""} 
                              onChange={(e) => setTelegramChatId(e.target.value)} 
                              placeholder="-100123456789"
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all shadow-3xs font-mono"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!telegramBotToken || !telegramChatId) {
                                showToast(idt("សូមបញ្ចូល Bot Token និង Chat ID ជាមុនសិន!", "Please enter Bot Token and Chat ID first!", "请先输入 Bot Token 和 Chat ID！"), "error");
                                return;
                              }
                              try {
                                showToast(idt("កំពុងផ្ញើសារសាកល្បង...", "Sending test message...", "正在发送测试消息..."), "info");
                                const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    chat_id: telegramChatId,
                                    text: `🔔 <b>${schoolKhmerName || schoolName || "សាលារបស់យើង"}</b>\n\n💬 ការភ្ជាប់ប្រព័ន្ធ Telegram ទទួលបានជោគជ័យ! (Telegram Connection Successful!)`,
                                    parse_mode: "HTML"
                                  })
                                });
                                if (res.ok) {
                                  showToast(idt("ផ្ញើសារសាកល្បងជោគជ័យ!", "Test message sent successfully!", "测试消息发送成功！"), "success");
                                } else {
                                  const errData = await res.json().catch(() => ({}));
                                  showToast(`${idt("ផ្ញើសារសាកល្បងបរាជ័យ!", "Test message failed!", "测试消息发送失败！")}: ${errData.description || "Unknown error"}`, "error");
                                }
                              } catch (err) {
                                console.error(err);
                                showToast(idt("មានបញ្ហាភ្ជាប់ទៅកាន់ Telegram API!", "Error connecting to Telegram API!", "连接到 Telegram API 出错！"), "error");
                              }
                            }}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            {idt("សាកល្បងផ្ញើសារ (Test)", "Test Connection", "测试连接")}
                          </button>

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
                                    schoolName,
                                    schoolKhmerName,
                                    directorName,
                                    baseFee,
                                    schoolLogo,
                                    khqrImage,
                                    schoolPhone,
                                    schoolAddress,
                                    schoolTelegram,
                                    receiptFooterNote, developerLogo, developerName, developerKhmerName, developerPhone, developerTelegram,
                                    studentIdPrefix,
                                    appTheme,
                                    courseOptions,
                                    levelOptions,
                                    shiftOptions,
                                    hoursOptions,
                                    specialtyOptions,
                                    defaultStudyMonths,
                                    defaultGender,
                                    defaultStatus,
                                    autoGenerateId,
                                    autoCalculateEndDate,
                                    defaultDiscount,
                                    academicYear,
                                    passingScore,
                                    operatingDays,
                                    defaultSortBy,
                                    currencySymbol,
                                    taxPercentage,
                                    lateFeePenalty,
                                    autoBackupDrive,
                                    backupRetentionDays,
                                    telegramBotToken,
                                    telegramChatId
                                  })
                                });
                                if (res.ok) {
                                  showToast(idt("បានរក្សាទុកការកំណត់ជោគជ័យ!", "Settings saved successfully!", "设置保存成功！"), "success");
                                } else {
                                  showToast(idt("រក្សាទុកការកំណត់បរាជ័យ!", "Failed to save settings!", "设置保存失败！"), "error");
                                }
                              } catch (err) {
                                console.error(err);
                                showToast(idt("មានបញ្ហាភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Connection error!", "与服务器连接出错！"), "error");
                              }
                            }}
                            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>{idt("រក្សាទុក", "Save Settings", "保存设置")}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeCategory === "khqr" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-6"
                    >
                      {/* KHQR Upload Card */}
                      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                        <div className="pb-4 border-b border-slate-100 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shadow-3xs shrink-0">
                            <QrCode className="w-5 h-5 text-sky-600" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
                              {idt("រូបភាព KHQR បង់ប្រាក់", "Payment KHQR Image", "付款KHQR图像")}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold leading-tight">
                              {idt("បញ្ចូលរូបភាព KHQR សម្រាប់ឲ្យសិស្សស្កេនបង់ប្រាក់ងាយស្រួល", "Upload KHQR image for easy student payments", "上传KHQR图像，方便学生付款")}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-center py-6">
                          {khqrImage ? (
                            <div className="relative w-64 h-64 border-2 border-slate-200 rounded-3xl overflow-hidden bg-white shadow-md flex items-center justify-center group">
                              <img src={khqrImage} alt="KHQR" className="w-full h-full object-contain p-2" />
                              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                <label className="cursor-pointer flex flex-col items-center">
                                  <Camera className="w-8 h-8 text-white mb-2 drop-shadow-md" />
                                  <span className="text-xs text-white font-bold drop-shadow-md">{idt("ប្តូររូបភាព", "Change Image", "更换图片")}</span>
                                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                    if (!e.target.files || e.target.files.length === 0) return;
                                    const formData = new FormData();
                                    formData.append("file", e.target.files[0]);
                                    try {
                                      const res = await fetch("/api/upload", { method: "POST", body: formData, headers: { "Authorization": `Bearer ${token}` } });
                                      if (res.ok) {
                                        const data = await res.json();
                                        if (data.url) setKhqrImage(data.url);
                                      }
                                    } catch (err) { console.error(err); }
                                  }} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setKhqrImage("")}
                                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                                  title={idt("លុបរូបភាព", "Remove Image", "删除图片")}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center text-center p-6 space-y-3 w-64 h-64 bg-slate-50 hover:bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 hover:border-primary-400 group transition-all">
                              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <QrCode className="w-8 h-8 text-blue-500" />
                              </div>
                              <div>
                                <span className="block text-sm text-slate-700 font-extrabold mb-1">{idt("បញ្ចូលរូបភាព KHQR", "Upload KHQR Image", "上传KHQR图像")}</span>
                                <span className="block text-[10px] text-slate-400">{idt("ចុចទីនេះដើម្បីជ្រើសរើសរូបភាព", "Click here to select an image", "点击这里选择图片")}</span>
                              </div>
                              <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                if (!e.target.files || e.target.files.length === 0) return;
                                const formData = new FormData();
                                formData.append("file", e.target.files[0]);
                                try {
                                  const res = await fetch("/api/upload", { method: "POST", body: formData, headers: { "Authorization": `Bearer ${token}` } });
                                  if (res.ok) {
                                    const data = await res.json();
                                    if (data.url) setKhqrImage(data.url);
                                  }
                                } catch (err) { console.error(err); }
                              }} />
                            </label>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
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
                                    schoolName,
                                    schoolKhmerName,
                                    directorName,
                                    baseFee,
                                    schoolLogo,
                                    khqrImage,
                                    schoolPhone,
                                    schoolAddress,
                                    schoolTelegram,
                                    receiptFooterNote, developerLogo, developerName, developerKhmerName, developerPhone, developerTelegram,
                                    studentIdPrefix,
                                    appTheme,
                                    courseOptions,
                                    levelOptions,
                                    shiftOptions,
                                    hoursOptions,
                                    specialtyOptions,
                                    defaultStudyMonths,
                                    defaultGender,
                                    defaultStatus,
                                    autoGenerateId,
                                    autoCalculateEndDate,
                                    defaultDiscount,
                                    academicYear,
                                    passingScore,
                                    operatingDays,
                                    defaultSortBy,
                                    currencySymbol,
                                    taxPercentage,
                                    lateFeePenalty,
                                    autoBackupDrive,
                                    backupRetentionDays,
                                    telegramBotToken,
                                    telegramChatId
                                  })
                                });
                                if (res.ok) {
                                  showToast(idt("បានរក្សាទុកការកំណត់ជោគជ័យ!", "Settings saved successfully!", "设置保存成功！"), "success");
                                } else {
                                  showToast(idt("រក្សាទុកការកំណត់បរាជ័យ!", "Failed to save settings!", "设置保存失败！"), "error");
                                }
                              } catch (err) {
                                console.error(err);
                                showToast(idt("មានបញ្ហាភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ!", "Connection error!", "与服务器连接出错！"), "error");
                              }
                            }}
                            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>{idt("រក្សាទុក", "Save Settings", "保存设置")}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeCategory === "mission" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-6"
                    >
                      {renderMissionCreatorContent(false)}
                    </motion.div>
                  )}

                  {activeCategory === "login_links" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-6"
                    >
                      {/* Top Header Banner */}
                      <div className="bg-slate-900 rounded-3xl p-6 lg:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
                        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner shrink-0">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <h2 className="font-extrabold text-base lg:text-lg text-white tracking-wide uppercase flex items-center gap-2">
                                <span>{idt("តំណភ្ជាប់ចូលប្រព័ន្ធ និង Form Login", "System Login Forms & Portal Access Links", "系统登录与门户链接")}</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-blue-500/30 border border-blue-400/40 text-blue-200 uppercase tracking-wider">
                                  QUICK ACCESS
                                </span>
                              </h2>
                              <p className="text-xs text-blue-200/80 font-medium mt-1">
                                {idt("គ្រប់គ្រងតំណភ្ជាប់ចូលប្រើប្រាស់ និង QR Code សម្រាប់ Admin, គ្រូ និងអាណាព្យាបាលសិស្ស", "Manage login links and QR codes for Admin, Teachers, and Parents/Guardians", "管理管理员、教师和家长/监护人的登录链接和二维码")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2 Main Columns for Admin Login & Guardian Login */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                        {/* Card 1: Admin Login Form */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="pb-4 border-b border-slate-100 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-3xs shrink-0">
                                  <KeyRound className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
                                    {idt("Form Login Admin / បុគ្គលិក", "Admin & Staff Login Form", "管理员与员工登录表单")}
                                  </h3>
                                  <p className="text-[10px] text-slate-400 font-bold">
                                    {idt("សម្រាប់ Admin គ្រូបង្រៀន និងបុគ្គលិកសាលា", "For Administrators, Teachers, and School Staff", "供管理员、教师及学校员工使用")}
                                  </p>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 bg-blue-100/70 border border-blue-200 text-blue-700 text-[10px] font-extrabold rounded-full">
                                Admin Access
                              </span>
                            </div>

                            {/* Link Box */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                                {idt("តំណភ្ជាប់ចូល Form Login Admin (Admin URL)", "Admin Login Form URL", "管理员登录 URL")}
                              </label>
                              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-2 pl-3">
                                <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                                <input
                                  type="text"
                                  readOnly
                                  value={`${window.location.origin}/?admin_login=true`}
                                  className="bg-transparent font-mono text-xs font-extrabold text-slate-700 flex-1 outline-none truncate"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/?admin_login=true`);
                                    showToast(idt("បានចម្លង Link Form Login Admin រួចរាល់!", "Copied Admin Login Link!", "已复制管理员登录链接！"), "success");
                                  }}
                                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{idt("ចម្លង Link", "Copy Link", "复制")}</span>
                                </button>
                              </div>
                            </div>

                            {/* Direct Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              <a
                                href={`${window.location.origin}/?admin_login=true`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[140px] px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>{idt("បើក Form Login Admin", "Open Admin Login", "打开管理员登录")}</span>
                              </a>
                            </div>

                            {/* Information Note */}
                            <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
                              <div className="font-extrabold text-blue-900 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>{idt("ព័ត៌មានគណនី Admin គំរូ (Default Demo Credentials)", "Default Demo Credentials", "默认演示凭据")}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono">
                                <div className="bg-white p-2 rounded-xl border border-blue-100">
                                  <span className="text-slate-400 block font-sans text-[9px] uppercase">{idt("គណនី", "User", "账号")}</span>
                                  <span className="font-bold text-slate-800">admin</span>
                                </div>
                                <div className="bg-white p-2 rounded-xl border border-blue-100">
                                  <span className="text-slate-400 block font-sans text-[9px] uppercase">{idt("លេខសម្ងាត់", "Password", "密码")}</span>
                                  <span className="font-bold text-slate-800">123456</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* QR Code Container */}
                          <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center gap-3">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                              {idt("ស្កេន QR Code ចូលប្រើ Form Admin", "Scan QR Code for Admin Login", "扫码登录管理员端")}
                            </span>
                            <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-3xs flex flex-col items-center gap-2">
                              <QRCodeCanvas
                                id="admin-login-qrcode"
                                value={`${window.location.origin}/?admin_login=true`}
                                size={130}
                                level="H"
                                includeMargin={true}
                              />
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider">
                                {schoolKhmerName || "ADMIN PORTAL"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setQrPosterModal("admin")}
                                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-[11px] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>{idt("រក្សាទុក & បោះពុម្ព (សន្លឹក A4)", "Save & Print (A4 Poster)", "保存并打印 (A4海报)")}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const canvas = document.getElementById("admin-login-qrcode") as HTMLCanvasElement;
                                  if (canvas) {
                                    const url = canvas.toDataURL("image/png");
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `QR_Code_Admin_${schoolName || "School"}.png`;
                                    a.click();
                                    showToast(idt("បានទាញយករូបភាព QR Code Admin រួចរាល់!", "Downloaded Admin QR Code PNG!", "已下载管理员二维码！"), "success");
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-[10px] rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                <Download className="w-3 h-3" />
                                <span>{idt("ទាញយកតែ QR (PNG)", "Only QR Code PNG", "仅二维码 PNG")}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Card 2: Guardian / Parent Login Form */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="pb-4 border-b border-slate-100 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-3xs shrink-0">
                                  <Users className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
                                    {idt("Form Login អាណាព្យាបាល / សិស្ស", "Guardian & Student Portal Form", "家长与学生门户表单")}
                                  </h3>
                                  <p className="text-[10px] text-slate-400 font-bold">
                                    {idt("សម្រាប់អាណាព្យាបាលមើលវត្តមាន លទ្ធផលសិក្សា និងកាតសិស្ស", "For Parents to check attendance, grades & ID cards", "供家长查看考勤、成绩及学生卡")}
                                  </p>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 bg-emerald-100/70 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold rounded-full">
                                Parent Portal
                              </span>
                            </div>

                            {/* Link Box */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                                {idt("តំណភ្ជាប់ចូល Form Login អាណាព្យាបាល (Parent URL)", "Guardian Portal URL", "家长门户 URL")}
                              </label>
                              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-2 pl-3">
                                <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
                                <input
                                  type="text"
                                  readOnly
                                  value={`${window.location.origin}/?parent_login=true`}
                                  className="bg-transparent font-mono text-xs font-extrabold text-slate-700 flex-1 outline-none truncate"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/?parent_login=true`);
                                    showToast(idt("បានចម្លង Link Form Login អាណាព្យាបាលរួចរាល់!", "Copied Guardian Login Link!", "已复制家长登录链接！"), "success");
                                  }}
                                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{idt("ចម្លង Link", "Copy Link", "复制")}</span>
                                </button>
                              </div>
                            </div>

                            {/* Quick Student Link Generator */}
                            {props.students && props.students.length > 0 && (
                              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                                  <span>{idt("បង្កើត Link ផ្ទាល់ខ្លួនតាមសិស្សជាក់លាក់", "Direct Student Link Generator", "生成指定学生专属链接")}</span>
                                  <span className="text-[9px] text-emerald-600 font-bold">({props.students.length} សិស្ស)</span>
                                </label>
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const url = `${window.location.origin}/?portal_student=${encodeURIComponent(e.target.value)}`;
                                      navigator.clipboard.writeText(url);
                                      showToast(idt(`បានចម្លង Link អាណាព្យាបាលសម្រាប់សិស្ស ID: ${e.target.value}`, `Copied Link for Student ID: ${e.target.value}`, `已复制学生 ID: ${e.target.value} 的专属链接`), "success");
                                    }
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-extrabold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                                >
                                  <option value="">{idt("-- ជ្រើសរើសសិស្សដើម្បីចម្លង Link អាណាព្យាបាល --", "-- Select Student to Copy Direct Link --", "-- 选择学生以复制专属链接 --")}</option>
                                  {props.students.slice(0, 100).map((st: any) => (
                                    <option key={st.id || st.studentId} value={st.studentId || st.id}>
                                      {st.studentId || st.id} - {st.nameKh || st.name || st.khmerName} ({st.phone || "គ្មានលេខ"})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Direct Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              <a
                                href={`${window.location.origin}/?parent_login=true`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[140px] px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>{idt("បើក Form Login អាណាព្យាបាល", "Open Guardian Portal", "打开家长门户")}</span>
                              </a>
                            </div>

                            {/* Instructions Box */}
                            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
                              <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{idt("របៀបអាណាព្យាបាលចូលប្រើប្រាស់", "How Parents Access", "家长登录说明")}</span>
                              </div>
                              <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-500 font-bold">
                                <li>{idt("អាណាព្យាបាលអាចចុចលើ Link ឬស្កេន QR Code ដើម្បីចូលមើលវត្តមាន និងលទ្ធផលសិក្សា", "Parents click the link or scan QR Code to view attendance and grades", "家长点击链接或扫码即可查看考勤及成绩")}</li>
                                <li>{idt("បញ្ចូលអត្តសញ្ញាណសិស្ស (ID) ឬលេខទូរស័ព្ទដើម្បីចូលមើលភ្លាមៗ", "Enter Student ID or phone number for instant access", "输入学生 ID 或电话号码即可直接登录")}</li>
                              </ul>
                            </div>
                          </div>

                          {/* QR Code Container */}
                          <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center gap-3">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                              {idt("ស្កេន QR Code ចូលប្រើ Form អាណាព្យាបាល", "Scan QR Code for Guardian Portal", "扫码登录家长端")}
                            </span>
                            <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-3xs flex flex-col items-center gap-2">
                              <QRCodeCanvas
                                id="guardian-login-qrcode"
                                value={`${window.location.origin}/?parent_login=true`}
                                size={130}
                                level="H"
                                includeMargin={true}
                              />
                              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">
                                GUARDIAN PORTAL
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setQrPosterModal("guardian")}
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-[11px] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>{idt("រក្សាទុក & បោះពុម្ព (សន្លឹក A4)", "Save & Print (A4 Poster)", "保存并打印 (A4海报)")}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const canvas = document.getElementById("guardian-login-qrcode") as HTMLCanvasElement;
                                  if (canvas) {
                                    const url = canvas.toDataURL("image/png");
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `QR_Code_Guardian_${schoolName || "School"}.png`;
                                    a.click();
                                    showToast(idt("បានទាញយករូបភាព QR Code អាណាព្យាបាលរួចរាល់!", "Downloaded Guardian QR Code PNG!", "已下载家长二维码！"), "success");
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                <Download className="w-3 h-3" />
                                <span>{idt("ទាញយកតែ QR (PNG)", "Only QR Code PNG", "仅二维码 PNG")}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                  
  {/* Printable Mission Letter (A4 hidden on screen, visible during print) */}
      <div 
        id="printable-mission-letter" 
        className="hidden print:block bg-white text-black leading-[2.2]"
        style={{
          fontFamily: "'Kantumruy Pro', 'Inter', sans-serif",
          width: '210mm',
          minHeight: '297mm',
          boxSizing: 'border-box'
        }}
      >
        <div className="p-16 flex flex-col justify-between h-full" style={{ minHeight: '275mm' }}>
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-400 pb-6">
            <div className="flex items-center gap-4">
              {schoolLogo ? (
                <img src={schoolLogo} alt="School Logo" className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <GraduationCap className="w-8 h-8 text-slate-500" />
                </div>
              )}
              <div>
                <h2 className="font-moul text-xs text-black leading-normal">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</h2>
                <h3 className="text-[9px] font-bold text-slate-800 tracking-wider uppercase mt-1">{schoolName || "PLC Computer School"}</h3>
                <p className="text-[8px] text-slate-600 mt-1">{schoolPhone}</p>
                <p className="text-[8px] text-slate-600">{schoolAddress}</p>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="font-moul text-xs text-black leading-normal">ព្រះរាជាណាចក្រកម្ពុជា</h2>
              <h3 className="font-moul text-[10px] text-black mt-1 leading-normal">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
              <p className="text-[11px] font-serif italic text-slate-700 mt-1">Kingdom of Cambodia</p>
              <p className="text-[9px] font-sans text-slate-600">Nation Religion King</p>
              
              {/* Stylized traditional visual divider for ministries style */}
              <div className="flex justify-center my-1 select-none">
                <svg className="w-24 h-2 text-slate-600" viewBox="0 0 100 10" fill="currentColor">
                  <path d="M0,5 L40,5 L45,2 L50,8 L55,2 L60,5 L100,5" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="5" r="1.5" className="fill-red-500 stroke-red-500" />
                </svg>
              </div>
            </div>
          </div>

          {/* Letter Title */}
          <div className="text-center my-8">
            {missionForm.documentType === "employment" ? (
              <>
                <h1 className="font-moul text-lg text-black tracking-wide leading-normal">លិខិតបញ្ជាក់ការងារ</h1>
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mt-1">CERTIFICATE OF EMPLOYMENT</h2>
              </>
            ) : (
              <>
                <h1 className="font-moul text-lg text-black tracking-wide leading-normal">លិខិតបញ្ជាការងារ</h1>
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mt-1">MISSION ORDER / WORK ORDER</h2>
              </>
            )}
            <p className="text-xs font-bold text-slate-800 mt-2">
              លេខ៖ <span className="font-mono">{toKhmerNum(missionForm.letterNo)}</span>
            </p>
          </div>

          {/* Body */}
          <div 
            className="flex-1 font-sans text-black"
            style={{
              fontSize: layoutFontSize === "small" ? "12px" : layoutFontSize === "large" ? "15px" : "13px"
            }}
          >
            {missionForm.documentType === "employment" ? (
              <div className="leading-[2.2] space-y-5 text-black text-justify font-sans">
                <p className="indent-10 font-medium">
                  យើងខ្ញុំ នាយកសាលា <span className="font-moul text-black">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</span> សូមបញ្ជាក់ថា៖
                </p>

                {/* Elegant Dotted Form Layout */}
                <div className="space-y-3.5 my-6 pl-10">
                  <div className="flex items-center gap-2">
                    <span className="w-36 text-slate-700 shrink-0 font-medium">លោក / លោកស្រី៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                      {missionForm.staffName || "\u00A0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-36 text-slate-700 shrink-0 font-medium">ភេទ៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                      {missionForm.staffGender || "\u00A0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-36 text-slate-700 shrink-0 font-medium">ថ្ងៃខែឆ្នាំកំណើត៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5 font-mono">
                      {formatDateToPrint(missionForm.dob) || "\u00A0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-36 text-slate-700 shrink-0 font-medium">អត្តសញ្ញាណប័ណ្ណ៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5 font-mono">
                      {missionForm.idCardNo || "\u00A0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-36 text-slate-700 shrink-0 font-medium">តួនាទីបច្ចុប្បន្ន៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-350 pb-0.5">
                      {missionForm.staffPosition || "\u00A0"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-2 text-justify font-sans">
                  <p className="indent-10 font-medium leading-[2.2]">
                    សាមីខ្លួនពិតជាបានបំពេញការងារនៅក្នុងស្ថាប័នរបស់យើងខ្ញុំ ចាប់តាំងពី <span className="text-black font-bold font-mono">{formatDateToPrint(missionForm.joinedDate) || "...................."}</span> {
                      missionForm.employmentStatus === "កំពុងបម្រើការងារ" 
                        ? "រហូតមកដល់បច្ចុប្បន្ន" 
                        : `រហូតដល់ថ្ងៃទី ${formatDateToPrint(missionForm.endDate)}`
                    } ក្នុងតួនាទីជា <span className="text-black font-bold">{missionForm.staffPosition || "...................."}</span>{
                      missionForm.showSalary && missionForm.salary ? ` ដោយទទួលបានប្រាក់បៀវត្សរ៍ប្រចាំខែចំនួន $${missionForm.salary}` : ""
                    }។
                  </p>
                  <p className="indent-10 text-slate-800 italic font-medium leading-[2.2]">
                    ក្នុងអំឡុងពេលបំពេញការងារកន្លងមក លោក/លោកស្រី តែងតែមានការខិតខំប្រឹងប្រែងយកចិត្តទុកដាក់ខ្ពស់ មានសីលធម៌វិជ្ជាជីវៈល្អ រួសរាយរាក់ទាក់ និងសហការបានយ៉ាងល្អប្រសើរជាមួយមិត្តរួមការងារគ្រប់ផ្នែក។
                  </p>
                  <p className="indent-10 font-medium leading-[2.2]">
                    លិខិតបញ្ជាក់ការងារនេះ ត្រូវបានចេញជូនសាមីខ្លួន ដើម្បីយកទៅប្រើប្រាស់ជាផ្លូវការតាមការគួរ។
                  </p>
                </div>
              </div>
            ) : (
              <div className="leading-[2.2] space-y-5 text-black font-sans">
                <p className="indent-10 text-justify font-medium">
                  យើងខ្ញុំ នាយកសាលា <span className="font-moul text-black">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</span> បង្គាប់មក៖
                </p>
                
                {/* Elegant Dotted Form Layout */}
                <div className="space-y-3.5 my-6 pl-10">
                  <div className="flex items-center gap-2">
                    <span className="w-36 text-slate-700 shrink-0 font-medium">លោក / លោកស្រី៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-355 pb-0.5">
                      {missionForm.staffName || "\u00A0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-36 text-slate-700 shrink-0 font-medium">ភេទ៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-355 pb-0.5">
                      {missionForm.staffGender || "\u00A0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-36 text-slate-700 shrink-0 font-medium">តួនាទី៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-355 pb-0.5">
                      {missionForm.staffPosition || "\u00A0"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 mt-5 pl-4 font-medium">
                  <div className="flex items-start gap-2">
                    <span className="w-48 text-slate-700 shrink-0">ត្រូវទៅបំពេញភារកិច្ចនៅ៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-355 pb-0.5 leading-relaxed font-sans">
                      {missionForm.destination || "\u00A0"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-48 text-slate-700 shrink-0">គោលបំណង / ភារកិច្ច៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-355 pb-0.5 leading-relaxed text-justify font-sans">
                      {missionForm.purpose || "\u00A0"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-48 text-slate-700 shrink-0">រយៈពេល៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-355 pb-0.5 font-sans">
                      {missionForm.duration || "...................."} (ចាប់ពី {getKhmerDateText(missionForm.startDate)} ដល់ {getKhmerDateText(missionForm.endDate)})
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-48 text-slate-700 shrink-0">មធ្យោបាយធ្វើដំណើរ៖</span>
                    <span className="flex-1 font-bold text-black border-b border-dashed border-slate-355 pb-0.5 font-medium">
                      {missionForm.transport || "\u00A0"}
                    </span>
                  </div>
                  {showAllowanceRow && missionForm.allowance && (
                    <div className="flex items-start gap-2">
                      <span className="w-48 text-slate-700 shrink-0 font-bold">កម្រៃឧបត្ថម្ភ៖</span>
                      <span className="flex-1 font-extrabold text-blue-600 border-b border-dashed border-slate-355 pb-0.5 font-mono">
                        ${missionForm.allowance}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-slate-800 leading-relaxed pt-5 italic text-[11px] font-medium font-sans border-t border-slate-200 mt-4">
                  <p>* នាយកសាលា សង្ឃឹមយ៉ាងមុតមាំថា លោក/លោកស្រី នឹងខិតខំប្រឹងប្រែងបំពេញភារកិច្ចនេះឱ្យទទួលបានលទ្ធផលល្អប្រសើរជាទីគាប់ចិត្ត។</p>
                  <p>* The School Director strongly believes that you will perform this mission with dedication and achieve high results.</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Signatures */}
          <div className="flex justify-between items-end pt-8 mt-auto border-t border-slate-300 font-sans">
            <div className="text-center w-1/3">
              {showStaffSig && (
                <>
                  <p className="text-xs font-bold text-slate-700">
                    {missionForm.documentType === "employment" ? "បានឃើញ និងអនុញ្ញាត" : "សាមីខ្លួនទទួលភារកិច្ច"}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase mt-1">
                    {missionForm.documentType === "employment" ? "Seen & Approved" : "Assigned Staff"}
                  </p>
                  <div className="h-16"></div>
                  <p className="text-xs font-bold text-slate-900">{missionForm.staffName || "....................................................."}</p>
                </>
              )}
            </div>
            
            <div className="text-center w-1/2">
              <p className="text-xs font-bold text-slate-700">
                ធ្វើនៅ {getProvinceFromAddress()}, {getKhmerDateText(missionForm.issueDate)}
              </p>
              <p className="text-xs font-moul text-black mt-2 leading-normal">នាយកសាលា / Director</p>
              
              <div className="h-16 flex items-center justify-center relative my-2">
                {showStampBox && !showStampGraphic && (
                  /* Director Signature Placeholder */
                  <div className="border border-slate-300/80 rounded px-3 py-1 text-[9px] text-slate-400 font-mono tracking-widest uppercase select-none absolute">
                    SIGNATURE & STAMP
                  </div>
                )}

                {/* REALISTIC INK SEAL AND SIGNATURE WATERMARK (PHYSICAL PRINT COMPATIBLE) */}
                {showStampBox && showStampGraphic && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none select-none flex items-center justify-center opacity-95 rotate-6 z-10">
                    <svg viewBox="0 0 100 100" className="w-28 h-28">
                      <defs>
                        <filter id="authentic-ink-bleed-print" x="-20%" y="-20%" width="140%" height="140%">
                          <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="4" result="noise" />
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="distorted" />
                          <feGaussianBlur in="distorted" stdDeviation="0.45" result="blurred" />
                          <feMerge>
                            <feMergeNode in="blurred" />
                            <feMergeNode in="SourceGraphic" opacity="0.3" />
                          </feMerge>
                        </filter>
                        <filter id="signature-ink-bleed-print" x="-20%" y="-20%" width="140%" height="140%">
                          <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="3" result="sigNoise" />
                          <feDisplacementMap in="SourceGraphic" in2="sigNoise" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="sigDistorted" />
                          <feGaussianBlur in="sigDistorted" stdDeviation="0.3" result="sigBlurred" />
                          <feMerge>
                            <feMergeNode in="sigBlurred" />
                            <feMergeNode in="SourceGraphic" opacity="0.4" />
                          </feMerge>
                        </filter>
                      </defs>

                      <g filter="url(#authentic-ink-bleed-print)">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                        <circle cx="50" cy="50" r="39" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3, 1.5" />
                        <circle cx="50" cy="50" r="34" fill="none" stroke="#dc2626" strokeWidth="1" />
                        
                        <path id="print-stamp-text-path-top" d="M 16 50 a 34 34 0 0 1 68 0" fill="transparent" />
                        <path id="print-stamp-text-path-bottom" d="M 84 50 a 34 34 0 0 1 -68 0" fill="transparent" />
                        
                        <text className="text-[5.5px] fill-red-600 font-extrabold tracking-widest font-sans">
                          <textPath href="#print-stamp-text-path-top" startOffset="50%" textAnchor="middle">
                            {schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                          </textPath>
                        </text>
                        <text className="text-[4.5px] fill-red-600 font-extrabold tracking-widest">
                          <textPath href="#print-stamp-text-path-bottom" startOffset="50%" textAnchor="middle">
                            {schoolName || "PLC COMPUTER SCHOOL"}
                          </textPath>
                        </text>

                        <g transform="translate(41, 38)">
                          <path d="M9 1L1 5L9 9L17 5L9 1Z M1 5V11C1 11 4 14 9 14C14 14 17 11 17 11V5 M17 6V11" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 8.5V13" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
                          <circle cx="14" cy="13" r="1.2" fill="#dc2626" />
                        </g>
                        <text x="50" y="65" className="text-[4.5px] fill-red-600 font-black text-center font-sans tracking-widest" textAnchor="middle">
                          DIRECTOR
                        </text>
                      </g>
                    </svg>

                    <div className="absolute top-4 left-1 w-28 h-20 pointer-events-none select-none flex items-center justify-center opacity-95">
                      <svg viewBox="0 0 100 50" className="w-full h-full">
                        <g filter="url(#signature-ink-bleed-print)" stroke="#1d4ed8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M 8 36 C 16 33, 24 10, 32 24 C 40 38, 44 8, 52 14 C 60 20, 64 4, 72 8 C 80 12, 84 32, 92 20 C 96 14, 98 26, 106 22" strokeWidth="2.4" />
                          <path d="M 22 28 C 36 12, 64 8, 88 18" strokeWidth="1.6" opacity="0.85" />
                          <path d="M 12 34 C 18 32, 28 22, 34 26" strokeWidth="1.2" opacity="0.7" />
                          <path d="M 45 16 C 50 14, 56 12, 62 18" strokeWidth="1.0" opacity="0.6" />
                        </g>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs font-bold text-black underline">{directorName || "ជី សុភា (CHY SOPHEA)"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal Creator */}
      <AnimatePresence>
        {isMissionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm no-print"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-7xl h-[92vh] shadow-2xl relative"
            >
              {renderMissionCreatorContent(true, () => setIsMissionModalOpen(false))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRINTABLE & INTERACTIVE PREVIEW A4 PORTRAIT QR POSTER SHEET */}
      {qrPosterModal && (
        <>
          {/* Printable Element (Hidden on screen, active on print) */}
          <div 
            id="printable-qr-poster" 
            className="hidden print:block bg-white text-black leading-relaxed"
            style={{
              fontFamily: "'Kantumruy Pro', 'Inter', sans-serif",
              width: '210mm',
              minHeight: '297mm',
              boxSizing: 'border-box'
            }}
          >
            <div className="p-8 h-full flex flex-col justify-between" style={{ minHeight: '297mm' }}>
              {/* Outer Double Frame Border with Ornamental Corner Designs */}
              <div className="border-4 border-double border-amber-600/90 rounded-2xl p-6 h-full flex flex-col justify-between relative bg-white">
                
                {/* Corner Kbach / Filigree Ornaments */}
                <div className="absolute top-2 left-2 w-8 h-8 text-amber-600 pointer-events-none">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                    <path d="M2,2 L18,2 C10,2 2,10 2,18 Z M2,2 L2,20 L6,20 L6,6 L20,6 L20,2 Z" />
                  </svg>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 text-amber-600 pointer-events-none rotate-90">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                    <path d="M2,2 L18,2 C10,2 2,10 2,18 Z M2,2 L2,20 L6,20 L6,6 L20,6 L20,2 Z" />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-2 w-8 h-8 text-amber-600 pointer-events-none -rotate-90">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                    <path d="M2,2 L18,2 C10,2 2,10 2,18 Z M2,2 L2,20 L6,20 L6,6 L20,6 L20,2 Z" />
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 text-amber-600 pointer-events-none rotate-180">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                    <path d="M2,2 L18,2 C10,2 2,10 2,18 Z M2,2 L2,20 L6,20 L6,6 L20,6 L20,2 Z" />
                  </svg>
                </div>

                {/* 1. TOP HEADER SECTION */}
                <div>
                  {/* Kingdom Motto */}
                  <div className="text-center pb-2">
                    <h2 className="font-moul text-sm text-black leading-snug">ព្រះរាជាណាចក្រកម្ពុជា</h2>
                    <h3 className="font-moul text-xs text-black mt-0.5 leading-snug">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                    <div className="flex justify-center my-1 select-none">
                      <svg className="w-28 h-2 text-amber-600" viewBox="0 0 100 10" fill="currentColor">
                        <path d="M0,5 L40,5 L45,2 L50,8 L55,2 L60,5 L100,5" stroke="currentColor" strokeWidth="0.8" fill="none" />
                        <circle cx="50" cy="5" r="1.8" className="fill-amber-600" />
                      </svg>
                    </div>
                  </div>

                  {/* School Identity Bar */}
                  <div className="flex items-center justify-between border-y-2 border-amber-600/40 py-3 my-2 px-2">
                    <div className="flex items-center gap-3">
                      {schoolLogo ? (
                        <img src={schoolLogo} alt="Logo" className="w-14 h-14 object-contain" />
                      ) : (
                        <div className="w-14 h-14 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-center text-amber-800">
                          <GraduationCap className="w-8 h-8" />
                        </div>
                      )}
                      <div>
                        <h1 className="font-moul text-xs text-black leading-normal">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</h1>
                        <h2 className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">{schoolName || "PLC COMPUTER SCHOOL"}</h2>
                        <p className="text-[9px] text-slate-600 font-medium">{schoolAddress}</p>
                      </div>
                    </div>
                    <div className="text-right text-[9px] font-bold text-slate-700">
                      <p className="text-amber-800 font-extrabold">{schoolPhone}</p>
                      <p className="text-slate-500 font-mono text-[8px]">{window.location.origin}</p>
                    </div>
                  </div>

                  {/* Banner Title */}
                  <div className="text-center my-4 py-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                    {qrPosterModal === "admin" ? (
                      <>
                        <h2 className="font-moul text-base text-amber-950 leading-relaxed">
                          សន្លឹកស្កេន QR CODE ចូលប្រព័ន្ធ ADMIN / បុគ្គលិក
                        </h2>
                        <p className="text-xs font-black text-amber-800 tracking-wider uppercase mt-0.5">
                          ADMINISTRATOR & STAFF SYSTEM LOGIN PORTAL
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="font-moul text-base text-emerald-950 leading-relaxed">
                          សន្លឹកស្កេន QR CODE ចូលប្រព័ន្ធ អាណាព្យាបាល / សិស្ស
                        </h2>
                        <p className="text-xs font-black text-emerald-800 tracking-wider uppercase mt-0.5">
                          GUARDIAN & STUDENT PORTAL ACCESS CODE
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. CENTER HIGH-RES QR CODE DISPLAY */}
                <div className="flex flex-col items-center justify-center py-3 my-1">
                  <div className="p-5 bg-white border-2 border-slate-300 rounded-2xl shadow-sm flex flex-col items-center gap-3">
                    <QRCodeCanvas
                      value={qrPosterModal === "admin" ? `${window.location.origin}/?admin_login=true` : `${window.location.origin}/?parent_login=true`}
                      size={230}
                      level="H"
                      includeMargin={true}
                    />
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-slate-800 tracking-wide uppercase block">
                        {qrPosterModal === "admin" ? (schoolKhmerName || "ADMIN LOGIN PORTAL") : "GUARDIAN PORTAL"}
                      </span>
                      <p className="text-[10px] font-mono text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-lg">
                        {qrPosterModal === "admin" ? `${window.location.origin}/?admin_login=true` : `${window.location.origin}/?parent_login=true`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. EXPLANATORY GUIDANCE TEXT (អក្សរបញ្ជាក់សេចក្តីណែនាំ) */}
                <div className="my-2 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h3 className="font-moul text-xs text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <span>សេចក្តីណែនាំអំពីរបៀបស្កេនប្រើប្រាស់ (INSTRUCTIONS)</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-700 font-sans">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">១</span>
                      <div>
                        <p className="font-bold text-slate-900">បើកកម្មវិធីកាមេរ៉ាទូរស័ព្ទ (Camera App):</p>
                        <p className="text-[11px] text-slate-600">បើកកម្មវិធីកាមេរ៉ា ឬកម្មវិធី QR Code Scanner លើទូរស័ព្ទដៃរបស់លោកអ្នក។</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">២</span>
                      <div>
                        <p className="font-bold text-slate-900">តម្រង់ស្កេនលើរូបភាព QR Code:</p>
                        <p className="text-[11px] text-slate-600">តម្រង់កាមេរ៉ាទូរស័ព្ទទៅលើរូបភាព QR Code ខាងលើនេះឱ្យបានច្បាស់។</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">៣</span>
                      <div>
                        <p className="font-bold text-slate-900">ចុចបើកតំណភ្ជាប់ (Tap Link):</p>
                        <p className="text-[11px] text-slate-600">ចុចលើសារដំណឹង ឬ Link ដែលបង្ហាញនៅលើអេក្រង់ទូរស័ព្ទ ដើម្បីចូលទៅកាន់ទំព័រ Login។</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">៤</span>
                      <div>
                        <p className="font-bold text-slate-900">បញ្ចូលព័ត៌មានផ្ទៀងផ្ទាត់៖</p>
                        <p className="text-[11px] text-slate-600">
                          {qrPosterModal === "admin" 
                            ? "បញ្ចូលឈ្មោះគណនី (Username) និងលេខសម្ងាត់ (Password) របស់បុគ្គលិកដើម្បីចូលគ្រប់គ្រងប្រព័ន្ធ។"
                            : "បញ្ចូលលេខអត្តសញ្ញាណសិស្ស (ID) ឬលេខទូរស័ព្ទអាណាព្យាបាល ដើម្បីចូលមើលវត្តមាន ព័ត៌មានសិក្សា និងលទ្ធផលប្រឡង។"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[10.5px] text-slate-600 italic leading-relaxed">
                    * កំណត់សម្គាល់៖ សន្លឹក QR Code នេះត្រូវបានបង្កើតឡើងជាផ្លូវការដោយ {schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} សម្រាប់សម្រួលដល់ការចូលប្រើប្រាស់របស់{qrPosterModal === 'admin' ? 'លោក/លោកស្រី ជាបុគ្គលិក និងថ្នាក់ដឹកនាំ' : 'អាណាព្យាបាលសិស្សគ្រប់រូប'}។
                  </div>
                </div>

                {/* 4. FOOTER & STAMP SECTION */}
                <div className="flex items-end justify-between pt-3 border-t border-slate-300 text-xs mt-1">
                  <div className="text-slate-600 text-[10px] space-y-1">
                    <p className="font-bold">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} ({schoolName})</p>
                    <p>អាសយដ្ឋាន៖ {schoolAddress}</p>
                    <p>ទូរស័ព្ទទំនាក់ទំនង៖ {schoolPhone}</p>
                  </div>
                  <div className="text-center min-w-[210px] relative">
                    <p className="text-[11px] font-bold text-slate-800">
                      ធ្វើនៅ {getProvinceFromAddress()}, {getKhmerDateText(new Date().toISOString())}
                    </p>
                    <p className="font-moul text-xs text-black mt-1">នាយកសាលា / Director</p>
                    
                    {/* Official Red Stamp Seal */}
                    <div className="h-16 my-1 relative flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border-4 border-double border-red-600 text-red-600 flex flex-col items-center justify-center -rotate-12 absolute -top-1 opacity-85 select-none pointer-events-none bg-red-50/10 shadow-sm">
                        <div className="w-20 h-20 rounded-full border border-red-600 flex flex-col items-center justify-center p-1 text-center">
                          <span className="font-moul text-[7.5px] leading-tight block">ត្រាពិនិត្យ និងយល់ព្រម</span>
                          <span className="text-xs font-bold my-0.5">★</span>
                          <span className="text-[7px] font-bold leading-tight block">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</span>
                        </div>
                      </div>
                    </div>

                    <p className="font-bold text-black underline text-xs relative z-10">{directorName || "ជី សុភា (CHY SOPHEA)"}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Screen Interactive Preview Modal Overlay */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-55 bg-slate-950/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start no-print"
            >
              {/* Modal Control Bar */}
              <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-2xl sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">
                      {idt("ទម្រង់សន្លឹក A4 QR Code បញ្ឈរ", "A4 Portrait QR Code Poster", "A4 竖版二维码海报")}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {qrPosterModal === "admin" ? idt("សម្រាប់បុគ្គលិក / Admin", "For Staff / Admin", "管理员端") : idt("សម្រាប់អាណាព្យាបាល / សិស្ស", "For Parents / Students", "家长端")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{idt("បោះពុម្ព A4", "Print A4 Poster", "打印 A4 海报")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        showToast(idt("កំពុងបង្កើតរូបភាព A4 Poster...", "Generating A4 Poster image...", "正在生成 A4 海报..."), "info");

                        const width = 1240;
                        const height = 1754;
                        const canvas = document.createElement("canvas");
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");

                        if (!ctx) return;

                        const isAdmin = qrPosterModal === "admin";

                        // Helper function for rounded rectangles
                        const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
                          ctx.beginPath();
                          ctx.moveTo(x + r, y);
                          ctx.lineTo(x + w - r, y);
                          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                          ctx.lineTo(x + w, y + h - r);
                          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                          ctx.lineTo(x + r, y + h);
                          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                          ctx.lineTo(x, y + r);
                          ctx.quadraticCurveTo(x, y, x + r, y);
                          ctx.closePath();
                        };

                        // 1. Background
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, width, height);

                        // Subtle outer background tint
                        ctx.fillStyle = "#fafafa";
                        ctx.fillRect(20, 20, width - 40, height - 40);

                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(35, 35, width - 70, height - 70);

                        // 2. Double Frame Border (Royal Gold/Amber)
                        ctx.strokeStyle = "#b45309";
                        ctx.lineWidth = 6;
                        ctx.strokeRect(35, 35, width - 70, height - 70);

                        ctx.strokeStyle = "#d97706";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(45, 45, width - 90, height - 90);

                        // Corner Khmer Ornaments
                        const drawCornerOrnament = (x: number, y: number, flipX: boolean, flipY: boolean) => {
                          ctx.save();
                          ctx.translate(x, y);
                          ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
                          ctx.fillStyle = "#b45309";
                          ctx.beginPath();
                          ctx.moveTo(0, 0);
                          ctx.lineTo(40, 0);
                          ctx.lineTo(40, 8);
                          ctx.lineTo(8, 8);
                          ctx.lineTo(8, 40);
                          ctx.lineTo(0, 40);
                          ctx.closePath();
                          ctx.fill();

                          ctx.fillStyle = "#d97706";
                          ctx.beginPath();
                          ctx.arc(16, 16, 4, 0, Math.PI * 2);
                          ctx.fill();
                          ctx.restore();
                        };

                        drawCornerOrnament(52, 52, false, false);
                        drawCornerOrnament(width - 52, 52, true, false);
                        drawCornerOrnament(52, height - 52, false, true);
                        drawCornerOrnament(width - 52, height - 52, true, true);

                        // 3. Top Kingdom Banner Text
                        ctx.textAlign = "center";
                        ctx.fillStyle = "#000000";
                        ctx.font = "bold 22px 'Moul', 'Kantumruy Pro', sans-serif";
                        ctx.fillText("ព្រះរាជាណាចក្រកម្ពុជា", width / 2, 95);

                        ctx.font = "bold 18px 'Moul', 'Kantumruy Pro', sans-serif";
                        ctx.fillText("ជាតិ សាសនា ព្រះមហាក្សត្រ", width / 2, 130);

                        // Kingdom line ornament
                        ctx.strokeStyle = "#b45309";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(width / 2 - 90, 148);
                        ctx.lineTo(width / 2 + 90, 148);
                        ctx.stroke();

                        ctx.fillStyle = "#b45309";
                        ctx.beginPath();
                        ctx.arc(width / 2, 148, 4, 0, Math.PI * 2);
                        ctx.fill();

                        // 4. School Header Bar
                        ctx.strokeStyle = "rgba(180, 83, 9, 0.35)";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(70, 170);
                        ctx.lineTo(width - 70, 170);
                        ctx.moveTo(70, 275);
                        ctx.lineTo(width - 70, 275);
                        ctx.stroke();

                        // Try drawing school logo if image exists
                        let logoLoaded = false;
                        if (schoolLogo) {
                          try {
                            const logoImg = new Image();
                            logoImg.crossOrigin = "anonymous";
                            await new Promise((resolve) => {
                              logoImg.onload = () => {
                                ctx.drawImage(logoImg, 80, 185, 75, 75);
                                logoLoaded = true;
                                resolve(true);
                              };
                              logoImg.onerror = () => resolve(false);
                              logoImg.src = schoolLogo;
                              setTimeout(() => resolve(false), 800);
                            });
                          } catch (e) {
                            console.log("Logo load timeout/error", e);
                          }
                        }

                        if (!logoLoaded) {
                          // Draw beautiful default logo badge
                          ctx.fillStyle = "#fef3c7";
                          ctx.strokeStyle = "#d97706";
                          ctx.lineWidth = 2;
                          roundRect(80, 185, 75, 75, 16);
                          ctx.fill();
                          ctx.stroke();

                          ctx.textAlign = "center";
                          ctx.font = "bold 32px 'Inter', sans-serif";
                          ctx.fillStyle = "#b45309";
                          ctx.fillText("🎓", 117, 232);
                        }

                        // School Name & Details
                        ctx.textAlign = "left";
                        ctx.font = "bold 20px 'Moul', 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#0f172a";
                        ctx.fillText(schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី", 172, 210);

                        ctx.font = "bold 14px 'Inter', sans-serif";
                        ctx.fillStyle = "#334155";
                        ctx.fillText(schoolName || "PLC COMPUTER SCHOOL", 172, 235);

                        ctx.font = "12px 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#64748b";
                        ctx.fillText(schoolAddress || "Phnom Penh, Cambodia", 172, 258);

                        // Right aligned phone & web
                        ctx.textAlign = "right";
                        ctx.font = "bold 15px 'Inter', sans-serif";
                        ctx.fillStyle = "#b45309";
                        ctx.fillText(schoolPhone || "", width - 80, 218);

                        const originClean = window.location.origin.replace(/^https?:\/\//, "");
                        ctx.font = "12px monospace";
                        ctx.fillStyle = "#64748b";
                        ctx.fillText(originClean, width - 80, 245);

                        // 5. Title Banner Box
                        ctx.fillStyle = isAdmin ? "#fef3c7" : "#ecfdf5";
                        ctx.strokeStyle = isAdmin ? "#f59e0b" : "#10b981";
                        ctx.lineWidth = 2.5;

                        roundRect(80, 305, width - 160, 95, 18);
                        ctx.fill();
                        ctx.stroke();

                        ctx.textAlign = "center";
                        ctx.fillStyle = isAdmin ? "#451a03" : "#064e3b";
                        ctx.font = "bold 22px 'Moul', 'Kantumruy Pro', sans-serif";
                        ctx.fillText(
                          isAdmin
                            ? "សន្លឹកស្កេន QR CODE ចូលប្រព័ន្ធ ADMIN / បុគ្គលិក"
                            : "សន្លឹកស្កេន QR CODE ចូលប្រព័ន្ធ អាណាព្យាបាល / សិស្ស",
                          width / 2,
                          348
                        );

                        ctx.font = "bold 13px 'Inter', sans-serif";
                        ctx.fillStyle = isAdmin ? "#b45309" : "#047857";
                        ctx.fillText(
                          isAdmin
                            ? "ADMINISTRATOR & STAFF SYSTEM LOGIN PORTAL"
                            : "GUARDIAN & STUDENT PORTAL ACCESS CODE",
                          width / 2,
                          378
                        );

                        // 6. Draw QR Code Frame & Image
                        roundRect(width / 2 - 210, 435, 420, 455, 24);
                        ctx.fillStyle = "#ffffff";
                        ctx.fill();
                        ctx.strokeStyle = isAdmin ? "#fcd34d" : "#6ee7b7";
                        ctx.lineWidth = 3;
                        ctx.stroke();

                        // Inner QR box
                        const qrCanvasId = isAdmin ? "admin-login-qrcode" : "guardian-login-qrcode";
                        const qrCanvas = document.getElementById(qrCanvasId) as HTMLCanvasElement;
                        if (qrCanvas) {
                          ctx.drawImage(qrCanvas, width / 2 - 160, 465, 320, 320);
                        }

                        ctx.textAlign = "center";
                        ctx.font = "bold 15px 'Inter', sans-serif";
                        ctx.fillStyle = "#0f172a";
                        ctx.fillText(isAdmin ? (schoolKhmerName || "ADMIN PORTAL") : "GUARDIAN PORTAL", width / 2, 818);

                        // Pill badge for URL
                        roundRect(width / 2 - 220, 832, 440, 32, 16);
                        ctx.fillStyle = "#f1f5f9";
                        ctx.fill();

                        ctx.font = "bold 11px monospace";
                        ctx.fillStyle = "#334155";
                        const displayUrl = isAdmin ? `${window.location.origin}/?admin_login=true` : `${window.location.origin}/?parent_login=true`;
                        const shortUrl = displayUrl.length > 55 ? displayUrl.slice(0, 52) + "..." : displayUrl;
                        ctx.fillText(shortUrl, width / 2, 852);

                        // 7. Instructions Card Box
                        roundRect(80, 925, width - 160, 430, 18);
                        ctx.fillStyle = "#f8fafc";
                        ctx.fill();
                        ctx.strokeStyle = "#e2e8f0";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();

                        ctx.textAlign = "left";
                        ctx.font = "bold 17px 'Moul', 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#0f172a";
                        ctx.fillText("សេចក្តីណែនាំអំពីរបៀបស្កេនប្រើប្រាស់ (INSTRUCTIONS)", 110, 968);

                        ctx.strokeStyle = "#cbd5e1";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(110, 982);
                        ctx.lineTo(width - 110, 982);
                        ctx.stroke();

                        // Steps
                        const steps = [
                          { num: "១", title: "បើកកម្មវិធីកាមេរ៉ាទូរស័ព្ទ (Camera App):", desc: "បើកកម្មវិធីកាមេរ៉ា ឬ QR Code Scanner លើទូរស័ព្ទដៃរបស់លោកអ្នក។" },
                          { num: "២", title: "តម្រង់ស្កេនលើរូបភាព QR Code:", desc: "តម្រង់កាមេរ៉ាទូរស័ព្ទទៅលើរូបភាព QR Code ខាងលើនេះឱ្យបានច្បាស់។" },
                          { num: "៣", title: "ចុចបើកតំណភ្ជាប់ (Tap Link):", desc: "ចុចលើសារដំណឹង ឬ Link ដែលបង្ហាញនៅលើអេក្រង់ទូរស័ព្ទ ដើម្បីចូល Login។" },
                          { num: "៤", title: "បញ្ចូលព័ត៌មានផ្ទៀងផ្ទាត់៖", desc: isAdmin ? "បញ្ចូល Username និង លេខសម្ងាត់របស់បុគ្គលិកដើម្បីចូលគ្រប់គ្រងប្រព័ន្ធ។" : "បញ្ចូល ID សិស្ស ឬលេខទូរស័ព្ទអាណាព្យាបាល ដើម្បីចូលមើលវត្តមាន និងលទ្ធផលសិក្សា។" }
                        ];

                        let startY = 1012;
                        steps.forEach((step) => {
                          ctx.beginPath();
                          ctx.arc(125, startY + 12, 14, 0, Math.PI * 2);
                          ctx.fillStyle = isAdmin ? "#fef3c7" : "#d1fae5";
                          ctx.fill();
                          ctx.strokeStyle = isAdmin ? "#fde68a" : "#a7f3d0";
                          ctx.stroke();

                          ctx.textAlign = "center";
                          ctx.font = "bold 14px 'Kantumruy Pro', sans-serif";
                          ctx.fillStyle = isAdmin ? "#78350f" : "#065f46";
                          ctx.fillText(step.num, 125, startY + 17);

                          ctx.textAlign = "left";
                          ctx.font = "bold 15px 'Kantumruy Pro', sans-serif";
                          ctx.fillStyle = "#0f172a";
                          ctx.fillText(step.title, 150, startY + 10);

                          ctx.font = "13px 'Kantumruy Pro', sans-serif";
                          ctx.fillStyle = "#475569";
                          ctx.fillText(step.desc, 150, startY + 30);

                          startY += 60;
                        });

                        ctx.strokeStyle = "#e2e8f0";
                        ctx.beginPath();
                        ctx.moveTo(110, startY + 5);
                        ctx.lineTo(width - 110, startY + 5);
                        ctx.stroke();

                        ctx.font = "italic 11.5px 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#64748b";
                        ctx.fillText(
                          `* កំណត់សម្គាល់៖ សន្លឹក QR Code នេះត្រូវបានបង្កើតឡើងជាផ្លូវការដោយ ${schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} សម្រាប់សម្រួលដល់ការចូលប្រើប្រាស់។`,
                          110,
                          startY + 26
                        );

                        // 8. Footer & Signatures & Official Red Stamp Seal
                        const footerY = 1420;
                        ctx.strokeStyle = "#cbd5e1";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(70, footerY);
                        ctx.lineTo(width - 70, footerY);
                        ctx.stroke();

                        ctx.textAlign = "left";
                        ctx.font = "bold 13px 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#1e293b";
                        ctx.fillText(`${schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} (${schoolName || "PLC COMPUTER SCHOOL"})`, 80, footerY + 35);

                        ctx.font = "12px 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#64748b";
                        ctx.fillText(`អាសយដ្ឋាន៖ ${schoolAddress}`, 80, footerY + 60);
                        ctx.fillText(`ទូរស័ព្ទទំនាក់ទំនង៖ ${schoolPhone}`, 80, footerY + 85);

                        ctx.textAlign = "center";
                        ctx.font = "bold 13px 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#1e293b";
                        ctx.fillText(`ធ្វើនៅ ${getProvinceFromAddress()}, ${getKhmerDateText(new Date().toISOString())}`, width - 210, footerY + 35);

                        ctx.font = "bold 14px 'Moul', 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#000000";
                        ctx.fillText("នាយកសាលា / Director", width - 210, footerY + 65);

                        // DRAW OFFICIAL RED STAMP SEAL
                        const stampX = width - 260;
                        const stampY = footerY + 120;
                        ctx.save();
                        ctx.globalAlpha = 0.85;
                        ctx.translate(stampX, stampY);
                        ctx.rotate(-0.12); // Slightly tilted official stamp effect

                        // Double Red Rings
                        ctx.strokeStyle = "#dc2626";
                        ctx.lineWidth = 3.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, 52, 0, Math.PI * 2);
                        ctx.stroke();

                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, 46, 0, Math.PI * 2);
                        ctx.stroke();

                        // Center Star
                        ctx.fillStyle = "#dc2626";
                        ctx.font = "bold 20px sans-serif";
                        ctx.textAlign = "center";
                        ctx.fillText("★", 0, 6);

                        // Circular Text on Stamp
                        ctx.font = "bold 9px 'Moul', sans-serif";
                        ctx.fillText("ត្រាពិនិត្យ និងយល់ព្រម", 0, -22);

                        ctx.font = "bold 8px 'Kantumruy Pro', sans-serif";
                        ctx.fillText(schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី", 0, 28);

                        ctx.restore();

                        // Director Name Underline
                        ctx.textAlign = "center";
                        ctx.font = "bold underline 14px 'Kantumruy Pro', sans-serif";
                        ctx.fillStyle = "#0f172a";
                        ctx.fillText(directorName || "ជី សុភា (CHY SOPHEA)", width - 210, footerY + 185);

                        // Trigger download
                        const imgUrl = canvas.toDataURL("image/png");
                        const a = document.createElement("a");
                        a.href = imgUrl;
                        a.download = `A4_Poster_QR_${isAdmin ? "Admin" : "Guardian"}_${schoolName || "School"}.png`;
                        a.click();

                        showToast(idt("បានទាញយករូបភាព A4 Poster QR Code រួចរាល់!", "Downloaded A4 Poster QR Code Image!", "已下载 A4 海报二维码！"), "success");
                      } catch (err) {
                        console.error("Poster generation error:", err);
                        showToast(idt("មានបញ្ហាក្នុងការបង្កើតរូបភាព!", "Error generating poster image!", "生成海报图片出错！"), "error");
                      }
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{idt("ទាញយករូបភាព A4 (PNG)", "Download A4 Poster (PNG)", "下载 A4 海报 (PNG)")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrPosterModal(null)}
                    className="w-9 h-9 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* A4 Sheet Preview Card on Screen */}
              <div 
                id="a4-poster-screen-element"
                className="w-full max-w-3xl bg-white text-black rounded-2xl shadow-2xl p-6 sm:p-10 border-4 border-double border-amber-600/90 relative overflow-hidden my-auto"
              >
                {/* Corner Kbach / Filigree Ornaments */}
                <div className="absolute top-2 left-2 w-8 h-8 text-amber-600 pointer-events-none">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                    <path d="M2,2 L18,2 C10,2 2,10 2,18 Z M2,2 L2,20 L6,20 L6,6 L20,6 L20,2 Z" />
                  </svg>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 text-amber-600 pointer-events-none rotate-90">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                    <path d="M2,2 L18,2 C10,2 2,10 2,18 Z M2,2 L2,20 L6,20 L6,6 L20,6 L20,2 Z" />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-2 w-8 h-8 text-amber-600 pointer-events-none -rotate-90">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                    <path d="M2,2 L18,2 C10,2 2,10 2,18 Z M2,2 L2,20 L6,20 L6,6 L20,6 L20,2 Z" />
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 text-amber-600 pointer-events-none rotate-180">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                    <path d="M2,2 L18,2 C10,2 2,10 2,18 Z M2,2 L2,20 L6,20 L6,6 L20,6 L20,2 Z" />
                  </svg>
                </div>

                {/* Top Kingdom Banner */}
                <div className="text-center pb-2">
                  <h2 className="font-moul text-sm text-black leading-snug">ព្រះរាជាណាចក្រកម្ពុជា</h2>
                  <h3 className="font-moul text-xs text-black mt-0.5 leading-snug">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                  <div className="flex justify-center my-1.5 select-none">
                    <svg className="w-28 h-2 text-amber-600" viewBox="0 0 100 10" fill="currentColor">
                      <path d="M0,5 L40,5 L45,2 L50,8 L55,2 L60,5 L100,5" stroke="currentColor" strokeWidth="0.8" fill="none" />
                      <circle cx="50" cy="5" r="1.8" className="fill-amber-600" />
                    </svg>
                  </div>
                </div>

                {/* School Info Header */}
                <div className="flex flex-wrap items-center justify-between border-y-2 border-amber-600/40 py-3 my-3 px-2 gap-3">
                  <div className="flex items-center gap-3">
                    {schoolLogo ? (
                      <img src={schoolLogo} alt="Logo" className="w-14 h-14 object-contain" />
                    ) : (
                      <div className="w-14 h-14 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <h1 className="font-moul text-xs text-black leading-normal">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</h1>
                      <h2 className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">{schoolName || "PLC COMPUTER SCHOOL"}</h2>
                      <p className="text-[9px] text-slate-600 font-medium">{schoolAddress}</p>
                    </div>
                  </div>
                  <div className="text-right text-[9px] font-bold text-slate-700">
                    <p className="text-amber-800 font-extrabold">{schoolPhone}</p>
                    <p className="text-slate-500 font-mono text-[8px]">{window.location.origin}</p>
                  </div>
                </div>

                {/* Title Banner */}
                <div className="text-center my-4 py-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                  {qrPosterModal === "admin" ? (
                    <>
                      <h2 className="font-moul text-sm sm:text-base text-amber-950 leading-relaxed">
                        សន្លឹកស្កេន QR CODE ចូលប្រព័ន្ធ ADMIN / បុគ្គលិក
                      </h2>
                      <p className="text-[11px] font-black text-amber-800 tracking-wider uppercase mt-0.5">
                        ADMINISTRATOR & STAFF SYSTEM LOGIN PORTAL
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="font-moul text-sm sm:text-base text-emerald-950 leading-relaxed">
                        សន្លឹកស្កេន QR CODE ចូលប្រព័ន្ធ អាណាព្យាបាល / សិស្ស
                      </h2>
                      <p className="text-[11px] font-black text-emerald-800 tracking-wider uppercase mt-0.5">
                        GUARDIAN & STUDENT PORTAL ACCESS CODE
                      </p>
                    </>
                  )}
                </div>

                {/* QR Code Frame */}
                <div className="flex flex-col items-center justify-center py-4 my-2">
                  <div className="p-6 bg-white border-2 border-slate-300 rounded-2xl shadow-sm flex flex-col items-center gap-3">
                    <QRCodeCanvas
                      value={qrPosterModal === "admin" ? `${window.location.origin}/?admin_login=true` : `${window.location.origin}/?parent_login=true`}
                      size={220}
                      level="H"
                      includeMargin={true}
                    />
                    <div className="text-center space-y-1 max-w-[280px] sm:max-w-md">
                      <span className="text-xs font-black text-slate-800 tracking-wide uppercase block">
                        {qrPosterModal === "admin" ? (schoolKhmerName || "ADMIN LOGIN PORTAL") : "GUARDIAN PORTAL"}
                      </span>
                      <p className="text-[10px] font-mono text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-lg break-all">
                        {qrPosterModal === "admin" ? `${window.location.origin}/?admin_login=true` : `${window.location.origin}/?parent_login=true`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions Box */}
                <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h3 className="font-moul text-xs text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>សេចក្តីណែនាំអំពីរបៀបស្កេនប្រើប្រាស់ (INSTRUCTIONS)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-sans">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">១</span>
                      <div>
                        <p className="font-bold text-slate-900">បើកកម្មវិធីកាមេរ៉ាទូរស័ព្ទ (Camera):</p>
                        <p className="text-[11px] text-slate-600">បើកកម្មវិធីកាមេរ៉ា ឬ QR Code Scanner លើទូរស័ព្ទដៃរបស់លោកអ្នក។</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">២</span>
                      <div>
                        <p className="font-bold text-slate-900">តម្រង់ស្កេនលើរូបភាព QR Code:</p>
                        <p className="text-[11px] text-slate-600">តម្រង់កាមេរ៉ាទូរស័ព្ទទៅលើរូបភាព QR Code ខាងលើនេះឱ្យបានច្បាស់។</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">៣</span>
                      <div>
                        <p className="font-bold text-slate-900">ចុចបើកតំណភ្ជាប់ (Tap Link):</p>
                        <p className="text-[11px] text-slate-600">ចុចលើសារដំណឹង ឬ Link ដែលបង្ហាញនៅលើអេក្រង់ទូរស័ព្ទ ដើម្បីចូល Login។</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">៤</span>
                      <div>
                        <p className="font-bold text-slate-900">បញ្ចូលព័ត៌មានផ្ទៀងផ្ទាត់៖</p>
                        <p className="text-[11px] text-slate-600">
                          {qrPosterModal === "admin" 
                            ? "បញ្ចូល Username និង លេខសម្ងាត់របស់បុគ្គលិកដើម្បីចូលគ្រប់គ្រងប្រព័ន្ធ។"
                            : "បញ្ចូល ID សិស្ស ឬលេខទូរស័ព្ទអាណាព្យាបាល ដើម្បីចូលមើលវត្តមាន និងលទ្ធផលសិក្សា។"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[10.5px] text-slate-600 italic leading-relaxed">
                    * កំណត់សម្គាល់៖ សន្លឹក QR Code នេះត្រូវបានបង្កើតឡើងជាផ្លូវការដោយ {schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} សម្រាប់សម្រួលដល់ការចូលប្រើប្រាស់របស់{qrPosterModal === 'admin' ? 'លោក/លោកស្រី ជាបុគ្គលិក និងថ្នាក់ដឹកនាំ' : 'អាណាព្យាបាលសិស្សគ្រប់រូប'}។
                  </div>
                </div>

                {/* Footer and Signatures */}
                <div className="flex flex-wrap items-end justify-between pt-4 border-t border-slate-300 text-xs mt-2 gap-4">
                  <div className="text-slate-600 text-[10px] space-y-1">
                    <p className="font-bold">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} ({schoolName})</p>
                    <p>អាសយដ្ឋាន៖ {schoolAddress}</p>
                    <p>ទូរស័ព្ទទំនាក់ទំនង៖ {schoolPhone}</p>
                  </div>
                  <div className="text-center min-w-[210px] relative">
                    <p className="text-[11px] font-bold text-slate-800">
                      ធ្វើនៅ {getProvinceFromAddress()}, {getKhmerDateText(new Date().toISOString())}
                    </p>
                    <p className="font-moul text-xs text-black mt-1">នាយកសាលា / Director</p>

                    {/* Official Red Stamp Seal */}
                    <div className="h-16 my-1 relative flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border-4 border-double border-red-600 text-red-600 flex flex-col items-center justify-center -rotate-12 absolute -top-1 opacity-85 select-none pointer-events-none bg-red-50/10 shadow-sm">
                        <div className="w-20 h-20 rounded-full border border-red-600 flex flex-col items-center justify-center p-1 text-center">
                          <span className="font-moul text-[7.5px] leading-tight block">ត្រាពិនិត្យ និងយល់ព្រម</span>
                          <span className="text-xs font-bold my-0.5">★</span>
                          <span className="text-[7px] font-bold leading-tight block">{schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</span>
                        </div>
                      </div>
                    </div>

                    <p className="font-bold text-black underline text-xs relative z-10">{directorName || "ជី សុភា (CHY SOPHEA)"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}


                  
                </div>
              </motion.div>
            )}
</>
  );
}

