// High Fidelity Client-Side API Interceptor and Mock Engine
// This handles situations where the backend Node.js server is offline or unavailable (e.g. static hosting like Vercel).
// It intercepts all window.fetch calls to /api/ and falls back to a robust localStorage database.

if (typeof window !== "undefined") {
  const originalFetch = window.fetch;

  // Initialize localStorage Seed Data if missing
  const seedLocalStorage = () => {
    if (!localStorage.getItem("plc_local_settings")) {
      const defaultSettings = {
        schoolName: "PLC COMPUTER ACADEMY",
        schoolKhmerName: "សាលាកុំព្យូទ័រ ភីអិលស៊ី",
        directorName: "ជី សុភា (CHY SOPHEA)",
        baseFee: 120,
        schoolLogo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200",
        khqrImage: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
        schoolPhone: "087 850 014 / 097 501 3648",
        schoolAddress: "ភ្នំពេញ, ប្រទេសកម្ពុជា",
        schoolTelegram: "https://t.me/plccomputerschool",
        developerName: "CHY SOPHEA",
        developerKhmerName: "ជី សុភា",
        developerPhone: "087 850 014",
        developerTelegram: "@chysophea",
        appTheme: "default",
        currencySymbol: "$",
        courseOptions: [
          "Microsoft Office Excel",
          "Microsoft Office Word",
          "Adobe Photoshop Full Course",
          "Web Development Coding Suite",
          "Python Core Programing",
          "Graphic Design Essentials"
        ],
        levelOptions: [
          "កម្រិត ១",
          "កម្រិត ២",
          "Level 1",
          "Level 2",
          "Advanced Master Class"
        ],
        shiftOptions: [
          "វេនព្រឹក",
          "វេនរសៀល",
          "វេនយប់"
        ],
        hoursOptions: [
          "08:00 - 09:30 AM",
          "09:30 - 11:00 AM",
          "02:00 - 03:30 PM",
          "03:30 - 05:00 PM",
          "05:30 - 06:30 PM",
          "06:30 - 07:30 PM"
        ]
      };
      localStorage.setItem("plc_local_settings", JSON.stringify(defaultSettings));
    }

    // If existing local storage has the old list of students or is empty, seed 15 model students
    const existingStudentsRaw = localStorage.getItem("plc_local_students");
    let needsStudentReset = !existingStudentsRaw;
    if (existingStudentsRaw) {
      try {
        const parsed = JSON.parse(existingStudentsRaw);
        if (!Array.isArray(parsed) || parsed.length === 0 || parsed.some(s => s.nameEn === "LI SEANGHAI")) {
          needsStudentReset = true;
        }
      } catch (e) {
        needsStudentReset = true;
      }
    }

    if (needsStudentReset) {
      const defaultStudents = [
        { id: "1", studentId: "PLC-001", nameKh: "សុខ សុភក្ត្រា", nameEn: "SOK SOPHEAKTRA", firstNameKh: "សុភក្ត្រា", lastNameKh: "សុខ", firstNameEn: "SOPHEAKTRA", lastNameEn: "SOK", gender: "Male", course: "Web Development (HTML/CSS)", level: "Level 3", status: "STUDYING", shift: "វេនយប់", fee: 120, paid: 120, due: 0, guardianName: "សុខ ម៉ៅ", guardianPhone: "012345678", phoneNumber: "0961234567", dob: "2005-04-12", pob: "ភ្នំពេញ", startDate: "2026-05-01", endDate: "2026-11-01", telegramConnected: true },
        { id: "2", studentId: "PLC-002", nameKh: "ចាន់ ធីតា", nameEn: "CHAN THIDA", firstNameKh: "ធីតា", lastNameKh: "ចាន់", firstNameEn: "THIDA", lastNameEn: "CHAN", gender: "Female", course: "Adobe Photoshop", level: "Level 1", status: "STUDYING", shift: "វេនរសៀល", fee: 100, paid: 100, due: 0, guardianName: "ចាន់ សំរឹទ្ធ", guardianPhone: "012876543", phoneNumber: "0881234567", dob: "2006-08-21", pob: "កណ្តាល", startDate: "2026-05-01", endDate: "2026-11-01", telegramConnected: true },
        { id: "3", studentId: "PLC-003", nameKh: "កែវ វិចិត្រ", nameEn: "KEO VICHET", firstNameKh: "វិចិត្រ", lastNameKh: "កែវ", firstNameEn: "VICHET", lastNameEn: "KEO", gender: "Male", course: "Microsoft Word & Excel", level: "Level 2", status: "STUDYING", shift: "វេនព្រឹក", fee: 80, paid: 80, due: 0, guardianName: "កែវ ជា", guardianPhone: "097123456", phoneNumber: "097321654", dob: "2004-11-30", pob: "តាកែវ", startDate: "2026-05-01", endDate: "2026-11-01", telegramConnected: false },
        { id: "4", studentId: "PLC-004", nameKh: "លី សុវណ្ណី", nameEn: "LY SOVANNY", firstNameKh: "សុវណ្ណី", lastNameKh: "លី", firstNameEn: "SOVANNY", lastNameEn: "LY", gender: "Female", course: "Digital Marketing", level: "Level 1", status: "STUDYING", shift: "វេនយប់", fee: 150, paid: 150, due: 0, guardianName: "លី ហួរ", guardianPhone: "015234567", phoneNumber: "015987654", dob: "2005-01-15", pob: "ភ្នំពេញ", startDate: "2026-05-01", endDate: "2026-11-01", telegramConnected: true },
        { id: "5", studentId: "PLC-005", nameKh: "នូ សេងហ័រ", nameEn: "NOU SENGHOR", firstNameKh: "សេងហ័រ", lastNameKh: "នូ", firstNameEn: "SENGHOR", lastNameEn: "NOU", gender: "Male", course: "PC Hardware & Repair", level: "Level 2", status: "STUDYING", shift: "វេនរសៀល", fee: 110, paid: 110, due: 0, guardianName: "នូ វ៉ាន់", guardianPhone: "011345678", phoneNumber: "011765432", dob: "2003-09-05", pob: "កំពង់ចាម", startDate: "2026-05-01", endDate: "2026-11-01", telegramConnected: false }
      ];
      localStorage.setItem("plc_local_students", JSON.stringify(defaultStudents));
    }

    // If existing local storage has the old list of teachers, clear them if they are mock
    const existingTeachersRaw = localStorage.getItem("plc_local_teachers");
    let needsTeacherReset = !existingTeachersRaw;
    if (existingTeachersRaw) {
      try {
        const parsed = JSON.parse(existingTeachersRaw);
        if (Array.isArray(parsed) && parsed.some(t => t.nameEn === "SORN SAVY")) {
          needsTeacherReset = true;
        }
      } catch (e) {
        needsTeacherReset = true;
      }
    }

    if (needsTeacherReset) {
      localStorage.setItem("plc_local_teachers", JSON.stringify([]));
    }

    // Reset school assets if they contain old mock data
    const existingAssetsRaw = localStorage.getItem("plc_school_assets");
    let needsAssetsReset = !existingAssetsRaw;
    if (existingAssetsRaw) {
      try {
        const parsed = JSON.parse(existingAssetsRaw);
        if (Array.isArray(parsed) && parsed.some(a => a.personInCharge === "SORN SAVY" || a.id === "AST-001")) {
          needsAssetsReset = true;
        }
      } catch (e) {
        needsAssetsReset = true;
      }
    }
    if (needsAssetsReset) {
      localStorage.setItem("plc_school_assets", JSON.stringify([]));
    }

    if (!localStorage.getItem("plc_local_transactions")) {
      localStorage.setItem("plc_local_transactions", JSON.stringify([]));
    }
    if (!localStorage.getItem("plc_local_salaries")) {
      localStorage.setItem("plc_local_salaries", JSON.stringify([]));
    }
    if (!localStorage.getItem("plc_local_attendance")) {
      localStorage.setItem("plc_local_attendance", JSON.stringify([]));
    }
    if (!localStorage.getItem("plc_local_exams")) {
      localStorage.setItem("plc_local_exams", JSON.stringify([]));
    }
  };

  // Seed data immediately
  seedLocalStorage();

  // Helper to construct a simulated Response object
  const createMockResponse = (data: any, status: number = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  };

  // The Mock Fallback Processor
  const handleMockRequest = (url: string, init?: RequestInit): Response => {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;
    const method = (init?.method || "GET").toUpperCase();

    // Parse Body
    let body: any = {};
    if (init?.body && typeof init.body === "string") {
      try {
        body = JSON.parse(init.body);
      } catch (e) {
        // ignore
      }
    }

    // Settings API
    if (path === "/api/system/settings") {
      const sortStudyHours = (hoursList: string[]) => {
        const getStartMinutes = (hStr: string) => {
          const match = hStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
          if (!match) return 9999;
          let hr = parseInt(match[1], 10);
          const min = parseInt(match[2], 10);
          const ampm = match[3] || "PM";
          if (ampm.toUpperCase() === "PM" && hr < 12) hr += 12;
          if (ampm.toUpperCase() === "AM" && hr === 12) hr = 0;
          return hr * 60 + min;
        };
        return [...hoursList].sort((a, b) => getStartMinutes(a) - getStartMinutes(b));
      };

      if (method === "GET") {
        const settings = JSON.parse(localStorage.getItem("plc_local_settings") || "{}");
        let modified = false;
        if (settings.courseOptions && Array.isArray(settings.courseOptions)) {
          const duplicatesToRemove = ["Word", "Excel", "Photoshop"];
          const cleaned = settings.courseOptions.filter((co: string) => !duplicatesToRemove.includes(co));
          if (cleaned.length !== settings.courseOptions.length) {
            settings.courseOptions = cleaned;
            modified = true;
          }
        }
        if (settings.hoursOptions && Array.isArray(settings.hoursOptions)) {
          const sorted = sortStudyHours(settings.hoursOptions);
          if (JSON.stringify(sorted) !== JSON.stringify(settings.hoursOptions)) {
            settings.hoursOptions = sorted;
            modified = true;
          }
        }
        if (modified) {
          localStorage.setItem("plc_local_settings", JSON.stringify(settings));
        }
        return createMockResponse(settings);
      } else {
        const currentSettings = JSON.parse(localStorage.getItem("plc_local_settings") || "{}");
        const newSettings = { ...currentSettings, ...body };
        if (newSettings.courseOptions && Array.isArray(newSettings.courseOptions)) {
          const duplicatesToRemove = ["Word", "Excel", "Photoshop"];
          newSettings.courseOptions = newSettings.courseOptions.filter((co: string) => !duplicatesToRemove.includes(co));
        }
        if (newSettings.hoursOptions && Array.isArray(newSettings.hoursOptions)) {
          newSettings.hoursOptions = sortStudyHours(newSettings.hoursOptions);
        }
        localStorage.setItem("plc_local_settings", JSON.stringify(newSettings));
        return createMockResponse(newSettings);
      }
    }

    // Students API
    if (path === "/api/students") {
      const students = JSON.parse(localStorage.getItem("plc_local_students") || "[]");
      if (method === "GET") {
        return createMockResponse({ students });
      } else if (method === "POST") {
        const newStudent = {
          ...body,
          id: body.id || String(Date.now()),
          studentId: body.studentId || `STU-LOCAL-${Math.floor(Math.random() * 900) + 100}`
        };
        const updated = [...students, newStudent];
        localStorage.setItem("plc_local_students", JSON.stringify(updated));
        return createMockResponse({ student: newStudent });
      }
    }

    if (path.startsWith("/api/students/")) {
      const id = path.replace("/api/students/", "");
      const students = JSON.parse(localStorage.getItem("plc_local_students") || "[]");

      if (method === "PUT") {
        const updated = students.map((s: any) => (s.id === id ? { ...s, ...body } : s));
        localStorage.setItem("plc_local_students", JSON.stringify(updated));
        const student = updated.find((s: any) => s.id === id);
        return createMockResponse({ student });
      } else if (method === "DELETE") {
        const filtered = students.filter((s: any) => s.id !== id);
        localStorage.setItem("plc_local_students", JSON.stringify(filtered));
        return createMockResponse({ success: true });
      }
    }

    // Teachers API
    if (path === "/api/teachers") {
      const teachers = JSON.parse(localStorage.getItem("plc_local_teachers") || "[]");
      if (method === "GET") {
        return createMockResponse({ teachers });
      } else if (method === "POST") {
        const newTeacher = {
          ...body,
          id: body.id || String(Date.now()),
          teacherId: body.teacherId || `TCH-LOCAL-${Math.floor(Math.random() * 900) + 100}`
        };
        const updated = [...teachers, newTeacher];
        localStorage.setItem("plc_local_teachers", JSON.stringify(updated));
        return createMockResponse({ teacher: newTeacher });
      }
    }

    if (path.startsWith("/api/teachers/")) {
      const id = path.replace("/api/teachers/", "");
      const teachers = JSON.parse(localStorage.getItem("plc_local_teachers") || "[]");

      if (method === "PUT") {
        const updated = teachers.map((t: any) => (t.id === id ? { ...t, ...body } : t));
        localStorage.setItem("plc_local_teachers", JSON.stringify(updated));
        const teacher = updated.find((t: any) => t.id === id);
        return createMockResponse({ teacher });
      } else if (method === "DELETE") {
        const filtered = teachers.filter((t: any) => t.id !== id);
        localStorage.setItem("plc_local_teachers", JSON.stringify(filtered));
        return createMockResponse({ success: true });
      }
    }

    // Finance Transactions
    if (path === "/api/finance/transactions") {
      const transactions = JSON.parse(localStorage.getItem("plc_local_transactions") || "[]");
      if (method === "GET") {
        return createMockResponse({ transactions });
      } else if (method === "POST") {
        const newTx = {
          ...body,
          id: body.id || String(Date.now()),
          createdAt: new Date().toISOString()
        };
        const updated = [newTx, ...transactions];
        localStorage.setItem("plc_local_transactions", JSON.stringify(updated));

        // Side effect: update student paid and due balances if tx references a student
        if (body.studentId) {
          const students = JSON.parse(localStorage.getItem("plc_local_students") || "[]");
          const updatedStudents = students.map((s: any) => {
            if (s.studentId === body.studentId || s.id === body.studentId) {
              const amountPaid = Number(body.amount) || 0;
              const newPaid = (s.paid || 0) + amountPaid;
              const newDue = Math.max(0, (s.fee || 0) - newPaid);
              return { ...s, paid: newPaid, due: newDue };
            }
            return s;
          });
          localStorage.setItem("plc_local_students", JSON.stringify(updatedStudents));
        }

        return createMockResponse(newTx);
      }
    }

    // Salaries API
    if (path === "/api/finance/salaries") {
      const salaries = JSON.parse(localStorage.getItem("plc_local_salaries") || "[]");
      if (method === "GET") {
        return createMockResponse({ salaries });
      } else if (method === "POST") {
        const newSal = {
          ...body,
          id: body.id || String(Date.now()),
          createdAt: new Date().toISOString()
        };
        const updated = [newSal, ...salaries];
        localStorage.setItem("plc_local_salaries", JSON.stringify(updated));
        return createMockResponse(newSal);
      }
    }

    // Attendance API
    if (path === "/api/attendance") {
      const attendance = JSON.parse(localStorage.getItem("plc_local_attendance") || "[]");
      if (method === "GET") {
        const date = parsedUrl.searchParams.get("date") || new Date().toISOString().split("T")[0];
        const filtered = attendance.filter((a: any) => a.date === date);
        return createMockResponse(filtered);
      } else if (method === "POST") {
        // Bulk save
        const records = Array.isArray(body) ? body : [body];
        let current = [...attendance];
        records.forEach((record: any) => {
          current = current.filter(
            (a: any) => !(a.studentId === record.studentId && a.date === record.date)
          );
          current.push({
            ...record,
            id: record.id || String(Math.random())
          });
        });
        localStorage.setItem("plc_local_attendance", JSON.stringify(current));
        return createMockResponse({ success: true });
      }
    }

    if (path === "/api/attendance/scan") {
      const attendance = JSON.parse(localStorage.getItem("plc_local_attendance") || "[]");
      const students = JSON.parse(localStorage.getItem("plc_local_students") || "[]");
      const { studentId, status, date, remarks } = body;

      const student = students.find((s: any) => s.studentId === studentId || s.id === studentId);
      if (!student) {
        return createMockResponse({ message: "Student not found" }, 404);
      }

      const cleanDate = date || new Date().toISOString().split("T")[0];
      const record = {
        id: String(Date.now()),
        studentId: student.id,
        studentName: student.nameKh,
        course: student.course,
        date: cleanDate,
        status: status || "PRESENT",
        remarks: remarks || "QR Fast Scan",
        time: new Date().toLocaleTimeString()
      };

      const updated = attendance.filter(
        (a: any) => !(a.studentId === student.id && a.date === cleanDate)
      );
      updated.push(record);
      localStorage.setItem("plc_local_attendance", JSON.stringify(updated));

      return createMockResponse({ success: true, record });
    }

    // Exams API
    if (path === "/api/exams") {
      const exams = JSON.parse(localStorage.getItem("plc_local_exams") || "[]");
      if (method === "GET") {
        return createMockResponse(exams);
      } else if (method === "POST") {
        const newExam = {
          ...body,
          id: body.id || String(Date.now()),
          questions: body.questions || []
        };
        const updated = [...exams, newExam];
        localStorage.setItem("plc_local_exams", JSON.stringify(updated));
        return createMockResponse(newExam);
      }
    }

    if (path.startsWith("/api/exams/")) {
      const parts = path.split("/");
      const examId = parts[3];
      const exams = JSON.parse(localStorage.getItem("plc_local_exams") || "[]");
      const exam = exams.find((e: any) => e.id === examId);

      if (method === "PUT" && parts.length === 4) {
        const updatedExam = { ...(exam || {}), ...body, id: examId };
        const updatedExams = exams.map((e: any) => e.id === examId ? updatedExam : e);
        if (!exams.some((e: any) => e.id === examId)) {
          updatedExams.push(updatedExam);
        }
        localStorage.setItem("plc_local_exams", JSON.stringify(updatedExams));
        return createMockResponse(updatedExam);
      }

      if (method === "DELETE" && parts.length === 4) {
        const filteredExams = exams.filter((e: any) => e.id !== examId);
        localStorage.setItem("plc_local_exams", JSON.stringify(filteredExams));
        return createMockResponse({ success: true });
      }

      if (parts[4] === "submit" && method === "POST") {
        const { answers, studentName, studentId } = body || {};
        let score = 0;
        const questions = exam?.questions || [];
        let questionPointsSum = 0;
        for (const q of questions) {
          questionPointsSum += q.points || 1;
          if (answers && answers[q.id] === q.answer) {
            score += q.points || 1;
          }
        }
        const totalPoints = exam?.targetMaxScore || exam?.totalPoints || (questionPointsSum > 0 ? questionPointsSum : 100);
        const submission = {
          id: "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
          examId,
          studentId: studentId || "practice-mode",
          studentName: studentName || "សិស្ស / Student",
          score,
          totalPoints,
          answers: typeof answers === "string" ? answers : JSON.stringify(answers || {}),
          submittedAt: new Date().toISOString()
        };

        const existingSubs = JSON.parse(localStorage.getItem("plc_local_exam_submissions") || "[]");
        existingSubs.unshift(submission);
        localStorage.setItem("plc_local_exam_submissions", JSON.stringify(existingSubs));

        return createMockResponse(submission);
      }

      if ((parts[4] === "results" || parts[4] === "submissions") && method === "GET") {
        const allSubs = JSON.parse(localStorage.getItem("plc_local_exam_submissions") || "[]");
        const examSubs = allSubs.filter((s: any) => s.examId === examId);
        return createMockResponse(examSubs);
      }

      if (parts[4] === "results" && parts[5] && method === "DELETE") {
        const subId = parts[5];
        const allSubs = JSON.parse(localStorage.getItem("plc_local_exam_submissions") || "[]");
        const filtered = allSubs.filter((s: any) => s.id !== subId);
        localStorage.setItem("plc_local_exam_submissions", JSON.stringify(filtered));
        return createMockResponse({ success: true });
      }

      if (exam) {
        return createMockResponse(exam);
      }
      return createMockResponse({ error: "Exam not found" }, 404);
    }

    // Authenticated User API
    if (path === "/api/auth/me") {
      const savedUser = localStorage.getItem("plc_user");
      let userObj = null;
      if (savedUser && savedUser !== "undefined") {
        try {
          userObj = JSON.parse(savedUser);
        } catch (e) {
          userObj = null;
        }
      }
      if (!userObj) {
        userObj = {
          id: "demo-admin",
          email: "admin@plc.com",
          name: "Admin (Offline Demo)",
          role: "ADMIN"
        };
      }
      return createMockResponse({ user: userObj });
    }

    // Courses API
    if (path === "/api/courses") {
      const courses = [
        { id: "c1", title: "Microsoft Office Word", activeStudents: 5 },
        { id: "c2", title: "Adobe Photoshop", activeStudents: 1 },
        { id: "c3", title: "Graphic Design", activeStudents: 0 }
      ];
      return createMockResponse(courses);
    }

    // Announcements API
    if (path === "/api/announcements") {
      const announcements = JSON.parse(localStorage.getItem("plc_local_announcements") || "[]");
      if (method === "GET") {
        return createMockResponse(announcements);
      } else if (method === "POST") {
        const newAnn = {
          ...body,
          id: String(Date.now()),
          createdAt: new Date().toISOString()
        };
        const updated = [newAnn, ...announcements];
        localStorage.setItem("plc_local_announcements", JSON.stringify(updated));
        return createMockResponse(newAnn);
      }
    }

    // Telegram API
    if (path === "/api/telegram/send") {
      return createMockResponse({ success: true, message: "Telegram sent successfully (Mock)" });
    }

    // Default presets and counts
    if (path === "/api/mysql/db-counts") {
      const s = JSON.parse(localStorage.getItem("plc_local_students") || "[]");
      const t = JSON.parse(localStorage.getItem("plc_local_teachers") || "[]");
      const tx = JSON.parse(localStorage.getItem("plc_local_transactions") || "[]");
      return createMockResponse({
        counts: {
          Student: s.length,
          Teacher: t.length,
          Transaction: tx.length,
          User: 3,
          Exam: 2
        }
      });
    }

    // Files and Settings Fallback
    if (path === "/api/system/files") {
      return createMockResponse([]);
    }

    // Mock Upload
    if (path === "/api/upload") {
      return createMockResponse({
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"
      });
    }

    // Mock Auth Login
    if (path === "/api/auth/login" && method === "POST") {
      const email = (body.email || "").trim().toLowerCase();
      const password = (body.password || "").trim();
      
      const isAdmin = (email === "admin" && (password === "admin123" || password === "admin")) || email === "admin@plc.com";
      const isTeacher = (email === "teacher" && password === "teacher123") || email === "teacher@plc.com";
      
      if (isAdmin || isTeacher) {
        const role = isAdmin ? "ADMIN" : "TEACHER";
        const user = {
          id: isAdmin ? "demo-admin" : "demo-teacher",
          email: isAdmin ? "admin@plc.com" : "teacher@plc.com",
          name: isAdmin ? "Admin (Demo Mode)" : "Teacher (Demo Mode)",
          role: role
        };
        // Persist session user info so auth/me works too
        localStorage.setItem("plc_user", JSON.stringify(user));
        return createMockResponse({
          token: "demo_auth_token_bypass",
          user
        });
      } else {
        return createMockResponse({ message: "ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ! (Incorrect username or password!)" }, 401);
      }
    }

    // Fallback default response
    return createMockResponse({ success: true, message: "Offline mock response" });
  };

  // Proxy the window.fetch API
  const proxiedFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlString = typeof input === "string" ? input : (input as any).url || String(input);

    // Only intercept requests directed to /api/
    if (urlString.includes("/api/")) {
      try {
        const response = await originalFetch(input, init);
        
        // If the server returns a 404/500 page or returns an HTML document (typical for static routing fallback on missing API endpoints)
        const contentType = response.headers.get("content-type") || "";
        if (!response.ok && (response.status === 404 || response.status === 500 || contentType.includes("text/html"))) {
          console.debug(`[API Interceptor] Route '${urlString}' returned non-JSON / error state. Diverting to robust localStorage fallback...`);
          return handleMockRequest(urlString, init);
        }
        
        return response;
      } catch (networkError) {
        // Network errors (e.g. server completely unreachable/offline)
        console.debug(`[API Interceptor] Network failure fetching '${urlString}'. Diverting to robust offline localStorage fallback...`, networkError);
        return handleMockRequest(urlString, init);
      }
    }

    // Leave non-api requests completely untouched
    return originalFetch(input, init);
  };

  try {
    Object.defineProperty(window, "fetch", {
      value: proxiedFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    console.warn("[API Interceptor] Object.defineProperty failed, attempting direct property assignment...", e);
    try {
      (window as any).fetch = proxiedFetch;
    } catch (err) {
      console.error("[API Interceptor] Critical: Failed to intercept window.fetch", err);
    }
  }
}
