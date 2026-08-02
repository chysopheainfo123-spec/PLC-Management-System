export const NEW_ROUTES = `
  // ==========================================
  // COURSES API
  // ==========================================
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await prisma.course.findMany({
        include: { teacher: true, enrollments: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const course = await prisma.course.create({ data: req.body });
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", async (req, res) => {
    try {
      const course = await prisma.course.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      await prisma.course.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // ==========================================
  // ENROLLMENTS API
  // ==========================================
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await prisma.enrollment.findMany({
        include: { student: true, course: true },
        orderBy: { date: 'desc' }
      });
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollment = await prisma.enrollment.create({ data: req.body });
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create enrollment" });
    }
  });
  
  app.delete("/api/enrollments/:id", async (req, res) => {
    try {
      await prisma.enrollment.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete enrollment" });
    }
  });

  // ==========================================
  // LEAVE REQUESTS API
  // ==========================================
  app.get("/api/leave-requests", async (req, res) => {
    try {
      const requests = await prisma.leaveRequest.findMany({
        include: { user: true, teacher: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave requests" });
    }
  });

  app.post("/api/leave-requests", async (req, res) => {
    try {
      const request = await prisma.leaveRequest.create({ data: req.body });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to create leave request" });
    }
  });

  app.put("/api/leave-requests/:id", async (req, res) => {
    try {
      const request = await prisma.leaveRequest.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to update leave request" });
    }
  });

  // ==========================================
  // LIBRARY (BOOKS) API
  // ==========================================
  app.get("/api/books", async (req, res) => {
    try {
      const books = await prisma.book.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const book = await prisma.book.create({ data: req.body });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to create book" });
    }
  });

  app.put("/api/books/:id", async (req, res) => {
    try {
      const book = await prisma.book.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to update book" });
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    try {
      await prisma.book.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete book" });
    }
  });

  // ==========================================
  // BOOK BORROWINGS API
  // ==========================================
  app.get("/api/book-borrowings", async (req, res) => {
    try {
      const borrowings = await prisma.bookBorrowing.findMany({
        include: { book: true, student: true },
        orderBy: { borrowDate: 'desc' }
      });
      res.json(borrowings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch book borrowings" });
    }
  });

  app.post("/api/book-borrowings", async (req, res) => {
    try {
      const { bookId } = req.body;
      const book = await prisma.book.findUnique({ where: { id: bookId } });
      if (!book || book.availableCopies <= 0) {
        return res.status(400).json({ error: "Book not available" });
      }

      const borrowing = await prisma.bookBorrowing.create({ data: req.body });
      await prisma.book.update({
        where: { id: bookId },
        data: { availableCopies: book.availableCopies - 1 }
      });
      res.json(borrowing);
    } catch (error) {
      res.status(500).json({ error: "Failed to create borrowing" });
    }
  });

  app.put("/api/book-borrowings/:id/return", async (req, res) => {
    try {
      const borrowing = await prisma.bookBorrowing.update({
        where: { id: req.params.id },
        data: { status: "RETURNED", returnDate: new Date() }
      });
      
      const book = await prisma.book.findUnique({ where: { id: borrowing.bookId } });
      if (book) {
        await prisma.book.update({
          where: { id: book.id },
          data: { availableCopies: book.availableCopies + 1 }
        });
      }
      res.json(borrowing);
    } catch (error) {
      res.status(500).json({ error: "Failed to return book" });
    }
  });

  // ==========================================
  // ANNOUNCEMENTS API
  // ==========================================
  app.post("/api/announcements", async (req, res) => {
    try {
      const announcement = await prisma.announcement.create({ data: req.body });
      
      // Here you would integrate with Telegram Bot API to send the bulk message
      // depending on the target (e.g. finding all students with telegram IDs)

      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to send announcement" });
    }
  });
`;
