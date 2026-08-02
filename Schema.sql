-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "telegramId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "firstNameKh" TEXT,
    "lastNameKh" TEXT,
    "firstNameEn" TEXT,
    "lastNameEn" TEXT,
    "nameKh" TEXT,
    "nameEn" TEXT,
    "gender" TEXT NOT NULL,
    "course" TEXT,
    "level" TEXT,
    "status" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "shift" TEXT,
    "fee" REAL,
    "paid" REAL,
    "due" REAL,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "telegramConnected" BOOLEAN DEFAULT false,
    "dob" TEXT,
    "pob" TEXT,
    "fullFee" REAL,
    "discount" REAL,
    "hours" TEXT,
    "dateOfBirth" DATETIME,
    "photoUrl" TEXT,
    "parentTelegramId" TEXT,
    "phoneNumber" TEXT,
    "grade" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "firstNameKh" TEXT,
    "lastNameKh" TEXT,
    "firstNameEn" TEXT,
    "lastNameEn" TEXT,
    "nameKh" TEXT,
    "nameEn" TEXT,
    "gender" TEXT NOT NULL,
    "specialty" TEXT,
    "phone" TEXT,
    "dob" TEXT,
    "pob" TEXT,
    "joinDate" TEXT,
    "leaveDate" TEXT,
    "experienceDays" TEXT,
    "salary" REAL,
    "paymentStatus" TEXT,
    "status" TEXT,
    "notes" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "photoUrl" TEXT,
    "telegramId" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PRESENT',
    "date" DATETIME NOT NULL,
    "reason" TEXT,
    "recordedById" TEXT NOT NULL,
    "telegramNotificationSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attendance_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeacherAttendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PRESENT',
    "date" DATETIME NOT NULL,
    "reason" TEXT,
    "telegramNotificationSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeacherAttendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "amountDue" DECIMAL NOT NULL,
    "amountPaid" DECIMAL NOT NULL DEFAULT 0.00,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentDate" DATETIME,
    "paymentMethod" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalaryPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "payPeriod" TEXT NOT NULL,
    "baseSalary" DECIMAL NOT NULL,
    "bonus" DECIMAL NOT NULL DEFAULT 0.00,
    "deduction" DECIMAL NOT NULL DEFAULT 0.00,
    "totalPaid" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentDate" DATETIME,
    "invoiceNumber" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SalaryPayment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CertificateTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "bgImageUrl" TEXT NOT NULL,
    "contentXml" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificateNumber" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradeTitle" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    CONSTRAINT "Certificate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CertificateTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Certificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameKh" TEXT NOT NULL,
    "nameEn" TEXT,
    "descriptionKh" TEXT,
    "descriptionEn" TEXT,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL NOT NULL DEFAULT 0.00,
    "location" TEXT,
    "personInCharge" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ល្អឥតខ្ចោះ',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "date" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "rank" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Score_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Timetable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Timetable_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL DEFAULT 0.00,
    "duration" TEXT,
    "hours" TEXT,
    "teacherId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "teacherId" TEXT,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LeaveRequest_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeaveRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "isbn" TEXT,
    "category" TEXT,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "availableCopies" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BookBorrowing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "borrowDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "returnDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'BORROWED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookBorrowing_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookBorrowing_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Announcement_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_teacherId_key" ON "Teacher"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_date_key" ON "Attendance"("studentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherAttendance_teacherId_date_key" ON "TeacherAttendance"("teacherId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_studentId_idx" ON "Invoice"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryPayment_invoiceNumber_key" ON "SalaryPayment"("invoiceNumber");

-- CreateIndex
CREATE INDEX "SalaryPayment_teacherId_idx" ON "SalaryPayment"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certificate_studentId_idx" ON "Certificate"("studentId");

-- CreateIndex
CREATE INDEX "Certificate_templateId_idx" ON "Certificate"("templateId");

-- CreateIndex
CREATE INDEX "Score_studentId_idx" ON "Score"("studentId");

-- CreateIndex
CREATE INDEX "Timetable_teacherId_idx" ON "Timetable"("teacherId");

-- CreateIndex
CREATE INDEX "Course_teacherId_idx" ON "Course"("teacherId");

-- CreateIndex
CREATE INDEX "Enrollment_studentId_idx" ON "Enrollment"("studentId");

-- CreateIndex
CREATE INDEX "Enrollment_courseId_idx" ON "Enrollment"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_courseId_key" ON "Enrollment"("studentId", "courseId");

-- CreateIndex
CREATE INDEX "LeaveRequest_userId_idx" ON "LeaveRequest"("userId");

-- CreateIndex
CREATE INDEX "LeaveRequest_teacherId_idx" ON "LeaveRequest"("teacherId");

-- CreateIndex
CREATE INDEX "BookBorrowing_bookId_idx" ON "BookBorrowing"("bookId");

-- CreateIndex
CREATE INDEX "BookBorrowing_studentId_idx" ON "BookBorrowing"("studentId");

-- CreateIndex
CREATE INDEX "Announcement_sentBy_idx" ON "Announcement"("sentBy");

