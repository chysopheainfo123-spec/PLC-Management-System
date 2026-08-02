import React, { useState, useEffect } from 'react';
import { Book, Plus, Search, BookMarked, RefreshCw, Trash, Edit, X, BookOpen, Calendar, User, Tag, Layers, Minus, Check, ChevronDown, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';

export default function LibraryTab({ uiLang }: { uiLang?: string } = {}) {
  const [localLang, setLocalLang] = useState(uiLang || localStorage.getItem("plc_lang") || "kh");

  useEffect(() => {
    if (uiLang) {
      setLocalLang(uiLang);
    }
  }, [uiLang]);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setLocalLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  const localIdt = (kh: string, en?: string) => {
    if (localLang === "en") return en || kh;
    return kh;
  };

  const [books, setBooks] = useState<any[]>([]);
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeSubTab, setActiveSubTab] = useState<'books' | 'borrowings'>('books');
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [isEditBookDialogOpen, setIsEditBookDialogOpen] = useState(false);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  
  const [bookData, setBookData] = useState({
    title: '', author: '', isbn: '', category: '', totalCopies: 1, availableCopies: 1
  });
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const [borrowData, setBorrowData] = useState({
    bookId: '', studentId: '', dueDate: ''
  });

  const [bookToDelete, setBookToDelete] = useState<any | null>(null);

  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false);
  const [isBookSelectOpen, setIsBookSelectOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const [booksRes, borrowingsRes, studentsRes] = await Promise.all([
        fetch('/api/books', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/book-borrowings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (booksRes.ok) { const b = await booksRes.json(); setBooks(Array.isArray(b) ? b : []); }
      if (borrowingsRes.ok) { const bw = await borrowingsRes.json(); setBorrowings(Array.isArray(bw) ? bw : []); }
      if (studentsRes.ok) { 
        const s = await studentsRes.json(); 
        const studentList = s.students || s;
        setStudents(Array.isArray(studentList) ? studentList : []); 
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      if (isEditBookDialogOpen && editingBookId) {
        // Find existing book to calculate availableCopies change
        const existingBook = books.find(b => b.id === editingBookId);
        const difference = bookData.totalCopies - (existingBook?.totalCopies || 0);
        const newAvailableCopies = Math.max(0, (existingBook?.availableCopies || 0) + difference);

        const payload = { ...bookData, availableCopies: newAvailableCopies };
        const res = await fetch(`/api/books/${editingBookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setIsEditBookDialogOpen(false);
          setEditingBookId(null);
          setBookData({ title: '', author: '', isbn: '', category: '', totalCopies: 1, availableCopies: 1 });
          fetchData();
        }
      } else {
        const payload = { ...bookData, availableCopies: bookData.totalCopies };
        const res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setIsAddBookDialogOpen(false);
          setBookData({ title: '', author: '', isbn: '', category: '', totalCopies: 1, availableCopies: 1 });
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const openEditBookDialog = (book: any) => {
    setBookData({
      title: book.title,
      author: book.author || '',
      isbn: book.isbn || '',
      category: book.category || '',
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies
    });
    setEditingBookId(book.id);
    setIsEditBookDialogOpen(true);
  };

  const handleDeleteBookClick = (book: any) => {
    setBookToDelete(book);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const res = await fetch(`/api/books/${bookToDelete.id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBookToDelete(null);
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const payload = {
        ...borrowData,
        dueDate: new Date(borrowData.dueDate).toISOString()
      };
      const res = await fetch('/api/book-borrowings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsBorrowDialogOpen(false);
        setBorrowData({ bookId: '', studentId: '', dueDate: '' });
        fetchData();
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

  const handleReturnBook = async (id: string) => {
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const res = await fetch(`/api/book-borrowings/${id}/return`, { 
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  const openBorrowDialog = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const year = nextWeek.getFullYear();
    const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
    const day = String(nextWeek.getDate()).padStart(2, '0');
    const defaultDueDate = `${year}-${month}-${day}`;
    
    setBorrowData({
      bookId: '',
      studentId: '',
      dueDate: defaultDueDate
    });
    setIsBorrowDialogOpen(true);
  };

  const closeBorrowDialog = () => {
    setIsBorrowDialogOpen(false);
    setBorrowData({ bookId: '', studentId: '', dueDate: '' });
    setStudentSearchTerm('');
    setBookSearchTerm('');
    setIsStudentSelectOpen(false);
    setIsBookSelectOpen(false);
  };

  const closeBookDialog = () => {
    setIsAddBookDialogOpen(false);
    setIsEditBookDialogOpen(false);
    setEditingBookId(null);
    setBookData({ title: '', author: '', isbn: '', category: '', totalCopies: 1, availableCopies: 1 });
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBorrowings = borrowings.filter(b => 
    b.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.student?.nameKh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.student?.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 font-sans">
            {localIdt("បណ្ណាល័យសាលា (Library)", "School Library (Library)")}
          </h2>
          <p className="text-xs sm:text-xs text-slate-500 mt-1">
            {localIdt("គ្រប់គ្រងសៀវភៅ និងការខ្ចីសងរបស់សិស្ស", "Manage books and student borrowing records")}
          </p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button 
            onClick={openBorrowDialog} 
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 border-2 border-orange-500 text-orange-600 bg-orange-50/50 rounded-xl hover:bg-orange-100 hover:border-orange-600 transition-all shadow-sm font-bold tracking-wide cursor-pointer"
          >
            <BookMarked className="w-4 h-4 mr-2" /> {localIdt("កត់ត្រាការខ្ចី", "Record Borrowing")}
          </button>
          <button 
            onClick={() => {
              setEditingBookId(null);
              setBookData({ title: '', author: '', isbn: '', category: '', totalCopies: 1, availableCopies: 1 });
              setIsAddBookDialogOpen(true);
            }} 
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-md font-bold tracking-wide shadow-orange-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" /> {localIdt("បញ្ចូលសៀវភៅថ្មី", "Add New Book")}
          </button>
        </div>
      </div>

      <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveSubTab('books')}
          className={`px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${activeSubTab === 'books' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {localIdt("បញ្ជីសៀវភៅទាំងអស់", "All Books List")}
        </button>
        <button 
          onClick={() => setActiveSubTab('borrowings')}
          className={`px-5 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${activeSubTab === 'borrowings' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {localIdt("បញ្ជីកំពុងខ្ចីសង", "Borrow & Return List")}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 relative">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <h3 className="text-lg font-bold flex items-center gap-2.5 text-slate-800">
            {activeSubTab === 'books' ? (
              <><Book className="w-5 h-5 text-orange-500" /> {localIdt("សៀវភៅក្នុងស្តុក", "Books in Stock")}</>
            ) : (
              <><BookMarked className="w-5 h-5 text-orange-500" /> {localIdt("កំណត់ត្រាការខ្ចីសៀវភៅ", "Book Borrowing Records")}</>
            )}
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={activeSubTab === 'books' ? localIdt("ស្វែងរកចំណងជើងសៀវភៅ...", "Search book title...") : localIdt("ស្វែងរកសៀវភៅ ឬឈ្មោះសិស្ស...", "Search book or student name...")}
              className="pl-10 pr-9 py-2 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm font-semibold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                title={localIdt("លុបការស្វែងរក", "Clear search")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto border-t border-slate-100 scrollbar-none">
          {activeSubTab === 'books' ? (
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-left text-[13px] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-2.5">{localIdt("ចំណងជើងសៀវភៅ", "Book Title")}</th>
                  <th className="px-6 py-2.5">{localIdt("អ្នកនិពន្ធ", "Author")}</th>
                  <th className="px-6 py-2.5">{localIdt("ប្រភេទ", "Category")}</th>
                  <th className="px-6 py-2.5 text-center">{localIdt("ចំនួនសរុប", "Total Copies")}</th>
                  <th className="px-6 py-2.5 text-center">{localIdt("អាចខ្ចីបាន", "Available")}</th>
                  <th className="px-6 py-2.5 text-right">{localIdt("សកម្មភាព", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500 font-bold">{localIdt("កំពុងទាញយកទិន្នន័យ...", "Loading library data...")}</td></tr>
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                          <Book className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold text-base">{localIdt("មិនមានទិន្នន័យសៀវភៅទេ", "No books found")}</p>
                        <button onClick={() => setIsAddBookDialogOpen(true)} className="mt-4 px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer">
                          <Plus className="w-4 h-4" /> {localIdt("បញ្ចូលសៀវភៅថ្មី", "Add New Book")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-6 py-2.5 font-bold text-slate-800">{book.title}</td>
                      <td className="px-6 py-2.5 text-slate-600 font-medium">{book.author || '-'}</td>
                      <td className="px-6 py-2.5 text-slate-600">
                        {book.category ? (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">{book.category}</span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-2.5 text-center font-bold text-slate-700">{book.totalCopies}</td>
                      <td className="px-6 py-2.5 text-center">
                        <span className={`text-xs font-bold ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {book.availableCopies}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEditBookDialog(book)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title={localIdt("កែប្រែ", "Edit")}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteBookClick(book)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title={localIdt("លុប", "Delete")}>
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-left text-[13px] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-2.5">{localIdt("ឈ្មោះសិស្ស", "Student Name")}</th>
                  <th className="px-6 py-2.5">{localIdt("សៀវភៅ", "Book")}</th>
                  <th className="px-6 py-2.5">{localIdt("ថ្ងៃខ្ចី", "Borrow Date")}</th>
                  <th className="px-6 py-2.5">{localIdt("ថ្ងៃកំណត់សង", "Due Date")}</th>
                  <th className="px-6 py-2.5 text-center">{localIdt("ស្ថានភាព", "Status")}</th>
                  <th className="px-6 py-2.5 text-right">{localIdt("សកម្មភាព", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500 font-bold">{localIdt("កំពុងទាញយកទិន្នន័យ...", "Loading borrowings data...")}</td></tr>
                ) : filteredBorrowings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                          <BookMarked className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold text-base">{localIdt("មិនទាន់មានការខ្ចីសៀវភៅទេ", "No borrowings recorded yet")}</p>
                        <p className="text-sm text-slate-400">{localIdt("សិស្សអាចចាប់ផ្តើមខ្ចីសៀវភៅពីបណ្ណាល័យបាន។", "Students can start borrowing books from the library.")}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBorrowings.map((b) => (
                    <tr key={b.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-6 py-2.5 font-bold text-slate-800">{b.student?.nameKh || b.student?.nameEn}</td>
                      <td className="px-6 py-2.5 font-medium text-slate-700">{b.book?.title}</td>
                      <td className="px-6 py-2.5 text-slate-600 font-medium">{new Date(b.borrowDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2.5 text-slate-600 font-medium">{new Date(b.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2.5 text-center">
                        <span className={`text-xs font-bold ${b.status === 'RETURNED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {b.status === 'RETURNED' ? localIdt("បានសងរួច", "Returned") : localIdt("កំពុងខ្ចី", "Borrowed")}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 text-right">
                        {b.status !== 'RETURNED' && (
                          <button onClick={() => handleReturnBook(b.id)} className="flex items-center ml-auto text-emerald-600 hover:text-emerald-700 text-xs font-bold transition-colors cursor-pointer">
                            <RefreshCw className="w-3 h-3 mr-1.5 animate-spin-hover" /> {localIdt("ទទួលសង", "Return Book")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      <AnimatePresence>
        {(isAddBookDialogOpen || isEditBookDialogOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={closeBookDialog}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-white rounded-[28px] shadow-2xl border border-slate-100/80 max-w-lg w-full relative z-10 overflow-hidden"
            >
              <div className="p-6 pb-2 flex justify-between items-start bg-white">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 bg-orange-50 border border-orange-100/60 text-orange-500 rounded-2xl shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-black text-slate-800 font-sans leading-tight">
                      {isEditBookDialogOpen ? localIdt("កែប្រែព័ត៌មានសៀវភៅ", "Edit Book Details") : localIdt("បញ្ចូលសៀវភៅថ្មី", "Add New Book")}
                    </h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      {localIdt("បំពេញព័ត៌មានលម្អិតរបស់សៀវភៅទៅក្នុងបណ្ណាល័យ", "Fill in the book details to register in the library")}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={closeBookDialog}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBookSubmit} className="p-6 pt-4 space-y-5">
                {/* Title input */}
                <div className="space-y-1.5">
                  <label className="text-[13.5px] font-black text-slate-700 flex items-center gap-1">
                    {localIdt("ចំណងជើងសៀវភៅ", "Book Title")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                      <Book className="w-4 h-4" />
                    </div>
                    <input 
                      required 
                      value={bookData.title} 
                      onChange={e => setBookData({...bookData, title: e.target.value})} 
                      placeholder={localIdt("ខ. កម្មវិធី Microsoft Word 2019", "e.g. Microsoft Word 2019 Guide")} 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-2xl font-bold text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-normal focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Author input */}
                  <div className="space-y-1.5">
                    <label className="text-[13.5px] font-black text-slate-700 flex items-center gap-1">
                      {localIdt("អ្នកនិពន្ធ", "Author")}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                        <User className="w-4 h-4" />
                      </div>
                      <input 
                        value={bookData.author} 
                        onChange={e => setBookData({...bookData, author: e.target.value})} 
                        placeholder={localIdt("ខ. John Doe", "e.g. John Doe")} 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-2xl font-bold text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-normal focus:outline-none" 
                      />
                    </div>
                  </div>

                  {/* Category input */}
                  <div className="space-y-1.5">
                    <label className="text-[13.5px] font-black text-slate-700 flex items-center gap-1">
                      {localIdt("ប្រភេទសៀវភៅ", "Book Category")}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                        <Tag className="w-4 h-4" />
                      </div>
                      <input 
                        value={bookData.category} 
                        onChange={e => setBookData({...bookData, category: e.target.value})} 
                        placeholder={localIdt("ខ. Computer", "e.g. Computer Science")} 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-2xl font-bold text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-normal focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity selector (Beautiful UX with stepper buttons) */}
                <div className="space-y-1.5">
                  <label className="text-[13.5px] font-black text-slate-700 flex items-center gap-1">
                    {localIdt("ចំនួនសៀវភៅសរុប (ក្បាល)", "Total Book Copies")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3 bg-slate-50/50 hover:bg-slate-50/80 focus-within:bg-white border border-slate-200 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 rounded-2xl p-2 transition-all">
                    <div className="text-slate-400 pl-2 pointer-events-none">
                      <Layers className="w-4 h-4" />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setBookData({...bookData, totalCopies: Math.max(isEditBookDialogOpen ? 0 : 1, bookData.totalCopies - 1)})}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all shadow-xs font-black cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input 
                      required 
                      type="number" 
                      min={isEditBookDialogOpen ? "0" : "1"} 
                      value={bookData.totalCopies} 
                      onChange={e => setBookData({...bookData, totalCopies: Math.max(isEditBookDialogOpen ? 0 : 1, parseInt(e.target.value) || 0)})} 
                      className="flex-1 text-center bg-transparent border-none text-lg font-black text-slate-800 focus:outline-none focus:ring-0" 
                    />
                    <button 
                      type="button"
                      onClick={() => setBookData({...bookData, totalCopies: bookData.totalCopies + 1})}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all shadow-xs font-black cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-5 border-t border-slate-100/80">
                  <button 
                    type="button" 
                    onClick={closeBookDialog} 
                    className="px-6 py-3.5 border border-slate-200 text-slate-600 font-extrabold rounded-2xl hover:bg-slate-50 active:scale-95 transition-colors cursor-pointer"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-lg font-bold leading-none">✓</span>
                    {isEditBookDialogOpen ? localIdt("រក្សាទុកការកែប្រែ", "Save Changes") : localIdt("រក្សាទុកសៀវភៅ", "Save Book")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Borrow Book Modal */}
      <AnimatePresence>
        {isBorrowDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={closeBorrowDialog}
            />
            
            {/* Click away backdrop for active dropdown selections */}
            {(isStudentSelectOpen || isBookSelectOpen) && (
              <div 
                className="fixed inset-0 z-20 cursor-default" 
                onClick={() => {
                  setIsStudentSelectOpen(false);
                  setIsBookSelectOpen(false);
                }}
              />
            )}

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-white rounded-[28px] shadow-2xl border border-slate-100/80 max-w-lg w-full relative z-30"
            >
              <div className="p-6 pb-2 flex justify-between items-start bg-white rounded-t-[28px]">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 bg-orange-50 border border-orange-100/60 text-orange-500 rounded-2xl shadow-xs">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-black text-slate-800 font-sans leading-tight">
                      {localIdt("កត់ត្រាការខ្ចីសៀវភៅ", "Record Book Borrowing")}
                    </h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      {localIdt("ចុះឈ្មោះសិស្សខ្ចីសៀវភៅពីបណ្ណាល័យសាលា", "Register a student to borrow a book from the school library")}
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={closeBorrowDialog}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBorrowSubmit} className="p-6 pt-4 space-y-5 relative z-10">
                {/* Student selection */}
                <div className={`space-y-1.5 relative ${isStudentSelectOpen ? 'z-50' : 'z-10'}`}>
                  <label className="text-[13.5px] font-black text-slate-700 flex items-center gap-1">
                    {localIdt("សិស្សអ្នកខ្ចី", "Borrower Student")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10">
                      <User className="w-4 h-4" />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsStudentSelectOpen(!isStudentSelectOpen);
                        setIsBookSelectOpen(false);
                      }}
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl font-bold text-left transition-all focus:outline-none flex items-center justify-between cursor-pointer"
                    >
                      <span className={borrowData.studentId ? 'text-slate-800' : 'text-slate-400 font-normal'}>
                        {borrowData.studentId 
                          ? students.find(s => s.id === borrowData.studentId)
                            ? `${students.find(s => s.id === borrowData.studentId).nameKh || students.find(s => s.id === borrowData.studentId).nameEn} (${students.find(s => s.id === borrowData.studentId).studentId})`
                            : localIdt("-- សូមជ្រើសរើសសិស្ស --", "-- Please select student --")
                          : localIdt("-- សូមជ្រើសរើសសិស្ស --", "-- Please select student --")}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-450 transition-transform duration-200" style={{ transform: isStudentSelectOpen ? 'rotate(180deg)' : 'none' }} />
                    </button>
                    
                    {isStudentSelectOpen && (
                      <div className="absolute z-30 mt-1.5 w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[250px]">
                        <div className="p-2 border-b border-slate-100 bg-slate-50">
                          <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder={localIdt("ស្វែងរកឈ្មោះសិស្ស ឬអត្តសញ្ញាណ...", "Search student name or ID...")}
                              className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-orange-500 rounded-xl text-sm focus:outline-none bg-white font-semibold text-slate-700"
                              value={studentSearchTerm}
                              onChange={e => setStudentSearchTerm(e.target.value)}
                              onClick={e => e.stopPropagation()}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1 py-1 divide-y divide-slate-50 scrollbar-none">
                          {students.filter(s => {
                            if (s.status !== 'STUDYING') return false;
                            const search = studentSearchTerm.toLowerCase();
                            return (s.nameKh && s.nameKh.toLowerCase().includes(search)) ||
                                   (s.nameEn && s.nameEn.toLowerCase().includes(search)) ||
                                   (s.studentId && s.studentId.toLowerCase().includes(search));
                          }).length === 0 ? (
                            <div className="px-4 py-3.5 text-sm text-slate-400 text-center font-medium">{localIdt("រកមិនឃើញសិស្សឡើយ", "No student found")}</div>
                          ) : (
                            students.filter(s => {
                              if (s.status !== 'STUDYING') return false;
                              const search = studentSearchTerm.toLowerCase();
                              return (s.nameKh && s.nameKh.toLowerCase().includes(search)) ||
                                     (s.nameEn && s.nameEn.toLowerCase().includes(search)) ||
                                     (s.studentId && s.studentId.toLowerCase().includes(search));
                            }).map(s => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  setBorrowData({ ...borrowData, studentId: s.id });
                                  setIsStudentSelectOpen(false);
                                  setStudentSearchTerm('');
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-orange-50 text-sm font-bold text-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                              >
                                <span>{s.nameKh || s.nameEn}</span>
                                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{s.studentId}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Book selection */}
                <div className={`space-y-1.5 relative ${isBookSelectOpen ? 'z-50' : 'z-10'}`}>
                  <label className="text-[13.5px] font-black text-slate-700 flex items-center gap-1">
                    {localIdt("សៀវភៅដែលខ្ចី", "Borrowed Book")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10">
                      <BookOpen className="w-4 h-4" />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsBookSelectOpen(!isBookSelectOpen);
                        setIsStudentSelectOpen(false);
                      }}
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl font-bold text-left transition-all focus:outline-none flex items-center justify-between cursor-pointer"
                    >
                      <span className={borrowData.bookId ? 'text-slate-800' : 'text-slate-400 font-normal'}>
                        {borrowData.bookId 
                          ? books.find(b => b.id === borrowData.bookId)
                            ? `${books.find(b => b.id === borrowData.bookId).title} (${localIdt(`អាចខ្ចីបាន ${books.find(b => b.id === borrowData.bookId).availableCopies} ក្បាល`, `Available: ${books.find(b => b.id === borrowData.bookId).availableCopies} copies`)})`
                            : localIdt("-- សូមជ្រើសរើសសៀវភៅ --", "-- Please select book --")
                          : localIdt("-- សូមជ្រើសរើសសៀវភៅ --", "-- Please select book --")}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-455 transition-transform duration-200" style={{ transform: isBookSelectOpen ? 'rotate(180deg)' : 'none' }} />
                    </button>
                    
                    {isBookSelectOpen && (
                      <div className="absolute z-30 mt-1.5 w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[250px]">
                        <div className="p-2 border-b border-slate-100 bg-slate-50">
                          <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder={localIdt("ស្វែងរកចំណងជើងសៀវភៅ ឬប្រភេទ...", "Search book title or category...")}
                              className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-orange-500 rounded-xl text-sm focus:outline-none bg-white font-semibold text-slate-700"
                              value={bookSearchTerm}
                              onChange={e => setBookSearchTerm(e.target.value)}
                              onClick={e => e.stopPropagation()}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1 py-1 divide-y divide-slate-50 scrollbar-none">
                          {books.filter(b => b.availableCopies > 0).filter(b => {
                            const search = bookSearchTerm.toLowerCase();
                            return b.title.toLowerCase().includes(search) || 
                                   (b.category && b.category.toLowerCase().includes(search));
                          }).length === 0 ? (
                            <div className="px-4 py-3.5 text-sm text-slate-400 text-center font-medium">{localIdt("រកមិនឃើញសៀវភៅឡើយ", "No books found")}</div>
                          ) : (
                            books.filter(b => b.availableCopies > 0).filter(b => {
                              const search = bookSearchTerm.toLowerCase();
                              return b.title.toLowerCase().includes(search) || 
                                     (b.category && b.category.toLowerCase().includes(search));
                            }).map(b => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => {
                                  setBorrowData({ ...borrowData, bookId: b.id });
                                  setIsBookSelectOpen(false);
                                  setBookSearchTerm('');
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-orange-50 text-sm font-bold text-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                              >
                                <span>{b.title}</span>
                                <span className="text-xs font-bold text-emerald-600">{localIdt(`អាចខ្ចី ${b.availableCopies}`, `Available ${b.availableCopies}`)}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return due date */}
                <div className="space-y-1.5">
                  <label className="text-[13.5px] font-black text-slate-700 flex items-center gap-1">
                    {localIdt("ថ្ងៃកំណត់ត្រូវសង", "Return Due Date")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input 
                      required 
                      type="date" 
                      value={borrowData.dueDate} 
                      onChange={e => setBorrowData({...borrowData, dueDate: e.target.value})} 
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-2xl font-bold text-slate-800 transition-all focus:outline-none cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-5 border-t border-slate-100/80">
                  <button 
                    type="button" 
                    onClick={closeBorrowDialog} 
                    className="px-6 py-3.5 border border-slate-200 text-slate-600 font-extrabold rounded-2xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="text-lg font-bold leading-none">✓</span>
                    {localIdt("រក្សាទុកការកំណត់ត្រា", "Save Record")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Book Confirmation Modal */}
      <AnimatePresence>
        {bookToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setBookToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{localIdt("បញ្ជាក់ការលុបសៀវភៅ", "Confirm Book Deletion")}</h3>
              <p className="text-slate-500 font-bold mb-6">
                {localIdt(`តើអ្នកពិតជាចង់លុបសៀវភៅ " ${bookToDelete.title} " នេះមែនទេ? ការលុបនេះមិនអាចយកមកវិញបានឡើយ។`, `Are you sure you want to delete book " ${bookToDelete.title} "? This process cannot be undone.`)}
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  type="button" 
                  onClick={() => setBookToDelete(null)} 
                  className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-600 font-extrabold rounded-2xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                >
                  {localIdt("បោះបង់", "Cancel")}
                </button>
                <button 
                  type="button" 
                  onClick={confirmDeleteBook} 
                  className="flex-1 px-6 py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-500/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash className="w-4 h-4" /> {localIdt("លុបសៀវភៅ", "Delete Book")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
