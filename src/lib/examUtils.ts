import { Exam } from "../types";

export interface SubjectOption {
  id: string;
  nameKh: string;
  nameEn: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconName: string;
}

export const INITIAL_STANDARD_SUBJECTS: SubjectOption[] = [
  { id: "ចំណេះដឹងទូទៅ", nameKh: "ចំណេះដឹងទូទៅ", nameEn: "General Knowledge", badgeBg: "bg-blue-100/70", badgeText: "text-blue-700", badgeBorder: "border-transparent", iconName: "BookOpen" },
  { id: "គណិតវិទ្យា", nameKh: "គណិតវិទ្យា", nameEn: "Mathematics", badgeBg: "bg-blue-100/70", badgeText: "text-blue-700", badgeBorder: "border-transparent", iconName: "Calculator" },
  { id: "ភាសាខ្មែរ", nameKh: "ភាសាខ្មែរ", nameEn: "Khmer Literature", badgeBg: "bg-amber-100/70", badgeText: "text-amber-800", badgeBorder: "border-transparent", iconName: "FileText" },
  { id: "រូបវិទ្យា", nameKh: "រូបវិទ្យា", nameEn: "Physics", badgeBg: "bg-blue-100/70", badgeText: "text-blue-700", badgeBorder: "border-transparent", iconName: "Sparkles" },
  { id: "គីមីវិទ្យា", nameKh: "គីមីវិទ្យា", nameEn: "Chemistry", badgeBg: "bg-emerald-100/70", badgeText: "text-emerald-700", badgeBorder: "border-transparent", iconName: "Award" },
  { id: "ជីវវិទ្យា", nameKh: "ជីវវិទ្យា", nameEn: "Biology", badgeBg: "bg-green-100/70", badgeText: "text-green-700", badgeBorder: "border-transparent", iconName: "CheckCircle2" },
  { id: "ប្រវត្តិវិទ្យា", nameKh: "ប្រវត្តិវិទ្យា", nameEn: "History", badgeBg: "bg-orange-100/70", badgeText: "text-orange-700", badgeBorder: "border-transparent", iconName: "Clock" },
  { id: "ភូមិវិទ្យា", nameKh: "ភូមិវិទ្យា", nameEn: "Geography", badgeBg: "bg-cyan-100/70", badgeText: "text-cyan-700", badgeBorder: "border-transparent", iconName: "ExternalLink" },
  { id: "ភាសាអង់គ្លេស", nameKh: "ភាសាអង់គ្លេស", nameEn: "English Language", badgeBg: "bg-rose-100/70", badgeText: "text-rose-700", badgeBorder: "border-transparent", iconName: "HelpCircle" },
  { id: "ព័ត៌មានវិទ្យា / IT", nameKh: "ព័ត៌មានវិទ្យា / IT", nameEn: "Computer Science & IT", badgeBg: "bg-sky-100/70", badgeText: "text-sky-700", badgeBorder: "border-transparent", iconName: "Settings" },
  { id: "គណនេយ្យ និងពាណិជ្ជកម្ម", nameKh: "គណនេយ្យ និងពាណិជ្ជកម្ម", nameEn: "Accounting & Business", badgeBg: "bg-teal-100/70", badgeText: "text-teal-700", badgeBorder: "border-transparent", iconName: "FileSpreadsheet" },
  { id: "ភាសាចិន", nameKh: "ភាសាចិន", nameEn: "Chinese Language", badgeBg: "bg-red-100/70", badgeText: "text-red-700", badgeBorder: "border-transparent", iconName: "List" },
  { id: "សេដ្ឋកិច្ចវិទ្យា", nameKh: "សេដ្ឋកិច្ចវិទ្យា", nameEn: "Economics", badgeBg: "bg-blue-100/70", badgeText: "text-blue-700", badgeBorder: "border-transparent", iconName: "Award" },
  { id: "ច្បាប់ និងរដ្ឋបាល", nameKh: "ច្បាប់ និងរដ្ឋបាល", nameEn: "Law & Administration", badgeBg: "bg-slate-200/70", badgeText: "text-slate-800", badgeBorder: "border-transparent", iconName: "CheckSquare" },
  { id: "សុខាភិបាល / វេជ្ជសាស្ត្រ", nameKh: "សុខាភិបាល / វេជ្ជសាស្ត្រ", nameEn: "Medicine & Health", badgeBg: "bg-pink-100/70", badgeText: "text-pink-700", badgeBorder: "border-transparent", iconName: "Users" },
  { id: "វិស្វកម្ម", nameKh: "វិស្វកម្ម", nameEn: "Engineering", badgeBg: "bg-yellow-100/70", badgeText: "text-yellow-800", badgeBorder: "border-transparent", iconName: "RefreshCw" }
];

export const STANDARD_SUBJECTS = INITIAL_STANDARD_SUBJECTS;

export interface GradeLevelOption {
  id: string;
  nameKh: string;
  nameEn: string;
}

export const INITIAL_GRADE_LEVELS: GradeLevelOption[] = [
  { id: "ទូទៅ / General", nameKh: "ទូទៅ (គ្រប់កម្រិត)", nameEn: "General / All Levels" },
  { id: "បឋមសិក្សា (Grade 1-6)", nameKh: "បឋមសិក្សា (ថ្នាក់ទី១-៦)", nameEn: "Primary School (Grade 1-6)" },
  { id: "អនុវិទ្យាល័យ (Grade 7-9)", nameKh: "អនុវិទ្យាល័យ (ថ្នាក់ទី៧-៩)", nameEn: "Secondary School (Grade 7-9)" },
  { id: "វិទ្យាល័យ (Grade 10-12)", nameKh: "វិទ្យាល័យ (ថ្នាក់ទី១០-១២)", nameEn: "High School (Grade 10-12)" },
  { id: "ឧត្តមសិក្សា / សាកលវិទ្យាល័យ", nameKh: "ឧត្តមសិក្សា / សាកលវិទ្យាល័យ", nameEn: "University / Higher Education" },
  { id: "វគ្គបណ្តុះបណ្តាលវិជ្ជាជីវៈ", nameKh: "វគ្គបណ្តុះបណ្តាលវិជ្ជាជីវៈ", nameEn: "Vocational / Skill Training" }
];

export const GRADE_LEVELS = INITIAL_GRADE_LEVELS;

export const getAllSubjects = (): SubjectOption[] => {
  try {
    const saved = localStorage.getItem("plc_all_subjects_list");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse subjects list", e);
  }
  return INITIAL_STANDARD_SUBJECTS;
};

export const saveAllSubjects = (subjects: SubjectOption[]) => {
  try {
    localStorage.setItem("plc_all_subjects_list", JSON.stringify(subjects));
  } catch (e) {
    console.error("Failed to save subjects list", e);
  }
};

export const getAllGradeLevels = (): GradeLevelOption[] => {
  try {
    const saved = localStorage.getItem("plc_all_grade_levels_list");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse grade levels list", e);
  }
  return INITIAL_GRADE_LEVELS;
};

export const saveAllGradeLevels = (gradeLevels: GradeLevelOption[]) => {
  try {
    localStorage.setItem("plc_all_grade_levels_list", JSON.stringify(gradeLevels));
  } catch (e) {
    console.error("Failed to save grade levels list", e);
  }
};

export const getCustomSubjects = getAllSubjects;
export const saveCustomSubjects = saveAllSubjects;
export const getCustomGradeLevels = getAllGradeLevels;
export const saveCustomGradeLevels = saveAllGradeLevels;

export const parseExamMeta = (exam: Partial<Exam> & { subject?: string; gradeLevel?: string; description?: string }) => {
  let sub = exam.subject || "ចំណេះដឹងទូទៅ";
  let grade = exam.gradeLevel || "ទូទៅ / General";
  let cleanDesc = exam.description || "";

  if (cleanDesc.includes("[SUB:")) {
    const matchSub = cleanDesc.match(/\[SUB:(.*?)\]/);
    if (matchSub && matchSub[1]) sub = matchSub[1];
  }
  if (cleanDesc.includes("[GRADE:")) {
    const matchGrade = cleanDesc.match(/\[GRADE:(.*?)\]/);
    if (matchGrade && matchGrade[1]) grade = matchGrade[1];
  }
  cleanDesc = cleanDesc.replace(/\[SUB:.*?\]/g, "").replace(/\[GRADE:.*?\]/g, "").trim();

  return { subject: sub, gradeLevel: grade, description: cleanDesc };
};

export const encodeExamMeta = (sub: string, grade: string, userDesc: string) => {
  const cleanDesc = (userDesc || "").replace(/\[SUB:.*?\]/g, "").replace(/\[GRADE:.*?\]/g, "").trim();
  return `[SUB:${sub}][GRADE:${grade}] ${cleanDesc}`.trim();
};

export const getSubjectStyle = (subName: string): SubjectOption => {
  const all = getAllSubjects();
  const found = all.find(s => s.id === subName || s.nameKh === subName || s.nameEn === subName);
  if (found) return found;
  return {
    id: subName || "ចំណេះដឹងទូទៅ",
    nameKh: subName || "ចំណេះដឹងទូទៅ",
    nameEn: subName || "General Knowledge",
    badgeBg: "bg-blue-100/70",
    badgeText: "text-blue-700",
    badgeBorder: "border-transparent",
    iconName: "BookOpen"
  };
};
