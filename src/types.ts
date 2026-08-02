export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface Student {
  id: string;
  studentId: string;
  nameKh: string;
  nameEn: string;
  firstNameKh?: string;
  lastNameKh?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  course: string;
  level: string;
  status: 'STUDYING' | 'COMPLETED' | 'STOP';
  startDate: string;
  endDate: string;
  shift: string;
  fee: number;
  paid: number;
  due: number;
  fullFee?: number;
  discount?: number;
  guardianName: string;
  guardianPhone: string;
  phoneNumber?: string;
  dob?: string;
  pob?: string;
  photoUrl?: string;
  grade?: string;
  telegramConnected: boolean;
  gender: 'Female' | 'Male';
  hours?: string;
  documents?: any[];
}

export interface Question {
  id: string;
  examId: string;
  text: string;
  options: string;
  answer: string;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  gradeLevel?: string;
  duration: number;
  status: string;
  createdAt: string;
  questions?: Question[];
  targetMaxScore?: number;
  totalPoints?: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  score: number;
  totalPoints: number;
  answers: string;
  submittedAt: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  paidAt: string;
}

