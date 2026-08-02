import React, { useState, useEffect, useRef } from "react";
import { BookOpen, ChevronDown, Plus, Search, Edit2, Trash2, Check, X, Sparkles, RotateCcw } from "lucide-react";
import { SubjectOption, INITIAL_STANDARD_SUBJECTS, getAllSubjects, saveAllSubjects } from "../lib/examUtils";

interface SubjectDropdownProps {
  value: string;
  onChange: (val: string) => void;
  lang?: "kh" | "en" | "zh";
  placeholder?: string;
  allowManage?: boolean;
}

export default function SubjectDropdown({ value, onChange, allowManage = true }: SubjectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [subjectsList, setSubjectsList] = useState<SubjectOption[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for add/edit
  const [newNameKh, setNewNameKh] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [newColor, setNewColor] = useState("blue");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubjectsList(getAllSubjects());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
        setEditingId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedObj = subjectsList.find(s => s.id === value || s.nameKh === value || s.nameEn === value) || {
    id: value || "ចំណេះដឹងទូទៅ",
    nameKh: value || "ចំណេះដឹងទូទៅ",
    nameEn: "General Knowledge",
    badgeBg: "bg-blue-100/70",
    badgeText: "text-blue-700",
    badgeBorder: "border-transparent",
    iconName: "BookOpen"
  };

  const filtered = subjectsList.filter(s =>
    s.nameKh.toLowerCase().includes(search.toLowerCase()) ||
    s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameKh.trim()) return;

    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-100/70", text: "text-blue-700" },
      emerald: { bg: "bg-emerald-100/70", text: "text-emerald-700" },
      indigo: { bg: "bg-blue-100/70", text: "text-blue-700" },
      amber: { bg: "bg-amber-100/70", text: "text-amber-800" },
      rose: { bg: "bg-rose-100/70", text: "text-rose-700" },
      cyan: { bg: "bg-cyan-100/70", text: "text-cyan-700" },
    };

    const selColor = colorMap[newColor] || colorMap.blue;

    if (editingId) {
      // Edit existing subject
      const updated = subjectsList.map(s => {
        if (s.id === editingId) {
          return {
            ...s,
            nameKh: newNameKh.trim(),
            nameEn: newNameEn.trim() || newNameKh.trim(),
            badgeBg: selColor.bg,
            badgeText: selColor.text,
            badgeBorder: "border-transparent",
          };
        }
        return s;
      });
      setSubjectsList(updated);
      saveAllSubjects(updated);
      if (value === editingId || value === selectedObj.nameKh) {
        onChange(newNameKh.trim());
      }
    } else {
      // Add new subject
      const newSubObj: SubjectOption = {
        id: newNameKh.trim(),
        nameKh: newNameKh.trim(),
        nameEn: newNameEn.trim() || newNameKh.trim(),
        badgeBg: selColor.bg,
        badgeText: selColor.text,
        badgeBorder: "border-transparent",
        iconName: "BookOpen"
      };
      const updated = [...subjectsList, newSubObj];
      setSubjectsList(updated);
      saveAllSubjects(updated);
      onChange(newSubObj.id);
    }

    setNewNameKh("");
    setNewNameEn("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDeleteSubject = (idToDelete: string) => {
    if (subjectsList.length <= 1) return;
    const updated = subjectsList.filter(s => s.id !== idToDelete && s.nameKh !== idToDelete);
    setSubjectsList(updated);
    saveAllSubjects(updated);
    if (value === idToDelete || selectedObj.id === idToDelete) {
      onChange(updated[0]?.nameKh || "ចំណេះដឹងទូទៅ");
    }
  };

  const handleResetDefaults = () => {
    setSubjectsList(INITIAL_STANDARD_SUBJECTS);
    saveAllSubjects(INITIAL_STANDARD_SUBJECTS);
  };

  const startEdit = (s: SubjectOption) => {
    setEditingId(s.id);
    setNewNameKh(s.nameKh);
    setNewNameEn(s.nameEn);
    setIsAdding(true);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button - Clean display without box border around text */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 text-sm flex items-center justify-between cursor-pointer shadow-3xs"
      >
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1.5 whitespace-nowrap ${selectedObj.badgeBg} ${selectedObj.badgeText}`}>
            <BookOpen className="w-3.5 h-3.5 inline shrink-0" />
            <span className="whitespace-nowrap">{selectedObj.nameKh}</span>
          </span>
          {selectedObj.nameEn && selectedObj.nameEn !== selectedObj.nameKh && (
            <span className="text-slate-400 text-xs font-medium truncate hidden xl:inline">
              ({selectedObj.nameEn})
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-1.5 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-[280px] sm:w-[320px] max-w-[90vw] min-w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header Search & Actions */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/60 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ស្វែងរកមុខវិជ្ជា..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            {allowManage && !isAdding && (
              <button
                type="button"
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                  setNewNameKh("");
                  setNewNameEn("");
                }}
                className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100/80 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-blue-200/60 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">បន្ថែមមុខវិជ្ជា/មុខជំនាញថ្មី</span>
              </button>
            )}
          </div>

          {/* Add / Edit Inline Form */}
          {isAdding && (
            <form onSubmit={handleSaveSubject} className="p-3 bg-amber-50/60 border-b border-amber-200/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{editingId ? "កែប្រែមុខវិជ្ជា" : "បន្ថែមមុខវិជ្ជា/មុខជំនាញថ្មី"}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-md hover:bg-amber-100/50"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={newNameKh}
                onChange={e => setNewNameKh(e.target.value)}
                placeholder="ឈ្មោះមុខវិជ្ជា (ជាភាសាខ្មែរ)..."
                required
                className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/20"
              />

              <input
                type="text"
                value={newNameEn}
                onChange={e => setNewNameEn(e.target.value)}
                placeholder="English Name (Optional)..."
                className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/20"
              />

              {/* Color picker */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">ពណ៌កាត៖</span>
                {["blue", "emerald", "indigo", "amber", "rose", "cyan"].map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setNewColor(col)}
                    className={`w-5 h-5 rounded-full border cursor-pointer transition-transform ${
                      col === "blue" ? "bg-blue-500" :
                      col === "emerald" ? "bg-emerald-500" :
                      col === "indigo" ? "bg-blue-500" :
                      col === "amber" ? "bg-amber-500" :
                      col === "rose" ? "bg-rose-500" : "bg-cyan-500"
                    } ${newColor === col ? "scale-125 ring-2 ring-offset-1 ring-amber-500" : "opacity-80"}`}
                  />
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer flex items-center gap-1 shadow-3xs"
                >
                  <Check className="w-3 h-3" />
                  <span>{editingId ? "រក្សាទុក" : "បន្ថែម"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Smooth Scrollable List Container */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs font-bold text-slate-400">
                រកមិនឃើញមុខវិជ្ជា
              </div>
            ) : (
              filtered.map(s => {
                const isSelected = value === s.id || value === s.nameKh;

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      onChange(s.id);
                      setIsOpen(false);
                    }}
                    className={`px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group gap-2 ${
                      isSelected ? "bg-blue-50/50 font-bold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md whitespace-nowrap shrink-0 ${s.badgeBg} ${s.badgeText}`}>
                        {s.nameKh}
                      </span>
                      <span className="text-slate-400 text-xs font-normal truncate whitespace-nowrap">
                        ({s.nameEn})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {allowManage && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(s);
                            }}
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="កែប្រែ"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubject(s.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="លុប"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 ml-1 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info & Reset */}
          <div className="p-2.5 flex items-center justify-between bg-slate-50 text-[11px] font-bold text-slate-500 border-t border-slate-100 px-3.5">
            <span className="whitespace-nowrap">{subjectsList.length} មុខវិជ្ជាមានក្នុងប្រព័ន្ធ</span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors"
              title="កំណត់ដូចដើមវិញ"
            >
              <RotateCcw className="w-3 h-3 shrink-0" />
              <span>កំណត់ដូចដើម</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

