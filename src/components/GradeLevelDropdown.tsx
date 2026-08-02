import React, { useState, useEffect, useRef } from "react";
import { Award, ChevronDown, Check, Search, Plus, Edit2, Trash2, X, Sparkles, RotateCcw } from "lucide-react";
import { GradeLevelOption, INITIAL_GRADE_LEVELS, getAllGradeLevels, saveAllGradeLevels } from "../lib/examUtils";

interface GradeLevelDropdownProps {
  value: string;
  onChange: (val: string) => void;
  allowManage?: boolean;
}

export default function GradeLevelDropdown({ value, onChange, allowManage = true }: GradeLevelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [gradeLevelsList, setGradeLevelsList] = useState<GradeLevelOption[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for add/edit
  const [newNameKh, setNewNameKh] = useState("");
  const [newNameEn, setNewNameEn] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGradeLevelsList(getAllGradeLevels());
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

  const selectedObj = gradeLevelsList.find(g => g.id === value || g.nameKh === value) || {
    id: value || "ទូទៅ / General",
    nameKh: value || "ទូទៅ (គ្រប់កម្រិត)",
    nameEn: "General / All Levels"
  };

  const filtered = gradeLevelsList.filter(g =>
    g.nameKh.toLowerCase().includes(search.toLowerCase()) ||
    g.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    g.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameKh.trim()) return;

    if (editingId) {
      // Edit existing
      const updated = gradeLevelsList.map(g => {
        if (g.id === editingId) {
          return {
            ...g,
            nameKh: newNameKh.trim(),
            nameEn: newNameEn.trim() || newNameKh.trim(),
          };
        }
        return g;
      });
      setGradeLevelsList(updated);
      saveAllGradeLevels(updated);
      if (value === editingId || value === selectedObj.nameKh) {
        onChange(newNameKh.trim());
      }
    } else {
      // Add new
      const newGradeObj: GradeLevelOption = {
        id: newNameKh.trim(),
        nameKh: newNameKh.trim(),
        nameEn: newNameEn.trim() || newNameKh.trim(),
      };
      const updated = [...gradeLevelsList, newGradeObj];
      setGradeLevelsList(updated);
      saveAllGradeLevels(updated);
      onChange(newGradeObj.id);
    }

    setNewNameKh("");
    setNewNameEn("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDeleteGrade = (idToDelete: string) => {
    if (gradeLevelsList.length <= 1) return;
    const updated = gradeLevelsList.filter(g => g.id !== idToDelete && g.nameKh !== idToDelete);
    setGradeLevelsList(updated);
    saveAllGradeLevels(updated);
    if (value === idToDelete || selectedObj.id === idToDelete) {
      onChange(updated[0]?.nameKh || "ទូទៅ / General");
    }
  };

  const handleResetDefaults = () => {
    setGradeLevelsList(INITIAL_GRADE_LEVELS);
    saveAllGradeLevels(INITIAL_GRADE_LEVELS);
  };

  const startEdit = (g: GradeLevelOption) => {
    setEditingId(g.id);
    setNewNameKh(g.nameKh);
    setNewNameEn(g.nameEn);
    setIsAdding(true);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button - Clean layout without outline border around text */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 text-sm flex items-center justify-between cursor-pointer shadow-3xs"
      >
        <div className="flex items-center gap-2 min-w-0 pr-1">
          <Award className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-bold text-slate-800 text-xs sm:text-sm truncate whitespace-nowrap">
            {selectedObj.nameKh}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-1.5 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-[280px] sm:w-[320px] max-w-[90vw] min-w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header Search & Actions */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/60 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ស្វែងរកកម្រិតសិក្សា..."
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
                <span className="whitespace-nowrap">បន្ថែមកម្រិតសិក្សា/ថ្នាក់ថ្មី</span>
              </button>
            )}
          </div>

          {/* Add / Edit Inline Form */}
          {isAdding && (
            <form onSubmit={handleSaveGrade} className="p-3 bg-blue-50/60 border-b border-blue-200/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="whitespace-nowrap">{editingId ? "កែប្រែកម្រិតសិក្សា" : "បន្ថែមកម្រិតសិក្សា/ថ្នាក់ថ្មី"}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-md hover:bg-blue-100/50"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={newNameKh}
                onChange={e => setNewNameKh(e.target.value)}
                placeholder="ឈ្មោះកម្រិត (ជាភាសាខ្មែរ ឧ. ថ្នាក់ទី៥)..."
                required
                className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                type="text"
                value={newNameEn}
                onChange={e => setNewNameEn(e.target.value)}
                placeholder="English Name (Optional)..."
                className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer flex items-center gap-1 shadow-3xs whitespace-nowrap"
                >
                  <Check className="w-3 h-3 shrink-0" />
                  <span>{editingId ? "រក្សាទុក" : "បន្ថែម"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Smooth Scrollable List Container */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs font-bold text-slate-400">
                រកមិនឃើញកម្រិតសិក្សា
              </div>
            ) : (
              filtered.map(g => {
                const isSelected = value === g.id || value === g.nameKh;

                return (
                  <div
                    key={g.id}
                    onClick={() => {
                      onChange(g.id);
                      setIsOpen(false);
                    }}
                    className={`px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group gap-2 ${
                      isSelected ? "bg-blue-50/50 font-bold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-800 truncate whitespace-nowrap">
                        {g.nameKh}
                      </span>
                      {g.nameEn && g.nameEn !== g.nameKh && (
                        <span className="text-slate-400 text-xs font-normal truncate whitespace-nowrap">
                          ({g.nameEn})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {allowManage && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(g);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="កែប្រែ"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGrade(g.id);
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
            <span className="whitespace-nowrap">{gradeLevelsList.length} កម្រិតសិក្សាមានក្នុងប្រព័ន្ធ</span>
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

